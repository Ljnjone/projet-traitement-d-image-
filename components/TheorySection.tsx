
import React from 'react';

const TheorySection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto prose prose-indigo">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">État de l'Art et Méthodes</h2>
      
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-2xl font-semibold text-indigo-800 mb-4">1. État de l'art</h3>
        <p className="text-gray-700 leading-relaxed">
          La reconnaissance faciale a évolué de simples approches géométriques vers des modèles de Deep Learning massifs. Historiquement, on distingue :
        </p>
        <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-600">
          <li><strong>1990s :</strong> Eigenfaces (PCA) et Fisherfaces (LDA). Approches basées sur l'espace latent.</li>
          <li><strong>2000s :</strong> LBP (Local Binary Patterns) et HOG. Extraction locale robuste aux changements d'illumination.</li>
          <li><strong>2014-Présent :</strong> CNNs (Convolutional Neural Networks) tels que FaceNet, DeepFace et OpenFace.</li>
        </ul>
      </section>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-2xl font-semibold text-indigo-800 mb-4">2. Comparaison des Méthodes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Critère</th>
                <th className="px-6 py-3">Extraction de Caract. (LBP/HOG)</th>
                <th className="px-6 py-3">Réseaux de Neurones (CNN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900 italic">Vitesse</td>
                <td className="px-6 py-4">Très rapide, faible calcul</td>
                <td className="px-6 py-4">Nécessite souvent GPU/NPU</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900 italic">Précision</td>
                <td className="px-6 py-4">Sensible aux angles et lumière</td>
                <td className="px-6 py-4">Excellente (99%+ sur LFW)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900 italic">Entraînement</td>
                <td className="px-6 py-4">Nul ou minimal</td>
                <td className="px-6 py-4">Besoin de millions d'images</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-2xl font-semibold text-indigo-800 mb-4">3. Approche Implémentée</h3>
        <p className="text-gray-700 mb-4">
          Dans cette démonstration, nous utilisons un modèle de vision par transformateurs (Gemini Pro Vision) qui simule le comportement d'un <strong>CNN Siamese</strong> de pointe. 
        </p>
        <p className="text-gray-700">
          Le système compare les vecteurs de caractéristiques (embeddings) des deux visages enregistrés avec le flux vidéo en temps réel pour calculer un score de similarité cosinus.
        </p>
      </section>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-amber-700 font-bold uppercase mb-1">Note de cours</p>
            <p className="text-sm text-amber-700">
              Pour un système mobile, on privilégiera souvent des architectures légères comme <strong>MobileNetV3</strong> avec une perte de type <strong>ArcFace</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheorySection;
