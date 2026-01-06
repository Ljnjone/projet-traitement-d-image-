
import React, { useState, useRef, useEffect } from 'react';
import CameraView from './CameraView';
import { UserProfile, RecognitionResult } from '../types';
import { analyzeFace, generateSpeech } from '../services/geminiService';
import { ShieldCheck, ShieldAlert, Loader2, Scan, Volume2, VolumeX, History, Clock, UserX } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  image: string;
  result: RecognitionResult;
}

const DetectionDemo: React.FC<{ users: UserProfile[] }> = ({ users }) => {
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Manual decoding of raw PCM data from Gemini TTS following the provided guidelines
  const decodeAudioData = (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): AudioBuffer => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const playAudio = async (data: Uint8Array) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    
    // Create an audio buffer from the raw bytes returned by the API
    const buffer = decodeAudioData(data, ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  };

  const handleScan = async (base64: string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await analyzeFace(base64, users);
      setResult(res);
      
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        image: base64,
        result: res
      };
      setLogs(prev => [newLog, ...prev].slice(0, 10));

      if (audioEnabled) {
        const msg = res.identifiedAs === 'unknown' ? "Intrus détecté ! Accès refusé." : `Identifié : ${res.identifiedAs}. Accès accordé.`;
        const audio = await generateSpeech(msg);
        if (audio) {
          await playAudio(audio);
        }
      }
    } catch (e) { 
      console.error("Scanning error:", e); 
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Scanner */}
        <div className="lg:col-span-8">
          <div className="bg-gray-900 rounded-[3rem] p-6 shadow-2xl border-4 border-gray-800 relative overflow-hidden">
            <div className="absolute top-10 left-10 z-20 flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-black uppercase tracking-widest bg-black bg-opacity-50 px-3 py-1 rounded-full">Live Security Feed</span>
            </div>
            
            <CameraView 
              showCaptureButton={true} 
              onCapture={handleScan}
              overlay={
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-72 h-96 border-2 rounded-[3rem] transition-all duration-500 ${
                    isAnalyzing ? 'border-yellow-400 border-dashed animate-spin-slow' :
                    !result ? 'border-white border-opacity-20' :
                    result.identifiedAs === 'unknown' ? 'border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.4)]' : 'border-green-500 shadow-[0_0_80px_rgba(34,197,94,0.4)]'
                  }`} />
                </div>
              }
            />

            <div className="mt-6 flex justify-between items-center px-4">
              <div className="flex gap-4">
                <button onClick={() => setAudioEnabled(!audioEnabled)} className="p-3 bg-gray-800 text-gray-400 rounded-2xl hover:text-white transition-colors">
                  {audioEnabled ? <Volume2 /> : <VolumeX />}
                </button>
              </div>
              {isAnalyzing && (
                <div className="flex items-center gap-3 text-yellow-400 font-black italic text-sm animate-pulse">
                  <Loader2 className="animate-spin" />
                  COMPARING WITH DATABASE...
                </div>
              )}
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <div className={`mt-8 p-8 rounded-[2.5rem] flex items-center gap-8 shadow-xl border-4 transform animate-in fade-in slide-in-from-bottom-4 ${
              result.identifiedAs === 'unknown' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}>
              <div className={`p-6 rounded-[2rem] ${result.identifiedAs === 'unknown' ? 'bg-red-600' : 'bg-green-600'}`}>
                {result.identifiedAs === 'unknown' ? <UserX className="w-12 h-12 text-white" /> : <ShieldCheck className="w-12 h-12 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Status:</span>
                  <span className={`text-3xl font-black ${result.identifiedAs === 'unknown' ? 'text-red-700' : 'text-green-700'}`}>
                    {result.identifiedAs === 'unknown' ? 'INTRUS DÉTECTÉ' : `AUTORISÉ : ${result.identifiedAs}`}
                  </span>
                </div>
                <p className="text-gray-600 font-medium italic">"{result.reasoning}"</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-gray-400 mb-1">CONFIANCE</div>
                <div className="text-4xl font-black text-gray-800">{(result.confidence * 100).toFixed(0)}%</div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel: Security Logs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-3 mb-6">
              <History className="w-5 h-5 text-indigo-600" />
              <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm">Security Logs</h3>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {logs.length === 0 && (
                <div className="text-center py-20 text-gray-300">
                  <Scan className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-xs font-bold uppercase">En attente de captures...</p>
                </div>
              )}
              {logs.map(log => (
                <div key={log.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                    <img src={log.image} className="w-full h-full object-cover" alt="Captured" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        log.result.identifiedAs === 'unknown' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {log.result.identifiedAs === 'unknown' ? 'Intrus' : 'Match'}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                        <Clock className="w-3 h-3" />
                        {log.timestamp}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-800 mt-1 truncate">
                      {log.result.identifiedAs === 'unknown' ? 'Inconnu' : log.result.identifiedAs}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionDemo;
