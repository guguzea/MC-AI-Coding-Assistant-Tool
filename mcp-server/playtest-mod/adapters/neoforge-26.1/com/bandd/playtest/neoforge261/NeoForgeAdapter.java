package com.bandd.playtest.neoforge261;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;
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
 * NeoForge 26.1 适配层（mojmap 名）。与 1.21.11 档同一个 core，只换这一层。
 *
 * 名字来源（逐条 javap 实测，非记忆）：javap minecraft-patched-26.1.2.114-merged.jar(2026-11-01): ResourceKey.identifier() / TicketType.PLAYER_LOADING（无 PLAYER）/ addTicketWithRadius / Registry.getValue(Identifier) / startConnecting 6 参 / Minecraft.screen 字段 + getMainRenderTarget() / Screenshot.grab(File,RenderTarget,Consumer)
 *
 * 与 1.21.11 档的差异（本档取值 → 1.21.11 取值）：
 *   id 类 Identifier → Identifier ｜ 注册表取值 Registry.getValue(id) → getValue(Identifier)
 *   ResourceKey.identifier() → identifier() ｜ 区块票据 TicketType.PLAYER_LOADING → PLAYER_LOADING
 *   票据 API addTicketWithRadius/removeTicketWithRadius → addTicketWithRadius ｜ 进世界 WorldOpenFlows.openWorld → openWorld
 *   截图 grab(File,RenderTarget,Consumer) → Screenshot.grab(Minecraft,boolean) ｜ 当前界面 mc.screen → mc.gui.screen()
 *   客户端/服务端 tick ClientTickEvent/ServerTickEvent $Post → ClientTickEvent.Post / ServerTickEvent.Post
 */
public final class NeoForgeAdapter implements GameBridge {

    private static final List<String> KEYS = Arrays.asList(
            "forward", "back", "left", "right", "jump", "sneak", "sprint", "attack", "use", "inventory");

    @Override
    public String platform() { return "neoforge"; }

    @Override
    public String mcVersion() { return "26.1"; }

    @Override
    public boolean ready() {
        Minecraft mc = Minecraft.getInstance();
        return mc != null && mc.player != null && mc.level != null;
    }

    /**
     * 本机客户端当前阶段。判据逐条 javap 取证（本档合并件，见类头注释）：
     *   Minecraft.level / Minecraft.screen 字段、hasSingleplayerServer()、getSingleplayerServer():IntegratedServer；
     *   net.minecraft.client.gui.screens.{ConnectScreen,LevelLoadingScreen} 均为 public。
     *   ⚠ 本档已无 ReceivingLevelScreen（javap 取证：合并件无该类；1.21.10 起其职责并入 LevelLoadingScreen +
     *     NeoForge DimensionTransitionScreenManager）⇒ connecting 只判这两类；登录收包那一刻的屏未纳入 // TODO(未核实)。
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
        m.put("dimension", mc.level == null ? null : mc.level.dimension().identifier().toString());
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
        mc.createWorldOpenFlows().openWorld(worldName, () -> { });
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
                    net.neoforged.neoforge.common.util.FakePlayer fp =
                            net.neoforged.neoforge.common.util.FakePlayerFactory.get(level, profile);
                    fp.setGameMode(net.minecraft.world.level.GameType.SURVIVAL);
                    fp.setPos(x, y, z);
                    level.addNewPlayer(fp);
                    try {
level.getChunkSource().addTicketWithRadius(
                            net.minecraft.server.level.TicketType.PLAYER_LOADING,
                            chunkOf(fp.blockPosition()), 3);
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
        net.minecraft.resources.Identifier id = net.minecraft.resources.Identifier.tryParse(item);
        if (id == null || !net.minecraft.core.registries.BuiltInRegistries.ITEM.containsKey(id)) return null;
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
level.getChunkSource().removeTicketWithRadius(
                        net.minecraft.server.level.TicketType.PLAYER_LOADING,
                        chunkOf(sp.blockPosition()), 3);
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
