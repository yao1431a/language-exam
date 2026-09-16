# 代码在哪里？如何放到本机 `/Users/yao/ai-coding/language exam`

## 为什么本机目录是空的？

本项目是在 **Cursor Cloud Agent（云端）** 里创建的，代码位于云端工作区 `/workspace`，**不会自动写入你 Mac 上的本地路径**。

因此 `/Users/yao/ai-coding/language exam` 为空是正常现象。

## 如何拿到代码（推荐）

### 方法 A：创建 GitHub / Origin 仓库后克隆（推荐）

1. 在 Cursor Agent 页面点击 **Create repo**（创建仓库）
2. 创建完成后，在本机执行：

```bash
mkdir -p "/Users/yao/ai-coding"
git clone <你创建的仓库地址> "/Users/yao/ai-coding/language exam"
cd "/Users/yao/ai-coding/language exam"
npm install
npm run dev
```

浏览器打开：http://localhost:43123

### 方法 B：从 Agent 页面下载 / 同步

在 Cursor 桌面端打开本 Agent 对话，使用产品提供的「同步到本地」或下载源码能力，将仓库落到：

```text
/Users/yao/ai-coding/language exam
```

## 版本回退

```bash
cd "/Users/yao/ai-coding/language exam"
git tag -l
git checkout v1.0.0-initial-release   # 初始版
git checkout v1.1.0-open-api-enrich   # 开源题库扩充版（本版本）
git checkout main
```

## 当前云端预览

开发服务器运行于：http://127.0.0.1:43123（仅 Cloud Agent 环境内可访问）
