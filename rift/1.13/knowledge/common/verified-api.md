# verified-api · rift 1.13（本档 **Rift 侧**的权威签名表）

> **性质**：本表由 `javap` 对**真构件**跑出（生成器 `extract-rift-api-surface.mjs@1`），**不是 wiki 转述**。
> **MC 侧不在本表**（本表只收 Rift 侧签名）；参数里的 `net.minecraft.*` 类型名若要使用，须另按该 MC 版本的映射核。

## 1. 构件（可复现）

| 项 | 值 |
|---|---|
| 坐标 | `com.github.DimensionalDevelopment:Rift:1.0.4-106`（**plain 件**，非 `-dev`） |
| 文件 | `rift-1.0.4-106.jar` |
| 大小 / 条目 | 140331 B / 158 entries |
| sha256 | `d6a60ebc77cdfef821f01647e733a865953c10418cb76249c2ea26ec9c20c474` |
| 上游仓 | `DimensionalDevelopment/Rift` —— **archived**（最后提交 2019-01-01），**MIT** |
| 复现命令 | `javap -classpath rift-1.0.4-106.jar <FQCN>`（生成器用的判读器：`21.0.12.1`） |

**构件的版本自述**：jar 内 `profile.json` 的 `inheritsFrom` = **`1.13`**
⇒ 该件面向 **MC 1.13**。

## 2. listener 接口（39 个，javap 全量导出）

包 `org.dimdev.rift.listener` + 子包 `…listener.client`。签名逐字来自 javap；**参数里的 `net.minecraft.*` 未对 MC 真构件核**。

