import antfu from "@antfu/eslint-config";

export default antfu({
  stylistic: {
    // 末尾支持分号
    semi: true,
    // 引号使用双引号
    quotes: "double",
  },
}, {
  rules: {
    "no-console": "off",
    "no-irregular-whitespace": "off",
    "vue/no-irregular-whitespace": "off", // 不允许空格
  },
});
