# listener 模式（Rift 的「事件系统」）

> **本文件的 Rift 侧签名全部来自 `javap` 对真构件 `Rift-1.0.4-106-dev.jar`（sha256 `5B5E333D…D5463`）**，逐条对照见 `../knowledge/common/verified-api.md`。
> **MC 侧类型 2026-10-06 起已对真构件核**：本机有 `forgeBin-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar`（与 rift scaffold 的 `snapshot_20180921` 同映射层），桥所用 `net.minecraft.*` 逐名 javap 43/43 在盘（含 `Minecraft.getInstance()` = `public static`）。正文里写于本轮之前的 `TODO(未核实)` 标记是历史痕迹：**类存在性腿已闭合**，签名细节仍以 `joined.tsrg`/`methods.csv` + 该 jar 的 javap 为准；新增名字照旧先核再写。

## 1. 机制

Rift **没有** `@Mod` 注解、**没有**事件总线、**没有** `FMLxxxEvent`。取而代之：

1. 写一个普通类，实现若干 `org.dimdev.rift.listener.**` 接口；
2. 在 `src/main/resources/riftmod.json` 的 `listeners` 数组里**列出该类的 FQCN**；
3. Rift 实例化它，在恰当时机回调你的方法。

Rift 自带的 `riftmod.json`（jar 内，schema 可对照）：`{ "id", "name", "authors":[], "listeners":[FQCN, …] }`。

## 2. 最小骨架（客户端每 tick）

```java
package com.example.examplemod;

import org.dimdev.rift.listener.client.ClientTickable;

public class ExampleClient implements ClientTickable {
    @Override
    public void clientTick() {
        // ClientTickable#clientTick() 是**无参**（javap: public abstract void clientTick();）
        // ⇒ 要拿客户端实例必须自己取单例
        // 单例访问式已由真构件核（2026-10-06）：import net.minecraft.client.Minecraft;
        // 然后 Minecraft mc = Minecraft.getInstance();  // javap = public static Minecraft getInstance()（旧「static 性证不出」作废）
    }
}
```

配套的 `src/main/resources/riftmod.json`：

```json
{
  "id": "examplemod",
  "name": "Example Mod",
  "authors": ["you"],
  "listeners": ["com.example.examplemod.ExampleClient"]
}
```

## 3. 一个类同时实现多个接口

```java
package com.example.examplemod;

import org.dimdev.rift.listener.BlockAdder;
import org.dimdev.rift.listener.ItemAdder;
import org.dimdev.rift.listener.client.ClientTickable;

public class ExampleMod implements ClientTickable, ItemAdder, BlockAdder {

    @Override public void clientTick() { /* 客户端每 tick */ }

    @Override public void registerItems() { /* 注册物品的时机 */ }

    @Override public void registerBlocks() { /* 注册方块的时机 */ }
}
```

`registerItems()` / `registerBlocks()` 的**具体注册写法（调哪个 MC 注册表方法、参数形状）本档未核** ——
`TODO(未核实)`：先 `javap` 自备的 1.13.2 构件，或 `search_docs platform=rift version=1.13.2`。

## 4. 接口按用途速查（签名逐字来自 javap）

### 4.1 tick / 生命周期

| 接口 | 方法（javap 真构件） |
|---|---|
| `…listener.client.ClientTickable` | `void clientTick()` —— **无参** |
| `…listener.ServerTickable` | `void serverTick(net.minecraft.server.MinecraftServer)` |
| `…listener.MinecraftStartListener` | `void onMinecraftStart()` |
| `…listener.BootstrapListener` | `void afterVanillaBootstrap()` |
| `org.dimdev.riftloader.listener.InitializationListener` | `void onInitialization()` —— **不在 `org.dimdev.rift.listener` 包**，做 Mixin / 变换器时用它 |

### 4.2 注册类目（Rift 把 vanilla 注册拆成回调）

`registerBlocks()` / `registerItems()` / `registerEntityTypes()` / `registerTileEntityTypes()` /
`registerEnchantments()` / `registerSounds()` / `registerParticles()` / `registerMobEffects()` /
`registerFluids()` / `registerMessages(RegistryNamespaced<ResourceLocation, Class<? extends Message>>)` /
`registerBiomes()` / `registerStructureNames()` / `registerDispenserBehaviors()` /
`addArgumentTypes()`（`ArgumentTypeAdder` 实名 —— 2026-10-06 对真构件 javap：只有 `public abstract void addArgumentTypes()`，全 jar 无 `registerArgumentTypes`；本行旧写法系笔误、与 `verified-api.md` §3 自相矛盾）/ `registerBiomes()` / `afterVanillaBootstrap()` 等，完整 39 个见 `verified-api.md` §3。

### 4.3 渲染 / 客户端 UI

| 接口 | 方法 |
|---|---|
| `…listener.client.EntityRendererAdder` | `void addEntityRenderers(Map<Class<? extends Entity>, Render<? extends Entity>>, RenderManager)` |
| `…listener.client.TileEntityRendererAdder` | `void addTileEntityRenderers(Map<Class<? extends TileEntity>, TileEntityRenderer<? extends TileEntity>>)` |
| `…listener.client.OverlayRenderer` | `void renderOverlay()` |
| `…listener.client.GameGuiAdder` | `void displayGui(EntityPlayerSP, String, IInteractionObject)`；`void displayContainerGui(EntityPlayerSP, String, IInventory)` |
| `…listener.client.KeybindHandler` | `void processKeybinds()` |
| `…listener.client.KeyBindingAdder` | `Collection<? extends KeyBinding> getKeyBindings()` |
| `…listener.client.TextureAdder` | `Collection<? extends ResourceLocation> getBuiltinTextures()` |
| `…listener.client.AmbientMusicTypeProvider` | `MusicTicker$MusicType getAmbientMusicType(Minecraft)` ＋ 静态 `newMusicType(String, SoundEvent, int, int)` |

