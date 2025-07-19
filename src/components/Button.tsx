import React from 'react';

interface ButtonProps {
  label: string;
  onClick: (value: string) => void;
  className?: string; // Добавь эту строку
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className = '' }) => {
  return (
    <button 
      className={className} // Используй переданный класс
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
};

export default Button;