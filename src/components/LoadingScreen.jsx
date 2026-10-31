import React from 'react';
import AppSkeleton from './skeleton/AppSkeleton';
import './LoadingScreen.css';

const LoadingScreen = ({ statusText = "Loading VeloxPark..." }) => {
  return <AppSkeleton statusText={statusText} />;
};

export default LoadingScreen;
