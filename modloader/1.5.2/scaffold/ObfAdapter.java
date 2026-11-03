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
 * **默认包**适配层 —— ModLoader 1.5.2（「直接对官方混淆 client.jar 编译」路线）。
 *
 * 为什么必须在默认包：本档 MC 类几乎全在**默认包**（ava / mp / bdv / aai …），
 * 而 **Java 不允许具名包引用默认包** ⇒ 任何直接命名 MC 类的代码自己也得在默认包。
 * 反向可以（默认包 import 具名包）⇒ 本类照样 implements com.bandd.playtest.core.GameBridge。
 *
 * 为什么不需要 reobf / 映射：reobf 的作用是「把可读名改写成混淆名」。本路线**写的本来就是混淆名**
 * （逐条来自本机 javap 真构件）⇒ 编译产物里的引用**就是运行期名字**。
 *
 * 本档的混淆名与 1.2.5 / 1.6.2 都不同，逐条本档 javap，不互抄。
 *
 * ===== 字段/方法锚定表（全部**调用点级**证据，逐条本机 javap -c 真构件） =====
 *
 * | 用途 | 混淆名 | 签名 | 锚点证据（调用点原文） |
 * |---|---|---|---|
 * | Minecraft 单例 | Minecraft.x() | public static Minecraft x() | ModLoader.init(): invokestatic Minecraft.x(); putstatic instance |
 * | **theWorld** | Minecraft.e | public bds e | Minecraft.a(bds,String)（changeWorld）: getfield e:Lbds; ifnull（卸旧世界）；a(String,String,aai) 里 a((bds)null) |
 * | **thePlayer** | Minecraft.g | public bdv g | ModLoader.onTick: getfield Minecraft.g:Lbdv; ifnull + 同表达式 getfield bdv.q:Laab; ifnull（= thePlayer != null && thePlayer.worldObj != null，与 1.6.2 的 ats.h/ats.h.q 同形状）|
 * | worldObj | mp.q | public aab q | 同上（ModLoader 自己用它判「玩家在世界里」）|
 * | currentScreen | Minecraft.s | public axr s | ModLoader.onTick 把它当 onTickInGUI 的第 3 参传（onTickInGUI:(FLnet/minecraft/client/Minecraft;Laxr;)Z）|
 * | 渲染器 | Minecraft.u | public bfq u | ModLoader.init(): putfield net/minecraft/client/Minecraft.u:Lbfq;（装 EntityRendererProxy）|
 * | gameSettings | Minecraft.z | public avy z | Minecraft.<init> 偏移 241: z = new avy(this, E)（E = mcDataDir）|
 * | **mcDataDir** | Minecraft.E | public java.io.File | Minecraft.<init> 偏移 205: E = b()（getMinecraftDir）；随后 new File(E,"saves")→ISaveFormat、new avy(this,E)→GameSettings、new bju(E,this)→TexturePackList |
 * | **posX/Y/Z** | mp.u / mp.v / mp.w | public double | mp.e(DDD) 与 mp.f(DDD)（= getDistanceSq/getDistance）读 u/v/w 三字段做差再算平方和 |
 * | **motionX/Y/Z** | mp.x / mp.y / mp.z | public double | mp.a(FFF)（= moveFlying）把速度累加进 x/z；mp.g(DDD)（= moveEntity）把 par1/par3/par5 累加进 x/y/z |
 * | **rotationYaw** | mp.A | public float | 见 §1.1（两条独立证据）|
 * | **rotationPitch** | mp.B | public float | 见 §1.1（只有 B 被夹到 ±90）|
 * | prevRotationYaw/Pitch | mp.C / mp.D | public float | 见 §1.1 证据 ① |
 * | 世界时间（tick 钟） | aab.I() | public long | ModLoader.onTick: getfield bdv.q:Laab; invokevirtual aab.I:()J 当 clock 去重 |
 * | 键位表 | ava.a | public static java.util.List | ava(String,int) 构造器里 a.add(this) |
 * | 键名（描述串） | ava.c | public java.lang.String | ava(String,int) 写 c；avy 构造器字面量 "key.forward"/"key.left"/… |
 * | 键码 | ava.d | public int | 同上；ava.b（IntHashMap）用它做键 |
 * | **按下态** | ava.e | public boolean | ava.a(int,boolean) 只写 e |
 * | **注入按下/松开** | ava.a(int,boolean) | public static void | 字节码 = 按 keyCode 查 IntHashMap -> putfield e（= vanilla setKeyBindState）|
 * | pressTime | ava.f | public int | ava.a(int) ++f；ava.c() 消耗 f |
 * | **开世界** | Minecraft.a(String,String,aai) | public void | 见 §1.2（= vanilla startWorld）|
 * | 世界设置 | aai(long,aaj,boolean,boolean,aal) | public | 上面那条的 par3 类型 |
 * | 游戏模式 | aaj.c | public static final aaj | aaj.<static> 字面量 "CREATIVE"（id 1）在字节码里 |
 * | 世界类型 | aal.b | public static final aal | aal.<static>: b = new aal(0,"default",1)（字面量 "default" 在字节码里）|
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
     * 兜底出处：Minecraft.x()（ModLoader.init 自己也用它，字节码实证）。
     */
    private static volatile net.minecraft.client.Minecraft MC;

    private static boolean todoLogged;

    static void attach(net.minecraft.client.Minecraft mc) {
        if (mc != null) MC = mc;
    }

    private static net.minecraft.client.Minecraft mc() {
        net.minecraft.client.Minecraft mc = MC;
        return mc != null ? mc : net.minecraft.client.Minecraft.x();
    }

    private static void todo(String what) {
        if (todoLogged) return;
        todoLogged = true;
        System.err.println("[bandd-playtest] TODO(未核实)：ModLoader 1.5.2 的「" + what + "」本档无调用点级出处 ⇒ fail-closed。");
    }

    private static double r4(double d) { return Math.round(d * 10000.0) / 10000.0; }

    @Override public String platform() { return "modloader"; }

    @Override public String mcVersion() { return "1.5.2"; }

    /**
     * 世界与玩家都在场。
     * **出处 = ModLoader 自己的 onTick 字节码**：getfield Minecraft.g:Lbdv; ifnull &&
     * getfield bdv.q:Laab; ifnull ⇒ 才跑 inGameHooks。
     */
    @Override public boolean ready() {
        net.minecraft.client.Minecraft mc = mc();
        return mc != null && mc.g != null && mc.g.q != null;
    }

    @Override public void tick() { }

    // =============== 读数面（真读坐标 —— L-b 判据） ===============

    @Override public String playerStateJson() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        net.minecraft.client.Minecraft mc = mc();
        if (mc == null || mc.g == null || mc.g.q == null) {
            m.put("present", Boolean.FALSE);
            return Json.of(m);
        }
        bdv p = mc.g;
        m.put("present", Boolean.TRUE);
        m.put("x", r4(p.u));                        // mp.u = posX（e/f(DDD) 读它做差）
        m.put("y", r4(p.v));                        // mp.v = posY
        m.put("z", r4(p.w));                        // mp.w = posZ
        m.put("yaw", r4((double) p.A));             // mp.A = rotationYaw（c(FF) 走 par1*0.15）
        m.put("pitch", r4((double) p.B));           // mp.B = rotationPitch（c(FF) 只夹它到 ±90）
        m.put("motionX", r4(p.x));                  // mp.x = motionX（moveFlying/moveEntity 累加）
        m.put("motionY", r4(p.y));
        m.put("motionZ", r4(p.z));
        m.put("worldTime", Long.valueOf(mc.g.q.I()));   // aab.I() —— ModLoader 自己当 tick 钟用
        return Json.of(m);
    }

    @Override public String screenName() {
        net.minecraft.client.Minecraft mc = mc();
        if (mc == null || mc.s == null) return null;
        return mc.s.getClass().getName();
    }

    // =============== 开世界（= startWorld） ===============

    /**
     * 打开/新建一个存档。
     *
     * 出处：Minecraft.a(String,String,aai) 的字节码逐条对上 vanilla startWorld：
     *   a((bds)null)（changeWorld） -> System.gc() -> ac.a(par1,false)（ISaveFormat.getSaveLoader）
     *   -> saveLoader.d()（WorldInfo） -> worldInfo==null && settings!=null ⇒ new ajv(settings,par1) 落盘
     *   -> settings==null ⇒ settings = new aai(worldInfo)（**已存在存档走这条**）
     *   -> new bjg(this,par1,par2,settings)（IntegratedServer） -> bjg.t()（startServer）
     *   -> 自旋等 bjg.af() -> a((axr)null)（displayGuiScreen(null)） -> new bdk（NetClientHandler）
     *
     * 存档目录 = new File(Minecraft.E, "saves")（E = mcDataDir，出处见类注释）。
     * 已存在 ⇒ 传 null settings（vanilla 自己在 startWorld 里用 new aai(worldInfo) 补上，保住存档 seed/gamemode）；
     * 不存在 ⇒ 传新 aai(seed, aaj.c=CREATIVE, mapFeatures=true, hardcore=false, aal.b=DEFAULT) 新建。
     */
    @Override public void openWorld(String worldName) {
        net.minecraft.client.Minecraft mc = mc();
        if (mc == null) throw new IllegalStateException("Minecraft 实例不可达（tick 钩子还没跑过）");
        if (worldName == null || worldName.isEmpty()) throw new IllegalArgumentException("world 名不能为空");
        File saveDir = new File(new File(mc.E, "saves"), worldName);
        aai settings = null;
        if (!saveDir.isDirectory()) {
            settings = new aai(20261103L, aaj.c, true, false, aal.b);
        }
        mc.a(worldName, worldName, settings);
    }

    @Override public void chatCommand(String command) {
        todo("发聊天/命令（ModLoader.clientChat(String) 是**收**不是**发**）");
    }

    @Override public String screenshotPath() { todo("截图 API"); return null; }

    // =============== 按键面（逐条 javap 实证；**零硬编码键名**） ===============

    /**
     * 运行期键名。1.5.2 的 ava.c 是**描述串**（avy 构造器里字面量 "key.forward" / "key.sneak" /
     * "key.command" 实证）⇒ 把每条绑定的「最后一段」（key.forward -> forward）当**对外键名**输出，
     * **只在该段全局唯一时**才用它（否则退回完整描述串）。
     * 源码里**零硬编码键名**（"forward" 这个字面量一个都不写）。
     */
    @Override public List<String> supportedKeys() {
        return new ArrayList<String>(nameMap().keySet());
    }

    private static List<ava> bindings() {
        List<ava> out = new ArrayList<ava>();
        List<?> all = ava.a;
        if (all == null) return out;
        for (Object o : all) {
            if (o instanceof ava) out.add((ava) o);
        }
        return out;
    }

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
    private static Map<String, ava> nameMap() {
        List<ava> all = bindings();
        Map<String, java.util.Set<String>> segDescs = new LinkedHashMap<String, java.util.Set<String>>();
        for (ava kb : all) {
            String s = seg(kb.c);
            if (s == null) continue;
            java.util.Set<String> d = segDescs.get(s);
            if (d == null) { d = new java.util.LinkedHashSet<String>(); segDescs.put(s, d); }
            d.add(kb.c);
        }
        Map<String, ava> m = new LinkedHashMap<String, ava>();
        for (ava kb : all) {
            String s = seg(kb.c);
            boolean unambiguous = s != null && segDescs.get(s).size() == 1;
            String name = unambiguous ? s : kb.c;
            if (name != null && !m.containsKey(name)) m.put(name, kb);
        }
        return m;
    }

    /** 运行期键位表的**原始条目数**（含重复注册）；只用于证据自证，不参与协议。 */
    public static int rawKeyCount() { return bindings().size(); }

    private static ava find(String key) {
        if (key == null) return null;
        for (ava kb : bindings()) {
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
        ava kb = find(key);
        return kb != null && kb.e;
    }

    @Override public void setPressed(String key, boolean down) {
        ava kb = find(key);
        if (kb == null) throw new IllegalArgumentException("未知按键：" + key + "（本档键名以运行期键位表为准）");
        ava.a(kb.d, down);     // public static void a(int,boolean) —— 字节码：查 IntHashMap -> putfield e
    }

    // =============== 其余全部 fail-closed ===============

    @Override public String spawnBot(String name, double distance) { todo("召唤化身（本档不做）"); return null; }
    @Override public void moveBotTo(double x, double y, double z) { todo("移动化身"); }
    @Override public void tickBot() { }
    @Override public String giveBot(String item, int count) { todo("给化身发物品"); return null; }
    /** 本机玩家转视角。锚点：`mp.A`=rotationYaw、`mp.B`=rotationPitch（只有 B 被夹 ±90）。 */
    @Override public boolean look(double yaw, double pitch) {
        net.minecraft.client.Minecraft mc = mc();
        if (mc == null || mc.g == null) return false;
        bdv p = mc.g;
        p.A = (float) yaw;    // mp.A = rotationYaw
        p.B = (float) pitch;  // mp.B = rotationPitch
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
