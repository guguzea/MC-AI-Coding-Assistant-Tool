package com.bandd.playtest.liteloader1122;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;
import net.minecraft.client.Minecraft;
import net.minecraft.client.entity.EntityPlayerSP;
import net.minecraft.util.EnumFacing;
import net.minecraft.util.ScreenShotHelper;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.math.RayTraceResult;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * LiteLoader 1.12.2（**hybrid = liteloader_forge**）适配层。
 *
 * **本档的 MC 侧名字来自哪**：本档 = forge 1.12.2 的 MC 面 + LiteLoader 的 tick 挂接。
 * 仓库 generate_playtest_driver --platform=liteloader --version=1.12.2 对本档吐出的是
 * **真驱动**（111 369 B，非结构壳），其文件头写明「vanilla/Forge 面与 forge 1.12.2 同表
 * （applyForgeMCP132 + applyForgeMCP1122），再叠 applyLiteLoader1122 —— **只改 tick 挂接**」。
 * 本类用到的名字**逐条取自该驱动**（可复现：见 build-record §3 的 grep 命令）：
 *   - Minecraft.player / Minecraft.world / Minecraft.currentScreen / Minecraft.gameDir /
 *     Minecraft.displayWidth / Minecraft.displayHeight / Minecraft.getFramebuffer()
 *   - Entity.posX/posY/posZ、Entity.rotationYaw/rotationPitch、Entity.onGround
 *   - EntityPlayerSP.sendChatMessage(String)
 *   - ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer) —— **4 参、无 Consumer**
 *     （与 rift 1.13.2 的 5 参形态**不同**，别互抄）
 *
 * **实例从哪来**：入口 onTick(Minecraft mc, float, boolean, boolean) 直接给实例
 * ⇒ 本类**不需要**单例访问器（1.12.2 的 getMinecraft() 本仓未逐名核，故不猜）。
 *
 * **未核项一律 fail-closed**：按键写入、进世界入口、化身、收聊天。
 */
public final class LiteLoaderAdapter implements GameBridge {

    private static volatile Minecraft mc;
    private static boolean todoLogged;

    /** 由入口 onTick 传入（回调实名的第二参）。 */
    public static void attach(Minecraft instance) { mc = instance; }

    private static void todo(String what) {
        if (todoLogged) return;
        todoLogged = true;
        System.err.println("[bandd-playtest] TODO(未核实)：liteloader 1.12.2 的「" + what + "」不在本档驱动用到的名字里"
                + " ⇒ 本档该面 fail-closed（不按 1.13 / 1.14+ / Fabric 记忆猜）。");
    }

    @Override public String platform() { return "liteloader"; }

    @Override public String mcVersion() { return "1.12.2"; }

    @Override
    public boolean ready() {
        Minecraft c = mc;
        return c != null && c.player != null && c.world != null;
    }

    /** 挖矿目标（跨 tick 持续破坏用）。 */
    private BlockPos mining = null;
    private EnumFacing miningDir = null;

    /**
     * 每 tick 推进一步破坏进度（本轮 fix 5）。
     * 名字出处（javap 对**本档 MC 面** build/tmp/deobfMcMCP/deobfed.jar 实测）：
     *   Minecraft.playerController；
     *   PlayerControllerMP.onPlayerDamageBlock(BlockPos, EnumFacing): boolean。
     */
    @Override
    public void tick() {
        Minecraft c = mc;
        if (this.mining == null || c == null || c.world == null || c.playerController == null) return;
        c.playerController.onPlayerDamageBlock(this.mining, this.miningDir);   // [T20-①] **不看返回值**（vanilla 在 destroyDelay/cooldown 未到的分支也回 true ⇒ 拿它当「已挖穿」会在第一 tick 清空目标）；收工只看上面那个 isAir
    }

    /**
     * 关掉当前界面（本轮 fix 3）。1.12.2 面 = Minecraft.displayGuiScreen(GuiScreen)。
     * 名字出处（javap 实测）：Minecraft.currentScreen / Minecraft.displayGuiScreen(GuiScreen)。
     */
    @Override
    public boolean closeScreen() {
        Minecraft c = mc;
        if (c == null) return false;
        if (c.currentScreen == null) return true;
        c.displayGuiScreen(null);
        return true;
    }

