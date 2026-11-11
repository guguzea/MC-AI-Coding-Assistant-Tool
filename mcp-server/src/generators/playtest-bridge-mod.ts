/**
 * 老平台「最小桥 mod」模板生成器（1.7.10–1.12.2）。
 *
 * **为什么要它**：`playtest_bridge` 这套「HTTP 桥」路线此前只有第三方预编译件可用（BlackBoxPro 覆盖面 = fabric/neoforge 1.21.1 + 1.21.11、forge 1.12.2），
 * **1.7.10–1.11.2 一件都没有**。本生成器给出一份**最小、逐版本正确**的桥 mod 源码模板：tick 钩子 + 内嵌 `com.sun.net.httpserver`，
 * 协议与 `playtest_bridge` 一致（`GET /status`、`POST /execute`），⇒ 老平台不必改工具面就能走桥路线。
 *
 * **线协议（逐键对齐 BlackBoxPro，源码级；不对齐就等于"工具面零改动"是假的）**：
 *   - `GET /status` → `{status,version,platform,httpPort,actions,ready}`；`ready = player!=null && world!=null`
 *     **前 6 个键逐字保留**（旧客户端靠它们活着）；`type` / `bridgeProtocol` 是**追加**的握手标记，旧客户端忽略也无害。
 *     （本模板里 `ready` 由 tick 线程每 tick 刷新、HTTP 线程只读 `volatile` —— HTTP 线程直接碰 `Minecraft` 会崩）。
 *   - `POST /execute` body = `{id,action,params,delay}` →
 *     `{id,status:"success"|"failure",message,data}`，**HTTP 恒 200**（成败只看 body 的 `status`）。
 *     工具侧 `playtest_bridge` 的 `responseOf` 正是只读这四个键 ⇒ 不改一行代码就能调。
 *   - 超时串**逐字**用 `Timeout after <N>ms`（BlackBoxPro 无专用码，工具按这个正则映射 `PLAYTEST_TIMEOUT`）。
 *   - `delay` 参数本模板**忽略**（最小实现；要延迟请在调用侧 sleep），README 里写明。
 *
 * **端口递减扫描 + 形状握手（2026-11-04 冻结协议；三套模板逐字同形）**：
 *   - 常量 `BRIDGE_PORT_BASE = 38081` / `BRIDGE_PORT_MIN = 38071`（共 11 个）；起服务时**从 38081 递减**试 bind，
 *     首个可用端口胜出；**实际端口存进 `actualPort` 字段**，`/status` 的 `httpPort` 回实际值（不再回常量）
 *     ⇒ 38081 空闲时行为与旧版**逐字一致**。
 *   - **11 个端口全占用 ⇒ 打一条含扫描区间的日志并 `return`（不启动）** —— fail-closed，不许静默降级到随机端口。
 *   - `/status` **追加** `"type":"mc-skill-playtest-bridge"` 与 `"bridgeProtocol":1`（常量 `BRIDGE_PROTOCOL_MAX`）；
 *     调用侧握手判据 = `status=="success"` ∧ `type=="mc-skill-playtest-bridge"` ∧ `typeof bridgeProtocol=="number"` ∧ `bridgeProtocol<=1`。
 *
 * **逐版本差异全部有出处**（每条都能在 `data/forge_javadoc/<ver>/raw/**` 找到实页；1.12.2 另有真构件 javap 复证）：
 *   - **包名在 1.8 换代**：1.7.10 = `cpw.mods.fml.*`；1.8.9+ = `net.minecraftforge.fml.*`（`@Mod` / `@SubscribeEvent` / `TickEvent` 三者同源）。
 *   - **注册总线不同**：1.7.10 用 `FMLCommonHandler.instance().bus()`（该档 javadoc **未** `@Deprecated`）；1.8.9+ 该法已 `@Deprecated`，
 *     改 `MinecraftForge.EVENT_BUS`（其 javadoc 逐字写 “all events for Forge will be fired on these”）。
 *   - **发聊天**：1.7.10 的实现在 `EntityClientPlayerMP#sendChatMessage(String)`（`Minecraft` 的玩家字段 javadoc 类型即 `EntityClientPlayerMP`）；1.8.9+ 在 `EntityPlayerSP#sendChatMessage(String)`。⇒ 模板**不声明玩家变量类型**（直接 `mc.<玩家字段>.sendChatMessage(...)`，字段名逐版本后替换），两个名字都对。
 *   - **读方块**：1.7.10 = `World#getBlock(int,int,int): Block`（**该档没有 `BlockPos`**）；1.8.9+ = `World#getBlockState(BlockPos): IBlockState`。
 *   - **注册名**：1.7.10 = 只回**类简单名**（`Block.blockRegistry` 的取名方法本档语料无背书）；1.8.9 = `Block#getRegistryName(): String`；
 *     1.9.4–1.12.2 = `IForgeRegistryEntry#getRegistryName(): ResourceLocation`。
 *   - **空气判定**：1.8.9 = `Block#isAir(IBlockAccess, BlockPos)`；1.9.4+ = `Block#isAir(IBlockState, IBlockAccess, BlockPos)`（**多一个参数**）；1.7.10 语料无该页 ⇒ 不回该字段。
 *   - **截图**：`ScreenShotHelper#saveScreenshot(File,int,int,Framebuffer)`（1.7.10/1.8.9 返 `IChatComponent`，1.9.4+ 返 `ITextComponent`）——
 *     模板**忽略返回值** ⇒ 不引入类型名，两代都对。
 *
 * **刻意不用的东西**：`TickEvent.Phase.END` / `TickEvent.Type.CLIENT` —— 语料里 `TickEvent.Phase`/`Type` 两页**只列 `valueOf`/`values`，不列常量名**，
 * 本仓不背书；而桥是**请求驱动**（HTTP 线程入队、tick 出队），不读 phase 也完全正确。
 *
 * **本桥的能力天花板 = 「命令级」（必须对用户写明，别让人误当 driver —— driver 路线是「玩家级」：真按键原语 forward/jump/sneak/attack/use + 步骤 move/goto/break/gui）**：10 个动作 + `chat_command` 发的是**聊天包**（不是键位输入）
 * ⇒ ① 读数与观察可用（位置/血量/方块/背包/实体列表/当前界面/截图）；② **命令级操控**可用（`/tp` `/setblock` `/give` `/summon` …，受实例 op / 开作弊约束）；
 * ③ **玩家物理路径测不了**（走位 / 跳跃 / 挖掘耗时 / 碰撞——只有真按键才走得到）；④ GUI **点击**不可用（`query_screen` 只能观察界面）。
 * 部分动作**逐档 fail-closed**（1.7.10 聊天、1.9.4–1.12.2 `use_item`、rift 聊天+`use_item`）——见 `README.bridge.md` 的 await 矩阵。
 * 该口径同时写在生成物 `README.bridge.md` 顶部。
 *
 * **线程纪律（与 driver 同）**：HTTP 处理线程**只入队**，一切 MC 调用都在**客户端 tick 线程**执行（HTTP 线程碰 MC 会崩）。
 *
 * **与 driver 链的隔离**：本模板**不进** `PLAYTEST_VERIFIED_TIER`、不参与 driver 派发；它只在
 * `generate_playtest_driver(driverMode="external_bridge", platform=<目标>, version=<老档>)` 时作为**附加产物**给出。
 *
 * ── 平台面（2026-10-04 第二批扩展） ─────────────────────────────────────────
 *
 * ── 2026-11-03 回填（真机实测，勿重走）───────────────────────────────────────
 * **modloader 三档的「默认包路线」**：1.2.5 / 1.5.2 / 1.6.2 已用「默认包 + 直接对官方混淆 client.jar 编译」
 * 做出**真二合一 mod**（桥协议 + 驱动动作），真机达成驱动面（`press forward` 坐标真的变）。
 * ⇒ **`modloader 1.6.4` 不该留在目标表里**：Risugami 自 MC 1.6.2 停更，**1.6.4 无官方 ModLoader 发布物**，载体不存在。
 * ⇒ 本函数产出的 `package net.minecraft.src` 骨架**不适用于该路线**：ModLoader 的 `BaseMod`/`ModLoader` 与
 *   MC 混淆类都在**默认包**，mod 也必须在默认包（具名包不能引用默认包）。
 * ⇒ 待办：把 modloader 分支改成**默认包形态 + 逐档混淆名表**（1.2.5/1.5.2/1.6.2 名字逐条不同，不可互抄），
 *   并把数组换成这三档。**在改完之前，数组保持现状**（宁缺不错）。
 * 逐档字段锚定表与真机读数：`F:\B AND D MOD\artifacts\modloader-1.2.5-1.5.2-lb-record.md` /
 * `modloader-1.6.2-lb-record.md`；坑位见 `community_knowledge/authored/ingame-playtest-automation.md` 编号 91–97。
 *
 * `BRIDGE_MOD_TARGETS` = forge `1.7.10 / 1.8.9 / 1.9.4 / 1.10.2 / 1.11.2 / 1.12.2` **+ rift `1.13` / `1.13.2`（两档共用一份模板）+ modloader `1.6.4` / `1.6.2`**（1.6.2 走默认包形态，本轮加入；1.6.4 保留但载体不存在）（**正文不数档，以数组现读为准**）。
 *
 * **rift 1.13.2 = 真模板（逐名有出处）**：入口换成 Rift listener（`implements org.dimdev.rift.listener.client.ClientTickable`，
 * 类名写进 `riftmod.json` 的 `listeners`），tick = `clientTick()`（**无参** ⇒ 只能自己取单例）。
 * MC 侧名字全部来自本仓 `data/forge_1.13.2/mappings/{joined.tsrg,methods.csv,fields.csv}`（**MCP 快照 `20180921-1.13`**，
 * 与 `rift/1.13.2/scaffold/build.gradle` 钉的 `snapshot_20180921` **同快照**）+ `data/forge_1.13.2/extracted/config/constructors.txt`：
 * `Minecraft.getInstance()` / `.player` / `.world` / `.gameDir`；`player.posX|posY|posZ|rotationYaw|rotationPitch|onGround|getHealth()`；
 * `EntityPlayerSP.sendChatMessage(String)`；`ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer,Consumer)` + `mainWindow.getFramebufferWidth()/getFramebufferHeight()`；
 * `World.getBlockState(BlockPos)` / `IBlockState.getBlock()` / `Block.isAir(IBlockState)` / `Block.getTranslationKey()` / `new BlockPos(int,int,int)`。
 * ⚠️ 两处**本档特有**的缺口（已写进生成物注释与 README，不猜）：
 *   ① `Minecraft.getInstance()` 的 **static 性**本仓 1.13.2 数据**证不出**（extracted 无修饰符；`config/static_methods.txt` 实测是**部分提示表**：
 *      覆盖 844 类、含 15 个 Minecraft 方法，却漏掉确定静态的 `func_71410_x` ⇒ 不能当反证）——名字/描述符已证，static 未证；
 *      另注：本仓 1.13.2 forge-docs 语料用**旧快照名** `Minecraft.getMinecraft()`（同 SRG，class 限定调用 ⇒ 静态），换快照要改名。
 *   ② `block_at` **不给注册名**（1.13.2 的方块注册表字段 `Block.REGISTRY` 的 SRG 在本仓 tsrg 里**不存在** ⇒ 无背书）
 *      ⇒ 只给 `Block.getTranslationKey()`（如 `tile.stone`）+ `isAir`。
 *
 * **modloader 1.6.4 = 骨架（协议半边真、MC 半边全 TODO）**：2026-10-11 构件复核后本仓对该档已实证三类出处
 * （`ModLoader.setInGameHook` 注册 / `BaseMod.onTickInGame(float, Minecraft)` 回调实名 / `ModLoader.getMinecraftInstance()` 客户端单例；
 * 官方 zip 1.2.5/1.5.2/1.6.2 逐类 javap，见 `modloader/1.6.4/knowledge/common/safe-api.md`）；
 * 玩家与位置字段 / 发聊天（语义）/ 截图 / 读方块**四类仍无来源**（无 1.6.4 MCP 映射、无工具覆盖，ModLoader 自 1.6.2 停更）。
 * 因此生成的类**能编译能加载**：HTTP 半边 + `setInGameHook` 注册 + 回调实名是真的，MC 半边集中在一个 `Mc` 内部类里**逐条 `throw UnsupportedOperationException`**
 * 并点名「未核实」——**fail-closed**：`/status` 可用，`/execute` 一律返回带 `TODO(未核实)` 的 failure。宁可这样，也不拿 1.7.10 记忆填 1.6.4。
 */

/** 桥模板支持的目标（平台 × 版本）。forge 六档 + rift 1.13 / 1.13.2 + modloader 1.6.4（以本数组为唯一真源，正文不数档）。 */
export interface BridgeTarget {
  readonly platform: string;
  readonly version: string;
}

export const BRIDGE_MOD_TARGETS: readonly BridgeTarget[] = [
  { platform: "forge", version: "1.7.10" },
  { platform: "forge", version: "1.8.9" },
  { platform: "forge", version: "1.9.4" },
  { platform: "forge", version: "1.10.2" },
  { platform: "forge", version: "1.11.2" },
  { platform: "forge", version: "1.12.2" },
  // rift 两档**同一份模板**：MC 侧名字都来自 `data/forge_1.13.2/mappings`（MCP 快照 `20180921-1.13`），
  // Rift 侧 API 同为同一构件的 39 个 listener 接口 ⇒ 1.13 与 1.13.2 共用。1.13 是原生档（件内
  // `profile.json` 的 `inheritsFrom`=1.13），1.13.2 是社区分支实验档。
  { platform: "rift", version: "1.13" },
  { platform: "rift", version: "1.13.2" },
  { platform: "modloader", version: "1.6.4" },
  // 1.6.2 = **默认包 / obf 路线**（真机达成驱动面，见 artifacts/modloader-1.6.2-lb-record.md）。
  // 生成器**已有** 1.6.2 的模板分支（默认包三件真源码，**逐字节**产出、无插值）⇒ `generateBridgeMod('modloader','1.6.2', id)` **不再** throw；本表仍是「目标表」而不是「可生成表」——rift 1.13 仍属后者（数组里有它、分支里没有）。
  { platform: "modloader", version: "1.6.2" },
];

/** forge 子集（历史导出，保持不变）。 */
export const BRIDGE_MOD_VERSIONS: readonly string[] = ["1.7.10", "1.8.9", "1.9.4", "1.10.2", "1.11.2", "1.12.2"];

export function isBridgeTarget(platform: string, version: string): boolean {
  return BRIDGE_MOD_TARGETS.some((t) => t.platform === platform && t.version === version);
}

interface VerFacts {
  modImport: string;
  subImport: string;
  tickImport: string;
  busRegister: string;
  blockAt: string;
  /** `Minecraft` 的玩家字段名 */
  player: string;
  /** `Minecraft` 的世界字段名 */
  world: string;
  /** `Minecraft` 的游戏目录字段名 */
  dataDir: string;
  /** 字段名置信度注记（模板里逐版本写出，别让用户以为都一样） */
  fieldNote: string;
  /** 第二批动作集：插进类体的成员（聊天缓冲 + 事件处理），无内容则为空串 */
  classBody: string;
  /** 第二批动作集：插进 `execute()` 的 6 个新分支 */
  extraActions: string;
}

/**
 * forge 第二批动作集（`query_inventory_slot` / `query_inventory` / `query_nearby_entities` / `query_chat_history` / `use_item` / `query_screen`）。
 *
 * 逐版本出处（`data/forge_javadoc/<ver>/processed/**` 实页，逐页读出）：
 *   - `InventoryPlayer#getStackInSlot(int)` / `getSizeInventory()` / `getCurrentItem()` —— **六档同形**；
 *   - `ItemStack#getItem()` / `getUnlocalizedName()` —— 六档同形；**空判定** `s == null`（≤1.10.2）↔ `s.isEmpty()`（1.11.2+）；
 *     **数量** `s.stackSize`（≤1.10.2）↔ `s.getCount()`（1.11.2+）；
 *   - `World.loadedEntityList`（六档都有，**公开字段**）/ `Entity.posX|posY|posZ`（六档）/ `EntityList.getEntityString(Entity)`（六档）；
 *   - `Minecraft.currentScreen` / `Minecraft.playerController` —— 六档都有（公开字段）；
 *   - **聊天接收**：`net.minecraftforge.client.event.ClientChatReceivedEvent` 页在 **1.8.9–1.12.2** 有；1.9.4–1.12.2 用 `getMessage()`，
 *     **1.8.9 该页只列字段 `message`（无 getMessage）⇒ 按字段读**；`ITextComponent/IChatComponent#getUnformattedText()` 1.8.9–1.12.2 有。
 *     **1.7.10 本仓无该事件页 ⇒ `query_chat_history` 在该档 fail-closed**（不猜）。
 *   - **`use_item`**：`PlayerControllerMP#sendUseItem(EntityPlayer, World, ItemStack)` 只在 **1.7.10 / 1.8.9** 有页；
 *     1.9.4–1.12.2 的唯一入口是 `processRightClick(..., EnumHand)`，而**这些档的 `EnumHand` 页只列 `valueOf`/`values`、不列常量名**
 *     （与 `TickEvent.Phase` 同一类缺口）⇒ 这四档 **fail-closed**，不猜常量。
 */
