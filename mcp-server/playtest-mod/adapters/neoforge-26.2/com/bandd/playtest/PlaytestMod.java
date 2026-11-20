package com.bandd.playtest;

import com.bandd.playtest.core.Arbitration;
import com.bandd.playtest.core.HttpApi;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.neoforge262.NeoForgeAdapter;
import net.minecraft.client.Minecraft;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.Mod;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.client.event.ClientTickEvent;
import net.neoforged.neoforge.event.tick.ServerTickEvent;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;

/** NeoForge 26.2 入口。与 1.21.11 / fabric 档共用同一份 core（../shared/core）。 */
@Mod(value = PlaytestMod.MOD_ID, dist = Dist.CLIENT)
public final class PlaytestMod {
    public static final String MOD_ID = "bandd_playtest";

    private static NeoForgeAdapter adapter;
    private static PlaytestCore core;
    private static HttpApi http;
    private static boolean initFailed;

    public PlaytestMod() {
        NeoForge.EVENT_BUS.register(this);
    }

    @SubscribeEvent
    public void onChatReceived(net.neoforged.neoforge.client.event.ClientChatReceivedEvent event) {
        NeoForgeAdapter a = adapter;
        if (a != null) a.pushChat("in: " + event.getMessage().getString());
    }

    @SubscribeEvent
    public void onChatSent(net.neoforged.neoforge.client.event.ClientChatEvent event) {
        NeoForgeAdapter a = adapter;
        if (a != null) a.pushChat("out: " + event.getMessage());
        String msg = event.getMessage().trim();
        if (msg.startsWith("!") && core != null) {
            event.setCanceled(true);
            runLocalCommand(msg);
        }
    }

    @SubscribeEvent
    public void onClientTick(ClientTickEvent.Post event) {
        ensureInit();
        if (core != null) core.onTick();
    }

    @SubscribeEvent
    public void onServerTick(ServerTickEvent.Post event) {
        if (core != null) core.onServerTick();
    }

    private static void runLocalCommand(String msg) {
        String cmd = msg.toLowerCase(java.util.Locale.ROOT);
        Map<String, Object> p = new LinkedHashMap<>();
        String action;
        switch (cmd) {
            case "!bot": case "!inv": case "!bot inv": action = "open_bot_inventory"; break;
            case "!come": case "!bot come": action = "bot_move"; p.put("mode", "front"); p.put("distance", "2"); break;
            case "!follow": case "!bot follow": action = "bot_follow"; p.put("on", Boolean.TRUE); break;
            case "!stop": case "!bot stop": action = "bot_follow"; p.put("on", Boolean.FALSE); break;
            case "!spawn": case "!bot spawn": action = "spawn_bot"; p.put("name", "AI"); p.put("distance", "3"); break;
            case "!away": case "!bot away": action = "bot_despawn"; break;
            case "!offline": action = "set_auth"; p.put("online", Boolean.FALSE); break;
            case "!online": action = "set_auth"; p.put("online", Boolean.TRUE); break;
            case "!join": {
                String addr = msg.length() > 6 ? msg.substring(6).trim() : "";
                if (addr.isEmpty()) { say("用法：!join <地址:端口>"); return; }
                action = "join_server"; p.put("address", addr); break;
            }
            case "!break": case "!mine": {
                net.minecraft.world.phys.HitResult hr = Minecraft.getInstance().hitResult;
                if (!(hr instanceof net.minecraft.world.phys.BlockHitResult bhr)) {
                    say("你的准星没对着方块（先看准一个方块再打 !break）");
                    return;
                }
                net.minecraft.core.BlockPos pos = bhr.getBlockPos();
                action = "bot_break";
                p.put("x", String.valueOf(pos.getX()));
                p.put("y", String.valueOf(pos.getY()));
                p.put("z", String.valueOf(pos.getZ()));
                break;
            }
            case "!place": {
                net.minecraft.world.phys.HitResult hr = Minecraft.getInstance().hitResult;
                if (!(hr instanceof net.minecraft.world.phys.BlockHitResult bhr)) {
                    say("你的准星没对着方块（先看准一个方块再打 !place）");
                    return;
                }
                net.minecraft.core.BlockPos pos = bhr.getBlockPos();
                action = "bot_place";
                p.put("x", String.valueOf(pos.getX()));
                p.put("y", String.valueOf(pos.getY()));
                p.put("z", String.valueOf(pos.getZ()));
                break;
            }
            default:
                if (cmd.startsWith("!give ")) {
                    String[] a = msg.substring(6).trim().split("\\s+");
                    action = "bot_give";
                    p.put("item", a[0].contains(":") ? a[0] : "minecraft:" + a[0]);
                    p.put("count", a.length > 1 ? a[1] : "1");
                    break;
                }
                say("命令：!bot 看物品栏 / !come 过来 / !follow 跟随 / !stop 停 / !spawn 召唤 / !away 收回 / "
                        + "!give <物品> [数量] / !break 挖你准星那个方块 / !place 放你准星那个方块");
                return;
        }
        Map<String, Object> r = core.dispatch(action, p);
        Object code = r.get("code");
        say(action + " -> " + r.get("status") + (code == null ? "" : " (" + code + ")"));
    }

    private static void say(String text) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("text", text);
        core.dispatch("chat_say", p);
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
            if (evidenceDir.isEmpty()) {
                evidenceDir = runDir.resolve("bandd-playtest-evidence").toString();
            } else {
                Path ed = Paths.get(evidenceDir);
                if (!ed.isAbsolute()) evidenceDir = runDir.resolve(ed).normalize().toString();
            }

            NeoForgeAdapter bridge = new NeoForgeAdapter();
            adapter = bridge;
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