    // 2026-11-04 复核：本方法**已满足**统一取目标方块规格 —— 主 = 自算射线 Entity.rayTrace(reach, 1.0F)，
    //   备 = Minecraft.objectMouseOver，reach = PlayerControllerMP.getBlockReachDistance()（即按游戏模式）。
    //   本档目录没有 gradlew ⇒ 拿不到 BUILD SUCCESSFUL 判据 ⇒ 本轮只加注释、不硬改代码。
    /**
     * 破坏准星所指方块（本轮 fix 4/5）：**开始**破坏，随后由 tick() 逐帧推进。
     * 主 = 自算射线 Entity.rayTrace(double, float)（reach 取 PlayerControllerMP.getBlockReachDistance()）；
     * 备 = Minecraft.objectMouseOver。
     * 同一目标**幂等** —— 重发 clickBlock 会把破坏进度清零（与 forge 1.12.2 同形）。
     * 名字出处（javap 对**本档 MC 面** build/tmp/deobfMcMCP/deobfed.jar 实测）：
     *   Entity.rayTrace(double,float): RayTraceResult；
     *   PlayerControllerMP.getBlockReachDistance(): float；
     *   PlayerControllerMP.clickBlock(BlockPos, EnumFacing): boolean；
     *   Minecraft.objectMouseOver: RayTraceResult；
     *   RayTraceResult.typeOfHit / RayTraceResult$Type.BLOCK / sideHit / getBlockPos()；
     *   Vec3i.equals(Object)（BlockPos 继承）。
     */
    @Override
    public String mineLookingAt() {
        Minecraft c = mc;
        if (c == null || c.player == null || c.world == null || c.playerController == null) return null;
        RayTraceResult hr = c.player.rayTrace(c.playerController.getBlockReachDistance(), 1.0F);
        if (hr == null || hr.typeOfHit != RayTraceResult.Type.BLOCK) hr = c.objectMouseOver;
        if (hr == null || hr.typeOfHit != RayTraceResult.Type.BLOCK) return null;
        BlockPos pos = hr.getBlockPos();
        if (!pos.equals(this.mining)) {
            this.mining = pos;
            this.miningDir = hr.sideHit;
            c.playerController.clickBlock(pos, this.miningDir);
        }
        return pos.getX() + "," + pos.getY() + "," + pos.getZ();
    }

    /** TODO(未核实)：按键字段名（Minecraft.options.*）未逐名核 ⇒ 空表。 */
    @Override public List<String> supportedKeys() { return Collections.emptyList(); }

    @Override public boolean isPressed(String key) { return false; }

    /**
     * 本档按键写入面**本就 fail-closed**（supportedKeys() 空表 / Minecraft.options 的键字段名未取证）
     * ⇒ 本轮 fix 2 的「down 时补一次点击语义」在本档**不适用**，保持 fail-closed 并在此写明。
     */
    @Override public void setPressed(String key, boolean down) { todo("按键写入（KeyBinding 面）"); }

    @Override
    public String playerStateJson() {
        Minecraft c = mc;
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        if (c == null || c.player == null) {
            m.put("present", Boolean.FALSE);
            return Json.of(m);
        }
        EntityPlayerSP p = c.player;
        m.put("present", Boolean.TRUE);
        m.put("x", p.posX);
        m.put("y", p.posY);
        m.put("z", p.posZ);
        m.put("yaw", p.rotationYaw);
        m.put("pitch", p.rotationPitch);
        m.put("onGround", p.onGround);
        m.put("health", p.getHealth());
        m.put("dimension", null); // TODO(未核实)：维度 id 未在本档驱动里出现
        m.put("screen", screenName());
        return Json.of(m);
    }

    /** Minecraft.currentScreen（本档驱动用到过该字段）。 */
    @Override
    public String screenName() {
        Minecraft c = mc;
        if (c == null || c.currentScreen == null) return null;
        return c.currentScreen.getClass().getSimpleName();
    }

