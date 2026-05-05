# 使用 VS Code + Quartz + GitHub Pages 方案搭建个人博客

✅ 完全免费
✅ 本地优先，数据完全可控
✅ 支持Obsidian风格的双链语法
✅ 自动部署，提交即发布
✅ 内置全文搜索、图谱视图、反向链接

## 一、目标
* GitHub 用户名 u626cyale 
* 博客本地保存文件夹 my-public-note
* 博客保存仓库名 my-public-note
* 博客最终访问地址 https://u626cyale.github.io/my-public-note/

## 二、环境准备
### 1. 安装必要软件
* Node.js 22+：Quartz 4.0 要求最低版本为 22
* Git版本控制及与 GitHub 同步
* VS Code：写作博客
* GitHub 账号u626cyale，创建博客保存仓库my-public-note

### 2. Quartz 项目初始化
克隆并初始化项目
```
# 克隆官方仓库
git clone https://github.com/jackyzha0/quartz.git my-public-note

# 进入项目目录
cd my-public-note

# 安装依赖
npm install

# 初始化Quartz
npx quartz create
```
初始化选项建议：
* 第一个选项：Empty Quartz（空项目）
* 第二个选项：Treat links as shortest path（适合双链写法）

### 3. 本地预览博客
```npx quartz build --serve --baseDir my-public-note```

## 三、核心配置文件
```
my-public-note/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions自动部署配置
├── .vscode/
│   ├── settings.json           # VS Code工作区设置
│   └── keybindings.json        # VS Code快捷键配置
├── content/
│   ├── 404.md                  # 404错误页面
│   ├── index.md                # 博客首页 必需
│   ├── about.md                # 关于页面
│   ├── posts/                  # 博客文章目录
│   ├── notes/                  # 学习笔记目录
│   └── assets/
│       └── images/             # 图片存储目录
├── quartz.config.ts            # Quartz核心配置
├── quartz.layout.ts            # Quartz布局配置
└── package.json
```
### 1. 修改quartz.config.ts
作用： 控制 Quartz 博客的全局行为、主题、插件和功能开关
```ts
// 导入Quartz配置类型和所有内置插件
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

// 导出全局配置对象
const config: QuartzConfig = {
  // ==============================================
  // 基础网站配置
  // ==============================================
  configuration: {
    // 网站标题，显示在浏览器标签页和页面左上角
    pageTitle: "u626cyale's Digital Garden",
    // 页面标题后缀，留空则只显示pageTitle
    pageTitleSuffix: "",
    // 启用单页应用模式，页面切换无刷新，体验更流畅
    enableSPA: true,
    // 启用链接悬停预览，鼠标放在双链上会弹出内容预览
    enablePopovers: true,
    // 网站统计，可选值：'plausible' | 'google' | null
    analytics: null,
    // 网站语言，影响日期格式、搜索分词等
    locale: "zh-CN",
    // ⚠️ 最重要的配置！必须和你的GitHub Pages地址完全一致
    // 格式：用户名.github.io/仓库名（不要加https://）
    baseUrl: "u626cyale.github.io/my-public-note",
    // 构建时忽略的文件/文件夹模式
    // 这些文件夹下的内容不会被发布到博客上
    ignorePatterns: ["private", "templates", ".obsidian", "**/node_modules"],
    // 默认使用的日期类型，可选：'created' | 'modified' | 'published'
    defaultDateType: "created",
    
    // ==============================================
    // 主题与样式配置
    // ==============================================
    theme: {
      // 字体来源，使用Google Fonts CDN加载
      fontOrigin: "googleFonts",
      // 启用CDN缓存，加速静态资源加载
      cdnCaching: true,
      // 字体配置
      typography: {
        header: "Inter",    // 标题字体
        body: "Inter",      // 正文字体
        code: "JetBrains Mono", // 代码块字体
      },
      // 颜色主题配置（浅色模式）
      colors: {
        lightMode: {
          light: "#faf8f8",       // 页面背景色
          lightgray: "#e5e5e5",   // 浅灰色（分割线、边框）
          gray: "#b8b8b8",        // 中灰色（次要文字）
          darkgray: "#4e4e4e",    // 深灰色（主要文字）
          dark: "#2b2b2b",        // 黑色（标题、强调文字）
          secondary: "#284b63",   // 主色调（链接、按钮）
          tertiary: "#84a59d",    // 辅助色（高亮、标签）
          highlight: "rgba(143, 159, 169, 0.15)", // 选中背景色
          textHighlight: "#fff23688", // ==高亮文本==的颜色
        },
        // 颜色主题配置（深色模式）
        darkMode: {
          light: "#161618",       // 页面背景色
          lightgray: "#393639",   // 浅灰色（分割线、边框）
          gray: "#646464",        // 中灰色（次要文字）
          darkgray: "#d4d4d4",    // 深灰色（主要文字）
          dark: "#ebebec",        // 白色（标题、强调文字）
          secondary: "#7b97aa",   // 主色调（链接、按钮）
          tertiary: "#84a59d",    // 辅助色（高亮、标签）
          highlight: "rgba(143, 159, 169, 0.15)", // 选中背景色
          textHighlight: "#b3aa0288", // ==高亮文本==的颜色
        },
      },
    },
  },

  // ==============================================
  // 插件系统配置
  // ==============================================
  plugins: {
    // 转换器：处理Markdown内容，将其转换为HTML
    transformers: [
      // 解析Markdown文件开头的YAML Frontmatter
      Plugin.FrontMatter(),
      // 自动获取文章的创建和修改日期（优先级：Frontmatter > Git记录 > 文件系统）
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      // 代码块语法高亮
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light", // 浅色模式代码主题
          dark: "github-dark",   // 深色模式代码主题
        },
        keepBackground: false, // 不保留代码块的原始背景色
      }),
      // 支持Obsidian风格的Markdown语法（双链、标签、高亮等）
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      // 支持GitHub风格的Markdown语法（任务列表、表格等）
      Plugin.GitHubFlavoredMarkdown(),
      // 自动生成文章目录
      Plugin.TableOfContents(),
      // 解析所有内部链接，处理双链和相对路径
      // markdownLinkResolution: "shortest" 表示使用最短路径解析链接
      // 例如：[[文章标题]] 会自动找到对应的文件，不需要写完整路径
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      // 从Frontmatter或文章开头提取描述，用于SEO和预览
      Plugin.Description(),
      // 支持LaTeX数学公式渲染（使用KaTeX引擎）
      Plugin.Latex({ renderEngine: "katex" }),
      // ⚠️ 已移除：Plugin.Mermaid() 不存在于当前版本
    ],

    // 过滤器：决定哪些文件会被发布
    filters: [
      // 过滤掉Frontmatter中 draft: true 的草稿文章
      Plugin.RemoveDrafts()
    ],

    // 发射器：生成最终的静态页面和资源
    emitters: [
      // 处理文章别名重定向
      Plugin.AliasRedirects(),
      // 生成组件所需的CSS和JS资源
      Plugin.ComponentResources(),
      // 生成普通内容页面
      Plugin.ContentPage(),
      // 生成文件夹索引页面（点击文件夹显示该文件夹下的所有文章）
      Plugin.FolderPage(),
      // 生成标签页面（点击标签显示所有该标签的文章）
      Plugin.TagPage(),
      // 生成内容索引，用于全文搜索、站点地图和RSS
      Plugin.ContentIndex({
        enableSiteMap: true, // 生成sitemap.xml，利于SEO
        enableRSS: true,     // 生成RSS订阅源
      }),
      // 复制静态资源（图片、CSS、JS等）到输出目录
      Plugin.Assets(),
      // 复制content目录下的非Markdown文件到输出目录
      Plugin.Static(),
      // 生成404页面
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
```

