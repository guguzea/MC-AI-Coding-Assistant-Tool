package com.bandd.playtest.forge_1_12_2;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;
import net.minecraft.client.Minecraft;
import net.minecraft.client.entity.EntityPlayerSP;
import net.minecraft.util.ScreenShotHelper;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * forge 1.12.2 适配层 —— 由 temp/port/tools/gen-adapter.mjs 从
 * generate_playtest_driver 的产物自动派生，不要手改（要改就改生成器）。
 *
 * 产物来源：node mcp-server/dist/cli.js generate_playtest_driver
 *   --platform forge --version 1.12.2 --driverMode temporary_client_tick_driver
 *   => playtest/PlaytestQaDriver.java（2246 行 / 127565 B）。
 * 提取前已剔除 Java 注释（假阳性自检见同目录 dossier.json 的 falsePositiveGuards）。
 *
 * 生成器只覆盖它自己用到的概念；本模组需要而驱动里不出现的概念一律
 * TODO(未核实) + fail-closed（不猜名字）。逐条清单见 dossier.json 的 concepts.*.ok=false。
 */
public final class ForgeAdapter implements GameBridge {

    private static final String PLATFORM = "forge";
    private static final String MC_VERSION = "1.12.2";

    // TODO(未核实)：生成物里没找到 press() 的键位表 => 键集为空（fail-closed）。
    //   键**字段名**本身已取证（javap -p -cp forgeBin-1.12.2-14.23.5.2847.jar net.minecraft.client.settings.GameSettings）：
    //     public net.minecraft.client.settings.KeyBinding keyBindInventory;
    //     （同批还有 keyBindForward / keyBindLeft / keyBindBack / keyBindRight / keyBindJump /
    //       keyBindSneak / keyBindSprint / keyBindAttack / keyBindUseItem）
    //   但**写入面形状与 1.20.1 参考档不同、且语义未取证**，故仍不把 "inventory" 加进键集：
    //     javap -p net.minecraft.client.settings.KeyBinding：**没有**实例 setDown/click，
    //       只有 static setKeyBindState(int,boolean) / static onTick(int)
    //     javap -p -c KeyBinding#setKeyBindState(int,boolean)：putfield pressed:Z
    //     javap -p -c KeyBinding#updateKeyBindState()：逐键 Keyboard.isKeyDown(keyCode) 重算 pressed
    //       ⇒ 外部置的 pressed 会被客户端 tick 的 updateKeyBindState() 覆盖，与 1.20.1 的 setDown 语义不同。
    //   若把 "inventory" 加进键集而 setPressed 仍是空实现，/status 会**谎报**能力 ⇒ 按纪律保持 fail-closed。
    private static final List<String> KEYS = Arrays.asList();

    @Override public String platform() { return PLATFORM; }
    @Override public String mcVersion() { return MC_VERSION; }

    @Override
    public boolean ready() {
        Minecraft c = Minecraft.getMinecraft();
        return c != null && c.player != null && c.world != null;
    }

    /**
     * 本机客户端当前阶段（补 GameBridge default 覆盖）。判据全部 javap 取证（jar = forgeBin-1.12.2-14.23.5.2847.jar）：
     *   javap -p net.minecraft.client.Minecraft
     *     public net.minecraft.client.multiplayer.WorldClient world;
     *     public net.minecraft.client.gui.GuiScreen currentScreen;
     *     public boolean isSingleplayer();
     *   javap -p -c Minecraft#isSingleplayer(): integratedServerIsRunning && integratedServer != null
     *     ⇒ 等价于新版 hasSingleplayerServer()（本档还没有那个方法）
     *   javap -p net.minecraft.client.multiplayer.GuiConnecting / net.minecraft.client.gui.GuiDownloadTerrain / net.minecraft.client.gui.GuiScreenWorking
     *     ⇒ 都是 public class ... extends GuiScreen（可 instanceof）
     */
    @Override
    public String clientPhase() {
        Minecraft c = Minecraft.getMinecraft();
        if (c == null) return null;
        if (c.world != null) {
            return c.isSingleplayer() ? "singleplayer" : "multiplayer";
        }
        if (c.currentScreen instanceof net.minecraft.client.multiplayer.GuiConnecting
                || c.currentScreen instanceof net.minecraft.client.gui.GuiDownloadTerrain
                || c.currentScreen instanceof net.minecraft.client.gui.GuiScreenWorking) {
            return "connecting";
        }
        return "menu";
    }

