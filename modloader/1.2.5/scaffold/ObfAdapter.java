import com.bandd.playtest.core.Capabilities;
import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * **默认包**适配层 —— ModLoader 1.2.5（「直接对官方混淆 client.jar 编译」路线）。
 *
 * 为什么必须在默认包：本档 MC 类几乎全在**默认包**（afu / nn / vq / fj …），
 * 而 **Java 不允许具名包引用默认包** ⇒ 任何直接命名 MC 类的代码自己也得在默认包。
 * 反向可以（默认包 import 具名包）⇒ 本类照样 implements com.bandd.playtest.core.GameBridge。
 *
 * 为什么不需要 reobf / 映射：reobf 的作用是「把可读名改写成混淆名」。本路线**写的本来就是混淆名**
 * （逐条来自本机 javap 真构件）⇒ 编译产物里的引用**就是运行期名字**。
 *
 * ===== 字段/方法锚定表（全部**调用点级**证据，逐条本机 javap -c 真构件） =====
 *
 * | 用途 | 混淆名 | 签名 | 锚点证据（调用点原文） |
 * |---|---|---|---|
 * | Minecraft 单例 | Minecraft.a | private static Minecraft | Minecraft.<init> 偏移 276 putstatic a；**本档不用它**（private，且 tick 钩子直接给实例） |
 * | theWorld | Minecraft.f | public xd f | ModLoader.onTick: getfield Minecraft.f:Lxd; ifnull（inGameHooks 的在场判定）+ 同一方法里 xd.w()J 当 tick 钟 |
 * | **thePlayer** | Minecraft.h | public vq h | Minecraft.a(xd,String,yw)（= loadWorld）: putfield h:Lvq;（该值来自 xd.a(Class)Ln n / ki.b(xd)Lyw，vq extends yw extends acq extends nn） |
 * | currentScreen | Minecraft.s | public vp s | ModLoader.onTick 把它当 onTickInGUI 的第 3 参传（onTickInGUI:(FLnet/minecraft/client/Minecraft;Lvp;)Z） |
 * | 渲染器 | Minecraft.u | public lr u | ModLoader.init(): putfield net/minecraft/client/Minecraft.u:Llr;（装 EntityRendererProxy）|
 * | gameSettings | Minecraft.A | public hu A | ModLoader.onTick: getfield Minecraft.A:Lhu; 再 getfield hu.m:Ljava/lang/String;（语言）|
 * | **mcDataDir** | Minecraft.F | public java.io.File | Minecraft.<init> 偏移 209: F = b()（getMinecraftDir）；随后 new File(F,"saves")→ISaveFormat、new hu(this,F)→GameSettings、new gi(this,F)→TexturePackList |
 * | **posX/Y/Z** | nn.o / nn.p / nn.q | public double | nn.f(DDD) 与 nn.g(DDD)（= getDistanceSq/getDistance）读 o/p/q 三字段做差再算平方和 |
 * | **motionX/Y/Z** | nn.r / nn.s / nn.t | public double | nn.a(FFF)（= moveFlying）把速度累加进 r/t；nn.c(DDD)（= moveEntity）把 par1/par3/par5 累加进 r/s/t |
 * | **rotationYaw** | nn.u | public float | 见 §1.1（三条独立证据）|
 * | **rotationPitch** | nn.v | public float | 见 §1.1（只有 v 被夹到 ±90）|
 * | prevRotationYaw/Pitch | nn.w / nn.x | public float | 见 §1.1 证据 ① |
 * | worldObj | nn.k | public xd | nn.e(DDD) 读 k 调 xd.a(nn,wu)/xd.b(wu)（碰撞查询）|
 * | 世界时间（tick 钟） | xd.w() | public long | ModLoader.onTick 把它当 clock 做去重 |
 * | 键位表 | afu.a | public static java.util.List | afu(String,int) 构造器里 a.add(this) |
 * | 键名（描述串） | afu.c | public java.lang.String | afu(String,int) 写 c；hu 构造器字面量 "key.forward"/"key.left"/"key.back"/… |
 * | 键码 | afu.d | public int | 同上；afu.b（IntHashMap）用它做键 |
 * | **按下态** | afu.e | public boolean | afu.a(int,boolean) 只写 e；afu.a()（unPressAllKeys）走 private d() 清 e |
 * | **注入按下/松开** | afu.a(int,boolean) | public static void | 字节码 = 按 keyCode 查 IntHashMap -> putfield e（= vanilla setKeyBindState）|
 * | pressTime | afu.f | public int | afu.a(int) ++f；afu.c() 消耗 f |
 * | **开世界** | Minecraft.a(String,String,fj) | public void | 见 §1.2（= vanilla startWorld）|
 * | 世界设置 | fj(long,int,boolean,boolean,vx) | public | 上面那条的 par3 类型 |
 * | 世界类型 | vx.b | public static final vx | vx.<static>: b = new vx(0,"default",1)（字面量 "default" 在字节码里）|
 *
 * **未锚定 ⇒ 一律 fail-closed**（不猜）：血量/饥饿/背包/截图/聊天收发/化身/认证开关/连服务器。
 */
