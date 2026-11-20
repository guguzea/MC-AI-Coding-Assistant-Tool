package com.bandd.playtest.neoforge_1_21_5;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;
import net.minecraft.client.Minecraft;
import net.minecraft.client.Screenshot;
import net.minecraft.client.player.LocalPlayer;
import net.minecraft.client.gui.screens.ConnectScreen;
import net.minecraft.client.gui.screens.LevelLoadingScreen;
import net.minecraft.client.gui.screens.ReceivingLevelScreen;
import net.minecraft.client.server.IntegratedServer;

import java.io.File;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * NeoForge 1.21.5 适配层（mojmap 名）。
 *
 * **名字来源**：仓库已核实的 forge/neoforge 档表（reference/generators/playtest-driver.ts:98-171）
 * + NeoForge 改写表（同文件 :1745-1789：NeoForge.EVENT_BUS / ClientTickEvent$Post / options.keyUp 系）
 * + 本档真编译复核。运行期行为未核实。
 *
 * ⚠️ 与 fabric 档的差异（同一个 core，换一层 adapter 就够）：
 *   MinecraftClient→Minecraft、ClientPlayerEntity→LocalPlayer、
 *   options.forwardKey→options.keyUp、setPressed→setDown、isPressed→isDown、
 *   runDirectory→gameDirectory、getFramebuffer→getMainRenderTarget、
 *   getNetworkHandler→getConnection、currentScreen→screen、getRegistryKey→dimension()、
 *   ResourceKey 用 **location()**（javap 实测本档存在；identifier() 自 1.21.11 起才改名）
 */
public final class NeoForgeAdapter implements GameBridge {

    private static final List<String> KEYS = Arrays.asList(
            "forward", "back", "left", "right", "jump", "sneak", "sprint", "attack", "use", "inventory");

    @Override
    public String platform() { return "neoforge"; }

    @Override
    public String mcVersion() { return "1.21.5"; }

    @Override
    public boolean ready() {
        Minecraft mc = Minecraft.getInstance();
        return mc != null && mc.player != null && mc.level != null;
    }

    /**
     * 本机客户端当前阶段。判据逐条 javap 取证（本档合并件，见类头注释）：
     *   Minecraft.level / Minecraft.screen 字段、hasSingleplayerServer()、getSingleplayerServer():IntegratedServer；
     *   net.minecraft.client.gui.screens.{ConnectScreen,ReceivingLevelScreen,LevelLoadingScreen} 均为 public。
     * ⚠ 不用 getConnection() 当判据：它等价于 player==null?null:player.connection，单人世界同样非 null ⇒ 区分不了单机/多人。
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
     * 本机集成服务器当前实际监听的端口。javap 取证（本档合并件）：
     *   IntegratedServer.isPublished():boolean / getPort():int 存在；Minecraft.getSingleplayerServer():IntegratedServer。
     * 没开局域网 / 不是本机集成服务器 / 取不到 ⇒ 0。
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
    public void tick() {
        // core 的队列在 PlaytestCore.onTick 里排空；这里额外推进挖矿进度（本轮 fix 4/5）。
        Minecraft mc = Minecraft.getInstance();
        if (this.mining == null || mc == null || mc.level == null || mc.gameMode == null) return;
        if (mc.level.getBlockState(this.mining).isAir()) { this.mining = null; return; }
        mc.gameMode.continueDestroyBlock(this.mining, this.miningDir);   // [T20-①] **不看返回值**（vanilla 在 destroyDelay/cooldown 未到的分支也回 true ⇒ 拿它当「已挖穿」会在第一 tick 清空目标）；收工只看上面那个 isAir
    }

    /** 挖矿目标（跨 tick 持续破坏用）。 */
    private net.minecraft.core.BlockPos mining = null;
    private net.minecraft.core.Direction miningDir = null;

