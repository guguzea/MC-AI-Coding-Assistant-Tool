package com.bandd.playtest;

import com.bandd.playtest.core.Arbitration;
import com.bandd.playtest.core.HttpApi;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.fabric26.FabricAdapter;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.minecraft.client.Minecraft;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 入口：一个 JAR 两副面孔（桥面 = 命令级 / driver 面 = 玩家级），共用一套 HTTP 协议与一个 tick 队列。
 *
 * 初始化**延迟到第一次客户端 tick**（避免在 Minecraft 构造期拿 gameDirectory 的时序问题）。
 * 配置：<gameDir>/config/bandd_playtest.json（首次自动生成，含 token）。
 *
 * 与 fabric-1.21.11 档的差异：vanilla 名全换 Mojmap（MinecraftClient -> Minecraft）。
 * fabric-api 面（ClientTickEvents.END_CLIENT_TICK）两档同名。
 */
public final class PlaytestMod implements ClientModInitializer {
    public static final String MOD_ID = "bandd_playtest";

    private static PlaytestCore core;
    private static HttpApi http;
    private static boolean initFailed;

    @Override
    public void onInitializeClient() {
        ClientTickEvents.END_CLIENT_TICK.register(client -> {
            ensureInit(client);
            if (core != null) core.onTick();
        });
    }

    private static synchronized void ensureInit(Minecraft client) {
        if (core != null || initFailed) return;
        try {
            // 真机教训：loom 的 runClient 可能把 gameDirectory 设成**相对**路径 ⇒ 证据目录会跟着 CWD 散落
            Path runDir = client.gameDirectory.toPath().toAbsolutePath().normalize();
            Path cfgPath = runDir.resolve("config").resolve(MOD_ID + ".json");
            Map<String, Object> cfg = loadOrCreateConfig(cfgPath);

            String token = Json.str(cfg, "token", "");
            int port = (int) Double.parseDouble(Json.str(cfg, "port", "38081"));
            String modeName = Json.str(cfg, "arbitration", "AUTO");
            // 真机教训：旧配置里可能存着**相对** evidenceDir ⇒ 读出来也要按 runDir 解析
            String evidenceDir = Json.str(cfg, "evidenceDir", "");
            if (evidenceDir.isEmpty()) {
                evidenceDir = runDir.resolve("bandd-playtest-evidence").toString();
            } else {
                Path ed = Paths.get(evidenceDir);
                if (!ed.isAbsolute()) evidenceDir = runDir.resolve(ed).normalize().toString();
            }

            FabricAdapter bridge = new FabricAdapter();
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
