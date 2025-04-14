"use client";

import MenuIcon from "@mui/icons-material/Menu";
import ArticleIcon from "@mui/icons-material/Article";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import BarChartIcon from "@mui/icons-material/BarChart";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { SvgIcon } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

type NavLink = {
  href: string | any;
  label: string | any;
  icon: any;
};

const items = [
  {
    label: "Blog",
    route: "/blog",
    icon: ArticleIcon,
  },
  {
    label: "Wiadomości",
    route: "/contact",
    icon: NewspaperIcon,
  },
  {
    label: "Statystyki",
    route: "https://analytics.google.com/analytics/web/",
    icon: BarChartIcon,
  },
  {
    label: "Galeria",
    route: "/gallery",
    icon: PhotoLibraryIcon,
  },
];

const SideMenu = () => {
  return (
    <div className=" flex flex-col bg-[#212121]  gap-1">
      <Link
        href="/"
        className="flex flex-row gap-1 text-center items-center hover:bg-[] w-full p-6"
      >
        <Image
          src="/assets/images/stalumo.png"
          width={145}
          height={113}
          alt="Logo Stalumo"
          loading="lazy"
        />
      </Link>
      {items?.map((item) => (
        <Link
          key={item.route}
          href={item.route}
          target={item.route.startsWith('h') ? "_blank" : ""}
          className="flex flex-row gap-10 text-center items-center hover:bg-[] w-full p-6 opacity-100 hover:opacity-50 transition duration-30"
        >
          <div>
            <SvgIcon className="!text-[3rem]">
              <item.icon />
            </SvgIcon>
          </div>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};
export default SideMenu;
