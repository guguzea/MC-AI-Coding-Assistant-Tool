package com.bandd.playtest.fabric1211;

import com.bandd.playtest.core.Settings;
import com.bandd.playtest.core.StateConfig;
import me.shedaniel.clothconfig2.api.ConfigBuilder;
import me.shedaniel.clothconfig2.api.ConfigCategory;
import me.shedaniel.clothconfig2.api.ConfigEntryBuilder;
import net.minecraft.client.gui.screen.Screen;
import net.minecraft.text.Text;

/**
 * **游戏内设置页面**（Cloth Config，fabric 1.21.11 档）。
 *
 * <h3>控件清单（一个 {@link StateConfig} 键 = 一个控件，逐个 javap 取证）</h3>
 * <pre>
 *   刷新与范围
 *     refreshIntervalTicks  int 滑条   1..1200    默认 40     ConfigEntryBuilder#startIntSlider(Text,int,int,int)
 *     chunkRadius           int 滑条   0..8       默认 1
 *   采样与容量
 *     step                  int 滑条   1..16      默认 1
 *     columnsPerTick        int 滑条   1..4096    默认 128
 *     maxChars              int 数字框 64..200000 默认 12000  ConfigEntryBuilder#startIntField(Text,int) + setMin/setMax(int)
 *     maxAutoStep           int 滑条   1..64      默认 4
 *     minHeightWidth        int 滑条   1..4       默认 1
 *   内容开关
 *     includeHeight         bool 开关             默认 true   ConfigEntryBuilder#startBooleanToggle(Text,boolean)
 *     includeEntities       bool 开关             默认 false
 *   渲染字符
 *     playerMark            str 文本框            默认 '+'
 *     unknownCode           str 文本框            默认 '?'
 *     overflowCode          str 文本框            默认 '#'
 *     palette               str 文本框            默认 A-Za-z  ConfigEntryBuilder#startStrField(Text,String)
 *   说明（只读）
 *     startTextDescription(Text) 一段文字
 * </pre>
 *
 * <p>{@code mapSideBlocks} **故意没有控件**：它是派生值（(2×chunkRadius+1)×16），
 * {@code StateConfig#applyJson} 不认它，给它控件只会让人以为可改。
 *
 * <h3>port / token 为什么不在这页</h3>
 * 它们是本模组与外部驱动的握手凭据（{@code /status} 的 tokenRequired、HTTP 端口），
 * 设置页面**没有**、也不该有它们的控件 —— {@link Settings#save()} 只覆盖 {@code state} 段，
 * 顶层 {@code token} / {@code port} / {@code arbitration} / {@code evidenceDir} 与一切未知键原样保留。
 *
 * <h3>保存与「立刻生效」</h3>
 * {@code setSavingRunnable} 里 {@link Settings#save()} 写回**同一个文件**；
 * 因为状态器（{@code GameStateService}）与本页面**共用同一个 StateConfig 实例**，
 * 值改完下一轮 startScan 就用新的（{@code afterSave} 再叫一次立刻重采，界面上马上能看到）。
 *
 * <p>方法名出处：本机 {@code javap -p} 打在
 * {@code D:\mc-skill-temp\cloth\cloth-config-21.11.153-fabric.jar}（ConfigBuilder /
 * ConfigCategory / ConfigEntryBuilder / IntSliderBuilder / IntFieldBuilder / BooleanToggleBuilder /
 * StringFieldBuilder / TextDescriptionBuilder 全部逐个读过；见交付报告）。
 */
public final class ClothSettingsScreen {

    private ClothSettingsScreen() {
    }

    /** 恰一个字符（空串 ⇒ 回默认）。 */
    private static char firstChar(String v, char dflt) {
        return v == null || v.isEmpty() ? dflt : v.charAt(0);
    }

