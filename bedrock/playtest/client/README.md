# 基岩客户端面半自动自测

把 QA 包放进**真客户端**的专用世界，用 `minecraft://?load=<世界 id>` 直接进世界，世界脚本自摆场景并打日志，截图 + content log 取证。全程不用点 UI，也不用往客户端里注入代码。

**它补的空**：[`../README.md`](../README.md) 的 BDS 闭环只测服务端运行时，不覆盖客户端渲染、RP 外观、GUI 与客户端 content log。
**它不覆盖**：真实鼠标操作手感、触屏 / 手柄、多人网络。

## 实测环境（本页读数只对这套成立）

- Minecraft for Windows **1.26.6005.0**（UWP），行为包声明 `@minecraft/server` 2.10.0，运行时日志显示提升到 **2.11.0**。
- 客户端数据根：`%APPDATA%\Minecraft Bedrock\Users\<XboxUserId>\games\com.mojang`
- content log 文件：`%APPDATA%\Minecraft Bedrock\logs\ContentLog<时间戳>_1.txt`
- `PrintWindow` 能抓到世界画面、暂停菜单与**聊天栏文字**（实测截图里出现过 `pong pos=...` 与黄色命令错误行）；快捷栏 / 血条这类 HUD 没有出现在截图里 ⇒ 判据仍以日志为准，聊天栏可当第二证据。

## 前置（三件，缺一件就停）

1. 真客户端已安装并启动过至少一次（`Users\<id>\games\com.mojang` 已生成）。
2. 一个**专用测试世界**；改世界前先整目录备份。
3. `<com.mojang>\minecraftpe\options.txt` 里 `content_log_file:1`（先备份原文件；不打开则退出后也没有日志文件）。

## 装 QA 包（人工四步）

记下 `qa-pack/BP/manifest.json` 与 `qa-pack/RP/manifest.json` 里的 UUID。

1. `qa-pack/BP` → `<com.mojang>\development_behavior_packs\mcskill_client_bp`
2. `qa-pack/RP` → `<com.mojang>\development_resource_packs\mcskill_client_rp`
3. 在目标世界目录写两份清单（UUID 与版本必须与 manifest 逐字一致）：

`world_behavior_packs.json`：

```json
[{ "pack_id": "8f1c2d3e-4a5b-4c6d-8e7f-901234567890", "version": [1, 0, 0] }]
```

`world_resource_packs.json`：

```json
[{ "pack_id": "9a2d3e4f-5b6c-4d7e-9f80-1234567890ab", "version": [1, 0, 0] }]
```

4. 再把两个包各复制一份到 `<世界>\behavior_packs\` 与 `<世界>\resource_packs\`（两份都在，避免来源解析歧义）。

**判绿**：进世界后 ContentLog 出现 `Plugin Discovered [MC Skill Client QA BP]`。没有这行 ⇒ 包没被装进这个世界，先别往下测。

## 启动与取证（不抢焦点）

```powershell
# 世界 id = minecraftWorlds 下的目录名（可能带 = 号，脚本会自动 URL 编码）
powershell -File bedrock\playtest\client\ui-drive.ps1 -Action launch -WorldId "<worldId>"

# 加载判据：working set 涨到 >1 GB（实测 100–180 s；最小化也能加载，只是更慢）
powershell -File bedrock\playtest\client\ui-drive.ps1 -Action state

# 截图：PrintWindow(PW_RENDERFULLCONTENT)，不需要前台
powershell -File bedrock\playtest\client\ui-drive.ps1 -Action shot -Out F:\qa\shot-01.png

# 需要看聊天输入框（PrintWindow 会裁掉底部一行）时改用整屏截图
powershell -File bedrock\playtest\client\ui-drive.ps1 -Action screens -Out F:\qa\screen-01.png

