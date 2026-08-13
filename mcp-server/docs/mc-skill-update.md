# mc_skill_update — 自我更新

检查 GitHub Release，并在用户确认后更新 **tooling**（仓库代码 + `npm ci && npm run build`）与 **data**（离线数据包 zip）。

## 用法

```text
mc_skill_update
  action: check | apply
  scope: tooling | data | all   # 默认 all
  channel: stable | latest | tag  # 默认 stable（忽略预发布）
  tagName: …                   # channel=tag 时必填
  dryRun: true                  # apply 默认 true
  confirmed: true               # 真写必填
  allowDirty / stashDirty       # git 脏工作区选项
```

CLI：`mc-skill update --action check|apply [--scope=…] [--channel=…] [--confirm] …`（旧位置参数 `check|apply` 仍兼容，stderr 有迁移提示）

真写门禁（与 `port_project` 相同）：

- `MC_SKILL_ALLOW_WRITE=1`
- `MC_SKILL_PROJECT_ROOT` = **本仓库根**绝对路径（`MC_skill`）
- `dryRun=false` + `confirmed=true`

更新 tooling 后请 **重启 Cursor / MCP**（响应含 `restartRequired` / state `pendingRestart`）。

## Data zip 预期布局

解压目标 = `MC_SKILL_DATA`。zip **根目录即数据包内容**：

```text
mc-skill-data-full-*.zip
├── forge_1.20.1/
├── fabric_1.20.1/
├── vanilla_1.20.1/
└── …
```

若唯一顶层目录名为 `data/`，工具会自动剥离该前缀。其它歧义布局拒绝写入（`DATA_ZIP_LAYOUT_INVALID`）。

同次 Release 须附带 `SHA256SUMS*.txt`。写入策略为按 zip 内路径覆盖，**不删除**用户在 data 下的额外文件；`dryRun` / 响应含 `filesToOverwrite`。

## 环境变量

| 变量 | 默认 | 含义 |
|------|------|------|
| `MC_SKILL_UPDATE_REPO` | `guguzea/MC-AI-Coding-Assistant-Tool` | GitHub 仓库 |
| `MC_SKILL_UPDATE_REMOTE` | （扫描匹配） | 强制 remote 名 |
| `MC_SKILL_UPDATE_CACHE_TTL_SEC` | `3600` | status 缓存 TTL |
| `MC_SKILL_UPDATE_DOWNLOAD_TIMEOUT_MS` | `600000` | 下载超时 |
| `MC_SKILL_GITHUB_TIMEOUT_MS` | `25000` | Release API 超时 |
| `MC_SKILL_GITHUB_API_BASE` | `https://api.github.com` | API 根 URL（可改镜像） |
| `MC_SKILL_FETCH_BACKEND` | （自动） | 强制 `node` 或 `curl` |
| `HTTPS_PROXY` / `HTTP_PROXY` | | Node fetch 走代理（Clash 等） |
| `MC_SKILL_GITHUB_TOKEN` | | 可选 API token |

浏览器能打开 github.com **不代表** Node `fetch` 能访问 `api.github.com`：Node 使用 Mozilla CA，Windows 浏览器使用系统证书库。公司网关 / 杀毒 HTTPS 扫描常导致 `UNABLE_TO_VERIFY_LEAF_SIGNATURE`。本工具在 Windows 上会自动回退 `curl.exe --ssl-no-revoke`（与浏览器同一套 Schannel）。

Release 数据包优先匹配 `mc-skill-data-full-*.zip` + `SHA256SUMS*.txt`；若没有，则接受 `data.zip` 并使用 GitHub asset `digest`（`sha256:…`）校验。

`get_server_status.updateHint` 读取 `data/mc-skill-update-state.json` 中上次 check（过期则 `stale=true`，不自动联网）。