public final class ObfAdapter implements GameBridge {

    /** 本档真正能做的动作（其余如实自报 unavailable，不静默）。 */
    private static final List<String> CAN_DO = Collections.unmodifiableList(Arrays.asList(
            "ping", "set_arbitration", "status",
            "query_player_state", "query_screen",
            "press", "release_all", "take_over", "open_world"));

    /**
     * MC 实例。**由 tick 钩子（MC 线程）注入** —— 出处：BaseMod.onTickInGame/onTickInGUI 的
     * 第二参就是 net.minecraft.client.Minecraft（javap 真构件）。
     * 为什么不读单例字段：1.2.5 的 Minecraft.a 是 **private**（javap 实证），而 ModLoader 自己的
     * getMinecraftInstance() 在 instance==null 时会去枚举线程（字节码实证）⇒ 钩子给实例更干净。
     */
    private static volatile net.minecraft.client.Minecraft MC;

    private static boolean todoLogged;

    static void attach(net.minecraft.client.Minecraft mc) {
        if (mc != null) MC = mc;
    }

    private static void todo(String what) {
        if (todoLogged) return;
        todoLogged = true;
        System.err.println("[bandd-playtest] TODO(未核实)：ModLoader 1.2.5 的「" + what + "」本档无调用点级出处 ⇒ fail-closed。");
    }

    private static double r4(double d) { return Math.round(d * 10000.0) / 10000.0; }

    @Override public String platform() { return "modloader"; }

    @Override public String mcVersion() { return "1.2.5"; }

    /**
     * 世界与玩家都在场。
     * **出处 = ModLoader 自己的 onTick 字节码**：getfield Minecraft.f:Lxd; ifnull ⇒ 才跑 inGameHooks；
     * 再配上 Minecraft.h（= loadWorld 里 putfield 的那个 vq）与 nn.k（= worldObj）。
     * 比「单例可达」强：单例在主菜单也成立（那是假绿）。
     */
    @Override public boolean ready() {
        net.minecraft.client.Minecraft mc = MC;
        return mc != null && mc.h != null && mc.h.k != null;
    }

    @Override public void tick() { }

    // =============== 读数面（真读坐标 —— L-b 判据） ===============

