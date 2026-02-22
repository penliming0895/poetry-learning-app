# 初三语文古诗词背默 - 部署指南

## 📱 已配置的功能

✅ **PWA (Progressive Web App)** - 支持离线使用，可添加到桌面
✅ **静态构建** - 已生成优化的生产版本
✅ **Service Worker** - 自动缓存资源，提升加载速度
✅ **安装提示** - 首次访问会提示安装到桌面

## 🚀 快速部署方案

### 方案1: Vercel（推荐，免费）

**优点：**
- 完全免费
- 自动 HTTPS
- 全球 CDN 加速
- 一键部署

**步骤：**

1. **准备 Git 仓库**
   ```bash
   cd /workspace/projects
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到 GitHub**
   - 在 GitHub 创建新仓库
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

3. **在 Vercel 部署**
   - 访问 https://vercel.com
   - 点击 "Add New Project"
   - 选择您的 GitHub 仓库
   - 点击 "Deploy"

4. **获取链接**
   - 部署完成后，Vercel 会提供链接（如：https://your-app.vercel.app）
   - 将此链接分享给学生

---

### 方案2: Netlify（免费）

**优点：**
- 完全免费
- 自动 HTTPS
- 拖拽部署

**步骤：**

1. **导出构建文件**
   ```bash
   cd /workspace/projects
   # 构建文件已生成在 .next 目录
   ```

2. **在 Netlify 部署**
   - 访问 https://netlify.com
   - 登录后点击 "Add new site" → "Deploy manually"
   - 将整个项目文件夹拖拽到上传区域

3. **配置构建设置**
   - Build command: `pnpm run build -- --webpack`
   - Publish directory: `.next`

4. **获取链接**
   - 部署完成后会获得一个链接

---

### 方案3: 任何静态文件服务器

如果您有自己的服务器，可以：

1. **导出静态文件**
   ```bash
   cd /workspace/projects
   npx next export  # 或使用 npx next build 后部署 .next 目录
   ```

2. **上传到服务器**
   - 将 `out` 或 `.next` 目录上传到您的服务器
   - 配置 nginx/apache 指向该目录

---

## 📋 部署后的配置

### 环境变量（可选）

如果需要配置自定义域名或其他设置，在部署平台添加：

```
# Vercel/Netlify 环境变量
NODE_ENV=production
```

### 自定义域名（可选）

在 Vercel/Netlify 中：
1. 进入项目设置
2. 添加自定义域名
3. 按照提示配置 DNS

---

## 🎯 学生如何使用

### 方式1：直接访问链接

1. 将部署链接（如 https://your-app.vercel.app）分享给学生
2. 学生在浏览器中打开即可使用

### 方式2：安装到桌面（推荐）

**iOS (iPhone/iPad):**
1. 在 Safari 中打开链接
2. 点击底部的"分享"按钮
3. 向下滚动，选择"添加到主屏幕"
4. 点击"添加"

**Android:**
1. 在 Chrome 中打开链接
2. 点击浏览器菜单（三个点）
3. 选择"添加到主屏幕"或"安装应用"
4. 点击"添加"或"安装"

**电脑 (Chrome/Edge):**
1. 在浏览器中打开链接
2. 地址栏右侧会出现安装图标
3. 点击图标，选择"安装"
4. 应用会添加到桌面和应用列表

---

## 📱 PWA 功能说明

### 离线使用
- 首次访问后，所有资源会被缓存
- 即使没有网络，也能正常使用（除语音朗读功能外）

### 快捷方式
- 添加到桌面后，像原生 App 一样启动
- 支持全屏显示
- 有独立的图标和名称

### 自动更新
- 当有新版本时，Service Worker 会自动更新
- 用户下次打开时会看到新版本

---

## 🔧 常见问题

### Q: 学生说打不开链接？
**A:** 检查以下几点：
1. 链接是否正确（确保是 https://）
2. 是否需要登录（Vercel 免费版无需登录）
3. 检查部署状态是否为 "Production"

### Q: PWA 安装失败？
**A:** 可能的原因：
1. 不支持 PWA 的浏览器（使用 Chrome/Safari/Edge）
2. 未通过 HTTPS（部署到 Vercel/Netlify 会自动提供）
3. 浏览器禁用了 PWA 安装

### Q: 语音功能不工作？
**A:** 语音功能需要网络连接，因为使用的是 TTS API。离线模式下其他功能正常。

### Q: 如何更新应用？
**A:** 只需要重新部署到 Vercel/Netlify，学生下次打开时会自动更新。

---

## 📊 使用统计

### 查看部署统计
- **Vercel**: 在项目页面查看访问量、地理位置等
- **Netlify**: 在 Site analytics 中查看

### 学生数据
- 所有数据存储在学生浏览器的 localStorage 中
- 数据不会上传到服务器，保护学生隐私
- 清除浏览器数据会丢失进度

---

## 🆘 获取帮助

如果部署遇到问题：

1. **查看部署日志**: Vercel/Netlify 提供详细的部署日志
2. **检查构建错误**: 确保构建成功（显示 ✓ Compiled successfully）
3. **重新部署**: 可以在平台手动触发重新部署

---

## 📞 反馈渠道

学生使用过程中遇到问题，可以：
1. 点击页面右上角的"清除缓存"按钮
2. 或者联系您（作为管理员）提供帮助

---

## 🎉 部署完成！

现在您的应用已经准备好分享给学生使用了！

**下一步：**
1. 将部署链接分享给学生
2. 建议学生安装到桌面（PWA）
3. 收集反馈，准备后续优化

**后续可以：**
- 迁移到微信小程序
- 添加用户登录功能
- 添加学习数据分析
- 添加更多诗词内容
