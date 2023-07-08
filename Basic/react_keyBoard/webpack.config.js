const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlwebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerplugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js", //진입점
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"), //절대 경로로 설정
    clean: true, //기존에 있을 경우 지우고 새로 만든다는 뜻
  }, //빌드를 했을 때 번들되는 파일
  devtool: "source-map", //빌드한 파일과 원본 파일을 서로 연결시켜줌
  mode: "development", //개발 모드로 진행한다는 뜻
  devServer: {
    host: "localhost",
    port: 8080,
    open: true, //웹팩 브라우저를 실행할 때마다 새 창을 열어라
    watchFiles: "index.html", //이 파일이 변화가 있을 때마다 리로드를 해줘라
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: "keyboard", //웹 타이틀
      template: "./index.html",
      inject: "body", //자바스크립트 파일을 어디에 넣을 것인지?
      favicon: "./favicon.png",
    }),
    new MiniCssExtractPlugin({ filename: "style.css" }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/, //css파일을
        use: [MiniCssExtractPlugin.loader, "css-loader"], //해당 로더를 사용해서 읽겠다는 뜻
      },
    ],
  },
  optimization: { //압축 플러그인 npm으로 설치해야함
    minimizer: [
      new TerserWebpackPlugin(), //얘를 통해서 js를 압축
      new CssMinimizerplugin(), //css를 압축시켜줌
    ],
  },
};