function forgeExtras(version: string, f: { player: string; world: string }): { classBody: string; extraActions: string } {
  const pl = "mc." + f.player;
  const w = "mc." + f.world;
  const STACK = "net.minecraft.item.ItemStack";
  const oldStack = ["1.7.10", "1.8.9", "1.9.4", "1.10.2"].includes(version);
  const emptyTest = oldStack ? "s == null" : "s.isEmpty()";
  const notEmpty = oldStack ? "s != null" : "!s.isEmpty()";
  const countExpr = oldStack ? "s.stackSize" : "s.getCount()";
  // ⚠ 物品显示名的方法名**逐档不同，且是「映射层」差异**（2026-10-04 实测）：
  //   `1.12.2` = **stable_39 真构件 javap 实测**：只有 `getTranslationKey()`（无 `getUnlocalizedName()`），
  //             与本仓 `forge/1.12.2/scaffold/gradle.properties` 钉的 `mappings=stable_39` 同层 ⇒ 该档用前者；
  //   `1.7.10–1.11.2` = 本仓 javadoc 实页写的是 `getUnlocalizedName()`（**本机无这五档构件 ⇒ 未编译验证**）。
  //   ⇒ 这是本模板**唯一**一个「名字可能随映射快照变」的点，README 里给了改法。
  const nameExpr = version === "1.12.2" ? "s.getItem().getTranslationKey()" : "s.getItem().getUnlocalizedName()";
  const nameKind = version === "1.12.2" ? "translationKey" : "unlocalizedName";
  const chatOk = version !== "1.7.10";
  const chatMsg = version === "1.8.9" ? "e.message.getUnformattedText()" : "e.getMessage().getUnformattedText()";
  const useOk = version === "1.7.10" || version === "1.8.9";

  const classBody = chatOk
    ? [
        "    /** 收到的聊天/系统消息滚动缓冲（由 onChat 填；只留最近 200 条）。 */",
        "    private static final java.util.List<String> CHAT = new java.util.ArrayList<String>();",
        "",
        "    private static void rememberChat(String s) {",
        "        if (s == null) return;",
        "        CHAT.add(s);",
        "        while (CHAT.size() > 200) CHAT.remove(0);",
        "    }",
        "",
        "    // 与 tick 同一个 bus（构造里 register(this) 已覆盖本方法）",
        "    @SubscribeEvent",
        "    public void onChat(net.minecraftforge.client.event.ClientChatReceivedEvent e) {",
        "        rememberChat(" + chatMsg + ");",
        "    }",
        "",
      ].join("\n")
    : "";

  const chatBranch = chatOk
    ? [
        '        if ("query_chat_history".equals(action)) {',
        '            int n = intParamOr(params, "count", 20);',
        '            int from = Math.max(0, CHAT.size() - n);',
        '            StringBuilder arr = new StringBuilder("[");',
        "            for (int i = from; i < CHAT.size(); i++) {",
        '                if (arr.length() > 1) arr.append(",");',
        '                arr.append("{\\"plain\\":\\"").append(esc(CHAT.get(i))).append("\\"}");',
        "            }",
        '            arr.append("]");',
        '            return "{\\"count\\":" + CHAT.size() + ",\\"messages\\":" + arr + "}";',
        "        }",
      ].join("\n")
    : [
        '        if ("query_chat_history".equals(action)) {',
        '            throw new UnsupportedOperationException("query_chat_history：本档（forge ' + version + '）的聊天接收事件在本仓无出处"',
        '                + "（`data/forge_javadoc/' + version + '/` 无 ClientChatReceivedEvent 页）⇒ 未实现，不猜。"',
        '                + " 要补：先取证该档的聊天接收路径（事件或 NetHandlerPlayClient 钩子）再写。");',
        "        }",
      ].join("\n");

  const useBranch = useOk
    ? [
        '        if ("use_item".equals(action)) {',
        '            if (' + pl + ' == null) throw new IllegalStateException("use_item：不在世界");',
        "            boolean used = mc.playerController.sendUseItem(" + pl + ", " + w + ", " + pl + ".inventory.getCurrentItem());",
        '            return "{\\"used\\":" + used + "}";',
        "        }",
      ].join("\n")
    : [
        '        if ("use_item".equals(action)) {',
        '            throw new UnsupportedOperationException("use_item：本档（forge ' + version + '）走不到——该档唯一入口 processRightClick(...) 要 EnumHand，"',
        '                + "而本仓该档 EnumHand 页只列 valueOf/values、**不列常量名** ⇒ 不背书，未实现（与 TickEvent.Phase 同一类缺口）。");',
        "        }",
      ].join("\n");

  const extraActions = [
    '        if ("query_inventory_slot".equals(action)) {',
    '            if (' + pl + ' == null) throw new IllegalStateException("query_inventory_slot：不在世界");',
    '            int slot = intParam(params, "slot");',
    "            " + STACK + " s = " + pl + ".inventory.getStackInSlot(slot);",
    '            StringBuilder out = new StringBuilder("{");',
    '            out.append("\\"slot\\":").append(slot);',
    '            out.append(",\\"empty\\":").append(' + emptyTest + ");",
    "            if (" + notEmpty + ") {",
    '                out.append(",\\"itemId\\":\\"").append(esc(' + nameExpr + ')).append("\\"");',
    '                out.append(",\\"idKind\\":\\"' + nameKind + '\\"");',
    '                out.append(",\\"count\\":").append(' + countExpr + ");",
    "            }",
    '            out.append("}");',
    "            return out.toString();",
    "        }",
    '        if ("query_inventory".equals(action)) {',
    '            if (' + pl + ' == null) throw new IllegalStateException("query_inventory：不在世界");',
    "            int size = " + pl + ".inventory.getSizeInventory();",
    '            StringBuilder out = new StringBuilder("{\\"size\\":").append(size).append(",\\"slots\\":[");',
    "            for (int i = 0; i < size; i++) {",
    "                " + STACK + " s = " + pl + ".inventory.getStackInSlot(i);",
    "                if (" + emptyTest + ") continue;",
    "                if (out.charAt(out.length() - 1) != '[') out.append(\",\");",
    '                out.append("{\\"slot\\":").append(i)',
    '                   .append(",\\"itemId\\":\\"").append(esc(' + nameExpr + ')).append("\\"")',
    '                   .append(",\\"count\\":").append(' + countExpr + ").append(\"}\");",
    "            }",
    '            out.append("]}");',
    "            return out.toString();",
    "        }",
    '        if ("query_nearby_entities".equals(action)) {',
    '            if (' + w + ' == null || ' + pl + ' == null) throw new IllegalStateException("query_nearby_entities：不在世界");',
    '            double radius = dblParam(params, "radius", 10.0);',
    "            double r2 = radius * radius;",
    "            int count = 0;",
    '            StringBuilder arr = new StringBuilder("[");',
    "            for (Object o : " + w + ".loadedEntityList) {",
    "                if (o == " + pl + ") continue;",
    "                net.minecraft.entity.Entity e = (net.minecraft.entity.Entity) o;",
    "                double dx = e.posX - " + pl + ".posX, dy = e.posY - " + pl + ".posY, dz = e.posZ - " + pl + ".posZ;",
    "                if (dx * dx + dy * dy + dz * dz > r2) continue;",
    '                if (arr.length() > 1) arr.append(",");',
    '                arr.append("{\\"type\\":\\"").append(esc(net.minecraft.entity.EntityList.getEntityString(e)))',
    '                   .append("\\",\\"cls\\":\\"").append(esc(e.getClass().getSimpleName()))',
    '                   .append("\\",\\"x\\":").append(e.posX).append(",\\"y\\":").append(e.posY).append(",\\"z\\":").append(e.posZ).append("}");',
    "                count++;",
    "            }",
    '            arr.append("]");',
    '            return "{\\"count\\":" + count + ",\\"entities\\":" + arr + "}";',
    "        }",
    chatBranch,
    useBranch,
    '        if ("query_screen".equals(action)) {',
    "            String s = mc.currentScreen == null ? null : mc.currentScreen.getClass().getSimpleName();",
    '            return s == null ? "{\\"screen\\":null}" : "{\\"screen\\":\\"" + esc(s) + "\\"}";',
    "        }",
  ].join("\n");

  return { classBody, extraActions };
}


/** 逐版本事实（每条 = 一次实页取证；见本文件头注释的名单）。 */
function facts(version: string): VerFacts {
  const legacy = version === "1.7.10";
  const p = legacy ? "cpw.mods.fml" : "net.minecraftforge.fml";
  const modImport = `import ${p}.common.Mod;`;
  const subImport = `import ${p}.common.eventhandler.SubscribeEvent;`;
  const tickImport = `import ${p}.common.gameevent.TickEvent;`;
  const busRegister = legacy
    ? "        cpw.mods.fml.common.FMLCommonHandler.instance().bus().register(this);"
    : "        net.minecraftforge.common.MinecraftForge.EVENT_BUS.register(this);";

  // ⚠ `Minecraft` 的字段名**逐档不同**（六档 javadoc 实页逐页实测 + 1.12.2 真构件复证）：
  //   玩家/世界：`1.7.10 / 1.8.9 / 1.9.4 / 1.10.2` = `thePlayer` / `theWorld`（类型 `EntityClientPlayerMP` / `EntityPlayerSP`、`WorldClient`）；
  //              `1.11.2 / 1.12.2` = `player` / `world`（**1.10.2 → 1.11.2 改名**）。
  //   游戏目录：六档 javadoc **都叫 `mcDataDir`**；但 `1.12.2` 的 `stable_39` **真构件**叫 `gameDir`（构件为准，编译级复证）。
  //   ⇒ 只有 1.12.2 有「构件 vs javadoc」差异（且只在 `gameDir`↔`mcDataDir` 这一项上）；其余档一律 javadoc、未编译验证。
  const fields = version === "1.12.2"
    ? { player: "player", world: "world", dataDir: "gameDir", fieldNote: "1.12.2 = **stable_39 真构件 javap**（`player`/`world`/`gameDir`）。`player`/`world` 该档 javadoc **也**这么写；只有游戏目录一项是「构件 `gameDir` ↔ javadoc `mcDataDir`」的差异 ⇒ **以构件为准**" }
    : version === "1.11.2"
      ? { player: "player", world: "world", dataDir: "mcDataDir", fieldNote: "1.11.2 = **javadoc 实页**（`player`/`world`/`mcDataDir`），本机无该档构件 ⇒ **未编译验证**；注意本档 `player`/`world` 已改名（1.10.2 及更早是 `thePlayer`/`theWorld`）" }
      : { player: "thePlayer", world: "theWorld", dataDir: "mcDataDir", fieldNote: `1.7.10–1.10.2 = **javadoc 实页**（\`thePlayer\`/\`theWorld\`/\`mcDataDir\`），本机无该档构件 ⇒ **未编译验证**；若你的工程按别的映射快照编译，按报错改这三个名字即可（类名/方法名不受影响）` };

  // 读方块 + 注册名（逐版本；1.7.10 无 BlockPos/IBlockState 页）
  const blockAt = legacy
    ? [
        "            net.minecraft.block.Block b = mc." + fields.world + ".getBlock(x, y, z);",
        '            out.append(",\\"cls\\":\\"").append(esc(b.getClass().getSimpleName())).append("\\"");',
        '            out.append(",\\"id\\":null");',
        '            out.append(",\\"air\\":null"); // 1.7.10：本档语料无 Block.isAir 页 ⇒ 不给该字段（别填假值）',
      ].join("\n")
    : version === "1.8.9"
      ? [
          // 1.8.9 的 BlockPos 在 net.minecraft.util，**不是** net.minecraft.util.math
          // （util.math 是 1.9 才引入）。出处 = 本仓映射实件逐行：
          //   data/forge_1.8.9/mappings/joined.srg:1656  "CL: cj net/minecraft/util/BlockPos"
          //   data/forge_1.9.4/mappings/joined.srg:2059  "CL: cl net/minecraft/util/math/BlockPos"
          // 该缺陷 2026-11-02 由 forge 1.8.9 桥模板的编译级验证暴露（此前 1.8.9 无编译验证）。
          "            net.minecraft.util.BlockPos pos = new net.minecraft.util.BlockPos(x, y, z);",
          "            net.minecraft.block.state.IBlockState st = mc." + fields.world + ".getBlockState(pos);",
          "            net.minecraft.block.Block b = st.getBlock();",
          '            out.append(",\\"cls\\":\\"").append(esc(b.getClass().getSimpleName())).append("\\"");',
          '            out.append(",\\"id\\":\\"").append(esc(String.valueOf(b.getRegistryName()))).append("\\"");',
          '            out.append(",\\"air\\":").append(b.isAir(mc.' + fields.world + ', pos));',
        ].join("\n")
      : [
          "            net.minecraft.util.math.BlockPos pos = new net.minecraft.util.math.BlockPos(x, y, z);",
          "            net.minecraft.block.state.IBlockState st = mc." + fields.world + ".getBlockState(pos);",
          "            net.minecraft.block.Block b = st.getBlock();",
          '            out.append(",\\"cls\\":\\"").append(esc(b.getClass().getSimpleName())).append("\\"");',
          '            out.append(",\\"id\\":\\"").append(esc(String.valueOf(b.getRegistryName()))).append("\\"");',
          '            out.append(",\\"air\\":").append(b.isAir(st, mc.' + fields.world + ', pos));',
        ].join("\n");

  const base = { modImport, subImport, tickImport, busRegister, blockAt, ...fields };
  return { ...base, ...forgeExtras(version, base) };
}

