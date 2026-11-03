# 1.5.2 安全 API

本档仍**不出正表**（未打开 MCP 1.5.2 named；禁止用 1.6.4 表顶上）。但 **有官方发布物可核** —— 见下。

## 构件 javap 复核——官方 zip 已入库

**构件**：`ModLoader 1.5.2.zip`（mcarchive 官方归档；本机留档 `<本地构件留档>\modloader\`，1.6.2 / 1.2.5 同批（维护机路径不入库；按 mcarchive 官方 zip 名自取））+ JDK21 `javap` 实测（`BaseMod.class` / `ModLoader.class`）：

| 接口（构件逐字） | 方法 |
|------|------|
| `BaseMod.onTickInGame` | `public boolean onTickInGame(float, net.minecraft.client.Minecraft)`（本档构件第二参是**可读名**） |
| `BaseMod.onTickInGUI` | `public boolean onTickInGUI(float, net.minecraft.client.Minecraft, axr)` |
| `ModLoader.getMinecraftInstance` | `public static net.minecraft.client.Minecraft getMinecraftInstance()`（**客户端单例取法，构件实证**） |
| `ModLoader.setInGameHook` / `setInGUIHook` | `(BaseMod, boolean, boolean)` |
| `ModLoader.addRecipe` / `addShapelessRecipe` | `(wm, Object...)`（`wm` = 混淆 ItemStack 位） |
| `ModLoader.addName` / `addLocalization` / `registerBlock`(+`Class`) / `registerTileEntity`(+第三参) / `addSpawn` | 均在（形状同 `modloader/1.6.4` 表；vanilla 参数为混淆名） |
| `ModLoader.getUniqueEntityId()` | ❌ 本档构件**没有**（只 1.2.5 有） |

⚠️ 除上表明确可读的少数名字外，构件里 vanilla 参数多为混淆名（`wm`/`apa`/`axr`/`nn`）⇒ **vanilla 类型名不得据本构件写出**（本档无 mapping 腿）。

## 桥路线可行性核对（更新；原文三条判据的①已作废）

1. ~~**tick 钩子无出处**~~ → **已取得**：`BaseMod.onTickInGame(float, Minecraft)` + `ModLoader.setInGameHook`（上表构件实证）。原文「1.2.5/1.5.2 的官方发布件没有稳定可核落点」**已被推翻**（mcarchive 存官方 zip，实取 + javap）。
2. **MC 侧其余接口仍缺**：玩家对象 / 位置字段、发聊天、截图、读方块签名（**客户端单例已解决** = `ModLoader.getMinecraftInstance()`）；要补须自备 MCP 1.5.2 named（本档仍没有）。
3. **无 Gradle 载体**（MCP + Eclipse 形态）⇒ 即便有出处，也只能走「手工 javac + 打 jar + 人工装」，本仓不代跑。

**结论**：出处面比此前 好了一档（tick 与客户端单例可写死），但**要真跑起来仍须自备 MCP 1.5.2 工作区补 MC 侧字段名 + 手工装**；不做的前提下，替代路线（离线解析存档 region/NBT + 人工驱动）仍更划算 —— 见社区短文坑 74 / 坑 75。

---

## 驱动面（玩家级）：**六类 MC 侧名字本档无出处 ⇒ 逐条 fail-closed**

> 落库：2026-11-02（task-17 实测）。同目录 `driver-shape.md` 是完整形态说明。

桥面（命令级）之外，驱动面还需要下面六类 MC 侧名字。**本档这三类出处都没有**（`processed/safe-api.md` 是空表；
`knowledge/common/safe-api.md` 的构件 javap 表只覆盖 `BaseMod` / `ModLoader` / `Minecraft` 三个类的形状）：

| # | 类别 | 驱动面用途 | 本档状态 |
|---|---|---|---|
| 1 | 按键字段名 + 按下/松开入口 | `press` / `release_all` | **无出处** ⇒ fail-closed |
| 2 | 玩家/位置（`player` / 坐标 / 视角） | `query_player_state` / `bot_look` | **无出处** ⇒ fail-closed |
| 3 | 聊天发送 | `chat_say` / `chat_command` | **无出处** ⇒ fail-closed |
| 4 | 截图 | `screenshot` | **无出处** ⇒ fail-closed |
| 5 | 读方块 | `block_at` / `bot_break` / `bot_place` | **无出处** ⇒ fail-closed |
| 6 | 开世界 | `open_world` | **无出处** ⇒ fail-closed |

**纯仲裁、不碰 MC 的两个动作如实算「能做」**：`take_over`（`Arbitration.takeOver()`）与 `release_all`
（`Arbitration.releaseOwned()`；本档 `supportedKeys()` 为空表 ⇒ 永远没有可放的键，但动作本身不依赖 MC 名字）。
把它们算成「做不了」是**反向谎报**。

⇒ **要真驱动必须先补一个 MCP named 工作区**，在其中核出六类真名与签名。
**按键面已查清（2026-11-02）** —— 见本文末「按键面」段：ModLoader 自己**没有**按键注入 API，
但 **vanilla 有**（1.6.2 `KeyBinding`=`atp`，静态 `atp.a(int,boolean)` = `setKeyBindState`）
⇒ **不需要给 Minecraft 打补丁**；本档缺的只是**名字**，不是入口。

**另有一处结构性问题（未核实）**：真构件的 `BaseMod` / `ModLoader` 在**默认包**（`jar tf` 实测无 `net/` 前缀），
而 MCP 时代 mod 源码用 `package net.minecraft.src;` —— 两者不能同时成立 ⇒ 官方 zip 是**二进制投放形态**。
且**未 reobf**（源码用可读名、真机是混淆 jar）⇒ 现产出 jar 直接丢进混淆客户端**不会 tick**。

---

## 按键面（2026-11-02 查清）：**ModLoader 没有"按下某个键"的 API；vanilla 有**

**结论**：ModLoader 的键盘面**全是入站**（登记 + 回调），**没有**任何"把键按下去"的入口；
而**原版 Minecraft 自己有**，且它就在客户端 jar 里 ⇒ **按键面不需要给 Minecraft 打补丁**。
本档缺的**只是名字**（无 MCP named 工作区），不是入口。

### 本机 javap 实证（真构件 `ModLoader-1.5.2.zip`，逐字）

```
ModLoader:
  private static final java.util.Map<BaseMod, java.util.Map<ava, boolean[]>> keyList;
  public static ava[] registerAllKeys(ava[]);
  public static void registerKey(BaseMod, ava, boolean);