### 2. 修改quartz.layout.ts
作用： 控制页面的整体布局，决定哪些组件显示在什么位置
```ts
// 导入布局类型和所有内置组件
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// ==============================================
// 所有页面共享的组件
// ==============================================
export const sharedPageComponents: SharedLayout = {
  // 页面头部（HTML的<head>标签内容）
  head: Component.Head(),
  // 页面顶部导航栏（这里留空，内容放在left侧边栏）
  header: [],
  // ⚠️ 必须添加！所有页面共享的正文后组件（即使是空数组）
  afterBody: [],
  // 页面底部页脚
  footer: Component.Footer({
    // 页脚显示的链接
    links: {
      GitHub: "https://github.com/u626cyale",
      "数字花园": "https://u626cyale.github.io/my-public-note/",
    },
  }),
}

// ==============================================
// 内容页面布局（文章详情页）
// ==============================================
export const defaultContentPageLayout: PageLayout = {
  // 文章正文之前显示的组件
  beforeBody: [
    Component.Breadcrumbs(),    // 面包屑导航（显示当前页面的路径）
    Component.ArticleTitle(),   // 文章标题
    Component.ContentMeta(),    // 文章元信息（创建日期、阅读时间等）
    Component.TagList(),        // 文章标签列表
  ],
  // ⚠️ 必须添加！文章正文之后显示的组件（即使是空数组）
  afterBody: [],
  // 左侧边栏组件
  left: [
    Component.PageTitle(),      // 网站标题（左上角）
    Component.MobileOnly(Component.Spacer()), // 移动端的占位符
    Component.Search(),         // 全文搜索框
    Component.Darkmode(),       // 深色/浅色模式切换按钮
    // 桌面端显示的文件资源管理器
    Component.DesktopOnly(Component.Explorer({
      title: "📁 目录",         // 资源管理器标题
      folderClickBehavior: "link", // 点击文件夹跳转到文件夹索引页面
      // 文件排序方式：按文件名升序排列
      sortFn: (a, b) => {
        if (a.file && b.file) {
          return a.file.name.localeCompare(b.file.name)
        }
        return a.name.localeCompare(b.name)
      },
    })),
  ],
  // 右侧边栏组件
  right: [
    // 桌面端显示的文章目录
    Component.DesktopOnly(Component.TableOfContents()),
    // 知识图谱组件（显示文章之间的双链关系）
    Component.Graph({
      // 当前文章的局部图谱配置
      localGraph: {
        drag: true,             // 允许拖拽图谱
        zoom: true,             // 允许缩放图谱
        depth: 1,               // 显示与当前文章直接相连的节点
        scale: 1.1,             // 图谱初始缩放比例
        repelForce: 0.5,        // 节点之间的排斥力
        centerForce: 0.3,       // 节点向中心的吸引力
        linkDistance: 30,       // 节点之间的连线长度
        fontSize: 0.6,          // 节点标签字体大小
      },
      // 全局图谱配置
      globalGraph: {
        drag: true,
        zoom: true,
        depth: -1,              // 显示所有节点
        scale: 0.9,
        repelForce: 0.3,
        centerForce: 0.2,
        linkDistance: 20,
        fontSize: 0.5,
      },
    }),
    // 反向链接组件（显示哪些文章链接到了当前文章）
    Component.Backlinks(),
  ],
}

// ==============================================
// 列表页面布局（标签页、文件夹页）
// ==============================================
export const defaultListPageLayout: PageLayout = {
  // 页面正文之前显示的组件
  beforeBody: [
    Component.Breadcrumbs(),    // 面包屑导航
    Component.ArticleTitle(),   // 页面标题
    Component.ContentMeta(),    // 页面元信息
  ],
  // ⚠️ 必须添加！页面正文之后显示的组件（即使是空数组）
  afterBody: [],
  // 左侧边栏组件
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer({
      title: "📁 目录",
      folderClickBehavior: "link",
      sortFn: (a, b) => {
        if (a.file && b.file) {
          return a.file.name.localeCompare(b.file.name)
        }
        return a.name.localeCompare(b.name)
      },
    })),
  ],
  // 右侧边栏组件
  right: [
    // 知识图谱组件
    Component.Graph({
      localGraph: {
        drag: true,
        zoom: true,
        depth: 1,
        scale: 1.1,
        repelForce: 0.5,
        centerForce: 0.3,
        linkDistance: 30,
        fontSize: 0.6,
      },
      globalGraph: {
        drag: true,
        zoom: true,
        depth: -1,
        scale: 0.9,
        repelForce: 0.3,
        centerForce: 0.2,
        linkDistance: 20,
        fontSize: 0.5,
      },
    }),
  ],
}

// ==============================================
// 向后兼容：也导出 defaultPageLayout
// ==============================================
export const defaultPageLayout: PageLayout = defaultContentPageLayout
```

