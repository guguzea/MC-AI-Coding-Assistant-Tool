package com.bandd.playtest.forge_1_20_4;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;
import net.minecraft.client.Minecraft;
import net.minecraft.client.player.LocalPlayer;
import net.minecraft.client.Screenshot;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * forge 1.20.4 适配层 —— 由 temp/port/tools/gen-adapter.mjs 从
 * generate_playtest_driver 的产物自动派生，不要手改（要改就改生成器）。
 *
 * 产物来源：node mcp-server/dist/cli.js generate_playtest_driver
 *   --platform forge --version 1.20.4 --driverMode temporary_client_tick_driver
 *   => playtest/PlaytestQaDriver.java（2265 行 / 123554 B）。
 * 提取前已剔除 Java 注释（假阳性自检见同目录 dossier.json 的 falsePositiveGuards）。
 *
 * 生成器只覆盖它自己用到的概念；本模组需要而驱动里不出现的概念一律
 * TODO(未核实) + fail-closed（不猜名字）。逐条清单见 dossier.json 的 concepts.*.ok=false。
 */
public final class ForgeAdapter implements GameBridge {

    private static final String PLATFORM = "forge";
    private static final String MC_VERSION = "1.20.4";

    /** 生成物 press() 的 switch 里的键集（只有这些键由生成器证实存在）。 */
    private static final List<String> KEYS = Arrays.asList("forward", "back", "left", "right", "jump", "sneak", "sprint", "attack", "use", "inventory");

    @Override public String platform() { return PLATFORM; }
    @Override public String mcVersion() { return MC_VERSION; }

    @Override
    public boolean ready() {
        Minecraft c = Minecraft.getInstance();
        return c != null && c.player != null && c.level != null;
    }

    /**
     * 本机客户端当前阶段（补 GameBridge default 覆盖）。判据全部 javap 取证
     * （jar = forge-1.20.4-49.2.0_mapped_parchment_2024.02.25-1.20.4）：
     *   javap -p net.minecraft.client.Minecraft
     *     public net.minecraft.client.multiplayer.ClientLevel level;
     *     public net.minecraft.client.gui.screens.Screen screen;
     *     public boolean hasSingleplayerServer();
     *   javap -p -c Minecraft#hasSingleplayerServer(): isLocalServer && singleplayerServer != null
     *   javap -p net.minecraft.client.gui.screens.{ConnectScreen,ReceivingLevelScreen,LevelLoadingScreen}
     *     ⇒ 三者都是 public class ... extends Screen（可 instanceof）
     * 还没世界时用「连接期界面」区分 connecting 与 menu；其余一律 menu。
     */
    @Override
    public String clientPhase() {
        Minecraft c = Minecraft.getInstance();
        if (c == null) return null;
        if (c.level != null) {
            return c.hasSingleplayerServer() ? "singleplayer" : "multiplayer";
        }
        if (c.screen instanceof net.minecraft.client.gui.screens.ConnectScreen
                || c.screen instanceof net.minecraft.client.gui.screens.ReceivingLevelScreen
                || c.screen instanceof net.minecraft.client.gui.screens.LevelLoadingScreen) {
            return "connecting";
        }
        return "menu";
    }

    /**
     * 本机集成服务器当前实际监听的端口（补 GameBridge default 覆盖）。javap 取证（同上 jar）：
     *   javap -p net.minecraft.client.server.IntegratedServer
     *     public boolean isPublished();  public int getPort();
     *   javap -p -c IntegratedServer#getPort():     getfield publishedPort:I; ireturn
     *   javap -p -c IntegratedServer#isPublished(): publishedPort > -1
     *   javap -p -c IntegratedServer#publishServer(GameType,boolean,int): putfield publishedPort:I
     * ⇒ 值来自**当前活着的**服务器对象，不是日志文本（日志会残留旧会话的 "Started serving on"）。
     * 没开局域网 / 不是本机集成服务器 / 取不到 ⇒ 0。
     */
    @Override
    public int lanPort() {
        Minecraft c = Minecraft.getInstance();
        if (c == null || !c.hasSingleplayerServer()) return 0;
        net.minecraft.client.server.IntegratedServer s = c.getSingleplayerServer();
        if (s == null || !s.isPublished()) return 0;
        int p = s.getPort();
        return p > 0 ? p : 0;
    }