    /**
     * 造一个设置 Screen。
     *
     * @param parent    父屏幕（ModMenu / 按键都能给；可为 null）
     * @param settings  那一个可手改文件（必需）
     * @param afterSave 保存后的回调（本档传「让状态器立刻重采一张图」）
     */
    public static Screen create(Screen parent, Settings settings, Runnable afterSave) {
        final StateConfig cfg = settings.config();
        final StateConfig def = new StateConfig();
        final String file = settings.file() == null ? "(未知路径)" : settings.file().toString();

        ConfigBuilder b = ConfigBuilder.create()
                .setParentScreen(parent)
                .setTitle(Text.literal("BandD Playtest 设置"));
        ConfigEntryBuilder e = b.entryBuilder();

        // ---- 说明（只读）----
        ConfigCategory about = b.getOrCreateCategory(Text.literal("说明"));
        about.addEntry(e.startTextDescription(Text.literal(
                "本页只改「状态器」的旋钮，保存时写回同一个文件：\n" + file
                        + "\nport 与 token 不在本页（外部驱动要用），要改请手改该文件。\n"
                        + "改完立即生效；越界值会被自动夹回；删掉该文件 = 回默认。"))
                .build());

        // ---- 刷新与范围 ----
        ConfigCategory refresh = b.getOrCreateCategory(Text.literal("刷新与范围"));
        refresh.addEntry(e.startIntSlider(Text.literal("refreshIntervalTicks — 重采间隔（tick）"),
                        cfg.refreshIntervalTicks, 1, 1200)
                .setDefaultValue(def.refreshIntervalTicks)
                .setTooltip(Text.literal("客户端 tick 数；默认 40 = 2 秒。范围 1..1200"))
                .setSaveConsumer(v -> cfg.refreshIntervalTicks = v)
                .build());
        refresh.addEntry(e.startIntSlider(Text.literal("chunkRadius — 地图半径（区块）"),
                        cfg.chunkRadius, 0, 8)
                .setDefaultValue(def.chunkRadius)
                .setTooltip(Text.literal("1 = 3×3 区块 = 48×48 格（默认）。范围 0..8"))
                .setSaveConsumer(v -> cfg.chunkRadius = v)
                .build());

        // ---- 采样与容量 ----
        ConfigCategory sampling = b.getOrCreateCategory(Text.literal("采样与容量"));
        sampling.addEntry(e.startIntSlider(Text.literal("step — 采样步长（格）"), cfg.step, 1, 16)
                .setDefaultValue(def.step)
                .setTooltip(Text.literal("1 = 逐格；2 = 隔一格采一格。范围 1..16"))
                .setSaveConsumer(v -> cfg.step = v)
                .build());
        sampling.addEntry(e.startIntSlider(Text.literal("columnsPerTick — 每 tick 最多扫多少格"),
                        cfg.columnsPerTick, 1, 4096)
                .setDefaultValue(def.columnsPerTick)
                .setTooltip(Text.literal("分帧预算，绝不一次全扫（防卡 tick 线程）。范围 1..4096"))
                .setSaveConsumer(v -> cfg.columnsPerTick = v)
                .build());
        sampling.addEntry(e.startIntField(Text.literal("maxChars — 地图正文上限（字符）"), cfg.maxChars)
                .setMin(64)
                .setMax(200000)
                .setDefaultValue(def.maxChars)
                .setTooltip(Text.literal("单次回执里地图网格正文的字符上限。范围 64..200000"))
                .setSaveConsumer(v -> cfg.maxChars = v)
                .build());
        sampling.addEntry(e.startIntSlider(Text.literal("maxAutoStep — 自动降采样最大步长"),
                        cfg.maxAutoStep, 1, 64)
                .setDefaultValue(def.maxAutoStep)
                .setTooltip(Text.literal("到这个步长还超 maxChars 就按行截断并写 truncated:true。范围 1..64"))
                .setSaveConsumer(v -> cfg.maxAutoStep = v)
                .build());
        sampling.addEntry(e.startIntSlider(Text.literal("minHeightWidth — 高度字段最小宽度"),
                        cfg.minHeightWidth, 1, 4)
                .setDefaultValue(def.minHeightWidth)
                .setTooltip(Text.literal("实际宽度由本图 yMin/yMax 决定，只增不减。范围 1..4"))
                .setSaveConsumer(v -> cfg.minHeightWidth = v)
                .build());

        // ---- 内容开关 ----
        ConfigCategory toggles = b.getOrCreateCategory(Text.literal("内容开关"));
        toggles.addEntry(e.startBooleanToggle(Text.literal("includeHeight — 每格带高度数字"),
                        cfg.includeHeight)
                .setDefaultValue(def.includeHeight)
                .setTooltip(Text.literal("关掉 ⇒ 每格只有 1 个方块码字符"))
                .setSaveConsumer(v -> cfg.includeHeight = v.booleanValue())
                .build());
        toggles.addEntry(e.startBooleanToggle(Text.literal("includeEntities — 含实体段"),
                        cfg.includeEntities)
                .setDefaultValue(def.includeEntities)
                .setTooltip(Text.literal("本档尚未实现，打开时地图头如实写 entitiesIncluded:false"))
                .setSaveConsumer(v -> cfg.includeEntities = v.booleanValue())
                .build());

        // ---- [T16] 纵层（yMode）：四个旋钮（此前是 core 里的常量，现在可配置）----
        ConfigCategory ylayer = b.getOrCreateCategory(Text.literal("纵层（yMode）"));
        ylayer.addEntry(e.startBooleanToggle(Text.literal("yModeAuto — 地下自动切层"),
                        cfg.yModeAuto)
                .setDefaultValue(def.yModeAuto)
                .setTooltip(Text.literal("默认 true：玩家明显在地下时自动改用 player 纵层。关掉 ⇒ 不给 yMode 时一律 surface"))
                .setSaveConsumer(v -> cfg.yModeAuto = v.booleanValue())
                .build());
        ylayer.addEntry(e.startIntSlider(Text.literal("yModeAutoDepth — 自动切层的深度阈值"),
                        cfg.yModeAutoDepth, 1, 256)
                .setDefaultValue(def.yModeAutoDepth)
                .setTooltip(Text.literal("playerDepthBelowSurface ≥ 此值 ⇒ 自动切层。范围 1..256，默认 3"))
                .setSaveConsumer(v -> cfg.yModeAutoDepth = v)
                .build());
        ylayer.addEntry(e.startIntSlider(Text.literal("yLayerMax — 一次采样的层数上限"),
                        cfg.yLayerMax, 1, 16)
                .setDefaultValue(def.yLayerMax)
                .setTooltip(Text.literal("超过硬上限 16 一律拒。范围 1..16，默认 8"))
                .setSaveConsumer(v -> cfg.yLayerMax = v)
                .build());
        ylayer.addEntry(e.startIntSlider(Text.literal("yAutoRange — 自动纵层的 dy 半径"),
                        cfg.yAutoRange, 0, 64)
                .setDefaultValue(def.yAutoRange)
                .setTooltip(Text.literal("±N ⇒ 2N+1 层。范围 0..64，默认 2"))
                .setSaveConsumer(v -> cfg.yAutoRange = v)
                .build());

        // ---- 渲染字符 ----
        ConfigCategory chars = b.getOrCreateCategory(Text.literal("渲染字符"));
        chars.addEntry(e.startStrField(Text.literal("playerMark — 玩家格标记"),
                        String.valueOf(cfg.playerMark))
                .setDefaultValue(String.valueOf(def.playerMark))
                .setTooltip(Text.literal("画在玩家那格，代替方块码。取第一个字符"))
                .setSaveConsumer(v -> cfg.playerMark = firstChar(v, def.playerMark))
                .build());
        chars.addEntry(e.startStrField(Text.literal("unknownCode — 未知格码"),
                        String.valueOf(cfg.unknownCode))
                .setDefaultValue(String.valueOf(def.unknownCode))
                .setTooltip(Text.literal("越界 / 未加载 / 本档不支持时用的方块码。取第一个字符"))
                .setSaveConsumer(v -> cfg.unknownCode = firstChar(v, def.unknownCode))
                .build());
        chars.addEntry(e.startStrField(Text.literal("overflowCode — 码位用尽后的码"),
                        String.valueOf(cfg.overflowCode))
                .setDefaultValue(String.valueOf(def.overflowCode))
                .setTooltip(Text.literal("码位 ≥ palette 长度后用这个码，真实 id 进 legendOverflow。取第一个字符"))
                .setSaveConsumer(v -> cfg.overflowCode = firstChar(v, def.overflowCode))
                .build());
        chars.addEntry(e.startStrField(Text.literal("palette — 方块码候选字符表"), cfg.palette)
                .setDefaultValue(def.palette)
                .setTooltip(Text.literal("每个码恰好 1 字符（网格固定宽度不靠空格对齐）；"
                        + "与三个标记码重复的字符会被 sanitize 剔掉"))
                .setSaveConsumer(v -> cfg.palette = v)
                .build());

        // ---- 保存：写回同一个文件（reading-modify-write；port/token 不动）----
        b.setSavingRunnable(() -> {
            settings.save();
            if (afterSave != null) afterSave.run();
        });
        return b.build();
    }
}