| 接口 | 签名 |
|---|---|
| `org.dimdev.rift.listener.ArgumentTypeAdder` | `public interface org.dimdev.rift.listener.ArgumentTypeAdder`<br>`public abstract void addArgumentTypes()` |
| `org.dimdev.rift.listener.BiomeAdder` | `public interface org.dimdev.rift.listener.BiomeAdder`<br>`public abstract void registerBiomes()`<br>`public abstract java.util.Collection<ayn> getOverworldBiomes()` |
| `org.dimdev.rift.listener.BlockAdder` | `public interface org.dimdev.rift.listener.BlockAdder`<br>`public abstract void registerBlocks()` |
| `org.dimdev.rift.listener.BootstrapListener` | `public interface org.dimdev.rift.listener.BootstrapListener`<br>`public abstract void afterVanillaBootstrap()` |
| `org.dimdev.rift.listener.BurnTimeProvider` | `public interface org.dimdev.rift.listener.BurnTimeProvider`<br>`public abstract void registerBurnTimes(java.util.Map<asw, java.lang.Integer>)` |
| `org.dimdev.rift.listener.ChunkEventListener` | `public interface org.dimdev.rift.listener.ChunkEventListener`<br>`public abstract void onChunkLoad(bna)`<br>`public abstract void onChunkUnload(bna)` |
| `org.dimdev.rift.listener.ChunkGeneratorReplacer` | `public interface org.dimdev.rift.listener.ChunkGeneratorReplacer`<br>`public abstract <T extends bod> bmp<T> createChunkGenerator(tc, axz, int)` |
| `org.dimdev.rift.listener.CommandAdder` | `public interface org.dimdev.rift.listener.CommandAdder`<br>`public abstract void registerCommands(com.mojang.brigadier.CommandDispatcher<bu>)` |
| `org.dimdev.rift.listener.CustomPayloadHandler` | `public interface org.dimdev.rift.listener.CustomPayloadHandler`<br>`public abstract boolean clientHandlesChannel(pc)`<br>`public abstract void clientHandleCustomPayload(pc, hy)`<br>`public abstract boolean serverHandlesChannel(pc)`<br>`public abstract void serverHandleCustomPayload(pc, hy)` |
| `org.dimdev.rift.listener.DataPackFinderAdder` | `public interface org.dimdev.rift.listener.DataPackFinderAdder`<br>`public abstract java.util.List<ux> getDataPackFinders()` |
| `org.dimdev.rift.listener.DimensionTypeAdder` | `public interface org.dimdev.rift.listener.DimensionTypeAdder`<br>`public static bnu newDimensionType(int, java.lang.String, java.lang.String, java.util.function.Supplier<? extends bnt>)`<br>`public abstract java.util.Set<? extends bnu> getDimensionTypes()` |
| `org.dimdev.rift.listener.DispenserBehaviorAdder` | `public interface org.dimdev.rift.listener.DispenserBehaviorAdder`<br>`public abstract void registerDispenserBehaviors()` |
| `org.dimdev.rift.listener.EnchantmentAdder` | `public interface org.dimdev.rift.listener.EnchantmentAdder`<br>`public abstract void registerEnchantments()` |
| `org.dimdev.rift.listener.EntityTypeAdder` | `public interface org.dimdev.rift.listener.EntityTypeAdder`<br>`public abstract void registerEntityTypes()` |
| `org.dimdev.rift.listener.FluidAdder` | `public interface org.dimdev.rift.listener.FluidAdder`<br>`public abstract void registerFluids()` |
| `org.dimdev.rift.listener.ItemAdder` | `public interface org.dimdev.rift.listener.ItemAdder`<br>`public abstract void registerItems()` |
| `org.dimdev.rift.listener.MessageAdder` | `public interface org.dimdev.rift.listener.MessageAdder`<br>`public abstract void registerMessages(ex<pc, java.lang.Class<? extends org.dimdev.rift.network.Message>>)` |
| `org.dimdev.rift.listener.MinecraftStartListener` | `public interface org.dimdev.rift.listener.MinecraftStartListener`<br>`public abstract void onMinecraftStart()` |
| `org.dimdev.rift.listener.MobEffectAdder` | `public interface org.dimdev.rift.listener.MobEffectAdder`<br>`public abstract void registerMobEffects()` |
| `org.dimdev.rift.listener.PacketAdder` | `public interface org.dimdev.rift.listener.PacketAdder`<br>`public abstract void registerHandshakingPackets(org.dimdev.rift.listener.PacketAdder$PacketRegistrationReceiver)`<br>`public abstract void registerPlayPackets(org.dimdev.rift.listener.PacketAdder$PacketRegistrationReceiver)`<br>`public abstract void registerStatusPackets(org.dimdev.rift.listener.PacketAdder$PacketRegistrationReceiver)`<br>`public abstract void registerLoginPackets(org.dimdev.rift.listener.PacketAdder$PacketRegistrationReceiver)` |
| `org.dimdev.rift.listener.ParticleTypeAdder` | `public interface org.dimdev.rift.listener.ParticleTypeAdder`<br>`public abstract void registerParticles()` |
| `org.dimdev.rift.listener.RecipeAdder` | `public interface org.dimdev.rift.listener.RecipeAdder`<br>`public abstract void addRecipes(java.util.Map<pc, avg>, ve)` |
| `org.dimdev.rift.listener.RecipeSerializerAdder` | `public interface org.dimdev.rift.listener.RecipeSerializerAdder`<br>`public abstract void addRecipeSerializers()` |
| `org.dimdev.rift.listener.ResourcePackFinderAdder` | `public interface org.dimdev.rift.listener.ResourcePackFinderAdder`<br>`public abstract java.util.List<ux> getResourcePackFinders()` |
| `org.dimdev.rift.listener.ServerTickable` | `public interface org.dimdev.rift.listener.ServerTickable`<br>`public abstract void serverTick(net.minecraft.server.MinecraftServer)` |
| `org.dimdev.rift.listener.SoundAdder` | `public interface org.dimdev.rift.listener.SoundAdder`<br>`public abstract void registerSounds()` |
| `org.dimdev.rift.listener.StructureAdder` | `public interface org.dimdev.rift.listener.StructureAdder`<br>`public abstract void registerStructureNames()`<br>`public abstract void addStructuresToMap(java.util.Map<java.lang.String, btc<?>>)` |
| `org.dimdev.rift.listener.TileEntityTypeAdder` | `public interface org.dimdev.rift.listener.TileEntityTypeAdder`<br>`public abstract void registerTileEntityTypes()` |
| `org.dimdev.rift.listener.ToolEfficiencyProvider` | `public interface org.dimdev.rift.listener.ToolEfficiencyProvider`<br>`public abstract void addEffectiveBlocks(arw, java.util.Set<bcj>)` |
| `org.dimdev.rift.listener.WorldChanger` | `public interface org.dimdev.rift.listener.WorldChanger`<br>`public abstract void modifyBiome(int, java.lang.String, ayn)` |
| `org.dimdev.rift.listener.client.AmbientMusicTypeProvider` | `public interface org.dimdev.rift.listener.client.AmbientMusicTypeProvider`<br>`public static dgg$a newMusicType(java.lang.String, wh, int, int)`<br>`public abstract dgg$a getAmbientMusicType(cfi)` |
| `org.dimdev.rift.listener.client.ClientTickable` | `public interface org.dimdev.rift.listener.client.ClientTickable`<br>`public abstract void clientTick()` |
| `org.dimdev.rift.listener.client.EntityRendererAdder` | `public interface org.dimdev.rift.listener.client.EntityRendererAdder`<br>`public abstract void addEntityRenderers(java.util.Map<java.lang.Class<? extends aeo>, cyf<? extends aeo>>, cye)` |
| `org.dimdev.rift.listener.client.GameGuiAdder` | `public interface org.dimdev.rift.listener.client.GameGuiAdder`<br>`public abstract void displayGui(csy, java.lang.String, adi)`<br>`public abstract void displayContainerGui(csy, java.lang.String, adb)` |
| `org.dimdev.rift.listener.client.KeyBindingAdder` | `public interface org.dimdev.rift.listener.client.KeyBindingAdder`<br>`public abstract java.util.Collection<? extends cfe> getKeyBindings()` |
| `org.dimdev.rift.listener.client.KeybindHandler` | `public interface org.dimdev.rift.listener.client.KeybindHandler`<br>`public abstract void processKeybinds()` |
| `org.dimdev.rift.listener.client.OverlayRenderer` | `public interface org.dimdev.rift.listener.client.OverlayRenderer`<br>`public abstract void renderOverlay()` |
| `org.dimdev.rift.listener.client.TextureAdder` | `public interface org.dimdev.rift.listener.client.TextureAdder`<br>`public abstract java.util.Collection<? extends pc> getBuiltinTextures()` |
| `org.dimdev.rift.listener.client.TileEntityRendererAdder` | `public interface org.dimdev.rift.listener.client.TileEntityRendererAdder`<br>`public abstract void addTileEntityRenderers(java.util.Map<java.lang.Class<? extends biz>, cvq<? extends biz>>)` |

## 3. loader 侧（2 个）

| 类型 | 签名 |
|---|---|
| `org.dimdev.riftloader.listener.InitializationListener` | `public interface org.dimdev.riftloader.listener.InitializationListener`<br>`public abstract void onInitialization()` |
| `org.dimdev.riftloader.listener.Instantiator` | `public interface org.dimdev.riftloader.listener.Instantiator`<br>`public abstract <T> T newInstance(java.lang.Class<T>) throws java.lang.ReflectiveOperationException` |

## 4. 本档的边界（别外推）

- 本表覆盖 `org.dimdev.rift.listener` / `org.dimdev.riftloader.listener` 下的顶层 public 类型；**mixin / hook / network / util 是实现面，不在此列**。
- 形参名与注解 `default` 值在构件里取不到（class 文件不带 `MethodParameters`、`javap` 不带 `-v`）。
- 本文件**不是**「可对外输出的已核实名单」：对外结论仍以人工复核过的窄表（同目录 `listeners.md` 的对账节）为准。
