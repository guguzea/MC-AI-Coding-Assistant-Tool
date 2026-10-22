# Rift Listener 接口（源码打开，非 Fabric 记忆）

- **抓取日**：2026-08-15
- **源**：https://github.com/DimensionalDevelopment/Rift/tree/master/src/main/java/org/dimdev/rift/listener
- **InitializationListener**：`org.dimdev.riftloader.listener.InitializationListener`（包名不是 `org.dimdev.rift.listener`）

泛型在 GitHub HTML 转写时可能被吃掉；实现时打开对应 `.java`。表外禁止输出。

## 已核实方法

| 接口 | 方法 |
|------|------|
| `org.dimdev.riftloader.listener.InitializationListener` | `void onInitialization()` |
| `org.dimdev.rift.listener.BlockAdder` | `void registerBlocks()` |
| `org.dimdev.rift.listener.ItemAdder` | `void registerItems()` |
| `org.dimdev.rift.listener.BootstrapListener` | `void afterVanillaBootstrap()` |
| `org.dimdev.rift.listener.ArgumentTypeAdder` | `void addArgumentTypes()`（注释指向 `ArgumentTypes#register(ResourceLocation, Class, IArgumentSerializer)`） |
| `org.dimdev.rift.listener.BiomeAdder` | `void registerBiomes()`；`Collection getOverworldBiomes()` |
| `org.dimdev.rift.listener.BurnTimeProvider` | `void registerBurnTimes(Map<Item, Integer> burnTimeMap)` |
| `org.dimdev.rift.listener.ChunkEventListener` | `void onChunkLoad(Chunk chunk)`；`void onChunkUnload(Chunk chunk)` |
| `org.dimdev.rift.listener.ChunkGeneratorReplacer` | `@Nullable IChunkGenerator createChunkGenerator(WorldServer world, WorldType worldType, int dimensionID)` |
| `org.dimdev.rift.listener.CommandAdder` | `void registerCommands(CommandDispatcher dispatcher)` |
| `org.dimdev.rift.listener.CustomPayloadHandler` | **@Deprecated**，改用 `MessageAdder`。`boolean clientHandlesChannel(ResourceLocation)`；`void clientHandleCustomPayload(ResourceLocation, PacketBuffer)`；`boolean serverHandlesChannel(ResourceLocation)`；`void serverHandleCustomPayload(ResourceLocation, PacketBuffer)` |
| `org.dimdev.rift.listener.DataPackFinderAdder` | `List getDataPackFinders()`（元素 `IPackFinder`） |
| `org.dimdev.rift.listener.DimensionTypeAdder` | `Set getDimensionTypes()`；静态 `newDimensionType(int id, String name, String suffix, Supplier dimensionSupplier)` |
| `org.dimdev.rift.listener.DispenserBehaviorAdder` | `void registerDispenserBehaviors()` |
| `org.dimdev.rift.listener.EnchantmentAdder` | `void registerEnchantments()` |
| `org.dimdev.rift.listener.EntityTypeAdder` | `void registerEntityTypes()` |
| `org.dimdev.rift.listener.FluidAdder` | `void registerFluids()` |
| `org.dimdev.rift.listener.MessageAdder` | `void registerMessages(RegistryNamespaced<ResourceLocation, Class> registry)`（推荐自定义包） |
| `org.dimdev.rift.listener.MinecraftStartListener` | `void onMinecraftStart()` |
| `org.dimdev.rift.listener.MobEffectAdder` | `void registerMobEffects()` |
| `org.dimdev.rift.listener.PacketAdder` | `void registerHandshakingPackets(PacketRegistrationReceiver)`；`registerPlayPackets`；`registerStatusPackets`；`registerLoginPackets`。内嵌 `PacketRegistrationReceiver.registerPacket(EnumPacketDirection, Class)` |
| `org.dimdev.rift.listener.ParticleTypeAdder` | `void registerParticles()` |
| `org.dimdev.rift.listener.RecipeAdder` | `void addRecipes(Map<ResourceLocation, IRecipe> target, IResourceManager resourceManager)` |
| `org.dimdev.rift.listener.RecipeSerializerAdder` | `void addRecipeSerializers()`（注释指向 `RecipeSerializers#register`） |
| `org.dimdev.rift.listener.ResourcePackFinderAdder` | `List getResourcePackFinders()` |
| `org.dimdev.rift.listener.ServerTickable` | `void serverTick(MinecraftServer server)` |
| `org.dimdev.rift.listener.SoundAdder` | `void registerSounds()` |
| `org.dimdev.rift.listener.StructureAdder` | `void registerStructureNames()`；`void addStructuresToMap(Map<String, Structure> map)` |
| `org.dimdev.rift.listener.TileEntityTypeAdder` | `void registerTileEntityTypes()` |
| `org.dimdev.rift.listener.ToolEfficiencyProvider` | `void addEffectiveBlocks(ItemTool tool, Set target)` |
| `org.dimdev.rift.listener.WorldChanger` | `void modifyBiome(int biomeId, String biomeName, Biome biome)` |

## client 子目录（已打开）

| 接口 | 方法 |
|------|------|
| `org.dimdev.rift.listener.client.AmbientMusicTypeProvider` | `MusicType getAmbientMusicType(Minecraft client)`；静态 `newMusicType(String, SoundEvent, int, int)` |
| `org.dimdev.rift.listener.client.ClientTickable` | `void clientTick()` |
| `org.dimdev.rift.listener.client.EntityRendererAdder` | `void addEntityRenderers(Map entityRenderMap, RenderManager renderManager)` |
| `org.dimdev.rift.listener.client.GameGuiAdder` | `void displayGui(EntityPlayerSP, String id, IInteractionObject)`；`void displayContainerGui(EntityPlayerSP, String id, IInventory)` |
| `org.dimdev.rift.listener.client.KeyBindingAdder` | `Collection getKeyBindings()` |
| `org.dimdev.rift.listener.client.KeybindHandler` | `void processKeybinds()` |
| `org.dimdev.rift.listener.client.OverlayRenderer` | `void renderOverlay()` |
| `org.dimdev.rift.listener.client.TextureAdder` | `Collection getBuiltinTextures()` |
| `org.dimdev.rift.listener.client.TileEntityRendererAdder` | `void addTileEntityRenderers(Map renderers)` |

Listener 须 **public 无参构造**；在 `riftmod.json` 的 `listeners` 列出类名。禁止 `ServerPlayNetworking` / Fabric Registry。
