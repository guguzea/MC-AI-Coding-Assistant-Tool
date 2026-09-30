/**
 * generate_playtest_driver —— 游玩自测骨架生成（只吐文本；默认 driverMode=external_bridge）。
 *
 * 口径单源：`community_knowledge/authored/ingame-playtest-automation.md`。
 * 桥契约（源码级 as-of 2026-09-29）：
 *   POST /execute  CommandMessage{id,action,params,delay,target?} → ResponseMessage{id,status,message,data}（HTTP 恒 200）
 *   GET  /status   {status,version,platform,httpPort,actions,ready}；ready = player!=null && world!=null
 *   超时：服务端 responseTimeoutMs 默认 10000ms ⇒ status:"failure" + "Timeout after Nms"（无专用码 ⇒ 调用侧映射 PLAYTEST_TIMEOUT）
 * 诚实边界（2026-09-29 起）：
 *   - `temporary_client_tick_driver` × fabric/quilt **1.21.11** = **可编译的真 driver**（全部签名 javap 实测，见 PLAYTEST_VERIFIED_TIER）；
 *   - 其余平台/版本该模式仍为结构壳（`// TODO(未核实)`，须先按该档取证）；
 *   - `in_jvm_player_agent` 全档结构壳（玩家行为 AI 挂接 API 未取证）。
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
 * fabric 1.21.1 档改写表：与 1.21.11 只差**一处**（javap 实测 2026-09-30，yarn 1.21.1+build.2）：
 *   1.21.1 没有 `net.minecraft.client.gui.Click` / `net.minecraft.client.input.MouseInput`（1.21.2 才引入），
 *   `Element.mouseClicked` 是老的 `(double,double,int)`；`Screen` 侧有 `close()`。
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
 * forge 档改写表：把 fabric（yarn 名 + fabric-api 事件）模板**机械改写**为 forge（mojmap/parchment 名 + Forge 事件总线）。
 * 每条改写都对应上面 `platformProfile('forge')` 里 javap 实测的签名；fabric 路径**不改一字**（已真机验证）。
 * NeoForge 1.20.1 同此表（包名仍是 `net.minecraftforge`）。
 */