    @Override
    public void tick() {
        // core 的队列在 PlaytestCore.onTick 里排空；这里额外推进挖矿进度（本轮 fix 4/5）。
        Minecraft c = Minecraft.getInstance();
        if (this.mining == null || c == null || c.level == null || c.gameMode == null) return;
        if (c.level.getBlockState(this.mining).isAir()) { this.mining = null; return; }
        c.gameMode.continueDestroyBlock(this.mining, this.miningDir);   // [T20-①] **不看返回值**（vanilla 在 destroyDelay/cooldown 未到的分支也回 true ⇒ 拿它当「已挖穿」会在第一 tick 清空目标）；收工只看上面那个 isAir
    }

    /** 挖矿目标（跨 tick 持续破坏用）。 */
    private net.minecraft.core.BlockPos mining = null;
    private net.minecraft.core.Direction miningDir = null;

    /** 关掉当前界面：界面开着时 MC 不处理输入（press 静默失效），实测位移恒 0。 */
    @Override
    public boolean closeScreen() {
        Minecraft c = Minecraft.getInstance();
        if (c == null) return false;
        if (c.screen == null) return true;
        c.setScreen(null);
        return true;
    }

    /**
     * 破坏准星所指方块：**开始**破坏（走正常进度），随后由 tick() 逐帧推进。
     * 同一目标**幂等** —— 重发 startDestroyBlock 会把破坏进度清零（真机实测：反复调用永远挖不动）。
     */
    @Override
    public String mineLookingAt() {
        Minecraft c = Minecraft.getInstance();
        if (c == null || c.player == null || c.level == null) return null;
        // 取目标方块：主路 = 自算射线（与渲染无关）；备用 = 渲染路径（mc 的 hitResult / crosshairTarget）。
        // reach 按游戏模式：创造 5.0 / 生存 4.5。名字出处 = javap -p -cp <本档 merged/映射件>: Entity.getEyePosition(float)/getViewVector(float); Player.isCreative(); BlockGetter.clip(ClipContext); ClipContext.Block.OUTLINE/Fluid.NONE; Minecraft.hitResult
        net.minecraft.world.phys.Vec3 eye = c.player.getEyePosition(1.0F);
        double reach = c.player.isCreative() ? 5.0D : 4.5D;
        net.minecraft.world.phys.Vec3 end = eye.add(c.player.getViewVector(1.0F).scale(reach));
        net.minecraft.world.phys.BlockHitResult bhr = c.level.clip(new net.minecraft.world.level.ClipContext(
                eye, end, net.minecraft.world.level.ClipContext.Block.OUTLINE,
                net.minecraft.world.level.ClipContext.Fluid.NONE, c.player));
        if (bhr == null || bhr.getType() != net.minecraft.world.phys.HitResult.Type.BLOCK) {
            if (c.hitResult instanceof net.minecraft.world.phys.BlockHitResult hb && hb.getType() == net.minecraft.world.phys.HitResult.Type.BLOCK) {
                bhr = hb;
            } else {
                return null;
            }
        }
        net.minecraft.core.BlockPos pos = bhr.getBlockPos();
        if (!pos.equals(this.mining)) {
            this.mining = pos;
            this.miningDir = bhr.getDirection();
            c.gameMode.startDestroyBlock(pos, this.miningDir);
        }
        return pos.getX() + "," + pos.getY() + "," + pos.getZ();
    }
    @Override public List<String> supportedKeys() { return KEYS; }

