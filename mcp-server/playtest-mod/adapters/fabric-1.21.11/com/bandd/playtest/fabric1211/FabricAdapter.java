package com.bandd.playtest.fabric1211;

import com.bandd.playtest.core.CommandResult;
import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.GuiResult;
import com.bandd.playtest.core.Json;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.network.ClientPlayerEntity;
import net.minecraft.client.option.KeyBinding;
import net.minecraft.client.util.ScreenshotRecorder;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.math.Direction;
import net.minecraft.util.math.Vec3d;

import net.minecraft.client.gui.screen.multiplayer.ConnectScreen;
import net.minecraft.client.gui.screen.world.LevelLoadingScreen;
import net.minecraft.server.integrated.IntegratedServer;
import java.io.File;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * fabric 1.21.11 适配层。
 *
 * **名字来源**：全部取自仓库**已核实**的 fabric 档表
 * （reference/generators/playtest-driver.ts:172-222 —— Yarn 1.21.11+build.6），
 * 并由本档**真编译**复核（编译过 = 这些名字在该档存在）。运行期行为仍需真机验（未核实）。
 *
 * 这一层是"薄"的：只有它知道 net.minecraft.* 的名字；core 一个 MC 类型都不碰。
 *
 * ---- 2026-11-04 补两项（与 neoforge 档对齐；全部 javap 取证，见各方法注释）----
 * ① click 语义：{@code KeyBinding.onKeyPressed(InputUtil.Key)} 会累加 {@code timesPressed}，
 *    而 {@code setPressed(boolean)} 不会（javap -c 实测：前者 lambda 打 {@code method_74182} =
 *    {@code timesPressed++}，后者只 {@code putfield pressed}）。取「绑定键」Yarn 无公开 getter
 *    （javap -p 实测：KeyBinding 只有 {@code getDefaultKey()} / {@code getBoundKeyTranslationKey()}，
 *    无 getBoundKey；{@code boundKey} 是 protected）⇒ 加 **AccessWidener**
 *    （src/main/resources/bandd_playtest.accesswidener，把 boundKey 放成 public）。
 * ② mine 语义：Yarn 名 = {@code ClientPlayerInteractionManager.attackBlock(BlockPos, Direction)}
 *    与 {@code updateBlockBreakingProgress(BlockPos, Direction)}（javap -p 实测存在；
 *    javap -c MinecraftClient.handleBlockBreaking 实测就是这两个调用）。
 *    **取方块口径（2026-11-04 改，与其余 43 档统一）**：主路 = {@code BlockView.raycast(RaycastContext)}
 *    沿射线找**第一个实心块**；备用 = {@code mc.crosshairTarget}；reach = 创造 5.0 / 生存 4.5。
 *    （旧口径「不用 crosshairTarget、自己算 eye + viewVector × 4.5 取终点方块」已废 ——
 *    它只看终点那一个方块，终点是空气就直接返回 null。）
 */
public final class FabricAdapter implements GameBridge {

    private static final List<String> KEYS = Arrays.asList(
            "forward", "back", "left", "right", "jump", "sneak", "sprint", "attack", "use", "inventory");

    @Override
    public String platform() { return "fabric"; }

    @Override
    public String mcVersion() { return "1.21.11"; }

    // ---- 设置页面自报（core 的 /status → settings 段读这三个）----
    // 为什么必须由适配层报：设置页面是**加载器相关**代码（本档 = Cloth Config 界面 + ModMenu 入口），
    // core 判不出来；不报（默认 false）就如实显示「本档不支持图形设置，请手改该文件」。
    @Override
    public boolean configGuiAvailable() { return true; }

    @Override
    public String configGuiProvider() { return "cloth-config 21.11.153"; }

    @Override
    public String configGuiOpenHint() {
        return "Mods 列表 → bandd_playtest → Config（需装 ModMenu；它不是必需前置）；"
                + "或直接按 O 键（默认绑定，可在「选项 → 按键设置 → 杂项」里改）";
    }

