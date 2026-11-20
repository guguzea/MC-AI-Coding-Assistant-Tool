package com.bandd.playtest.neoforge1201;

import com.bandd.playtest.core.CommandResult;
import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.GuiResult;
import com.bandd.playtest.core.Json;
import net.minecraft.client.Minecraft;
import net.minecraft.client.Screenshot;
import net.minecraft.client.gui.screens.ConnectScreen;
import net.minecraft.client.gui.screens.LevelLoadingScreen;
import net.minecraft.client.gui.screens.ReceivingLevelScreen;
import net.minecraft.client.player.LocalPlayer;
import net.minecraft.client.server.IntegratedServer;

import java.io.File;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * NeoForge 1.20.1 适配层（= Forge 兼容层，**net.minecraftforge 包名**）。与 1.20.4 档的差异只有进世界入口一处。
 *
 * 名字来源（逐条 javap 实测，非记忆）：javap neoforge-20.4.251-merged.jar(2026-11-01): ResourceKey.location() / TicketType.PLAYER / ServerChunkCache.addRegionTicket / Registry.get(ResourceLocation) / ConnectScreen.startConnecting 5 参 / WorldOpenFlows.checkForBackupAndLoad / Minecraft.screen 字段 / Screenshot.grab(File,RenderTarget,Consumer); @Mod 只有 value()（fancymodloader loader-2.0.17）
 *
 * 与 1.21.11 档的差异（本档取值 → 1.21.11 取值）：
 *   id 类 ResourceLocation → Identifier ｜ 注册表取值 Registry.get(id) → getValue(Identifier)
 *   ResourceKey.location() → identifier() ｜ 区块票据 TicketType.PLAYER → PLAYER_LOADING
 *   票据 API addRegionTicket/removeRegionTicket → addTicketWithRadius ｜ 进世界 WorldOpenFlows.checkForBackupAndLoad → openWorld
 *   截图 grab(File,RenderTarget,Consumer) → Screenshot.grab(Minecraft,boolean) ｜ 当前界面 mc.screen → mc.gui.screen()
 *   客户端/服务端 tick TickEvent + phase → ClientTickEvent.Post / ServerTickEvent.Post
 */
public final class NeoForgeAdapter implements GameBridge {

    private static final List<String> KEYS = Arrays.asList(
            "forward", "back", "left", "right", "jump", "sneak", "sprint", "attack", "use", "inventory");

    @Override
    public String platform() { return "neoforge"; }

    @Override
    public String mcVersion() { return "1.20.1"; }

    // ---- 设置页面自报（core 的 /status → settings 段读这三个）----
    // 本档 = Forge 47 兼容层，注册点走 Forge 的 ConfigScreenHandler.ConfigScreenFactory
    // （Cloth 没有 1.20.1 的原生 neoforge 件，只能用 forge 12.0.109 件；**未实测加载**）。
    @Override
    public boolean configGuiAvailable() { return true; }

    @Override
    public String configGuiProvider() { return "cloth-config 12.0.109 (forge 件, Forge 47 兼容层)"; }

    @Override
    public String configGuiOpenHint() {
        return "Mods 列表 → bandd_playtest → Config（Forge 自带按钮，不需要任何第三方模组）；"
                + "或在聊天栏输入 !settings";
    }

