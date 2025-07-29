import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Audit {
  id: string;
  created: string;
  business_name: string;
  sustainability_score: number;
  strengths: string[];
  improvements: string[];
  tip: string;
}

const AuditList: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [sortBy, setSortBy] = useState<string>('created');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await axios.get(`/audit/list?order_by=${sortBy}&order=${sortOrder}`);
        setAudits(response.data.audits || []);
      } catch (error) {
        console.error('Error fetching audits:', error);
      }
    };
    fetchAudits();
  }, [sortBy, sortOrder]);

  return (
    <div>
      <h2>Existing Audits</h2>
      <div>
        <label>Sort by: </label>
        <select value={sortBy} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}>
          <option value="created">Date</option>
          <option value="business_name">Business Name</option>
          <option value="sustainability_score">Sustainability Score</option>
        </select>
        <select value={sortOrder} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <ul>
        {audits.map((audit) => (
          <li key={audit.id}>
            <h3>{audit.business_name}</h3>
            <p><strong>Score:</strong> {audit.sustainability_score}</p>
            <div><strong>Strengths:</strong></div>
            <ul>
              {audit.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
            <div><strong>Improvements:</strong></div>
            <ul>
              {audit.improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
            <p><strong>Tip:</strong> {audit.tip}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditList;
