# 🚀 Vercel 部署详细步骤

## 📋 部署前检查

✅ 代码已提交到 Git 仓库
✅ 生产版本构建成功
✅ .gitignore 已配置
✅ 项目文件已准备好

---

## 📝 部署步骤

### 第一步：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `poetry-learning-app` (或您喜欢的名称)
   - **Description**: 初三语文古诗词背默 - PWA 应用
   - **Public/Private**: 选择 Public (推荐)
3. 点击 **Create repository** 按钮
4. **不要勾选** "Add a README file"
5. **不要勾选** "Add .gitignore"
6. 创建后，GitHub 会显示仓库 URL，格式类似：
   ```
   https://github.com/YOUR_USERNAME/poetry-learning-app.git
   ```

---

### 第二步：连接 GitHub 仓库

**在终端中执行以下命令**（将 `YOUR_USERNAME` 替换为您的 GitHub 用户名）：

```bash
cd /workspace/projects
git remote add origin https://github.com/YOUR_USERNAME/poetry-learning-app.git
git branch -M main
git push -u origin main
```

**如果遇到认证错误**，可以使用 GitHub Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成 token 并复制
5. 使用以下命令推送：

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/poetry-learning-app.git
git push -u origin main
```

---

### 第三步：在 Vercel 部署

#### 方案 A：使用 Vercel CLI（快速）

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```
   按提示操作（使用 GitHub 账号登录）

3. **部署项目**
   ```bash
   cd /workspace/projects
   vercel
   ```

4. **回答配置问题**：
   ```
   ? Set up and deploy "~/projects"? [Y/n] Y
   ? Which scope do you want to deploy to? Your Name
   ? Link to existing project? [y/N] N
   ? What's your project's name? poetry-learning-app
   ? In which directory is your code located? ./
   ? Want to override the settings? [y/N] N
   ```

5. **等待部署完成**
   - Vercel 会自动检测 Next.js 项目
   - 自动配置构建设置
   - 构建并部署

6. **获取部署链接**
   - 部署成功后会显示链接，如：
     ```
     https://poetry-learning-app.vercel.app
     ```

7. **部署到生产环境**
   ```bash
   vercel --prod
   ```

#### 方案 B：使用 Vercel 网站界面（简单）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "Add New" → "Project"
   - 在 "Import Git Repository" 中找到您的仓库
   - 点击 "Import"

3. **配置项目**
   ```
   Project Name: poetry-learning-app
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: pnpm run build -- --webpack
   Output Directory: .next
   Install Command: pnpm install
   ```

4. **环境变量**（可选）
   - 点击 "Environment Variables"
   - 添加以下变量：
     ```
     NODE_ENV=production
     ```

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建和部署完成

6. **查看部署状态**
   - 在 Deployments 标签页查看
   - 绿色 ✓ 表示部署成功

---

### 第四步：验证部署

1. **访问应用**
   - 点击部署成功的链接
   - 确认页面正常加载

2. **测试功能**
   - 测试各个功能模块
   - 测试语音朗读（需要网络）
   - 测试 PWA 安装

3. **检查 PWA**
   - 在浏览器开发者工具中查看
   - Console 不应该有错误
   - Application → Service Workers 应该显示已激活

---

## 🎯 部署后配置

### 自定义域名（可选）

1. **在 Vercel 项目中**
   - 进入 Settings → Domains
   - 点击 "Add Domain"
   - 输入您的域名（如 `poetry.yourdomain.com`）

2. **配置 DNS**
   - Vercel 会提供 DNS 配置
   - 在域名服务商添加 CNAME 记录

### 自动部署

- 每次推送代码到 GitHub main 分支
- Vercel 会自动重新部署
- 可以在 Vercel 项目设置中配置

---

## 🔧 常见问题

### Q1: 推送代码时提示 "Authentication failed"
**A:** 使用 GitHub Personal Access Token：
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/poetry-learning-app.git
```

### Q2: Vercel 构建失败
**A:** 检查以下几点：
1. 确保 `scripts/build.sh` 存在且正确
2. 确保 package.json 中有 build 脚本
3. 查看 Vercel 部署日志中的错误信息

### Q3: 部署后页面空白
**A:** 可能的原因：
1. 检查 Vercel 的 Functions 日志
2. 确认所有依赖都已正确安装
3. 查看浏览器 Console 中的错误

### Q4: PWA 不工作
**A:** 检查：
1. manifest.json 是否正确配置
2. 确保通过 HTTPS 访问（Vercel 自动提供）
3. 检查 Service Worker 是否注册

---

## 📱 分享给学生

### 链接分享
将部署链接直接分享给学生：
```
https://poetry-learning-app.vercel.app
```

### 建议学生安装到桌面

**iOS:**
1. Safari 打开链接
2. 分享 → 添加到主屏幕
3. 点击添加

**Android:**
1. Chrome 打开链接
2. 菜单 → 添加到主屏幕
3. 点击安装

**电脑:**
1. Chrome/Edge 打开链接
2. 点击地址栏的安装图标
3. 点击安装

---

## 🆘 获取帮助

如果遇到问题：

1. **查看部署日志**
   - Vercel 项目 → Deployments → 点击最近的部署
   - 查看 "Build Output" 和 "Function Logs"

2. **检查 git 状态**
   ```bash
   cd /workspace/projects
   git status
   git log --oneline -5
   ```

3. **重新部署**
   ```bash
   git add .
   git commit -m "Update"
   git push
   ```
   Vercel 会自动重新部署

---

## ✅ 部署检查清单

- [ ] GitHub 仓库已创建
- [ ] 代码已推送到 GitHub
- [ ] Vercel 项目已创建
- [ ] 部署成功（绿色 ✓）
- [ ] 链接可以访问
- [ ] 功能正常工作
- [ ] PWA 可以安装
- [ ] 链接已分享给学生

---

**祝部署成功！🎉**
