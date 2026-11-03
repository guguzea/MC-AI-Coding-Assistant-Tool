<!-- 落库来源：2026-11-02 task-17（matrix-survey）实测 + Lead 落库。 -->
<!-- 本文件是**形态说明**，不是可用 API 表：驱动面所需六类 MC 侧名字三档**全无出处** ⇒ 逐条 fail-closed。 -->
# ModLoader 驱动形态（1.6.4）

> 任务：task-17。范围：`modloader` **1.6.4 / 1.2.5 / 1.5.2** 三档的**驱动面**。
> 本文只描述「要放进仓库的东西长什么样」+「每条的出处」+「未核实」。**我没有改仓库**（只写 `temp/port/`）。
> 产物三份：`temp/port/modloader-{1.6.4,1.2.5,1.5.2}/build/libs/bandd_playtest-0.1.0.jar`。

---

## 0. 一句话结论

**ModLoader 三档的驱动面「壳」可以做全（tick 循环 / 计划热载 / 证据三件 / 动作派发 / 仲裁都真），
但「手」做不出来** —— 驱动面要的六类 MC 侧名字（按键、玩家/位置、聊天、截图、读方块、开世界）
在三档**都没有出处**（构件 javap 只证到 tick 注册 / 回调实名 / 客户端单例三类）。
⇒ 本轮把驱动面做成 **fail-closed 且如实自报**：`/status` 只报 `ping` / `set_arbitration` / `status` / `release_all` / `take_over`，
其余 19 个动作进 `actionsUnavailable`，`capabilities.driverAvailable=false`。

---

## 1. 要放进仓库的文件（建议落点）

| 建议落点 | 内容 | 依据 |
|---|---|---|
| `modloader/<v>/knowledge/common/driver-shape.md` | **本文的第 2–5 节**（入口形态 + 动作表 + 逐条出处 + 未核实） | 与既有 `safe-api.md` 同级，同属「该档知识」 |
| `modloader/<v>/knowledge/common/safe-api.md` | **补一段「驱动面所需但本档无出处的 6 类」**（本文 §4 的表） | 该表已被 `pack.meta.json` 授权「构件 javap 表可引用」 |
| `mcp-server/src/generators/playtest-bridge-mod.ts` | `BRIDGE_MOD_TARGETS` **是否扩到 1.2.5 / 1.5.2** —— **建议不扩**（见 §6） | 现状只有 `modloader 1.6.4` |
| `temp/port/shared/core` 的**那处补丁**（见 §5） | `GameBridge#unavailableActions` + `PlaytestCore.status()` 过滤 | **这是本轮的 core 变更，请 Lead 决定是否同样落进 `F:\B AND D MOD\mod\shared\core`** |

**不要**放：scaffold（这三档没有可跑的工程形态，`pack.meta.json` 明写「给它造 gradlew 属造假」）、
`mcmod.info`（1.2.5/1.5.2 无证据表明 ModLoader 读它；1.6.4 有桥模板先例才带）。

---

## 2. 入口形态（三档同形）

```java
package net.minecraft.src;                      // ← 本仓 1.6.4 scaffold 口径

public class mod_bandd_playtest extends BaseMod {   // 类名 mod_<Name>（scaffold 口径）
    @Override public String getVersion() { return "0.1.0"; }
    @Override public void load() { ModLoader.setInGameHook(this, true, false); }
    @Override public void modsLoaded() { }
    @Override public boolean onTickInGame(float partialTicks, Minecraft mc) { /* core.onTick() */ return true; }
}
```

| 要素 | 出处 |
|---|---|
| `package net.minecraft.src` + `mod_<Name> extends BaseMod` | 本仓 `modloader/1.6.4/scaffold/mod_Example.java`（**注意：这三档里只有 1.6.4 有 scaffold，1.2.5/1.5.2 是借的** ⇒ 见 §5 未核实 1） |
| `load()` 里 `ModLoader.setInGameHook(this, true, false)` | 真构件 javap：`public static void setInGameHook(BaseMod, boolean, boolean)`（三档都在）；**两个 boolean 语义未核实** |
| 回调 `public boolean onTickInGame(float, net.minecraft.client.Minecraft)` | 真构件 javap（三档逐字）；**返回值语义未核实** ⇒ 先恒 true |
| 驱动循环 / 计划热载 / 证据 / 派发 / 仲裁 | `shared/core`（版本无关，**零 `net.minecraft.*`**） |

