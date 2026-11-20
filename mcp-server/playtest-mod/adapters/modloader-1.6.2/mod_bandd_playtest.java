import com.bandd.playtest.core.Arbitration;
import com.bandd.playtest.core.HttpApi;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 入口：ModLoader 1.6.2 的**默认包** mod（「直接对官方混淆 client.jar 编译」路线）。
 *
 * **为什么在默认包**：BaseMod / ModLoader 在默认包，且本档 MC 类（ats/bdf/atp…）也全在默认包；
 * Java 不允许具名包引用默认包 ⇒ 本类必须在默认包（默认包 import 具名包则没问题）。
 *
 * **加载链（逐条 javap 实证，ModLoader-1.6.2.zip）**：
 *   RenderManager(bgi) 的 static {} -> new bgi() -> 构造器里 ModLoader.addAllRenderers(map)
 *     -> ModLoader.init() -> loadConfig() + readFromClassPath() + readFromModFolder(modDir) + sortModList()
 *     -> readFromModFolder 只认 mods/ 下 **.jar/.zip**，且只把 zip 内 **以 mod_ 开头、以 .class 结尾** 的条目交给 addMod
 *     -> addMod 里 name.split(".")[0] 取简单类名 + 跳过含 $ 的 -> modList -> init() 末尾调 BaseMod.load()
 *   ⇒ 本 jar 必须放在 <gameDir>/mods/，且入口类名必须以 mod_ 开头、类文件在 jar **根**。
 *   ⇒ 因为 RenderManager 的 static {} 在 ats 构造器里就触发，**mod 在游戏启动时（还没进世界）就被加载**。
 *
 * **tick 来源（两条，互补；不重复调）**：
 *   1) 进世界**前**：ModLoader.onTick 还不存在（它由 EntityRendererProxy 调，而那个代理是
 *      ModLoader.registerServer 在**集成服启动**时才装进 ats.p 的）⇒ 本模组自己装一个 bfb 子类
 *      （BanddTickProxy）到 ats.p，拿到**MC 线程**上的每帧回调 —— 这样 open_world 这类动作
 *      才能在 MC 线程上执行（HTTP 线程碰 MC 会崩）。
 *   2) 进世界**后**：ModLoader.registerServer 会把 ats.p 换成它自己的 EntityRendererProxy，
 *      于是走 setInGameHook 注册的 onTickInGame（本模组在 load() 里注册）。
 *      看门狗只在 ats.p 是**朴素 bfb**时才装自己的代理 ⇒ 永不覆盖 ModLoader 的代理。
 */
public class mod_bandd_playtest extends BaseMod {

    public static final String MOD_ID = "bandd_playtest";

    private static PlaytestCore core;
    private static HttpApi http;
    private static boolean initFailed;

    @Override
    public String getVersion() {
        return "0.1.0";
    }

    /**
     * 进世界前用的 tick 代理。**必须在 load() 里构造**：
     * load() 跑在 **MC 线程**上（它由 ModLoader.init() -> BaseMod.load() 触发，而 init() 是 RenderManager(bgi)
     * 的 static{} 在 ats 构造器偏移 ~707 处触发的），此时 Display.create() 早已执行（ats 构造器偏移 ~250/282）
     * ⇒ **GL 上下文在场**。bfb 的构造器要做 GL 调用，换到别的线程 new 会抛
     * "No OpenGL context found in the current thread"（实测踩到）。看门狗线程只负责**赋值**，不负责构造。
     */
    private static volatile bfb preWorldProxy;

    @Override
    public void load() {
        // 第三参 false = 每帧都调（ModLoader.onTick 的 clock 去重只在第三参为 true 时生效；字节码实证）。
        ModLoader.setInGameHook(this, true, false);
        try {
            ats mc = ats.w();
            if (mc != null) {
                preWorldProxy = new BanddTickProxy(mc);
                System.out.println("[bandd-playtest] pre-world tick proxy constructed on MC thread (GL ctx present)");
            }
        } catch (Throwable t) {
            System.err.println("[bandd-playtest] pre-world proxy construct failed: " + t);
            t.printStackTrace();
        }
        ensureInit();
        startTickProxyWatchdog();
    }

    @Override
    public void modsLoaded() {
    }

    /** 进世界之后的 tick 来源（ModLoader.onTick -> inGameHooks -> 这里）。返回值 false 会被摘 hook ⇒ 恒 true。 */
    @Override
    public boolean onTickInGame(float partialTicks, ats mc) {
        tickFromGameThread(mc);
        return true;
    }

    /** BanddTickProxy（进世界之前）与 onTickInGame（进世界之后）共用的唯一 tick 入口。 */
    public static void tickFromGameThread(ats mc) {
        PlaytestCore c = core;
        if (c != null) c.onTick();
    }

