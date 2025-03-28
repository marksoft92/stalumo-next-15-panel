import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string; // Dodanie prop className (opcjonalny)
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className="w-full">{children}</div>;
};

export default Container;
