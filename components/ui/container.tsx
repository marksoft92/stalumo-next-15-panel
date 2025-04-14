import React from "react";
import SideMenu from "@/components/ui/SideMenu";
interface ContainerProps {
  children: React.ReactNode;
  className?: string; // Dodanie prop className (opcjonalny)
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className="w-full flex min-h-[100vh]">
    <SideMenu />
    <div className=" flex flex-col w-full max-w-[85%]">
      {children}
    </div>
  </div>
};

export default Container;
