# EmailJSテンプレート設定ガイド

このドキュメントは、北上市倫理法人会のウェブサイトで使用するEmailJSテンプレートの設定方法を説明します。

## 前提条件

- EmailJSアカウントが作成済みであること
- Email Serviceが設定済みであること（Gmail、Outlook等）

## テンプレート作成手順

### 1. EmailJSダッシュボードにアクセス

https://dashboard.emailjs.com/ にログインし、左メニューから「Email Templates」を選択します。

### 2. 新しいテンプレートを作成

「Create New Template」ボタンをクリックします。

### 3. テンプレート設定

#### 基本設定

- **Template Name**: `北上市倫理法人会 - ゲスト参加申し込み確認`
- **Subject**: `【北上市倫理法人会】ゲスト参加申し込みを受け付けました`

#### 送信先設定

- **To Email**: `{{to_email}}`
  - 説明: 申込者のメールアドレスが自動で挿入されます

#### テンプレート変数（コードから送信される値）

以下の変数がコードから送信されます。テンプレート内で `{{変数名}}` の形式で使用できます。

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `{{to_email}}` | 申込者のメールアドレス | example@example.com |
| `{{to_name}}` | 申込者のお名前 | 山田 太郎 |
| `{{from_name}}` | 送信元名称（固定値） | 北上市倫理法人会 |
| `{{name}}` | 申込者のお名前（to_nameと同じ） | 山田 太郎 |
| `{{email}}` | 申込者のメールアドレス（to_emailと同じ） | example@example.com |
| `{{phone}}` | 申込者の電話番号 | 090-1234-5678 |
| `{{company}}` | 申込者の会社名 | 株式会社〇〇 または （未記入） |
| `{{date}}` | 参加希望日 | 2025年12月19日(火) |
| `{{message}}` | ご質問・ご要望 | 初めて参加します。 または （未記入） |

### 4. HTMLテンプレート内容

以下のHTMLをEmailJSの「Content」タブに貼り付けてください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お申し込みありがとうございます</title>
</head>
<body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #FFB7C5 0%, #FFC0CB 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">北上市倫理法人会</h1>
    <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">ゲスト参加申し込み受付完了</p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      {{to_name}} 様
    </p>
    
    <p style="font-size: 14px; line-height: 1.8;">
      この度は、北上市倫理法人会の経営者モーニングセミナーへのゲスト参加をお申し込みいただき、誠にありがとうございます。<br>
      以下の内容で受付いたしました。
    </p>
    
    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="font-size: 16px; color: #FF69B4; margin-top: 0; border-bottom: 2px solid #FFB7C5; padding-bottom: 10px;">お申し込み内容</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 120px;">お名前</td>
          <td style="padding: 8px 0;">{{name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">会社名</td>
          <td style="padding: 8px 0;">{{company}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">メールアドレス</td>
          <td style="padding: 8px 0;">{{email}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">電話番号</td>
          <td style="padding: 8px 0;">{{phone}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">参加希望日</td>
          <td style="padding: 8px 0;">{{date}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">ご質問・ご要望</td>
          <td style="padding: 8px 0;">{{message}}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #fff9e6; padding: 15px; border-left: 4px solid #FFB7C5; margin: 20px 0;">
      <h3 style="font-size: 14px; margin: 0 0 10px 0; color: #FF69B4;">開催情報</h3>
      <p style="margin: 5px 0; font-size: 13px;"><strong>日時:</strong> 毎週火曜日 朝6:00〜7:00</p>
      <p style="margin: 5px 0; font-size: 13px;"><strong>会場:</strong> ㈱南部家敷 本社 研修所八光館</p>
      <p style="margin: 5px 0; font-size: 13px;"><strong>住所:</strong> 北上市常盤台４丁目１－１２１</p>
    </div>
    
    <p style="font-size: 13px; line-height: 1.8; color: #666;">
      当日は開始時刻の10分前までにお越しください。<br>
      ご不明な点がございましたら、お気軽にお問い合わせください。<br>
      皆様のご参加を心よりお待ちしております。
    </p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
    
    <div style="font-size: 12px; color: #999; text-align: center;">
      <p style="margin: 5px 0;">一般社団法人倫理研究所 北上市倫理法人会</p>
      <p style="margin: 5px 0;">このメールは自動送信されています。</p>
    </div>
  </div>
</body>
</html>
```

### 5. テストメール送信

テンプレート作成後、「Test it」ボタンをクリックして、以下のテストデータで動作確認を行ってください。

```json
{
  "to_email": "your-email@example.com",
  "to_name": "山田 太郎",
  "from_name": "北上市倫理法人会",
  "name": "山田 太郎",
  "email": "your-email@example.com",
  "phone": "090-1234-5678",
  "company": "株式会社テスト",
  "date": "2025年12月19日(火)",
  "message": "初めて参加します。よろしくお願いいたします。"
}
```

### 6. テンプレートIDの確認

テンプレート保存後、テンプレート一覧ページでテンプレートIDを確認してください。
このIDは既に環境変数 `VITE_EMAILJS_TEMPLATE_ID` に設定済みです。

## トラブルシューティング

### メールが届かない場合

1. **スパムフォルダを確認**: 確認メールがスパムフォルダに振り分けられていないか確認してください。
2. **Email Serviceの設定確認**: EmailJSダッシュボードの「Email Services」で、使用しているサービスが正しく接続されているか確認してください。
3. **送信制限の確認**: EmailJSの無料プランには月間送信数の制限があります。ダッシュボードで使用状況を確認してください。

### 変数が正しく表示されない場合

- テンプレート内の変数名が `{{変数名}}` の形式で正しく記述されているか確認してください。
- 変数名のスペルミスがないか確認してください（例: `{{to_name}}` を `{{toName}}` と書いていないか）。

## 管理者通知メールの追加（オプション）

申込者への確認メールとは別に、事務局側にも通知を送りたい場合は、以下の手順で2つ目のテンプレートを作成してください。

1. 新しいテンプレートを作成
2. **Template Name**: `北上市倫理法人会 - 新規申し込み通知（管理者用）`
3. **Subject**: `【新規申し込み】{{name}}様からゲスト参加申し込みがありました`
4. **To Email**: 事務局のメールアドレス（固定値）を直接入力

その後、`Contact.tsx` のコードを修正して、2つのメール送信を行うように実装する必要があります。

## 注意事項

- EmailJSの無料プランは月間200通までの送信制限があります。有料プランへのアップグレードをご検討ください。
- テンプレートの変更は即座に反映されますが、ブラウザのキャッシュをクリアしてから動作確認することをお勧めします。