**三档的构件差异**（javap 实测，写适配层时要按档分叉）：

| 项 | 1.2.5 | 1.5.2 | 1.6.4（按 1.6.2 件） |
|---|---|---|---|
| `onTickInGame` 第二参 | `net.minecraft.client.Minecraft`（**可读名**） | 同左（**可读名**） | `ats`（**混淆名**） |
| `getMinecraftInstance()` 返回 | `net.minecraft.client.Minecraft` | 同左 | `ats` |
| `getUniqueEntityId()` | ✅ 有 | ❌ 无 | ❌ 无 |
| 聊天回调名 | `receiveChatPacket(String)` / `receiveCustomPacket(ee)` | `clientChat(String)` / `clientCustomPayload(bdk,dk)` | `clientChat(String)` / `serverChat(?,String)` |
| 连接回调 | `serverConnect(adl)` / `serverDisconnect()` | `clientConnect(bdk)` / `clientDisconnect(bdk)` | 同 1.5.2 形 |
| 官方件存在性 | `ModLoader-1.2.5.zip`（103 347 B） | `ModLoader-1.5.2.zip`（199 825 B） | **无 1.6.4 官方件**（Risugami 自 1.6.2 停更）⇒ 用 `ModLoader-1.6.2.zip` |

---

## 3. 动作表：逐条出处

### 3.1 桥面 9 个（`Capabilities.BRIDGE`）

| 动作 | 需要什么 | 本档 | 出处 / 为什么做不了 |
|---|---|---|---|
| `ping` | 无 | ✅ | core |
| `set_arbitration` | 无 | ✅ | core |
| `status` | 无 | ✅ | core |
| `query_player_state` | 玩家对象 / 位置字段 | ❌ TODO | `safe-api.md:56`「玩家对象/位置字段（1.6.4 的字段名**不能按 1.7.10 推**）→ ❌ 未核」 |
| `query_screen` | 当前界面字段 | ❌ TODO | 同上（界面字段同属「MC 侧其余接口仍缺」） |
| `screenshot` | 截图 API | ❌ TODO | `safe-api.md:58`「截图 API → ❌ 未核（1.6.4 的截图路径与 1.7.10 不是同一个）」 |
| `chat_command` | 发聊天 / 发命令 | ❌ TODO | `safe-api.md:57`「名字在（`ModLoader.clientChat(String)`），**触发语义未核**；发命令入口未核」⇒ **名字有、语义无**，按 fail-closed 不写 |
| `query_chat` | 聊天接收钩子 | ❌ TODO | 同上（三档回调名**各不相同**，且语义均未核） |
| `chat_say` | 同 `chat_command` | ❌ TODO | 同上 |

### 3.2 driver 面 15 个（`Capabilities.DRIVER`）

| 动作 | 需要什么 | 本档 | 说明 |
|---|---|---|---|
| `press` | 按键写入 | ❌ TODO | **无任何出处**。core 侧已被 `supportedKeys()=[]` 挡在 `KEY_NOT_SUPPORTED`（行为本就 fail-closed） |
| `release_all` | 纯仲裁 | ✅ | `arb.releaseOwned(bridge)`；本档永远没有「AI 按下的键」可放 ⇒ 空操作且如实返回 ok |
| `take_over` | 纯仲裁 | ✅ | `arb.takeOver()`，只切持权方，不碰 MC |
| `open_world` | 进世界入口 | ❌ TODO | 无出处 |
| `spawn_bot` / `bot_move` / `bot_follow` / `bot_despawn` / `open_bot_inventory` | 化身（第二角色） | ❌ TODO | 连「玩家/世界字段」都没有 ⇒ 整块无意义 |
| `bot_give` / `bot_look` / `bot_break` / `bot_place` | 化身的玩家功能 | ❌ TODO | 同上 |
| `join_server` | 作为真客户端连服 | ❌ TODO | 无出处 |
| `set_auth` | 关集成服认证 | ❌ TODO | 无出处 |

