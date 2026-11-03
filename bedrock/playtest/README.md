# 基岩版 BDS 真机自测

一套可复跑的无头闭环：把行为包装进官方 **Bedrock Dedicated Server（BDS）**，起服、抓控制台、按 done token 判绿/红，并按仓库统一的证据契约落盘。

**它补的是哪个空**：`generate_playtest_driver` 的覆盖表不含基岩，Java 的 driver / 桥也进不去 BDS；在此之前，基岩没有任何仓库级的自动测试入口。

**它不覆盖**：客户端渲染、资源包外观、GUI、触屏/手柄手感、客户端 content log —— 这些需要真客户端，半自动方案见 [`client/README.md`](./client/README.md)。

## 前置

1. **官方 BDS（Windows）**：从 <https://www.minecraft.net/download/server/bedrock> 下载并解包。BDS 的 EULA 由使用者接受；本仓库不附带二进制。
2. **Node.js ≥ 22**（脚本只用标准库，无需 `npm install`）。
3. 一份**专用**的 BDS 副本（脚本会改 `server.properties` 与世界包清单，退出时还原；仍不建议对正式服目录跑）。

## 快速开始（cmd.exe）

```bat
set MC_SKILL_PLAYTEST_ALLOW=1
set MC_SKILL_PLAYTEST_ROOT=F:\MC_GAME
set MC_SKILL_BDS_DIR=F:\MC_GAME\bedrock-bds\bedrock-server-1.26.61.1
node bedrock\playtest\run-bds-qa.mjs
```

默认行为：装入同目录 `qa-pack/`，使用世界 `qa_world`（不存在则新建），端口 `29132/29133`，等 `[QA] DONE`。

冒烟测仓库脚手架（只验「包能载入 + 脚本通道在跑」）：

```bat
node bedrock\playtest\run-bds-qa.mjs --pack bedrock\scaffold\BP --done-token "[scaffold] world loaded"
```

## 参数

| 参数 | 默认 | 说明 |
| --- | --- | --- |
| `--pack <dir>` | `qa-pack/` | 行为包目录，必须含 `manifest.json` |
| `--evidence <dir>` | `<ROOT>\bedrock-playtest\evidence\<runId>\` | 证据目录，必须落在授权根内 |
| `--world <name>` | `qa_world` | BDS 世界名（不存在时新建） |
| `--done-token <str>` | `[QA] DONE` | 判绿标记 |
| `--timeout-ms <n>` | `120000` | 起服后等标记的超时 |
| `--startup-timeout-ms <n>` | `300000` | 从进程启动到 `Server started` 的超时（BDS 可能因 signaling 等待数分钟） |
| `--port <n>` | `29132` | `server-port`；`server-portv6` 自动 +1 |
| `--install-name <s>` | `playtest_pack` | 装进 `behavior_packs/` 的目录名 |

## 它实际做了什么

1. 校验授权与路径（见下节），解析 `manifest.json`，**检查 script 模块声明的 entry 文件是否真的存在**（`validate_addon_manifest` 不做这一步，BDS 要起服后才报）。
2. 备份 `server.properties` 与 `worlds/<world>/world_behavior_packs.json`。
3. 写入 `online-mode=false` / `allow-list=false` / `enable-lan-visibility=false` / `content-log-file-enabled=false` 等测试配置。
4. 把包复制进 `<BDS>/behavior_packs/<install-name>/`，把包 UUID/版本写进世界的包清单。
5. 起 BDS，逐行抓控制台；看到 done token 或已知错误就 `stop`，超时也会 `stop`。
6. 还原第 2 步的两份文件，落证据。

## 证据契约（与 Java playtest 同名同义）

| 文件 | 含义 |
| --- | --- |
| `exit-code.txt` | **只认 0 为绿**；1 = 红；2 = 配置/授权错误（未起服） |
| `qa.log` | 只含 done token 命中行与已知错误行**行**，一个证据目录只有这一份 `.log` |
| `state.json` | runId、包 UUID/版本、世界、是否起服、是否命中标记、错误行、起止时间 |
| `console.txt` | BDS 原始控制台（`.txt`，避免被 `[QA]` 计数重复统计） |

判绿条件：**命中 done token ∧ 无已知错误行 ∧ 进程正常退出**。缺证据按未通过处理。

已知错误行包括：`does not contain main file`、`[ERROR] [Scripting]`、`was not found and was ignored`、`[QA] FAIL/ERROR`、`LocationInUnloadedChunkError`、`Failed to load`。

## fail-closed 边界

| 情况 | 结果 |
| --- | --- |
| `MC_SKILL_PLAYTEST_ALLOW` ≠ 1 | exit 2，`PLAYTEST_DISABLED` |
| 缺 `MC_SKILL_PLAYTEST_ROOT` / `MC_SKILL_BDS_DIR` | exit 2，不起服 |
| BDS 或证据目录的 realpath 越出授权根 | exit 2，`PATH_OUTSIDE_ALLOWLIST` |
| 包缺 `manifest.json` / JSON 坏 / header 缺 UUID | exit 2，不起服 |
| script 模块声明的 entry 文件不存在 | exit 2，`SCRIPT_ENTRY_FILE_MISSING`，不起服 |
| 同 UUID 的行为包已装在别的目录 | exit 2，`PACK_UUID_CONFLICT`（BDS 会任选一份，证据指不清对象） |

## 已知边界

- **只测服务端运行时**：脚本 API、方块读写、命令、动态属性、自定义方块注册。客户端渲染与 RP 外观必须用真客户端验，走 [`client/README.md`](./client/README.md) 的半自动路线（实测边界：鼠标注入被忽略、最小化会阻止加载）。
- **BDS 不产出 content log 文件**：`content-log-file-enabled=true` 只会打印一行「Writing log to…」，盘上没有文件（见 `bedrock/AGENTS.md`）。因此证据取控制台，`analyze_bedrock_log --logPath <console.txt>` 可直接吃。
- **只在 BDS 1.26.61.1（Windows）实测过**；其它版本/平台未验。
- `qa-pack` 的自定义方块用原版 `stone` 图集键，**没有带 RP 纹理**。
- 世界首次生成需要一点时间；若本机 29132/29133 被占用，用 `--port` 换一组。
