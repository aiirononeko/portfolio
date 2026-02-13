# RYOTA / PORTFOLIO - Design Document

## 1. Design Concept

"CRT Technical Monitor" -- レトロなブラウン管モニターの技術画面を模したビジュアルの中に、ポートフォリオ情報を配置する。画面中央では3Dオブジェクトが静かに浮遊・回転し、両脇の情報パネルがハードウェアモニターのステータス表示のように並ぶ。装飾は抑え、情報密度とエフェクトの質感で見せるデザイン。

## 2. Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  RYOTA / PORTFOLIO                          (header 72px)│
├──────┬─────────────────────────────────┬────────────────┤
│      │                                 │                │
│ 210px│     Three.js Canvas (全面)       │  210px         │
│      │     TorusKnot 浮遊              │                │
│  左  │                                 │  右            │
│  サイド│    scanlines + dither overlay   │  サイド         │
│  バー │                                 │  バー          │
│      │                                 │                │
├──────┴─────────────────────────────────┴────────────────┤
│  Built with Bun + Three.js              (footer 72px)   │
└─────────────────────────────────────────────────────────┘
```

- 全体: `overflow: hidden` の固定レイアウト。スクロールなし
- Virtual Screen: ヘッダー/フッター/左右マージンで囲まれた領域に `1px solid rgba(0,0,0,0.08)` の細い境界線。CRTの表示領域を示す
- マージン: 上下72px、左右64px（1000px以下で上下40px、左右16px）

## 3. Layer Stack (z-index)

| z-index | Layer | Role |
|---------|-------|------|
| 0 | `#three-canvas` | WebGL 3Dシーン |
| 2 | `#overlay` | 情報パネル・ヘッダー・フッター（`pointer-events: none` で3Dと干渉しない） |
| 5 | `#sidebar-l`, `#sidebar-r` | パネル群（`pointer-events: auto` でリンククリック可） |
| 10 | `#exp-header` | タイトル表示 |
| 99 | `#dither` | ディザリングオーバーレイ |
| 100 | `#scanlines` | スキャンラインオーバーレイ |
| 9999 | `#loader` | 起動ローダー |

## 4. Color Palette

CSSカスタムプロパティで一元管理。彩度を抑えた寒色系。

| Variable | Hex | Usage |
|----------|-----|-------|
| `--teal` | `#2a6878` | パネルヘッダーテキスト |
| `--cyan` | `#1a6080` | プロジェクト名、dot indicator |
| `--green` | `#2a7858` | スキルバー、リンクアイコン、dot indicator |
| `--amber` | `#107090` | ローダー、経歴年表、ホバーアクセント |
| `--pink` | `#405898` | dot indicator |
| `--val` | `#111` | 強調テキスト（名前、タイトル） |
| `--txt-br` | `#333` | 本文テキスト |
| `--txt` | `#777` | 補助テキスト |
| `--dim` | `#aaa` | バー背景、テクノロジータグ |
| `--grid-dot` | `#e0e0e0` | 背景ドットグリッド |
| background | `#fff` | ページ背景 |

## 5. Typography

| Font | Variable | Usage |
|------|----------|-------|
| Share Tech Mono | `--fp`, `--fm` | パネルヘッダー、ローダー、年表、プロジェクト名、テクノロジータグ。テクニカルモニター感を演出 |
| Inter 300/400 | body `font-family` | 本文、フッタークレジット。可読性確保 |
| Press Start 2P | （読み込み済み、将来利用） | レトロゲーム風の極端なピクセルフォント |

フォントサイズは全体的に小さめ（8-16px）。`letter-spacing` を広めに取り、技術モニターの疎な表示を再現。

## 6. Visual Effects

### 6.1 Background - Dot Grid

```css
background:
    radial-gradient(circle, #e0e0e0 1px, transparent 1px) 0 0 / 24px 24px,
    #fff;
```

24pxグリッドで1pxの円形ドットを敷き詰め。方眼紙/エンジニアリングペーパーの質感。

### 6.2 Scanlines

```css
background: repeating-linear-gradient(
    0deg, transparent, transparent 3px,
    rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px
);
```

4pxごとに opacity 0.015 の水平線。CRTモニターの走査線を再現。極めて薄く、意識しないと見えないレベル。

### 6.3 Dithering Overlay

```css
background-image:
    repeating-conic-gradient(rgba(128,128,128,0.012) 0% 25%, transparent 0% 50%);
background-size: 4px 4px;
mix-blend-mode: overlay;
animation: dither-drift 10s linear infinite;
```

4x4pxのチェッカーパターンが10秒かけてゆっくりスライド。レトロゲーム機のディザリング描画を模倣。

### 6.4 Post-Processing (WebGL)

