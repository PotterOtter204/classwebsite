import React from 'react';
import { useNavigate } from 'react-router-dom';
/** Assuming you're using Theme UI for styling based on the sx prop usage */

const SuccessPopup = () => {
  const navigate= useNavigate();

  return (
    <div
      sx={{
        position: 'absolute', // Use fixed positioning to overlay content
        top: '50%', // Center vertically
        left: '50%', // Center horizontally
        transform: 'translate(-50%, -50%)', // Adjust for exact centering
        width: 'auto', // Adjust based on content or preference
        padding: '20px',
        backgroundColor: 'white', // Or any color that fits your theme
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Optional: adds some shadow for depth
        zIndex: '1000', // Ensure it sits above other content
        borderRadius: '8px', // Optional: for styled corners
      }}
    >
      <div>You got it! ✅</div>
      <button
        onClick={() => navigate('/')}
        sx={{
          mt: '20px', // Margin top for spacing
          backgroundColor: 'primary', // Use your theme's primary color
          color: 'white', // Contrast text color
          padding: '10px 15px',
          borderRadius: '5px', // Styled corners
          border: 'none', // Remove default border
          cursor: 'pointer', // Change cursor to indicate interactivity
          ':hover': {
            backgroundColor: 'secondary', // Optional: change on hover, use your theme's secondary color
          },
        }}
      >
        Back
      </button>
    </div>
  );
};

export default SuccessPopup;