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

1. ~~**`Minecraft.getInstance()` 的 `static` 性本仓证不出**~~ —— **已关闭（2026-10-06）**：对本机真构件 `forgeBin-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar` javap 得 **`public static net.minecraft.client.Minecraft getInstance();`**。
   旧推理（extracted 不含修饰符、`static_methods.txt` 是部分提示表、漏 `func_71410_x` 不能当反证）过程属实，结论被真构件 javap 取代；该「部分提示表不能当反证」的教训仍然有效。
   **另注（真差异）**：本仓 1.13.2 forge-docs 语料用的是**旧快照名** `Minecraft.getMinecraft()`
   （`data/forge_1.13.2/forge-docs/1.13.2/processed/models_color.md:20,22`、`models_advanced_extended-blockstates.md:73`，同一 SRG、class 限定调用）
   ⇒ **换 1.13.2 映射快照就要改名**，别把两份语料的名字混用。
2. **`block_at` 只回 translation key，不回注册名**：1.13.2 的方块注册表字段（`Block.REGISTRY`，SRG `field_149771_c`）
   在 `joined.tsrg` 里**根本不存在**（`fields.csv` 有该行、但 tsrg 无对应成员行 ⇒ 本仓无背书）。
   可行替代是 `net.minecraft.util.registry.RegistryNamespaced#getKey(Object) → ResourceLocation`（`joined.tsrg` 有），
   但**取注册表实例的访问式未证** ⇒ 本模板不写。返回里带 `"idKind":"translationKey"` 明示。
3. **版本支持线（2026-10-06 结案：用户裁定 + GitHub API 同日核；原「未核实」作废）**：Rift 官方 maven `https://www.dimdev.org/maven/`（含去 www）**DNS ENOTFOUND**（不是 404）；
   JitPack `com.github.DimensionalDevelopment:Rift` 有 release `1.0.4-106`（另 `1.0.4-87` 等），`dev` classifier **确有**（2026-10-05 实测四件全 200；⚠️ dev 件缺 refmap，本档 scaffold 用**非 dev**），
   且与 wiki 记的 `1.0.3-45` **不等价**（该坐标 JitPack 上不存在，见 `knowledge/common/making-mods-wiki.md`）。
   另：Rift 的 MultiMC 组件 JSON 写的是 `requires: {equals: "1.13"}`（`data/rift_1.13.2/rift-docs/1.13.2/raw/wiki_installing_multimc.md`）。
   ⇒ **支持线结案（用户裁定 2026-10-06 + GitHub API 同日核）**：**原生线（DimensionalDevelopment，已 archived）只到 MC 1.13** —— 最终原生版本号 **`1.0.4-105`**；tag `v1.0.4-86`/`87`/`105`/`106` 全指 master 同一提交 `dfc75ff725`，其 `build.gradle` 自标 `version='1.13'`。**1.13.1 / 1.13.2 = 社区支持**，来自 Chocohead 仓库分支 **`newerer`**（`build.gradle` 自标 `1.13.1`）/ **`newerest`**（自标 `1.13.2`）—— 口语「newer/newest」，实测分支名双 r。**常用构建「`1.0.4-77` 或 `1.0.4-106`」引用时要分开**：`106` = 原生件，真机实测 2026-10-05 在 1.13.2「客户端能起、21 个 hook mixin target not found ⇒ listener 不派发」；tag `v1.0.4-77`（提交 `e5636ddfdb`，在 JitPack `com.github.Chocohead:Rift` 线上，该线另有 `v1.0.4-65/66/72/74`）的 `build.gradle` 仍自标 `1.13`、落后 `newerest` 47 个提交 ⇒ **不是支持 1.13.2 的成品**；真支持 1.13.2 的是 `newerest` 分支尖，其 JitPack 分支件 2026-10-06 呈 Building/超时、**未取到成品**。⇒ 本档 scaffold（原生 106 非 dev 件）对 1.13.2 仍是「能启动但功能不完整」。
