# 语力馆 · Fluency Lab

系统化提升英语听说读写，冲刺 **雅思 Academic 7.0+**。  
第一期主线：**口语输出 + 词汇唤醒 + AI 反馈**（理解还在、输出萎缩）。

> GitHub：https://github.com/yao1431a/language-exam（可后续 rename 为 `fluency-lab`）

## 本地运行

```bash
npm install
cp .env.example .env.local   # 填入 ANTHROPIC_API_KEY 或 OPENAI_API_KEY
npm run dev
```

打开 http://localhost:43123

### 环境变量

| 变量 | 说明 |
|------|------|
| `ANTHROPIC_API_KEY` | Claude（默认优先） |
| `OPENAI_API_KEY` | 备选；未配置 Anthropic 时使用 |
| `AI_PROVIDER` | 可选：`anthropic` / `openai` |

Key 只在服务端 `/api/coach/*` 使用，不要提交 `.env.local`。

## 迁到新电脑（如 Mac mini）

1. `git clone <repo> fluency-lab && cd fluency-lab`
2. `npm install`
3. 复制 `.env.local`（或重新填 Key）
4. 在设置页 **导入备份 JSON**（旧机先导出），或重新积累
5. `npm run dev`

勿依赖本机绝对路径；数据默认在浏览器 IndexedDB。

## 信息架构

```text
今日计划
  ├─ 词汇唤醒（SRS）
  ├─ 口语训练（Part 1 / 2 / 3）+ AI 反馈
  ├─ 好句 / 错句本
  └─ 工具箱（旧考试刷题，轻量诊断）
设置（模型 / 会话时长）
```

## 版本标签

- `v1.0.0-initial-release` … `v1.3.0-stability-random-bank`（刷题站时代）
- 本演进：Fluency Lab Phase 1（口语 + 词汇 + AI）
