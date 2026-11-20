package com.bandd.playtest.quilt_1_21_4;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.gui.screen.DownloadingTerrainScreen;
import net.minecraft.client.gui.screen.multiplayer.ConnectScreen;
import net.minecraft.client.gui.screen.world.LevelLoadingScreen;
import net.minecraft.client.network.ClientPlayerEntity;
import net.minecraft.client.util.ScreenshotRecorder;
import net.minecraft.server.integrated.IntegratedServer;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * quilt 1.21.4 适配层 —— 由 temp/port/tools/gen-adapter.mjs 从
 * generate_playtest_driver 的产物自动派生，不要手改（要改就改生成器）。
 *
 * 产物来源：node mcp-server/dist/cli.js generate_playtest_driver
 *   --platform quilt --version 1.21.4 --driverMode temporary_client_tick_driver
 *   => playtest/PlaytestQaDriver.java（2225 行 / 121549 B）。
 * 提取前已剔除 Java 注释（假阳性自检见同目录 dossier.json 的 falsePositiveGuards）。
 *
 * 生成器只覆盖它自己用到的概念；本模组需要而驱动里不出现的概念一律
 * TODO(未核实) + fail-closed（不猜名字）。逐条清单见 dossier.json 的 concepts.*.ok=false。
 */
public final class QuiltAdapter implements GameBridge {

    private static final String PLATFORM = "quilt";
    private static final String MC_VERSION = "1.21.4";

    /** 生成物 press() 的 switch 里的键集（只有这些键由生成器证实存在）。 */
    private static final List<String> KEYS = Arrays.asList("forward", "back", "left", "right", "jump", "sneak", "sprint", "attack", "use", "inventory");

    @Override public String platform() { return PLATFORM; }
    @Override public String mcVersion() { return MC_VERSION; }

    /**
     * 本档驱动不做 MinecraftClient.getInstance() 调用 —— 客户端实例由事件回调形参传入
     * （生成物：private static void onInterpTick(MinecraftClient client)）。
     * 适配层没有 tick 挂接权（在入口类），故由入口每 tick 调 setClient(...) 推一次。
     */
    private static MinecraftClient CLIENT;
    public static void setClient(MinecraftClient c) { CLIENT = c; }
    private static MinecraftClient mc() { return CLIENT; }

    @Override
    public boolean ready() {
        MinecraftClient c = mc();
        return c != null && c.player != null && c.world != null;
    }

    @Override
    public void tick() {
        // core 的队列在 PlaytestCore.onTick 里排空；这里额外推进挖矿进度（本轮 fix 4/5）。
        MinecraftClient c = mc();
        if (this.mining == null || c == null || c.world == null || c.interactionManager == null) return;
        c.interactionManager.updateBlockBreakingProgress(this.mining, this.miningDir);   // [T20-①] **不看返回值**（vanilla 在 destroyDelay/cooldown 未到的分支也回 true ⇒ 拿它当「已挖穿」会在第一 tick 清空目标）；收工只看上面那个 isAir
    }

    /** 挖矿目标（跨 tick 持续破坏用）。 */
    private net.minecraft.util.math.BlockPos mining = null;
    private net.minecraft.util.math.Direction miningDir = null;

    /** 关掉当前界面：界面开着时 MC 不处理输入（press 静默失效），实测位移恒 0。 */
    @Override
    public boolean closeScreen() {
        MinecraftClient c = mc();
        if (c == null) return false;
        if (c.currentScreen == null) return true;
        c.setScreen(null);
        return true;
    }

