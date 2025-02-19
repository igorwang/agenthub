module.exports = {
  input: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
  ],
  output: "./",
  options: {
    debug: true,
    func: {
      list: ["i18next.t", "i18n.t", "t", "useTranslations()"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    lngs: ["en", "hk", "zh"],
    ns: [""],
    defaultLng: "en",
    defaultNs: "",
    defaultValue: function (lng, ns, key, options) {
      console.log("options", options);
      if (options && options.defaultValue) {
        return options.defaultValue;
      }
      return key;
    },
    resource: {
      loadPath: "messages/{{lng}}.json",
      savePath: "messages/{{lng}}.json",
      jsonIndent: 2,
      lineEnding: "\n",
    },
    nsSeparator: false,
    keySeparator: false,
    removeUnusedKeys: true,
    sort: true,
  },
};