export function rewriteForForge(java: string): string {
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
  // newworld：把 fabric 档的 fail-closed 占位换成 forge 的 createFreshLevel 实现（签名逐条 javap 实测 2026-09-29）
  s = s.replace(
    '        finish(false, "newworld：本档（fabric）未取证造世界 API（createAndStart / LevelInfo / GeneratorOptions 构造面）——请先在客户端建一次世界再复用，或先取证后补本钩子");',
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
  return s;
}

/** javap 实测过签名的档（temporary_client_tick_driver 可出真代码）；其余档一律结构壳。 */
const PLAYTEST_VERIFIED_TIER: ReadonlyArray<{ platform: string; version: string; mappings: string; asOf: string }> = [
  { platform: "fabric", version: "1.21.11", mappings: "yarn 1.21.11+build.6", asOf: "2026-09-29" },
  { platform: "quilt", version: "1.21.11", mappings: "yarn 1.21.11+build.6（QSL 差异面见 quilt/1.21.11）", asOf: "2026-09-29" },
  {
    platform: "forge",
    version: "1.20.1",
    mappings: "forge-1.20.1-47.4.0 mapped official（parchment 只加参数名/javadoc，方法/字段名与 official 一致）",
    asOf: "2026-09-29",
  },
  {
    platform: "neoforge",
    version: "1.20.1",
    mappings: "同 forge 1.20.1（NeoForge 1.20.1 仍用 net.minecraftforge 包名；net.neoforged 自 1.20.2 起）",
    asOf: "2026-09-29",
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
];
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
    const era = eraUpperBoundError(version);
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

  if (mode === "temporary_client_tick_driver" && isVerifiedTier(platform, version)) {
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
    if (!input.plan?.length && scenario !== "smoke" && scenario !== "village") {
      warnings.push(`未知 scenario "${scenario}"：已回退 smoke。可选 smoke | village，或直接给 plan。`);
    }
    const planJava = planSteps.map((s) => JSON.stringify(s)).join(", ");
    /** 引擎选择：解释器（数据驱动，③-a）为默认；置 false 可切回内置 playproof 相位机。 */
    const useInterpreter = true;
    /** 长驻 + 热重载剧本：游戏只起一次，改 plan.txt 即在同一进程内开新一轮（默认开）。 */
    const watchPlan = input.watchPlan !== false;
    const planFileDisplay = `${evidenceDir}/plan.txt`;
    const javaPlanFile = planFileDisplay.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const budgetTicks = Number.isInteger(input.budgetTicks)
      ? Math.max(200, input.budgetTicks as number)
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
            case 0: // 自动进世界（无桥路线；Loom 的 --quickPlaySingleplayer programArgs 实测不生效 ⇒ 用 IntegratedServerLoader）
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
            return;
        }
        if (!roundActive) {
            // 空闲：不退出、不空转消耗 —— 每 WATCH_EVERY_TICKS tick 查一次剧本文件
            if (WATCH_PLAN && ticks % WATCH_EVERY_TICKS == 0 && planFileChanged()) {
                loadPlan();
                startRound();
            }
            return;
        }
        if (stepIdx >= plan.length) {
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
                                    finish(false, "goto parsed 失败：等 " + waitFor + " tick 仍未拿到坐标（事件原文：" + shorten(lastGameMessage) + "；日志兜底也没命中）");
                                    return;
                                }
                                if (stepTicks % 20 == 1) {
                                    log("[QA] goto parsed: 等坐标中… " + stepTicks + "/" + waitFor);
                                }
                                break;
                            }
                            gotoX = xz[0];
                            gotoZ = xz[1];
                        } else {
                            gotoX = optF(rest, "x", player.getX());
                            gotoZ = optF(rest, "z", player.getZ());
                        }
                        gotoTargetSet = true;
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
                        next();
                        break;
                    }
                    if (stepTicks > gotoMax) {
                        client.options.forwardKey.setPressed(false);
                        finish(false, "goto 超时：还差 " + fmt(dist) + " 格（max=" + gotoMax + "）");
                        return;
                    }
                    // 巡航高度 + 防卡：**地形会把低空飞行撞停**（实测 9000 tick 只前进 ~550 格、差 200 格判红）。
                    // 策略：先爬到 cruiseY（默认 140）以上再横掠；每 40 tick 量一次水平位移，几乎没动就抬升 60 tick 翻越。
                    double cruiseY = optF(rest, "cruiseY", 140);
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
                            }
                        }
                        scanEntityText = "entities hits=" + hits + (nearest.isEmpty() ? "" : " nearest=" + nearest);
                        scanEntityFound = hits > 0;
                    }
                    if (!blks.isEmpty()) {
                        String[] want = blks.split(",");
                        int hits = 0;
                        String first = "";
                        BlockPos c = player.getBlockPos();
                        for (int ax = -radius; ax <= radius; ax += stride) {
                            for (int az = -radius; az <= radius; az += stride) {
                                for (int ay = -4; ay <= 8; ay += stride) {
                                    BlockPos bp = c.add(ax, ay, az);
                                    String id = Registries.BLOCK.getId(client.world.getBlockState(bp).getBlock()).toString();
                                    if (contains(want, id)) {
                                        hits++;
                                        if (first.isEmpty()) {
                                            first = bp.toShortString() + "=" + id;
                                        }
                                    }
                                }
                            }
                        }
                        scanBlockText = "blocks hits=" + hits + (first.isEmpty() ? "" : " first=" + first);
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
                        finish(false, "断言失败 " + kind + " :: " + detail);
                        return;
                    }
                    next();
                    break;
                }
                case "shot": {
                    client.setScreen(null);
                    ScreenshotRecorder.saveScreenshot(client.runDirectory, client.getFramebuffer(), t -> { });
                    log("[QA] shot testId=" + optS(rest, "testId", "main") + " → " + new File(client.runDirectory, "screenshots"));
                    next();
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
                            finish(false, "break：200 tick 内未落地");
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
                            finish(false, "破坏证明失败：" + blockPosText + " 仍为 " + blockBefore);
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
                            finish(false, "GUI 证明失败：InventoryScreen 未能打开");
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
                default:
                    finish(false, "未知步骤：" + line);
            }
        } catch (Throwable t) {
            finish(false, "步骤异常（" + line + "）：" + t);
        }
    }

    private static void next() {
        stepIdx++;
        stepTicks = 0;
        gotoTargetSet = false;
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
     * fabric 档**未取证** createAndStart 面 ⇒ fail-closed 判红（不静默）；forge 档由改写表注入 createFreshLevel 实现。
     */
    private static void createWorldPlatform(MinecraftClient client, String name) {
        finish(false, "newworld：本档（fabric）未取证造世界 API（createAndStart / LevelInfo / GeneratorOptions 构造面）——请先在客户端建一次世界再复用，或先取证后补本钩子");
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
            Files.writeString(Path.of(EVIDENCE_DIR, "rounds.jsonl"),
                "{\"round\":" + roundNo + ",\"ok\":" + ok + ",\"steps\":" + plan.length + ",\"done\":" + stepIdx + ",\"detail\":\"" + detail.replace("\"", "'") + "\"}" + nl(),
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

    /** 手写 JSON（值只含玩家名 / 物品 id / 数字 / 时间戳，不含引号与反斜杠）。 */
    private static String stateJson() {
        String q = "\"";
        return "{" + nl()
            + "  " + q + "at" + q + ": " + q + Instant.now() + q + "," + nl()
            + "  " + q + "player" + q + ": " + q + playerName + q + "," + nl()
            + "  " + q + "x" + q + ": " + px + ", " + q + "y" + q + ": " + py + ", " + q + "z" + q + ": " + pz + "," + nl()
            + "  " + q + "slot" + q + ": " + EXPECT_SLOT + "," + nl()
            + "  " + q + "itemId" + q + ": " + q + observedItem + q + "," + nl()
            + "  " + q + "expect" + q + ": " + q + EXPECT_ITEM + q + "," + nl()
            + "  " + q + "move" + q + ": {" + q + "delta" + q + ": " + moveDelta + ", " + q + "min" + q + ": " + MOVE_MIN_HORIZONTAL + ", " + q + "dir" + q + ": " + q + DIR_NAMES[Math.min(dirIdx, DIR_NAMES.length - 1)] + q + "}," + nl()
            + "  " + q + "block" + q + ": {" + q + "pos" + q + ": " + q + blockPosText + q + ", " + q + "before" + q + ": " + q + blockBefore + q + ", " + q + "after" + q + ": " + q + blockAfter + q + "}," + nl()
            + "  " + q + "gui" + q + ": {" + q + "opened" + q + ": " + guiOpened + ", " + q + "class" + q + ": " + q + guiClass + q + ", " + q + "clicked" + q + ": " + guiClicked + ", " + q + "closed" + q + ": " + guiClosed + "}," + nl()
            + "  " + q + "plan" + q + ": {" + q + "steps" + q + ": " + PLAN.length + ", " + q + "done" + q + ": " + stepIdx + "}," + nl()
            + "  " + q + "scan" + q + ": {" + q + "entities" + q + ": " + q + scanEntityText + q + ", " + q + "blocks" + q + ": " + q + scanBlockText + q + "}," + nl()
            + "  " + q + "goto" + q + ": {" + q + "x" + q + ": " + gotoX + ", " + q + "z" + q + ": " + gotoZ + "}" + nl()
            + "}" + nl();
    }

    private static String blockId(MinecraftClient client, BlockPos pos) {
        BlockState st = client.world.getBlockState(pos);
        return Registries.BLOCK.getId(st.getBlock()).toString();
    }

    private static String nl() {
        return System.lineSeparator();
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
    const useForgeTable = platform === "forge" || platform === "neoforge";
    const useFabric1201Table = platform === "fabric" && version === "1.20.1";
    const useFabric1211Table = platform === "fabric" && version === "1.21.1";
    const emittedJava = useForgeTable
      ? rewriteForForge(javaSource)
      : useFabric1201Table
        ? rewriteForFabric1201(javaSource)
        : useFabric1211Table
          ? rewriteForFabric1211(javaSource)
          : javaSource;
    files["playtest/PlaytestQaDriver.java"] = javadocSafe(emittedJava);
    if (useForgeTable) {
      warnings.push(
        `platform=${platform} 档由 fabric 模板经改写表派生（8 类平台差异，签名逐条 javap 实测）——**尚未真机验证**，首次运行请把编译/启动报错回灌。`,
      );
    } else if (useFabric1201Table) {
      warnings.push(
        `platform=fabric version=1.20.1 档由 1.21.11 模板经改写表派生（GUI 点击一处差异，javap 实测：1.20.1 无 Click/MouseInput，mouseClicked 为 (double,double,int)）——**尚未真机验证**。`,
      );
    } else if (useFabric1211Table) {
      warnings.push(
        `platform=fabric version=1.21.1 档由 1.21.11 模板经改写表派生（**只差 GUI 点击一处**：1.21.1 无 Click/MouseInput；注意自动进世界与 1.21.11 同形，别套 1.20.1 的改写）——真机验证状态见 CHANGELOG。`,
      );
    }
    if (platform === "fabric" && version === "1.21.1" && (input.enterWorld ?? "").trim()) {
      warnings.push(
        `⚠ fabric 1.21.1 档**不要**用 enterWorld 让驱动自己进世界：实测（2026-09-30）该调用会把客户端**冻在世界载入里**——` +
          `心跳停、桥侧 action 也超时（status 仍答 ready=true，极具误导性）。请把 enterWorld **留空**，改用桥 join_world / create_world（或人工）把客户端送进世界；` +
          `驱动的"需要世界"步骤会自动等世界——同轮实测 **17/17 步通过**（含 2000+ 格飞掠、防卡自救抬升、村庄方块 44 命中、两张截图）。`,
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
            "auto-enter world（仅当 enterWorld 非空；实测 Loom 的 --quickPlaySingleplayer programArgs 不生效 ⇒ 用 IntegratedServerLoader.start）",
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
            "Loom 的 --quickPlaySingleplayer programArgs **不生效**（客户端日志零 quick 命中）⇒ 自动进世界用 IntegratedServerLoader.start（实测 2026-09-29）",
            "强杀 gradle wrapper **不结束子 JVM**（真身命令行含 -Dfabric.dli.config=<工程>/.gradle/loom-cache）；残留客户端会持有世界 session.lock ⇒ 下一次进世界报『另一个程序已锁定文件的一部分』⇒ 关客户端要按命令行精确清理（实测 2026-09-29）",
            "证据文件名必须 .log（判读器按『证据目录内任意 .log 尾部』抽 [QA] 段；首版写 qa.txt ⇒ qa 判 absent，实测 2026-09-29）",
          ],
          notCovered: { modes: ["in_jvm_player_agent"], postconditions: PLAYTEST_POSTCONDITIONS.filter((p) => p !== "inventory_contains" && p !== "marker_log") },
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
- **自动进世界**：本驱动用 \`IntegratedServerLoader.start(世界目录名, onCancel)\`。*不要*改用 Loom 的 \`--quickPlaySingleplayer\` programArgs——2026-09-29 实测该参数**根本没进到游戏进程**（客户端日志里零 \`quick\` 命中，驱动只能走预算耗尽判红）。世界不存在时看 \`[QA] open world cancelled\`。
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
| \`scan radius= entities=<id,id> blocks=<id,id> stride=\` | 扫描周围实体/方块（村庄证据 = 村民 / 钟 / 干草块 / 堆肥桶） |
| \`assert scan_entities \\| scan_blocks \\| inv slot= item= \\| moved min= \\| pos tol= x= z=\` | 后置条件；失败即判红并落 state.json |
| \`shot testId=<name>\` | 截图（先 \`setScreen(null)\`） |
| \`break ticks=<n>\` | 俯视破脚下方块（断言**同坐标** id 变化） |
| \`gui\` | 开背包 → 真实 \`mouseClicked(Click,boolean)\` → 关闭 |
| \`mark <text>\` | 往 qa.log 打自定义标记 |

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
    files["playtest/REVERT.md"] = `# 驱动代码撤除清单（${mode}）

- 本模式测完必须把驱动代码从工程里撤掉（绝不提交）：
  - \`playtest/PlaytestQaDriver.java\`
  - 在客户端初始化处添加的 \`PlaytestQaDriver.register()\` 调用行
- 证据（截图 / state / calls）不入正式分支，放独立 evidence 目录。
`;
  }

  return { code: null, files, warnings, experimental: true };
}