    /** 真按键写入 —— 形状逐字取自生成物 press()（见 dossier 的 concepts.inputSink）。 */
    @Override
    public void setPressed(String key, boolean down) {
        Minecraft c = Minecraft.getInstance();
        if (c == null) return;
        net.minecraft.client.KeyMapping k;
        switch (key) {
            case "forward": k = c.options.keyUp; break;
            case "back": k = c.options.keyDown; break;
            case "left": k = c.options.keyLeft; break;
            case "right": k = c.options.keyRight; break;
            case "jump": k = c.options.keyJump; break;
            case "sneak": k = c.options.keyShift; break;
            case "sprint": k = c.options.keySprint; break;
            case "attack": k = c.options.keyAttack; break;
            case "use": k = c.options.keyUse; break;
            case "inventory": k = c.options.keyInventory; break;
            default: return;
        }
        // ⚠ MC 的「点击类」动作（挖矿/放置/开背包）靠 consumeClick 启动，
        // 而 setDown() **不累加点击计数** ⇒ 不补一次 click 则这些动作永不触发。
        if (down) net.minecraft.client.KeyMapping.click(k.getKey());
        k.setDown(down);
    }

    @Override
    public boolean isPressed(String key) {
        // TODO(未核实)：生成器只写按键、从不读（设计稿 2.5 实测）=> 本档读键方法名无出处。
        //   候选（须先取证再启用）：KeyMapping.isDown()（mojmap 侧）
        return false;
    }

    @Override
    public String playerStateJson() {
        Map<String, Object> m = new LinkedHashMap<>();
        Minecraft c = Minecraft.getInstance();
        if (c == null || c.player == null) { m.put("present", Boolean.FALSE); return Json.of(m); }
        LocalPlayer p = c.player;
        m.put("present", Boolean.TRUE);
        m.put("name", p.getName().getString());
        m.put("x", p.getX());
        m.put("y", p.getY());
        m.put("z", p.getZ());
        m.put("onGround", p.onGround());
        // TODO(未核实)：health / dimension —— 生成物 state.json 不含这两项，名字无出处
        m.put("health", null);
        m.put("dimension", null);
        m.put("screen", screenName());
        return Json.of(m);
    }

    @Override
    public String screenName() {
        Minecraft c = Minecraft.getInstance();
        if (c == null || c.screen == null) return null;
        return c.screen.getClass().getSimpleName();
    }

    @Override
    public String screenshotPath() {
        Minecraft c = Minecraft.getInstance();
        if (c == null) return null;
        try {
            Screenshot.grab(c.gameDirectory, c.getMainRenderTarget(), t -> { });
        } catch (Throwable t) { return null; }
        return new File(c.gameDirectory, "screenshots").getAbsolutePath();
    }

    @Override
    public void openWorld(String worldName) {
        Minecraft c = Minecraft.getInstance();
        if (c == null) return;
        // 生成物写法：client.createWorldOpenFlows().checkForBackupAndLoad(...)；实参把 WORLD 换成 worldName
        c.createWorldOpenFlows().checkForBackupAndLoad(worldName, () -> { });
    }

    @Override
    public void chatCommand(String command) {
        Minecraft c = Minecraft.getInstance();
        if (c == null || c.getConnection() == null) return;
        c.getConnection().sendCommand(command.startsWith("/") ? command.substring(1) : command);
    }

    /** 聊天缓冲：事件在入口类按生成物的注册形挂，回调推到这里（与手工版同形）。 */
    private final java.util.Deque<String> CHAT = new java.util.concurrent.ConcurrentLinkedDeque<>();
    public void pushChat(String line) { CHAT.addLast(line); while (CHAT.size() > 200) CHAT.pollFirst(); }

    @Override public List<String> drainChat() {
        // 生成物挂接：net.minecraftforge.client.event.ClientChatReceivedEvent -> event.getMessage().getString()
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
    /** 本机玩家转视角（look）。写法候选 D-yarn-fields；判据 = javac rc=0。 */
    @Override public boolean look(double yaw, double pitch) {
        Minecraft c = Minecraft.getInstance();
        if (c == null || c.player == null) return false;
        c.player.setYRot((float) yaw);
        c.player.setXRot((float) pitch);
        return true;
    }


    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
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