> **判定口径**：一个动作算「做不了」当且仅当它**需要 MC 侧名字**。纯仲裁动作（`take_over` / `release_all`）
> 不碰 MC ⇒ 如实算「能做」（把它们算成做不了是**反向谎报**）。

---

## 4. 驱动面所需、但三档**都没有出处**的六类

| 驱动面要的 | 三档状态 | 出处 |
|---|---|---|
| 按键按下 / 松开（`KeyBinding` 之类） | ❌ 无 | safe-api 全文无按键面 |
| 玩家对象 / 位置 / 朝向 / 落地 / 血量 | ❌ 无 | `safe-api.md:56` |
| 发聊天 / 发命令 | ⚠️ **名字有、语义无** | `safe-api.md:57` |
| 截图 API | ❌ 无 | `safe-api.md:58` |
| 按坐标读方块 | ⚠️ 只有 `World.getBlockId` **名字**（`safe-api.md:59`「签名与参数形未核」；且 ModLoader 时代 `Block` 无注册名 ⇒ 只能回数字 id 或类名） | `safe-api.md:40` |
| 进入/加载世界 | ❌ 无 | safe-api 全文无 |

**要把驱动面做成真的，必须先补的**（按依赖顺序）：
1. 一个 **MCP 1.6.4 / 1.5.2 / 1.2.5 named 工作区**（本档的根缺口）；
2. 在其中核出上表六类的**真名 + 签名**；
3. 按键面还要额外确认「ModLoader 时代有没有可注入按键的入口」（**可能压根不存在** —— 那就要改用别的路线，例如直接在 MCP 里给 `Minecraft` 打补丁）。

---

## 5. 未核实清单（**要真跑前必须逐条销账**）

1. **入口形态是借的**：`mod_<Name> extends BaseMod` + `package net.minecraft.src` 来自 **1.6.4 scaffold**；
   1.2.5/1.5.2 **未建 ready 档**（`activate_platform_pack session` → `PACK_NOT_FOUND`，`pack.meta.json: status=draft`，
   且逐字写「**BaseMod 形态随版本未核实**」）⇒ 这两档的入口形态**没有本档出处**。
2. **包名口径冲突**：真构件 zip 里 `BaseMod`/`ModLoader` 在**默认包**（zip 根，`jar tf` 实测无 `net/` 前缀），
   而 MCP 时代 mod 源码用 `net.minecraft.src` —— 两者**不能同时成立**（Java 不允许命名包引用默认包）。
   ⇒ 官方 zip 是**二进制投放形态**。**「目标运行期到底要哪个包」本档证不出。**
3. **未 reobf**：源码用可读名（`net.minecraft.client.Minecraft`），而真机跑的是**混淆过的**游戏 jar。
   MCP 时代发布前要走 **Reobfuscate**；本仓**没有 MCP 工作区 ⇒ 做不了这一步** ⇒ 产出的 jar 是
   **源码形态**，直接丢进混淆客户端**不会 tick**（1.6.4 更严重：真构件第二参就是 `ats`）。
4. **Java 版本偏离**：`shared/core` 用了 lambda + `java.nio.file` ⇒ 编译 `-source 8`，
   而本档是 **Java 6/7 时代** ⇒ 运行期要求 Java 8+，**与原版环境不一致**，未真机验证。
5. `setInGameHook` 两个 boolean 的语义未核实（按 `(true,false)` 传）。
6. `onTickInGame` 返回值语义未核实（返回 false 是否摘钩；先恒 true）。
7. **运行期全未测**：本轮只到「编译过 + `/status` 读数实测」（见 §6），**不是「能跑」**。

---

## 6. 本轮实测读数（`/status` 真实输出，非推断）

做法：用 JDK 8 起一个**只有 core + 适配层**的 JVM，调 `PlaytestCore.status()`（`statusprobe/StatusProbe.java`，**不进 jar**）。
三档读数一致（除 `mcVersion`）：

```
PLATFORM=modloader MC=<v>   READY=false   SUPPORTED_KEYS=[]   UNAVAILABLE_COUNT=19
"actions":["ping","set_arbitration","status","release_all","take_over"]
"actionsUnavailable":[ ...19 个... ]
"capabilities":{"driverAvailable":false,"supportedKeys":[]}
```

