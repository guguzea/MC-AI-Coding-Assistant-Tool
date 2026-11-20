package com.bandd.playtest.core;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** 能力自报：/status 里如实报「本档这一份 JAR 到底能做什么」，缺的面明确报 unavailable，不静默。 */
public final class Capabilities {
    /** 桥面 = 命令级。 */
    public static final List<String> BRIDGE = Arrays.asList(
            "ping", "query_player_state", "query_screen", "screenshot", "chat_command",
            "set_arbitration", "status",
            "query_chat", "chat_say",   // 聊天桥：读玩家打的字 / 以 [AI] 身份回话
            "query_log",                // 日志游标增量读 + 有界等待（sinceOffset/waitForPattern/waitMs）
            "query_state", "query_map",   // 状态器：**（半）实时**游戏状态快照 + 文本地图（读缓存，不现场全扫）
            "query_column", "query_blocks", // [T13] 单列纵剖面 / 按条件搜方块（只回命中坐标；分帧扫）
            "query_inventory", "query_inventory_slot", // 背包面：读背包内容 / 读某一格（形状与桥路线对齐）
            "settings_set", "settings_save"); // 设置面：改内存中的旋钮（白名单）/ 落盘那一个文件（读-改-写）
    /**
     * 「状态器」两条（BRIDGE 的子集，**不是**第 3 张表 —— all() 仍是 BRIDGE ∪ DRIVER）。
     * 它们额外要求适配层实现 {@link GameBridge#blockAt}/{@link GameBridge#topSolidY}
     * 并自报 {@link GameBridge#stateMapCapable()}；没实现的档 /status 如实报不可用。
     */
    public static final List<String> STATE_MAP = Arrays.asList("query_state", "query_map");
    /**
     * 「纵剖面 + 按条件搜方块」两条（[T13]；**BRIDGE 的子集**，同 STATE_MAP 先例 ——
     * all() 仍是 BRIDGE ∪ DRIVER，**不是第 3 张表**）。
     *
     * <p>为什么进 BRIDGE 而不是 DRIVER：这两条**不依赖屏幕、也不依赖按键** —— 它们只是**读数**，
     * 走适配层**已有**的 {@link GameBridge#blockAt} 取值面（一列里就能取到任意 Y，用户原话
     * 「正好区块就是有整个 Z 轴的」），与 {@code query_state} / {@code query_map} **同一面**。
     * 与 DRIVER 的「玩家级真按键（press / look / mine / open_settings）」不是一回事。
     *
     * <p>能力缺口由适配层自报 {@link GameBridge#stateMapCapable()}（**同一个**取值面）——
     * 没实现的档 {@code /status} 里**如实**把它俩列进 {@code actionsUnavailable}，
     * {@code /execute} 回 {@code STATE_MAP_UNSUPPORTED}，绝不假装会读方块。
     */
    public static final List<String> STATE_QUERY = Arrays.asList("query_column", "query_blocks");
    /**
     * 设置面两条（**BRIDGE 的子集**，同 STATE_MAP 先例 —— all() 仍是 BRIDGE ∪ DRIVER）。
     *
     * <p>为什么进 BRIDGE 而不是 DRIVER：这两条**不依赖屏幕**。settings_set 只改内存里的
     * {@link StateConfig}（白名单，见 {@link SettingsEdit}），settings_save 只做「读-改-写那一个文件」。
     * 它们在任何「接管了配置文件」的档上都能用，哪怕这一档压根没有图形设置页 ——
     * 与 DRIVER「玩家级（真按键）」的定义（按 O 开屏那种）不是一回事。
     *
     * <p>反过来 open_settings 进 DRIVER：它是**客户端界面动作**（要 Cloth 屏 + 本档接线），
     * 与 close_screen / query_widgets 同一面。
     */
    public static final List<String> SETTINGS = Arrays.asList("settings_set", "settings_save");
    /**
     * 「背包面」两条（**BRIDGE 的子集**，同 STATE_MAP / SETTINGS 先例 —— all() 仍是 BRIDGE ∪ DRIVER）。
     *
     * <p>为什么进 BRIDGE 而不是 DRIVER：这两条**不依赖屏幕、也不依赖按键** —— 它们是**读数**，
     * 走适配层的 {@link GameBridge#inventoryJson()}（本机玩家物品栏的内存快照），
     * 与 DRIVER 的「玩家级真按键」定义（press / look / mine / open_settings）不是一回事。
     * 与 query_player_state / query_state 同一面：任何「接管了玩家读数」的档都该给。
     *
     * <p>能力缺口由适配层自报 {@link GameBridge#inventoryCapable()} —— 没实现的档
     * {@code /status} 里**如实**把它俩列进 {@code actionsUnavailable}，且 {@code /execute} 回
     * {@code INVENTORY_UNSUPPORTED}，不假装能读。
     */
    public static final List<String> INVENTORY = Arrays.asList("query_inventory", "query_inventory_slot");
    /** driver 面 = 玩家级（真按键）。 */
    public static final List<String> DRIVER = Arrays.asList(
            "press", "release_all", "take_over", "open_world", "look", "close_screen", "mine",
            "spawn_bot", "bot_move", "bot_follow", "bot_despawn", "open_bot_inventory",
            "bot_give", "bot_look", "bot_break", "bot_place", "join_server", "set_auth",
            "query_widgets",            // 当前 Screen 的控件清单（类名/坐标/文本/可用/可见）
            "open_settings",            // 打开游戏内设置屏（客户端动作；与 close_screen/query_widgets 同一面）
            // [T19] 玩家级「点屏幕 / 操作容器」一族（全部是**客户端界面动作**，与 query_widgets /
            // close_screen / open_settings 同一面 ⇒ 进 DRIVER 而不是 BRIDGE）：
            "query_slots",              // 读当前打开界面的**槽位**（合成格/熔炉料**不是控件**，query_widgets 读不到）
            "click_slot",               // 走客户端交互管理器点槽位（原版点击语义：左/右/shift）
            "click_widget",             // 敲控件中心（界面的鼠标点击入口，**不是** OS 级注入）
            "use_on",                   // 玩家朝某方块右键（开工作台/熔炉/箱子、按按钮）
            "place_block",              // 玩家在目标位置**放置手持方块**（玩家级；与 bot_place 分开，两档都真实现）
            // [T22] 快捷栏 / 丢物品两条（同属**玩家级**：select_slot 改本档的选中槽字段，
            //   drop_item 走与 click_slot **同一条**客户端交互管理器通路（原版 SlotActionType.THROW））：
            "select_slot",              // 切选中快捷栏槽位（0..8）+ **发原版包同步给服务端**
            "drop_item",                // 丢弃物品栏某一格（THROW）
            // [T39] 安全移动一条（**玩家级**：走游戏自己的输入结构，绝不宿主级注入）：
            //   语义 = 把玩家**走到**目标点附近（不是瞬移）；A* 真寻路 + 危险表 + 血量保险。
            "walk_to");

