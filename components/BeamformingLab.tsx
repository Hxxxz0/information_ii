import React, { useEffect, useRef, useState } from 'react';
import { Camera, Maximize, Activity, Cpu, Wifi } from 'lucide-react';

// Declaration for global MediaPipe libraries loaded via CDN
declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
  }
}

export const BeamformingLab: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [simulationState, setSimulationState] = useState({
    steeringAngle: 0,
    antennaCount: 8,
    gain: 0,
    handDetected: false,
    mode: 'SCANNING'
  });

  // Physics Parameters
  const FREQUENCY = 2; // Visual frequency
  const ELEMENT_SPACING = 20; // Pixels
  
  useEffect(() => {
    let camera: any = null;
    let hands: any = null;

    const onResults = (results: any) => {
      if (!canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      // 1. Draw Background (Cyberpunk style)
      ctx.fillStyle = '#050a10'; // Deep dark blue/black
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=0; i<width; i+=50) { ctx.moveTo(i,0); ctx.lineTo(i,height); }
      for(let i=0; i<height; i+=50) { ctx.moveTo(0,i); ctx.lineTo(width,i); }
      ctx.stroke();

      // 2. Process Hand Logic
      let currentAngle = 0;
      let isFist = false;
      let hasHand = false;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        hasHand = true;
        const landmarks = results.multiHandLandmarks[0];
        
        // --- INTERACTION LOGIC ---
        // X-Axis controls Steering Angle (-60 to 60 degrees usually)
        // MediaPipe x is 0.0 (left) to 1.0 (right). Inverted for mirrored selfie cam usually, 
        // but let's assume raw: x=0.5 is center.
        const handX = 1.0 - landmarks[9].x; // Use middle finger knuckle, flip for mirror effect
        currentAngle = (handX - 0.5) * 160; // Map 0..1 to -80..80 degrees
        
        // Gesture Detection (Simple Heuristic for Fist vs Open)
        // Distance between Wrist(0) and Middle Finger Tip(12)
        const wrist = landmarks[0];
        const tip = landmarks[12];
        const dist = Math.sqrt(Math.pow(wrist.x - tip.x, 2) + Math.pow(wrist.y - tip.y, 2));
        
        // Threshold depends on coordinate space, usually open hand is > 0.3
        isFist = dist < 0.25; 

        // Update React State for UI (throttled/batched effectively by React)
        setSimulationState(prev => ({
            ...prev,
            steeringAngle: Math.round(currentAngle),
            antennaCount: isFist ? 16 : 4, // 16 for sharp beam (fist), 4 for wide (open)
            handDetected: true,
            mode: isFist ? 'PRECISION_LOCK' : 'WIDE_SCAN'
        }));

        // Draw Hand Skeleton (Cyberpunk Style)
        window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {color: '#06b6d4', lineWidth: 2});
        window.drawLandmarks(ctx, landmarks, {color: '#ec4899', lineWidth: 1, radius: 3});
      } else {
        setSimulationState(prev => ({ ...prev, handDetected: false }));
      }

      // 3. PHYSICS SIMULATION: Phased Array Beamforming
      // We visualize the "Radiation Pattern" (Magnitude of Array Factor)
      
      const N = hasHand ? (isFist ? 16 : 2) : 8; // Number of elements
      const d = 0.5; // Spacing in wavelengths (d = lambda/2 standard)
      const k = 2 * Math.PI; // Wavenumber
      const theta0 = (currentAngle * Math.PI) / 180; // Steering angle in radians
      const beta = -k * d * Math.sin(theta0); // Phase shift required

      // Draw Antennas at bottom
      const centerX = width / 2;
      const bottomY = height - 50;
      
      ctx.fillStyle = '#94a3b8';
      for(let i=0; i<N; i++) {
        const x = centerX + (i - (N-1)/2) * ELEMENT_SPACING;
        ctx.fillRect(x - 2, bottomY, 4, 10);
        
        // Phase shift indicator
        const phase = (i * beta) % (2*Math.PI);
        const intensity = (Math.sin(Date.now()/100 - phase) + 1) / 2;
        ctx.fillStyle = `rgba(6, 182, 212, ${intensity})`; // Cyan pulse
        ctx.beginPath();
        ctx.arc(x, bottomY - 5, 3, 0, 2*Math.PI);
        ctx.fill();
      }

      // Draw Radiation Pattern (Polar Plot projected to Cartesian)
      ctx.beginPath();
      ctx.lineWidth = 3;
      // Gradient for beam
      const gradient = ctx.createLinearGradient(centerX, bottomY, centerX + Math.sin(theta0)*400, bottomY - Math.cos(theta0)*400);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0)');
      gradient.addColorStop(1, isFist ? '#ec4899' : '#06b6d4'); // Pink for laser (fist), Cyan for wide
      ctx.strokeStyle = gradient;
      ctx.fillStyle = gradient;

      // Calculate Array Factor for angles -90 to 90
      const radiusScale = height * 0.8;
      
      let startPoint = true;

      // Draw the main lobe and side lobes
      for (let angleDeg = -90; angleDeg <= 90; angleDeg += 1) {
         const theta = (angleDeg * Math.PI) / 180;
         
         // Array Factor Formula: AF = sin(N * psi / 2) / sin(psi / 2)
         // psi = k * d * sin(theta) + beta
         const psi = k * d * Math.sin(theta) + beta;
         
         let AF = Math.abs(Math.sin(N * psi / 2) / (N * Math.sin(psi / 2)));
         
         // Handle singularity at psi = 0 (limit is 1)
         if (Math.abs(psi) < 0.001 || isNaN(AF)) AF = 1;

         // Normalize AF is already 0..1 mostly, but sin(psi/2) can be small
         // Just use normalized AF for visualization
         
         const r = AF * radiusScale;
         const px = centerX + r * Math.sin(theta);
         const py = bottomY - r * Math.cos(theta); // Up is negative Y

         if (startPoint) {
            ctx.moveTo(px, py);
            startPoint = false;
         } else {
            ctx.lineTo(px, py);
         }
      }
      ctx.closePath();
      // Fill with low opacity
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.stroke();

      // Draw Main Beam Ray
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.setLineDash([5, 5]);
      ctx.moveTo(centerX, bottomY);
      ctx.lineTo(centerX + Math.sin(theta0)*radiusScale*1.1, bottomY - Math.cos(theta0)*radiusScale*1.1);
      ctx.stroke();
      ctx.setLineDash([]);

    };

    if (videoRef.current && canvasRef.current) {
      hands = new window.Hands({locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }});
      
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      
      hands.onResults(onResults);

      if (typeof window.Camera === 'undefined') {
          console.error("MediaPipe Camera Utils not loaded");
          return;
      }

      camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && hands) {
             await hands.send({image: videoRef.current});
          }
        },
        width: 640,
        height: 480
      });
      
      camera.start();
    }

    // Cleanup
    return () => {
       if (camera) camera.stop();
       // hands.close() might produce error if async not finished, usually safe to ignore in demo
    };
  }, []); // Run once on mount

  return (
    <div className="w-full h-full relative bg-black font-mono text-cyan-400 overflow-hidden">
      {/* Hidden Video Input for MediaPipe */}
      <video ref={videoRef} className="hidden" playsInline muted></video>
      
      {/* Main Simulation Canvas */}
      <canvas 
         ref={canvasRef} 
         className="w-full h-full block"
         width={1280}
         height={720}
      />

      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 p-6 pointer-events-none w-full h-full flex flex-col justify-between">
         
         {/* Top Bar */}
         <div className="flex justify-between items-start">
            <div className="bg-black/60 border border-cyan-500/30 p-4 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
               <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                  <Wifi className="w-5 h-5 animate-pulse" /> 
                  相控阵模拟
               </h2>
               <div className="space-y-1 text-sm text-cyan-200/80">
                  <div className="flex justify-between gap-8">
                     <span>转向角度 (θ)</span>
                     <span className="font-bold text-white">{simulationState.steeringAngle}°</span>
                  </div>
                  <div className="flex justify-between gap-8">
                     <span>阵元数 (N)</span>
                     <span className={`font-bold ${simulationState.antennaCount > 8 ? 'text-pink-500' : 'text-white'}`}>
                        {simulationState.antennaCount}
                     </span>
                  </div>
                  <div className="flex justify-between gap-8">
                     <span>模式</span>
                     <span className="font-bold text-yellow-400">{simulationState.mode}</span>
                  </div>
               </div>
            </div>

            {/* Camera PIP Placeholder */}
            <div className="w-48 h-36 bg-black/80 border border-cyan-800 rounded-lg overflow-hidden relative">
               <div className="absolute top-2 left-2 text-[10px] bg-red-900/80 text-white px-1 rounded animate-pulse">实时输入</div>
               {/* We could mirror the videoRef here if we removed 'hidden', but drawing landmarks on canvas is cleaner */}
               <div className="w-full h-full flex items-center justify-center text-cyan-900">
                  <Camera className="w-8 h-8 opacity-50" />
               </div>
            </div>
         </div>

         {/* Bottom Control Hint */}
         <div className="flex items-center justify-between">
             <div className="flex gap-4 text-xs text-cyan-600">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 border border-cyan-800 rounded flex items-center justify-center">
                      <span className="block w-2 h-2 bg-cyan-500 rounded-full"></span>
                   </div>
                   <span>左右移动手<br/>控制波束</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 border border-pink-800 rounded flex items-center justify-center">
                      <span className="block w-4 h-4 border-2 border-pink-500 rounded-full"></span>
                   </div>
                   <span>握拳/捏合<br/>N=16 (锁定)</span>
                </div>
             </div>

             <button className="flex items-center gap-2 px-4 py-2 bg-cyan-900/20 hover:bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 transition-all pointer-events-auto">
                <Maximize className="w-4 h-4" /> 全屏
             </button>
         </div>
      </div>

      {/* Startup Overlay if no hand */}
      {!simulationState.handDetected && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
            <div className="text-center animate-bounce">
               <Activity className="w-12 h-12 text-cyan-500 mx-auto mb-2" />
               <p className="text-cyan-400 font-bold bg-black/50 px-4 py-1 rounded">等待手势信号...</p>
            </div>
         </div>
      )}
    </div>
  );
};