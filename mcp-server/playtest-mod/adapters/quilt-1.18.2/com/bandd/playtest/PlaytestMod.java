package com.bandd.playtest;

import com.bandd.playtest.core.Arbitration;
import com.bandd.playtest.core.HttpApi;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.quilt_1_18_2.QuiltAdapter;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.minecraft.client.MinecraftClient;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * quilt 1.18.2 入口：一个 JAR 两副面孔（桥面 = 命令级 / driver 面 = 玩家级）。
 *
 * 入口点 = quilt.mod.json 的 entrypoints.client → net.fabricmc.api.ClientModInitializer，
 * 该接口**由 quilt-loader 自带**（javap 实测 quilt-loader-0.31.0-beta.4.jar 内有
 * net/fabricmc/api/ClientModInitializer.class）；Quilt 原生 org.quiltmc.loader.api.entrypoint.*
 * 在本版 jar 内 0 命中（javap 实测），且 QSL 在本档 MC 版本无构件 ⇒ 不引 QSL。
 * tick 事件用同版 Fabric API 的 ClientTickEvents（quilt-loader 不含 Fabric API）。
 */
public final class PlaytestMod implements ClientModInitializer {
    public static final String MOD_ID = "bandd_playtest";

    private static PlaytestCore core;
    private static HttpApi http;
    private static boolean initFailed;

    @Override
    public void onInitializeClient() {
        ClientTickEvents.END_CLIENT_TICK.register(client -> {
            QuiltAdapter.setClient(client);   // 适配层的客户端实例由入口每 tick 推一次
            ensureInit(client);
            if (core != null) core.onTick();
        });
    }

    private static synchronized void ensureInit(MinecraftClient client) {
        if (core != null || initFailed) return;
        try {
            Path runDir = client.runDirectory.toPath().toAbsolutePath().normalize();
            Path cfgPath = runDir.resolve("config").resolve(MOD_ID + ".json");
            Map<String, Object> cfg = loadOrCreateConfig(cfgPath);

            String token = Json.str(cfg, "token", "");
            int port = (int) Double.parseDouble(Json.str(cfg, "port", "38081"));
            String modeName = Json.str(cfg, "arbitration", "AUTO");
            String evidenceDir = Json.str(cfg, "evidenceDir", "");
            if (evidenceDir.isEmpty()) {
                evidenceDir = runDir.resolve("bandd-playtest-evidence").toString();
            } else {
                Path ed = Paths.get(evidenceDir);
                if (!ed.isAbsolute()) evidenceDir = runDir.resolve(ed).normalize().toString();
            }

            QuiltAdapter bridge = new QuiltAdapter();
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

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                if (core != null) core.onShutdown();
                if (http != null) http.stop();
            }, "bandd-playtest-shutdown"));
        } catch (Throwable t) {
            initFailed = true;
            System.err.println("[bandd-playtest] init failed: " + t);
        }
    }

    private static Map<String, Object> loadOrCreateConfig(Path cfgPath) {
        try {
            if (Files.exists(cfgPath)) {
                return Json.parseObject(new String(Files.readAllBytes(cfgPath), StandardCharsets.UTF_8));
            }
            Map<String, Object> cfg = new LinkedHashMap<>();
            byte[] b = new byte[16];
            new SecureRandom().nextBytes(b);
            StringBuilder sb = new StringBuilder();
            for (byte x : b) sb.append(String.format("%02x", x));
            cfg.put("token", sb.toString());
            cfg.put("port", 38081);
            cfg.put("arbitration", "AUTO");
            cfg.put("evidenceDir", cfgPath.getParent().getParent().resolve("bandd-playtest-evidence").toString());
            cfg.put("_comment", "token 必须随请求带上；port 被占会自动 +1；arbitration = AUTO | HOTKEY | DUAL");
            Files.createDirectories(cfgPath.getParent());
            Files.write(cfgPath, Json.of(cfg).getBytes(StandardCharsets.UTF_8));
            return cfg;
        } catch (Exception e) {
            System.err.println("[bandd-playtest] config 读写失败，用内存默认值: " + e);
            Map<String, Object> cfg = new LinkedHashMap<>();
            cfg.put("token", "");
            cfg.put("port", 38081);
            cfg.put("arbitration", "AUTO");
            return cfg;
        }
    }
}
