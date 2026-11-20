package com.bandd.playtest;

import com.bandd.playtest.core.Arbitration;
import com.bandd.playtest.core.HttpApi;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.forge_1_15_2.ForgeAdapter;
import net.minecraft.client.Minecraft;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.event.TickEvent;
import net.minecraftforge.client.event.ClientChatReceivedEvent;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.fml.common.Mod;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * forge 1.15.2 入口 —— 由 temp/port/tools/gen-adapter.mjs 从该档驱动产物派生。
 * 名字出处：C:\Users\zzrCN\OneDrive\桌面\MC_skill\temp\port\gen-forge\_raw\forge-1.15.2.java（2243 行）。
 */
@Mod(PlaytestMod.MOD_ID)
public final class PlaytestMod {
    public static final String MOD_ID = "bandd_playtest";
    public static final String NAME = "BandD Playtest";
    public static final String VERSION = "0.1.0";

    private static ForgeAdapter adapter;
    private static PlaytestCore core;
    private static HttpApi http;
    private static boolean initFailed;

    public PlaytestMod() {
        // 生成物挂接：MinecraftForge.EVENT_BUS.register(...)
        MinecraftForge.EVENT_BUS.register(this);
    }

    @SubscribeEvent
    public void onClientTick(TickEvent.ClientTickEvent event) {
        if (event.phase != TickEvent.Phase.END) return;
        ensureInit();
        if (core != null) core.onTick();
    }

    @SubscribeEvent
    public void onChat(ClientChatReceivedEvent event) {
        ForgeAdapter a = adapter;
        if (a != null) a.pushChat("in: " + event.getMessage().getString());
    }

    private static synchronized void ensureInit() {
        if (core != null || initFailed) return;
        try {
            Minecraft mc = Minecraft.getInstance();
            if (mc == null) return;
            Path runDir = mc.gameDirectory.toPath().toAbsolutePath().normalize();
            Path cfgPath = runDir.resolve("config").resolve(MOD_ID + ".json");
            Map<String, Object> cfg = loadOrCreateConfig(cfgPath);
            String token = Json.str(cfg, "token", "");
            int port = (int) Double.parseDouble(Json.str(cfg, "port", "38081"));
            String modeName = Json.str(cfg, "arbitration", "AUTO");
            String evidenceDir = Json.str(cfg, "evidenceDir", "");
            if (evidenceDir.isEmpty()) evidenceDir = runDir.resolve("bandd-playtest-evidence").toString();
            else { Path ed = Paths.get(evidenceDir); if (!ed.isAbsolute()) evidenceDir = runDir.resolve(ed).normalize().toString(); }
            ForgeAdapter bridge = new ForgeAdapter();
            adapter = bridge;
            core = new PlaytestCore(bridge, Paths.get(evidenceDir), token);
            try { core.arbitration().setMode(Arbitration.Mode.valueOf(modeName.toUpperCase())); }
            catch (IllegalArgumentException e) { core.evidence().log("[QA] arbitration=" + modeName + " 不合法，回退 AUTO"); }
            http = new HttpApi(core);
            int actual = http.start(port);
            core.evidence().log("[QA] init: mod=" + MOD_ID + " platform=" + bridge.platform() + " mc=" + bridge.mcVersion() + " port=" + actual);
            core.evidence().state(Json.of(core.status()));
            Runtime.getRuntime().addShutdownHook(new Thread(() -> { if (core != null) core.onShutdown(); if (http != null) http.stop(); }, "bandd-playtest-shutdown"));
        } catch (Throwable t) {
            initFailed = true;
            System.err.println("[bandd-playtest] init failed: " + t);
        }
    }

    private static Map<String, Object> loadOrCreateConfig(Path cfgPath) {
        try {
            if (Files.exists(cfgPath)) return Json.parseObject(new String(Files.readAllBytes(cfgPath), StandardCharsets.UTF_8));
            Map<String, Object> cfg = new LinkedHashMap<>();
            byte[] b = new byte[16];
            new SecureRandom().nextBytes(b);
            StringBuilder sb = new StringBuilder();
            for (byte x : b) sb.append(String.format("%02x", x));
            cfg.put("token", sb.toString());
            cfg.put("port", 38081);
            cfg.put("arbitration", "AUTO");
            cfg.put("evidenceDir", cfgPath.getParent().getParent().resolve("bandd-playtest-evidence").toString());
            Files.createDirectories(cfgPath.getParent());
            Files.write(cfgPath, Json.of(cfg).getBytes(StandardCharsets.UTF_8));
            return cfg;
        } catch (Exception e) {
            System.err.println("[bandd-playtest] config 读写失败: " + e);
            Map<String, Object> cfg = new LinkedHashMap<>();
            cfg.put("token", ""); cfg.put("port", 38081); cfg.put("arbitration", "AUTO");
            return cfg;
        }
    }
}
