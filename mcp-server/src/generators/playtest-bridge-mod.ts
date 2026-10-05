/**
 * 老平台「最小桥 mod」模板生成器（1.7.10–1.12.2）。
 *
 * **为什么要它**：`playtest_bridge` 这套「HTTP 桥」路线此前只有第三方预编译件可用（BlackBoxPro 覆盖面 = fabric/neoforge 1.21.1 + 1.21.11、forge 1.12.2），
 * **1.7.10–1.11.2 一件都没有**。本生成器给出一份**最小、逐版本正确**的桥 mod 源码模板：tick 钩子 + 内嵌 `com.sun.net.httpserver`，
 * 协议与 `playtest_bridge` 一致（`GET /status`、`POST /execute`），⇒ 老平台不必改工具面就能走桥路线。
 *
 * **线协议（逐键对齐 BlackBoxPro，源码级 as-of 2026-09-29；不对齐就等于"工具面零改动"是假的）**：
 *   - `GET /status` → `{status,version,platform,httpPort,actions,ready}`；`ready = player!=null && world!=null`
 *     （本模板里 `ready` 由 tick 线程每 tick 刷新、HTTP 线程只读 `volatile` —— HTTP 线程直接碰 `Minecraft` 会崩）。
 *   - `POST /execute` body = `{id,action,params,delay}` →
 *     `{id,status:"success"|"failure",message,data}`，**HTTP 恒 200**（成败只看 body 的 `status`）。
 *     工具侧 `playtest_bridge` 的 `responseOf` 正是只读这四个键 ⇒ 不改一行代码就能调。
 *   - 超时串**逐字**用 `Timeout after <N>ms`（BlackBoxPro 无专用码，工具按这个正则映射 `PLAYTEST_TIMEOUT`）。
 *   - `delay` 参数本模板**忽略**（最小实现；要延迟请在调用侧 sleep），README 里写明。
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
 * **能力天花板 = 「命令级」（必须对用户写明，别让人误当 driver）**：10 个动作 + `chat_command` 发的是**聊天包**（不是键位输入）
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
 * `BRIDGE_MOD_TARGETS` = forge `1.7.10 / 1.8.9 / 1.9.4 / 1.10.2 / 1.11.2 / 1.12.2` **+ rift `1.13.2` + modloader `1.6.4`**。
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
 * **modloader 1.6.4 = 骨架（协议半边真、MC 半边全 TODO）**：本仓对该档**只有 tick 钩子一处出处**
 * （`ModLoader.setInGameHook(BaseMod, boolean, boolean)`，`modloader/1.6.4/knowledge/common/safe-api.md:29`）；
 * 客户端单例 / 玩家与位置字段 / 发聊天 / 截图 / 读方块**五项一项都没有来源**（无 1.6.4 映射、无上游文档、无工具覆盖，ModLoader 自 1.6.2 停更）。
 * 因此生成的类**能编译能加载**：HTTP 半边 + `setInGameHook` 注册是真的，MC 半边集中在一个 `Mc` 内部类里**逐条 `throw UnsupportedOperationException`**
 * 并点名「未核实」——**fail-closed**：`/status` 可用，`/execute` 一律返回带 `TODO(未核实)` 的 failure。宁可这样，也不拿 1.7.10 记忆填 1.6.4。
 */

