# SNS App

X(旧Twitter)を参考にした、シンプルなSNSアプリです。
React・TypeScript・Supabaseを使い、認証からデータベース連携まで一通り実装しました。

## 🔗 デモ
https://sns-app-green-zeta.vercel.app

## 🛠 使用技術
- React / TypeScript
- React Router(ルーティング)
- Supabase(認証・データベース・Row Level Security)
- Vite
- Vercel(デプロイ)

## ✨ 実装した機能
- メール/パスワードによる認証(サインアップ・ログイン・ログアウト)
- 投稿の作成・削除
- いいね機能
- コメント機能
- プロフィール(ユーザー名)編集
- レスポンシブ対応のダークテーマUI

## 💡 工夫した点
- Supabaseのテーブル設計において、`posts`・`profiles`・`likes`・`comments`間の外部キー制約とRow Level Security(RLS)を設定し、自分のデータのみ操作できるよう設計
- コンポーネント単位でCSSファイルを分割し、保守性を意識したスタイリング
- クリックイベントの伝播(`stopPropagation`)を活用し、投稿一覧のクリック範囲といいね・削除ボタンの操作性を両立

## 📝 今後の課題
- 画像投稿機能の追加
- リアルタイム更新(Supabase Realtimeの活用)
- 通知機能