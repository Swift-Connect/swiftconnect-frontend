import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, className }) => {
  return (
    <button className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string
};

Button.defaultProps = {
  onClick: () => {},
  className: ''
};

export default Button;