/** 桥模板支持的目标（平台 × 版本）。forge 六档 + rift 1.13.2 + modloader 1.6.4。 */
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
  { platform: "rift", version: "1.13.2" },
  { platform: "modloader", version: "1.6.4" },
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
 * 逐版本出处（`data/forge_javadoc/<ver>/processed/**` 实页，as-of 2026-10-04 逐页读出）：
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
          "            net.minecraft.util.math.BlockPos pos = new net.minecraft.util.math.BlockPos(x, y, z);",
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
 * **能力天花板 = 命令级**：本桥发的是**聊天包**、不是键位输入 ⇒ 读数/观察/命令级操控可用（\`/tp\` \`/setblock\` …），
 * **玩家物理路径（走位/跳跃/挖掘耗时/碰撞）测不了**。要玩家级验证请上用 driver 的档。
 *
 * 逐版本差异（出处见仓库 \`forge/${version}/knowledge/common/verified-api.md\`）：
 *   tick/注解/\\@Mod 的包 = ${version === "1.7.10" ? "cpw.mods.fml.*" : "net.minecraftforge.fml.*"}；
 *   注册总线 = ${version === "1.7.10" ? "FMLCommonHandler.instance().bus()" : "MinecraftForge.EVENT_BUS"}；
 *   读方块 = ${version === "1.7.10" ? "World.getBlock(int,int,int)" : "World.getBlockState(BlockPos)"}。
 */
@Mod(modid = "${modId}_playtest_bridge")
public class BridgeMod {

    /** 端口与驱动侧 \`playtest_bridge\` 的默认值一致（只绑 127.0.0.1，桥无鉴权 ⇒ 别暴露到公网）。 */
    public static final int PORT = 38081;

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
            return "{\\"sent\\":\\"" + esc(cmd) + "\\"}";
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
        try {
            server = HttpServer.create(new InetSocketAddress("127.0.0.1", PORT), 0);
            server.createContext("/status", new Handler() {
                public void handle(HttpExchange ex) throws IOException {
                    // 形状与 BlackBoxPro 逐键一致：{status,version,platform,httpPort,actions,ready}
                    respond(ex, "{\\"status\\":\\"success\\",\\"version\\":\\"${version}\\",\\"platform\\":\\"forge\\","
                        + "\\"httpPort\\":" + PORT + ",\\"actions\\":" + ACTIONS + ",\\"ready\\":" + ready + "}");
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
            System.out.println("[PT-BRIDGE] listening on 127.0.0.1:" + PORT + " (mc ${version})");
        } catch (IOException e) {
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

## ⚠️ 能力天花板 = **命令级**（先读这条，别把它当 driver）

**这座桥**不是** driver。它有 10 个动作、发的是**聊天包**（不是键位输入），所以：

| 能做 | 做不到 |
|---|---|
| 读数：位置 / 朝向 / 落地 / 血量（\`query_player_state\`）、某坐标的方块（\`block_at\`） | **玩家物理路径**：走位、跳跃、挖掘耗时、碰撞、摔落——只有真按键才走得到，本桥测不了 |
| **命令级操控**：\`/tp\` \`/give\` \`/setblock\` \`/fill\` \`/summon\` \`/time\` …（走 \`chat_command\`）⇒ 位置、世界、物品**都能改**，玩家可见结果的验收做得到 | GUI **点击**（开背包能靠 \`/tp\`+\`query_screen\` 观察，但点按钮不行）；聊天历史在 **1.7.10 该档未实现**（见 await 矩阵） |
| 视觉：截图（\`screenshot\`，落 \`<gameDir>/screenshots/\`）；**背包/实体/界面读数**（\`query_inventory*\` / \`query_nearby_entities\` / \`query_screen\`） | 玩家物理路径（见左） |

⇒ 一句话：**「命令级操控 + 观察」通了，「玩家级操控」没通。** 生存模式下没有 op / 没开作弊时，\`chat_command\` 基本只能读、改不动世界——**能不能改世界取决于实例权限，不取决于本桥**。要做玩家物理级验证，只能在**有 driver 的档**上做（\`PLAYTEST_VERIFIED_TIER\`），老平台没有 driver（载体不允许）。

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
  \`[PT-BRIDGE] listening on 127.0.0.1:38081 (mc ${version})\`。

## 线协议（**逐键对齐** BlackBoxPro ⇒ \`playtest_bridge\` 工具面零改动）

\`\`\`
GET  /status   → {"status":"success","version":"${version}","platform":"forge","httpPort":38081,
                 "actions":["query_player_state","chat_command","screenshot","block_at","query_inventory_slot","query_inventory","query_nearby_entities","query_chat_history","use_item","query_screen"],"ready":<bool>}
POST /execute  body = {"id":"<uuid>","action":"<name>","params":{...},"delay":0}
               → {"id":"<同一个 id>","status":"success"|"failure","message":"...","data":{...}}   ← HTTP 恒 200
超时（客户端未在 tick / 未进世界）→ {"id":...,"status":"failure","message":"Timeout after 10000ms"}
\`\`\`

- \`ready\` = \`player != null && world != null\`（已进世界）；由 **tick 线程**每 tick 刷新，HTTP 线程只读 \`volatile\`。
- 成败**只看 body 的 \`status\`**，不要看 HTTP 码（恒 200）。
- 超时串逐字是 \`Timeout after 10000ms\` ⇒ 工具侧映射成 \`PLAYTEST_TIMEOUT\`，**别读成"没有失败"**。
- \`delay\` 参数**本模板忽略**（最小实现）；要延迟请在调用侧 sleep。

## 手动调（curl）

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

- **能力天花板 = 「命令级」**（见顶部那条）：10 个动作 + 发聊天包 ⇒ **做不了玩家物理路径**（走位 / 跳跃 / 挖掘耗时 / 碰撞）；\`/tp\` \`/setblock\` 这类**命令级**操控可用，但受实例权限（op / 是否开作弊）约束。
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
 * **能力天花板 = 命令级**：本桥发的是聊天包、不是键位输入 ⇒ 读数/观察/命令级操控可用，**玩家物理路径（走位/跳跃/挖掘耗时/碰撞）测不了**。
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

    /** 与驱动侧 \`playtest_bridge\` 默认端口一致（只绑 127.0.0.1；桥无鉴权 ⇒ 别暴露到公网）。 */
    public static final int PORT = 38081;

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
            mc.player.sendChatMessage(cmd.charAt(0) == '/' ? cmd : "/" + cmd);
            return "{\\"sent\\":\\"" + esc(cmd) + "\\"}";
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

## ⚠️ 能力天花板 = **命令级**（先读这条，别把它当 driver）

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
3. 装到**你自己**的 Rift 实例的 \`mods/\`，启动后日志应出现 \`[PT-BRIDGE] listening on 127.0.0.1:38081 (mc 1.13.2)\`。

## 线协议（**逐键对齐** BlackBoxPro ⇒ \`playtest_bridge\` 工具面零改动）

\`\`\`
GET  /status   → {"status":"success","version":"1.13.2","platform":"rift","httpPort":38081,
                 "actions":["query_player_state","chat_command","screenshot","block_at","query_inventory_slot","query_inventory","query_nearby_entities","query_chat_history","use_item","query_screen"],"ready":<bool>}
POST /execute  body = {"id":"<uuid>","action":"<name>","params":{...},"delay":0}
               → {"id":"<同一个 id>","status":"success"|"failure","message":"...","data":{...}}   ← HTTP 恒 200
超时 → {"id":...,"status":"failure","message":"Timeout after 10000ms"}
\`\`\`

## 手动调（curl）

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

- **能力天花板 = 命令级**（见上）；玩家物理路径测不了。
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
 * 本仓对该档只有 **tick 钩子**一处出处（\`ModLoader.setInGameHook(BaseMod, boolean, boolean)\`，
 * \`modloader/1.6.4/knowledge/common/safe-api.md:29\`）。桥的其余出处（客户端单例 / 玩家与位置字段 / 发聊天 / 截图 / 读方块 / 背包 / 实体列表 / 右键入口 / 当前界面）
 * **在本仓没有任何来源** —— 该档无映射、无上游文档（Risugami 自 1.6.2（2013）停更）、工具链也不覆盖 1.6.4。
 * ⇒ 生成的类**能编译、能加载**：HTTP 半边 + \`setInGameHook\` 注册是真的，MC 半边集中在内部类 \`Mc\` 里**逐条 throw**并点名「未核实」。
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
 * **MC 半边全是 TODO(未核实)**：1.6.4 的「客户端单例 / 玩家与位置字段 / 发聊天 / 截图 / 读方块」在本仓**没有任何来源** ——
 * 该档无映射（\`data/modloader_1.6.4/\` 只有 house 自撰的 safe-api.md）、无上游文档（Risugami 自 MC 1.6.2（2013）停更）、
 * 工具链也不覆盖 1.6.4。⇒ 这些名字集中在内部类 \`Mc\`，**逐条 throw**，绝不按 1.7.10 / Fabric 记忆猜。
 * 要真用起来：在**你自己的 MCP 1.6.4 工作区**里核出真名 → 打开 README.bridge.md 的清单逐条替换。
 *
 * 撤除纪律与其它档相同：**测完即删**（本类 + jar + 实例 \`mods/\` 里的副本）。
 */
public class ${cls} extends BaseMod {

    public static final int PORT = 38081;

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
     * ⚠️ TODO(未核实)：**方法名与签名**都要核。safe-api.md 只给了 \`setInGameHook\` 这一行，
     * **没有给回调方法名** —— 若 ModLoader 用反射调的不是 \`onTick()\`，这个桥永远不会 tick（届时预算耗尽判红，不会假绿）。
     * 核出真名后把这个方法改名/改签名即可，方法体不用动。
     */
    public void onTick() {
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
    }

    /**
     * ⚠️ **本档 MC 侧的全部访问都收在这里** —— 每一条都是 \`TODO(未核实)\`。
     * 替换时**只改这个内部类**，外面的 HTTP/协议代码一行都不用动。
     */
    static final class Mc {

        private static String todo(String what) {
            return "TODO(未核实)：ModLoader 1.6.4 的「" + what + "」在本仓无出处"
                 + "（modloader/1.6.4/knowledge/common/safe-api.md 只核到 tick 钩子一行；该档无映射、无上游文档、工具链不覆盖）"
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

> ⚠️ **先说清楚：这份产物现在不是一座能用的桥。** 它的**协议半边是真的**（HTTP + \`setInGameHook\` 注册），
> 但 **10 个动作的 MC 侧取值全都是 \`TODO(未核实)\`** —— \`/status\` 能通，\`/execute\` 一律返回带 \`TODO(未核实)\` 的 failure。
> 动作清单 = \`query_player_state\` / \`chat_command\` / \`screenshot\` / \`block_at\` / \`query_inventory_slot\` / \`query_inventory\` /
> \`query_nearby_entities\` / \`query_chat_history\` / \`use_item\` / \`query_screen\`（全部走内部类 \`Mc\` 的 \`throw\`）。
> 这不是偷懒：本仓对 1.6.4 **只有 tick 钩子一处出处**，其余名称**一个来源都没有**，按纪律**不许猜**。

## 本仓对该档的完整出处盘点（as-of 2026-10-04）

| 桥需要什么 | 本档状态 | 出处 |
|---|---|---|
| tick 钩子 | ✅ \`ModLoader.setInGameHook(BaseMod, boolean, boolean)\` | \`modloader/1.6.4/knowledge/common/safe-api.md:29\`（+ \`setInGUIHook\` :30） |
| 回调方法名/签名 | ❌ 未核（表里没有） | — |
| 客户端单例 | ❌ 无来源 | — |
| 玩家对象 / 位置字段 | ❌ 无来源 | — |
| 发聊天 / 发命令 | ❌ 无来源 | — |
| 截图 API | ❌ 无来源 | — |
| 读方块签名 | ❌ 无来源（表里只有 \`World.getBlockId\` 这个名字，**签名与参数形未核**；且 ModLoader 时代 \`Block\` 无 \`getRegistryName\`） | — |
| 映射数据 | ❌ \`data/modloader_1.6.4/\` 只有 \`modloader-docs\`（即 house 自撰的 safe-api.md），**无 mappings** | — |
| 上游文档 | ❌ Risugami 自 **MC 1.6.2（2013）** 停更，官方无稳定落点 | safe-api.md:5 |
| 工具链覆盖 | ❌ \`get_minecraft_source\` 只覆盖 1.14–1.21.11 与 26.1+；\`convert_mapping\` 不覆盖 1.6.4 | — |

## 怎么把它变成真桥（**在你自己有 MCP 1.6.4 工作区的前提下**）

1. 在你的 MCP 1.6.4 工作区里核出这 5（+1）个名字：
   - ModLoader in-game hook 的**回调方法名与签名**；
   - 取客户端单例的式（ModLoader 时代通常是 \`net.minecraft.src.Minecraft\` 的某个静态访问式——**具体写法必须核**）；
   - 世界 / 玩家对象字段名，以及位置（3 个 double）、朝向、落地、血量（\`getHealth()\` 之类）的取法；
   - 发聊天 / 发命令的方法（1.6.4 的实际名字与 1.7.10 的 \`sendChatMessage\` **不保证一致**）；
   - 截图 API（1.6.4 的截图路径与 1.7.10 **不是同一个**）；
   - 按坐标读方块的签名（\`World.getBlockId(int,int,int)\` 还是别的；参数形要核）。
2. 把结果填进 \`${cls}.Mc\` 内部类（**只改那一个内部类**），把 \`onTick()\` 改成真实的回调签名。
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
5. 启动后日志应出现 \`[PT-BRIDGE] listening on 127.0.0.1:38081 (mc 1.6.4)\` —— 出现即证明**协议半边是活的**。

## 线协议（与其它档逐键一致）

\`\`\`
GET  /status   → {"status":"success","version":"1.6.4","platform":"modloader","httpPort":38081,
                 "actions":["query_player_state","chat_command","screenshot","block_at","query_inventory_slot","query_inventory","query_nearby_entities","query_chat_history","use_item","query_screen"],"ready":<bool>}
POST /execute  → {"id":...,"status":"success"|"failure","message":"...","data":{...}}   ← HTTP 恒 200
超时 → {"id":...,"status":"failure","message":"Timeout after 10000ms"}
\`\`\`

## 边界（写清不吹）

- **本产物 = 骨架**：\`/execute\` 十个动作全部 fail-closed（返回 \`TODO(未核实)\` 的 failure），**不是假绿**。
- **能力天花板即便填完也是命令级**：桥发聊天包、不是键位输入 ⇒ 玩家物理路径测不了。
- ModLoader 1.6.4 是**手动构建 + 手动安装**时代；**本仓不代跑编译、不代装 jar**（人在环）。
- 若你不想补这些出处（10 个动作 + \`isInWorld\`）：更划算的替代是**离线解析存档（region/NBT）+ 人工驱动**（见 \`modloader/1.6.4/knowledge/common/safe-api.md\` 的结论段）。
`;
}