function forgeJava(version: string, modId: string): string {
  const f = facts(version);
  const pkg = `com.example.${modId.replace(/[^A-Za-z0-9_]/g, "_")}.playtest.bridge`;
  const java = `package ${pkg};

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

${f.modImport}
${f.subImport}
${f.tickImport}
import net.minecraft.client.Minecraft;

/**
 * 最小游玩测试桥（**本档 = forge ${version}**；测完必须按 README.bridge.md 撤除，绝不提交）。
 *
 * 协议与 \`playtest_bridge\` 一致：\`GET /status\`、\`POST /execute\`（body = \`{"action":"...","params":{...}}\`）。
 * **线程纪律**：HTTP 线程只入队；所有 Minecraft 调用都在客户端 tick 线程里做（HTTP 线程碰 MC 会崩）。
 * **不读 \`TickEvent.Phase\`**：语料不背书其枚举常量名，且请求驱动不需要（逐 tick 轮询队列即可）。
 * **本桥的能力天花板 = 命令级**：本桥发的是**聊天包**、不是键位输入 ⇒ 读数/观察/命令级操控可用（\`/tp\` \`/setblock\` …），
 * **玩家物理路径（走位/跳跃/挖掘耗时/碰撞）测不了**。要玩家级验证请上用 driver 的档。
 *
 * 逐版本差异（出处见仓库 \`forge/${version}/knowledge/common/verified-api.md\`）：
 *   tick/注解/\\@Mod 的包 = ${version === "1.7.10" ? "cpw.mods.fml.*" : "net.minecraftforge.fml.*"}；
 *   注册总线 = ${version === "1.7.10" ? "FMLCommonHandler.instance().bus()" : "MinecraftForge.EVENT_BUS"}；
 *   读方块 = ${version === "1.7.10" ? "World.getBlock(int,int,int)" : "World.getBlockState(BlockPos)"}。
 */
@Mod(modid = "${modId}_playtest_bridge")
public class BridgeMod {

    /**
     * 端口扫描区间：从 \`BRIDGE_PORT_BASE\` **递减**到 \`BRIDGE_PORT_MIN\`（含两端，共 11 个）。
     * 起服务时逐个试 bind，首个可用端口胜出 ⇒ **38081 空闲时行为与旧版逐字一致**；
     * 全区间占用 ⇒ 打一条含区间的日志且**不启动**（fail-closed，不许静默降级到随机端口）。
     * 只绑 127.0.0.1；桥无鉴权 ⇒ 别暴露到公网。
     */
    public static final int BRIDGE_PORT_BASE = 38081;
    public static final int BRIDGE_PORT_MIN = 38071;

    /**
     * 握手协议上界（\`/status\` 的 \`bridgeProtocol\` 回本值；当前**实现版本 = 上界 = 1**）。
     * 调用侧读到 \`bridgeProtocol > 本值\` 必须**拒绝**（\`BRIDGE_PROTOCOL_TOO_NEW\`），不许猜、不许降级。
     */
    public static final int BRIDGE_PROTOCOL_MAX = 1;

    /** **实际绑定端口**（扫描结果；启动前 = -1）。\`/status\` 的 \`httpPort\` 回这个值，**不再读常量**。 */
    private static volatile int actualPort = -1;

    /** \`GET /status\` 报的动作清单（与 \`execute\` 的分支一一对应；调用侧靠它判断桥能力）。 */
    private static final String ACTIONS = "[\\"query_player_state\\",\\"chat_command\\",\\"screenshot\\",\\"block_at\\",\\"query_inventory_slot\\",\\"query_inventory\\",\\"query_nearby_entities\\",\\"query_chat_history\\",\\"use_item\\",\\"query_screen\\"]";

    private static HttpServer server;

    /**
     * \`ready\` 由 **tick 线程**每 tick 刷新，HTTP 线程只读 —— HTTP 线程直接碰 \`Minecraft\` 会崩（线程纪律）。
     * 语义与 BlackBoxPro 一致：player != null && world != null（已进世界）。
     */
    private static volatile boolean ready = false;

${f.classBody}
    public BridgeMod() {
${f.busRegister}
        startServer();
    }

    @SubscribeEvent
    public void onClientTick(TickEvent.ClientTickEvent event) {
        Minecraft mc = Minecraft.getMinecraft();
        ready = mc.thePlayer != null && mc.theWorld != null;
        Task t;
        while ((t = Task.QUEUE.poll()) != null) {
            try {
                t.result = execute(t.action, t.params);
            } catch (Throwable e) {
                t.error = String.valueOf(e);
            } finally {
                t.latch.countDown();
            }
        }
    }

    // ───────────────────────── MC 侧动作（都在 tick 线程执行） ─────────────────────────

    private String execute(String action, Map<String, String> params) {
        Minecraft mc = Minecraft.getMinecraft();
        if ("query_player_state".equals(action)) {
            StringBuilder out = new StringBuilder("{");
            boolean inWorld = mc.thePlayer != null && mc.theWorld != null;
            out.append("\\"inWorld\\":").append(inWorld);
            if (inWorld) {
                out.append(",\\"x\\":").append(mc.thePlayer.posX);
                out.append(",\\"y\\":").append(mc.thePlayer.posY);
                out.append(",\\"z\\":").append(mc.thePlayer.posZ);
                out.append(",\\"yaw\\":").append(mc.thePlayer.rotationYaw);
                out.append(",\\"pitch\\":").append(mc.thePlayer.rotationPitch);
                out.append(",\\"onGround\\":").append(mc.thePlayer.onGround);
                // health：1.7.10–1.12.2 六档 \`EntityLivingBase#getHealth(): float\` 均有实页出处
                // ⇒ \`playtest_bridge await health_below/health_above\` 直接可用（工具读 data.health）。
                out.append(",\\"health\\":").append(mc.thePlayer.getHealth());
            }
            out.append("}");
            return out.toString();
        }
        if ("chat_command".equals(action)) {
            String cmd = params.get("command");
            if (cmd == null || cmd.length() == 0) throw new IllegalArgumentException("chat_command 需要 command");
            // 命令要带前导 '/'；聊天不要。（1.7.10 是 EntityClientPlayerMP，1.8.9+ 是 EntityPlayerSP —— 方法同名 ⇒ 不声明类型名）
            mc.thePlayer.sendChatMessage(cmd.charAt(0) == '/' ? cmd : "/" + cmd);
            // ⚠ **停止说谎**（A1，2026-11-04）：sendChatMessage 只把聊天包丢给服务端，本桥**观测不到**它有没有被解析、
            //   有没有真的生效 —— 旧实现回 {"sent":...} 会被判读侧当成「命令成功」。
            //   本档（forge 1.7.10–1.12.2）**未**逐档 javap 核实「命令分发器 + 可捕获反馈的 sender + 服务端线程排队」，
            //   ⇒ 按 fail-closed 回 observed:false（**投递了，但未观测**）。
            //   // TODO(未核实)：核出该档 ICommandManager#executeCommand(ICommandSender,String) / MinecraftServer#getCommandManager()
            //   //   与主线程排队入口的签名后，改成「服务端线程分发 + 把 success/result 回填」，再翻 observed:true。
            return "{\\"sent\\":\\"" + esc(cmd) + "\\", \\"observed\\":false, \\"errorType\\":\\"unobserved\\", \\"reason\\":\\"本桥只发聊天包（sendChatMessage）：包发出去了，但**观测不到**它是否被解析、是否真的生效；该档的命令分发器 + 反馈捕获 + 服务端线程排队三者签名**未核实** ⇒ 按 fail-closed 记 unobserved，不得读成成功。\\"}";
        }
        if ("screenshot".equals(action)) {
            // 返回类型在 1.7.10/1.8.9 是 IChatComponent、1.9.4+ 是 ITextComponent ⇒ 忽略返回值，避免引入类型名
            net.minecraft.util.ScreenShotHelper.saveScreenshot(mc.mcDataDir, mc.displayWidth, mc.displayHeight, mc.getFramebuffer());
            File dir = new File(mc.mcDataDir, "screenshots");
            return "{\\"dir\\":\\"" + esc(dir.getAbsolutePath()) + "\\"}";
        }
        if ("block_at".equals(action)) {
            int x = intParam(params, "x");
            int y = intParam(params, "y");
            int z = intParam(params, "z");
            if (mc.theWorld == null) throw new IllegalStateException("block_at：不在世界");
            StringBuilder out = new StringBuilder("{");
            out.append("\\"x\\":").append(x).append(",\\"y\\":").append(y).append(",\\"z\\":").append(z);
${f.blockAt}
            out.append("}");
            return out.toString();
        }
${f.extraActions}
        throw new IllegalArgumentException("未知 action：" + action);
    }

    // ───────────────────────── HTTP 侧（只入队 + 等结果） ─────────────────────────

    private static void startServer() {
        // 端口递减扫描（2026-11-04 冻结协议）：从 BRIDGE_PORT_BASE 起逐个试 bind，首个可用端口胜出。
        // 38081 空闲时行为与旧版逐字一致；**不做静默降级** —— 全区间占用时下面的分支打日志并 return（不启动）。
        HttpServer srv = null;
        int boundPort = -1;
        for (int p = BRIDGE_PORT_BASE; p >= BRIDGE_PORT_MIN && srv == null; p--) {
            try {
                srv = HttpServer.create(new InetSocketAddress("127.0.0.1", p), 0);
                boundPort = p;
            } catch (IOException e) {
                System.out.println("[PT-BRIDGE] 端口 " + p + " 不可用（" + e.getMessage() + "），继续递减扫描");
            }
        }
        if (srv == null) {
            // ⚠ fail-closed：区间全占 ⇒ 桥**不启动**（不是"降级到随机端口"，也不是"假装成功"）。
            System.out.println("[PT-BRIDGE] 起服务失败：端口区间 [" + BRIDGE_PORT_MIN + ", " + BRIDGE_PORT_BASE
                + "] 共 " + (BRIDGE_PORT_BASE - BRIDGE_PORT_MIN + 1) + " 个端口全部不可用 ⇒ 桥不启动（fail-closed）");
            return;
        }
        actualPort = boundPort;
        server = srv;
        try {
            server.createContext("/status", new Handler() {
                public void handle(HttpExchange ex) throws IOException {
                    // 形状与 BlackBoxPro 逐键一致（**旧键逐字保留**），并在末尾**追加**形状标记：
                    // {status,version,platform,httpPort,actions,ready,type,bridgeProtocol}；httpPort = **实际绑定端口**（扫描结果）。
                    respond(ex, "{\\"status\\":\\"success\\",\\"version\\":\\"${version}\\",\\"platform\\":\\"forge\\","
                        + "\\"httpPort\\":" + actualPort + ",\\"actions\\":" + ACTIONS + ",\\"ready\\":" + ready
                        + ",\\"type\\":\\"mc-skill-playtest-bridge\\",\\"bridgeProtocol\\":" + BRIDGE_PROTOCOL_MAX + "}");
                }
            });
            server.createContext("/execute", new Handler() {
                public void handle(HttpExchange ex) throws IOException {
                    String body = readAll(ex);
                    String id = "unknown";
                    try {
                        Map<String, String> flat = flatJson(body);
                        if (flat.get("id") != null) id = flat.get("id");
                        String action = flat.get("action");
                        if (action == null) throw new IllegalArgumentException("body 需要 action");
                        Task t = new Task(action, flat);
                        Task.QUEUE.add(t);
                        // 等 tick 线程回填；客户端没在 tick（菜单/未进世界/卡住）会超时。
                        // 超时串与 BlackBoxPro 逐字一致（\`Timeout after <N>ms\`）⇒ 调用侧照常映射成 PLAYTEST_TIMEOUT，
                        // **不是"空结果"**；\`delay\` 参数本实现忽略（要延迟请在调用侧 sleep）。
                        if (!t.latch.await(10000, TimeUnit.MILLISECONDS)) {
                            respond(ex, "{\\"id\\":\\"" + esc(id) + "\\",\\"status\\":\\"failure\\",\\"message\\":\\"Timeout after 10000ms\\"}");
                            return;
                        }
                        if (t.error != null) {
                            respond(ex, "{\\"id\\":\\"" + esc(id) + "\\",\\"status\\":\\"failure\\",\\"message\\":\\"" + esc(t.error) + "\\"}");
                            return;
                        }
                        respond(ex, "{\\"id\\":\\"" + esc(id) + "\\",\\"status\\":\\"success\\",\\"message\\":\\"ok\\",\\"data\\":" + t.result + "}");
                    } catch (Throwable e) {
                        respond(ex, "{\\"id\\":\\"" + esc(id) + "\\",\\"status\\":\\"failure\\",\\"message\\":\\"" + esc(String.valueOf(e)) + "\\"}");
                    }
                }
            });
            server.setExecutor(null);
            server.start();
            System.out.println("[PT-BRIDGE] listening on 127.0.0.1:" + actualPort + " (mc ${version})");
        } catch (Throwable e) {
            System.out.println("[PT-BRIDGE] 起服务失败：" + e);
        }
    }

    /** 只绑 127.0.0.1 的极简 handler 基类（省得引外部依赖）。 */
    static abstract class Handler implements com.sun.net.httpserver.HttpHandler {
        /** **HTTP 恒 200**（与 BlackBoxPro 契约一致）—— 成败只看 body 里的 \`status\` 字段。 */
        protected static void respond(HttpExchange ex, String json) throws IOException {
            byte[] b = json.getBytes(StandardCharsets.UTF_8);
            ex.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
            ex.sendResponseHeaders(200, b.length);
            OutputStream os = ex.getResponseBody();
            os.write(b);
            os.close();
        }
        protected static String readAll(HttpExchange ex) throws IOException {
            java.io.ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = ex.getRequestBody().read(buf)) > 0) bos.write(buf, 0, n);
            return new String(bos.toByteArray(), StandardCharsets.UTF_8);
        }
    }

    static class Task {
        static final java.util.concurrent.ConcurrentLinkedQueue<Task> QUEUE =
            new java.util.concurrent.ConcurrentLinkedQueue<Task>();
        final String action;
        final Map<String, String> params;
        final CountDownLatch latch = new CountDownLatch(1);
        volatile String result = "{}";
        volatile String error;
        Task(String action, Map<String, String> params) { this.action = action; this.params = params; }
    }

    // ───────────────────────── 手写 JSON（极简：扁平对象 / 字符串 / 数字 / 布尔） ─────────────────────────

    /** 把 \`{"action":"x","params":{"k":"v","n":1,"b":true}}\` 拍平成 k→v（数字/布尔按原样文本）。 */
    static Map<String, String> flatJson(String s) {
        Map<String, String> out = new LinkedHashMap<String, String>();
        if (s == null) return out;
        int i = 0;
        while (i < s.length()) {
            int k = s.indexOf('"', i);
            if (k < 0) break;
            int kEnd = s.indexOf('"', k + 1);
            if (kEnd < 0) break;
            String key = s.substring(k + 1, kEnd);
            int colon = s.indexOf(':', kEnd);
            if (colon < 0) break;
            int v = colon + 1;
            while (v < s.length() && Character.isWhitespace(s.charAt(v))) v++;
            if (v >= s.length()) break;
            char c = s.charAt(v);
            if (c == '"') {
                int e = v + 1;
                StringBuilder sb = new StringBuilder();
                while (e < s.length() && s.charAt(e) != '"') {
                    if (s.charAt(e) == '\\\\' && e + 1 < s.length()) { sb.append(s.charAt(e + 1)); e += 2; }
                    else { sb.append(s.charAt(e)); e++; }
                }
                out.put(key, sb.toString());
                i = e + 1;
            } else if (c == '{') {
                int depth = 0, e = v;
                for (; e < s.length(); e++) { if (s.charAt(e) == '{') depth++; else if (s.charAt(e) == '}') { depth--; if (depth == 0) { e++; break; } } }
                // 嵌套对象（params）：递归拍平，键名沿用内层
                out.putAll(flatJson(s.substring(v + 1, Math.max(v + 1, e - 1))));
                i = e;
            } else {
                int e = v;
                while (e < s.length() && ",}".indexOf(s.charAt(e)) < 0) e++;
                out.put(key, s.substring(v, e).trim());
                i = e;
            }
        }
        return out;
    }

    static int intParam(Map<String, String> p, String k) {
        String v = p.get(k);
        if (v == null) throw new IllegalArgumentException("缺参数 " + k);
        return (int) Math.floor(Double.parseDouble(v));
    }

    /** 可选 int 参数（缺省给默认值）—— query_chat_history 的 count 用。 */
    static int intParamOr(Map<String, String> p, String k, int dflt) {
        String v = p.get(k);
        if (v == null || v.length() == 0) return dflt;
        return (int) Math.floor(Double.parseDouble(v));
    }

    /** 可选 double 参数（缺省给默认值）—— query_nearby_entities 的 radius 用。 */
    static double dblParam(Map<String, String> p, String k, double dflt) {
        String v = p.get(k);
        if (v == null || v.length() == 0) return dflt;
        return Double.parseDouble(v);
    }

    /** 只转义 \\\\ 与 " —— 够手写 JSON 用。 */
    static String esc(String s) {
        if (s == null) return "";
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '"' || c == '\\\\') b.append('\\\\').append(c);
            else if (c == '\\n') b.append("\\\\n");
            else if (c == '\\r') b.append("\\\\r");
            else b.append(c);
        }
        return b.toString();
    }

    /** 未用到但留着：URL 解码（将来支持 query 参数时用）。 */
    static String dec(String s) throws UnsupportedEncodingException { return URLDecoder.decode(s, "UTF-8"); }
}
`;
  // 逐版本字段名（`Minecraft` 的 player / world / 游戏目录）——**必须后替换**，别在模板里写死：
  //   ≤1.10.2 = `thePlayer`/`theWorld`/`mcDataDir`；1.11.2 = `player`/`world`/`mcDataDir`；
  //   1.12.2 = `player`/`world`/`gameDir`（真构件 javap 实证）。详见 facts() 里的逐档注记。
  return java
    .replaceAll("mc.thePlayer", "mc." + f.player)
    .replaceAll("mc.theWorld", "mc." + f.world)
    .replaceAll("mc.mcDataDir", "mc." + f.dataDir);
}

function forgeMcmodInfo(modId: string, version: string): string {
  return JSON.stringify(
    [
      {
        modid: `${modId}_playtest_bridge`,
        name: `${modId} Playtest Bridge`,
        description: "最小游玩测试桥（playtest_bridge 协议；只绑 127.0.0.1）。测完即删。",
        version: "1.0.0",
        mcversion: version,
      },
    ],
    null,
    2,
  ) + "\n";
}

function forgeReadme(version: string, modId: string): string {
  return `# 最小游玩测试桥（forge ${version}）

> **测完必须撤除**：删掉本目录 + jar + \`run/mods\` 里的副本。证据只留在授权根内。

## 这是什么 / 为什么有它

\`playtest_bridge\` 那条路线此前只能靠第三方预编译件（BlackBoxPro，覆盖面 = fabric/neoforge 1.21.1 + 1.21.11、forge 1.12.2）。
**本档（forge ${version}）没有现成桥件** ⇒ 这份模板给一个**最小自建桥**：tick 钩子 + 内嵌 \`com.sun.net.httpserver\`，
协议与 \`playtest_bridge\` 一致，因此**工具面零改动**。

**隔离**：本模板**不在** \`PLAYTEST_VERIFIED_TIER\` 里、不参与 driver 派发 —— 桥是独立路线。

## ⚠️ 本桥的能力天花板 = **命令级**（先读这条，别把它当 driver —— driver 路线是「玩家级」：走位 / 跳跃 / 挖掘 / GUI 交互都做得到）

**这座桥**不是** driver。它有 10 个动作、发的是**聊天包**（不是键位输入），所以：

| 能做 | 做不到 |
|---|---|
| 读数：位置 / 朝向 / 落地 / 血量（\`query_player_state\`）、某坐标的方块（\`block_at\`） | **玩家物理路径**：走位、跳跃、挖掘耗时、碰撞、摔落——只有真按键才走得到，本桥测不了 |
| **命令级操控**：\`/tp\` \`/give\` \`/setblock\` \`/fill\` \`/summon\` \`/time\` …（走 \`chat_command\`）⇒ 位置、世界、物品**都能改**，玩家可见结果的验收做得到 | GUI **点击**（开背包能靠 \`/tp\`+\`query_screen\` 观察，但点按钮不行）；聊天历史在 **1.7.10 该档未实现**（见 await 矩阵） |
| 视觉：截图（\`screenshot\`，落 \`<gameDir>/screenshots/\`）；**背包/实体/界面读数**（\`query_inventory*\` / \`query_nearby_entities\` / \`query_screen\`） | 玩家物理路径（见左） |

⇒ 一句话：**「命令级操控 + 观察」通了，「玩家级操控」没通。** 生存模式下没有 op / 没开作弊时，\`chat_command\` 基本只能读、改不动世界——**能不能改世界取决于实例权限，不取决于本桥**。要做玩家物理级验证，只能在**有 driver 的档**上做（\`PLAYTEST_VERIFIED_TIER\`），老平台没有 driver（载体不允许）。

> ⚠️ **\`chat_command\` 的回执语义（2026-11-04，A1「命令回执」）**：返回体 = \`{"sent":"<命令>", "observed":false, "errorType":"unobserved", "reason":"…"}\`。
> \`sendChatMessage\` 只把聊天包丢给服务端，**本桥观测不到**它有没有被解析、有没有真的生效 ⇒ \`observed:false\` = **投递了但未观测**，
> **不得**读成「命令成功」（旧版只回 \`sent\` 就是这个反模式）。
> 要判「命令真的生效」，必须**再发一条独立观测**：\`chat_command {"command":"/time set day"}\` 之后用 \`await condition=chat_message_matches\`
> （或 \`query_player_state\` / \`block_at\` / \`query_inventory*\`）复核；判读侧 \`inspect_playtest_evidence\` 会把 \`observed:false\` 单列成未观测计数。
> // TODO(未核实)：本档的命令分发器（\`ICommandManager#executeCommand(ICommandSender,String)\` 等）+ 反馈捕获 + 服务端线程排队入口未逐档核实，
> //   核到签名后可把 \`observed\` 翻成 true 并补 \`success\`/\`result\`/\`errorType\`（与 driver 的 \`cmd\` 步同形状）。

## 逐版本差异（都有实页出处，见仓库 \`forge/${version}/knowledge/common/verified-api.md\`）

| 项 | 本档取值 |
|---|---|
| \`@Mod\` / \`@SubscribeEvent\` / \`TickEvent\` 的包 | \`${version === "1.7.10" ? "cpw.mods.fml" : "net.minecraftforge.fml"}.common.*\` |
| 注册总线 | \`${version === "1.7.10" ? "FMLCommonHandler.instance().bus()（本档未 @Deprecated）" : "MinecraftForge.EVENT_BUS（本档 FMLCommonHandler.bus() 已 @Deprecated）"}\` |
| 读方块 | \`${version === "1.7.10" ? "World.getBlock(int,int,int) → Block" : "World.getBlockState(BlockPos) → IBlockState"}\` |
| 发聊天 | \`mc.${version === "1.10.2" || version === "1.7.10" || version === "1.8.9" || version === "1.9.4" ? "thePlayer" : "player"}.sendChatMessage(String)\`（实现类：${version === "1.7.10" ? "1.7.10 在 \`EntityClientPlayerMP\` 上，1.8.9+ 在 \`EntityPlayerSP\` 上，方法同名" : "1.7.10 起 \`EntityPlayerSP\`；本档字段名见上一条注记"}） |
| 截图 | \`ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer)\`（返回值被忽略，规避 1.9.4 的返回类型改名） |

**⚠️ 字段名的置信度低于类名/方法名**：${facts(version).fieldNote}。

**刻意不读 \`TickEvent.Phase\`**：本档语料只给 \`valueOf\`/\`values\`、不给枚举常量名 ⇒ 本仓不背书；桥是**请求驱动**（HTTP 入队 → tick 出队），不读 phase 也完全正确。

## 怎么建 / 怎么装（**人在环：装 jar 前请先确认**）

- **forge 1.12.2**：丢进你会 Gradle 的 1.12.2 工程（或本仓 \`forge/1.12.2/scaffold\`）的 \`src/main/java/...\` + \`src/main/resources/mcmod.info\`，\`gradlew build\`。
- **1.7.10 / 1.8.9 / 1.9.4 / 1.10.2 / 1.11.2**：这些档**没有可用的本地 Gradle 载体**（本仓无 scaffold、构件不在盘）⇒ 需自备该档的 dev 环境（ForgeGradle 1.x/2.x 时代）手工 javac + 打 jar（含 \`mcmod.info\`）。**这一步本仓不代跑**。
- **编码（三个平台通用）**：生成的 Java 含中文注释 ⇒ 你的 \`build.gradle\` 要有 \`tasks.withType(JavaCompile) { options.encoding = 'UTF-8' }\`，手工 \`javac\` 要带 \`-encoding UTF-8\`；
  否则 Windows 默认 GBK 会报 \`unmappable character for encoding GBK\`。
- 装到**你自己**的实例（\`.minecraft/mods/\` 或实例的 mods 目录），客户端启动后日志应出现：
  \`[PT-BRIDGE] listening on 127.0.0.1:<实际端口> (mc ${version})\` —— **默认 \`38081\`**；若 38081 被占，桥会**递减**到 \`38081–38071\` 里第一个空闲端口，日志里的就是实际端口。
  11 个端口全被占时日志打 \`起服务失败：端口区间 [38071, 38081] … 桥不启动（fail-closed）\` ⇒ **桥根本没启动**（别去连一个不存在的桥）。

## 线协议（**逐键对齐** BlackBoxPro ⇒ \`playtest_bridge\` 工具面零改动；2026-11-04 起**追加**两个握手键）

\`\`\`
GET  /status   → {"status":"success","version":"${version}","platform":"forge","httpPort":<实际端口，默认 38081>,
                 "actions":["query_player_state","chat_command","screenshot","block_at","query_inventory_slot","query_inventory","query_nearby_entities","query_chat_history","use_item","query_screen"],"ready":<bool>},
                 "type":"mc-skill-playtest-bridge","bridgeProtocol":1
POST /execute  body = {"id":"<uuid>","action":"<name>","params":{...},"delay":0}
               → {"id":"<同一个 id>","status":"success"|"failure","message":"...","data":{...}}   ← HTTP 恒 200
超时（客户端未在 tick / 未进世界）→ {"id":...,"status":"failure","message":"Timeout after 10000ms"}
\`\`\`

- \`ready\` = \`player != null && world != null\`（已进世界）；由 **tick 线程**每 tick 刷新，HTTP 线程只读 \`volatile\`。
- 成败**只看 body 的 \`status\`**，不要看 HTTP 码（恒 200）。
- 超时串逐字是 \`Timeout after 10000ms\` ⇒ 工具侧映射成 \`PLAYTEST_TIMEOUT\`，**别读成"没有失败"**。
- \`delay\` 参数**本模板忽略**（最小实现）；要延迟请在调用侧 sleep。
- \`httpPort\` 回的是**实际绑定端口**（递减扫描结果），不是常量 —— 38081 空闲时就是 38081；**别假设 38081**，要连哪个端口以这个键为准。
- \`type\` / \`bridgeProtocol\` 是**追加**的握手标记（旧键逐字未动）：\`type\` 恒为 \`mc-skill-playtest-bridge\`，\`bridgeProtocol\` 当前 = \`1\`。

### 端口递减扫描与 fail-closed（2026-11-04 冻结协议）

- 常量：\`BRIDGE_PORT_BASE = 38081\`、\`BRIDGE_PORT_MIN = 38071\`（共 **11** 个端口）。
- 起 HTTP server 时**从 38081 递减**逐个试 bind，**第一个可用端口胜出**；实际端口存进 \`actualPort\` 字段，\`/status\` 的 \`httpPort\` 回它
  ⇒ **38081 空闲时行为与旧版逐字一致**。
- **11 个端口全被占用 ⇒ 打一条含扫描区间的日志并 \`return\`：桥不启动**（fail-closed）。这是刻意的：不静默降级到随机端口，也不假装起好了 ——
  调用侧连不上就是连不上，会按 \`BRIDGE_NOT_FOUND\` 报出扫过的端口。
- 握手：\`/status\` 在**逐字保留全部旧键**的前提下**追加** \`"type":"mc-skill-playtest-bridge"\` 与 \`"bridgeProtocol":1\`；
  调用侧未显式给 \`port\` 时会从 38081 递减扫描，**第一个通过形状握手的端口**胜出；读到 \`bridgeProtocol > 1\` 会拒绝（\`BRIDGE_PROTOCOL_TOO_NEW\`）。

## 手动调（curl）

下面按**默认端口 38081** 写；若 38081 被占，先用第一条的响应体看 \`httpPort\`，再把后续命令里的端口换成它。

\`\`\`bash
curl -s http://127.0.0.1:38081/status
curl -s -X POST http://127.0.0.1:38081/execute -d '{"id":"1","action":"query_player_state","params":{}}'
curl -s -X POST http://127.0.0.1:38081/execute -d '{"id":"2","action":"chat_command","params":{"command":"/time set day"}}'
curl -s -X POST http://127.0.0.1:38081/execute -d '{"id":"3","action":"block_at","params":{"x":0,"y":64,"z":0}}'
curl -s -X POST http://127.0.0.1:38081/execute -d '{"id":"4","action":"screenshot","params":{}}'
curl -s -X POST http://127.0.0.1:38081/execute -d '{"id":"5","action":"query_inventory","params":{}}'
curl -s -X POST http://127.0.0.1:38081/execute -d '{"id":"6","action":"query_nearby_entities","params":{"radius":16}}'
curl -s -X POST http://127.0.0.1:38081/execute -d '{"id":"7","action":"query_chat_history","params":{"count":20}}'
curl -s -X POST http://127.0.0.1:38081/execute -d '{"id":"8","action":"query_screen","params":{}}'
\`\`\`

## 走 \`playtest_bridge\` 工具（同样只连 \`127.0.0.1\`）

\`\`\`bash
mc-skill playtest_bridge --action=status
mc-skill playtest_bridge --action=execute --command='{"action":"query_player_state","params":{}}' --confirmed=true --authorization=sandbox
mc-skill playtest_bridge --action=await --condition=ready --timeoutMs=120000
mc-skill playtest_bridge --action=await --condition=health_below --params='{"health":10}'
\`\`\`

### \`await\` 支持矩阵（哪些条件本模板能成立）

| condition | 底层动作 | 本模板 |
|---|---|---|
| \`ready\` | \`GET /status\` | ✅ |
| \`health_below\` / \`health_above\` | \`query_player_state\`（本模板回了 \`health\`） | ✅ |
| \`inventory_contains\` | \`query_inventory_slot\` | ✅（\`itemId\` = 物品的 **unlocalized / translation key**（如 \`item.stone\`），返回里的 \`idKind\` 会写明是哪一个；**本模板不提供注册表形式**（\`minecraft:stone\`）—— 各档的注册表取值路径出处不齐，不猜 ⇒ 先调一次 \`query_inventory\` 看 \`itemId\` 长什么样） |
| \`entity_nearby\` | \`query_nearby_entities\` | ✅（\`type\` 是 \`EntityList.getEntityString\` 的返回值，**1.7.10/1.8.9 形如 \`Zombie\`，1.9.4+ 形如 \`zombie\`** ⇒ \`await\` 的 \`type\` 参数按本桥返回值传；不带 \`type\` 时只看 \`count > 0\`） |
| \`chat_message_matches\` | \`query_chat_history\` | ${version === "1.7.10" ? "❌ **本档未实现**（本仓该档 javadoc 无 \`ClientChatReceivedEvent\` 页 ⇒ 无出处，不猜）" : "✅（仅在**收到/系统消息**上匹配；发送的不进缓冲）"} |

要 \`inventory_contains\` 但不确定 \`itemId\` 该写什么：先调一次 \`query_inventory\` 看返回值即可。

## 边界（写清不吹）

- **本桥的能力天花板 = 「命令级」**（见顶部那条）：10 个动作 + 发聊天包 ⇒ **做不了玩家物理路径**（走位 / 跳跃 / 挖掘耗时 / 碰撞）；\`/tp\` \`/setblock\` 这类**命令级**操控可用，但受实例权限（op / 是否开作弊）约束。
- **动作 10 个**，但**逐档可用性不同**（见下表）：不可用的动作**会返回带原因的 \`failure\`**，不是假绿 —— 例如本档的 \`use_item\`。
- **\`block_at\` 在 1.7.10 不给注册名**（该档语料里取名方法无背书）⇒ 该档只能按**方块类简单名**断言，或只做冒烟级。
- **\`block_at\` 在 1.8.9 用 \`Block#isAir(IBlockAccess,BlockPos)\`、1.9.4+ 用 \`Block#isAir(IBlockState,IBlockAccess,BlockPos)\`**（1.9.4 多一个参数，模板已逐档分开）。
- **桥无鉴权**且绑定 \`127.0.0.1\` ⇒ 只本机、短会话；不要改绑公网。
- **不代用户接受 EULA**、**不代跑 Gradle**、**不代装 jar**（人在环）。

## 扩展点（想做全 \`await\` 时自己加，**本仓不背书这些名字**）

要补 \`query_inventory_slot\` / \`query_nearby_entities\` / \`query_chat_history\`，先按该档取证再写；逐版本已知的**分叉点**（据本档 javadoc 实页，**但未编译验证**）：

| 项 | 1.7.10 / 1.8.9 | 1.9.4 / 1.10.2 | 1.11.2 / 1.12.2 |
|---|---|---|---|
| 物品注册表字段 | \`Item.itemRegistry\` | \`Item.REGISTRY\` | \`Item.REGISTRY\` |
| 物品栈是否空 | \`stack == null\`（该两档 \`ItemStack\` 页无 \`isEmpty()\`） | \`stack == null\` | \`ItemStack.isEmpty()\` |
| 物品栈取物品 | \`ItemStack.getItem()\` | 同左 | 同左 |
| 背包槽位 | \`player.inventory.getStackInSlot(int)\`（六档同名） | 同左 | 同左 |

⇒ 建议先用 \`search_forge_docs version=<该档>\` 核，或对该档真构件 \`javap\` 后落笔；改名后把本表更新进 \`forge/<ver>/knowledge/common/verified-api.md\`。
`;
}

