import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/logo.png" 
                alt="北上市倫理法人会ロゴ" 
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">一般社団法人倫理研究所</span>
                <span className="text-lg font-bold text-primary leading-tight">北上市倫理法人会</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              「心の経営」を学び、実践し、<br />
              家庭・企業・地域・日本の活路を拓く
            </p>
            <div className="text-sm text-muted-foreground">
              <p>〒024-0091</p>
              <p>北上市大曲町３－２５ SOFTDOING株式会社内</p>
              <p>TEL: 0197-65-5421</p>
              <p>FAX: 0197-65-5422</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground">コンテンツ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about"><a className="hover:text-primary">倫理法人会とは</a></Link></li>
              <li><Link href="/schedule/morning"><a className="hover:text-primary">モーニングセミナー</a></Link></li>
              <li><Link href="/members"><a className="hover:text-primary">会員紹介</a></Link></li>
              <li><Link href="/blog"><a className="hover:text-primary">ブログ</a></Link></li>
              <li><Link href="/join"><a className="hover:text-primary">入会案内</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground">関連リンク</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://www.rinri-jpn.or.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">一般社団法人倫理研究所</a></li>
              <li><a href="https://iwate-rinri.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">岩手県倫理法人会</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kitakami Rinri Hojinkai. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
