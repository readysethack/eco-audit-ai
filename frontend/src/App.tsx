import React, { useState, useEffect } from 'react';
import AuditForm from './components/AuditForm';
import AuditList from './components/AuditList';
import axios from 'axios';
import './App.css';

interface Audit {
  id: string;
  created: string;
  business_name: string;
  sustainability_score: number;
  strengths: string[];
  improvements: string[];
  tip: string;
}

function App() {
  const [audits, setAudits] = useState<Audit[]>([]);

  useEffect(() => {
    // Load initial audits when the component mounts
    const fetchAudits = async () => {
      try {
        const response = await axios.get('/audit/list');
        setAudits(response.data.audits || []);
      } catch (error) {
        console.error('Error fetching audits:', error);
      }
    };
    fetchAudits();
  }, []);

  const handleAuditCreated = (newAudit: Audit) => {
    setAudits([newAudit, ...audits]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>EcoAudit AI</h1>
        <p>Sustainability audits for businesses using AI</p>
      </header>
      <main>
        <AuditForm onAuditCreated={handleAuditCreated} />
        <AuditList />
      </main>
    </div>
  );
}

export default App;