// ───────────────────────── Rift 1.13.2 ─────────────────────────

/**
 * rift 1.13.2 第二批动作集。出处 = `data/forge_1.13.2/mappings/**`（MCP 快照 20180921-1.13，与 rift scaffold 同快照）：
 *   `InventoryPlayer#getStackInSlot(int)` / `getSizeInventory()` / `getCurrentItem()`；`ItemStack#getItem()/getCount()/isEmpty()/getTranslationKey()`；
 *   `Item#getTranslationKey()`；`World.loadedEntityList`（字段）；`Entity.posX|posY|posZ`；`Minecraft.currentScreen`。
 * **本档三处 fail-closed（如实写明，不猜）**：
 *   - `query_chat_history`：Rift 的 listener 表里**没有聊天接收接口**（`listeners.md` 全文核对过），1.13.2 也没有 Forge 事件 ⇒ 要接得自写 Mixin ⇒ 未实现。
 *   - `use_item`：`net.minecraft.client.multiplayer.PlayerController` **不在本仓 tsrg**（1.13.2 extracted 无该类）⇒ 右键入口无出处 ⇒ 未实现。
 *   - `query_nearby_entities` 的 `type` 用**类简单名**（`Entity.getType()` 返回的 `EntityType` 在本仓 tsrg 里**无任何成员** ⇒ 拿不到注册名）。
 */
function riftExtras(): string {
  const pl = "mc.player";
  const w = "mc.world";
  return [
    '        if ("query_inventory_slot".equals(action)) {',
    '            if (' + pl + ' == null) throw new IllegalStateException("query_inventory_slot：不在世界");',
    '            int slot = intParam(params, "slot");',
    "            net.minecraft.item.ItemStack s = " + pl + ".inventory.getStackInSlot(slot);",
    '            StringBuilder out = new StringBuilder("{");',
    '            out.append("\\"slot\\":").append(slot);',
    '            out.append(",\\"empty\\":").append(s == null || s.isEmpty());',
    "            if (s != null && !s.isEmpty()) {",
    '                out.append(",\\"itemId\\":\\"").append(esc(s.getItem().getTranslationKey())).append("\\"");',
    '                out.append(",\\"idKind\\":\\"translationKey\\"");',
    '                out.append(",\\"count\\":").append(s.getCount());',
    "            }",
    '            out.append("}");',
    "            return out.toString();",
    "        }",
    '        if ("query_inventory".equals(action)) {',
    '            if (' + pl + ' == null) throw new IllegalStateException("query_inventory：不在世界");',
    "            int size = " + pl + ".inventory.getSizeInventory();",
    '            StringBuilder out = new StringBuilder("{\\"size\\":").append(size).append(",\\"slots\\":[");',
    "            for (int i = 0; i < size; i++) {",
    "                net.minecraft.item.ItemStack s = " + pl + ".inventory.getStackInSlot(i);",
    "                if (s == null || s.isEmpty()) continue;",
    "                if (out.charAt(out.length() - 1) != '[') out.append(\",\");",
    '                out.append("{\\"slot\\":").append(i)',
    '                   .append(",\\"itemId\\":\\"").append(esc(s.getItem().getTranslationKey())).append("\\"")',
    '                   .append(",\\"count\\":").append(s.getCount()).append("}");',
    "            }",
    '            out.append("]}");',
    "            return out.toString();",
    "        }",
    '        if ("query_nearby_entities".equals(action)) {',
    '            if (' + w + ' == null || ' + pl + ' == null) throw new IllegalStateException("query_nearby_entities：不在世界");',
    '            double radius = dblParam(params, "radius", 10.0);',
    "            double r2 = radius * radius;",
    "            int count = 0;",
    '            StringBuilder arr = new StringBuilder("[");',
    "            for (Object o : " + w + ".loadedEntityList) {",
    "                if (o == " + pl + ") continue;",
    "                net.minecraft.entity.Entity e = (net.minecraft.entity.Entity) o;",
    "                double dx = e.posX - " + pl + ".posX, dy = e.posY - " + pl + ".posY, dz = e.posZ - " + pl + ".posZ;",
    "                if (dx * dx + dy * dy + dz * dz > r2) continue;",
    '                if (arr.length() > 1) arr.append(",");',
    "                // 本档 type = 类简单名（EntityType 在本仓 tsrg 无成员 ⇒ 拿不到注册名）",
    '                arr.append("{\\"type\\":\\"").append(esc(e.getClass().getSimpleName()))',
    '                   .append("\\",\\"cls\\":\\"").append(esc(e.getClass().getSimpleName()))',
    '                   .append("\\",\\"x\\":").append(e.posX).append(",\\"y\\":").append(e.posY).append(",\\"z\\":").append(e.posZ).append("}");',
    "                count++;",
    "            }",
    '            arr.append("]");',
    '            return "{\\"count\\":" + count + ",\\"entities\\":" + arr + "}";',
    "        }",
    '        if ("query_chat_history".equals(action)) {',
    '            throw new UnsupportedOperationException("query_chat_history：Rift 的 listener 表里没有聊天接收接口（见 rift/1.13.2/knowledge/common/listeners.md），"',
    '                + "1.13.2 也没有 Forge 事件 ⇒ 要接得自写 Mixin ⇒ 本模板未实现，不猜。");',
    "        }",
    '        if ("use_item".equals(action)) {',
    '            throw new UnsupportedOperationException("use_item：1.13.2 的右键入口在 net.minecraft.client.multiplayer.PlayerController 上，"',
    '                + "而该类不在本仓 tsrg（data/forge_1.13.2/extracted 无此 class）⇒ 无出处 ⇒ 未实现。");',
    "        }",
    '        if ("query_screen".equals(action)) {',
    "            String s = mc.currentScreen == null ? null : mc.currentScreen.getClass().getSimpleName();",
    '            return s == null ? "{\\"screen\\":null}" : "{\\"screen\\":\\"" + esc(s) + "\\"}";',
    "        }",
  ].join("\n");
}

/**
 * Rift 桥的 Java 主体。
 *
 * 逐名出处（**全部**来自本仓，1.13.2 MCP 快照 `20180921-1.13`，与 rift scaffold 钉的 `snapshot_20180921` **同快照**）：
 *   - 入口：`org.dimdev.rift.listener.client.ClientTickable#clientTick()`（`rift/1.13.2/knowledge/common/listeners.md:57`）；
 *     Rift listener 必须 public 无参构造、类名写进 `riftmod.json` 的 `listeners`（同档 corpus）。
 *   - MC 侧：`data/forge_1.13.2/mappings/{joined.tsrg,methods.csv,fields.csv}` + `extracted/config/constructors.txt`。
 */
function riftJava(modId: string): string {
  const pkg = `com.example.${safe(modId)}.playtest.bridge`;
  return `package ${pkg};

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import net.minecraft.client.Minecraft;
import net.minecraft.util.ScreenShotHelper;

/**
 * 最小游玩测试桥（**本档 = rift 1.13.2**；测完必须按 README.bridge.md 撤除，绝不提交）。
 *
 * 协议与 \`playtest_bridge\` 一致：\`GET /status\`、\`POST /execute\`。**HTTP 线程只入队，MC 调用全在 clientTick()（客户端 tick 线程）里做**。
 * **本桥的能力天花板 = 命令级**：本桥发的是聊天包、不是键位输入 ⇒ 读数/观察/命令级操控可用，**玩家物理路径（走位/跳跃/挖掘耗时/碰撞）测不了**。
 *
 * 逐名出处（1.13.2 MCP 快照 20180921-1.13，见 \`rift/1.13.2/knowledge/common/bridge-api.md\`）：
 *   listener/clientTick 出处 = Rift corpus；MC 侧名字出处 = \`data/forge_1.13.2/mappings/**\` + \`extracted/config/constructors.txt\`。
 *
 * ⚠️ 两处**本档特有**的边界（都写在这里，别当已证）：
 *   1) \`Minecraft.getInstance()\`：**名字与描述符已证**（methods.csv \`func_71410_x → getInstance\`，javadoc 逐字
 *      "Return the singleton Minecraft instance for the game"），**但 static 性本仓证不出**（1.13.2 extracted 数据不含修饰符；
 *      \`config/static_methods.txt\` 实测是**部分提示表** —— 覆盖 844 类、含 15 个 Minecraft 方法，却漏掉确定静态的 \`func_71410_x\`，
 *      ⇒ 它不能当反证）。另：本仓 1.13.2 forge-docs 语料用的是**旧快照名** \`Minecraft.getMinecraft()\`（同一 SRG、class 限定调用）。
 *      ⇒ 若你的工程用别的 1.13.2 映射快照，把 \`getInstance()\` 换成该快照的对应名即可。
 *   2) \`block_at\` **不给注册名**：1.13.2 的方块注册表字段（\`Block.REGISTRY\`，SRG \`field_149771_c\`）在本仓 tsrg 里**不存在**
 *      ⇒ 无背书；只给 \`Block.getTranslationKey()\`（形如 \`tile.stone\`）+ \`isAir\`。
 */
public class BridgeMod implements org.dimdev.rift.listener.client.ClientTickable {

    /**
     * 端口扫描区间：从 \`BRIDGE_PORT_BASE\` **递减**到 \`BRIDGE_PORT_MIN\`（含两端，共 11 个）。
     * 起服务时逐个试 bind，首个可用端口胜出 ⇒ **38081 空闲时行为与旧版逐字一致**；
     * 全区间占用 ⇒ 打一条含区间的日志且**不启动**（fail-closed，不许静默降级到随机端口）。
     * 只绑 127.0.0.1；桥无鉴权 ⇒ 别暴露到公网。
     */
    public static final int BRIDGE_PORT_BASE = 38081;
    public static final int BRIDGE_PORT_MIN = 38071;

    /**
     * 握手协议上界（\`/status\` 的 \`bridgeProtocol\` 回本值；当前**实现版本 = 上界 = 1**）。
     * 调用侧读到 \`bridgeProtocol > 本值\` 必须**拒绝**（\`BRIDGE_PROTOCOL_TOO_NEW\`），不许猜、不许降级。
     */
    public static final int BRIDGE_PROTOCOL_MAX = 1;

    /** **实际绑定端口**（扫描结果；启动前 = -1）。\`/status\` 的 \`httpPort\` 回这个值，**不再读常量**。 */
    private static volatile int actualPort = -1;

    private static final String ACTIONS = "[\\"query_player_state\\",\\"chat_command\\",\\"screenshot\\",\\"block_at\\",\\"query_inventory_slot\\",\\"query_inventory\\",\\"query_nearby_entities\\",\\"query_chat_history\\",\\"use_item\\",\\"query_screen\\"]";

    private static HttpServer server;

    /** 由 **tick 线程**每 tick 刷新，HTTP 线程只读（HTTP 线程直接碰 Minecraft 会崩）。 */
    private static volatile boolean ready = false;

    /** Rift 要求 listener 有 public 无参构造（每个 listener 类 Rift 只建一个实例）⇒ 在这里起服务。 */
    public BridgeMod() {
        startServer();
    }

    @Override
    public void clientTick() {
        Minecraft mc = Minecraft.getInstance();
        ready = mc.player != null && mc.world != null;
        Task t;
        while ((t = Task.QUEUE.poll()) != null) {
            try {
                t.result = execute(t.action, t.params);
            } catch (Throwable e) {
                t.error = String.valueOf(e);
            } finally {
                t.latch.countDown();
            }
        }
    }

    // ───────────────────────── MC 侧动作（都在客户端 tick 线程执行） ─────────────────────────

    private String execute(String action, Map<String, String> params) {
        Minecraft mc = Minecraft.getInstance();
        if ("query_player_state".equals(action)) {
            StringBuilder out = new StringBuilder("{");
            boolean inWorld = mc.player != null && mc.world != null;
            out.append("\\"inWorld\\":").append(inWorld);
            if (inWorld) {
                out.append(",\\"x\\":").append(mc.player.posX);
                out.append(",\\"y\\":").append(mc.player.posY);
                out.append(",\\"z\\":").append(mc.player.posZ);
                out.append(",\\"yaw\\":").append(mc.player.rotationYaw);
                out.append(",\\"pitch\\":").append(mc.player.rotationPitch);
                out.append(",\\"onGround\\":").append(mc.player.onGround);
                out.append(",\\"health\\":").append(mc.player.getHealth());
            }
            out.append("}");
            return out.toString();
        }
        if ("chat_command".equals(action)) {
            String cmd = params.get("command");
            if (cmd == null || cmd.length() == 0) throw new IllegalArgumentException("chat_command 需要 command");
            // 命令要带前导 '/'；聊天不要。（1.7.10 是 EntityClientPlayerMP，1.8.9+ 是 EntityPlayerSP —— 方法同名 ⇒ 不声明类型名）
            mc.player.sendChatMessage(cmd.charAt(0) == '/' ? cmd : "/" + cmd);
            // ⚠ **停止说谎**（A1，2026-11-04）：sendChatMessage 只把聊天包丢给服务端，本桥**观测不到**它有没有被解析、
            //   有没有真的生效 —— 旧实现回 {"sent":...} 会被判读侧当成「命令成功」。
            //   本档（forge 1.7.10–1.12.2）**未**逐档 javap 核实「命令分发器 + 可捕获反馈的 sender + 服务端线程排队」，
            //   ⇒ 按 fail-closed 回 observed:false（**投递了，但未观测**）。
            //   // TODO(未核实)：核出该档 ICommandManager#executeCommand(ICommandSender,String) / MinecraftServer#getCommandManager()
            //   //   与主线程排队入口的签名后，改成「服务端线程分发 + 把 success/result 回填」，再翻 observed:true。
            return "{\\"sent\\":\\"" + esc(cmd) + "\\", \\"observed\\":false, \\"errorType\\":\\"unobserved\\", \\"reason\\":\\"本桥只发聊天包（sendChatMessage）：包发出去了，但**观测不到**它是否被解析、是否真的生效；该档的命令分发器 + 反馈捕获 + 服务端线程排队三者签名**未核实** ⇒ 按 fail-closed 记 unobserved，不得读成成功。\\"}";
        }
        if ("screenshot".equals(action)) {
            // 1.13.2：saveScreenshot(File,int,int,Framebuffer,Consumer)（本仓 static_methods.txt 正面证明其为静态）
            ScreenShotHelper.saveScreenshot(new File(mc.gameDir, "screenshots"),
                mc.mainWindow.getFramebufferWidth(), mc.mainWindow.getFramebufferHeight(),
                mc.getFramebuffer(), message -> { });
            File dir = new File(mc.gameDir, "screenshots");
            return "{\\"dir\\":\\"" + esc(dir.getAbsolutePath()) + "\\"}";
        }
        if ("block_at".equals(action)) {
            int x = intParam(params, "x");
            int y = intParam(params, "y");
            int z = intParam(params, "z");
            if (mc.world == null) throw new IllegalStateException("block_at：不在世界");
            // BlockPos(int,int,int) 出处：data/forge_1.13.2/extracted/config/constructors.txt（第 46030 行）
            net.minecraft.util.math.BlockPos pos = new net.minecraft.util.math.BlockPos(x, y, z);
            net.minecraft.block.state.IBlockState st = mc.world.getBlockState(pos);
            net.minecraft.block.Block b = st.getBlock();
            StringBuilder out = new StringBuilder("{");
            out.append("\\"x\\":").append(x).append(",\\"y\\":").append(y).append(",\\"z\\":").append(z);
            out.append(",\\"cls\\":\\"").append(esc(b.getClass().getSimpleName())).append("\\"");
            // 注册名不可得（见类注释 2)）⇒ 给 translation key（如 tile.stone），别当注册名用
            out.append(",\\"id\\":\\"").append(esc(b.getTranslationKey())).append("\\"");
            out.append(",\\"idKind\\":\\"translationKey\\"");
            out.append(",\\"air\\":").append(b.isAir(st));
            out.append("}");
            return out.toString();
        }
${riftExtras()}
        throw new IllegalArgumentException("未知 action：" + action);
    }

${bridgeHttpCore("rift", "1.13.2")}
}
`;
}

