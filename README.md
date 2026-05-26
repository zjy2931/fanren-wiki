# 凡人万物志 · 道友共修

社区共建的《凡人修仙传》动画百科。道友们共同提交词条内容，以投票沉淀最可信的版本。

水墨为底、金线勾勒、朱砂点睛——如翻开一卷会呼吸的修仙札记。

线上地址：[fanren-wiki.fanr.workers.dev](https://fanren-wiki.fanr.workers.dev)

## 功能

- **四大分类**：法宝、功法、人物、剧情
- **社区投票**：描述、图片、视频、头像均支持多候选版本，投票排序
- **头像系统**：多人上传候选头像，票数最高自动成为词条封面
- **图片双来源**：支持粘贴 URL 或直接上传文件（本地存磁盘，线上存 KV）
- **道友令认证**：持令道友可删除词条和不当内容
- **水墨修仙风**：深墨底色、金线分隔、朱砂 / 碧玉 / 青石配色

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 适配器 | @opennextjs/cloudflare |
| UI | React 19 + TypeScript + Tailwind CSS 4 |
| 图标 | Lucide Icons |
| 部署 | Cloudflare Workers + D1 + KV |
| 本地存储 | JSON 文件 + 本地磁盘 |

> **重要：Next.js 必须用 15.x，不能用 16.x。**
> `@opennextjs/cloudflare` 目前不支持 Next.js 16（`ComponentMod.handler is not a function`），
> 详见 [issue #1258](https://github.com/opennextjs/opennextjs-cloudflare/issues/1258)。

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 部署到 Cloudflare（免费）

### 前置条件

- [Cloudflare 账号](https://dash.cloudflare.com/sign-up)（免费，不需要绑卡）
- 安装依赖后运行 `npx wrangler login` 完成授权

### 步骤

```bash
# 1. 登录 Cloudflare
npx wrangler login

# 2. 创建 D1 数据库
npx wrangler d1 create fanren-wiki-db
# 复制输出中的 database_id，填入 wrangler.jsonc

# 3. 创建 KV 命名空间（图片存储）
npx wrangler kv namespace create IMAGES
# 复制输出中的 id，填入 wrangler.jsonc 的 kv_namespaces

# 4. 执行数据库迁移
npx wrangler d1 migrations apply fanren-wiki-db --remote

# 5. 导入示例数据（可选）
node scripts/seed.mjs | npx wrangler d1 execute fanren-wiki-db --remote --file=-

# 6. 部署
npm run deploy
```

### 免费额度

| 服务 | 免费额度 |
|------|----------|
| Workers | 10 万请求 / 天 |
| D1 | 5 GB 存储 + 500 万行读 / 天 |
| KV | 1 GB 存储 + 10 万读 / 天 |

### Cloudflare 资源 ID

| 资源 | 名称 | ID |
|------|------|-----|
| Worker | fanren-wiki | — |
| D1 数据库 | fanren-wiki-db | `fa476316-4bab-4282-8459-cd4b15b6e538` |
| KV 命名空间 | IMAGES | `e73db0007aa2406c862a098b22dacdc4` |

## 项目结构

```
fanren-wiki/
├── data/
│   ├── entries.json           # 词条数据（本地开发用）
│   ├── keys.json              # 道友令密钥（已 gitignore）
│   └── keys.example.json      # 密钥模板
├── migrations/
│   └── 0001_initial.sql       # D1 建表迁移
├── scripts/
│   └── seed.mjs               # 示例数据导入脚本
├── public/
│   ├── uploads/               # 本地开发图片上传目录
│   ├── _headers               # Cloudflare 静态资源缓存头
│   └── bg-compressed.mp4      # 首页视频背景（已 gitignore）
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/verify/   # 道友令验证
│   │   │   ├── entries/       # 词条 CRUD
│   │   │   ├── image/[...key]/# KV 图片读取（线上）
│   │   │   ├── upload/        # 文件上传（本地磁盘 / KV）
│   │   │   └── vote/          # 投票 + 提交候选
│   │   ├── category/[type]/   # 分类列表页
│   │   ├── entry/[id]/        # 词条详情页
│   │   ├── submit/            # 新建词条页
│   │   ├── globals.css        # 水墨主题样式
│   │   ├── layout.tsx
│   │   └── page.tsx           # 首页（视频背景）
│   ├── components/
│   │   ├── Navbar.tsx         # 导航栏 + 道友令弹窗
│   │   ├── EntryCard.tsx      # 词条卡片
│   │   ├── EntryDetailClient.tsx  # 词条详情客户端组件
│   │   ├── VoteList.tsx       # 通用投票列表
│   │   ├── SubmitModal.tsx    # 提交候选弹窗（图片支持 URL + 文件上传）
│   │   ├── SubmitEntryModal.tsx   # 新建词条弹窗
│   │   └── CategoryIcon.tsx   # 分类图标映射
│   ├── context/
│   │   └── AuthContext.tsx    # 道友令全局状态
│   ├── lib/
│   │   ├── types.ts           # 核心类型定义
│   │   ├── data.ts            # 数据层（D1 + JSON 双模式）
│   │   ├── auth.ts            # 密钥验证（D1 + JSON 双模式）
│   │   └── utils.ts           # 分类配色工具
│   └── types/
│       └── cloudflare.d.ts    # Cloudflare 类型存根（D1 / KV / R2）
├── wrangler.jsonc             # Cloudflare Workers 配置
├── open-next.config.ts        # OpenNext 适配配置
└── next.config.ts             # Next.js 配置
```

## 双模式架构

数据层通过 `getCloudflareContext()` 自动检测运行环境：

| 环境 | 数据库 | 图片存储 | 文件上传 |
|------|--------|----------|----------|
| 本地开发 (`npm run dev`) | `data/entries.json` | `public/uploads/` | 本地磁盘 |
| Cloudflare Workers | D1 (SQLite) | KV Namespace | KV（通过 `/api/image/...` 读取） |

图片上传流程：
1. 用户选择文件 → POST `/api/upload`
2. 本地：保存到 `public/uploads/`，返回 `/uploads/xxx.jpg`
3. 线上：保存到 KV（key=`img/xxx.jpg`），返回 `/api/image/img/xxx.jpg`
4. 图片 URL 存入词条数据（D1 或 JSON）

## 道友令

预置三把令牌，在导航栏「道友令」按钮输入即可激活：

| 令牌 | 持有者 |
|------|--------|
| `dao-you-ling-001` | 掌令使 |
| `dao-you-ling-002` | 副令使 |
| `dao-you-ling-003` | 巡山使 |

持令者可删除词条和不当候选内容。

## 脚本

```bash
npm run dev       # 本地开发服务器
npm run build     # 生产构建
npm run preview   # 本地 Workers 运行时预览
npm run deploy    # 构建并部署到 Cloudflare
npm run lint      # ESLint 检查
```

## 配色

| 用途 | 色值 | 说明 |
|------|------|------|
| 基底 | `#0c0a08` | 深墨 |
| 金线 | `#c9a24d` | 分隔线、强调 |
| 朱砂 | `#bf3b2e` | 剧情分类 |
| 碧玉 | `#5a9e8f` | 功法分类 |
| 青石 | `#4a7a9b` | 人物分类 |

## 注意事项

- **Next.js 版本锁定 15.x**：16.x 在 `@opennextjs/cloudflare` 上会 500
- **Windows 兼容性**：OpenNext 构建时会警告 Windows 不完全兼容，但目前可正常 build + deploy
- **路径中的中文字符**：项目路径包含中文（桌面\学习）可能导致构建问题，如遇 EPERM 错误可将项目移到纯英文路径
- **`.open-next/` 目录**：构建产物，经常被 Node 进程锁定，重新构建前可能需要关闭占用进程
- **视频背景文件**：`public/bg-compressed.mp4` 已 gitignore，需自行放入
- **密钥文件**：`data/keys.json` 已 gitignore，首次使用参考 `data/keys.example.json`
