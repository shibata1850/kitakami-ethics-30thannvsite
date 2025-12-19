# スケジュールページのアンカーリンク動作確認結果

確認日時: 2025年12月19日

## 確認内容

### 1. モーニングセミナーアンカーリンク
- ボタンをクリック: ✅ 成功
- URL変化: `https://...schedule` → `https://...schedule#morning-seminar`
- スクロール動作: ✅ 「定例活動」セクションの「経営者モーニングセミナー」カードに正しくスクロール
- `scroll-mt-20`クラスによるオフセット: ✅ 正常に動作（ヘッダーと重ならない）

### 2. 経営者のつどいアンカーリンク
- ボタンをクリック: ✅ 成功
- URL変化: `https://...schedule` → `https://...schedule#keieisha-tsudoi`
- スクロール動作: ✅ 「経営者のつどい」カードに正しくスクロール
- `scroll-mt-20`クラスによるオフセット: ✅ 正常に動作（ヘッダーと重ならない）

## 実装詳細

### アンカーリンクボタン（ヒーローセクション）
```tsx
<a
  href="#morning-seminar"
  className="inline-flex items-center px-6 py-3 bg-white border-2 border-pink-300 text-pink-700 font-semibold rounded-lg hover:bg-pink-50 transition-colors"
>
  モーニングセミナー
</a>

<a
  href="#keieisha-tsudoi"
  className="inline-flex items-center px-6 py-3 bg-white border-2 border-pink-300 text-pink-700 font-semibold rounded-lg hover:bg-pink-50 transition-colors"
>
  経営者のつどい
</a>
```

### ターゲットセクション
```tsx
// モーニングセミナーセクション
<section id="morning-seminar" className="py-16 bg-white scroll-mt-20">

// 経営者のつどいカード
<Card id="keieisha-tsudoi" className="border-pink-200 hover:shadow-lg transition-shadow scroll-mt-20">
```

## 結論
両方のアンカーリンクが正常に動作しており、ユーザーは目次ボタンをクリックすることで、
該当するセクションにスムーズにスクロールできます。`scroll-mt-20`クラスにより、
固定ヘッダーとコンテンツが重ならないように適切なオフセットが設定されています。
