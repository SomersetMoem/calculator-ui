import React from 'react';
import Button from './Button';

const buttons = [
  'C', '±', '%', '/',
  '7', '8', '9', '*',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '=',
];

type ButtonGridProps = {
  onButtonClick: (value: string) => void;
};

const ButtonGrid: React.FC<ButtonGridProps> = ({ onButtonClick }) => {

  const getButtonType = (label: string): string => {
    if (label === 'C') return 'clear';
    if (label === '=') return 'equals';
    if (['±', '%'].includes(label)) return 'function';
    if (['/', '*', '-', '+'].includes(label)) return 'operator';
    return 'number';
  };

  const getButtonClass = (label: string): string => {
    const type = getButtonType(label);
    if (label === '0') return `${type} zero`;
    return type;
  };

  return (
    <div className="button-grid">
      {buttons.map((label) => (
        <Button 
          key={label} 
          label={label} 
          onButtonClick={onButtonClick} // используем пропс
          className={getButtonClass(label)}
        />
      ))}
    </div>
  );
};

export default ButtonGrid;