### 3. 必需的内容页面
content/404.md（404 错误页面）
content/about.md（关于页面）
content/index.md（博客首页，必须有）

### 4. 配置.github/workflows/deploy.yml
作用：GitHub Actions 自动部署
```yml
# 工作流名称
name: Deploy Quartz site to GitHub Pages

# 触发条件：当main分支有代码推送时执行
on:
  push:
    branches:
      - main

# 工作流所需的权限
permissions:
  contents: read    # 读取仓库内容
  pages: write      # 写入GitHub Pages
  id-token: write   # 验证身份

# 并发控制：同一时间只运行一个部署任务
concurrency:
  group: "pages"
  cancel-in-progress: false

# 任务列表
jobs:
  # 构建任务：生成静态网站文件
  build:
    runs-on: ubuntu-22.04 # 运行环境：Ubuntu 22.04
    steps:
      # 步骤1：检出仓库代码
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 获取所有Git历史记录，用于生成文章修改日期
      
      # 步骤2：安装Node.js环境
      - uses: actions/setup-node@v4
        with:
          node-version: 22 # Quartz 4.0要求Node.js 22+
          cache: 'npm'     # 缓存npm依赖，加速后续构建
      
      # 步骤3：安装项目依赖
      - name: Install Dependencies
        run: npm ci # 使用package-lock.json安装精确版本的依赖
      
      # 步骤4：构建Quartz网站
      - name: Build Quartz
        run: npx quartz build # 生成静态文件到public目录
      
      # 步骤5：上传构建产物
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public # 上传public目录下的所有文件

  # 部署任务：将构建产物部署到GitHub Pages
  deploy:
    needs: build # 依赖build任务，必须等build完成后才能执行
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }} # 部署后的网站地址
    runs-on: ubuntu-latest
    steps:
      # 步骤1：部署到GitHub Pages
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 5. VS Code 工作区配置
#### 5.1 .vscode/settings.json
```json
{
  // ==============================================
  // Markdown All in One 插件配置
  // ==============================================
  "markdown.extension.toc.levels": "2..6", // 目录生成的标题级别（从h2到h6）
  "markdown.extension.toc.updateOnSave": true, // 保存文件时自动更新目录
  "markdown.extension.math.enabled": true, // 启用数学公式预览
  "markdown.extension.katex.macros": {}, // 自定义KaTeX宏

  // ==============================================
  // Paste Image 插件配置（最重要！解决图片路径问题）
  // ==============================================
  // 截图粘贴后保存的路径
  "pasteImage.path": "${projectRoot}/content/assets/images",
  // ⚠️ 图片引用前缀，必须包含仓库名！否则部署后图片无法显示
  "pasteImage.prefix": "/my-public-note/assets/images/",
  // 图片默认命名格式：年月日时分秒，避免重名
  "pasteImage.defaultName": "YYYY-MM-DD-HH-mm-ss",
  // 粘贴图片时不显示确认框，直接保存
  "pasteImage.showFilePathConfirmInputBox": false,

  // ==============================================
  // 文件显示配置
  // ==============================================
  "files.exclude": {
    "**/.git": true,         // 隐藏.git文件夹
    "**/node_modules": true, // 隐藏node_modules文件夹
    "**/public": true,       // 隐藏构建输出目录
    "**/.quartz": true,      // 隐藏Quartz缓存目录
    "**/.DS_Store": true     // 隐藏macOS系统文件
  },

  // ==============================================
  // 编辑器通用配置
  // ==============================================
  "editor.formatOnSave": true, // 保存时自动格式化
  "editor.wordWrap": "on",     // 自动换行
  "editor.rulers": [80],       // 显示80字符参考线

  // ==============================================
  // Markdown文件专属配置
  // ==============================================
  "[markdown]": {
    // 使用Markdown All in One作为默认格式化器
    "editor.defaultFormatter": "yzhang.markdown-all-in-one",
    // 在字符串中也启用自动补全（方便写双链和标签）
    "editor.quickSuggestions": {
      "other": "on",
      "comments": "on",
      "strings": "on"
    }
  },

  // ==============================================
  // 其他插件配置
  // ==============================================
  "gitlens.currentLine.enabled": false, // 关闭GitLens行内显示
  "gitlens.codeLens.enabled": false,    // 关闭GitLens代码透镜
  "cSpell.language": "en,zh-CN"         // 拼写检查支持英文和中文
}
```

#### 5.2 .vscode/keybindings.json
```json
[
  // 粘贴图片：Ctrl+Alt+V（最常用！截图后直接粘贴）
  {
    "key": "ctrl+alt+v",
    "command": "markdown.extension.editing.pasteImage",
    "when": "editorLangId == markdown"
  },
  // 生成目录：Ctrl+Alt+T
  {
    "key": "ctrl+alt+t",
    "command": "markdown.extension.toc.create",
    "when": "editorLangId == markdown"
  },
  // 切换Markdown预览：Ctrl+Shift+V
  {
    "key": "ctrl+shift+v",
    "command": "markdown.preview.toggle"
  },
  // 切换粗体：Ctrl+B
  {
    "key": "ctrl+b",
    "command": "markdown.extension.editing.toggleBold",
    "when": "editorLangId == markdown"
  },
  // 切换斜体：Ctrl+I
  {
    "key": "ctrl+i",
    "command": "markdown.extension.editing.toggleItalic",
    "when": "editorLangId == markdown"
  }
]
```

## 四、部署步骤
### 1. 首次初始化
执行以下命令初始化 Git 并推送代码：
```shell
# 初始化新仓库
git init
git add .
git commit -m "Initial commit with full working config"

# 关联远程仓库
git remote remove origin
git remote add origin https://github.com/u626cyale/my-public-note.git
git branch -M main
git push -u origin main
```

* 打开 GitHub 仓库页面 → Settings → Pages
* 在 "Source" 下拉菜单中选择 "GitHub Actions"
* 等待 3-5 分钟，访问 https://u626cyale.github.io/my-public-note/ 即可

### 2. 日常使用
```shell
# 本地预览博客（自动刷新）
npx quartz build --serve --baseDir my-public-not

# 提交新文章
git pull # 先拉取最新代码
git add .
git commit -m "添加新文章：文章标题"
git push # 自动触发部署
```
