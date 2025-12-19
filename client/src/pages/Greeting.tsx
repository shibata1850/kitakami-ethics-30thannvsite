import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Greeting() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4 text-primary font-serif">会長挨拶</h1>
            <p className="text-lg text-muted-foreground">
              北上市倫理法人会 会長からのご挨拶
            </p>
          </div>
        </section>

        {/* Greeting Content */}
        <section className="py-16 bg-white">
          <div className="container max-w-4xl">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8 md:p-12">
                {/* President Photo and Info */}
                <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
                  <div className="shrink-0">
                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">会長写真</span>
                    </div>
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2">北上市倫理法人会 会長</h2>
                    <p className="text-xl text-primary font-bold mb-4">氏名</p>
                    <p className="text-muted-foreground">
                      所属企業名・役職
                    </p>
                  </div>
                </div>

                {/* Greeting Message */}
                <div className="space-y-6 text-foreground leading-relaxed">
                  <p>
                    この度は、北上市倫理法人会のウェブサイトをご覧いただき、誠にありがとうございます。
                  </p>

                  <p>
                    倫理法人会は、「企業に倫理を、職場に心を、家庭に愛を」をスローガンに掲げ、
                    経営者としての人間力向上と企業の健全な発展を目指す団体です。
                    北上市倫理法人会は、地域の経営者の皆様が共に学び、成長し、
                    互いに支え合う場として活動しております。
                  </p>

                  <p>
                    毎週火曜日の朝6時から開催される「経営者モーニングセミナー」では、
                    様々な分野で活躍されている講師の方々から、貴重な体験談や学びを共有していただいております。
                    朝の清々しい時間に、志を同じくする仲間と共に学ぶことで、
                    日々の経営に活かせる気づきや、人生を豊かにするヒントを得ることができます。
                  </p>

                  <p>
                    また、倫理法人会での学びは、経営だけでなく、家庭や地域社会においても
                    大きな影響をもたらします。「心の経営」を実践することで、
                    社員との信頼関係が深まり、家族との絆が強まり、
                    地域社会への貢献にもつながっていきます。
                  </p>

                  <p>
                    経営者として、また一人の人間として、日々成長し続けたいと願う皆様、
                    ぜひ一度、私たちのモーニングセミナーにご参加ください。
                    無理な勧誘は一切ございません。まずはゲストとして、
                    倫理法人会の雰囲気を体験していただければ幸いです。
                  </p>

                  <p>
                    皆様との出会いを、心よりお待ちしております。
                  </p>

                  <div className="mt-8 text-right">
                    <p className="text-lg font-bold">北上市倫理法人会</p>
                    <p className="text-xl font-bold text-primary">会長　氏名</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
