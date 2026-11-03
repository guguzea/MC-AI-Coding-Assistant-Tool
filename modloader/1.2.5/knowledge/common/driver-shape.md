# driver-shape · modloader 1.2.5

> **2026-11-03 更新（实测）**：本文档原判「L-b 不可行」**只对「MCP 映射路线」成立**。
> 已实测另有一条**可行路线**：**默认包 + 直接对官方混淆 client.jar 编译**（`afu`(1.2.5)/`ava`(1.5.2) 等混淆名逐条 javap 实测），
> **不需要映射、也不需要 reobf** ⇒ **按键面（`press`）已解锁**（`/status` 的 `actions` 含 `press`，`UNAVAILABLE_COUNT` 19→18）。
> 仍未解锁的：`Minecraft` 的**字段名**（玩家/世界/gameDir/currentScreen）同样混淆且无出处 ⇒ `ready`/`playerStateJson`/`screenName` 等仍 fail-closed。
> 完整读数见 `temp/port/artifacts/modloader-1.2.5-1.5.2-obfroute-record.md`（4 项可行性实测 + 链接实测 + 未核实清单）。

> 本档的**驱动面形态**与**可行性判定**。判定日期 2026-11-02，判定依据全部是本机实测读数。
> 相关：本档 [safe-api.md](safe-api.md)（构件 javap 表）、[AGENTS.md](../../AGENTS.md)。

## 0. 一句话

**本档的驱动面目前只能停在「结构 + 诚实自报」，不能到 L-b（真机驱动）—— 卡在「拿不到命名映射」。**

## 1. L-b 可行性判定：**❌ 不可行**（四项逐条）

| 判定项 | 结论 | 读数 |
|---|---|---|
| ① **MCP 命名映射** | ❌ **不可得（唯一硬闸）** | Forge MCP maven 最早只到 **1.6.4**（`de/oceanlabs/mcp/mcp` 19 个版本，最老 1.6.4）；`mcp_snapshot` 2 589 个版本最早 **20130918-1.6.3**；`mcp_config` 只 1.21+；历史主机 `mcp.ocean-labs.de` **已死**（返回 61 B 的 "under construction"） |
| ② **官方客户端 jar** | ✅ **可得且已验签** | `1.2.5` client.jar = 4 032 098 B，sha1 `4a2fac7504182a97dcbcd7560c6392d7c8139928`（**与 Mojang meta 声明逐字一致**） |
| ③ **按键面** | ❌ **无 ModLoader 侧入口**（且依赖 ①） | 见 [safe-api.md](safe-api.md)「按键面」段：ModLoader 只有 `registerKey` / `keyboardEvent`（**入站**）；vanilla 有 `KeyBinding.setKeyBindState` ⇒ **不缺入口，缺名字** |
| ④ **真机启动方式** | ✅ **可得** | version JSON 自带 `libraries`(13) + `assetIndex=pre-1.6`(74 091 B 实取) + `mainClass=net.minecraft.launchwrapper.Launch`；`launchwrapper-1.5` / `asm-all-4.1` 的 pom 实取成功 |

**②④ 都拿到了 ⇒ 不是「环境什么都没有」；真正挡住的是 ①，而 ③ 又依赖 ①。**

## 2. 为什么 ② 拿到也没用（**这条最关键**）

客户端 jar **是全混淆的**：

| 版本 | `.class` 总数 | `net/minecraft/*` 条数 | 默认包（混淆短名）类数 |
|---|---|---|---|
| 1.2.5 | 1 109 | 3 | **1 029** |

而且那少数几个可读类只是 **applet 壳**：本机 `javap` 实测 `net.minecraft.client.Minecraft` 是
**abstract**，成员类型全是混淆名（1.2.5：`public ki c; public xd f;`；1.5.2：`public bdr b;`）。
⇒ 驱动面要的六类名字**全落在默认包的混淆类里**，**没有映射 = 无法命名**。

## 3. 驱动面逐动作状态（与 `safe-api.md` 同口径）

| 动作 | 状态 |
|---|---|
| `ping` / `set_arbitration` / `status` | ✅ 不碰 MC |
| `take_over` / `release_all` | ✅ **纯仲裁**（不碰 MC）⇒ 如实算「能做」 |
| 其余 **19** 个（含 `press` / `query_player_state` / `screenshot` / `block_at` / `open_world` …） | ❌ `TODO(未核实)` fail-closed |

⇒ `/status` 实测：`actions` = `ping` / `set_arbitration` / `status` / `release_all` / `take_over`；
`actionsUnavailable` 19 条；`capabilities.driverAvailable` = **false**。