function riftmodJson(modId: string): string {
  const pkg = `com.example.${safe(modId)}.playtest.bridge`;
  return (
    JSON.stringify(
      {
        id: `${safe(modId)}_playtest_bridge`,
        name: `${modId} Playtest Bridge`,
        authors: ["mc-skill"],
        listeners: [`${pkg}.BridgeMod`],
      },
      null,
      2,
    ) + "\n"
  );
}

function riftReadme(modId: string): string {
  return `# 最小游玩测试桥（rift 1.13.2）

> **测完必须撤除**：删掉本目录 + jar + 实例 \`mods/\` 里的副本。证据只留在授权根内。

## 这是什么 / 为什么有它

\`playtest_bridge\` 那条路线此前只能靠第三方预编译件（BlackBoxPro：fabric/neoforge 1.21.1 + 1.21.11、forge 1.12.2），
**rift 1.13.2 一件都没有**（Rift 本项目 2020-04-28 归档）。这份模板给一个**最小自建桥**：Rift listener 的 \`clientTick()\` + 内嵌
\`com.sun.net.httpserver\`，协议与 \`playtest_bridge\` 一致 ⇒ **工具面零改动**。

**隔离**：不在 \`PLAYTEST_VERIFIED_TIER\`、不参与 driver 派发 —— 桥是独立路线。

## ⚠️ 本桥的能力天花板 = **命令级**（先读这条，别把它当 driver —— driver 路线是「玩家级」：走位 / 跳跃 / 挖掘 / GUI 交互都做得到）

只有 **10 个动作**（其中 \`query_chat_history\` 与 \`use_item\` 在本档 **fail-closed**）、发的是**聊天包**（不是键位输入）：

| 能做 | 做不到 |
|---|---|
| 读数：位置 / 朝向 / 落地 / 血量（\`query_player_state\`）、某坐标方块（\`block_at\`）、截图 | **玩家物理路径**：走位、跳跃、挖掘耗时、碰撞、摔落 |
| **背包读数**（\`query_inventory_slot\` / \`query_inventory\`）、**周围实体计数**（\`query_nearby_entities\`）、**当前界面**（\`query_screen\`） | 聊天历史（本档无事件来源 ⇒ 未实现）；**右键使用物品**（本档入口类不在本仓 tsrg ⇒ 未实现）；GUI **点击** |

## 逐名出处（**本档全有出处**，见仓库 \`rift/1.13.2/knowledge/common/bridge-api.md\`）

| 项 | 本档取值 | 出处 |
|---|---|---|
| 入口 / tick | \`implements org.dimdev.rift.listener.client.ClientTickable\`，\`public void clientTick()\` | \`rift/1.13.2/knowledge/common/listeners.md:57\` |
| 元数据 | \`riftmod.json\`（\`id\` / \`name\` / \`authors\` / \`listeners\`） | \`rift/1.13.2/scaffold/src/main/resources/riftmod.json\` |
| 客户端单例 | \`Minecraft.getInstance()\` | \`data/forge_1.13.2/mappings/methods.csv\`（\`func_71410_x → getInstance\`） |
| 玩家 / 世界 / 游戏目录 | \`mc.player\` / \`mc.world\` / \`mc.gameDir\` | \`data/forge_1.13.2/mappings/fields.csv\`（\`field_71439_g\` / \`field_71441_e\` / \`field_71412_D\`） |
| 位置 / 朝向 / 落地 / 血量 | \`posX/posY/posZ\` / \`rotationYaw/rotationPitch\` / \`onGround\` / \`getHealth()\` | \`data/forge_1.13.2/mappings/**\` |
| 发命令 | \`EntityPlayerSP#sendChatMessage(String)\` | 同上（\`func_71165_d\`，javadoc "Sends a chat message from the player."） |
| 截图 | \`ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer,Consumer)\` | 同上；**静态性**由 \`extracted/config/static_methods.txt\` 正面证明 |
| 窗口尺寸 | \`mc.mainWindow.getFramebufferWidth()/getFramebufferHeight()\` | 同上 |
| 读方块 | \`World#getBlockState(BlockPos)\` / \`IBlockState#getBlock()\` / \`Block#isAir(IBlockState)\` / \`new BlockPos(int,int,int)\` | 同上 + \`extracted/config/constructors.txt:46030\` |

**⚠️ 两处本档特有边界（不许当已证）**：
1. **\`Minecraft.getInstance()\` 的 static 性本仓证不出** —— 名字/描述符已证，但 1.13.2 extracted 数据不含修饰符；
   \`config/static_methods.txt\` 经实测是**部分提示表**（覆盖 844 类、含 15 个 Minecraft 方法，却漏掉确定静态的 \`func_71410_x\`）⇒ 不能当反证。
   另注：本仓 1.13.2 forge-docs 语料用**旧快照名** \`Minecraft.getMinecraft()\`（同一 SRG）⇒ 换映射快照要改名。
2. **\`block_at\` 只给 translation key，不给注册名** —— 1.13.2 的 \`Block.REGISTRY\`（SRG \`field_149771_c\`）在本仓 tsrg 里不存在 ⇒ 无背书。
   返回里带 \`"idKind":"translationKey"\` 标明这一点，**断言时别把 \`tile.stone\` 当 \`minecraft:stone\` 用**。

## 怎么建 / 怎么装（**人在环：装 jar 前请先确认**）

Rift 的官方依赖源 **已死**：\`https://www.dimdev.org/maven/\` 两个域名都 **DNS ENOTFOUND**（不是 404）。
**但 2026-10-05 已找到可用替代：JitPack**（\`dev\` classifier 确有，已对真构件编译验证）——

\`\`\`bash
curl -L -o libs/rift-1.0.4-106-dev.jar \\
  "https://jitpack.io/com/github/DimensionalDevelopment/Rift/1.0.4-106/Rift-1.0.4-106-dev.jar"
\`\`\`

135 503 B / 155 entries · sha256 \`5B5E333D7DD77E89321C72802A68DBCF3F7736139EDD3AA777894A58096D5463\` · 许可 **MIT** · 上游仓已 archived（最后提交 2019-01-01）。
本仓 \`rift/1.13.2/scaffold/libs/README.md\` 仍是**用户自备 jar 放 \`libs/\`** 的设计（jar 不入本仓，避免树内二进制漂移）；\`build.gradle\` 已钉 \`implementation name: 'rift-1.0.4-106-dev'\`。所以：

1. 把本目录的 \`BridgeMod.java\` 放进你的 Rift 工程（\`src/main/java/...\`），\`riftmod.json\` 合并进 \`src/main/resources/\`（**同一个 jar 里只应有一份 \`riftmod.json\`**：
   若你已有自己的 mod，二选一 —— 要么把本桥单独打一个 jar，要么把 \`BridgeMod\` 的类名**追加**进你自己 \`riftmod.json\` 的 \`listeners\` 数组）。
2. 用你的 Rift 工程里的 Gradle（\`net.minecraftforge.gradle.tweaker-client\` + \`RiftLoaderClientTweaker\` + Java 8）\`gradlew build\`。
   ⇒ 编译 classpath 需要 **Rift API**（\`org.dimdev.rift.**\`）+ **1.13.2 MC**。Rift API 已解决（上面那行 curl）；
   **1.13.2 MC 构件仍要你自备**（本机无 1.13.2 构件，\`get_minecraft_source\` 覆盖到 1.14 起）。
   ⇒ **编码**：本文件含中文注释，Java 编译器默认在本机是 GBK ⇒ 你的 \`build.gradle\` 必须有
   \`tasks.withType(JavaCompile) { options.encoding = 'UTF-8' }\`（或命令行 \`javac -encoding UTF-8\`），否则报 \`unmappable character for encoding GBK\`。
   （本仓生成物已用 JDK 8 \`javac -encoding UTF-8\` 对**签名替身**编译通过 —— **替身只证签名形状、不证类存在**。）
3. 装到**你自己**的 Rift 实例的 \`mods/\`，启动后日志应出现 \`[PT-BRIDGE] listening on 127.0.0.1:<实际端口> (mc 1.13.2)\` —— **默认 \`38081\`**；若 38081 被占，桥会**递减**到 \`38081–38071\` 里第一个空闲端口（日志里的就是实际端口）；11 个全被占 ⇒ 日志打 \`桥不启动（fail-closed）\`，**桥根本没起**。

## 线协议（**逐键对齐** BlackBoxPro ⇒ \`playtest_bridge\` 工具面零改动；2026-11-04 起**追加**两个握手键）

\`\`\`
GET  /status   → {"status":"success","version":"1.13.2","platform":"rift","httpPort":<实际端口，默认 38081>,
                 "actions":["query_player_state","chat_command","screenshot","block_at","query_inventory_slot","query_inventory","query_nearby_entities","query_chat_history","use_item","query_screen"],"ready":<bool>,
                 "type":"mc-skill-playtest-bridge","bridgeProtocol":1}
POST /execute  body = {"id":"<uuid>","action":"<name>","params":{...},"delay":0}
               → {"id":"<同一个 id>","status":"success"|"failure","message":"...","data":{...}}   ← HTTP 恒 200
超时 → {"id":...,"status":"failure","message":"Timeout after 10000ms"}
\`\`\`

- \`httpPort\` 回的是**实际绑定端口**（递减扫描结果），不是常量 —— 38081 空闲时就是 38081；**别假设 38081**，要连哪个端口以这个键为准。
- \`type\` / \`bridgeProtocol\` 是**追加**的握手标记（旧键逐字未动）：\`type\` 恒为 \`mc-skill-playtest-bridge\`，\`bridgeProtocol\` 当前 = \`1\`。

### 端口递减扫描与 fail-closed（2026-11-04 冻结协议）

- 常量：\`BRIDGE_PORT_BASE = 38081\`、\`BRIDGE_PORT_MIN = 38071\`（共 **11** 个端口）。
- 起 HTTP server 时**从 38081 递减**逐个试 bind，**第一个可用端口胜出**；实际端口存进 \`actualPort\` 字段，\`/status\` 的 \`httpPort\` 回它
  ⇒ **38081 空闲时行为与旧版逐字一致**。
- **11 个端口全被占用 ⇒ 打一条含扫描区间的日志并 \`return\`：桥不启动**（fail-closed）。这是刻意的：不静默降级到随机端口，也不假装起好了 ——
  调用侧连不上就是连不上，会按 \`BRIDGE_NOT_FOUND\` 报出扫过的端口。
- 握手：\`/status\` 在**逐字保留全部旧键**的前提下**追加** \`"type":"mc-skill-playtest-bridge"\` 与 \`"bridgeProtocol":1\`；
  调用侧未显式给 \`port\` 时会从 38081 递减扫描，**第一个通过形状握手的端口**胜出；读到 \`bridgeProtocol > 1\` 会拒绝（\`BRIDGE_PROTOCOL_TOO_NEW\`）。

## 手动调（curl）

下面按**默认端口 38081** 写；若 38081 被占，先用第一条的响应体看 \`httpPort\`，再把后续命令里的端口换成它。

\`\`\`bash
curl -s http://127.0.0.1:38081/status
curl -s -X POST http://127.0.0.1:38081/execute -d '{"id":"1","action":"query_player_state","params":{}}'
curl -s -X POST http://127.0.0.1:38081/execute -d '{"id":"2","action":"chat_command","params":{"command":"/time set day"}}'
\`\`\`

### \`await\` 支持矩阵

| condition | 本模板 |
|---|---|
| \`ready\` | ✅ |
| \`health_below\` / \`health_above\` | ✅（\`query_player_state\` 回了 \`health\`） |
| \`inventory_contains\` | ✅（**本档 \`itemId\` = translation key**，如 \`tile.stone\` —— Item 的注册名取值在本仓无出处 ⇒ \`await\` 的 \`itemId\` 按 translation key 传） |
| \`entity_nearby\` | ✅（**\`type\` = 类简单名**，如 \`EntityZombie\` —— 该档 \`EntityType\` 在本仓 tsrg 里无成员，拿不到注册名 ⇒ \`await\` 的 \`type\` 按类简单名传） |
| \`chat_message_matches\` | ❌ **本档未实现**：Rift 的 listener 表里没有聊天接收接口，1.13.2 也没有 Forge 事件 ⇒ 要接得自写 Mixin |

（\`use_item\` 在本档也**未实现**：1.13.2 的右键入口类不在本仓 tsrg。）

## 边界（写清不吹）

- **本桥的能力天花板 = 命令级**（见上）；玩家物理路径测不了。
- **动作 10 个**，但本档的 \`query_chat_history\` 与 \`use_item\` **fail-closed**（返回带原因的 failure，不是假绿）。
- **\`getInstance()\` 的 static 性未证**（见上）⇒ 编译报 \`non-static method ... cannot be referenced from a static context\` 时，换该快照的单例访问式。
- **\`block_at\` 回的是 translation key**，不是注册名。
- **Rift 依赖源已死，但替代源已找到（2026-10-05）**：\`https://www.dimdev.org/maven/\` DNS ENOTFOUND；**JitPack \`com.github.DimensionalDevelopment:Rift:1.0.4-106\` 可用，\`dev\` classifier 确有**（见上面「怎么建」那段 curl 与 sha256），且已 \`javap\` 对真构件核过 \`ClientTickable#clientTick()\`（无参）/\`ServerTickable#serverTick(MinecraftServer)\`/\`RiftLoaderClientTweaker\`。⚠️ jar 内 \`profile.json\` 写 \`inheritsFrom: "1.13"\` ⇒ **官方标称 MC 1.13**，**1.13.2 能否真跑仍未核实**。
- 桥无鉴权、只绑 \`127.0.0.1\`；**不代用户接受 EULA**、**不代跑 Gradle**、**不代装 jar**。
`;
}

// ───────────────────────── Risugami's ModLoader 1.6.4（骨架） ─────────────────────────

/**
 * ModLoader 1.6.4 桥 —— **骨架**。
 *
 * 2026-10-11 构件复核后已取得三类出处（官方 zip \`javap\`，见 \`modloader/1.6.4/knowledge/common/safe-api.md\`）：
 * tick 注册 \`ModLoader.setInGameHook\`、**回调实名 \`BaseMod.onTickInGame(float, Minecraft)\`**、**客户端单例 \`ModLoader.getMinecraftInstance()\`**。
 * 桥的其余出处（玩家与位置字段 / 发聊天 / 截图 / 读方块 / 背包 / 实体列表 / 右键入口 / 当前界面）
 * **在本仓仍无来源** —— 该档无 MCP 映射、工具链也不覆盖 1.6.4。
 * ⇒ 生成的类**能编译、能加载**：HTTP 半边 + \`setInGameHook\` 注册 + 回调名是真的，MC 半边集中在内部类 \`Mc\` 里**逐条 throw**并点名「未核实」。
 * `/status` 可用；`/execute` 一律返回带 `TODO(未核实)` 的 failure（**fail-closed**，不是假绿）。
 */
