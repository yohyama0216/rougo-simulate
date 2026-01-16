# GitHub Pages デプロイエラーの修正について

## 問題の概要

GitHub Pagesへのデプロイが「404 Not Found」エラーで失敗しています。

**根本原因**: リポジトリの設定でGitHub Pagesが有効になっていないか、正しく設定されていません。

## 重要な注意事項

⚠️ **このエラーはコードでは修正できません**

GitHub Pagesの有効化は、リポジトリの管理者が手動で設定する必要があります。
このPRでは、エラーを修正するための**詳細な手順書と改善されたエラーメッセージ**を追加しました。

## リポジトリオーナーが行うべき操作

### 📋 設定手順（3ステップ）

1. **Settings → Pages に移動**
   - https://github.com/yohyama0216/rougo-simulate/settings/pages

2. **Source を設定**
   - "Build and deployment" セクションを見つける
   - **Source** を **"GitHub Actions"** に変更
   - ❌ "Deploy from a branch" ではありません

3. **ワークフローを再実行**
   - 設定後、Actions タブで失敗したワークフローを再実行

### ⏱️ 所要時間
約1〜2分で完了します。

## このPRで追加された内容

1. **詳細なセットアップガイド** (`GITHUB_PAGES_SETUP.md`)
   - ステップバイステップの手順
   - スクリーンショットの説明
   - よくある問題とその解決方法

2. **改善されたエラーメッセージ** (`.github/workflows/deploy.yml`)
   - デプロイ失敗時に明確なエラーメッセージを表示
   - 設定ページへの直リンクを提供
   - 具体的な修正手順を表示

3. **クイックリファレンスガイド** (`.github/PAGES_ERROR_FIX.md`)
   - 素早く問題を解決するための簡潔なガイド

4. **README更新**
   - デプロイセクションに目立つ警告を追加
   - セットアップガイドへのリンクを追加

## 設定後の動作

一度設定を行えば:
- ✅ `main` ブランチへのpushで自動デプロイされます
- ✅ 手動でワークフローを実行できます
- ✅ エラーは発生しません

## 確認方法

設定が正しく完了したかは以下で確認できます:

1. Settings → Pages を開く
2. "Your site is live at https://yohyama0216.github.io/rougo-simulate/" のようなメッセージが表示される
3. ワークフローを再実行してもエラーが出ない

## サポート

設定に問題がある場合は、以下のドキュメントを参照してください:
- [GITHUB_PAGES_SETUP.md](../GITHUB_PAGES_SETUP.md) - 詳細な手順
- [.github/PAGES_ERROR_FIX.md](./PAGES_ERROR_FIX.md) - クイックリファレンス
