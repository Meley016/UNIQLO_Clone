import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RegisterLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/register') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (location.pathname === '/register') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default RegisterLayout;