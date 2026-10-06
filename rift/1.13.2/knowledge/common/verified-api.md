# verified-api · rift 1.13.2（本档 **Rift 侧**的权威签名表）

> **性质**：本表是 **`javap` 对真构件**跑出来的，**不是 wiki 转述**。与 `listeners.md`（wiki 抓取）互为对照 ——2026-10-05 逐条比对结果是 **39 个接口名 + 全部方法名 100% 对得上**（详见末节「对账结果」）。
> **MC 侧不在本表**（本表只收 Rift 侧签名）。**2026-10-06 更新**：本机已有 MC 1.13.2 真构件（`forgeBin-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar`，forge 1.13.2 scaffold 编译遗留，与 rift scaffold 所钉 `snapshot_20180921` 同映射层）⇒ 桥所用 `net.minecraft.*` 已逐名 javap 核过（43/43 在盘；结果记在 `bridge-api.md` §3/§4，本表不重复）。`get_minecraft_source` 覆盖从 1.14 起、不含该档。

## 1. 构件（可复现）

| 项 | 值 |
|---|---|
| 坐标 | `com.github.DimensionalDevelopment:Rift:1.0.4-106`，**classifier = `dev`** |
| 文件 | `Rift-1.0.4-106-dev.jar` |
| 大小 / 条目 | 135 503 B / 155 entries |
| sha256 | `5B5E333D7DD77E89321C72802A68DBCF3F7736139EDD3AA777894A58096D5463` |
| 取法 | `curl -L -o libs/rift-1.0.4-106-dev.jar "https://jitpack.io/com/github/DimensionalDevelopment/Rift/1.0.4-106/Rift-1.0.4-106-dev.jar"` |
| 上游仓 | `DimensionalDevelopment/Rift` —— **archived**，最后提交 2019-01-01，**MIT** |
| 复现命令 | `javap -classpath Rift-1.0.4-106-dev.jar <FQCN>`（JDK 8 即可） |

**为什么用 `1.0.4-106` 而不是 wiki 记的 `1.0.3-45`**：`1.0.3-45` 只在已失效的 `www.dimdev.org/maven/` 上有，JitPack 上不存在；本表逐条比对证明 `1.0.4-106` 的 listener API 与 `listeners.md` **完全一致**，故对本仓可当等价件使用。

## 2. tick / 生命周期 / 启动（本仓桥与脚手架点名的四个）

| 类 | 真构件签名（`javap`） | 用途 |
|---|---|---|
| `org.dimdev.rift.listener.client.ClientTickable` | `public abstract void clientTick();` | **客户端每 tick**（本仓桥入口；**无参** ⇒ 自取 `Minecraft` 单例） |
| `org.dimdev.rift.listener.ServerTickable` | `public abstract void serverTick(net.minecraft.server.MinecraftServer);` | 服务端每 tick（**注意不是 `InstanceOfServerTickable`** —— jar 里没有那个类） |
| `org.dimdev.riftloader.listener.InitializationListener` | `public void onInitialization();`（由 `org.dimdev.rift.Rift` 实现） | 早期初始化；要做 Mixin / ClassFileTransformer 用它 |
| `org.dimdev.riftloader.launch.RiftLoaderClientTweaker` | 类在包内 | `tweakClass` 的正确取值（本档 scaffold 已这么写） |

## 3. 全部 listener 接口（39 个，javap 真构件全量导出）

包 `org.dimdev.rift.listener` + 子包 `…listener.client`。**表内签名逐字来自 javap**，参数里的 `net.minecraft.*` 类型**未对 MC 真构件核**。

