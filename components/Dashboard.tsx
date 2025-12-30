
import React from 'react';
import { View, UserProfile } from '../types';
import { ArrowRight, CheckCircle, AlertCircle, Camera, BrainCircuit } from 'lucide-react';

interface DashboardProps {
  onViewChange: (view: View) => void;
  users: UserProfile[];
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange, users }) => {
  const fullyConfigured = users.every(u => u.photosBase64.length > 0);
  const totalSamples = users.reduce((acc, u) => acc + u.photosBase64.length, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Tableau de Bord</h2>
        <p className="text-gray-600">Système de reconnaissance biométrique adaptatif - M2 Imagine.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Entraînement</div>
          <div className="text-3xl font-bold text-indigo-600 flex items-baseline gap-1">
            {totalSamples}
            <span className="text-sm font-normal text-gray-400">échantillons</span>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-400">
            {fullyConfigured ? <CheckCircle className="w-4 h-4 text-green-500 mr-1" /> : <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />}
            {fullyConfigured ? 'Base de connaissance prête' : 'Données d\'entraînement requises'}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Moteur d'IA</div>
          <div className="text-lg font-bold text-gray-800">Vision Transformer</div>
          <div className="mt-4 text-xs text-gray-400 flex items-center gap-1">
            <BrainCircuit className="w-3 h-3" /> multi-shot inference
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Mode Actif</div>
          <div className="text-lg font-bold text-green-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Apprentissage Continu
          </div>
          <div className="mt-4 text-xs text-gray-400">Prêt pour capture multi-angles</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 mb-10 text-white shadow-xl shadow-indigo-100">
        <h3 className="text-xl font-bold mb-4">Mode Entraînement Avancé</h3>
        <p className="mb-6 opacity-90">
          Notre système supporte désormais l'apprentissage par l'exemple (Multi-Shot Learning). 
          Plus vous fournissez de photos sous différents angles et éclairages, plus la précision de détection sera élevée. 
          Nous recommandons au moins 3 photos par personne.
        </p>
        <button 
          onClick={() => onViewChange(View.REGISTRATION)}
          className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          Gérer l'entraînement
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-2">Inférence Multi-Images</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Contrairement aux méthodes classiques qui comparent une image à une autre, Gemini analyse le probe par rapport à un cluster de caractéristiques extraites de vos multiples captures.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-2">Robustesse</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            En variant les expressions faciales lors de l'entraînement, vous réduisez les faux rejets dus aux changements d'humeur ou de port d'accessoires (lunettes, etc).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