    @Override public String playerStateJson() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        net.minecraft.client.Minecraft mc = MC;
        if (mc == null || mc.h == null || mc.h.k == null) {
            m.put("present", Boolean.FALSE);
            return Json.of(m);
        }
        vq p = mc.h;
        m.put("present", Boolean.TRUE);
        m.put("x", r4(p.o));                        // nn.o = posX（f/g(DDD) 读它做差）
        m.put("y", r4(p.p));                        // nn.p = posY
        m.put("z", r4(p.q));                        // nn.q = posZ
        m.put("yaw", r4((double) p.u));             // nn.u = rotationYaw（c(FF) 走 par1*0.15）
        m.put("pitch", r4((double) p.v));           // nn.v = rotationPitch（c(FF) 只夹它到 ±90）
        m.put("motionX", r4(p.r));                  // nn.r = motionX（moveFlying/moveEntity 累加）
        m.put("motionY", r4(p.s));
        m.put("motionZ", r4(p.t));
        m.put("worldTime", Long.valueOf(mc.f != null ? mc.f.w() : p.k.w()));   // xd.w() —— ModLoader 自己当 tick 钟用
        return Json.of(m);
    }

    @Override public String screenName() {
        net.minecraft.client.Minecraft mc = MC;
        if (mc == null || mc.s == null) return null;
        return mc.s.getClass().getName();
    }

    // =============== 开世界（= startWorld） ===============

    /**
     * 打开/新建一个存档。
     *
     * 出处：Minecraft.a(String,String,fj) 的字节码逐条对上 vanilla startWorld：
     *   a((xd)null)（loadWorld） -> System.gc() -> ad.a(par1)（ISaveFormat.isOldMapFormat）
     *   -> 真: b(par1,par2)（旧存档格式转换）
     *   -> 假: ad.a(par1,false)（getSaveLoader） -> new xd(saveLoader, par2, settings)（World）
     *          -> settings.s（xd.s:Z）分叉 "menu.generatingLevel" / "menu.loadingLevel" -> a(world, msg)
     *
     * 存档目录 = new File(Minecraft.F, "saves")（F = mcDataDir，出处见类注释）。
     * 已存在 ⇒ 传 null settings（与 vanilla GuiSelectWorld 同路，保住存档自己的 seed/gamemode）；
     * 不存在 ⇒ 传新 fj(seed, 1, mapFeatures=true, hardcore=false, vx.b) 新建。
     */
    @Override public void openWorld(String worldName) {
        net.minecraft.client.Minecraft mc = MC;
        if (mc == null) throw new IllegalStateException("Minecraft 实例不可达（tick 钩子还没跑过）");
        if (worldName == null || worldName.isEmpty()) throw new IllegalArgumentException("world 名不能为空");
        File saveDir = new File(new File(mc.F, "saves"), worldName);
        boolean fresh = !saveDir.isDirectory();

        // 游戏模式 id：0 = survival，1 = creative。已存在存档 ⇒ 从存档列表读（出处 = mw(GuiSelectWorld).c(int)
        // 里的 pj.e()：List 里的 pj 就是存档条目，e() 返回 game type）。
        int gameType = 1;
        if (!fresh) {
            gameType = 0;
            List<?> saves = mc.c().b();          // Minecraft.c() = getSaveFormat（public kb c()）；kb.b() = listSaves
            if (saves != null) {
                for (Object o : saves) {
                    if (o instanceof pj && worldName.equals(((pj) o).a())) { gameType = ((pj) o).e(); break; }
                }
            }
        }

        // ★ 必须先装 PlayerController（字段 Minecraft.c，类型 ki），否则进世界后**第一帧就 NPE**：
        //   Minecraft.k() 偏移 150 的字节码 = getfield c:Lki; invokevirtual ki.c:()V（= playerController.tick()）。
        //   出处（两条 GUI 调用点，逐字一致）：
        //     · xh(GuiCreateWorld).a(abp) 创造分支: mc.c = new aff(mc)（aff = PlayerControllerCreative）
        //       否则 mc.c = new aes(mc)（aes = PlayerControllerSP），随后才 mc.a(name,name,new fj(...))
        //     · mw(GuiSelectWorld).c(int): gameType = pj.e(); mc.c = (gameType == 0 ? new aes(mc) : new aff(mc));
        //       随后才 mc.a(name, displayName, null)
        mc.c = (gameType == 0) ? (ki) new aes(mc) : (ki) new aff(mc);

        fj settings = null;
        if (fresh) {
            settings = new fj(20261103L, gameType, true, false, vx.b);
        }
        mc.a(worldName, worldName, settings);
    }

    @Override public void chatCommand(String command) {
        todo("发聊天/命令（ModLoader.clientChat(String) 是**收**不是**发**）");
    }

    @Override public String screenshotPath() { todo("截图 API"); return null; }

    // =============== 按键面（逐条 javap 实证；**零硬编码键名**） ===============

    /**
     * 运行期键名。1.2.5 的 afu.c 是**描述串**（hu 构造器里字面量 "key.forward" / "key.sneak" /
     * "key.hotbar.1" 实证）⇒ 本方法把每条绑定的「最后一段」（key.forward -> forward）当**对外键名**输出，
     * **只在该段全局唯一时**才用它（否则退回完整描述串）。
     * 为什么这样做：源码里**零硬编码键名**（"forward" 这个字面量一个都不写），同时让 /status 的
     * supportedKeys 与 press 的入参口径一致。
     */
    @Override public List<String> supportedKeys() {
        return new ArrayList<String>(nameMap().keySet());
    }

    private static List<afu> bindings() {
        List<afu> out = new ArrayList<afu>();
        List<?> all = afu.a;
        if (all == null) return out;
        for (Object o : all) {
            if (o instanceof afu) out.add((afu) o);
        }
        return out;
    }

    /** 描述串的最后一段；没有点号就原样返回。 */
    private static String seg(String n) {
        if (n == null) return null;
        int i = n.lastIndexOf((int) '.');
        if (i < 0 || i == n.length() - 1) return n;
        return n.substring(i + 1);
    }

    /**
     * 对外键名 -> 绑定。
     *
     * 判据不是「该段出现几次」而是「该段对应几种**描述串**」：
     * 1.5.2 的 avy **两个构造器**都会 new 一遍全部绑定（javap 实证：两个 ctor 各自 14 次 new ava）
     * ⇒ 运行期 ava.a 里每条描述串出现两次（实测 rawKeyCount=28 / 描述串 14 种）。
     * 同一描述串重复注册 = **同一个键**，短名仍然无歧义 ⇒ 仍用它。
     * 只有「同一段对应 ≥2 种不同描述串」时才退回完整描述串（不猜、不歧义）。
     */
    private static Map<String, afu> nameMap() {
        List<afu> all = bindings();
        Map<String, java.util.Set<String>> segDescs = new LinkedHashMap<String, java.util.Set<String>>();
        for (afu kb : all) {
            String s = seg(kb.c);
            if (s == null) continue;
            java.util.Set<String> d = segDescs.get(s);
            if (d == null) { d = new java.util.LinkedHashSet<String>(); segDescs.put(s, d); }
            d.add(kb.c);
        }
        Map<String, afu> m = new LinkedHashMap<String, afu>();
        for (afu kb : all) {
            String s = seg(kb.c);
            boolean unambiguous = s != null && segDescs.get(s).size() == 1;
            String name = unambiguous ? s : kb.c;
            if (name != null && !m.containsKey(name)) m.put(name, kb);
        }
        return m;
    }

    /** 运行期键位表的**原始条目数**（含重复注册）；只用于证据自证，不参与协议。 */
    public static int rawKeyCount() { return bindings().size(); }

    /** 先按完整描述串精确查，再按对外键名查；查不到返回 null（调用方 fail-closed）。 */
    private static afu find(String key) {
        if (key == null) return null;
        for (afu kb : bindings()) {
            if (key.equals(kb.c)) return kb;
        }
        return nameMap().get(key);
    }

    /**
     * 读「真人是否正按着这个键」。
     * **刻意读字段 e 而不是调 c()**：c() 的字节码是 if (f == 0) return false; --f; return true;
     * （= vanilla isPressed，会**自减 pressTime**）⇒ 拿它当只读探针会吃掉游戏的按键计数。
     */
    @Override public boolean isPressed(String key) {
        afu kb = find(key);
        return kb != null && kb.e;
    }

    @Override public void setPressed(String key, boolean down) {
        afu kb = find(key);
        if (kb == null) throw new IllegalArgumentException("未知按键：" + key + "（本档键名以运行期键位表为准）");
        afu.a(kb.d, down);     // public static void a(int,boolean) —— 字节码：查 IntHashMap -> putfield e
    }

    // =============== 其余全部 fail-closed ===============

    @Override public String spawnBot(String name, double distance) { todo("召唤化身（本档不做）"); return null; }
    @Override public void moveBotTo(double x, double y, double z) { todo("移动化身"); }
    @Override public void tickBot() { }
    @Override public String giveBot(String item, int count) { todo("给化身发物品"); return null; }
    /** 本机玩家转视角。锚点：`nn.u`=rotationYaw（`c(FF)` 里走 par1*0.15）、`nn.v`=rotationPitch（只有它被夹 ±90）。 */
    @Override public boolean look(double yaw, double pitch) {
        net.minecraft.client.Minecraft mc = MC;
        if (mc == null || mc.h == null) return false;
        vq p = mc.h;
        p.u = (float) yaw;    // nn.u = rotationYaw
        p.v = (float) pitch;  // nn.v = rotationPitch
        return true;
    }

    @Override public boolean lookBot(double yaw, double pitch) { todo("化身转向"); return false; }
    @Override public String breakBotBlock(double x, double y, double z) { todo("化身挖方块"); return null; }
    @Override public String placeBotBlock(double x, double y, double z) { todo("化身放方块"); return null; }
    @Override public boolean setServerAuth(boolean online) { todo("关集成服认证（拿不到 MinecraftServer 句柄）"); return false; }
    @Override public void joinServer(String address) { todo("作为真客户端连服务器"); }
    @Override public void despawnBot() { }
    @Override public String openBotInventory() { todo("开化身物品栏"); return null; }
    @Override public List<String> drainChat() { todo("聊天接收钩子"); return Collections.emptyList(); }

    /** 能力自报：**按实际做得到的列白名单**，其余逐条列 unavailable（谎报比不报更糟）。 */
    @Override public List<String> unavailableActions() {
        List<String> l = new ArrayList<String>();
        for (String a : Capabilities.all()) {
            if (!CAN_DO.contains(a)) l.add(a);
        }
        return l;
    }
}
