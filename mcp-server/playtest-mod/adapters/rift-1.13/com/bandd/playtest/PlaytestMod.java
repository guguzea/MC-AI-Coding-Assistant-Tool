package com.bandd.playtest;

import com.bandd.playtest.core.Arbitration;
import com.bandd.playtest.core.HttpApi;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.rift113.RiftAdapter;
import org.dimdev.rift.listener.client.ClientTickable;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 入口（rift 1.13 原生档）：一个 JAR 两副面孔（桥面 = 命令级 / driver 面 = 玩家级）。
 *
 * **有出处的写法**（其余一律 TODO(未核实)）：
 *   1. 入口接口 @@org.dimdev.rift.listener.client.ClientTickable@@，回调 @@public void clientTick()@@（**无参**）
 *      —— 出处 @@rift/1.13/knowledge/common/listeners.md:57@@（client 子表）+ @@verified-api.md@@ 的 javap 行
 *      （@@public abstract void clientTick();@@，真构件 @@Rift-1.0.4-106-dev.jar@@）。
 *   2. listener 类须 **public 无参构造**，类名写进 @@riftmod.json@@ 的 @@listeners@@ 数组
 *      —— 出处 @@knowledge/common/making-mods-wiki.md@@（Listener 段）。
 *   3. tweakClass = @@org.dimdev.riftloader.launch.RiftLoaderClientTweaker@@ —— 本档 scaffold 已这么写。
 *
 * ⚠ **本档 MC 侧全未核**（bridge-api.md 明写不提供桥）⇒ 证据/配置落 **CWD 相对路径**，
 * 适配层整层 fail-closed（见 RiftAdapter）。
 */
public class PlaytestMod implements ClientTickable {

    public static final String MOD_ID = "bandd_playtest";

    private static PlaytestCore core;
    private static HttpApi http;
    private static boolean initFailed;

    @Override
    public void clientTick() {
        ensureInit();
        if (core != null) {
            core.onTick();
        }
    }

    private static synchronized void ensureInit() {
        if (core != null || initFailed) return;
        try {
            // TODO(未核实)：1.13 的 gameDir 字段名未核 ⇒ 证据/配置落 CWD 相对路径。
            Path base = Paths.get(".").toAbsolutePath().normalize();
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

            RiftAdapter bridge = new RiftAdapter();
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
                    + " evidenceDir=" + evidenceDir);
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
