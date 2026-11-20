package com.bandd.playtest;

import com.bandd.playtest.core.Arbitration;
import com.bandd.playtest.core.HttpApi;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.core.Settings;
import com.bandd.playtest.fabric1211.ClothSettingsScreen;
import com.bandd.playtest.fabric1211.FabricAdapter;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.fabricmc.fabric.api.client.keybinding.v1.KeyBindingHelper;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.gui.screen.Screen;
import net.minecraft.client.option.KeyBinding;
import net.minecraft.client.util.InputUtil;

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
 * 初始化**延迟到第一次客户端 tick**（避免在 MinecraftClient 构造期拿 runDirectory 的时序问题）。
 * 配置：<gameDir>/config/bandd_playtest.json（首次自动生成，含 token）。
 *
 * <h3>设置页面的两种打开方式（README 注释）</h3>
 * <ol>
 *   <li>**ModMenu**（社区惯例）：Mods 列表 → bandd_playtest → Config。
 *       注册点 = {@code com.bandd.playtest.fabric1211.ClothModMenu}（fabric.mod.json 的
 *       {@code entrypoints.modmenu}）。**ModMenu 不是本模组的必需前置** ——
 *       build.gradle 只用 {@code modCompileOnly}，没装它时这条 entrypoint 不会被调用。</li>
 *   <li>**全局按键 O**（不依赖任何第三方）：本类注册的
 *       {@code key.bandd_playtest.settings}，默认 {@code key.keyboard.o}，
 *       可在「选项 → 按键设置 → 杂项」里改绑。这条**永远可用**（只要本档有 Cloth 件）。</li>
 * </ol>
 *
 * <h3>必需前置</h3>
 * Cloth Config 是**必需前置**（fabric.mod.json 的 {@code depends."cloth-config"}）。
 * 缺件时由 Fabric Loader 自己报「缺失前置模组」，本模组**不做**没装也能跑的兜底。
 */
public final class PlaytestMod implements ClientModInitializer {
    public static final String MOD_ID = "bandd_playtest";

    private static PlaytestCore core;
    private static HttpApi http;
    private static Settings settings;
    private static KeyBinding settingsKey;
    private static boolean initFailed;

    @Override
    public void onInitializeClient() {
        // 全局按键 = **不依赖第三方**的打开方式（ModMenu 不是本模组的必需前置）。
        // 默认 O；键码走 InputUtil.fromTranslationKey("key.keyboard.o")（javap 实测存在），
        // 不硬编 79、也不 import LWJGL。
        settingsKey = KeyBindingHelper.registerKeyBinding(new KeyBinding(
                "key.bandd_playtest.settings",
                InputUtil.Type.KEYSYM,
                InputUtil.fromTranslationKey("key.keyboard.o").getCode(),
                KeyBinding.Category.MISC));
        ClientTickEvents.END_CLIENT_TICK.register(client -> {
            ensureInit(client);
            if (core != null) core.onTick();
            // wasPressed() 会消费按下计数 ⇒ while 把同一 tick 内的多次按下都处理掉
            while (settingsKey != null && settingsKey.wasPressed()) {
                client.setScreen(openSettingsScreen(client.currentScreen));
            }
        });
    }

    /**
     * 造一个设置页面（**不打开**：ModMenu 的工厂要的是「返回一个 Screen」）。
     * 未初始化或本档拿不到 Cloth 件时**原样返回 parent**（不崩、不假装有界面）。
     */
    public static Screen openSettingsScreen(Screen parent) {
        Settings s = settings;
        PlaytestCore c = core;
        if (s == null || c == null) return parent;
        try {
            return ClothSettingsScreen.create(parent, s, () -> c.state().requestRefresh());
        } catch (Throwable t) {
            System.err.println("[bandd-playtest] 设置页面构建失败: " + t);
            return parent;
        }
    }

    private static synchronized void ensureInit(MinecraftClient client) {
        if (core != null || initFailed) return;
        try {
            // 真机教训：loom 的 runClient 可能把 runDirectory 设成**相对**路径 ⇒ 证据目录会跟着 CWD 散落
            Path runDir = client.runDirectory.toPath().toAbsolutePath().normalize();
            Path cfgPath = runDir.resolve("config").resolve(MOD_ID + ".json");
            Map<String, Object> cfg = loadOrCreateConfig(cfgPath);
            // 接管那一个可手改文件：状态器的旋钮从它的 state 段读、设置页面写回它。
            // **读-改-写**：port / token / arbitration / evidenceDir / _comment 与一切未知键原样保留。
            settings = Settings.of(cfgPath, cfg);

            String token = Json.str(cfg, "token", "");
            int port = (int) Double.parseDouble(Json.str(cfg, "port", "38081"));
            String modeName = Json.str(cfg, "arbitration", "AUTO");
            // 真机教训：旧配置里可能存着**相对** evidenceDir ⇒ 读出来也要按 runDir 解析，
            // 否则证据会跟着 JVM 的 CWD 散落。
            String evidenceDir = Json.str(cfg, "evidenceDir", "");
            if (evidenceDir.isEmpty()) {
                evidenceDir = runDir.resolve("bandd-playtest-evidence").toString();
            } else {
                Path ed = Paths.get(evidenceDir);
                if (!ed.isAbsolute()) evidenceDir = runDir.resolve(ed).normalize().toString();
            }

            FabricAdapter bridge = new FabricAdapter();
            core = new PlaytestCore(bridge, Paths.get(evidenceDir), token, settings);
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
