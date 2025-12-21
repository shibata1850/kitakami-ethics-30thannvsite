import { ExternalLink } from "lucide-react";

export function SidebarLinks() {
  const links = [
    {
      id: 1,
      title: "会員専用システム",
      url: "https://example.com/member-system",
      bgColor: "bg-gradient-to-b from-green-400 to-green-500",
      hoverColor: "hover:from-green-500 hover:to-green-600",
    },
    {
      id: 2,
      title: "役員専用システム",
      url: "https://example.com/officer-system",
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

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1 md:gap-2">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            ${link.bgColor} ${link.hoverColor}
            text-white font-bold
            text-xs md:text-sm
            py-4 px-2 md:py-8 md:px-3
            rounded-l-lg
            shadow-md md:shadow-lg
            transition-all duration-300
            hover:pr-3 md:hover:pr-4
            hover:shadow-lg md:hover:shadow-xl
            flex items-center justify-center
            writing-mode-vertical-rl
            text-orientation-upright
            group
          `}
          style={{
            writingMode: "vertical-rl",
            textOrientation: "upright",
          }}
        >
          <span className="tracking-wider">{link.title}</span>
          <ExternalLink className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 opacity-0 group-hover:opacity-100 transition-opacity rotate-90" />
        </a>
      ))}
    </div>
  );
}