function modloaderJava(modId: string): string {
  const cls = `mod_${safe(modId)}_PlaytestBridge`;
  return `package net.minecraft.src;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

/**
 * 最小游玩测试桥（**本档 = Risugami's ModLoader 1.6.4**）—— ⚠️ **骨架，别当可用桥**。
 *
 * **协议半边是真的、能跑**：\`GET /status\` / \`POST /execute\` + 内嵌 \`com.sun.net.httpserver\`（JDK 6+ 自带），
 * 与 \`playtest_bridge\` 逐键一致；\`load()\` 里的 \`ModLoader.setInGameHook(this, true, false)\` 有出处。
 *
 * **2026-10-11 构件复核**：回调实名 \`onTickInGame(float, Minecraft)\`（构件实证：ModLoader 调的就是它）
 * 与客户端单例取法 \`ModLoader.getMinecraftInstance()\` 已按官方 zip（mcarchive 归档 1.2.5/1.5.2/1.6.2）\`javap\` 实证并写死。
 *
 * **MC 半边其余全是 TODO(未核实)**：1.6.4 的「玩家与位置字段 / 发聊天 / 截图 / 读方块」在本仓**仍没有来源** ——
 * 该档无 MCP 映射（\`data/modloader_1.6.4/\` 只有 house 自撰的 safe-api.md）、工具链也不覆盖 1.6.4。
 * ⇒ 这些名字集中在内部类 \`Mc\`，**逐条 throw**，绝不按 1.7.10 / Fabric 记忆猜。
 * 要真用起来：在**你自己的 MCP 1.6.4 工作区**里核出真名 → 打开 README.bridge.md 的清单逐条替换。
 *
 * 撤除纪律与其它档相同：**测完即删**（本类 + jar + 实例 \`mods/\` 里的副本）。
 */
public class ${cls} extends BaseMod {

    /**
     * 端口扫描区间：从 \`BRIDGE_PORT_BASE\` **递减**到 \`BRIDGE_PORT_MIN\`（含两端，共 11 个）。
     * 起服务时逐个试 bind，首个可用端口胜出 ⇒ **38081 空闲时行为与旧版逐字一致**；
     * 全区间占用 ⇒ 打一条含区间的日志且**不启动**（fail-closed，不许静默降级到随机端口）。
     * 只绑 127.0.0.1；桥无鉴权 ⇒ 别暴露到公网。
     */
    public static final int BRIDGE_PORT_BASE = 38081;
    public static final int BRIDGE_PORT_MIN = 38071;

    /**
     * 握手协议上界（\`/status\` 的 \`bridgeProtocol\` 回本值；当前**实现版本 = 上界 = 1**）。
     * 调用侧读到 \`bridgeProtocol > 本值\` 必须**拒绝**（\`BRIDGE_PROTOCOL_TOO_NEW\`），不许猜、不许降级。
     */
    public static final int BRIDGE_PROTOCOL_MAX = 1;

    /** **实际绑定端口**（扫描结果；启动前 = -1）。\`/status\` 的 \`httpPort\` 回这个值，**不再读常量**。 */
    private static volatile int actualPort = -1;

    private static final String ACTIONS = "[\\"query_player_state\\",\\"chat_command\\",\\"screenshot\\",\\"block_at\\",\\"query_inventory_slot\\",\\"query_inventory\\",\\"query_nearby_entities\\",\\"query_chat_history\\",\\"use_item\\",\\"query_screen\\"]";

    private static HttpServer server;

    /** 由 tick 线程刷新、HTTP 线程只读（HTTP 线程碰游戏对象会崩）。 */
    private static volatile boolean ready = false;

    @Override
    public String getVersion() {
        return "1.0.0";
    }

    @Override
    public void load() {
        // ✅ 唯一有出处的一项：modloader/1.6.4/knowledge/common/safe-api.md:29
        //    ⚠️ 两个 boolean 的含义**未核实**（本表只给签名），这里按 (enable=true, useClock=false) 传；核到语义后自行调整。
        ModLoader.setInGameHook(this, true, false);
        startServer();
    }

    @Override
    public void modsLoaded() {
    }

    /**
     * 回调实名与签名（**构件 javap 实证 2026-10-11**）：\`BaseMod#onTickInGame(float, Minecraft) → boolean\`。
     * 出处 = 官方 zip（mcarchive 归档）1.2.5 / 1.5.2 / 1.6.2 的 \`BaseMod.class\` 逐字；
     * 1.2.5 / 1.5.2 构件里第二参可读名 = \`net.minecraft.client.Minecraft\`（本工作区类型名若不同，按你的工作区改）。
     * ⚠️ 返回值语义（返回 false 是否摘钩）**未核实** —— 先恒 true。
     */
    @Override
    public boolean onTickInGame(float partialTicks, Minecraft mc) {
        try {
            ready = Mc.isInWorld();
        } catch (Throwable e) {
            ready = false;
        }
        Task t;
        while ((t = Task.QUEUE.poll()) != null) {
            try {
                t.result = Mc.execute(t.action, t.params);
            } catch (Throwable e) {
                t.error = String.valueOf(e);
            } finally {
                t.latch.countDown();
            }
        }
        return true; // TODO(未核实)：返回值语义；先恒 true
    }

    /**
     * ⚠️ **本档 MC 侧的全部访问都收在这里** —— 每一条都是 \`TODO(未核实)\`。
     * 替换时**只改这个内部类**，外面的 HTTP/协议代码一行都不用动。
     */
    static final class Mc {

        private static String todo(String what) {
            return "TODO(未核实)：ModLoader 1.6.4 的「" + what + "」在本仓无出处"
                 + "（safe-api.md 2026-10-11 构件复核只补上了 tick 回调名与客户端单例取法；该档无 MCP 映射、工具链不覆盖）"
                 + " ⇒ 请在自备的 MCP 1.6.4 工作区里核出真名后替换，禁止按 1.7.10 / Fabric 记忆猜。";
        }

        static boolean isInWorld() {
            throw new UnsupportedOperationException(todo("客户端单例 + 世界/玩家字段"));
        }

        static String execute(String action, Map<String, String> params) {
            if ("query_player_state".equals(action)) throw new UnsupportedOperationException(todo("玩家位置/朝向/落地/血量"));
            if ("chat_command".equals(action))      throw new UnsupportedOperationException(todo("发聊天 / 发命令"));
            if ("screenshot".equals(action))        throw new UnsupportedOperationException(todo("截图 API"));
            if ("block_at".equals(action))          throw new UnsupportedOperationException(todo("按坐标读方块（含取值方法与参数形）"));
            if ("query_inventory_slot".equals(action)) throw new UnsupportedOperationException(todo("背包取槽（InventoryPlayer/ItemStack 的名字与取槽方法）"));
            if ("query_inventory".equals(action))      throw new UnsupportedOperationException(todo("背包遍历（同上）"));
            if ("query_nearby_entities".equals(action)) throw new UnsupportedOperationException(todo("世界实体列表 + 实体位置/取名"));
            if ("query_chat_history".equals(action))   throw new UnsupportedOperationException(todo("聊天接收钩子（ModLoader 时代是否有可用事件未知）"));
            if ("use_item".equals(action))             throw new UnsupportedOperationException(todo("右键使用入口（PlayerController 之类）"));
            if ("query_screen".equals(action))         throw new UnsupportedOperationException(todo("当前界面字段/取值"));
            throw new IllegalArgumentException("未知 action：" + action);
        }
    }

${bridgeHttpCore("modloader", "1.6.4")}
}
`;
}

function modloaderMcmodInfo(modId: string): string {
  return (
    JSON.stringify(
      [
        {
          modid: `${safe(modId)}_playtest_bridge`,
          name: `${modId} Playtest Bridge`,
          description: "最小游玩测试桥骨架（playtest_bridge 协议；只绑 127.0.0.1）。MC 半边为 TODO(未核实)。测完即删。",
          version: "1.0.0",
          mcversion: "1.6.4",
        },
      ],
      null,
      2,
    ) + "\n"
  );
}

function modloaderReadme(modId: string): string {
  const cls = `mod_${safe(modId)}_PlaytestBridge`;
  return `# 最小游玩测试桥 · **骨架**（Risugami's ModLoader 1.6.4）

> ⚠️ **先说清楚：这份产物现在不是一座能用的桥。** 它的**协议半边是真的**（HTTP + \`setInGameHook\` 注册 + 回调实名），
> 但 **10 个动作的 MC 侧取值全都是 \`TODO(未核实)\`** —— \`/status\` 能通，\`/execute\` 一律返回带 \`TODO(未核实)\` 的 failure。
> 动作清单 = \`query_player_state\` / \`chat_command\` / \`screenshot\` / \`block_at\` / \`query_inventory_slot\` / \`query_inventory\` /
> \`query_nearby_entities\` / \`query_chat_history\` / \`use_item\` / \`query_screen\`（全部走内部类 \`Mc\` 的 \`throw\`）。
> 这不是偷懒：本仓对 1.6.4 **无 MCP 映射**（2026-10-11 构件复核已把 tick 回调名与客户端单例取法补上，其余名称仍**没有来源**），按纪律**不许猜**。

## 本仓对该档的完整出处盘点（构件复核后）

| 桥需要什么 | 本档状态 | 出处 |
|---|---|---|
| tick 钩子 | ✅ \`ModLoader.setInGameHook(BaseMod, boolean, boolean)\` | \`modloader/1.6.4/knowledge/common/safe-api.md\`（+ \`setInGUIHook\`） |
| 回调方法名/签名 | ✅ \`BaseMod.onTickInGame(float, Minecraft) → boolean\`（骨架已按此写死） | 官方 zip 1.2.5/1.5.2/1.6.2 \`javap\`（safe-api.md 2026-10-11 行） |
| 客户端单例 | ✅ \`ModLoader.getMinecraftInstance()\`（名字与返回类型位实证；骨架暂未使用——\`isInWorld\` 仍需世界字段名） | 同上 |
| 玩家对象 / 位置字段 | ❌ 无来源 | — |
| 发聊天 / 发命令 | ⚠️ 名字在（\`ModLoader.clientChat(String)\` / BaseMod 回调同族），语义未核；发命令入口未核 | 同上 |
| 截图 API | ❌ 无来源 | — |
| 读方块签名 | ❌ 无来源（表里只有 \`World.getBlockId\` 这个名字，**签名与参数形未核**；且 ModLoader 时代 \`Block\` 无 \`getRegistryName\`） | — |
| 映射数据 | ❌ \`data/modloader_1.6.4/\` 只有 \`modloader-docs\`（即 house 自撰的 safe-api.md），**无 mappings** | — |
| 上游文档 | ⚠️ Risugami 自 **MC 1.6.2（2013）** 停更；**官方发布物已由 mcarchive 归档取回**（1.2.5 / 1.5.2 / 1.6.2），本机留档 \`F:\\MC_GAME\\_oracle-jars\\modloader\\\` | safe-api.md 2026-10-11 行 |
| 工具链覆盖 | ❌ \`get_minecraft_source\` 只覆盖 1.14–1.21.11 与 26.1+；\`convert_mapping\` 不覆盖 1.6.4 | — |

## 怎么把它变成真桥（**在你自己有 MCP 1.6.4 工作区的前提下**）

1. 在你的 MCP 1.6.4 工作区里核出这 4（+1）个名字（回调名与单例取法已由构件实证写死，不用再核）：
   - 世界 / 玩家对象字段名，以及位置（3 个 double）、朝向、落地、血量（\`getHealth()\` 之类）的取法；
   - 发聊天 / 发命令的方法（\`ModLoader.clientChat(String)\` 的名字在，**语义未核**；1.6.4 的实际名字与 1.7.10 的 \`sendChatMessage\` **不保证一致**）；
   - 截图 API（1.6.4 的截图路径与 1.7.10 **不是同一个**）；
   - 按坐标读方块的签名（\`World.getBlockId(int,int,int)\` 还是别的；参数形要核）；
   - （+1）\`setInGameHook\` 两个 boolean 的语义。
2. 把结果填进 \`${cls}.Mc\` 内部类（**只改那一个内部类**）；回调已按构件实证写为 \`onTickInGame(float, Minecraft)\`（若你的工作区类型名不同再改）。
3. 构建（**本档无 Gradle 工程形态**：ModLoader 时代是 MCP + Eclipse，手工 \`javac\` + 打 jar）：
   \`\`\`bat
   javac -encoding UTF-8 -source 1.6 -target 1.6 -cp "<你的 MCP 1.6.4 工作区>\\bin;<ModLoader>.jar" -d out ${cls}.java
   jar cf playtest_bridge.zip -C out .
   \`\`\`
   （\`-source/-target\` 按你的环境调整；**\`-encoding UTF-8\` 必须有** —— 本文件含中文注释，Windows 默认 GBK 会报 \`unmappable character for encoding GBK\`。
   \`com.sun.net.httpserver\` 是 JDK 自带，无需额外依赖。）
4. 安装：ModLoader 1.6.4 的常规位置是 \`.minecraft/mods/\` 下的 zip/jar（jar 里含 \`${cls}.class\` 与 \`mcmod.info\`）。
   **⚠️ 本仓无该位置/格式的出处** —— 请按你的实例实际确认。
   （官方 ModLoader 1.6.4 发布物**不存在**，见 safe-api.md:5；你能跑起来的多半是某个 1.6.4 整合/魔改包里的 ModLoader。）
5. 启动后日志应出现 \`[PT-BRIDGE] listening on 127.0.0.1:<实际端口> (mc 1.6.4)\` —— 出现即证明**协议半边是活的**。**默认 \`38081\`**；若被占则递减到 \`38081–38071\` 里第一个空闲端口（以日志里的为准）；11 个全占 ⇒ 打 \`桥不启动（fail-closed）\` 且**不启动**。

## 线协议（与其它档逐键一致；2026-11-04 起**追加**两个握手键）

\`\`\`
GET  /status   → {"status":"success","version":"1.6.4","platform":"modloader","httpPort":<实际端口，默认 38081>,
                 "actions":["query_player_state","chat_command","screenshot","block_at","query_inventory_slot","query_inventory","query_nearby_entities","query_chat_history","use_item","query_screen"],"ready":<bool>,
                 "type":"mc-skill-playtest-bridge","bridgeProtocol":1}
POST /execute  → {"id":...,"status":"success"|"failure","message":"...","data":{...}}   ← HTTP 恒 200
超时 → {"id":...,"status":"failure","message":"Timeout after 10000ms"}
\`\`\`

- \`httpPort\` 回的是**实际绑定端口**（递减扫描结果），不是常量 —— 38081 空闲时就是 38081；**别假设 38081**，要连哪个端口以这个键为准。
- \`type\` / \`bridgeProtocol\` 是**追加**的握手标记（旧键逐字未动）：\`type\` 恒为 \`mc-skill-playtest-bridge\`，\`bridgeProtocol\` 当前 = \`1\`。

### 端口递减扫描与 fail-closed（2026-11-04 冻结协议）

- 常量：\`BRIDGE_PORT_BASE = 38081\`、\`BRIDGE_PORT_MIN = 38071\`（共 **11** 个端口）。
- 起 HTTP server 时**从 38081 递减**逐个试 bind，**第一个可用端口胜出**；实际端口存进 \`actualPort\` 字段，\`/status\` 的 \`httpPort\` 回它
  ⇒ **38081 空闲时行为与旧版逐字一致**。
- **11 个端口全被占用 ⇒ 打一条含扫描区间的日志并 \`return\`：桥不启动**（fail-closed）。这是刻意的：不静默降级到随机端口，也不假装起好了 ——
  调用侧连不上就是连不上，会按 \`BRIDGE_NOT_FOUND\` 报出扫过的端口。
- 握手：\`/status\` 在**逐字保留全部旧键**的前提下**追加** \`"type":"mc-skill-playtest-bridge"\` 与 \`"bridgeProtocol":1\`；
  调用侧未显式给 \`port\` 时会从 38081 递减扫描，**第一个通过形状握手的端口**胜出；读到 \`bridgeProtocol > 1\` 会拒绝（\`BRIDGE_PROTOCOL_TOO_NEW\`）。

## 边界（写清不吹）

- **本产物 = 骨架**：\`/execute\` 十个动作全部 fail-closed（返回 \`TODO(未核实)\` 的 failure），**不是假绿**。
- **本桥的能力天花板即便填完也是命令级**：桥发聊天包、不是键位输入 ⇒ 玩家物理路径测不了。
- ModLoader 1.6.4 是**手动构建 + 手动安装**时代；**本仓不代跑编译、不代装 jar**（人在环）。
- 若你不想补这些出处（10 个动作 + \`isInWorld\`）：更划算的替代是**离线解析存档（region/NBT）+ 人工驱动**（见 \`modloader/1.6.4/knowledge/common/safe-api.md\` 的结论段）。
`;
}

