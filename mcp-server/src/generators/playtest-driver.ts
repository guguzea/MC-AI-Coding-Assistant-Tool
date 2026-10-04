/**
 * generate_playtest_driver —— 游玩自测骨架生成（只吐文本；默认 driverMode=external_bridge）。
 *
 * 口径单源：`community_knowledge/authored/ingame-playtest-automation.md`。
 * 桥契约（源码级 as-of 2026-09-29）：
 *   POST /execute  CommandMessage{id,action,params,delay,target?} → ResponseMessage{id,status,message,data}（HTTP 恒 200）
 *   GET  /status   {status,version,platform,httpPort,actions,ready}；ready = player!=null && world!=null
 *   超时：服务端 responseTimeoutMs 默认 10000ms ⇒ status:"failure" + "Timeout after Nms"（无专用码 ⇒ 调用侧映射 PLAYTEST_TIMEOUT）
 * 诚实边界：
 *   - `temporary_client_tick_driver` / `in_jvm_player_agent` 的**真代码覆盖 = `PLAYTEST_VERIFIED_TIER` 列出的档**
 *     （唯一真源，只随逐档 javap 取证扩面；**别在正文/注释里数档位**——数组才是权威）；
 *   - 表外平台/版本该模式仍为结构壳（`// TODO(未核实)`，须先按该档取证）；
 *   - `in_jvm_player_agent` 在已验证档上是**真执行器**（intent / waitintent 步骤族：菜单校验 → 复用原语展开 →
 *     类型化后置条件 → 证据；菜单真源 = PLAYTEST_INTENTS）；表外档只发 `playtest/intent-menu.json` 契约 + 结构壳。
 *   - ⚠ opt-in 门（用户裁定 4B）：该模式**默认不在任何自动化链里跑** —— 真机验收由 `MC_SKILL_PLAYTEST_INTENT_E2E=1` 显式开
 *     （见 mcp-server/scripts/assert-playtest-intent-gate.mjs）；不设该变量时一切按"未验证档"处理，不静默通过。
 */
import { eraUpperBoundError, exactMcVersion, toPascalCase, type GeneratorResult } from "./common.js";

export const PLAYTEST_DRIVER_MODES = ["external_bridge", "in_jvm_player_agent", "temporary_client_tick_driver"] as const;
export const PLAYTEST_CAPABILITY_PROFILES = ["strict_survival", "operator", "creative"] as const;
export const PLAYTEST_POSTCONDITIONS = ["block_state", "entity_count", "inventory_contains", "marker_log", "screen_present"] as const;
export const PLAYTEST_PLATFORMS = ["forge", "neoforge", "fabric", "quilt"] as const;

export type PlaytestDriverMode = (typeof PLAYTEST_DRIVER_MODES)[number];
export type PlaytestCapabilityProfile = (typeof PLAYTEST_CAPABILITY_PROFILES)[number];
export type PlaytestPostcondition = (typeof PLAYTEST_POSTCONDITIONS)[number];

export interface PlaytestDriverInput {
  platform: string;
  version: string;
  modId?: string;
  driverMode?: PlaytestDriverMode;
  capabilityProfile?: PlaytestCapabilityProfile;
  goal?: string;
  postconditions?: PlaytestPostcondition[];
  useGameTestSourceSet?: boolean;
  evidenceDir?: string;
  /** 后置条件 inventory_contains 的期望物品 id（如 `examplemod:playtest_token`）。仅 driver 模式使用。 */
  expectItem?: string;
  /** 自动进世界：本地存档目录名（如 `playtest_demo`）。仅 driver 模式使用；缺省则不进世界（由人或桥进入）。 */
  enterWorld?: string;
  /** 内置剧本：`smoke`（移动/破坏/GUI/背包 冒烟，默认）或 `village`（找村庄：定位→飞过去→扫描→断言→截图）。 */
  scenario?: "smoke" | "village";
  /** 自定义动作序列（DSL，每行一步）。给了就以它为准（覆盖 scenario）。语法见 plan.json / README。 */
  plan?: string[];
  /** 硬预算（tick，20/s）。缺省：smoke=3600、village=24000。 */
  budgetTicks?: number;
  /** 长驻 + 热重载（默认 true）：游戏只起一次，改 `<evidenceDir>/plan.txt` 即在同一进程内开新一轮。 */
  watchPlan?: boolean;
  /** 期望槽位（0–40；缺省 0 = 热键栏第一格）。 */
  expectSlot?: number;
}

/** 平台档：把"平台相关的调用/类型/导入"集中成一张表（签名 javap 实测；见 CHANGELOG 第三十三/三十四批）。 */
interface PlatformProfile {
  MC: string; // 客户端主类
  Player: string; // 本地玩家类
  imports: string;
  registerImpl: string; // register() 里的挂接
  bridges: string; // tick / chat 桥（fabric 直接方法引用；forge 需 @SubscribeEvent 实例方法）
  entitiesIter: string; // 遍历可见实体
  entityId: string; // 实体 id 字符串
  blockId: string; // 方块 id 字符串
  itemId: string; // 物品 id 字符串
  invGet: string; // 读背包某槽
  pressSet: (key: string, down: boolean) => string; // 按键设置
  screenshot: string; // 截图
  command: string; // 发命令
  autoEnter: string; // 自动进世界
  abilities: string; // 刷新飞行能力
  yawGet: string;
  yawSet: string;
  pitchGet: string;
  pitchSet: string;
  screenExpr: string; // 当前屏幕
  screenSetNull: string;
  screenOpenInv: string;
  screenClick: string;
  screenClose: string;
  textGet: string; // Text/Component → String
  nameGet: string;
  runDir: string;
  isOnGround: string;
  /** 逻辑键名 → 该平台的 Options 字段名（fabric: forwardKey… / forge: keyUp…）。 */
  forgeKey: Record<string, string>;
}

/**
 * 平台档证据表（签名逐条 javap 实测，2026-09-29）：
 *   fabric 1.21.11（yarn 1.21.11+build.6 命名 jar）／forge 1.20.1（forge-1.20.1-47.4.0_mapped_official 映射件）。
 * NeoForge 1.20.1 沿用 `net.minecraftforge` 包名（`net.neoforged` 自 1.20.2 起）⇒ 按 forge 档覆盖（本仓口径：1.20.1 回退 Forge 文档/兼容层）。
 * 状态：档表已就位；**调用点改写接线**（把模板里的 fabric 调用机械改写为档表条目）见下一切片。
 */
export function platformProfile(platform: string): PlatformProfile {
  const forge = platform === "forge" || platform === "neoforge";
  if (forge) {
    return {
      MC: "net.minecraft.client.Minecraft",
      Player: "net.minecraft.client.player.LocalPlayer",
      imports: `import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Locale;

import net.minecraft.client.Minecraft;
import net.minecraft.client.Screenshot;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.client.gui.screens.inventory.InventoryScreen;
import net.minecraft.client.player.LocalPlayer;
import net.minecraft.core.BlockPos;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.network.chat.Component;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraftforge.client.event.ClientChatReceivedEvent;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.event.TickEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;`,
      registerImpl: `        INSTANCE = new PlaytestQaDriver();
        MinecraftForge.EVENT_BUS.register(INSTANCE);
        registered = true;
        log("[QA] driver registered（解释器引擎 / forge 事件总线）PLAN=" + PLAN.length + " 步");`,
      bridges: `    private static PlaytestQaDriver INSTANCE;

    @SubscribeEvent
    public void onClientTick(TickEvent.ClientTickEvent event) {
        if (event.phase != TickEvent.Phase.END) {
            return;
        }
        onInterpTick(Minecraft.getInstance());
    }

    @SubscribeEvent
    public void onChat(ClientChatReceivedEvent event) {
        lastGameMessage = event.getMessage().getString();
    }
`,
      entitiesIter: "client.level.entitiesForRendering()",
      entityId: "BuiltInRegistries.ENTITY_TYPE.getKey(e.getType()).toString()",
      blockId: "BuiltInRegistries.BLOCK.getKey(st.getBlock()).toString()",
      itemId: "BuiltInRegistries.ITEM.getKey(stack.getItem()).toString()",
      invGet: "player.getInventory().getItem(slot)",
      pressSet: (key, down) => `client.options.${key}.setDown(${down})`,
      screenshot: "Screenshot.grab(client.gameDirectory, client.getMainRenderTarget(), c -> { })",
      command: "client.getConnection().sendCommand(command.startsWith(\"/\") ? command.substring(1) : command)",
      autoEnter: "client.createWorldOpenFlows().loadLevel(null, WORLD)",
      abilities: "player.onUpdateAbilities()",
      yawGet: "player.getYRot()",
      yawSet: "player.setYRot((float) ",
      pitchGet: "player.getXRot()",
      pitchSet: "player.setXRot((float) ",
      screenExpr: "client.screen",
      screenSetNull: "client.setScreen(null)",
      screenOpenInv: "client.setScreen(new InventoryScreen(player))",
      screenClick: "client.screen.mouseClicked(client.getWindow().getGuiScaledWidth() / 2.0, client.getWindow().getGuiScaledHeight() / 2.0, 0)",
      screenClose: "client.screen.onClose()",
      textGet: ".getString()",
      nameGet: "player.getName().getString()",
      runDir: "client.gameDirectory",
      isOnGround: "player.onGround()",
      forgeKey: { forward: "keyUp", back: "keyDown", left: "keyLeft", right: "keyRight", jump: "keyJump", sneak: "keyShift", sprint: "keySprint", attack: "keyAttack", use: "keyUse", inventory: "keyInventory" },
    };
  }
  return {
    MC: "MinecraftClient",
    Player: "ClientPlayerEntity",
    imports: `import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.fabricmc.fabric.api.client.message.v1.ClientReceiveMessageEvents;
import net.minecraft.block.BlockState;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.gui.Click;
import net.minecraft.client.gui.screen.ingame.InventoryScreen;
import net.minecraft.client.input.MouseInput;
import net.minecraft.client.network.ClientPlayerEntity;
import net.minecraft.client.util.ScreenshotRecorder;
import net.minecraft.item.ItemStack;
import net.minecraft.registry.Registries;
import net.minecraft.util.math.BlockPos;`,
    registerImpl: `        if (USE_INTERPRETER) {
            ClientTickEvents.END_CLIENT_TICK.register(PlaytestQaDriver::onInterpTick);
            ClientReceiveMessageEvents.GAME.register((message, overlay) -> lastGameMessage = message.getString());
            registered = true;
            log("[QA] driver registered（解释器引擎）PLAN=" + PLAN.length + " 步");
            return;
        }
        ClientTickEvents.END_CLIENT_TICK.register(PlaytestQaDriver::onEndTick);
        registered = true;
        log("[QA] driver registered expect=" + EXPECT_ITEM + " slot=" + EXPECT_SLOT);`,
    bridges: "",
    entitiesIter: "client.world.getEntities()",
    entityId: "Registries.ENTITY_TYPE.getId(e.getType()).toString()",
    blockId: "Registries.BLOCK.getId(st.getBlock()).toString()",
    itemId: "Registries.ITEM.getId(stack.getItem()).toString()",
    invGet: "player.getInventory().getStack(slot)",
    pressSet: (key, down) => `client.options.${key}.setPressed(${down})`,
    screenshot: "ScreenshotRecorder.saveScreenshot(client.runDirectory, client.getFramebuffer(), t -> { })",
    command: "client.getNetworkHandler().sendChatCommand(command.startsWith(\"/\") ? command.substring(1) : command)",
    autoEnter: "client.createIntegratedServerLoader().start(WORLD, () -> log(\"[QA] open world cancelled\"))",
    abilities: "player.sendAbilitiesUpdate()",
    yawGet: "player.getYaw()",
    yawSet: "player.setYaw((float) ",
    pitchGet: "player.getPitch()",
    pitchSet: "player.setPitch((float) ",
    screenExpr: "client.currentScreen",
    screenSetNull: "client.setScreen(null)",
    screenOpenInv: "client.setScreen(new InventoryScreen(player))",
    screenClick: "client.currentScreen.mouseClicked(new Click(client.getWindow().getScaledWidth() / 2.0, client.getWindow().getScaledHeight() / 2.0, new MouseInput(0, 0)), false)",
    screenClose: "client.currentScreen.close()",
    textGet: ".getString()",
    nameGet: "player.getName().getString()",
    runDir: "client.runDirectory",
    isOnGround: "player.isOnGround()",
    forgeKey: { forward: "forwardKey", back: "backKey", left: "leftKey", right: "rightKey", jump: "jumpKey", sneak: "sneakKey", sprint: "sprintKey", attack: "attackKey", use: "useKey", inventory: "inventoryKey" },
  };
}

/**
 * fabric 1.20.1 档改写表：与 1.21.11 的差异**只有 GUI 点击一处**（javap 实测 2026-09-29，yarn 1.20.1+build.10）：
 *   1.20.1 没有 `net.minecraft.client.gui.Click` / `net.minecraft.client.input.MouseInput`；
 *   `Screen.mouseClicked` 是老的 `(double,double,int)` 形态（继承自 Element/GuiEventListener）。
 * 其余面同 1.21.11：`Screen.close()`、`PlayerInventory.getStack`、`ScreenshotRecorder.saveScreenshot`、
 * `createIntegratedServerLoader`（自动进世界）、`KeyBinding.setPressed`、`Window.getScaledWidth/Height`、
 * `PlayerEntity.sendAbilitiesUpdate`、`ClientWorld.getEntities`、`Registries.*`、`Entity.setPitch/setYaw` 全部一致。
 * （`Screen.keyPressed(int,int,int)` 与 `PlayerInventory.selectedSlot` 是公开字段这两个差异本驱动用不到。）
 */
export function rewriteForFabric1201(java: string): string {
  let s = java;
  // 自动进世界：1.20.1 是 `IntegratedServerLoader.start(Screen parent, String levelName)`；
  // 1.21.11 是 `start(String levelName, Runnable onCancel)`（javap 实测两档）。
  s = s.replaceAll(
    'client.createIntegratedServerLoader().start(WORLD, () -> log("[QA] open world cancelled"))',
    "client.createIntegratedServerLoader().start(null, WORLD)",
  );
  s = s.replaceAll(".mouseClicked(new Click(", ".mouseClicked(");
  s = s.replaceAll("new Click(", "");
  s = s.replaceAll(", new MouseInput(0, 0)), false)", ", 0)");
  s = s.replaceAll("import net.minecraft.client.gui.Click;\n", "");
  s = s.replaceAll("import net.minecraft.client.input.MouseInput;\n", "");
  return s;
}

/**
 * javadoc 安全化（实测 2026-09-29）：块注释里的泛型尖括号（如 `Event<EndTick>` / `Consumer<Text>`）会让
 * **`javadoc` 任务**报 `错误: 未知标记` 并使 `gradlew build` 失败（fabric 脚手架会打 `-javadoc.jar`；
 * forge 脚手架不打所以没暴露）。⇒ 只对 `/** … *\/` 块内的 `<` / `>` 转义为 `&lt;` / `&gt;`，代码本体不动。
 */
export function javadocSafe(java: string): string {
  let inBlock = false;
  return java
    .split("\n")
    .map((line) => {
      if (!inBlock && line.includes("/**")) {
        inBlock = true;
      }
      const out = inBlock ? line.replaceAll("<", "&lt;").replaceAll(">", "&gt;") : line;
      if (inBlock && line.includes("*/")) {
        inBlock = false;
      }
      return out;
    })
    .join("\n");
}

/**
 * fabric 1.21.1 / 1.21.3 / 1.20.4 三档改写表（三档 javap 实测同形）：与 1.21.11 只差**两处**：
 *   ① GUI 点击：该档没有 `net.minecraft.client.gui.Click` / `net.minecraft.client.input.MouseInput`
 *      （这三档 javap 实测都没有；**不是**「1.21.2 引入」——1.21.3 也还是没有），
 *      `Element.mouseClicked` 是老的 `(double,double,int)`；`Screen` 侧有 `close()`。
 *   ② 自动进世界必须排队执行（见函数体内注释；1.20.4 jstack 定因）。
 * ⚠ 与 1.20.1 档的差别：1.21.1 的 `IntegratedServerLoader.start(String, Runnable)` **与 1.21.11 同形**
 *   ⇒ **不要**套用 `rewriteForFabric1201` 里的 `start(Screen, String)` 那段（那是 1.20.1 专属）。
 * 其余实测与 1.21.11 一致：ScreenshotRecorder.saveScreenshot(File,Framebuffer,Consumer<Text>) /
 *   PlayerInventory.getStack(int)（`selectedSlot` 是公开字段，本驱动不用）/ KeyBinding.setPressed /
 *   Window.getScaledWidth·getScaledHeight / PlayerEntity.getInventory·sendAbilitiesUpdate /
 *   ClientWorld.getEntities() / Registry.getId(T) / Entity.setPitch·setYaw·isOnGround·getBlockPos /
 *   InventoryScreen(PlayerEntity)。
 */
export function rewriteForFabric1211(java: string): string {
  let s = java;
  s = s.replaceAll(".mouseClicked(new Click(", ".mouseClicked(");
  s = s.replaceAll("new Click(", "");
  s = s.replaceAll(", new MouseInput(0, 0)), false)", ", 0)");
  s = s.replaceAll("import net.minecraft.client.gui.Click;\n", "");
  s = s.replaceAll("import net.minecraft.client.input.MouseInput;\n", "");
  return s;
}

/**
 * **运行期 JVM = Java 8 的档**（MC 1.16.5 及以下只支持 Java 8）。这几个档的驱动必须守 Java 8 库面：
 * 基线模板用了两个 **Java 11** 才有的 `java.nio.file` 方法，而 `-source 8` **拦不住**它们
 * （用 JDK 17 编译能过、运行到 Java 8 上才 `NoSuchMethodError`）⇒ 见 `applyJava8LibSwaps`。
 */
export const JAVA8_RUNTIME_VERSIONS: readonly string[] = ["1.12.2", "1.13.2", "1.14.4", "1.15.2", "1.16.5"];

/**
 * Java 8 运行期库面收敛（2026-10-03，`fabric 1.14.4` 补档时发现并**回溯修 1.16.5 及 forge 四档**）：
 * 基线模板（fabric 1.21.11）用了两个 Java 11 的库 API，而 `-source 8` **不会**报错：
 *   - `Path.of(...)`（Java 11）⇒ `Paths.get(...)`（Java 7，`Paths.get(String,String...)`，实参全是 String，逐个 javap 核过）
 *   - `Files.writeString(Path, CharSequence, Charset)`（Java 11）⇒ `Files.write(Path, byte[])`（Java 7）+ `getBytes(StandardCharsets.UTF_8)`
 * 判据：**用 JDK 8 的 javac 编译**（`-source 8` 之外还要真库面 ⇒ 只有 JDK 8 的 rt.jar 能拦住）。
 * `Files.writeString` 的实参里含括号/逗号（如 `Path.of(A, B)`、`(ok ? "0" : "1") + nl()`、**字符串字面量里的逗号**
 * 如 `",\"intents\":"`）⇒ 不能用正则切参：用一层**跳过字符串字面量**的配对括号扫描，按顶层逗号切；
 * 之后按 `StandardCharsets.X` 那一参定位（它后面可能还有 `StandardOpenOption.CREATE/APPEND`，共 6 处实测 3–5 参）。
 */
export function applyJava8LibSwaps(s: string): string {
  let out = s.replaceAll("Path.of(", "Paths.get(");
  if (out.includes("Paths.get(") && !out.includes("import java.nio.file.Paths;")) {
    out = out.replace("import java.nio.file.Path;", "import java.nio.file.Path;\nimport java.nio.file.Paths;");
  }
  const needle = "Files.writeString(";
  let idx = 0;
  while (true) {
    const at = out.indexOf(needle, idx);
    if (at < 0) {
      break;
    }
    let depth = 0;
    let i = at + needle.length;
    let argStart = i;
    const args: string[] = [];
    let inStr: string | null = null;
    for (; i < out.length; i++) {
      const ch = out[i];
      if (inStr !== null) {
        if (ch === "\\") {
          i++;
        } else if (ch === inStr) {
          inStr = null;
        }
        continue;
      }
      if (ch === '"' || ch === "'") {
        inStr = ch;
      } else if (ch === "(") {
        depth++;
      } else if (ch === ")") {
        if (depth === 0) {
          break;
        }
        depth--;
      } else if (ch === "," && depth === 0) {
        args.push(out.slice(argStart, i));
        argStart = i + 1;
      }
    }
    args.push(out.slice(argStart, i));
    const encIdx = args.findIndex((a) => /^StandardCharsets\.\w+$/.test(a.trim()));
    if (encIdx < 1) {
      // 形状不符（不该发生）⇒ 不猜，原样留下交给编译报错
      idx = at + needle.length;
      continue;
    }
    const target = args[0].trim();
    const body = args.slice(1, encIdx).join(",").trim();
    const enc = args[encIdx].trim();
    const opts = args
      .slice(encIdx + 1)
      .map((a) => a.trim())
      .filter(Boolean);
    const repl = `Files.write(${target}, (${body}).getBytes(${enc})${opts.length ? ", " + opts.join(", ") : ""})`;
    out = out.slice(0, at) + repl + out.slice(i + 1);
    idx = at + repl.length;
  }
  return out;
}

/**
 * fabric/quilt **1.14.4 / 1.16.5 / 1.17.1 / 1.18.2** 档改写表（Yarn 层，逐条 javap 实测 2026-10-03，jar 取自
 * `~/.gradle/caches/fabric-loom/<v>/<yarn>/minecraft-mapped.jar`（1.14.4/1.16.5/1.17.1）与
 * `minecraft-merged-named.jar`（1.18.2）—— 均为本机缓存，免下载；1.14.4 的 named jar 由
 * `fabric/1.14.4/scaffold` 的 Gradle 构建重新落盘（`minecraft-1.14.4-mapped-net.fabricmc.yarn-1.14.4+build.18-v2.jar`））。
 *
 * 与 1.21.11 模板的差异（按档递增）：
 *  - 四档共同：① GUI 点击 = `Element.mouseClicked(double,double,int)`（**无** `Click`/`MouseInput`，与 1.21.1/1.21.8 行同形）；
 *    ② 注册表 = `net.minecraft.util.registry.Registry`（**无** `net.minecraft.registry.Registries` 持有类）⇒ import 换 + `Registries.X.` → `Registry.X.`；
 *    ③ 自动进世界**没有** `IntegratedServerLoader`（1.19.4 才有）⇒ `MinecraftClient.startIntegratedServer(...)`；
 *    ④ 命令发送**无** `ClientPlayNetworkHandler.sendChatCommand`（1.19.4 才有）⇒ `ClientPlayerEntity.sendChatMessage(String)`（四档 javap 均实测该法）。
 *  - 1.17.1 / 1.16.5 / 1.14.4 另：`GameOptions` 键名是 `keyForward/keyJump/keyAttack/keySprint/keyBack/keyLeft/keyRight/keySneak/keyUse`
 *    （1.18.2 起才改名 `forwardKey…`，javap 实测）；`Screen` **无** `close()`（1.18.2 才有）⇒ 关屏走 `client.setScreen(null)`。
 *  - 1.16.5 / 1.14.4 另：截图类 = `ScreenshotUtils`（比 1.17+ 的 `ScreenshotRecorder.saveScreenshot(File,Framebuffer,Consumer)`
 *    **多 width/height 两参**，javap 实测）；`MinecraftClient` **无** `setScreen`（改用 `openScreen`）；`Entity` 的 yaw/pitch 是**公开字段**
 *    （**无** `setPitch/getYaw()`，javap 实测）⇒ 赋值/直读；背包/能力是**公开字段** `inventory`/`abilities`。
 *  - 1.14.4 另（2026-10-03 补档，逐条 javap 实测）：
 *    ① 截图方法名**仍是混淆形** `ScreenshotUtils.method_1659(File,int,int,Framebuffer,Consumer)`（1.16 才改名 `saveScreenshot`）；
 *    ② `MinecraftClient` **无** `getWindow()`（`public final Window window` **字段**）；
 *    ③ `Entity` 的 `x/y/z` 是**公开字段**（**无** `getX()/getY()/getZ()`，1.15 才有）+ **无** `isOnGround()`（公开字段 `onGround`）；
 *    ④ `PlayerEntity` **无** `getInventory()`（公开字段 `inventory`）+ `PlayerInventory.getInvStack(int)`（**不是** `getStack`）；
 *    ⑤ 自动进世界是 `startIntegratedServer(String,String,LevelInfo)`（**三参**；`LevelInfo(long,GameMode,boolean,boolean,LevelGeneratorType)`）；
 *    ⑥ `KeyBinding` **无** `setPressed`（`pressed` 是私有字段）⇒ 静态 `KeyBinding.setKeyPressed(InputUtil$KeyCode,boolean)`；
 *    ⑦ `Vec3i`/`BlockPos` **无** `toShortString()`（1.15.2 才有）⇒ `toString()`；
 *    ⑧ Fabric API 0.28.5+1.14 **没有**客户端消息事件（`fabric-message-api-v1` 不存在）⇒ 摘掉聊天注册行，
 *       `goto parsed` 走 `readLastChatLine`（`<runDir>/logs/latest.log` 的 `[CHAT]` 行）兜底；
 *    ⑨ 运行期 JVM = Java 8 ⇒ 过 `applyJava8LibSwaps`（`Path.of`/`Files.writeString` → Java 7 形）。
 */
export function rewriteForFabricLegacy(java: string, version: string): string {
  let s = java;
  // Java 8 运行期档：先收敛库面（1.14.4 / 1.16.5）
  if (JAVA8_RUNTIME_VERSIONS.includes(version)) {
    s = applyJava8LibSwaps(s);
  }
  // ① GUI 点击（三档同形）
  s = s.replaceAll(".mouseClicked(new Click(", ".mouseClicked(");
  s = s.replaceAll("new Click(", "");
  s = s.replaceAll(", new MouseInput(0, 0)), false)", ", 0)");
  s = s.replaceAll("import net.minecraft.client.gui.Click;\n", "");
  s = s.replaceAll("import net.minecraft.client.input.MouseInput;\n", "");
  // ② 注册表旧包
  s = s.replaceAll("import net.minecraft.registry.Registries;", "import net.minecraft.util.registry.Registry;");
  s = s.replaceAll("Registries.ENTITY_TYPE.getId(", "Registry.ENTITY_TYPE.getId(");
  s = s.replaceAll("Registries.BLOCK.getId(", "Registry.BLOCK.getId(");
  s = s.replaceAll("Registries.ITEM.getId(", "Registry.ITEM.getId(");
  // ③ 自动进世界：1.19.4 以下无 IntegratedServerLoader
  s = s.replaceAll(
    'client.createIntegratedServerLoader().start(WORLD, () -> log("[QA] open world cancelled"))',
    "client.startIntegratedServer(WORLD)",
  );
  // ④ 命令/聊天发送：1.19.4 以下无 sendChatCommand；`sendChatMessage` 靠**前导 `/`** 区分命令 ⇒ 整句换（不能沿用模板的去斜杠写法）
  s = s.replaceAll(
    'client.getNetworkHandler().sendChatCommand(command.startsWith("/") ? command.substring(1) : command)',
    'client.player.sendChatMessage(command.startsWith("/") ? command : "/" + command)',
  );
  s = s.replaceAll("client.getNetworkHandler().sendChatCommand(", "client.player.sendChatMessage(");
  // ⑤ **本族（1.14.4–1.18.2）没有客户端消息事件**：`ClientReceiveMessageEvents` 属 `fabric-message-api-v1`，
  //    该模块在本仓这几档钉的 Fabric API 里**都不存在**（实测 2026-10-03：`fabric-api:0.28.5+1.14` / `0.42.0+1.16` /
  //    `0.46.1+1.17` / `0.77.0+1.18.2` 的 POM 依赖表里都没有 message 模块；最早带它的是 `0.87.2+1.19.4`；
  //    且 1.14.4 / 1.16.5 的 **loom remapped_mods 真实模块 jar** 里 0 个 `*ReceiveMessage*` 类）⇒ 留着就是**编译不过**。
  //    摘掉注册行，`goto parsed` 走 `readLastChatLine`（`<runDir>/logs/latest.log` 的 `[CHAT]` 行）兜底。
  s = s.replaceAll("import net.fabricmc.fabric.api.client.message.v1.ClientReceiveMessageEvents;\n", "");
  s = s.replaceAll(
    "            ClientReceiveMessageEvents.GAME.register((message, overlay) -> lastGameMessage = message.getString());\n",
    `            // 本档 Fabric API 无客户端消息事件（fabric-message-api-v1 不在依赖里）⇒ lastGameMessage 恒空，goto parsed 靠 latest.log 兜底\n`,
  );
  if (version === "1.17.1" || version === "1.16.5" || version === "1.14.4") {
    s = s.replaceAll(/client\.options\.forwardKey\.setPressed\(/g, "client.options.keyForward.setPressed(");
    s = s.replaceAll(/client\.options\.jumpKey\.setPressed\(/g, "client.options.keyJump.setPressed(");
    s = s.replaceAll(/client\.options\.attackKey\.setPressed\(/g, "client.options.keyAttack.setPressed(");
    s = s.replaceAll(/client\.options\.sprintKey\.setPressed\(/g, "client.options.keySprint.setPressed(");
    s = s.replaceAll(/client\.options\.backKey\.setPressed\(/g, "client.options.keyBack.setPressed(");
    s = s.replaceAll(/client\.options\.leftKey\.setPressed\(/g, "client.options.keyLeft.setPressed(");
    s = s.replaceAll(/client\.options\.rightKey\.setPressed\(/g, "client.options.keyRight.setPressed(");
    s = s.replaceAll(/client\.options\.sneakKey\.setPressed\(/g, "client.options.keySneak.setPressed(");
    s = s.replaceAll(/client\.options\.useKey\.setPressed\(/g, "client.options.keyUse.setPressed(");
    s = s.replaceAll("client.currentScreen.close()", "client.setScreen(null)"); // 1.18.2 才有 Screen.close()
  }
  if (version === "1.16.5" || version === "1.14.4") {
    // 截图：类与签名都不同（多 width/height 两参）
    s = s.replaceAll("import net.minecraft.client.util.ScreenshotRecorder;", "import net.minecraft.client.util.ScreenshotUtils;");
    s = s.replaceAll(
      "ScreenshotRecorder.saveScreenshot(client.runDirectory, client.getFramebuffer(), ",
      "ScreenshotUtils.saveScreenshot(client.runDirectory, client.getWindow().getFramebufferWidth(), client.getWindow().getFramebufferHeight(), client.getFramebuffer(), ",
    );
    // 开/关屏：1.16.5 无 setScreen
    s = s.replaceAll("client.setScreen(", "client.openScreen(");
    s = s.replaceAll("mc.setScreen(", "mc.openScreen(");
    s = s.replaceAll("client.currentScreen.close()", "client.openScreen(null)");
    // 朝向：公开字段
    s = s.replaceAll(/player\.setYaw\(([^;]*)\);/g, "player.yaw = $1;");
    s = s.replaceAll(/player\.setPitch\(([^;]*)\);/g, "player.pitch = $1;");
    s = s.replaceAll(/player\.getYaw\(\)/g, "player.yaw");
    s = s.replaceAll(/player\.getPitch\(\)/g, "player.pitch");
    // 背包 / 能力：1.16.5 是公开字段（javap 实测 `public final PlayerInventory inventory` / `PlayerAbilities abilities`），
    // 1.17.1 起才有 `getInventory()`/`getAbilities()`。
    s = s.replaceAll("player.getInventory()", "player.inventory");
    s = s.replaceAll("player.getAbilities()", "player.abilities");
  }
  if (version === "1.14.4") {
    // ── 与 1.16.5 的剩余差异（逐条 javap 实测 2026-10-03，见 PLAYTEST_VERIFIED_TIER 的 fabric 1.14.4 条目）──
    // ① 截图方法名仍是混淆形（1.16 才改名 saveScreenshot）
    s = s.replaceAll("ScreenshotUtils.saveScreenshot(", "ScreenshotUtils.method_1659(");
    // ② MinecraftClient 无 getWindow()：`public final Window window` 字段
    s = s.replaceAll("client.getWindow()", "client.window");
    // ③ Entity 的 x/y/z 是公开字段（1.15 才有 getX/getY/getZ）；BlockPos/Vec3i 仍用 getX() ⇒ 必须按接收者限定
    for (const r of ["player", "e", "p"]) {
      s = s.replaceAll(new RegExp(String.raw`(?<![\w$])${r}\.getX\(\)`, "g"), `${r}.x`);
      s = s.replaceAll(new RegExp(String.raw`(?<![\w$])${r}\.getY\(\)`, "g"), `${r}.y`);
      s = s.replaceAll(new RegExp(String.raw`(?<![\w$])${r}\.getZ\(\)`, "g"), `${r}.z`);
    }
    // ④ 落地：公开字段（1.14.4 无 isOnGround()）
    s = s.replaceAll("player.isOnGround()", "player.onGround");
    // ⑤ 背包：无 PlayerEntity.getInventory()（公开字段 inventory）+ PlayerInventory.getInvStack(int)（不是 getStack）
    s = s.replaceAll("PlayerEntity.getInventory()", "PlayerEntity.inventory");
    s = s.replaceAll(".getStack(", ".getInvStack(");
    // ⑥ Vec3i/BlockPos 无 toShortString()（1.15.2 才有）
    s = s.replaceAll(".toShortString()", ".toString()");
    // ⑦ 自动进世界是 startIntegratedServer(String,String,LevelInfo)（三参）
    s = s.replaceAll(
      "client.startIntegratedServer(WORLD)",
      "client.startIntegratedServer(WORLD, WORLD, new LevelInfo(0L, GameMode.CREATIVE, false, false, LevelGeneratorType.DEFAULT))",
    );
    // ⑧ KeyBinding 无 setPressed（pressed 私有）⇒ 静态 setKeyPressed(getDefaultKeyCode(), down)
    s = s.replaceAll(
      /client\.options\.(\w+)\.setPressed\(/g,
      "KeyBinding.setKeyPressed(client.options.$1.getDefaultKeyCode(), ",
    );
    // ⑨ import 增补
    s = s.replace(
      "import net.minecraft.client.MinecraftClient;",
      "import net.minecraft.client.MinecraftClient;\n" +
        "import net.minecraft.client.options.KeyBinding;\n" +
        "import net.minecraft.world.GameMode;\n" +
        "import net.minecraft.world.level.LevelGeneratorType;\n" +
        "import net.minecraft.world.level.LevelInfo;",
    );
    // ⑪ 文件头「签名出处」逐行校正（模板那几行是 1.21.11 面）
    s = s.replaceAll(
      " *   ScreenshotRecorder.saveScreenshot(File, Framebuffer, Consumer<Text>)",
      " *   ScreenshotUtils.method_1659(File, int, int, Framebuffer, Consumer<Text>)（1.14.4 方法名仍是混淆形）",
    );
    s = s.replaceAll(
      " *   Registry.getId(T) : Identifier（Registries.ITEM） ；Entity.getName() / getX() / getY() / getZ()",
      " *   Registry.getId(T) : Identifier（Registry.ITEM） ；Entity.getName() / x / y / z（位置是公开字段）",
    );
    s = s.replaceAll(
      " *   【真游玩证明】MinecraftClient.options(forwardKey / attackKey) + KeyBinding.setPressed(boolean)",
      " *   【真游玩证明】MinecraftClient.options(keyForward / keyAttack) + 静态 KeyBinding.setKeyPressed(KeyCode, boolean)",
    );
    s = s.replaceAll(
      " *                    MinecraftClient.interactionManager / getWindow()（Window.getScaledWidth/Height）/ currentScreen",
      " *                    MinecraftClient.interactionManager / window（Window.getScaledWidth/Height）/ currentScreen",
    );
    s = s.replaceAll(
      " *                    Entity.setPitch(float) / setYaw(float) ；World.getBlockState(BlockPos)",
      " *                    Entity.pitch / yaw（公开字段） ；World.getBlockState(BlockPos)",
    );
    s = s.replaceAll(
      " *                    BlockState.getBlock() / isAir() ；Registries.BLOCK ；BlockPos.down() / toShortString()",
      " *                    BlockState.getBlock() / isAir() ；Registry.BLOCK ；BlockPos.down() / toString()",
    );
    s = s.replaceAll(
      " *                    Screen.mouseClicked(Click, boolean) ；Click(double, double, MouseInput) ；InventoryScreen(PlayerEntity)",
      " *                    Screen.mouseClicked(double, double, int) ；InventoryScreen(PlayerEntity)",
    );
  }
  // 文件头自述
  return s.replace(
    " * 进程内临时 QA 驱动（temporary_client_tick_driver / fabric 1.21.11）",
    ` * 进程内临时 QA 驱动（temporary_client_tick_driver / ${s.includes("quilt") ? "quilt" : "fabric"} ${version}）`,
  );
}

/**
 * playtest 生成器**自己**的 26.x 上界（本文件逐档 javap 取证 = 5 个正式版 26.1 / 26.1.1 / 26.1.2 / 26.2 / 26.3）。
 * 与全局 `MC_MAX_MINOR_26X`（=1，服务于 model/lang/config 等**未**核 26.2/26.3 的生成器）分开 ——
 * 「playtest 核过 26.3」不等于「所有生成器都跟进到 26.3」。见 common.ts 的 `eraUpperBoundError(version, max26x)`。
 */
export const PLAYTEST_MAX_MINOR_26X = 3;

/** 取 26.<minor> 的 minor；非 26.x 返回 -1。 */
function m26(v: string): number {
  const mm = String(v).trim().match(/^26\.(\d+)/);
  return mm ? Number(mm[1]) : -1;
}

/**
 * 26.x **跨版本**共享差异（`rewriteForFabric26xx` / `rewriteForNeoForge26xx` 都调用）。
 *
 * 26.2+ 的**两处**面变了（javap 实测，`client-26.2.jar` / `client-26.3.jar`）：
 *   ① 截图：`Minecraft.getMainRenderTarget()` **已删**（26.1.x 还在），取而代之是
 *   `Screenshot.grab(Minecraft, boolean)` —— `javap -c` 读出 `boolean` = `panoramic`：
 *   为真且 `SharedConstants.DEBUG_PANORAMA_SCREENSHOT` 时走 `grabPanoramixScreenshot`，
 *   否则内部取 `mc.gameRenderer.mainRenderTarget()` 再走老的 `grab(File,RenderTarget,Consumer)`。
 *   ⇒ 我们要普通截图，传 `false`。
 *   ② 界面状态：`Minecraft.screen` **字段**与 `Minecraft.setScreen(Screen)` **都已删除**，
 *   移到 `net.minecraft.client.gui.Gui`（经 `Minecraft.gui` 访问）：
 *   `Gui.screen() -> Screen` / `Gui.setScreen(Screen)`（26.1.x 的 `Gui` 没有这两个成员，
 *   那时还在 `Minecraft` 上）。⇒ 本表把 `client.screen` → `client.gui.screen()`、
 *   `client.setScreen(x)` → `client.gui.setScreen(x)`（`mc.` 同理）。
 * 其余面在 26.1→26.3 间稳定（本轮对五个 jar 逐条 javap 比对：`mouseClicked(MouseButtonEvent,boolean)` /
 *   `WorldOpenFlows.openWorld(String,Runnable)` / `KeyMapping.setDown` / `Inventory.getItem(int)` /
 *   `BuiltInRegistries.ENTITY_TYPE|BLOCK|ITEM` / `Entity.onGround|getYRot|getXRot|setXRot` /
 *   `ClientPacketListener.sendCommand` / `Options.keyUp|keyJump|keyAttack` / `MouseButtonEvent|MouseButtonInfo` 构造全同）。
 * 注：26.3 的 `BuiltInRegistries` 里 `BLOCKSTATE_PROVIDER_TYPE` 等有改名/删除，但**本驱动不用**，不受影响。
 */
function apply26xxShared(s: string, version: string): string {
  let t = s;
  // ① GUI 点击签名：26.x = `mouseClicked(MouseButtonEvent, boolean)`（两种缩进形态）。
  //    **必须早于 26.2+ 的 screen→gui.screen() 换形**——本步的匹配字面量里带 `client.screen.`。
  t = t.replaceAll(
    "client.screen.mouseClicked(\n" +
      "                                client.getWindow().getGuiScaledWidth() / 2.0, client.getWindow().getGuiScaledHeight() / 2.0, 0)",
    "client.screen.mouseClicked(new MouseButtonEvent(\n" +
      "                                client.getWindow().getGuiScaledWidth() / 2.0, client.getWindow().getGuiScaledHeight() / 2.0, new MouseButtonInfo(0, 0)), false)",
  ).replaceAll(
    "client.screen.mouseClicked(\n" +
      "                                    client.getWindow().getGuiScaledWidth() / 2.0, client.getWindow().getGuiScaledHeight() / 2.0, 0)",
    "client.screen.mouseClicked(new MouseButtonEvent(\n" +
      "                                    client.getWindow().getGuiScaledWidth() / 2.0, client.getWindow().getGuiScaledHeight() / 2.0, new MouseButtonInfo(0, 0)), false)",
  );
  if (m26(version) >= 2) {
    // ② 截图：`Minecraft.getMainRenderTarget()` 已删（两种 lambda 形态一次盖住）
    t = t.replaceAll(
      /Screenshot\.grab\(client\.gameDirectory, client\.getMainRenderTarget\(\), t -> \{\s*\}\);/g,
      "Screenshot.grab(client, false);",
    );
    // ③ 界面状态：26.2 起 `Minecraft.screen` 字段与 `Minecraft.setScreen(...)` **都已删除**，
    //    移到 `net.minecraft.client.gui.Gui`（`Minecraft.gui`）——javap 实测：
    //    `Gui.screen() -> Screen` / `Gui.setScreen(Screen)`（26.1.x 的 Gui 无此二成员）。
    //    先换 setter（`client.setScreen(` 的右圆括号保证不误伤 `client.screen`），再换 getter。
    t = t.replaceAll("client.setScreen(", "client.gui.setScreen(");
    t = t.replaceAll("mc.setScreen(", "mc.gui.setScreen(");
    t = t.replaceAll("client.screen", "client.gui.screen()");
    t = t.replaceAll("mc.screen", "mc.gui.screen()");
  }
  // 造世界：26.x 的 `LevelSettings` 构造面与 forge 表插的那份**不同**（见 applyNewworld26xx），换成本档实测版
  t = applyNewworld26xx(t);
  // 文件头自述：别让它继续自称 1.21.11
  const plat = t.includes("net.neoforged") ? "neoforge" : "fabric";
  return t.replace(
    " * 进程内临时 QA 驱动（temporary_client_tick_driver / fabric 1.21.11）",
    ` * 进程内临时 QA 驱动（temporary_client_tick_driver / ${plat} ${version}，去混淆 mojmap）`,
  );
}

/**
 * MC 26.1+ 去混淆档改写表（**fabric**）——保留 Fabric API 事件、只换 vanilla 名到 mojmap。
 *
 * 与 forge 表的关系：26.1+ 的 vanilla 侧名与 forge/neoforge 表一致（同为 mojmap），所以本表**先走
 * `rewriteForForge`**（版本 > 1.20.4 ⇒ 自动接 `applyWorldOpenFlows1206Plus`，其 `openWorld(String,Runnable)`
 * 与 javap 实测的 26.x 一致），再把 3 处 forge 专属件换回 fabric：
 *   ① 事件挂接 = Fabric API（`ClientTickEvents.END_CLIENT_TICK` / `ClientReceiveMessageEvents.GAME`），
 *      不是 Forge 事件总线（26.x 是 fabric 工程，Forge 类根本不在 classpath）；
 *   ② 退掉 forge 表插进类体的 `INSTANCE` 字段与两个 `@SubscribeEvent` 方法；
 *   ③ `mouseClicked` 换 26.x 新签名（见下）。
 *
 * 本表全部签名以**官方客户端 jar（已去混淆，免 remap）+ 对应 fabric-api** javap 实测：
 *   26.1.2（2026-10-03，38 113 927 B / sha1 `4e618f09…`）+ fabric-api 0.155.3+26.1.2；
 *   26.1 / 26.1.1 / 26.2 / 26.3 的差异面逐条比对（2026-10-03；26.2/26.3 见 `apply26xxShared`）。
 * `Minecraft.getInstance/getMainRenderTarget(≤26.1.x)/gameDirectory/screen/setScreen/getConnection/getWindow/
 * createWorldOpenFlows`、`LocalPlayer`(=net.minecraft.client.player.LocalPlayer)、
 * `Screenshot.grab(File,RenderTarget,Consumer<Component>)`、`Options.keyUp|keyJump|keyAttack`、
 * `KeyMapping.setDown(boolean)`、`Inventory.getItem(int)`、`BuiltInRegistries.ENTITY_TYPE|BLOCK|ITEM`、
 * `ClientLevel.entitiesForRendering()`、`Player.getInventory()/getAbilities()/onUpdateAbilities()`、
 * `Abilities.flying|mayfly`、`Entity.getYRot/setYRot/getXRot/setXRot/onGround/getName/blockPosition/getType`、
 * `ClientPacketListener.sendCommand(String)`、`Component.getString()`、`Window.getGuiScaledWidth/Height`、
 * `Screen.onClose()`、`InventoryScreen(Player)`、`WorldOpenFlows.openWorld(String,Runnable)`。
 *
 * ③ GUI 点击签名差异（**26.x 新形态，与 ≤1.21.11 和 forge 1.20.1 都不同**）：
 *   `GuiEventListener.mouseClicked(MouseButtonEvent, boolean)`，
 *   `MouseButtonEvent(double, double, MouseButtonInfo)`、`MouseButtonInfo(int, int)`（javap 实测）。
 *   ⇒ 不能沿用 forge 表的 `(double,double,int)` 形态。
 *
 * `newworld`（造世界）步骤本表**已取证**（2026-10-03）：forge 表插的 7 参 `LevelSettings` 是 1.20.1 形态、26.x 编译不过，
 *   故由 `applyNewworld26xx` 整体换成 26.x 版（5 参 record + `LevelSettings$DifficultySettings` + `WorldPresets::createNormalWorldDimensions`）。
 *   javap 依据见该函数注释；五档（26.1/26.1.1/26.1.2/26.2/26.3）逐条同形。
 */
export function rewriteForFabric26xx(java: string, version: string): string {
  // 先套 forge 表（vanilla 名 → mojmap；版本 >1.20.4 ⇒ 自动接 openWorld 面）
  let s = rewriteForForge(java, version);
  s = apply26xxShared(s, version);
  return deForgeToFabric26xx(s, version);
}

/**
 * MC 26.1+ 去混淆档改写表（**neoforge**）—— = forge 表换 mojmap 名 + **NeoForge 26.x 事件栈**。
 *
 * NeoForge 26.x 事件栈（javap 实测 `neoforge-26.1.2.114-universal.jar` + `bus-8.0.5.jar`，2026-10-03）：
 *   - `net.neoforged.neoforge.common.NeoForge.EVENT_BUS`（`public static final IEventBus`）✓
 *   - `net.neoforged.bus.api.IEventBus.register(Object)` ✓ / `@net.neoforged.bus.api.SubscribeEvent` ✓
 *   - `net.neoforged.neoforge.client.event.ClientTickEvent$Post`（`public class … extends ClientTickEvent`，
 *     **无 phase 字段、无 phase 判据**；`ClientTickEvent` 是 abstract 父类）⇒ 订阅形 `onClientTick(ClientTickEvent.Post)`，
 *     **不要**沿用 1.20.4/1.20.6 表的 `TickEvent.ClientTickEvent` + `event.phase != END` 判据。
 *   - `net.neoforged.neoforge.client.event.ClientChatReceivedEvent#getMessage() -> Component` ✓（与 1.20.x 同形）
 * ⚠ 与 `rewriteForNeoForge`（1.20.4/1.20.6/1.21.x 表）**不是**同一张：那张用带 phase 的 `TickEvent.ClientTickEvent`。
 */
export function rewriteForNeoForge26xx(java: string, version: string): string {
  let s = rewriteForForge(java, version);
  s = apply26xxShared(s, version);
  s = deForgeToNeoForge26xx(s, version);
  return s;
}

/** 把 forge 表产出改回 **fabric（Fabric API 事件）** 的 26.1+ 形态。 */
function deForgeToFabric26xx(s: string, version: string): string {
  let t = s;
  // ① imports：去掉 forge 四个，换回 Fabric API 两个 + 26.x 的点击输入类
  t = t.replace(
    "import net.minecraft.core.registries.BuiltInRegistries;\n" +
      "import net.minecraftforge.client.event.ClientChatReceivedEvent;\n" +
      "import net.minecraftforge.common.MinecraftForge;\n" +
      "import net.minecraftforge.event.TickEvent;\n" +
      "import net.minecraftforge.eventbus.api.SubscribeEvent;\n",
    "import net.minecraft.core.registries.BuiltInRegistries;\n" +
      "import net.minecraft.client.input.MouseButtonEvent;\n" +
      "import net.minecraft.client.input.MouseButtonInfo;\n" +
      "import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;\n" +
      "import net.fabricmc.fabric.api.client.message.v1.ClientReceiveMessageEvents;\n",
  );
  // ② 退掉 forge 表插进类体的 INSTANCE 字段与两个 @SubscribeEvent 方法
  t = t.replace(FORGE_CLASS_BODY_INSERT, "public final class PlaytestQaDriver {\n");
  // ③ 事件挂接：解释器路径（12 空格缩进）
  t = t.replace(
    "            INSTANCE = new PlaytestQaDriver();\n            MinecraftForge.EVENT_BUS.register(INSTANCE);",
    "            ClientTickEvents.END_CLIENT_TICK.register(PlaytestQaDriver::onInterpTick);\n" +
      "            ClientReceiveMessageEvents.GAME.register((message, overlay) -> lastGameMessage = message.getString());",
  );
  // ③b 事件挂接：相位机路径（8 空格缩进）
  t = t.replace(
    "        INSTANCE = new PlaytestQaDriver();\n        MinecraftForge.EVENT_BUS.register(INSTANCE);",
    "        ClientTickEvents.END_CLIENT_TICK.register(PlaytestQaDriver::onEndTick);",
  );
  return t;
}

/** 把 forge 表产出换成 **NeoForge 26.x 事件栈**。 */
function deForgeToNeoForge26xx(s: string, version: string): string {
  let t = s;
  // 26.x 的点击输入类（forge 表不引入；neoforge 侧同 fabric 侧都需要）
  t = t.replace(
    "import net.minecraft.core.registries.BuiltInRegistries;\n",
    "import net.minecraft.core.registries.BuiltInRegistries;\n" +
      "import net.minecraft.client.input.MouseButtonEvent;\n" +
      "import net.minecraft.client.input.MouseButtonInfo;\n",
  );
  t = t.replaceAll(
    "import net.minecraftforge.client.event.ClientChatReceivedEvent;",
    "import net.neoforged.neoforge.client.event.ClientChatReceivedEvent;",
  );
  t = t.replaceAll("import net.minecraftforge.common.MinecraftForge;", "import net.neoforged.neoforge.common.NeoForge;");
  t = t.replaceAll(
    "import net.minecraftforge.event.TickEvent;",
    "import net.neoforged.neoforge.client.event.ClientTickEvent;",
  );
  t = t.replaceAll(
    "import net.minecraftforge.eventbus.api.SubscribeEvent;",
    "import net.neoforged.bus.api.SubscribeEvent;",
  );
  // 订阅形：26.x 用 `ClientTickEvent.Post`，**无** phase 判据
  t = t.replace(
    "    @SubscribeEvent\n" +
      "    public void onClientTick(TickEvent.ClientTickEvent event) {\n" +
      "        if (event.phase != TickEvent.Phase.END) {\n" +
      "            return;\n" +
      "        }\n" +
      "        onInterpTick(Minecraft.getInstance());\n" +
      "    }\n",
    "    @SubscribeEvent\n" +
      "    public void onClientTick(ClientTickEvent.Post event) {\n" +
      "        onInterpTick(Minecraft.getInstance());\n" +
      "    }\n",
  );
  t = t.replaceAll("MinecraftForge.EVENT_BUS.register(INSTANCE);", "NeoForge.EVENT_BUS.register(INSTANCE);");
  return t;
}

/** forge 表插进类体的那段（`deForgeTo*` 用来把它整段摘掉）；与 `rewriteForForge` 里的字面量必须逐字一致。 */
const FORGE_CLASS_BODY_INSERT =
  "public final class PlaytestQaDriver {\n" +
  "\n" +
  "    private static PlaytestQaDriver INSTANCE;\n" +
  "\n" +
  "    @SubscribeEvent\n" +
  "    public void onClientTick(TickEvent.ClientTickEvent event) {\n" +
  "        if (event.phase != TickEvent.Phase.END) {\n" +
  "            return;\n" +
  "        }\n" +
  "        onInterpTick(Minecraft.getInstance());\n" +
  "    }\n" +
  "\n" +
  "    @SubscribeEvent\n" +
  "    public void onChat(ClientChatReceivedEvent event) {\n" +
  "        lastGameMessage = event.getMessage().getString();\n" +
  "    }\n";

/**
 * `newworld`（造世界）的 **26.1+ 实现**：把 forge 表植入的 `createFreshLevel` 块换成按 26.x 实测签名写的那份。
 *
 * **26.x 的 `LevelSettings` 是 5 参 record，不是 forge/1.20.1 的 7 参**（2026-10-03 javap 三源互证）：
 *   `LevelSettings(String levelName, GameType, LevelSettings$DifficultySettings, boolean allowCommands, WorldDataConfiguration)`
 *   ＋ 嵌套 `LevelSettings$DifficultySettings(Difficulty, boolean hardcore, boolean locked)`
 *   另有一个 6 参重载 `(…, WorldDataConfiguration, com.mojang.serialization.Lifecycle)`。
 *   **取证三源**：① vanilla 官方客户端 jar（`client-26.1 / 26.1.1 / 26.1.2 / 26.2 / 26.3.jar` 五档）；
 *   ② NeoForge 打过补丁的 jar（`minecraft-patched-26.1.2.114{,-merged}.jar`、`minecraft-patched-26.2.0.88{,-merged}.jar`）；
 *   ③ MDG 的 neoformruntime 客户端缓存（`minecraft_26.{1,1.1,1.2,2,3}_client.jar`）。
 *   **三源都只有上面那两个构造器，7 参 `(String,GameType,boolean,Difficulty,boolean,GameRules,WorldDataConfiguration)` 一处都没有。**
 *   编译期实证同向：按 7 参写会得到
 *   `需要: String,GameType,DifficultySettings,boolean,WorldDataConfiguration / 找到: String,GameType,boolean,Difficulty,boolean,GameRules,WorldDataConfiguration`。
 *   而 forge 表那份正是 1.20.1 的 7 参形态（`new net.minecraft.world.level.GameRules()` 无参）⇒ 直接留给 26.x 编译不过。
 *   `WorldDataConfiguration.DEFAULT` 五档都在（static field ✓）。
 *
 * ⚠ **本函数此前被改坏过**：一段「26.x 仍是 7 参、`DifficultySettings` 已实测证伪」的注释与实现（`gamerules.GameRules(FeatureFlags.VANILLA_SET)`）
 * 曾把替换体本身写成 7 参 —— 于是**替换「成功」但结果是编译不过的代码**（且 `newworld` 一跑就编译失败）。
 * 上面那三源取证就是为堵这个：**改这里之前先 javap `client-26.x.jar` 的 `LevelSettings` / `LevelSettings$DifficultySettings`**。
 *
 * 另两处一并定稿：
 *   ① 第 4 参 `Function<HolderLookup$Provider, WorldDimensions>` 用 **`WorldPresets::createNormalWorldDimensions`**
 *      —— javap 实测该方法签名逐字就是 `static WorldDimensions createNormalWorldDimensions(HolderLookup$Provider)`，
 *      比手搓 `ra -> new WorldDimensions(ra.registryOrThrow(LEVEL_STEM))` 少一串未核构造面；
 *   ② `client.execute(Runnable)` 是**继承**来的（`Minecraft extends ReentrantBlockableEventLoop` → `BlockableEventLoop.execute(Runnable)`，
 *      javap 实测）⇒ `Minecraft` 自己的成员表里看不到，但调用合法。createFreshLevel 内部同步阻塞渲染线程，必须丢到下一 tick。
 * 末参 `Screen` 传 `null`（与 1.20.4+ 同形）。
 */
function applyNewworld26xx(s: string): string {
  const start = s.indexOf("        try {\n            // 必须丢到渲染线程的下一 tick：createFreshLevel 内部走 loadWorldDataBlocking");
  if (start < 0) return s; // 形态变了就别乱动（宁可留 forge 实现也不要切错位置）
  const endMark = "        } catch (Throwable t) {\n            log(\"[QA] newworld 失败：\" + t);\n        }";
  const end = s.indexOf(endMark, start);
  if (end < 0) return s;
  return (
    s.slice(0, start) +
    [
      "        try {",
      "            // createFreshLevel 内部走 loadWorldDataBlocking（同步阻塞渲染线程）⇒ 必须丢到渲染线程的下一 tick。",
      "            client.execute(() -> {",
      "                try {",
      "                    client.createWorldOpenFlows().createFreshLevel(",
      "                        name,",
      "                        new net.minecraft.world.level.LevelSettings(",
      "                            name,",
      "                            net.minecraft.world.level.GameType.CREATIVE,",
      "                            new net.minecraft.world.level.LevelSettings.DifficultySettings(net.minecraft.world.Difficulty.NORMAL, false, false),",
      "                            true,",
      "                            net.minecraft.world.level.WorldDataConfiguration.DEFAULT),",
      "                        net.minecraft.world.level.levelgen.WorldOptions.defaultWithRandomSeed(),",
      "                        net.minecraft.world.level.levelgen.presets.WorldPresets::createNormalWorldDimensions,",
      "                        null);",
      '                    log("[QA] newworld: createFreshLevel 已执行（渲染线程下一 tick）");',
      "                } catch (Throwable t) {",
      '                    log("[QA] newworld 失败：" + t);',
      "                }",
      "            });",
      '            log("[QA] newworld: 已排队创建 " + name + "（渲染线程下一 tick 执行；后续步骤留 wait 即可）");',
      '        } catch (Throwable t) {',
      '            log("[QA] newworld 失败：" + t);',
      "        }",
    ].join("\n") +
    s.slice(end + endMark.length)
  );
}


const FORGE_KEYS: Record<string, string> = {
  forwardKey: "keyUp",
  backKey: "keyDown",
  leftKey: "keyLeft",
  rightKey: "keyRight",
  jumpKey: "keyJump",
  sneakKey: "keyShift",
  sprintKey: "keySprint",
  attackKey: "keyAttack",
  useKey: "keyUse",
  inventoryKey: "keyInventory",
};

/**
 * forge 早期档（javap 实测；jar 均取自本机 `.gradle/caches/forge_gradle` 缓存，免下载）：
 *   - `1.13.2` = **MCP 命名层**（与 1.14+ 的 mojmap 完全不同源，整表分派给 `applyForgeMCP132`）：
 *     `net.minecraft.block.state.IBlockState`（`getBlockState()` 返接口）/ `net.minecraft.item.ItemStack`
 *     / `net.minecraft.client.gui.GuiScreen` / `net.minecraft.client.gui.inventory.GuiInventory`
 *     / `net.minecraft.client.entity.EntityPlayerSP` / `net.minecraft.client.multiplayer.WorldClient`
 *     / `ForgeRegistries.BLOCKS|ITEMS|ENTITIES`（`getKey(V)`）/ `Minecraft.world/player/currentScreen/gameSettings/gameDir/mainWindow`
 *     / `GuiScreen.onGuiClosed()` / `KeyBinding.setKeyBindState(Input,boolean)` / `ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer,Consumer)`
 *     / `EntityPlayerSP.sendChatMessage(String)` / `WorldClient.loadedEntityList` / BlockPos `add(int,int,int)·down()·toImmutable()`。
 *   - `1.14.4` / `1.15.2` / `1.16.5` = **旧 mojmap** 族（1.17 大批改名之前），逐档差异见 `applyForgeOldMojmapLegacy` 与两档的 tier 备注。
 *   - `1.17.1` / `1.18.2` = 现代 mojmap 名，但自动进世界是 `Minecraft.loadLevel(String)`（无 `WorldOpenFlows`）、
 *     命令走 `LocalPlayer.chat(String)`（`ClientPacketListener.sendCommand` 1.19 才有）、注册表是 `core.Registry` 静态字段。
 *   - `1.19.4` = 与 1.20.1 基本同形（`createWorldOpenFlows().loadLevel`、`BuiltInRegistries`、`sendCommand`、7 参 LevelSettings 均在），
 *     仅 `Entity.isOnGround()`（`onGround()` 是 1.20 才改的名）差一处。
 * 全部 7 档的 javac 编译验证（本机 `.gradle/caches` 的 mapped jar 做 classpath）**逐档 COMPILE_OK**，as-of 2026-10-03。
 */
export const FORGE_LEGACY_VERSIONS: readonly string[] = ["1.12.2", "1.13.2", "1.14.4", "1.15.2", "1.16.5", "1.17.1", "1.18.2", "1.19.4"];
/** 其中 `createFreshLevel` 造世界面**未取证**（LevelSettings/WorldDimensions 构造面不同）⇒ 保留 fail-closed 桩。 */
export const FORGE_NO_NEWWORLD_VERSIONS: readonly string[] = ["1.12.2", "1.13.2", "1.14.4", "1.15.2", "1.16.5", "1.17.1", "1.18.2"];
/** 旧 mojmap 族（1.14.4–1.16.5）：命名层同源，自动进世界与 `onGround` 形态逐档不同。 */
export const FORGE_OLD_MOJMAP_VERSIONS: readonly string[] = ["1.14.4", "1.15.2", "1.16.5"];

/**
 * forge 1.14.4 / 1.15.2 改写项（javap 实测；与 1.16.5 同属**旧 mojmap 命名族**，只差三处）：
 *   - 自动进世界**没有** `loadLevel(String)`：
 *       1.14.4 `Minecraft.launchIntegratedServer(String levelId, String levelName, WorldSettings)`；
 *       1.15.2 `Minecraft.selectLevel(String levelId, String levelName, WorldSettings)`；
 *     `WorldSettings` 构造面两档同形（javap）：`WorldSettings(long seed, GameType, boolean generatingBonusChest, boolean mapFeatures, WorldType)`
 *     —— 末参 `WorldType` **不在**改写的调用形态里构造（`WorldType.DEFAULT` 是 static field，javap 实测两档都在），
 *     `levelId==levelName` 时相当于「打开该目录的存档」，与 1.16.5 的 `loadLevel(id)` 语义近似。
 *   - `Minecraft` 的**世界/玩家/屏幕字段名**两档都换了：1.14.4 `world` / `currentScreen` / `gameSettings`（1.15.2 才改 `level`/`screen`/`options`）。
 *   - `Entity` 的 yaw/pitch 在两档是**公开字段 `rotationYaw`/`rotationPitch`**（1.15.2/1.16.5 才改 `yRot`/`xRot`）。
 *   - `Entity.onGround` 是**公开字段**（1.16.5 才是 `isOnGround()`）。
 *   - 取物器：1.15.2 `PlayerInventory.getItem(int)`（同 1.16.5）；**1.14.4 是 `getStackInSlot(int)`**。
 *   - 1.15.2 的 `Screen` **无** `onClose()`（那是 1.16.5 才加的）⇒ 关屏 `client.screen = null`；`getGuiScaledWidth/Height` 两档都在。
 *   - `ClientWorld` 取实体：1.15.2 `entitiesForRendering()`（同 1.16.5）；**1.14.4 是 `getAllEntities()`**。
 *   - `Minecraft` 取窗口：两档都是 **public 字段 `mainWindow`**（`getWindow()` 是 1.16.5 才有的）。
 *   `newworld` 造世界面**未取证**（`createFreshLevel` 不存在，旧造世界入口 `launchIntegratedServer`/`selectLevel` 需另取证）⇒ fail-closed。
 */
export function applyForgeOldMojmapLegacy(s: string, version: string): string {
  let t = s;
  // ① 朝向：1.14.4 是**公开字段** rotationYaw / rotationPitch；1.15.2 已是 `yRot`/`xRot`（javap 实测）
  //    —— 上面共享块已把 `getYRot()/getXRot()` 换成 yRot/xRot，这里只对 1.14.4 再换一层。
  if (version === "1.14.4") {
    t = t.replaceAll(/(\w+)\.yRot\b/g, "$1.rotationYaw").replaceAll(/(\w+)\.xRot\b/g, "$1.rotationPitch");
  }
  // ② 落地：**公开字段** onGround（1.16.5 才是 isOnGround()）—— 走到这里时 forge 表已把 `isOnGround()`
  //    换成了 `onGround()`（同一份改写表两档都要接），故两式都换。
  t = t.replaceAll("player.onGround()", "player.onGround").replaceAll("player.isOnGround()", "player.onGround");
  // ③ 位置：两档都无 `blockPosition()`（1.16 才加）。
  if (version === "1.15.2") {
    // 1.15.2 的 Entity **没有** `getPosition()`（javap 实测；只有 protected getOnPos / Vec3d position()）⇒ 现造 BlockPos。
    t = t.replaceAll(
      "player.blockPosition()",
      "new net.minecraft.util.math.BlockPos(player.getX(), player.getY(), player.getZ())",
    );
  } else {
    // 1.14.4 有 `Entity.getPosition()`（javap 实测；返 BlockPos）。
    t = t.replaceAll("player.blockPosition()", "player.getPosition()");
  }
  // ④ 1.14.4 专属旧面（**1.15.2 已改成新名，不得套用** —— 走错一次实测会红，2026-10-03）
  if (version === "1.14.4") {
    // 4a Entity 只有公开字段 posX/posY/posZ（javap：无 getX/getY/getZ）。用 lookbehind 防 `bp.getX()`（BlockPos）被吃。
    for (const r of ["player", "e", "p"]) {
      t = t
        .replaceAll(new RegExp(`(?<![\\w$])${r}\\.getX\\(\\)`, "g"), `${r}.posX`)
        .replaceAll(new RegExp(`(?<![\\w$])${r}\\.getY\\(\\)`, "g"), `${r}.posY`)
        .replaceAll(new RegExp(`(?<![\\w$])${r}\\.getZ\\(\\)`, "g"), `${r}.posZ`);
    }
    // 4b BlockPos 旧面：只有 up()/down() + toImmutable() + add(int,int,int)（1.15.2 才是 below()/immutable()/offset）—— javap 两档互证。
    t = t.replaceAll(".below()", ".down()").replaceAll(".immutable()", ".toImmutable()");
    t = t.replaceAll(".toShortString()", ".toString()");
    t = t.replaceAll(".offset(ax, ay, az)", ".add(ax, ay, az)");
    // 4c MainWindow 只有 getScaledWidth/Height（getGuiScaled* 是 1.15.2 才加的）。
    t = t.replaceAll("getGuiScaledWidth()", "getScaledWidth()").replaceAll("getGuiScaledHeight()", "getScaledHeight()");
    // 4d 能力：1.14.4 的 PlayerAbilities 字段叫 isFlying（1.15.2 才改 flying）；刷新叫 sendPlayerAbilities。
    t = t.replaceAll("player.abilities.flying", "player.abilities.isFlying");
    t = t.replaceAll("player.onUpdateAbilities()", "player.sendPlayerAbilities()");
    // 4e 命令：1.14.4 的 ClientPlayerEntity **没有** chat（1.15.2/1.16.5 才有）⇒ sendChatMessage(String)。
    t = t.replaceAll("client.player.chat(", "client.player.sendChatMessage(");
  }
  // ⑤ 自动进世界：两档都没有 loadLevel(String)；WorldType 常量名两档不同（1.15.2 = NORMAL，1.14.4 = DEFAULT）。
  const wt = version === "1.15.2" ? "NORMAL" : "DEFAULT";
  const call =
    version === "1.15.2"
      ? `client.selectLevel(WORLD, WORLD, new net.minecraft.world.WorldSettings(0L, net.minecraft.world.GameType.CREATIVE, false, true, net.minecraft.world.WorldType.${wt}))`
      : `client.launchIntegratedServer(WORLD, WORLD, new net.minecraft.world.WorldSettings(0L, net.minecraft.world.GameType.CREATIVE, false, true, net.minecraft.world.WorldType.${wt}))`;
  t = t.replaceAll("client.loadLevel(WORLD)", call);
  if (version === "1.14.4") {
    // ⑤ 1.14.4 的字段名与 1.15.2/1.16.5 不同（1.15 才改 level/screen/options/gameDirectory）
    t = t.replaceAll("client.level", "client.world").replaceAll("client.screen", "client.currentScreen");
    t = t.replaceAll("client.options.", "client.gameSettings.");
    t = t.replaceAll("client.gameDirectory", "client.gameDir");
    t = t.replaceAll("client.getWindow()", "client.mainWindow");
    t = t.replaceAll("client.getMainRenderTarget()", "client.getFramebuffer()");
    t = t.replaceAll("client.setScreen(", "client.displayGuiScreen(");
    t = t.replaceAll("client.world.entitiesForRendering()", "client.world.getAllEntities()");
    t = t.replaceAll(/mc\.world\.entitiesForRendering\(\)/g, "mc.world.getAllEntities()");
    // 相位机里的 `mc` 别名同样要换名（javap：1.14.4 是 currentScreen / displayGuiScreen）
    t = t.replaceAll("mc.screen", "mc.currentScreen");
    t = t.replaceAll("mc.setScreen(", "mc.displayGuiScreen(");
    t = t.replaceAll("player.inventory.getItem(", "player.inventory.getStackInSlot(");
    // 截图：1.14.4/1.13.2 的方法名是 saveScreenshot（grab 是 1.15.2 才有的名）—— javap 实测。
    t = t.replaceAll("ScreenShotHelper.grab(", "ScreenShotHelper.saveScreenshot(");
    const K14: Record<string, string> = {
      keyUp: "keyBindForward", keyDown: "keyBindBack", keyLeft: "keyBindLeft", keyRight: "keyBindRight",
      keyJump: "keyBindJump", keyShift: "keyBindSneak", keySprint: "keyBindSprint",
      keyAttack: "keyBindAttack", keyUse: "keyBindUseItem", keyInventory: "keyBindInventory",
    };
    t = t.replaceAll(/client\.gameSettings\.(\w+)\.setDown\(/g, (_m, k: string) => `client.gameSettings.${K14[k] ?? k}.setDown(`);
    // 1.14.4 的 KeyBinding **没有** `setDown(boolean)`（javap 实测）⇒ 用静态 `setKeyBindState(Input, boolean)`。
    t = t.replaceAll(
      /client\.gameSettings\.(keyBind\w+)\.setDown\(/g,
      (_m, k: string) => `net.minecraft.client.settings.KeyBinding.setKeyBindState(client.gameSettings.${k}.getKey(), `,
    );
  }
  return t;
}

/**
 * forge 1.13.2 改写（**MCP 命名层**，与 1.14+ 的 mojmap 完全不同源）——由 rewriteForForgeLegacy 单独分派。
 * 逐条 javap 实测（`forge-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar`，本机缓存）：
 *   - 包名：`net.minecraft.block.BlockState`（无 `world.level.block.state`）/ `net.minecraft.item.ItemStack`
 *     / `net.minecraft.util.math.BlockPos` / `net.minecraft.entity.Entity` / `net.minecraft.client.gui.GuiScreen`
 *     / `net.minecraft.client.gui.inventory.GuiInventory` / `net.minecraft.client.entity.EntityPlayerSP`
 *     / `net.minecraft.client.network.NetHandlerPlayClient` / `net.minecraft.client.world.WorldClient`。
 *   - 注册表：**没有** `util.registry.Registry` 持有类；用 `net.minecraftforge.registries.ForgeRegistries` 的
 *     `BLOCKS`/`ITEMS`/`ENTITIES`（IForgeRegistry，**取值方法叫 `getKey(V)`**，javap 实测）。
 *   - `Minecraft`：`world`（字段）/ `player`（字段）/ `currentScreen`（字段 `/ `gameSettings`（字段）/ `gameDir`（字段）/
 *     `mainWindow`（字段）/ `getFramebuffer()` / `displayGuiScreen(GuiScreen)` / `launchIntegratedServer(String,String,WorldSettings)`。
 *   - 玩家：`EntityPlayerSP.sendChatMessage(String)`（发命令，带前导 `/`）/ `sendPlayerAbilities()`（刷新飞行，**不叫 onUpdateAbilities**）/
 *     公开字段 `inventory`（`InventoryPlayer.getStackInSlot(int)`）与 `abilities`（`PlayerCapabilities`）。
 *   - `Entity`：公开字段 `rotationYaw`/`rotationPitch`/`onGround`；位置 `getPosition()`（BlockPos）。
 *   - `GameSettings` 键名**旧形** `keyBindForward/keyBindJump/keyBindAttack/keyBindUseItem/keyBindSprint/keyBindSneak/keyBindInventory…`。
 *   - `GuiScreen`：关屏 `onGuiClosed()`（**不叫 onClose**）/ `mouseClicked(double,double,int)`；`GuiInventory(EntityPlayer)`。
 *   - 截图：`net.minecraft.util.ScreenShotHelper.grab(File,int,int,Framebuffer,Consumer<ITextComponent>)`（javap 实测）。
 *   `newworld` 造世界面未取证 ⇒ fail-closed。
 */
export function applyForgeMCP132(s: string): string {
  let t = s;
  // Forge 事件包（1.13.2 仍在 `fml.common.gameevent`，1.14 才搬到 `net.minecraftforge.event`）——javap 实测。
  t = t.replaceAll(
    "import net.minecraftforge.event.TickEvent;",
    "import net.minecraftforge.fml.common.gameevent.TickEvent;",
  );
  // 全限定名先于短名规则（否则 `\bScreen\b` 会把 FQN 尾巴改掉，产生 `gui.screens.GuiScreen` 这种不存在的类）。
  t = t.replaceAll("net.minecraft.client.gui.screens.Screen", "net.minecraft.client.gui.GuiScreen");
  // 包名（MCP）
  t = t.replaceAll("import net.minecraft.world.level.block.state.BlockState;", "import net.minecraft.block.state.BlockState;");
  t = t.replaceAll("import net.minecraft.client.gui.screens.inventory.InventoryScreen;", "import net.minecraft.client.gui.inventory.GuiInventory;");
  t = t.replaceAll("import net.minecraft.client.player.LocalPlayer;", "import net.minecraft.client.entity.EntityPlayerSP;");
  t = t.replaceAll("import net.minecraft.client.Screenshot;", "import net.minecraft.util.ScreenShotHelper;");
  t = t.replaceAll("import net.minecraft.client.gui.screens.Screen;", "import net.minecraft.client.gui.GuiScreen;");
  t = t.replaceAll("import net.minecraft.world.item.ItemStack;", "import net.minecraft.item.ItemStack;");
  t = t.replaceAll("import net.minecraft.core.registries.BuiltInRegistries;", "import net.minecraftforge.registries.ForgeRegistries;");
  t = t.replaceAll("import net.minecraft.core.BlockPos;", "import net.minecraft.util.math.BlockPos;");
  // 类型名（先长后短，避免 `InventoryScreen` 被 `Screen` 规则吃掉）
  t = t.replaceAll(/\bLocalPlayer\b/g, "EntityPlayerSP");
  t = t.replaceAll(/\bInventoryScreen\b/g, "GuiInventory");
  t = t.replaceAll(/\bScreen\b/g, "GuiScreen");
  // 字段名（MCP：world / currentScreen / gameSettings / gameDir / mainWindow）
  t = t.replaceAll("client.level", "client.world").replaceAll("client.screen", "client.currentScreen");
  t = t.replaceAll("client.options.", "client.gameSettings.");
  t = t.replaceAll("client.gameDirectory", "client.gameDir");
  t = t.replaceAll("client.getWindow()", "client.mainWindow");
  t = t.replaceAll("client.getMainRenderTarget()", "client.getFramebuffer()");
  // 注册表：ForgeRegistries + getKey（javap：IForgeRegistry.getKey(V)）
  t = t.replaceAll("BuiltInRegistries.ENTITY_TYPE.getKey(", "ForgeRegistries.ENTITIES.getKey(");
  t = t.replaceAll("BuiltInRegistries.BLOCK.getKey(", "ForgeRegistries.BLOCKS.getKey(");
  t = t.replaceAll("BuiltInRegistries.ITEM.getKey(", "ForgeRegistries.ITEMS.getKey(");
  // 世界取实体
  t = t.replaceAll("client.world.entitiesForRendering()", "client.world.getAllEntities()");
  // 玩家面
  t = t.replaceAll("player.inventory.getItem(", "player.inventory.getStackInSlot(");
  t = t.replaceAll("player.onUpdateAbilities()", "player.sendPlayerAbilities()");
  t = t.replaceAll("client.player.chat(", "client.player.sendChatMessage(");
  // 朝向 / 落地 / 位置（公开字段 + getPosition）
  t = t.replaceAll(/(\w+)\.getYRot\(\)/g, "$1.rotationYaw").replaceAll(/(\w+)\.getXRot\(\)/g, "$1.rotationPitch");
  t = t.replaceAll(/player\.setYRot\(([^;\n]*)\);/g, "player.rotationYaw = $1;");
  t = t.replaceAll(/player\.setXRot\(([^;\n]*)\);/g, "player.rotationPitch = $1;");
  t = t.replaceAll(/(\w+)\.yRot\b/g, "$1.rotationYaw").replaceAll(/(\w+)\.xRot\b/g, "$1.rotationPitch");
  t = t.replaceAll("player.onGround()", "player.onGround").replaceAll("player.isOnGround()", "player.onGround");
  t = t.replaceAll("player.blockPosition()", "player.getPosition()");
  // Entity 在 1.13.2 只有公开字段 posX/posY/posZ（javap 实测，与 1.14.4 同形）⇒ 逐接收者换名；lookbehind 挡 `bp.getX()`。
  for (const r of ["player", "e", "p"]) {
    t = t
      .replaceAll(new RegExp(`(?<![\\w$])${r}\\.getX\\(\\)`, "g"), `${r}.posX`)
      .replaceAll(new RegExp(`(?<![\\w$])${r}\\.getY\\(\\)`, "g"), `${r}.posY`)
      .replaceAll(new RegExp(`(?<![\\w$])${r}\\.getZ\\(\\)`, "g"), `${r}.posZ`);
  }
  // BlockPos 旧面（javap：只有 add(int,int,int)/up()/down()/toImmutable()；MainWindow 只有 getScaledWidth/Height）。
  t = t.replaceAll(".offset(ax, ay, az)", ".add(ax, ay, az)");
  t = t.replaceAll(".below()", ".down()").replaceAll(".immutable()", ".toImmutable()").replaceAll(".toShortString()", ".toString()");
  t = t.replaceAll("getGuiScaledWidth()", "getScaledWidth()").replaceAll("getGuiScaledHeight()", "getScaledHeight()");
  // 玩家面（MCP）：`inventory`/`abilities` 是**公开字段**（EntityPlayer 上），能力字段叫 isFlying。
  t = t.replaceAll("player.getInventory().getItem(", "player.inventory.getStackInSlot(");
  t = t.replaceAll("player.getInventory()", "player.inventory");
  t = t.replaceAll("player.getAbilities()", "player.abilities");
  t = t.replaceAll("player.abilities.flying", "player.abilities.isFlying");
  // 世界取实体：1.13.2 WorldClient **没有** getAllEntities（javap 实测）⇒ 公开字段 loadedEntityList（List<Entity>）。
  t = t.replaceAll("client.world.getAllEntities()", "client.world.loadedEntityList");
  // 角度 FQN / 实体 FQN
  t = t.replaceAll("net.minecraft.world.entity.Entity", "net.minecraft.entity.Entity");
  // BlockState：1.13.2 的 World.getBlockState() 返 **IBlockState**（javap 实测）⇒ 只用 IBlockState 接。
  t = t.replaceAll("import net.minecraft.block.state.BlockState;", "import net.minecraft.block.state.IBlockState;");
  t = t.replaceAll("BlockState st = ", "IBlockState st = ");
  // 相位机 `mc` 别名
  t = t.replaceAll("mc.screen", "mc.currentScreen");
  t = t.replaceAll("mc.setScreen(", "mc.displayGuiScreen(");
  // 命令：1.13.2 的 NetHandlerPlayClient 没有 1.19 才有的 sendCommand ⇒ 走 EntityPlayerSP.sendChatMessage(String)。
  t = t.replaceAll(
    'client.getConnection().sendCommand(command.startsWith("/") ? command.substring(1) : command)',
    'client.player.sendChatMessage(command.startsWith("/") ? command : "/" + command)',
  );
  // 截图：1.13.2 只有 saveScreenshot(File,int,int,Framebuffer,Consumer)（javap 实测；grab 是 1.15.2 才有的名）。
  t = t.replaceAll(
    "Screenshot.grab(client.gameDir, client.getFramebuffer(), ",
    "ScreenShotHelper.saveScreenshot(client.gameDir, client.mainWindow.getWidth(), client.mainWindow.getHeight(), client.getFramebuffer(), ",
  );
  // 自动进世界
  t = t.replaceAll(
    "client.createWorldOpenFlows().loadLevel(null, WORLD)",
    "client.launchIntegratedServer(WORLD, WORLD, new net.minecraft.world.WorldSettings(0L, net.minecraft.world.GameType.CREATIVE, false, true, net.minecraft.world.WorldType.DEFAULT))",
  );
  // 屏幕：GuiScreen 关屏 = onGuiClosed；开屏 = displayGuiScreen
  t = t.replaceAll("client.currentScreen.onClose()", "client.currentScreen.onGuiClosed()");
  t = t.replaceAll("client.setScreen(", "client.displayGuiScreen(");
  // 键名（MCP 旧形）
  const MCP_KEYS: Record<string, string> = {
    keyUp: "keyBindForward", keyDown: "keyBindBack", keyLeft: "keyBindLeft", keyRight: "keyBindRight",
    keyJump: "keyBindJump", keyShift: "keyBindSneak", keySprint: "keyBindSprint",
    keyAttack: "keyBindAttack", keyUse: "keyBindUseItem", keyInventory: "keyBindInventory",
  };
  t = t.replaceAll(/client\.gameSettings\.(\w+)\.setDown\(/g, (_m, k: string) => `client.gameSettings.${MCP_KEYS[k] ?? k}.setDown(`);
  // 1.13.2 的 KeyBinding 同样**没有** `setDown(boolean)`（javap 实测）⇒ 静态 `setKeyBindState(Input, boolean)`。
  t = t.replaceAll(
    /client\.gameSettings\.(keyBind\w+)\.setDown\(/g,
    (_m, k: string) => `net.minecraft.client.settings.KeyBinding.setKeyBindState(client.gameSettings.${k}.getKey(), `,
  );
  return t;
}


/**
 * forge **1.12.2** 改写表 = `applyForgeMCP132` 之上再退一层（javap 实测，JDK 8 `javap -p`，
 * 构件 = 本机 `.gradle/caches/minecraft/net/minecraftforge/forge/1.12.2-14.23.5.2847/stable/39/forgeBin-1.12.2-14.23.5.2847.jar`
 * —— FG2.3 的 **MCP 命名 + Forge 合并件**，vanilla 与 Forge 类都在这一只 jar 里，免下载）。
 *
 * 八处与 1.13.2 的分叉（逐条都有 javap 行）：
 *  ① **Forge 自身三个包在 1.12.2 是旧位置**：`fml.common.registry.ForgeRegistries`（1.13 才搬 `net.minecraftforge.registries`）、
 *     `fml.common.eventhandler.SubscribeEvent`（1.13 才搬 `eventbus.api`）、`fml.common.gameevent.TickEvent`（同 1.13.2）。
 *  ② **没有 `Minecraft.getInstance()`** ⇒ 静态 `Minecraft.getMinecraft()`（javap：只有 `public static Minecraft getMinecraft()`）。
 *  ③ **没有 `mainWindow`**：窗口尺寸是公开 int 字段 `displayWidth`/`displayHeight`；GUI 缩放尺寸取 `GuiScreen.width`/`height`
 *     （javap：Minecraft 有 `public int displayWidth/displayHeight`，**无** mainWindow；GuiScreen 有 `public int width/height`）。
 *  ④ **截图无 Consumer 变体**：`ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer)`（javap 返 `ITextComponent`）
 *     ⇒ 模板那条 `..., t -> {...});` 的 lambda 尾巴必须整个摘掉（1.13.2 起才有 5 参 Consumer 版）。
 *  ⑤ **`ITextComponent` 无 `getString()`**（javap 只有 `getUnformattedText/getUnformattedComponentText/getFormattedText`）
 *     ⇒ 聊天回包取文本换 `getUnformattedText()`。
 *  ⑥ **`Entity.getName()` 返 `String`**（1.13 起改返 ITextComponent）⇒ `player.getName().getString()` 收敛成 `player.getName()`。
 *  ⑦ **实体 id**：`Entity` 无 `getType()`（1.13+）⇒ `net.minecraft.entity.EntityList.getKey(Entity)`（javap 实测存在）。
 *  ⑧ **`EntityPlayer.capabilities`**（1.13 才改叫 `abilities`）；`KeyBinding` 取键码是 **`getKeyCode()`**（1.13.2 已叫 `getKey()`）；
 *     `GuiScreen.mouseClicked(int,int,int)`（1.13.2 起是 `(double,double,int)`）。
 *
 * 未取证面（与 1.13.2 同）：`newworld` 造世界仍 fail-closed；真机未跑。
 */
export function applyForgeMCP1122(s: string): string {
  let t = s;
  // ① Forge 三包的 1.12.2 位置（MCP132 已把 TickEvent 换到 fml.common.gameevent，这里补另两个 + 兜底一次）
  t = t.replaceAll("import net.minecraftforge.registries.ForgeRegistries;", "import net.minecraftforge.fml.common.registry.ForgeRegistries;");
  t = t.replaceAll("import net.minecraftforge.eventbus.api.SubscribeEvent;", "import net.minecraftforge.fml.common.eventhandler.SubscribeEvent;");
  t = t.replaceAll("import net.minecraftforge.event.TickEvent;", "import net.minecraftforge.fml.common.gameevent.TickEvent;");
  t = t.replaceAll("import net.minecraftforge.eventbus.api.EventBus;", "import net.minecraftforge.fml.common.eventhandler.EventBus;");
  // ② 单例入口
  t = t.replaceAll("Minecraft.getInstance()", "Minecraft.getMinecraft()");
  // ④ 截图：无 Consumer 变体 ⇒ 先把 lambda 尾巴整个摘掉（两处：`t -> {\n});` 与 `t -> { });`）
  t = t.replace(
    /ScreenShotHelper\.saveScreenshot\(client\.gameDir, client\.mainWindow\.getWidth\(\), client\.mainWindow\.getHeight\(\), client\.getFramebuffer\(\), t -> \{\s*\}\);/g,
    "ScreenShotHelper.saveScreenshot(client.gameDir, client.displayWidth, client.displayHeight, client.getFramebuffer());",
  );
  // ③ 窗口尺寸（无 mainWindow）：GUI 缩放尺寸 → 当前 GuiScreen 的 width/height；像素尺寸 → displayWidth/displayHeight
  t = t.replaceAll("client.mainWindow.getScaledWidth()", "client.currentScreen.width");
  t = t.replaceAll("client.mainWindow.getScaledHeight()", "client.currentScreen.height");
  t = t.replaceAll("client.mainWindow.getWidth()", "client.displayWidth");
  t = t.replaceAll("client.mainWindow.getHeight()", "client.displayHeight");
  // ⑧c `mouseClicked` 在 1.12.2 收 int（1.13.2 起是 double）⇒ 缩放尺寸那两处分母去掉 `.0`（否则 "possible lossy conversion from double to int"，实测）
  t = t.replaceAll("client.currentScreen.width / 2.0", "client.currentScreen.width / 2");
  t = t.replaceAll("client.currentScreen.height / 2.0", "client.currentScreen.height / 2");
  // ⑧d 点击证明：1.12.2 的 `GuiScreen.mouseClicked(int,int,int)` 是 **protected + void**（1.13 起才 `public boolean`）
  //   ⇒ 进程内**无法**合成点击。改走「真实点击的后端」`PlayerControllerMP.windowClick(...)`（javap：public），
  //   它正是 `GuiContainer.mouseClicked` 里一次真实点击最终调用的容器交互入口 ⇒ 等价证明真实 UI 事件路径可达。
  //   两处调用点（相位机 case 6 与 `gui` 意图）缩进不同，用行首缩进回填。
  t = t.replace(
    /^([ \t]*)guiClicked = client\.currentScreen\.mouseClicked\(\n[ \t]*client\.currentScreen\.width \/ 2, client\.currentScreen\.height \/ 2, 0\);[ \t]*$/gm,
    (_m, ind: string) =>
      `${ind}// 1.12.2：` + "`GuiScreen.mouseClicked(int,int,int)`" + ` 是 **protected + void**（1.13 起才 public boolean）\n` +
      `${ind}//   ⇒ 进程内无法合成点击，改走真实点击的**后端** PlayerControllerMP.windowClick(public)。\n` +
      `${ind}client.playerController.windowClick(player.openContainer.windowId, 0, 0, net.minecraft.inventory.ClickType.PICKUP, player);\n` +
      `${ind}guiClicked = true;`,
  );
  // ⑤ 聊天回包：ITextComponent 无 getString()
  t = t.replaceAll("event.getMessage().getString()", "event.getMessage().getUnformattedText()");
  // ⑥ Entity.getName() 在 1.12.2 直接返 String
  t = t.replaceAll("player.getName().getString()", "player.getName()");
  // ⑦ 实体 id：Entity 无 getType()
  t = t.replaceAll("ForgeRegistries.ENTITIES.getKey(e.getType())", "net.minecraft.entity.EntityList.getKey(e)");
  // ⑧ 能力字段名 / 键码取值名
  t = t.replaceAll("player.abilities", "player.capabilities");
  t = t.replaceAll(/client\.gameSettings\.(keyBind\w+)\.getKey\(\)/g, "client.gameSettings.$1.getKeyCode()");
  // 文件头：把「签名出处」那一行整行换成 1.12.2 的口径（否则产物会谎称自己的证据来自 1.13.2）
  t = t.replace(
    /签名出处 = javap 实测（forge-1\.13\.2[^\n]*/,
    "签名出处 = javap 实测（`forgeBin-1.12.2-14.23.5.2847.jar`（**FG2.3 的 MCP 命名 + Forge 合并件**，本机 `.gradle/caches/minecraft/net/minecraftforge/forge/1.12.2-14.23.5.2847/stable/39/`））。" +
      "改写表 = rewriteForForgeLegacy → **applyForgeMCP132 + applyForgeMCP1122**（**MCP 命名层**，与 1.14+ 的 mojmap 完全不同源；1.12.2 在 132 之上再退一层）。" +
      "本档八处 javap 分叉：① `net.minecraftforge.fml.common.registry.ForgeRegistries`（**1.13 才搬 `net.minecraftforge.registries`**）；" +
      "② `net.minecraftforge.fml.common.eventhandler.SubscribeEvent`（**1.13 才搬 `eventbus.api`**）；" +
      "③ **无 `Minecraft.getInstance()`** ⇒ `Minecraft.getMinecraft()`；" +
      "④ **无 `mainWindow`** ⇒ 像素尺寸 `Minecraft.displayWidth/displayHeight` 公开字段、GUI 缩放尺寸 `GuiScreen.width/height`；" +
      "⑤ **截图无 Consumer 变体**：`net.minecraft.util.ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer)`（返 `ITextComponent`）；" +
      "⑥ **`ITextComponent` 无 `getString()`** ⇒ 聊天回包 `getUnformattedText()`；`Entity.getName()` **返 `String`**；" +
      "⑦ 实体 id 走 `net.minecraft.entity.EntityList.getKey(Entity)`（**`Entity` 无 `getType()`**）；" +
      "⑧ `EntityPlayer.capabilities`（**1.13 才改叫 `abilities`**）、`KeyBinding.getKeyCode()`、`GuiScreen.mouseClicked(int,int,int)`。" +
      "其余与 1.13.2 同（IBlockState / getStackInSlot / setKeyBindState / launchIntegratedServer(String,String,WorldSettings) / loadedEntityList / posX 公开字段）。",
  );
  return t;
}

/**
 * forge 档改写表：把 fabric（yarn 名 + fabric-api 事件）模板**机械改写**为 forge（mojmap/parchment 名 + Forge 事件总线）。
 * 每条都对应上面 `platformProfile('forge')` 里 javap 实测的签名；fabric 路径**不改一字**（已真机验证）。
 * NeoForge 1.20.1 同此表（包名仍是 `net.minecraftforge`）。
 */
export function rewriteForForge(java: string, version = "1.20.1"): string {
  // 注意：一律用 replaceAll / 全局正则 —— 同一调用在文件里出现多次（解释器 + 相位机两份），
  // 用 String.replace(string, string) 只会改**第一处**（实测：44 个编译错误里大半是这个原因，2026-09-29）。
  let s = java;
  // 导入面
  s = s.replace(/^import net\.fabricmc[^\n]*\n/gm, "");
  s = s.replaceAll("import net.minecraft.block.BlockState;", "import net.minecraft.world.level.block.state.BlockState;");
  s = s.replaceAll("import net.minecraft.client.MinecraftClient;", "import net.minecraft.client.Minecraft;");
  s = s.replaceAll("import net.minecraft.client.gui.Click;\n", "");
  s = s.replaceAll("import net.minecraft.client.gui.screen.ingame.InventoryScreen;", "import net.minecraft.client.gui.screens.inventory.InventoryScreen;");
  s = s.replaceAll("import net.minecraft.client.input.MouseInput;\n", "");
  s = s.replaceAll("import net.minecraft.client.network.ClientPlayerEntity;", "import net.minecraft.client.player.LocalPlayer;");
  s = s.replaceAll(
    "import net.minecraft.client.util.ScreenshotRecorder;",
    "import net.minecraft.client.Screenshot;\nimport net.minecraft.client.gui.screens.Screen;",
  );
  s = s.replaceAll("import net.minecraft.item.ItemStack;", "import net.minecraft.world.item.ItemStack;");
  s = s.replaceAll(
    "import net.minecraft.registry.Registries;",
    "import net.minecraft.core.registries.BuiltInRegistries;\nimport net.minecraftforge.client.event.ClientChatReceivedEvent;\nimport net.minecraftforge.common.MinecraftForge;\nimport net.minecraftforge.event.TickEvent;\nimport net.minecraftforge.eventbus.api.SubscribeEvent;",
  );
  s = s.replaceAll("import net.minecraft.util.math.BlockPos;", "import net.minecraft.core.BlockPos;");
  // 类型名
  s = s.replaceAll(/\bMinecraftClient\b/g, "Minecraft").replaceAll(/\bClientPlayerEntity\b/g, "LocalPlayer");
  // 挂接：fabric 事件 → forge 事件总线（实例 + @SubscribeEvent）
  s = s.replace(
    /ClientTickEvents\.END_CLIENT_TICK\.register\(PlaytestQaDriver::onInterpTick\);\n\s*ClientReceiveMessageEvents\.GAME\.register\(\(message, overlay\) -> lastGameMessage = message\.getString\(\)\);/,
    "INSTANCE = new PlaytestQaDriver();\n            MinecraftForge.EVENT_BUS.register(INSTANCE);",
  );
  s = s.replace(
    "ClientTickEvents.END_CLIENT_TICK.register(PlaytestQaDriver::onEndTick);",
    "INSTANCE = new PlaytestQaDriver();\n        MinecraftForge.EVENT_BUS.register(INSTANCE);",
  );
  s = s.replace(
    "public final class PlaytestQaDriver {\n",
    `public final class PlaytestQaDriver {

    private static PlaytestQaDriver INSTANCE;

    @SubscribeEvent
    public void onClientTick(TickEvent.ClientTickEvent event) {
        if (event.phase != TickEvent.Phase.END) {
            return;
        }
        onInterpTick(Minecraft.getInstance());
    }

    @SubscribeEvent
    public void onChat(ClientChatReceivedEvent event) {
        lastGameMessage = event.getMessage().getString();
    }
`,
  );
  // API 调用面（词元级，不依赖参数形状 —— 参数是表达式或跨行时也不会漏）
  s = s.replaceAll(/client\.options\.(\w+)\.setPressed\(/g, (_m, key: string) => `client.options.${FORGE_KEYS[key] ?? key}.setDown(`);
  s = s.replaceAll("client.world.", "client.level.");
  s = s.replaceAll("client.world == null", "client.level == null");
  s = s.replaceAll("client.world != null", "client.level != null");
  s = s.replaceAll("client.level.getEntities()", "client.level.entitiesForRendering()"); // 必须在上面那条 world→level 之后（顺序踩过：先跑这条会漏）
  s = s.replaceAll("player.getBlockPos().down()", "player.blockPosition().below()");
  s = s.replaceAll("player.getBlockPos()", "player.blockPosition()");
  s = s.replaceAll(".add(ax, ay, az)", ".offset(ax, ay, az)"); // mojmap BlockPos.offset(int,int,int)（javap 实测；yarn 叫 add）
  s = s.replaceAll("Registries.ENTITY_TYPE.getId(", "BuiltInRegistries.ENTITY_TYPE.getKey(");
  s = s.replaceAll("Registries.BLOCK.getId(", "BuiltInRegistries.BLOCK.getKey(");
  s = s.replaceAll("Registries.ITEM.getId(", "BuiltInRegistries.ITEM.getKey(");
  s = s.replaceAll("player.getInventory().getStack(", "player.getInventory().getItem(");
  // mojmap 的 BlockPos 不可变副本是 `immutable()`（yarn 才叫 toImmutable）——实测 neoforge 20.4.251 merged jar
  // 与 forge 1.20.1 mapped_official jar 两处 javap 均为 `public BlockPos immutable()`（2026-10-01）。
  s = s.replaceAll(".toImmutable()", ".immutable()");
  s = s.replaceAll("client.runDirectory", "client.gameDirectory");
  s = s.replaceAll("client.getFramebuffer()", "client.getMainRenderTarget()");
  s = s.replaceAll("ScreenshotRecorder.saveScreenshot(", "Screenshot.grab(");
  s = s.replaceAll("client.getNetworkHandler()", "client.getConnection()");
  s = s.replaceAll("client.getConnection().sendChatCommand(", "client.getConnection().sendCommand(");
  s = s.replaceAll(
    'client.createIntegratedServerLoader().start(WORLD, () -> log("[QA] open world cancelled"))',
    "client.createWorldOpenFlows().loadLevel(null, WORLD)",
  );
  s = s.replaceAll("player.sendAbilitiesUpdate()", "player.onUpdateAbilities()");
  s = s.replaceAll(/player\.getYaw\(\)/g, "player.getYRot()").replaceAll(/player\.setYaw\(/g, "player.setYRot(");
  s = s.replaceAll(/player\.getPitch\(\)/g, "player.getXRot()").replaceAll(/player\.setPitch\(/g, "player.setXRot(");
  s = s.replaceAll("player.isOnGround()", "player.onGround()");
  s = s.replaceAll(/client\.currentScreen/g, "client.screen");
  s = s.replaceAll(/mc\.currentScreen/g, "mc.screen"); // 相位机里的静态字段名也是 mc
  s = s.replaceAll(".mouseClicked(new Click(", ".mouseClicked(");
  s = s.replaceAll("new Click(", ""); // 模板里 new Click( 与 mouseClicked( 分两行 ⇒ 上面那条命中不了，这条兜底
  s = s.replaceAll(", new MouseInput(0, 0)), false)", ", 0)");
  s = s.replaceAll("client.screen.close()", "client.screen.onClose()");
  s = s.replaceAll("client.getWindow().getScaledWidth()", "client.getWindow().getGuiScaledWidth()");
  s = s.replaceAll("client.getWindow().getScaledHeight()", "client.getWindow().getGuiScaledHeight()");
  // 全限定名（模板里有几处写全了包名）
  s = s.replaceAll("net.minecraft.entity.Entity", "net.minecraft.world.entity.Entity");
  s = s.replaceAll("net.minecraft.client.gui.screen.Screen", "net.minecraft.client.gui.screens.Screen");
  s = s.replaceAll("net.minecraft.client.gui.screen.ingame.InventoryScreen", "net.minecraft.client.gui.screens.inventory.InventoryScreen");
  // newworld：把 fabric 档的 fail-closed 占位换成 forge 的 createFreshLevel 实现（签名逐条 javap 实测 2026-09-29）。
  // ⚠ 搜索串必须与 `javaSource` 模板里 `createWorldPlatform` 的实际文案**逐字**一致；1.16.5–1.18.2 的
  //   createFreshLevel 面未取证（LevelSettings/WorldDimensions 构造面不同）⇒ 保留 fail-closed 桩。
  if (!FORGE_NO_NEWWORLD_VERSIONS.includes(version)) {
    s = s.replaceAll(
      '        finish(false, "newworld：本档（fabric 基表，≤1.21.x）未取证造世界 API（createAndStart / LevelInfo / GeneratorOptions 构造面）——请先在客户端建一次世界再复用（用 --quickPlaySingleplayer / enterWorld），或先取证后补本钩子");',
      `        try {
            // 必须丢到渲染线程的下一 tick：createFreshLevel 内部走 loadWorldDataBlocking（同步阻塞渲染线程）
            // + minecraft.doWorldLoad —— 直接在事件处理器里调会把渲染线程锁死（实测：此后日志静默、世界只剩 session.lock）。
            client.execute(() -> {
                try {
                    client.createWorldOpenFlows().createFreshLevel(
                        name,
                        new net.minecraft.world.level.LevelSettings(name, net.minecraft.world.level.GameType.CREATIVE, false,
                            net.minecraft.world.Difficulty.NORMAL, true, new net.minecraft.world.level.GameRules(),
                            net.minecraft.world.level.WorldDataConfiguration.DEFAULT),
                        net.minecraft.world.level.levelgen.WorldOptions.defaultWithRandomSeed(),
                        ra -> new net.minecraft.world.level.levelgen.WorldDimensions(
                            ra.registryOrThrow(net.minecraft.core.registries.Registries.LEVEL_STEM)));
                    log("[QA] newworld: createFreshLevel 已执行（渲染线程下一 tick）");
                } catch (Throwable t) {
                    log("[QA] newworld 失败：" + t);
                }
            });
            log("[QA] newworld: 已排队创建 " + name + "（渲染线程下一 tick 执行；后续步骤留 wait 即可）");
        } catch (Throwable t) {
            log("[QA] newworld 失败：" + t);
        }`,
    );
  }
  if (version === "1.20.4") {
    s = applyWorldOpenFlows1204Plus(s);
  } else if (version !== "1.20.1" && !FORGE_LEGACY_VERSIONS.includes(version)) {
    s = applyWorldOpenFlows1206Plus(s);
  }
  return s;
}

/**
 * forge 早期档（1.16.5 / 1.17.1 / 1.18.2 / 1.19.4）改写表：**= forge 表 + 逐档旧 API 面**。
 * 每条都对应 `PLAYTEST_VERIFIED_TIER` 里该档 javap 实测的签名（jar 取自本机 `.gradle/caches/forge_gradle`）。
 */
/**
 * forge 早期档（1.13.2 / 1.14.4 / 1.15.2 / 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4）改写表：
 * **= forge 表 + 逐档旧 API 面**。每条都对应 `PLAYTEST_VERIFIED_TIER` 里该档 javap 实测的签名
 * （jar 取自本机 `.gradle/caches/forge_gradle` 缓存）。
 */
export function rewriteForForgeLegacy(java: string, version: string): string {
  let s = rewriteForForge(java, version);
  // Java 8 运行期档（1.13.2 / 1.14.4 / 1.15.2 / 1.16.5）：库面收敛（模板用了 Java 11 的 Path.of / Files.writeString）
  if (JAVA8_RUNTIME_VERSIONS.includes(version)) {
    s = applyJava8LibSwaps(s);
  }

  // ═ 1.12.2：MCP 命名层 + 更老一层（applyForgeMCP1122；Forge 三包的 1.12.2 位置 / 无 getInstance / 无 mainWindow / 截图无 Consumer …）══
  if (version === "1.12.2") {
    s = applyForgeMCP132(s);
    s = applyForgeMCP1122(s);
    if (FORGE_NO_NEWWORLD_VERSIONS.includes(version)) {
      s = s.replaceAll("本档（fabric 基表，≤1.21.x）未取证造世界 API", `本档（forge ${version}）未取证造世界 API`);
    }
    return s;
  }

  // ═ 1.13.2：整套 MCP 命名层，独立分派（其余分支不适用）══
  if (version === "1.13.2") {
    s = applyForgeMCP132(s);
    if (FORGE_NO_NEWWORLD_VERSIONS.includes(version)) {
      s = s.replaceAll("本档（fabric 基表，≤1.21.x）未取证造世界 API", `本档（forge ${version}）未取证造世界 API`);
    }
    return s;
  }

  // ═ 1.19.4：与 1.20.1 基本同形，唯一差异是 onGround 名 ══
  if (version === "1.19.4") {
    s = s.replaceAll("player.onGround()", "player.isOnGround()");
    return s;
  }

  // ═ 1.17.1 / 1.18.2：现代 mojmap 名 + 旧注册表/进世界/命令面 ══
  if (version === "1.17.1" || version === "1.18.2") {
    s = s.replaceAll(
      'client.getConnection().sendCommand(command.startsWith("/") ? command.substring(1) : command)',
      'client.player.chat(command.startsWith("/") ? command : "/" + command)',
    );
    s = s.replaceAll("client.createWorldOpenFlows().loadLevel(null, WORLD)", "client.loadLevel(WORLD)");
    s = s.replaceAll("import net.minecraft.core.registries.BuiltInRegistries;", "import net.minecraft.core.Registry;");
    s = s.replaceAll("BuiltInRegistries.ENTITY_TYPE.getKey(", "Registry.ENTITY_TYPE.getKey(");
    s = s.replaceAll("BuiltInRegistries.BLOCK.getKey(", "Registry.BLOCK.getKey(");
    s = s.replaceAll("BuiltInRegistries.ITEM.getKey(", "Registry.ITEM.getKey(");
    s = s.replaceAll("player.onGround()", "player.isOnGround()");
    return s;
  }

  // ═ 1.14.4 / 1.15.2 / 1.16.5：旧 mojmap 命名族（共用包名面）══
  // 包名（1.17 大批改名之前）
  s = s.replaceAll("import net.minecraft.world.level.block.state.BlockState;", "import net.minecraft.block.BlockState;");
  s = s.replaceAll(
    "import net.minecraft.client.gui.screens.inventory.InventoryScreen;",
    "import net.minecraft.client.gui.screen.inventory.InventoryScreen;",
  );
  s = s.replaceAll("import net.minecraft.client.player.LocalPlayer;", "import net.minecraft.client.entity.player.ClientPlayerEntity;");
  s = s.replaceAll("import net.minecraft.client.Screenshot;", "import net.minecraft.util.ScreenShotHelper;");
  s = s.replaceAll("import net.minecraft.client.gui.screens.Screen;", "import net.minecraft.client.gui.screen.Screen;");
  s = s.replaceAll("import net.minecraft.world.item.ItemStack;", "import net.minecraft.item.ItemStack;");
  s = s.replaceAll("import net.minecraft.core.registries.BuiltInRegistries;", "import net.minecraft.util.registry.Registry;");
  s = s.replaceAll("import net.minecraft.core.BlockPos;", "import net.minecraft.util.math.BlockPos;");
  s = s.replaceAll(/\bLocalPlayer\b/g, "ClientPlayerEntity");
  s = s.replaceAll("BuiltInRegistries.ENTITY_TYPE.getKey(", "Registry.ENTITY_TYPE.getKey(");
  s = s.replaceAll("BuiltInRegistries.BLOCK.getKey(", "Registry.BLOCK.getKey(");
  s = s.replaceAll("BuiltInRegistries.ITEM.getKey(", "Registry.ITEM.getKey(");
  s = s.replaceAll("net.minecraft.client.gui.screens.Screen", "net.minecraft.client.gui.screen.Screen");
  s = s.replaceAll("net.minecraft.world.entity.Entity", "net.minecraft.entity.Entity");
  // 命令 / 自动进世界：1.14.4–1.16.5 **都没有** `ClientPacketListener#sendCommand`（1.19 才有）与 `WorldOpenFlows`（1.19+）
  //   ⇒ 命令走 `LocalPlayer.chat("/…")`；进世界先落成 1.16.5 的 `loadLevel(WORLD)`，1.14.4/1.15.2 再由 applyForgeOldMojmapLegacy 换名。
  s = s.replaceAll(
    'client.getConnection().sendCommand(command.startsWith("/") ? command.substring(1) : command)',
    'client.player.chat(command.startsWith("/") ? command : "/" + command)',
  );
  s = s.replaceAll("client.createWorldOpenFlows().loadLevel(null, WORLD)", "client.loadLevel(WORLD)");

  if (version === "1.14.4" || version === "1.15.2") {
    // 截图：ScreenShotHelper.grab(File,int,int,Framebuffer,Consumer)；窗口尺寸取 MainWindow
    s = s.replaceAll("client.getWindow().getFramebufferWidth()", "client.getWindow().getWidth()");
    s = s.replaceAll("client.getWindow().getFramebufferHeight()", "client.getWindow().getHeight()");
    s = s.replaceAll(
      "Screenshot.grab(client.gameDirectory, client.getMainRenderTarget(), ",
      "ScreenShotHelper.grab(client.gameDirectory, client.getWindow().getWidth(), client.getWindow().getHeight(), client.getMainRenderTarget(), ",
    );
    s = s.replaceAll("player.getInventory().getItem(", "player.inventory.getItem(");
    s = s.replaceAll("player.getAbilities()", "player.abilities");
    s = s.replaceAll(/(\w+)\.getYRot\(\)/g, "$1.yRot");
    s = s.replaceAll(/(\w+)\.getXRot\(\)/g, "$1.xRot");
    s = s.replaceAll(/(\w+)\.setYRot\(([^;]*)\);/g, "$1.yRot = $2;");
    s = s.replaceAll(/(\w+)\.setXRot\(([^;]*)\);/g, "$1.xRot = $2;");
    // 1.14.4 / 1.15.2：朝向/落地/位置/窗口/进世界等（1.14.4 另换 world/currentScreen/gameSettings/gameDir/mainWindow）
    s = applyForgeOldMojmapLegacy(s, version);
  } else {
    // 1.16.5
    s = s.replaceAll("client.getWindow().getFramebufferWidth()", "client.getWindow().getWidth()");
    s = s.replaceAll("client.getWindow().getFramebufferHeight()", "client.getWindow().getHeight()");
    s = s.replaceAll(
      "Screenshot.grab(client.gameDirectory, client.getMainRenderTarget(), ",
      "ScreenShotHelper.grab(client.gameDirectory, client.getWindow().getWidth(), client.getWindow().getHeight(), client.getMainRenderTarget(), ",
    );
    s = s.replaceAll("player.getInventory().getItem(", "player.inventory.getItem(");
    s = s.replaceAll("player.getAbilities()", "player.abilities");
    s = s.replaceAll(/(\w+)\.getYRot\(\)/g, "$1.yRot");
    s = s.replaceAll(/(\w+)\.getXRot\(\)/g, "$1.xRot");
    s = s.replaceAll(/(\w+)\.setYRot\(([^;]*)\);/g, "$1.yRot = $2;");
    s = s.replaceAll(/(\w+)\.setXRot\(([^;]*)\);/g, "$1.xRot = $2;");
    s = s.replaceAll("player.onGround()", "player.isOnGround()");
  }

  // 未取证造世界的档：把 fail-closed 桩里的档位标签从 "fabric 基表" 改成 "forge <ver>"（不改机制，只改披露）。
  if (FORGE_NO_NEWWORLD_VERSIONS.includes(version)) {
    s = s.replaceAll("本档（fabric 基表，≤1.21.x）未取证造世界 API", `本档（forge ${version}）未取证造世界 API`);
  }
  return s;
}

/**
 * MC 1.20.4 起 `WorldOpenFlows` 面改写（javap 实测 2026-10-01；**forge 1.20.4 与 neoforge 1.20.4 同 MC ⇒ 共用**）：
 *   ① `loadLevel(Screen,String)` **已删** ⇒ 现成入口 `checkForBackupAndLoad(String, Runnable)`（public；Runnable = 读档失败/取消回调）。
 *   ② `createFreshLevel(String,LevelSettings,WorldOptions,Function,Screen)` 多一个尾参 Screen ⇒ 补 `, null`。
 * forge 1.20.4 依据：`forge-1.20.4-49.2.0-universal.jar` javap（MinecraftForge.EVENT_BUS / TickEvent.phase /
 *   ClientChatReceivedEvent.getMessage ✓，与 1.20.1 同形）+ neoforge 20.4.251 merged jar 的 vanilla 侧同名（同 MC 1.20.4）。
 */
export function applyWorldOpenFlows1204Plus(s: string): string {
  let t = s;
  t = t.replaceAll(
    "client.createWorldOpenFlows().loadLevel(null, WORLD)",
    'client.createWorldOpenFlows().checkForBackupAndLoad(WORLD, () -> log("[QA] open world failed"))',
  );
  t = t.replaceAll(
    "ra.registryOrThrow(net.minecraft.core.registries.Registries.LEVEL_STEM)));",
    "ra.registryOrThrow(net.minecraft.core.registries.Registries.LEVEL_STEM)), null);",
  );
  return t;
}

/**
 * MC 1.20.5+ 的 `WorldOpenFlows` 面改写（javap 实测 2026-10-01，neoforge 20.6.139 merged jar 的 vanilla 侧）：
 *   ① `loadLevel(Screen,String)` 与 `checkForBackupAndLoad(String,Runnable)` **都没了** ⇒ 入口改名 `openWorld(String, Runnable)`
 *      （public；Runnable = 读档失败/取消回调）。
 *   ② `createFreshLevel(String,LevelSettings,WorldOptions,Function,Screen)` 尾参 Screen 与 1.20.4 同形 ⇒ 补 `, null`。
 * 用于 neoforge 1.20.6+（rewriteForForge 的 version > 1.20.4 分支同用；当前仓库 forge 最小档 1.20.4 ⇒ 实际由 neoforge 走）。
 */
export function applyWorldOpenFlows1206Plus(s: string): string {
  let t = s;
  t = t.replaceAll(
    "client.createWorldOpenFlows().loadLevel(null, WORLD)",
    'client.createWorldOpenFlows().openWorld(WORLD, () -> log("[QA] open world failed"))',
  );
  t = t.replaceAll(
    "ra.registryOrThrow(net.minecraft.core.registries.Registries.LEVEL_STEM)));",
    "ra.registryOrThrow(net.minecraft.core.registries.Registries.LEVEL_STEM)), null);",
  );
  return t;
}

/**
 * neoforge（1.20.2+ 的 `net.neoforged` 命名层）改写表：**= forge 表 + 事件栈换包**。
 * 其余（mojmap 名、FML/注册面）与 forge 1.20.1 表逐条相同 —— vanilla 侧全套名已对 neoforge 20.4.251 的
 * merged jar 逐条 javap 实测（2026-10-01）：`Minecraft.getMainRenderTarget()`/`gameDirectory`(public final File)/
 * `createWorldOpenFlows()`/`screen`(public)/`Screenshot.grab(File,RenderTarget,Consumer<Component>)`/
 * `ClientLevel.entitiesForRendering()`/`BuiltInRegistries.ENTITY_TYPE`/`BlockPos.offset(int,int,int)`·`below()`/
 * `LocalPlayer.onUpdateAbilities()`·`onGround()`/`ClientPacketListener.sendCommand(String)`/
 * `Window.getGuiScaledWidth()`/`Inventory.getItem(int)`/`KeyMapping.setDown(boolean)`/`Screen.onClose()`/
 * `GuiEventListener.mouseClicked(double,double,int)`（default）/`InventoryScreen(Player)` 构造 —— 全部 ✓。
 * 事件栈差异（neoforge 20.4.251 + bus 7.2.0 实测）：
 *   - `net.neoforged.neoforge.common.NeoForge.EVENT_BUS`（public static final IEventBus；`IEventBus.register(Object)` ✓）
 *   - `net.neoforged.neoforge.client.event.ClientChatReceivedEvent#getMessage() -> Component` ✓
 *   - `net.neoforged.neoforge.event.TickEvent$ClientTickEvent` **带 `public final Phase phase`**（与 forge 同形，
 *     `phase != TickEvent.Phase.END` 判据照用；`Phase.START/END` 实测存在）——**注意**：该类在 `neoforge.event`
 *     包，**不在** `neoforge.client.event`（后者无 TickEvent；1.21.x 才改成 `client.event.ClientTickEvent$Post`）
 *   - `net.neoforged.bus.api.SubscribeEvent`（注解）/`net.neoforged.bus.api.Event`
 * ⚠ 本表产出的是**派生态**（由 forge 表 + 事件栈换包而来，非原生档）；各档真机验证状态见 `mcp-server/CHANGELOG.md`，首跑若报错请回灌。
 */
export function rewriteForNeoForge(java: string, version = "1.20.4"): string {
  let s = rewriteForForge(java, version);
  s = s.replaceAll(
    "import net.minecraftforge.client.event.ClientChatReceivedEvent;",
    "import net.neoforged.neoforge.client.event.ClientChatReceivedEvent;",
  );
  s = s.replaceAll("import net.minecraftforge.common.MinecraftForge;", "import net.neoforged.neoforge.common.NeoForge;");
  s = s.replaceAll("import net.minecraftforge.event.TickEvent;", "import net.neoforged.neoforge.event.TickEvent;");
  s = s.replaceAll("import net.minecraftforge.eventbus.api.SubscribeEvent;", "import net.neoforged.bus.api.SubscribeEvent;");
  s = s.replaceAll("MinecraftForge.EVENT_BUS", "NeoForge.EVENT_BUS");
  // 1.20.6+（javap 实测 neoforge 20.6.139 merged jar 2026-10-01）：`neoforge.event.TickEvent` 类**已不存在**，
  // 客户端 tick 事件迁到 `neoforge.client.event.ClientTickEvent$Pre/$Post`（**无 phase 字段**）⇒ 勾 $Post、去掉 phase 判据。
  if (version !== "1.20.1" && version !== "1.20.4") {
    s = s.replaceAll(
      "import net.neoforged.neoforge.event.TickEvent;",
      "import net.neoforged.neoforge.client.event.ClientTickEvent;",
    );
    s = s.replace(
      /public void onClientTick\(TickEvent\.ClientTickEvent event\) \{\n\s*if \(event\.phase != TickEvent\.Phase\.END\) \{\n\s*return;\n\s*\}/,
      "public void onClientTick(ClientTickEvent.Post event) {",
    );
  }
  // 1.21.9+（javap 实测：`minecraft_1.21.11_client.jar` 的 `gzc`/`gzd` = mojmap `MouseButtonEvent(double,double,MouseButtonInfo)` /
  //   `MouseButtonInfo(int,int)`；`_yarn-mojmap-pairs/yarn-mojmap-1.21.11.json` 实测 yarn `Click`→mojmap `MouseButtonEvent`、
  //   yarn `MouseInput`→mojmap `MouseButtonInfo`）：GUI 点击从 `(double,double,int)` 改成 `mouseClicked(MouseButtonEvent,boolean)`。
  //   forge 表已把 `new Click(…)` 拆成 `(x, y, 0)` ⇒ 这里再拼回 MouseButtonEvent 形态（与 26.x 的 apply26xxShared ① 同法，但**不**走 26.x 的截图/界面/造世界面）。
  if (version === "1.21.10" || version === "1.21.11") {
    s = s.replaceAll(
      "client.screen.mouseClicked(\n" +
        "                                client.getWindow().getGuiScaledWidth() / 2.0, client.getWindow().getGuiScaledHeight() / 2.0, 0)",
      "client.screen.mouseClicked(new MouseButtonEvent(\n" +
        "                                client.getWindow().getGuiScaledWidth() / 2.0, client.getWindow().getGuiScaledHeight() / 2.0, new MouseButtonInfo(0, 0)), false)",
    ).replaceAll(
      "client.screen.mouseClicked(\n" +
        "                                    client.getWindow().getGuiScaledWidth() / 2.0, client.getWindow().getGuiScaledHeight() / 2.0, 0)",
      "client.screen.mouseClicked(new MouseButtonEvent(\n" +
        "                                    client.getWindow().getGuiScaledWidth() / 2.0, client.getWindow().getGuiScaledHeight() / 2.0, new MouseButtonInfo(0, 0)), false)",
    );
    s = s.replace(
      "import net.minecraft.client.Minecraft;",
      "import net.minecraft.client.Minecraft;\nimport net.minecraft.client.input.MouseButtonEvent;\nimport net.minecraft.client.input.MouseButtonInfo;",
    );
  }
  return s;
}

/** javap 实测过签名的档（temporary_client_tick_driver 可出真代码）；其余档一律结构壳。 */
export const PLAYTEST_VERIFIED_TIER: ReadonlyArray<{ platform: string; version: string; mappings: string; asOf: string }> = [
  { platform: "fabric", version: "1.21.11", mappings: "yarn 1.21.11+build.6", asOf: "2026-09-29" },
  { platform: "quilt", version: "1.21.11", mappings: "yarn 1.21.11+build.6（QSL 差异面见 quilt/1.21.11）", asOf: "2026-09-29" },
  {
    platform: "forge",
    version: "1.20.1",
    mappings: "forge-1.20.1-47.4.0 mapped official（parchment 只加参数名/javadoc，方法/字段名与 official 一致）",
    asOf: "2026-09-29",
  },
  {
    platform: "forge",
    version: "1.20.4",
    mappings:
      "forge-1.20.4-49.2.0（parchment 2024.02.25-1.20.4；方法/字段名 = official）。" +
      "改写表 = forge 表 + **1.20.4 WorldOpenFlows 面**（见 applyWorldOpenFlows1204Plus：`loadLevel(Screen,String)` 已删 ⇒ `checkForBackupAndLoad(String,Runnable)`；`createFreshLevel` 多尾参 Screen）。" +
      "javap 实测 2026-10-01：`forge-1.20.4-49.2.0-universal.jar` 的 `MinecraftForge.EVENT_BUS`（public static final IEventBus）✓、" +
      "`TickEvent` 带 `public final Phase phase` + `TickEvent$ClientTickEvent(Phase)` ✓、`ClientChatReceivedEvent#getMessage()->Component` ✓（Forge 侧与 1.20.1 同形）；" +
      "vanilla 侧（同 MC 1.20.4）逐条见 neoforge 20.4.251 merged jar 的实测备注。",
    asOf: "2026-10-01",
  },
  {
    platform: "neoforge",
    version: "1.20.1",
    mappings: "同 forge 1.20.1（NeoForge 1.20.1 仍用 net.minecraftforge 包名；net.neoforged 自 1.20.2 起）",
    asOf: "2026-09-29",
  },
  {
    platform: "neoforge",
    version: "1.20.4",
    mappings:
      "neoforge 20.4.251 官方 merged jar + bus 7.2.0（javap 实测 2026-10-01；改写表 = forge 表 + 事件栈换包，见 rewriteForNeoForge）。" +
      "事件栈：`net.neoforged.neoforge.common.NeoForge.EVENT_BUS` ✓、`net.neoforged.bus.api.IEventBus.register(Object)` ✓、" +
      "`net.neoforged.neoforge.client.event.ClientChatReceivedEvent#getMessage()` ✓、" +
      "`net.neoforged.neoforge.event.TickEvent$ClientTickEvent`（**带 `Phase phase`**，`Phase.START/END` ✓；该类**不在** client.event 包——1.21.x 才改成 `client.event.ClientTickEvent$Post`）" +
      "、`net.neoforged.bus.api.SubscribeEvent` ✓。vanilla 侧（mojmap）全套与 forge 表一致（见 rewriteForNeoForge 注释逐条）。" +
      "入口：`net.neoforged.fml.common.Mod` **只有 `String value()`（无 dist 参数）**、`FMLEnvironment.dist` 存在 ⇒ 注册行放 @Mod 构造器内用 `FMLEnvironment.dist == Dist.CLIENT` 守。",
    asOf: "2026-10-01",
  },
  {
    platform: "neoforge",
    version: "1.20.6",
    mappings:
      "neoforge 20.6.139 merged jar（javap 实测 2026-10-01；改写表 = forge 表 + 事件栈换包，见 rewriteForNeoForge）。" +
      "事件栈：`net.neoforged.neoforge.common.NeoForge.EVENT_BUS` ✓、`net.neoforged.neoforge.client.event.ClientChatReceivedEvent#getMessage()->Component` ✓、" +
      "**`neoforge.event.TickEvent` 类已不存在**（javap 找不到）⇒ 客户端 tick 迁到 `net.neoforged.neoforge.client.event.ClientTickEvent$Pre/$Post`（**无 phase 字段**，勾 `$Post`）、" +
      "`net.neoforged.bus.api.SubscribeEvent` ✓。vanilla 侧（mojmap）与 forge 表一致，唯一 WorldOpenFlows 面差异见 applyWorldOpenFlows1206Plus：" +
      "`checkForBackupAndLoad(String,Runnable)` 也没了 ⇒ `openWorld(String,Runnable)`（javap：`public void openWorld(String, Runnable)`）；`createFreshLevel(...,Screen)` 尾参同 1.20.4 补 null。" +
      "入口：`net.neoforged.fml.loading.FMLEnvironment.dist == net.neoforged.api.distmarker.Dist.CLIENT` 守注册行（工程 build 编译通过，2026-10-01）。",
    asOf: "2026-10-01",
  },
  {
    platform: "neoforge",
    version: "1.21.1",
    mappings:
      "neoforge 21.1.248 merged jar（javap 实测 2026-10-01；与 1.20.6 同形，走 rewriteForNeoForge 的 1206+ 分支）。" +
      "事件栈：`net.neoforged.neoforge.event.TickEvent` 类**不存在**（javap 找不到）⇒ `net.neoforged.neoforge.client.event.ClientTickEvent$Pre/$Post`（**无 phase**，勾 `$Post`）、" +
      "`net.neoforged.neoforge.client.event.ClientChatReceivedEvent#getMessage()->Component` ✓、`net.neoforged.neoforge.common.NeoForge.EVENT_BUS` ✓、`net.neoforged.bus.api.SubscribeEvent` ✓。" +
      "WorldOpenFlows：`openWorld(String,Runnable)` ✓、`createFreshLevel(...,Screen)` 尾参 ✓（见 applyWorldOpenFlows1206Plus）。",
    asOf: "2026-10-01",
  },
  {
    platform: "fabric",
    version: "1.20.1",
    mappings: "yarn 1.20.1+build.10（与 1.21.11 差异只有 GUI 点击一处，见 rewriteForFabric1201）",
    asOf: "2026-09-29",
  },
  {
    platform: "fabric",
    version: "1.21.1",
    mappings: "yarn 1.21.1+build.2（与 1.21.11 只差 GUI 点击一处；自动进世界与 1.21.11 同形，见 rewriteForFabric1211）",
    asOf: "2026-09-30",
  },
  {
    platform: "fabric",
    version: "1.21.3",
    mappings:
      "yarn 1.21.3+build.2（与 1.21.11 只差 GUI 点击一处，见 rewriteForFabric1211；javap 实测 2026-10-01：`net.minecraft.client.gui.Click` / `net.minecraft.client.input.MouseInput` 在 1.21.3 **仍不存在**，`Element.mouseClicked(double,double,int)`，`IntegratedServerLoader.start(String,Runnable)` 与 1.21.x 同形）",
    asOf: "2026-10-01",
  },
  {
    platform: "fabric",
    version: "1.20.4",
    mappings:
      "yarn 1.20.4+build.3（与 1.21.11 只差 GUI 点击一处，见 rewriteForFabric1211；javap 实测 2026-10-01：无 Click/MouseInput，`Element.mouseClicked(double,double,int)`；⚠ `IntegratedServerLoader.start(String,Runnable)` 是 **1.21.x 形态**，**不要**套 1.20.1 的 `start(Screen,String)`）",
    asOf: "2026-10-01",
  },
  {
    platform: "fabric",
    version: "1.21.4",
    mappings:
      "yarn 1.21.4+build.8（与 1.21.11 只差 GUI 点击一处，见 rewriteForFabric1211；javap 实测 2026-10-01：无 Click/MouseInput，`Element.mouseClicked(double,double,int)`；`IntegratedServerLoader.start(String,Runnable)` ✓；`Vec3i.toShortString` ✓；ScreenshotRecorder/setPressed/sendAbilitiesUpdate/getScaledWidth/sendChatCommand/ClientWorld.getEntities/Registries 全部 ✓）",
    asOf: "2026-10-01",
  },
  {
    platform: "fabric",
    version: "1.21.8",
    mappings:
      "yarn 1.21.8+build.1（与 1.21.11 只差 GUI 点击一处，见 rewriteForFabric1211；javap 实测 2026-10-01：无 Click/MouseInput，`Element.mouseClicked(double,double,int)`；`IntegratedServerLoader.start(String,Runnable)` ✓）",
    asOf: "2026-10-01",
  },
  {
    platform: "fabric",
    version: "1.21.10",
    mappings:
      "yarn 1.21.10+build.3（**与 1.21.11 同形，无改写**；javap 实测 2026-10-01：`net.minecraft.client.gui.Click(double,double,MouseInput)` ✓、`MouseInput(int,int)` ✓、`Element.mouseClicked(Click,boolean)` ✓，其余面与 1.21.11 一致）",
    asOf: "2026-10-01",
  },
  // quilt 档走 quilt-loom + 同一 yarn 命名层（quilt-1.21.11 已真机验证同形）；下方映射名与 fabric 同版本共享 javap 证据。
  { platform: "quilt", version: "1.20.1", mappings: "yarn 1.20.1+build.10（同 fabric 1.20.1；quilt-loader 0.31 兼容面）", asOf: "2026-10-01" },
  { platform: "quilt", version: "1.20.4", mappings: "yarn 1.20.4+build.3（同 fabric 1.20.4）", asOf: "2026-10-01" },
  { platform: "quilt", version: "1.21.1", mappings: "yarn 1.21.1+build.3（quilt 脚手架钉值；与 fabric build.2 同名层）", asOf: "2026-10-01" },
  { platform: "quilt", version: "1.21.3", mappings: "yarn 1.21.3+build.2（同 fabric 1.21.3）", asOf: "2026-10-01" },
  { platform: "quilt", version: "1.21.4", mappings: "yarn 1.21.4+build.8（同 fabric 1.21.4）", asOf: "2026-10-01" },
  { platform: "quilt", version: "1.21.8", mappings: "yarn 1.21.8+build.1（同 fabric 1.21.8）", asOf: "2026-10-01" },
  { platform: "quilt", version: "1.21.10", mappings: "yarn 1.21.10+build.3（同 fabric 1.21.10）", asOf: "2026-10-01" },
  {
    platform: "fabric",
    version: "26.1.2",
    mappings:
      "**去混淆档**（26.1+ 官方客户端 jar 已是 Mojang 名，免 yarn/intermediary remap）+ fabric-api 0.155.3+26.1.2。" +
      "改写表 = rewriteForFabric26xx（= forge 表把 vanilla 名换到 mojmap，**保留 Fabric API 事件**）。" +
      "javap 实测 2026-10-03（client-26.1.2.jar 38 MB / sha1 4e618f09a0c649dde3fdf829df443ce0b8831e65）：" +
      "`Minecraft.getInstance/getMainRenderTarget/gameDirectory/screen/setScreen/getConnection/getWindow/createWorldOpenFlows` ✓、" +
      "`LocalPlayer` = `net.minecraft.client.player.LocalPlayer` ✓、`Screenshot.grab(File,RenderTarget,Consumer<Component>)` ✓、" +
      "`Options.keyUp/keyJump/keyAttack` + `KeyMapping.setDown(boolean)` ✓、`Inventory.getItem(int)` ✓、" +
      "`BuiltInRegistries.ENTITY_TYPE/BLOCK/ITEM` ✓、`ClientLevel.entitiesForRendering()` ✓、" +
      "`Player.getInventory/getAbilities/onUpdateAbilities` + `Abilities.flying/mayfly` ✓、" +
      "`Entity.getYRot/setYRot/getXRot/setXRot/onGround/getName/blockPosition/getType` ✓、" +
      "`ClientPacketListener.sendCommand(String)` ✓、`Component.getString()` ✓、`Window.getGuiScaledWidth/Height` ✓、" +
      "`Screen.onClose()` ✓、`InventoryScreen(Player)` ✓、`WorldOpenFlows.openWorld(String,Runnable)` ✓；" +
      "**26.1+ 特有**：`GuiEventListener.mouseClicked(MouseButtonEvent, boolean)` / `MouseButtonEvent(double,double,MouseButtonInfo)` / `MouseButtonInfo(int,int)` ✓；" +
      "Fabric API：`ClientTickEvents.END_CLIENT_TICK`(Event<EndTick>, `onEndTick(Minecraft)`) / `ClientReceiveMessageEvents.GAME`(`onReceiveGameMessage(Component,boolean)`) ✓。" +
      "**已取证（2026-10-03）**：`newworld` 造世界面 —— `createFreshLevel(String,LevelSettings,WorldOptions,Function<HolderLookup$Provider,WorldDimensions>,Screen)`、" +
      "`LevelSettings(String,GameType,LevelSettings$DifficultySettings,boolean,WorldDataConfiguration)`、`LevelSettings$DifficultySettings(Difficulty,boolean,boolean)`、" +
      "`WorldDataConfiguration.DEFAULT`、`WorldPresets.createNormalWorldDimensions(HolderLookup$Provider)`、`Minecraft.execute(Runnable)`（继承自 `BlockableEventLoop`）✓。" +
      "**前置**：被测工程须有 fabric-api（本仓 fabric/26.1.2 scaffold 未带）。",
    asOf: "2026-10-03",
  },
  {
    platform: "fabric",
    version: "26.1",
    mappings:
      "**去混淆档**（26.1+ 官方客户端 jar 已是 Mojang 名，免 yarn/intermediary remap）。" +
      "javap 实测 2026-10-03（client-26.1.jar 38 113 398 B / sha1 191771837687b766537a8c4607cb6fad79c533a1）：" +
      "与 26.1.2 的**本驱动用到的成员逐条同形**（`GuiEventListener.mouseClicked(MouseButtonEvent,boolean)`、" +
      "`WorldOpenFlows.openWorld(String,Runnable)`、`KeyMapping.setDown(boolean)`、" +
      "`Minecraft.getMainRenderTarget/gameDirectory/createWorldOpenFlows`、`Screenshot.grab(File,RenderTarget,Consumer)`、" +
      "`BuiltInRegistries.ENTITY_TYPE/BLOCK/ITEM`、`MouseButtonEvent/MouseButtonInfo` …… 均 ✓；未出现 26.2+ 的 `getMainRenderTarget` 删除）。" +
      "⇒ 与 26.1.2 共用 rewriteForFabric26xx。**前置**：被测工程须有 fabric-api（26.1.x 线；0.155.3+26.1.2 已在 26.1.2 实测）。**newworld 造世界面已取证**（同 26.1.2；`createFreshLevel`/`openWorld` 五档逐条同形）。",
    asOf: "2026-10-03",
  },
  {
    platform: "fabric",
    version: "26.1.1",
    mappings:
      "**去混淆档**。javap 实测 2026-10-03（client-26.1.1.jar 38 113 231 B / sha1 377031a9e733ba8ab4d355959a8f6fb8eb707556）：" +
      "本驱动用到的成员与 26.1 / 26.1.2 **逐条同形**（patch 级差异，无 API 面变化）⇒ 共用 rewriteForFabric26xx。前置/未取证同 26.1。",
    asOf: "2026-10-03",
  },
  {
    platform: "fabric",
    version: "26.2",
    mappings:
      "**去混淆档 + 26.2 截图/界面 API 变更**。javap 实测 2026-10-03（client-26.2.jar 39 193 383 B / sha1 2dc72797acbc1b63fc16a11c4ac393605f453754）：" +
      "**`Minecraft.getMainRenderTarget()` 已删除** ⇒ 截图必须走 `Screenshot.grab(Minecraft, boolean)`（boolean = panoramic，传 `false`；**26.1.x 无此重载**）；" +
      "**`Minecraft.screen` 字段与 `Minecraft.setScreen(Screen)` 也已删除** ⇒ 界面状态移到 `net.minecraft.client.gui.Gui`（经 `Minecraft.gui`）：" +
      "`Gui.screen() -> Screen` / `Gui.setScreen(Screen)`（26.1.x 无此二成员）⇒ 驱动把 `client.screen`→`client.gui.screen()`、`client.setScreen(x)`→`client.gui.setScreen(x)`。" +
      "3 参 `Screenshot.grab(File,RenderTarget,Consumer)` 仍在但没法拿到 RenderTarget。其余面（mouseClicked(MouseButtonEvent,boolean) / openWorld / " +
      "`BuiltInRegistries.ENTITY_TYPE/BLOCK/ITEM` / MouseButtonEvent / MouseButtonInfo / KeyMapping.setDown）与 26.1 同形。" +
      "⇒ 走 rewriteForFabric26xx，其中 `m26(version) >= 2` 分支做上述两处换形。**前置**：被测工程须有 fabric-api。**newworld 造世界面已取证**（同 26.1.2）。",
    asOf: "2026-10-03",
  },
  {
    platform: "fabric",
    version: "26.3",
    mappings:
      "**去混淆档 + 26.2 截图/界面变更（26.3 沿用）**。javap 实测 2026-10-03（client-26.3.jar 41 483 720 B / sha1 e877b6a07acd633fb3bb475002175cec036e7b87）：" +
      "`getMainRenderTarget()` 仍不存在、`Screenshot.grab(Minecraft,boolean)` 在、`Minecraft.screen/setScreen` 仍不存在（界面状态在 `Gui.screen()/setScreen`）" +
      " ⇒ 同 26.2 分支。本驱动用到的注册表常量 `ENTITY_TYPE/BLOCK/ITEM` 仍在" +
      "（⚠ 26.3 把 `BLOCKSTATE_PROVIDER_TYPE` 改名 `BLOCK_STATE_PROVIDER_TYPE`、删了 `BLOCK_TYPE/DECORATED_POT_PATTERN`，**本驱动不用这些**）；" +
      "`GuiEventListener.mouseClicked(MouseButtonEvent,boolean)` / `openWorld` / `MouseButtonEvent` / `MouseButtonInfo` 同形。" +
      "⇒ 走 rewriteForFabric26xx（m26=3 ≥ 2 走截图 + 界面换形）。**前置**：被测工程须有 fabric-api。**newworld 造世界面已取证**（同 26.1.2）。",
    asOf: "2026-10-03",
  },
  {
    platform: "neoforge",
    version: "26.1",
    mappings:
      "**去混淆档**（NeoForge 26.1 工程无 mappings 配置；依赖 `implementation` 而非 `modImplementation`）。" +
      "改写表 = rewriteForNeoForge26xx（= forge 表换 vanilla 名到 mojmap + 换 NeoForge 26.x 事件栈）。" +
      "javap 实测 2026-10-03（neoforge-26.1.2.114-universal.jar + bus-8.0.5.jar + client-26.1.jar）：" +
      "`net.neoforged.neoforge.common.NeoForge.EVENT_BUS`(IEventBus) ✓、`net.neoforged.bus.api.IEventBus.register(Object)` ✓、" +
      "`net.neoforged.neoforge.client.event.ClientTickEvent$Post`（**无 phase 字段**）✓、" +
      "`net.neoforged.neoforge.client.event.ClientChatReceivedEvent.getMessage()->Component` ✓、`net.neoforged.bus.api.SubscribeEvent` ✓；" +
      "vanilla 侧（mojmap）与 fabric 26.1 表同形、26.1.x 无 `getMainRenderTarget` 删除。**newworld 造世界面已取证**（26.x 五档逐条同形）。",
    asOf: "2026-10-03",
  },
  {
    platform: "neoforge",
    version: "26.1.1",
    mappings:
      "**去混淆档**。javap 实测 2026-10-03：NeoForge 26.1 线（26.1.2.114 universal）事件栈与 vanilla（client-26.1.x，patch 级同形）均同 26.1 ⇒ 共用 rewriteForNeoForge26xx。未取证同 26.1。",
    asOf: "2026-10-03",
  },
  {
    platform: "neoforge",
    version: "26.1.2",
    mappings:
      "**去混淆档**（本仓 `neoforge/26.1` 规则树即此线）。javap 实测 2026-10-03（neoforge-26.1.2.114-universal.jar）：事件栈 = `NeoForge.EVENT_BUS` + " +
      "`ClientTickEvent$Post`（无 phase）+ `ClientChatReceivedEvent.getMessage()` + bus 8.0.5 的 `SubscribeEvent`；vanilla = client-26.1.2.jar（免 remap）。共用 rewriteForNeoForge26xx。未取证同 26.1。",
    asOf: "2026-10-03",
  },
  {
    platform: "neoforge",
    version: "26.2",
    mappings:
      "**去混淆档 + 26.2 截图/界面 API 变更**。javap 实测 2026-10-03（neoforge-26.2.0.88-universal.jar + bus-8.0.5.jar + client-26.2.jar）：" +
      "事件栈 `NeoForge.EVENT_BUS` ✓、`ClientTickEvent$Post`（无 phase，public 无参构造）✓、`ClientChatReceivedEvent.getMessage()->Component` ✓、" +
      "`IEventBus.register(Object)` ✓、`SubscribeEvent` ✓（与 26.1 同形）；vanilla 侧 = client-26.2（**无 `getMainRenderTarget`** ⇒ 截图走 `Screenshot.grab(client,false)`；" +
      "**无 `Minecraft.screen`/`setScreen`** ⇒ 界面状态走 `client.gui.screen()`/`client.gui.setScreen(x)`）。" +
      "⇒ rewriteForNeoForge26xx 的 m26≥2 分支生效。**newworld 造世界面已取证**（同 26.1.2）。",
    asOf: "2026-10-03",
  },
  {
    platform: "neoforge",
    version: "26.3",
    mappings:
      "**去混淆档 + 26.2 截图变更（26.3 沿用）**。javap 实测 2026-10-03（neoforge-**26.3.0.1-beta**-universal.jar + bus-8.0.5.jar + client-26.3.jar）：" +
      "⚠ **NeoForge 26.3 上游只有 beta 件**（26.3.0.0-beta / 26.3.0.1-beta；无 release 版）；事件栈 `NeoForge.EVENT_BUS` ✓、`ClientTickEvent$Post` ✓、" +
      "`ClientChatReceivedEvent.getMessage()` ✓、`IEventBus.register(Object)` ✓、`SubscribeEvent` ✓；vanilla = client-26.3（无 `getMainRenderTarget`、`Screenshot.grab(Minecraft,boolean)` 在、`ENTITY_TYPE/BLOCK/ITEM` 仍在）" +
      "⇒ rewriteForNeoForge26xx（m26=3≥2 截图换形）。**newworld 造世界面已取证**（同 26.1.2）。",
    asOf: "2026-10-03",
  },
  // ── 低版本补档（2026-10-03，逐条 javap 实测；jar 均取自本机缓存，免下载）──────────────────────────
  {
    platform: "fabric",
    version: "1.19.4",
    mappings:
      "yarn 1.19.4+build.2（本机缓存 ~/.gradle/caches/fabric-loom/1.19.4/.../minecraft-merged-named.jar）。" +
      "改写表 = fabric/1.20.1 表（rewriteForFabric1201）：① 无 Click/MouseInput，`Element.mouseClicked(double,double,int)` ✓；" +
      "② `IntegratedServerLoader.start(Screen,String)` ✓（javap 实测，与 1.20.1 同签名）；③ `net.minecraft.registry.Registries` ✓（1.19.3 起）；" +
      "④ `ScreenshotRecorder.saveScreenshot(File,Framebuffer,Consumer<Text>)` ✓；⑤ `GameOptions.forwardKey` ✓；`Screen.close()` ✓；" +
      "⑥ `ClientPlayNetworkHandler.sendChatCommand(String)` ✓（javap 实测）。",
    asOf: "2026-10-03",
  },
  {
    platform: "fabric",
    version: "1.18.2",
    mappings:
      "yarn 1.18.2+build.4（minecraft-merged-named.jar）。改写表 = rewriteForFabricLegacy：① 点击 `(double,double,int)`；" +
      "② 注册表**旧包** `net.minecraft.util.registry.Registry`（**无** `registry.Registries` 持有类）⇒ `Registry.X.getId(`；" +
      "③ 无 `IntegratedServerLoader` ⇒ `MinecraftClient.startIntegratedServer(String)`；④ 无 `sendChatCommand` ⇒ `ClientPlayerEntity.sendChatMessage(String)`；" +
      "⑤ `GameOptions.forwardKey` ✓（1.18.2 起改名）、`Screen.close()` ✓；`ScreenshotRecorder.saveScreenshot` ✓。" +
      "⑥ **无客户端消息事件**（`ClientReceiveMessageEvents` 属 `fabric-message-api-v1`，该模块在 FAPI 0.77.0+1.18.2 的依赖表里**不存在**，" +
      "最早带它的是 0.87.2+1.19.4）⇒ 摘掉聊天注册行，`goto parsed` 靠 `<runDir>/logs/latest.log` 的 `[CHAT]` 行兜底。" +
      "**编译验证 = JDK 17 javac（`--release 17`）对 1.18.2 named jar + FAPI 替身（`Event`/`ClientTickEvents`，形状取自真 1.14.4/1.16.5 模块 jar 的 javap）通过**。",
    asOf: "2026-10-03",
  },
  {
    platform: "fabric",
    version: "1.17.1",
    mappings:
      "yarn 1.17.1+build.65（minecraft-mapped.jar）。= 1.18.2 表 + ⑤ `GameOptions` 键名为**旧形** `keyForward/keyJump/keyAttack/keySprint/…`（javap 实测）" +
      "+ `Screen` **无** `close()` ⇒ 关屏 `client.setScreen(null)`；`Entity.setYaw/setPitch/getYaw()/getPitch()` ✓（1.17.1 起）。" +
      "**同 1.18.2 第 ⑥ 条**：无客户端消息事件（FAPI 0.46.1+1.17 依赖表里无 `fabric-message-api-v1`）⇒ 聊天注册已摘。" +
      "**编译验证 = JDK 17 javac（`--release 16`）对 1.17.1 named jar + FAPI 替身（`Event`/`ClientTickEvents`）通过**。",
    asOf: "2026-10-03",
  },
  {
    platform: "fabric",
    version: "1.16.5",
    mappings:
      "yarn 1.16.5+build.10（minecraft-mapped.jar）。= 1.17.1 表 + ① 截图类 `net.minecraft.client.util.ScreenshotUtils.saveScreenshot(File,int,int,Framebuffer,Consumer)`" +
      "（**多 width/height 两参**，取 `Window.getFramebufferWidth/Height()`）；② `MinecraftClient` **无** `setScreen` ⇒ `openScreen`；" +
      "③ `Entity` yaw/pitch 是**公开字段**（无 setYaw/setPitch/getYaw()）⇒ 赋值/直读。`Registry.BLOCK/ITEM/ENTITY_TYPE`（DefaultedRegistry）✓。" +
      "④ 运行期 JVM = Java 8 ⇒ `applyJava8LibSwaps`（`Path.of`→`Paths.get`、`Files.writeString`→`Files.write`）；" +
      "**编译验证 = JDK 8 javac 对 1.16.5 named jar + **真 yarn-remapped Fabric API 模块 jar** 通过**。" +
      "⑤ **无客户端消息事件**：FAPI 0.42.0+1.16 的依赖表里没有 `fabric-message-api-v1`（最早带它的是 0.87.2+1.19.4），" +
      "且该档的 remapped FAPI 模块 jar 里 0 个 `*ReceiveMessage*` 类 ⇒ 摘掉聊天注册行，`goto parsed` 靠 latest.log 的 `[CHAT]` 行兜底" +
      "（**旧记「1.16.5 走 `ClientReceiveMessageEvents.GAME`」是错的** —— 那是拿替身当出处验出来的，真模块里没有这个类）。",
    asOf: "2026-10-03",
  },
  {
    platform: "fabric",
    version: "1.14.4",
    mappings:
      "yarn 1.14.4+build.18（本机由 `fabric/1.14.4/scaffold` 的 Gradle 构建落盘：" +
      "`minecraft-1.14.4-mapped-net.fabricmc.yarn-1.14.4+build.18-v2.jar`）+ Fabric API 0.28.5+1.14（`fabric-lifecycle-events-v1` 1.2.1 / " +
      "`fabric-networking-api-v1` 1.0.1 / `fabric-api-base` 0.1.2 —— 模块 jar 由同一构建经 loom 重映射落盘）。改写表 = rewriteForFabricLegacy。" +
      "javap 实测 2026-10-03（逐条核过）：" +
      "**事件**：`net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents.END_CLIENT_TICK`（`Event<EndTick>`，`EndTick.onEndTick(MinecraftClient)`）✓ " +
      "—— 1.14.4 的 0.28.5 里**已有**该模块（**先前记的「只有 legacy `ClientTickCallback`」已证伪**）；" +
      "**无** `ClientReceiveMessageEvents`（`fabric-message-api-v1` 该版本不存在，实测该模块 jar 不在依赖里）⇒ 摘掉聊天注册行，`goto parsed` 靠 latest.log 兜底；" +
      "`MinecraftClient`：`getInstance/getFramebuffer/openScreen(Screen)/startIntegratedServer(String,String,LevelInfo)/getNetworkHandler` ✓、" +
      "**字段** `window`（无 `getWindow()`）/`currentScreen`/`player`/`world`/`options`/`runDirectory`/`inGameHud`/`interactionManager`，**无** `setScreen`；" +
      "`LevelInfo(long,GameMode,boolean,boolean,LevelGeneratorType)` + `GameMode.CREATIVE` + `LevelGeneratorType.DEFAULT` ✓；" +
      "`Entity`：**公开字段** `x/y/z/yaw/pitch/onGround`（**无** `getX/getY/getZ`，1.15 才有；**无** `isOnGround()`）、`getBlockPos()`/`getPos()`/`getName()`/`getType()` ✓；" +
      "`PlayerEntity`：**公开字段** `inventory`（**无** `getInventory()`）/`abilities` + `sendAbilitiesUpdate()` ✓；" +
      "`PlayerInventory.getInvStack(int)`（**不是** `getStack`）+ `selectedSlot` 公开 ✓；" +
      "`KeyBinding`：`setPressed` **不存在**（`pressed` 私有）⇒ 静态 `setKeyPressed(InputUtil$KeyCode,boolean)` + `getDefaultKeyCode()` ✓、" +
      "`GameOptions` 键名 = 旧形 `keyForward/keyBack/keyLeft/keyRight/keyJump/keySneak/keySprint/keyAttack/keyUse`；" +
      "`Registry.BLOCK/ITEM/ENTITY_TYPE.getId(T)`（`net.minecraft.util.registry.Registry`）✓；`ClientWorld.getEntities()` ✓；" +
      "`ScreenshotUtils.method_1659(File,int,int,Framebuffer,Consumer<Text>)`（**方法名仍是混淆形**）+ `Window.getFramebufferWidth/Height()`/`getScaledWidth/Height()` ✓；" +
      "`BlockPos.up()/down()/add(int,int,int)/toImmutable()`（**无** `below()/above()/immutable()`），`Vec3i` **无** `toShortString()` ⇒ `toString()`；" +
      "`Text.getString()` ✓；`ClientPlayerEntity.sendChatMessage(String)` ✓；`Screen.mouseClicked(double,double,int)`（**无** Click/MouseInput）+ `onClose()` ✓。" +
      "**运行期 JVM = Java 8** ⇒ 过 `applyJava8LibSwaps`。**编译验证 = JDK 8 javac 对上述真 jar 编译通过**（本档不用桩）。",
    asOf: "2026-10-03",
  },
  {
    platform: "quilt",
    version: "1.19.4",
    mappings: "yarn 1.19.4+build.2（quilt-loom 缓存同名 jar）；同 fabric 1.19.4（rewriteForFabric1201，Fabric API 事件面）。",
    asOf: "2026-10-03",
  },
  {
    platform: "quilt",
    version: "1.18.2",
    mappings: "yarn 1.18.2+build.4（quilt-loom 缓存同名 jar）；同 fabric 1.18.2（rewriteForFabricLegacy）。",
    asOf: "2026-10-03",
  },
  {
    platform: "forge",
    version: "1.19.4",
    mappings:
      "forge-1.19.4-45.4.0（parchment 2023.06.26；方法/字段名 = official）。改写表 = rewriteForForgeLegacy。" +
      "javap 实测（本机缓存 `1.19.4-45.4.0_mapped_parchment_2023.06.26-1.19.4`）：与 1.20.1 基本同形 —— " +
      "`Minecraft.getMainRenderTarget()`/`gameDirectory` ✓、`createWorldOpenFlows().loadLevel(Screen,String)` ✓、" +
      "`WorldOpenFlows.createFreshLevel(String,LevelSettings,WorldOptions,Function<RegistryAccess,WorldDimensions>)` 4 参（无尾 Screen）✓、" +
      "`LevelSettings(String,GameType,boolean,Difficulty,boolean,GameRules,WorldDataConfiguration)` 7 参 ✓、" +
      "`BuiltInRegistries.ITEM/BLOCK/ENTITY_TYPE.getKey(...)` ✓、`ClientPacketListener.sendCommand(String)` ✓、`Screenshot.grab(File,RenderTarget,Consumer<Component>)` ✓、" +
      "`LocalPlayer.chat/onUpdateAbilities/getInventory/getAbilities/getYRot/setYRot` ✓。**唯一差异**：`Entity.onGround()` → `isOnGround()`（`onGround()` 是 1.20 才改的名）。",
    asOf: "2026-10-03",
  },
  {
    platform: "forge",
    version: "1.18.2",
    mappings:
      "forge-1.18.2-40.1.80（parchment 2022.08.21；方法/字段名 = official）。改写表 = rewriteForForgeLegacy。" +
      "javap 实测（本机缓存 `1.18.2-40.1.80_mapped_parchment_2022.08.21-1.18.2`）：① 无 `WorldOpenFlows` ⇒ `Minecraft.loadLevel(String)` ✓；" +
      "② 无 `ClientPacketListener.sendCommand` ⇒ `LocalPlayer.chat(String)` ✓；③ 注册表 = `net.minecraft.core.Registry` 静态字段（`BLOCK/ITEM/ENTITY_TYPE`，DefaultedRegistry，`getKey(T)`）✓；" +
      "④ `Entity.isOnGround()`（无 `onGround()`）✓；⑤ `Screenshot.grab(File,RenderTarget,Consumer<Component>)` ✓；`Minecraft.gameDirectory`/`getMainRenderTarget()` ✓。" +
      "**`newworld` 未取证**（LevelSettings/WorldDimensions 构造面不同）⇒ fail-closed。",
    asOf: "2026-10-03",
  },
  {
    platform: "forge",
    version: "1.17.1",
    mappings:
      "forge-1.17.1-37.1.1（mapped official；方法/字段名 = official）。改写表 = rewriteForForgeLegacy。与 1.18.2 **逐条同形**（javap 两档互证）：" +
      "`Minecraft.loadLevel(String)` ✓、`LocalPlayer.chat(String)` ✓、`net.minecraft.core.Registry` 静态字段 ✓、`Entity.isOnGround()` ✓、" +
      "`Screenshot.grab(File,RenderTarget,Consumer<Component>)` ✓。**`newworld` 未取证**⇒ fail-closed。",
    asOf: "2026-10-03",
  },
  {
    platform: "forge",
    version: "1.16.5",
    mappings:
      "forge-1.16.5-36.2.34（mapped official；**旧 mojmap**，1.17 大批改名之前）。改写表 = rewriteForForgeLegacy。" +
      "javap 实测（本机缓存 `1.16.5-36.2.34_mapped_official_1.16.5`）：① `net.minecraft.client.gui.screen.Screen`（**单数**）、`net.minecraft.client.gui.screen.inventory.InventoryScreen`；" +
      "② `net.minecraft.client.entity.player.ClientPlayerEntity`（`chat(String)` ✓）；③ `net.minecraft.client.network.play.ClientPlayNetHandler`；" +
      "④ `net.minecraft.util.registry.Registry`（`BLOCK/ITEM/ENTITY_TYPE` + `getKey(T)`）；⑤ 截图 `net.minecraft.util.ScreenShotHelper.grab(File,int,int,Framebuffer,Consumer)`（方法名同 grab，多 width/height 两参）；" +
      "⑥ `Minecraft.options`（类型 `net.minecraft.client.GameSettings`）+ `net.minecraft.client.settings.KeyBinding.setDown(boolean)`，键名仍 `keyUp/…`；" +
      "⑦ `Minecraft.loadLevel(String)`/`gameDirectory`/`getMainRenderTarget()`（返回 `shader.Framebuffer`）✓；" +
      "⑧ `Entity.yRot·xRot` **公开字段**（无 setYRot/getYRot()）+ `isOnGround()`；`PlayerEntity.inventory`/`abilities` **公开字段**（`inventory.getItem(int)`）✓。" +
      "**`newworld` 未取证**⇒ fail-closed。",
    asOf: "2026-10-03",
  },
  {
    platform: "forge",
    version: "1.15.2",
    mappings:
      "forge-1.15.2-31.2.50（**mapped official**，本机缓存 `1.15.2-31.2.50_mapped_official_1.15.2`）。改写表 = rewriteForForgeLegacy（旧 mojmap 族 + applyForgeOldMojmapLegacy）。" +
      "与 1.16.5 **同命名族**，只差三处（javap 实测）：① 自动进世界无 `loadLevel` ⇒ `Minecraft.selectLevel(String levelId, String levelName, WorldSettings)`；" +
      "`WorldSettings(long, GameType, boolean, boolean, WorldType)`，`WorldType.NORMAL`（**1.15.2 叫 NORMAL，1.14.4/1.13.2 叫 DEFAULT**）；" +
      "② `Entity.onGround` 是**公开字段**（1.16.5 才是 `isOnGround()`）；③ 无 `Entity.blockPosition()`（1.16 才加），且**也没有 `Entity.getPosition()`** ⇒ 现造 `new BlockPos(getX(),getY(),getZ())`。" +
      "其余同名同形：`util.registry.Registry` + `getKey(T)`、`util.ScreenShotHelper.grab(File,int,int,Framebuffer,Consumer)`（**grab 这个名字只有 1.15.2/1.16.5 有**）、" +
      "`Minecraft.level/screen/player/options/getWindow()/getMainRenderTarget()/gameDirectory` ✓、`ClientPlayerEntity.chat(String)/onUpdateAbilities()` ✓、" +
      "`ClientWorld.entitiesForRendering()` ✓、`GameSettings.keyUp…` + `KeyBinding.setDown(boolean)` ✓、`Entity.yRot·xRot` 公开字段 ✓、" +
      "`PlayerEntity.inventory`(`getItem(int)`)/`abilities` 公开字段（`PlayerAbilities.flying`）✓、`Screen.onClose()` ✓、" +
      "**BlockPos 是新面**：`below()/above()/immutable()/offset(int,int,int)`，`MainWindow.getGuiScaledWidth/Height()` ✓。**`newworld` 未取证**⇒ fail-closed。",
    asOf: "2026-10-03",
  },
  {
    platform: "forge",
    version: "1.14.4",
    mappings:
      "forge-1.14.4-28.2.26（**mapped_snapshot_20190719-1.14.3**，本机缓存；方法/字段名仍可读）。改写表 = rewriteForForgeLegacy（applyForgeOldMojmapLegacy 的 1.14.4 支）。" +
      "与 1.15.2 同族但**字段名整批更旧**（javap 实测）：`Minecraft.world`（非 level）/ `currentScreen`（非 screen）/ `gameSettings`（非 options）/ `gameDir`（非 gameDirectory）/" +
      "`mainWindow`（**public 字段，无 getWindow()**）/ `getFramebuffer()`（非 getMainRenderTarget()）/ `displayGuiScreen(GuiScreen)`（非 setScreen）/" +
      "`launchIntegratedServer(String,String,WorldSettings)`；`ClientWorld.getAllEntities()`（非 entitiesForRendering()）；`PlayerInventory.getStackInSlot(int)`（非 getItem(int)）；" +
      "`Entity.rotationYaw/rotationPitch/onGround` 公开字段 + `getPosition()` + **位置字段 `posX/posY/posZ`（无 getX/getY/getZ）**；" +
      "`GameSettings.keyBindForward…` + **`KeyBinding` 无 `setDown`** ⇒ 静态 `KeyBinding.setKeyBindState(Input,boolean)`（javap 实测）；" +
      "`PlayerAbilities.isFlying`（1.15.2 才改 flying）+ `EntityPlayerSP.sendPlayerAbilities()`（**1.14.4 无 onUpdateAbilities**）。" +
      "`util.registry.Registry`+`getKey`、**`util.ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer,Consumer)`（不是 grab）**、" +
      "**`EntityPlayerSP.sendChatMessage(String)`（不是 chat）**、`Screen.onClose()`/`mouseClicked(double,double,int)` 均在。" +
      "**BlockPos 是旧面**：`up()/down()/toImmutable()/add(int,int,int)`（1.15.2 才改 below/immutable/offset）；`MainWindow.getScaledWidth/Height()`（无 getGuiScaled*）。" +
      "**`newworld` 未取证**⇒ fail-closed。",
    asOf: "2026-10-03",
  },
  {
    platform: "forge",
    version: "1.12.2",
    mappings:
      "`forgeBin-1.12.2-14.23.5.2847.jar`（**FG2.3 的 MCP 命名 + Forge 合并件**，本机 `.gradle/caches/minecraft/net/minecraftforge/forge/1.12.2-14.23.5.2847/stable/39/`，**免下载**）。" +
      "改写表 = rewriteForForgeLegacy → **applyForgeMCP132 + applyForgeMCP1122**（**MCP 命名层**，与 1.14+ 的 mojmap 完全不同源；1.12.2 在 132 之上再退一层）。" +
      "**八处 javap 分叉**（JDK 8 `javap -p`，as-of 2026-10-04）：" +
      "① **Forge 三包的 1.12.2 位置**：`net.minecraftforge.fml.common.registry.ForgeRegistries`（1.13 才搬 `net.minecraftforge.registries`；`BLOCKS/ITEMS/ENTITIES` + `IForgeRegistry.getKey(V)` 同在）、" +
      "`net.minecraftforge.fml.common.eventhandler.SubscribeEvent`（1.13 才搬 `eventbus.api`；总线 `MinecraftForge.EVENT_BUS` 类型是 `fml.common.eventhandler.EventBus`）、`fml.common.gameevent.TickEvent`（同 1.13.2，有 `phase` 字段）；" +
      "② **无 `Minecraft.getInstance()`** ⇒ 静态 `Minecraft.getMinecraft()`（javap 只有 `public static Minecraft getMinecraft()`）；" +
      "③ **无 `mainWindow`**：窗口尺寸是公开 int 字段 `Minecraft.displayWidth/displayHeight`，GUI 缩放尺寸取 `GuiScreen.width/height`（`Minecraft` javap **无** mainWindow）；" +
      "④ **截图无 Consumer 变体**：`net.minecraft.util.ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer)`（javap 返 `ITextComponent`；5 参 Consumer 版 1.13.2 才有）⇒ 模板那条 `t -> {...});` 尾巴整个摘掉；" +
      "⑤ **`ITextComponent` 无 `getString()`**（只有 `getUnformattedText/getUnformattedComponentText/getFormattedText`）⇒ 聊天回包 `getUnformattedText()`；" +
      "⑥ **`Entity.getName()` 返 `String`**（1.13 起改返 ITextComponent）⇒ `player.getName().getString()` 收敛成 `player.getName()`；" +
      "⑦ 实体 id 走 `net.minecraft.entity.EntityList.getKey(Entity)`（**`Entity` 无 `getType()`**，1.13+ 才有）；" +
      "⑧ **`EntityPlayer.capabilities`**（`PlayerCapabilities.isFlying`，1.13 才改叫 `abilities`）、`KeyBinding.getKeyCode()`（1.13.2 已叫 `getKey()`）、`GuiScreen.mouseClicked(int,int,int)`（1.13.2 起是 `(double,double,int)`）。" +
      "**与 1.13.2 相同、无需再改的面**：`net.minecraft.block.state.IBlockState`（`World.getBlockState()` 返接口）、`net.minecraft.item.ItemStack`、`net.minecraft.util.math.BlockPos`（旧面 `add(int,int,int)/up()/down()/toImmutable()`）、`net.minecraft.client.gui.inventory.GuiInventory(EntityPlayer)`、`net.minecraft.client.entity.EntityPlayerSP`（`sendChatMessage(String)`/`sendPlayerAbilities()`）、" +
      "`World.loadedEntityList`（**无 getAllEntities()**）、`Entity.rotationYaw/rotationPitch/onGround` 公开字段 + 位置字段 `posX/posY/posZ`（**无 getX/getY/getZ**）、`getPosition()`、`InventoryPlayer.getStackInSlot(int)`、`Minecraft.getFramebuffer()/displayGuiScreen(GuiScreen)/launchIntegratedServer(String,String,WorldSettings)`、`WorldSettings(long,GameType,boolean,boolean,WorldType)`（**5 参**，`WorldType.DEFAULT`）。" +
      "**`newworld` 未取证**⇒ fail-closed（`FORGE_NO_NEWWORLD_VERSIONS`）。" +
      "**编译验证 = JDK 8 `javac` 对上面这只真构件 COMPILE_OK**（as-of 2026-10-04）；**真机未跑**。",
    asOf: "2026-10-04",
  },
  {
    platform: "forge",
    version: "1.13.2",
    mappings:
      "forge-1.13.2-25.0.223（**mapped_snapshot_20180921-1.13**，本机缓存）。改写表 = rewriteForForgeLegacy → **applyForgeMCP132**（**MCP 命名层**，与 1.14+ 的 mojmap 完全不同源）。" +
      "javap 实测：包名 `net.minecraft.block.state.IBlockState`（**`World.getBlockState()` 返的是接口 IBlockState，不是 BlockState 类**）/" +
      "`net.minecraft.item.ItemStack`/`net.minecraft.util.math.BlockPos`/`net.minecraft.entity.Entity`/" +
      "`net.minecraft.client.gui.GuiScreen`/`net.minecraft.client.gui.inventory.GuiInventory`/`net.minecraft.client.entity.EntityPlayerSP`/" +
      "`net.minecraft.client.network.NetHandlerPlayClient`/`net.minecraft.client.multiplayer.WorldClient`；" +
      "注册表用 `net.minecraftforge.registries.ForgeRegistries` 的 `BLOCKS/ITEMS/ENTITIES`（IForgeRegistry，**取值 `getKey(V)`**）；" +
      "`Minecraft.world/player/currentScreen/gameSettings/gameDir/mainWindow`（全公开字段，**无 getWindow()**）+ `getFramebuffer()` + `displayGuiScreen(GuiScreen)` + `launchIntegratedServer(String,String,WorldSettings)`；" +
      "`EntityPlayerSP.sendChatMessage(String)`（发命令，带前导 `/`）/ `sendPlayerAbilities()`（**不叫 onUpdateAbilities**）/ 公开字段 `inventory`(`InventoryPlayer.getStackInSlot(int)`)/`abilities`(`PlayerCapabilities.isFlying`)；" +
      "`Entity.rotationYaw/rotationPitch/onGround` 公开字段 + `getPosition()` + **位置字段 `posX/posY/posZ`（无 getX/getY/getZ）**；`GameSettings.keyBindForward…` + 静态 `KeyBinding.setKeyBindState(Input,boolean)`；" +
      "`GuiScreen.onGuiClosed()`（**不叫 onClose**）/`mouseClicked(double,double,int)`；**`util.ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer,Consumer)`（不是 grab）**；" +
      "**BlockPos 旧面**：`add(int,int,int)/up()/down()/toImmutable()`；`MainWindow.getScaledWidth/Height()`；`WorldClient` 取实体用公开字段 `loadedEntityList`（**无 getAllEntities()**）。" +
      "**`newworld` 未取证**⇒ fail-closed。",
    asOf: "2026-10-03",
  },
  {
    platform: "neoforge",
    version: "1.21.3",
    mappings:
      "rewriteForNeoForge（1.20.6+ 分支）。事件栈 javap 实测（`neoforge-21.1.248-universal.jar`，并 21.11.45/26.1.2 互证）：" +
      "`NeoForge.EVENT_BUS` ✓、`client.event.ClientTickEvent$Post` ✓（无 phase）、`client.event.ClientChatReceivedEvent.getMessage()` ✓；" +
      "vanilla（mojmap，同 MC 1.21.3）= 1.21.1 线（无 Click ⇒ `mouseClicked(double,double,int)`；`openWorld(String,Runnable)`）。",
    asOf: "2026-10-03",
  },
  {
    platform: "neoforge",
    version: "1.21.5",
    mappings: "同上（1.21.5 与 1.21.3/1.21.8 对 driver 用到的成员同形；事件栈由 21.1.248/21.11.45 两端夹住）。",
    asOf: "2026-10-03",
  },
  {
    platform: "neoforge",
    version: "1.21.8",
    mappings: "同 1.21.3（mc 1.21.8 线，无 Click）。",
    asOf: "2026-10-03",
  },
  {
    platform: "neoforge",
    version: "1.21.10",
    mappings:
      "rewriteForNeoForge + **1.21.9+ GUI 点击换形**：`mouseClicked(MouseButtonEvent,boolean)`（yarn `Click`→mojmap `MouseButtonEvent`、" +
      "`MouseInput`→`MouseButtonInfo`，见 `_yarn-mojmap-pairs/yarn-mojmap-1.21.11.json`；构造面 javap 实测 `gzc(double,double,gzd)` / `gzd(int,int)`）。" +
      "vanilla 1.21.10 = 1.21.11 线（`Minecraft.screen` 字段仍在、`getMainRenderTarget` 在）。",
    asOf: "2026-10-03",
  },
  {
    platform: "neoforge",
    version: "1.21.11",
    mappings:
      "同 1.21.10（`minecraft_1.21.11_client.jar` javap + `neoforge-21.11.45-universal.jar` 事件栈实测）。",
    asOf: "2026-10-03",
  },
];
/**
 * 意图空间定稿 v2（2026-10-01 用户审改）—— 口径单源见
 * `community_knowledge/authored/ingame-playtest-automation.md` §意图空间。
 * 这是 `in_jvm_player_agent` 模式发给 LLM 的**封闭意图菜单**（也是后续 Java 执行器的单一真源）：
 *   - `postcondition.kind` 是执行器要判的**唯一**一条（fail-closed；interact 的 expect 必填，杜绝"什么都没发生也算过"）；
 *   - `budgetTicks` 是**单意图** tick 上限（超限判红），全局预算仍由 `budgetTicks` 输入兜底；
 *   - `idempotent=false`（一次性）⇒ 失败**不得自动重试**，只许按 `fallback` 换意图；
 *   - `profiles` 缺省 = 所有档都列出；`tp` 只在 operator/creative 列出（strict_survival 禁列）。
 */
type PlaytestIntentSpec = {
  name: string;
  params: Array<{ name: string; type: string; required?: boolean; note?: string }>;
  pre: string[];
  postcondition: { kind: string; note: string };
  danger: "low" | "medium";
  budgetTicks: number;
  idempotent: boolean;
  fallback: string[];
  profiles?: Array<"strict_survival" | "operator" | "creative">;
};

export const PLAYTEST_INTENTS: readonly PlaytestIntentSpec[] = [
  {
    name: "walk_to",
    params: [
      { name: "x", type: "number", required: true },
      { name: "z", type: "number", required: true },
      { name: "tol", type: "number", note: "默认 3（走进房子场景建议 3–4；目标里显式给）" },
      { name: "max", type: "number", note: "默认 1200 tick；不给也会用预算列兜底" },
    ],
    pre: ["有世界 + 玩家"],
    postcondition: { kind: "distance_le_tol_and_moved_ge_min", note: "水平距离 ≤ tol ∧ 移动量 ≥ (起点→目标距离 − tol)（后半条防「本来就在那」假绿）" },
    danger: "low",
    budgetTicks: 1200,
    idempotent: true,
    fallback: ["find_and_goto{fly=1}", "look_at{target=pos} 换向后重试"],
  },
  {
    name: "look_at",
    params: [
      { name: "yaw", type: "number", note: "与 target 二选一" },
      { name: "pitch", type: "number", note: "与 target 二选一" },
      { name: "target", type: "string", required: false, note: "pos|x,y,z / block|id / entity|id；更实用形态" },
      { name: "tol", type: "number", note: "仅 target 形态，默认 2°" },
    ],
    pre: ["有玩家；target 形态需目标可解析"],
    postcondition: {
      kind: "angle_le_tol",
      note: "yaw/pitch 形态 = 两轴误差 ≤ 2°（绝对值设置 ⇒ 几乎必成、信息量低）；target 形态 = 目标可解析 ∧ 朝向角误差 ≤ tol ∧ 目标在视距内(≤128)",
    },
    danger: "low",
    budgetTicks: 60,
    idempotent: true,
    fallback: ["observe{radius} 确认目标是否存在"],
  },
  {
    name: "find_and_goto",
    params: [
      { name: "structure", type: "string", note: "structure|minecraft:village_plains 形式的三种形态之一" },
      { name: "block", type: "string" },
      { name: "entity", type: "string" },
      { name: "tol", type: "number", note: "默认 24" },
      { name: "fly", type: "number", note: "默认 1" },
      { name: "radius", type: "number", note: "block/entity 形态的最近匹配半径" },
      { name: "max", type: "number", note: "默认 9000 tick" },
    ],
    pre: ["有世界", "structure 形态允许 cmd（需 op）；block/entity 形态走 scan 最近匹配（限 radius，无需 op）"],
    postcondition: {
      kind: "reached_parsed_tol | block_found_and_reached | entity_found_and_reached",
      note: "按形态三选一：structure → reached_parsed_tol（到达解析坐标 tol 内，复用 goto parsed 的 arrived 判定）；block → block_found_and_reached（最近命中 ∧ 到位 ∧ onGround ∧ 目标位仍是该方块）；entity → entity_found_and_reached（最近命中 ∧ 到位）",
    },
    danger: "medium",
    budgetTicks: 9000,
    idempotent: true,
    fallback: ["tp{x,z}（仅 operator/creative）", "look_at{target} + 重试"],
  },
  {
    name: "mine",
    params: [
      { name: "blockId", type: "string", required: true },
      { name: "count", type: "number", note: "默认 1" },
      { name: "radius", type: "number", note: "目标选择半径（最近匹配优先）" },
      { name: "pos", type: "string", note: "可选：指定坐标" },
    ],
    pre: ["有世界", "目标选择 = 最近匹配优先且限 radius", "执行前快照（同 id 命中数，scan 计数）"],
    postcondition: {
      kind: "block_at_changed_and_count_decreased",
      note: "① block_at(目标pos) != blockId（单点）∧ ② 同 id 命中数较执行前减少 count（集合，scan 计数）",
    },
    danger: "medium",
    budgetTicks: 600,
    idempotent: false,
    fallback: ["找不到目标 → find_and_goto{block}", "工具缺失 → inventory{contains}"],
  },
  {
    name: "place",
    params: [
      { name: "blockId", type: "string", required: true },
      { name: "pos", type: "string", required: true },
    ],
    pre: ["背包含该方块", "目标位置可替换（空气/水）"],
    postcondition: { kind: "block_at_equals", note: "block_at(pos) == blockId" },
    danger: "medium",
    budgetTicks: 200,
    idempotent: false,
    fallback: ["没方块 → inventory{contains:id}", "位置不可替换 → stop"],
  },
  {
    name: "interact",
    params: [
      { name: "target", type: "string", required: true },
      { name: "pos", type: "string", required: true },
      { name: "expect", type: "string", required: true, note: "screen_present:Class | entity_gone:id | block_changed:pos,id（**必填**）" },
    ],
    pre: ["目标在范围内"],
    postcondition: { kind: "expect_only", note: "**只判 expect 指的那一条**（必填 ⇒ 无「什么都没发生也算过」的松口）" },
    danger: "medium",
    budgetTicks: 200,
    idempotent: false,
    fallback: ["observe{radius} 看目标当前状态后换意图"],
  },
  {
    name: "open_gui",
    params: [{ name: "how", type: "string", note: "inventory（自定 GUI 名 ⇒ 待实现）" }],
    pre: ["有世界"],
    postcondition: { kind: "screen_present_and_closed", note: "screen_present ∧ clicked=true ∧ closed=true（与 state.json 的 gui.{opened,class,clicked,closed} 字字对应）" },
    danger: "low",
    budgetTicks: 100,
    idempotent: true,
    fallback: ["screenshot{testId} 取证后 stop", "换 how"],
  },
  {
    name: "inventory",
    params: [
      { name: "slot", type: "number", note: "与 contains 二选一必填（都不给 = 无意义断言）" },
      { name: "contains", type: "string" },
    ],
    pre: ["有世界", "slot 与 contains 二选一必填"],
    postcondition: { kind: "inventory_assert", note: "断言成立（slot 的 itemId 匹配 / contains 命中）" },
    danger: "low",
    budgetTicks: 60,
    idempotent: true,
    fallback: ["screenshot{testId} 取证，交 LLM 换意图"],
  },
  {
    name: "observe",
    params: [
      { name: "radius", type: "number", note: "默认 64" },
      { name: "entities", type: "string" },
      { name: "blocks", type: "string" },
    ],
    pre: ["有世界"],
    postcondition: { kind: "scan_written", note: "结果写进证据 scan.entities / scan.blocks（类型化读数）；既是 LLM 感知入口，也是 find_and_goto{block|entity} 的实现底座（复用 scan）" },
    danger: "low",
    budgetTicks: 60,
    idempotent: true,
    fallback: ["缩小 radius 重试"],
  },
  {
    name: "screenshot",
    params: [{ name: "testId", type: "string", required: true }],
    pre: ["有世界"],
    postcondition: { kind: "screenshot_file_nonempty", note: "文件落在 <gameDir>/screenshots ∧ >0 B（大小门只防空文件；视觉判据另列=待选）" },
    danger: "low",
    budgetTicks: 60,
    idempotent: true,
    fallback: [],
  },
  {
    name: "wait",
    params: [
      { name: "ticks", type: "number", note: "与 until 二选一" },
      { name: "until", type: "string", note: "chunk | daylight" },
    ],
    pre: ["until 形态需有世界"],
    postcondition: { kind: "ticks_elapsed_or_cond", note: "经过指定 tick ／ 条件成立（区块就绪 / 白天）" },
    danger: "low",
    budgetTicks: 60,
    idempotent: true,
    fallback: ["stop"],
  },
  {
    name: "tp",
    params: [
      { name: "x", type: "number", required: true },
      { name: "z", type: "number", required: true },
      { name: "tol", type: "number", note: "默认 4" },
    ],
    pre: ["有世界 + 仅 capabilityProfile=operator/creative"],
    postcondition: { kind: "distance_le_tol_tp", note: "到达 x,z tol 内（dist ≤ tol）" },
    danger: "medium",
    budgetTicks: 200,
    idempotent: true,
    fallback: ["find_and_goto"],
    profiles: ["operator", "creative"],
  },
  {
    name: "stop",
    params: [],
    pre: [],
    postcondition: { kind: "driver_stops", note: "驱动器停接新轮（不关游戏，与长驻热重载一致）" },
    danger: "low",
    budgetTicks: 0,
    idempotent: true,
    fallback: [],
  },
];

/** 每轮喂给 LLM 的观测契约（封闭输入 ⇒ 可复现）。 */
const PLAYTEST_OBSERVATION_CONTRACT = {
  player: ["pos", "yaw", "pitch", "health", "food", "gameMode", "selectedSlot", "mainHand"],
  inventory: "摘要 + 命中",
  lastScan: "最近一次 scan（entities/blocks 命中表）",
  lastStep: { intent: "string", ok: "boolean", postcondition: "string（判过后置条件时 = 该 kind）", failure: "string（步级失败原因，如 goto_timeout / param_not_number）", detail: "string" },
  lastStepNote: "ok:true ⇒ postcondition 非空、failure 空；ok:false ⇒ 二者恰一非空（判了后置条件没过 = postcondition 非空；步级失败 = failure 非空）",
  remainingBudget: "tick + 意图数 + 总时长",
  availableIntents: "按 capabilityProfile 过滤后的意图名列表",
} as const;

const intentsForProfile = (profile: string): PlaytestIntentSpec[] =>
  PLAYTEST_INTENTS.filter((i) => !i.profiles || (i.profiles as readonly string[]).includes(profile));

/** in_jvm_player_agent 的封闭菜单契约（两条分支——真 driver / 结构壳——共用，防漂移）。 */
function buildIntentMenu(input: PlaytestDriverInput, profile: PlaytestCapabilityProfile) {
  const totalBudgetTicks = Number.isInteger(input.budgetTicks)
    ? Math.max(200, input.budgetTicks as number)
    : 36000; // 与真 driver 分支的 in_jvm 默认一致（LLM 会话 30 min）
  return {
    schema: "mc-skill/playtest-intent-menu@1",
    asOf: "2026-10-01",
    sourceOfTruth: "community_knowledge/authored/ingame-playtest-automation.md §意图空间（任务 B 设计定稿 v2）",
    capabilityProfile: profile,
    totalBudgetTicks,
    perIntentBudgetTicks: Object.fromEntries(PLAYTEST_INTENTS.map((i) => [i.name, i.budgetTicks])),
    forbidden: ["kill", "tnt", "fill"],
    observationContract: PLAYTEST_OBSERVATION_CONTRACT,
    intents: intentsForProfile(profile),
    mailbox: {
      request: "<evidenceDir>/intent.json",
      consumed: "<evidenceDir>/intent.done.json",
      shape: '{"intent": "<name>", "<param>": <value>, ...}（扁平一层；参数键白名单 = driver 的 INTENT_PARAM_KEYS）',
      observe: "<evidenceDir>/state.json → intentState / intents[] / lastIntent / scan.nearest / goto.arrived",
      endSession: '{"intent": "stop"}',
    },
    executionNote:
      "driver 侧执行器：菜单校验（不在菜单/禁列/档位不符一律判红）→ 复用原语展开（goto/scan/gui/assert/shot/wait/cmd）" +
      "→ 类型化后置条件 → 证据（{intent,params,ok,postcondition|failure,detail} 进 state.json 的 intents[] 与 rounds.jsonl 的 intentLog[]；" +
      "ok:true 只带 postcondition、ok:false 时失败原因进 failure 字段——不再挤占 postcondition）。" +
      "邮箱形态下**后置条件失败 = 记入 intentLog 并继续守候下一条**（失败不得自动重试，只许按本表 fallback 换意图；" +
      "协议违规与预算耗尽才停轮）；脚本形态（plan 里的 `intent` 步骤）失败仍一律判红停轮。",
  };
}

const isVerifiedTier = (platform: string, version: string) =>
  PLAYTEST_VERIFIED_TIER.some((t) => t.platform === platform && t.version === version);

const sanitizeId = (s: string) => s.replace(/[^A-Za-z0-9_-]/g, "");
const javaIdent = (s: string) => {
  const cleaned = sanitizeId(s).replace(/-/g, "_");
  return /^[A-Za-z_]/.test(cleaned) ? cleaned : `_${cleaned}`;
};

export function generatePlaytestDriver(input: PlaytestDriverInput): GeneratorResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const platform = String(input.platform ?? "").trim().toLowerCase();
  const version = String(input.version ?? "").trim();

  if (!platform) errors.push("platform 必填（forge | neoforge | fabric | quilt）。");
  else if (!(PLAYTEST_PLATFORMS as readonly string[]).includes(platform)) {
    errors.push(`未知 platform "${platform}"：只支持 forge | neoforge | fabric | quilt。`);
  }
  if (!version) errors.push("version 必填：传精确 Minecraft 版本（如 1.21.11），禁止默认 1.20.1。");
  else if (!exactMcVersion(version)) errors.push(`必须是精确 MC 版本（x.y.z / 26.x.y），收到 ${version}。`);
  else {
    const era = eraUpperBoundError(version, PLAYTEST_MAX_MINOR_26X);
    if (era) errors.push(era);
  }
  if (errors.length > 0) return { code: null, errors, warnings };

  const mode: PlaytestDriverMode = input.driverMode ?? "external_bridge";
  if (!(PLAYTEST_DRIVER_MODES as readonly string[]).includes(mode)) {
    return { code: null, errors: [`未知 driverMode "${mode}"：只支持 ${PLAYTEST_DRIVER_MODES.join(" | ")}。`], warnings };
  }
  const profile: PlaytestCapabilityProfile = input.capabilityProfile ?? "strict_survival";
  if (!(PLAYTEST_CAPABILITY_PROFILES as readonly string[]).includes(profile)) {
    return { code: null, errors: [`未知 capabilityProfile "${profile}"：只支持 ${PLAYTEST_CAPABILITY_PROFILES.join(" | ")}。`], warnings };
  }

  const modId = sanitizeId(input.modId?.trim() || "") || "examplemod";
  const pkg = `com.example.${javaIdent(modId)}`;
  const cls = toPascalCase(modId) || "ExampleMod";
  const post = input.postconditions?.length ? input.postconditions : (["inventory_contains", "marker_log"] as PlaytestPostcondition[]);
  const evidenceDir = input.evidenceDir?.trim() || "playtest-evidence/<runId>";
  const goal = input.goal?.trim() || "<一句话：本次要验证的模组功能>";

  const actions = {
    schemaNote:
      "BlackBoxPro /execute 骨架。参数名标 _unverified 的须先按桥 -sources.jar 的 ActionCatalog（或 /execute 实测）现核再跑；screenshot{testId,prefix} 已源码核实。",
    goal,
    capabilityProfile: profile,
    driverMode: mode,
    waitReady: { via: "GET /status", until: "ready == true", timeoutMs: 120000 },
    steps: [
      { action: "chat_command", params: { command: `give @s ${modId}:<item> 1` }, _unverified: ["params.command"] },
      { action: "wait", params: { ticks: 20 } },
      { action: "use_item", params: {}, _unverified: ["params 是否为空"] },
      { action: "query_inventory_slot", params: { slot: 36 } },
      { action: "query_player_state", params: {} },
      { action: "screenshot", params: { testId: "playtest-main", prefix: "after-use" } },
    ],
    postconditions: post,
    evidence: {
      dir: evidenceDir,
      calls: "calls.jsonl",
      screenshots: "screenshots/blackboxpro/<player>/<testId>/",
    },
    bridgeSafety: "桥无鉴权 + 通配绑定（0.0.0.0）⇒ 仅本机、短会话；调用侧只连 127.0.0.1。",
  };

  const readme = `# 游玩自测骨架（${mode} / ${platform} ${version}）

> 生成物为**结构壳**：桥契约与坑位以 \`community_knowledge/authored/ingame-playtest-automation.md\` 为准；API 名一律先 \`search_*_docs\` 核对。

## 前置
1. 授权（三通道，见根 \`AGENTS.md\`「人在环例外：游玩自测」）：\`MC_SKILL_PLAYTEST_ALLOW=1\` + \`MC_SKILL_PLAYTEST_ROOT=<绝对路径>\`。
2. 桥安装（宽松许可 + 来源/版本/sha256 记账）：BlackBoxPro 对应端 jar + 依赖（fabric 端需 fabric-api 与 fabric-language-kotlin）。
3. 起游戏后先探活：\`playtest_bridge action=status\` → \`ready=true\` 才算"已进世界"。

## 跑
- 单步：\`playtest_bridge action=execute command={"action":"...","params":{...}}\`（\`confirmed=true\`）。
- 等条件：\`playtest_bridge action=await condition=ready\`（桥**没有** \`wait_until\`；超时 ⇒ \`PLAYTEST_TIMEOUT\`，不会塌成"没失败"）。
- 动作序列见 \`playtest/actions.json\`（把 \`<item>\` 等占位换成真值）。

## 证据
- 截图：\`screenshots/blackboxpro/<player>/<testId>/<NNN>_<prefix>.png\`（桥按 001 起单调编号）。
- 调用轨迹：\`${evidenceDir}/calls.jsonl\`。
- 汇总判读：\`inspect_playtest_evidence evidenceDir=<...>\` → 三态 \`present|absent|unreadable\`。
- 判读用"两遍法"：先看改动方向，再整帧像玩家一样读；跨查询非原子 ⇒ 断言只认条件，不认两条读数相等。

## 失败回灌
改码 → \`mc-build-mod\` 重建 → 换 jar → 重跑本序列；桥不可用时第二腿走 GameTest（见本仓 \`mc-gametest\` 工作流）。

## 安全
桥**无鉴权**且默认通配绑定 ⇒ 只在可信网络、短会话；不上传、不改系统网络栈/证书；证据与驱动代码不入正式实例。
`;

  const files: Record<string, string> = {
    "playtest/actions.json": JSON.stringify(actions, null, 2) + "\n",
    "playtest/README.playtest.md": readme,
  };

  if ((mode === "temporary_client_tick_driver" || mode === "in_jvm_player_agent") && isVerifiedTier(platform, version)) {
    // ── 真 driver（本档全部签名 javap 实测，见 PLAYTEST_VERIFIED_TIER）──
    const tier = PLAYTEST_VERIFIED_TIER.find((t) => t.platform === platform && t.version === version)!;
    const expectItem = (input.expectItem ?? "").trim() || `${modId}:<item>`;
    const slot = Number.isInteger(input.expectSlot) ? Math.max(0, Math.min(40, input.expectSlot as number)) : 0;
    // Windows 路径含反斜杠 ⇒ 注入 Java 字符串字面量前必须转义（否则 `非法转义符`，实测于 2026-09-29）
    const javaEvidenceDir = evidenceDir.replace(/\\/g, "\\\\");
    const javaExpectItem = expectItem.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const enterWorld = (input.enterWorld ?? "").trim();
    const javaEnterWorld = enterWorld.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    if (!enterWorld) {
      warnings.push(
        "enterWorld 未传 ⇒ 驱动**不会自动进世界**（须由人或桥把客户端带进世界；否则驱动只会走预算耗尽判红）。要 auto-enter 传本地存档目录名。",
      );
    }
    // ③-a：解释器（数据驱动）——剧本来自 scenario 或显式 plan
    const scenario = input.scenario ?? "smoke";
    const smokePlan = [
      "wait 40",
      "mark smoke:move",
      "look yaw=0 pitch=0",
      "move key=forward ticks=40",
      "assert moved min=1.0",
      "mark smoke:break",
      "break ticks=40",
      "mark smoke:gui",
      "gui",
      "shot testId=smoke",
      `assert inv slot=${slot} item=${expectItem}`,
    ];
    const villagePlan = [
      "wait 40",
      "mark village:fly-and-probe",
      "fly on=1",
      "move key=jump ticks=40",
      "look yaw=0 pitch=0",
      "move key=forward ticks=60",
      "assert moved min=5.0",
      "scan radius=64 entities=minecraft:villager blocks=minecraft:bell,minecraft:hay_block,minecraft:composter",
      "shot testId=start-area",
      "mark village:locate",
      "cmd locate structure minecraft:village_plains",
      "goto parsed tol=24 fly=1 max=9000 wait=400",
      "look pitch=5",
      "scan radius=128 entities=minecraft:villager blocks=minecraft:bell,minecraft:hay_block,minecraft:composter",
      "assert scan_entities",
      "mark village:evidence",
      "shot testId=village",
      `assert inv slot=${slot} item=${expectItem}`,
    ];
    const planSteps = input.plan?.length ? input.plan : scenario === "village" ? villagePlan : smokePlan;
    if (!input.plan?.length && mode === "in_jvm_player_agent") {
      // in_jvm：默认剧本 = 一条 waitintent 长驻守候（LLM 每写一条 <evidenceDir>/intent.json 就执行一条，
      // 执行器停在同一步继续守候；LLM 发 {"intent":"stop"} 收本轮）。
      planSteps.length = 0;
      planSteps.push("mark in_jvm:intent-session", "waitintent max=6000");
    }
    if (!input.plan?.length && scenario !== "smoke" && scenario !== "village" && mode === "temporary_client_tick_driver") {
      warnings.push(`未知 scenario "${scenario}"：已回退 smoke。可选 smoke | village，或直接给 plan。`);
    }
    const planJava = planSteps.map((s) => JSON.stringify(s)).join(", ");
    /**
     * 意图菜单落成 Java 常量（单一真源 = PLAYTEST_INTENTS，按 capabilityProfile 过滤）。
     * 一行 = `name|budgetTicks|profiles`；Java 侧 menuLine/menuBudget/menuAllowsProfile 直接读它。
     */
    const intentMenuJava = intentsForProfile(profile)
      .map((i) => JSON.stringify(`${i.name}|${i.budgetTicks}|${(i.profiles ?? []).join(",")}`))
      .join(", ");
    /** 引擎选择：解释器（数据驱动，③-a）为默认；置 false 可切回内置 playproof 相位机。 */
    const useInterpreter = true;
    /** 长驻 + 热重载剧本：游戏只起一次，改 plan.txt 即在同一进程内开新一轮（默认开）。 */
    const watchPlan = input.watchPlan !== false;
    const planFileDisplay = `${evidenceDir}/plan.txt`;
    const javaPlanFile = planFileDisplay.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const budgetTicks = Number.isInteger(input.budgetTicks)
      ? Math.max(200, input.budgetTicks as number)
      : mode === "in_jvm_player_agent"
        ? 36000 // LLM 会话：一轮 30 min（36000 tick @20tps）；要短会话请显式传 budgetTicks
        : scenario === "village"
          ? 24000
          : 3600;
    if (!(input.expectItem ?? "").trim()) {
      warnings.push(
        `expectItem 未传 ⇒ 生成物里是占位 \`${modId}:<item>\`：编译前必须替换，否则后置条件按 fail-closed 判红（这是设计，不是缺陷）。`,
      );
    }
    const javaSource = String.raw`package ${pkg}.playtest;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Locale;

import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.fabricmc.fabric.api.client.message.v1.ClientReceiveMessageEvents;
import net.minecraft.block.BlockState;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.gui.Click;
import net.minecraft.client.gui.screen.ingame.InventoryScreen;
import net.minecraft.client.input.MouseInput;
import net.minecraft.client.network.ClientPlayerEntity;
import net.minecraft.client.util.ScreenshotRecorder;
import net.minecraft.item.ItemStack;
import net.minecraft.registry.Registries;
import net.minecraft.util.math.BlockPos;

/**
 * 进程内临时 QA 驱动（${mode} / ${platform} ${version}）。测完必须按同目录 REVERT.md 撤除。
 *
 * 签名出处 = javap 实测（${tier.mappings} 命名 jar，as-of ${tier.asOf}）：
 *   ClientTickEvents.END_CLIENT_TICK : Event<EndTick>
 *   MinecraftClient.player / world / getFramebuffer() / runDirectory(File) / setScreen(Screen)
 *   ScreenshotRecorder.saveScreenshot(File, Framebuffer, Consumer<Text>)
 *   PlayerEntity.getInventory() : PlayerInventory ；PlayerInventory.getStack(int)
 *   Registry.getId(T) : Identifier（Registries.ITEM） ；Entity.getName() / getX() / getY() / getZ()
 *   【真游玩证明】MinecraftClient.options(forwardKey / attackKey) + KeyBinding.setPressed(boolean)
 *                    MinecraftClient.interactionManager / getWindow()（Window.getScaledWidth/Height）/ currentScreen
 *                    Entity.setPitch(float) / setYaw(float) ；World.getBlockState(BlockPos)
 *                    BlockState.getBlock() / isAir() ；Registries.BLOCK ；BlockPos.down() / toShortString()
 *                    Screen.mouseClicked(Click, boolean) ；Click(double, double, MouseInput) ；InventoryScreen(PlayerEntity)
 * （GUI 开屏是**程序化** setScreen(InventoryScreen)，但点击走**真实 UI 事件路径** mouseClicked —— 这一差别在 plan.json 里标明。）
 *
 * 本文件是确定性的：不含 LLM、不做自由决策；动作序列与后置条件在编译期固定。
 */
public final class PlaytestQaDriver {

    /** 证据落点（绝对路径；须在 MC_SKILL_PLAYTEST_ROOT 内）。 */
    private static final String EVIDENCE_DIR = "${javaEvidenceDir}";
    /** 后置条件 inventory_contains：期望物品 id 与槽位。 */
    private static final String EXPECT_ITEM = "${javaExpectItem}";
    private static final int EXPECT_SLOT = ${slot};
    /** 自动进世界的存档目录名（空串 = 不自动进，由人或桥进入）。 */
    private static final String WORLD = "${javaEnterWorld}";
    /** 进世界后先静置的 tick 数（帧缓冲 / 状态落后一 tick）。 */
    private static final int SETTLE_TICKS = 40;
    /** 静置后到截图之间的 tick 数（截图前先 setScreen(null)）。 */
    private static final int SCREENSHOT_AFTER = 60;
    /** 解释器 shot 步「等新截图落盘」的最长 tick 数：截图是**异步写盘**的，慢盘 / U 盘上 3 s 不够
     * （实测 2026-10-03 fabric-26.1.2 的 E: 盘：请求到落盘 4 s+ ⇒ 60 tick 预算直接判红，而 PNG 其实已写出）⇒ 给到 10 s。 */
    private static final int SHOT_WAIT_TICKS = 200;
    /** 硬预算：超时判红，绝不静默（含世界加载与启动期，180s @20tps）。 */
    private static final int BUDGET_TICKS = ${budgetTicks};
    /** 真游玩证明①：按前进键的 tick 数 + 最小水平位移（格）；出生点可能被地形卡住 ⇒ 4 向轮试。 */
    private static final int MOVE_TICKS = 40;
    private static final double MOVE_MIN_HORIZONTAL = 1.0;
    private static final String[] DIR_NAMES = { "yaw0/south(+Z)", "yaw90/west(-X)", "yaw180/north(-Z)", "yaw270/east(+X)" };
    /** 真游玩证明②：俯视（pitch=90）并按攻击键的 tick 数（创造模式即破）。 */
    private static final int BREAK_TICKS = 40;
    /** 真游玩证明③：GUI 打开后到点击 / 关闭的 tick 数。 */
    private static final int GUI_TICKS = 25;

    private static boolean registered;
    private static boolean done;
    private static boolean openRequested;
    private static int ticks;
    private static int phase;
    private static String playerName = "";
    private static String observedItem = "";
    private static double px;
    private static double py;
    private static double pz;
    private static double startX;
    private static double startZ;
    private static double moveDelta;
    private static int dirIdx;
    private static String blockPosText = "";
    private static String blockBefore = "";
    private static String blockAfter = "";
    /** 破坏证明的**固定目标坐标**：进相位时定死，之后只复读同一坐标（否则玩家移动会把"换了个位置"误判成"方块被破坏"）。 */
    private static BlockPos targetPos;
    private static boolean guiOpened;
    private static String guiClass = "";
    private static boolean guiClicked;
    private static boolean guiClosed;

    // ─────────────────── 解释器引擎（③-a：动作序列数据驱动，换场景只改 PLAN） ───────────────────
    /** true = 跑 PLAN（解释器）；false = 跑内置 playproof 相位机。 */
    private static final boolean USE_INTERPRETER = ${useInterpreter};
    /** 内置场景脚本（无 plan.txt 时用它）：每行一步，语法见 plan.json / README.playtest.md。 */
    private static final String[] PLAN = { ${planJava} };
    /**
     * 长驻热重载（避免每改一次动作就重启游戏）：
     *   剧本文件 = ${planFileDisplay}
     *   驱动器每 WATCH_EVERY_TICKS tick 查一次该文件 mtime；**变了就立刻开新一轮**（同一游戏进程内），
     *   一轮结束不退出、只在 qa.log 打 ROUND n DONE/ERROR，并把该轮证据写盘。
     *   写 stop.txt（或最后一行 stop）⇒ 驱动器停止接新轮（但仍不关游戏，由人/编排关）。
     */
    private static final boolean WATCH_PLAN = ${watchPlan};
    private static final String PLAN_FILE = "${javaPlanFile}";
    private static final int WATCH_EVERY_TICKS = 20;

    private static boolean planStarted;
    private static boolean roundActive;
    private static int roundNo;
    private static long planMtime = -1L;
    private static String[] plan = PLAN;
    private static int stepIdx;
    private static int stepTicks;
    private static String lastGameMessage = "";
    private static String scanEntityText = "";
    private static String scanBlockText = "";
    private static boolean scanEntityFound;
    private static boolean scanBlockFound;
    private static double gotoX;
    private static double gotoZ;
    private static double gotoTol = 8;
    private static boolean gotoFly;
    private static int gotoMax = 6000;
    private static boolean gotoTargetSet;
    private static double gotoLastX;
    private static double gotoLastZ;
    private static int gotoStuckCheck;
    private static int gotoClimb;
    private static double moveStartX;
    private static double moveStartZ;
    private static final StringBuilder QA = new StringBuilder();

    // ─────────────── 意图引擎（in_jvm_player_agent：菜单校验 + 原语展开 + 类型化后置条件） ───────────────
    /** 意图菜单（生成器从 PLAYTEST_INTENTS 落成；一行 = name|budgetTicks|profiles，profiles 空 = 全档）。 */
    private static final String[] INTENT_MENU = { ${intentMenuJava} };
    /** 危险动作禁列（命中即判红，不静默忽略；真源见口径单源 §意图空间）。 */
    private static final String[] FORBIDDEN_INTENTS = { "kill", "tnt", "fill" };
    /** 能力档（strict_survival | operator | creative）——tp 等意图按档过滤。 */
    private static final String CAPABILITY_PROFILE = "${profile}";
    /** LLM 邮箱：<evidenceDir>/intent.json（扁平 JSON：{\"intent\":\"walk_to\",\"x\":1,\"z\":2}）；消费后改名 intent.done.json。 */
    private static final String INTENT_MAILBOX = EVIDENCE_DIR + "/intent.json";
    private static final String INTENT_MAILBOX_DONE = EVIDENCE_DIR + "/intent.done.json";
    /** 邮箱 JSON 里允许被当作意图参数的键（白名单：其余键一律忽略，防止 LLM 顺手塞进未声明参数）。
     *  必须覆盖**菜单里所有意图声明的参数名**，否则 driver 会把该参数静默丢掉（实测 2026-10-01：
     *  observe 的 blocks 参数因缺键被滤成空 opts ⇒ 误判「空扫无判据」）。门禁按菜单逐名对账。 */
    private static final String[] INTENT_PARAM_KEYS = { "x", "y", "z", "tol", "max", "radius", "fly", "stride",
        "contains", "slot", "ticks", "testId", "structure", "block", "entity", "target", "yaw", "pitch",
        "blocks", "entities", "blockId", "count", "pos", "expect", "how", "until" };

    private static String activeIntent = "";
    private static String activeIntentOpts = "";
    private static boolean intentFromMailbox;
    /** 本条意图**启动时**是否来自邮箱（startIntent 捕获；failIntent 靠它决定「记数据续守候」还是「判红停轮」）。 */
    private static boolean activeIntentFromMailbox;
    /** 意图起点墙钟（ms；截图后置条件只认 mtime ≥ 它的新图 —— 防拿旧图充新证据）。 */
    private static long intentStartMillis;
    /** 截图请求时刻（ms；异步落盘，0 = 无待落盘请求）。 */
    private static long shotRequestMillis;
    /** 观测面刷新闩：会话起步时玩家可能还在标题屏（player==null）⇒ 进世界后的第一条 waitintent tick 再补种一次。 */
    private static boolean stateSeeded;
    private static String[] savedPlan;
    private static int savedStepIdx;
    private static int intentBudget;
    private static String intentPostMode = "";
    private static String intentPostKind = "";
    private static double intentStartX;
    private static double intentStartZ;
    private static double intentTargetX;
    private static double intentTargetZ;
    private static double intentTol;
    private static float intentWantYaw;
    private static float intentWantPitch;
    private static String intentTargetBlockId = "";
    private static BlockPos intentTargetBlockPos;
    private static boolean intentScanWantedEntity;
    private static boolean intentScanWantedBlock;
    private static String intentShotTestId = "";
    private static double scanNearestX;
    private static double scanNearestY;
    private static double scanNearestZ;
    private static String scanNearestId = "";
    private static boolean scanNearestFound;
    private static boolean gotoArrived;
    private static double gotoArrivedDist;
    private static boolean lastInvOk;
    private static String lastInvDetail = "";
    private static final StringBuilder INTENT_LOG = new StringBuilder();
    private static int intentsThisRound;
    private static String lastIntentName = "";
    private static boolean lastIntentOk;
    private static String lastIntentPost = "";
    private static String lastIntentFailure = "";
    private static String lastIntentDetail = "";

    private PlaytestQaDriver() {
    }

    /** 在被测工程的客户端初始化处加这一行（revert 时删掉）。 */
    public static void register() {
        if (registered) {
            return;
        }
        if (USE_INTERPRETER) {
            ClientTickEvents.END_CLIENT_TICK.register(PlaytestQaDriver::onInterpTick);
            ClientReceiveMessageEvents.GAME.register((message, overlay) -> lastGameMessage = message.getString());
            registered = true;
            log("[QA] driver registered（解释器引擎）PLAN=" + PLAN.length + " 步");
            return;
        }
        ClientTickEvents.END_CLIENT_TICK.register(PlaytestQaDriver::onEndTick);
        registered = true;
        log("[QA] driver registered expect=" + EXPECT_ITEM + " slot=" + EXPECT_SLOT);
    }

    private static void onEndTick(MinecraftClient client) {
        if (done) {
            return;
        }
        ticks++;
        if (ticks > BUDGET_TICKS) {
            finish(false, "budget exhausted (" + BUDGET_TICKS + " ticks) —— 未进世界或条件永不成立");
            return;
        }
        ClientPlayerEntity player = client.player;
        // 相位 0（自动进世界）必须在"还没进世界"时跑 ⇒ null 检查只对相位 1+ 生效（实测：把 null 检查提到 switch 前
        // 会让 auto-enter 永不触发，日志里连 open world requested 都没有）。
        if (phase != 0 && (player == null || client.world == null)) {
            return;
        }
        switch (phase) {
            case 0: // 自动进世界（无桥路线，默认走 IntegratedServerLoader）。fabric 1.20.4/1.21.1/1.21.3 档**不可**走此路：
                   //  该调用把 Render thread 冻在 startIntegratedServer 的 Thread.sleep（jstack 实证），那三档改用 build.gradle 的 vanilla quick play。
                if (ticks < 20) {
                    return; // 让客户端先过启动期
                }
                if (!WORLD.isEmpty() && !openRequested) {
                    openRequested = true;
                    log("[QA] open world requested: " + WORLD);
                    try {
                        client.createIntegratedServerLoader().start(WORLD, () -> log("[QA] open world cancelled"));
                    } catch (Throwable t) {
                        finish(false, "open world failed：" + t);
                        return;
                    }
                }
                phase = 1;
                ticks = 0;
                break;
            case 1:
                if (player == null || client.world == null) {
                    return;
                }
                playerName = player.getName().getString();
                px = player.getX();
                py = player.getY();
                pz = player.getZ();
                startX = px;
                startZ = pz;
                log("[QA] entered world as " + playerName + " @ " + fmt(px) + "," + fmt(py) + "," + fmt(pz));
                phase = 2;
                ticks = 0;
                break;
            case 2:
                if (ticks >= SETTLE_TICKS) {
                    phase = 3;
                    ticks = 0;
                }
                break;
            case 3:
                try {
                    ItemStack stack = player.getInventory().getStack(EXPECT_SLOT);
                    observedItem = stack.isEmpty() ? "" : Registries.ITEM.getId(stack.getItem()).toString();
                    Files.createDirectories(Path.of(EVIDENCE_DIR));
                    Files.writeString(Path.of(EVIDENCE_DIR, "state.json"), stateJson(), StandardCharsets.UTF_8);
                    log("[QA] observe slot " + EXPECT_SLOT + " = " + (observedItem.isEmpty() ? "(empty)" : observedItem));
                } catch (IOException e) {
                    finish(false, "state.json 写入失败：" + e);
                    return;
                }
                player.setYaw(0.0f); // 移动证明前先定朝向（输入仍是键盘驱动；朝向只是给个确定起点）
                startX = player.getX();
                startZ = player.getZ();
                phase = 4;
                ticks = 0;
                break;
            case 4: // 真游玩①：输入驱动移动（4 向轮试；每 tick 重按防 unpressAll；周期性跳以便上台阶/脱困）
                if (ticks == 1) {
                    log("[QA] move proof: attempt dir=" + DIR_NAMES[dirIdx]);
                }
                client.options.forwardKey.setPressed(true);
                client.options.jumpKey.setPressed(ticks % 20 < 5);
                if (ticks >= MOVE_TICKS) {
                    moveDelta = Math.sqrt((player.getX() - startX) * (player.getX() - startX) + (player.getZ() - startZ) * (player.getZ() - startZ));
                    log("[QA] move proof: dir=" + DIR_NAMES[dirIdx] + " delta=" + fmt(moveDelta) + " (min " + fmt(MOVE_MIN_HORIZONTAL) + ")");
                    if (moveDelta >= MOVE_MIN_HORIZONTAL) {
                        client.options.forwardKey.setPressed(false);
                        client.options.jumpKey.setPressed(false);
                        log("[QA] move proof: PASSED dir=" + DIR_NAMES[dirIdx] + " delta=" + fmt(moveDelta));
                        phase = 5;
                        ticks = 0;
                        break;
                    }
                    dirIdx++;
                    if (dirIdx >= DIR_NAMES.length) {
                        client.options.forwardKey.setPressed(false);
                        client.options.jumpKey.setPressed(false);
                        finish(false, "移动证明失败：" + DIR_NAMES.length + " 个朝向各 " + MOVE_TICKS + " tick 的水平位移都 < " + fmt(MOVE_MIN_HORIZONTAL) + "（被地形卡住？）");
                        return;
                    }
                    player.setYaw(dirIdx * 90.0f);
                    startX = player.getX();
                    startZ = player.getZ();
                    ticks = 0;
                }
                break;
            case 5: // 真游玩②：俯视 + 按住攻击键破方块（先等落地；断言在**固定坐标**上复读，防玩家移动造成假过）
                // 注：ticks 在分发前已自增 ⇒ 相位首帧是 ticks==1（写 ticks==0 会导致入口块永不执行——实测踩过）
                if (ticks == 1) {
                    client.setScreen(null);
                    player.setPitch(90.0f);
                }
                if (!player.isOnGround()) {
                    if (ticks > 200) {
                        finish(false, "破坏证明失败：200 tick 内未落地（脚下方块无法确定）");
                        return;
                    }
                    return;
                }
                if (blockBefore.isEmpty()) {
                    targetPos = player.getBlockPos().down();
                    blockPosText = targetPos.toShortString();
                    blockBefore = blockId(client, targetPos);
                    log("[QA] break proof: target " + blockPosText + " before=" + blockBefore);
                }
                client.options.attackKey.setPressed(true);
                if (ticks >= BREAK_TICKS) {
                    client.options.attackKey.setPressed(false);
                    blockAfter = blockId(client, targetPos);
                    log("[QA] break proof: after=" + blockAfter + "（同一坐标 " + blockPosText + " 复读）");
                    if (blockBefore.isEmpty() || blockAfter.equals(blockBefore)) {
                        finish(false, "破坏证明失败：方块 " + blockPosText + " 仍为 " + blockBefore);
                        return;
                    }
                    phase = 6;
                    ticks = 0;
                }
                break;
            case 6: // 真游玩③：开 GUI（程序化开屏）+ 真实鼠标事件点击 + 关闭
                if (ticks == 1) {
                    client.setScreen(new InventoryScreen(player));
                    log("[QA] gui proof: opened=" + (client.currentScreen == null ? "(null)" : client.currentScreen.getClass().getSimpleName()));
                }
                if (ticks >= GUI_TICKS) {
                    if (client.currentScreen != null) {
                        guiOpened = true;
                        guiClass = client.currentScreen.getClass().getSimpleName();
                        try {
                            guiClicked = client.currentScreen.mouseClicked(
                                new Click(client.getWindow().getScaledWidth() / 2.0, client.getWindow().getScaledHeight() / 2.0, new MouseInput(0, 0)), false);
                        } catch (Throwable t) {
                            log("[QA] gui proof: click threw " + t);
                        }
                        client.currentScreen.close();
                        guiClosed = client.currentScreen == null;
                        log("[QA] gui proof: class=" + guiClass + " clicked=" + guiClicked + " closed=" + guiClosed);
                    }
                    if (!guiOpened) {
                        finish(false, "GUI 证明失败：InventoryScreen 未能打开");
                        return;
                    }
                    phase = 7;
                    ticks = 0;
                }
                break;
            case 7:
                if (ticks >= SCREENSHOT_AFTER) {
                    try {
                        client.setScreen(null);
                        ScreenshotRecorder.saveScreenshot(client.runDirectory, client.getFramebuffer(), t -> {
                        });
                        log("[QA] screenshot requested under " + new File(client.runDirectory, "screenshots"));
                    } catch (Throwable t) {
                        finish(false, "screenshot 失败：" + t);
                        return;
                    }
                    phase = 8;
                    ticks = 0;
                }
                break;
            case 8:
                if (!EXPECT_ITEM.equals(observedItem)) {
                    finish(false, "后置条件 inventory_contains 失败：期望 " + EXPECT_ITEM + "（slot " + EXPECT_SLOT + "），实际 "
                        + (observedItem.isEmpty() ? "(empty)" : observedItem));
                    return;
                }
                finish(true, "游玩证明全过：inventory_contains（slot " + EXPECT_SLOT + " = " + observedItem + "）+ 移动 delta=" + fmt(moveDelta)
                    + " + 破方块 " + blockPosText + "：" + blockBefore + " → " + blockAfter
                    + " + GUI " + guiClass + "（clicked=" + guiClicked + "）+ 截图已请求");
                break;
            default:
                break;
        }
    }

    // ─────────────────────────────── 解释器：主循环 ───────────────────────────────
    private static void onInterpTick(MinecraftClient client) {
        // 兜底边界（2026-10-01 质量批）：步骤级 try 只包住 switch；预算 / 自动进世界 / 热重载 / completeIntent
        // 都在它外面 —— 任一处抛异常会打穿 END_CLIENT_TICK ⇒ 客户端崩、本轮无证据（NPE 崩过一先例）。
        // 整段包一层 fail-closed：意外只判红收轮，绝不打穿 tick。
        try {
            interpTickBody(client);
        } catch (Throwable t) {
            try {
                finish(false, "onInterpTick 未捕获异常（fail-closed 兜底）：" + t);
            } catch (Throwable t2) {
                System.out.println("[QA] ERROR: tick 兜底再异常：" + t2);
            }
        }
    }

    private static void interpTickBody(MinecraftClient client) {
        if (done) {
            return;
        }
        ticks++;
        // 只在"本轮进行中"判预算：否则轮末 ticks 继续增长会让**每一 tick 都把刚结束的这轮再判一次红**
        // （实测：卡在世界外的旧版驱动刷出 800+ 条 round 0 budget exhausted 与 82KB rounds.jsonl）。
        if (roundActive && ticks > BUDGET_TICKS) {
            finish(false, "budget exhausted (" + BUDGET_TICKS + " ticks)");
            return;
        }
        // 单意图预算（菜单 budgetTicks 列）：超限判红。与全局预算分开 ⇒ 一个意图卡死不会吃掉整轮判据。
        if (roundActive && !activeIntent.isEmpty() && intentBudget > 0 && stepTicks > intentBudget) {
            failIntent(client, client.player, "budget_exhausted", "intent 预算耗尽（" + activeIntent + " 超过 " + intentBudget + " tick）");
            return;
        }
        ClientPlayerEntity player = client.player;
        // 自动进世界（一次性；**与剧本是否起跑无关**）：剧本可在标题屏就开跑（newworld 等世界无关步骤），
        // 进世界必须独立于剧本 —— 放进 !planStarted 分支会因剧本先起跑而永不执行（实测 2026-09-29 forge 1.20.1）。
        if (ticks >= 20 && !WORLD.isEmpty() && !openRequested && client.currentScreen != null) {
            openRequested = true;
            // 预检 level.dat：存档不存在（或只剩上次失败残留的半成品目录）时**不要**调 loadLevel —— 实测会抛
            // IllegalStateException: Failed to load data pack config 并打穿 tick 处理器（2026-09-29 forge 1.20.1）。
            if (!Files.exists(Path.of(client.runDirectory.getPath(), "saves", WORLD, "level.dat"))) {
                log("[QA] open world skipped：存档不存在（" + WORLD + "）—— 交给 newworld 步骤或人工建一次世界");
            } else {
                log("[QA] open world requested: " + WORLD);
                try {
                    client.createIntegratedServerLoader().start(WORLD, () -> log("[QA] open world cancelled"));
                } catch (Throwable t) {
                    finish(false, "open world failed：" + t);
                }
            }
        }
        if (!planStarted) {
            // 客户端就绪判据 = 已有屏幕（标题屏）。**不要求**已进世界：否则 newworld 这类"先造世界"的步骤
            // 永远等不到执行（剧本要进世界才跑，进世界又要剧本先造世界 ⇒ 自锁；实测 2026-09-29 forge 1.20.1）。
            if (client.currentScreen == null) {
                return;
            }
            planStarted = true;
            mc = client;
            ticks = 0;
            if (player != null) {
                playerName = player.getName().getString();
                px = player.getX();
                py = player.getY();
                pz = player.getZ();
                startX = px;
                startZ = pz;
                log("[QA] in world as " + playerName + " @ " + fmt(px) + "," + fmt(py) + "," + fmt(pz) + " ；PLAN 步数=" + PLAN.length);
            } else {
                // 标题屏就起跑（newworld 这类步骤需要）⇒ player 可能为 null，绝不能在这里解引用（实测崩过：NPE on getName）
                log("[QA] client ready（尚未进世界）—— 剧本开跑；需要世界的步骤会自动等世界；PLAN 步数=" + PLAN.length);
            }
            if (WATCH_PLAN) {
                loadPlan();
            }
            startRound();
            writeState(client, player); // 会话起步即发布观测面（player 坐标 / intentState / 菜单）—— LLM 写第一条意图前要读它
            return;
        }
        if (!roundActive) {
            // 空闲：不退出、不空转消耗 —— 每 WATCH_EVERY_TICKS tick 查一次剧本文件
            if (WATCH_PLAN && ticks % WATCH_EVERY_TICKS == 0 && planFileChanged()) {
                loadPlan();
                startRound();
                writeState(client, player);
            }
            return;
        }
        if (stepIdx >= plan.length) {
            if (!activeIntent.isEmpty()) {
                // 子计划（意图展开）跑完 ⇒ 判类型化后置条件并回到外层计划
                completeIntent(client, player);
                return;
            }
            finish(true, "PLAN 全部 " + plan.length + " 步完成");
            return;
        }
        stepTicks++;
        String line = plan[stepIdx].trim();
        String verb = line;
        String rest = "";
        int sp = line.indexOf(' ');
        if (sp > 0) {
            verb = line.substring(0, sp);
            rest = line.substring(sp + 1).trim();
        }
        // 与"世界"无关的步骤可以在进世界前跑（wait / newworld / cmd / mark / stop）；其余步骤等世界就绪。
        // 等待期间 stepTicks 不推进、但 ticks（预算）照走 ⇒ 超时仍是 fail-closed 判红，不静默。
        boolean worldIndependent = verb.equals("wait") || verb.equals("newworld") || verb.equals("cmd")
            || verb.equals("mark") || verb.equals("stop");
        if (!worldIndependent && (player == null || client.world == null)) {
            return;
        }
        try {
            switch (verb) {
                case "wait":
                    if (stepTicks >= intOf(rest, 20)) {
                        next();
                    }
                    break;
                case "mark":
                    log("[QA] mark: " + rest);
                    next();
                    break;
                case "look":
                    player.setYaw((float) optF(rest, "yaw", player.getYaw()));
                    player.setPitch((float) optF(rest, "pitch", player.getPitch()));
                    log("[QA] look yaw=" + fmt(player.getYaw()) + " pitch=" + fmt(player.getPitch()));
                    next();
                    break;
                case "fly": {
                    boolean on = optI(rest, "on", 1) == 1;
                    player.getAbilities().flying = on;
                    player.sendAbilitiesUpdate();
                    log("[QA] fly on=" + on);
                    next();
                    break;
                }
                case "move": {
                    if (stepTicks == 1) {
                        moveStartX = player.getX();
                        moveStartZ = player.getZ();
                    }
                    String key = optS(rest, "key", "forward");
                    press(client, key, true);
                    if (stepTicks >= optI(rest, "ticks", 40)) {
                        press(client, key, false);
                        next();
                    }
                    break;
                }
                case "cmd":
                    lastGameMessage = "";
                    sendCommand(client, rest);
                    log("[QA] cmd: /" + rest);
                    next();
                    break;
                case "goto": {
                    if (!gotoTargetSet) {
                        gotoTol = optF(rest, "tol", 8);
                        gotoFly = optI(rest, "fly", 0) == 1;
                        gotoMax = optI(rest, "max", 6000);
                        if (rest.startsWith("parsed")) {
                            // /locate 实测要 2.5s（服务端日志 "Locating element … took 2558 ms"）⇒ 必须**等**坐标，不能只等 1 秒
                            double[] xz = parseXZ(lastGameMessage);
                            if (xz == null) {
                                xz = parseXZ(readLastChatLine(client)); // 兜底：读 <runDir>/logs/latest.log 的最后 [CHAT] 行（实测 locate 结果落盘在此）
                            }
                            if (xz == null) {
                                int waitFor = optI(rest, "wait", 400);
                                if (stepTicks > waitFor) {
                                    failIntent(client, player, "goto_parse_failed", "goto parsed 失败：等 " + waitFor + " tick 仍未拿到坐标（事件原文：" + shorten(lastGameMessage) + "；日志兜底也没命中）");
                                    return;
                                }
                                if (stepTicks % 20 == 1) {
                                    log("[QA] goto parsed: 等坐标中… " + stepTicks + "/" + waitFor);
                                }
                                break;
                            }
                            gotoX = xz[0];
                            gotoZ = xz[1];
                        } else if (rest.startsWith("nearest")) {
                            // find_and_goto 的 block/entity 形态接线：用最近一次 scan 的结构化坐标（缺命中判红，不静默）
                            if (!scanNearestFound) {
                                failIntent(client, player, "goto_target_missing", "goto nearest：最近一次 scan 没有命中（先 scan entities= / blocks=）");
                                return;
                            }
                            gotoX = scanNearestX;
                            gotoZ = scanNearestZ;
                        } else {
                            gotoX = optF(rest, "x", player.getX());
                            gotoZ = optF(rest, "z", player.getZ());
                        }
                        gotoTargetSet = true;
                        gotoArrived = false;
                        gotoArrivedDist = -1;
                        if (gotoFly) {
                            player.getAbilities().flying = true;
                            player.sendAbilitiesUpdate();
                        }
                        gotoLastX = player.getX();
                        gotoLastZ = player.getZ();
                        gotoStuckCheck = 0;
                        if (optI(rest, "tp", 0) == 1) {
                            // 兜底（需作弊）：直接传到目标上空 —— 地形/速度都绕开；默认关闭，由剧本显式开
                            sendCommand(client, "tp @s " + (int) Math.floor(gotoX) + " 140 " + (int) Math.floor(gotoZ));
                            log("[QA] goto tp -> " + (int) Math.floor(gotoX) + ",140," + (int) Math.floor(gotoZ));
                        }
                        log("[QA] goto x=" + fmt(gotoX) + " z=" + fmt(gotoZ) + " tol=" + fmt(gotoTol) + " fly=" + gotoFly + " max=" + gotoMax);
                    }
                    double dx = gotoX - player.getX();
                    double dz = gotoZ - player.getZ();
                    double dist = Math.sqrt(dx * dx + dz * dz);
                    if (dist <= gotoTol) {
                        client.options.forwardKey.setPressed(false);
                        client.options.jumpKey.setPressed(false);
                        if (gotoFly) {
                            // 到达即关闭飞行 ⇒ 重力把人带到地面再扫（创意档无摔伤）。否则会悬在巡航高度，
                            // 而 scan 的方块采样只有玩家上下 ±8 格的薄层 ⇒ 看不见地面上的村庄
                            //（实测 2026-09-29：y≈141 悬停时 entities 8 只村民 / blocks hits=0 判红）。
                            player.getAbilities().flying = false;
                            player.sendAbilitiesUpdate();
                        }
                        log("[QA] goto arrived dist=" + fmt(dist) + " @ " + fmt(player.getX()) + "," + fmt(player.getY()) + "," + fmt(player.getZ()));
                        gotoArrived = true;
                        gotoArrivedDist = dist;
                        next();
                        break;
                    }
                    if (stepTicks > gotoMax) {
                        client.options.forwardKey.setPressed(false);
                        failIntent(client, player, "goto_timeout", "goto 超时：还差 " + fmt(dist) + " 格（max=" + gotoMax + "）");
                        return;
                    }
                    // 巡航高度 + 防卡：**地形会把低空飞行撞停**（实测 9000 tick 只前进 ~550 格、差 200 格判红）。
                    // 策略：先爬到 cruiseY（默认 140）以上再横掠；每 40 tick 量一次水平位移，几乎没动就抬升 60 tick 翻越。
                    double cruiseY = optF(rest, "cruiseY", 140);
                    // 每 tick 重申飞行权：创意/op 档由开局设置，但服务端会在 mayfly 不成立时把 flying 复位
                    //（实测：单机 integrated server 下 abilities 被回滚会让 goto 半途掉到地面、撞地形卡死）。
                    // 只在被复位时才 sendAbilitiesUpdate，避免每 tick 刷包。
                    if (gotoFly && !player.getAbilities().flying) {
                        player.getAbilities().flying = true;
                        player.sendAbilitiesUpdate();
                        log("[QA] goto: flying 被复位 → 重申 fly=true @ y=" + fmt(player.getY()));
                    }
                    player.setYaw((float) Math.toDegrees(Math.atan2(-dx, dz))); // yaw0=+Z、90=-X（MC 约定）
                    client.options.forwardKey.setPressed(true);
                    client.options.sprintKey.setPressed(gotoFly); // 飞掠：冲刺 ≈21 b/s（步行 4.3 / 飞行 10.9）
                    boolean needClimb = gotoFly && (stepTicks < 40 || gotoClimb > 0 || player.getY() < cruiseY);
                    client.options.jumpKey.setPressed(needClimb);
                    if (gotoClimb > 0) {
                        gotoClimb--;
                    }
                    if (gotoFly && stepTicks - gotoStuckCheck >= 40) {
                        double moved = Math.sqrt((player.getX() - gotoLastX) * (player.getX() - gotoLastX)
                            + (player.getZ() - gotoLastZ) * (player.getZ() - gotoLastZ));
                        if (moved < 2.0) {
                            gotoClimb = 60;
                            log("[QA] goto unstick y=" + fmt(player.getY()) + "（40 tick 仅移动 " + fmt(moved) + " 格）→ 抬升翻越");
                        }
                        gotoLastX = player.getX();
                        gotoLastZ = player.getZ();
                        gotoStuckCheck = stepTicks;
                    }
                    break;
                }
                case "scan": {
                    int radius = optI(rest, "radius", 64);
                    String ents = optS(rest, "entities", "");
                    String blks = optS(rest, "blocks", "");
                    int stride = Math.max(1, optI(rest, "stride", 4));
                    scanEntityFound = false;
                    scanBlockFound = false;
                    scanEntityText = "";
                    scanBlockText = "";
                    scanNearestFound = false;
                    scanNearestId = "";
                    if (!ents.isEmpty()) {
                        if (radius > 48) {
                            // 实测：客户端实体只在追踪范围（≈48 格）内可见 ⇒ 大 radius 扫实体必 0 命中，别读成"这里没有"
                            log("[QA] hint: radius=" + radius + " 超过实体追踪范围（≈48 格）⇒ entities 命中通常为 0；实体断言请靠近目标，或改用 blocks 证据");
                        }
                        String[] want = ents.split(",");
                        int hits = 0;
                        String nearest = "";
                        double nd = Double.MAX_VALUE;
                        for (net.minecraft.entity.Entity e : client.world.getEntities()) {
                            String id = Registries.ENTITY_TYPE.getId(e.getType()).toString();
                            if (!contains(want, id)) {
                                continue;
                            }
                            hits++;
                            double d = Math.sqrt(Math.pow(e.getX() - player.getX(), 2) + Math.pow(e.getZ() - player.getZ(), 2));
                            if (d < nd) {
                                nd = d;
                                nearest = id + "@" + fmt(e.getX()) + "," + fmt(e.getY()) + "," + fmt(e.getZ()) + " d=" + fmt(d);
                                scanNearestX = e.getX();
                                scanNearestY = e.getY();
                                scanNearestZ = e.getZ();
                                scanNearestId = id;
                                scanNearestFound = true;
                            }
                        }
                        scanEntityText = "entities hits=" + hits + (nearest.isEmpty() ? "" : " nearest=" + nearest);
                        scanEntityFound = hits > 0;
                    }
                    if (!blks.isEmpty()) {
                        String[] want = blks.split(",");
                        int hits = 0;
                        String first = "";
                        String nearest = "";
                        double nd = Double.MAX_VALUE;
                        BlockPos c = player.getBlockPos();
                        for (int ax = -radius; ax <= radius; ax += stride) {
                            for (int az = -radius; az <= radius; az += stride) {
                                // 自适应地面层：结构（村庄等）常落在山坡上，固定 ±8 薄层会整列取样到空气
                                //（实测 2026-09-29 fabric-1.21.11：玩家 y≈100.5 站山坡，采样 y=96..108 全 air，
                                // 实际地面在 y=97）⇒ 先逐列向下探出第一个非空气方块当参考层，再取该层 -2..+5。
                                // 每列只多一次向下探测，cost 与列数同阶；全空列跳过（未加载/超界）。
                                // 注意：循环变量必须叫 ay 且写成 c.add(ax, ay, az) —— mojmap 改写表
                                // （rewriteForForge 的 .add(ax, ay, az) → .offset(...)）按这个字面形状匹配；
                                // 换名（如 probeAy）会漏改 ⇒ forge/neoforge/26.x 档编译报「找不到符号 方法 add(int,int,int)」（实测 2026-10-03）。
                                int surfaceAy = Integer.MIN_VALUE;
                                for (int ay = 16; ay >= -48; ay--) {
                                    String pid = Registries.BLOCK.getId(client.world.getBlockState(c.add(ax, ay, az)).getBlock()).toString();
                                    if (!pid.equals("minecraft:air") && !pid.equals("minecraft:cave_air") && !pid.equals("minecraft:void_air")) { surfaceAy = ay; break; }
                                }
                                if (surfaceAy == Integer.MIN_VALUE) { continue; }
                                for (int ay = surfaceAy - 2; ay <= surfaceAy + 5; ay++) {
                                    BlockPos bp = c.add(ax, ay, az);
                                    String id = Registries.BLOCK.getId(client.world.getBlockState(bp).getBlock()).toString();
                                    if (contains(want, id)) {
                                        hits++;
                                        if (first.isEmpty()) {
                                            first = bp.toShortString() + "=" + id;
                                        }
                                        // 最近优先（旧版只有 scan 序 first ⇒ 不是最近；find_and_goto{block} 要的是最近可走的那个）
                                        double d = Math.sqrt(Math.pow(bp.getX() + 0.5 - player.getX(), 2)
                                            + Math.pow(bp.getY() + 0.5 - player.getY(), 2) + Math.pow(bp.getZ() + 0.5 - player.getZ(), 2));
                                        if (d < nd) {
                                            nd = d;
                                            nearest = id + "@" + bp.toShortString() + " d=" + fmt(d);
                                            scanNearestX = bp.getX() + 0.5;
                                            scanNearestY = bp.getY();
                                            scanNearestZ = bp.getZ() + 0.5;
                                            scanNearestId = id;
                                            scanNearestFound = true;
                                            intentTargetBlockPos = bp.toImmutable();
                                        }
                                    }
                                }
                            }
                        }
                        scanBlockText = "blocks hits=" + hits + (nearest.isEmpty() ? "" : " nearest=" + nearest) + (first.isEmpty() ? "" : " first=" + first);
                        scanBlockFound = hits > 0;
                    }
                    log("[QA] scan: " + scanEntityText + (scanBlockText.isEmpty() ? "" : " | " + scanBlockText));
                    next();
                    break;
                }
                case "assert": {
                    String kind = rest;
                    String opts = "";
                    int sp2 = rest.indexOf(' ');
                    if (sp2 > 0) {
                        kind = rest.substring(0, sp2);
                        opts = rest.substring(sp2 + 1);
                    }
                    boolean ok;
                    String detail;
                    if (kind.equals("scan_entities")) {
                        ok = scanEntityFound;
                        detail = scanEntityText;
                    } else if (kind.equals("scan_blocks")) {
                        ok = scanBlockFound;
                        detail = scanBlockText;
                    } else if (kind.equals("moved")) {
                        double min = optF(opts, "min", 1.0);
                        double d = Math.sqrt(Math.pow(player.getX() - moveStartX, 2) + Math.pow(player.getZ() - moveStartZ, 2));
                        ok = d >= min;
                        detail = "delta=" + fmt(d) + " min=" + fmt(min);
                    } else if (kind.equals("inv")) {
                        int slot = optI(opts, "slot", EXPECT_SLOT);
                        String want = optS(opts, "item", EXPECT_ITEM);
                        ItemStack st = player.getInventory().getStack(slot);
                        observedItem = st.isEmpty() ? "" : Registries.ITEM.getId(st.getItem()).toString();
                        ok = want.equals(observedItem);
                        detail = "slot " + slot + " expect=" + want + " got=" + (observedItem.isEmpty() ? "(empty)" : observedItem);
                        lastInvOk = ok;
                        lastInvDetail = detail;
                    } else if (kind.equals("inv_nonempty")) {
                        // inventory{slot} 形态：只断言槽位非空（与 inv{contains} 的 item 相等判据分开，避免"期望硬编码"）
                        int slot = optI(opts, "slot", EXPECT_SLOT);
                        ItemStack st = player.getInventory().getStack(slot);
                        observedItem = st.isEmpty() ? "" : Registries.ITEM.getId(st.getItem()).toString();
                        ok = !st.isEmpty();
                        detail = "slot " + slot + " got=" + (observedItem.isEmpty() ? "(empty)" : observedItem);
                        lastInvOk = ok;
                        lastInvDetail = detail;
                    } else if (kind.equals("pos")) {
                        double tol = optF(opts, "tol", 8);
                        double tx = optF(opts, "x", player.getX());
                        double tz = optF(opts, "z", player.getZ());
                        double d = Math.sqrt(Math.pow(player.getX() - tx, 2) + Math.pow(player.getZ() - tz, 2));
                        ok = d <= tol;
                        detail = "dist=" + fmt(d) + " tol=" + fmt(tol);
                    } else {
                        finish(false, "未知 assert 类型：" + kind);
                        return;
                    }
                    log("[QA] assert " + kind + " -> " + (ok ? "PASS" : "FAIL") + " :: " + detail);
                    if (!ok) {
                        writeState(client, player);
                        failIntent(client, player, "assert_failed", "断言失败 " + kind + " :: " + detail);
                        return;
                    }
                    next();
                    break;
                }
                case "shot": {
                    client.setScreen(null);
                    if (shotRequestMillis == 0) {
                        shotRequestMillis = System.currentTimeMillis();
                        ScreenshotRecorder.saveScreenshot(client.runDirectory, client.getFramebuffer(), t -> { });
                        log("[QA] shot testId=" + optS(rest, "testId", "main") + " → " + new File(client.runDirectory, "screenshots") + "（等落盘）");
                    }
                    // 截图是**异步落盘**：等到出现 mtime ≥ 请求时刻的 .png 再放行（最多 SHOT_WAIT_TICKS）——
                    // 否则后置条件会读到上一条旧图当新证据（实测 2026-10-01：intent-e2e-a 读到 3 小时前的图仍 PASS）。
                    if (newestShotMillis(client) >= shotRequestMillis) {
                        shotRequestMillis = 0;
                        next();
                        break;
                    }
                    if (stepTicks > SHOT_WAIT_TICKS) {
                        shotRequestMillis = 0;
                        failIntent(client, player, "screenshot_timeout", "shot：" + SHOT_WAIT_TICKS + " tick 内未见新截图落盘");
                        return;
                    }
                    break;
                }
                case "break": {
                    int bt = optI(rest, "ticks", 40);
                    if (stepTicks == 1) {
                        client.setScreen(null);
                        player.setPitch(90.0f);
                    }
                    if (!player.isOnGround()) {
                        if (stepTicks > 200) {
                            failIntent(client, player, "break_not_grounded", "break：200 tick 内未落地");
                            return;
                        }
                        break;
                    }
                    if (blockBefore.isEmpty()) {
                        targetPos = player.getBlockPos().down();
                        blockPosText = targetPos.toShortString();
                        blockBefore = blockId(client, targetPos);
                        log("[QA] break target " + blockPosText + " before=" + blockBefore);
                    }
                    client.options.attackKey.setPressed(true);
                    if (stepTicks >= bt) {
                        client.options.attackKey.setPressed(false);
                        blockAfter = blockId(client, targetPos);
                        log("[QA] break after=" + blockAfter + "（同坐标 " + blockPosText + " 复读）");
                        if (blockBefore.isEmpty() || blockAfter.equals(blockBefore)) {
                            failIntent(client, player, "break_unchanged", "破坏证明失败：" + blockPosText + " 仍为 " + blockBefore);
                            return;
                        }
                        next();
                    }
                    break;
                }
                case "gui": {
                    if (stepTicks == 1) {
                        client.setScreen(new InventoryScreen(player));
                    }
                    if (stepTicks >= 25) {
                        if (client.currentScreen != null) {
                            guiOpened = true;
                            guiClass = client.currentScreen.getClass().getSimpleName();
                            try {
                                guiClicked = client.currentScreen.mouseClicked(
                                    new Click(client.getWindow().getScaledWidth() / 2.0, client.getWindow().getScaledHeight() / 2.0, new MouseInput(0, 0)), false);
                            } catch (Throwable t) {
                                log("[QA] gui click threw " + t);
                            }
                            client.currentScreen.close();
                            guiClosed = client.currentScreen == null;
                            log("[QA] gui class=" + guiClass + " clicked=" + guiClicked + " closed=" + guiClosed);
                        }
                        if (!guiOpened) {
                            failIntent(client, player, "gui_failed", "GUI 证明失败：InventoryScreen 未能打开");
                            return;
                        }
                        next();
                    }
                    break;
                }
                case "newworld": {
                    String wn = optS(rest, "name", WORLD);
                    if (wn.isEmpty()) {
                        finish(false, "newworld：既未给 name= 且 WORLD 也为空");
                        return;
                    }
                    // 用 level.dat 判存在（只看目录会把失败残留的半成品目录当成"已建好"而跳过，实测踩过）
                    Path saveLevel = Path.of(client.runDirectory.getPath(), "saves", wn, "level.dat");
                    if (Files.exists(saveLevel)) {
                        log("[QA] newworld: 存档已存在（level.dat 在），跳过 → " + wn);
                    } else {
                        createWorldPlatform(client, wn);
                        log("[QA] newworld: 已请求创建 " + wn + "（客户端会自动进入；后续步骤留 wait 即可）");
                    }
                    next();
                    break;
                }
                case "stop":
                    log("[QA] stop requested —— 驱动器停止接新轮（游戏进程不关，由人/编排决定何时关）");
                    roundActive = false;
                    done = true;
                    break;
                case "intent": {
                    String nm = rest;
                    String opts = "";
                    int sp3 = rest.indexOf(' ');
                    if (sp3 > 0) {
                        nm = rest.substring(0, sp3);
                        opts = rest.substring(sp3 + 1).trim();
                    }
                    intentFromMailbox = false;
                    startIntent(client, player, nm, opts);
                    if (activeIntent.isEmpty()) {
                        return; // startIntent 已判红
                    }
                    break;
                }
                case "waitintent": {
                    if (activeIntent.isEmpty() && !stateSeeded && player != null) {
                        // 起步补种：round start 那次刷新可能早于世界载入（player==null，坐标全是 0）。
                        // LLM 写第一条意图前要拿到真实 player 坐标 ⇒ 进世界后的第一条 waitintent tick 补种。
                        stateSeeded = true;
                        writeState(client, player);
                    }
                    if (activeIntent.isEmpty() && Files.exists(Path.of(INTENT_MAILBOX))) {
                        try {
                            // 容错读法（与 readLastChatLine 同纪律）：严格解码（readString）遇非 UTF-8
                            // （GBK / BOM 变体）会抛 MalformedInputException ⇒ 整轮判红、协议断。按字节读再宽松解码。
                            String body = new String(Files.readAllBytes(Path.of(INTENT_MAILBOX)), StandardCharsets.UTF_8);
                            String nm = flatGet(body, "intent");
                            if (nm.isEmpty()) {
                                finish(false, "intent.json 缺 intent 字段：" + shorten(body));
                                return;
                            }
                            String opts = mailboxOpts(body);
                            Files.move(Path.of(INTENT_MAILBOX), Path.of(INTENT_MAILBOX_DONE), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                            log("[QA] waitintent 收到 " + nm + " :: " + opts);
                            intentFromMailbox = true;
                            startIntent(client, player, nm, opts);
                            if (activeIntent.isEmpty()) {
                                return;
                            }
                        } catch (Exception e) {
                            finish(false, "waitintent 读取失败（intent.json 须为 UTF-8 文本）：" + e);
                            return;
                        }
                        break;
                    }
                    if (stepTicks > optI(rest, "max", 6000)) {
                        finish(false, "waitintent：max tick 内没等到 intent.json（邮箱 " + INTENT_MAILBOX + "）");
                        return;
                    }
                    break;
                }
                case "land": {
                    if (player.isOnGround()) {
                        log("[QA] land y=" + fmt(player.getY()));
                        next();
                        break;
                    }
                    if (stepTicks > optI(rest, "max", 200)) {
                        failIntent(client, player, "land_timeout", "land：" + optI(rest, "max", 200) + " tick 内未落地（y=" + fmt(player.getY()) + "）");
                        return;
                    }
                    break;
                }
                default:
                    finish(false, "未知步骤：" + line);
            }
        } catch (Throwable t) {
            failIntent(client, player, "step_exception", "步骤异常（" + line + "）：" + t);
        }
    }

    private static void next() {
        stepIdx++;
        stepTicks = 0;
        gotoTargetSet = false;
    }

    // ─────────────────────────────── 意图引擎：校验 / 展开 / 判定 / 证据 ───────────────────────────────
    private static final class Verdict {
        boolean ok;
        String kind = "";
        String detail = "";
    }

    /** 菜单行查一层；查不到返回 null（= 未核实/拼错，判红）。 */
    private static String menuLine(String name) {
        for (String row : INTENT_MENU) {
            int p = row.indexOf('|');
            if (p > 0 && row.substring(0, p).equals(name)) {
                return row;
            }
        }
        return null;
    }

    private static int menuBudget(String name) {
        String row = menuLine(name);
        if (row == null) {
            return 0;
        }
        String[] parts = row.split("\\|");
        return parts.length > 1 ? intOf(parts[1], 0) : 0;
    }

    private static boolean menuAllowsProfile(String name) {
        String row = menuLine(name);
        if (row == null) {
            return false;
        }
        String[] parts = row.split("\\|");
        String profiles = parts.length > 2 ? parts[2] : "";
        if (profiles.isEmpty()) {
            return true;
        }
        for (String p : profiles.split(",")) {
            if (p.equals(CAPABILITY_PROFILE)) {
                return true;
            }
        }
        return false;
    }

    /** 菜单里的意图名（逗号分隔；给 state.json 的 intentState 当 LLM 的观测面）。 */
    private static String menuNames() {
        StringBuilder sb = new StringBuilder();
        for (String row : INTENT_MENU) {
            int p = row.indexOf('|');
            if (p > 0) {
                if (sb.length() > 0) {
                    sb.append(",");
                }
                sb.append(row, 0, p);
            }
        }
        return sb.toString();
    }

    private static boolean isForbiddenIntent(String name) {        for (String f : FORBIDDEN_INTENTS) {
            if (f.equals(name)) {
                return true;
            }
        }
        return false;
    }

    private static double dist2(double ax, double az, double bx, double bz) {
        return Math.sqrt((ax - bx) * (ax - bx) + (az - bz) * (az - bz));
    }

    private static boolean hasParam(String opts, String key) {
        return !optS(opts, key, "").isEmpty();
    }

    /** 启动一个意图：禁列/菜单/档位校验 → 快照 → 展开为原语步骤；任一校验失败一律 finish(false)。 */
    private static void startIntent(MinecraftClient client, ClientPlayerEntity player, String name, String opts) {
        if (isForbiddenIntent(name)) {
            finish(false, "intent 命中禁列动作：" + name);
            return;
        }
        if (menuLine(name) == null) {
            finish(false, "intent 不在菜单（拼错或未核实）：" + name);
            return;
        }
        if (!menuAllowsProfile(name)) {
            finish(false, "intent " + name + " 不在能力档 " + CAPABILITY_PROFILE + " 的菜单内");
            return;
        }
        intentBudget = menuBudget(name);
        intentStartX = player.getX();
        intentStartZ = player.getZ();
        intentTargetBlockId = "";
        intentTargetBlockPos = null;
        intentPostMode = "";
        intentPostKind = "";
        // 先登记身份再展开：expandIntent 里的失败（参数缺 / v1 未实现）也要能按「邮箱 vs 脚本」分流，
        // 并且 failIntent 记账时 activeIntent 必须已是本意图名（否则记成空名）。
        activeIntent = name;
        activeIntentOpts = opts;
        activeIntentFromMailbox = intentFromMailbox;
        intentStartMillis = System.currentTimeMillis();
        shotRequestMillis = 0;
        String[] steps = expandIntent(client, player, name, opts);
        if (steps == null) {
            activeIntent = "";
            activeIntentOpts = "";
            activeIntentFromMailbox = false;
            return; // expandIntent 里已走 failIntent（邮箱：记账续守候；脚本：判红停轮）
        }
        savedPlan = plan;
        savedStepIdx = stepIdx;
        plan = steps;
        stepIdx = 0;
        stepTicks = 0;
        log("[QA] intent " + name + " START :: " + opts + "（展开 " + steps.length + " 步；预算 " + intentBudget + " tick；后置条件 " + intentPostKind + "）");
    }

    /**
     * 意图 = 原语展开表（复用 goto/scan/gui/assert/shot/wait/cmd 既有实现）。
     * 返回 null = 已判红（未实现或参数缺失）；**不返回** 空数组（空计划会静默通过）。
     */
    private static String[] expandIntent(MinecraftClient client, ClientPlayerEntity player, String name, String o) {
        if (name.equals("walk_to")) {
            if (!hasParam(o, "x") || !hasParam(o, "z")) {
                failIntent(client, player, "walk_to_need_xz", "walk_to 需要 x= 与 z=");
                return null;
            }
            String badNum = firstBadNum(o, "x", "z", "tol", "max");
            if (!badNum.isEmpty()) {
                failIntent(client, player, "param_not_number", "walk_to 参数不是数字：" + badNum);
                return null;
            }
            intentPostMode = "pos";
            intentTol = optF(o, "tol", 3);
            intentTargetX = optF(o, "x", player.getX());
            intentTargetZ = optF(o, "z", player.getZ());
            intentPostKind = "distance_le_tol_and_moved_ge_min";
            return new String[] { "goto x=" + fmt(intentTargetX) + " z=" + fmt(intentTargetZ) + " tol=" + fmt(intentTol)
                + " fly=0 max=" + optI(o, "max", 1200) };
        }
        if (name.equals("look_at")) {
            String badNum = firstBadNum(o, "yaw", "pitch", "tol");
            if (!badNum.isEmpty()) {
                failIntent(client, player, "param_not_number", "look_at 参数不是数字：" + badNum);
                return null;
            }
            intentTol = optF(o, "tol", 2);
            intentPostKind = "angle_le_tol";
            String target = optS(o, "target", "");
            if (!target.isEmpty()) {
                String body = target.startsWith("pos|") ? target.substring(4) : target;
                String[] xyz = body.split(",");
                if (xyz.length < 3) {
                    failIntent(client, player, "look_at_form_unimplemented", "look_at target 只实现 pos|x,y,z（block| / entity| 形态未实现，v1）：" + target);
                    return null;
                }
                double tx = Double.parseDouble(xyz[0].trim());
                double ty = Double.parseDouble(xyz[1].trim());
                double tz = Double.parseDouble(xyz[2].trim());
                intentPostMode = "look_pos";
                intentTargetX = tx;
                intentTargetZ = tz;
                intentWantYaw = lookYaw(player, tx, tz);
                intentWantPitch = lookPitch(player, tx, ty, tz);
                return new String[] { "look yaw=" + fmt(intentWantYaw) + " pitch=" + fmt(intentWantPitch) };
            }
            intentPostMode = "look_yaw";
            intentWantYaw = (float) optF(o, "yaw", player.getYaw());
            intentWantPitch = (float) optF(o, "pitch", player.getPitch());
            return new String[] { "look yaw=" + fmt(intentWantYaw) + " pitch=" + fmt(intentWantPitch) };
        }
        if (name.equals("find_and_goto")) {
            String badNum = firstBadNum(o, "tol", "fly", "max", "radius");
            if (!badNum.isEmpty()) {
                failIntent(client, player, "param_not_number", "find_and_goto 参数不是数字：" + badNum);
                return null;
            }
            intentTol = optF(o, "tol", 24);
            int fly = optI(o, "fly", 1);
            int max = optI(o, "max", 9000);
            int radius = optI(o, "radius", 64);
            String st = optS(o, "structure", "");
            String bl = optS(o, "block", "");
            String en = optS(o, "entity", "");
            if (!st.isEmpty()) {
                intentPostMode = "locate";
                intentPostKind = "reached_parsed_tol";
                gotoArrived = false;
                return new String[] { "cmd locate structure " + st,
                    "goto parsed tol=" + fmt(intentTol) + " fly=" + fly + " max=" + max };
            }
            if (!bl.isEmpty()) {
                intentPostMode = "scan_block";
                intentPostKind = "block_found_and_reached";
                intentTargetBlockId = bl;
                return new String[] { "scan blocks=" + bl + " radius=" + radius + " stride=1",
                    "goto nearest tol=" + fmt(intentTol) + " fly=" + fly + " max=" + max, "land" };
            }
            if (!en.isEmpty()) {
                intentPostMode = "scan_entity";
                intentPostKind = "entity_found_and_reached";
                return new String[] { "scan entities=" + en + " radius=" + radius,
                    "goto nearest tol=" + fmt(intentTol) + " fly=" + fly + " max=" + max, "land" };
            }
            failIntent(client, player, "find_and_goto_need_form", "find_and_goto 需要 structure=|block=|entity= 之一");
            return null;
        }
        if (name.equals("observe")) {
            String badNum = firstBadNum(o, "radius", "stride");
            if (!badNum.isEmpty()) {
                failIntent(client, player, "param_not_number", "observe 参数不是数字：" + badNum);
                return null;
            }
            String en = optS(o, "entities", "");
            String bl = optS(o, "blocks", "");
            int radius = optI(o, "radius", 64);
            if (en.isEmpty() && bl.isEmpty()) {
                failIntent(client, player, "observe_need_scan", "observe 需要 entities= 或 blocks=（v1：空扫无判据）");
                return null;
            }
            intentPostMode = "scan";
            intentPostKind = "scan_written";
            intentScanWantedEntity = !en.isEmpty();
            intentScanWantedBlock = !bl.isEmpty();
            StringBuilder sb = new StringBuilder("scan radius=" + radius);
            if (!en.isEmpty()) {
                sb.append(" entities=").append(en);
            }
            if (!bl.isEmpty()) {
                sb.append(" blocks=").append(bl).append(" stride=").append(optI(o, "stride", 4));
            }
            return new String[] { sb.toString() };
        }
        if (name.equals("open_gui")) {
            intentPostMode = "gui";
            intentPostKind = "screen_present_and_closed";
            guiOpened = false;
            guiClicked = false;
            guiClosed = false;
            return new String[] { "gui" };
        }
        if (name.equals("inventory")) {
            String badNum = firstBadNum(o, "slot");
            if (!badNum.isEmpty()) {
                failIntent(client, player, "param_not_number", "inventory 参数不是数字：" + badNum);
                return null;
            }
            String contains = optS(o, "contains", "");
            intentPostMode = "inv";
            intentPostKind = "inventory_assert";
            if (!contains.isEmpty()) {
                return new String[] { "assert inv slot=" + optI(o, "slot", EXPECT_SLOT) + " item=" + contains };
            }
            if (!optS(o, "slot", "").isEmpty()) {
                return new String[] { "assert inv_nonempty slot=" + optI(o, "slot", EXPECT_SLOT) };
            }
            failIntent(client, player, "inventory_need_query", "inventory 需要 contains= 或 slot= 之一");
            return null;
        }
        if (name.equals("screenshot")) {
            intentPostMode = "shot";
            intentPostKind = "screenshot_file_nonempty";
            intentShotTestId = optS(o, "testId", "intent");
            return new String[] { "shot testId=" + intentShotTestId };
        }
        if (name.equals("wait")) {
            String badNum = firstBadNum(o, "ticks");
            if (!badNum.isEmpty()) {
                failIntent(client, player, "param_not_number", "wait 参数不是数字：" + badNum);
                return null;
            }
            intentPostMode = "wait";
            intentPostKind = "ticks_elapsed_or_cond";
            if (!optS(o, "until", "").isEmpty()) {
                failIntent(client, player, "wait_until_unimplemented", "wait until= 形态（chunk/daylight）未实现（v1 只支持 ticks=）—— 换 wait{ticks} / observe");
                return null;
            }
            return new String[] { "wait " + optI(o, "ticks", 20) };
        }
        if (name.equals("tp")) {
            if (!CAPABILITY_PROFILE.equals("operator") && !CAPABILITY_PROFILE.equals("creative")) {
                finish(false, "tp 只在 operator/creative 档（当前 " + CAPABILITY_PROFILE + "）");
                return null;
            }
            if (!hasParam(o, "x") || !hasParam(o, "z")) {
                failIntent(client, player, "tp_need_xz", "tp 需要 x= 与 z=");
                return null;
            }
            String badNum = firstBadNum(o, "x", "z", "tol");
            if (!badNum.isEmpty()) {
                failIntent(client, player, "param_not_number", "tp 参数不是数字：" + badNum);
                return null;
            }
            intentPostMode = "tp";
            intentTol = optF(o, "tol", 4);
            intentTargetX = optF(o, "x", player.getX());
            intentTargetZ = optF(o, "z", player.getZ());
            intentPostKind = "distance_le_tol_tp";
            return new String[] { "cmd tp @s " + (int) Math.floor(intentTargetX) + " 140 " + (int) Math.floor(intentTargetZ), "land" };
        }
        if (name.equals("stop")) {
            intentPostMode = "stop";
            intentPostKind = "driver_stops";
            // 展开成 no-op 步：真正收尾在 completeIntent 里做 —— 展开成 stop 步会把 done 置位，
            // 让"子计划跑完 → 判后置条件"这条路永远进不去（判据与证据就丢了）。
            return new String[] { "mark intent:stop" };
        }
        failIntent(client, player, "unimplemented_v1", "intent 未实现（v1 白名单外）：" + name + " —— 落地面见 README.playtest.md 的意图表");
        return null;
    }

    /**
     * 意图**步级**失败的统一出口（goto/land/assert/gui 等原语在子计划里失败、参数/形态不满足、单意图预算耗尽）。
     * 邮箱来源 ⇒ 记一条 ok=false 进 intentLog 并回到 waitintent 守候（「选错→判红→换意图→成功」链要求会话可续）；
     * 脚本来源（plan 里的 intent 步骤）⇒ 照旧判红停轮。协议违规（禁列/不在菜单/档位不符）不经过这里 ——
     * 它们在 startIntent 里直接 finish(false)。
     */
    private static void failIntent(MinecraftClient client, ClientPlayerEntity player, String kind, String detail) {
        if (!activeIntentFromMailbox) {
            // activeIntent 为空 = 非意图步骤（脚本里的普通步骤）抛异常走到这里 —— 文案别写成 "intent  失败"
            String who = activeIntent.isEmpty() ? "脚本步骤" : ("intent " + activeIntent);
            finish(false, who + " 失败 :: " + kind + " :: " + detail);
            return;
        }
        INTENT_LOG.append(INTENT_LOG.length() > 0 ? "," : "").append("    {\"intent\": \"").append(jsonEsc(activeIntent))
            .append("\", \"params\": \"").append(jsonEsc(activeIntentOpts))
            .append("\", \"postcondition\": \"\", \"failure\": \"").append(jsonEsc(kind))
            .append("\", \"ok\": false")
            .append(", \"detail\": \"").append(jsonEsc(detail)).append("\"}");
        intentsThisRound++;
        lastIntentName = activeIntent;
        lastIntentOk = false;
        lastIntentPost = "";
        lastIntentFailure = kind;
        lastIntentDetail = detail;
        if (savedPlan != null) {
            plan = savedPlan;
            stepIdx = savedStepIdx;
            savedPlan = null;
        } // savedPlan == null = 失败发生在 expandIntent 期（子计划还没换入）⇒ 原地留在外层 waitintent
        activeIntentFromMailbox = false;
        activeIntent = "";
        activeIntentOpts = "";
        stepTicks = 0;
        writeState(client, player);
        log("[QA] intent FAIL 已记入 intentLog -> 继续守候下一条 intent.json（换意图见菜单 fallback / 工具 nextSteps）");
    }

    /** 子计划跑完：判类型化后置条件 → 写证据 → 回外层（失败判红，**不自动重试** non-idempotent）。 */
    private static void completeIntent(MinecraftClient client, ClientPlayerEntity player) {
        String name = activeIntent;
        String opts = activeIntentOpts;
        Verdict v = verdictFor(client, player);
        log("[QA] intent " + name + " -> " + (v.ok ? "PASS" : "FAIL") + " :: " + v.kind + " :: " + v.detail);
        INTENT_LOG.append(INTENT_LOG.length() > 0 ? "," : "").append("    {\"intent\": \"").append(jsonEsc(name))
            .append("\", \"params\": \"").append(jsonEsc(opts))
            .append("\", \"postcondition\": \"").append(jsonEsc(v.kind)).append("\", \"failure\": \"\"")
            .append(", \"ok\": ").append(v.ok)
            .append(", \"detail\": \"").append(jsonEsc(v.detail)).append("\"}");
        intentsThisRound++;
        lastIntentName = name;
        lastIntentOk = v.ok;
        lastIntentPost = v.kind;
        lastIntentFailure = "";
        lastIntentDetail = v.detail;
        plan = savedPlan;
        stepIdx = savedStepIdx;
        savedPlan = null;
        activeIntent = "";
        activeIntentOpts = "";
        stepTicks = 0;
        writeState(client, player); // 每条意图跑完都刷新观测面（成功 / 失败都要）—— 口径单源「每轮喂给 LLM 的观测契约」
        if (!v.ok) {
            if (activeIntentFromMailbox) {
                // 邮箱形态（LLM 驱动）：后置条件失败是**数据**（已在 intentLog 里，ok=false）——
                // 设计口径「失败不得自动重试，只许换意图」（口径单源 §意图空间）要求 LLM 能在同一会话里
                // 按 fallback 换意图，并把「选错→判红→换意图→成功」记成一条链 ⇒ 会话继续守候下一条。
                // 协议违规（禁列 / 不在菜单 / 档位不符）与脚本形态（intent 步骤）仍一律判红停轮。
                activeIntentFromMailbox = false;
                log("[QA] intent FAIL 已记入 intentLog -> 继续守候下一条 intent.json（换意图见菜单 fallback / 工具 nextSteps）");
                return;
            }
            finish(false, "intent 后置条件失败 " + name + " :: " + v.kind + " :: " + v.detail);
            return;
        }
        if (name.equals("stop")) {
            finish(true, "intent stop：收尾本轮（驱动器回到守候，游戏进程不关）");
            return;
        }
        if (activeIntentFromMailbox) {
            activeIntentFromMailbox = false;
            log("[QA] waitintent：继续守候下一条 intent.json");
            return; // 邮箱形态：停在 waitintent 这一步，等 LLM 下一条
        }
        next();
    }

    /** 类型化后置条件判定（每种意图一条，判据与菜单 postcondition.kind 字字对应）。 */
    private static Verdict verdictFor(MinecraftClient client, ClientPlayerEntity player) {
        Verdict v = new Verdict();
        v.kind = intentPostKind;
        if (intentPostMode.equals("pos")) {
            double d = dist2(player.getX(), player.getZ(), intentTargetX, intentTargetZ);
            double traveled = dist2(intentStartX, intentStartZ, player.getX(), player.getZ());
            double need = Math.max(0.0, dist2(intentStartX, intentStartZ, intentTargetX, intentTargetZ) - intentTol);
            v.ok = d <= intentTol + 0.01 && traveled >= need - 0.01;
            v.detail = "dist=" + fmt(d) + " tol=" + fmt(intentTol) + " traveled=" + fmt(traveled) + " min=" + fmt(need);
        } else if (intentPostMode.equals("look_yaw")) {
            double dy = angDiff(player.getYaw(), intentWantYaw);
            double dp = angDiff(player.getPitch(), intentWantPitch);
            v.ok = dy <= intentTol && dp <= intentTol;
            v.detail = "dYaw=" + fmt(dy) + " dPitch=" + fmt(dp) + " tol=" + fmt(intentTol);
        } else if (intentPostMode.equals("look_pos")) {
            double dy = angDiff(player.getYaw(), lookYaw(player, intentTargetX, intentTargetZ));
            double dd = dist2(player.getX(), player.getZ(), intentTargetX, intentTargetZ);
            v.ok = dy <= intentTol && dd <= 128.0;
            v.detail = "dYaw=" + fmt(dy) + " dist=" + fmt(dd) + " tol=" + fmt(intentTol);
        } else if (intentPostMode.equals("locate")) {
            double d = dist2(player.getX(), player.getZ(), gotoX, gotoZ);
            v.ok = gotoArrived && d <= intentTol + 1.0;
            v.detail = "arrived=" + gotoArrived + " dist=" + fmt(d) + " tol=" + fmt(intentTol);
        } else if (intentPostMode.equals("scan_block")) {
            double d = dist2(player.getX(), player.getZ(), scanNearestX, scanNearestZ);
            String at = intentTargetBlockPos == null ? "(null)" : blockId(client, intentTargetBlockPos);
            v.ok = scanNearestFound && intentTargetBlockPos != null && intentTargetBlockId.equals(at)
                && d <= intentTol + 1.0 && player.isOnGround();
            v.detail = "found=" + scanNearestFound + " at=" + at + " dist=" + fmt(d) + " onGround=" + player.isOnGround();
        } else if (intentPostMode.equals("scan_entity")) {
            double d = dist2(player.getX(), player.getZ(), scanNearestX, scanNearestZ);
            v.ok = scanNearestFound && d <= intentTol + 1.0;
            v.detail = "found=" + scanNearestFound + " dist=" + fmt(d) + " tol=" + fmt(intentTol);
        } else if (intentPostMode.equals("scan")) {
            boolean okE = !intentScanWantedEntity || scanEntityFound;
            boolean okB = !intentScanWantedBlock || scanBlockFound;
            v.ok = okE && okB;
            v.detail = "entities=" + (intentScanWantedEntity ? (scanEntityFound ? "hit" : "miss") : "n/a")
                + " blocks=" + (intentScanWantedBlock ? (scanBlockFound ? "hit" : "miss") : "n/a");
        } else if (intentPostMode.equals("gui")) {
            v.ok = guiOpened && guiClicked && guiClosed;
            v.detail = "opened=" + guiOpened + " clicked=" + guiClicked + " closed=" + guiClosed + " class=" + guiClass;
        } else if (intentPostMode.equals("inv")) {
            v.ok = lastInvOk;
            v.detail = lastInvDetail;
        } else if (intentPostMode.equals("shot")) {
            File dir = new File(client.runDirectory, "screenshots");
            File[] files = dir.listFiles();
            String fn = "";
            long sz = 0;
            long newest = -1;
            if (files != null) {
                for (File f : files) {
                    if (f.getName().endsWith(".png") && f.length() > 0 && f.lastModified() > newest) {
                        newest = f.lastModified();
                        fn = f.getName();
                        sz = f.length();
                    }
                }
            }
            // 新鲜度判据：最新图的 mtime 必须 ≥ 本条意图起点（留 1.5s 容差）——「目录里有 png」会拿旧图充新证据
            v.ok = !fn.isEmpty() && newest >= intentStartMillis - 1500;
            v.detail = "file=" + fn + " bytes=" + sz + " ageMs=" + (System.currentTimeMillis() - newest) + " testId=" + intentShotTestId;
        } else if (intentPostMode.equals("wait")) {
            v.ok = true;
            v.detail = "ticks=" + stepTicks;
        } else if (intentPostMode.equals("tp")) {
            double d = dist2(player.getX(), player.getZ(), intentTargetX, intentTargetZ);
            v.ok = d <= intentTol + 1.0;
            v.detail = "dist=" + fmt(d) + " tol=" + fmt(intentTol);
        } else if (intentPostMode.equals("stop")) {
            v.ok = true;
            v.detail = "stop requested";
        } else {
            v.ok = false;
            v.detail = "未知后置条件 mode=" + intentPostMode;
        }
        return v;
    }

    /** screenshots 目录里最新非空 .png 的 mtime（无文件返回 -1）。 */
    private static long newestShotMillis(MinecraftClient client) {
        File dir = new File(client.runDirectory, "screenshots");
        File[] files = dir.listFiles();
        long newest = -1;
        if (files != null) {
            for (File f : files) {
                if (f.getName().endsWith(".png") && f.length() > 0 && f.lastModified() > newest) {
                    newest = f.lastModified();
                }
            }
        }
        return newest;
    }

    private static double angDiff(float a, float b) {
        double d = Math.abs(a - b) % 360.0;
        return d > 180.0 ? 360.0 - d : d;
    }

    private static float lookYaw(ClientPlayerEntity p, double tx, double tz) {
        return (float) Math.toDegrees(Math.atan2(-(tx - p.getX()), tz - p.getZ()));
    }

    private static float lookPitch(ClientPlayerEntity p, double tx, double ty, double tz) {
        double dx = tx - p.getX();
        double dz = tz - p.getZ();
        double dy = ty - (p.getY() + 1.62);
        return (float) Math.toDegrees(-Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)));
    }

    /** 极简扁平 JSON 取值（邮箱文件由本仓 playtest_intent 工具写，形状固定一层）。 */
    private static String flatGet(String json, String key) {
        java.util.regex.Matcher m = java.util.regex.Pattern
            .compile("\"" + key + "\"\\s*:\\s*(\"([^\"]*)\"|[^,}\\s]+)").matcher(json);
        if (!m.find()) {
            return "";
        }
        return m.group(2) != null ? m.group(2) : m.group(1);
    }

    /** 邮箱 JSON → 意图参数（只认白名单键；intent 键由调用侧单独取）。 */
    private static String mailboxOpts(String json) {
        StringBuilder sb = new StringBuilder();
        for (String k : INTENT_PARAM_KEYS) {
            String val = flatGet(json, k);
            if (!val.isEmpty()) {
                if (sb.length() > 0) {
                    sb.append(" ");
                }
                sb.append(k).append("=").append(val);
            }
        }
        return sb.toString();
    }

    /** 兜底读法：<runDir>/logs/latest.log 的最后一条含 [CHAT] 的行（实测 /locate 的结果就落在这里）。 */
    private static String readLastChatLine(MinecraftClient client) {
        try {
            Path log = Path.of(client.runDirectory.getPath(), "logs", "latest.log");
            if (!Files.exists(log)) {
                return "";
            }
            // 容错读法：不用 Files.readAllLines（它以"严格"方式解码，遇到混合编码会抛
            // MalformedInputException —— 本驱动的中文日志行经 JVM 控制台写进 UTF-8 latest.log 时会混入 GBK 字节，
            // 实测 2026-09-29 forge 1.20.1：读失败 ⇒ 日志兜底整条失效）。
            String[] lines = new String(Files.readAllBytes(log), StandardCharsets.UTF_8).split("\\R", -1);
            for (int i = lines.length - 1; i >= 0 && i > lines.length - 400; i--) {
                String l = lines[i];
                if (l.contains("[CHAT]")) {
                    return l;
                }
            }
        } catch (Exception e) {
            log("[QA] readLastChatLine failed: " + e);
        }
        return "";
    }

    private static void startRound() {
        roundNo++;
        stepIdx = 0;
        stepTicks = 0;
        roundActive = true;
        ticks = 0;
        QA.setLength(0); // qa.log 只留本轮（历史轮次在 rounds.jsonl；判读器按 *.log 计数，混轮会污染 done/error）
        INTENT_LOG.setLength(0);
        intentsThisRound = 0;
        activeIntent = "";
        activeIntentOpts = "";
        savedPlan = null;
        savedStepIdx = 0;
        intentFromMailbox = false;
        activeIntentFromMailbox = false;
        stateSeeded = false;
        lastIntentName = "";
        lastIntentOk = false;
        lastIntentPost = "";
        lastIntentFailure = "";
        lastIntentDetail = "";
        log("[QA] ROUND " + roundNo + " START（steps=" + plan.length + "）");
    }

    /** 剧本文件是否存在且 mtime 变了（变了 ⇒ 开新一轮；同一游戏进程内，不重启）。 */
    private static boolean planFileChanged() {
        try {
            Path p = Path.of(PLAN_FILE);
            if (!Files.exists(p)) {
                return false;
            }
            long m = Files.getLastModifiedTime(p).toMillis();
            return m != planMtime;
        } catch (Exception e) {
            return false;
        }
    }

    /** 从剧本文件读步骤（跳过空行与 # 注释）；读不到就沿用内置 PLAN。 */
    private static boolean loadPlan() {
        try {
            Path p = Path.of(PLAN_FILE);
            if (!Files.exists(p)) {
                return false;
            }
            java.util.List<String> lines = new java.util.ArrayList<>();
            for (String l : Files.readAllLines(p, StandardCharsets.UTF_8)) {
                String t = l.trim();
                if (t.isEmpty() || t.startsWith("#")) {
                    continue;
                }
                lines.add(t);
            }
            if (lines.isEmpty()) {
                return false;
            }
            plan = lines.toArray(new String[0]);
            planMtime = Files.getLastModifiedTime(p).toMillis();
            log("[QA] plan loaded from " + PLAN_FILE + " steps=" + plan.length);
            return true;
        } catch (Exception e) {
            log("[QA] plan load failed: " + e);
            return false;
        }
    }

    private static MinecraftClient mc;

    /** 松掉所有被按下的键（每轮结束必做，避免"卡着一直走"）。 */
    /**
     * 造世界钩子（newworld 步骤用）。
     * **本桩只对被改写表跳过的档生效**：forge 档由改写表注入 7 参 createFreshLevel；26.x 档由 applyNewworld26xx
     * 换成按实测签名写的那份。仍停在本桩的（fabric ≤1.21.x / quilt / neoforge ≤1.21.x 的 fabric 基表）**确实未取证**
     * createAndStart 面 ⇒ fail-closed 判红（不静默）。
     */
    private static void createWorldPlatform(MinecraftClient client, String name) {
        finish(false, "newworld：本档（fabric 基表，≤1.21.x）未取证造世界 API（createAndStart / LevelInfo / GeneratorOptions 构造面）——请先在客户端建一次世界再复用（用 --quickPlaySingleplayer / enterWorld），或先取证后补本钩子");
    }

    private static void releaseAll() {
        if (mc == null) {
            return;
        }
        for (String k : new String[] { "forward", "back", "left", "right", "jump", "sneak", "attack", "use" }) {
            press(mc, k, false);
        }
    }

    private static void press(MinecraftClient client, String key, boolean down) {
        switch (key) {
            case "forward": client.options.forwardKey.setPressed(down); break;
            case "back": client.options.backKey.setPressed(down); break;
            case "left": client.options.leftKey.setPressed(down); break;
            case "right": client.options.rightKey.setPressed(down); break;
            case "jump": client.options.jumpKey.setPressed(down); break;
            case "sneak": client.options.sneakKey.setPressed(down); break;
            case "sprint": client.options.sprintKey.setPressed(down); break;
            case "attack": client.options.attackKey.setPressed(down); break;
            case "use": client.options.useKey.setPressed(down); break;
            default: log("[QA] 未知键位：" + key);
        }
    }

    private static void sendCommand(MinecraftClient client, String command) {
        if (client.getNetworkHandler() == null) { // 1.21.11 是 getNetworkHandler()（旧写法 client.networkHandler 已不可见，实测编译报"找不到符号"）
            finish(false, "sendCommand：networkHandler 为空");
            return;
        }
        client.getNetworkHandler().sendChatCommand(command.startsWith("/") ? command.substring(1) : command);
    }

    private static boolean contains(String[] arr, String v) {
        for (String a : arr) {
            if (a.equals(v)) {
                return true;
            }
        }
        return false;
    }

    /** 从 /locate 的返回文本里抽 [x, ~, z]（zh_CN / en_us 通用；失败返回 null，由调用侧判红）。 */
    private static double[] parseXZ(String text) {
        if (text == null || text.isEmpty()) {
            return null;
        }
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("\\[(-?\\d+),\\s*~,\\s*(-?\\d+)\\]").matcher(text);
        if (m.find()) {
            return new double[] { Double.parseDouble(m.group(1)), Double.parseDouble(m.group(2)) };
        }
        return null;
    }

    private static String shorten(String s) {
        if (s == null) {
            return "(null)";
        }
        return s.length() <= 120 ? s : s.substring(0, 120) + "…";
    }

    private static int intOf(String s, int dflt) {
        try {
            return Integer.parseInt(s.trim());
        } catch (Exception e) {
            return dflt;
        }
    }

    /** 数值参数格式检查（2026-10-01 质量批）：键**存在**但解析失败 ⇒ 返回该 "key=value"（调用方判红）；
     *  键缺席或可解析 ⇒ ""。此前解析失败静默回默认 ⇒ walk_to x=abc 目标塌成当前位置、
     *  后置条件「防本来就在那」半条自动失效 ⇒ 假绿。 */
    private static String firstBadNum(String opts, String... keys) {
        for (String tok : opts.split("\\s+")) {
            int eq = tok.indexOf('=');
            if (eq <= 0) {
                continue;
            }
            String k = tok.substring(0, eq);
            boolean wanted = false;
            for (String key : keys) {
                if (key.equals(k)) {
                    wanted = true;
                    break;
                }
            }
            if (!wanted) {
                continue;
            }
            try {
                Double.parseDouble(tok.substring(eq + 1));
            } catch (Exception e) {
                return tok;
            }
        }
        return "";
    }

    private static String optS(String opts, String key, String dflt) {
        for (String tok : opts.split("\\s+")) {
            int eq = tok.indexOf('=');
            if (eq > 0 && tok.substring(0, eq).equals(key)) {
                return tok.substring(eq + 1);
            }
        }
        return dflt;
    }

    private static int optI(String opts, String key, int dflt) {
        return intOf(optS(opts, key, Integer.toString(dflt)), dflt);
    }

    private static double optF(String opts, String key, double dflt) {
        try {
            return Double.parseDouble(optS(opts, key, Double.toString(dflt)));
        } catch (Exception e) {
            return dflt;
        }
    }

    private static void writeState(MinecraftClient client, ClientPlayerEntity player) {
        // 观测面必须反映**当下**：player 非空就快照坐标 —— 起步那次刷新常发生在标题屏（player==null），
        // 若不在这里刷新，state.json 的 x/y/z 会永远停在 0（实测 2026-10-01：会话跑了 5 分钟全是 0,0,0）。
        if (player != null) {
            playerName = player.getName().getString();
            px = player.getX();
            py = player.getY();
            pz = player.getZ();
        }
        try {
            Files.createDirectories(Path.of(EVIDENCE_DIR));
            Files.writeString(Path.of(EVIDENCE_DIR, "state.json"), stateJson(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            log("[QA] state.json 写入失败：" + e);
        }
    }

    /**
     * 结束**本轮**（不是结束游戏）：写证据 + 松键；长驻模式下继续守候下一次剧本变更。
     * 判读口径不变：[QA] DONE / [QA] ERROR 仍会出现（前缀带 round 号），qa.log 追加全量 [QA] 段。
     */
    private static void finish(boolean ok, String detail) {
        log((ok ? "[QA] DONE :: " : "[QA] ERROR: ") + "[round " + roundNo + "] " + detail);
        releaseAll();
        if (client0Screen() != null) {
            // 每轮结束收起任何残留界面（截图/后续轮次都不受 GUI 干扰）
            clientSetScreenNull();
        }
        try {
            Files.createDirectories(Path.of(EVIDENCE_DIR));
            Files.writeString(Path.of(EVIDENCE_DIR, "exit-code.txt"), (ok ? "0" : "1") + nl(), StandardCharsets.UTF_8);
            // 成功轮也要重写 state.json（首版只在断言失败路径写 ⇒ 成功轮留的是上一轮的旧读数，实测 2026-09-29）
            Files.writeString(Path.of(EVIDENCE_DIR, "state.json"), stateJson(), StandardCharsets.UTF_8);
            // 文件名必须是 .log：inspect_playtest_evidence 的 [QA] 段约定 =「证据目录内任意 .log 尾部」（首版写 qa.txt ⇒ 判读报 absent，实测 2026-09-29）
            // 内容只含**本轮**（QA 缓冲在 startRound 清空）⇒ 判读器的 done/error 计数不会被历史轮次污染；历史看 rounds.jsonl
            Files.writeString(Path.of(EVIDENCE_DIR, "qa.log"), QA.toString(), StandardCharsets.UTF_8);
            // steps/done 记「外层计划」的进度（意图子计划跑一半时判红也要能读懂整轮进度）
            int outerSteps = activeIntent.isEmpty() ? plan.length : (savedPlan == null ? plan.length : savedPlan.length);
            int outerDone = activeIntent.isEmpty() ? stepIdx : savedStepIdx;
            Files.writeString(Path.of(EVIDENCE_DIR, "rounds.jsonl"),
                "{\"round\":" + roundNo + ",\"ok\":" + ok + ",\"steps\":" + outerSteps + ",\"done\":" + outerDone
                    + ",\"intents\":" + intentsThisRound + ",\"intentLog\":[" + INTENT_LOG + "],\"detail\":\"" + jsonEsc(detail) + "\"}" + nl(),
                StandardCharsets.UTF_8, java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND);
        } catch (IOException e) {
            System.out.println("[QA] ERROR: 证据写入失败：" + e);
        }
        roundActive = false;
        stepIdx = 0;
        stepTicks = 0;
        ticks = 0; // 轮末复位预算计数（空闲期不计入下一轮）
        if (!WATCH_PLAN) {
            done = true;
            registered = false;
        }
    }

    private static net.minecraft.client.gui.screen.Screen client0Screen() {
        return mc == null ? null : mc.currentScreen;
    }

    private static void clientSetScreenNull() {
        if (mc != null) {
            mc.setScreen(null);
        }
    }

    /** 手写 JSON。**所有字符串值一律过 jsonEsc**（手拼 + 只替引号漏 \n 的历史事故：state.json 不可解析 / JSONL 被劈行）。 */
    private static String stateJson() {
        String q = "\"";
        return "{" + nl()
            + "  " + q + "at" + q + ": " + q + Instant.now() + q + "," + nl()
            + "  " + q + "player" + q + ": " + q + jsonEsc(playerName) + q + "," + nl()
            + "  " + q + "x" + q + ": " + px + ", " + q + "y" + q + ": " + py + ", " + q + "z" + q + ": " + pz + "," + nl()
            + "  " + q + "slot" + q + ": " + EXPECT_SLOT + "," + nl()
            + "  " + q + "itemId" + q + ": " + q + jsonEsc(observedItem) + q + "," + nl()
            + "  " + q + "expect" + q + ": " + q + jsonEsc(EXPECT_ITEM) + q + "," + nl()
            + "  " + q + "move" + q + ": {" + q + "delta" + q + ": " + moveDelta + ", " + q + "min" + q + ": " + MOVE_MIN_HORIZONTAL + ", " + q + "dir" + q + ": " + q + DIR_NAMES[Math.min(dirIdx, DIR_NAMES.length - 1)] + q + "}," + nl()
            + "  " + q + "block" + q + ": {" + q + "pos" + q + ": " + q + jsonEsc(blockPosText) + q + ", " + q + "before" + q + ": " + q + jsonEsc(blockBefore) + q + ", " + q + "after" + q + ": " + q + jsonEsc(blockAfter) + q + "}," + nl()
            + "  " + q + "gui" + q + ": {" + q + "opened" + q + ": " + guiOpened + ", " + q + "class" + q + ": " + q + jsonEsc(guiClass) + q + ", " + q + "clicked" + q + ": " + guiClicked + ", " + q + "closed" + q + ": " + guiClosed + "}," + nl()
            + "  " + q + "plan" + q + ": {" + q + "steps" + q + ": " + PLAN.length + ", " + q + "done" + q + ": " + stepIdx + "}," + nl()
            + "  " + q + "scan" + q + ": {" + q + "entities" + q + ": " + q + jsonEsc(scanEntityText) + q + ", " + q + "blocks" + q + ": " + q + jsonEsc(scanBlockText) + q
            + ", " + q + "nearest" + q + ": {" + q + "found" + q + ": " + scanNearestFound + ", " + q + "id" + q + ": " + q + jsonEsc(scanNearestId) + q
            + ", " + q + "x" + q + ": " + scanNearestX + ", " + q + "y" + q + ": " + scanNearestY + ", " + q + "z" + q + ": " + scanNearestZ + "}}," + nl()
            + "  " + q + "goto" + q + ": {" + q + "x" + q + ": " + gotoX + ", " + q + "z" + q + ": " + gotoZ
            + ", " + q + "arrived" + q + ": " + gotoArrived + ", " + q + "arrivedDist" + q + ": " + gotoArrivedDist + "}," + nl()
            + "  " + q + "intentState" + q + ": {" + q + "profile" + q + ": " + q + CAPABILITY_PROFILE + q
            + ", " + q + "menu" + q + ": " + q + menuNames() + q
            + ", " + q + "mailbox" + q + ": " + q + jsonEsc(INTENT_MAILBOX) + q
            + ", " + q + "remainingTicks" + q + ": " + (BUDGET_TICKS - ticks)
            + ", " + q + "active" + q + ": " + q + jsonEsc(activeIntent) + q + "}," + nl()
            + "  " + q + "intents" + q + ": [" + nl() + INTENT_LOG + nl() + "  ]," + nl()
            + "  " + q + "lastIntent" + q + ": {" + q + "name" + q + ": " + q + jsonEsc(lastIntentName) + q
            + ", " + q + "ok" + q + ": " + lastIntentOk + ", " + q + "postcondition" + q + ": " + q + jsonEsc(lastIntentPost) + q
            + ", " + q + "failure" + q + ": " + q + jsonEsc(lastIntentFailure) + q
            + ", " + q + "detail" + q + ": " + q + jsonEsc(lastIntentDetail) + q + "}" + nl()
            + "}" + nl();
    }

    private static String blockId(MinecraftClient client, BlockPos pos) {
        BlockState st = client.world.getBlockState(pos);
        return Registries.BLOCK.getId(st.getBlock()).toString();
    }

    private static String nl() {
        return System.lineSeparator();
    }

    /** 把字符串安全嵌进 JSON 字面量。**顺序要紧**：先翻反斜杠（否则会把它自己新插入的 \r \n \t 再翻一遍），
     *  引号按既有约定收成单引号；控制字符必须转义 —— 不转 \n 会把手拼的 JSONL 一行劈成两半、判读器整行解析挂
     *  （实测：Windows 路径的 \m \p 曾让 state.json 整体不可解析；异常消息带换行会劈 rounds.jsonl）。 */
    private static String jsonEsc(String s) {
        if (s == null) {
            return "";
        }
        return s.replace("\\", "\\\\").replace("\"", "'")
            .replace("\r", "\\r").replace("\n", "\\n").replace("\t", "\\t");
    }

    private static String fmt(double v) {
        return String.format(Locale.ROOT, "%.2f", v);
    }

    /** 控制台只出 ASCII：中文日志经 JVM 控制台会以平台编码（Windows=GBK）混进 UTF-8 的 logs/latest.log，
     *  既把"读日志兜底"搅成 MalformedInputException，也污染人读质量（实测 2026-09-29 forge 1.20.1）。
     *  需要中文的部分进证据文件（qa.log / state.json 都是 UTF-8 写）。 */
    private static void log(String msg) {
        QA.append(msg).append(nl());
        StringBuilder b = new StringBuilder(msg.length());
        for (int i = 0; i < msg.length(); i++) {
            char c = msg.charAt(i);
            b.append(c < 0x80 ? c : '?');
        }
        System.out.println(b.toString());
    }
}
`;
    // neoforge 1.20.1 仍用 net.minecraftforge 包名（Forge 兼容层）⇒ 共用 forge 表；
    // neoforge 1.20.2+ 起是 net.neoforged 命名层 ⇒ 走 rewriteForNeoForge（= forge 表 + 事件栈换包，javap 实测）。
    // forge 1.16.5–1.19.4（旧 mojmap 面）⇒ 独立 legacy 表；其余 forge 走 forge 表。
    const useForgeLegacyTable = platform === "forge" && FORGE_LEGACY_VERSIONS.includes(version);
    const useForgeTable = (platform === "forge" && !useForgeLegacyTable) || (platform === "neoforge" && version === "1.20.1");
    // neoforge 26.1+ = 去混淆层 + **NeoForge 26.x 事件栈**（ClientTickEvent.Post，无 phase）⇒ 独立表
    const useNeoForge26Table = platform === "neoforge" && /^26\./.test(version);
    const useNeoForgeTable = platform === "neoforge" && version !== "1.20.1" && !useNeoForge26Table;
    // `IntegratedServerLoader.start(Screen,String)` 形（1.20.1 与 1.19.4；javap 实测 1.19.4 同签名）——fabric/quilt 共用 yarn 命名层
    const useFabric1201Table = (platform === "fabric" || platform === "quilt") && (version === "1.20.1" || version === "1.19.4");
    // fabric/quilt 1.14.4（Java 8 运行期；无消息事件模块；旧背包/截图/朝向面）与 1.16.5–1.18.2（同为旧 Registry/进世界/命令面、
    // 无 IntegratedServerLoader、无消息事件模块）⇒ 独立 legacy 表
    const useFabricLegacyTable =
      (platform === "fabric" || platform === "quilt") && ["1.14.4", "1.16.5", "1.17.1", "1.18.2"].includes(version);
    // javap 实测同为「只差 GUI 点击一处」的档：1.21.1（2026-09-30）、1.21.3 与 1.20.4（2026-10-01）、1.21.4 与 1.21.8（2026-10-01）
    const useFabric1211Table =
      (platform === "fabric" || platform === "quilt") && ["1.21.1", "1.21.3", "1.20.4", "1.21.4", "1.21.8"].includes(version);
    // MC 26.1+ = 去混淆层（jackpot：vanilla 名 = mojmap，免 remap）+ Fabric API 事件 ⇒ 独立表。
    // 只覆盖 fabric（本仓 quilt 无 26.x 档，quilt 26.x 仍走结构壳，别越界借 fabric 表）。
    const useFabric26Table = platform === "fabric" && /^26\./.test(version);
    const emittedJava = useForgeLegacyTable
      ? rewriteForForgeLegacy(javaSource, version)
      : useForgeTable
      ? rewriteForForge(javaSource, version)
      : useNeoForge26Table
        ? rewriteForNeoForge26xx(javaSource, version)
        : useNeoForgeTable
          ? rewriteForNeoForge(javaSource, version)
          : useFabric26Table
            ? rewriteForFabric26xx(javaSource, version)
            : useFabric1201Table
              ? rewriteForFabric1201(javaSource)
              : useFabricLegacyTable
                ? rewriteForFabricLegacy(javaSource, version)
                : useFabric1211Table
                  ? rewriteForFabric1211(javaSource)
                  : javaSource;
    files["playtest/PlaytestQaDriver.java"] = javadocSafe(emittedJava);
    if (useForgeLegacyTable) {
      warnings.push(
        `platform=forge version=${version} 档由 fabric 模板经 **forge legacy 表**（rewriteForForgeLegacy = forge 表 + 该档旧 API 面）派生——**本档是派生态**（由 1.21.11 模板改写而来，非原生档）。` +
          `javap 依据（本机 \`.gradle/caches/forge_gradle\` 缓存 jar）：1.16.5 = 旧 mojmap 包名（\`GUI screen\` 单数 / \`ClientPlayerEntity\` / \`ClientPlayNetHandler\` / \`util.registry.Registry\` / \`ScreenShotHelper.grab(File,int,int,Framebuffer,Consumer)\` / \`options\`=GameSettings / \`yRot·xRot\` 公开字段）；` +
          `1.17.1/1.18.2 = \`Minecraft.loadLevel(String)\` + \`LocalPlayer.chat(String)\`（无 \`WorldOpenFlows\`/\`sendCommand\`）+ \`core.Registry\` 静态字段；1.19.4 = 与 1.20.1 同形，仅 \`Entity.isOnGround()\` 一处差。` +
          `**\`1.12.2\` = MCP 命名层 + \`applyForgeMCP1122\` 再退一层**（\`fml.common.registry.ForgeRegistries\` / \`fml.common.eventhandler.SubscribeEvent\` / **无 \`Minecraft.getInstance()\`**⇒\`getMinecraft()\` / **无 \`mainWindow\`**⇒\`displayWidth·displayHeight\`+` +
          `\`GuiScreen.width·height\` / **截图无 Consumer 变体**（\`ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer)\` 返 \`ITextComponent\`）/ \`ITextComponent\` 无 \`getString()\`⇒\`getUnformattedText()\` / \`Entity.getName()\` 返 \`String\` / 实体 id 走 \`EntityList.getKey(Entity)\` / \`EntityPlayer.capabilities\`（非 \`abilities\`）/ \`KeyBinding.getKeyCode()\` / \`mouseClicked(int,int,int)\`；` +
          `构件 = 本机 \`forgeBin-1.12.2-14.23.5.2847.jar\`（FG2.3 的 MCP 命名 + Forge 合并件，**免下载**），**编译验证 = JDK 8 \`javac\` 通过**）。` +
          `**\`newworld\`（造世界）在 1.16.5–1.18.2 与 1.12.2 未取证 ⇒ 保持 fail-closed**；1.19.4 已实现。真机验证状态见 \`mcp-server/CHANGELOG.md\`。`,
      );
    } else if (useForgeTable) {
      warnings.push(
        `platform=${platform} 档由 fabric 模板经改写表派生（8 类平台差异，签名逐条 javap 实测）——**本档是派生态**（由 1.21.11 模板改写而来，非原生档）；真机验证状态见 \`mcp-server/CHANGELOG.md\` 的逐档授信，首次运行若报错请回灌。`,
      );
    } else if (useNeoForge26Table) {
      warnings.push(
        `platform=neoforge version=${version} 档由 1.21.11 模板经 **26.1+ 去混淆表 + NeoForge 26.x 事件栈**（rewriteForNeoForge26xx）派生。` +
          `已核面（javap 实测 2026-10-03，neoforge-26.1.2.114-universal.jar + bus-8.0.5.jar + 26.1.2 官方客户端 jar（已去混淆，免 remap））：` +
          `vanilla 名 = forge 表 + 26.x 三处差异（同 fabric 26 表：mouseClicked 新签名 / openWorld 入口 / ` +
          `**26.2+ 另有截图与界面两处**—— \`getMainRenderTarget()\` 删⇒\`Screenshot.grab(client,false)\`、` +
          `\`Minecraft.screen\`/\`setScreen\` 删⇒\`client.gui.screen()\`/\`client.gui.setScreen(x)\`）；NeoForge 侧差异 —— ` +
          `① 总线 \`NeoForge.EVENT_BUS\`（\`net.neoforged.neoforge.common.NeoForge\`）；` +
          `② tick 事件 = \`net.neoforged.neoforge.client.event.ClientTickEvent.Post\`（**无 phase 字段**，不再是 Forge 的 Phase 判定）；` +
          `③ 聊天事件 = \`net.neoforged.neoforge.client.event.ClientChatReceivedEvent\`（\`getMessage()\`）；` +
          `\`@SubscribeEvent\` 走 \`net.neoforged.bus.api.SubscribeEvent\`。` +
          `**前置：NeoForge 26.1 工程无 mappings 配置**（去混淆）⇒ 不需要 Parchment/官方映射叠加。` +
          `**\`newworld\`（造世界）已实现**（applyNewworld26xx）（同 fabric 26 表）。` +
          `真机验证状态见 \`mcp-server/CHANGELOG.md\`。`,
      );
    } else if (useNeoForgeTable) {
      const neoCaveat =
        version === "1.20.4"
          ? `事件/总线按 neoforge 20.4.251 merged jar + bus 7.2.0 javap 实测）——**本档是派生态**（真机验证状态见 \`mcp-server/CHANGELOG.md\`），` +
            `⚠ 若该档是 1.20.6+（TickEvent 已迁到 \`client.event.ClientTickEvent$Post\`、WorldOpenFlows 入口改名 \`openWorld\`）需走本表的 1206+ 分支，别沿用 1.20.4 的形。`
          : `事件/总线按 neoforge 20.6.139 merged jar javap 实测（1.20.6+ 分支：\`client.event.ClientTickEvent$Post\` **无 phase**、WorldOpenFlows \`openWorld(String,Runnable)\`；该形在 20.6 实测，其余 1.21.x 档首跑前仍需逐档 javap 复核后用）。`;
      warnings.push(
        `platform=neoforge version=${version} 档由 fabric 模板经 forge 表 + 事件栈换包派生（见 rewriteForNeoForge；${neoCaveat}`,
      );
    } else if (useFabric1201Table) {
      warnings.push(
        `platform=${platform} version=1.20.1 档由 1.21.11 模板经改写表派生（GUI 点击一处差异，javap 实测：1.20.1 无 Click/MouseInput，mouseClicked 为 (double,double,int)）——**本档是派生态**（真机验证状态见 \`mcp-server/CHANGELOG.md\`）。`,
      );
    } else if (useFabricLegacyTable) {
      warnings.push(
        `platform=${platform} version=${version} 档由 1.21.11 模板经 **fabric legacy 表**（rewriteForFabricLegacy = 旧 Registry 包 / 无 IntegratedServerLoader / 无 sendChatCommand / 旧键名）派生` +
          `——**本档是派生态**（由 1.21.11 模板改写而来，非原生档）。javap 依据见 PLAYTEST_VERIFIED_TIER 的该档条目。**两条本族共同项**：` +
          `① **没有客户端消息事件**——\`ClientReceiveMessageEvents\` 属 \`fabric-message-api-v1\`，该模块在 1.14.4–1.18.2 这几档钉的 Fabric API 依赖表里**都不存在**` +
          `（最早带它的是 \`0.87.2+1.19.4\`）⇒ 聊天注册行已摘，\`goto parsed\` 靠 \`<runDir>/logs/latest.log\` 的 \`[CHAT]\` 行兜底；` +
          `② 事件挂接只有 \`ClientTickEvents.END_CLIENT_TICK\`。` +
          (version === "1.14.4"
            ? `\`1.14.4\` 另有 9 处：截图仍是混淆名 \`ScreenshotUtils.method_1659\`、\`window\` 是字段、\`Entity.x/y/z/onGround\` 公开字段、` +
              `\`inventory\` 公开字段 + \`getInvStack\`、三参 \`startIntegratedServer\`、静态 \`KeyBinding.setKeyPressed\`、无 \`toShortString\`、` +
              `**运行期 JVM = Java 8**（\`Path.of\`/\`Files.writeString\` 已换 Java 7 形）。` +
              `**编译验证 = JDK 8 javac 对真 jar（named MC jar + **真 yarn-remapped Fabric API 模块 jar**）通过**。`
            : version === "1.16.5"
              ? `**运行期 JVM = Java 8** ⇒ \`Path.of\`/\`Files.writeString\` 已换 Java 7 形（\`applyJava8LibSwaps\`）。` +
                `**编译验证 = JDK 8 javac 对真 jar（named MC jar + 真 yarn-remapped Fabric API 模块 jar）通过**。` +
                `**\`newworld\`（造世界）未取证** ⇒ 保持 fail-closed。`
              : `**编译验证 = JDK 17 javac（该档 release 级）对 named MC jar + FAPI 替身（\`Event\`/\`ClientTickEvents\`）通过**` +
                `（本机无这两档的 yarn-remapped FAPI 模块 jar）。**\`newworld\`（造世界）未取证** ⇒ 保持 fail-closed。`) +
          `真机验证状态见 \`mcp-server/CHANGELOG.md\`。`,
      );
    } else if (useFabric1211Table) {
      warnings.push(
        `platform=${platform} version=${version} 档由 1.21.11 模板经改写表派生（**只差 GUI 点击一处**：该档无 Click/MouseInput，` +
          `mouseClicked 为 (double,double,int)；自动进世界与 1.21.11 同形，别套 1.20.1 的 start(Screen,String) 改写）` +
          `——javap 依据见 PLAYTEST_VERIFIED_TIER，真机验证状态见 CHANGELOG。`,
      );
    } else if (useFabric26Table) {
      warnings.push(
        `platform=fabric version=${version} 档由 1.21.11 模板经 **26.1+ 去混淆表**（rewriteForFabric26xx = forge 表换 vanilla 名到 mojmap，` +
          `保留 Fabric API 事件）派生。已核面（javap 实测 2026-10-03，26.1.2 官方客户端 jar（已去混淆，免 remap）+ fabric-api 0.155.3+26.1.2）：` +
          `vanilla 名与 forge 表一致；差异 3 处 —— ① \`mouseClicked(MouseButtonEvent, boolean)\`（\`MouseButtonEvent(double,double,MouseButtonInfo)\`）；` +
          `② 自动进世界 = \`createWorldOpenFlows().openWorld(String,Runnable)\`（**不是** loadLevel）；③ 事件挂接仍是 Fabric API` +
          `（\`ClientTickEvents.END_CLIENT_TICK\` / \`ClientReceiveMessageEvents.GAME\`）。` +
          `**26.2+ 另有两处**（javap 实测 client-26.2/26.3）：④ \`Minecraft.getMainRenderTarget()\` 已删 ⇒ 截图走 \`Screenshot.grab(client,false)\`；` +
          `⑤ \`Minecraft.screen\`/\`setScreen\` 已删 ⇒ 界面状态走 \`client.gui.screen()\`/\`client.gui.setScreen(x)\`（26.1.x 无此二成员）。` +
          `**前置：被测工程必须有 fabric-api**（本仓 fabric/26.1.2 scaffold 目前没带，需自行加）。` +
          `**\`newworld\`（造世界）已取证**（applyNewworld26xx；\`createFreshLevel\` 的 LevelSettings/WorldDataConfiguration/WorldDimensions 构造面五档逐条同形，2026-10-03 javap）；` +
          `村庄剧本直接以它造世界（本仓 scaffold 未带存档）。真机验证状态见 \`mcp-server/CHANGELOG.md\`。`,
      );
    }
    // quilt 全族前置：quilt-loader **不含 Fabric API**（实测 quilt-loader 0.31.0-beta.4 的 jar 里
    // `net/fabricmc/fabric/api/` 类数 = 0，只 bundle 了 mixinextras-fabric），而本驱动的事件挂接走
    // Fabric API（`ClientTickEvents` / 1.19.4+ 还有 `ClientReceiveMessageEvents`）⇒ 工程必须自备 dev-only fabric-api。
    if (platform === "quilt" && isVerifiedTier(platform, version)) {
      warnings.push(
        `quilt 档前置：**quilt-loader 不含 Fabric API**（javap/jar 实测 quilt-loader 0.31.0-beta.4：` +
          `\`net/fabricmc/fabric/api/\` 类数 = 0，只 bundle \`mixinextras-fabric\`），而本驱动的 tick/chat 钩子走 Fabric API ⇒ ` +
          `**被测工程须自备 dev-only \`net.fabricmc.fabric-api:fabric-api:<该档版本>\`**（测完按 REVERT.md 撤除）。` +
          `同款前置的口径见 \`community_knowledge/authored/ingame-playtest-automation.md\` 的 quilt 1.21.11 硬约束条。`,
      );
    }
    // fabric 1.20.4 / 1.21.1 / 1.21.3 的 `IntegratedServerLoader.start(String,Runnable)` 会把客户端冻死 ——
    // 1.20.4 于 2026-10-01 jstack 定因，1.21.1 于 2026-09-30 实测同形。
    const freezeFamily = platform === "fabric" && ["1.20.4", "1.21.1", "1.21.3"].includes(version);
    // quilt 同版本走的是**同一段原版客户端代码**（IntegratedServerLoader 是 Minecraft 类，与加载器无关），
    // 冻结同源；但本仓矩阵的 quilt 实例**全部**用 quick play 进的（8/8），从未实测过 quilt 侧的冻结路径 ⇒ 只报警不改码。
    const quiltFreezeSuspect = platform === "quilt" && ["1.20.4", "1.21.1", "1.21.3"].includes(version);
    if (quiltFreezeSuspect && (input.enterWorld ?? "").trim()) {
      warnings.push(
        `⚠ quilt ${version} 档启用 enterWorld 有**未实测的冻结风险**：它与 fabric 同版本共享同一段原版客户端代码` +
          `（IntegratedServerLoader 是 Minecraft 类，与加载器无关），而该代码已被 jstack 证实会把 Render thread` +
          `冻在 MinecraftClient.startIntegratedServer 的 Thread.sleep（2026-10-01，fabric 1.20.4 定性；1.21.1 于 2026-09-30 同形）。` +
          `**但 quilt 侧从未实测**（本仓矩阵的 quilt 实例 8/8 都用 quick play 进的，没走过这条路）。保守做法：` +
          `enterWorld 留空 + 在工程 build.gradle 里用 vanilla quick play（quilt loom programArgs）——与实测通过的 quilt 矩阵同形。`,
      );
    }
    if (freezeFamily && (input.enterWorld ?? "").trim()) {
      warnings.push(
        `⚠ fabric ${version} 档**不要**用 enterWorld 让驱动自己进世界：实测该调用会让世界载入流程内联跑在 tick 栈上并死等` +
          `服务器线程 —— Render thread 停在 MinecraftClient.startIntegratedServer 的 Thread.sleep（jstack 实证），` +
          `客户端整只冻住、心跳停，而桥 /status 仍答 ready=true（极具误导性）。` +
          `委托给 client.execute 排队**不能**修（ThreadExecutor.execute 从渲染线程是 inline 执行）。` +
          `推荐做法：enterWorld **留空**，在工程 build.gradle 里用 vanilla quick play（` +
          `fabric: loom { runs { client { programArgs "--quickPlaySingleplayer", "<存档目录名>" } } }；` +
          `其余档同理换成 loom programArgs）——实测 1.20.4 与 1.21.3 各 17/17 步通过；` +
          `或（仅桥覆盖的档）用桥 join_world / create_world 进世界；驱动的"需要世界"步骤会自动等世界。`,
      );
    }
    if (mode === "in_jvm_player_agent") {
      // 意图空间定稿 v2（2026-10-01 用户审改）：菜单 + **真执行器**（见 PlaytestQaDriver 的 intent 步骤族）。
      files["playtest/intent-menu.json"] = JSON.stringify(buildIntentMenu(input, profile), null, 2) + "\n";
      warnings.push(
        `driverMode=in_jvm_player_agent 已产出**真执行器**（PlaytestQaDriver 的 intent/waitintent 步骤族）+ playtest/intent-menu.json：` +
          `${PLAYTEST_INTENTS.length} 条意图，按 capabilityProfile=${profile} 过滤后列出 ${intentsForProfile(profile).length} 条（strict_survival 不含 tp）。` +
          `LLM 侧写 \`<evidenceDir>/intent.json\`（扁平 JSON，如 {"intent":"walk_to","x":10,"z":-20,"tol":3}），驱动停在 waitintent 上逐条消费；` +
          `观测读 \`state.json\` 的 intentState / intents[] / lastIntent / scan.nearest；收尾写 {"intent":"stop"}。` +
          `**v1 落地面**：walk_to / look_at(pos|yaw) / find_and_goto(structure|block|entity) / observe / open_gui / inventory / screenshot / wait / tp(op/creative) / stop；` +
          `mine / place / interact 未实现 —— 命中即判红（不静默），见 README.playtest.md 的意图表。`,
      );
    }
    files["playtest/REVERT.md"] = `# 驱动代码撤除清单（${mode} / ${platform} ${version}）

测完必须把驱动从被测工程里撤掉（**绝不提交**）：

1. 删 \`src/main/java/${pkg.replace(/\./g, "/")}/playtest/PlaytestQaDriver.java\`（若 \`playtest/\` 目录只放驱动，连目录一并删）
2. 删客户端初始化处的调用行 \`PlaytestQaDriver.register();\`
3. 证据不入正式分支：\`${evidenceDir}\` 与 \`<runDirectory>/screenshots/\` 只留本地；提交前 \`git status\` 自检两处零命中
4. 撤除后复跑一次构建（\`mc-build-mod\`）确认仍能编译
`;
    files["playtest/plan.json"] =
      JSON.stringify(
        {
          driverMode: mode,
          platform,
          version,
          capabilityProfile: profile,
          goal,
          signatureBasis: { mappings: tier.mappings, asOf: tier.asOf, method: "javap on yarn-named jar（仓外 demo 工程 loom-cache）" },
          phases: [
            "auto-enter world（仅当 enterWorld 非空；默认 IntegratedServerLoader.start —— 但 fabric 1.20.4/1.21.1/1.21.3 档必须改用 build.gradle 的 --quickPlaySingleplayer，见 warnings 与 README.playtest.md）",
            "wait world+player",
            "settle 40 ticks",
            "observe → state.json（背包槽位）",
            "playproof① 移动：每 tick 重按 forwardKey，40t 后断言水平位移 ≥ 1.0 格",
            "playproof② 破坏：setPitch(90) + 每 tick 按 attackKey，40t 后断言脚下方块 id 已变",
            "playproof③ GUI：setScreen(InventoryScreen) → 真实 mouseClicked(Click,boolean) → close()，断言开屏非空",
            "screenshot（先 setScreen(null)）",
            "assert inventory_contains + 汇总三证明",
          ],
          playProof: {
            note: "「能玩」= 输入驱动移动 + 世界状态被改（破方块）+ 真实 UI 点击，三者都有可判定的读数；不是只看 ready/连接。",
            move: { key: "options.forwardKey", ticks: 40, minHorizontal: 1.0 },
            break: { key: "options.attackKey", pitch: 90, ticks: 40, assert: "block id 变化（创造模式即破）" },
            gui: { open: "程序化 setScreen(InventoryScreen)", click: "真实 UI 事件路径 mouseClicked(Click,boolean)", assert: "开屏非空 + 关闭后 currentScreen==null" },
          },
          enterWorld: enterWorld || "(未启用)",
          expect: { slot, itemId: expectItem },
          evidence: {
            dir: evidenceDir,
            files: ["state.json", "exit-code.txt", "qa.log"],
            screenshots: "<runDirectory>/screenshots/（由截图 API 落盘；判读时传 inspect_playtest_evidence 的 screenshotsDir）",
            markers: ["[QA] driver registered", "[QA] open world requested:", "[QA] entered world as", "[QA] observe slot", "[QA] DONE ::", "[QA] ERROR:"],
          },
          engine: "interpreter（PLAN 数据驱动；USE_INTERPRETER=true。置 false 可切回内置 playproof 相位机）",
          watchPlan,
          planFile: planFileDisplay,
          roundsIndex: "rounds.jsonl（每行一轮：round/ok/steps/done/detail）",
          scenario: input.plan?.length ? "(自定义 plan)" : scenario,
          plan: planSteps,
          budgetTicks,
          revert: "playtest/REVERT.md",
          pitfalls: [
            "帧缓冲 / 状态落后一 tick ⇒ 进世界后先静置再观察",
            "截图前先 setScreen(null)（否则抓到的是 GUI）",
            "共用 runDir 会静默互相覆盖截图 ⇒ 每次运行独立 runId / 独立实例",
            "驱动杀死玩家会写进存档 ⇒ 用独立 dev 世界或幂等化",
            "驱动代码测完必须 revert（绝不提交）",
            "自动进世界相必须在 player/world 为空时也跑：null 检查只对后续相位生效（否则日志里连 open world requested 都没有，实测 2026-09-29）",
            "自动进世界两条路都可用：① 驱动内 `IntegratedServerLoader.start(世界目录名, onCancel)`（默认）；② build.gradle 的 vanilla quick play（fabric `programArgs` / forge `args` / neoforge `programArguments.addAll`，值 `'--quickPlaySingleplayer', '<存档目录名>'`）。**fabric 1.20.4/1.21.1/1.21.3 三档只能用 ②**：实测 ① 会把 Render thread 冻在 startIntegratedServer 的 Thread.sleep（jstack 实证），且桥 /status 仍答 ready=true（极具误导）。早期注记『Loom 的 --quickPlaySingleplayer 根本不生效（零 quick 命中）』是 2026-09-29 的误判（当次参数未真接进 run 配置），已被 2026-10-01 矩阵推翻——那三档 17/17 步通过即靠 ②。",
            "强杀 gradle wrapper **不结束子 JVM**（真身命令行含 -Dfabric.dli.config=<工程>/.gradle/loom-cache）；残留客户端会持有世界 session.lock ⇒ 下一次进世界报『另一个程序已锁定文件的一部分』⇒ 关客户端要按命令行精确清理（实测 2026-09-29）",
            "证据文件名必须 .log（判读器按『证据目录内任意 .log 尾部』抽 [QA] 段；首版写 qa.txt ⇒ qa 判 absent，实测 2026-09-29）",
          ],
          notCovered: { modes: [], postconditions: PLAYTEST_POSTCONDITIONS.filter((p) => p !== "inventory_contains" && p !== "marker_log") },
        },
        null,
        2,
      ) + "\n";
    files["playtest/README.playtest.md"] = `# 无桥路线：进程内临时 driver（${platform} ${version}）

> 本档 **没有可用桥**（BlackBoxPro 预编译件只覆盖 fabric/neoforge 1.21.11+1.21.1、forge 1.12.2）⇒ 走进程内临时 driver。
> 本档全部签名已 **javap 实测**（${tier.mappings}，as-of ${tier.asOf}），生成物可直接编译；API 若报错说明该档映射与 1.21.11 有差，先 \`search_*_docs\` 现核再改。

## 前置
1. 授权（三通道，见根 \`AGENTS.md\`「人在环例外：游玩自测」）：\`MC_SKILL_PLAYTEST_ALLOW=1\` + \`MC_SKILL_PLAYTEST_ROOT=<绝对路径>\`。
2. 把 \`playtest/PlaytestQaDriver.java\` 放进被测工程 \`src/main/java/${pkg.replace(/\./g, "/")}/playtest/\`，并把 \`EVIDENCE_DIR\` / \`EXPECT_ITEM\` / \`EXPECT_SLOT\` 换成真值。
3. 客户端初始化处加一行 \`PlaytestQaDriver.register();\`。
4. 构建（\`mc-build-mod\`）→ 起 dev 实例 → 进世界（单机或连服均可）。

## 判读
- 日志序列：\`[QA] driver registered\` → （\`enterWorld\` 非空时 \`[QA] open world requested: …\`）→ \`[QA] entered world as …\` → \`[QA] observe slot …\` → \`[QA] DONE :: …\` 或 \`[QA] ERROR: …\`。
- **自动进世界（两条路）**：默认用驱动内 \`IntegratedServerLoader.start(世界目录名, onCancel)\`（\`enterWorld\` 非空时生效；世界不存在看 \`[QA] open world cancelled\`）。**fabric 1.20.4 / 1.21.1 / 1.21.3 三档必须改用 build.gradle 的 vanilla quick play**（fabric \`programArgs\` / forge \`args\` / neoforge \`programArguments.addAll\`，值 \`'--quickPlaySingleplayer', '<存档目录名>'\`）——那三档走驱动内路径会把 Render thread 冻死（jstack 实证）。早期注记「Loom 的 quickPlay 不生效（零 quick 命中）」是 2026-09-29 的误判，2026-10-01 矩阵已推翻（那三档靠 quickPlay 17/17 步通过）。
- 证据：\`${evidenceDir}/state.json\`、\`exit-code.txt\`、\`qa.log\`（必须是 .log —— 判读器按「证据目录内任意 .log 尾部」抽 \`[QA]\` 段）；截图在 \`<runDirectory>/screenshots/\`。
- 汇总：\`inspect_playtest_evidence evidenceDir=${evidenceDir} screenshotsDir=<runDirectory>/screenshots\`（三态 present|absent|unreadable，缺件不得读成"没有失败"）。
- 断言 fail-closed：超预算 / 条件不成立一律 \`[QA] ERROR\`，不静默通过。

## 长驻模式（默认；避免"改一次动作就重启游戏"）
游戏**只起一次**：驱动进世界后进入守候，每 1 秒查一次 \`<evidenceDir>/plan.txt\` 的 mtime，**文件一变就在同一进程内开新一轮**（不重启游戏、不重编译）。

- 换场景：直接覆盖 \`plan.txt\`（每行一步，空行与 \`#\` 注释忽略）。
- 每轮结束写：\`state.json\` / \`exit-code.txt\` / \`qa.log\`（全量 \`[QA]\` 段），并追加一行 \`rounds.jsonl\`（round / ok / steps / done / detail）。
- 收工：剧本最后一行写 \`stop\` ⇒ 驱动器停止接新轮；**游戏进程不关**（何时关由人/编排决定）。
- 判读口径与一次性模式一致：\`[QA] DONE :: [round n] …\` / \`[QA] ERROR: [round n] …\`。
- **边界（别误解）**：只改**动作/断言**不用重启；改**被测 mod 的 Java 代码**仍要重建 + 重启（JVM 不能热换类）。所以正确姿势是"一批代码改动 → 重启一次 → 在同一次会话里连做多轮场景"。

## 动作序列（数据驱动，改剧本不用改 Java）
驱动是**解释器**：\`PLAN\`（在 \`PlaytestQaDriver.java\` 顶部，与 \`plan.json\` 同步）每行一步。语法：

| 步骤 | 作用 |
|---|---|
| \`wait <ticks>\` | 等 N tick |
| \`look yaw=<f> pitch=<f>\` | 设定朝向（程序化；移动仍由键位驱动） |
| \`fly on=<0\|1>\` | 创造模式开/关飞行（\`abilities.flying\` + \`sendAbilitiesUpdate\`） |
| \`move key=<forward\|back\|left\|right\|jump\|sneak\|attack\|use> ticks=<n>\` | 按住某键 N tick（每 tick 重按，防失焦 unpressAll） |
| \`cmd <命令>\` | 发聊天命令（**命令面，显式记录**，不算纯游玩） |
| \`goto x= z= tol= fly= max=\` / \`goto parsed …\` | 走到/飞到目标（\`parsed\` = 坐标取自上一 \`cmd\` 返回，正则抽 \`[x, ~, z]\`） |
| \`scan radius= entities=<id,id> blocks=<id,id> stride=\` | 扫描周围实体/方块（村庄证据 = 村民 / 钟 / 干草块 / 堆肥桶）；\`scan.nearest\` 记**最近命中**的结构化坐标（find_and_goto 的底座） |
| \`assert scan_entities \\| scan_blocks \\| inv slot= item= \\| inv_nonempty slot= \\| moved min= \\| pos tol= x= z=\` | 后置条件；失败即判红并落 state.json |
| \`shot testId=<name>\` | 截图（先 \`setScreen(null)\`） |
| \`break ticks=<n>\` | 俯视破脚下方块（断言**同坐标** id 变化） |
| \`gui\` | 开背包 → 真实 \`mouseClicked(Click,boolean)\` → 关闭 |
| \`land max=<n>\` | 等到落地（\`isOnGround\`；失败判红）——飞行到达后的落地面 |
| \`newworld name=<存档目录名>\` | **造世界**（标题屏即可跑）：\`run/saves/<name>/level.dat\` 已在就跳过；否则走 \`createFreshLevel\`（26.x/forge 已取证）或 fail-closed 判红（未取证档）。**注意是 \`name=\` 具名参数**，不是位置参数 |
| \`goto nearest …\` | 走向最近一次 scan 的命中坐标（与 \`goto parsed\` 并列的第三种坐标来源） |
| \`intent <name> k=v…\` | **意图**：菜单校验 → 复用原语展开 → 类型化后置条件 → 证据；不在菜单/禁列/档位不符一律判红 |
| \`waitintent max=<n>\` | **LLM 邮箱**：守候 \`<evidenceDir>/intent.json\`（扁平 JSON），每条执行完**停在本步继续守候** |
| \`mark <text>\` | 往 qa.log 打自定义标记 |

${mode === "in_jvm_player_agent" ? `## 意图（in_jvm_player_agent 的玩法）

- **菜单**：\`playtest/intent-menu.json\`（按 capabilityProfile=${profile} 过滤；禁列 kill/tnt/fill 永不出现）。driver 里同一份菜单落成 \`INTENT_MENU\` 常量 —— 不在菜单的意图名一律判红（防止 LLM 造词）。
- **LLM 邮箱循环**：LLM 写 \`<evidenceDir>/intent.json\`（扁平一层：\`{"intent":"walk_to","x":10,"z":-20,"tol":3}\`）→ driver 消费（改名 \`intent.done.json\`）→ 执行 → 判后置条件 → 回写证据 → 继续守候。收尾写 \`{"intent":"stop"}\`（收本轮，不关游戏）。
- **失败语义（2026-10-01 与交接验收对齐）**：邮箱形态下**后置条件失败不改会话状态**——记进 \`intents[]\` / \`intentLog\`（\`ok:false\`）后继续守候下一条；失败不得自动重试，只许按菜单 \`fallback\` 换意图（\`playtest_intent read\` 会把它落成 \`nextSteps\`）。协议违规（禁列 / 不在菜单 / 档位不符）与预算耗尽才判红停轮；脚本形态（plan 里的 \`intent\` 步骤）失败仍判红停轮。
- **观测面**（LLM 每轮读 \`state.json\`）：\`intentState\`（profile / menu / mailbox / remainingTicks / active）、\`intents[]\`（本轮已执行意图的 {intent,params,ok,postcondition|failure,detail}；ok:true 只带 postcondition、ok:false 时失败原因在 \`failure\` 字段）、\`lastIntent\`、\`scan.nearest\`（结构化坐标）、\`goto.arrived\`、\`player\` 读数。
- **类型化后置条件**（每意图一条，见菜单 \`postcondition.kind\`；find_and_goto 按形态发 \`reached_parsed_tol\` / \`block_found_and_reached\` / \`entity_found_and_reached\`）：walk_to = 距离 ≤ tol ∧ 位移 ≥ 起点→目标距离 − tol（防"本来就在那"假绿）；find_and_goto block = 最近命中 ∧ 到位 ∧ onGround ∧ 目标位仍是该方块；entity = 最近命中 ∧ 到位；interact = \`expect\` 必填……（未实现的 mine/place/interact 命中即判红，见菜单 executionNote）。
- **单意图预算**：菜单 \`perIntentBudgetTicks\` 列即 driver 的判据（超限判红）；全局预算仍由 \`budgetTicks\` 兜底。` : ""}
**内置剧本**（\`generate_playtest_driver scenario=\`）：
- \`smoke\`（默认）：移动 → 破坏 → GUI → 截图 → 背包断言（冒烟用）。
- \`village\`（**功能测试：找一个村庄**）：起步移动 → 先扫一遍起始区（记录"这里没有"）→ \`cmd locate structure minecraft:village_plains\` → \`goto parsed fly=1\` **用键盘飞过去** → 到了再 \`scan\` → \`assert scan_entities\`（找到村民）→ \`shot testId=village\`（视觉证据）。
  边界：**定位**用了调试命令（\`cmd\` 步骤在 qa.log 里可见）；**位移与观察**全程是键位输入 + 客户端读数。找不到村庄（世界没生成 / 解析不到坐标）⇒ fail-closed 判红，不静默。

## 撤除
见 \`playtest/REVERT.md\`：驱动文件 + 调用行必须删干净，证据不进正式分支；撤除后复跑一次构建确认仍编译。

## 关客户端（实测坑）
强杀 \`gradlew\` wrapper **不会**结束正在玩游戏的子 JVM（真身命令行含 \`-Dfabric.dli.config=<工程>/.gradle/loom-cache\`）。残留客户端会持有该存档的 \`session.lock\`，下一次自动进世界会报「另一个程序已锁定文件的一部分，进程无法访问」⇒ 关客户端要按命令行精确匹配清理（或让游戏正常退出）。

## 与桥路线的关系
两者证据布局一致（state/exit-code + \`[QA]\` 段 + 截图 + 判读入口），切换路线不改判读方式；桥可用时优先桥（无需改工程）。
`;
  } else if (mode !== "external_bridge") {
    const verifiedHint = PLAYTEST_VERIFIED_TIER.map((t) => `${t.platform} ${t.version}`).join(" / ");
    warnings.push(
      `driverMode=${mode} 在本档（${platform} ${version}）仍是**结构壳**：已 javap 实测签名的档只有 ${verifiedHint}；其余档须先取证（该档 search_*_docs / 自备 jar 反编译）再填。`,
    );
    files["playtest/PlaytestQaDriver.java"] = `// TODO(未核实)：本壳不含任何已核实的玩家挂接 / tick 钩子 / 截图 API 签名。
// 取证顺序：① 该档 search_*_docs 核 tick 钩子与截图 API；② 需要玩家行为 AI 时，对用户自备的 mc_aiplayer jar 走 decompile_mod_jar 后按签名填。
// 已实测可参照的档：${verifiedHint}（其生成物见 generate_playtest_driver 的同档输出，可作 API 对照，但**不要**跨版本照抄签名）。
package ${pkg}.playtest;

public final class PlaytestQaDriver {
    private PlaytestQaDriver() {}

    /** 桩：把 ${goal} 拆成确定性动作序列；每步执行后写证据。 */
    public static void register() {
        // TODO(未核实): register a client tick hook here (per-loader API, verify via search_*_docs first)
        // TODO(未核实): drive the goal step by step; after each step emit [QA] markers + state snapshot
        // TODO(未核实): on completion emit "[QA] DONE"; on failure emit "[QA] ERROR: <reason>"
    }
}
`;
    if (mode === "in_jvm_player_agent") {
      // 本档不是已验证档（PLAYTEST_VERIFIED_TIER 之外）⇒ 只能发**契约**：执行器源码必须先按该档取证。
      files["playtest/intent-menu.json"] = JSON.stringify(buildIntentMenu(input, profile), null, 2) + "\n";
      warnings.push(
        `driverMode=in_jvm_player_agent 在本档（${platform} ${version}）**未 javap 取证** ⇒ 只产出意图菜单契约（playtest/intent-menu.json），` +
          `Java 执行器仍是结构壳；要真执行器请换已验证档（fabric 1.20.4 / 1.21.1 / 1.21.3 / 1.21.11 / quilt 1.21.11）或先取证。` +
          `菜单按 capabilityProfile=${profile} 过滤后列出 ${intentsForProfile(profile).length} 条。`,
      );
    }
    files["playtest/REVERT.md"] = `# 驱动代码撤除清单（${mode}）

- 本模式测完必须把驱动代码从工程里撤掉（绝不提交）：
  - \`playtest/PlaytestQaDriver.java\`
  - 在客户端初始化处添加的 \`PlaytestQaDriver.register()\` 调用行
- 证据（截图 / state / calls）不入正式分支，放独立 evidence 目录。
`;
  }

  return { code: null, files, warnings, experimental: true };
}
