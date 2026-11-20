package com.bandd.playtest.fabric_1_21_4;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.network.ClientPlayerEntity;
import net.minecraft.client.option.KeyBinding;
import net.minecraft.client.util.ScreenshotRecorder;

import net.minecraft.client.gui.screen.multiplayer.ConnectScreen;
import net.minecraft.client.gui.screen.DownloadingTerrainScreen;
import net.minecraft.client.gui.screen.world.LevelLoadingScreen;
import net.minecraft.server.integrated.IntegratedServer;
import java.io.File;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * fabric 1.21.4 适配层（派生自 1.21.11 档；逐档差异与依据见生成器内 PLAYTEST_VERIFIED_TIER 的 fabric 1.21.4 条目与本档 GameBridge 实现）。
 *
 * **名字来源**：① 仓库 mcp-server/src/generators/playtest-driver.ts 的 PLAYTEST_VERIFIED_TIER
 *   `fabric 1.21.4` 条（Yarn 1.21.4+build.8，asOf 2026-10-01；该条实测结论 = 与 1.21.11 只差 GUI 点击一处，本适配层不用 GUI 点击）；
 * ② 本仓 data/fabric_1.21.4/mappings/yarn-mappings.sqlite 逐名点查（类/方法/字段存在性，2026-11-01 复核）；
 * ③ 本档**真编译**复核（编译过 = 这些名字在该档存在）。运行期行为仍需真机验（未核实）。
 *
 * 这一层是"薄"的：只有它知道 net.minecraft.* 的名字；core 一个 MC 类型都不碰。
 */
public final class FabricAdapter implements GameBridge {

    private static final List<String> KEYS = Arrays.asList(
            "forward", "back", "left", "right", "jump", "sneak", "sprint", "attack", "use", "inventory");

    @Override
    public String platform() { return "fabric"; }

    @Override
    public String mcVersion() { return "1.21.4"; }

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

    /** 逻辑键 → 该档 Options 字段（Yarn 名，见 playtest-driver.ts:221）。 */
    private static KeyBinding kb(String key) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null) return null;
        switch (key) {
            case "forward":   return c.options.forwardKey;
            case "back":      return c.options.backKey;
            case "left":      return c.options.leftKey;
            case "right":     return c.options.rightKey;
            case "jump":      return c.options.jumpKey;
            case "sneak":     return c.options.sneakKey;
            case "sprint":    return c.options.sprintKey;
            case "attack":    return c.options.attackKey;
            case "use":       return c.options.useKey;
            case "inventory": return c.options.inventoryKey;
            default:          return null;
        }
    }

    /** 读**真人**是否正按着这个键（仲裁用）。注意：AI 自己按下的也会是 true ⇒ 由 core 用记账排除。 */
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
        Map<String, Object> m = new LinkedHashMap<>();
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
     * 截图。**诚实边界**：本档 ScreenshotRecorder.saveScreenshot 是异步落盘且不返回路径
     * ⇒ 这里返回**截图目录**，精确文件名请取该目录里最新的 .png（不要假装知道文件名）。
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

    /** 进世界。名字来源 = 仓库已核实的 fabric 档表（playtest-driver.ts:206）。 */
    @Override
    public void openWorld(String worldName) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null) return;
        c.createIntegratedServerLoader().start(worldName, () -> { });
    }

    // ================= 化身（第二个角色）=================
    // 1.21.11 档用 mannequin 当化身载体；**本档没有 `minecraft:mannequin`**：
    //   证据 = 本仓 data/fabric_1.21.4/mappings/yarn-mappings.sqlite 的 classes 表查无
    //   net/minecraft/entity/decoration/MannequinEntity（同表在 1.21.10 / 1.21.11 **有**，2026-11-01 复核）
    //   ⇒ 本档 spawnBot 如实返回 null（不假装起了化身）。
    // TODO(未核实)：≤1.21.8 的替代载体（armor_stand 等）及其 summon NBT/组件语法未取证，不猜。
    private boolean botIsMannequin;

    /**
     * 聊天桥在 fabric 档**暂不可用**：收聊天要 fabric-api 的 ClientReceiveMessageEvents
     * （本工程未依赖 fabric-api）。⇒ 如实返回空表，**不假装收到**。
     */
    // mannequin 不是玩家实体 ⇒ 这些"玩家功能"本档如实不支持（返回 null/false，不假装成功）。
    @Override public String giveBot(String item, int count) { return null; }
    /** fabric 档暂不实现（要 fabric-api 的客户端连接 API；未取证不猜名字）。 */
    @Override public void joinServer(String address) { }
    @Override public boolean setServerAuth(boolean online) { return false; }
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

    /** mannequin 不是玩家实体，没有可驱动的玩家逻辑 ⇒ 空实现。 */
    @Override
    public void tickBot() { }

    /** fabric 档的载体是 mannequin（**没有物品栏**）⇒ 如实返回 null，不假装能开。 */
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
        if (MinecraftClient.getInstance() == null) return null;
        // 本档无 mannequin（见上方证据）⇒ 如实返回 null，不发一条注定失败的 summon 命令。
        // TODO(未核实)：替代载体的实体 id 与 summon NBT/组件语法未取证。
        return null;
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

    @Override
    public void chatCommand(String command) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.getNetworkHandler() == null) return;
        String cmd = command.startsWith("/") ? command.substring(1) : command;
        c.getNetworkHandler().sendChatCommand(cmd);
    }
}
