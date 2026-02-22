# Gitee Pages 部署指南

## 📋 前置条件

- [ ] 已有 Gitee 账号（如果没有，请注册：https://gitee.com）
- [ ] 已安装 Git

## 🚀 部署步骤

### 第一步：在 Gitee 创建仓库

1. 登录 Gitee（https://gitee.com）
2. 点击右上角 **"+"** → **新建仓库**
3. 填写仓库信息：
   - 仓库名称：`poetry-learning-app`（或自定义）
   - 仓库介绍：`初三语文古诗词背默应用`
   - 是否开源：**公开**
   - 使用 `README.md` 模板：**不勾选**（我们会自己创建）
4. 点击 **创建**

### 第二步：添加 Gitee 远程仓库

在项目目录下运行：

```bash
# 查看现有远程仓库
git remote -v

# 添加 Gitee 远程仓库
git remote add gitee https://gitee.com/你的用户名/poetry-learning-app.git

# 推送到 Gitee
git push gitee main
```

**注意**：将 `你的用户名` 替换为你的 Gitee 用户名。

### 第三步：开启 Gitee Pages

1. 打开刚创建的 Gitee 仓库
2. 点击 **服务** → **Gitee Pages**
3. 点击 **启用 Gitee Pages 服务**
4. 配置信息：
   - 构建分支：`main`
   - 构建目录：`out`（Next.js 静态导出的目录）
   - 主题：不使用主题（自定义主题）
5. 点击 **启动**

### 第四步：等待部署

Gitee Pages 会自动部署，通常需要 1-3 分钟。

部署成功后，你会看到：
```
网站地址：https://你的用户名.gitee.io/poetry-learning-app
```

## ✅ 访问应用

打开浏览器，访问：
```
https://你的用户名.gitee.io/poetry-learning-app
```

## 🎯 功能说明

由于静态部署限制，以下功能**不可用**：
- ❌ 语音朗读（需要后端 API 支持）

其他功能**正常可用**：
- ✅ 每日背默
- ✅ 背诵练习
- ✅ 默写测试
- ✅ 错题本
- ✅ 成就系统
- ✅ 进度保存（localStorage）

## 📝 更新部署

当修改代码后，重新部署：

```bash
# 1. 构建
pnpm build

# 2. 提交
git add -A
git commit -m "描述你的修改"
git push gitee main

# 3. 在 Gitee Pages 页面点击"更新"按钮
```

## 🔧 常见问题

### 问题 1：Gitee Pages 部署失败

**解决方法**：
1. 确保构建目录是 `out`（不是其他目录）
2. 确保本地先运行 `pnpm build`，确保 `out` 目录存在
3. 检查 Gitee Pages 的日志

### 问题 2：页面样式错乱

**解决方法**：
1. 清除浏览器缓存
2. 按 `Ctrl + Shift + R` 强制刷新

### 问题 3：404 错误

**解决方法**：
1. 检查 Gitee Pages 是否启动成功
2. 确认访问的 URL 是否正确
3. 等待 2-3 分钟让部署完成

## 🎊 完成！

现在你的学生可以直接访问 Gitee Pages 链接，无需 VPN，完全免费！

**分享链接示例：**
```
https://username.gitee.io/poetry-learning-app
```