BaseMod:
  public void keyboardEvent(ava);
```

**读法**：`registerKey` 是「把某个键**登记**给我，按下时回调我」——**入站**；
`keyboardEvent` 是**被回调**。两者都**不能**产生一次按键。

> **旁证（同一次 javap 的意外收获）**：ModLoader 自己的泛型签名把键类型写成了**可读上下文里的混淆名**
> —— 本档是 `ava`。这正好说明**混淆名逐档不同**：1.2.5 = `afu` / 1.5.2 = `ava` / **1.6.2 = `atp`**。

### vanilla 侧的注入点

| 项 | 取值 | 出处 |
|---|---|---|
| 键类 | `KeyBinding` | 1.6.2 混淆名 **`atp`**（上面 javap 的泛型位可读） |
| 注入方法 | 静态 **`atp.a(int,boolean)`** = `setKeyBindState` | task-22 用户/Lead 提供；**本档未自行复现**（无 MCP named 工作区） |

⇒ **推论**：要做按键面，**不必改 Minecraft 字节码**，只要拿到 `KeyBinding` / `GameSettings` 的**可读名**。
而"拿名字"正是本档缺的那一件 ⇒ **按键面与其余五类卡在同一处**，不是两个独立问题。

> ⚠ 本档 1.5.2 的 L-b 判定 = **不可行**，理由见 [driver-shape.md](driver-shape.md)。