// ───────────────────────── 共享 HTTP 半边（三个平台逐字节一致） ─────────────────────────

/** 生成 HTTP 侧（\`/status\` + \`/execute\` + Handler/Task/JSON 工具），\`platform\`/\`version\` 只影响前端声明。 */
function bridgeHttpCore(platform: string, version: string): string {
  return `    // ───────────────────────── HTTP 侧（只入队 + 等结果） ─────────────────────────

    private static void startServer() {
        try {
            server = HttpServer.create(new InetSocketAddress("127.0.0.1", PORT), 0);
            server.createContext("/status", new Handler() {
                public void handle(HttpExchange ex) throws IOException {
                    respond(ex, "{\\"status\\":\\"success\\",\\"version\\":\\"${version}\\",\\"platform\\":\\"${platform}\\","
                        + "\\"httpPort\\":" + PORT + ",\\"actions\\":" + ACTIONS + ",\\"ready\\":" + ready + "}");
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
                        // 超时串与 BlackBoxPro 逐字一致（"Timeout after <N>ms"）⇒ 调用侧照常映射成 PLAYTEST_TIMEOUT，**不是"空结果"**。
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
            System.out.println("[PT-BRIDGE] listening on 127.0.0.1:" + PORT + " (mc ${version})");
        } catch (IOException e) {
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
  throw new Error(`generateBridgeMod: 未支持的桥目标 ${platform} ${version}（见 BRIDGE_MOD_TARGETS）`);
}
