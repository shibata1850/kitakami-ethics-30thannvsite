import { drizzle } from "drizzle-orm/mysql2";
import { members } from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const sampleMembers = [
  {
    name: "佐藤 健一",
    companyName: "株式会社北上製作所",
    title: "倫理法人会で学んだ「明朗」の実践",
    message: "倫理法人会に入会してから、朝の時間を有効活用できるようになりました。モーニングセミナーで学んだ「明朗」の精神を実践することで、社内の雰囲気が明るくなり、従業員との信頼関係も深まりました。経営者同士の交流も刺激になり、新たな気づきが得られています。",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    category: "製造・ものづくり",
    committee: "会員拡大委員会",
    sortOrder: 1,
  },
  {
    name: "鈴木 美咲",
    companyName: "鈴木税理士事務所",
    title: "経営者の悩みを共有できる仲間との出会い",
    message: "経営の悩みを共有できる仲間ができたことが、何よりの財産です。業種は違っても、経営者としての共通の課題があり、互いに学び合えています。倫理法人会で学んだ「純粋倫理」の考え方は、顧問先企業へのアドバイスにも活かされており、クライアントからも感謝されています。",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    category: "専門サービス（士業,保険,デザイン,議員等）",
    committee: "広報委員会",
    sortOrder: 2,
  },
  {
    name: "田中 誠",
    companyName: "田中建設株式会社",
    title: "朝の学びが1日のスタートを変えた",
    message: "朝6時からのモーニングセミナーは最初は大変でしたが、今では1日のスタートに欠かせない習慣になりました。倫理法人会で学んだことを実践することで、工事現場の安全意識が高まり、事故も減少しました。地域貢献活動にも積極的に参加し、地元の皆様との絆も深まっています。",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    category: "建築・不動産",
    committee: "地域貢献委員会",
    sortOrder: 3,
  },
];

async function seedMembers() {
  try {
    console.log("サンプル会員データを登録中...");
    
    for (const member of sampleMembers) {
      await db.insert(members).values(member);
      console.log(`✓ ${member.companyName} - ${member.name} を登録しました`);
    }
    
    console.log("\n✅ サンプル会員データの登録が完了しました！");
    process.exit(0);
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

seedMembers();
