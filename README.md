# Limbus DIY 人格网页编辑器（PWA 版）

这是可直接上传 GitHub Pages 的完整静态项目。手机安装后会以独立应用窗口运行，并通过 Service Worker 缓存页面资源与已加载过的 Wiki 图标。

## 文件

- `index.html`：页面结构
- `style.css`：全部样式
- `app.js`：编辑器、实时预览、导出、自动关键词染色、PWA 安装逻辑
- `manifest.webmanifest`：PWA 清单
- `sw.js`：离线缓存
- `icons/`：PWA 图标
- `.nojekyll`：避免 GitHub Pages 走 Jekyll 处理

## 上传 GitHub Pages

1. 新建一个 GitHub 仓库。
2. 把本目录里的**所有文件和文件夹**上传到仓库根目录。
3. 打开仓库 `Settings` → `Pages`。
4. `Build and deployment` 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/(root)`，保存。
6. 等 GitHub 给出 `https://你的用户名.github.io/仓库名/`。
7. 用手机 Chrome / Edge 打开这个 HTTPS 地址。
8. 点网页里的 `安装 PWA`；如果浏览器不弹窗，就在浏览器菜单里选“安装应用 / 添加到主屏幕”。

## 更新网页后为什么手机还是旧版？

PWA 有缓存。当前 Service Worker 的版本号是：

```js
const CACHE_VERSION = 'limbus-diy-pwa-v1';
```

以后你改了代码并上传 GitHub，可以把 `sw.js` 里的 `v1` 改成 `v2`、`v3`……强制客户端更新缓存。

## 离线说明

编辑器主体会完整离线可用。Wiki 的罪孽框、状态图标是运行时远程加载的；某个图标在线显示过一次之后，Service Worker 会把它缓存下来，之后离线仍可继续显示。没有加载过的新 Wiki 图标在完全断网时无法首次获取。

## PNG 保存

手机保存逻辑仍保留原尺寸导出：预览可以缩小，但保存时会临时生成一份 1767×2048、无 transform 缩放的副本，因此最终图片不会缩在左上角。

如果 `html2canvas` 因网络或浏览器限制不可用，编辑器会尝试走自身的 SVG / Canvas 回退方案。

## 直接本地打开

双击 `index.html` 仍能使用大部分编辑器功能，但 `file://` 环境不能注册 Service Worker，所以不能获得真正的 PWA 安装和离线缓存。正式使用建议 GitHub Pages。
