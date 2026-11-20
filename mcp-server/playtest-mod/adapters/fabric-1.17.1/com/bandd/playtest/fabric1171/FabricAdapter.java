package com.bandd.playtest.fabric1171;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.network.ClientPlayerEntity;
import net.minecraft.client.option.KeyBinding;
import net.minecraft.client.util.ScreenshotRecorder;

import net.minecraft.client.gui.screen.ConnectScreen;
import net.minecraft.client.gui.screen.DownloadingTerrainScreen;
import net.minecraft.client.gui.screen.LevelLoadingScreen;
import net.minecraft.server.integrated.IntegratedServer;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * fabric 1.17.1 适配层。
 *
 * **名字来源 = 本机 javap 实测**（不是记忆，也不是从邻档推）：逐条读数与类路径见
 * artifacts/fabric-1.17.1-build-record.md 的「适配层差异清单」。要点：
 *   - MinecraftClient: getInstance / player / world / currentScreen / options / runDirectory /
 *     getFramebuffer / getNetworkHandler
 *   - GameOptions: keyForward / keyBack / keyLeft / keyRight ... （包 net.minecraft.client.option）
 *   - KeyBinding: isPressed() / setPressed(boolean)
 *   - 玩家读数: getX() / getY() / getZ()、isOnGround()、getName().getString()、getHealth()
 *   - 截图: ScreenshotRecorder.saveScreenshot(...)
 *   - openWorld = MinecraftClient.startIntegratedServer(String)（1.19.4 起才有 IntegratedServerLoader）
 *   - chatCommand = ClientPlayerEntity.sendChatMessage(String)（**前导 / 区分命令**；本档无 sendChatCommand）
 *
 * 这一层是「薄」的：只有它知道 net.minecraft.* 的名字；core 一个 MC 类型都不碰。
 */
public final class FabricAdapter implements GameBridge {

    private static final List<String> KEYS = Arrays.asList(
            "forward", "back", "left", "right", "jump", "sneak", "sprint", "attack", "use", "inventory");

    @Override
    public String platform() { return "fabric"; }

    @Override
    public String mcVersion() { return "1.17.1"; }

    @Override
    public boolean ready() {
        MinecraftClient c = MinecraftClient.getInstance();
        return c != null && c.player != null && c.world != null;
    }

