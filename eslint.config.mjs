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
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-unused-vars": ["off"],
    "@typescript-eslint/no-duplicate-enum-values": ["warn"],
    "@typescript-eslint/no-unnecessary-type-constraint": ["off"],
    "@typescript-eslint/no-this-alias": ["off"],
  },
});
