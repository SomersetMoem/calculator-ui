import React from 'react';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import '../styles/Calculator.css';

const Calculator: React.FC = () => {
  return (
    <div className="calculator">
      <Display />
      <ButtonGrid />
    </div>
  );
};

export default Calculator;
