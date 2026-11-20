package com.bandd.playtest.core;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * **界面动作的诚实回执**（fail-loud，绝不静默）：成功 = {@code ok:true} + {@code data}；
 * 失败 = {@code ok:false} + 一个**明确错误码** + 人话 message。
 *
 * <p>为什么要单独一个类（而不是像 {@code mineLookingAt} 那样回 null）：本族五条动作的失败原因
 * **互不相同**且调用方要据此决策 —— 「没开界面」要先去开界面，「索引越界」是调用方的错，
 * 「手上没东西」要先给物品。全挤进一个 null 里，调用方只能猜。
 * 形状照 {@link CommandResult} 的先例：**适配层填，core 只负责透出**。
 *
 * <p>为什么错误码是常量而不是自由字符串：单测与外部脚本要按码分支（见 tests 的 GuiActionsTest），
 * 自由字符串一改就静默漂移。
 *
 * <p>Java 8 可用（本类无任何 MC / 加载器类型）。
 */
public final class GuiResult {
    /** 本档压根没实现这条动作（{@link GameBridge} 的 default 落点）。 */
    public static final String UNSUPPORTED = "GUI_ACTIONS_UNSUPPORTED";
    /** 当前**没有打开任何容器界面**（连隐藏的玩家背包都没开）⇒ 读不到槽位。 */
    public static final String NO_SCREEN_OPEN = "NO_SCREEN_OPEN";
    /** 槽位下标越界（{@code slot < 0 || slot >= slotCount}）。 */
    public static final String SLOT_OUT_OF_RANGE = "SLOT_OUT_OF_RANGE";
    /** 控件下标越界（对应 {@code query_widgets} 列表）。 */
    public static final String WIDGET_OUT_OF_RANGE = "WIDGET_OUT_OF_RANGE";
    /** 该控件不可点（不可见 / 被禁用 / 这一项不是可点控件）。 */
    public static final String WIDGET_NOT_CLICKABLE = "WIDGET_NOT_CLICKABLE";
    /** 点击发出去了但控件没收（界面鼠标入口回 false）。 */
    public static final String WIDGET_CLICK_REJECTED = "WIDGET_CLICK_REJECTED";
    /** 没有玩家 / 不在世界里。 */
    public static final String NOT_IN_WORLD = "NOT_IN_WORLD";
    /** 目标方块超出触及距离（创造 5.0 / 生存 4.5）。 */
    public static final String TARGET_TOO_FAR = "TARGET_TOO_FAR";
    /** 手上没有东西（{@code place_block} 需要手持方块）。 */
    public static final String NO_ITEM_IN_HAND = "NO_ITEM_IN_HAND";
    /** 目标位置**不可放置**（已被占用 / 不是可替换方块）。 */
    public static final String TARGET_NOT_PLACEABLE = "TARGET_NOT_PLACEABLE";
    /** 右键没被游戏受理（{@code ActionResult} 不是 accepted）。 */
    public static final String USE_FAILED = "USE_FAILED";
    /** 放置没被游戏受理。 */
    public static final String PLACE_FAILED = "PLACE_FAILED";
    /**
     * [T35] {@code drop_item} **落地校验**未通过：点击发出去了，但 ≥minTick 后复读该格**与预期不符**
     * （点击没落地）。真机 L4（2026-11-12）铁证：菜单 containerId 与客户端当前菜单不一致时，
     * 原版 {@code handleInventoryMouseClick} / {@code clickSlot} **只记一条 WARN 就丢掉这一击**，
     * 而旧回执在**同一 tick**读回执读到的还是点击前的数 ⇒ 静默报成功。
     */
    public static final String DROP_ITEM_NOT_APPLIED = "DROP_ITEM_NOT_APPLIED";
    /**
     * [T35] {@code drop_item} **落地校验**到点后**读不到背包**（{@code inventoryJson} 回 null）
     * ⇒ 校验做不了，**不假装丢成功**（与 {@link #DROP_ITEM_NOT_APPLIED} 分开，别混）。
     */
    public static final String DROP_ITEM_VERIFY_UNREADABLE = "DROP_ITEM_VERIFY_UNREADABLE";

    /** 动作是否成功。 */
    public final boolean ok;
    /** 失败码（成功时为 null）；取值见上面的常量。 */
    public final String code;
    /** 人话说明（成功时可为 null）。 */
    public final String message;
    /** 成功时的附加读数（失败时可为空表，**不为 null**）。 */
    public final Map<String, Object> data;

    private GuiResult(boolean ok, String code, String message, Map<String, Object> data) {
        this.ok = ok;
        this.code = code;
        this.message = message;
        this.data = data == null ? new LinkedHashMap<String, Object>() : data;
    }

    public static GuiResult ok() {
        return new GuiResult(true, null, null, new LinkedHashMap<String, Object>());
    }

    public static GuiResult ok(Map<String, Object> data) {
        return new GuiResult(true, null, null, data);
    }

    public static GuiResult fail(String code, String message) {
        return new GuiResult(false, code, message, new LinkedHashMap<String, Object>());
    }

    /** 失败时也带上读数（诊断用）—— 仍回同一错误码。 */
    public static GuiResult fail(String code, String message, Map<String, Object> data) {
        return new GuiResult(false, code, message, data);
    }

    @Override
    public String toString() {
        return "GuiResult{ok=" + ok + ", code=" + code + ", message=" + message + ", data=" + data + "}";
    }
}