    /**
     * 「点屏幕 / 操作容器」一族五条（**DRIVER 的子集**，同 STATE_MAP / SETTINGS 的先例 ——
     * all() 仍是 BRIDGE ∪ DRIVER，**不是第 3 张表**）。
     *
     * <p>为什么进 DRIVER 而不是 BRIDGE：这五条**都是客户端界面动作** ——
     * {@code query_slots} 读的是「当前打开界面的槽位」（合成格 / 熔炉料 / 玩家背包），
     * 只有真开着容器的客户端才有这个面，与 {@code query_widgets} / {@code close_screen} /
     * {@code open_settings} 完全同一面；{@code click_slot} / {@code click_widget} 更是**真点**，
     * 走客户端的交互管理器与界面鼠标入口（玩家级），不是「读数」。
     *
     * <p>能力缺口由适配层自报 {@link GameBridge#guiActionCapable()}（默认 {@code false}）——
     * 没实现的档在 {@code /status} 的 {@code actionsUnavailable} 里**如实**列着这五条，
     * {@code /execute} 回 {@code GUI_ACTIONS_UNSUPPORTED}，**绝不假装会点屏幕**。
     */
    public static final List<String> GUI_ACTIONS = Arrays.asList(
            "query_slots", "click_slot", "click_widget", "use_on", "place_block");

