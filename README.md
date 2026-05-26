# 凡人修仙传 · 道友百科

社区共建的《凡人修仙传》动画百科。道友们共同提交词条内容，以投票决定最佳版本。

## 功能

- **四大分类**：法宝、功法、人物、剧情
- **社区投票**：描述、图片、视频、头像均支持多候选版本，投票排序
- **头像系统**：多人上传候选头像，票数最高自动成为词条封面
- **图片双来源**：支持粘贴 URL 或直接上传文件到服务器
- **道友令认证**：持令道友可删除词条和不当内容
- **水墨修仙风**：深墨底色、金线分隔、朱砂/碧玉/青石配色

## 技术栈

- Next.js 16 (App Router + Turbopack)
- React 19 + TypeScript
- Tailwind CSS 4
- Lucide Icons
- JSON 文件存储

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
fanren-wiki/
├── data/
│   ├── entries.json      # 词条数据
│   └── keys.json         # 道友令密钥
├── public/
│   ├── uploads/          # 用户上传的图片
│   └── bg-compressed.mp4 # 首页视频背景
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/verify/route.ts   # 道友令验证
│   │   │   ├── entries/route.ts       # 词条 CRUD
│   │   │   ├── entries/[id]/route.ts  # 单条目操作 + 删除
│   │   │   ├── upload/route.ts        # 文件上传
│   │   │   └── vote/route.ts          # 投票 + 提交候选
│   │   ├── category/[type]/page.tsx   # 分类列表页
│   │   ├── entry/[id]/page.tsx        # 词条详情页
│   │   ├── submit/page.tsx            # 新建词条页
│   │   └── globals.css                # 水墨主题样式
│   ├── components/
│   │   ├── Navbar.tsx                  # 导航栏 + 道友令弹窗
│   │   ├── EntryCard.tsx              # 词条卡片
│   │   ├── EntryDetailClient.tsx      # 词条详情（头像上传、Tab切换）
│   │   ├── VoteList.tsx               # 通用投票列表
│   │   ├── SubmitModal.tsx            # 提交候选弹窗（图片支持双来源）
│   │   ├── SubmitEntryModal.tsx       # 新建词条弹窗
│   │   └── CategoryIcon.tsx           # 分类图标映射
│   ├── context/AuthContext.tsx         # 道友令全局状态
│   └── lib/
│       ├── types.ts                   # 类型定义
│       ├── data.ts                    # JSON 读写
│       ├── auth.ts                    # 密钥验证
│       └── utils.ts                   # 分类配色工具
└── next.config.ts
```

## 道友令

预置三把令牌，在导航栏「道友令」按钮输入即可激活：

| 令牌 | 持有者 |
|------|--------|
| `dao-you-ling-001` | 掌令使 |
| `dao-you-ling-002` | 副令使 |
| `dao-you-ling-003` | 巡山使 |

持令者可删除词条和不当候选内容。

## 数据模型

每个词条（`WikiEntry`）包含四类可投票内容：

| 字段 | 类型 | 说明 |
|------|------|------|
| `avatars` | `AvatarCandidate[]` | 候选头像，票数最高者为封面 |
| `descriptions` | `DescCandidate[]` | 候选描述文本 |
| `images` | `ImageCandidate[]` | 候选图片（URL 或上传文件） |
| `videos` | `VideoLink[]` | 相关视频链接 |

所有候选均支持赞/踩投票。

## 脚本

```bash
npm run dev       # 开发服务器
npm run build     # 生产构建
npm run start     # 启动生产服务
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
