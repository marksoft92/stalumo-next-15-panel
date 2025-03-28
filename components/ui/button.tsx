import Link from "next/link";

interface ButtonProps {
  title: string;
  href: string | any;
}

const Button: React.FC<ButtonProps> = ({ title, href }) => {
  return (
    <Link
      href={href}
      className="
      text-[#fff] 
      bg-[#EB4036] 
      border-[1px] 
      border-[#EB4036] 
      mt-6
      w-max
      text-[1rem] 
      font-[500] 
      uppercase 
      leading-[1em] 
      tracking-[1.6px] 
      px-[25px] 
      py-[15px] 
      rounded-[0px] 
      transition-all 
      duration-300 
      hover:bg-[#02010100] 
      hover:skew-[-10] transform
      rounded-[5px]"
    >
      {title}
    </Link>
  );
};

export default Button;
