# 本地真实技能边框：v7

前一版从 `wiki.gg/Special:Redirect/file/...` 下载，会触发 wiki.gg 的 Cloudflare challenge，PowerShell/curl 会得到 HTTP 403。

这版已经完全绕开 wiki.gg 下载器。

## 使用

双击项目根目录：

`DOWNLOAD_ASSETS.cmd`

会从直接素材 CDN 下载：

- 21 张真实七罪 S1/S2/S3 技能边框（WebP）
- 7 张七罪图标（WebP）

总计 28 张。

下载完成后双击：

`VERIFY_ASSETS.cmd`

应该显示：

```text
skill_frames: 21/21
sin_icons:    7/7
OK - all 28 local assets exist.
```

随后使用 GitHub Desktop：Commit -> Push origin。

网页优先读取本地 `assets/`；本地素材缺失时，才会尝试直接素材 CDN。它不会再请求 wiki.gg。

> 防御技能目前使用本地 SVG 中性框兜底；攻击技能边框全部使用真实素材。


## v8.3 fix
LCB skill asset IDs now use explicit interpolation such as `1010101.webp` and `1010104_4.webp`. This avoids PowerShell backtick escape behavior that previously produced malformed IDs such as `101011.webp`.
