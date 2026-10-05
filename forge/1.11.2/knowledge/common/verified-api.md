# Forge 1.11.2 已核实接口（桥 / 事件面）

（本档为**薄档**：只有下面的表；类名索引见 `search_forge_docs` / `list_forge_versions`。）
---
## 事件总线 / tick 钩子 / 最小桥 mod 所需接口
**出处** = 本档 javadoc 语料实页（`data/forge_javadoc/1.11.2/raw/<path>.md`，源 = skmedix ForgeJavaDocs `1.11.2-*`）。
**表外名字禁止输出**；本表只收「tick 钩子 + 一个不含 GUI 动作的最小 HTTP 桥」所需的接口。

> ⚠️ **字段名的置信度低于类名与方法名**：上表 `Minecraft` 的三个字段（`player` / `world` / `mcDataDir`）来自 **javadoc 语料**；同一 MC 版本的 MCP **字段名随映射快照而异**（已在 1.12.2 实测到：**只有游戏目录一项**不同 —— javadoc 写 `mcDataDir`，而该档 `stable_39` 构件里是 `gameDir`；**玩家/世界字段 javadoc 与构件一致，均为 `player`/`world`**）。本机**没有 1.7.10–1.11.2 的构件** ⇒ 这三个名字**未编译验证**；工程若按别的快照编译，按报错改名即可（类名/方法名不受影响）。
| 项 | 本档事实 | 语料页 |
|---|---|---|
| tick 事件类 | `net.minecraftforge.fml.common.gameevent.TickEvent.ClientTickEvent`（`public static class … extends TickEvent`） | `net/minecraftforge/fml/common/gameevent/TickEvent.ClientTickEvent.md` |
| 事件基类字段 | `TickEvent.Phase phase` / `Side side` / `TickEvent.Type type`；构造 `TickEvent(TickEvent.Type, Side, TickEvent.Phase)` | `net/minecraftforge/fml/common/gameevent/TickEvent.md` |
| **枚举常量（`Phase.END` / `Type.CLIENT`）** | ⚠️ **语料只给 `valueOf`/`values`，不给常量名 ⇒ 本表不背书**（桥模板因此**不读 phase**：请求驱动，逐 tick 轮询队列即可） | `net/minecraftforge/fml/common/gameevent/TickEvent.Phase.md` · `TickEvent.Type.md` |
| 订阅注解 | `@net.minecraftforge.fml.common.eventhandler.SubscribeEvent` | `net/minecraftforge/fml/common/eventhandler/SubscribeEvent.md` |
| **注册到哪条总线** | `MinecraftForge.EVENT_BUS`（本档 `FMLCommonHandler.bus()` 已 **`@Deprecated`**；`MinecraftForge.EVENT_BUS` 的 javadoc 逐字写 “all events for Forge will be fired on these, you should use this to register all your listeners”） | `net/minecraftforge/fml/common/FMLCommonHandler.md` · `net/minecraftforge/common/MinecraftForge.md` |
| 客户端单例 | `Minecraft.getMinecraft()`（static） | `net/minecraft/client/Minecraft.md` |
| 客户端字段 | `player` / `world`(`WorldClient`) / `currentScreen` / `gameSettings` / `mcDataDir`(File) / `displayWidth`·`displayHeight`(int) | 同上 |
| 玩家对象 | `Minecraft.player`（javadoc 类型 `EntityPlayerSP`） | 同上 · `net/minecraft/client/entity/` |
| **发聊天/命令** | `EntityPlayerSP#sendChatMessage(String)` | `net/minecraft/client/entity/EntityPlayerSP.md` |
| 位置/朝向/落地 | 公开字段 `posX` / `posY` / `posZ` / `rotationYaw` / `rotationPitch` / `onGround` + `getPosition(): BlockPos` | `net/minecraft/entity/Entity.md` |
| 读方块 | `World#getBlockState(BlockPos): IBlockState` + `IBlockState#getBlock()`；`Block#getRegistryName(): String` | `net/minecraft/world/World.md` · `net/minecraft/block/Block.md` |
| 空气判定 | `Block#isAir(IBlockState, IBlockAccess, BlockPos)`（**1.9.4 起签名多一个 `IBlockState`**） | `net/minecraft/block/Block.md` |
| 截图 | `ScreenShotHelper#saveScreenshot(File, int, int, Framebuffer): ITextComponent`（**1.9.4 起返回类型改名**）；帧缓冲取 `Minecraft#getFramebuffer(): Framebuffer` | `net/minecraft/util/ScreenShotHelper.md` · `net/minecraft/client/Minecraft.md` |
**HTTP 服务**：`com.sun.net.httpserver.HttpServer`（**JDK 自带**，非 MC API ⇒ 无需本档语料背书），JDK 8 可用。