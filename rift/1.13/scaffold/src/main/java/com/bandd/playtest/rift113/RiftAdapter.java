package com.bandd.playtest.rift113;

import com.bandd.playtest.core.GameBridge;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import net.minecraft.block.Block;
import net.minecraft.block.state.IBlockState;
import net.minecraft.client.GameSettings;
import net.minecraft.client.Minecraft;
import net.minecraft.client.settings.KeyBinding;
import net.minecraft.util.ScreenShotHelper;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.World;
import net.minecraft.world.WorldSettings;

/**
 * Rift **1.13（原生档）** 适配层 —— **MC 侧已实现**（L-b）。
 *
 * 逐名出处 = 本机 MCP 1.13 映射实件 + 官方 1.13 客户端 jar 的 javap 反查：
 *   srg = \`F:\\MOD_TEST\\caches\\minecraft\\de\\oceanlabs\\mcp\\mcp_snapshot\\20180921\\1.13\\srgs\\notch-mcp.srg\`
 *   （obf→可读名；本档实测给出下列签名）
 *
 * | 面 | 名字 | 签名（javap/映射实件） |
 * |---|---|---|
 * | 按键写 | \`KeyBinding.setKeyBindState\` | \`(Lnet/minecraft/client/util/InputMappings$Input;Z)V\` |
 * | 按键读 | \`KeyBinding.isKeyDown\` / \`isPressed\` | \`()Z\` |
 * | 按键字段 | \`GameSettings.keyBindForward\` 等 | 见 \`KEY_FIELDS\` |
 * | 玩家/世界 | \`Minecraft.player\` / \`.world\` / \`.gameDir\` / \`.currentScreen\` | 字段表 |
 * | 位置 | \`Entity.posX/posY/posZ/rotationYaw/rotationPitch/onGround\` | 字段表 |
 * | 聊天 | \`EntityPlayerSP.sendChatMessage\` | \`(Ljava/lang/String;)V\` |
 * | 截图 | \`ScreenShotHelper.saveScreenshot\` | \`(Ljava/io/File;IILnet/minecraft/client/shader/Framebuffer;)Lnet/minecraft/util/text/ITextComponent;\` |
 * | 读方块 | \`World.getBlockState\` / \`IBlockState.getBlock\` / \`isAir\` / \`Block.getTranslationKey\` | 见下 |
 * | 开世界 | \`Minecraft.launchIntegratedServer\` | \`(Ljava/lang/String;Ljava/lang/String;Lnet/minecraft/world/WorldSettings;)V\` |
 */
public final class RiftAdapter implements GameBridge {

    /** 动作名 → \`GameSettings\` 字段名（字段名出处 = 同一份 srg 的 FD 行，逐条可查）。 */
    private static final Map<String, String> KEY_FIELDS = new LinkedHashMap<String, String>();
    static {
        KEY_FIELDS.put("forward", "keyBindForward");
        KEY_FIELDS.put("back", "keyBindBack");
        KEY_FIELDS.put("left", "keyBindLeft");
        KEY_FIELDS.put("right", "keyBindRight");
        KEY_FIELDS.put("jump", "keyBindJump");
        KEY_FIELDS.put("sneak", "keyBindSneak");
        KEY_FIELDS.put("sprint", "keyBindSprint");
        KEY_FIELDS.put("attack", "keyBindAttack");
        KEY_FIELDS.put("use", "keyBindUseItem");
        KEY_FIELDS.put("inventory", "keyBindInventory");
    }

    @Override public String platform() { return "rift"; }

    @Override public String mcVersion() { return "1.13"; }

    private static Minecraft mc() { return Minecraft.getInstance(); }

    /**
     * 按键查表 —— **必须用直接字段访问，不能用反射按名字找**。
     * 真机实测（2026-11-02）：反射版在**生产（reobf）环境**下报 \`未知按键：forward\`，
     * 因为 reobf 只改写字节码里的字段引用，**不改反射用的字符串** ⇒ 生产环境字段名是混淆名，\`getField("keyBindForward")\` 必然失败。
     * 直接访问则会被 reobf 正确改写成 obf 字段名。
     */
    private static KeyBinding kb(String key) {
        GameSettings gs = mc().gameSettings;
        if (gs == null) return null;
        if ("forward".equals(key)) return gs.keyBindForward;
        if ("back".equals(key)) return gs.keyBindBack;
        if ("left".equals(key)) return gs.keyBindLeft;
        if ("right".equals(key)) return gs.keyBindRight;
        if ("jump".equals(key)) return gs.keyBindJump;
        if ("sneak".equals(key)) return gs.keyBindSneak;
        if ("sprint".equals(key)) return gs.keyBindSprint;
        if ("attack".equals(key)) return gs.keyBindAttack;
        if ("use".equals(key)) return gs.keyBindUseItem;
        if ("inventory".equals(key)) return gs.keyBindInventory;
        return null;
    }

