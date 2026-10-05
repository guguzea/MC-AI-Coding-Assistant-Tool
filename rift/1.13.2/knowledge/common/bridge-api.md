# Rift 1.13.2 · 最小桥 mod 的逐名出处（2026-10-04）

本表服务 `mcp-server/src/generators/playtest-bridge-mod.ts` 的 rift 分支
（`generate_playtest_driver driverMode=external_bridge platform=rift version=1.13.2` 时附赠 `playtest/bridge/**`）。
**表外禁止输出**；未列名的项见文末「未证项」。

## 0. 为什么 rift 能出「真模板」而 liteloader 1.8.9/1.10.2 不行

桥的 6 项前置 = tick 钩子 + 客户端单例 + 玩家对象/位置字段 + 发聊天 + 截图 + 读方块。本档**六项全有出处**：

- **tick 钩子**来自 Rift 自己的 API（`rift/1.13.2/knowledge/common/listeners.md`，源码打开取证 2026-08-15）；
- **其余五项**来自本仓 **1.13.2 的 MCP 映射数据** `data/forge_1.13.2/mappings/{joined.tsrg,methods.csv,fields.csv}`
  ＋ `data/forge_1.13.2/extracted/config/{constructors.txt,static_methods.txt}`。

**为什么可以用 forge_1.13.2 的数据背书 rift 1.13.2**：MCP 是**同一 MC 版本共用的一套可读名**，与加载器无关；
且 `rift/1.13.2/scaffold/build.gradle` 钉的 `mappings = 'snapshot_20180921'` 与
`forge/1.13.2/scaffold/gradle.properties` 钉的 `mapping_version = 20180921-1.13` **是同一个快照**
（`data/forge_1.13.2/mappings/mcp_snapshot-20180921-1.13.zip` 就是它，内含 `fields.csv`/`methods.csv`/`params.csv` 三件）。
⇒ 本表所有类名/方法名/字段名在该快照下对 MC 1.13.2 **成立**，rift 与 forge 只是**注册入口不同**，MC 侧调用同一套名。

## 1. Rift API 侧（出处 = 本档 corpus）

| 项 | 取值 | 出处 |
|---|---|---|
| 入口接口 | `org.dimdev.rift.listener.client.ClientTickable` | `knowledge/common/listeners.md:57`（client 子表） |
| tick 方法 | `void clientTick()`（**无参**） | 同上 |
| 服务端对应 | `org.dimdev.rift.listener.ServerTickable#serverTick(MinecraftServer)` | `knowledge/common/listeners.md:45` |
| 实例化约定 | listener 类须 **public 无参构造**；类名写进 `riftmod.json` 的 `listeners` 数组；Rift 每类只建一个实例 | `knowledge/common/making-mods-wiki.md`（wiki：Listener 段） |
| 元数据 | jar 根 `riftmod.json`，字段 `id` / `name` / `authors` / `listeners` | `scaffold/src/main/resources/riftmod.json` |

## 2. MC 侧（出处 = `data/forge_1.13.2/**`，MCP 快照 20180921-1.13）

| 用途 | 取值 | 出处（可复核） |
|---|---|---|
| 客户端单例 | `net.minecraft.client.Minecraft.getInstance()` | `mappings/methods.csv`：`func_71410_x → getInstance`，javadoc 逐字 `Return the singleton Minecraft instance for the game`；`mappings/joined.tsrg`：`net/minecraft/client/Minecraft` 块 `()Lcft; → getInstance`（`cft` = Minecraft 自身） |
| 玩家字段 | `Minecraft.player`（类型 `EntityPlayerSP`） | `mappings/fields.csv`：`field_71439_g → player`；`joined.tsrg` 同块 |
| 世界字段 | `Minecraft.world`（类型 `World`） | `mappings/fields.csv`：`field_71441_e → world` |
| 游戏目录 | `Minecraft.gameDir`（类型 `File`） | `mappings/fields.csv`：`field_71412_D → gameDir` |
| 窗口对象 / 尺寸 | `Minecraft.mainWindow` + `MainWindow.getFramebufferWidth()` / `getFramebufferHeight()` | `joined.tsrg`：`net/minecraft/client/MainWindow` 字段 `framebufferWidth/Height`、方法 `()I → getFramebufferWidth/getFramebufferHeight` |
| 帧缓冲 | `Minecraft.getFramebuffer()` → `net.minecraft.client.shader.Framebuffer` | `joined.tsrg`：Minecraft 块 `()Lcul; → getFramebuffer`（`cul` = Framebuffer） |
| 位置 | `Entity.posX` / `posY` / `posZ`（`double`） | `mappings/fields.csv`：`field_70165_t/u/v → posX/posY/posZ` |
| 朝向 | `Entity.rotationYaw` / `rotationPitch`（`float`） | `mappings/fields.csv`：`field_70177_z → rotationYaw`、`field_70125_A → rotationPitch` |
| 落地 | `Entity.onGround`（`boolean`） | `mappings/fields.csv`：`field_70122_E → onGround` |
| 血量 | `EntityLivingBase.getHealth()` → `float` | `joined.tsrg`：`net/minecraft/entity/EntityLivingBase` 块 `()F → getHealth` |
| 发命令 | `EntityPlayerSP.sendChatMessage(String)` | `mappings/methods.csv`：`func_71165_d → sendChatMessage`，javadoc `Sends a chat message from the player.`（另注：`sendMessage(ITextComponent)` = `func_145747_a`，本模板不用） |
| 截图 | `ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer,java.util.function.Consumer)` | `joined.tsrg`：`net/minecraft/util/ScreenShotHelper` 块 `(Ljava/io/File;IILcul;Ljava/util/function/Consumer;)V → saveScreenshot`；**静态性**由 `extracted/config/static_methods.txt` 含 `func_148260_a` 正面证明 |
| 读方块 | `World.getBlockState(BlockPos) → IBlockState` | `joined.tsrg`：`net/minecraft/world/World` 块 `(Lel;)Lblc; → getBlockState` |
| 取方块 | `IBlockState.getBlock() → Block` | `joined.tsrg`：`net/minecraft/block/state/IBlockState` 块 `()Lbcs; → getBlock` |
| 空气判定 | `Block.isAir(IBlockState) → boolean` | `joined.tsrg`：`net/minecraft/block/Block` 块 `(Lblc;)Z → isAir` |
| 方块取名 | `Block.getTranslationKey() → String`（形如 `tile.stone`） | `joined.tsrg`：Block 块 `()Ljava/lang/String; → getTranslationKey` |
| 建坐标 | `new BlockPos(int,int,int)` | `extracted/config/constructors.txt:46030`：`net/minecraft/util/math/BlockPos (III)V` |