    /**
     * 本机集成服务器当前实际监听的端口（补 GameBridge default 覆盖）。
     *
     * TODO(未核实)：**本档取不到真端口** ⇒ fail-closed 返回 0（不猜）。逐条 javap 取证（jar = forgeBin-1.12.2-14.23.5.2847.jar）：
     *   javap -p net.minecraft.client.Minecraft : public ...IntegratedServer getIntegratedServer();   ✅ 服务器对象取得到
     *   javap -p net.minecraft.server.integrated.IntegratedServer：有 public boolean getPublic()，
     *     **没有 getServerPort()**（1.13.2 起才在 IntegratedServer 上覆写；1.12.2 只有父类 MinecraftServer 的那个）
     *   javap -p -c net.minecraft.server.integrated.IntegratedServer#shareToLAN(GameType,boolean):
     *     ... getNetworkSystem().addEndpoint(null, <port>) ... putfield isPublic:Z
     *     ⇒ **只把端口绑到 NetworkSystem，不落任何可读字段**（本档 IntegratedServer 连 serverPort 字段都没有）
     *   javap -p -c net.minecraft.server.MinecraftServer#getServerPort(): getfield serverPort:I; ireturn
     *     ⇒ 那个 serverPort 对集成服务器**永不被写**（shareToLAN 不调 setServerPort）⇒ 恒 0，不是真端口
     *   唯一持有端口的是 private ThreadLanServerPing lanServerPing，无公开取值口 ⇒ 证不到就返回 0。
     */
    @Override
    public int lanPort() {
        return 0;
    }

    @Override
    public void tick() {
        // core 的队列在 PlaytestCore.onTick 里排空；这里额外推进挖矿进度（本轮 fix 4/5）。
        Minecraft c = Minecraft.getMinecraft();
        if (this.mining == null || c == null || c.world == null || c.playerController == null) return;
        c.playerController.onPlayerDamageBlock(this.mining, this.miningDir);   // [T20-①] **不看返回值**（vanilla 在 destroyDelay/cooldown 未到的分支也回 true ⇒ 拿它当「已挖穿」会在第一 tick 清空目标）；收工只看上面那个 isAir
    }

    /** 挖矿目标（跨 tick 持续破坏用）。 */
    private net.minecraft.util.math.BlockPos mining = null;
    private net.minecraft.util.EnumFacing miningDir = null;

    /** 关掉当前界面：界面开着时 MC 不处理输入（press 静默失效），实测位移恒 0。 */
    @Override
    public boolean closeScreen() {
        Minecraft c = Minecraft.getMinecraft();
        if (c == null) return false;
        if (c.currentScreen == null) return true;
        c.displayGuiScreen(null);
        return true;
    }

    /**
     * 破坏准星所指方块：**开始**破坏（走正常进度），随后由 tick() 逐帧推进。
     * 同一目标**幂等** —— 重发 clickBlock 会把破坏进度清零（真机实测：反复调用永远挖不动）。
     * 名字出处：1.13.2/1.14.4 = 本档 MCP 映射件 javap；1.12.2 = mcp_stable/39 fields.csv+methods.csv。
     */
    @Override
    public String mineLookingAt() {
        Minecraft c = Minecraft.getMinecraft();
        if (c == null || c.player == null || c.world == null) return null;
        // 取目标方块：主路 = 自算射线（与渲染无关）；备用 = 渲染路径（mc 的 hitResult / crosshairTarget）。
        // reach 按游戏模式：创造 5.0 / 生存 4.5。名字出处 = javap -p -cp forgeBin-1.12.2: Entity.getPositionEyes(float)/getLook(float); EntityPlayer.isCreative(); World.rayTraceBlocks(Vec3d,Vec3d); Vec3d.scale(double); Minecraft.objectMouseOver
        net.minecraft.util.math.Vec3d eye = c.player.getPositionEyes(1.0F);
        double reach = c.player.isCreative() ? 5.0D : 4.5D;
        net.minecraft.util.math.Vec3d end = eye.add(c.player.getLook(1.0F).scale(reach));
        net.minecraft.util.math.RayTraceResult hr = c.world.rayTraceBlocks(eye, end);
        if (hr == null || hr.typeOfHit != net.minecraft.util.math.RayTraceResult.Type.BLOCK) {
            hr = c.objectMouseOver;
        }
        if (hr == null || hr.typeOfHit != net.minecraft.util.math.RayTraceResult.Type.BLOCK) return null;
        net.minecraft.util.math.BlockPos pos = hr.getBlockPos();
        if (!pos.equals(this.mining)) {
            this.mining = pos;
            this.miningDir = hr.sideHit;
            c.playerController.clickBlock(pos, this.miningDir);
        }
        return pos.getX() + "," + pos.getY() + "," + pos.getZ();
    }
    @Override public List<String> supportedKeys() { return KEYS; }

    /** 真按键写入 —— 形状逐字取自生成物 press()（见 dossier 的 concepts.inputSink）。 */
    @Override
    public void setPressed(String key, boolean down) {
        // TODO(未核实)：生成物里没有按键写入形状
        // fix 2（补 click）在本档不适用：本档连按键写入形状都没有（键集为空/未取证）⇒ 一并 fail-closed。
    }

