
import React, { useState, useRef } from 'react';
import CameraView from './CameraView';
import { UserProfile } from '../types';
import { User, Trash2, CheckCircle, Camera, Plus, X, Upload, Database } from 'lucide-react';

interface RegistrationProps {
  users: UserProfile[];
  onAddPhoto: (userId: string, photo: string) => void;
  onRemovePhoto: (userId: string, photoIndex: number) => void;
  onUpdateName: (userId: string, name: string) => void;
}

const Registration: React.FC<RegistrationProps> = ({ users, onAddPhoto, onRemovePhoto, onUpdateName }) => {
  const [activeUserIndex, setActiveUserIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_PHOTOS = 10;

  const handleCapture = (base64: string) => {
    if (activeUserIndex !== null) {
      onAddPhoto(users[activeUserIndex].id, base64);
      if (users[activeUserIndex].photosBase64.length + 1 >= MAX_PHOTOS) {
        setActiveUserIndex(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, userId: string) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddPhoto(userId, reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <header className="mb-10 text-center">
        <div className="inline-flex p-3 bg-indigo-100 rounded-2xl mb-4">
          <Database className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-800">Gestion de la Base de Données</h2>
        <p className="text-gray-600 mt-2">Importez vos photos d'entraînement ou utilisez la webcam pour chaque profil.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {users.map((user, index) => (
          <div key={user.id} className={`bg-white rounded-[2rem] p-8 shadow-sm border-2 transition-all ${activeUserIndex === index ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-gray-100'}`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
              <div className="flex items-center gap-5">
                <div className={`p-5 rounded-2xl ${user.photosBase64.length > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <input 
                    type="text"
                    value={user.name}
                    onChange={(e) => onUpdateName(user.id, e.target.value)}
                    className="text-2xl font-black text-gray-800 bg-transparent border-b-2 border-dashed border-gray-200 focus:border-indigo-500 focus:outline-none w-full"
                  />
                  <p className="text-sm text-gray-400 mt-1 font-medium">{user.photosBase64.length} échantillons dans la base</p>
                </div>
              </div>
              
              <div className="flex gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => setActiveUserIndex(index)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  Webcam
                </button>
                <label className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 cursor-pointer transition-all">
                  <Upload className="w-5 h-5" />
                  Importer
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, user.id)}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {user.photosBase64.map((photo, pIdx) => (
                <div key={pIdx} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-50 bg-gray-50">
                  <img src={photo} alt="Sample" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => onRemovePhoto(user.id, pIdx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {user.photosBase64.length === 0 && (
                <div className="col-span-full py-12 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-300">
                  <Database className="w-12 h-12 mb-2 opacity-20" />
                  <span className="font-bold uppercase tracking-widest text-xs">Base vide</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeUserIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-gray-900 bg-opacity-90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-[3rem] p-10 shadow-2xl relative">
            <button onClick={() => setActiveUserIndex(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"><X /></button>
            <h3 className="text-2xl font-black text-gray-800 mb-6">Capture pour {users[activeUserIndex].name}</h3>
            <CameraView onCapture={handleCapture} showCaptureButton={true} />
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({length: MAX_PHOTOS}).map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < users[activeUserIndex].photosBase64.length ? 'bg-green-500' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