## 3. 未证项（生成物里已逐条披露，**禁止当已证用**）

1. **`Minecraft.getInstance()` 的 `static` 性本仓证不出**：1.13.2 的 extracted 数据**不含修饰符**。
   `extracted/config/static_methods.txt` 经实测是**部分提示表**、**不能当反证** —— 它覆盖 844 个类、含 **15 个 Minecraft 方法**，
   却**漏掉确定静态的 `func_71410_x`**（对照：`func_150891_b` getIdFromItem / `func_197956_a` isKeyDown / `func_148260_a` saveScreenshot 都在表内）。
   ⇒ 名字与描述符已证、**static 未证**；若编译报 `non-static method getInstance() cannot be referenced from a static context`，换该快照的单例访问式。
   **另注（真差异）**：本仓 1.13.2 forge-docs 语料用的是**旧快照名** `Minecraft.getMinecraft()`
   （`data/forge_1.13.2/forge-docs/1.13.2/processed/models_color.md:20,22`、`models_advanced_extended-blockstates.md:73`，同一 SRG、class 限定调用）
   ⇒ **换 1.13.2 映射快照就要改名**，别把两份语料的名字混用。
2. **`block_at` 只回 translation key，不回注册名**：1.13.2 的方块注册表字段（`Block.REGISTRY`，SRG `field_149771_c`）
   在 `joined.tsrg` 里**根本不存在**（`fields.csv` 有该行、但 tsrg 无对应成员行 ⇒ 本仓无背书）。
   可行替代是 `net.minecraft.util.registry.RegistryNamespaced#getKey(Object) → ResourceLocation`（`joined.tsrg` 有），
   但**取注册表实例的访问式未证** ⇒ 本模板不写。返回里带 `"idKind":"translationKey"` 明示。
3. **Rift API 构件与「1.13.2 是否被 Rift 支持」**：Rift 官方 maven `https://www.dimdev.org/maven/`（含去 www）**DNS ENOTFOUND**（不是 404）；
   JitPack `com.github.DimensionalDevelopment:Rift` 有 release `1.0.4-106`（另 `1.0.4-87` 等），但**是否提供原坐标的 `dev` classifier 未核**，
   且 JitPack 件与 wiki 记的 `1.0.3-45` **不等价**（见 `knowledge/common/making-mods-wiki.md`）。
   另：Rift 的 MultiMC 组件 JSON 写的是 `requires: {equals: "1.13"}`（`data/rift_1.13.2/rift-docs/1.13.2/raw/wiki_installing_multimc.md`），
   本档按仓库既有的 **1.13.2** 口径建档 ⇒ 「Rift 是否官方支持 1.13.2（vs 仅 1.13）」**未核实**。
4. **编译验证强度（2026-10-05 升级为「Rift 侧对真构件」）**：生成物 `BridgeMod.java` 用 **JDK 8 `javac -encoding UTF-8`** 编译通过（5 个 class，exit 0），分两腿：
   - ✅ **Rift 侧走真 jar**：`Rift-1.0.4-106-dev.jar`（JitPack `com.github.DimensionalDevelopment:Rift:1.0.4-106`，135 503 B，sha256 `5B5E333D…D5463`，**MIT**）⇒ `RIFT_REALJAR_EXIT=0`。
   - ⚠️ **MC 侧仍是签名替身**（本机无 1.13.2 构件）⇒ **替身只证签名形状、不证类存在** —— 不证明这些 MC 类在该档真实存在。
