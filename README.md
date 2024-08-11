# Moments

**Moments** 是一个支持私有化部署的笔记系统，简洁、高效且注重隐私。

---

## ✨ 主要功能

### 🚀 一键私有部署（零成本）

按照教程可以一键部署到 Vercel 服务器，完全零成本运行。提供国内访问优化，体验可参考官方示例。

### 🔄 同步至 Twitter (X)

支持自动同步笔记内容至 Twitter，轻松实现多平台内容管理。（Coming Soon）

### 🖥️ 嵌入到个人博客

前端部分使用 Tailwind CSS 编写，可以方便地移植到您的个人博客中，实现无缝集成.

**示例**

- [Augusts's 自留地](https://www.augusts.me/guestbook/)。

### 🔒 强隐私保护

支持私有部署，确保您的笔记数据始终处于保护之下。

### 📂 完全数据导出

用户数据完全可导出，支持 JSON、CSV 等通用格式。不使用 HTML 导出，避免出现残缺数据的问题。

### 🧩 兼容 Flomo API

兼容 Flomo API，理论上支持所有 Flomo 插件，扩展性强。

## 🧱 Tech Stack

- 框架: [Next.js](https://nextjs.org/)
- 数据库: [Neon](https://neon.tech/)
- 样式: [Tailwind CSS](https://tailwindcss.com/)

## 🏗️ Deployment

1. Fork 本仓库
2. 在 Vercel 项目中关联您的 GitHub 仓库，并按照.env.example配置环境变量
3. 保存配置，坐下来等个几分钟，喝口咖啡，等待 Vercel 完成部署。
4. Voila！您的 Moments 已经上线。将感悟记录下来吧！
5. 自定义域名（可选）。

## 🔗 更新代码

参考 [Syncing a fork branch from the web UI](https://docs.github.com/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork#syncing-a-fork-branch-from-the-web-ui).

## 🚧 暂不支持

### 🛠️ 双链笔记

暂不支持双链笔记。由于开发者个人需求不大，暂未实现。如果您有需求，欢迎提交 PR 贡献此功能。

### 🛠️ 其他功能

- 磁贴墙
- 微信输入

这些功能目前视为锦上添花，暂不在当前开发计划中考虑。

---

如果您有任何问题或建议，欢迎提交 Issue 或 PR！