    /**
     * 破坏准星所指方块：**开始**破坏（走正常进度），随后由 tick() 逐帧推进。
     * 同一目标**幂等** —— 重发 attackBlock 会把破坏进度清零（真机实测：反复调用永远挖不动）。
     */
    @Override
    public String mineLookingAt() {
        MinecraftClient c = mc();
        if (c == null || c.player == null || c.world == null) return null;
        // 取目标方块：主路 = 自算射线（与渲染无关）；备用 = 渲染路径（mc 的 hitResult / crosshairTarget）。
        // reach 按游戏模式：创造 5.0 / 生存 4.5。名字出处 = javap -p -cp <本档 yarn 映射件>: Entity.getEyePos()/getRotationVec(float); PlayerEntity.isCreative(); world.RaycastContext(+ShapeType/FluidHandling); BlockView.raycast(RaycastContext); MinecraftClient.crosshairTarget
        net.minecraft.util.math.Vec3d eye = c.player.getEyePos();
        double reach = c.player.isCreative() ? 5.0D : 4.5D;
        net.minecraft.util.math.Vec3d end = eye.add(c.player.getRotationVec(1.0F).multiply(reach));
        net.minecraft.util.hit.BlockHitResult bhr = c.world.raycast(new net.minecraft.world.RaycastContext(
                eye, end, net.minecraft.world.RaycastContext.ShapeType.OUTLINE,
                net.minecraft.world.RaycastContext.FluidHandling.NONE, c.player));
        if (bhr == null || bhr.getType() != net.minecraft.util.hit.HitResult.Type.BLOCK) {
            if (c.crosshairTarget instanceof net.minecraft.util.hit.BlockHitResult hb && hb.getType() == net.minecraft.util.hit.HitResult.Type.BLOCK) {
                bhr = hb;
            } else {
                return null;
            }
        }
        net.minecraft.util.math.BlockPos pos = bhr.getBlockPos();
        if (!pos.equals(this.mining)) {
            this.mining = pos;
            this.miningDir = bhr.getSide();
            c.interactionManager.attackBlock(pos, this.miningDir);
        }
        return pos.getX() + "," + pos.getY() + "," + pos.getZ();
    }

    /**
     * 本机客户端当前阶段：menu | singleplayer | connecting | multiplayer（判不出来返回 null）。
     *
     * 名字来源（javap -p -c -cp <本档 quilt-loom yarn named 件>，逐档实测）：
     *   MinecraftClient.isIntegratedServerRunning() 字节码 = integratedServerRunning && server != null
     *     ⇒ 与 mojmap hasSingleplayerServer() 同义（区分「自己的单人/局域网世界」与「连到别人的服务器」）
     *   MinecraftClient.world / MinecraftClient.currentScreen 字段
     *   连接期界面（包名逐档不同，见文件头 import）：
     *     ConnectScreen / LevelLoadingScreen / DownloadingTerrainScreen（= mojmap ReceivingLevelScreen）
     */
    @Override
    public String clientPhase() {
        MinecraftClient c = mc();
        if (c == null) return null;
        if (c.world != null) {
            return c.isIntegratedServerRunning() ? "singleplayer" : "multiplayer";
        }
        if (c.currentScreen instanceof ConnectScreen
                || c.currentScreen instanceof DownloadingTerrainScreen
                || c.currentScreen instanceof LevelLoadingScreen) {
            return "connecting";
        }
        return "menu";
    }

    /**
     * 本机集成服务器（单人/局域网世界）当前实际监听的端口；没有则 0。
     *
     * 名字来源（javap -p -c -cp <本档 quilt-loom yarn named 件>，逐档实测）：
     *   IntegratedServer.isRemote()      字节码 = lanPort > -1（= 已开局域网）
     *   IntegratedServer.getServerPort() 字节码 = getfield lanPort
     *   MinecraftClient.isIntegratedServerRunning() / getServer()
     */
    @Override
    public int lanPort() {
        MinecraftClient c = mc();
        if (c == null || !c.isIntegratedServerRunning()) return 0;
        IntegratedServer server = c.getServer();
        if (server == null || !server.isRemote()) return 0;
        int p = server.getServerPort();
        return p > 0 ? p : 0;
    }

    @Override public List<String> supportedKeys() { return KEYS; }

    /** 真按键写入 —— 形状逐字取自生成物 press()（见 dossier 的 concepts.inputSink）。 */
    @Override
    public void setPressed(String key, boolean down) {
        MinecraftClient c = mc();
        if (c == null) return;
        net.minecraft.client.option.KeyBinding k;
        switch (key) {
            case "forward": k = c.options.forwardKey; break;
            case "back": k = c.options.backKey; break;
            case "left": k = c.options.leftKey; break;
            case "right": k = c.options.rightKey; break;
            case "jump": k = c.options.jumpKey; break;
            case "sneak": k = c.options.sneakKey; break;
            case "sprint": k = c.options.sprintKey; break;
            case "attack": k = c.options.attackKey; break;
            case "use": k = c.options.useKey; break;
            case "inventory": k = c.options.inventoryKey; break;
            default: return;
        }
        // ⚠ MC 的「点击类」动作（挖矿/放置/开背包）靠 consumeClick/wasPressed 启动，
        // 而 setPressed() **不累加点击计数** ⇒ 不补一次 onKeyPressed 则这些动作永不触发。
        // Yarn 侧无「取绑定键」的公开 getter ⇒ 用 getBoundKeyTranslationKey() 反查
        //（javap 实测本档公开：KeyBinding.onKeyPressed(InputUtil.Key) / KeyBinding.getBoundKeyTranslationKey()
        // / InputUtil.fromTranslationKey(String)）。
        if (down) net.minecraft.client.option.KeyBinding.onKeyPressed(
                net.minecraft.client.util.InputUtil.fromTranslationKey(k.getBoundKeyTranslationKey()));
        k.setPressed(down);
    }