| 接口 | 签名 |
|---|---|
| `org.dimdev.rift.listener.ArgumentTypeAdder` | `public interface org.dimdev.rift.listener.ArgumentTypeAdder {`<br>`public abstract void addArgumentTypes();` |
| `org.dimdev.rift.listener.BiomeAdder` | `public interface org.dimdev.rift.listener.BiomeAdder {`<br>`public abstract void registerBiomes();`<br>`public abstract java.util.Collection<net.minecraft.world.biome.Biome> getOverworldBiomes();` |
| `org.dimdev.rift.listener.BlockAdder` | `public interface org.dimdev.rift.listener.BlockAdder {`<br>`public abstract void registerBlocks();` |
| `org.dimdev.rift.listener.BootstrapListener` | `public interface org.dimdev.rift.listener.BootstrapListener {`<br>`public abstract void afterVanillaBootstrap();` |
| `org.dimdev.rift.listener.BurnTimeProvider` | `public interface org.dimdev.rift.listener.BurnTimeProvider {`<br>`public abstract void registerBurnTimes(java.util.Map<net.minecraft.item.Item, java.lang.Integer>);` |
| `org.dimdev.rift.listener.ChunkEventListener` | `public interface org.dimdev.rift.listener.ChunkEventListener {`<br>`public abstract void onChunkLoad(net.minecraft.world.chunk.Chunk);`<br>`public abstract void onChunkUnload(net.minecraft.world.chunk.Chunk);` |
| `org.dimdev.rift.listener.ChunkGeneratorReplacer` | `public interface org.dimdev.rift.listener.ChunkGeneratorReplacer {`<br>`public abstract <T extends net.minecraft.world.gen.IChunkGenSettings> net.minecraft.world.gen.IChunkGenerator<T> createChunkGenerator(net.minecraft.world.WorldServer, net.minecraft.world.WorldType, int);` |
| `org.dimdev.rift.listener.client.AmbientMusicTypeProvider` | `public interface org.dimdev.rift.listener.client.AmbientMusicTypeProvider {`<br>`public static net.minecraft.client.audio.MusicTicker$MusicType newMusicType(java.lang.String, net.minecraft.util.SoundEvent, int, int);`<br>`public abstract net.minecraft.client.audio.MusicTicker$MusicType getAmbientMusicType(net.minecraft.client.Minecraft);` |
| `org.dimdev.rift.listener.client.ClientTickable` | `public interface org.dimdev.rift.listener.client.ClientTickable {`<br>`public abstract void clientTick();` |
| `org.dimdev.rift.listener.client.EntityRendererAdder` | `public interface org.dimdev.rift.listener.client.EntityRendererAdder {`<br>`public abstract void addEntityRenderers(java.util.Map<java.lang.Class<? extends net.minecraft.entity.Entity>, net.minecraft.client.renderer.entity.Render<? extends net.minecraft.entity.Entity>>, net.minecraft.client.renderer.entity.RenderManager);` |
| `org.dimdev.rift.listener.client.GameGuiAdder` | `public interface org.dimdev.rift.listener.client.GameGuiAdder {`<br>`public abstract void displayGui(net.minecraft.client.entity.EntityPlayerSP, java.lang.String, net.minecraft.world.IInteractionObject);`<br>`public abstract void displayContainerGui(net.minecraft.client.entity.EntityPlayerSP, java.lang.String, net.minecraft.inventory.IInventory);` |
| `org.dimdev.rift.listener.client.KeybindHandler` | `public interface org.dimdev.rift.listener.client.KeybindHandler {`<br>`public abstract void processKeybinds();` |
| `org.dimdev.rift.listener.client.KeyBindingAdder` | `public interface org.dimdev.rift.listener.client.KeyBindingAdder {`<br>`public abstract java.util.Collection<? extends net.minecraft.client.settings.KeyBinding> getKeyBindings();` |
| `org.dimdev.rift.listener.client.OverlayRenderer` | `public interface org.dimdev.rift.listener.client.OverlayRenderer {`<br>`public abstract void renderOverlay();` |
| `org.dimdev.rift.listener.client.TextureAdder` | `public interface org.dimdev.rift.listener.client.TextureAdder {`<br>`public abstract java.util.Collection<? extends net.minecraft.util.ResourceLocation> getBuiltinTextures();` |
| `org.dimdev.rift.listener.client.TileEntityRendererAdder` | `public interface org.dimdev.rift.listener.client.TileEntityRendererAdder {`<br>`public abstract void addTileEntityRenderers(java.util.Map<java.lang.Class<? extends net.minecraft.tileentity.TileEntity>, net.minecraft.client.renderer.tileentity.TileEntityRenderer<? extends net.minecraft.tileentity.TileEntity>>);` |
| `org.dimdev.rift.listener.CommandAdder` | `public interface org.dimdev.rift.listener.CommandAdder {`<br>`public abstract void registerCommands(com.mojang.brigadier.CommandDispatcher<net.minecraft.command.CommandSource>);` |
| `org.dimdev.rift.listener.CustomPayloadHandler` | `public interface org.dimdev.rift.listener.CustomPayloadHandler {`<br>`public abstract boolean clientHandlesChannel(net.minecraft.util.ResourceLocation);`<br>`public abstract void clientHandleCustomPayload(net.minecraft.util.ResourceLocation, net.minecraft.network.PacketBuffer);`<br>`public abstract boolean serverHandlesChannel(net.minecraft.util.ResourceLocation);`<br>`public abstract void serverHandleCustomPayload(net.minecraft.util.ResourceLocation, net.minecraft.network.PacketBuffer);` |
| `org.dimdev.rift.listener.DataPackFinderAdder` | `public interface org.dimdev.rift.listener.DataPackFinderAdder {`<br>`public abstract java.util.List<net.minecraft.resources.IPackFinder> getDataPackFinders();` |
| `org.dimdev.rift.listener.DimensionTypeAdder` | `public interface org.dimdev.rift.listener.DimensionTypeAdder {`<br>`public static net.minecraft.world.dimension.DimensionType newDimensionType(int, java.lang.String, java.lang.String, java.util.function.Supplier<? extends net.minecraft.world.dimension.Dimension>);`<br>`public abstract java.util.Set<? extends net.minecraft.world.dimension.DimensionType> getDimensionTypes();` |
| `org.dimdev.rift.listener.DispenserBehaviorAdder` | `public interface org.dimdev.rift.listener.DispenserBehaviorAdder {`<br>`public abstract void registerDispenserBehaviors();` |
| `org.dimdev.rift.listener.EnchantmentAdder` | `public interface org.dimdev.rift.listener.EnchantmentAdder {`<br>`public abstract void registerEnchantments();` |
| `org.dimdev.rift.listener.EntityTypeAdder` | `public interface org.dimdev.rift.listener.EntityTypeAdder {`<br>`public abstract void registerEntityTypes();` |
| `org.dimdev.rift.listener.FluidAdder` | `public interface org.dimdev.rift.listener.FluidAdder {`<br>`public abstract void registerFluids();` |
| `org.dimdev.rift.listener.ItemAdder` | `public interface org.dimdev.rift.listener.ItemAdder {`<br>`public abstract void registerItems();` |
| `org.dimdev.rift.listener.MessageAdder` | `public interface org.dimdev.rift.listener.MessageAdder {`<br>`public abstract void registerMessages(net.minecraft.util.registry.RegistryNamespaced<net.minecraft.util.ResourceLocation, java.lang.Class<? extends org.dimdev.rift.network.Message>>);` |
| `org.dimdev.rift.listener.MinecraftStartListener` | `public interface org.dimdev.rift.listener.MinecraftStartListener {`<br>`public abstract void onMinecraftStart();` |
| `org.dimdev.rift.listener.MobEffectAdder` | `public interface org.dimdev.rift.listener.MobEffectAdder {`<br>`public abstract void registerMobEffects();` |
| `org.dimdev.rift.listener.PacketAdder` | `public interface org.dimdev.rift.listener.PacketAdder {`<br>`public abstract void registerHandshakingPackets(org.dimdev.rift.listener.PacketAdder$PacketRegistrationReceiver);`<br>`public abstract void registerPlayPackets(org.dimdev.rift.listener.PacketAdder$PacketRegistrationReceiver);`<br>`public abstract void registerStatusPackets(org.dimdev.rift.listener.PacketAdder$PacketRegistrationReceiver);`<br>`public abstract void registerLoginPackets(org.dimdev.rift.listener.PacketAdder$PacketRegistrationReceiver);` |
| `org.dimdev.rift.listener.ParticleTypeAdder` | `public interface org.dimdev.rift.listener.ParticleTypeAdder {`<br>`public abstract void registerParticles();` |
| `org.dimdev.rift.listener.RecipeAdder` | `public interface org.dimdev.rift.listener.RecipeAdder {`<br>`public abstract void addRecipes(java.util.Map<net.minecraft.util.ResourceLocation, net.minecraft.item.crafting.IRecipe>, net.minecraft.resources.IResourceManager);` |
| `org.dimdev.rift.listener.RecipeSerializerAdder` | `public interface org.dimdev.rift.listener.RecipeSerializerAdder {`<br>`public abstract void addRecipeSerializers();` |
| `org.dimdev.rift.listener.ResourcePackFinderAdder` | `public interface org.dimdev.rift.listener.ResourcePackFinderAdder {`<br>`public abstract java.util.List<net.minecraft.resources.IPackFinder> getResourcePackFinders();` |
| `org.dimdev.rift.listener.ServerTickable` | `public interface org.dimdev.rift.listener.ServerTickable {`<br>`public abstract void serverTick(net.minecraft.server.MinecraftServer);` |
| `org.dimdev.rift.listener.SoundAdder` | `public interface org.dimdev.rift.listener.SoundAdder {`<br>`public abstract void registerSounds();` |
| `org.dimdev.rift.listener.StructureAdder` | `public interface org.dimdev.rift.listener.StructureAdder {`<br>`public abstract void registerStructureNames();`<br>`public abstract void addStructuresToMap(java.util.Map<java.lang.String, net.minecraft.world.gen.feature.structure.Structure<?>>);` |
| `org.dimdev.rift.listener.TileEntityTypeAdder` | `public interface org.dimdev.rift.listener.TileEntityTypeAdder {`<br>`public abstract void registerTileEntityTypes();` |
| `org.dimdev.rift.listener.ToolEfficiencyProvider` | `public interface org.dimdev.rift.listener.ToolEfficiencyProvider {`<br>`public abstract void addEffectiveBlocks(net.minecraft.item.ItemTool, java.util.Set<net.minecraft.block.Block>);` |
| `org.dimdev.rift.listener.WorldChanger` | `public interface org.dimdev.rift.listener.WorldChanger {`<br>`public abstract void modifyBiome(int, java.lang.String, net.minecraft.world.biome.Biome);` |

