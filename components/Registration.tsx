
import React, { useState } from 'react';
import CameraView from './CameraView';
import { UserProfile } from '../types';
// Fix: Added missing Camera import
import { User, Trash2, CheckCircle, Camera } from 'lucide-react';

interface RegistrationProps {
  users: UserProfile[];
  onUpdateUser: (id: string, name: string, photo: string | null) => void;
}

const Registration: React.FC<RegistrationProps> = ({ users, onUpdateUser }) => {
  const [activeUserIndex, setActiveUserIndex] = useState<number | null>(null);

  const handleCapture = (base64: string) => {
    if (activeUserIndex !== null) {
      onUpdateUser(users[activeUserIndex].id, users[activeUserIndex].name, base64);
      setActiveUserIndex(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Configuration des Accès</h2>
        <p className="text-gray-600 mt-2">Enregistrez les deux personnes autorisées à accéder au système.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {users.map((user, index) => (
          <div key={user.id} className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all ${activeUserIndex === index ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-gray-100'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${user.photoBase64 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Personne {index + 1}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{user.photoBase64 ? 'Inscrit' : 'Non configuré'}</p>
                </div>
              </div>
              {user.photoBase64 && (
                <button 
                  onClick={() => onUpdateUser(user.id, user.name, null)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <input 
              type="text"
              value={user.name}
              onChange={(e) => onUpdateUser(user.id, e.target.value, user.photoBase64)}
              placeholder="Nom de la personne..."
              className="w-full mb-6 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />

            {user.photoBase64 ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100">
                <img src={user.photoBase64} alt={user.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                   <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Photo validée
                   </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setActiveUserIndex(index)}
                className="w-full py-12 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-indigo-500"
              >
                <div className="p-4 bg-gray-50 rounded-full">
                  <Camera className="w-8 h-8" />
                </div>
                <span className="font-semibold">Prendre une photo</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {activeUserIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-indigo-900 bg-opacity-95 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Cadrage du visage</h3>
              <button onClick={() => setActiveUserIndex(null)} className="text-gray-400 hover:text-gray-600">
                Fermer
              </button>
            </div>
            <p className="text-gray-600 mb-6">Centrez le visage de <strong>{users[activeUserIndex].name || `Personne ${activeUserIndex + 1}`}</strong> dans le cadre.</p>
            <CameraView onCapture={handleCapture} showCaptureButton={true} />
            <div className="mt-8 text-center text-sm text-gray-400 italic">
              Les photos sont stockées localement sur votre session pour cette démonstration.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
