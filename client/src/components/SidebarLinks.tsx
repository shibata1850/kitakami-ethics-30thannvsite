import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

interface SidebarLink {
  id: number;
  title: string;
  url: string;
  bgColor: string;
  hoverColor: string;
  internal?: boolean;
}

export function SidebarLinks() {
  const links: SidebarLink[] = [
    {
      id: 1,
      title: "会員専用ページ",
      url: "/members-only",
      bgColor: "bg-gradient-to-b from-green-400 to-green-500",
      hoverColor: "hover:from-green-500 hover:to-green-600",
      internal: true,
    },
    {
      id: 2,
      title: "役員専用システム",
      url: "https://app-99436250-11d4-4bc6-89e5-c095cdd845ed.base44.app",
      bgColor: "bg-gradient-to-b from-yellow-400 to-yellow-500",
      hoverColor: "hover:from-yellow-500 hover:to-yellow-600",
    },
    {
      id: 3,
      title: "出欠登録システム",
      url: "https://example.com/attendance-system",
      bgColor: "bg-gradient-to-b from-blue-400 to-blue-500",
      hoverColor: "hover:from-blue-500 hover:to-blue-600",
    },
  ];

  const linkClassName = (link: SidebarLink) => `
    ${link.bgColor} ${link.hoverColor}
    text-white font-bold
    text-xs md:text-sm
    py-3 px-1.5 md:py-6 md:px-2
    rounded-l-lg
    shadow-md md:shadow-lg
    transition-all duration-300
    hover:pr-2 md:hover:pr-2.5
    hover:shadow-lg md:hover:shadow-xl
    flex items-center justify-center
    writing-mode-vertical-rl
    text-orientation-upright
    group
  `;

  const linkStyle = {
    writingMode: "vertical-rl" as const,
    textOrientation: "upright" as const,
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1 md:gap-2">
      {links.map((link) =>
        link.internal ? (
          <Link
            key={link.id}
            href={link.url}
            className={linkClassName(link)}
            style={linkStyle}
          >
            <span className="tracking-wider">{link.title}</span>
          </Link>
        ) : (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName(link)}
            style={linkStyle}
          >
            <span className="tracking-wider">{link.title}</span>
            <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3 ml-0.5 md:ml-1 opacity-0 group-hover:opacity-100 transition-opacity rotate-90" />
          </a>
        )
      )}
    </div>
  );
}
