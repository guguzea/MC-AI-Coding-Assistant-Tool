package com.bandd.playtest.core;

import java.util.LinkedHashSet;
import java.util.Set;

/**
 * 输入仲裁。**用户裁定：做成模组选项，由玩家运行时选**，所以三种模式全部实现。
 *
 *  AUTO   真人一按「AI 没按过的键」→ AI 让位（暂停 + 释放自己按过的键）
 *  HOTKEY 显式切换持权方（HTTP take_over / 游戏内热键）
 *  DUAL   AI 不碰按键（只用桥面命令）⇒ 不抢方向盘
 *
 * **记账式释放**：只释放「AI 自己按下过的键」，绝不无差别清空
 * （仓库 driver 的 releaseAll 会连带清掉真人的键 —— 见 reference/generators/playtest-driver.ts:4582-4589，
 *  那是"一起玩"下的真 bug，本模组不照抄）。
 */
public final class Arbitration {
    public enum Mode { AUTO, HOTKEY, DUAL }

    private Mode mode = Mode.AUTO;
    private boolean aiOwns = true;
    private final Set<String> owned = new LinkedHashSet<>();
    private int yields = 0;
    private String lastReason = "init";

    public synchronized Mode mode() { return mode; }

    public synchronized void setMode(Mode m) {
        mode = m;
        lastReason = "mode=" + m;
        if (m == Mode.DUAL) { aiOwns = false; }
        if (m == Mode.AUTO) { aiOwns = true; }
    }

    public synchronized boolean aiOwns() { return aiOwns; }

    public synchronized int yields() { return yields; }

    public synchronized String lastReason() { return lastReason; }

    public synchronized boolean isOwned(String key) { return owned.contains(key); }

    /** 真人是否在按一个「AI 没按过」的键（AUTO 让位判据）。 */
    public synchronized boolean humanHasControl(GameBridge bridge) {
        for (String k : bridge.supportedKeys()) {
            if (!owned.contains(k) && bridge.isPressed(k)) return true;
        }
        return false;
    }

    public synchronized void yieldToHuman(GameBridge bridge, String reason) {
        aiOwns = false;
        yields++;
        lastReason = reason;
        releaseOwned(bridge);
    }

    public synchronized void takeOver() {
        aiOwns = true;
        lastReason = "ai takeover";
    }

    /** 只释放 AI 自己按下的键。 */
    public synchronized void releaseOwned(GameBridge bridge) {
        for (String k : new LinkedHashSet<>(owned)) {
            bridge.setPressed(k, false);
        }
        owned.clear();
    }

    public synchronized void noteOwned(String key, boolean down) {
        if (down) owned.add(key); else owned.remove(key);
    }

    public synchronized int ownedCount() { return owned.size(); }
}
