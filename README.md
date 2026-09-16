# 语言考试练习平台 (Language Exam Hub)

托业、托福、雅思、日语 JLPT N1–N5 的网页练习平台。支持**离线/联网**双模式：内置近 5 年练习卷，联网可同步最新试卷，并从**开源 JLPT API** 自动扩充日语题量。

> **代码位置说明**：若你在 Mac 的 `/Users/yao/ai-coding/language exam` 找不到代码，请先阅读 [WHERE_IS_THE_CODE.md](./WHERE_IS_THE_CODE.md)。本项目在 Cursor 云端生成，需创建仓库后克隆到本机。

## 功能

- 八种考试：TOEIC、TOEFL iBT、IELTS、JLPT N1–N5
- 近 5 年（2021–2025）各场次练习卷（原创题目，模拟真实结构）
- 联网一键同步；日语从开源词汇/语法 API 自动生成大量练习题
- 在线/离线均可生成模拟试卷
- PWA：可安装、断网访问已缓存页面
- [Spec Kit](https://github.com/github/spec-kit) 规格驱动开发

## 开源题库接入

联网点击「同步最新真题」时，服务端会请求：

| 来源 | 用途 |
|------|------|
| https://jlpt-vocab-api.vercel.app | JLPT N1–N5 词汇 → 自动出题 |
| https://jlpt-grammar-api.vercel.app | JLPT 语法（主要 N5/N4）→ 自动出题 |

**不会**下载 ETS / IELTS / JLPT 官方真题原文（受版权保护）。英语侧使用本地扩充原创练习题。

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
npm run dev
```

浏览器打开 http://localhost:43123

## 目标本机路径

```text
/Users/yao/ai-coding/language exam
```

详见 [WHERE_IS_THE_CODE.md](./WHERE_IS_THE_CODE.md)。

## 版本与回退

```bash
git tag -l 'v*'
git checkout v1.0.0-initial-release
git checkout v1.1.0-open-api-enrich
git checkout main
```

## Spec Kit 工作流

规格文件位于 `specs/001-language-exam-platform/`。

## 免责声明

本项目题目为**原创练习题**或由开源词表自动生成，用于熟悉考试结构，**非**官方真题。正式备考请使用官方授权资料。
