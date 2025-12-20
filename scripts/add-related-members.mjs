import * as db from "../server/db.ts";

async function addRelatedMembers() {
  console.log("Adding related members for testing...");

  // Add more members in 飲食・食品 category
  const member1 = await db.createMember({
    name: "鈴木一郎",
    companyName: "北上ラーメン",
    title: "店主",
    message:
      "倫理法人会で学んだ「お客様第一」の精神を実践しています。地元の食材を使った温かいラーメンで、お客様に笑顔をお届けしています。",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    category: "飲食・食品",
    committee: "活力朝礼委員会",
    sortOrder: 0,
    websiteUrl: "https://example.com/kitakami-ramen",
    twitterUrl: "https://twitter.com/kitakami_ramen",
    services: "ラーメン,餃子,チャーハン",
    achievements:
      "2023年 岩手県ラーメンコンテスト優勝\n2024年 地元テレビ局「人気店特集」出演\n2024年 北上市商工会優良店舗表彰",
  });
  console.log(`Created member: ${member1.name} (ID: ${member1.id})`);

  const member2 = await db.createMember({
    name: "高橋美穂",
    companyName: "パティスリー高橋",
    title: "オーナーパティシエ",
    message:
      "フランスで学んだ技術と地元の素材を融合させたお菓子作りを心がけています。倫理法人会での学びを通じて、スタッフとの信頼関係も深まりました。",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    category: "飲食・食品",
    committee: "広報委員会",
    sortOrder: 0,
    websiteUrl: "https://example.com/patisserie-takahashi",
    instagramUrl: "https://instagram.com/patisserie_takahashi",
    lineUrl: "https://line.me/R/ti/p/@patisserie_takahashi",
    services: "ケーキ,焼き菓子,マカロン,ウェディングケーキ",
    achievements:
      "2022年 フランス国立製菓学校卒業\n2023年 北上市新規開業優秀賞受賞\n2024年 岩手県スイーツコンテスト金賞",
  });
  console.log(`Created member: ${member2.name} (ID: ${member2.id})`);

  // Add more members in 美容・健康 category
  const member3 = await db.createMember({
    name: "山田健太",
    companyName: "フィットネスクラブ山田",
    title: "代表トレーナー",
    message:
      "健康な体づくりをサポートすることが私の使命です。倫理法人会で学んだ「継続は力なり」を実践し、お客様一人ひとりに寄り添ったトレーニングを提供しています。",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    category: "美容・健康",
    committee: "活力朝礼委員会",
    sortOrder: 0,
    websiteUrl: "https://example.com/fitness-yamada",
    twitterUrl: "https://twitter.com/fitness_yamada",
    youtubeUrl: "https://youtube.com/@fitness_yamada",
    services: "パーソナルトレーニング,グループレッスン,栄養指導",
    achievements:
      "2021年 全国パーソナルトレーナー資格取得\n2023年 北上市健康増進事業協力事業者認定\n2024年 岩手県フィットネス大会審査員",
  });
  console.log(`Created member: ${member3.name} (ID: ${member3.id})`);

  const member4 = await db.createMember({
    name: "佐々木真由美",
    companyName: "整体院さくら",
    title: "院長",
    message:
      "体の不調を根本から改善する整体を提供しています。倫理法人会での学びを通じて、お客様との信頼関係の大切さを再認識しました。",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    category: "美容・健康",
    committee: "地域貢献委員会",
    sortOrder: 0,
    websiteUrl: "https://example.com/seitai-sakura",
    instagramUrl: "https://instagram.com/seitai_sakura",
    lineUrl: "https://line.me/R/ti/p/@seitai_sakura",
    services: "整体,骨盤矯正,マッサージ,姿勢改善",
    achievements:
      "2020年 国家資格柔道整復師取得\n2023年 北上市優良整体院認定\n2024年 岩手県整体技術コンテスト優秀賞",
  });
  console.log(`Created member: ${member4.name} (ID: ${member4.id})`);

  console.log("Related members added successfully!");
}

addRelatedMembers().catch(console.error);
