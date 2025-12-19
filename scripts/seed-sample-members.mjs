import { createMember } from "../server/db.ts";

const sampleMembers = [
  {
    name: "山田 太郎",
    companyName: "山田税理士事務所",
    title: "倫理法人会で学んだ「純粋倫理」の実践",
    message: "倫理法人会に入会してから、経営の考え方が大きく変わりました。モーニングセミナーで学んだ「純粋倫理」の考え方を実践することで、顧問先企業との信頼関係が深まり、紹介による新規顧客も増えました。経営者同士の交流も刺激になり、新たな気づきが得られています。",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    category: "専門サービス（士業,保険,デザイン,議員等）",
    committee: "会員拡大委員会",
    websiteUrl: "https://yamada-tax.example.com",
    twitterUrl: "https://twitter.com/yamada_tax",
    youtubeUrl: "https://youtube.com/@yamada_tax",
    instagramUrl: "https://instagram.com/yamada_tax",
    services: "税務相談,経営コンサルティング,記帳代行,確定申告",
    sortOrder: 1,
  },
  {
    name: "佐藤 花子",
    companyName: "さくらカフェ",
    title: "朝の学びが店舗経営を変えた",
    message: "朝6時からのモーニングセミナーは最初は大変でしたが、今では1日のスタートに欠かせない習慣になりました。倫理法人会で学んだ「明朗」の精神を実践することで、スタッフの笑顔が増え、お客様からも「雰囲気が良くなった」と言われるようになりました。地域貢献活動にも積極的に参加し、地元の皆様との絆も深まっています。",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    category: "飲食・食品",
    committee: "地域貢献委員会",
    websiteUrl: "https://sakura-cafe.example.com",
    twitterUrl: "https://twitter.com/sakura_cafe",
    instagramUrl: "https://instagram.com/sakura_cafe",
    lineUrl: "https://line.me/R/ti/p/@sakuracafe",
    services: "カフェ営業,ケータリング,貸切パーティー,テイクアウト",
    sortOrder: 2,
  },
  {
    name: "鈴木 誠",
    companyName: "鈴木建設株式会社",
    title: "経営者の悩みを共有できる仲間との出会い",
    message: "経営の悩みを共有できる仲間ができたことが、何よりの財産です。業種は違っても、経営者としての共通の課題があり、互いに学び合えています。倫理法人会で学んだことを実践することで、工事現場の安全意識が高まり、事故も減少しました。従業員との信頼関係も深まり、離職率も改善されています。",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    category: "建築・不動産",
    committee: "研修委員会",
    websiteUrl: "https://suzuki-construction.example.com",
    twitterUrl: "https://twitter.com/suzuki_const",
    youtubeUrl: "https://youtube.com/@suzuki_construction",
    tiktokUrl: "https://tiktok.com/@suzuki_const",
    services: "住宅建築,リフォーム,外構工事,耐震診断",
    sortOrder: 3,
  },
  {
    name: "田中 美咲",
    companyName: "ビューティーサロン TANAKA",
    title: "「活力朝礼」で店舗の雰囲気が一変",
    message: "倫理法人会で学んだ「活力朝礼」を店舗に導入したところ、スタッフの表情が明るくなり、お客様からも「スタッフの雰囲気が良くなった」と言われるようになりました。モーニングセミナーで学んだことを実践することで、リピート率も向上し、売上も20%アップしました。経営者同士の交流も刺激になっています。",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    category: "美容・健康",
    committee: "活力朝礼委員会",
    websiteUrl: "https://beauty-tanaka.example.com",
    twitterUrl: "https://twitter.com/beauty_tanaka",
    instagramUrl: "https://instagram.com/beauty_tanaka",
    lineUrl: "https://line.me/R/ti/p/@beautytanaka",
    services: "ヘアカット,カラーリング,パーマ,ヘッドスパ,着付け",
    sortOrder: 4,
  },
  {
    name: "高橋 健一",
    companyName: "高橋電気工業株式会社",
    title: "倫理法人会で学んだ「感謝」の心",
    message: "倫理法人会に入会してから、「感謝」の心を大切にするようになりました。お客様、取引先、従業員、すべての人に感謝の気持ちを持って接することで、仕事がスムーズに進むようになりました。モーニングセミナーで学んだことを実践することで、従業員のモチベーションも向上し、会社全体の雰囲気が良くなりました。",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    category: "電気・通信・IT",
    committee: "広報委員会",
    websiteUrl: "https://takahashi-electric.example.com",
    twitterUrl: "https://twitter.com/takahashi_elec",
    youtubeUrl: "https://youtube.com/@takahashi_electric",
    instagramUrl: "https://instagram.com/takahashi_electric",
    services: "電気工事,太陽光発電設置,LED照明工事,オール電化",
    sortOrder: 5,
  },
];

async function seedSampleMembers() {
  console.log("サンプル会員データを作成中...");
  
  for (const member of sampleMembers) {
    try {
      const result = await createMember(member);
      console.log(`✓ ${member.name} (${member.companyName}) を作成しました`);
    } catch (error) {
      console.error(`✗ ${member.name} の作成に失敗しました:`, error.message);
    }
  }
  
  console.log("\nサンプル会員データの作成が完了しました");
  process.exit(0);
}

seedSampleMembers();