5. **依赖源已找到（2026-10-05）**：`https://www.dimdev.org/maven/` DNS `ENOTFOUND`；**JitPack 可用**，`-dev` classifier 确有。取法与 sha256 见 `scaffold/libs/README.md` 与 `making-mods-wiki.md`「依赖源可用性核查」节。

## 4. 第二批动作集（`query_inventory_slot` / `query_inventory` / `query_nearby_entities` / `query_chat_history` / `use_item` / `query_screen`）

出处仍是 `data/forge_1.13.2/mappings/**`（同快照）：

| 用途 | 取值 | 出处（可复核） |
|---|---|---|
| 背包取槽 | `InventoryPlayer#getStackInSlot(int)` / `getSizeInventory()` / `getCurrentItem()` | `joined.tsrg`：`net/minecraft/entity/player/InventoryPlayer` 块 |
| 背包字段 | `EntityPlayer.inventory`（类型 `InventoryPlayer`） | `mappings/fields.csv`：`field_71071_by → inventory`（**继承自 `EntityPlayer`**，`mc.player` 是 `EntityPlayerSP` 也能取） |
| 物品栈 | `ItemStack#getItem()` / `getCount()` / `isEmpty()` / `getTranslationKey()` | `joined.tsrg`：`net/minecraft/item/ItemStack` 块 |
| 物品名 | `Item#getTranslationKey()` | `joined.tsrg`：`net/minecraft/item/Item` 块（1.13.2 已由 `getUnlocalizedName` 改名） |
| 世界实体 | `World.loadedEntityList`（**字段**，无 getter） | `joined.tsrg`：`net/minecraft/world/World` 块 |
| 实体位置 | `Entity.posX` / `posY` / `posZ` | `mappings/fields.csv`：`field_70165_t/u/v` |
| 当前界面 | `Minecraft.currentScreen`（**字段**） | `mappings/fields.csv`：`field_71462_r → currentScreen` |

**本档三处 fail-closed（不猜）**：

1. **`query_chat_history` 未实现** —— Rift 的 listener 表（本档 `listeners.md` 全文）**没有任何聊天接收接口**；1.13.2 也没有 Forge 事件 ⇒ 要接只能自写 **Mixin**（Rift 自带 Mixin 库，但 Mixin 目标类与注入点的出处不在本表，属另一次取证）。
2. **`use_item` 未实现** —— 1.13.2 的右键入口在 `net.minecraft.client.multiplayer.PlayerController` 上，而**该类不在本仓 tsrg**（`data/forge_1.13.2/extracted` 无此 class，tsrg 的 4027 个类里没有）⇒ 无出处。
3. **实体 `type` 只有类简单名** —— `Entity.getType()` 在 tsrg 里有，但它返回的 `net.minecraft.entity.EntityType` 在 tsrg 里**没有任何成员**（m/f 皆 0）⇒ **拿不到实体的注册名** ⇒ `query_nearby_entities` 的 `type` 回的是 `e.getClass().getSimpleName()`（如 `EntityZombie`）。`await entity_nearby type=…` 要按这个形式传。

**编译验证强度**（2026-10-05 升级）：第二批动作全量生成的 `BridgeMod.java` 已用 **JDK 8 `javac -encoding UTF-8` 编译通过**（5 个 class，0 error），两腿分列：
- ✅ **Rift 侧 = 对真构件**：`Rift-1.0.4-106-dev.jar`（JitPack，135 503 B，sha256 `5B5E333D…D5463`，**MIT**）⇒ `RIFT_REALJAR_EXIT=0`。
  该 jar 上 `javap` 实证：`ClientTickable` = `public abstract void clientTick()`（**无参**，与本档入口实现一致）、`ServerTickable#serverTick(MinecraftServer)`、
  `org.dimdev.riftloader.launch.RiftLoaderClientTweaker` 在包内（⇒ 本档 scaffold 的 `tweakClass` 正确）、jar 自带 `riftmod.json` schema 与桥模板产物**同形**。
  ⚠️ **该 jar 没有 `InstanceOfServerTickable`**（全 jar 扫名 0 命中）—— 本档只以 `ServerTickable` 为准。
- ⚠️ **MC 侧 = 签名替身**（本机无 1.13.2 构件，`get_minecraft_source` 覆盖到 1.14 起）⇒ **替身只证签名形状、不证类存在**（`EntityPlayer.inventory` / `InventoryPlayer#getStackInSlot` 等都在替身里手写）。

## 5. 编码要求（实测踩过）

生成物含中文注释；本机 Java 编译器默认 **GBK**，不加 `-encoding UTF-8` 会报
`unmappable character for encoding GBK`（实测 2026-10-04）。
⇒ 工程 `build.gradle` 需 `tasks.withType(JavaCompile) { options.encoding = 'UTF-8' }`，或 `javac -encoding UTF-8`。