    /**
     * **打开游戏内设置页面**（{@code open_settings} 的落点；Cloth Config）。
     *
     * <p>**复用已有的打开路径** —— {@code PlaytestMod.openSettingsScreen(parent)} 正是
     * ModMenu 的 {@code ConfigScreenFactory} 与全局按键 O 调用的同一个工厂（见
     * {@link com.bandd.playtest.fabric1211.ClothModMenu} 与 {@code PlaytestMod.onInitializeClient}），
     * 这里不另造第三条路，免得「按 O 能开、桥开不出来」这种两套口径。
     *
     * <p>诚实边界：未初始化（core/settings 还没建）或页面构建抛异常时那个工厂**原样返回 parent**
     * ⇒ 这里返回 null ⇒ core 回 {@code SETTINGS_GUI_UNSUPPORTED}，**不假装打开**。
     */
    @Override
    public String openSettingsScreen() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null) return null;
        net.minecraft.client.gui.screen.Screen parent = c.currentScreen;
        net.minecraft.client.gui.screen.Screen s = com.bandd.playtest.PlaytestMod.openSettingsScreen(parent);
        if (s == null || s == parent) return null;
        c.setScreen(s);
        return s.getClass().getSimpleName();
    }

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
     * 注：本档 DownloadingTerrainScreen 已不存在（javap 实测无此类）；javap -c
     * ClientPlayNetworkHandler 显示登录后走 world.LevelLoadingScreen（WorldEntryReason）
     * ⇒ 连接期判据用 ConnectScreen || LevelLoadingScreen。
     */
    @Override
    public String clientPhase() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null) return null;
        if (c.world != null) {
            return c.isIntegratedServerRunning() ? "singleplayer" : "multiplayer";
        }
        if (c.currentScreen instanceof ConnectScreen
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

    /**
     * 每客户端 tick（core 的 PlaytestCore.onTick 调用）。
     * 推进上一发 {@code mine} 的破坏进度：Yarn {@code updateBlockBreakingProgress} =
     * mojmap {@code continueDestroyBlock}（与 vanilla MinecraftClient.handleBlockBreaking 同路）。
     * 方块已变空气（挖穿 / 被换掉）就收工。
     */
    @Override
    public void tick() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null || c.world == null || c.interactionManager == null) {
            miningPos = null;
            miningTracker.clear();
            return;
        }
        if (miningPos == null || !miningTracker.hasTarget()) return;
        // [T20-①] **不看 updateBlockBreakingProgress 的返回值**：vanilla 在 blockBreakingCooldown
        //   未到的分支里也回 true（javap -c 实证）⇒ 拿它当「已挖穿」会在第一 tick 清空目标。
        //   唯一完成判据 = 目标格变空气（MiningTracker.beginTick）；另有超时收工。
        boolean air;
        try {
            air = c.world.getBlockState(miningPos).isAir();
        } catch (Throwable t) {
            air = false;                 // 读不到就当作「还在」；超时兜底会收工，绝不假装挖穿
        }
        String stop = miningTracker.beginTick(air, nowMs());
        if (stop != null) {
            // MINE_BROKEN（挖穿）/ MINE_TIMEOUT（超时）：原因留在 mineStatus() 里如实回出去
            miningPos = null;
            return;
        }
        boolean cont = c.interactionManager.updateBlockBreakingProgress(miningPos, miningSide);
        miningTracker.noteContinueReturned(cont);   // **只记账**，不据此收工
    }

    /**
     * [T20-①] mine 的破坏进度自报（core 的 mine 回执 progress 段）。
     * 只读 MiningTracker 的内存字段（不碰 MC）⇒ 与 tick 同线程调用安全。
     */
    @Override public Map<String, Object> mineStatus() {
        return miningTracker.status();
    }

    /**
     * [T20-③] 窗口聚焦自报。
     * 名字取证（javap -p，jar = minecraft-merged-1.21.11-net.fabricmc.yarn.1_21_11.1.21.11+build.6-v2）：
     *   net.minecraft.client.MinecraftClient : public boolean isWindowFocused();
     * （neoforge 1.20.1 档叫 Minecraft#isWindowActive）。
     */
    @Override public Boolean windowFocused() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null) return null;
        return Boolean.valueOf(c.isWindowFocused());
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

    /**
     * 写按键（玩家级动作）。down=true 时**补一次 click**：
     * MC 的「点击类」动作（挖矿/放置/开背包）由 {@code wasPressed()}（mojmap {@code consumeClick()}）
     * 启动，而 {@code setPressed(boolean)} 只改 pressed、**不累加 timesPressed**
     * ⇒ 不补点击则这些动作永不触发（真机实证见 forge/neoforge 1.20.1：只 setDown 时
     * press inventory 打不开背包、按住 attack 8 秒挖不动沙子；移动键不受影响，因为直接读 isPressed）。
     *
     * 取证（javap，Yarn 1.21.11+build.6 映射件）：
     * <pre>
     *   public static void onKeyPressed(net.minecraft.client.util.InputUtil$Key);   // 存在
     *   private static void method_74182(KeyBinding);   // 字节码 = timesPressed++（onKeyPressed 的 lambda 目标）
     *   public void setPressed(boolean);                // 字节码 = putfield pressed（不碰 timesPressed）
     *   protected net.minecraft.client.util.InputUtil$Key boundKey;   // 无公开 getter ⇒ 靠 AccessWidener 放成 public
     * </pre>
     * 等价于 mojmap 档的 {@code KeyMapping.click(k.getKey())}。
     */
    @Override
    public void setPressed(String key, boolean down) {
        KeyBinding k = kb(key);
        if (k == null) return;
        if (down) KeyBinding.onKeyPressed(k.boundKey);
        k.setPressed(down);
        if (!down) syncWalkHeldReleased(key);
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
        // 状态器要用的朝向（javap -p net.minecraft.entity.Entity: getYaw()/getPitch()）。
        // 只**新增两个键**，不改旧键 ⇒ 老调用方（query_player_state）不受影响。
        m.put("yaw", p.getYaw());
        m.put("pitch", p.getPitch());
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
     * 截图。**诚实边界**：1.21.11 的 ScreenshotRecorder.saveScreenshot 是异步落盘且不返回路径
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
    // fabric 档**没有** fabric-api 依赖 ⇒ 用不了 Fabric 的 FakePlayer；
    // 改用 mannequin（玩家形状、无连接玩家的化身，1.21.9+）。坐标用 **caret 记法**（^ ^ ^n），
    // 由玩家作为命令执行者解析 ⇒ 不需要任何 Yarn 向量 API 名，少一处未核实面。
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

    // ================= 破坏准星所指方块 =================
    /**
     * 挖矿会话状态机（[T20-①]）：**唯一完成判据 = 目标格变空气**，另有超时收工（MINE_TIMEOUT）。
     *
     * <p>为什么不用 updateBlockBreakingProgress 的返回值：vanilla 在 blockBreakingCooldown
     * 未到的分支里**也回 true**（javap -c 实证，见 {@link com.bandd.playtest.core.MiningTracker}
     * 类注释）⇒ 旧写法会在**第一 tick** 把目标清空、破坏进度永远攒不满
     * （真机铁证：生存模式 mine 40 次 / 22 秒，方块纹丝不动）。
     */
    private final com.bandd.playtest.core.MiningTracker miningTracker =
            new com.bandd.playtest.core.MiningTracker();

    /** 正在破坏的目标（null = 没有）。**同一目标不重发 START** —— 重发会清零破坏进度。 */
    private BlockPos miningPos;
    private Direction miningSide = Direction.UP;

    /** 宿主时钟（毫秒；只用于进度自报的 elapsedMs，不用它当判据）。 */
    private static long nowMs() { return System.currentTimeMillis(); }

    /**
     * 破坏准星所指方块（本机客户端）。
     *
     * **取方块口径（与其余 43 档统一，2026-11-04 改）**：
     * 主路 = {@code BlockView.raycast(RaycastContext)} 沿射线找**第一个实心块**
     * （Yarn 1.21.11 名；1.14.4 档才叫 {@code rayTrace}）；
     * 备用 = 渲染路径的 {@code mc.crosshairTarget}（窗口失焦时它可能陈旧，故只作兜底）。
     * reach 按游戏模式：创造 5.0 / 生存 4.5。
     * 随后调 Yarn {@code ClientPlayerInteractionManager.attackBlock(BlockPos, Direction)}
     * （= mojmap {@code startDestroyBlock}）开始；进度由 {@link #tick()} 里的
     * {@code updateBlockBreakingProgress}（= mojmap {@code continueDestroyBlock}）推进。
     *
     * 幂等：**同一目标重复调用不再发 START**（等价于 vanilla 只在攻击键按下那一刻发一次），
     * 否则每次都会把破坏进度清零、永远挖不穿。
     *
     * 取证（javap，Yarn 1.21.11+build.6 映射件）：
     * <pre>
     *   public boolean attackBlock(net.minecraft.util.math.BlockPos, net.minecraft.util.math.Direction);
     *   public boolean updateBlockBreakingProgress(net.minecraft.util.math.BlockPos, net.minecraft.util.math.Direction);
     *   public net.minecraft.client.network.ClientPlayerInteractionManager interactionManager;  // MinecraftClient 字段
     *   // javap -c MinecraftClient.handleBlockBreaking 里就是 updateBlockBreakingProgress / cancelBlockBreaking
     *   // javap -c MinecraftClient（#3494）里 attackBlock 被 startAttack 路径调用
     *   public final net.minecraft.util.math.Vec3d getEyePos();          // Entity
     *   public final net.minecraft.util.math.Vec3d getRotationVec(float); // Entity
     *   public boolean isCreative();                                     // PlayerEntity
     *   public default net.minecraft.util.hit.BlockHitResult raycast(net.minecraft.world.RaycastContext); // BlockView
     *   public net.minecraft.world.RaycastContext(Vec3d, Vec3d, ShapeType, FluidHandling, Entity);
     *   //   RaycastContext\$ShapeType.OUTLINE / RaycastContext\$FluidHandling.NONE 均为该档枚举常量
     *   public net.minecraft.util.hit.HitResult crosshairTarget;         // MinecraftClient 字段
     *   //   BlockHitResult.getBlockPos() / getSide() / getType();  HitResult\$Type.BLOCK
     *   public boolean attackBlock(net.minecraft.util.math.BlockPos, net.minecraft.util.math.Direction);
     *   public boolean updateBlockBreakingProgress(net.minecraft.util.math.BlockPos, net.minecraft.util.math.Direction);
     * </pre>
     */
    @Override
    public String mineLookingAt() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null || c.world == null || c.interactionManager == null) return null;
        Vec3d eye = c.player.getEyePos();
        // reach 按游戏模式：创造 5.0 / 生存 4.5（与其余 43 档统一口径）。
        double reach = c.player.isCreative() ? 5.0D : 4.5D;
        Vec3d end = eye.add(c.player.getRotationVec(1.0F).multiply(reach));
        // 主路：沿射线找**第一个实心块**（BlockView.raycast(RaycastContext)；Yarn 1.21.11 名，1.14.4 才叫 rayTrace）。
        net.minecraft.util.hit.BlockHitResult bhr = c.world.raycast(new net.minecraft.world.RaycastContext(
                eye, end, net.minecraft.world.RaycastContext.ShapeType.OUTLINE,
                net.minecraft.world.RaycastContext.FluidHandling.NONE, c.player));
        if (bhr == null || bhr.getType() != net.minecraft.util.hit.HitResult.Type.BLOCK) {
            // 备用：渲染路径的准星命中（mc.crosshairTarget）。失焦时它可能陈旧 ⇒ 只在主路落空时用。
            if (c.crosshairTarget instanceof net.minecraft.util.hit.BlockHitResult hb
                    && hb.getType() == net.minecraft.util.hit.HitResult.Type.BLOCK) {
                bhr = hb;
            } else {
                return null;
            }
        }
        BlockPos pos = bhr.getBlockPos();
        // 入射面：直接取命中面（旧实现用「方块中心 → 眼睛」主轴反推）。
        Direction side = bhr.getSide();
        if (!pos.equals(miningPos)) {
            // attackBlock 回 false = 游戏**不受理**这次破坏（javap -c：blockActionRestricted /
            // 出世界边界 两条早退）⇒ 如实收工、让 core 回 MINE_FAILED，**不假装已开始**。
            if (!c.interactionManager.attackBlock(pos, side)) {
                miningPos = null;
                miningTracker.clear();
                return null;
            }
            miningPos = pos;
            miningSide = side;
            // 同一目标**绝不重发 START**（重发会把破坏进度清零）⇒ 幂等判据收在 MiningTracker.aim 里。
            String blockId = null;
            try {
                blockId = net.minecraft.registry.Registries.BLOCK
                        .getId(c.world.getBlockState(pos).getBlock()).toString();
            } catch (Throwable t) {
                blockId = null;   // 取不到就留 null（进度自报里如实写 null），不编
            }
            miningTracker.aim(pos.getX(), pos.getY(), pos.getZ(), blockId, nowMs());
        }
        return pos.getX() + "," + pos.getY() + "," + pos.getZ();
    }

    /**
     * 关掉当前界面（Yarn：ClientPlayerEntity#closeHandledScreen / MinecraftClient#setScreen）。
     *
     * <p>[T41 修复] 容器界面或 {@code currentScreenHandler != playerScreenHandler} 时必须走
     * {@code c.player.closeHandledScreen()}（javap 实证：发送 {@code CloseHandledScreenC2SPacket}
     * 给服务端 + 重置 {@code currentScreenHandler = playerScreenHandler} + {@code c.setScreen(null)}），
     * 防止只调 {@code setScreen(null)} 导致服务端残留旧容器 syncId、静默丢弃后续背包点击与丢物品。
     */
    @Override public boolean closeScreen() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null) return false;
        boolean hasContainer = c.player != null
                && (c.player.currentScreenHandler != c.player.playerScreenHandler
                        || c.currentScreen instanceof net.minecraft.client.gui.screen.ingame.HandledScreen);
        if (hasContainer) {
            c.player.closeHandledScreen();
            return true;
        }
        if (c.currentScreen == null) return true;
        c.setScreen(null);
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

    @Override
    public void chatCommand(String command) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.getNetworkHandler() == null) return;
        String cmd = command.startsWith("/") ? command.substring(1) : command;
        c.getNetworkHandler().sendChatCommand(cmd);
    }

    // ================= ① 诚实命令回执（chat_command）=================
    /**
     * 执行一条命令并给出**诚实回执**：{@code parsed / result / error / cursor}。
     *
     * 名字全部 javap 取证（Yarn 1.21.11+build.6 映射件）：
     * <pre>
     *   net.minecraft.client.network.ClientPlayNetworkHandler
     *     public com.mojang.brigadier.CommandDispatcher<net.minecraft.client.network.ClientCommandSource> getCommandDispatcher();
     *     public net.minecraft.client.network.ClientCommandSource getCommandSource();
     *     public void sendChatCommand(java.lang.String);
     *   net.minecraft.client.network.ClientCommandSource implements net.minecraft.command.CommandSource
     *   net.minecraft.server.integrated.IntegratedServer extends net.minecraft.server.MinecraftServer
     *   net.minecraft.server.MinecraftServer
     *     public net.minecraft.server.command.CommandManager getCommandManager();
     *     public net.minecraft.server.command.ServerCommandSource getCommandSource();
     *     public net.minecraft.server.PlayerManager getPlayerManager();
     *   net.minecraft.server.command.CommandManager
     *     public com.mojang.brigadier.CommandDispatcher<net.minecraft.server.command.ServerCommandSource> getDispatcher();
     *   net.minecraft.server.network.ServerPlayerEntity : public net.minecraft.server.command.ServerCommandSource getCommandSource();
     *   com.mojang.brigadier.CommandDispatcher : parse(String,Object) / execute(ParseResults)
     *   com.mojang.brigadier.ParseResults     : getExceptions() / getReader() / getContext().getCommand()
     *   javap -c net.minecraft.client.network.ClientPlayNetworkHandler$1#method_71930 = iconst_0; ireturn
     *     ⇒ **客户端派发器的可执行节点是 no-op 桩**，客户端 execute 拿不到真实结果 ⇒ 单机改在集成服务端执行。
     * </pre>
     */
    @Override
    public CommandResult runCommand(String command) {
        MinecraftClient c = MinecraftClient.getInstance();
        String cmd = command.startsWith("/") ? command.substring(1) : command;
        if (c == null || c.getNetworkHandler() == null) {
            chatCommand(command);   // 没连上：仍按旧路发出去，但如实说拿不到解析结果
            return new CommandResult(false, null, "客户端未连接：无命令派发器，无法给出解析回执", null);
        }
        // (A) 客户端命令派发器 parse（拿解析错误与出错位置）
        net.minecraft.client.network.ClientPlayNetworkHandler h = c.getNetworkHandler();
        com.mojang.brigadier.CommandDispatcher<net.minecraft.client.network.ClientCommandSource> d =
                h.getCommandDispatcher();
        com.mojang.brigadier.ParseResults<net.minecraft.client.network.ClientCommandSource> pr =
                d.parse(cmd, h.getCommandSource());
        if (!parsedOk(pr)) return new CommandResult(false, null, firstError(pr), cursorOf(pr));

        // (B) 执行
        IntegratedServer server = c.getServer();
        if (server != null) {
            // 单机：在**集成服务端**执行 ⇒ 拿真实返回值与真实错误
            net.minecraft.server.command.ServerCommandSource src = commandSource(server);
            com.mojang.brigadier.CommandDispatcher<net.minecraft.server.command.ServerCommandSource> sd =
                    server.getCommandManager().getDispatcher();
            com.mojang.brigadier.ParseResults<net.minecraft.server.command.ServerCommandSource> spr = sd.parse(cmd, src);
            if (!parsedOk(spr)) return new CommandResult(false, null, firstError(spr), cursorOf(spr));
            try {
                int r = sd.execute(spr);
                return new CommandResult(true, String.valueOf(r), null, null);
            } catch (Throwable t) {
                return new CommandResult(true, null, msgOf(t), cursorOf(t));
            }
        }
        // 多人：客户端派发器 execute（no-op 桩）+ sendChatCommand；服务端返回值客户端观察不到 ⇒ result=null（明说）
        try { d.execute(pr); } catch (Throwable ignored) { }
        h.sendChatCommand(cmd);
        return new CommandResult(true, null, null, null);
    }

    /** 优先用**真人玩家**的源（权限与真人一致），拿不到再退回控制台源。 */
    private static net.minecraft.server.command.ServerCommandSource commandSource(IntegratedServer server) {
        for (net.minecraft.server.network.ServerPlayerEntity p : server.getPlayerManager().getPlayerList()) {
            return p.getCommandSource();
        }
        return server.getCommandSource();
    }

    /** 完整解析 = 无异常 ∧ 整串消费完 ∧ 确实指向一条可执行命令（与 1.21.11 validate() 同口径）。 */
    private static boolean parsedOk(com.mojang.brigadier.ParseResults<?> pr) {
        return pr != null
                && pr.getExceptions().isEmpty()
                && pr.getReader().getRemaining().isEmpty()
                && pr.getContext().getCommand() != null;
    }

    private static String firstError(com.mojang.brigadier.ParseResults<?> pr) {
        if (pr == null) return "无解析结果";
        if (!pr.getExceptions().isEmpty()) {
            return String.valueOf(pr.getExceptions().values().iterator().next().getMessage());
        }
        if (!pr.getReader().getRemaining().isEmpty()) {
            return "命令未解析完：剩余 \"" + pr.getReader().getRemaining() + "\"";
        }
        if (pr.getContext().getCommand() == null) return "没有匹配到可执行命令";
        return null;
    }

    private static Integer cursorOf(com.mojang.brigadier.ParseResults<?> pr) {
        if (pr == null) return null;
        if (!pr.getExceptions().isEmpty()) {
            return Integer.valueOf(pr.getExceptions().values().iterator().next().getCursor());
        }
        if (!pr.getReader().getRemaining().isEmpty()) return Integer.valueOf(pr.getReader().getCursor());
        return null;
    }

    private static Integer cursorOf(Throwable t) {
        if (t instanceof com.mojang.brigadier.exceptions.CommandSyntaxException cse) {
            return Integer.valueOf(cse.getCursor());
        }
        return null;
    }

    private static String msgOf(Throwable t) {
        String m = t.getMessage();
        return m == null ? t.getClass().getSimpleName() : m;
    }

    // ================= ② 控件树可读（query_widgets）=================
    /**
     * 当前 Screen 的控件清单（JSON 数组）；没有界面返回 {@code "[]"}。
     *
     * 名字 javap 取证（同上 Yarn 映射件）：
     * <pre>
     *   net.minecraft.client.gui.screen.Screen
     *     public java.util.List<? extends net.minecraft.client.gui.Element> children();
     *   net.minecraft.client.gui.widget.ClickableWidget
     *     public int getX(); public int getY(); public int getWidth(); public int getHeight();
     *     public net.minecraft.text.Text getMessage(); public boolean isFocused();
     *     public boolean active; public boolean visible;
     *   net.minecraft.text.Text : public default java.lang.String getString();
     * </pre>
     */
    /**
     * Cloth 配置**条目**的壳：它不是可点控件，但 {@code query_widgets} 的清单里有它一格
     * ⇒ {@code click_widget} 的下标必须与清单**同序**，所以这里也占一格（并明确「不可点」）。
     */
    private static final class ClothRef {
        final Object entry;
        final String category;
        ClothRef(Object entry, String category) { this.entry = entry; this.category = category; }
    }

    /**
     * 当前界面的**控件元素序列**，与 {@code query_widgets} 返回的清单**同序**：
     * 元素要么是 {@code ClickableWidget}，要么是 {@link ClothRef}。
     *
     * <p>为什么两处共用这一份遍历：{@code click_widget} 的 {@code index} 是**清单里的下标**，
     * 两边各写一份遍历迟早漂移 ⇒ 按下标点到的不是清单上那一格。
     */
    private static java.util.List<Object> widgetElements(Object screen) {
        java.util.List<Object> out = new java.util.ArrayList<>();
        // [T16] **递归**进容器：Cloth 的条目挂在 ListWidget 里面，只扫顶层 children() 会看不到
        // 四个纵层旋钮（真机实证：顶层只有分类页签，没有条目）。ParentElement#children() 给出子元素，
        // 用 identity set 防环。javap（yarn 1.21.11 映射件）原文：
        //   public interface net.minecraft.client.gui.ParentElement extends net.minecraft.client.gui.Element
        //     public abstract java.util.List<? extends net.minecraft.client.gui.Element> children();
        java.util.Set<Object> seen = java.util.Collections.newSetFromMap(new java.util.IdentityHashMap<Object, Boolean>());
        collectWidgets(screen, out, seen);
        // [T16] Cloth 的**条目**不在 Screen#children() 里（AbstractConfigScreen 覆写了自己的
        // childrenL()，顶层只给页签 / 搜索框）⇒ 纵层四旋钮看不到。这里额外走 Cloth 自己的
        // getCategorizedEntries()，把每个条目（与它的子控件）也按**同一顺序**放进序列。
        // javap（cloth-config 21.11.153 fabric 件）实证：
        //   ClothConfigScreen#getCategorizedEntries():Map<Text,List<AbstractConfigEntry<?>>>
        //   AbstractConfigEntry#getFieldName():Text
        if (screen instanceof me.shedaniel.clothconfig2.gui.ClothConfigScreen cs) {
            try {
                java.util.Map<?, ?> cats = cs.getCategorizedEntries();
                if (cats != null) {
                    for (java.util.Map.Entry<?, ?> e : cats.entrySet()) {
                        String cat = e.getKey() == null ? "" : String.valueOf(e.getKey());
                        Object lv = e.getValue();
                        if (!(lv instanceof java.util.List)) continue;
                        for (Object ent : (java.util.List<?>) lv) {
                            if (!(ent instanceof me.shedaniel.clothconfig2.api.AbstractConfigEntry)) continue;
                            out.add(new ClothRef(ent, cat));
                            collectWidgets(ent, out, seen);
                        }
                    }
                }
            } catch (Throwable ignored) { }
        }
        return out;
    }

    @Override
    public String widgetsJson() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.currentScreen == null) return "[]";
        java.util.List<Object> out = new java.util.ArrayList<>();
        for (Object el : widgetElements(c.currentScreen)) {
            if (el instanceof net.minecraft.client.gui.widget.ClickableWidget w) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("type", w.getClass().getSimpleName());
                m.put("x", w.getX());
                m.put("y", w.getY());
                m.put("width", w.getWidth());
                m.put("height", w.getHeight());
                m.put("text", w.getMessage().getString());
                m.put("active", w.active);
                m.put("visible", w.visible);
                m.put("focused", w.isFocused());
                out.add(m);
            } else if (el instanceof ClothRef cr) {
                me.shedaniel.clothconfig2.api.AbstractConfigEntry<?> ace =
                        (me.shedaniel.clothconfig2.api.AbstractConfigEntry<?>) cr.entry;
                net.minecraft.text.Text fn = ace.getFieldName();
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("type", "ClothEntry");
                m.put("category", cr.category);
                m.put("text", fn == null ? "" : fn.getString());
                m.put("active", Boolean.TRUE);
                m.put("visible", Boolean.TRUE);
                m.put("focused", Boolean.FALSE);
                out.add(m);
            }
        }
        return Json.of(out);
    }

    /**
     * 递归收集控件：自己若是 ClickableWidget 就把**对象本身**放进序列，是 ParentElement 就继续下钻（防环）。
     *
     * <p>为什么放对象而不是直接放回执 Map：{@code click_widget} 要按下标**真点**那一格；
     * 回执的拼装挪到 {@link #widgetsJson()} 一处做，两处共用同一次遍历 ⇒ 下标不会漂移。
     */
    private static void collectWidgets(Object el, java.util.List<Object> out, java.util.Set<Object> seen) {
        if (el == null || !seen.add(el)) return;
        if (el instanceof net.minecraft.client.gui.widget.ClickableWidget) {
            out.add(el);
        }
        if (el instanceof net.minecraft.client.gui.ParentElement pe) {
            for (net.minecraft.client.gui.Element ch : pe.children()) collectWidgets(ch, out, seen);
        }
    }

    // ================= ③ 日志游标增量读（query_log）=================
    /** 游戏实例目录（javap：{@code net.minecraft.client.MinecraftClient.runDirectory} 是 public final File）。 */
    @Override
    public String gameDirectory() {
        MinecraftClient c = MinecraftClient.getInstance();
        return c == null ? null : c.runDirectory.getAbsolutePath();
    }

    // ================= ④ 状态器取值面（query_state / query_map）=================
    /**
     * 本档实现了 {@code blockAt} + {@code topSolidY} ⇒ 自报支持状态器
     * （见 {@code GameBridge#stateMapCapable}）。未实现的老档走 default = false ⇒ 如实「不支持」。
     *
     * 名字**全部 javap 取证**（jar = 本档 yarn 映射件
     * {@code .gradle/loom-cache/minecraftMaven/.../minecraft-merged-*-1.21.11-net.fabricmc.yarn.1_21_11.1.21.11+build.6-v2.jar}）：
     * <pre>
     *   javap -p net.minecraft.world.BlockView
     *     public abstract net.minecraft.block.BlockState getBlockState(net.minecraft.util.math.BlockPos);
     *   javap -p net.minecraft.block.AbstractBlock$AbstractBlockState
     *     public net.minecraft.block.Block getBlock();   public boolean isAir();
     *   javap -p net.minecraft.registry.Registries
     *     public static final net.minecraft.registry.DefaultedRegistry&lt;net.minecraft.block.Block&gt; BLOCK;
     *   javap -p net.minecraft.registry.Registry
     *     public abstract net.minecraft.util.Identifier getId(T);
     *   javap -p net.minecraft.world.World
     *     public int getTopY(net.minecraft.world.Heightmap$Type, int, int);
     *     public long getTimeOfDay(); public boolean isRaining(); public boolean isThundering();
     *   javap -c net.minecraft.world.World#getTopY
     *     isChunkLoaded:(II)Z 为假就跳走；为真 → getChunk(..).sampleHeightmap(type, x&amp;15, z&amp;15) + 1
     *     ⇒ **返回「最高方块上面那一格的 Y」** ⇒ 最高非空气方块的 Y = getTopY(...) - 1
     *   javap -p net.minecraft.world.WorldView
     *     public abstract boolean isChunkLoaded(int, int);   // ★ 未加载区块必须显式判，否则被当空气
     *   javap -p net.minecraft.world.HeightLimitView
     *     public default boolean isOutOfHeightLimit(int);
     *   javap -p net.minecraft.world.Heightmap$Type
     *     public static final net.minecraft.world.Heightmap$Type WORLD_SURFACE;   // = 最高非空气方块
     *   javap -p net.minecraft.util.math.BlockPos$Mutable
     *     public net.minecraft.util.math.BlockPos$Mutable(); public ... set(int, int, int);
     *   javap -p net.minecraft.entity.Entity
     *     public float getYaw(); public float getPitch();
     * </pre>
     */
    @Override
    public boolean stateMapCapable() { return true; }

    /** 复用一个可变 BlockPos 以免每格分配（只在客户端 tick 线程用）。 */
    private final BlockPos.Mutable probePos = new BlockPos.Mutable();

    /** 坐标处方块的注册名；**越界 / 未加载回 null**（core 当「未知」，不假装是空气）。 */
    @Override
    public String blockAt(int x, int y, int z) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.world == null) return null;
        if (c.world.isOutOfHeightLimit(y)) return null;
        if (!c.world.isChunkLoaded(x >> 4, z >> 4)) return null;
        net.minecraft.block.BlockState st = c.world.getBlockState(probePos.set(x, y, z));
        return net.minecraft.registry.Registries.BLOCK.getId(st.getBlock()).toString();
    }

    /** 该列最高非空气方块的 Y（= WORLD_SURFACE 高度图的 getTopY - 1）；未加载回 MIN_VALUE。 */
    @Override
    public int topSolidY(int x, int z) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.world == null) return Integer.MIN_VALUE;
        if (!c.world.isChunkLoaded(x >> 4, z >> 4)) return Integer.MIN_VALUE;
        return c.world.getTopY(net.minecraft.world.Heightmap.Type.WORLD_SURFACE, x, z) - 1;
    }

    /** 时间/天气。本档 {@code getTimeOfDay()} 已是 0..23999；没有「世界总时间」的公开取值口 ⇒ dayTime 留 null。 */
    @Override
    public String worldEnvJson() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.world == null) return null;
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("timeOfDay", c.world.getTimeOfDay());
        m.put("dayTime", null);
        m.put("raining", c.world.isRaining());
        m.put("thundering", c.world.isThundering());
        return Json.of(m);
    }

    // ================= ⑤ 实体扫描面（query_map/query_state 的 entities 叠加层）=================
    /**
     * 本档实现了 {@link #nearbyEntitiesJson} ⇒ 自报支持实体扫描（见 {@code GameBridge#entityScanCapable}）。
     * 未实现的档走 default = false ⇒ 地图头如实写 {@code entitiesNote}，不假装有实体层。
     *
     * 名字**全部 javap 取证**（jar = 本档 yarn 映射件
     * {@code .gradle/loom-cache/minecraftMaven/.../minecraft-merged-05f109d532-1.21.11-net.fabricmc.yarn.1_21_11.1.21.11+build.6-v2.jar}）：
     * <pre>
     *   javap -p net.minecraft.client.MinecraftClient
     *     public net.minecraft.client.world.ClientWorld world;
     *     public net.minecraft.client.network.ClientPlayerEntity player;
     *   javap -p net.minecraft.client.world.ClientWorld
     *     public java.lang.Iterable&lt;net.minecraft.entity.Entity&gt; getEntities();   // ★ 客户端已加载实体
     *   javap -p net.minecraft.entity.Entity
     *     public net.minecraft.entity.EntityType&lt;?&gt; getType();
     *     public final double getX(); public final double getY(); public final double getZ();
     *     public java.util.UUID getUuid();
     *   javap -p net.minecraft.registry.Registries
     *     public static final net.minecraft.registry.DefaultedRegistry&lt;net.minecraft.entity.EntityType&lt;?&gt;&gt; ENTITY_TYPE;
     *   javap -p net.minecraft.registry.Registry
     *     public abstract net.minecraft.util.Identifier getId(T);
     * </pre>
     * **偷懒的诚实边界**：{@code ClientWorld.getEntities()} 只含**客户端已加载**的实体
     * ⇒ 取到啥报啥，**不承诺**「半径内全都看得到」；玩家自己按**同一性**排除（与桥路线 {@code o == mc.player} 一致）。
     */
    @Override
    public boolean entityScanCapable() { return true; }

    @Override
    public String nearbyEntitiesJson(double radius) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null || c.world == null) return null;
        double r2 = radius * radius;
        ClientPlayerEntity p = c.player;
        java.util.List<Object> out = new java.util.ArrayList<>();
        for (net.minecraft.entity.Entity e : c.world.getEntities()) {
            if (e == p) continue;                       // 玩家自己不算「附近实体」（与桥一致）
            double dx = e.getX() - p.getX();
            double dy = e.getY() - p.getY();
            double dz = e.getZ() - p.getZ();
            if (dx * dx + dy * dy + dz * dz > r2) continue;
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("type", net.minecraft.registry.Registries.ENTITY_TYPE.getId(e.getType()).toString());
            m.put("cls", e.getClass().getSimpleName());
            m.put("x", e.getX());
            m.put("y", e.getY());
            m.put("z", e.getZ());
            out.add(m);
        }
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("count", out.size());
        m.put("entities", out);
        return Json.of(m);
    }

    // ================= ⑥ 读背包面（query_inventory / query_inventory_slot）=================
    /**
     * 本档实现了 {@link #inventoryJson} ⇒ 自报支持读背包。
     *
     * 名字**全部 javap 取证**（同上 jar）：
     * <pre>
     *   javap -p net.minecraft.entity.player.PlayerEntity
     *     public net.minecraft.entity.player.PlayerInventory getInventory();
     *   javap -p net.minecraft.entity.player.PlayerInventory
     *     public int size();                                   // 41 = 36 主背包 + 4 护甲 + 1 副手
     *     public net.minecraft.item.ItemStack getStack(int);
     *     public int getSelectedSlot();
     *     public net.minecraft.item.ItemStack getSelectedStack();   // ★ 主手那格
     *   javap -p net.minecraft.item.ItemStack
     *     public boolean isEmpty(); public net.minecraft.item.Item getItem(); public int getCount();
     *   javap -p net.minecraft.registry.Registries : public static final ... ITEM;
     * </pre>
     * **口径差异（如实写在回执的 idKind 里）**：本档给**现代注册名**（{@code minecraft:stone}），
     * 桥路线（forge 1.7.10–1.12.2）给的是 **unlocalizedName**（{@code item.stone}）—— 形状对齐、口径不同源。
     */
    @Override
    public boolean inventoryCapable() { return true; }

    @Override
    public String inventoryJson() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null) return null;
        net.minecraft.entity.player.PlayerInventory inv = c.player.getInventory();
        if (inv == null) return null;
        int size = inv.size();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("size", size);
        java.util.List<Object> slots = new java.util.ArrayList<>();
        for (int i = 0; i < size; i++) {
            net.minecraft.item.ItemStack s = inv.getStack(i);
            if (s == null || s.isEmpty()) continue;      // **跳过空格子**（与桥路线 query_inventory 一致）
            slots.add(stackJson(i, s));
        }
        m.put("slots", slots);
        int sel = inv.getSelectedSlot();
        m.put("selectedSlot", sel);
        net.minecraft.item.ItemStack main = inv.getSelectedStack();
        m.put("mainHand", (main == null || main.isEmpty()) ? null : stackJson(sel, main));
        java.util.List<Object> hotbar = new java.util.ArrayList<>();
        for (int i = 0; i < 9 && i < size; i++) {
            net.minecraft.item.ItemStack s = inv.getStack(i);
            hotbar.add((s == null || s.isEmpty()) ? emptyStackJson(i) : stackJson(i, s));
        }
        m.put("hotbar", hotbar);
        m.put("idKind", "registryName");
        return Json.of(m);
    }

    /** 单格（非空）→ JSON 片段形状；{@code idKind} 逐字写明口径。 */
    private static Map<String, Object> stackJson(int slot, net.minecraft.item.ItemStack s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("slot", slot);
        m.put("empty", Boolean.FALSE);
        m.put("itemId", net.minecraft.registry.Registries.ITEM.getId(s.getItem()).toString());
        m.put("idKind", "registryName");
        m.put("count", s.getCount());
        return m;
    }

    private static Map<String, Object> emptyStackJson(int slot) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("slot", slot);
        m.put("empty", Boolean.TRUE);
        return m;
    }

    // ==================================================================
    // ⑦ [T19] 点屏幕 / 操作容器 五条（全部**玩家级**：与 bot_* 系列语义分开）
    //   query_slots 读「当前打开界面的槽位」（合成格/熔炉料**不是控件**，query_widgets 读不到）；
    //   click_slot 走客户端交互管理器；click_widget 走界面鼠标点击入口；
    //   use_on / place_block 走原版「使用物品于方块」通路（interactBlock）。
    // 名字**逐一 javap 取证**（yarn 1.21.11+build.6 映射件）：
    //   javap -p net.minecraft.client.gui.screen.ingame.HandledScreen
    //     public T getScreenHandler();
    //   javap -p net.minecraft.screen.ScreenHandler
    //     public final net.minecraft.util.collection.DefaultedList<net.minecraft.screen.slot.Slot> slots;
    //     public final int syncId;  public net.minecraft.screen.ScreenHandlerType<?> getType();
    //   javap -p net.minecraft.screen.slot.Slot
    //     public final int x;  public final int y;  public net.minecraft.item.ItemStack getStack();
    //   javap -p net.minecraft.registry.Registries : public static final Registry<ScreenHandlerType<?>> SCREEN_HANDLER;
    //   javap -p net.minecraft.client.network.ClientPlayerInteractionManager
    //     public net.minecraft.util.ActionResult interactBlock(ClientPlayerEntity, Hand, BlockHitResult);
    //     public void clickSlot(int, int, int, net.minecraft.screen.slot.SlotActionType, PlayerEntity);
    //   javap -p net.minecraft.screen.slot.SlotActionType : PICKUP / QUICK_MOVE / ...
    //   javap -p net.minecraft.client.gui.Element
    //     public default boolean mouseClicked(net.minecraft.client.gui.Click, boolean);
    //   javap -p net.minecraft.client.gui.Click : public Click(double, double, net.minecraft.client.input.MouseInput);
    //   javap -p net.minecraft.client.input.MouseInput : public MouseInput(int, int);
    //   javap -p net.minecraft.util.hit.BlockHitResult : public BlockHitResult(Vec3d, Direction, BlockPos, boolean);
    //   javap -p net.minecraft.block.AbstractBlock\$AbstractBlockState : public boolean isReplaceable();
    //   javap -p net.minecraft.util.math.Vec3d : public final double x,y,z; public double distanceTo(Vec3d);
    //   javap -p net.minecraft.util.math.BlockPos : public BlockPos(int,int,int); public BlockPos offset(Direction);
    //   javap -p net.minecraft.util.math.Direction : public Direction getOpposite();
    //   javap -p net.minecraft.item.ItemStack : public boolean isEmpty(); public int getCount();
    //   javap -p net.minecraft.entity.Entity : public final Vec3d getEyePos(); public double getEyeY();
    // ==================================================================

    /** 本档真实现了这一族 ⇒ 自报支持（见 {@link GameBridge#guiActionCapable}）。 */
    @Override public boolean guiActionCapable() { return true; }

    /** 当前容器菜单的注册名（取不到回 null —— core 会按「表外」兜底并如实标注）。 */
    private static String menuTypeOf(net.minecraft.screen.ScreenHandler sh) {
        try {
            return net.minecraft.registry.Registries.SCREEN_HANDLER.getId(sh.getType()).toString();
        } catch (Throwable t) {
            return null;
        }
    }

    /**
     * 读「当前打开界面」的槽位（**原始事实**：index / x / y / empty / itemId / count）。
     * role 与 playerRange **不在这里算** —— 由 core 的 {@link com.bandd.playtest.core.SlotRoles}
     * 按 menuType+下标补，保证两档逐字同表（也保证这份映射能用纯 JDK 单测钉死）。
     *
     * <p>没有容器界面（含玩家背包没开）⇒ 回 {@code null} ⇒ core 回 {@code NO_SCREEN_OPEN}
     * —— **绝不**假装空列表（「读不到」与「是空的」是两件事）。
     */
    @Override
    public String slotsJson() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null || c.currentScreen == null) return null;
        if (!(c.currentScreen instanceof net.minecraft.client.gui.screen.ingame.HandledScreen<?> hs)) return null;
        net.minecraft.screen.ScreenHandler sh = hs.getScreenHandler();
        if (sh == null) return null;
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("screen", c.currentScreen.getClass().getSimpleName());
        m.put("menuType", menuTypeOf(sh));
        m.put("containerId", sh.syncId);
        java.util.List<Object> slots = new java.util.ArrayList<>();
        for (int i = 0; i < sh.slots.size(); i++) {
            net.minecraft.screen.slot.Slot s = sh.slots.get(i);
            Map<String, Object> e = new LinkedHashMap<>();
            e.put("index", i);
            e.put("x", s.x);          // Slot 自己的坐标（相对容器界面左上角）
            e.put("y", s.y);
            net.minecraft.item.ItemStack st = s.getStack();
            if (st == null || st.isEmpty()) {
                e.put("empty", Boolean.TRUE);
            } else {
                e.put("empty", Boolean.FALSE);
                e.put("itemId", net.minecraft.registry.Registries.ITEM.getId(st.getItem()).toString());
                e.put("count", st.getCount());
            }
            slots.add(e);
        }
        m.put("slots", slots);
        return Json.of(m);
    }

    /** 当前容器界面（不是容器界面 / 没有玩家 ⇒ null）。 */
    private static net.minecraft.screen.ScreenHandler openHandler(MinecraftClient c) {
        if (c == null || c.player == null || c.currentScreen == null) return null;
        if (!(c.currentScreen instanceof net.minecraft.client.gui.screen.ingame.HandledScreen<?> hs)) return null;
        return hs.getScreenHandler();
    }

    /**
     * 点槽位：**走客户端交互管理器**（{@code ClientPlayerInteractionManager#clickSlot}），
     * 语义照原版（button 0/1 = 左/右键的 PICKUP；shift = QUICK_MOVE）。
     * 这一层是**第二道**越界检查（core 已先拦一道）—— 越界不可能静默落成「点了 0 号格」。
     */
    @Override
    public GuiResult clickSlot(int slot, int button, boolean shift) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null || c.interactionManager == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家 / 交互管理器不可用");
        }
        net.minecraft.screen.ScreenHandler sh = openHandler(c);
        if (sh == null) {
            return GuiResult.fail(GuiResult.NO_SCREEN_OPEN,
                    "当前没有打开的容器界面（screen=" + screenName() + "）⇒ 没有槽位可点");
        }
        if (slot < 0 || slot >= sh.slots.size()) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE,
                    "slot=" + slot + " 越界（本档 slotCount=" + sh.slots.size() + "）");
        }
        net.minecraft.screen.slot.SlotActionType type = shift
                ? net.minecraft.screen.slot.SlotActionType.QUICK_MOVE
                : net.minecraft.screen.slot.SlotActionType.PICKUP;
        try {
            c.interactionManager.clickSlot(sh.syncId, slot, button, type, c.player);
        } catch (Throwable t) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE, "clickSlot 抛异常：" + t);
        }
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("containerId", sh.syncId);
        d.put("slotCount", sh.slots.size());
        d.put("screen", c.currentScreen.getClass().getSimpleName());
        d.put("menuType", menuTypeOf(sh));
        return GuiResult.ok(d);
    }

    /**
     * 点控件：**照真实点击的代码路径**敲该控件的中心 —— 调界面的鼠标点击入口
     * （{@code Element#mouseClicked(Click,boolean)}，{@code Screen} 经 {@code ParentElement} 的默认实现
     * 把点击派发给命中的子控件）⇒ 按钮 / 页签 / 滑块都能按。**不是** OS 级按键或鼠标注入。
     */
    @Override
    public GuiResult clickWidget(int index) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.currentScreen == null) {
            return GuiResult.fail(GuiResult.NO_SCREEN_OPEN, "当前没有打开任何界面 ⇒ 没有控件可点");
        }
        java.util.List<Object> els = widgetElements(c.currentScreen);
        if (index < 0 || index >= els.size()) {
            return GuiResult.fail(GuiResult.WIDGET_OUT_OF_RANGE,
                    "index=" + index + " 越界（当前界面控件数=" + els.size() + "）");
        }
        Object el = els.get(index);
        if (el instanceof ClothRef) {
            return GuiResult.fail(GuiResult.WIDGET_NOT_CLICKABLE,
                    "这一项是 Cloth 配置**条目**（不是可点控件）⇒ 不假装点得动");
        }
        if (!(el instanceof net.minecraft.client.gui.widget.ClickableWidget w)) {
            return GuiResult.fail(GuiResult.WIDGET_NOT_CLICKABLE,
                    "这一项不是可点控件：" + (el == null ? "null" : el.getClass().getSimpleName()));
        }
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("type", w.getClass().getSimpleName());
        d.put("text", w.getMessage().getString());
        d.put("x", Integer.valueOf(w.getX()));
        d.put("y", Integer.valueOf(w.getY()));
        d.put("width", Integer.valueOf(w.getWidth()));
        d.put("height", Integer.valueOf(w.getHeight()));
        if (!w.visible || !w.active) {
            return GuiResult.fail(GuiResult.WIDGET_NOT_CLICKABLE,
                    "该控件不可点（visible=" + w.visible + " active=" + w.active + "）：" + w.getMessage().getString(), d);
        }
        double cx = w.getX() + w.getWidth() / 2.0;
        double cy = w.getY() + w.getHeight() / 2.0;
        d.put("centerX", Double.valueOf(cx));
        d.put("centerY", Double.valueOf(cy));
        d.put("clickPath", "Screen.mouseClicked(new Click(cx,cy,MouseInput(0,0)), false)");
        boolean accepted;
        try {
            accepted = c.currentScreen.mouseClicked(
                    new net.minecraft.client.gui.Click(cx, cy, new net.minecraft.client.input.MouseInput(0, 0)),
                    false);
        } catch (Throwable t) {
            return GuiResult.fail(GuiResult.WIDGET_CLICK_REJECTED, "界面的鼠标入口抛异常：" + t, d);
        }
        d.put("accepted", Boolean.valueOf(accepted));
        if (!accepted) {
            return GuiResult.fail(GuiResult.WIDGET_CLICK_REJECTED,
                    "点击发出去了但控件没收（mouseClicked 回 false）—— 如实报失败，不当成功", d);
        }
        return GuiResult.ok(d);
    }

    /** 把玩家朝向对准一个世界坐标点（与既有 aimAt 系列同一口径）。 */
    private static void aimAt(MinecraftClient c, double tx, double ty, double tz) {
        double dx = tx - c.player.getX();
        double dy = ty - c.player.getEyeY();
        double dz = tz - c.player.getZ();
        double horiz = Math.sqrt(dx * dx + dz * dz);
        c.player.setYaw((float) Math.toDegrees(Math.atan2(-dx, dz)));
        c.player.setPitch((float) -Math.toDegrees(Math.atan2(dy, horiz)));
    }

    /** 触及距离（与既有 mine/mineLookingAt 同口径）：创造 5.0 / 生存 4.5。 */
    private static double reachOf(MinecraftClient c) {
        return c.player.isCreative() ? 5.0D : 4.5D;
    }

    /**
     * 玩家朝目标方块**右键**（{@code use_on}）：先对准，再走 {@code interactBlock} 这条原版通路。
     * 用于开工作台 / 熔炉 / 箱子，以及按方块上的按钮。
     */
    @Override
    public GuiResult useOn(double x, double y, double z) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null || c.world == null || c.interactionManager == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家/世界（或交互管理器不可用）");
        }
        net.minecraft.util.math.BlockPos pos = new net.minecraft.util.math.BlockPos(
                (int) Math.floor(x), (int) Math.floor(y), (int) Math.floor(z));
        if (!c.world.isChunkLoaded(pos.getX() >> 4, pos.getZ() >> 4)) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "目标区块未加载：" + pos.toShortString() + " ⇒ 不假装点到了");
        }
        net.minecraft.util.math.Vec3d eye = c.player.getEyePos();
        net.minecraft.util.math.Vec3d center = new net.minecraft.util.math.Vec3d(
                pos.getX() + 0.5, pos.getY() + 0.5, pos.getZ() + 0.5);
        double dist = eye.distanceTo(center);
        double reach = reachOf(c);
        if (dist > reach + 0.5D) {
            return GuiResult.fail(GuiResult.TARGET_TOO_FAR,
                    "够不着：" + pos.toShortString() + " 距眼睛 " + round2(dist) + " > 触及 " + reach);
        }
        // 入射面 = 从眼睛看过去最正的那一面；命中点取该面中心（不用任何未取证的方向向量 API）
        double ox = eye.x - center.x, oy = eye.y - center.y, oz = eye.z - center.z;
        double ax = Math.abs(ox), ay = Math.abs(oy), az = Math.abs(oz);
        net.minecraft.util.math.Direction side;
        double hx = center.x, hy = center.y, hz = center.z;
        if (ax >= ay && ax >= az) {
            side = ox >= 0 ? net.minecraft.util.math.Direction.EAST : net.minecraft.util.math.Direction.WEST;
            hx += ox >= 0 ? 0.5D : -0.5D;
        } else if (ay >= az) {
            side = oy >= 0 ? net.minecraft.util.math.Direction.UP : net.minecraft.util.math.Direction.DOWN;
            hy += oy >= 0 ? 0.5D : -0.5D;
        } else {
            side = oz >= 0 ? net.minecraft.util.math.Direction.SOUTH : net.minecraft.util.math.Direction.NORTH;
            hz += oz >= 0 ? 0.5D : -0.5D;
        }
        aimAt(c, center.x, center.y, center.z);
        net.minecraft.util.hit.BlockHitResult bhr = new net.minecraft.util.hit.BlockHitResult(
                new net.minecraft.util.math.Vec3d(hx, hy, hz), side, pos, false);
        net.minecraft.util.ActionResult res;
        try {
            res = c.interactionManager.interactBlock(c.player, net.minecraft.util.Hand.MAIN_HAND, bhr);
        } catch (Throwable t) {
            return GuiResult.fail(GuiResult.USE_FAILED, "交互通路抛异常：" + t);
        }
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("target", pos.toShortString());
        d.put("side", side.name());
        d.put("distance", Double.valueOf(round2(dist)));
        d.put("hit", round2(hx) + "," + round2(hy) + "," + round2(hz));
        d.put("result", String.valueOf(res));
        d.put("screen", screenName());
        if (res == null || !res.isAccepted()) {
            return GuiResult.fail(GuiResult.USE_FAILED,
                    "游戏没受理这次右键（ActionResult 不是 accepted）：" + pos.toShortString(), d);
        }
        return GuiResult.ok(d);
    }

    /**
     * 玩家在目标位置**放置手持方块**（{@code place_block}）。
     *
     * <p>做法照原版：目标格必须**可替换**（否则 TARGET_NOT_PLACEABLE）、主手必须有东西
     * （否则 NO_ITEM_IN_HAND）；然后在目标格周围找一个**支撑面**，构造该面的
     * {@code BlockHitResult}（点中的是**支撑格**，面朝目标格 —— 原版就是这么把方块放到
     * 「点中面的外一格」），对准后走与 use_on 同一条 {@code interactBlock} 通路。
     */
    @Override
    public GuiResult placeBlock(double x, double y, double z) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null || c.world == null || c.interactionManager == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家/世界（或交互管理器不可用）");
        }
        net.minecraft.item.ItemStack held = c.player.getMainHandStack();
        if (held == null || held.isEmpty()) {
            return GuiResult.fail(GuiResult.NO_ITEM_IN_HAND,
                    "主手上没有东西 ⇒ 放不了方块（先把方块选到快捷栏主手）");
        }
        net.minecraft.util.math.BlockPos target = new net.minecraft.util.math.BlockPos(
                (int) Math.floor(x), (int) Math.floor(y), (int) Math.floor(z));
        if (!c.world.isChunkLoaded(target.getX() >> 4, target.getZ() >> 4)) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "目标区块未加载：" + target.toShortString());
        }
        net.minecraft.block.BlockState cur = c.world.getBlockState(target);
        if (!cur.isReplaceable()) {
            return GuiResult.fail(GuiResult.TARGET_NOT_PLACEABLE,
                    "目标位置已被不可替换的方块占住（"
                            + net.minecraft.registry.Registries.BLOCK.getId(cur.getBlock()) + "）："
                            + target.toShortString());
        }
        net.minecraft.util.math.Direction side = null;
        net.minecraft.util.math.BlockPos support = null;
        for (net.minecraft.util.math.Direction d : net.minecraft.util.math.Direction.values()) {
            net.minecraft.util.math.BlockPos nb = target.offset(d);
            if (nb.equals(target)) continue;
            if (!c.world.isChunkLoaded(nb.getX() >> 4, nb.getZ() >> 4)) continue;
            if (c.world.getBlockState(nb).isReplaceable()) continue;
            support = nb;
            side = d.getOpposite();
            break;
        }
        if (support == null || side == null) {
            return GuiResult.fail(GuiResult.TARGET_NOT_PLACEABLE,
                    "目标格六个邻面都没有可依托的支撑方块 ⇒ 悬空放不了（先给个支撑面）");
        }
        // 命中点 = 支撑格中心与目标格中心的**中点**（= 两个方块中间那个面）
        double hx = (support.getX() + target.getX() + 1) / 2.0;
        double hy = (support.getY() + target.getY() + 1) / 2.0;
        double hz = (support.getZ() + target.getZ() + 1) / 2.0;
        double dx = hx - c.player.getX(), dy = hy - c.player.getEyeY(), dz = hz - c.player.getZ();
        double dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        double reach = reachOf(c);
        if (dist > reach + 0.5D) {
            return GuiResult.fail(GuiResult.TARGET_TOO_FAR,
                    "够不着：" + target.toShortString() + " 距眼睛 " + round2(dist) + " > 触及 " + reach);
        }
        aimAt(c, hx, hy, hz);
        net.minecraft.util.hit.BlockHitResult bhr = new net.minecraft.util.hit.BlockHitResult(
                new net.minecraft.util.math.Vec3d(hx, hy, hz), side, support, false);
        net.minecraft.util.ActionResult res;
        try {
            res = c.interactionManager.interactBlock(c.player, net.minecraft.util.Hand.MAIN_HAND, bhr);
        } catch (Throwable t) {
            return GuiResult.fail(GuiResult.PLACE_FAILED, "放置通路抛异常：" + t);
        }
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("support", support.toShortString());
        d.put("side", side.name());
        d.put("held", net.minecraft.registry.Registries.ITEM.getId(held.getItem()).toString());
        d.put("heldCount", Integer.valueOf(held.getCount()));
        d.put("distance", Double.valueOf(round2(dist)));
        d.put("result", String.valueOf(res));
        if (res == null || !res.isAccepted()) {
            return GuiResult.fail(GuiResult.PLACE_FAILED,
                    "放置没被游戏受理（ActionResult 不是 accepted）：" + target.toShortString(), d);
        }
        d.put("placed", target.toShortString());
        return GuiResult.ok(d);
    }

    // ==================================================================
    // ⑧ [T22] select_slot / drop_item / playerMetaJson
    // 名字**逐一 javap 取证**（jar = F:\MOD_TEST\caches\fabric-loom\minecraftMaven\net\minecraft\
    //   minecraft-merged\1.21.11-net.fabricmc.yarn.1_21_11.1.21.11+build.6-v2\
    //   minecraft-merged-1.21.11-net.fabricmc.yarn.1_21_11.1.21.11+build.6-v2.jar）：
    //   javap -p net.minecraft.entity.player.PlayerInventory
    //     public int getSelectedSlot();  public void setSelectedSlot(int);
    //     public net.minecraft.item.ItemStack getSelectedStack();  public int size();
    //     public net.minecraft.item.ItemStack getStack(int);
    //   javap -p net.minecraft.screen.slot.Slot
    //     public final net.minecraft.inventory.Inventory inventory;   public int getIndex();
    //   javap -p net.minecraft.screen.slot.SlotActionType : THROW
    //   javap -p net.minecraft.client.network.ClientPlayerInteractionManager
    //     public void clickSlot(int, int, int, net.minecraft.screen.slot.SlotActionType,
    //                           net.minecraft.entity.player.PlayerEntity);
    //     public net.minecraft.world.GameMode getCurrentGameMode();
    //   javap -p net.minecraft.entity.player.PlayerEntity : public final net.minecraft.screen.PlayerScreenHandler playerScreenHandler;
    //   javap -p net.minecraft.entity.player.PlayerAbilities : public boolean flying; public boolean allowFlying;
    //   javap -p net.minecraft.server.PlayerManager : public boolean areCheatsAllowed();
    //   javap -p net.minecraft.world.GameMode : public java.lang.String getId();
    // ==================================================================

    /**
     * [T22] {@code select_slot}：把选中快捷栏槽位切到 {@code slot}（0..8）。
     * 走本档 {@code PlayerInventory#setSelectedSlot}（字段名/方法名与 neoforge **不同源**：那边是
     * {@code Inventory.selected} 公开字段 + {@code getSelected()}）。
     * {@code selectedSlot} 是**切换后复读**的值；{@code mainHand} 是切换后主手那格。
     */
    @Override
    public GuiResult selectSlot(int slot) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家 ⇒ 切不了选中槽");
        }
        net.minecraft.entity.player.PlayerInventory inv = c.player.getInventory();
        if (inv == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有物品栏 ⇒ 切不了选中槽");
        }
        if (slot < 0 || slot > 8) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE, "slot=" + slot + " 越界（快捷栏 0..8）");
        }
        int prev = inv.getSelectedSlot();
        inv.setSelectedSlot(slot);
        int now = inv.getSelectedSlot();
        net.minecraft.item.ItemStack main = inv.getSelectedStack();
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("previousSlot", Integer.valueOf(prev));
        d.put("selectedSlot", Integer.valueOf(now));
        d.put("mainHand", (main == null || main.isEmpty()) ? null : stackJson(now, main));
        d.put("previousChanged", Boolean.valueOf(prev != now));
        d.put("note", "走本档 PlayerInventory#setSelectedSlot；selectedSlot 是切换后**复读**的值");
        return GuiResult.ok(d);
    }

    // ==================================================================
    // ⑨ [T39-①] select_slot 的**服务端同步**
    //
    // 取证（jar = F:\MOD_TEST\caches\fabric-loom\minecraftMaven\net\minecraft\minecraft-merged\
    //        1.21.11-net.fabricmc.yarn.1_21_11.1.21.11+build.6-v2\...jar）：
    //   javap -p net.minecraft.network.packet.c2s.play.UpdateSelectedSlotC2SPacket
    //     public UpdateSelectedSlotC2SPacket(int);        ← 构造器只吃一个 int
    //     public int getSelectedSlot();
    //   javap -p net.minecraft.client.network.ClientCommonNetworkHandler
    //     public void sendPacket(net.minecraft.network.packet.Packet<?>);    ← 发包口
    //   javap -p net.minecraft.client.MinecraftClient
    //     public net.minecraft.client.network.ClientPlayNetworkHandler getNetworkHandler();
    //   javap -p -c net.minecraft.client.network.ClientPlayerInteractionManager
    //     private void syncSelectedSlot();
    //       ... PlayerInventory.getSelectedSlot:()I ... istore_1
    //           if_icmpeq 45                         ← 与 lastSelectedSlot 比
    //           putfield lastSelectedSlot:I          ← 先记下
    //           new UpdateSelectedSlotC2SPacket / dup / getfield lastSelectedSlot / <init>(I)
    //           invokevirtual ClientPlayNetworkHandler.sendPacket(Packet)   ← 原版就走这一条
    //     （字节码偏移 0-45）
    //   javap -p -c net.minecraft.client.MinecraftClient  (handleInputEvents 内)
    //     243: invokevirtual PlayerInventory.setSelectedSlot:(I)V   ← 数字键那条路只改字段
    //   ⇒ 数字键那条路**只改字段不发包**；发包是 syncSelectedSlot 的活。
    //     我们做 syncSelectedSlot 那一件事（+ 强制发一次，不比对 lastSelectedSlot）。
    // ==================================================================

    @Override public boolean slotSyncCapable() { return true; }

    @Override
    public GuiResult setSelectedSlotSynced(int slot) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家 ⇒ 切不了选中槽");
        }
        net.minecraft.entity.player.PlayerInventory inv = c.player.getInventory();
        if (inv == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有物品栏 ⇒ 切不了选中槽");
        }
        if (slot < 0 || slot > 8) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE, "slot=" + slot + " 越界（快捷栏 0..8）");
        }
        int prev = inv.getSelectedSlot();
        inv.setSelectedSlot(slot);                 // ① 客户端字段（原版数字键那条路也这么改）
        int now = inv.getSelectedSlot();
        net.minecraft.item.ItemStack main = inv.getSelectedStack();
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("previousSlot", Integer.valueOf(prev));
        d.put("selectedSlot", Integer.valueOf(now));
        d.put("mainHand", (main == null || main.isEmpty()) ? null : stackJson(now, main));
        d.put("previousChanged", Boolean.valueOf(prev != now));
        d.put("syncRoute", "UpdateSelectedSlotC2SPacket -> ClientPlayNetworkHandler.sendPacket(Packet)");
        d.put("syncRouteNote", "与原版 ClientPlayerInteractionManager#syncSelectedSlot 同源同路"
                + "（javap -c 偏移 0-45）；差别只有：我们**不比对** lastSelectedSlot，强制发一次");

        // ② 服务端同步：没有连接就如实说没发
        net.minecraft.client.network.ClientPlayNetworkHandler nh = c.getNetworkHandler();
        if (nh == null) {
            d.put("packetSent", Boolean.FALSE);
            d.put("packetClass", null);
            d.put("packetSendError", "mc.getNetworkHandler() == null（还没进世界 / 单人菜单）");
            return GuiResult.ok(d);
        }
        try {
            nh.sendPacket(new net.minecraft.network.packet.c2s.play.UpdateSelectedSlotC2SPacket(now));
            d.put("packetSent", Boolean.TRUE);
            d.put("packetClass", "UpdateSelectedSlotC2SPacket");
            d.put("packetSlot", Integer.valueOf(now));
        } catch (Throwable t) {
            d.put("packetSent", Boolean.FALSE);
            d.put("packetClass", "UpdateSelectedSlotC2SPacket");
            d.put("packetSendError", String.valueOf(t));
        }
        return GuiResult.ok(d);
    }

    // ==================================================================
    // ⑩ [T39-②③] walk_to 的移动面（**只写游戏自己的输入结构**）
    //
    // 取证（同上 jar）：
    //   javap -p net.minecraft.client.input.Input
    //     public net.minecraft.util.PlayerInput playerInput;     ← public 字段（1.21.11 起是 record）
    //     protected net.minecraft.util.math.Vec2f movementVector;
    //     public void tick();                                   ← **空实现**
    //     public net.minecraft.util.math.Vec2f getMovementInput();
    //   [T41 修正] 取证（javap -c -p，minecraft-merged-1.21.11-net.fabricmc.yarn.1_21_11.1.21.11+build.6-v2）：
    //   ClientPlayerEntity.input 运行时是 KeyboardInput，每 tick 在 tickMovement() 先调 KeyboardInput#tick()：
    //     1) 用 settings.forwardKey/backKey/leftKey/rightKey/jumpKey/sneakKey/sprintKey.isPressed() 重建 playerInput；
    //     2) 用 getMovementMultiplier(left, right)（left=+1, right=-1）与 (forward, backward) 重算 movementVector。
    //   因此在 END_CLIENT_TICK 直接改 in.playerInput 会在下一 tick 被覆写（与 1.20.1 同根因）。
    //   修复：直接驱动 c.options.forwardKey/backKey/leftKey/rightKey/jumpKey.setPressed(boolean)
    //   （javap -c KeyBinding#setPressed = putfield pressed:Z；isPressed = getfield pressed:Z），
    //   记账式释放（walkHeld[5]），且由 PlaytestCore 与 Arbitration.owned 同步，避免 AUTO 自让位。
    // ==================================================================

    private static final String[] WALK_KEYS = { "forward", "back", "left", "right", "jump" };
    private final boolean[] walkHeld = new boolean[5];

    private void syncWalkHeldReleased(String key) {
        for (int i = 0; i < WALK_KEYS.length; i++) {
            if (WALK_KEYS[i].equals(key)) {
                walkHeld[i] = false;
                return;
            }
        }
    }

    @Override public boolean walkCapable() { return true; }

    @Override
    public boolean walkDrive(float forward, float strafe, boolean jump, float yaw) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null || c.options == null) return false;
        // 界面开着时按键不会驱动移动 ⇒ 明确返回 false，不假装在走
        if (c.currentScreen != null) return false;
        ClientPlayerEntity p = c.player;
        boolean[] want = {
            forward > 0.05f,
            forward < -0.05f,
            strafe > 0.05f,
            strafe < -0.05f,
            jump
        };
        KeyBinding[] keys = {
            c.options.forwardKey,
            c.options.backKey,
            c.options.leftKey,
            c.options.rightKey,
            c.options.jumpKey
        };
        for (int i = 0; i < keys.length; i++) {
            if (keys[i] == null) continue;
            if (want[i]) {
                keys[i].setPressed(true);
                walkHeld[i] = true;
            } else if (walkHeld[i]) {
                keys[i].setPressed(false);
                walkHeld[i] = false;
            }
        }
        if (!Float.isNaN(yaw)) {
            p.setYaw(yaw);
        }
        return true;
    }

    @Override
    public void walkStop() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.options == null) {
            java.util.Arrays.fill(walkHeld, false);
            return;
        }
        KeyBinding[] keys = {
            c.options.forwardKey,
            c.options.backKey,
            c.options.leftKey,
            c.options.rightKey,
            c.options.jumpKey
        };
        for (int i = 0; i < keys.length; i++) {
            if (walkHeld[i] && keys[i] != null) {
                keys[i].setPressed(false);
            }
            walkHeld[i] = false;
        }
    }

    @Override
    public Boolean playerOnGround() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null) return null;
        return Boolean.valueOf(c.player.isOnGround());
    }

    /**
     * [T22] {@code drop_item}：丢物品栏 {@code slot}（= {@code query_inventory} 的下标空间；
     * &lt;0 ⇒ 当前选中槽）。走与 {@code click_slot} **同一条**客户端交互管理器通路，用原版
     * {@code SlotActionType.THROW}（button 0=丢一个、1=丢整叠）。
     *
     * <p>[T35] **目标菜单 = {@code player.currentScreenHandler}**（不再在无屏时改用
     * {@code player.playerScreenHandler}）—— 理由见方法体内注释：原版点击的判据就是
     * {@code player.currentScreenHandler.syncId}，用别的菜单会**被静默丢弃**。
     * 目标格按 **Slot 的容器同一性 + getIndex()** 找（不靠版式 / 槽号硬编码 ⇒ armour/offhand 与
     * 版本差异都不用猜）。回执里的 {@code verified} 一律 false（真实的落地判据由 core 在 ≥5 tick
     * 后复读该格给出）。
     */
    @Override
    public GuiResult dropItem(int slot, int count, boolean all) {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null || c.interactionManager == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家 / 交互管理器不可用");
        }
        net.minecraft.entity.player.PlayerInventory inv = c.player.getInventory();
        if (inv == null) return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有物品栏");
        int size = inv.size();
        if (slot < 0) slot = inv.getSelectedSlot();
        if (slot < 0 || slot >= size) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE,
                    "slot=" + slot + " 越界（本档物品栏 size=" + size + "）");
        }
        // [T35] **必须**用客户端**当前真正打开的那个菜单**（player.currentScreenHandler）——
        // 因为 ClientPlayerInteractionManager#clickSlot 的判据就是
        //   if (syncId != player.currentScreenHandler.syncId) { LOGGER.warn("Ignoring click in
        //     mismatching container..."); return; }  else { screenHandler.onSlotClick(...); send(...) }
        // 不等时**只记一条 WARN 就 return**（CFR 反编译 1.21.11 yarn 件，ClientPlayerInteractionManager
        // .java:489-511，守卫在 :491-493）。旧写法在没开容器界面时改用 player.playerScreenHandler：
        // close_screen 只 mc.setScreen(null)（不走 HandledScreen#onClose ⇒ 不发关闭包、不重置
        // currentScreenHandler）⇒ currentScreenHandler 可能仍是上一个容器对象，两个 syncId 不相等
        // ⇒ 点击被静默丢弃，而旧回执照报成功（neoforge 1.20.1 真机 L4 2026-11-12 铁证；本档同一份 core、
        // 同一套原版判据 ⇒ 同一病）。改用 currentScreenHandler 后 sh 与判据**同源** ⇒ 不可能再错配。
        net.minecraft.screen.ScreenHandler sh = c.player.currentScreenHandler;
        if (sh == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD,
                    "没有可用的物品栏菜单（player.currentScreenHandler=null）");
        }
        int menuSlot = -1;
        for (int i = 0; i < sh.slots.size(); i++) {
            net.minecraft.screen.slot.Slot s = sh.slots.get(i);
            if (s.inventory == inv && s.getIndex() == slot) { menuSlot = i; break; }
        }
        if (menuSlot < 0) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE,
                    "slot=" + slot + " 在**当前菜单**里找不到对应的格子（开着容器时 armour/offhand 不在该菜单）"
                            + " ⇒ 先 press inventory / use_on 打开含该格的菜单，或换菜单里确实有的下标");
        }
        net.minecraft.item.ItemStack before = sh.slots.get(menuSlot).getStack();
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("slot", Integer.valueOf(slot));
        d.put("menuSlot", Integer.valueOf(menuSlot));
        d.put("containerId", Integer.valueOf(sh.syncId));       // [T35] 实际被点的那个菜单 id（诊断用）
        d.put("menuSource", "player.currentScreenHandler");     // [T35] 与 clickSlot 的判据同源
        if (before == null || before.isEmpty()) {
            d.put("count", Integer.valueOf(0));
            d.put("empty", Boolean.TRUE);
            d.put("remaining", Integer.valueOf(0));
            d.put("id", null);
            d.put("droppedId", null);
            d.put("note", "该格**本来就是空的** ⇒ 没丢任何东西（empty=true / count=0，不是错误）");
            return GuiResult.ok(d);
        }
        String droppedId = net.minecraft.registry.Registries.ITEM.getId(before.getItem()).toString();
        int stackCount = before.getCount();
        // [T36] **必须在点击前**记下数量：原版对「部分丢弃」走 ItemStack.split → decrement，
        // 那是**就地改同一个 ItemStack 对象**（slot 里还是同一个引用）⇒ 点击后再读 before.getCount()
        // 读到的已经是改小之后的值，比对会永远相等、校验永远通过（这条是落地校验成立的前提）。
        int beforeCount = stackCount;
        int want = (all || count < 0) ? stackCount : Math.min(count, stackCount);
        boolean whole = want >= stackCount;
        int button = whole ? 1 : 0;             // 原版 THROW：0=丢一个，1=丢整叠
        try {
            if (whole) {
                c.interactionManager.clickSlot(sh.syncId, menuSlot, button,
                        net.minecraft.screen.slot.SlotActionType.THROW, c.player);
            } else {
                // 原版只有「丢一个 / 丢整叠」两档 ⇒ 中间的 count 只能连点「丢一个」。
                for (int k = 0; k < want; k++) {
                    c.interactionManager.clickSlot(sh.syncId, menuSlot, 0,
                            net.minecraft.screen.slot.SlotActionType.THROW, c.player);
                }
            }
        } catch (Throwable t) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE, "THROW 点击抛异常：" + t);
        }
        net.minecraft.item.ItemStack after = sh.slots.get(menuSlot).getStack();
        int afterCount = (after == null || after.isEmpty()) ? 0 : after.getCount();  // [T36] 同一 tick 复读
        // 注意：before 是**同一个** ItemStack 引用，部分丢弃时它被就地 decrement 过
        // ⇒ 数量已在点击前存进 beforeCount（见上），这里绝不能再读 before.getCount()。
        boolean empty = after == null || after.isEmpty();
        // [T36] **落地校验（同 tick）**：原版客户端 THROW 分支在 clickSlot 里**同步**调
        // screenHandler.onSlotClick(...) —— 也就是先把**本地栈**改掉、再把包发给服务端。所以点击返回之后
        // 立刻复读该格，读到的是「本地已落地」的真值：一格都没少 ⇒ 这一击根本没落到菜单上。
        // 因此**不需要**跨 tick 状态机：跨 tick 会引入「等几 tick / 超时算谁」的一整套复杂度，
        // 而本地栈是同步改的，同 tick 复读本身就是有效判据（服务端拒绝只是额外一层，稍后体现为回滚）。
        int delta = beforeCount - afterCount;          // 实际少掉的数量
        d.put("before", Integer.valueOf(beforeCount));
        d.put("after", Integer.valueOf(afterCount));
        d.put("dropped", Integer.valueOf(delta));      // [T36] 实际少掉多少（!= count 时就是部分落地）
        d.put("count", Integer.valueOf(want));
        d.put("empty", Boolean.valueOf(empty));
        d.put("remaining", Integer.valueOf(empty ? 0 : after.getCount()));
        d.put("id", empty ? null : net.minecraft.registry.Registries.ITEM.getId(after.getItem()).toString());
        d.put("droppedId", droppedId);        // 本次丢掉的物品 id（id=丢后剩余；两者分开，别混）
        d.put("idKind", "registryName");
        d.put("button", Integer.valueOf(button));
        d.put("note", whole
                ? "THROW button=1（原版丢整叠）"
                : (want == 1 ? "THROW button=0（原版丢一个）"
                        : "THROW button=0 连点 " + want + " 次（原版只有丢一个/整叠两档）"));
        if (want > 0 && delta <= 0) {
            // [T36] **fail-loud**：请求丢 ≥1 个，而这一格**一个都没少** ⇒ 点击没落地。
            // 用**数量**判而不是用「栈对象换没换」判：堆叠被拆/整叠清空都只是数量变化，
            // 而空/非空翻转在「丢 0 个」时也会发生，容易误判。
            return GuiResult.fail(GuiResult.DROP_ITEM_NOT_APPLIED,
                    "这一击**没落地**：请求丢 " + want + " 个，但点击后该格仍是 " + beforeCount
                            + " 个（一个都没少）。"
                            + "两条最可能的原因：① 菜单 id 不匹配 —— 原版 clickSlot 发现"
                            + " syncId 与会话里的不一致时**只记一条 WARN 就丢掉这一击**；"
                            + "② 服务端拒绝（容器只读 / 该格被服务端锁住 / 权限不足）。"
                            + "下一步：先 press inventory 或 use_on 把菜单**重新打开**（菜单对象与 id 一起刷新），"
                            + "再丢；若仍不落地，换菜单里确实有的 slot。"
                            + "诊断：slot=" + slot + " menuSlot=" + menuSlot + " containerId=" + sh.syncId
                            + " menuSource=player.currentScreenHandler before=" + beforeCount
                            + " after=" + afterCount, d);
        }
        if (want > 0 && delta < want) {
            // [T36] **部分落地**：少了，但没少够。**不算失败**（东西确实丢了，判失败会误导调用方去重试，
            // 而重试会多丢），但也**绝不写成完全成功**：count 按实际少掉的数量如实回填，
            // 另带 requestedCount / partial=true / note 说明原版只有两档、中间值靠连点。
            d.put("count", Integer.valueOf(delta));
            d.put("requestedCount", Integer.valueOf(want));
            d.put("partial", Boolean.TRUE);
            d.put("note", "**部分落地**：请求丢 " + want + " 个，实际只少了 " + delta + " 个。"
                    + "原版 THROW 只有「丢一个(button=0) / 丢整叠(button=1)」两档，"
                    + "中间的 count 是靠连点「丢一个」凑的 —— 连点中有一击没落地就会少丢。"
                    + "想要精确数量请按差值再丢一次（count=" + (want - delta) + "）。");
        }
        return GuiResult.ok(d);
    }

    /**
     * [T22] 玩家模式 / 能力自报（{@code query_player_state} 的 gameMode/flying/canFly/cheats）。
     * 只喂那一条动作（不并进 playerStateJson ⇒ 不动 query_state / query_map 的回执形状）。
     */
    @Override
    public String playerMetaJson() {
        MinecraftClient c = MinecraftClient.getInstance();
        if (c == null || c.player == null) return null;
        Map<String, Object> m = new LinkedHashMap<>();
        String gm = null;
        if (c.interactionManager != null) {
            net.minecraft.world.GameMode g = c.interactionManager.getCurrentGameMode();
            if (g != null) gm = g.getId();       // 原版枚举 id（survival/creative/adventure/spectator）
        }
        m.put("gameMode", gm);
        m.put("flying", Boolean.valueOf(c.player.getAbilities().flying));
        m.put("canFly", Boolean.valueOf(c.player.getAbilities().allowFlying));
        Boolean cheats = null;                   // 多人服拿不到 ⇒ null（不编）
        if (c.isIntegratedServerRunning()) {
            net.minecraft.server.integrated.IntegratedServer s = c.getServer();
            if (s != null && s.getPlayerManager() != null) {
                cheats = Boolean.valueOf(s.getPlayerManager().areCheatsAllowed());
            }
        }
        m.put("cheats", cheats);
        m.put("note", "gameMode 取自 ClientPlayerInteractionManager#getCurrentGameMode（原版枚举 id）；"
                + "flying/canFly 取自 PlayerAbilities.flying/allowFlying；"
                + "cheats = 本机集成服务器 PlayerManager#areCheatsAllowed（多人服拿不到 ⇒ null）");
        return Json.of(m);
    }

    private static String round2(double v) {
        return String.valueOf(Math.round(v * 100.0) / 100.0);
    }
}
