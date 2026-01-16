# GitHub Pages デプロイエラー解決方法（クイックガイド）

## 🚨 エラー内容

```
Error: Failed to create deployment (status: 404)
Ensure GitHub Pages has been enabled
```

## ✅ 解決方法（3ステップ）

### 1️⃣ リポジトリの Settings を開く

https://github.com/yohyama0216/rougo-simulate/settings/pages

### 2️⃣ Source を "GitHub Actions" に設定

- 左メニューの「Pages」をクリック
- "Build and deployment" セクションを見つける
- **Source** のドロップダウンから **"GitHub Actions"** を選択
- ❌ "Deploy from a branch" ではありません

### 3️⃣ ワークフローを再実行

- Actions タブで失敗したワークフローを開く
- "Re-run all jobs" をクリック

## 📖 詳細情報

詳しい手順とトラブルシューティングは以下を参照：
- [GITHUB_PAGES_SETUP.md](../GITHUB_PAGES_SETUP.md)
- [README.md のデプロイセクション](../README.md)

## ⚠️ 注意

- この設定は**コードでは変更できません**
- リポジトリの**管理者権限**が必要です
- 設定は一度だけ行えば、以降は自動デプロイされます
