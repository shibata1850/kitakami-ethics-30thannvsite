import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: "倫理法人会とは",
      items: [
        { label: "倫理法人会とは", href: "/about" },
        { label: "会長挨拶", href: "/about/greeting" },
      ],
    },
    {
      label: "スケジュール",
      items: [
        { label: "イベント一覧", href: "/schedule#event-list" },
        { label: "セミナーアーカイブ", href: "/seminars/archive" },
      ],
    },
    {
      label: "北上市倫理法人会概要",
      items: [
        { label: "概要", href: "/overview" },
        { label: "役員紹介", href: "/overview/officers" },
      ],
    },
    { label: "ブログ", href: "/blog" },
    { label: "会員紹介", href: "/members" },
    { label: "お問合せ", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 cursor-pointer">
          <img 
            src="/logo.png" 
            alt="北上市倫理法人会ロゴ" 
            className="h-12 w-12 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">一般社団法人倫理研究所</span>
            <span className="text-lg font-bold text-primary leading-tight">北上市倫理法人会</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navItems.map((item, index) => (
            item.items ? (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger className="flex items-center text-sm font-medium hover:text-primary transition-colors focus:outline-none">
                  {item.label} <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {item.items.map((subItem, subIndex) => (
                    <DropdownMenuItem key={subIndex} asChild>
                      <Link href={subItem.href}>{subItem.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link key={index} href={item.href}>
                <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                  {item.label}
                </span>
              </Link>
            )
          ))}
          <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold shadow-md">
            <Link href="/joinus">入会案内</Link>
          </Button>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 font-bold">
            <Link href="/login">ログイン</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background p-4 shadow-lg absolute w-full">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <div key={index} className="flex flex-col">
                {item.items ? (
                  <>
                    <div className="font-medium text-primary mb-2">{item.label}</div>
                    <div className="pl-4 flex flex-col space-y-2 border-l-2 border-muted ml-1">
                      {item.items.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.href}>
                          <span 
                            className="text-sm hover:text-primary cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={item.href}>
                    <span 
                      className="font-medium hover:text-primary cursor-pointer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}
            <Button asChild className="w-full bg-primary text-white mt-4">
              <Link href="/joinus" onClick={() => setIsMobileMenuOpen(false)}>入会案内</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 mt-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>ログイン</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
