package com.bandd.playtest.fabric26;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;
import net.minecraft.client.KeyMapping;
import net.minecraft.client.Minecraft;
import net.minecraft.client.Screenshot;
import net.minecraft.client.player.LocalPlayer;

import net.minecraft.client.gui.screens.ConnectScreen;
import net.minecraft.client.gui.screens.LevelLoadingScreen;
import net.minecraft.client.server.IntegratedServer;
import java.io.File;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * fabric 26.x 适配层（去混淆 / Mojmap）。
 *
 * **名字来源（逐条 javap 实测）**：
 *   F:\MOD_TEST\caches\fabric-loom\minecraftMaven\net\minecraft\minecraft-merged-deobf\26.2\minecraft-merged-deobf-26.2.jar
 * 这一层是"薄"的：只有它知道 net.minecraft.* 的名字；core 一个 MC 类型都不碰。
 *
 * 与 fabric-1.21.11 档（Yarn）的逐条差异见 build-record 的「适配层差异清单」。
 */
public final class FabricAdapter implements GameBridge {

    private static final List<String> KEYS = Arrays.asList(
            "forward", "back", "left", "right", "jump", "sneak", "sprint", "attack", "use", "inventory");

    @Override
    public String platform() { return "fabric"; }

    @Override
    public String mcVersion() { return "26.2"; }

    @Override
    public boolean ready() {
        Minecraft c = Minecraft.getInstance();
        return c != null && c.player != null && c.level != null;
    }

    /**
     * 本机客户端当前阶段。语义逐字照抄 neoforge-1.20.1 参考档 clientPhase()，只换映射名。
     * 名字出处（javap -p -cp <本档 deobf 映射件>）：Minecraft.level 字段、hasSingleplayerServer()、
     * getSingleplayerServer()；javap -c 显示 hasSingleplayerServer() = isLocalServer && singleplayerServer != null。
     * 注：本档无 ReceivingLevelScreen（javap 实测）⇒ 连接期判据用 ConnectScreen || LevelLoadingScreen。
     * 注：本档 Minecraft 无 screen 字段（javap 实测）⇒ 当前界面取 c.gui.screen()。
     */
    @Override
    public String clientPhase() {
        Minecraft c = Minecraft.getInstance();
        if (c == null) return null;
        if (c.level != null) {
            return c.hasSingleplayerServer() ? "singleplayer" : "multiplayer";
        }
        if (c.gui.screen() instanceof ConnectScreen
                || c.gui.screen() instanceof LevelLoadingScreen) {
            return "connecting";
        }
        return "menu";
    }

