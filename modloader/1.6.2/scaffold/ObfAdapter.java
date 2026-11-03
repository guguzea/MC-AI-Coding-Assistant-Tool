import com.bandd.playtest.core.Capabilities;
import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * **默认包**适配层 —— ModLoader 1.6.2（「直接对官方混淆 client.jar 编译」路线）。
 *
 * 为什么必须在默认包：1.6.2 的 MC 类全在**默认包**（ats / bdf / atp …），
 * 而 **Java 不允许具名包引用默认包** ⇒ 任何要直接命名 MC 类的代码自己也得在默认包。
 * 反向可以（默认包 import 具名包）⇒ 本类照样 implements com.bandd.playtest.core.GameBridge。
 *
 * 为什么不需要 reobf / 映射：reobf 的作用是「把可读名改写成混淆名」。本路线**写的本来就是混淆名**
 * （逐条来自本机 javap 真构件）⇒ 编译产物里的引用**就是运行期名字**。
 *
 * ===== 字段/方法锚定表（全部**调用点级**证据，逐条本机 javap -c） =====
 *
 * | 用途 | 混淆名 | 签名 | 锚点证据 |
 * |---|---|---|---|
 * | Minecraft 单例 | ats.w() | public static ats w() | ModLoader 自身字节码 ats.w().x |
 * | thePlayer | ats.h | public bdf h | ModLoader.onTick: ats.h != null && ats.h.q != null |
 * | theWorld | nm.q（经 bdf 继承） | public abv q | 同上（ModLoader 用 ats.h.q 判「玩家在世界里」）|
 * | gameSettings | ats.u | public aui u | ModLoader.onTick: ats.u.an（语言）|
 * | currentScreen | ats.n | public awb n | ModLoader.onTick: if (ats.n != null) ... ats.n |
 * | posX/Y/Z | nm.u / nm.v / nm.w | public double u/v/w | nm.e(DDD)（getDistance）读这三个字段做差求距离 |
 * | motionX/Y/Z | nm.x / nm.y / nm.z | public double x/y/z | nm.a(FFF)（moveFlying）把速度累加进 x/z |
 * | rotationYaw/Pitch | nm.A / nm.B | public float A/B | (1) nm.c(FF)（setAngles）: **B 被夹到 ±90**、A 走 par1*0.15；(2) nm.a(FFF): A*pi/180 -> lr.a/lr.b（sin/cos）；(3) NBT 字面量 "Rotation" 写 float[]{A,B}；(4) o.A-o.C / o.B-o.D 成对 |
 * | prevRotationYaw/Pitch | nm.C / nm.D | public float C/D | 同上 (1)(3)(4) |
 * | 世界时间（tick 钟） | abv.J() | public long J() | ModLoader.onTick 把它当 tick 去重用的 clock |
 * | 键位表 | atp.a | public static java.util.List a | atp(String,int) 构造器里 a.add(this) |
 * | 键名 | atp.c | public java.lang.String c | atp(String,int) 写 c |
 * | 键码 | atp.d | public int d | 同上；atp.b（IntHashMap）用它做键 |
 * | 按下态 | atp.e | public boolean e | atp.a(int,boolean) 只写 e；atp.d()（unpressKey）清 e |
 * | **注入按下/松开** | atp.a(int,boolean) | public static void | 字节码 = 按 keyCode 查 IntHashMap -> putfield atp.e（= vanilla setKeyBindState）|
 * | pressTime | atp.f | public int f | atp.a(int) ++f；atp.c() 消耗 f |
 * | 开世界（= launchIntegratedServer） | ats.a(String,String,acc) | public void | 字节码 = loadWorld(null) -> ISaveFormat.getSaveLoader -> WorldInfo -> new bkw（IntegratedServer）-> displayGuiScreen(null) |
 * | 世界设置 | acc(long,acd,boolean,boolean,acf) | public | 上面那条的 par3 类型就是 acc |
 * | 游戏模式 | acd.a(int) | public static acd a(int) | 字节码 = 遍历 values() 比 e（id）取，缺省返回 b（= vanilla getByID）|
 * | 世界类型 | acf.b | public static final acf b | 字段声明序（a = worldTypes 数组，b = DEFAULT）|
 * | 游戏目录（mcDataDir） | ats.x | public final java.io.File x | ModLoader: new File(ats.w().x, "mods") / "ModLoader.txt" / "versions" |
 *
 * **未锚定 ⇒ 一律 fail-closed**（不猜）：血量/饥饿/背包/截图/聊天收发/化身/认证开关/连服务器。
 */
