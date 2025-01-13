import React, { useState } from 'react';
import GooglePayButton from '@google-pay/button-react';

const plans = [
  { id: 'basic', name: 'Basic', price: 499 },
  { id: 'pro', name: 'Pro', price: 1499 },
  { id: 'advanced', name: 'Advanced', price: 1999 },
];

function SubscriptionPlan() {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Pro plan selected by default

  const handlePlanChange = (event) => {
    const plan = plans.find(p => p.id === event.target.value);
    if (plan) setSelectedPlan(plan);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = {
        success: true,
        message: 'Subscription processed successfully',
        plan: selectedPlan.name,
        amount: selectedPlan.price,
      };
      console.log('Subscription processed:', result);
    } catch (error) {
      console.error('Error processing subscription:', error);
    }
  };

  return (
    <div className="subscription-container">
      <h1 className="main-title">Subscription Plans</h1>
      <div className="subscription-card">
        <h2 className="card-title">Choose a Subscription Plan</h2>
        <p className="card-description">Select a plan and pay with Google Pay</p>
        <form className="plan-form">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-option">
              <input
                type="radio"
                id={plan.id}
                name="plan"
                value={plan.id}
                checked={selectedPlan.id === plan.id}
                onChange={handlePlanChange}
                className="plan-radio"
              />
              <label htmlFor={plan.id} className="plan-label">
                {plan.name} - ${plan.price}/month
              </label>
            </div>
          ))}
        </form>
        <div className="button-container">
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
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPlan;

