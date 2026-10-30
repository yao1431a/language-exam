# 代码路径与迁机

## 本机目录

推荐路径：

```text
/Users/yao/ai-coding/fluency-lab
```

（由原 `language-exam` 重命名。）

## 迁到新电脑（Mac mini 等）

```bash
git clone https://github.com/yao1431a/language-exam.git fluency-lab
cd fluency-lab
npm install
cp .env.example .env.local   # 填入 API Key
npm run dev
```

浏览器打开 http://localhost:43123

1. 旧机：设置页 → 导出备份 JSON  
2. 新机：设置页 → 导入备份  

数据在浏览器 IndexedDB；换浏览器需重新导入。

## GitHub

https://github.com/yao1431a/language-exam  

可日后 `gh repo rename fluency-lab`。