    /** 关掉当前界面：界面开着时 MC 不处理输入（press 静默失效），实测位移恒 0。 */
    @Override
    public boolean closeScreen() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return false;
        if (mc.screen == null) return true;
        mc.setScreen(null);
        return true;
    }

    /**
     * 破坏准星所指方块：**开始**破坏（走正常进度），随后由 tick() 逐帧推进。
     * 同一目标**幂等** —— 重发 startDestroyBlock 会把破坏进度清零（真机实测：反复调用永远挖不动）。
     */
    @Override
    public String mineLookingAt() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null || mc.level == null) return null;
        // 取目标方块：主路 = 自算射线（与渲染无关）；备用 = 渲染路径（mc 的 hitResult / crosshairTarget）。
        // reach 按游戏模式：创造 5.0 / 生存 4.5。名字出处 = javap -p -cp <本档 merged/映射件>: Entity.getEyePosition(float)/getViewVector(float); Player.isCreative(); BlockGetter.clip(ClipContext); ClipContext.Block.OUTLINE/Fluid.NONE; Minecraft.hitResult
        net.minecraft.world.phys.Vec3 eye = mc.player.getEyePosition(1.0F);
        double reach = mc.player.isCreative() ? 5.0D : 4.5D;
        net.minecraft.world.phys.Vec3 end = eye.add(mc.player.getViewVector(1.0F).scale(reach));
        net.minecraft.world.phys.BlockHitResult bhr = mc.level.clip(new net.minecraft.world.level.ClipContext(
                eye, end, net.minecraft.world.level.ClipContext.Block.OUTLINE,
                net.minecraft.world.level.ClipContext.Fluid.NONE, mc.player));
        if (bhr == null || bhr.getType() != net.minecraft.world.phys.HitResult.Type.BLOCK) {
            if (mc.hitResult instanceof net.minecraft.world.phys.BlockHitResult hb && hb.getType() == net.minecraft.world.phys.HitResult.Type.BLOCK) {
                bhr = hb;
            } else {
                return null;
            }
        }
        net.minecraft.core.BlockPos pos = bhr.getBlockPos();
        if (!pos.equals(this.mining)) {
            this.mining = pos;
            this.miningDir = bhr.getDirection();
            mc.gameMode.startDestroyBlock(pos, this.miningDir);
        }
        return pos.getX() + "," + pos.getY() + "," + pos.getZ();
    }

    @Override
    public List<String> supportedKeys() { return KEYS; }

    /** 逻辑键 → mojmap 的 Options 字段（见 playtest-driver.ts:169）。 */
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
        // ⚠ MC 的「点击类」动作（挖矿/放置/开背包）靠 consumeClick 启动，
        // 而 setDown() **不累加点击计数** ⇒ 不补一次 click 则这些动作永不触发。
        if (down) net.minecraft.client.KeyMapping.click(k.getKey());
        k.setDown(down);
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

    /** 1.21.5 形态：Screenshot.grab(File, RenderTarget, Consumer) —— 第一参数是 gameDirectory，不是 Minecraft 实例
 *  （名字来源 playtest-driver.ts:152；本注释曾被写错成 grab(Minecraft,…)，2026-10-31 由子代理实测指出后改正）。 */
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

    /**
     * 进世界。名字来源 = 仓库已核实的 neoforge 1.20.6+ 改写表（playtest-driver.ts:1714-1719，javap 实测 2026-10-01）：
     * 1.20.5+ 起 `WorldOpenFlows.loadLevel(Screen,String)` 已删，入口改名 `openWorld(String, Runnable)`。
     * （我第一次写成了未改写的基串 `loadLevel(null, world)` ⇒ 编译报「找不到符号」，由该表纠正。）
     */
    @Override
    public void openWorld(String worldName) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return;
        mc.createWorldOpenFlows().openWorld(worldName, () -> { });
    }

    // ================= 化身（第二个角色）=================
    // 权威名来源：javap neoforge-21.11.45-merged.jar（2026-11-01）
    //   FakePlayerFactory.get(ServerLevel, GameProfile) -> FakePlayer（extends ServerPlayer）
    //   ServerLevel.addNewPlayer(ServerPlayer) -> private addPlayer -> entityManager.addNewEntity
    //     ⇒ ChunkMap 广播生成包给**真人客户端**（走真人的连接，不走假玩家的假连接）⇒ 可见
    //   ServerPlayer.teleportTo(double,double,double) / setGameMode(GameType)
    //   ServerLevel.removePlayerImmediately(ServerPlayer, Entity.RemovalReason)
    private Object bot;
    private boolean botIsMannequin;

    // ---- 聊天桥（事件在入口 PlaytestMod 里挂，这里只做缓冲）----
    private final java.util.Deque<String> chatInbox = new java.util.concurrent.ConcurrentLinkedDeque<>();

    /** 由入口的聊天事件回调推入。 */
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

        // ① 首选：服务端假玩家（有物品栏、能以玩家身份破坏/放置）
        String why = "unknown";
        if (!mc.hasSingleplayerServer()) {
            why = "hasSingleplayerServer()=false（不是单人/局域网世界）";
        } else {
            net.minecraft.server.MinecraftServer server = mc.getSingleplayerServer();
            if (server == null) {
                why = "getSingleplayerServer()=null";
            } else {
                // ⚠ 真机教训（2026-11-01）：mc.player.level() 是**客户端** ClientLevel，
                //   永远不是 ServerLevel ⇒ 必须从 server 侧按维度取关卡。
                net.minecraft.server.level.ServerLevel level = server.getLevel(mc.player.level().dimension());
                if (level == null) {
                    why = "server.getLevel(维度) 返回 null";
                } else {
                    com.mojang.authlib.GameProfile profile = new com.mojang.authlib.GameProfile(
                            java.util.UUID.nameUUIDFromBytes(("bandd_playtest:" + name).getBytes(java.nio.charset.StandardCharsets.UTF_8)),
                            name);
                    net.neoforged.neoforge.common.util.FakePlayer fp =
                            net.neoforged.neoforge.common.util.FakePlayerFactory.get(level, profile);
                    fp.setGameMode(net.minecraft.world.level.GameType.SURVIVAL);
                    fp.setPos(x, y, z);
                    level.addNewPlayer(fp);      // ⇒ 可见（ChunkMap 广播给真人客户端）
                    // 补「玩家票据」，否则化身周围**不加载区块**（它不在 PlayerList，没人替它发票据）。
                    // 本档 TicketType 已三拆：PLAYER_SPAWN / PLAYER_LOADING / PLAYER_SIMULATION（javap 实测，自 1.21.5 起）。
                    try {
                        level.getChunkSource().addTicketWithRadius(
                                net.minecraft.server.level.TicketType.PLAYER_LOADING,
                                new net.minecraft.world.level.ChunkPos(fp.blockPosition()), 3);
                    } catch (Throwable t) {
                        System.err.println("[bandd-playtest] 化身票据失败: " + t);
                    }
                    bot = fp;
                    botIsMannequin = false;
                    return "fake_player";
                }
            }
        }
        // ② 退路：mannequin（玩家形状、无连接玩家的化身；1.21.9+）—— **不静默**，把原因带回给调用方
        chatCommand("summon minecraft:mannequin " + x + " " + y + " " + z
                + " {Tags:[\"bandd_bot\"],CustomName:'\"" + name + "\"',CustomNameVisible:1b}");
        bot = null;
        botIsMannequin = true;
        return "mannequin: " + why;
    }

    /**
     * 把**化身的物品栏**开到**真人**屏幕上。
     * 为什么能这么绕：假玩家自己开不了 GUI（FakePlayer.openMenu 的字节码就是 `return OptionalInt.empty()`），
     * 但"开 GUI"本质是给**某个客户端**发 ClientboundOpenScreenPacket ⇒ 发给真人的连接即可。
     * 用 MenuType.GENERIC_9x4（4×9=36 格，正好等于玩家物品栏 36 格）；客户端会据此建一个 36 格 ChestMenu，
     * 槽位序号与本地菜单一一对应 ⇒ 内容随 broadcastChanges 实时同步。
     */
    private int botTickCounter = 0;
    private int botPickedUp = 0;

    /**
     * 显式补上化身"活着"的那部分。
     * **根因（javap 实测）**：FakePlayer.tick() 的字节码只有 `return`（NeoForge 置空）⇒ 玩家自身的
     * 捡拾/物理/饥饿逻辑永不运行。这里每 5 tick 把附近掉落物喂给它：ItemEntity.playerTouch(Player) 是 public。
     */
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

    // ================= 化身的"玩家功能" =================
    // 形状**复用仓库已核实的 driver 调用**（playtest-driver.ts:722/826/827）：
    //   客户端侧 MultiPlayerGameMode.destroyBlock(BlockPos) / useItemOn(Player, hand, BlockHitResult) / useItem(...)
    // ⇒ 服务端对应物 = ServerPlayerGameMode 的同名方法（javap 实测 1.21.5 全在）。
    // id 类名按本档口径：**ResourceLocation**（javap 实测本档无 net.minecraft.resources.ResourceLocation；Identifier 自 1.21.11 起才有）。

    @Override
    public String giveBot(String item, int count) {
        if (!(bot instanceof net.minecraft.server.level.ServerPlayer bp)) return null;
        net.minecraft.resources.ResourceLocation id = net.minecraft.resources.ResourceLocation.tryParse(item);
        if (id == null || !net.minecraft.core.registries.BuiltInRegistries.ITEM.containsKey(id)) return null;
        // 本档 Registry 按 id 取实例用 getValue(ResourceLocation)（javap 实测）。
        bp.getInventory().add(new net.minecraft.world.item.ItemStack(
                net.minecraft.core.registries.BuiltInRegistries.ITEM.getValue(id), count));
        return count + "x " + item;
    }
    /** 本机玩家转视角（look）。写法候选 D-yarn-fields；判据 = javac rc=0。 */
    @Override public boolean look(double yaw, double pitch) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null) return false;
        mc.player.setYRot((float) yaw);
        mc.player.setXRot((float) pitch);
        return true;
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

    /** 把化身转向某个世界坐标（MC 的 yaw/pitch 约定）。 */
    private static void aimAt(net.minecraft.server.level.ServerPlayer bp, double tx, double ty, double tz) {
        double dx = tx - bp.getX();
        double dy = ty - bp.getEyeY();
        double dz = tz - bp.getZ();
        double horiz = Math.sqrt(dx * dx + dz * dz);
        bp.setYRot((float) Math.toDegrees(Math.atan2(-dx, dz)));
        bp.setXRot((float) -Math.toDegrees(Math.atan2(dy, horiz)));
    }

    /** 开关本机服务端认证（javap 实测 MinecraftServer.setUsesAuthentication(boolean) 是 public）。 */
    @Override
    public boolean setServerAuth(boolean online) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || !mc.hasSingleplayerServer()) return false;
        net.minecraft.server.MinecraftServer s = mc.getSingleplayerServer();
        if (s == null) return false;
        s.setUsesAuthentication(online);
        return true;
    }

    /** 作为真客户端连服务器/局域网世界（javap 实测：ConnectScreen.startConnecting + ServerAddress.parseString）。 */
    @Override
    public void joinServer(String address) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return;
        net.minecraft.client.multiplayer.resolver.ServerAddress addr =
                net.minecraft.client.multiplayer.resolver.ServerAddress.parseString(address);
        net.minecraft.client.multiplayer.ServerData data = new net.minecraft.client.multiplayer.ServerData(
                "bandd-bot", address, net.minecraft.client.multiplayer.ServerData.Type.OTHER);
        net.minecraft.client.gui.screens.ConnectScreen.startConnecting(
                mc.screen, mc, addr, data, false, null);
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

    /** 只读的 36 格视图：槽位直接映射到化身自己的 Inventory。 */
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

        /** 只读查看：暂不允许把东西搬进化身（要搬得另做白名单）。 */
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
                level.getChunkSource().removeTicketWithRadius(
                        net.minecraft.server.level.TicketType.PLAYER_LOADING,
                        new net.minecraft.world.level.ChunkPos(sp.blockPosition()), 3);
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
}