// ───────────────────────── Risugami's ModLoader 1.6.2（默认包 / obf 路线，真机已达成驱动面） ─────────────────────────
//
// **为什么这三件是「逐字节真源码」、不是拼出来的模板**：1.6.2 走的是**默认包 + 直接对官方混淆 client.jar 编译**的路线
// （ModLoader 的 `BaseMod`/`ModLoader` 与 MC 混淆类都在默认包，而具名包不能引用默认包 ⇒ mod 也必须在默认包），
// 且本仓对该档**没有 MCP 映射**可用 ⇒ MC 侧名字只能取自**真机达成过驱动面**的那一版源码。
// ⇒ 本分支**不做任何字符串插值**：把磁盘真值目录里的三件原样吐出（逐字节一致，下面每件都带 sha256 便于复核）。
//
// 磁盘真值目录：`F:\B AND D MOD\mod\modloader-1.6.2\src\`（三件**平铺**在 `src/` 下、**无 package 声明**）
// 记录件：`F:\B AND D MOD\artifacts\modloader-1.6.2-lb-record.md`
// sha256（2026-11-10 逐字节复核）：
//   BanddTickProxy.java       1537 B   314ffe159039b6a990a9eddba5dcb7f50da0d406ea25d75769ecb51f1ec227cf
//   mod_bandd_playtest.java   10319 B  cbfb04d41d495171e469601c4cf5d4fe8276f104c951d9cb9f4a50975a2cb405
//   ObfAdapter.java           15041 B  f1ac19941b6291940813bd9dfd42859b9e606b7004aa6c169ae59131f423c697
//
// **文件键的理由（键 = 文件名本身）**：默认包 ⇒ 磁盘上**没有包目录**，`src/` 里三件平铺，最短且忠实于磁盘的键就是文件名。
// 这与本仓 `playtest-mod-adapters.ts` 对**同三件**所用的键同形（那份表也是 `ObfAdapter.java` / `mod_bandd_playtest.java` /
// `BanddTickProxy.java`）⇒ 两处产物可逐键互查。**不加** `playtest/bridge/` 前缀：那是本文件另外三档（forge / rift / 1.6.4）
// 的落点约定，而默认包源码的落点由「源码根」决定（任何目录都行，因为没有 package），加前缀既与磁盘真值不一致、
// 又会暗示存在一个包目录 —— 那是假的。
const MODLOADER_162_SOURCES: Readonly<Record<string, string>> = {
  "BanddTickProxy.java": "import java.io.File;\n\n/**\n * **默认包** tick 代理 —— 给「**还没进世界**」的阶段提供 MC 线程上的每帧回调。\n *\n * 为什么需要它：ModLoader 的 onTick 由它自己的 EntityRendererProxy 调，而那个代理是\n * ModLoader.registerServer 在**集成服启动**时才装进 ats.p 的（registerServer 的字节码：\n * getstatic instance; new EntityRendererProxy(instance); putfield ats.p:Lbfb;）⇒ 进世界前\n * ModLoader.onTick 根本不会被调，setInGameHook 注册的 onTickInGame 也就不会跑。\n * 而 HTTP 动作必须在 **MC 线程**上执行（HTTP 线程碰 MC 会崩）⇒ 得自己造一个 tick 源。\n *\n * 形状照抄 ModLoader 自己的 EntityRendererProxy（extends bfb、覆写 b(float)、先 super 再回调）：\n *   EntityRendererProxy.b(float): aload_0; fload_1; invokespecial bfb.b(F)V;\n *                                 fload_1; getfield game:Lats; invokestatic ModLoader.onTick(FLats;)V\n * 调用点：ats 主循环里 getfield p:Lbfb; ... invokevirtual bfb.b:(F)V（每帧一次）。\n *\n * 装配时机由 mod_bandd_playtest 的看门狗负责（只在 ats.p 是朴素 bfb 时替换，绝不覆盖\n * ModLoader 的 EntityRendererProxy）。\n */\npublic class BanddTickProxy extends bfb {\n\n    private final ats game;\n\n    public BanddTickProxy(ats game) {\n        super(game);\n        this.game = game;\n    }\n\n    @Override\n    public void b(float partialTicks) {\n        super.b(partialTicks);\n        mod_bandd_playtest.tickFromGameThread(this.game);\n    }\n}\n",
  "mod_bandd_playtest.java": "import com.bandd.playtest.core.Arbitration;\nimport com.bandd.playtest.core.HttpApi;\nimport com.bandd.playtest.core.Json;\nimport com.bandd.playtest.core.PlaytestCore;\n\nimport java.io.File;\nimport java.nio.charset.StandardCharsets;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\nimport java.nio.file.Paths;\nimport java.security.SecureRandom;\nimport java.util.LinkedHashMap;\nimport java.util.Map;\n\n/**\n * 入口：ModLoader 1.6.2 的**默认包** mod（「直接对官方混淆 client.jar 编译」路线）。\n *\n * **为什么在默认包**：BaseMod / ModLoader 在默认包，且本档 MC 类（ats/bdf/atp…）也全在默认包；\n * Java 不允许具名包引用默认包 ⇒ 本类必须在默认包（默认包 import 具名包则没问题）。\n *\n * **加载链（逐条 javap 实证，ModLoader-1.6.2.zip）**：\n *   RenderManager(bgi) 的 static {} -> new bgi() -> 构造器里 ModLoader.addAllRenderers(map)\n *     -> ModLoader.init() -> loadConfig() + readFromClassPath() + readFromModFolder(modDir) + sortModList()\n *     -> readFromModFolder 只认 mods/ 下 **.jar/.zip**，且只把 zip 内 **以 mod_ 开头、以 .class 结尾** 的条目交给 addMod\n *     -> addMod 里 name.split(\".\")[0] 取简单类名 + 跳过含 $ 的 -> modList -> init() 末尾调 BaseMod.load()\n *   ⇒ 本 jar 必须放在 <gameDir>/mods/，且入口类名必须以 mod_ 开头、类文件在 jar **根**。\n *   ⇒ 因为 RenderManager 的 static {} 在 ats 构造器里就触发，**mod 在游戏启动时（还没进世界）就被加载**。\n *\n * **tick 来源（两条，互补；不重复调）**：\n *   1) 进世界**前**：ModLoader.onTick 还不存在（它由 EntityRendererProxy 调，而那个代理是\n *      ModLoader.registerServer 在**集成服启动**时才装进 ats.p 的）⇒ 本模组自己装一个 bfb 子类\n *      （BanddTickProxy）到 ats.p，拿到**MC 线程**上的每帧回调 —— 这样 open_world 这类动作\n *      才能在 MC 线程上执行（HTTP 线程碰 MC 会崩）。\n *   2) 进世界**后**：ModLoader.registerServer 会把 ats.p 换成它自己的 EntityRendererProxy，\n *      于是走 setInGameHook 注册的 onTickInGame（本模组在 load() 里注册）。\n *      看门狗只在 ats.p 是**朴素 bfb**时才装自己的代理 ⇒ 永不覆盖 ModLoader 的代理。\n */\npublic class mod_bandd_playtest extends BaseMod {\n\n    public static final String MOD_ID = \"bandd_playtest\";\n\n    private static PlaytestCore core;\n    private static HttpApi http;\n    private static boolean initFailed;\n\n    @Override\n    public String getVersion() {\n        return \"0.1.0\";\n    }\n\n    /**\n     * 进世界前用的 tick 代理。**必须在 load() 里构造**：\n     * load() 跑在 **MC 线程**上（它由 ModLoader.init() -> BaseMod.load() 触发，而 init() 是 RenderManager(bgi)\n     * 的 static{} 在 ats 构造器偏移 ~707 处触发的），此时 Display.create() 早已执行（ats 构造器偏移 ~250/282）\n     * ⇒ **GL 上下文在场**。bfb 的构造器要做 GL 调用，换到别的线程 new 会抛\n     * \"No OpenGL context found in the current thread\"（实测踩到）。看门狗线程只负责**赋值**，不负责构造。\n     */\n    private static volatile bfb preWorldProxy;\n\n    @Override\n    public void load() {\n        // 第三参 false = 每帧都调（ModLoader.onTick 的 clock 去重只在第三参为 true 时生效；字节码实证）。\n        ModLoader.setInGameHook(this, true, false);\n        try {\n            ats mc = ats.w();\n            if (mc != null) {\n                preWorldProxy = new BanddTickProxy(mc);\n                System.out.println(\"[bandd-playtest] pre-world tick proxy constructed on MC thread (GL ctx present)\");\n            }\n        } catch (Throwable t) {\n            System.err.println(\"[bandd-playtest] pre-world proxy construct failed: \" + t);\n            t.printStackTrace();\n        }\n        ensureInit();\n        startTickProxyWatchdog();\n    }\n\n    @Override\n    public void modsLoaded() {\n    }\n\n    /** 进世界之后的 tick 来源（ModLoader.onTick -> inGameHooks -> 这里）。返回值 false 会被摘 hook ⇒ 恒 true。 */\n    @Override\n    public boolean onTickInGame(float partialTicks, ats mc) {\n        tickFromGameThread(mc);\n        return true;\n    }\n\n    /** BanddTickProxy（进世界之前）与 onTickInGame（进世界之后）共用的唯一 tick 入口。 */\n    public static void tickFromGameThread(ats mc) {\n        PlaytestCore c = core;\n        if (c != null) c.onTick();\n    }\n\n    /**\n     * 看门狗：只在 ats.p 是**朴素 bfb**（= 既不是本模组的代理、也不是 ModLoader 的 EntityRendererProxy）时\n     * 装上本模组的代理。为什么需要：进世界前没有任何 MC 线程回调可用；\n     * 而 ats.p 在 ats 构造器里是**后于** ModLoader.init() 才赋值的 ⇒ 在 load() 里直接装会被覆盖。\n     */\n    private static void startTickProxyWatchdog() {\n        Thread t = new Thread(new Runnable() {\n            @Override public void run() {\n                try { Thread.sleep(2000L); } catch (InterruptedException e) { return; }\n                boolean logged = false;\n                for (;;) {\n                    try {\n                        ats mc = ats.w();\n                        bfb proxy = preWorldProxy;\n                        // 只赋值：构造需要 GL 上下文（见 preWorldProxy 注释），本线程没有。\n                        if (mc != null && proxy != null && mc.p != null && mc.p.getClass() == bfb.class) {\n                            mc.p = proxy;\n                            if (!logged) {\n                                logged = true;\n                                System.out.println(\"[bandd-playtest] tick proxy installed on ats.p (pre-world, MC thread)\");\n                            }\n                        }\n                    } catch (Throwable e) {\n                        System.err.println(\"[bandd-playtest] tick proxy watchdog: \" + e);\n                    }\n                    try { Thread.sleep(500L); } catch (InterruptedException e) { return; }\n                }\n            }\n        }, \"bandd-playtest-tickproxy\");\n        t.setDaemon(true);\n        t.start();\n    }\n\n    private static synchronized void ensureInit() {\n        if (core != null || initFailed) return;\n        try {\n            // 游戏目录出处：ModLoader 自己的字节码 new File(ats.w().x, \"mods\") / \"ModLoader.txt\" ⇒ ats.x = mcDataDir。\n            ats mc = ats.w();\n            Path base = (mc != null && mc.x != null)\n                    ? mc.x.toPath().toAbsolutePath().normalize()\n                    : Paths.get(\".\").toAbsolutePath().normalize();\n            Path cfgPath = base.resolve(\"config\").resolve(MOD_ID + \".json\");\n            Map<String, Object> cfg = loadOrCreateConfig(cfgPath, base);\n\n            String token = Json.str(cfg, \"token\", \"\");\n            int port = (int) Double.parseDouble(Json.str(cfg, \"port\", \"38081\"));\n            String modeName = Json.str(cfg, \"arbitration\", \"AUTO\");\n            String evidenceDir = Json.str(cfg, \"evidenceDir\", \"\");\n            if (evidenceDir.isEmpty()) {\n                evidenceDir = base.resolve(\"bandd-playtest-evidence\").toString();\n            } else {\n                Path ed = Paths.get(evidenceDir);\n                if (!ed.isAbsolute()) evidenceDir = base.resolve(ed).normalize().toString();\n            }\n\n            ObfAdapter bridge = new ObfAdapter();\n            core = new PlaytestCore(bridge, Paths.get(evidenceDir), token);\n            try {\n                core.arbitration().setMode(Arbitration.Mode.valueOf(modeName.toUpperCase()));\n            } catch (IllegalArgumentException e) {\n                core.evidence().log(\"[QA] 配置里的 arbitration=\" + modeName + \" 不合法，回退 AUTO\");\n            }\n\n            http = new HttpApi(core);\n            int actual = http.start(port);\n            core.evidence().log(\"[QA] init: mod=\" + MOD_ID + \" platform=\" + bridge.platform()\n                    + \" mc=\" + bridge.mcVersion() + \" port=\" + actual\n                    + \" arbitration=\" + core.arbitration().mode()\n                    + \" gameDir=\" + base\n                    + \" evidenceDir=\" + evidenceDir\n                    + \" keyCount=\" + bridge.supportedKeys().size());   // 运行期键位表大小（零猜测）\n            core.evidence().state(Json.of(core.status()));\n\n            Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {\n                @Override public void run() {\n                    if (core != null) core.onShutdown();\n                    if (http != null) http.stop();\n                }\n            }, \"bandd-playtest-shutdown\"));\n        } catch (Throwable t) {\n            initFailed = true;\n            System.err.println(\"[bandd-playtest] init failed: \" + t);\n            t.printStackTrace();\n        }\n    }\n\n    private static Map<String, Object> loadOrCreateConfig(Path cfgPath, Path base) {\n        try {\n            if (Files.exists(cfgPath)) {\n                return Json.parseObject(new String(Files.readAllBytes(cfgPath), StandardCharsets.UTF_8));\n            }\n            Map<String, Object> cfg = new LinkedHashMap<String, Object>();\n            byte[] b = new byte[16];\n            new SecureRandom().nextBytes(b);\n            StringBuilder sb = new StringBuilder();\n            for (byte x : b) sb.append(String.format(\"%02x\", x));\n            cfg.put(\"token\", sb.toString());\n            cfg.put(\"port\", 38081);\n            cfg.put(\"arbitration\", \"AUTO\");\n            cfg.put(\"evidenceDir\", base.resolve(\"bandd-playtest-evidence\").toString());\n            cfg.put(\"_comment\", \"token 必须随请求带上；port 被占会自动 +1；arbitration = AUTO | HOTKEY | DUAL\");\n            Files.createDirectories(cfgPath.getParent());\n            Files.write(cfgPath, Json.of(cfg).getBytes(StandardCharsets.UTF_8));\n            return cfg;\n        } catch (Exception e) {\n            System.err.println(\"[bandd-playtest] config 读写失败，用内存默认值: \" + e);\n            Map<String, Object> cfg = new LinkedHashMap<String, Object>();\n            cfg.put(\"token\", \"\");\n            cfg.put(\"port\", 38081);\n            cfg.put(\"arbitration\", \"AUTO\");\n            return cfg;\n        }\n    }\n}\n",
  "ObfAdapter.java": "import com.bandd.playtest.core.Capabilities;\nimport com.bandd.playtest.core.GameBridge;\nimport com.bandd.playtest.core.Json;\n\nimport java.io.File;\nimport java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.LinkedHashMap;\nimport java.util.List;\nimport java.util.Map;\n\n/**\n * **默认包**适配层 —— ModLoader 1.6.2（「直接对官方混淆 client.jar 编译」路线）。\n *\n * 为什么必须在默认包：1.6.2 的 MC 类全在**默认包**（ats / bdf / atp …），\n * 而 **Java 不允许具名包引用默认包** ⇒ 任何要直接命名 MC 类的代码自己也得在默认包。\n * 反向可以（默认包 import 具名包）⇒ 本类照样 implements com.bandd.playtest.core.GameBridge。\n *\n * 为什么不需要 reobf / 映射：reobf 的作用是「把可读名改写成混淆名」。本路线**写的本来就是混淆名**\n * （逐条来自本机 javap 真构件）⇒ 编译产物里的引用**就是运行期名字**。\n *\n * ===== 字段/方法锚定表（全部**调用点级**证据，逐条本机 javap -c） =====\n *\n * | 用途 | 混淆名 | 签名 | 锚点证据 |\n * |---|---|---|---|\n * | Minecraft 单例 | ats.w() | public static ats w() | ModLoader 自身字节码 ats.w().x |\n * | thePlayer | ats.h | public bdf h | ModLoader.onTick: ats.h != null && ats.h.q != null |\n * | theWorld | nm.q（经 bdf 继承） | public abv q | 同上（ModLoader 用 ats.h.q 判「玩家在世界里」）|\n * | gameSettings | ats.u | public aui u | ModLoader.onTick: ats.u.an（语言）|\n * | currentScreen | ats.n | public awb n | ModLoader.onTick: if (ats.n != null) ... ats.n |\n * | posX/Y/Z | nm.u / nm.v / nm.w | public double u/v/w | nm.e(DDD)（getDistance）读这三个字段做差求距离 |\n * | motionX/Y/Z | nm.x / nm.y / nm.z | public double x/y/z | nm.a(FFF)（moveFlying）把速度累加进 x/z |\n * | rotationYaw/Pitch | nm.A / nm.B | public float A/B | (1) nm.c(FF)（setAngles）: **B 被夹到 ±90**、A 走 par1*0.15；(2) nm.a(FFF): A*pi/180 -> lr.a/lr.b（sin/cos）；(3) NBT 字面量 \"Rotation\" 写 float[]{A,B}；(4) o.A-o.C / o.B-o.D 成对 |\n * | prevRotationYaw/Pitch | nm.C / nm.D | public float C/D | 同上 (1)(3)(4) |\n * | 世界时间（tick 钟） | abv.J() | public long J() | ModLoader.onTick 把它当 tick 去重用的 clock |\n * | 键位表 | atp.a | public static java.util.List a | atp(String,int) 构造器里 a.add(this) |\n * | 键名 | atp.c | public java.lang.String c | atp(String,int) 写 c |\n * | 键码 | atp.d | public int d | 同上；atp.b（IntHashMap）用它做键 |\n * | 按下态 | atp.e | public boolean e | atp.a(int,boolean) 只写 e；atp.d()（unpressKey）清 e |\n * | **注入按下/松开** | atp.a(int,boolean) | public static void | 字节码 = 按 keyCode 查 IntHashMap -> putfield atp.e（= vanilla setKeyBindState）|\n * | pressTime | atp.f | public int f | atp.a(int) ++f；atp.c() 消耗 f |\n * | 开世界（= launchIntegratedServer） | ats.a(String,String,acc) | public void | 字节码 = loadWorld(null) -> ISaveFormat.getSaveLoader -> WorldInfo -> new bkw（IntegratedServer）-> displayGuiScreen(null) |\n * | 世界设置 | acc(long,acd,boolean,boolean,acf) | public | 上面那条的 par3 类型就是 acc |\n * | 游戏模式 | acd.a(int) | public static acd a(int) | 字节码 = 遍历 values() 比 e（id）取，缺省返回 b（= vanilla getByID）|\n * | 世界类型 | acf.b | public static final acf b | 字段声明序（a = worldTypes 数组，b = DEFAULT）|\n * | 游戏目录（mcDataDir） | ats.x | public final java.io.File x | ModLoader: new File(ats.w().x, \"mods\") / \"ModLoader.txt\" / \"versions\" |\n *\n * **未锚定 ⇒ 一律 fail-closed**（不猜）：血量/饥饿/背包/截图/聊天收发/化身/认证开关/连服务器。\n */\npublic final class ObfAdapter implements GameBridge {\n\n    /** 本档真正能做的动作（其余如实自报 unavailable，不静默）。 */\n    private static final List<String> CAN_DO = Collections.unmodifiableList(java.util.Arrays.asList(\n            \"ping\", \"set_arbitration\", \"status\",\n            \"query_player_state\", \"query_screen\",\n            \"press\", \"release_all\", \"take_over\", \"open_world\"));\n\n    private static boolean todoLogged;\n\n    private static void todo(String what) {\n        if (todoLogged) return;\n        todoLogged = true;\n        System.err.println(\"[bandd-playtest] TODO(未核实)：ModLoader 1.6.2 的「\" + what + \"」本档无调用点级出处 ⇒ fail-closed。\");\n    }\n\n    private static double r4(double d) { return Math.round(d * 10000.0) / 10000.0; }\n\n    @Override public String platform() { return \"modloader\"; }\n\n    @Override public String mcVersion() { return \"1.6.2\"; }\n\n    /**\n     * 世界与玩家都在场。\n     * **出处 = ModLoader 自己的 onTick 字节码**：ats.h != null && ats.h.q != null 才调 onTickInGame。\n     * 比「单例可达」强：单例在主菜单也成立（那是假绿）。\n     */\n    @Override public boolean ready() {\n        ats mc = ats.w();\n        return mc != null && mc.h != null && mc.h.q != null;\n    }\n\n    @Override public void tick() { }\n\n    // =============== 读数面（真读坐标 —— L-b 判据） ===============\n\n    @Override public String playerStateJson() {\n        Map<String, Object> m = new LinkedHashMap<String, Object>();\n        ats mc = ats.w();\n        if (mc == null || mc.h == null || mc.h.q == null) {\n            m.put(\"present\", Boolean.FALSE);\n            return Json.of(m);\n        }\n        bdf p = mc.h;\n        m.put(\"present\", Boolean.TRUE);\n        m.put(\"x\", r4(p.u));                        // nm.u = posX（getDistance 读它）\n        m.put(\"y\", r4(p.v));                        // nm.v = posY\n        m.put(\"z\", r4(p.w));                        // nm.w = posZ\n        m.put(\"yaw\", r4((double) p.A));             // nm.A = rotationYaw\n        m.put(\"pitch\", r4((double) p.B));           // nm.B = rotationPitch（setAngles 夹 ±90）\n        m.put(\"motionX\", r4(p.x));                  // nm.x = motionX（moveFlying 累加）\n        m.put(\"motionY\", r4(p.y));\n        m.put(\"motionZ\", r4(p.z));\n        m.put(\"worldTime\", Long.valueOf(mc.h.q.J()));   // abv.J() —— ModLoader 自己当 tick 钟用\n        return Json.of(m);\n    }\n\n    @Override public String screenName() {\n        ats mc = ats.w();\n        if (mc == null || mc.n == null) return null;\n        return mc.n.getClass().getName();\n    }\n\n    // =============== 开世界（= launchIntegratedServer） ===============\n\n    /**\n     * 打开/新建一个存档。\n     *\n     * 出处：ats.a(String,String,acc) 的字节码逐条对上 vanilla launchIntegratedServer(folder, name, WorldSettings)：\n     * a((bda)null)（loadWorld） -> ad.a(folder,false)（getSaveLoader） -> alz.d()（getWorldInfo）\n     * -> 若 worldInfo==null 且 settings!=null 则 new alp(settings,folder) 落盘 -> new bkw(this,folder,name,settings)（IntegratedServer）\n     * -> 自旋等 bkw.ah() -> a((awb)null)（displayGuiScreen(null)）。\n     *\n     * 存档目录 = new File(ats.w().x, \"saves\")（x = mcDataDir，出处见类注释）。\n     * 已存在 ⇒ 传 null settings（与 vanilla GuiSelectWorld 同路，保住存档自己的 seed/gamemode）；\n     * 不存在 ⇒ 传新 acc(seed, CREATIVE, mapFeatures=true, hardcore=false, acf.b) 新建。\n     */\n    @Override public void openWorld(String worldName) {\n        ats mc = ats.w();\n        if (mc == null) throw new IllegalStateException(\"Minecraft 单例不可达（ats.w() == null）\");\n        if (worldName == null || worldName.isEmpty()) throw new IllegalArgumentException(\"world 名不能为空\");\n        File saveDir = new File(new File(mc.x, \"saves\"), worldName);\n        acc settings = null;\n        if (!saveDir.isDirectory()) {\n            settings = new acc(20261103L, acd.a(1), true, false, acf.b);\n        }\n        mc.a(worldName, worldName, settings);\n    }\n\n    @Override public void chatCommand(String command) {\n        todo(\"发聊天/命令（ModLoader.clientChat(String) 是**收**不是**发**：字节码里它只遍历 modList 调 BaseMod.clientChat）\");\n    }\n\n    @Override public String screenshotPath() { todo(\"截图 API\"); return null; }\n\n    // =============== 按键面（逐条 javap 实证；**零硬编码键名**） ===============\n\n    /**\n     * 运行期键名。1.6.2 的 atp.c 是**描述串**（aui 的构造器里字面量 \"key.forward\" / \"key.sneak\" /\n     * \"key.hotbar.1\" 实证）⇒ 本方法把每条绑定的「最后一段」（key.forward -> forward）当**对外键名**输出，\n     * **只在该段全局唯一时**才用它（否则退回完整描述串）。\n     * 为什么这样做：源码里**零硬编码键名**（\"forward\" 这个字面量一个都不写），同时让 /status 的\n     * supportedKeys 与 press 的入参口径一致（core 的 press 会先按这张表校验，名字对不上就 KEY_NOT_SUPPORTED）。\n     */\n    @Override public List<String> supportedKeys() {\n        return new ArrayList<String>(nameMap().keySet());\n    }\n\n    private static List<atp> bindings() {\n        List<atp> out = new ArrayList<atp>();\n        List<?> all = atp.a;\n        if (all == null) return out;\n        for (Object o : all) {\n            if (o instanceof atp) out.add((atp) o);\n        }\n        return out;\n    }\n\n    /** 描述串的最后一段；没有点号就原样返回。 */\n    private static String seg(String n) {\n        if (n == null) return null;\n        int i = n.lastIndexOf((int) '.');\n        if (i < 0 || i == n.length() - 1) return n;\n        return n.substring(i + 1);\n    }\n\n    /** 对外键名 -> 绑定。段名重复的退回完整描述串（不猜、不歧义）。 */\n    private static Map<String, atp> nameMap() {\n        List<atp> all = bindings();\n        Map<String, Integer> segCount = new LinkedHashMap<String, Integer>();\n        for (atp kb : all) {\n            String s = seg(kb.c);\n            if (s == null) continue;\n            Integer c = segCount.get(s);\n            segCount.put(s, Integer.valueOf(c == null ? 1 : c.intValue() + 1));\n        }\n        Map<String, atp> m = new LinkedHashMap<String, atp>();\n        for (atp kb : all) {\n            String s = seg(kb.c);\n            String name = (s != null && segCount.get(s).intValue() == 1) ? s : kb.c;\n            if (name != null && !m.containsKey(name)) m.put(name, kb);\n        }\n        return m;\n    }\n\n    /** 先按完整描述串精确查，再按对外键名查；查不到返回 null（调用方 fail-closed）。 */\n    private static atp find(String key) {\n        if (key == null) return null;\n        for (atp kb : bindings()) {\n            if (key.equals(kb.c)) return kb;\n        }\n        return nameMap().get(key);\n    }\n\n    /**\n     * 读「真人是否正按着这个键」。\n     * **刻意读字段 e 而不是调 c()**：c() 的字节码是 if (f == 0) return false; --f; return true;\n     * （= vanilla isPressed，会**自减 pressTime**）⇒ 拿它当只读探针会吃掉游戏的按键计数。\n     */\n    @Override public boolean isPressed(String key) {\n        atp kb = find(key);\n        return kb != null && kb.e;\n    }\n\n    @Override public void setPressed(String key, boolean down) {\n        atp kb = find(key);\n        if (kb == null) throw new IllegalArgumentException(\"未知按键：\" + key + \"（本档键名以运行期键位表为准）\");\n        atp.a(kb.d, down);     // public static void a(int,boolean) —— 字节码：查 IntHashMap -> putfield e\n    }\n\n    // =============== 其余全部 fail-closed ===============\n\n    @Override public String spawnBot(String name, double distance) { todo(\"召唤化身（1.6.2 无 mannequin；本档不做）\"); return null; }\n    @Override public void moveBotTo(double x, double y, double z) { todo(\"移动化身\"); }\n    @Override public void tickBot() { }\n    @Override public String giveBot(String item, int count) { todo(\"给化身发物品\"); return null; }\n    /** 本机玩家转视角。锚点：`nm.A`=rotationYaw、`nm.B`=rotationPitch（setAngles 只夹 B 到 ±90；NBT 字面量 \"Rotation\" 紧跟 float[]{A,B}）。 */\n    @Override public boolean look(double yaw, double pitch) {\n        ats mc = ats.w();\n        if (mc == null || mc.h == null) return false;\n        bdf p = mc.h;\n        p.A = (float) yaw;    // nm.A = rotationYaw\n        p.B = (float) pitch;  // nm.B = rotationPitch\n        return true;\n    }\n\n    @Override public boolean lookBot(double yaw, double pitch) { todo(\"化身转向\"); return false; }\n    @Override public String breakBotBlock(double x, double y, double z) { todo(\"化身挖方块\"); return null; }\n    @Override public String placeBotBlock(double x, double y, double z) { todo(\"化身放方块\"); return null; }\n    @Override public boolean setServerAuth(boolean online) { todo(\"关集成服认证（拿不到 MinecraftServer 句柄）\"); return false; }\n    @Override public void joinServer(String address) { todo(\"作为真客户端连服务器\"); }\n    @Override public void despawnBot() { }\n    @Override public String openBotInventory() { todo(\"开化身物品栏\"); return null; }\n    @Override public List<String> drainChat() { todo(\"聊天接收钩子（BaseMod.clientChat 在，但本档不挂）\"); return Collections.emptyList(); }\n\n    /** 能力自报：**按实际做得到的列白名单**，其余逐条列 unavailable（谎报比不报更糟）。 */\n    @Override public List<String> unavailableActions() {\n        List<String> l = new ArrayList<String>();\n        for (String a : Capabilities.all()) {\n            if (!CAN_DO.contains(a)) l.add(a);\n        }\n        return l;\n    }\n    // 2026-11-04 统一取目标方块规格（主 = 自算射线；备 = 渲染路径；reach 创造 5.0 / 生存 4.5）**未在本档落地**：\n    //   本档目录没有 gradlew ⇒ 拿不到 BUILD SUCCESSFUL 判据 ⇒ 按纪律只加注释、不硬改代码。\n    // ===== 本轮 5 项修复（look / setPressed 补 click / closeScreen / mineLookingAt / tick 推进）=====\n    // fix 1 look：本档**已有**实现（rotationYaw/rotationPitch），本轮未改。\n    // fix 2 setPressed 补 click：本档按键写入面本就 fail-closed（键集为空 / TODO），故 N/A。\n    // fix 3 closeScreen：需要「读当前界面 + 关界面」两个名字；本档是默认包 + 混淆名路线（对官方混淆 client.jar 编译），关界面/挖矿一族名字**本仓未逐名取证**\n    //   ⇒ 不猜，保持 GameBridge 默认实现（返回 false = CLOSE_UNSUPPORTED）。\n    // fix 4/5 mineLookingAt + tick 逐帧推进：需要 objectMouseOver / playerController.clickBlock /\n    //   onPlayerDamageBlock 一族名字，本档同样未取证 ⇒ 不猜，保持默认实现（返回 null）。\n    // 为什么只加注释不改代码：本档目录**没有 gradlew**（跑不了 `gradlew.bat build --offline`，\n    //   拿不到「BUILD SUCCESSFUL」判据）⇒ 硬改无法验证，违反「宁可少做一项，不可留红树」的纪律。\n}\n",
};
// ───────────────────────── 共享 HTTP 半边（三个平台逐字节一致） ─────────────────────────