## 4. 解锁条件

| 路径 | 要做什么 | 状态 |
|---|---|---|
| **A. 老 MCP zip（4.x–7.x 时代）** | 从镜像/归档取到**实物**，并核实**它确实覆盖 1.2.5** | **未取到** |
| **B. 第三方 legacy 映射项目** | 例 `MCPHackers/RetroMCP-Java`（README 实取，自述支持 reobf；**支持版本清单未核实**）。⚠ 走这条会**把证据链从「官方 MCP」换成「第三方件」⇒ 需用户拍板** | 未核实 |
| **C. 手工命名 ~1 029 个类** | — | **不可行** |

**没有证否**「MCP 从来没有过这两个版本的映射」—— 只证了「**在 Forge maven 与历史主机上今天取不到**」。

## 5. 负结果清单（免得下一位重走）

| 目标 | 结果 |
|---|---|
| `http://mcp.ocean-labs.de/` | 61 B "under construction"（**主机已死**） |
| `https://maven.minecraftforge.net/de/oceanlabs/mcp/` 根索引 | **404** |
| `.../RetroMCP-Java/master/{versions.json,src/main/resources/versions.json,conf/versions.json}` | 三个路径**全 0 B** |
| `https://api.github.com/repos/MCPHackers/RetroMCP-Java/releases/latest` | 0 B |
| 本机 `curl` / PowerShell 直连或走代理 | **exit 35（TLS 握手失败）** ⇒ 抓取改用 JVM（`Fetch.java`） |

## 6. 复现命令

```powershell
# ① 三个 maven 面的版本清单（判 ①）
#   https://maven.minecraftforge.net/de/oceanlabs/mcp/mcp/maven-metadata.xml
#   https://maven.minecraftforge.net/de/oceanlabs/mcp/mcp_snapshot/maven-metadata.xml
#   https://maven.minecraftforge.net/de/oceanlabs/mcp/mcp_config/maven-metadata.xml
# ② 客户端 jar（判 ②；sha1 见上表）
#   https://launcher.mojang.com/v1/objects/4a2fac7504182a97dcbcd7560c6392d7c8139928/client.jar
# ④ assets + 一个库（判 ④）
#   https://launchermeta.mojang.com/v1/packages/3d8e55480977e32acd9844e545177e69a52f594b/pre-1.6.json
#   https://libraries.minecraft.net/net/minecraft/launchwrapper/1.5/launchwrapper-1.5.pom

# 核对（本机读数）
& "$JDK8\bin\jar.exe" tf client-1.2.5.jar | Where-Object { $_ -like 'net/minecraft/*' }
& "$JDK8\bin\javap.exe" -p -cp client-1.2.5.jar net.minecraft.client.Minecraft
(Get-FileHash client-1.2.5.jar -Algorithm SHA1).Hash
```

> 完整判定记录（含原始读数与负结果）见仓库外留档 `temp/port/artifacts/modloader-1.2.5-1.5.2-lb-feasibility.md`。

---

## ⚠️ 2026-11-03 重大更新：**默认包路线已达成 L-b（1.6.2 真机实证）**

本文档前文「L-b 不可行」**只对「MCP 映射路线」成立**。另一条路线已跑通并真机验证：

- **路线 = 默认包 + 直接对官方混淆 client.jar 编译** ⇒ **不需要映射、不需要 reobf**；
- **判据**：`open_world` → `press forward` → 坐标 **dz = +4.2000 格**（四向对照 back 11.5 / left 2.2 / right 2.4 / forward 0.4365，`press jump` 走玩家物理）⇒ **驱动动作真的驱动了玩家**；
- **1.6.2 已达成 L-b**；**1.2.5 / 1.5.2 已解锁按键面（`press`）**；
- **1.6.4 仍不可行**：Risugami 自 MC 1.6.2 起停更，**1.6.4 无官方 ModLoader 发布物** ⇒ 载体不存在；
- 完整读数：`F:\B AND D MOD\artifacts\modloader-1.6.2-lb-record.md`（385 行）+ `modloader-1.6.2-lb-evidence\`（9 件）。

**两条真机才暴露的坑**（已修，勿重踩）：① 自造 tick 代理的构造**需要 GL 上下文** ⇒ 必须在 `BaseMod.load()` 里 `new`（MC 线程、`Display.create()` 之后）；② ModLoader 1.6.2 的 modDir **优先 `<gameDir>/versions/<ver>/mods`**，jar 放 `mods/` 会被无视。