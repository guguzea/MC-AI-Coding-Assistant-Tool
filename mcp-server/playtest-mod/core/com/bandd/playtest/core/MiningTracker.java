package com.bandd.playtest.core;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 挖矿会话的**跨 tick 状态机**（core 面，可离线单测；适配层只喂「目标格现在是不是空气」）。
 *
 * <p><b>为什么必须有它</b>（2026-11-11 真机挖出的致命缺陷）：vanilla 的
 * {@code MultiPlayerGameMode.continueDestroyBlock}（mojmap）/ Yarn
 * {@code ClientPlayerInteractionManager.updateBlockBreakingProgress}（1.14.4 档里叫
 * {@code method_2902}）/ MCP {@code PlayerControllerMP.onPlayerDamageBlock} 在
 * <b>「延迟 / 冷却未到」的分支里也 return true</b>：
 * <pre>
 *   // javap -c net.minecraft.client.multiplayer.MultiPlayerGameMode#continueDestroyBlock
 *   //   （jar = forge-1.20.1-47.4.10_mapped_parchment_2023.09.03-1.20.1）
 *    4: getfield destroyDelay:I ; ifle 23
 *   11: ... destroyDelay-- ; 21: iconst_1 ; 22: ireturn      &lt;-- 方块还在也返回 true
 *   // fabric 1.21.11 yarn 件同形：blockBreakingCooldown &gt; 0 分支 iconst_1 / ireturn
 * </pre>
 * ⇒ 把返回值当「已挖穿」会在**第一 tick** 就把目标清空，破坏进度永远攒不满
 * （真机铁证：生存模式 {@code mine} 40 次 / 22 秒、{@code press attack} 按住 12 秒，
 * 方块纹丝不动；而 {@code bot_break} 能挖穿 ⇒ 世界与服务端正常）。
 *
 * <p><b>唯一完成判据 = 目标格变空气</b>（适配层用 {@code getBlockState(pos).isAir()} 喂进来）；
 * 另有**超时兜底**（fail-loud，回 {@link #STOP_TIMEOUT}，不无限空转）。
 * {@code continueReturnedTrue} 参数**只作诊断记账**（它出现的次数本身说明「延迟分支」走了几 tick），
 * <b>绝不据此收工</b> —— 这就是与旧写法（{@code if (continueDestroyBlock(...)) mining = null;}）的唯一区别。
 *
 * <p>Java 8 可用（不碰任何 net.minecraft.* / 加载器类型）。
 */
public final class MiningTracker {

    /** 收工原因：目标格变空气（挖穿 / 被别人换掉）。 */
    public static final String STOP_BROKEN = "MINE_BROKEN";
    /** 收工原因：超过 maxTicks 仍未挖穿（fail-loud，不假装成功、不无限挂着）。 */
    public static final String STOP_TIMEOUT = "MINE_TIMEOUT";

    /** 默认超时：600 tick = 30s @20tps（徒手挖黑曜石都够；超了明确收工）。 */
    public static final int DEFAULT_MAX_TICKS = 600;

    /** 进度自报的人话（原样进 mine 回执的 progressNote）。 */
    public static final String NOTE =
            "mine 是**跨 tick** 的：本回执只代表「目标已锁定并开始破坏」，不代表已经挖穿。"
            + "progress.miningTicks = 该目标已推进的 tick 数；progress.targetStillThere=false / "
            + "progress.lastStopReason=" + STOP_BROKEN + " 才表示真挖穿；" + STOP_TIMEOUT
            + " = 超时收工（fail-loud，没挖穿）。真值判据请用 query_column / query_blocks 读该格。";

    private final int maxTicks;
    private boolean hasTarget;
    private int tx, ty, tz;
    private int ticks;
    private long startedAtMs = -1L;
    private long lastTickAtMs = -1L;
    private int minedCount;
    private String lastMined;
    private String lastStopReason;
    private String lastStopTarget;
    private int stops;
    private String targetBlockId;
    private int continueTrueCount;

    public MiningTracker() {
        this(DEFAULT_MAX_TICKS);
    }

    public MiningTracker(int maxTicks) {
        this.maxTicks = maxTicks <= 0 ? DEFAULT_MAX_TICKS : maxTicks;
    }

    /**
     * 锁定 / 更换目标。
     *
     * @return {@code true} = 这是**新目标**（调用方应发一次 startDestroyBlock / attackBlock）；
     *         {@code false} = 同一目标（**绝不能**重发 START —— MC 的 START 会把破坏进度清零，
     *         调用方按周期反复调 mine 时就会变成「非常快速的单次点击」，永远挖不动）。
     */
    public boolean aim(int x, int y, int z, String blockId, long nowMs) {
        if (hasTarget && x == tx && y == ty && z == tz) return false;
        hasTarget = true;
        tx = x; ty = y; tz = z;
        ticks = 0;
        startedAtMs = nowMs;
        lastTickAtMs = nowMs;
        targetBlockId = blockId;
        return true;
    }

    public boolean hasTarget() { return hasTarget; }
    public int targetX() { return tx; }
    public int targetY() { return ty; }
    public int targetZ() { return tz; }
    public int ticks() { return ticks; }
    public int maxTicks() { return maxTicks; }
    public int minedCount() { return minedCount; }
    public String lastMined() { return lastMined; }
    public String lastStopReason() { return lastStopReason; }
    public String targetBlockId() { return targetBlockId; }

    /** 收工 / 主动放弃（不记 minedCount）。 */
    public void clear() {
        hasTarget = false;
        ticks = 0;
        startedAtMs = -1L;
    }

    /**
     * **本 tick 是否继续挖**（在调用宿主的 continue 之前调）。
     *
     * <p>判据**只有两条**：目标格变空气 ⇒ {@link #STOP_BROKEN}；超过 maxTicks ⇒ {@link #STOP_TIMEOUT}。
     * 宿主的 continue 返回值**不参与**这个决定（见 {@link #noteContinueReturned}）。
     *
     * @param targetIsAir 宿主读到的「目标格现在是不是空气」（**唯一完成判据**）
     * @param nowMs       宿主时钟（毫秒，只用于 elapsedMs 自报）
     * @return {@code null} = 继续挖；否则 = 收工原因码
     */
    public String beginTick(boolean targetIsAir, long nowMs) {
        if (!hasTarget) return null;
        lastTickAtMs = nowMs;
        if (targetIsAir) {
            stop(STOP_BROKEN);
            return STOP_BROKEN;
        }
        if (ticks >= maxTicks) {
            stop(STOP_TIMEOUT);
            return STOP_TIMEOUT;
        }
        ticks++;
        return null;
    }

    /**
     * 记录宿主 {@code continueDestroyBlock} / {@code updateBlockBreakingProgress} /
     * {@code onPlayerDamageBlock} 的返回值 —— **只作诊断记账，绝不据此收工**
     * （vanilla 在 destroyDelay / blockBreakingCooldown 未到的分支里也回 true，javap -c 实证）。
     */
    public void noteContinueReturned(boolean returnedTrue) {
        if (returnedTrue) continueTrueCount++;
    }

    private void stop(String reason) {
        if (STOP_BROKEN.equals(reason)) minedCount++;
        lastMined = xy(tx, ty, tz);
        lastStopReason = reason;
        lastStopTarget = xy(tx, ty, tz);
        stops++;
        hasTarget = false;
        ticks = 0;
    }

    /** 进度自报（只读内存字段，**不碰 MC** ⇒ HTTP 线程 / 任意线程都安全）。 */
    public Map<String, Object> status() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("target", hasTarget ? xy(tx, ty, tz) : null);
        m.put("hasTarget", Boolean.valueOf(hasTarget));
        m.put("targetBlock", targetBlockId);
        m.put("targetStillThere", Boolean.valueOf(hasTarget));
        m.put("miningTicks", Integer.valueOf(ticks));
        m.put("maxTicks", Integer.valueOf(maxTicks));
        m.put("elapsedMs", (hasTarget && startedAtMs >= 0)
                ? Long.valueOf(Math.max(0L, lastTickAtMs - startedAtMs)) : null);
        m.put("minedCount", Integer.valueOf(minedCount));
        m.put("lastMined", lastMined);
        m.put("lastStopReason", lastStopReason);
        m.put("lastStopTarget", lastStopTarget);
        m.put("stops", Integer.valueOf(stops));
        m.put("continueReturnedTrueCount", Integer.valueOf(continueTrueCount));
        m.put("continueReturnedTrueNote",
                "continueDestroyBlock / updateBlockBreakingProgress / onPlayerDamageBlock 返回 true 的 tick 数。"
                + "**这个数 > 0 且 targetStillThere 仍为 true 是正常的**：vanilla 在 destroyDelay / "
                + "blockBreakingCooldown 未到的分支里也回 true（javap -c 实证）⇒ 绝不能拿它当「已挖穿」。");
        m.put("note", NOTE);
        return m;
    }

    private static String xy(int x, int y, int z) {
        return x + "," + y + "," + z;
    }
}