    /**
     * 看门狗：只在 ats.p 是**朴素 bfb**（= 既不是本模组的代理、也不是 ModLoader 的 EntityRendererProxy）时
     * 装上本模组的代理。为什么需要：进世界前没有任何 MC 线程回调可用；
     * 而 ats.p 在 ats 构造器里是**后于** ModLoader.init() 才赋值的 ⇒ 在 load() 里直接装会被覆盖。
     */
    private static void startTickProxyWatchdog() {
        Thread t = new Thread(new Runnable() {
            @Override public void run() {
                try { Thread.sleep(2000L); } catch (InterruptedException e) { return; }
                boolean logged = false;
                for (;;) {
                    try {
                        ats mc = ats.w();
                        bfb proxy = preWorldProxy;
                        // 只赋值：构造需要 GL 上下文（见 preWorldProxy 注释），本线程没有。
                        if (mc != null && proxy != null && mc.p != null && mc.p.getClass() == bfb.class) {
                            mc.p = proxy;
                            if (!logged) {
                                logged = true;
                                System.out.println("[bandd-playtest] tick proxy installed on ats.p (pre-world, MC thread)");
                            }
                        }
                    } catch (Throwable e) {
                        System.err.println("[bandd-playtest] tick proxy watchdog: " + e);
                    }
                    try { Thread.sleep(500L); } catch (InterruptedException e) { return; }
                }
            }
        }, "bandd-playtest-tickproxy");
        t.setDaemon(true);
        t.start();
    }

    private static synchronized void ensureInit() {
        if (core != null || initFailed) return;
        try {
            // 游戏目录出处：ModLoader 自己的字节码 new File(ats.w().x, "mods") / "ModLoader.txt" ⇒ ats.x = mcDataDir。
            ats mc = ats.w();
            Path base = (mc != null && mc.x != null)
                    ? mc.x.toPath().toAbsolutePath().normalize()
                    : Paths.get(".").toAbsolutePath().normalize();
            Path cfgPath = base.resolve("config").resolve(MOD_ID + ".json");
            Map<String, Object> cfg = loadOrCreateConfig(cfgPath, base);

            String token = Json.str(cfg, "token", "");
            int port = (int) Double.parseDouble(Json.str(cfg, "port", "38081"));
            String modeName = Json.str(cfg, "arbitration", "AUTO");
            String evidenceDir = Json.str(cfg, "evidenceDir", "");
            if (evidenceDir.isEmpty()) {
                evidenceDir = base.resolve("bandd-playtest-evidence").toString();
            } else {
                Path ed = Paths.get(evidenceDir);
                if (!ed.isAbsolute()) evidenceDir = base.resolve(ed).normalize().toString();
            }

            ObfAdapter bridge = new ObfAdapter();
            core = new PlaytestCore(bridge, Paths.get(evidenceDir), token);
            try {
                core.arbitration().setMode(Arbitration.Mode.valueOf(modeName.toUpperCase()));
            } catch (IllegalArgumentException e) {
                core.evidence().log("[QA] 配置里的 arbitration=" + modeName + " 不合法，回退 AUTO");
            }

            http = new HttpApi(core);
            int actual = http.start(port);
            core.evidence().log("[QA] init: mod=" + MOD_ID + " platform=" + bridge.platform()
                    + " mc=" + bridge.mcVersion() + " port=" + actual
                    + " arbitration=" + core.arbitration().mode()
                    + " gameDir=" + base
                    + " evidenceDir=" + evidenceDir
                    + " keyCount=" + bridge.supportedKeys().size());   // 运行期键位表大小（零猜测）
            core.evidence().state(Json.of(core.status()));

            Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
                @Override public void run() {
                    if (core != null) core.onShutdown();
                    if (http != null) http.stop();
                }
            }, "bandd-playtest-shutdown"));
        } catch (Throwable t) {
            initFailed = true;
            System.err.println("[bandd-playtest] init failed: " + t);
            t.printStackTrace();
        }
    }

    private static Map<String, Object> loadOrCreateConfig(Path cfgPath, Path base) {
        try {
            if (Files.exists(cfgPath)) {
                return Json.parseObject(new String(Files.readAllBytes(cfgPath), StandardCharsets.UTF_8));
            }
            Map<String, Object> cfg = new LinkedHashMap<String, Object>();
            byte[] b = new byte[16];
            new SecureRandom().nextBytes(b);
            StringBuilder sb = new StringBuilder();
            for (byte x : b) sb.append(String.format("%02x", x));
            cfg.put("token", sb.toString());
            cfg.put("port", 38081);
            cfg.put("arbitration", "AUTO");
            cfg.put("evidenceDir", base.resolve("bandd-playtest-evidence").toString());
            cfg.put("_comment", "token 必须随请求带上；port 被占会自动 +1；arbitration = AUTO | HOTKEY | DUAL");
            Files.createDirectories(cfgPath.getParent());
            Files.write(cfgPath, Json.of(cfg).getBytes(StandardCharsets.UTF_8));
            return cfg;
        } catch (Exception e) {
            System.err.println("[bandd-playtest] config 读写失败，用内存默认值: " + e);
            Map<String, Object> cfg = new LinkedHashMap<String, Object>();
            cfg.put("token", "");
            cfg.put("port", 38081);
            cfg.put("arbitration", "AUTO");
            return cfg;
        }
    }
}
