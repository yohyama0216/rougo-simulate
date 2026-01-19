# GitHub Pages セットアップガイド

## 🚨 重要：GitHub Pagesを有効にする必要があります

このリポジトリをGitHub Pagesで公開するには、**リポジトリの設定でGitHub Pagesを有効にする必要があります**。

## エラーメッセージ

以下のようなエラーが出る場合、GitHub Pagesが有効になっていないか、正しく設定されていません：

```
Error: Failed to create deployment (status: 404)
Ensure GitHub Pages has been enabled: https://github.com/yohyama0216/rougo-simulate/settings/pages
```

## セットアップ手順

### 1. GitHub Pages を有効化する

1. **リポジトリのページを開く**
   - https://github.com/yohyama0216/rougo-simulate

2. **Settings タブをクリック**
   - リポジトリのトップページで「Settings」タブをクリックします

3. **Pages セクションに移動**
   - 左側のメニューから「Pages」を選択します

4. **Build and deployment を設定**
   - **Source**: ドロップダウンメニューから **"GitHub Actions"** を選択
   - **"Deploy from a branch"** ではなく、**"GitHub Actions"** を選択してください

5. **保存**
   - 設定を保存します（自動的に保存されます）

### 2. ワークフローを実行

GitHub Pagesを有効にした後：

1. **main ブランチに push する**
   - または、GitHub の Actions タブで「Deploy to GitHub Pages」ワークフローを手動実行

2. **デプロイの確認**
   - Actions タブでワークフローの実行状況を確認
   - 成功すると、以下のURLでアクセスできます：
     - https://yohyama0216.github.io/rougo-simulate/

## よくある問題

### 問題1: 404 エラーが表示される

**原因**: GitHub Pages が有効になっていない

**解決方法**: 上記の「セットアップ手順」を実行してください

### 問題2: "Deploy from a branch" が選択されている

**原因**: Source が正しく設定されていない

**解決方法**: Source を **"GitHub Actions"** に変更してください

### 問題3: ワークフローは成功するが、サイトが表示されない

**原因**: デプロイには数分かかる場合があります

**解決方法**: 5-10分待ってから再度アクセスしてください

## 確認方法

GitHub Pages が正しく設定されているか確認するには：

1. リポジトリの Settings → Pages を開く
2. 「Your site is live at https://yohyama0216.github.io/rougo-simulate/」のようなメッセージが表示されているか確認

## 注意事項

⚠️ **リポジトリの設定は、リポジトリの管理者権限が必要です**

- この設定はコードでは変更できません
- リポジトリのオーナーまたは管理者が手動で設定する必要があります
- 一度設定すれば、以降は自動デプロイが機能します

## サポート

設定に問題がある場合は、以下を確認してください：

1. リポジトリの管理者権限があるか
2. Settings → Pages で "GitHub Actions" が選択されているか
3. Actions タブでワークフローが実行されているか

詳細は [GitHub Pages のドキュメント](https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) を参照してください。