4. **编译验证强度（2026-10-05 升级为「Rift 侧对真构件」）**：生成物 `BridgeMod.java` 用 **JDK 8 `javac -encoding UTF-8`** 编译通过（5 个 class，exit 0），分两腿：
   - ✅ **Rift 侧走真 jar**：`Rift-1.0.4-106-dev.jar`（JitPack `com.github.DimensionalDevelopment:Rift:1.0.4-106`，135 503 B，sha256 `5B5E333D…D5463`，**MIT**）⇒ `RIFT_REALJAR_EXIT=0`。
   - ✅ **MC 侧 2026-10-06 由「签名替身」升级为真构件**：本机已有 `forgeBin-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar`（forge 1.13.2 scaffold 编译遗留，MCP 层与 rift scaffold 所钉同快照），桥所用 `net.minecraft.*` 已逐名 javap 对真构件核（**43/43 在盘**：`Minecraft.getInstance()` = `public static`、右键入口实名 `PlayerControllerMP`、`EntityType` tsrg 成员 122 行）——「替身只证签名形状、不证类存在」在该腿作废。
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
2. **`use_item` 未实现**（fail-closed 不变，**理由更正 2026-10-06**）—— 1.13.2 的右键入口实名是 **`net.minecraft.client.multiplayer.PlayerControllerMP`**（对 mapped `forgeBin-1.13.2-25.0.223` 构件 javap：类在、44 成员，`joined.tsrg` 块亦在；mojmap 时代才叫 `PlayerController`，该名在 `snapshot_20180921` 层不存在）。原文写「右键入口在 `PlayerController`，而该类不在本仓 tsrg ⇒ 无出处」—— 名字与前提都被构件证伪。动作仍不生成：右键方法面（如 `rightClickMouse`）未逐项核过 ⇒ 出处不齐前保持 fail-closed。
3. **实体 `type` 只有类简单名**（行为不变，**前提更正 2026-10-06**）—— `Entity.getType()` 在 tsrg 里有；原文称「它返回的 `net.minecraft.entity.EntityType` 在 tsrg 里没有任何成员（m/f 皆 0）⇒ 拿不到实体的注册名」—— **错**：tsrg `EntityType` 块实有 122 成员行（103 field + 19 func），构件有 `public static ResourceLocation getId(EntityType<?>)` ⇒ **注册名可取**。现桥模板仍回 `e.getClass().getSimpleName()`（如 `EntityZombie`），`await entity_nearby type=…` 按该形式传；把 `type` 升级为 `EntityType.getId(...)` 需要改生成物并重编译复跑，本轮不做、只更正陈述。

**编译验证强度**（2026-10-05 升级）：第二批动作全量生成的 `BridgeMod.java` 已用 **JDK 8 `javac -encoding UTF-8` 编译通过**（5 个 class，0 error），两腿分列：
- ✅ **Rift 侧 = 对真构件**：`Rift-1.0.4-106-dev.jar`（JitPack，135 503 B，sha256 `5B5E333D…D5463`，**MIT**）⇒ `RIFT_REALJAR_EXIT=0`。
  该 jar 上 `javap` 实证：`ClientTickable` = `public abstract void clientTick()`（**无参**，与本档入口实现一致）、`ServerTickable#serverTick(MinecraftServer)`、
  `org.dimdev.riftloader.launch.RiftLoaderClientTweaker` 在包内（⇒ 本档 scaffold 的 `tweakClass` 正确）、jar 自带 `riftmod.json` schema 与桥模板产物**同形**。
  ⚠️ **该 jar 没有 `InstanceOfServerTickable`**（全 jar 扫名 0 命中）—— 本档只以 `ServerTickable` 为准。
- ✅ **MC 侧 2026-10-06 起对真构件**：`net.minecraft.*` 名字已逐名 javap 核对 `forgeBin-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar`（43/43 在盘，含 `EntityPlayer.inventory` / `InventoryPlayer#getStackInSlot`）；`get_minecraft_source` 覆盖从 1.14 起、不含该档，本轮靠的是本机真 jar。

## 5. 编码要求（实测踩过）

生成物含中文注释；本机 Java 编译器默认 **GBK**，不加 `-encoding UTF-8` 会报
`unmappable character for encoding GBK`（实测 2026-10-04）。
⇒ 工程 `build.gradle` 需 `tasks.withType(JavaCompile) { options.encoding = 'UTF-8' }`，或 `javac -encoding UTF-8`。
