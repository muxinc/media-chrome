/** @jsxImportSource react */
import React from 'react';
const Hero: React.FC<{
  tagline: string;
}> = ({ tagline }) => {
  return <h2 className="font-semibold text-4xl">{tagline}</h2>;
};

export default Hero;