public final class ObfAdapter implements GameBridge {

    /** 本档真正能做的动作（其余如实自报 unavailable，不静默）。 */
    private static final List<String> CAN_DO = Collections.unmodifiableList(java.util.Arrays.asList(
            "ping", "set_arbitration", "status",
            "query_player_state", "query_screen",
            "press", "release_all", "take_over", "open_world"));

    private static boolean todoLogged;

    private static void todo(String what) {
        if (todoLogged) return;
        todoLogged = true;
        System.err.println("[bandd-playtest] TODO(未核实)：ModLoader 1.6.2 的「" + what + "」本档无调用点级出处 ⇒ fail-closed。");
    }

    private static double r4(double d) { return Math.round(d * 10000.0) / 10000.0; }

    @Override public String platform() { return "modloader"; }

    @Override public String mcVersion() { return "1.6.2"; }

    /**
     * 世界与玩家都在场。
     * **出处 = ModLoader 自己的 onTick 字节码**：ats.h != null && ats.h.q != null 才调 onTickInGame。
     * 比「单例可达」强：单例在主菜单也成立（那是假绿）。
     */
    @Override public boolean ready() {
        ats mc = ats.w();
        return mc != null && mc.h != null && mc.h.q != null;
    }

    @Override public void tick() { }

    // =============== 读数面（真读坐标 —— L-b 判据） ===============

