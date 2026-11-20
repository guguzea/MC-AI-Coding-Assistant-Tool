package com.bandd.playtest.core;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.TimeUnit;

/**
 * 动作队列。**线程纪律（照抄仓库口径，playtest-bridge-mod.ts:38）**：
 * HTTP 处理线程**只入队**，一切 MC 调用都在客户端 tick 线程执行（HTTP 线程碰 MC 会崩）。
 *
 * <p>[T35] 另加**跨 tick 待办**：{@code drop_item} 的「落地校验」要等 ≥minTick 再复读该格
 * ⇒ 这类 job 首发只做「点击 + 记下期待值」，**不在同一 tick 下结论**；随后每 tick 由
 * {@link PlaytestCore#advanceDeferred(ActionQueue.Job)} 推进，到点复读后才 complete。
 * 其余动作（默认）仍是**单 tick 完成** —— 行为一个字都不变。
 */
public final class ActionQueue {
    private final Queue<Job> q = new ConcurrentLinkedQueue<>();
    /** 跨 tick 未完成的 job（按首次执行顺序；只有 core 认领过的才会进来）。 */
    private final List<Job> waiting = new ArrayList<Job>();

    public Job submit(String action, Map<String, Object> params) {
        Job j = new Job(action, params);
        q.add(j);
        return j;
    }

    /** 客户端 tick 里调用：在本线程（= MC 线程）执行排队动作 + 推进跨 tick 待办。 */
    public void drain(PlaytestCore core) {
        Job j;
        while ((j = q.poll()) != null) {
            if (!j.run(core)) waiting.add(j);
        }
        if (!waiting.isEmpty()) {
            Iterator<Job> it = waiting.iterator();
            while (it.hasNext()) {
                if (it.next().advance(core)) it.remove();
            }
        }
    }

    public static final class Job {
        private final String action;
        private final Map<String, Object> params;
        private final CompletableFuture<Map<String, Object>> fut = new CompletableFuture<>();

        Job(String action, Map<String, Object> params) {
            this.action = action;
            this.params = params;
        }

        public String action() { return action; }

        public Map<String, Object> params() { return params; }

        /**
         * 首发执行。返回 false = 这一发**跨 tick 未完**（core 认领了，已挂进 waiting，
         * 等后续 tick 推进）—— 只有「落地校验」那类动作会这样。
         */
        boolean run(PlaytestCore core) {
            try {
                Map<String, Object> res = core.dispatchJob(this, action, params);
                if (core.isDeferred(res)) return false;
                fut.complete(res);
                return true;
            } catch (Throwable t) {
                fut.complete(PlaytestCore.error("EXEC_FAILED", String.valueOf(t)));
                return true;
            }
        }

        /** 推进一个跨 tick 待办。返回 true = 已完成（future 已 complete）。 */
        boolean advance(PlaytestCore core) {
            try {
                Map<String, Object> res = core.advanceDeferred(this);
                if (res == null) return false;
                fut.complete(res);
                return true;
            } catch (Throwable t) {
                fut.complete(PlaytestCore.error("EXEC_FAILED", String.valueOf(t)));
                return true;
            }
        }

        /**
         * [T39] **由另一个 tick 钩子直接完成**这个 job（不属于 {@link #waiting} 那套 drop 待办）。
         *
         * <p>为什么需要：{@code walk_to} 是**跨很多 tick** 的持续动作，进度由一个独立的会话表
         * （{@code PlaytestCore.walkSessions}）推进 —— 它不能走 {@link #advanceDeferred} 那条路
         * （那条路的语义是「落地校验」的单次复读）。这里给一个显式出口：谁推进了会话，
         * 谁就直接把结果交给 job。幂等（已 complete 再 complete 是 no-op）。
         */
        public void completeNow(Map<String, Object> res) {
            fut.complete(res);
        }

        /** HTTP 线程在这里等 tick 线程的结果；超时返回 null（= 不静默，报 TIMEOUT）。 */
        public Map<String, Object> await(long ms) {
            try {
                return fut.get(ms, TimeUnit.MILLISECONDS);
            } catch (Exception e) {
                return null;
            }
        }
    }
}