    /**
     * [T22] 「快捷栏 / 丢物品」两条（**DRIVER 的子集**，同 STATE_MAP / GUI_ACTIONS 的先例 ——
     * all() 仍是 BRIDGE ∪ DRIVER，**不是第 3 张表**）。
     *
     * <p>为什么进 DRIVER 而不是 BRIDGE：{@code select_slot} 改的是**玩家自己的选中槽**（玩家级），
     * {@code drop_item} 走的是与 {@code click_slot} **同一条**客户端交互管理器通路
     * （原版 {@code SlotActionType.THROW}）—— 都不是「读数」，与 GUI_ACTIONS 完全同一面。
     *
     * <p>能力缺口**复用同一个自报位** {@link GameBridge#guiActionCapable()}（默认 false）——
     * 理由：新增位会改到既有档的 {@code driverAvailable} 语义（GuiActionsTest F8 逐字钉着
     * 「有界面能力的档 driverAvailable=true / 没有的=false」），而这两条与那五条同面 ——
     * 没实现的档在 {@code /status} 的 {@code actionsUnavailable} 里**如实**列着这两条，
     * {@code /execute} 回 {@code GUI_ACTIONS_UNSUPPORTED}，**绝不假装会切槽 / 会丢东西**。
     */
    public static final List<String> HOTBAR = Arrays.asList("select_slot", "drop_item");

    /**
     * [T39] 「安全移动」一条（**DRIVER 的子集**，同 STATE_MAP / GUI_ACTIONS / HOTBAR 的先例 ——
     * all() 仍是 BRIDGE ∪ DRIVER，**不是**第 3 张表）。
     *
     * <p>为什么进 DRIVER 而不是 BRIDGE：{@code walk_to} 改的是**玩家自己的身体**
     * （往游戏自己的输入结构里写前进量 / 跳跃），是真的"玩家级真动作"，不是读数。
     *
     * <p>能力缺口由适配层自报 {@link GameBridge#walkCapable()}（默认 false）——
     * 没实现的档在 {@code /status} 的 {@code actionsUnavailable} 里**如实**列着这一条，
     * {@code /execute} 回 {@code WALK_UNSUPPORTED}，**绝不假装会走**。
     */
    public static final List<String> WALK = Arrays.asList("walk_to");

    /**
     * {@code driverAvailable} 的**判据集**：{@link #DRIVER} 里除 {@link #WALK} 之外的全部动作。
     *
     * <p><b>为什么要把它单列出来</b>（而不是直接扫 DRIVER）：
     * {@code driverAvailable} 的既有语义是「这一档能不能**完全**驱动」——
     * 按「缺一个就报 false」的保守口径算。{@code walk_to} 是一条**新的能力轴**
     * （要适配层自报 {@code walkCapable()}，两档已接、其余 54 档没有）；
     * 若把它直接并进这条判据，那 54 个**本来能按能挖能看**的档会**当场**被降级成
     * {@code driverAvailable=false} —— 那是**假否定**（它们确实能驱动，只是不会走路）。
     *
     * <p>所以：{@code walk_to} 照样进 {@link #DRIVER}（⇒ 出现在 {@code /status} 的
     * {@code actions} 里、能派发），但**不进**这条完整性判据。它自己的可用性由
     * {@code /status} 的 {@code capabilities.walkAvailable} 单独如实报。
     *
     * <p>既有断言（GuiActionsTest F8 / T22ActionsTest E6：有界面能力的档
     * {@code driverAvailable=true}、没有的=false）因此**逐字不变**。
     */
    public static final List<String> DRIVER_BASELINE = baseline();

    private static List<String> baseline() {
        List<String> l = new ArrayList<String>();
        for (String a : DRIVER) {
            if (!WALK.contains(a)) l.add(a);
        }
        return java.util.Collections.unmodifiableList(l);
    }

    private Capabilities() {}

    public static List<String> all() {
        List<String> l = new ArrayList<>(BRIDGE);
        l.addAll(DRIVER);
        return l;
    }
}