    @Override
    public boolean isPressed(String key) {
        // TODO(未核实)：生成器只写按键、从不读（设计稿 2.5 实测）=> 本档读键方法名无出处。
        //   候选（须先取证再启用）：KeyBinding.isPressed()（yarn 侧）
        return false;
    }

    @Override
    public String playerStateJson() {
        Map<String, Object> m = new LinkedHashMap<>();
        MinecraftClient c = mc();
        if (c == null || c.player == null) { m.put("present", Boolean.FALSE); return Json.of(m); }
        ClientPlayerEntity p = c.player;
        m.put("present", Boolean.TRUE);
        m.put("name", p.getName().getString());
        m.put("x", p.getX());
        m.put("y", p.getY());
        m.put("z", p.getZ());
        m.put("onGround", p.isOnGround());
        // TODO(未核实)：health / dimension —— 生成物 state.json 不含这两项，名字无出处
        m.put("health", null);
        m.put("dimension", null);
        m.put("screen", screenName());
        return Json.of(m);
    }

    @Override
    public String screenName() {
        MinecraftClient c = mc();
        if (c == null || c.currentScreen == null) return null;
        return c.currentScreen.getClass().getSimpleName();
    }

    @Override
    public String screenshotPath() {
        MinecraftClient c = mc();
        if (c == null) return null;
        try {
            ScreenshotRecorder.saveScreenshot(c.runDirectory, c.getFramebuffer(), t -> { });
        } catch (Throwable t) { return null; }
        return new File(c.runDirectory, "screenshots").getAbsolutePath();
    }

    @Override
    public void openWorld(String worldName) {
        MinecraftClient c = mc();
        if (c == null) return;
        // 生成物写法：client.createIntegratedServerLoader().start(...)；实参把 WORLD 换成 worldName
        c.createIntegratedServerLoader().start(worldName, () -> { });
    }

    @Override
    public void chatCommand(String command) {
        MinecraftClient c = mc();
        if (c == null || c.getNetworkHandler() == null) return;
        c.getNetworkHandler().sendChatCommand(command.startsWith("/") ? command.substring(1) : command);
    }

    /** 聊天缓冲：事件在入口类按生成物的注册形挂，回调推到这里（与手工版同形）。 */
    private final java.util.Deque<String> CHAT = new java.util.concurrent.ConcurrentLinkedDeque<>();
    public void pushChat(String line) { CHAT.addLast(line); while (CHAT.size() > 200) CHAT.pollFirst(); }

    @Override public List<String> drainChat() {
        // 生成物挂接：ClientReceiveMessageEvents.GAME.register( -> 
        List<String> out = new ArrayList<>();
        String s;
        while ((s = CHAT.pollFirst()) != null) out.add(s);
        return out;
    }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public String spawnBot(String name, double distance) { return null; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public void moveBotTo(double x, double y, double z) { }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public void tickBot() { }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public String giveBot(String item, int count) { return null; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    /** 本机玩家转视角。出处：本档映射层 + javac 编译验证（编译过 = 名字在该档真存在）。 */
    @Override public boolean look(double yaw, double pitch) {
        net.minecraft.client.MinecraftClient c = net.minecraft.client.MinecraftClient.getInstance();
        if (c == null || c.player == null) return false;
        c.player.setYaw((float) yaw);
        c.player.setPitch((float) pitch);
        return true;
    }

    @Override public boolean lookBot(double yaw, double pitch) { return false; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public String breakBotBlock(double x, double y, double z) { return null; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public String placeBotBlock(double x, double y, double z) { return null; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public boolean setServerAuth(boolean online) { return false; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public void joinServer(String address) { }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public void despawnBot() { }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public String openBotInventory() { return null; }

}
