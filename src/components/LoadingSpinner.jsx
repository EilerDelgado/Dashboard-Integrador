import React from 'react';

const LoadingSpinner = ({ size = 'large', text = 'Cargando...' }) => {
  const sizeClasses = {
    small: 'spinner-border-sm',
    medium: '',
    large: ''
  };

  const containerClasses = size === 'large' 
    ? 'd-flex justify-content-center align-items-center min-vh-100' 
    : 'd-flex justify-content-center align-items-center p-3';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div 
          className={`spinner-border text-primary ${sizeClasses[size]}`} 
          role="status"
          style={size === 'large' ? { width: '3rem', height: '3rem' } : {}}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        {text && (
          <div className="mt-3 text-muted">
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;