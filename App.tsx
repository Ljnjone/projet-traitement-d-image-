
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TheorySection from './components/TheorySection';
import Registration from './components/Registration';
import DetectionDemo from './components/DetectionDemo';
import { View, UserProfile } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.DASHBOARD);
  
  // Initial state for two authorized users with photo arrays
  const [users, setUsers] = useState<UserProfile[]>([
    { id: '1', name: 'Utilisateur A', photosBase64: [] },
    { id: '2', name: 'Utilisateur B', photosBase64: [] }
  ]);

  const handleAddPhoto = (userId: string, photo: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, photosBase64: [...u.photosBase64, photo] } : u
    ));
  };

  const handleRemovePhoto = (userId: string, photoIndex: number) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, photosBase64: u.photosBase64.filter((_, i) => i !== photoIndex) } : u
    ));
  };

  const handleUpdateName = (userId: string, name: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, name } : u
    ));
  };

  const renderView = () => {
    switch (view) {
      case View.DASHBOARD:
        return <Dashboard onViewChange={setView} users={users} />;
      case View.THEORY:
        return <TheorySection />;
      case View.REGISTRATION:
        return (
          <Registration 
            users={users} 
            onAddPhoto={handleAddPhoto} 
            onRemovePhoto={handleRemovePhoto} 
            onUpdateName={handleUpdateName} 
          />
        );
      case View.DETECTION:
        return <DetectionDemo users={users} />;
      default:
        return <Dashboard onViewChange={setView} users={users} />;
    }
  };

  return (
    <Layout activeView={view} onViewChange={setView}>
      {renderView()}
    </Layout>
  );
};

export default App;
