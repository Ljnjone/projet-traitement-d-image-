
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TheorySection from './components/TheorySection';
import Registration from './components/Registration';
import DetectionDemo from './components/DetectionDemo';
import { View, UserProfile } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.DASHBOARD);
  
  // Initial state for two authorized users
  const [users, setUsers] = useState<UserProfile[]>([
    { id: '1', name: 'Utilisateur A', photoBase64: null },
    { id: '2', name: 'Utilisateur B', photoBase64: null }
  ]);

  const handleUpdateUser = (id: string, name: string, photo: string | null) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, name, photoBase64: photo } : u));
  };

  const renderView = () => {
    switch (view) {
      case View.DASHBOARD:
        return <Dashboard onViewChange={setView} users={users} />;
      case View.THEORY:
        return <TheorySection />;
      case View.REGISTRATION:
        return <Registration users={users} onUpdateUser={handleUpdateUser} />;
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