    /**
     * **打开游戏内设置页面**（{@code open_settings} 的落点；Cloth Config）。
     *
     * <p>**复用已有的打开路径** —— {@code PlaytestMod.openSettingsScreen(parent)} 正是
     * {@code ConfigScreenHandler.ConfigScreenFactory}（Forge 自带的 Mods 列表按钮）与聊天栏
     * {@code !settings} 调用的同一个工厂，这里不另造第三条路。
     *
     * <p>诚实边界：未初始化或页面构建抛异常时那个工厂**原样返回 parent** ⇒ 这里返回 null
     * ⇒ core 回 {@code SETTINGS_GUI_UNSUPPORTED}，**不假装打开**。
     */
    @Override
    public String openSettingsScreen() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return null;
        net.minecraft.client.gui.screens.Screen parent = mc.screen;
        net.minecraft.client.gui.screens.Screen s = com.bandd.playtest.PlaytestMod.openSettingsScreen(parent);
        if (s == null || s == parent) return null;
        mc.setScreen(s);
        return s.getClass().getSimpleName();
    }

    @Override
    public boolean ready() {
        Minecraft mc = Minecraft.getInstance();
        return mc != null && mc.player != null && mc.level != null;
    }

    /**
     * 本机客户端当前阶段。**判据全部 javap 取证**（jar = forge-1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1）：
     * <pre>
     *   javap -p net.minecraft.client.Minecraft
     *     public net.minecraft.client.multiplayer.ClientLevel level;      // 字段
     *     public net.minecraft.client.player.LocalPlayer player;          // 字段
     *     public net.minecraft.client.gui.screens.Screen screen;          // 字段
     *     public boolean hasSingleplayerServer();
     *   javap -c Minecraft#hasSingleplayerServer():
     *     getfield isLocalServer:Z; ifeq -> false; getfield singleplayerServer:L...IntegratedServer; ifnull -> false
     *     ⇒ hasSingleplayerServer() = isLocalServer && singleplayerServer != null
     *   javap -c Minecraft#isLocalServer(): getfield isLocalServer:Z; ireturn   （doWorldLoad 里置 true，clearLevel 里置 false）
     * </pre>
     * 连接期界面（都是 public 类）：
     *   ConnectScreen        —— ConnectScreen.startConnecting(...) 里 mc.setScreen(connectScreen)
     *   ReceivingLevelScreen —— ClientPacketListener 登录成功后 new ReceivingLevelScreen() + mc.setScreen(...)
     *   LevelLoadingScreen   —— 单机读档期间
     *
     * ⚠ **不用 getConnection() 当判据**：javap -c Minecraft#getConnection() 证明它等价于
     *   `player == null ? null : player.connection` —— 单人世界里 player.connection 同样非 null
     *   ⇒ 区分不了单机/多人（和 ready 是同一个坑）。
     */
    @Override
    public String clientPhase() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return null;
        if (mc.level != null) {
            // 在某个世界里：有本机集成服务器 = 自己的单人/局域网世界；否则 = 连到别人的服务器
            return mc.hasSingleplayerServer() ? "singleplayer" : "multiplayer";
        }
        // 还没有世界：区分「正在连接/加载」与「主菜单」
        if (mc.screen instanceof ConnectScreen
                || mc.screen instanceof ReceivingLevelScreen
                || mc.screen instanceof LevelLoadingScreen) {
            return "connecting";
        }
        return "menu";
    }

    /**
     * 本机集成服务器**当前实际**监听的端口。取证（javap -c，同上 jar）：
     * <pre>
     *   javap -p net.minecraft.client.server.IntegratedServer
     *     public boolean isPublished();
     *     public int getPort();
     *   javap -c IntegratedServer#getPort():        getfield publishedPort:I; ireturn
     *   javap -c IntegratedServer#isPublished():    getfield publishedPort:I; iconst_m1; if_icmple -> false
     *   javap -c IntegratedServer#publishServer(GameType,boolean,int):
     *     ... getConnection().startTcpServerListener(null, <port>); LOGGER.info("Started serving on {}", <port>);
     *     ... putfield publishedPort:I (= <请求端口>)
     *   javap -c ShareToLanScreen（客户端「对局域网开放」入口）：
     *     构造里 port = HttpUtil.getAvailablePort()；点确认时 publishServer(gameMode, allowCommands, this.port)
     *     ⇒ 请求端口是**已探测可用且非 0** 的端口，绑定成功时 请求端口 == 实际端口
     * </pre>
     * 所以从**当前活着的** IntegratedServer 取 publishedPort 就是本次会话的端口，不会拿到日志里残留的旧端口。
     * 没开局域网 / 不是本机集成服务器 / 取不到 ⇒ 0。
     *
     * TODO(未核实)：publishServer 若被传 0（让 OS 选临时端口），publishedPort 仍记 0，实际端口证不到
     *   —— ServerConnectionListener.channels 是 private List&lt;ChannelFuture&gt;，无公开取值口
     *   （javap -p ServerConnectionListener 只有 getConnections():List&lt;Connection&gt;，那是入站连接不是监听 socket）
     *   ⇒ 这种情况返回 0，不猜。
     */
    @Override
    public int lanPort() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || !mc.hasSingleplayerServer()) return 0;
        IntegratedServer server = mc.getSingleplayerServer();
        if (server == null || !server.isPublished()) return 0;
        int p = server.getPort();
        return p > 0 ? p : 0;
    }

    @Override
    public List<String> supportedKeys() { return KEYS; }

    private static net.minecraft.client.KeyMapping km(String key) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return null;
        switch (key) {
            case "forward":   return mc.options.keyUp;
            case "back":      return mc.options.keyDown;
            case "left":      return mc.options.keyLeft;
            case "right":     return mc.options.keyRight;
            case "jump":      return mc.options.keyJump;
            case "sneak":     return mc.options.keyShift;
            case "sprint":    return mc.options.keySprint;
            case "attack":    return mc.options.keyAttack;
            case "use":       return mc.options.keyUse;
            case "inventory": return mc.options.keyInventory;
            default:          return null;
        }
    }

    @Override
    public boolean isPressed(String key) {
        net.minecraft.client.KeyMapping k = km(key);
        return k != null && k.isDown();
    }

    @Override
    public void setPressed(String key, boolean down) {
        net.minecraft.client.KeyMapping k = km(key);
        if (k == null) return;
        // ⚠ MC 的「点击类」动作（挖矿/放置/开背包）不是读 isDown 启动的：
        // Minecraft.handleKeybinds() 里是 `while (keyAttack.consumeClick()) startAttack();`，
        // 而 consumeClick() 只认 KeyMapping.click() 累加的 clickCount —— setDown() 不累加。
        // 实测（forge/neoforge 1.20.1 真机）：只 setDown 时 press inventory 打不开背包、
        // 按住 attack 8 秒挖不动沙子；移动键不受影响（直接读 isDown）。
        // 所以 down=true 时补一次 click（等价于真键盘按下）。
        if (down) net.minecraft.client.KeyMapping.click(k.getKey());
        k.setDown(down);
        if (!down) syncWalkHeldReleased(key);
    }

    @Override
    public String playerStateJson() {
        Minecraft mc = Minecraft.getInstance();
        Map<String, Object> m = new LinkedHashMap<>();
        if (mc == null || mc.player == null) {
            m.put("present", Boolean.FALSE);
            return Json.of(m);
        }
        LocalPlayer p = mc.player;
        m.put("present", Boolean.TRUE);
        m.put("name", p.getName().getString());
        m.put("x", p.getX());
        m.put("y", p.getY());
        m.put("z", p.getZ());
        m.put("health", p.getHealth());
        m.put("onGround", p.onGround());
        // 状态器要用的朝向（setYRot/setXRot 的读侧；本档 look() 已在用同一个 API 面）。
        // 只**新增两个键**，不改旧键 ⇒ 老调用方（query_player_state）不受影响。
        m.put("yaw", p.getYRot());
        m.put("pitch", p.getXRot());
        m.put("dimension", mc.level == null ? null : mc.level.dimension().location().toString());
        m.put("screen", screenName());
        return Json.of(m);
    }

    @Override
    public String screenName() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.screen == null) return null;
        return mc.screen.getClass().getSimpleName();
    }

    @Override
    public String screenshotPath() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return null;
        try {
            Screenshot.grab(mc.gameDirectory, mc.getMainRenderTarget(), c -> { });
        } catch (Throwable t) {
            return null;
        }
        return new File(mc.gameDirectory, "screenshots").getAbsolutePath();
    }

    @Override
    public void openWorld(String worldName) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return;
        // 1.20.1 的 WorldOpenFlows 还是旧面：loadLevel(Screen,String)（javap forge-1.20.1-47.4.10_mapped_official 实测）
        mc.createWorldOpenFlows().loadLevel(null, worldName);
    }

    private Object bot;
    private boolean botIsMannequin;

    private final java.util.Deque<String> chatInbox = new java.util.concurrent.ConcurrentLinkedDeque<>();

    public void pushChat(String line) {
        chatInbox.addLast(line);
        while (chatInbox.size() > 200) chatInbox.pollFirst();
    }

    @Override
    public java.util.List<String> drainChat() {
        java.util.List<String> out = new java.util.ArrayList<>();
        String s;
        while ((s = chatInbox.pollFirst()) != null) out.add(s);
        return out;
    }

    @Override
    public String spawnBot(String name, double distance) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null) return null;
        net.minecraft.world.phys.Vec3 look = mc.player.getLookAngle();
        double x = mc.player.getX() + look.x * distance;
        double y = mc.player.getY();
        double z = mc.player.getZ() + look.z * distance;

        String why = "unknown";
        if (!mc.hasSingleplayerServer()) {
            why = "hasSingleplayerServer()=false（不是单人/局域网世界）";
        } else {
            net.minecraft.server.MinecraftServer server = mc.getSingleplayerServer();
            if (server == null) {
                why = "getSingleplayerServer()=null";
            } else {
                net.minecraft.server.level.ServerLevel level = server.getLevel(mc.player.level().dimension());
                if (level == null) {
                    why = "server.getLevel(维度) 返回 null";
                } else {
                    com.mojang.authlib.GameProfile profile = new com.mojang.authlib.GameProfile(
                            java.util.UUID.nameUUIDFromBytes(("bandd_playtest:" + name).getBytes(java.nio.charset.StandardCharsets.UTF_8)),
                            name);
                    net.minecraftforge.common.util.FakePlayer fp =
                            net.minecraftforge.common.util.FakePlayerFactory.get(level, profile);
                    fp.setGameMode(net.minecraft.world.level.GameType.SURVIVAL);
                    fp.setPos(x, y, z);
                    level.addNewPlayer(fp);
                    try {
level.getChunkSource().addRegionTicket(
                            net.minecraft.server.level.TicketType.PLAYER,
                            chunkOf(fp.blockPosition()), 3,
                            chunkOf(fp.blockPosition()));
                    } catch (Throwable t) {
                        System.err.println("[bandd-playtest] 化身票据失败: " + t);
                    }
                    bot = fp;
                    botIsMannequin = false;
                    return "fake_player";
                }
            }
        }
        chatCommand("summon minecraft:mannequin " + x + " " + y + " " + z
                + " {Tags:[\"bandd_bot\"],CustomName:'\"" + name + "\"',CustomNameVisible:1b}");
        bot = null;
        botIsMannequin = true;
        return "mannequin: " + why;
    }

    private int botTickCounter = 0;
    private int botPickedUp = 0;

    @Override
    public void tickBot() {
        if (!(bot instanceof net.minecraft.server.level.ServerPlayer bp)) return;
        if (++botTickCounter % 5 != 0) return;
        if (!(bp.level() instanceof net.minecraft.server.level.ServerLevel level)) return;
        java.util.List<net.minecraft.world.entity.item.ItemEntity> items = level.getEntitiesOfClass(
                net.minecraft.world.entity.item.ItemEntity.class,
                bp.getBoundingBox().inflate(1.5, 1.0, 1.5));
        for (net.minecraft.world.entity.item.ItemEntity it : items) {
            try {
                it.playerTouch(bp);
                botPickedUp++;
            } catch (Throwable t) {
                System.err.println("[bandd-playtest] 化身捡拾失败: " + t);
            }
        }
    }

    @Override
    public String giveBot(String item, int count) {
        if (!(bot instanceof net.minecraft.server.level.ServerPlayer bp)) return null;
        net.minecraft.resources.ResourceLocation id = net.minecraft.resources.ResourceLocation.tryParse(item);
        if (id == null || !net.minecraft.core.registries.BuiltInRegistries.ITEM.containsKey(id)) return null;
        bp.getInventory().add(new net.minecraft.world.item.ItemStack(
                net.minecraft.core.registries.BuiltInRegistries.ITEM.get(id), count));
        return count + "x " + item;
    }
    /** 本机玩家转视角（look）。写法候选 D-yarn-fields；判据 = javac rc=0。 */
    @Override public boolean look(double yaw, double pitch) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null) return false;
        // 1.20.1 的 mojmap/parchment 用 setYRot/setXRot（`yaw`/`pitch` 是 MCP 名 —— 实测 javac「找不到符号」）
        mc.player.setYRot((float) yaw);
        mc.player.setXRot((float) pitch);
        return true;
    }

    /**
     * 关掉当前界面：界面开着时 MC 不处理输入（press/walk_to 失效）。
     *
     * <p>[T41 真机修复] 若当前是容器界面或 {@code player.containerMenu != player.inventoryMenu}，
     * 必须调 {@code mc.player.closeContainer()}（javap 实证：发送 {@code ServerboundContainerClosePacket}
     * 给服务端 + 重置 {@code containerMenu = inventoryMenu} + {@code mc.setScreen(null)}）。
     * 旧写法只调 {@code mc.setScreen(null)} 会把服务端卡在旧的 {@code CraftingMenu}/{@code FurnaceMenu}
     * （containerId != 0），导致随后 {@code InventoryScreen}（containerId=0）内所有 {@code click_slot}
     * 与 {@code drop_item} 被 {@code ServerGamePacketListenerImpl#handleContainerClick} 静默丢弃，
     * 造成客户端与服务端物品栏严重不同步。
     */
    @Override public boolean closeScreen() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return false;
        boolean hasContainer = mc.player != null
                && (mc.player.containerMenu != mc.player.inventoryMenu
                        || mc.screen instanceof net.minecraft.client.gui.screens.inventory.AbstractContainerScreen);
        if (hasContainer) {
            mc.player.closeContainer();
            return true;
        }
        if (mc.screen == null) return true;
        mc.setScreen(null);
        return true;
    }

    /**
     * 挖矿会话状态机（[T20-①]）：**唯一完成判据 = 目标格变空气**，另有超时收工（MINE_TIMEOUT）。
     *
     * <p>为什么不用 continueDestroyBlock 的返回值：vanilla 在 destroyDelay 未到的分支里
     * **也回 true**（javap -c 实证，见 {@link com.bandd.playtest.core.MiningTracker} 类注释）
     * ⇒ 旧写法（把 continueDestroyBlock 的返回值当真，回 true 就 `mining = null`）会在**第一 tick**
     * 把目标清空、破坏进度永远攒不满（真机铁证：生存模式 mine 40 次 / 22 秒，方块纹丝不动）。
     */
    private final com.bandd.playtest.core.MiningTracker miningTracker =
            new com.bandd.playtest.core.MiningTracker();

    /** 挖矿目标（跨 tick 持续破坏用）。 */
    private net.minecraft.core.BlockPos mining = null;
    private net.minecraft.core.Direction miningDir = null;

    /** 宿主时钟（毫秒；只用于进度自报的 elapsedMs，不用它当判据）。 */
    private static long nowMs() { return System.currentTimeMillis(); }

    /**
     * 破坏准星所指方块：**开始**破坏（走正常进度），实际破坏在随后的 client tick 里由
     * tick() 逐帧 continueDestroyBlock 完成。
     *
     * 为什么不能一次 destroyBlock：实测（forge 1.20.1 真机）客户端 destroyBlock 返回 true，
     * 但服务端按「破坏进度不足」驳回 ⇒ 方块还在、也不掉落。走 start+continue 才通过校验。
     */
    /**
     * 取准星所指方块：主路 = 自算射线（与渲染状态无关），备路 = mc.hitResult。
     * 名字取证（javap -p，jar = forge-1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1）：
     *   net.minecraft.world.entity.player.Player : public abstract boolean isCreative();
     *   net.minecraft.client.Minecraft            : public net.minecraft.world.phys.HitResult hitResult;
     * 触及距离：创造 5.0 / 生存 4.5（原硬编码 4.5 是缺陷）。
     */
    private static net.minecraft.world.phys.BlockHitResult pickLookingAt(Minecraft mc) {
        net.minecraft.world.phys.Vec3 eye = mc.player.getEyePosition(1.0F);
        double reach = mc.player.isCreative() ? 5.0D : 4.5D;
        net.minecraft.world.phys.Vec3 end = eye.add(mc.player.getViewVector(1.0F).scale(reach));
        net.minecraft.world.phys.BlockHitResult bhr = mc.level.clip(new net.minecraft.world.level.ClipContext(
                eye, end, net.minecraft.world.level.ClipContext.Block.OUTLINE,
                net.minecraft.world.level.ClipContext.Fluid.NONE, mc.player));
        if (bhr.getType() == net.minecraft.world.phys.HitResult.Type.BLOCK) return bhr;      // 主路命中
        if (mc.hitResult instanceof net.minecraft.world.phys.BlockHitResult hb
                && hb.getType() == net.minecraft.world.phys.HitResult.Type.BLOCK) return hb; // 备用
        return null;
    }

    @Override public String mineLookingAt() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null || mc.level == null) return null;
        // ⚠ 不能只读 mc.hitResult：窗口失焦/最小化时客户端不渲染 ⇒ hitResult 陈旧，
        //   实测「截图里准星在树干上，mine 却返回 MINE_FAILED」。主路自算射线（与渲染状态无关），
        //   hitResult 仅作备用兜底。
        net.minecraft.world.phys.BlockHitResult bhr = pickLookingAt(mc);
        if (bhr == null) return null;
        net.minecraft.core.BlockPos pos = bhr.getBlockPos();
        if (mc.level.getBlockState(pos).isAir()) return null;
        // ⚠ 幂等：同一目标**绝不能**重发 startDestroyBlock —— MC 的 START 会把破坏进度清零，
        //   调用方按周期反复调 mine（实时闭环）时就会变成「非常快速的单次点击」，永远挖不动。
        //   实测：150ms 周期反复调用时 20 秒只破 2 块；只发一次 START 后由 tick() 推进即可。
        if (!pos.equals(this.mining)) {
            this.miningDir = bhr.getDirection();
            // [T20-①] startDestroyBlock 回 false = 游戏**不受理**这次破坏（javap -c 1.20.1：
            //   只有 blockActionRestricted / 出世界边界 两条早退为 false）⇒ 如实收工、让 core 回
            //   MINE_FAILED，**不假装已开始**（旧代码不看返回值）。
            boolean started = mc.gameMode.startDestroyBlock(pos, this.miningDir);
            if (!started) {
                this.mining = null;
                this.miningTracker.clear();
                return null;
            }
            this.mining = pos;
            // 同一目标**绝不重发 START**（重发会把破坏进度清零）⇒ 幂等判据收在 MiningTracker.aim 里。
            String blockId = null;
            try {
                blockId = net.minecraft.core.registries.BuiltInRegistries.BLOCK
                        .getKey(mc.level.getBlockState(pos).getBlock()).toString();
            } catch (Throwable t) {
                blockId = null;   // 取不到就留 null（进度自报里如实写 null），不编
            }
            this.miningTracker.aim(pos.getX(), pos.getY(), pos.getZ(), blockId, nowMs());
        }
        return pos.getX() + "," + pos.getY() + "," + pos.getZ();
    }

    /**
     * 每 client tick 推进挖矿进度（core.onTick → bridge.tick）。
     *
     * <p>[T20-①] **不看 continueDestroyBlock 的返回值**：vanilla 在 destroyDelay 未到的分支里
     * 也回 true（javap -c 实证）⇒ 拿它当「已挖穿」会在第一 tick 清空目标。唯一完成判据 =
     * 目标格变空气（MiningTracker.beginTick），另有超时收工（MINE_TIMEOUT，fail-loud）。
     */
    @Override public void tick() {
        Minecraft mc = Minecraft.getInstance();
        if (this.mining == null || mc == null || mc.level == null || mc.gameMode == null) {
            this.mining = null;
            this.miningTracker.clear();
            return;
        }
        boolean air;
        try {
            air = mc.level.getBlockState(this.mining).isAir();
        } catch (Throwable t) {
            air = false;                 // 读不到就当作「还在」；超时兜底会收工，绝不假装挖穿
        }
        String stop = this.miningTracker.beginTick(air, nowMs());
        if (stop != null) {
            // MINE_BROKEN（挖穿）/ MINE_TIMEOUT（超时）：原因留在 mineStatus() 里如实回出去
            this.mining = null;
            return;
        }
        boolean cont = mc.gameMode.continueDestroyBlock(this.mining, this.miningDir);
        this.miningTracker.noteContinueReturned(cont);   // **只记账**，不据此收工
    }

    /**
     * [T20-①] mine 的破坏进度自报（core 的 mine 回执 progress 段）。
     *
     * <p>只读 MiningTracker 的内存字段（不碰 MC）⇒ 与 tick 同线程调用安全。
     */
    @Override public Map<String, Object> mineStatus() {
        return this.miningTracker.status();
    }

    /**
     * [T20-③] 窗口聚焦自报。
     * 名字取证（javap -p，jar = forge-1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1）：
     *   net.minecraft.client.Minecraft : public boolean isWindowActive();
     * （1.21.11 档换名 MinecraftClient#isWindowFocused）。
     */
    @Override public Boolean windowFocused() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return null;
        return Boolean.valueOf(mc.isWindowActive());
    }


    @Override
    public boolean lookBot(double yaw, double pitch) {
        if (!(bot instanceof net.minecraft.server.level.ServerPlayer bp)) return false;
        bp.setYRot((float) yaw);
        bp.setXRot((float) pitch);
        return true;
    }

    @Override
    public String breakBotBlock(double x, double y, double z) {
        if (!(bot instanceof net.minecraft.server.level.ServerPlayer bp)) return null;
        net.minecraft.core.BlockPos pos = net.minecraft.core.BlockPos.containing(x, y, z);
        aimAt(bp, x + 0.5, y + 0.5, z + 0.5);
        boolean ok = bp.gameMode.destroyBlock(pos);
        return ok ? pos.toShortString() : null;
    }

    @Override
    public String placeBotBlock(double x, double y, double z) {
        if (!(bot instanceof net.minecraft.server.level.ServerPlayer bp)) return null;
        net.minecraft.world.item.ItemStack held = bp.getMainHandItem();
        if (held.isEmpty()) return null;
        aimAt(bp, x + 0.5, y + 0.5, z + 0.5);
        net.minecraft.world.phys.HitResult hr = bp.pick(5.0, 1.0F, false);
        if (!(hr instanceof net.minecraft.world.phys.BlockHitResult bhr)) return null;
        net.minecraft.world.InteractionResult res = bp.gameMode.useItemOn(bp, bp.level(), held,
                net.minecraft.world.InteractionHand.MAIN_HAND, bhr);
        return res.consumesAction() ? bhr.getBlockPos().toShortString() : null;
    }

    private static void aimAt(net.minecraft.server.level.ServerPlayer bp, double tx, double ty, double tz) {
        double dx = tx - bp.getX();
        double dy = ty - bp.getEyeY();
        double dz = tz - bp.getZ();
        double horiz = Math.sqrt(dx * dx + dz * dz);
        bp.setYRot((float) Math.toDegrees(Math.atan2(-dx, dz)));
        bp.setXRot((float) -Math.toDegrees(Math.atan2(dy, horiz)));
    }

    /** ChunkPos(BlockPos) 构造器在 1.20.4+ 已不存在 => 用区块坐标手算（5 档同形，javap 实测 ChunkPos(int,int)）。 */
    private static net.minecraft.world.level.ChunkPos chunkOf(net.minecraft.core.BlockPos p) {
        return new net.minecraft.world.level.ChunkPos(p.getX() >> 4, p.getZ() >> 4);
    }

    @Override
    public boolean setServerAuth(boolean online) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || !mc.hasSingleplayerServer()) return false;
        net.minecraft.server.MinecraftServer s = mc.getSingleplayerServer();
        if (s == null) return false;
        s.setUsesAuthentication(online);
        return true;
    }

    @Override
    public void joinServer(String address) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return;
        net.minecraft.client.multiplayer.resolver.ServerAddress addr =
                net.minecraft.client.multiplayer.resolver.ServerAddress.parseString(address);
        net.minecraft.client.multiplayer.ServerData data = new net.minecraft.client.multiplayer.ServerData(
                "bandd-bot", address, false); // 1.20.1 ServerData(String,String,boolean)
        net.minecraft.client.gui.screens.ConnectScreen.startConnecting(
                mc.screen, mc, addr, data, false);
    }

    @Override
    public String openBotInventory() {
        Minecraft mc = Minecraft.getInstance();
        if (!(bot instanceof net.minecraft.server.level.ServerPlayer botPlayer)) return null;
        if (!mc.hasSingleplayerServer()) return null;
        net.minecraft.server.MinecraftServer server = mc.getSingleplayerServer();
        if (server == null) return null;
        net.minecraft.server.level.ServerPlayer human = null;
        for (net.minecraft.server.level.ServerPlayer p : server.getPlayerList().getPlayers()) { human = p; break; }
        if (human == null) return null;
        human.openMenu(new net.minecraft.world.SimpleMenuProvider(
                (id, inv, p) -> new BotInventoryMenu(id, inv, botPlayer.getInventory()),
                net.minecraft.network.chat.Component.literal("AI 的物品栏（假玩家 " + botPlayer.getName().getString() + "）")));
        return "chest_9x4 -> human screen";
    }

    static final class BotInventoryMenu extends net.minecraft.world.inventory.AbstractContainerMenu {
        private final net.minecraft.world.Container botInv;

        BotInventoryMenu(int id, net.minecraft.world.entity.player.Inventory playerInv,
                         net.minecraft.world.Container botInv) {
            super(net.minecraft.world.inventory.MenuType.GENERIC_9x4, id);
            this.botInv = botInv;
            for (int row = 0; row < 4; row++) {
                for (int col = 0; col < 9; col++) {
                    addSlot(new net.minecraft.world.inventory.Slot(botInv, col + row * 9, 8 + col * 18, 18 + row * 18));
                }
            }
            for (int row = 0; row < 3; row++) {
                for (int col = 0; col < 9; col++) {
                    addSlot(new net.minecraft.world.inventory.Slot(playerInv, col + row * 9 + 9, 8 + col * 18, 103 + row * 18));
                }
            }
            for (int col = 0; col < 9; col++) {
                addSlot(new net.minecraft.world.inventory.Slot(playerInv, col, 8 + col * 18, 161));
            }
        }

        @Override
        public boolean stillValid(net.minecraft.world.entity.player.Player p) { return true; }

        @Override
        public net.minecraft.world.item.ItemStack quickMoveStack(net.minecraft.world.entity.player.Player p, int idx) {
            return net.minecraft.world.item.ItemStack.EMPTY;
        }
    }

    @Override
    public void moveBotTo(double x, double y, double z) {
        if (bot instanceof net.minecraft.server.level.ServerPlayer sp) {
            sp.teleportTo(x, y, z);
        } else if (botIsMannequin) {
            chatCommand("tp @e[tag=bandd_bot,limit=1] " + x + " " + y + " " + z);
        }
    }

    @Override
    public void despawnBot() {
        if (bot instanceof net.minecraft.server.level.ServerPlayer sp
                && sp.level() instanceof net.minecraft.server.level.ServerLevel level) {
            try {
level.getChunkSource().removeRegionTicket(
                        net.minecraft.server.level.TicketType.PLAYER,
                        chunkOf(sp.blockPosition()), 3,
                        chunkOf(sp.blockPosition()));
            } catch (Throwable t) {
                System.err.println("[bandd-playtest] 化身票据回收失败: " + t);
            }
            level.removePlayerImmediately(sp, net.minecraft.world.entity.Entity.RemovalReason.DISCARDED);
        } else if (botIsMannequin) {
            chatCommand("kill @e[tag=bandd_bot,limit=1]");
        }
        bot = null;
        botIsMannequin = false;
    }

    @Override
    public void chatCommand(String command) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.getConnection() == null) return;
        String cmd = command.startsWith("/") ? command.substring(1) : command;
        mc.getConnection().sendCommand(cmd);
    }

    // ================= ① 诚实命令回执（chat_command）=================
    /**
     * 执行一条命令并给出**诚实回执**：{@code parsed / result / error / cursor}。
     *
     * 名字全部 javap 取证（jar = forge-1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1）：
     * <pre>
     *   net.minecraft.client.multiplayer.ClientPacketListener
     *     public com.mojang.brigadier.CommandDispatcher<net.minecraft.commands.SharedSuggestionProvider> getCommands();
     *     public net.minecraft.client.multiplayer.ClientSuggestionProvider getSuggestionsProvider();
     *     public void sendCommand(java.lang.String);
     *   net.minecraft.client.multiplayer.ClientSuggestionProvider implements net.minecraft.commands.SharedSuggestionProvider
     *   net.minecraft.server.MinecraftServer
     *     public net.minecraft.commands.Commands getCommands();
     *     public net.minecraft.commands.CommandSourceStack createCommandSourceStack();
     *   net.minecraft.commands.Commands
     *     public com.mojang.brigadier.CommandDispatcher<net.minecraft.commands.CommandSourceStack> getDispatcher();
     *   net.minecraft.world.entity.Entity
     *     public net.minecraft.commands.CommandSourceStack createCommandSourceStack();
     *   com.mojang.brigadier.CommandDispatcher : parse(String,Object) / execute(ParseResults)
     *   com.mojang.brigadier.ParseResults     : getExceptions() / getReader() / getContext().getCommand()
     *   javap -c net.minecraftforge.client.ClientCommandHandler#lambda$mergeServerCommands$0 = iconst_0; ireturn
     *     ⇒ **合并派发器里的服务端命令节点是 no-op 桩**，客户端 execute 拿不到真实结果 ⇒ 单机改在集成服务端执行。
     * </pre>
     */
    @Override
    public CommandResult runCommand(String command) {
        Minecraft mc = Minecraft.getInstance();
        String cmd = command.startsWith("/") ? command.substring(1) : command;
        if (mc == null || mc.getConnection() == null) {
            chatCommand(command);   // 没连上：仍按旧路发出去，但如实说拿不到解析结果
            return new CommandResult(false, null, "客户端未连接：无命令派发器，无法给出解析回执", null);
        }
        // (A) 客户端命令派发器 parse（拿解析错误与出错位置）
        net.minecraft.client.multiplayer.ClientPacketListener conn = mc.getConnection();
        com.mojang.brigadier.CommandDispatcher<net.minecraft.commands.SharedSuggestionProvider> d = conn.getCommands();
        com.mojang.brigadier.ParseResults<net.minecraft.commands.SharedSuggestionProvider> pr =
                d.parse(cmd, conn.getSuggestionsProvider());
        if (!parsedOk(pr)) return new CommandResult(false, null, firstError(pr), cursorOf(pr));

        // (B) 执行
        net.minecraft.server.MinecraftServer server = mc.getSingleplayerServer();
        if (server != null) {
            // 单机：在**集成服务端**执行 ⇒ 拿真实返回值与真实错误
            net.minecraft.commands.CommandSourceStack src = commandSource(server);
            com.mojang.brigadier.CommandDispatcher<net.minecraft.commands.CommandSourceStack> sd =
                    server.getCommands().getDispatcher();
            com.mojang.brigadier.ParseResults<net.minecraft.commands.CommandSourceStack> spr = sd.parse(cmd, src);
            if (!parsedOk(spr)) return new CommandResult(false, null, firstError(spr), cursorOf(spr));
            try {
                int r = sd.execute(spr);
                return new CommandResult(true, String.valueOf(r), null, null);
            } catch (Throwable t) {
                return new CommandResult(true, null, msgOf(t), cursorOf(t));
            }
        }
        // 多人：客户端派发器 execute（no-op 桩）+ 真的发给服务端；服务端返回值客户端观察不到 ⇒ result=null（明说）
        try { d.execute(pr); } catch (Throwable ignored) { }
        conn.sendCommand(cmd);
        return new CommandResult(true, null, null, null);
    }

    /** 优先用**真人玩家**的源（权限与真人一致），拿不到再退回控制台源。 */
    private static net.minecraft.commands.CommandSourceStack commandSource(net.minecraft.server.MinecraftServer server) {
        for (net.minecraft.server.level.ServerPlayer p : server.getPlayerList().getPlayers()) {
            return p.createCommandSourceStack();
        }
        return server.createCommandSourceStack();
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
     * 名字 javap 取证（同上 jar）：
     * <pre>
     *   net.minecraft.client.gui.screens.Screen
     *     public java.util.List<? extends net.minecraft.client.gui.components.events.GuiEventListener> children();
     *   net.minecraft.client.gui.components.AbstractWidget
     *     public int getX(); public int getY(); public int getWidth(); public int getHeight();
     *     public net.minecraft.network.chat.Component getMessage(); public boolean isActive();
     *     public boolean active; public boolean visible;
     *   net.minecraft.client.gui.components.events.GuiEventListener : boolean isFocused();
     *   net.minecraft.network.chat.Component : public default java.lang.String getString();
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
     * 元素要么是 {@code AbstractWidget}，要么是 {@link ClothRef}。
     *
     * <p>为什么两处共用这一份遍历：{@code click_widget} 的 {@code index} 是**清单里的下标**，
     * 两边各写一份遍历迟早漂移 ⇒ 按下标点到的不是清单上那一格。
     */
    private static java.util.List<Object> widgetElements(Object screen) {
        java.util.List<Object> out = new java.util.ArrayList<>();
        // [T16] **递归**进容器：Cloth 的条目挂在 ListWidget 里面，只扫顶层 children() 会看不到
        // 四个纵层旋钮。javap（forge 1.20.1 mapped_parchment 件）原文：
        //   public interface net.minecraft.client.gui.components.events.ContainerEventHandler
        //       extends net.minecraft.client.gui.components.events.GuiEventListener
        //     public abstract java.util.List<? extends ...GuiEventListener> children();
        java.util.Set<Object> seen = java.util.Collections.newSetFromMap(new java.util.IdentityHashMap<Object, Boolean>());
        collectWidgets(screen, out, seen);
        // [T16] Cloth 条目不在 Screen#children() 里 ⇒ 额外走 getCategorizedEntries() + getFieldName()，
        // 并按**同一顺序**放进序列。
        // javap（cloth-config 12.0.109 forge 件）实证：
        //   ClothConfigScreen#getCategorizedEntries():Map<Component,List<AbstractConfigEntry<?>>>
        //   AbstractConfigEntry#getFieldName():Component
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
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.screen == null) return "[]";
        java.util.List<Object> out = new java.util.ArrayList<>();
        for (Object el : widgetElements(mc.screen)) {
            if (el instanceof net.minecraft.client.gui.components.AbstractWidget w) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("type", w.getClass().getSimpleName());
                m.put("x", w.getX());
                m.put("y", w.getY());
                m.put("width", w.getWidth());
                m.put("height", w.getHeight());
                m.put("text", w.getMessage().getString());
                m.put("active", w.isActive());
                m.put("visible", w.visible);
                m.put("focused", w.isFocused());
                out.add(m);
            } else if (el instanceof ClothRef cr) {
                me.shedaniel.clothconfig2.api.AbstractConfigEntry<?> ace =
                        (me.shedaniel.clothconfig2.api.AbstractConfigEntry<?>) cr.entry;
                net.minecraft.network.chat.Component fn = ace.getFieldName();
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
     * 递归收集控件：自己若是 AbstractWidget 就把**对象本身**放进序列，是 ContainerEventHandler 就继续下钻（防环）。
     * 为什么放对象而不是直接放回执 Map：{@code click_widget} 要按下标**真点**那一格。
     */
    private static void collectWidgets(Object el, java.util.List<Object> out, java.util.Set<Object> seen) {
        if (el == null || !seen.add(el)) return;
        if (el instanceof net.minecraft.client.gui.components.AbstractWidget) {
            out.add(el);
        }
        if (el instanceof net.minecraft.client.gui.components.events.ContainerEventHandler ce) {
            for (net.minecraft.client.gui.components.events.GuiEventListener ch : ce.children()) collectWidgets(ch, out, seen);
        }
    }

    // ================= ③ 日志游标增量读（query_log）=================
    /** 游戏实例目录（javap：{@code net.minecraft.client.Minecraft.gameDirectory} 是 public final File）。 */
    @Override
    public String gameDirectory() {
        Minecraft mc = Minecraft.getInstance();
        return mc == null ? null : mc.gameDirectory.getAbsolutePath();
    }

    // ================= ④ 状态器取值面（query_state / query_map）=================
    /**
     * 本档实现了 {@code blockAt} + {@code topSolidY} ⇒ 自报支持状态器
     * （见 {@code GameBridge#stateMapCapable}）。未实现的老档走 default = false ⇒ 如实「不支持」。
     *
     * 名字**全部 javap 取证**（jar = 本档 parchment 映射件
     * {@code F:\MOD_TEST\caches\forge_gradle\minecraft_user_repo\net\minecraftforge\forge\1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1\forge-1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1.jar}）：
     * <pre>
     *   javap -p net.minecraft.world.level.Level
     *     public net.minecraft.world.level.block.state.BlockState getBlockState(net.minecraft.core.BlockPos);
     *     public int getHeight(net.minecraft.world.level.levelgen.Heightmap$Types, int, int);
     *     public long getDayTime(); public boolean isRaining(); public boolean isThundering();
     *   javap -c net.minecraft.world.level.Level#getHeight
     *     hasChunk:(II)Z 为假就跳走；为真 → getChunk(..).getHeight(type, x&amp;15, z&amp;15) + 1
     *     ⇒ **返回「最高方块上面那一格的 Y」** ⇒ 最高非空气方块的 Y = getHeight(...) - 1
     *   javap -p net.minecraft.world.level.LevelAccessor
     *     public default boolean hasChunk(int, int);      // ★ 未加载区块必须显式判，否则被当空气
     *   javap -p net.minecraft.world.level.LevelHeightAccessor
     *     public default boolean isOutsideBuildHeight(int);
     *   javap -p net.minecraft.world.level.levelgen.Heightmap$Types
     *     public static final net.minecraft.world.level.levelgen.Heightmap$Types WORLD_SURFACE;
     *   javap -p net.minecraft.core.registries.BuiltInRegistries
     *     public static final net.minecraft.core.DefaultedRegistry&lt;net.minecraft.world.level.block.Block&gt; BLOCK;
     *   javap -p net.minecraft.core.Registry
     *     public abstract net.minecraft.resources.ResourceLocation getKey(T);
     *   javap -p net.minecraft.core.BlockPos$MutableBlockPos
     *     public net.minecraft.core.BlockPos$MutableBlockPos(); public ... set(int, int, int);
     * </pre>
     */
    @Override
    public boolean stateMapCapable() { return true; }

    /** 复用一个可变 BlockPos 以免每格分配（只在客户端 tick 线程用）。 */
    private final net.minecraft.core.BlockPos.MutableBlockPos probePos =
            new net.minecraft.core.BlockPos.MutableBlockPos();

    /** 坐标处方块的注册名；**越界 / 未加载回 null**（core 当「未知」，不假装是空气）。 */
    @Override
    public String blockAt(int x, int y, int z) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.level == null) return null;
        if (mc.level.isOutsideBuildHeight(y)) return null;
        if (!mc.level.hasChunk(x >> 4, z >> 4)) return null;
        net.minecraft.world.level.block.state.BlockState st = mc.level.getBlockState(probePos.set(x, y, z));
        return net.minecraft.core.registries.BuiltInRegistries.BLOCK.getKey(st.getBlock()).toString();
    }

    /** 该列最高非空气方块的 Y（= WORLD_SURFACE 高度图的 getHeight - 1）；未加载回 MIN_VALUE。 */
    @Override
    public int topSolidY(int x, int z) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.level == null) return Integer.MIN_VALUE;
        if (!mc.level.hasChunk(x >> 4, z >> 4)) return Integer.MIN_VALUE;
        return mc.level.getHeight(net.minecraft.world.level.levelgen.Heightmap.Types.WORLD_SURFACE, x, z) - 1;
    }

    /** 时间/天气。本档 {@code getDayTime()} 是世界总日时 ⇒ timeOfDay 取其对 24000 取模。 */
    @Override
    public String worldEnvJson() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.level == null) return null;
        Map<String, Object> m = new LinkedHashMap<>();
        long day = mc.level.getDayTime();
        m.put("dayTime", day);
        m.put("timeOfDay", ((day % 24000L) + 24000L) % 24000L);
        m.put("raining", mc.level.isRaining());
        m.put("thundering", mc.level.isThundering());
        return Json.of(m);
    }

    // ================= ⑤ 实体扫描面（query_map/query_state 的 entities 叠加层）=================
    /**
     * 本档实现了 {@link #nearbyEntitiesJson} ⇒ 自报支持实体扫描（见 {@code GameBridge#entityScanCapable}）。
     *
     * 名字**全部 javap 取证**（jar = 本档 parchment 映射件
     * {@code F:\MOD_TEST\caches\forge_gradle\minecraft_user_repo\net\minecraftforge\forge\1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1\forge-1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1.jar}）：
     * <pre>
     *   javap -p net.minecraft.client.Minecraft
     *     public net.minecraft.client.multiplayer.ClientLevel level;
     *     public net.minecraft.client.player.LocalPlayer player;
     *   javap -p net.minecraft.client.multiplayer.ClientLevel
     *     public java.lang.Iterable&lt;net.minecraft.world.entity.Entity&gt; entitiesForRendering();   // ★ 客户端渲染列表 = 已加载实体
     *     protected net.minecraft.world.level.entity.LevelEntityGetter&lt;...&gt; getEntities();       // ★ protected ⇒ 本档不用它
     *   javap -p net.minecraft.world.entity.Entity
     *     public net.minecraft.world.entity.EntityType&lt;?&gt; getType();
     *     public final double getX(); public final double getY(); public final double getZ();
     *     public java.util.UUID getUUID();
     *   javap -p net.minecraft.core.registries.BuiltInRegistries
     *     public static final net.minecraft.core.DefaultedRegistry&lt;net.minecraft.world.entity.EntityType&lt;?&gt;&gt; ENTITY_TYPE;
     *   javap -p net.minecraft.core.Registry : public abstract net.minecraft.resources.ResourceLocation getKey(T);
     * </pre>
     * **诚实边界**：{@code entitiesForRendering()} 只含**客户端已加载**的实体 ⇒ 取到啥报啥；
     * 玩家自己按**同一性**排除（与桥路线 {@code o == mc.thePlayer} 一致）。
     */
    @Override
    public boolean entityScanCapable() { return true; }

    @Override
    public String nearbyEntitiesJson(double radius) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null || mc.level == null) return null;
        double r2 = radius * radius;
        LocalPlayer p = mc.player;
        java.util.List<Object> out = new java.util.ArrayList<>();
        for (net.minecraft.world.entity.Entity e : mc.level.entitiesForRendering()) {
            if (e == p) continue;                       // 玩家自己不算「附近实体」（与桥一致）
            double dx = e.getX() - p.getX();
            double dy = e.getY() - p.getY();
            double dz = e.getZ() - p.getZ();
            if (dx * dx + dy * dy + dz * dz > r2) continue;
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("type", net.minecraft.core.registries.BuiltInRegistries.ENTITY_TYPE.getKey(e.getType()).toString());
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
     *   javap -p net.minecraft.world.entity.player.Player
     *     public net.minecraft.world.entity.player.Inventory getInventory();
     *   javap -p net.minecraft.world.entity.player.Inventory
     *     public int selected;                                       // ★ public 字段（选中快捷栏下标）
     *     public int getContainerSize();                             // 41 = 36 主背包 + 4 护甲 + 1 副手
     *     public net.minecraft.world.item.ItemStack getItem(int);
     *     public net.minecraft.world.item.ItemStack getSelected();   // ★ 主手那格
     *   javap -p net.minecraft.world.item.ItemStack
     *     public boolean isEmpty(); public net.minecraft.world.item.Item getItem(); public int getCount();
     *   javap -p net.minecraft.core.registries.BuiltInRegistries : public static final ... ITEM;
     * </pre>
     * **口径差异（如实写在回执的 idKind 里）**：本档给**现代注册名**（{@code minecraft:stone}），
     * 桥路线（forge 1.7.10–1.12.2）给的是 **unlocalizedName**（{@code item.stone}）—— 形状对齐、口径不同源。
     */
    @Override
    public boolean inventoryCapable() { return true; }

    @Override
    public String inventoryJson() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null) return null;
        net.minecraft.world.entity.player.Inventory inv = mc.player.getInventory();
        if (inv == null) return null;
        int size = inv.getContainerSize();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("size", size);
        java.util.List<Object> slots = new java.util.ArrayList<>();
        for (int i = 0; i < size; i++) {
            net.minecraft.world.item.ItemStack s = inv.getItem(i);
            if (s == null || s.isEmpty()) continue;      // **跳过空格子**（与桥路线 query_inventory 一致）
            slots.add(stackJson(i, s));
        }
        m.put("slots", slots);
        int sel = inv.selected;
        m.put("selectedSlot", sel);
        net.minecraft.world.item.ItemStack main = inv.getSelected();
        m.put("mainHand", (main == null || main.isEmpty()) ? null : stackJson(sel, main));
        java.util.List<Object> hotbar = new java.util.ArrayList<>();
        for (int i = 0; i < 9 && i < size; i++) {
            net.minecraft.world.item.ItemStack s = inv.getItem(i);
            hotbar.add((s == null || s.isEmpty()) ? emptyStackJson(i) : stackJson(i, s));
        }
        m.put("hotbar", hotbar);
        m.put("idKind", "registryName");
        return Json.of(m);
    }

    /** 单格（非空）→ JSON 片段形状；{@code idKind} 逐字写明口径。 */
    private static Map<String, Object> stackJson(int slot, net.minecraft.world.item.ItemStack s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("slot", slot);
        m.put("empty", Boolean.FALSE);
        m.put("itemId", net.minecraft.core.registries.BuiltInRegistries.ITEM.getKey(s.getItem()).toString());
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
    //   use_on / place_block 走原版「使用物品于方块」通路（useItemOn）。
    // 名字**逐一 javap 取证**（jar = forge-1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1）：
    //   javap -p net.minecraft.client.gui.screens.inventory.MenuAccess
    //     public abstract T getMenu();
    //   javap -p net.minecraft.world.inventory.AbstractContainerMenu
    //     public final net.minecraft.core.NonNullList<net.minecraft.world.inventory.Slot> slots;
    //     public final int containerId;  public net.minecraft.world.inventory.MenuType<?> getType();
    //   javap -p net.minecraft.world.inventory.Slot
    //     public final int x;  public final int y;  public net.minecraft.world.item.ItemStack getItem();
    //   javap -p net.minecraft.core.registries.BuiltInRegistries
    //     public static final Registry<MenuType<?>> MENU;
    //   javap -p net.minecraft.client.multiplayer.MultiPlayerGameMode
    //     public net.minecraft.world.InteractionResult useItemOn(LocalPlayer, InteractionHand, BlockHitResult);
    //     public void handleInventoryMouseClick(int, int, int, net.minecraft.world.inventory.ClickType, Player);
    //   javap -p net.minecraft.world.inventory.ClickType : PICKUP / QUICK_MOVE / ...
    //   javap -p net.minecraft.client.gui.components.events.GuiEventListener
    //     public default boolean mouseClicked(double, double, int);
    //   javap -p net.minecraft.world.phys.BlockHitResult : public BlockHitResult(Vec3, Direction, BlockPos, boolean);
    //   javap -p net.minecraft.world.level.block.state.BlockBehaviour\$BlockStateBase
    //     public boolean canBeReplaced();  public boolean isAir();
    //   javap -p net.minecraft.world.phys.Vec3 : public final double x,y,z; public double distanceTo(Vec3);
    //   javap -p net.minecraft.core.BlockPos : public BlockPos(int,int,int); public BlockPos relative(Direction);
    //   javap -p net.minecraft.core.Direction : public Direction getOpposite();
    //   javap -p net.minecraft.world.item.ItemStack : public boolean isEmpty(); public int getCount();
    //   javap -p net.minecraft.world.entity.Entity : public final Vec3 getEyePosition(); public double getEyeY();
    //   javap -p net.minecraft.world.InteractionResult : public boolean consumesAction();
    // ==================================================================

    /** 本档真实现了这一族 ⇒ 自报支持（见 {@link GameBridge#guiActionCapable}）。 */
    @Override public boolean guiActionCapable() { return true; }

    /** 当前容器菜单的注册名（取不到回 null —— core 会按「表外」兜底并如实标注）。 */
    private static String menuTypeOf(net.minecraft.world.inventory.AbstractContainerMenu menu) {
        try {
            return net.minecraft.core.registries.BuiltInRegistries.MENU.getKey(menu.getType()).toString();
        } catch (Throwable t) {
            return null;
        }
    }

    /** 当前容器界面（不是容器界面 / 没有玩家 ⇒ null）。 */
    private static net.minecraft.world.inventory.AbstractContainerMenu openMenu(Minecraft mc) {
        if (mc == null || mc.player == null || mc.screen == null) return null;
        if (!(mc.screen instanceof net.minecraft.client.gui.screens.inventory.AbstractContainerScreen<?> acs)) return null;
        return acs.getMenu();
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
        Minecraft mc = Minecraft.getInstance();
        net.minecraft.world.inventory.AbstractContainerMenu menu = openMenu(mc);
        if (menu == null) return null;
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("screen", mc.screen.getClass().getSimpleName());
        m.put("menuType", menuTypeOf(menu));
        m.put("containerId", menu.containerId);
        java.util.List<Object> slots = new java.util.ArrayList<>();
        for (int i = 0; i < menu.slots.size(); i++) {
            net.minecraft.world.inventory.Slot s = menu.slots.get(i);
            Map<String, Object> e = new LinkedHashMap<>();
            e.put("index", i);
            e.put("x", s.x);          // Slot 自己的坐标（相对容器界面左上角）
            e.put("y", s.y);
            net.minecraft.world.item.ItemStack st = s.getItem();
            if (st == null || st.isEmpty()) {
                e.put("empty", Boolean.TRUE);
            } else {
                e.put("empty", Boolean.FALSE);
                e.put("itemId", net.minecraft.core.registries.BuiltInRegistries.ITEM.getKey(st.getItem()).toString());
                e.put("count", st.getCount());
            }
            slots.add(e);
        }
        m.put("slots", slots);
        return Json.of(m);
    }

    /**
     * 点槽位：**走客户端交互管理器**（{@code MultiPlayerGameMode#handleInventoryMouseClick}），
     * 语义照原版（button 0/1 = 左/右键的 PICKUP；shift = QUICK_MOVE）。
     * 这一层是**第二道**越界检查（core 已先拦一道）。
     */
    @Override
    public GuiResult clickSlot(int slot, int button, boolean shift) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null || mc.gameMode == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家 / gameMode 不可用");
        }
        net.minecraft.world.inventory.AbstractContainerMenu menu = openMenu(mc);
        if (menu == null) {
            return GuiResult.fail(GuiResult.NO_SCREEN_OPEN,
                    "当前没有打开的容器界面（screen=" + screenName() + "）⇒ 没有槽位可点");
        }
        if (slot < 0 || slot >= menu.slots.size()) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE,
                    "slot=" + slot + " 越界（本档 slotCount=" + menu.slots.size() + "）");
        }
        net.minecraft.world.inventory.ClickType type = shift
                ? net.minecraft.world.inventory.ClickType.QUICK_MOVE
                : net.minecraft.world.inventory.ClickType.PICKUP;
        try {
            mc.gameMode.handleInventoryMouseClick(menu.containerId, slot, button, type, mc.player);
        } catch (Throwable t) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE, "handleInventoryMouseClick 抛异常：" + t);
        }
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("containerId", menu.containerId);
        d.put("slotCount", menu.slots.size());
        d.put("screen", mc.screen.getClass().getSimpleName());
        d.put("menuType", menuTypeOf(menu));
        return GuiResult.ok(d);
    }

    /**
     * 点控件：**照真实点击的代码路径**敲该控件的中心 —— 调界面的鼠标点击入口
     * （{@code GuiEventListener#mouseClicked(double,double,int)}，{@code Screen} 经
     * {@code ContainerEventHandler} 的默认实现把点击派发给命中的子控件）⇒ 按钮 / 页签 / 滑块都能按。
     * **不是** OS 级按键或鼠标注入。
     */
    @Override
    public GuiResult clickWidget(int index) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.screen == null) {
            return GuiResult.fail(GuiResult.NO_SCREEN_OPEN, "当前没有打开任何界面 ⇒ 没有控件可点");
        }
        java.util.List<Object> els = widgetElements(mc.screen);
        if (index < 0 || index >= els.size()) {
            return GuiResult.fail(GuiResult.WIDGET_OUT_OF_RANGE,
                    "index=" + index + " 越界（当前界面控件数=" + els.size() + "）");
        }
        Object el = els.get(index);
        if (el instanceof ClothRef) {
            return GuiResult.fail(GuiResult.WIDGET_NOT_CLICKABLE,
                    "这一项是 Cloth 配置**条目**（不是可点控件）⇒ 不假装点得动");
        }
        if (!(el instanceof net.minecraft.client.gui.components.AbstractWidget w)) {
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
        if (!w.visible || !w.isActive()) {
            return GuiResult.fail(GuiResult.WIDGET_NOT_CLICKABLE,
                    "该控件不可点（visible=" + w.visible + " active=" + w.isActive() + "）："
                            + w.getMessage().getString(), d);
        }
        double cx = w.getX() + w.getWidth() / 2.0;
        double cy = w.getY() + w.getHeight() / 2.0;
        d.put("centerX", Double.valueOf(cx));
        d.put("centerY", Double.valueOf(cy));
        d.put("clickPath", "Screen.mouseClicked(cx, cy, 0)");
        boolean accepted;
        try {
            accepted = mc.screen.mouseClicked(cx, cy, 0);
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

    /** 把玩家朝向对准一个世界坐标点（与既有 aimAt 同一口径）。 */
    private static void aimAt(Minecraft mc, double tx, double ty, double tz) {
        double dx = tx - mc.player.getX();
        double dy = ty - mc.player.getEyeY();
        double dz = tz - mc.player.getZ();
        double horiz = Math.sqrt(dx * dx + dz * dz);
        mc.player.setYRot((float) Math.toDegrees(Math.atan2(-dx, dz)));
        mc.player.setXRot((float) -Math.toDegrees(Math.atan2(dy, horiz)));
    }

    /** 触及距离（与既有 mine/mineLookingAt 同口径）：创造 5.0 / 生存 4.5。 */
    private static double reachOf(Minecraft mc) {
        return mc.player.isCreative() ? 5.0D : 4.5D;
    }

    private static String round2(double v) {
        return String.valueOf(Math.round(v * 100.0) / 100.0);
    }

    /**
     * 玩家朝目标方块**右键**（{@code use_on}）：先对准，再走 {@code useItemOn} 这条原版通路。
     * 用于开工作台 / 熔炉 / 箱子，以及按方块上的按钮。
     */
    @Override
    public GuiResult useOn(double x, double y, double z) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null || mc.level == null || mc.gameMode == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家/世界（或 gameMode 不可用）");
        }
        net.minecraft.core.BlockPos pos = new net.minecraft.core.BlockPos(
                (int) Math.floor(x), (int) Math.floor(y), (int) Math.floor(z));
        if (!mc.level.hasChunk(pos.getX() >> 4, pos.getZ() >> 4)) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "目标区块未加载：" + pos.toShortString() + " ⇒ 不假装点到了");
        }
        net.minecraft.world.phys.Vec3 eye = mc.player.getEyePosition();
        net.minecraft.world.phys.Vec3 center = new net.minecraft.world.phys.Vec3(
                pos.getX() + 0.5, pos.getY() + 0.5, pos.getZ() + 0.5);
        double dist = eye.distanceTo(center);
        double reach = reachOf(mc);
        if (dist > reach + 0.5D) {
            return GuiResult.fail(GuiResult.TARGET_TOO_FAR,
                    "够不着：" + pos.toShortString() + " 距眼睛 " + round2(dist) + " > 触及 " + reach);
        }
        // 入射面 = 从眼睛看过去最正的那一面；命中点取该面中心（不用任何未取证的方向向量 API）
        double ox = eye.x - center.x, oy = eye.y - center.y, oz = eye.z - center.z;
        double ax = Math.abs(ox), ay = Math.abs(oy), az = Math.abs(oz);
        net.minecraft.core.Direction side;
        double hx = center.x, hy = center.y, hz = center.z;
        if (ax >= ay && ax >= az) {
            side = ox >= 0 ? net.minecraft.core.Direction.EAST : net.minecraft.core.Direction.WEST;
            hx += ox >= 0 ? 0.5D : -0.5D;
        } else if (ay >= az) {
            side = oy >= 0 ? net.minecraft.core.Direction.UP : net.minecraft.core.Direction.DOWN;
            hy += oy >= 0 ? 0.5D : -0.5D;
        } else {
            side = oz >= 0 ? net.minecraft.core.Direction.SOUTH : net.minecraft.core.Direction.NORTH;
            hz += oz >= 0 ? 0.5D : -0.5D;
        }
        aimAt(mc, center.x, center.y, center.z);
        net.minecraft.world.phys.BlockHitResult bhr = new net.minecraft.world.phys.BlockHitResult(
                new net.minecraft.world.phys.Vec3(hx, hy, hz), side, pos, false);
        net.minecraft.world.InteractionResult res;
        try {
            res = mc.gameMode.useItemOn(mc.player, net.minecraft.world.InteractionHand.MAIN_HAND, bhr);
        } catch (Throwable t) {
            return GuiResult.fail(GuiResult.USE_FAILED, "交互通路抛异常：" + t);
        }
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("target", pos.toShortString());
        d.put("side", side.name());
        d.put("distance", Double.valueOf(Math.round(dist * 100.0) / 100.0));
        d.put("hit", round2(hx) + "," + round2(hy) + "," + round2(hz));
        d.put("result", String.valueOf(res));
        d.put("screen", screenName());
        if (res == null || !res.consumesAction()) {
            return GuiResult.fail(GuiResult.USE_FAILED,
                    "游戏没受理这次右键（InteractionResult 不是 consumesAction）：" + pos.toShortString(), d);
        }
        return GuiResult.ok(d);
    }

    /**
     * 玩家在目标位置**放置手持方块**（{@code place_block}）。
     *
     * <p>做法照原版：目标格必须**可替换**（否则 TARGET_NOT_PLACEABLE）、主手必须有东西
     * （否则 NO_ITEM_IN_HAND）；然后在目标格周围找一个**支撑面**，构造该面的
     * {@code BlockHitResult}（点中的是**支撑格**，面朝目标格 —— 原版就是这么把方块放到
     * 「点中面的外一格」），对准后走与 use_on 同一条 {@code useItemOn} 通路。
     */
    @Override
    public GuiResult placeBlock(double x, double y, double z) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null || mc.level == null || mc.gameMode == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家/世界（或 gameMode 不可用）");
        }
        net.minecraft.world.item.ItemStack held = mc.player.getMainHandItem();
        if (held == null || held.isEmpty()) {
            return GuiResult.fail(GuiResult.NO_ITEM_IN_HAND,
                    "主手上没有东西 ⇒ 放不了方块（先把方块选到快捷栏主手）");
        }
        net.minecraft.core.BlockPos target = new net.minecraft.core.BlockPos(
                (int) Math.floor(x), (int) Math.floor(y), (int) Math.floor(z));
        if (!mc.level.hasChunk(target.getX() >> 4, target.getZ() >> 4)) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "目标区块未加载：" + target.toShortString());
        }
        net.minecraft.world.level.block.state.BlockState cur = mc.level.getBlockState(target);
        if (!cur.canBeReplaced()) {
            return GuiResult.fail(GuiResult.TARGET_NOT_PLACEABLE,
                    "目标位置已被不可替换的方块占住（"
                            + net.minecraft.core.registries.BuiltInRegistries.BLOCK.getKey(cur.getBlock())
                            + "）：" + target.toShortString());
        }
        net.minecraft.core.Direction side = null;
        net.minecraft.core.BlockPos support = null;
        for (net.minecraft.core.Direction dir : net.minecraft.core.Direction.values()) {
            net.minecraft.core.BlockPos nb = target.relative(dir);
            if (nb.equals(target)) continue;
            if (!mc.level.hasChunk(nb.getX() >> 4, nb.getZ() >> 4)) continue;
            if (mc.level.getBlockState(nb).canBeReplaced()) continue;
            support = nb;
            side = dir.getOpposite();
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
        double dx = hx - mc.player.getX(), dy = hy - mc.player.getEyeY(), dz = hz - mc.player.getZ();
        double dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        double reach = reachOf(mc);
        if (dist > reach + 0.5D) {
            return GuiResult.fail(GuiResult.TARGET_TOO_FAR,
                    "够不着：" + target.toShortString() + " 距眼睛 " + round2(dist) + " > 触及 " + reach);
        }
        aimAt(mc, hx, hy, hz);
        net.minecraft.world.phys.BlockHitResult bhr = new net.minecraft.world.phys.BlockHitResult(
                new net.minecraft.world.phys.Vec3(hx, hy, hz), side, support, false);
        net.minecraft.world.InteractionResult res;
        try {
            res = mc.gameMode.useItemOn(mc.player, net.minecraft.world.InteractionHand.MAIN_HAND, bhr);
        } catch (Throwable t) {
            return GuiResult.fail(GuiResult.PLACE_FAILED, "放置通路抛异常：" + t);
        }
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("support", support.toShortString());
        d.put("side", side.name());
        d.put("held", net.minecraft.core.registries.BuiltInRegistries.ITEM.getKey(held.getItem()).toString());
        d.put("heldCount", Integer.valueOf(held.getCount()));
        d.put("distance", Double.valueOf(Math.round(dist * 100.0) / 100.0));
        d.put("result", String.valueOf(res));
        if (res == null || !res.consumesAction()) {
            return GuiResult.fail(GuiResult.PLACE_FAILED,
                    "放置没被游戏受理（InteractionResult 不是 consumesAction）：" + target.toShortString(), d);
        }
        d.put("placed", target.toShortString());
        return GuiResult.ok(d);
    }

    // ==================================================================
    // ⑧ [T22] select_slot / drop_item / playerMetaJson
    // 名字**逐一 javap 取证**（jar = F:\MOD_TEST\caches\forge_gradle\minecraft_user_repo\
    //   net\minecraftforge\forge\1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1\
    //   forge-1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1.jar）：
    //   javap -p net.minecraft.world.entity.player.Inventory
    //     public int selected;  public net.minecraft.world.item.ItemStack getSelected();
    //     public int getContainerSize();  public net.minecraft.world.item.ItemStack getItem(int);
    //   javap -p net.minecraft.world.inventory.Slot
    //     public final net.minecraft.world.Container container;  public int getContainerSlot();
    //   javap -p net.minecraft.world.inventory.ClickType : THROW
    //   javap -p net.minecraft.client.multiplayer.MultiPlayerGameMode
    //     public void handleInventoryMouseClick(int, int, int, net.minecraft.world.inventory.ClickType,
    //                                           net.minecraft.world.entity.player.Player);
    //     public net.minecraft.world.level.GameType getPlayerMode();
    //   javap -p net.minecraft.world.entity.player.Player : public final net.minecraft.world.inventory.InventoryMenu inventoryMenu;
    //   javap -p net.minecraft.world.entity.player.Abilities : public boolean flying; public boolean mayfly;
    //   javap -p net.minecraft.world.level.storage.WorldData : public abstract boolean getAllowCommands();
    //   javap -p net.minecraft.world.level.GameType : public java.lang.String getName();
    // ==================================================================

    /**
     * [T22] {@code select_slot}：把选中快捷栏槽位切到 {@code slot}（0..8）。
     * 本档是 **{@code Inventory.selected} 公开字段**（与 fabric 的 {@code setSelectedSlot} 方法不同源）。
     */
    @Override
    public GuiResult selectSlot(int slot) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家 ⇒ 切不了选中槽");
        }
        net.minecraft.world.entity.player.Inventory inv = mc.player.getInventory();
        if (inv == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有物品栏 ⇒ 切不了选中槽");
        }
        if (slot < 0 || slot > 8) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE, "slot=" + slot + " 越界（快捷栏 0..8）");
        }
        int prev = inv.selected;
        inv.selected = slot;
        int now = inv.selected;
        net.minecraft.world.item.ItemStack main = inv.getSelected();
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("previousSlot", Integer.valueOf(prev));
        d.put("selectedSlot", Integer.valueOf(now));
        d.put("mainHand", (main == null || main.isEmpty()) ? null : stackJson(now, main));
        d.put("previousChanged", Boolean.valueOf(prev != now));
        d.put("note", "走本档 Inventory.selected 公开字段；selectedSlot 是切换后**复读**的值");
        return GuiResult.ok(d);
    }

    // ==================================================================
    // ⑨ [T39-①] select_slot 的**服务端同步**
    //
    // 真机铁证（2026-11-19，forge 1.20.1 生存）：select_slot{slot:1} 后服务端仍认为玩家空手
    // ⇒ 挖石头走"空手破坏"分支 ⇒ 石头不掉 cobblestone（requiresDroppedTool），泥土/原木照掉。
    // 根因：Inventory.selected 是**客户端本地字段**，原版另有一条包把它同步给服务端。
    //
    // 取证（jar = F:\MOD_TEST\caches\forge_gradle\minecraft_user_repo\net\minecraftforge\forge\
    //        1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1\...jar）：
    //   javap -p net.minecraft.network.protocol.game.ServerboundSetCarriedItemPacket
    //     public ServerboundSetCarriedItemPacket(int);            ← 构造器只吃一个 int
    //     public int getSlot();
    //   javap -p net.minecraft.client.multiplayer.ClientPacketListener
    //     public void send(net.minecraft.network.protocol.Packet<?>);   ← 发包口
    //   javap -p -c net.minecraft.client.multiplayer.MultiPlayerGameMode
    //     private void ensureHasSentCarriedItem();
    //       ... getfield Inventory.selected:I ... istore_1
    //           if_icmpeq 45                              ← 与 carriedIndex 比，相等就什么都不做
    //           putfield carriedIndex:I                   ← **先记下**已发出的下标
    //           new ServerboundSetCarriedItemPacket / dup / getfield carriedIndex / invokespecial <init>(I)
    //           invokevirtual ClientPacketListener.send(Packet)     ← 原版就走这一条
    //     （字节码偏移 0-45，见交付报告的 javap 摘录）
    //   ⇒ 我们做**同一件事**：改 selected 字段 → 构造那个包 → 从 connection 发出去。
    //     与 ensureHasSentCarriedItem 唯一差别是**不比对 carriedIndex**（我们要强制发一次），
    //     所以服务端一定收到新槽位（这正是缺陷 A 要的）。
    // ==================================================================

    @Override public boolean slotSyncCapable() { return true; }

    @Override
    public GuiResult setSelectedSlotSynced(int slot) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家 ⇒ 切不了选中槽");
        }
        net.minecraft.world.entity.player.Inventory inv = mc.player.getInventory();
        if (inv == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有物品栏 ⇒ 切不了选中槽");
        }
        if (slot < 0 || slot > 8) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE, "slot=" + slot + " 越界（快捷栏 0..8）");
        }
        int prev = inv.selected;
        inv.selected = slot;                       // ① 客户端字段（原版 handleKeybinds 也这么改）
        int now = inv.selected;
        net.minecraft.world.item.ItemStack main = inv.getSelected();
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("previousSlot", Integer.valueOf(prev));
        d.put("selectedSlot", Integer.valueOf(now));
        d.put("mainHand", (main == null || main.isEmpty()) ? null : stackJson(now, main));
        d.put("previousChanged", Boolean.valueOf(prev != now));
        d.put("syncRoute", "ServerboundSetCarriedItemPacket -> ClientPacketListener.send(Packet)");
        d.put("syncRouteNote", "与原版 MultiPlayerGameMode#ensureHasSentCarriedItem 同源同路"
                + "（javap -c 偏移 0-45）；差别只有：我们**不比对** carriedIndex，强制发一次");

        // ② 服务端同步：**没有连接就如实说没发**，绝不假装
        net.minecraft.client.multiplayer.ClientPacketListener conn = mc.getConnection();
        if (conn == null) {
            d.put("packetSent", Boolean.FALSE);
            d.put("packetClass", null);
            d.put("packetSendError", "mc.getConnection() == null（还没进世界 / 单人菜单）");
            return GuiResult.ok(d);
        }
        try {
            conn.send(new net.minecraft.network.protocol.game.ServerboundSetCarriedItemPacket(now));
            d.put("packetSent", Boolean.TRUE);
            d.put("packetClass", "ServerboundSetCarriedItemPacket");
            d.put("packetSlot", Integer.valueOf(now));
        } catch (Throwable t) {
            d.put("packetSent", Boolean.FALSE);
            d.put("packetClass", "ServerboundSetCarriedItemPacket");
            d.put("packetSendError", String.valueOf(t));
        }
        return GuiResult.ok(d);
    }

    // ==================================================================
    // ⑩ [T39-②③ / T41] walk_to 的移动面（**驱动原版 KeyMapping，只释放自己按过的键**）
    //
    // 取证（forge-1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1.jar + T40 真机）：
    //   javap -c -p net.minecraft.client.player.KeyboardInput
    //     LocalPlayer.input 运行时是 KeyboardInput；LocalPlayer#aiStep() 先调 input.tick(ZF)，
    //     KeyboardInput#tick 从 Options.keyUp/keyDown/keyLeft/keyRight/keyJump/keyShift.isDown()
    //     重算并覆写 forwardImpulse / leftImpulse / jumping（calculateImpulse(left,right)：
    //     left=+1, right=-1）。此前在 ClientTickEvent END 直接写 Input 字段会在下一 tick 被清空。
    //   javap -c -p net.minecraft.client.KeyMapping / KeyConflictContext$3 / Minecraft#setWindowActive
    //     KeyMapping#isDown() 查 isDown && isConflictContextAndModifierActive()，
    //     IN_GAME.isActive() 只查 !GUI.isActive()（无界面打开），不查 windowActive；
    //     因此 pauseOnLostFocus=false 且 mc.screen==null 时，后台失焦窗口也可正常驱动移动。
    //   记账式释放：walkHeld[5] 只记 walkDrive 自己按下的移动键，不误清真人按下的键；
    //   PlaytestCore 同步把这些键记进 Arbitration.owned，避免 AUTO 模式自触发让位。
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
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null || mc.options == null) return false;
        // 界面开着时 KeyConflictContext.IN_GAME.isActive() 为 false，按键不生效 ⇒ 不假装在走
        if (mc.screen != null) return false;
        LocalPlayer p = mc.player;
        boolean[] want = {
            forward > 0.05f,
            forward < -0.05f,
            strafe > 0.05f,
            strafe < -0.05f,
            jump
        };
        net.minecraft.client.KeyMapping[] keys = {
            mc.options.keyUp,
            mc.options.keyDown,
            mc.options.keyLeft,
            mc.options.keyRight,
            mc.options.keyJump
        };
        for (int i = 0; i < keys.length; i++) {
            if (keys[i] == null) continue;
            if (want[i]) {
                keys[i].setDown(true);
                walkHeld[i] = true;
            } else if (walkHeld[i]) {
                keys[i].setDown(false);
                walkHeld[i] = false;
            }
        }
        if (!Float.isNaN(yaw)) {
            p.setYRot(yaw);
        }
        return true;
    }

    @Override
    public void walkStop() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.options == null) {
            java.util.Arrays.fill(walkHeld, false);
            return;
        }
        net.minecraft.client.KeyMapping[] keys = {
            mc.options.keyUp,
            mc.options.keyDown,
            mc.options.keyLeft,
            mc.options.keyRight,
            mc.options.keyJump
        };
        for (int i = 0; i < keys.length; i++) {
            if (walkHeld[i] && keys[i] != null) {
                keys[i].setDown(false);
            }
            walkHeld[i] = false;
        }
    }

    @Override
    public Boolean playerOnGround() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null) return null;
        return Boolean.valueOf(mc.player.onGround());
    }

    /**
     * [T22] {@code drop_item}：丢物品栏 {@code slot}（= {@code query_inventory} 的下标空间；
     * &lt;0 ⇒ 当前选中槽）。走与 {@code click_slot} **同一条**客户端交互管理器通路
     * （{@code handleInventoryMouseClick}），用原版 {@code ClickType.THROW}（button 0=一个、1=整叠）。
     * 目标格按 **Slot 的容器同一性 + getContainerSlot()** 找（不靠版式 / 槽号硬编码）。
     *
     * <p>[T35] **目标菜单 = {@code player.containerMenu}**（不再在无屏时改用
     * {@code player.inventoryMenu}）—— 理由见方法体内注释：原版点击的判据就是
     * {@code player.containerMenu.containerId}，用别的菜单会**被静默丢弃**。
     * 回执里的 {@code verified} 一律 false（真实的落地判据由 core 在 ≥5 tick 后复读该格给出）。
     */
    @Override
    public GuiResult dropItem(int slot, int count, boolean all) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null || mc.gameMode == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有玩家 / gameMode 不可用");
        }
        net.minecraft.world.entity.player.Inventory inv = mc.player.getInventory();
        if (inv == null) return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有物品栏");
        int size = inv.getContainerSize();
        if (slot < 0) slot = inv.selected;
        if (slot < 0 || slot >= size) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE,
                    "slot=" + slot + " 越界（本档物品栏 size=" + size + "）");
        }
        // [T35] **必须**用客户端**当前真正打开的那个菜单**（player.containerMenu）——
        // 因为 MultiPlayerGameMode#handleInventoryMouseClick 的判据就是
        //   if (pContainerId != pPlayer.containerMenu.containerId) { LOGGER.warn("Ignoring click in
        //     mismatching container..."); } else { menu.clicked(...); connection.send(...); }
        // 不等时**只记一条 WARN 就丢掉这一击**（CFR 反编译 1.20.1 件 MultiPlayerGameMode.java:489-509，
        // 守卫在 :491-492）。旧写法在没开容器界面时改用 player.inventoryMenu（containerId=0）：
        // close_screen 只 mc.setScreen(null)（不走 AbstractContainerScreen#onClose ⇒ 不发关闭包、
        // 不重置 containerMenu；Player#closeContainer 才会重置）⇒ containerMenu 可能仍是上一个容器对象，
        // 两个 containerId 不相等 ⇒ 点击被静默丢弃，而旧回执照报成功（真机 L4 2026-11-12 铁证）。
        // 改用 containerMenu 后 menu 与判据**同源** ⇒ 不可能再错配。
        net.minecraft.world.inventory.AbstractContainerMenu menu = mc.player.containerMenu;
        if (menu == null) {
            return GuiResult.fail(GuiResult.NOT_IN_WORLD, "没有可用的物品栏菜单（player.containerMenu=null）");
        }
        int menuSlot = -1;
        for (int i = 0; i < menu.slots.size(); i++) {
            net.minecraft.world.inventory.Slot s = menu.slots.get(i);
            if (s.container == inv && s.getContainerSlot() == slot) { menuSlot = i; break; }
        }
        if (menuSlot < 0) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE,
                    "slot=" + slot + " 在**当前菜单**里找不到对应的格子（开着容器时 armour/offhand 不在该菜单）"
                            + " ⇒ 先 press inventory / use_on 打开含该格的菜单，或换菜单里确实有的下标");
        }
        net.minecraft.world.item.ItemStack before = menu.slots.get(menuSlot).getItem();
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("slot", Integer.valueOf(slot));
        d.put("menuSlot", Integer.valueOf(menuSlot));
        d.put("containerId", Integer.valueOf(menu.containerId));   // [T35] 实际被点的那个菜单 id（诊断用）
        d.put("menuSource", "player.containerMenu");               // [T35] 与 handleInventoryMouseClick 的判据同源
        if (before == null || before.isEmpty()) {
            d.put("count", Integer.valueOf(0));
            d.put("empty", Boolean.TRUE);
            d.put("remaining", Integer.valueOf(0));
            d.put("id", null);
            d.put("droppedId", null);
            d.put("note", "该格**本来就是空的** ⇒ 没丢任何东西（empty=true / count=0，不是错误）");
            return GuiResult.ok(d);
        }
        String droppedId = net.minecraft.core.registries.BuiltInRegistries.ITEM.getKey(before.getItem()).toString();
        int stackCount = before.getCount();
        // [T36] **必须在点击前**记下数量：原版对「部分丢弃」走 ItemStack.split → shrink，
        // 那是**就地改同一个 ItemStack 对象**（slot 里还是同一个引用）⇒ 点击后再读 before.getCount()
        // 读到的已经是改小之后的值，比对会永远相等、校验永远通过（这条是落地校验成立的前提）。
        int beforeCount = stackCount;
        int want = (all || count < 0) ? stackCount : Math.min(count, stackCount);
        boolean whole = want >= stackCount;
        int button = whole ? 1 : 0;             // 原版 THROW：0=丢一个，1=丢整叠
        try {
            if (whole) {
                mc.gameMode.handleInventoryMouseClick(menu.containerId, menuSlot, button,
                        net.minecraft.world.inventory.ClickType.THROW, mc.player);
            } else {
                // 原版只有「丢一个 / 丢整叠」两档 ⇒ 中间的 count 只能连点「丢一个」。
                for (int k = 0; k < want; k++) {
                    mc.gameMode.handleInventoryMouseClick(menu.containerId, menuSlot, 0,
                            net.minecraft.world.inventory.ClickType.THROW, mc.player);
                }
            }
        } catch (Throwable t) {
            return GuiResult.fail(GuiResult.SLOT_OUT_OF_RANGE, "THROW 点击抛异常：" + t);
        }
        net.minecraft.world.item.ItemStack after = menu.slots.get(menuSlot).getItem();
        int afterCount = (after == null || after.isEmpty()) ? 0 : after.getCount();  // [T36] 同一 tick 复读
        // 注意：before 是**同一个** ItemStack 引用，部分丢弃时它被就地 shrink 过
        // ⇒ 数量已在点击前存进 beforeCount（见上），这里绝不能再读 before.getCount()。
        boolean empty = after == null || after.isEmpty();
        // [T36] **落地校验（同 tick）**：原版客户端 THROW 分支在 handleInventoryMouseClick 里**同步**
        // 调 menu.clicked(...) —— 也就是先把**本地栈**改掉、再把包发给服务端。所以点击返回之后立刻复读
        // 该格，读到的是「本地已落地」的真值：一格都没少 ⇒ 这一击根本没落到菜单上。
        // 因此**不需要**跨 tick 状态机：跨 tick 会引入「等几 tick / 超时算谁」的一整套复杂度，
        // 而本地栈是同步改的，同 tick 复读本身就是有效判据（服务端拒绝只是额外一层，稍后体现为回滚）。
        int delta = beforeCount - afterCount;          // 实际少掉的数量
        d.put("before", Integer.valueOf(beforeCount));
        d.put("after", Integer.valueOf(afterCount));
        d.put("dropped", Integer.valueOf(delta));      // [T36] 实际少掉多少（!= count 时就是部分落地）
        d.put("count", Integer.valueOf(want));
        d.put("empty", Boolean.valueOf(empty));
        d.put("remaining", Integer.valueOf(empty ? 0 : after.getCount()));
        d.put("id", empty ? null
                : net.minecraft.core.registries.BuiltInRegistries.ITEM.getKey(after.getItem()).toString());
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
                            + "两条最可能的原因：① 菜单 id 不匹配 —— 原版 handleInventoryMouseClick 发现"
                            + " containerId 与会话里的不一致时**只记一条 WARN 就丢掉这一击**；"
                            + "② 服务端拒绝（容器只读 / 该格被服务端锁住 / 权限不足）。"
                            + "下一步：先 press inventory 或 use_on 把菜单**重新打开**（菜单对象与 id 一起刷新），"
                            + "再丢；若仍不落地，换菜单里确实有的 slot。"
                            + "诊断：slot=" + slot + " menuSlot=" + menuSlot + " containerId=" + menu.containerId
                            + " menuSource=player.containerMenu before=" + beforeCount
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
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null) return null;
        Map<String, Object> m = new LinkedHashMap<>();
        String gm = null;
        if (mc.gameMode != null && mc.gameMode.getPlayerMode() != null) {
            gm = mc.gameMode.getPlayerMode().getName();   // 原版枚举名（survival/creative/adventure/spectator）
        }
        m.put("gameMode", gm);
        m.put("flying", Boolean.valueOf(mc.player.getAbilities().flying));
        m.put("canFly", Boolean.valueOf(mc.player.getAbilities().mayfly));
        Boolean cheats = null;                            // 多人服拿不到 ⇒ null（不编）
        if (mc.hasSingleplayerServer()) {
            net.minecraft.server.MinecraftServer s = mc.getSingleplayerServer();
            if (s != null && s.getWorldData() != null) {
                cheats = Boolean.valueOf(s.getWorldData().getAllowCommands());
            }
        }
        m.put("cheats", cheats);
        m.put("note", "gameMode 取自 MultiPlayerGameMode#getPlayerMode（原版枚举名）；"
                + "flying/canFly 取自 Abilities.flying/mayfly；"
                + "cheats = 本机集成服务器 WorldData#getAllowCommands（多人服拿不到 ⇒ null）");
        return Json.of(m);
    }
}
