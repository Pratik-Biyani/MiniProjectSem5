// components/SubscriptionPlans.jsx
import React, { useState } from 'react';
import axios from 'axios';

const SubscriptionPlans = ({ userId, onSubscriptionUpdate }) => {
  const [loading, setLoading] = useState(false);
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$29',
      description: 'Essential features for individual investors',
      features: [
        'Access to basic analytics',
        '5 startup profiles per month',
        'Email support',
        'Basic portfolio tracking'
      ]
    },
    {
      id: 'premium', 
      name: 'Premium Plan',
      price: '$79',
      description: 'Advanced tools for serious investors',
      features: [
        'Full analytics dashboard',
        'Unlimited startup profiles',
        'Priority support',
        'Advanced portfolio analytics',
        'Market insights reports'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan', 
      price: '$199',
      description: 'Complete solution for investment firms',
      features: [
        'All Premium features',
        'API access',
        'Dedicated account manager',
        'Custom reporting',
        'Team collaboration tools',
        'White-label solutions'
      ]
    }
  ];

const handleSubscribe = async (planId, planName, price) => {
  setLoading(true);
  try {
    console.log('🚀 Starting subscription for user:', userId, 'plan:', planName);
    
    // Direct call to your backend - FIX THE URL
    const response = await axios.post('http://localhost:5001/api/users/subscriptions/create-checkout-session', {
      userId,
      planId,
      planName,
      price
    });

    console.log('✅ Subscription response:', response.data);

    if (response.data.mock) {
      // FIX THIS LINE: Use actual userId, not ":investor_id"
      console.log('🔄 Updating user subscription for:', userId);
      
      const updateResponse = await axios.put(`http://localhost:5001/api/users/${userId}/subscription`, {
        plan: planId,
        status: 'active',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });
      
      console.log('✅ User updated:', updateResponse.data);
      alert(`🎉 Successfully subscribed to ${planName} plan!`);
      onSubscriptionUpdate();
    }
  } catch (error) {
    console.error('❌ Subscription error details:', error);
    console.error('Error response:', error.response?.data);
    
    // More specific error handling
    if (error.response?.status === 500) {
      alert('Server error. Please check the backend logs.');
    } else {
      alert('Failed to process subscription. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-600">
          Select the subscription that best fits your investment needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id, plan.name, plan.price)}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;