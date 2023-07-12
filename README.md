# Vue 3 + TypeScript + Vite

```bash
# 使用pnpm管理包
npm install -g pnpm

# 使用vite创建项目
pnpm create vite

cd my-blog-ts
pnpm install
pnpm dev
```

```json
// 更改tsconfig.json
// https://stackoverflow.com/questions/75583055/
"moduleResolution": "node",
// "allowImportingTsExtensions": true,
```

```bash
# 配置eslint
pnpm install eslint -D

npx eslint --init
# You can also run this command directly using 'npm init @eslint/config'.
# Need to install the following packages:
#   @eslint/create-config@0.4.5
# Ok to proceed? (y) y
# √ How would you like to use ESLint? · problems
# √ What type of modules does your project use? · esm
# √ Which framework does your project use? · vue
# √ Does your project use TypeScript? · No / Yes
# √ Where does your code run? · browser
# √ What format do you want your config file to be in? · JavaScript
# The config that you've selected requires the following dependencies:

# @typescript-eslint/eslint-plugin@latest eslint-plugin-vue@latest @typescript-eslint/parser@latest
# √ Would you like to install them now? · No / Yes
# √ Which package manager do you want to use? · pnpm

pnpm install -D eslint-plugin-import eslint-plugin-vue eslint-plugin-node eslint-plugin-prettier eslint-config-prettier @babel/eslint-parser

# 更改 .eslintrc.cjs
# 增加 .eslintignore

# 补充功能1  package.json
"scripts": {
   # ...
   "lint": "eslint src",
   "fix": "eslint src --fix",
},

pnpm add sass sass-loader stylelint postcss postcss-scss postcss-html stylelint-config-prettier stylelint-config-recess-order stylelint-config-recommended-scss stylelint-config-standard stylelint-config-standard-vue stylelint-scss stylelint-order stylelint-config-standard-scss -D

# 增加 .stylelintrc.cjs
# 增加 .stylelintignore

# 补充功能2  package.json
"scripts": {
   # ...
   "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
   "lint:eslint": "eslint src/**/*.{ts,vue} --cache --fix",
   "lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix",
},

pnpm install -D husky

git init
git branch -m master main
git add .
git status # 检查是否同步了不必要的文件
git commit -m "initialize project"
git remote add origin git@github.com:Wenswell/my-blog-ts.git
git remote set-url origin git@github.com:Wenswell/my-blog-ts.git
git push -u origin main

git push

npx husky-init

# 更改 .husky/pre-commit

# ......
pnpm run format


pnpm add @commitlint/config-conventional @commitlint/cli -D

# 增加 commitlint.config.cjs

# 补充功能3  package.json
"scripts": {
   # ...
   "commitlint": "commitlint --config commitlint.config.cjs -e -V"
},

npx husky add .husky/commit-msg

# 更改 .husky/commit-msg

# ......
pnpm commitlint

# 新增 scripts/preinstall.js

# 补充功能4  package.json
"scripts": {
   # ...
   "preinstall": "node ./scripts/preinstall.js"
},
```

```ts
// 配置路径别名

// vite.config.ts
// export default defineConfig({
//   plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve("./src")
    }
  },
// })

// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": { //路径映射，相对于baseUrl
      "@/*": ["src/*"]
    }
  }
}
```
