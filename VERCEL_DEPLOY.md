# Vercelデプロイガイド

このプロジェクトは、Vercelでのデプロイに最適化されています。

## プロジェクト構成

- **フロントエンド**: React 19 + Vite + Tailwind CSS 4
- **バックエンド**: Express.js + tRPC (Vercel Serverless Functions化)
- **データベース**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM

## Vercelデプロイ手順

### 1. GitHubリポジトリと連携

1. Vercelダッシュボードにログイン
2. 「New Project」をクリック
3. GitHubリポジトリ `shibata1850/kitakami-ethics-30thannvsite` を選択
4. 「Import」をクリック

### 2. プロジェクト設定

**Framework Preset**: `Other`（自動検出されない場合）

**Build Settings**:
- Build Command: `pnpm build`
- Output Directory: `client/dist`
- Install Command: `pnpm install`

**Root Directory**: `.` (プロジェクトルート)

### 3. 環境変数の設定

以下の環境変数を「Environment Variables」セクションに追加してください：

#### 必須の環境変数

```bash
# データベース接続
DATABASE_URL=postgres://postgres:BqWqmgGLpUsinjI6@db.gbkpiwrasfcxtodvtkah.supabase.co:6543/postgres

# 認証関連
JWT_SECRET=fCGRRab2W6AwwopSGzkFQd
OAUTH_SERVER_URL=https://api.manus.im
OWNER_NAME=柴田祥悦
OWNER_OPEN_ID=QzvPTzzjPANuXdxfCETL7h

# Manus Forge API
BUILT_IN_FORGE_API_KEY=V2WpwpCfrL8yRxNZBXJsSB
BUILT_IN_FORGE_API_URL=https://forge.manus.ai

# フロントエンド環境変数
VITE_APP_ID=6wEjUUtpZZxtduZT5pe4tU
VITE_APP_TITLE=北上市倫理法人会
VITE_APP_LOGO=https://files.manuscdn.com/user_upload_by_module/web_dev_logo/103074550/GdmSRMakvnZTqkde.png

# EmailJS
VITE_EMAILJS_PUBLIC_KEY=wtjc6XAlDueRsNgls
VITE_EMAILJS_SERVICE_ID=service_3t7tv5r
VITE_EMAILJS_TEMPLATE_ID=template_n5d6msw

# Manus Forge API (フロントエンド)
VITE_FRONTEND_FORGE_API_KEY=REW8v9SPGkfUKjFQdonCqT
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.ai

# OAuth認証
VITE_OAUTH_PORTAL_URL=https://manus.im

# アナリティクス
VITE_ANALYTICS_ENDPOINT=https://manus-analytics.com
VITE_ANALYTICS_WEBSITE_ID=ca07b31a-8db8-4503-be9c-2fc71172e106
```

**重要**: すべての環境変数を **Production**, **Preview**, **Development** 環境に追加してください。

### 4. デプロイ

「Deploy」ボタンをクリックしてデプロイを開始します。

### 5. デプロイ後の確認

- デプロイが完了したら、Vercelが提供するURLにアクセス
- ログイン機能（`/login`）をテスト
- 新規登録機能（`/register`）をテスト
- 管理画面（`/admin/dashboard`）へのアクセスをテスト

## トラブルシューティング

### ビルドエラーが発生する場合

1. 環境変数がすべて設定されているか確認
2. `DATABASE_URL`がPostgreSQL形式（`postgres://`で始まる）になっているか確認
3. Vercelのビルドログを確認

### APIエラーが発生する場合

1. `/api/health`エンドポイントにアクセスして、APIが動作しているか確認
2. ブラウザの開発者ツールでネットワークタブを確認
3. tRPCエンドポイント（`/api/trpc`）が正しく動作しているか確認

### データベース接続エラーが発生する場合

1. Supabaseのデータベースが起動しているか確認
2. `DATABASE_URL`の接続文字列が正しいか確認
3. Supabaseのファイアウォール設定でVercelのIPアドレスが許可されているか確認

## カスタムドメインの設定

1. Vercelダッシュボードで「Settings」→「Domains」に移動
2. カスタムドメインを追加
3. DNSレコードを設定（Vercelが指示を表示します）

## 自動デプロイ

GitHubの`main`ブランチにプッシュすると、自動的にVercelにデプロイされます。

## ローカル開発

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# 本番環境の起動（ローカル）
pnpm start
```

## サポート

問題が発生した場合は、Vercelのサポートまたはプロジェクト管理者に連絡してください。