**这解决了什么**：`PlaytestCore.status()` 原本**无条件**报 `Capabilities.all()` ⇒ 本档会在 `/status` 里
**谎报**自己会按按键、会截图，而 `/execute` 实际一律失败。**能力自报谎报比没有自报更糟**（调用方会据此排计划）。

**core 补丁（本轮唯一改 core 的地方，已落在 `temp/port/shared/core`）**：

```java
// GameBridge.java —— Java 8 default ⇒ 现有适配层一行都不用改
default java.util.List<String> unavailableActions() { return java.util.Collections.emptyList(); }

// PlaytestCore.java —— status()
List<String> unavailable = new ArrayList<>(bridge.unavailableActions());
List<String> available = new ArrayList<>();
for (String a : Capabilities.all()) if (!unavailable.contains(a)) available.add(a);
m.put("actions", available);
m.put("actionsUnavailable", unavailable);
boolean driverAvailable = arb.mode() != Arbitration.Mode.DUAL;
for (String a : Capabilities.DRIVER) if (unavailable.contains(a)) { driverAvailable = false; break; }
caps.put("driverAvailable", driverAvailable);
```

> ⚠ **这是对共享 core 的改动**（`temp/port/shared/core` 被多档共用）。它是**纯增量**：未实现
> `unavailableActions()` 的适配层拿到空表 ⇒ `actions` 与 `driverAvailable` 与从前**逐字一致**。
> **请 Lead 决定**是否把同一补丁落进 `F:\B AND D MOD\mod\shared\core`；若落，
> 其它档的 jar **不必**重建（行为不变），只是多了 `actionsUnavailable:[]` 一个字段。

---

## 7. 落库建议（三档各自的处置）

| 档 | 建议 | 理由 |
|---|---|---|
| **1.6.4** | 可落 `driver-shape.md` + 补 `safe-api.md` 的「驱动面缺 6 类」段；**暂不扩 `BRIDGE_MOD_TARGETS`** | 1.6.4 在 `BRIDGE_MOD_TARGETS` 内，但桥模板的 `Mc` 内部类**逐条 throw**（10 动作 + `isInWorld` 全 TODO）⇒ 扩了也只是把「骨架」换个地方 |
| **1.2.5 / 1.5.2** | 同上；**明确不要**给它们造 scaffold / gradlew / ready 档 | `pack.meta.json` gaps 已写「给它造 gradlew 属造假」；且 BaseMod 形态本档未核 |
| 三档共同 | `pack.meta.json` 的 `gaps` 建议**加一条**：「驱动面已出形态说明（`driver-shape.md`），但 MC 侧 6 类无出处 ⇒ 驱动面 fail-closed；要真驱动须先补 MCP 工作区」 | 让下一位读者不必重走一遍 |

---

## 8. 复现命令

```powershell
$JDK8 = "G:\zulu8.96.0.205-ca-jdk8.0.504-win_x64\zulu8.96.0.205-ca-jdk8.0.504-win_x64"
$P    = "C:\Users\zzrCN\OneDrive\桌面\MC_skill\temp\port"
$D    = "$P\modloader-1.6.4"          # 或 modloader-1.2.5 / modloader-1.5.2

# 腿 A：替身 -> stub-out（不进 jar）
& "$JDK8\bin\javac.exe" -encoding UTF-8 -source 8 -target 8 -nowarn -d "$D\stub-out" (Get-ChildItem "$D\stubs" -Recurse -Filter *.java).FullName
# 腿 B：core + 本档源码 -> out
& "$JDK8\bin\javac.exe" -encoding UTF-8 -source 8 -target 8 -nowarn -cp "$D\stub-out" -d "$D\out" `
    (Get-ChildItem "$P\shared\core" -Recurse -Filter *.java).FullName `
    "$D\src\com\bandd\playtest\modloader164\ModLoaderAdapter.java" `
    "$D\src\net\minecraft\src\mod_bandd_playtest.java"
