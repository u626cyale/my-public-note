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
      Plugin.CrawlLinks({
      // 必须使用"relative"而不是"shortest"，否则子路径下的链接会丢失前缀
      markdownLinkResolution: "relative",
      // 开启懒加载优化性能
      lazyLoad: true,
      }),
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