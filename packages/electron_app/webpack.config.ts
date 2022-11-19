/** エディタで補完を効かせるために型定義をインポート */
import { Configuration } from "webpack";

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
// 共通設定
const common: Configuration = {
  // モジュール解決に参照するファイル拡張子
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  /**
   * macOS でビルドに失敗する場合のワークアラウンド
   * https://github.com/yan-foto/electron-reload/issues/71
   */
  externals: ["fsevents"],
  // 出力先：デフォルトは 'dist'
  output: {
    // webpack@5 + electron では必須の設定
    publicPath: "./",
    // 画像などのアセット類は 'dist/assets' フォルダへ配置する
    assetModuleFilename: "assets/[name][ext]",
  },
  module: {
    // ファイル種別ごとのコンパイル & バンドルのルール
    rules: [
      {
        /**
         * 拡張子 '.ts' または '.tsx' （正規表現）のファイルを 'ts-loader' で処理
         * ただし node_modules ディレクトリは除外する
         */
        test: /\.tsx?$/,
        exclude: [/node_modules/, /solid_frontend/],
        loader: "ts-loader",
      },
      {
        // 拡張子 '.css' （正規表現）のファイル
        test: /\.css$/,
        // use 配列に指定したローダーは *最後尾から* 順に適用される
        // セキュリティ対策のため style-loader は使用しない
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        // 画像やフォントなどのアセット類
        test: /\.(ico|png|svg|eot|woff?2?)$/,
        /**
         * アセット類も同様に asset/inline は使用しない
         * なお、webpack@5.x では file-loader or url-loader は不要になった
         */
        type: "asset/resource",
      },
    ],
  },
};

// メインプロセス向け設定
const main: Configuration = {
  // 共通設定を読み込み
  ...common,
  target: "electron-main",
  // エントリーファイル（チャンク名の 'main.js' として出力される）
  entry: {
    main: path.resolve(__dirname, "src/index.ts"),
  },
};

// preloadスクリプト向け設定
const preload: Configuration = {
  ...common,
  target: "electron-preload",
  entry: {
    preload: path.resolve(__dirname, "src/preload.ts"),
  },
};

// rendererプロセス向け設定
const renderer: Configuration = {
  ...common,
  // セキュリティ対策として 'electron-renderer' ターゲットは使用しない
  target: "web",
  entry: {
    // React アプリのエントリーファイル
    app: path.resolve(__dirname, "src/web/index.tsx"),
  },
  plugins: [
    // CSS を JS へバンドルせず別ファイルとして出力するプラグイン
    new MiniCssExtractPlugin(),
    /**
     * バンドルしたJSファイルを <script></scrip> タグとして差し込んだ
     * HTMLファイルを出力するプラグイン
     */
    new HtmlWebpackPlugin({
      // テンプレート
      template: path.resolve(__dirname, "src/web/index.html"),
    }),
  ],
};

module.exports = (env: NodeJS.ProcessEnv, argv: Configuration) => {
  if (argv.mode === "development") {
    main.devtool = "source-map";
    main.watch = true;

    preload.devtool = "source-map";
    preload.watch = true;

    renderer.devtool = "source-map";
    renderer.watch = true;
  }
  // 上記 3 つの設定を配列にしてデフォルト・エクスポート
  return [main, preload, renderer];
};
