import React, { useState } from 'react';
import GooglePayButton from '@google-pay/button-react';

const plans = [
  { id: 'basic', name: 'Basic', price: 499.00 },
  { id: 'pro', name: 'Pro', price: 1499.00 },
  { id: 'advanced', name: 'Advanced', price: 1999.00 },
];

function SubscriptionPlan() {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const handlePlanChange = (event) => {
    const plan = plans.find(p => p.id === event.target.value);
    if (plan) setSelectedPlan(plan);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Simulate successful response
      const result = {
        success: true,
        message: 'Subscription processed successfully',
        plan: selectedPlan.name,
        amount: selectedPlan.price,
      };

      console.log('Subscription processed:', result);
        setSubscriptionStatus('Subscription processed successfully!  plan subscribe=' + result.plan +'\n'+ JSON.stringify({ paymentData }));
      
      // In a real application, you would send the paymentData and planId to your server here
      // const response = await fetch('https://your-api-server.com/api/process-subscription', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     paymentData,
      //     planId: selectedPlan.id,
      //   }),
      // });
      // 
      // if (response.ok) {
      //   const result = await response.json();
      //   console.log('Subscription processed:', result);
      //   setSubscriptionStatus('Success! ' + result.message);
      // } else {
      //   throw new Error('Failed to process subscription');
      // }

    } catch (error) {
      console.error('Error processing subscription:', error);
      setSubscriptionStatus('Error: Failed to process subscription. Please try again.');
    }
  };

  return (
    <div className="subscription-plan">
      <h2>Choose a Subscription Plan</h2>
      <p>Select a plan and pay with Google Pay</p>
      <form>
        {plans.map((plan) => (
          <div key={plan.id}>
            <input
              type="radio"
              id={plan.id}
              name="plan"
              value={plan.id}
              checked={selectedPlan.id === plan.id}
              onChange={handlePlanChange}
            />
            <label htmlFor={plan.id}>{plan.name} - ${plan.price}/month</label>
          </div>
        ))}
      </form>
      <GooglePayButton
        environment="TEST"
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: 'example',
                  gatewayMerchantId: 'exampleGatewayMerchantId',
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: '12345678901234567890',
            merchantName: 'Demo Merchant',
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: selectedPlan.price.toFixed(2),
            currencyCode: 'USD',
            countryCode: 'US',
          },
        }}
        onLoadPaymentData={handlePaymentSuccess}
        buttonColor="black"
        buttonType="subscribe"
      />
      {subscriptionStatus && (
        <p className={subscriptionStatus.includes('Error') ? 'error' : 'success'}>
          {subscriptionStatus}
        </p>
      )}
    </div>
  );
}

export default SubscriptionPlan;