    @Override public String playerStateJson() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        ats mc = ats.w();
        if (mc == null || mc.h == null || mc.h.q == null) {
            m.put("present", Boolean.FALSE);
            return Json.of(m);
        }
        bdf p = mc.h;
        m.put("present", Boolean.TRUE);
        m.put("x", r4(p.u));                        // nm.u = posX（getDistance 读它）
        m.put("y", r4(p.v));                        // nm.v = posY
        m.put("z", r4(p.w));                        // nm.w = posZ
        m.put("yaw", r4((double) p.A));             // nm.A = rotationYaw
        m.put("pitch", r4((double) p.B));           // nm.B = rotationPitch（setAngles 夹 ±90）
        m.put("motionX", r4(p.x));                  // nm.x = motionX（moveFlying 累加）
        m.put("motionY", r4(p.y));
        m.put("motionZ", r4(p.z));
        m.put("worldTime", Long.valueOf(mc.h.q.J()));   // abv.J() —— ModLoader 自己当 tick 钟用
        return Json.of(m);
    }

    @Override public String screenName() {
        ats mc = ats.w();
        if (mc == null || mc.n == null) return null;
        return mc.n.getClass().getName();
    }

    // =============== 开世界（= launchIntegratedServer） ===============

    /**
     * 打开/新建一个存档。
     *
     * 出处：ats.a(String,String,acc) 的字节码逐条对上 vanilla launchIntegratedServer(folder, name, WorldSettings)：
     * a((bda)null)（loadWorld） -> ad.a(folder,false)（getSaveLoader） -> alz.d()（getWorldInfo）
     * -> 若 worldInfo==null 且 settings!=null 则 new alp(settings,folder) 落盘 -> new bkw(this,folder,name,settings)（IntegratedServer）
     * -> 自旋等 bkw.ah() -> a((awb)null)（displayGuiScreen(null)）。
     *
     * 存档目录 = new File(ats.w().x, "saves")（x = mcDataDir，出处见类注释）。
     * 已存在 ⇒ 传 null settings（与 vanilla GuiSelectWorld 同路，保住存档自己的 seed/gamemode）；
     * 不存在 ⇒ 传新 acc(seed, CREATIVE, mapFeatures=true, hardcore=false, acf.b) 新建。
     */
    @Override public void openWorld(String worldName) {
        ats mc = ats.w();
        if (mc == null) throw new IllegalStateException("Minecraft 单例不可达（ats.w() == null）");
        if (worldName == null || worldName.isEmpty()) throw new IllegalArgumentException("world 名不能为空");
        File saveDir = new File(new File(mc.x, "saves"), worldName);
        acc settings = null;
        if (!saveDir.isDirectory()) {
            settings = new acc(20261103L, acd.a(1), true, false, acf.b);
        }
        mc.a(worldName, worldName, settings);
    }

    @Override public void chatCommand(String command) {
        todo("发聊天/命令（ModLoader.clientChat(String) 是**收**不是**发**：字节码里它只遍历 modList 调 BaseMod.clientChat）");
    }

    @Override public String screenshotPath() { todo("截图 API"); return null; }

    // =============== 按键面（逐条 javap 实证；**零硬编码键名**） ===============

    /**
     * 运行期键名。1.6.2 的 atp.c 是**描述串**（aui 的构造器里字面量 "key.forward" / "key.sneak" /
     * "key.hotbar.1" 实证）⇒ 本方法把每条绑定的「最后一段」（key.forward -> forward）当**对外键名**输出，
     * **只在该段全局唯一时**才用它（否则退回完整描述串）。
     * 为什么这样做：源码里**零硬编码键名**（"forward" 这个字面量一个都不写），同时让 /status 的
     * supportedKeys 与 press 的入参口径一致（core 的 press 会先按这张表校验，名字对不上就 KEY_NOT_SUPPORTED）。
     */
    @Override public List<String> supportedKeys() {
        return new ArrayList<String>(nameMap().keySet());
    }

    private static List<atp> bindings() {
        List<atp> out = new ArrayList<atp>();
        List<?> all = atp.a;
        if (all == null) return out;
        for (Object o : all) {
            if (o instanceof atp) out.add((atp) o);
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

    /** 对外键名 -> 绑定。段名重复的退回完整描述串（不猜、不歧义）。 */
    private static Map<String, atp> nameMap() {
        List<atp> all = bindings();
        Map<String, Integer> segCount = new LinkedHashMap<String, Integer>();
        for (atp kb : all) {
            String s = seg(kb.c);
            if (s == null) continue;
            Integer c = segCount.get(s);
            segCount.put(s, Integer.valueOf(c == null ? 1 : c.intValue() + 1));
        }
        Map<String, atp> m = new LinkedHashMap<String, atp>();
        for (atp kb : all) {
            String s = seg(kb.c);
            String name = (s != null && segCount.get(s).intValue() == 1) ? s : kb.c;
            if (name != null && !m.containsKey(name)) m.put(name, kb);
        }
        return m;
    }

    /** 先按完整描述串精确查，再按对外键名查；查不到返回 null（调用方 fail-closed）。 */
    private static atp find(String key) {
        if (key == null) return null;
        for (atp kb : bindings()) {
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
        atp kb = find(key);
        return kb != null && kb.e;
    }

    @Override public void setPressed(String key, boolean down) {
        atp kb = find(key);
        if (kb == null) throw new IllegalArgumentException("未知按键：" + key + "（本档键名以运行期键位表为准）");
        atp.a(kb.d, down);     // public static void a(int,boolean) —— 字节码：查 IntHashMap -> putfield e
    }

    // =============== 其余全部 fail-closed ===============

    @Override public String spawnBot(String name, double distance) { todo("召唤化身（1.6.2 无 mannequin；本档不做）"); return null; }
    @Override public void moveBotTo(double x, double y, double z) { todo("移动化身"); }
    @Override public void tickBot() { }
    @Override public String giveBot(String item, int count) { todo("给化身发物品"); return null; }
    /** 本机玩家转视角。锚点：`nm.A`=rotationYaw、`nm.B`=rotationPitch（setAngles 只夹 B 到 ±90；NBT 字面量 "Rotation" 紧跟 float[]{A,B}）。 */
    @Override public boolean look(double yaw, double pitch) {
        ats mc = ats.w();
        if (mc == null || mc.h == null) return false;
        bdf p = mc.h;
        p.A = (float) yaw;    // nm.A = rotationYaw
        p.B = (float) pitch;  // nm.B = rotationPitch
        return true;
    }

    @Override public boolean lookBot(double yaw, double pitch) { todo("化身转向"); return false; }
    @Override public String breakBotBlock(double x, double y, double z) { todo("化身挖方块"); return null; }
    @Override public String placeBotBlock(double x, double y, double z) { todo("化身放方块"); return null; }
    @Override public boolean setServerAuth(boolean online) { todo("关集成服认证（拿不到 MinecraftServer 句柄）"); return false; }
    @Override public void joinServer(String address) { todo("作为真客户端连服务器"); }
    @Override public void despawnBot() { }
    @Override public String openBotInventory() { todo("开化身物品栏"); return null; }
    @Override public List<String> drainChat() { todo("聊天接收钩子（BaseMod.clientChat 在，但本档不挂）"); return Collections.emptyList(); }

    /** 能力自报：**按实际做得到的列白名单**，其余逐条列 unavailable（谎报比不报更糟）。 */
    @Override public List<String> unavailableActions() {
        List<String> l = new ArrayList<String>();
        for (String a : Capabilities.all()) {
            if (!CAN_DO.contains(a)) l.add(a);
        }
        return l;
    }
}
