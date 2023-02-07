const reactAppRewirePostcss = require("react-app-rewire-postcss");
const postcssColorMod = require("postcss-color-mod-function");

module.exports = function override(config) {
  config.module.rules.push({
    test: /froala_editor\.pkgd\.min\.css$/,
    loader: "string-replace-loader",
    options: {
      search: /fill-available/g,
      replace: "stretch",
    },
  });
  reactAppRewirePostcss(config, {
    plugins: () => [postcssColorMod(/* pluginOptions */)],
  });
  return config;
};
