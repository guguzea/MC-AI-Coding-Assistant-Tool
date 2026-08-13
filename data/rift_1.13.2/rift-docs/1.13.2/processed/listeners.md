# Rift Listener 接口列表（来自源码目录，非 Fabric 记忆）

- **抓取日**：2026-08-13
- **源**：https://github.com/DimensionalDevelopment/Rift/tree/master/src/main/java/org/dimdev/rift/listener
- **InitializationListener**：`org.dimdev.riftloader.listener.InitializationListener`（包名不是 `org.dimdev.rift.listener`）

## 已核实方法（源码）

| 接口 | 方法 |
|------|------|
| `org.dimdev.rift.listener.BlockAdder` | `void registerBlocks()` |
| `org.dimdev.rift.listener.ItemAdder` | `void registerItems()` |
| `org.dimdev.rift.listener.BootstrapListener` | `void afterVanillaBootstrap()` |
| `org.dimdev.riftloader.listener.InitializationListener` | `void onInitialization()` |

## 同目录其它接口（仅类名已核实；方法签名未逐一打开则标未核实，禁止臆造）

ArgumentTypeAdder, BiomeAdder, BurnTimeProvider, ChunkEventListener, ChunkGeneratorReplacer, CommandAdder, CustomPayloadHandler, DataPackFinderAdder, DimensionTypeAdder, DispenserBehaviorAdder, EnchantmentAdder, EntityTypeAdder, FluidAdder, MessageAdder, MinecraftStartListener, MobEffectAdder, PacketAdder, ParticleTypeAdder, RecipeAdder, RecipeSerializerAdder, ResourcePackFinderAdder, ServerTickable, SoundAdder, StructureAdder, TileEntityTypeAdder, ToolEfficiencyProvider, WorldChanger

另有子目录 `listener/client/`（客户端接口，写规则前须再打开源码）。

缺方法名时：停止编造；提示打开上述 GitHub 源或反编译 summaries。
