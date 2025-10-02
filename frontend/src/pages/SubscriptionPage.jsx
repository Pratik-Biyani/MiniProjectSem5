// pages/SubscriptionPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubscriptionPlans from '../components/SubscriptionPlans';
import axios from 'axios';

const SubscriptionPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { investor_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, [investor_id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/users/${investor_id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionUpdate = () => {
    // Redirect back to dashboard after subscription
    navigate(`/investor/${investor_id}/dashboard`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
          <button
            onClick={() => navigate(`/investor/${investor_id}/dashboard`)}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Subscription Plans */}
      <SubscriptionPlans 
        userId={investor_id}
        onSubscriptionUpdate={handleSubscriptionUpdate}
      />

      {/* Current Plan Info */}
      {user?.subscription && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Current Plan: {user.subscription.plan?.charAt(0).toUpperCase() + user.subscription.plan?.slice(1)}
            </h3>
            <p className="text-blue-700">
              Status: <span className="font-medium">{user.subscription.status}</span>
              {user.subscription.currentPeriodEnd && (
                <span className="ml-4">
                  Renews on: {new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;