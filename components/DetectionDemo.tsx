
import React, { useState, useEffect, useRef } from 'react';
import CameraView from './CameraView';
import { UserProfile, RecognitionResult } from '../types';
import { analyzeFace } from '../services/geminiService';
// Fix: Added missing Scan and CheckCircle imports
import { ShieldCheck, ShieldAlert, Loader2, AlertCircle, Scan, CheckCircle } from 'lucide-react';

interface DetectionDemoProps {
  users: UserProfile[];
}

const DetectionDemo: React.FC<DetectionDemoProps> = ({ users }) => {
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzeTime, setLastAnalyzeTime] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const usersConfigured = users.every(u => u.photoBase64 !== null);

  const startAnalysis = async () => {
    if (isAnalyzing || !usersConfigured) return;

    // We can't easily get the frame from the reusable CameraView without complex refs,
    // so we'll simulate the "Take current frame" part by triggering a capture if we had a proper hook.
    // For this demo, let's add a button to "Scan" to avoid burning API tokens in a loop.
  };

  const handleManualScan = async (base64: string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await analyzeFace(base64, users);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Démonstration Live</h2>
        <p className="text-gray-600 mt-2">Le système analyse le flux vidéo pour identifier les personnes autorisées.</p>
      </header>

      {!usersConfigured ? (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-10 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Configuration Incomplète</h3>
          <p className="text-yellow-700 mb-6">Vous devez enregistrer les 2 personnes autorisées avant de pouvoir tester la détection.</p>
          <div className="flex justify-center gap-4">
            {users.map((u, i) => (
               <div key={u.id} className={`w-3 h-3 rounded-full ${u.photoBase64 ? 'bg-green-500' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 overflow-hidden">
              <CameraView 
                showCaptureButton={true} 
                onCapture={handleManualScan}
                overlay={
                  <div className="absolute inset-0 pointer-events-none">
                     {/* Scanning frame UI */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-white border-opacity-30 rounded-[40px] shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-4">
                           <span className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">Zone de Détection</span>
                        </div>
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-indigo-500 bg-opacity-20 animate-pulse rounded-[40px] flex items-center justify-center">
                             <Loader2 className="w-10 h-10 text-white animate-spin" />
                          </div>
                        )}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-2xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-2xl"></div>
                     </div>
                  </div>
                }
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">Cliquez sur l'icône caméra pour analyser le visage présent</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`rounded-3xl p-6 border-2 transition-all ${
              !result ? 'bg-white border-gray-100' :
              result.identifiedAs === 'unknown' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                Résultat d'Accès
                {result && (result.identifiedAs === 'unknown' ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-green-500" />)}
              </h3>
              
              {!result ? (
                <div className="text-gray-400 text-sm flex flex-col items-center py-8 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <Scan className="w-6 h-6" />
                  </div>
                  En attente d'analyse...
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Identité</div>
                    <div className={`text-xl font-bold ${result.identifiedAs === 'unknown' ? 'text-red-600' : 'text-green-600'}`}>
                      {result.identifiedAs === 'unknown' ? 'INTRU / INCONNU' : result.identifiedAs}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Confiance</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${result.identifiedAs === 'unknown' ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs font-bold mt-1 text-gray-600">{(result.confidence * 100).toFixed(1)}%</div>
                  </div>

                  <div className="bg-white bg-opacity-50 p-3 rounded-xl border border-black border-opacity-5">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Raisonnement IA</div>
                    <p className="text-xs text-gray-700 italic">"{result.reasoning}"</p>
                  </div>

                  <div className={`py-2 px-4 rounded-xl text-center font-bold text-sm ${
                    result.identifiedAs === 'unknown' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                  }`}>
                    {result.identifiedAs === 'unknown' ? 'ACCÈS REFUSÉ' : 'ACCÈS AUTORISÉ'}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Liste de Contrôle</h4>
              <div className="space-y-3">
                 {users.map(u => (
                   <div key={u.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                        {u.photoBase64 && <img src={u.photoBase64} className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{u.name}</span>
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectionDemo;
