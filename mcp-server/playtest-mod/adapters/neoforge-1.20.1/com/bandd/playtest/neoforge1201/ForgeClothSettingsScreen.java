package com.bandd.playtest.neoforge1201;

import com.bandd.playtest.PlaytestMod;
import com.bandd.playtest.core.Settings;
import com.bandd.playtest.core.StateConfig;
import me.shedaniel.clothconfig2.api.ConfigBuilder;
import me.shedaniel.clothconfig2.api.ConfigCategory;
import me.shedaniel.clothconfig2.api.ConfigEntryBuilder;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import net.minecraftforge.client.ConfigScreenHandler;
import net.minecraftforge.fml.ModLoadingContext;

/**
 * **游戏内设置页面 + 注册点**（Cloth Config，neoforge-1.20.1 档 = Forge 47 兼容层）。
 *
 * <h3>注册点（Forge 自带，不需要任何第三方模组）</h3>
 * {@code ModLoadingContext.get().registerExtensionPoint(ConfigScreenHandler.ConfigScreenFactory.class,
 * () -> new ConfigScreenHandler.ConfigScreenFactory((mc, parent) -> screen))}
 * —— 本机 {@code javap -p} 原文：{@code ModLoadingContext#registerExtensionPoint(Class<? extends
 * IExtensionPoint<T>>, Supplier<T>)} 与
 * {@code ConfigScreenHandler$ConfigScreenFactory(BiFunction<Minecraft, Screen, Screen>)}（后者是 Record）。
 *
 * <p>与 fabric 档的差别：fabric 走 ModMenu 的 {@code ModMenuApi}；本档走 Forge 自己的扩展点，
 * 所以**没有**「缺第三方就没有入口」的问题。另一个不依赖第三方的入口是聊天栏 {@code !settings}。
 *
 * <h3>控件清单</h3>
 * 与 {@code fabric-1.21.11} 的同名类**逐个键一一对应**（17 个 {@link StateConfig} 键各一个控件；
 * 派生键 {@code mapSideBlocks} 故意没有控件）。方法名出处：本机 {@code javap -p} 打在
 * {@code D:\mc-skill-temp\cloth\cloth-config-12.0.109-forge.jar}。
 *
 * <p>{@code port} / {@code token} 不在页面上；{@link Settings#save()} 只覆盖 {@code state} 段，
 * 顶层键与未知键原样保留。
 */
public final class ForgeClothSettingsScreen {

    private ForgeClothSettingsScreen() {
    }

    /**
     * 注册「Mods 列表 → bandd_playtest → Config」按钮。
     * **必须在 mod 构造期调用**（Forge 的扩展点只在那时收）。
     */
    public static void register() {
        ModLoadingContext.get().registerExtensionPoint(
                ConfigScreenHandler.ConfigScreenFactory.class,
                () -> new ConfigScreenHandler.ConfigScreenFactory(
                        (mc, parent) -> PlaytestMod.openSettingsScreen(parent)));
    }

    /** 恰一个字符（空串 ⇒ 回默认）。 */
    private static char firstChar(String v, char dflt) {
        return v == null || v.isEmpty() ? dflt : v.charAt(0);
    }