    /**
     * 本机客户端当前阶段。语义逐字照抄 neoforge-1.20.1 参考档 clientPhase()，只换映射名。
     * 名字出处（javap -p -cp <本档 yarn 映射件>）：MinecraftClient.world / currentScreen 字段、
     * isIntegratedServerRunning()、getServer()；javap -c isIntegratedServerRunning() =
     * integratedServerRunning && server != null（≡ 参考档 hasSingleplayerServer()）。
     */
    @Override
    public String clientPhase() {
        MinecraftClient c = MinecraftClient.getInstance();
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
     * 本机集成服务器当前实际监听端口。语义逐字照抄 neoforge-1.20.1 参考档 lanPort()，只换映射名。
     * 名字出处（javap -c net.minecraft.server.integrated.IntegratedServer）：
     * isRemote() = lanPort > -1（≡ 参考档 isPublished()）；getServerPort() = lanPort（≡ 参考档 getPort()）。
     */
    @Override
    public int lanPort() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || !c.isIntegratedServerRunning()) return 0;
        IntegratedServer server = c.getServer();
        if (server == null || !server.isRemote()) return 0;
        int p = server.getServerPort();
        return p > 0 ? p : 0;
    }

    @Override
    public void tick() {
        // core 的队列在 PlaytestCore.onTick 里排空；这里额外推进挖矿进度（本轮 fix 4/5）。
        MinecraftClient c = MinecraftClient.getInstance();
        if (this.mining == null || c == null || c.world == null || c.interactionManager == null) return;
        c.interactionManager.updateBlockBreakingProgress(this.mining, this.miningDir);   // [T20-①] **不看返回值**（vanilla 在 destroyDelay/cooldown 未到的分支也回 true ⇒ 拿它当「已挖穿」会在第一 tick 清空目标）；收工只看上面那个 isAir
    }

    /** 挖矿目标（跨 tick 持续破坏用）。 */
    private net.minecraft.util.math.BlockPos mining = null;
    private net.minecraft.util.math.Direction miningDir = null;

    /** 关掉当前界面：界面开着时 MC 不处理输入（press 静默失效），实测位移恒 0。 */
    @Override
    public boolean closeScreen() {
        MinecraftClient c = MinecraftClient.getInstance();
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
        MinecraftClient c = MinecraftClient.getInstance();
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

    @Override
    public List<String> supportedKeys() { return KEYS; }

    /** 逻辑键 → 本档 GameOptions 字段（javap 实测名）。 */
    private static KeyBinding kb(String key) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null) return null;
        switch (key) {
            case "forward": return c.options.keyForward;
            case "back": return c.options.keyBack;
            case "left": return c.options.keyLeft;
            case "right": return c.options.keyRight;
            case "jump": return c.options.keyJump;
            case "sneak": return c.options.keySneak;
            case "sprint": return c.options.keySprint;
            case "attack": return c.options.keyAttack;
            case "use": return c.options.keyUse;
            case "inventory": return c.options.keyInventory;
            default: return null;
        }
    }

    @Override
    public boolean isPressed(String key) {
        KeyBinding k = kb(key);
        return k != null && k.isPressed();
    }

    @Override
    public void setPressed(String key, boolean down) {
        KeyBinding k = kb(key);
        if (k == null) return;
        // ⚠ MC 的「点击类」动作（挖矿/放置/开背包）靠 consumeClick/wasPressed 启动，
        // 而 setPressed() **不累加点击计数** ⇒ 不补一次 onKeyPressed 则这些动作永不触发。
        // Yarn 侧无「取绑定键」的公开 getter ⇒ 用 getBoundKeyTranslationKey() 反查
        //（javap 实测本档公开：KeyBinding.onKeyPressed(InputUtil.Key) / KeyBinding.getBoundKeyTranslationKey()
        // / InputUtil.fromTranslationKey(String)）。
        if (down) KeyBinding.onKeyPressed(net.minecraft.client.util.InputUtil.fromTranslationKey(k.getBoundKeyTranslationKey()));
        k.setPressed(down);
    }

    @Override
    public String playerStateJson() {
        MinecraftClient c = MinecraftClient.getInstance();
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        if (c == null || c.player == null) {
            m.put("present", Boolean.FALSE);
            return Json.of(m);
        }
        ClientPlayerEntity p = c.player;
        m.put("present", Boolean.TRUE);
        m.put("name", p.getName().getString());
        m.put("x", p.getX());
        m.put("y", p.getY());
        m.put("z", p.getZ());
        m.put("health", p.getHealth());
        m.put("onGround", p.isOnGround());
        m.put("dimension", c.world == null ? null : c.world.getRegistryKey().getValue().toString());
        m.put("screen", screenName());
        return Json.of(m);
    }

    @Override
    public String screenName() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.currentScreen == null) return null;
        return c.currentScreen.getClass().getSimpleName();
    }

    /**
     * 截图。**诚实边界**：本档接口是异步落盘且不返回路径 ⇒ 返回**截图目录**，
     * 精确文件名请取该目录里最新的 .png（不假装知道文件名）。
     */
    @Override
    public String screenshotPath() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null) return null;
        try {
            ScreenshotRecorder.saveScreenshot(c.runDirectory, c.getFramebuffer(), t -> { });
        } catch (Throwable t) {
            return null;
        }
        File dir = new File(c.runDirectory, "screenshots");
        return dir.getAbsolutePath();
    }

    /** openWorld = MinecraftClient.startIntegratedServer(String)（1.19.4 起才有 IntegratedServerLoader） */
    @Override
    public void openWorld(String worldName) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null) return;
        c.startIntegratedServer(worldName);
    }

    // ================= 化身（第二个角色）=================
    // 本档**无载体**，一律 fail-closed（返回 null/false），**不假装成功**：
    //   - 1.21.11 参考档用的载体是 mannequin（玩家形状、无连接玩家的化身），它是 **1.21.9+** 才有的实体；
    //   - ≤1.20.4 没有等价实体，本仓也**未取证**任何可替代的名字（不猜）；
    //   - 另一条路（真第二客户端 + 关集成服认证）要客户端连接 API，本档同样未取证。
    // ⇒ 桥面/driver 面（HTTP 协议 + 玩家级按键/截图/进世界/命令）本档**完整**，只有「第二角色」这一块缺席。
    @Override public String spawnBot(String name, double distance) { return null; }
    @Override public void moveBotTo(double x, double y, double z) { }
    @Override public void tickBot() { }
    @Override public String giveBot(String item, int count) { return null; }
    /** 本机玩家转视角。出处：本档映射层 + javac 编译验证（编译过 = 名字在该档真存在）。 */
    @Override public boolean look(double yaw, double pitch) {
        net.minecraft.client.MinecraftClient c = net.minecraft.client.MinecraftClient.getInstance();
        if (c == null || c.player == null) return false;
        c.player.setYaw((float) yaw);
        c.player.setPitch((float) pitch);
        return true;
    }

    @Override public boolean lookBot(double yaw, double pitch) { return false; }
    @Override public String breakBotBlock(double x, double y, double z) { return null; }
    @Override public String placeBotBlock(double x, double y, double z) { return null; }
    @Override public boolean setServerAuth(boolean online) { return false; }
    @Override public void joinServer(String address) { }
    @Override public void despawnBot() { }
    @Override public String openBotInventory() { return null; }

    // 收聊天要 fabric-api 的 ClientReceiveMessageEvents：
    //   - ≤1.18.2：该模块（fabric-message-api-v1）在本仓这几档钉的 Fabric API 依赖表里**不存在**
    //     （最早带它的是 0.87.2+1.19.4）⇒ 留着就是编译不过；
    //   - 1.19.4+：模块在，但本档**未取证**其类名/字段名 ⇒ 本轮不猜，先如实返回空表。
    @Override
    public List<String> drainChat() { return new ArrayList<String>(); }

    /** chatCommand = ClientPlayerEntity.sendChatMessage(String)（**前导 / 区分命令**；本档无 sendChatCommand） */
    @Override
    public void chatCommand(String command) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null) return;
        c.player.sendChatMessage(command.startsWith("/") ? command : "/" + command);
    }
}
