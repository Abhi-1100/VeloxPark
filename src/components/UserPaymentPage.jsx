import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserPaymentPageMobile from './user/UserPaymentPageMobile';
import UserPaymentPageDesktop from './user/UserPaymentPageDesktop';

const UserPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;
  const vehicleData = state?.vehicleData;
  const upiConfig = state?.upiConfig;
  const upiLink = state?.upiLink;

  const handleConfirmPayment = () => {
    navigate('/user/payment/success', {
      state: { vehicleData, upiConfig },
    });
  };

  const sharedProps = {
    vehicleData,
    upiConfig,
    upiLink,
    onConfirmPayment: handleConfirmPayment,
  };

  return (
    <>
      {/* Mobile view (< 1024px) */}
      <div className="block lg:hidden">
        <UserPaymentPageMobile {...sharedProps} />
      </div>

      {/* Desktop view (>= 1024px) */}
      <div className="hidden lg:block">
        <UserPaymentPageDesktop {...sharedProps} />
      </div>
    </>
  );
};

export default UserPaymentPage;