    /** 截图：ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer)（4 参）；异步落盘 ⇒ 返回目录。 */
    @Override
    public String screenshotPath() {
        Minecraft c = mc;
        if (c == null) return null;
        try {
            ScreenShotHelper.saveScreenshot(c.gameDir, c.displayWidth, c.displayHeight, c.getFramebuffer());
        } catch (Throwable t) {
            return null;
        }
        return new File(c.gameDir, "screenshots").getAbsolutePath();
    }

    /** TODO(未核实)：进世界入口不在本档驱动用到的名字里 ⇒ no-op。 */
    @Override public void openWorld(String worldName) { todo("进入/加载世界的入口"); }

    /** EntityPlayerSP.sendChatMessage(String)（带前导 / 区分命令）。 */
    @Override
    public void chatCommand(String command) {
        Minecraft c = mc;
        if (c == null || c.player == null) return;
        c.player.sendChatMessage(command.startsWith("/") ? command : "/" + command);
    }

    // ================= 化身（第二个角色）=================
    @Override public String spawnBot(String name, double distance) { todo("召唤化身"); return null; }
    @Override public void moveBotTo(double x, double y, double z) { todo("移动化身"); }
    @Override public void tickBot() { }
    @Override public String giveBot(String item, int count) { todo("给化身发物品"); return null; }
    /**
     * 本机玩家转视角（**不是**化身）。本轮 fix 1 —— 本档**已有**实现，本轮未改代码。
     * 出处（javap 对**本档 MC 面** build/tmp/deobfMcMCP/deobfed.jar 实测）：
     *   Entity.rotationYaw: float / Entity.rotationPitch: float（公开字段）。
     */
    @Override public boolean look(double yaw, double pitch) {
        Minecraft c = mc;
        if (c == null || c.player == null) return false;
        c.player.rotationYaw = (float) yaw;
        c.player.rotationPitch = (float) pitch;
        return true;
    }

    @Override public boolean lookBot(double yaw, double pitch) { todo("化身转向"); return false; }
    @Override public String breakBotBlock(double x, double y, double z) { todo("化身挖方块"); return null; }
    @Override public String placeBotBlock(double x, double y, double z) { todo("化身放方块"); return null; }
    @Override public boolean setServerAuth(boolean online) { todo("关集成服认证"); return false; }
    @Override public void joinServer(String address) { todo("作为真客户端连服务器"); }
    @Override public void despawnBot() { }
    @Override public String openBotInventory() { todo("开化身物品栏"); return null; }

    /** TODO(未核实)：收聊天面未在本档驱动里出现 ⇒ 恒空表。 */
    @Override public List<String> drainChat() { return new ArrayList<String>(); }
    // ===== 本轮 5 项修复（look / setPressed 补 click / closeScreen / mineLookingAt / tick 推进）=====
    // fix 1 look：本档**已有**实现（rotationYaw/rotationPitch），本轮未改代码，仅补本轮 javap 取证注记。
    // fix 2 setPressed 补 click：本档按键写入面本就 fail-closed（supportedKeys() 空表 / Minecraft.options 键字段名未取证）
    //   ⇒ 按任务书「若本就 fail-closed，则在注释里写明并跳过」处理：跳过，保持 fail-closed。
    // fix 3 closeScreen：已实现（Minecraft.currentScreen + Minecraft.displayGuiScreen(GuiScreen)）。
    // fix 4/5 mineLookingAt + tick 逐帧推进：已实现（Entity.rayTrace / Minecraft.objectMouseOver /
    //   PlayerControllerMP.clickBlock / PlayerControllerMP.onPlayerDamageBlock / RayTraceResult 一族）。
    // 取证方式：javap（JDK8）对**本档 MC 面** temp/port/liteloader-1.12.2/build/tmp/deobfMcMCP/deobfed.jar 实测，
    //   见各方法 javadoc 里逐条列出的签名。
    // 判据：javac（zulu8）直编 mod/shared/core + 本档适配层 + 入口 ⇒ exit=0（本档目录无 gradlew）。
}