    @Override public boolean ready() {
        Minecraft m = mc();
        return m != null && m.player != null && m.world != null;
    }

    @Override public void tick() { }

    @Override public List<String> supportedKeys() {
        return new ArrayList<String>(KEY_FIELDS.keySet());
    }

    @Override public boolean isPressed(String key) {
        KeyBinding b = kb(key);
        return b != null && b.isKeyDown();
    }

    @Override public void setPressed(String key, boolean down) {
        KeyBinding b = kb(key);
        if (b == null) throw new IllegalArgumentException("未知按键：" + key);
        // 1.13 的 KeyBinding：当前键码字段 keyCode 是 **private**（javap 实测 \`private cfd$a h;\`），
        // 且 reobf 不改反射字符串 ⇒ 反射在生产环境必然失败（真机实测 NoSuchFieldException）。
        // 公开可取的是 \`getDefault()\`（javap \`public cfd$a h()\`，映射实件 = getDefault）⇒ 用它。
        // 局限（如实记）：若玩家改过键位，本驱动按的仍是**默认键**。
        KeyBinding.setKeyBindState(b.getDefault(), down);
    }

    @Override public String playerStateJson() {
        Minecraft m = mc();
        if (m == null || m.player == null) return "{\"present\":false}";
        StringBuilder s = new StringBuilder("{");
        s.append("\"present\":true");
        s.append(",\"x\":").append(m.player.posX);
        s.append(",\"y\":").append(m.player.posY);
        s.append(",\"z\":").append(m.player.posZ);
        s.append(",\"yaw\":").append(m.player.rotationYaw);
        s.append(",\"pitch\":").append(m.player.rotationPitch);
        s.append(",\"onGround\":").append(m.player.onGround);
        s.append(",\"health\":").append(m.player.getHealth());
        s.append(",\"dim\":").append(m.player.dimension);
        s.append("}");
        return s.toString();
    }

    @Override public String screenName() {
        Minecraft m = mc();
        return (m == null || m.currentScreen == null) ? null : m.currentScreen.getClass().getSimpleName();
    }

    @Override public String screenshotPath() {
        Minecraft m = mc();
        if (m == null || m.getFramebuffer() == null) return null;
        File dir = new File(m.gameDir, "screenshots");
        if (!dir.exists()) dir.mkdirs();
        ScreenShotHelper.saveScreenshot(dir, m.getFramebuffer().framebufferWidth, m.getFramebuffer().framebufferHeight, m.getFramebuffer());
        return dir.getAbsolutePath();
    }

    @Override public void openWorld(String worldName) {
        Minecraft m = mc();
        if (m == null) throw new IllegalStateException("Minecraft 未就绪");
        m.launchIntegratedServer(worldName, worldName, new WorldSettings(0L, net.minecraft.world.GameType.CREATIVE, true, false, net.minecraft.world.WorldType.DEFAULT));
    }

    @Override public void chatCommand(String command) {
        Minecraft m = mc();
        if (m == null || m.player == null) throw new IllegalStateException("不在世界");
        m.player.sendChatMessage(command.charAt(0) == '/' ? command : "/" + command);
    }

    @Override public String spawnBot(String name, double distance) { return null; }
    @Override public void moveBotTo(double x, double y, double z) { }
    @Override public void tickBot() { }
    @Override public String giveBot(String item, int count) { return null; }
    @Override public boolean lookBot(double yaw, double pitch) { return false; }
    @Override public String breakBotBlock(double x, double y, double z) { return null; }
    @Override public String placeBotBlock(double x, double y, double z) { return null; }
    @Override public boolean setServerAuth(boolean online) { return false; }
    @Override public void joinServer(String address) { }
    @Override public void despawnBot() { }
    @Override public String openBotInventory() { return null; }
    @Override public List<String> drainChat() { return Collections.emptyList(); }

    /** 读方块：\`World.getBlockState(BlockPos)\` → \`IBlockState.getBlock()\` / \`isAir()\` / \`Block.getTranslationKey()\`。 */
    public String blockAt(int x, int y, int z) {
        Minecraft m = mc();
        if (m == null || m.world == null) throw new IllegalStateException("不在世界");
        IBlockState st = m.world.getBlockState(new BlockPos(x, y, z));
        Block b = st.getBlock();
        return "{\"x\":" + x + ",\"y\":" + y + ",\"z\":" + z
                + ",\"cls\":\"" + b.getClass().getSimpleName() + "\""
                + ",\"id\":\"" + b.getTranslationKey() + "\""
                + ",\"idKind\":\"translationKey\""
                + ",\"air\":" + st.isAir() + "}";
    }
}
