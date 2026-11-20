package com.bandd.playtest.rift1132;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;
import net.minecraft.block.Block;
import net.minecraft.block.state.IBlockState;
import net.minecraft.client.Minecraft;
import net.minecraft.client.entity.EntityPlayerSP;
import net.minecraft.util.ScreenShotHelper;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.World;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Rift **1.13.2（社区分支实验档）** 适配层。
 *
 * **名字全部逐条有出处**（不是猜、也不是从 1.13 推）：`rift/1.13.2/knowledge/common/bridge-api.md` §2
 * 把桥所用 `net.minecraft.*` 逐名对 **MCP 快照 `20180921-1.13`**（= `data/forge_1.13.2/mappings/`）
 * 核过 **43/43 在盘**（本机另有 `forgeBin-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar` 可复现）。
 * 本类用到的那批：
 *   - 客户端单例 `Minecraft.getInstance()`（static 性已证）
 *   - 玩家 `Minecraft.player`（`EntityPlayerSP`）／世界 `Minecraft.world`（`World`）／游戏目录 `Minecraft.gameDir`（`File`）
 *   - 位置 `Entity.posX/posY/posZ`（double）／朝向 `rotationYaw/rotationPitch`／落地 `onGround`（boolean）／血量 `getHealth()`
 *   - 发命令 `EntityPlayerSP.sendChatMessage(String)`
 *   - 截图 `ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer,Consumer)` + `Minecraft.mainWindow.getFramebufferWidth/Height()`
 *   - 读方块 `World.getBlockState(BlockPos)` → `IBlockState.getBlock()` / `Block.isAir(IBlockState)` / `Block.getTranslationKey()` / `new BlockPos(int,int,int)`
 *
 * **未核项一律 fail-closed**（详见各方法注释）：维度 id、当前界面、按键写入、化身、收聊天、进世界入口。
 *
 * ⚠ **本档是社区分支实验档**：件仍是 1.13 的件（`profile.json` 的 `inheritsFrom=1.13`），
 * 且真机实测 **listener 在 1.13.2 上不派发**（`code-patterns/listener-pattern.md:117`）⇒
 * 本适配层「名字对」不等于「真机跑得动」。
 */
public final class RiftAdapter implements GameBridge {

    private static boolean todoLogged;

    private static void todo(String what) {
        if (todoLogged) return;
        todoLogged = true;
        System.err.println("[bandd-playtest] TODO(未核实)：rift 1.13.2 的「" + what + "」不在 bridge-api.md §2 的 43 名里"
                + " ⇒ 本档该面 fail-closed（不按 1.13 / 1.14+ / Fabric 记忆猜）。");
    }

    @Override public String platform() { return "rift"; }

    @Override public String mcVersion() { return "1.13.2"; }

    @Override
    public boolean ready() {
        Minecraft mc = Minecraft.getInstance();
        return mc != null && mc.player != null && mc.world != null;
    }

    @Override public void tick() { }

    /** TODO(未核实)：按键写入面不在 43 名里 ⇒ 空表（不接受按键动作）。 */
    @Override public List<String> supportedKeys() { return Collections.emptyList(); }

    @Override public boolean isPressed(String key) { return false; }

    @Override public void setPressed(String key, boolean down) { todo("按键写入（KeyBinding 面）"); }

    @Override
    public String playerStateJson() {
        Minecraft mc = Minecraft.getInstance();
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        if (mc == null || mc.player == null) {
            m.put("present", Boolean.FALSE);
            return Json.of(m);
        }
        EntityPlayerSP p = mc.player;
        m.put("present", Boolean.TRUE);
        m.put("x", p.posX);
        m.put("y", p.posY);
        m.put("z", p.posZ);
        m.put("yaw", p.rotationYaw);
        m.put("pitch", p.rotationPitch);
        m.put("onGround", p.onGround);
        m.put("health", p.getHealth());
        m.put("dimension", null); // TODO(未核实)：维度 id 不在 43 名里
        m.put("screen", screenName());
        return Json.of(m);
    }

    /** TODO(未核实)：当前界面字段不在 43 名里 ⇒ null。 */
    @Override public String screenName() { todo("当前界面字段"); return null; }