# 腿 C（仅 1.2.5 / 1.5.2）：probe 对**真构件**验签（默认包）
& "$JDK8\bin\javac.exe" -encoding UTF-8 -source 8 -target 8 -nowarn -cp "$D\stub-out;$D\libs\ModLoader-1.2.5.zip" -d "$D\probe-out" "$D\probe\SigProbe.java"
# 打包（1.6.4 带 mcmod.info，1.2.5/1.5.2 不带）
& "$JDK8\bin\jar.exe" cf "$D\build\libs\bandd_playtest-0.1.0.jar" -C "$D\out" com -C "$D\out" net
# 量 /status（不进 jar）
& "$JDK8\bin\javac.exe" -encoding UTF-8 -nowarn -cp "$D\out;$D\stub-out" -d "$D\sp-out" "$D\statusprobe\StatusProbe.java"
& "$JDK8\bin\java.exe" -cp "$D\sp-out;$D\out;$D\stub-out" StatusProbe com.bandd.playtest.modloader164.ModLoaderAdapter "$env:TEMP\sp-ev"
```

---

## 9. 本轮产物（jar + 读数）

| 档 | jar | 字节数 | sha256 |
|---|---|---|---|
| 1.6.4 | `temp/port/modloader-1.6.4/build/libs/bandd_playtest-0.1.0.jar` | 40 980 | `951929B7CBEE73A049CE7FCA8820A86BC7A5E5247F90D0E96F857EE49A9CC1BE` |
| 1.2.5 | `temp/port/modloader-1.2.5/build/libs/bandd_playtest-0.1.0.jar` | 40 792 | `50DBDFC745857D3EADED56E48E4C431B604C0795198ACAE0D2EDAA6EED7F5978` |
| 1.5.2 | `temp/port/modloader-1.5.2/build/libs/bandd_playtest-0.1.0.jar` | 40 792 | `39F9768AA07A8FFD6747B4C72FBB5BC238D471F90E92F89A46AAAE6FB260DD30` |

三档构建：腿 A/B EXIT=0；1.2.5/1.5.2 腿 C（**对真构件**验签）EXIT=0；`/status` 实测如上。

---

## ⚠️ 2026-11-03 重大更新：**默认包路线已达成 L-b（1.6.2 真机实证）**

本文档前文「L-b 不可行」**只对「MCP 映射路线」成立**。另一条路线已跑通并真机验证：

- **路线 = 默认包 + 直接对官方混淆 client.jar 编译** ⇒ **不需要映射、不需要 reobf**；
- **判据**：`open_world` → `press forward` → 坐标 **dz = +4.2000 格**（四向对照 back 11.5 / left 2.2 / right 2.4 / forward 0.4365，`press jump` 走玩家物理）⇒ **驱动动作真的驱动了玩家**；
- **1.6.2 已达成 L-b**；**1.2.5 / 1.5.2 已解锁按键面（`press`）**；
- **1.6.4 仍不可行**：Risugami 自 MC 1.6.2 起停更，**1.6.4 无官方 ModLoader 发布物** ⇒ 载体不存在；
- 完整读数：`F:\B AND D MOD\artifacts\modloader-1.6.2-lb-record.md`（385 行）+ `modloader-1.6.2-lb-evidence\`（9 件）。

**两条真机才暴露的坑**（已修，勿重踩）：① 自造 tick 代理的构造**需要 GL 上下文** ⇒ 必须在 `BaseMod.load()` 里 `new`（MC 线程、`Display.create()` 之后）；② ModLoader 1.6.2 的 modDir **优先 `<gameDir>/versions/<ver>/mods`**，jar 放 `mods/` 会被无视。

**桥侧注意**：本档的 mod 类**必须在默认包**（`BaseMod`/`ModLoader` 与 MC 混淆类都在默认包；Java 具名包不能引用默认包）⇒ 生成器里 `package net.minecraft.src` 的桥骨架形态**不适用于本路线**。

**第二客户端（真·第二玩家）**：本仓已在 **neoforge 1.21.11** 验证过这条路线（人类开世界→对局域网开放，AI 客户端 `join_server` 进来 ⇒ AI 是**真玩家**，捡拾/挖掘/放置/物品栏/GUI/聊天全原生）。本档**尚未移植**；逐档实名取证见 `temp/port/artifacts/第二客户端-setAuth-joinServer-取证.md`，坑位见 `community_knowledge/authored/ingame-playtest-automation.md` 编号 98–101。
