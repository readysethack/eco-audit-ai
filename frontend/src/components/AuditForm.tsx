import React, { useState } from 'react';
import axios from 'axios';

interface AuditFormProps {
  onAuditCreated: (audit: any) => void;
}

const AuditForm: React.FC<AuditFormProps> = ({ onAuditCreated }) => {
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [products, setProducts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await axios.post('/audit/list', {
        business_type: businessType,
        location,
        products: products.split(',').map((p: string) => p.trim()),
      });
      console.log('Response:', response.data);
      onAuditCreated(response.data);
      setBusinessType('');
      setLocation('');
      setProducts('');
    } catch (error: any) {
      console.error('Error creating audit:', error);
      setErrorMessage(
        error.response?.data?.errors?.json?.[0] || 
        error.response?.data?.message || 
        'Failed to create audit. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Request a New Audit</h2>
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
      <input
        type="text"
        value={businessType}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusinessType(e.target.value)}
        placeholder="Business Type (e.g., independent vegan café)"
        required
        disabled={isLoading}
      />
      <input
        type="text"
        value={location}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
        placeholder="Location (e.g., Brussels)"
        required
        disabled={isLoading}
      />
      <input
        type="text"
        value={products}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProducts(e.target.value)}
        placeholder="Products (comma-separated, e.g., oat milk, ceramics)"
        required
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Submit'}
      </button>
      {isLoading && <div className="loading-indicator">Generating sustainability audit...</div>}
    </form>
  );
};

export default AuditForm;
