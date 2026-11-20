package com.bandd.playtest;

import com.bandd.playtest.core.Arbitration;
import com.bandd.playtest.core.HttpApi;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.liteloader1122.LiteLoaderAdapter;
import com.mumfrey.liteloader.LiteMod;
import com.mumfrey.liteloader.Tickable;
import net.minecraft.client.Minecraft;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 入口（LiteLoader 1.12.2 · **hybrid = liteloader_forge**）：一个 JAR 两副面孔。
 *
 * **有出处的写法**：
 *   1. \`implements LiteMod, Tickable\`；\`LiteMod\` 的 \`getName()/getVersion()/init(File)/upgradeSettings(String,File,File)\`
 *      —— 出处 = 本档 scaffold \`liteloader/1.12.2/scaffold/hybrid/src/.../LiteModExample.java\`（真构建过）。
 *   2. tick 回调 \`com.mumfrey.liteloader.Tickable#onTick(Minecraft, float, boolean, boolean)\`
 *      —— 出处 = \`PLAYTEST_VERIFIED_TIER\` 的 liteloader 1.12.2 条目（该档在册，出**真驱动**）。
 *   3. 元数据 \`litemod.json\`（\`name/version/mcversion/revision\`）—— 出处 = 本档 scaffold 的 \`litemod.json\`。
 *
 * ⚠ **hybrid 前置**：本工程是 \`apply plugin: 'net.minecraftforge.gradle.forge'\` 打底 +
 * LiteLoader 作为 tweak（见 build.gradle 的 afterEvaluate），**不是**纯 litemod。
 * 纯 litemod（\`scaffold/pure\`，无 Gradle、无 Forge）**不在本链**。
 *
 * MC 侧名字来源见 LiteLoaderAdapter 的类注释（逐条取自本档真驱动）。
 */
public class LiteModPlaytest implements LiteMod, Tickable {

    public static final String MOD_ID = "bandd_playtest";

    private static PlaytestCore core;
    private static HttpApi http;
    private static boolean initFailed;

    @Override public String getName() { return MOD_ID; }

    @Override public String getVersion() { return "0.1.0"; }

    @Override public void init(File configPath) { }

    @Override public void upgradeSettings(String version, File configPath, File oldConfigPath) { }

    @Override
    public void onTick(Minecraft mc, float partialTicks, boolean inGame, boolean clock) {
        LiteLoaderAdapter.attach(mc);
        ensureInit(mc);
        if (core != null) {
            core.onTick();
        }
    }

    private static synchronized void ensureInit(Minecraft mc) {
        if (core != null || initFailed) return;
        try {
            // \`Minecraft.gameDir\` 有出处（本档驱动用它做截图目录）⇒ 证据落游戏目录下。
            File gameDir = (mc != null && mc.gameDir != null) ? mc.gameDir : new File(".");
            Path base = gameDir.toPath().toAbsolutePath().normalize();
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

            LiteLoaderAdapter bridge = new LiteLoaderAdapter();
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