    /** 截图：名字有出处；接口**异步落盘且不返回路径** ⇒ 返回截图**目录**（不假装知道文件名）。 */
    @Override
    public String screenshotPath() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null) return null;
        try {
            ScreenShotHelper.saveScreenshot(mc.gameDir,
                    mc.mainWindow.getFramebufferWidth(), mc.mainWindow.getFramebufferHeight(),
                    mc.getFramebuffer(), t -> { });
        } catch (Throwable t) {
            return null;
        }
        return new File(mc.gameDir, "screenshots").getAbsolutePath();
    }

    /** TODO(未核实)：进世界入口不在 43 名里 ⇒ no-op（不假装已进世界）。 */
    @Override public void openWorld(String worldName) { todo("进入/加载世界的入口"); }

    /** 发命令：`EntityPlayerSP.sendChatMessage(String)`（带前导 `/` 区分命令，与 1.13.2 同名层一致）。 */
    @Override
    public void chatCommand(String command) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null) return;
        mc.player.sendChatMessage(command.startsWith("/") ? command : "/" + command);
    }

    // ================= 化身（第二个角色）=================
    // 43 名里没有「召唤玩家形状化身 / 给它发物品 / 让它挖放」的任何入口 ⇒ 整块 fail-closed。
    @Override public String spawnBot(String name, double distance) { todo("召唤化身"); return null; }
    @Override public void moveBotTo(double x, double y, double z) { todo("移动化身"); }
    @Override public void tickBot() { }
    @Override public String giveBot(String item, int count) { todo("给化身发物品"); return null; }
    /**
     * 本机玩家转视角（**不是**化身）。
     * 出处：本档 `rift/1.13.2/knowledge/common/bridge-api.md` §2 的 43 名里含 `rotationYaw/rotationPitch`
     * （MCP 快照 `20180921-1.13` 公开字段，与 rift 1.13 同层）。
     * 判据 = 对着本档真构件 `build/tmp/deobfMcMCP/deobfed.jar` 编译 rc=0。
     */
    @Override public boolean look(double yaw, double pitch) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.player == null) return false;
        mc.player.rotationYaw = (float) yaw;
        mc.player.rotationPitch = (float) pitch;
        return true;
    }

    @Override public boolean lookBot(double yaw, double pitch) { todo("化身转向"); return false; }
    @Override public String breakBotBlock(double x, double y, double z) { todo("化身挖方块"); return null; }
    @Override public String placeBotBlock(double x, double y, double z) { todo("化身放方块"); return null; }
    @Override public boolean setServerAuth(boolean online) { todo("关集成服认证"); return false; }
    @Override public void joinServer(String address) { todo("作为真客户端连服务器"); }
    @Override public void despawnBot() { }
    @Override public String openBotInventory() { todo("开化身物品栏"); return null; }

    /** TODO(未核实)：聊天接收面不在 43 名里 ⇒ 恒空表。 */
    @Override public List<String> drainChat() { return new ArrayList<String>(); }

    // ================= 读方块（43 名里有出处，单独开一个供 driver 面用）=================
    /** `World.getBlockState(BlockPos)` → `IBlockState.getBlock()` / `Block.isAir` / `getTranslationKey()`。 */
    public static String blockAt(double x, double y, double z) {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.world == null) return null;
        World w = mc.world;
        IBlockState st = w.getBlockState(new BlockPos((int) Math.floor(x), (int) Math.floor(y), (int) Math.floor(z)));
        Block b = st.getBlock();
        // ⚠ 修正（编译期实证 2026-11-02）：`Block.isAir` 是**实例方法**，不是静态
        //   （原按 bridge-api.md §2 的字面「Block.isAir(IBlockState) → boolean」写成静态调用 ⇒
        //    javac: 无法从静态上下文中引用非静态 方法 isAir(IBlockState)）
        if (b.isAir(st)) return "minecraft:air";
        // 1.13.2 的 Block 没有注册名（bridge-api 明记只给 translation key，形如 tile.stone）
        return b.getTranslationKey();
    }
    // 2026-11-04 统一取目标方块规格（主 = 自算射线；备 = 渲染路径；reach 创造 5.0 / 生存 4.5）**未在本档落地**：
    //   本档目录没有 gradlew ⇒ 拿不到 BUILD SUCCESSFUL 判据 ⇒ 按纪律只加注释、不硬改代码。
    // ===== 本轮 5 项修复（look / setPressed 补 click / closeScreen / mineLookingAt / tick 推进）=====
    // fix 1 look：本档**已有**实现（rotationYaw/rotationPitch），本轮未改。
    // fix 2 setPressed 补 click：本档按键写入面本就 fail-closed（键集为空 / TODO），故 N/A。
    // fix 3 closeScreen：需要「读当前界面 + 关界面」两个名字；本档只认 bridge-api.md §2 的 43 个名字，关界面/挖矿一族不在其中
    //   ⇒ 不猜，保持 GameBridge 默认实现（返回 false = CLOSE_UNSUPPORTED）。
    // fix 4/5 mineLookingAt + tick 逐帧推进：需要 objectMouseOver / playerController.clickBlock /
    //   onPlayerDamageBlock 一族名字，本档同样未取证 ⇒ 不猜，保持默认实现（返回 null）。
    // 为什么只加注释不改代码：本档目录**没有 gradlew**（跑不了 `gradlew.bat build --offline`，
    //   拿不到「BUILD SUCCESSFUL」判据）⇒ 硬改无法验证，违反「宁可少做一项，不可留红树」的纪律。
}
