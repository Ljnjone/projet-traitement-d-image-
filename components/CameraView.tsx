
import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

interface CameraViewProps {
  onCapture?: (base64: string) => void;
  overlay?: React.ReactNode;
  showCaptureButton?: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, overlay, showCaptureButton = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: 640, height: 480 } 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && onCapture) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8);
        onCapture(base64);
      }
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden bg-black aspect-video shadow-2xl border-4 border-white">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />
      
      <canvas ref={canvasRef} className="hidden" />

      {overlay && (
        <div className="absolute inset-0 z-10">
          {overlay}
        </div>
      )}

      {showCaptureButton && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <button 
            onClick={handleCapture}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-indigo-200 active:scale-90 transition-transform"
          >
            <Camera className="w-8 h-8 text-indigo-600" />
          </button>
        </div>
      )}
      
      {!stream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 bg-gray-900 bg-opacity-80">
          <RefreshCw className="w-10 h-10 animate-spin text-indigo-400" />
          <p>Initialisation de la caméra...</p>
        </div>
      )}
    </div>
  );
};

export default CameraView;