/** 生成 HTTP 侧（\`/status\` + \`/execute\` + Handler/Task/JSON 工具），\`platform\`/\`version\` 只影响前端声明。 */
function bridgeHttpCore(platform: string, version: string): string {
  return `    // ───────────────────────── HTTP 侧（只入队 + 等结果） ─────────────────────────

    private static void startServer() {
        // 端口递减扫描（2026-11-04 冻结协议）：从 BRIDGE_PORT_BASE 起逐个试 bind，首个可用端口胜出。
        // 38081 空闲时行为与旧版逐字一致；**不做静默降级** —— 全区间占用时下面的分支打日志并 return（不启动）。
        HttpServer srv = null;
        int boundPort = -1;
        for (int p = BRIDGE_PORT_BASE; p >= BRIDGE_PORT_MIN && srv == null; p--) {
            try {
                srv = HttpServer.create(new InetSocketAddress("127.0.0.1", p), 0);
                boundPort = p;
            } catch (IOException e) {
                System.out.println("[PT-BRIDGE] 端口 " + p + " 不可用（" + e.getMessage() + "），继续递减扫描");
            }
        }
        if (srv == null) {
            // ⚠ fail-closed：区间全占 ⇒ 桥**不启动**（不是"降级到随机端口"，也不是"假装成功"）。
            System.out.println("[PT-BRIDGE] 起服务失败：端口区间 [" + BRIDGE_PORT_MIN + ", " + BRIDGE_PORT_BASE
                + "] 共 " + (BRIDGE_PORT_BASE - BRIDGE_PORT_MIN + 1) + " 个端口全部不可用 ⇒ 桥不启动（fail-closed）");
            return;
        }
        actualPort = boundPort;
        server = srv;
        try {
            server.createContext("/status", new Handler() {
                public void handle(HttpExchange ex) throws IOException {
                    // 形状与 BlackBoxPro 逐键一致（**旧键逐字保留**），并在末尾**追加**形状标记：
                    // {status,version,platform,httpPort,actions,ready,type,bridgeProtocol}；httpPort = **实际绑定端口**（扫描结果）。
                    respond(ex, "{\\"status\\":\\"success\\",\\"version\\":\\"${version}\\",\\"platform\\":\\"${platform}\\","
                        + "\\"httpPort\\":" + actualPort + ",\\"actions\\":" + ACTIONS + ",\\"ready\\":" + ready
                        + ",\\"type\\":\\"mc-skill-playtest-bridge\\",\\"bridgeProtocol\\":" + BRIDGE_PROTOCOL_MAX + "}");
                }
            });
            server.createContext("/execute", new Handler() {
                public void handle(HttpExchange ex) throws IOException {
                    String body = readAll(ex);
                    String id = "unknown";
                    try {
                        Map<String, String> flat = flatJson(body);
                        if (flat.get("id") != null) id = flat.get("id");
                        String action = flat.get("action");
                        if (action == null) throw new IllegalArgumentException("body 需要 action");
                        Task t = new Task(action, flat);
                        Task.QUEUE.add(t);
                        // 等 tick 线程回填；客户端没在 tick（菜单/未进世界/卡住）会超时。
                        // 超时串与 BlackBoxPro 逐字一致（\`Timeout after <N>ms\`）⇒ 调用侧照常映射成 PLAYTEST_TIMEOUT，
                        // **不是"空结果"**；\`delay\` 参数本实现忽略（要延迟请在调用侧 sleep）。
                        if (!t.latch.await(10000, TimeUnit.MILLISECONDS)) {
                            respond(ex, "{\\"id\\":\\"" + esc(id) + "\\",\\"status\\":\\"failure\\",\\"message\\":\\"Timeout after 10000ms\\"}");
                            return;
                        }
                        if (t.error != null) {
                            respond(ex, "{\\"id\\":\\"" + esc(id) + "\\",\\"status\\":\\"failure\\",\\"message\\":\\"" + esc(t.error) + "\\"}");
                            return;
                        }
                        respond(ex, "{\\"id\\":\\"" + esc(id) + "\\",\\"status\\":\\"success\\",\\"message\\":\\"ok\\",\\"data\\":" + t.result + "}");
                    } catch (Throwable e) {
                        respond(ex, "{\\"id\\":\\"" + esc(id) + "\\",\\"status\\":\\"failure\\",\\"message\\":\\"" + esc(String.valueOf(e)) + "\\"}");
                    }
                }
            });
            server.setExecutor(null);
            server.start();
            System.out.println("[PT-BRIDGE] listening on 127.0.0.1:" + actualPort + " (mc ${version})");
        } catch (Throwable e) {
            System.out.println("[PT-BRIDGE] 起服务失败：" + e);
        }
    }

    static abstract class Handler implements com.sun.net.httpserver.HttpHandler {
        /** **HTTP 恒 200**（与 BlackBoxPro 契约一致）—— 成败只看 body 里的 \`status\` 字段。 */
        protected static void respond(HttpExchange ex, String json) throws IOException {
            byte[] b = json.getBytes(StandardCharsets.UTF_8);
            ex.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
            ex.sendResponseHeaders(200, b.length);
            OutputStream os = ex.getResponseBody();
            os.write(b);
            os.close();
        }

        protected static String readAll(HttpExchange ex) throws IOException {
            java.io.ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = ex.getRequestBody().read(buf)) > 0) bos.write(buf, 0, n);
            return new String(bos.toByteArray(), StandardCharsets.UTF_8);
        }
    }

    static class Task {
        static final java.util.concurrent.ConcurrentLinkedQueue<Task> QUEUE =
            new java.util.concurrent.ConcurrentLinkedQueue<Task>();
        final String action;
        final Map<String, String> params;
        final CountDownLatch latch = new CountDownLatch(1);
        volatile String result = "{}";
        volatile String error;
        Task(String action, Map<String, String> params) { this.action = action; this.params = params; }
    }

    // ───────────────────────── 手写 JSON（极简：扁平对象 / 字符串 / 数字 / 布尔） ─────────────────────────

    /** 把 \`{"action":"x","params":{"k":"v","n":1,"b":true}}\` 拍平成 k→v（数字/布尔按原样文本）。 */
    static Map<String, String> flatJson(String s) {
        Map<String, String> out = new LinkedHashMap<String, String>();
        if (s == null) return out;
        int i = 0;
        while (i < s.length()) {
            int k = s.indexOf('"', i);
            if (k < 0) break;
            int kEnd = s.indexOf('"', k + 1);
            if (kEnd < 0) break;
            String key = s.substring(k + 1, kEnd);
            int colon = s.indexOf(':', kEnd);
            if (colon < 0) break;
            int v = colon + 1;
            while (v < s.length() && Character.isWhitespace(s.charAt(v))) v++;
            if (v >= s.length()) break;
            char c = s.charAt(v);
            if (c == '"') {
                int e = v + 1;
                StringBuilder sb = new StringBuilder();
                while (e < s.length() && s.charAt(e) != '"') {
                    if (s.charAt(e) == '\\\\' && e + 1 < s.length()) { sb.append(s.charAt(e + 1)); e += 2; }
                    else { sb.append(s.charAt(e)); e++; }
                }
                out.put(key, sb.toString());
                i = e + 1;
            } else if (c == '{') {
                int depth = 0, e = v;
                for (; e < s.length(); e++) { if (s.charAt(e) == '{') depth++; else if (s.charAt(e) == '}') { depth--; if (depth == 0) { e++; break; } } }
                out.putAll(flatJson(s.substring(v + 1, Math.max(v + 1, e - 1))));
                i = e;
            } else {
                int e = v;
                while (e < s.length() && ",}".indexOf(s.charAt(e)) < 0) e++;
                out.put(key, s.substring(v, e).trim());
                i = e;
            }
        }
        return out;
    }

    static int intParam(Map<String, String> p, String k) {
        String v = p.get(k);
        if (v == null) throw new IllegalArgumentException("缺参数 " + k);
        return (int) Math.floor(Double.parseDouble(v));
    }

    /** 可选 int 参数（缺省给默认值）—— query_chat_history 的 count 用。 */
    static int intParamOr(Map<String, String> p, String k, int dflt) {
        String v = p.get(k);
        if (v == null || v.length() == 0) return dflt;
        return (int) Math.floor(Double.parseDouble(v));
    }

    /** 可选 double 参数（缺省给默认值）—— query_nearby_entities 的 radius 用。 */
    static double dblParam(Map<String, String> p, String k, double dflt) {
        String v = p.get(k);
        if (v == null || v.length() == 0) return dflt;
        return Double.parseDouble(v);
    }

    /** 只转义 \\\\ 与 " —— 够手写 JSON 用。 */
    static String esc(String s) {
        if (s == null) return "";
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '"' || c == '\\\\') b.append('\\\\').append(c);
            else if (c == '\\n') b.append("\\\\n");
            else if (c == '\\r') b.append("\\\\r");
            else b.append(c);
        }
        return b.toString();
    }
`;
}

function safe(modId: string): string {
  return modId.replace(/[^A-Za-z0-9_]/g, "_");
}

export function generateBridgeMod(platform: string, version: string, modId: string): { files: Record<string, string> } {
  const safeId = safe(modId);
  if (platform === "forge" && BRIDGE_MOD_VERSIONS.includes(version)) {
    return {
      files: {
        [`playtest/bridge/BridgeMod.java`]: forgeJava(version, modId),
        [`playtest/bridge/mcmod.info`]: forgeMcmodInfo(safeId, version),
        [`playtest/bridge/README.bridge.md`]: forgeReadme(version, safeId),
      },
    };
  }
  if (platform === "rift" && version === "1.13.2") {
    return {
      files: {
        [`playtest/bridge/BridgeMod.java`]: riftJava(modId),
        [`playtest/bridge/riftmod.json`]: riftmodJson(modId),
        [`playtest/bridge/README.bridge.md`]: riftReadme(safeId),
      },
    };
  }
  if (platform === "modloader" && version === "1.6.4") {
    return {
      files: {
        [`playtest/bridge/mod_${safeId}_PlaytestBridge.java`]: modloaderJava(modId),
        [`playtest/bridge/mcmod.info`]: modloaderMcmodInfo(safeId),
        [`playtest/bridge/README.bridge.md`]: modloaderReadme(safeId),
      },
    };
  }
  if (platform === "modloader" && version === "1.6.2") {
    // 1.6.2 = **默认包 / obf 路线**：三件真源码逐字节产出（无插值、无 README）——该路线测完即撤；
    // 逐名锚定表与真机读数见 `F:\B AND D MOD\artifacts\modloader-1.6.2-lb-record.md`、
    // 坑位见 `community_knowledge/authored/ingame-playtest-automation.md` 编号 91–97。
    return { files: { ...MODLOADER_162_SOURCES } };
  }
  throw new Error(`generateBridgeMod: 未支持的桥目标 ${platform} ${version}（见 BRIDGE_MOD_TARGETS）——原因：本档的桥模板尚无逐名出处：rift 的模板函数（riftJava / riftmodJson / riftReadme，以及 bridgeHttpCore("rift","1.13.2")）全部钉在 1.13.2（MC 侧名字来自 data/forge_1.13.2/mappings 的 MCP 快照 20180921-1.13，Rift 侧是 rift-1.0.4-106-dev 构件）⇒ 拿它顶替 1.13 就是无出处的猜写，此处 fail-closed、不静默降级。下一步：① 不走桥 —— 改用 driverMode=temporary_client_tick_driver（或 in_jvm_player_agent）：本档会另发 playtest/mod/ 二合一 mod 形态（含 rift113/RiftAdapter.java），它在 PLAYTEST_MOD_VERIFIED_TIER 里有真机读数（press forward ⇒ dz=+12.800 格，2026-11-03）—— 注意 rift 不在 PLAYTEST_VERIFIED_TIER，故 playtest/PlaytestQaDriver.java 单文件解释器在本档仍是结构壳；② 要桥形态就先用 rift 1.13.2（--version=1.13.2）：它有逐名有出处的真模板（BridgeMod.java + riftmod.json）；③ 想让 1.13 也出桥：先按 Rift 1.13 真构件逐名取证，再给 generateBridgeMod 补一条 rift 1.13 分支（本表是「目标表」不是「可生成表」）。`);
}