    @Override
    public boolean isPressed(String key) {
        // TODO(未核实)：生成器只写按键、从不读（设计稿 2.5 实测）=> 本档读键方法名无出处。
        //   候选（须先取证再启用）：KeyBinding.isPressed()（yarn 侧）
        return false;
    }

    @Override
    public String playerStateJson() {
        Map<String, Object> m = new LinkedHashMap<>();
        Minecraft c = Minecraft.getMinecraft();
        if (c == null || c.player == null) { m.put("present", Boolean.FALSE); return Json.of(m); }
        EntityPlayerSP p = c.player;
        m.put("present", Boolean.TRUE);
        m.put("name", p.getName());
        m.put("x", p.posX);
        m.put("y", p.posY);
        m.put("z", p.posZ);
        m.put("onGround", p.onGround);
        // TODO(未核实)：health / dimension —— 生成物 state.json 不含这两项，名字无出处
        m.put("health", null);
        m.put("dimension", null);
        m.put("screen", screenName());
        return Json.of(m);
    }

    @Override
    public String screenName() {
        Minecraft c = Minecraft.getMinecraft();
        if (c == null || c.currentScreen == null) return null;
        return c.currentScreen.getClass().getSimpleName();
    }

    @Override
    public String screenshotPath() {
        Minecraft c = Minecraft.getMinecraft();
        if (c == null) return null;
        try {
            ScreenShotHelper.saveScreenshot(c.gameDir, c.displayWidth, c.displayHeight, c.getFramebuffer());
        } catch (Throwable t) { return null; }
        return new File(c.gameDir, "screenshots").getAbsolutePath();
    }

    /**
     * 进/读一个已存在的世界（worldName = 存档目录名）。
     * 名字与实参取证（javap -p -c -cp forgeBin-1.12.2-14.23.5.2847.jar net.minecraft.client.Minecraft）：
     *   public void launchIntegratedServer(java.lang.String, java.lang.String, net.minecraft.world.WorldSettings);
     *     ... saveLoader.getSaveLoader(<p1>, false)          ⇒ **p1 = 存档目录名**
     *     ... new WorldInfo(<p3>, <p1>)                      ⇒ p1 同时当显示名
     *     ... if (p3 == null) p3 = new WorldSettings(<WorldInfo>)  ⇒ 传 null 合法（世界已存在时 loadWorldInfo 非 null）
     * ⚠ 世界**不存在**且 p3 传 null ⇒ WorldInfo 为 null ⇒ new WorldSettings(null) 会 NPE（只用于打开已存在世界）。
     * 两个 String 实参传同一个 worldName（openWorld 收到的就是目录名），WorldSettings 传 null（沿用存档里的设置）。
     */
    @Override
    public void openWorld(String worldName) {
        Minecraft c = Minecraft.getMinecraft();
        if (c == null) return;
        c.launchIntegratedServer(worldName, worldName, null);
    }

    @Override
    public void chatCommand(String command) {
        Minecraft c = Minecraft.getMinecraft();
        if (c == null || c.player == null) return;
        c.player.sendChatMessage(command.startsWith("/") ? command.substring(1) : command);
    }

    /** 聊天缓冲：事件在入口类按生成物的注册形挂，回调推到这里（与手工版同形）。 */
    private final java.util.Deque<String> CHAT = new java.util.concurrent.ConcurrentLinkedDeque<>();
    public void pushChat(String line) { CHAT.addLast(line); while (CHAT.size() > 200) CHAT.pollFirst(); }

    @Override public List<String> drainChat() {
        // 生成物挂接：net.minecraftforge.client.event.ClientChatReceivedEvent -> event.getMessage().getUnformattedText()
        List<String> out = new ArrayList<>();
        String s;
        while ((s = CHAT.pollFirst()) != null) out.add(s);
        return out;
    }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public String spawnBot(String name, double distance) { return null; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public void moveBotTo(double x, double y, double z) { }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public void tickBot() { }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public String giveBot(String item, int count) { return null; }
    /** 本机玩家转视角（look）。写法候选 D-yarn-fields；判据 = javac rc=0。 */
    @Override public boolean look(double yaw, double pitch) {
        Minecraft c = Minecraft.getMinecraft();
        if (c == null || c.player == null) return false;
        // 本档映射层里 Entity 的朝向字段是 rotationYaw/rotationPitch（javap / MCP stable_39 fields.csv 实测），
        c.player.rotationYaw = (float) yaw;
        c.player.rotationPitch = (float) pitch;
        return true;
    }


    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public boolean lookBot(double yaw, double pitch) { return false; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public String breakBotBlock(double x, double y, double z) { return null; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public String placeBotBlock(double x, double y, double z) { return null; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public boolean setServerAuth(boolean online) { return false; }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public void joinServer(String address) { }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public void despawnBot() { }

    // TODO(未核实)：化身面 —— 生成器无此概念（本模组新增面）。
    @Override public String openBotInventory() { return null; }

}
