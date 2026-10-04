# Forge 1.7.10 javadoc 核实表

来源：search_forge_docs version=1.7.10（skmedix ForgeJavaDocs）。仅类名索引，不是 1.12 教程树。禁止 DeferredRegister。

| 名称 | 出处文档 id |
|------|-------------|
| ItemBlock | 1.7.10/net/minecraft/item/ItemBlock |
| ItemBlockWithMetadata | 1.7.10/net/minecraft/item/ItemBlockWithMetadata |
| ItemAnvilBlock | 1.7.10/net/minecraft/item/ItemAnvilBlock |
| EntityFallingBlock | 1.7.10/net/minecraft/entity/item/EntityFallingBlock |
| cpw.mods.fml.common.Loader | 1.7.10/cpw/mods/fml/common/Loader |
| ISimpleBlockRenderingHandler | 1.7.10/cpw/mods/fml/client/registry/ISimpleBlockRenderingHandler |
| GameRegistry | 1.7.10/cpw/mods/fml/common/registry/GameRegistry |
| GameRegistry.UniqueIdentifier | 1.7.10/cpw/mods/fml/common/registry/GameRegistry.UniqueIdentifier |
| FMLCommonHandler | 1.7.10/cpw/mods/fml/common/FMLCommonHandler |
| GameData | 1.7.10/cpw/mods/fml/common/registry/GameData |

方法签名以 javadoc 页为准，禁止默写。download_official_mdk 对本版 **MDK_NOT_PINNED**。
---
## 事件总线 / tick 钩子 / 最小桥 mod 所需接口
**出处** = 本档 javadoc 语料实页（`data/forge_javadoc/1.7.10/raw/<path>.md`，源 = skmedix ForgeJavaDocs `1.7.10-*`）。
**表外名字禁止输出**；本表只收「tick 钩子 + 一个不含 GUI 动作的最小 HTTP 桥」所需的接口。

> ⚠️ **字段名的置信度低于类名与方法名**：上表 `Minecraft` 的三个字段（`thePlayer` / `theWorld` / `mcDataDir`）来自 **javadoc 语料**；同一 MC 版本的 MCP **字段名随映射快照而异**（已在 1.12.2 实测到：javadoc 写 `mcDataDir`/`thePlayer`/`theWorld`，而该档 `stable_39` 构件里是 `gameDir`/`player`/`world`）。本机**没有 1.7.10–1.11.2 的构件** ⇒ 这三个名字**未编译验证**；工程若按别的快照编译，按报错改名即可（类名/方法名不受影响）。
| 项 | 本档事实 | 语料页 |
|---|---|---|
| tick 事件类 | `cpw.mods.fml.common.gameevent.TickEvent.ClientTickEvent`（`public static class … extends TickEvent`） | `cpw/mods/fml/common/gameevent/TickEvent.ClientTickEvent.md` |
| 事件基类字段 | `TickEvent.Phase phase` / `Side side` / `TickEvent.Type type`；构造 `TickEvent(TickEvent.Type, Side, TickEvent.Phase)` | `cpw/mods/fml/common/gameevent/TickEvent.md` |
| **枚举常量（`Phase.END` / `Type.CLIENT`）** | ⚠️ **语料只给 `valueOf`/`values`，不给常量名 ⇒ 本表不背书**（桥模板因此**不读 phase**：请求驱动，逐 tick 轮询队列即可） | `cpw/mods/fml/common/gameevent/TickEvent.Phase.md` · `TickEvent.Type.md` |
| 订阅注解 | `@cpw.mods.fml.common.eventhandler.SubscribeEvent` | `cpw/mods/fml/common/eventhandler/SubscribeEvent.md` |
| **注册到哪条总线** | `FMLCommonHandler.instance().bus()`（本档**未** `@Deprecated` ⇒ 游戏事件走 FML 总线） | `cpw/mods/fml/common/FMLCommonHandler.md` |
| 客户端单例 | `Minecraft.getMinecraft()`（static） | `net/minecraft/client/Minecraft.md` |
| 客户端字段 | `thePlayer` / `theWorld`(`WorldClient`) / `currentScreen` / `gameSettings` / `mcDataDir`(File) / `displayWidth`·`displayHeight`(int) | 同上 |
| 玩家对象 | `Minecraft.thePlayer`（javadoc 类型 `EntityClientPlayerMP`） | 同上 · `net/minecraft/client/entity/` |
| **发聊天/命令** | `EntityClientPlayerMP#sendChatMessage(String)`（**在 `EntityClientPlayerMP` 上**；`EntityPlayerSP` 页只有 `addChatMessage(IChatComponent)`） | `net/minecraft/client/entity/EntityClientPlayerMP.md` |
| 位置/朝向/落地 | 公开字段 `posX` / `posY` / `posZ` / `rotationYaw` / `rotationPitch` / `onGround`；**无 `getPosition()`**、**本档无 `BlockPos`** | `net/minecraft/entity/Entity.md` |
| 读方块 | `World#getBlock(int,int,int): Block`（**无 `getBlockState`**；本档无 `IBlockState` 页）；`Block.blockRegistry`（`RegistryNamespaced`） | `net/minecraft/world/World.md` · `net/minecraft/block/Block.md` |
| 空气判定 | **本档无 `Block.isAir` 页 ⇒ 不提供**（桥的 `block_at` 在 1.7.10 只回类名） | `net/minecraft/block/Block.md` |
| 截图 | `ScreenShotHelper#saveScreenshot(File, int, int, Framebuffer): IChatComponent`；帧缓冲取 `Minecraft#getFramebuffer(): Framebuffer` | `net/minecraft/util/ScreenShotHelper.md` · `net/minecraft/client/Minecraft.md` |
**HTTP 服务**：`com.sun.net.httpserver.HttpServer`（**JDK 自带**，非 MC API ⇒ 无需本档语料背书），JDK 8 可用。