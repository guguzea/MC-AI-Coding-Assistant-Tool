import com.bandd.playtest.core.Arbitration;
import com.bandd.playtest.core.HttpApi;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import net.minecraft.client.Minecraft;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 入口：ModLoader 1.2.5 的**默认包** mod（「直接对官方混淆 client.jar 编译」路线）。
 *
 * **为什么在默认包**：BaseMod / ModLoader 在默认包，且本档 MC 类也几乎全在默认包（nn / afu / vq …）；
 * Java 不允许具名包引用默认包 ⇒ 本类必须在默认包（默认包 import 具名包则没问题）。
 *
 * **加载链（逐条 javap 实证，ModLoader-1.2.5.zip）**：
 *   Minecraft.<init> 偏移 436 读 ahu.a（RenderManager 单例）-> ahu.<static> new ahu()
 *     -> ahu.<init> 里 ModLoader.addAllRenderers(map)
 *     -> ModLoader.init() -> loadConfig + readFromClassPath + readFromModFolder(modDir) + sortModList
 *     -> readFromModFolder 只认 mods/ 下 **.jar/.zip**，且只把 zip 内 **以 "mod_" 开头、以 ".class" 结尾**
 *        的条目交给 addMod（字节码里的 ldc "mod_" / ".class" 实证）
 *     -> init() 末尾调 BaseMod.load()
 *   ⇒ 本 jar 必须放在 <gameDir>/mods/（modDir = new File(Minecraft.b(), "/mods/")，字节码实证），
 *     入口类名必须以 mod_ 开头、类文件在 jar **根**。
 *   ⇒ ModLoader 自身是 **jar mod**（含 ahu/adl/… 等被改写的 vanilla 类）⇒ 必须合并进 client.jar。
 *
 * **tick 来源（两条钩子，逐条字节码实证；不重复 tick）**：
 *   ModLoader.onTick 由它自己的 EntityRendererProxy 每帧调用一次，而那个代理是 **ModLoader.init()**
 *   装进 Minecraft.u 的（init 字节码：instance.u = new EntityRendererProxy(instance)）；
 *   init() 又在 **Minecraft 构造器偏移 436** 处被 ahu 的 static{} 触发 ⇒ **进世界前 onTick 就在跑**。
 *   在 onTick 里：
 *     · inGameHooks 的 guard = getfield Minecraft.f:Lxd; ifnull（theWorld != null）
 *     · inGUIHooks 的 guard = getfield Minecraft.r:Lnl; ifnull（= standardGalacticFontRenderer，构造器里就赋了 ⇒ 恒非 null）
 *   ⇒ 世界里两个钩子同帧都跑、主菜单只跑 GUI 钩子。所以本模组**只在没有世界时**让 GUI 钩子驱动 tick，
 *     世界里只让 inGame 钩子驱动 ⇒ **每帧恰好一次**（不需要 1.6.2 那个自造 bfb 代理）。
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

    @Override
    public void load() {
        // 第三参 false = 每帧都调（ModLoader.onTick 里 clock 去重只在第三参为 true 时生效；字节码实证）。
        ModLoader.setInGameHook(this, true, false);
        ModLoader.setInGUIHook(this, true, false);
    }

    @Override
    public void modsLoaded() {
    }

    /** 世界里：inGameHooks 每帧一次（guard = theWorld != null）。返回值 false 会被摘 hook ⇒ 恒 true。 */
    @Override
    public boolean onTickInGame(float partialTicks, Minecraft mc) {
        tickOnce(mc);
        return true;
    }

    /**
     * 界面打开时：**只有在没有世界时**才由本钩子驱动 tick。
     * 为什么：世界里两个钩子同帧都会跑（ModLoader.onTick 先跑 inGameHooks 再跑 inGUIHooks）⇒
     * 不加这条判断就会一帧 tick 两次。主菜单/加载中（theWorld == null）只有本钩子会跑 ⇒ 由它兜住。
     */
    @Override
    public boolean onTickInGUI(float partialTicks, Minecraft mc, vp gui) {
        if (mc == null || mc.f == null) tickOnce(mc);
        return true;
    }

    /** 唯一 tick 入口（MC 线程）。 */
    private static void tickOnce(Minecraft mc) {
        ObfAdapter.attach(mc);
        ensureInit(mc);
        PlaytestCore c = core;
        if (c != null) c.onTick();
    }

    private static synchronized void ensureInit(Minecraft mc) {
        if (core != null || initFailed) return;
        try {
            // 游戏目录出处：Minecraft.F = mcDataDir（构造器里 F = b() = getMinecraftDir()，
            // 紧接着 new File(F,"saves") / new hu(this,F) / new gi(this,F)；javap 实证）。
            Path base = (mc != null && mc.F != null)
                    ? mc.F.toPath().toAbsolutePath().normalize()
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
                    + " keyCount=" + bridge.supportedKeys().size()
                    + " rawKeyCount=" + ObfAdapter.rawKeyCount());   // 运行期键位表大小（零猜测）
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