    /**
     * 造一个设置 Screen。
     *
     * @param parent    父屏幕（Forge / !settings 都能给；可为 null）
     * @param settings  那一个可手改文件（必需）
     * @param afterSave 保存后的回调（本档传「让状态器立刻重采一张图」）
     */
    public static Screen create(Screen parent, Settings settings, Runnable afterSave) {
        final StateConfig cfg = settings.config();
        final StateConfig def = new StateConfig();
        final String file = settings.file() == null ? "(未知路径)" : settings.file().toString();

        ConfigBuilder b = ConfigBuilder.create()
                .setParentScreen(parent)
                .setTitle(Component.literal("BandD Playtest 设置"));
        ConfigEntryBuilder e = b.entryBuilder();

        // ---- 说明（只读）----
        ConfigCategory about = b.getOrCreateCategory(Component.literal("说明"));
        about.addEntry(e.startTextDescription(Component.literal(
                "本页只改「状态器」的旋钮，保存时写回同一个文件：\n" + file
                        + "\nport 与 token 不在本页（外部驱动要用），要改请手改该文件。\n"
                        + "改完立即生效；越界值会被自动夹回；删掉该文件 = 回默认。"))
                .build());

        // ---- 刷新与范围 ----
        ConfigCategory refresh = b.getOrCreateCategory(Component.literal("刷新与范围"));
        refresh.addEntry(e.startIntSlider(Component.literal("refreshIntervalTicks — 重采间隔（tick）"),
                        cfg.refreshIntervalTicks, 1, 1200)
                .setDefaultValue(def.refreshIntervalTicks)
                .setTooltip(Component.literal("客户端 tick 数；默认 40 = 2 秒。范围 1..1200"))
                .setSaveConsumer(v -> cfg.refreshIntervalTicks = v)
                .build());
        refresh.addEntry(e.startIntSlider(Component.literal("chunkRadius — 地图半径（区块）"),
                        cfg.chunkRadius, 0, 8)
                .setDefaultValue(def.chunkRadius)
                .setTooltip(Component.literal("1 = 3×3 区块 = 48×48 格（默认）。范围 0..8"))
                .setSaveConsumer(v -> cfg.chunkRadius = v)
                .build());

        // ---- 采样与容量 ----
        ConfigCategory sampling = b.getOrCreateCategory(Component.literal("采样与容量"));
        sampling.addEntry(e.startIntSlider(Component.literal("step — 采样步长（格）"), cfg.step, 1, 16)
                .setDefaultValue(def.step)
                .setTooltip(Component.literal("1 = 逐格；2 = 隔一格采一格。范围 1..16"))
                .setSaveConsumer(v -> cfg.step = v)
                .build());
        sampling.addEntry(e.startIntSlider(Component.literal("columnsPerTick — 每 tick 最多扫多少格"),
                        cfg.columnsPerTick, 1, 4096)
                .setDefaultValue(def.columnsPerTick)
                .setTooltip(Component.literal("分帧预算，绝不一次全扫（防卡 tick 线程）。范围 1..4096"))
                .setSaveConsumer(v -> cfg.columnsPerTick = v)
                .build());
        sampling.addEntry(e.startIntField(Component.literal("maxChars — 地图正文上限（字符）"), cfg.maxChars)
                .setMin(64)
                .setMax(200000)
                .setDefaultValue(def.maxChars)
                .setTooltip(Component.literal("单次回执里地图网格正文的字符上限。范围 64..200000"))
                .setSaveConsumer(v -> cfg.maxChars = v)
                .build());
        sampling.addEntry(e.startIntSlider(Component.literal("maxAutoStep — 自动降采样最大步长"),
                        cfg.maxAutoStep, 1, 64)
                .setDefaultValue(def.maxAutoStep)
                .setTooltip(Component.literal("到这个步长还超 maxChars 就按行截断并写 truncated:true。范围 1..64"))
                .setSaveConsumer(v -> cfg.maxAutoStep = v)
                .build());
        sampling.addEntry(e.startIntSlider(Component.literal("minHeightWidth — 高度字段最小宽度"),
                        cfg.minHeightWidth, 1, 4)
                .setDefaultValue(def.minHeightWidth)
                .setTooltip(Component.literal("实际宽度由本图 yMin/yMax 决定，只增不减。范围 1..4"))
                .setSaveConsumer(v -> cfg.minHeightWidth = v)
                .build());

        // ---- 内容开关 ----
        ConfigCategory toggles = b.getOrCreateCategory(Component.literal("内容开关"));
        toggles.addEntry(e.startBooleanToggle(Component.literal("includeHeight — 每格带高度数字"),
                        cfg.includeHeight)
                .setDefaultValue(def.includeHeight)
                .setTooltip(Component.literal("关掉 ⇒ 每格只有 1 个方块码字符"))
                .setSaveConsumer(v -> cfg.includeHeight = v.booleanValue())
                .build());
        toggles.addEntry(e.startBooleanToggle(Component.literal("includeEntities — 含实体段"),
                        cfg.includeEntities)
                .setDefaultValue(def.includeEntities)
                .setTooltip(Component.literal("本档尚未实现，打开时地图头如实写 entitiesIncluded:false"))
                .setSaveConsumer(v -> cfg.includeEntities = v.booleanValue())
                .build());

        // ---- [T16] 纵层（yMode）：四个旋钮（此前是 core 里的常量，现在可配置）----
        ConfigCategory ylayer = b.getOrCreateCategory(Component.literal("纵层（yMode）"));
        ylayer.addEntry(e.startBooleanToggle(Component.literal("yModeAuto — 地下自动切层"),
                        cfg.yModeAuto)
                .setDefaultValue(def.yModeAuto)
                .setTooltip(Component.literal("默认 true：玩家明显在地下时自动改用 player 纵层。关掉 ⇒ 不给 yMode 时一律 surface"))
                .setSaveConsumer(v -> cfg.yModeAuto = v.booleanValue())
                .build());
        ylayer.addEntry(e.startIntSlider(Component.literal("yModeAutoDepth — 自动切层的深度阈值"),
                        cfg.yModeAutoDepth, 1, 256)
                .setDefaultValue(def.yModeAutoDepth)
                .setTooltip(Component.literal("playerDepthBelowSurface ≥ 此值 ⇒ 自动切层。范围 1..256，默认 3"))
                .setSaveConsumer(v -> cfg.yModeAutoDepth = v)
                .build());
        ylayer.addEntry(e.startIntSlider(Component.literal("yLayerMax — 一次采样的层数上限"),
                        cfg.yLayerMax, 1, 16)
                .setDefaultValue(def.yLayerMax)
                .setTooltip(Component.literal("超过硬上限 16 一律拒。范围 1..16，默认 8"))
                .setSaveConsumer(v -> cfg.yLayerMax = v)
                .build());
        ylayer.addEntry(e.startIntSlider(Component.literal("yAutoRange — 自动纵层的 dy 半径"),
                        cfg.yAutoRange, 0, 64)
                .setDefaultValue(def.yAutoRange)
                .setTooltip(Component.literal("±N ⇒ 2N+1 层。范围 0..64，默认 2"))
                .setSaveConsumer(v -> cfg.yAutoRange = v)
                .build());

        // ---- 渲染字符 ----
        ConfigCategory chars = b.getOrCreateCategory(Component.literal("渲染字符"));
        chars.addEntry(e.startStrField(Component.literal("playerMark — 玩家格标记"),
                        String.valueOf(cfg.playerMark))
                .setDefaultValue(String.valueOf(def.playerMark))
                .setTooltip(Component.literal("画在玩家那格，代替方块码。取第一个字符"))
                .setSaveConsumer(v -> cfg.playerMark = firstChar(v, def.playerMark))
                .build());
        chars.addEntry(e.startStrField(Component.literal("unknownCode — 未知格码"),
                        String.valueOf(cfg.unknownCode))
                .setDefaultValue(String.valueOf(def.unknownCode))
                .setTooltip(Component.literal("越界 / 未加载 / 本档不支持时用的方块码。取第一个字符"))
                .setSaveConsumer(v -> cfg.unknownCode = firstChar(v, def.unknownCode))
                .build());
        chars.addEntry(e.startStrField(Component.literal("overflowCode — 码位用尽后的码"),
                        String.valueOf(cfg.overflowCode))
                .setDefaultValue(String.valueOf(def.overflowCode))
                .setTooltip(Component.literal("码位 ≥ palette 长度后用这个码，真实 id 进 legendOverflow。取第一个字符"))
                .setSaveConsumer(v -> cfg.overflowCode = firstChar(v, def.overflowCode))
                .build());
        chars.addEntry(e.startStrField(Component.literal("palette — 方块码候选字符表"), cfg.palette)
                .setDefaultValue(def.palette)
                .setTooltip(Component.literal("每个码恰好 1 字符（网格固定宽度不靠空格对齐）；"
                        + "与三个标记码重复的字符会被 sanitize 剔掉"))
                .setSaveConsumer(v -> cfg.palette = v)
                .build());

        // ---- 保存：写回同一个文件（读-改-写；port/token 不动）----
        b.setSavingRunnable(() -> {
            settings.save();
            if (afterSave != null) afterSave.run();
        });
        return b.build();
    }
}
