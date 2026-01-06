
import React from 'react';
import { Book, Cpu, ShieldCheck, Target, Zap, AlertTriangle } from 'lucide-react';

const TheorySection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto pb-20">
      <header className="mb-12 border-b border-gray-200 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-8 h-8 text-indigo-600" />
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Rapport Technique : État de l'Art</h2>
        </div>
        <p className="text-xl text-gray-600 font-medium">Analyse des mécanismes de reconnaissance faciale et biométrie par Deep Learning.</p>
        <div className="mt-4 flex gap-4">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest">M2 Imagine</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest">Traitement d'Image Avancé</span>
        </div>
      </header>

      <div className="space-y-16">
        {/* Section 1: Evolution Historique */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">1. Évolution des Paradigmes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 leading-relaxed">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-indigo-600 mb-3 uppercase text-sm tracking-wider">L'ère Pré-Deep Learning</h4>
              <p className="mb-4">
                Initialement, la reconnaissance reposait sur des approches géométriques (distances entre yeux, nez, bouche) ou statistiques comme les <strong>Eigenfaces (1991)</strong> basées sur l'Analyse en Composantes Principales (PCA). 
              </p>
              <p>
                L'apparition des descripteurs locaux comme <strong>LBP (Local Binary Patterns)</strong> et <strong>HOG (Histogram of Oriented Gradients)</strong> a permis une meilleure résistance aux changements de luminosité, mais restait limitée face aux variations de pose extrêmes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-indigo-600 mb-3 uppercase text-sm tracking-wider">La Révolution des CNN</h4>
              <p className="mb-4">
                Depuis 2012 (AlexNet), les réseaux de neurones convolutifs (CNN) ont redéfini le domaine. Des modèles comme <strong>DeepFace (Facebook, 2014)</strong> ont atteint des performances proches de l'humain en apprenant directement les descripteurs à partir de millions d'images.
              </p>
              <p>
                Aujourd'hui, les <strong>Vision Transformers (ViT)</strong>, dont s'inspire notre implémentation via Gemini, utilisent des mécanismes d'attention pour capturer des relations spatiales globales ignorées par les convolutions classiques.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Pipeline Technique */}
        <section className="bg-gray-50 rounded-[3rem] p-10 border border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">2. Pipeline de Reconnaissance Moderne</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Détection", desc: "Localisation du visage via MTCNN ou BlazeFace." },
              { step: "02", title: "Alignement", desc: "Transformation affine pour normaliser la pose (yeux alignés)." },
              { step: "03", title: "Embedding", desc: "Extraction d'un vecteur de caractéristiques (ex: 512-D)." },
              { step: "04", title: "Matching", desc: "Comparaison de distance (Cosinus ou Euclidienne)." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="absolute -top-2 -right-2 text-6xl font-black text-gray-50">{item.step}</span>
                <h5 className="font-black text-indigo-600 relative z-10 mb-2 uppercase text-xs">{item.title}</h5>
                <p className="text-sm text-gray-600 relative z-10 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Fonctions de Perte et Métriques */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">3. Optimisation et Fonctions de Perte</h3>
          </div>
          <div className="prose prose-indigo max-w-none text-gray-700">
            <p className="mb-6">
              L'enjeu majeur est de maximiser la distance <strong>inter-classe</strong> (entre deux personnes différentes) tout en minimisant la distance <strong>intra-classe</strong> (pour une même personne). Les fonctions de perte modernes incluent :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border-l-4 border-indigo-500 p-6 shadow-sm">
                <h5 className="font-bold text-gray-900 mb-2">Triplet Loss (FaceNet)</h5>
                <p className="text-sm">Compare une ancre (A) avec un positif (P) et un négatif (N). Formule : <code>L = max(d(A,P) - d(A,N) + margin, 0)</code>.</p>
              </div>
              <div className="bg-white border-l-4 border-indigo-500 p-6 shadow-sm">
                <h5 className="font-bold text-gray-900 mb-2">ArcFace / CosFace</h5>
                <p className="text-sm">Ajoute une marge angulaire dans l'espace hypersphérique pour forcer une séparation plus nette des clusters de visages.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Métriques Biométriques */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">4. Évaluation de la Performance</h3>
          </div>
          <div className="bg-white overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Métrique</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Signification</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Impact Sécurité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                <tr>
                  <td className="px-6 py-4 font-bold text-indigo-600">FAR (False Acceptance Rate)</td>
                  <td className="px-6 py-4">Proportion d'intrus acceptés par erreur.</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg font-bold text-[10px]">CRITIQUE</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-indigo-600">FRR (False Rejection Rate)</td>
                  <td className="px-6 py-4">Proportion d'utilisateurs légitimes refusés.</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-lg font-bold text-[10px]">ERGONOMIE</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-indigo-600">EER (Equal Error Rate)</td>
                  <td className="px-6 py-4">Point où FAR = FRR. Plus il est bas, meilleur est le système.</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-600 rounded-lg font-bold text-[10px]">GLOBAL</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Éthique et Biais */}
        <section className="bg-amber-50 border-2 border-amber-100 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <h3 className="text-2xl font-bold text-amber-800">5. Considérations Éthiques et Biais</h3>
          </div>
          <p className="text-amber-900 leading-relaxed mb-4">
            Le traitement d'image biométrique soulève des questions cruciales de confidentialité (RGPD) et de biais algorithmiques. 
            Les jeux de données d'entraînement (comme LFW ou MS-Celeb-1M) présentent souvent des déséquilibres ethniques ou de genre, 
            pouvant mener à des FAR/FRR disparates selon les populations.
          </p>
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
             <div className="w-2 h-2 bg-amber-600 rounded-full" />
             Notre projet utilise une approche "Few-Shot" locale pour minimiser la rétention de données massives.
          </div>
        </section>
      </div>

      <footer className="mt-20 pt-10 border-t border-gray-200 text-center">
        <p className="text-gray-400 text-sm font-medium italic">
          Rapport généré pour l'unité d'enseignement "Traitement d'Image et Vision par Ordinateur" - 2024
        </p>
      </footer>
    </div>
  );
};

export default TheorySection;