**Bloom (UnrealBloomPass):**
- strength: 0.15, radius: 0.3, threshold: 0.92
- 明るい部分にわずかな光のにじみ。CRTの蛍光体のglow感

**Pixel Dither Shader (Custom):**
- 4x4 Bayerマトリクスによる ordered dithering
- pixelSize: 2.0 でわずかにピクセル化
- 32段階の色量子化
- レトロハードウェアの限定カラーパレット感

**Tone Mapping:** AgX（フィルム調のソフトなコントラスト）

## 7. 3D Scene

### Object: TorusKnot

- **Geometry:** `TorusKnotGeometry(0.8, 0.25, 128, 32)` -- radius 0.8, tube 0.25
- **Solid mesh:** `MeshPhysicalMaterial` -- 半透明（opacity 0.06）、clearcoat 0.3、depthWrite off。ガラスのような存在感
- **Wireframe:** `EdgesGeometry` + `LineBasicMaterial` -- opacity 0.25、color #222。構造線が主要な可視要素

### Camera

- `PerspectiveCamera(FOV 24)` -- 望遠寄りで圧縮効果
- 初期位置: `(0, 0.5, 4.5)` -- やや上から見下ろし

### Controls (OrbitControls)

- auto-rotate: speed 0.5 -- 非常にゆっくりとした自動回転
- damping: 0.04 -- 慣性のある滑らかな操作感
- pan/zoom: disabled -- 視点の回転のみ許可
- polar angle: 0.3π - 0.62π -- 上下の回転角を制限

### Lighting

| Light | Color | Intensity | Position |
|-------|-------|-----------|----------|
| Ambient | `#405570`（冷たい青灰） | 2.0 | - |
| Key | `#c0d8f0`（明るい青白） | 2.5 | (3, 5, 6) |
| Fill | `#90a8c8`（柔らかい青） | 1.5 | (-4, 2, 4) |

全体的に寒色系のライティング。技術的・クリーンな印象。

### Animation

- **ボビング:** `y = 0.05 + sin(t * 0.7) * 0.025` -- ゆっくりした上下浮遊（振幅0.025）
- **回転:** `rotation.y = t * 0.15` -- 約42秒で1回転

## 8. Information Panels

### 左サイドバー

**SKILLS** (dot: green)
- 各行: スキル名（min-width 72px） + プログレスバー（高さ4px、green fill）
- バー背景: `--dim`（#aaa）、fill: `--green`（#2a7858）

**CAREER** (dot: amber)
- タイムライン形式: 左に `2px solid amber` のボーダーライン
- 年（9px, amber, monospace） → 職種（11px, val） → 会社名（10px, txt）

### 右サイドバー

**PROJECTS** (dot: cyan)
- カード形式: プロジェクト名（monospace, cyan, リンク） → 説明（10px, txt） → テクノロジータグ（8px, dim, monospace）
- 区切り: `1px solid rgba(0,0,0,0.04)` の極めて薄いボーダー
- ホバー: プロジェクト名が amber に変化

**LINKS** (dot: pink)
- 行形式: ▶アイコン（green） + ラベル（11px）
- ホバー: 行全体が amber に変化

### パネル共通

- 背景: transparent（背景のドットグリッド・3Dが透過）
- ボーダー: `1px solid rgba(0,0,0,0.06)` -- ほぼ見えない程度
- ヘッダー: monospace 10px + 4px円形dot indicator（pulse animation 2.5s）
- 幅: 210px（1000px以下で140px）

## 9. Animations

| Name | Duration | Timing | Usage |
|------|----------|--------|-------|
| blink | 1.2s | step-end | ローダーテキスト "INITIALIZING..." |
| pulse | 2.5s | ease-in-out | パネルヘッダーのdot indicator |
| dither-drift | 10s | linear | ディザリングオーバーレイのスライド |

## 10. Loader

白背景 → "RYOTA / PORTFOLIO"（amber, monospace, `letter-spacing 4px`）+ プログレスバー + "INITIALIZING..."（blink）。800ms後に opacity 0.8s で fadeout。

## 11. Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| > 1000px | フルレイアウト。サイドバー210px、マージン64px/72px |
| 768-1000px | サイドバー140px、マージン16px/40px、フォントサイズ縮小 |
| < 768px | サイドバー非表示、virtual-screen非表示。ヘッダー+3Dキャンバス+フッターのみ |

## 12. Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun (`Bun.serve()` + HTML imports) |
| 3D | Three.js (npm, Bun bundled) |
| Post-processing | EffectComposer + UnrealBloomPass + Custom ShaderPass |
| Styling | Vanilla CSS (CSS Custom Properties) |
| Deploy | Cloudflare Workers (static assets via wrangler) |
| Build | `bun build ./index.html --outdir ./dist` |