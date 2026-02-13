# デザインリファレンス: Simeon Griggs Portfolio

このドキュメントは、https://www.simeongriggs.dev/ のデザイン分析結果をまとめたものです。
このポートフォリオサイトに取り入れるべきデザイン要素とパターンを言語化しています。

## 📋 目次

1. [デザインフィロソフィー](#デザインフィロソフィー)
2. [カラーシステム](#カラーシステム)
3. [タイポグラフィ](#タイポグラフィ)
4. [レイアウトシステム](#レイアウトシステム)
5. [コンポーネントデザイン](#コンポーネントデザイン)
6. [アニメーション・インタラクション](#アニメーションインタラクション)
7. [レスポンシブデザイン](#レスポンシブデザイン)
8. [技術スタック](#技術スタック)

---

## デザインフィロソフィー

### コアプリンシパル

- **ミニマリスト・アプローチ**: 情報を明確に伝えることを最優先し、装飾的要素を最小限に抑える
- **コンテンツファースト**: コンテンツが主役であり、デザインはそれを引き立てる役割
- **プロフェッショナルでありながら親しみやすい**: 技術的な信頼性と人間味のバランス
- **パフォーマンス重視**: 画像最適化、レスポンシブイメージ、LazyLoadingなど

### デザインキーワード

- Clean（クリーン）
- Modern（モダン）
- Accessible（アクセシブル）
- Content-Focused（コンテンツ中心）

---

## カラーシステム

### ライト/ダークモード対応

サイトは完全なライト/ダークモード切り替えに対応しています。

#### ライトモードパレット

```css
/* 背景色 */
--background: #f5f5f5;  /* オフホワイト/クリーム系 */
--surface: #ffffff;     /* 純白 - カード背景など */

/* テキスト色 */
--text-primary: #1a1a1a;    /* ダークチャコール - メインテキスト */
--text-secondary: #666666;  /* グレー - セカンダリテキスト */
--text-tertiary: #999999;   /* ライトグレー - 補助情報 */

/* アクセント色 */
--accent-primary: #3b82f6;  /* サブトルブルー/ティール - リンク、CTAなど */
--accent-hover: #2563eb;    /* ホバー時の濃いめのブルー */
```

#### ダークモードパレット

```css
/* 背景色 */
--background: #0a0a0a;      /* ダークブラック */
--surface: #1a1a1a;         /* ダークグレー - カード背景など */

/* テキスト色 */
--text-primary: #f5f5f5;    /* オフホワイト - メインテキスト */
--text-secondary: #a3a3a3;  /* ライトグレー - セカンダリテキスト */
--text-tertiary: #737373;   /* ミドルグレー - 補助情報 */

/* アクセント色 */
--accent-primary: #60a5fa;  /* ライトブルー - リンク、CTAなど */
--accent-hover: #3b82f6;    /* ホバー時のブルー */
```

### カラー使用ルール

1. **コントラスト比の確保**: WCAG AA基準（4.5:1以上）を満たす
2. **アクセントカラーの控えめな使用**: リンクとCTAのみに使用
3. **グレースケールの活用**: 階層構造を表現するために複数のグレートーンを使い分ける
4. **境界線の最小化**: ボーダーよりも余白とコントラストで区切る

---

## タイポグラフィ

### フォントファミリー

```css
/* システムフォントスタック - パフォーマンス最適化 */
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif;

/* または、モダンな選択肢として */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
```

### タイポグラフィスケール

```css
/* フォントサイズ */
--text-xs: 0.75rem;    /* 12px - メタ情報、ラベル */
--text-sm: 0.875rem;   /* 14px - 小さめの本文 */
--text-base: 1rem;     /* 16px - 基本の本文 */
--text-lg: 1.125rem;   /* 18px - 大きめの本文 */
--text-xl: 1.25rem;    /* 20px - 小見出し */
--text-2xl: 1.5rem;    /* 24px - サブヘッディング */
--text-3xl: 1.875rem;  /* 30px - セクション見出し */
--text-4xl: 2.25rem;   /* 36px - ページタイトル */
--text-5xl: 3rem;      /* 48px - ヒーロー見出し */

/* フォントウェイト */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* 行間 */
--leading-tight: 1.25;    /* 見出し用 */
--leading-normal: 1.5;    /* 本文用 */
--leading-relaxed: 1.75;  /* 長文用 */
```

### タイポグラフィルール

1. **見出し階層の明確化**
   - H1: ページタイトル、最も重要（例: "Hello, internet!👋"）
   - H2: セクション見出し（例: "Blogs", "Talks"）
   - H3: サブセクション、カードタイトル

2. **本文テキスト**
   - 最大幅: 65-75文字（約700-800px）
   - 行間: 1.5-1.75
   - フォントサイズ: 16-18px

3. **リンク**
   - アンダーラインまたはカラー変更で明示
   - ホバー時に視覚的フィードバック

---

## レイアウトシステム

### グリッドシステム

```css
/* コンテナ */
--container-max-width: 1200px;  /* 最大幅 */
--container-padding: 2rem;      /* 左右のパディング */

/* ブレイクポイント */
--breakpoint-sm: 640px;   /* スマートフォン */
--breakpoint-md: 768px;   /* タブレット */
--breakpoint-lg: 1024px;  /* ラップトップ */
--breakpoint-xl: 1280px;  /* デスクトップ */
```

### スペーシングシステム

```css
/* 8pxベースのスペーシングシステム */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
```

### レイアウトパターン

#### 1. ヘッダー/ナビゲーション
- 固定ヘッダー（またはスティッキー）
- 左: ロゴ/ホームリンク
- 右: ソーシャルリンク、ダークモードトグル
- 高さ: 60-80px
- 背景: 半透明（backdrop-blur）または単色

#### 2. ヒーローセクション
- 大きめの画像（レスポンシブ、アスペクト比維持）
- シンプルな自己紹介テキスト
- 垂直方向の余白: 大きめ（96px以上）

#### 3. コンテンツフィルター
- 横並びのタブナビゲーション
- All / Blogs / Talks / Courses / YouTube / Guides
- アクティブ状態の明確な視覚表現
- スムーズなトランジション

#### 4. コンテンツグリッド
```css
/* デスクトップ: 3カラム */
.content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

/* タブレット: 2カラム */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* モバイル: 1カラム */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
```

---

## コンポーネントデザイン

### 1. コンテンツカード

```
┌─────────────────────────────────┐
│  [画像サムネイル]                │
│  (アスペクト比 16:9 or 4:3)      │
├─────────────────────────────────┤
│  [コンテンツタイプバッジ]         │
│  Blog / Talk / Course など        │
│                                 │
│  タイトル →                      │
│  (矢印インジケーター付き)         │
│                                 │
│  説明テキスト（2-3行）           │
│                                 │
│  日付 · メタ情報                 │
└─────────────────────────────────┘
```

#### スタイリング
```css
.content-card {
  /* 背景とボーダー */
  background: var(--surface);
  border-radius: 0.75rem; /* 12px */

  /* シャドウ（控えめ） */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  /* トランジション */
  transition: transform 0.2s, box-shadow 0.2s;

  /* ホバー効果 */
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.content-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 0.75rem 0.75rem 0 0;
}

.content-card__badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  background: var(--accent-primary);
  color: white;
  border-radius: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.content-card__title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 0.5rem;

  /* 矢印インジケーター */
  &::after {
    content: " →";
    transition: transform 0.2s;
    display: inline-block;
  }

  &:hover::after {
    transform: translateX(4px);
  }
}

.content-card__description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
  /* 3行で切り捨て */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-card__meta {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-top: 1rem;
}
```

### 2. ダークモードトグル

```css
.dark-mode-toggle {
  /* ボタンスタイル */
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s;

  /* アイコン */
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--surface);
    border-color: var(--text-secondary);
  }

  /* アクティブ状態 */
  &:active {
    transform: scale(0.95);
  }
}
```

### 3. ナビゲーションタブ

```css
.nav-tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--text-tertiary);
}

.nav-tab {
  padding: 0.75rem 1rem;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--text-primary);
  }

  /* アクティブ状態 */
  &[aria-selected="true"] {
    color: var(--accent-primary);
    border-bottom-color: var(--accent-primary);
  }
}
```

---

## アニメーション・インタラクション

### トランジション原則

1. **速度**: 速すぎず遅すぎず（150-300ms）
2. **イージング**: ease-out または ease-in-out
3. **対象**: transform と opacity のみ（パフォーマンス重視）

### アニメーション例

```css
/* ホバーアニメーション */
.hover-lift {
  transition: transform 0.2s ease-out;
}
.hover-lift:hover {
  transform: translateY(-4px);
}

/* フェードイン（ページロード時） */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

/* スムーススクロール */
html {
  scroll-behavior: smooth;
}

/* リンクホバー */
a {
  color: var(--accent-primary);
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.2s;
}
a:hover {
  text-decoration-color: currentColor;
}
```

### インタラクティブ要素

- **矢印インジケーター (→)**: ホバー時に右に移動
- **カード**: ホバー時にリフト効果 + シャドウ強調
- **ボタン**: ホバー時に背景色変更、アクティブ時にスケールダウン
- **画像**: LazyLoad + BlurHashプレースホルダー

---

## レスポンシブデザイン

### ブレイクポイント戦略

```css
/* Mobile First アプローチ */

/* Base: モバイル (< 640px) */
.container {
  padding: 1rem;
}

/* Small: 640px以上 */
@media (min-width: 640px) {
  .container {
    padding: 1.5rem;
  }
}

/* Medium: 768px以上（タブレット） */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large: 1024px以上（ラップトップ） */
@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* XLarge: 1280px以上（デスクトップ） */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### レスポンシブ画像

```html
<!-- Sanity CDN スタイル画像最適化 -->
<img
  src="https://cdn.sanity.io/images/[project]/[dataset]/[image-id]-800x260.jpg?w=800&h=260&dpr=2&auto=format"
  srcset="
    https://cdn.sanity.io/images/.../[image-id].jpg?w=400&dpr=1 400w,
    https://cdn.sanity.io/images/.../[image-id].jpg?w=800&dpr=1 800w,
    https://cdn.sanity.io/images/.../[image-id].jpg?w=1200&dpr=1 1200w
  "
  sizes="
    (max-width: 768px) 100vw,
    (max-width: 1200px) 50vw,
    33vw
  "
  alt="[descriptive alt text]"
  loading="lazy"
/>
```

### BlurHash プレースホルダー

```css
.image-container {
  position: relative;
  background: linear-gradient(
    to bottom right,
    #V69tJv, /* BlurHash から生成されたグラデーション */
    #00D%xu
  );
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 画像読み込み完了時にフェードイン */
  opacity: 0;
  transition: opacity 0.3s;
}

.image-container img.loaded {
  opacity: 1;
}
```

---

## 技術スタック

### フロントエンド

- **フレームワーク**: React 19 + Remix（またはNext.js）
- **スタイリング**: Tailwind CSS
- **ビルドツール**: Vite
- **ルーティング**: React Router v6
- **言語**: TypeScript

### バックエンド/CMS

- **CMS**: Sanity.io
  - プロジェクトID: `az8av6xl`
  - Dataset: `production`
  - API Version: `2023-10-01`

### 画像最適化

- Sanity CDN による自動最適化
- パラメータ:
  - `w`, `h`: 幅と高さ
  - `dpr`: デバイスピクセル比（2x対応）
  - `auto=format`: 自動フォーマット選択（WebP等）
  - `rect`: 切り抜き領域指定

### パフォーマンス最適化

1. **LazyLoading**: 画像の遅延読み込み
2. **BlurHash**: プレースホルダー画像
3. **Code Splitting**: ルート単位での分割読み込み
4. **SSR/SSG**: サーバーサイドレンダリング/静的生成
5. **System Fonts**: カスタムフォント読み込みの回避

---

## 実装チェックリスト

このポートフォリオに取り入れるべき要素:

### 必須要素
- [ ] ライト/ダークモード切り替え機能
- [ ] レスポンシブグリッドレイアウト（1/2/3カラム）
- [ ] コンテンツカードコンポーネント
- [ ] コンテンツフィルタリングシステム
- [ ] 矢印インジケーター付きリンク
- [ ] ホバーアニメーション（リフト効果）
- [ ] レスポンシブ画像最適化
- [ ] システムフォント使用

### 推奨要素
- [ ] BlurHashプレースホルダー
- [ ] スムーススクロール
- [ ] メタ情報表示（日付、カテゴリ）
- [ ] ソーシャルリンク
- [ ] アクセシビリティ対応（ARIA属性）
- [ ] SEO最適化（メタタグ）

### オプション要素
- [ ] コンテンツ検索機能
- [ ] タグフィルタリング
- [ ] ページネーション
- [ ] アニメーション付きページ遷移
- [ ] プログレッシブ画像読み込み

---

## デザイントークン（CSS変数定義例）

```css
:root {
  /* Colors - Light Mode */
  --color-bg: #f5f5f5;
  --color-surface: #ffffff;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-tertiary: #999999;
  --color-accent: #3b82f6;
  --color-accent-hover: #2563eb;

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Layout */
  --container-max: 1200px;
  --border-radius: 0.75rem;

  /* Transitions */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
}

[data-theme="dark"] {
  --color-bg: #0a0a0a;
  --color-surface: #1a1a1a;
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a3a3a3;
  --color-text-tertiary: #737373;
  --color-accent: #60a5fa;
  --color-accent-hover: #3b82f6;
}
```

---

## 参考リンク

- **サイトURL**: https://www.simeongriggs.dev/
- **技術スタック**: React, Remix, Sanity, Tailwind CSS
- **デザイントレンド**: [2026 Typography Trends](https://wannathis.one/blog/top-typography-trends-2026-for-designers)

---

**最終更新**: 2026-02-14
**作成者**: Claude Code
**バージョン**: 1.0
