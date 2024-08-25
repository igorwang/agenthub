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
      list: ["i18next.t", "i18n.t", "t"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    lngs: ["en", "zh", "hk"],
    ns: ["translation"],
    defaultLng: "en",
    defaultNs: "translation",
    defaultValue: function (lng, ns, key) {
      return { ns: key };
    },
    resource: {
      loadPath: "messages/{{lng}}.json",
      savePath: "messages/{{lng}}.json",
      jsonIndent: 2,
      lineEnding: "\n",
    },
    nsSeparator: false,
    keySeparator: false,
  },
};
