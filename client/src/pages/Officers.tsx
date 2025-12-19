import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const POSITION_ORDER = [
  "会長",
  "専任幹事",
  "事務長",
  "相談役",
  "委員長",
  "副委員長",
  "会員拡大委員会委員長",
  "活力朝礼委員会委員長",
  "広報委員会委員長",
  "研修委員会委員長",
  "地域貢献委員会委員長",
];

const POSITION_SECTIONS: Record<string, string> = {
  "会長": "会長",
  "専任幹事": "専任幹事",
  "事務長": "事務長",
  "相談役": "相談役",
  "委員長": "委員長",
  "副委員長": "副委員長",
  "会員拡大委員会委員長": "各委員会委員長",
  "活力朝礼委員会委員長": "各委員会委員長",
  "広報委員会委員長": "各委員会委員長",
  "研修委員会委員長": "各委員会委員長",
  "地域貢献委員会委員長": "各委員会委員長",
};

export default function Officers() {
  const { data: officers = [], isLoading } = trpc.officers.list.useQuery();

  // Group officers by section
  const groupedOfficers: Record<string, any[]> = {};
  officers.forEach((officer: any) => {
    const section = POSITION_SECTIONS[officer.position] || "その他";
    if (!groupedOfficers[section]) {
      groupedOfficers[section] = [];
    }
    groupedOfficers[section].push(officer);
  });

  // Sort sections by position order
  const sortedSections = Object.keys(groupedOfficers).sort((a, b) => {
    const aIndex = POSITION_ORDER.findIndex(pos => POSITION_SECTIONS[pos] === a);
    const bIndex = POSITION_ORDER.findIndex(pos => POSITION_SECTIONS[pos] === b);
    return aIndex - bIndex;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-pink-50 to-white py-16">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                役員紹介
              </h1>
              <p className="text-lg text-muted-foreground">
                北上市倫理法人会の役員をご紹介します
              </p>
            </div>
          </div>
        </section>

        {/* Officers Section */}
        <section className="py-16">
          <div className="container max-w-6xl">
            {isLoading ? (
              <div className="text-center py-12">読み込み中...</div>
            ) : officers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                役員情報が登録されていません
              </div>
            ) : (
              <div className="space-y-16">
                {sortedSections.map((section) => (
                  <div key={section}>
                    <h2 className="text-3xl font-bold text-primary mb-8 text-center">
                      {section}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {groupedOfficers[section]
                        .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                        .map((officer: any) => (
                          <div
                            key={officer.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-dashed border-pink-200 hover:shadow-lg transition-shadow"
                          >
                            <div className="aspect-[4/3] overflow-hidden bg-pink-50">
                              {officer.photoUrl ? (
                                <img
                                  src={officer.photoUrl}
                                  alt={officer.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-pink-300">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              <p className="text-sm font-semibold text-primary mb-2">
                                {officer.position}
                              </p>
                              {officer.committee && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  {officer.committee}
                                </p>
                              )}
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {officer.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                {officer.companyName}
                              </p>
                              {officer.message && (
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {officer.message}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
