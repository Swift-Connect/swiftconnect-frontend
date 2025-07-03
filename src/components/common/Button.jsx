import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, className, disabled, type, variant, ariaLabel }) => {
  let base = 'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 m-1';
  let color = '';
  if (variant === 'secondary') {
    color = 'bg-white text-[#00613A] border border-[#00613A] hover:bg-[#F6FCF5]';
  } else if (variant === 'outline') {
    color = 'bg-transparent text-[#00613A] border border-[#00613A] hover:bg-[#F6FCF5]';
  } else {
    color = 'bg-[#00613A] text-white hover:bg-green-700';
  }
  let disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';
  return (
    <button
      type={type}
      className={`${base} ${color} ${disabledStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      role="button"
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  ariaLabel: PropTypes.string
};

Button.defaultProps = {
  onClick: () => {},
  className: '',
  disabled: false,
  type: 'button',
  variant: 'primary',
  ariaLabel: undefined
};

export default Button;