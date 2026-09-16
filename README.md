# 语言考试练习平台 (Language Exam Hub)

托业、托福、雅思、日语 JLPT N1–N5 的网页练习平台。支持**离线/联网**双模式：内置近 5 年真题练习版，联网可同步最新试卷，并可自动生成模拟卷。

## 功能

- 八种考试：TOEIC、TOEFL iBT、IELTS、JLPT N1–N5
- 近 5 年（2021–2025）各场次真题**练习版**（原创题目，模拟真实结构）
- 联网一键同步最新试卷到本地 IndexedDB
- 在线/离线均可生成模拟试卷
- PWA：可安装、断网访问已缓存页面
- [Spec Kit](https://github.com/github/spec-kit) 规格驱动开发

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | Next.js 16 + React 19 + TypeScript |
| 样式 | Tailwind CSS 4 |
| 本地存储 | Dexie (IndexedDB) |
| 离线 | Service Worker + Web App Manifest |
| 规格 | GitHub Spec Kit (cursor-agent) |

## 本地运行

```bash
npm install
npm run dev -- -p 43123
```

浏览器打开 http://localhost:43123

## 目标部署路径

开发机建议目录：

```text
/Users/yao/ai-coding/language exam
```

将本仓库克隆或复制到上述路径即可。

## 版本与回退

项目使用 Git 标签管理可回退快照：

```bash
git tag -l 'v*'           # 查看所有版本标签
git checkout v1.0.0-initial-release   # 回退到初始发布
git checkout main         # 回到最新
```

## Spec Kit 工作流

规格文件位于 `specs/001-language-exam-platform/`。在 Cursor 中可使用：

- `/speckit-constitution` — 项目原则
- `/speckit-specify` — 功能规格
- `/speckit-plan` — 技术方案
- `/speckit-tasks` — 任务分解
- `/speckit-implement` — 按任务实现

## 免责声明

本项目题目为**原创练习题**，用于熟悉考试结构与答题流程，**非** ETS、IELTS、JLPT 官方真题。正式备考请使用官方授权资料。
