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