## 4. jar 自带的两个资源（免费的对照物）

- `riftmod.json`（Rift 自己的）schema = `{ "id", "name", "authors":[], "listeners":[FQCN,…] }` ⇒ **与本仓桥模板生成的 `riftmod.json` 同形**（已逐字对照）。
- `profile.json`：`"inheritsFrom": "1.13"`、`"releaseTime": "2018-07-18"`、`arguments.game = ["--tweakClass","org.dimdev.riftloader.launch.RiftLoaderClientTweaker"]` ⇒ **官方标称 MC 1.13**。
  ⚠️ 真机已答（2026-10-05）：**1.13.2 客户端能起，但 21 个 hook mixin target not found ⇒ listener 不派发**（`gradle-recipe.md` §5）；1.13.1/1.13.2 的社区支持分支（Chocohead `newerer`/`newerest`）见 `bridge-api.md` §3.3 第 3 条（2026-10-06 结案）。

## 5. 对账结果（2026-10-05）

| 检查 | 结果 |
|---|---|
| `listeners.md` 提到的接口数 vs 真 jar | **39 vs 39，完全一致**（无「文档有而 jar 没有」，也无「jar 有而文档漏了」） |
| `listeners.md` 里所有方法名 vs 真 jar | **全部能对上**（唯一初判不符的 `onInitialization` 属 `org.dimdev.riftloader.listener` 包，不在本次导出范围，已单独 javap 确认） |
| 本仓桥对真 jar 编译 | `RIFT_REALJAR_EXIT = 0`（Rift 侧真构件 + MC 侧签名替身） |

⇒ **`listeners.md` 的接口名与方法名无需修正**，可直接当本档 listener 权威；本表补的是**精确签名与参数类型**（wiki 那层没给全）。

## 6. 仍未核（别外推）

- **全部 `net.minecraft.*` 参数类型**：本机无 1.13.2 构件 ⇒ 只证「Rift 侧接口形状自洽」，**不证 MC 侧类名/签名存在**（替身编译的固有边界）。
- **Rift 在 1.13.2 上的运行期行为**：tick 是否真触发、`listeners` 是否真被调用、mixin 是否生效 —— **全部要真机**。
- **注册时机与顺序**：`registerItems()` / `registerBlocks()` 等在哪个阶段被调用、彼此顺序约束 —— javap **看不出来**，要 mixin 导出或真机日志。
