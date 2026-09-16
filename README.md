# 语言考试练习平台 · 语测馆

按 **语言 → 考试 → 练习方式** 组织的官方水平考试练习平台。支持完整试卷、专项练习、模拟组卷；听力题可播放/暂停；可离线作答。

> 本机路径说明见 [WHERE_IS_THE_CODE.md](./WHERE_IS_THE_CODE.md)。  
> GitHub：https://github.com/yao1431a/language-exam  
> Cursor 备份：https://cursor.com/codebase/neilyao/lang-test-vault

## 信息架构

```text
首页（选语言）
  └─ 语言页（选考试 / 级别）
       └─ 考试主页
            ├─ 专项练习（听力 / 阅读 / 词汇…）
            ├─ 完整试卷（近 5 年练习卷）
            └─ 模拟组卷
```

已开放：英语（TOEIC / TOEFL / IELTS）、日语（JLPT N1–N5）。  
预留：韩语 TOPIK、法语 DELF、德语 Goethe、汉语 HSK。

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:43123

## 版本标签

- `v1.0.0-initial-release`
- `v1.1.0-open-api-enrich`
- `v1.2.0-ia-listening-practice`
- `v1.3.0-stability-random-bank`（本版：修复访问/听力，专项随机出题与题库扩充）