    /**
     * 本机集成服务器当前实际监听端口。语义逐字照抄 neoforge-1.20.1 参考档 lanPort()，只换映射名。
     * 名字出处（javap -c net.minecraft.client.server.IntegratedServer）：
     * isPublished() = publishedPort > -1；getPort() = publishedPort。
     */
    @Override
    public int lanPort() {
        Minecraft c = Minecraft.getInstance();
        if (c == null || !c.hasSingleplayerServer()) return 0;
        IntegratedServer server = c.getSingleplayerServer();
        if (server == null || !server.isPublished()) return 0;
        int p = server.getPort();
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
        if (c.gui.screen() == null) return true;
        c.gui.setScreen(null);
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

    @Override
    public List<String> supportedKeys() { return KEYS; }

    /** 逻辑键 → 本档 Options 字段（javap 实测：Options.keyUp/keyDown/keyLeft/keyRight/keyJump/keyShift/keySprint/keyAttack/keyUse/keyInventory）。 */
    private static KeyMapping km(String key) {
        Minecraft c = Minecraft.getInstance();
        if (c == null) return null;
        switch (key) {
            case "forward":   return c.options.keyUp;
            case "back":      return c.options.keyDown;
            case "left":      return c.options.keyLeft;
            case "right":     return c.options.keyRight;
            case "jump":      return c.options.keyJump;
            case "sneak":     return c.options.keyShift;
            case "sprint":    return c.options.keySprint;
            case "attack":    return c.options.keyAttack;
            case "use":       return c.options.keyUse;
            case "inventory": return c.options.keyInventory;
            default:          return null;
        }
    }

    /** 读**真人**是否正按着这个键（仲裁用）。javap 实测本档是 KeyMapping.isDown()（不是 Yarn 的 isPressed()）。 */
    @Override
    public boolean isPressed(String key) {
        KeyMapping k = km(key);
        return k != null && k.isDown();
    }

    /** javap 实测本档是 KeyMapping.setDown(boolean)（不是 Yarn 的 setPressed(boolean)）。 */
    @Override
    public void setPressed(String key, boolean down) {
        KeyMapping k = km(key);
        if (k == null) return;
        // ⚠ 26.2 的 KeyMapping **没有** getKey() 也没有 saveString()（javap 实测）⇒ 只能用 getDefaultKey()。
        //   局限（如实记）：玩家改过键位时按的仍是默认键。
        if (down) net.minecraft.client.KeyMapping.click(k.getDefaultKey());
        k.setDown(down);
    }

    @Override
    public String playerStateJson() {
        Minecraft c = Minecraft.getInstance();
        Map<String, Object> m = new LinkedHashMap<>();
        if (c == null || c.player == null) {
            m.put("present", Boolean.FALSE);
            return Json.of(m);
        }
        LocalPlayer p = c.player;
        m.put("present", Boolean.TRUE);
        m.put("name", p.getName().getString());
        m.put("x", p.getX());
        m.put("y", p.getY());
        m.put("z", p.getZ());
        m.put("health", p.getHealth());
        m.put("onGround", p.onGround());
        m.put("dimension", c.level == null ? null : c.level.dimension().identifier().toString());
        m.put("screen", screenName());
        return Json.of(m);
    }

    @Override
    public String screenName() {
        Minecraft c = Minecraft.getInstance();
        if (c == null) return null;
        if (c.gui.screen() == null) return null;
        return c.gui.screen().getClass().getSimpleName();
    }

    /**
     * 截图。**诚实边界**：本档截图 API 异步落盘且不返回文件名
     * ⇒ 这里返回**截图目录**，精确文件名请取该目录里最新的 .png（不假装知道文件名）。
     */
    @Override
    public String screenshotPath() {
        Minecraft c = Minecraft.getInstance();
        if (c == null) return null;
        try {
            // javap 实测 26.2：Minecraft.getMainRenderTarget() 已删，改用 Screenshot.grab(Minecraft, boolean)（boolean=panoramic，普通截图传 false）
            Screenshot.grab(c, false);
        } catch (Throwable t) {
            return null;
        }
        File dir = new File(c.gameDirectory, "screenshots");
        return dir.getAbsolutePath();
    }

    /** 进世界。javap 实测：WorldOpenFlows.openWorld(String, Runnable)（与 1.21.11 的 Yarn 名不同）。 */
    @Override
    public void openWorld(String worldName) {
        Minecraft c = Minecraft.getInstance();
        if (c == null) return;
        c.createWorldOpenFlows().openWorld(worldName, () -> { });
    }

    // ================= 化身（第二个角色）=================
    // 载体 = mannequin（玩家形状、无连接玩家的化身）。javap 实测本档 jar 内
    // net/minecraft/world/entity/decoration/Mannequin.class 存在。
    // 坐标用 **caret 记法**（^ ^ ^n），由玩家作为命令执行者解析 ⇒ 不需要任何向量 API 名。
    private boolean botIsMannequin;

    @Override public String giveBot(String item, int count) { return null; }
    @Override public void joinServer(String address) { }
    @Override public boolean setServerAuth(boolean online) { return false; }
    /** 本机玩家转视角。出处：本档映射层 + javac 编译验证（编译过 = 名字在该档真存在）。 */
    @Override public boolean look(double yaw, double pitch) {
        net.minecraft.client.Minecraft c = net.minecraft.client.Minecraft.getInstance();
        if (c == null || c.player == null) return false;
        c.player.setYRot((float) yaw);
        c.player.setXRot((float) pitch);
        return true;
    }

    @Override public boolean lookBot(double yaw, double pitch) { return false; }
    @Override public String breakBotBlock(double x, double y, double z) { return null; }
    @Override public String placeBotBlock(double x, double y, double z) { return null; }

    /** mannequin 不是玩家实体，没有可驱动的玩家逻辑 ⇒ 空实现。 */
    @Override
    public void tickBot() { }

    /** mannequin **没有物品栏** ⇒ 如实返回 null，不假装能开。 */
    @Override
    public String openBotInventory() {
        return null;
    }

    @Override
    public java.util.List<String> drainChat() {
        return new java.util.ArrayList<>();
    }

    @Override
    public String spawnBot(String name, double distance) {
        if (Minecraft.getInstance() == null) return null;
        chatCommand("summon minecraft:mannequin ^ ^ ^" + distance
                + " {Tags:[\"bandd_bot\"],CustomName:'\"" + name + "\"',CustomNameVisible:1b}");
        botIsMannequin = true;
        return "mannequin";
    }

    @Override
    public void moveBotTo(double x, double y, double z) {
        if (botIsMannequin) chatCommand("tp @e[tag=bandd_bot,limit=1] " + x + " " + y + " " + z);
    }

    @Override
    public void despawnBot() {
        if (botIsMannequin) chatCommand("kill @e[tag=bandd_bot,limit=1]");
        botIsMannequin = false;
    }

    /** javap 实测：ClientPacketListener.sendCommand(String)（1.21.11 的 Yarn 名是 sendChatCommand）。 */
    @Override
    public void chatCommand(String command) {
        Minecraft c = Minecraft.getInstance();
        if (c == null || c.getConnection() == null) return;
        String cmd = command.startsWith("/") ? command.substring(1) : command;
        c.getConnection().sendCommand(cmd);
    }
}
