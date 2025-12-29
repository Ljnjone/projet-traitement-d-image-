
import React from 'react';
import { View, UserProfile } from '../types';
import { ArrowRight, CheckCircle, AlertCircle, Camera } from 'lucide-react';

interface DashboardProps {
  onViewChange: (view: View) => void;
  users: UserProfile[];
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange, users }) => {
  const registeredCount = users.filter(u => u.photoBase64 !== null).length;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Tableau de Bord</h2>
        <p className="text-gray-600">Projet de reconnaissance faciale pour accès sécurisé - M2 Imagine.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Utilisateurs Configurés</div>
          <div className="text-3xl font-bold text-indigo-600">{registeredCount} / 2</div>
          <div className="mt-4 flex items-center text-xs text-gray-400">
            {registeredCount === 2 ? <CheckCircle className="w-4 h-4 text-green-500 mr-1" /> : <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />}
            {registeredCount === 2 ? 'Prêt pour la détection' : 'Configuration requise'}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Méthode Utilisée</div>
          <div className="text-lg font-bold text-gray-800">CNN (Gemini Vision)</div>
          <div className="mt-4 text-xs text-gray-400">Réseau de neurones multimodal</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Statut Caméra</div>
          <div className="text-lg font-bold text-green-600 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Connectée
          </div>
          <div className="mt-4 text-xs text-gray-400">Smartphone as Web-cam</div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 mb-10">
        <h3 className="text-xl font-bold text-indigo-900 mb-4">Démarrage rapide</h3>
        <p className="text-indigo-800 mb-6">
          Pour valider le projet, vous devez d'abord configurer les deux personnes autorisées dans l'onglet Configuration, puis lancer la démo live pour tester la précision.
        </p>
        <button 
          onClick={() => onViewChange(View.REGISTRATION)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-all shadow-md"
        >
          Configurer les accès
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-2">Objectif Académique</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Optimiser le rappel (recall) et la précision dans un environnement contrôlé. Comparaison entre méthodes d'extraction de caractéristiques classiques et Deep Learning.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-2">Dispositif</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Utilisation d'un téléphone portable comme capteur principal. L'interface React permet une intégration fluide et un retour visuel immédiat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