# 关闭：WM_CLOSE（CloseMainWindow），不需要前台；content log 在这一步落盘
powershell -File bedrock\playtest\client\ui-drive.ps1 -Action close
```

**证据两件**：`shot-*.png`（真实客户端画面）+ `ContentLog*.txt`（客户端脚本日志，退出时才写盘）。
**判绿**：截图有画面 ∧ 日志出现预期 `[CLIENT]` 行。缺任一件按未通过。

## 命令通道（要焦点，等于要人让出键盘）

命令走 **Script API 自定义命令**：脚本在 `system.beforeEvents.startup` 里用 `customCommandRegistry.registerCommand` 注册 `/qa:*`，`cheatsRequired:false`，所以世界关着作弊也能用。玩家在聊天框输入 `/qa:ping` 回车即可。

键盘注入走前台窗口，所以这一步会抢焦点：

```powershell
powershell -File bedrock\playtest\client\ui-drive.ps1 -Action chat -Text "/qa:ping" -Out F:\qa\shot-cmd.png
```

| 命令 | 作用 | 日志判据 |
| --- | --- | --- |
| `/qa:ping` | 回一句话 + 报位置 | `cmd ping ok` |
| `/qa:pos` | 报位置 / 朝向 / 游戏模式 | `cmd pos ok gm=...` |
| `/qa:look <pitch> <yaw>` | 原地改朝向（替代鼠标转视角） | `cmd look ... now=...` |
| `/qa:tp <x> <y> <z>` | 传送 | `cmd tp ... now=...` |
| `/qa:give <物品id> <数量>` | 给物品 | `cmd give item=...` |
| `/qa:spawn <实体id> <距离>` | 在面前生成实体 | `cmd spawn ... id=...` |
| `/qa:clear` | 清半径 40 内非玩家实体 | `cmd clear removed=N` |
| `/qa:time <ticks>` | 设时间 | `cmd time ticks=...` |
| `/qa:gm <creative\|survival\|adventure\|spectator>` | 改游戏模式 | `cmd gm mode=...` |
| `/qa:wall <方块id>` | 面前铺 3×3 墙 | `cmd wall mat=...` |

**验证覆盖**：10 条命令都验过「注册成功」；玩家端到端验过 `/qa:ping` 与 `/qa:pos`；带参命令用脚本自调用 `runCommand` 验过 `qa:look 0 90` 与 `qa:time 1000` 能进回调（`cmd invoked name=qa:look sourceType=Server`）。
**未解**：玩家键入 `/qa:look 15 90` 两次都没进回调（日志无 `cmd invoked`），聊天栏出现原版黄色错误「此世界未启用无敌模式。」——命令定义本身没问题，问题在「键入带参命令」这一层（输入内容或补全行为），原因未坐实。

脚本自己也会在 `playerSpawn` 时铺 3×3 展示墙（`mcskill:client_block`，品红/青棋盘格 RP 纹理）、放金块/钻石块并把玩家摆到正对位置；每 2 秒打一条心跳 `hb t=... pos=... rot=...`。

**判绿**：启动日志出现 `command channel=custom(10/10)`；执行命令后出现 `cmd invoked name=qa:ping sourceType=Entity entity=minecraft:player`（回调被调用）、`cmd channel=custom raw=ping` 与 `cmd ping ok`（处理完成），聊天栏同时出现 `pong pos=...`。
**已验**（1.26.6005.0）：注册 `custom(10/10)`；玩家键入 `/qa:ping` 后上面三行日志与聊天栏 `pong` 都出现。
**操作坑**：某次回车会被命令自动补全吃掉（聊天框不关、命令不执行）。`ui-drive.ps1 -Action chat` 只发一次回车；回车后若聊天框仍在，再发一次 `-Action key -Vk 13`。
**回退**：`chatSend` 在 1.26.6005.0 的 stable 面**不存在**（旧版脚本实测打印 `chat channel=unavailable`）；自定义命令注册不上时，脚本会尝试 `world.beforeEvents.chatSend` / `world.afterEvents.chatSend`，并打印 `command channel=chat-before|chat-after|unavailable`。

## 已知边界（全部是实测结论）

- **鼠标注入被忽略**：相对移动不转视角；创造模式按住左键 2.5 s 方块不破；菜单点击无效。视角用 `/qa:look`，交互走脚本命令。
- **键盘注入可用**：Escape / Space / W / A / S / D / T 均生效；世界内按住 W 1.5 s 实测前进 3.2 格并停在碰撞边界。
- **窗口失焦**不自动暂停，但游戏可能显示暂停菜单；`-DismissPause` 会先发一次 Escape——**只在画面确实是暂停菜单时用**，否则 Escape 反而会把暂停菜单叫出来。
- **最小化经常让客户端卡在 splash**：4 次最小化运行里 2 次卡住、1 次正常跑到 `playerSpawn`、1 次关得太早无法判定。卡住时只走到「脚本已加载 + `command channel=custom(10/10)` 已注册」——没有 `playerSpawn`、没有心跳、定时器不跑（世界没 tick）。⇒ 最小化只能验「包被加载 + 命令注册」，任何依赖世界运行时的场景都必须让窗口可见。
- 客户端**没有 exit-code**；判绿只能靠截图 + 日志两件。
- `@minecraft/server` 实际版本由运行时提升；本页数字只对 1.26.6005.0 成立。

## 排查

| 现象 | 先查 |
| --- | --- |
| 启动后停在世界列表 | 世界 id 是否整个 URL 编码；冷启动重试；确认游戏已完全退出再启动 |
| 日志无 `[CLIENT]` | 是否有 `Plugin Discovered`；是否有 `[Scripting][error] ... main.js` 行 |
| `command channel=unavailable` | 自定义命令注册与 chat 回退都不可用；看 `register qa:* error=...` 逐条 |
| 画面卡 splash、日志有 boot | 最小化起动卡渲染；`-Action show` 恢复窗口或退出重开（世界本身已加载） |
| `/qa:ping` 提示无权限 | 确认注册时 `cheatsRequired:false` 生效；命令名必须带命名空间 `qa:` |
| 日志文件是 0 字节 | 游戏还在运行；content log 只在退出时落盘 |