### 4.4 网络 / 数据包 / 命令

| 接口 | 方法 |
|---|---|
| `…listener.PacketAdder` | `registerHandshakingPackets / registerPlayPackets / registerStatusPackets / registerLoginPackets`，四个都收 `PacketAdder$PacketRegistrationReceiver` |
| `…listener.CustomPayloadHandler` | `boolean clientHandlesChannel(ResourceLocation)`；`void clientHandleCustomPayload(ResourceLocation, PacketBuffer)`；`boolean serverHandlesChannel(ResourceLocation)`；`void serverHandleCustomPayload(ResourceLocation, PacketBuffer)` —— **本档做自定义网络包走这条，不是 Forge 的 `SimpleChannel`** |
| `…listener.MessageAdder` | `void registerMessages(RegistryNamespaced<ResourceLocation, Class<? extends Message>>)` |
| `…listener.CommandAdder` | `void registerCommands(CommandDispatcher<CommandSource>)` —— 1.13.2 的命令走 Brigadier |
| `…listener.DataPackFinderAdder` / `…listener.ResourcePackFinderAdder` | `List<IPackFinder> getDataPackFinders()` / `getResourcePackFinders()` |

### 4.5 世界 / 生成 / 其它

`ChunkEventListener`（`onChunkLoad/onChunkUnload`）、`ChunkGeneratorReplacer`（泛型 `IChunkGenSettings` → `IChunkGenerator<T>`）、
`BiomeAdder`（`registerBiomes()` + `Collection<Biome> getOverworldBiomes()`）、`WorldChanger`（`modifyBiome(int, String, Biome)`）、
`StructureAdder`、`ToolEfficiencyProvider`、`BurnTimeProvider`、`FluidAdder`、`DimensionTypeAdder`、
`DispenserBehaviorAdder`、`ArgumentTypeAdder`、`RecipeAdder`、`RecipeSerializerAdder` —— 签名见 `verified-api.md` §3。

## 5. ⚠️ listener 在 MC 1.13.2 上实测不派发（2026-10-05 真机读数）

机制本身（`riftmod.json` → `listeners[]` → 接口回调）在本仓**已对真构件核过 API**，但真机跑出这样一条：

- 客户端**能起来**（LWJGL / OpenAL / 纹理图集 / Narrator 全绿，停在主菜单）；
- 但日志里 `mixins.rift.hooks.json` 的 **21 个 hook mixin 全部 target not found**
  （`client.MixinMinecraft` / `client.MixinGameSettings` / `MixinChunk` / `MixinFurnace` …），
  target 名是 **notch 短名**（`cfi` / `cfl` / `bna` / `bjl`）⇒ **refmap 本身是好的**，但这些名字属于 **MC 1.13**；
- ⇒ 注入点不存在 ⇒ **`ClientTickable#clientTick()` 与 `MinecraftStartListener#onMinecraftStart()` 都不会被调**
  （实测 `System.out.println` 探针一个都没打出来）。

⇒ **Rift 1.0.4-106（原生线）只支持 MC 1.13**；在 1.13.2 上「能启动但 listener 不派发」。1.13.1/1.13.2 的支持线在 **Chocohead 社区分支** `newerer`/`newerest`（2026-10-06 用户裁定 + GitHub API 同日核，详 `../knowledge/common/bridge-api.md` §3.3 第 3 条）—— 本档 scaffold 用原生件，上述结论对本档成立。
本档其余接口（注册类目、渲染、网络、命令…）同理**不可信**，因为它们大多也靠 hook mixin 注入。
详见 `gradle-recipe.md` §5。

## 6. 常见坑

- **`ServerTickable` 没有 `InstanceOfServerTickable`**：网上/口耳相传有这个名字，**jar 里不存在**（全 jar 扫名 0 命中）。
- **一个 jar 一份 `riftmod.json`**：两个 `riftmod.json` 打在一个 jar 里会被其中一个盖掉 ⇒ 要多 mod 就分 jar，或把自己的类名**追加**进同一份 `listeners` 数组。
- **listener 不在 `listeners[]` 里就永远不会被回调**：类写了、jar 装了、日志没报错，就是没进数组。
- **注册时机不是你能选的**：`registerItems()` 什么时候被调用、和其他 `registerX` 的先后，**javap 看不出来**（要 mixin 导出或真机日志）⇒ 别靠猜顺序写依赖。
- **MC 侧类型全部未核**：本档所有 `net.minecraft.*` 名字来自 `forge_1.13.2` 映射（本档 scaffold 钉的是同一个 `snapshot_20180921`），**不是**对 1.13.2 构件 javap 出来的。
- **`libs/` 里只能放一份 rift jar**：两份同 id 会 `DuplicateModException`（见 `gradle-recipe.md` 坑 6）。
- 改 listener 方法名之前先看 `../knowledge/common/verified-api.md`（javap 真构件表）——本档 wiki 抓取表 `listeners.md` 的接口名与方法名已与之 100% 对账一致，但**签名精度以真构件表为准**。