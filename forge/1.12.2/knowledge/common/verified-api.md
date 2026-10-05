# Forge 1.12.2 已核实接口（桥 / 事件面）

（本档为**薄档**：只有下面的表；类名索引见 `search_forge_docs` / `list_forge_versions`。）
---
## 事件总线 / tick 钩子 / 最小桥 mod 所需接口
**出处** = 本档 javadoc 语料实页（`data/forge_javadoc/1.12.2/raw/<path>.md`，源 = skmedix ForgeJavaDocs `1.12.2-*`）。
**表外名字禁止输出**；本表只收「tick 钩子 + 一个不含 GUI 动作的最小 HTTP 桥」所需的接口。
| 项 | 本档事实 | 语料页 |
|---|---|---|
| tick 事件类 | `net.minecraftforge.fml.common.gameevent.TickEvent.ClientTickEvent`（`public static class … extends TickEvent`） | `net/minecraftforge/fml/common/gameevent/TickEvent.ClientTickEvent.md` |
| 事件基类字段 | `TickEvent.Phase phase` / `Side side` / `TickEvent.Type type`；构造 `TickEvent(TickEvent.Type, Side, TickEvent.Phase)` | `net/minecraftforge/fml/common/gameevent/TickEvent.md` |
| **枚举常量（`Phase.END` / `Type.CLIENT`）** | ⚠️ **语料只给 `valueOf`/`values`，不给常量名 ⇒ 本表不背书**（桥模板因此**不读 phase**：请求驱动，逐 tick 轮询队列即可） | `net/minecraftforge/fml/common/gameevent/TickEvent.Phase.md` · `TickEvent.Type.md` |
| 订阅注解 | `@net.minecraftforge.fml.common.eventhandler.SubscribeEvent` | `net/minecraftforge/fml/common/eventhandler/SubscribeEvent.md` |
| **注册到哪条总线** | `MinecraftForge.EVENT_BUS`（本档 `FMLCommonHandler.bus()` 已 **`@Deprecated`**；`MinecraftForge.EVENT_BUS` 的 javadoc 逐字写 “all events for Forge will be fired on these, you should use this to register all your listeners”） | `net/minecraftforge/fml/common/FMLCommonHandler.md` · `net/minecraftforge/common/MinecraftForge.md` |
| 客户端单例 | `Minecraft.getMinecraft()`（static） | `net/minecraft/client/Minecraft.md` |

> ⚠️ **本档已实测的「文档 ↔ 构件」差异（只有一项，别扩大化）**：六档 javadoc 实页里，`Minecraft` 的**游戏目录字段一律写作 `mcDataDir`**，
> 而本仓 `forge/1.12.2/scaffold` 钉的映射快照 `stable_39` 对应的**真构件**
> （`~/.gradle/caches/minecraft/net/minecraftforge/forge/1.12.2-14.23.5.2847/stable/39/forgeBin-*.jar`，JDK 8 `javap -p`）
> 里它叫 **`gameDir`**。⇒ 游戏目录一项**以构件为准**（本档 driver 用 `gameDir` 已 JDK 8 `javac` 编译通过）。
> **`thePlayer`/`theWorld` ≠ 本档 javadoc 的写法**（上一稿曾误记）：本档 javadoc 的玩家/世界字段**就是** `player`(`EntityPlayerSP`) / `world`(`WorldClient`)，
> 与构件一致。改名边界在 **1.10.2 → 1.11.2**：`thePlayer`/`theWorld` 只出现在 `1.7.10 / 1.8.9 / 1.9.4 / 1.10.2` 四档的 javadoc 里（逐页实测）。
> **推论（外推要谨慎）**：`forge 1.7.10–1.11.2` 本机**没有构件**，其字段名只有 javadoc 语料可依 ⇒ **未编译验证**，首跑可能要按报错改名；
> 别把 1.12.2 的 `gameDir` 结论外推到它们，也别把 `thePlayer`/`theWorld` 外推到 1.11.2/1.12.2。

| 客户端字段 | **以真构件为准**：`player`(`EntityPlayerSP`) / `world`(`WorldClient`) / `currentScreen` / `gameSettings` / **`gameDir`**(File) / `displayWidth`·`displayHeight`(int) | 真构件 javap（下条） |
| 玩家对象 | `Minecraft.player`（javadoc 类型 `EntityPlayerSP`；**该档 javadoc 与构件一致**，不是 `thePlayer`） | `net/minecraft/client/Minecraft.md` · `net/minecraft/client/entity/` |
| **发聊天/命令** | `EntityPlayerSP#sendChatMessage(String)` | `net/minecraft/client/entity/EntityPlayerSP.md` |
| 位置/朝向/落地 | 公开字段 `posX` / `posY` / `posZ` / `rotationYaw` / `rotationPitch` / `onGround` + `getPosition(): BlockPos` | `net/minecraft/entity/Entity.md` |
| 读方块 | `World#getBlockState(BlockPos): IBlockState` + `IBlockState#getBlock()`；`Block#getRegistryName(): String` | `net/minecraft/world/World.md` · `net/minecraft/block/Block.md` |
| 空气判定 | `Block#isAir(IBlockState, IBlockAccess, BlockPos)`（**1.9.4 起签名多一个 `IBlockState`**） | `net/minecraft/block/Block.md` |
| 截图 | `ScreenShotHelper#saveScreenshot(File, int, int, Framebuffer): ITextComponent`（**1.9.4 起返回类型改名**）；帧缓冲取 `Minecraft#getFramebuffer(): Framebuffer` | `net/minecraft/util/ScreenShotHelper.md` · `net/minecraft/client/Minecraft.md` |
**HTTP 服务**：`com.sun.net.httpserver.HttpServer`（**JDK 自带**，非 MC API ⇒ 无需本档语料背书），JDK 8 可用。

- **交叉复证（编译级）**：本档另有真构件 `forgeBin-1.12.2-14.23.5.2847.jar`，JDK 8 `javap -p` 已复证 `Minecraft.getFramebuffer()` / `Minecraft.player` 字段 / `Minecraft.gameDir` 字段 / `World.getBlockState(BlockPos)` / `EntityPlayerSP.sendChatMessage(String)` / `Entity.getPosition()` / `ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer)` —— 与本表逐条一致。