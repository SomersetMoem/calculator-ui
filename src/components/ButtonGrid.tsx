import React from 'react';
import Button from './Button';

const buttons = [
  'C', '±', '%', '/',
  '7', '8', '9', '*',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '=',
];

const ButtonGrid: React.FC = () => {
  const handleClick = (value: string) => {
    console.log('Нажата кнопка:', value);
    // сюда потом вставишь обработку логики калькулятора
  };

  // Функция для определения типа кнопки
  const getButtonType = (label: string): string => {
    if (label === 'C') return 'clear';
    if (label === '=') return 'equals';
    if (['±', '%'].includes(label)) return 'function';
    if (['/', '*', '-', '+'].includes(label)) return 'operator';
    return 'number';
  };

  // Функция для определения дополнительных классов
  const getButtonClass = (label: string): string => {
    const type = getButtonType(label);
    if (label === '0') return `${type} zero`; // широкая кнопка для 0
    return type;
  };

  return (
    <div className="button-grid">
      {buttons.map((label) => (
        <Button 
          key={label} 
          label={label} 
          onClick={handleClick}
          className={getButtonClass(label)}
        />
      ))}
    </div>
  );
};

export default ButtonGrid;