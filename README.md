# 语力馆 · Fluency Lab

系统化提升英语听说读写，冲刺 **雅思 Academic 7.0+**。  
第一期主线：**口语输出 + 词汇唤醒 + 教练反馈**（理解还在、输出萎缩）。

> 目录：`/Users/yao/ai-coding/fluency-lab`  
> GitHub：https://github.com/yao1431a/language-exam（可后续 rename 为 `fluency-lab`）

## 本地运行

```bash
npm install
cp .env.example .env.local   # 可先不填 Key
npm run dev
```

打开 http://localhost:43123

**默认不连云端 AI**：口语反馈走本地启发式，接口 `/api/coach/*` 已保留。  
以后要开真 AI：在 `.env.local` 填 Key，并设 `AI_COACH_ENABLED=1`，再重启。

### 环境变量

| 变量 | 说明 |
|------|------|
| `AI_COACH_ENABLED` | `0`（默认）本地点评；`1` 才调用云端 |
| `ANTHROPIC_API_KEY` | Claude（开启云端时优先） |
| `OPENAI_API_KEY` | 备选 |
| `AI_PROVIDER` | 可选：`anthropic` / `openai` |

Key 只在服务端使用，不要提交 `.env.local`。

## 迁到新电脑（如 Mac mini）

1. `git clone <repo> fluency-lab && cd fluency-lab`
2. `npm install`
3. 复制 `.env.local`（可选）
4. 设置页 **导入备份 JSON**（旧机先导出）
5. `npm run dev`

勿依赖本机绝对路径；数据在浏览器 IndexedDB。

## 信息架构

```text
今日计划
  ├─ 词汇唤醒（SRS）
  ├─ 口语训练（Part 1 / 2 / 3）+ 教练反馈
  ├─ 好句 / 错句本
  └─ 工具箱（旧考试刷题，轻量诊断）
设置（会话时长 / 备份 / AI 状态）
```

## 版本

- `v1.0.0` … `v1.3.0`：刷题站时代  
- Fluency Lab Phase 1：今日计划 + 口语 + 词汇 + 本地/可选云端教练
