import React from "react";
import './test.css';

const CardTest = ({ title, description }) => {
  return (
    <div className="My-Custom-Card">
      <h3>{title}</h3>
      <div>{description}</div>
    </div>
  );
};

export default CardTest;
