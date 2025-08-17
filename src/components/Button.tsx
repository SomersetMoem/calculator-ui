// Button.tsx
import React from 'react';

type ButtonProps = {
  label: string;
  className?: string;
  onButtonClick: (value: string) => void; // <-- добавляем сюда
};

const Button: React.FC<ButtonProps> = ({ label, className, onButtonClick }) => {
  return (
    <button
      className={`button ${className}`}
      onClick={() => onButtonClick(label)} // вызываем с меткой кнопки
    >
      {label}
    </button>
  );
};

export default Button;
