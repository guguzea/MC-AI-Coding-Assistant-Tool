package com.bandd.playtest.core;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * plan.txt 热载解释器（仓库「游玩自测作业规则」六条铁律的 1/2 条）。
 *
 * 铁律 1（常驻会话）：本解释器是长驻的，守候 evidenceDir/plan.txt；
 *   文件一变就在同一进程内开新一轮，不重启游戏。动作/断言/坐标/等待时长一律改 plan（热载）。
 * 铁律 2（fail-closed + 证据三件）：每轮必落
 *   - state.json（轮末快照）
 *   - exit-code.txt（0 绿 / 1 红）
 *   - qa.log（只含本轮 的 [QA] 段 —— 轮首截断）
 *   外加 rounds.jsonl（每轮一行，含 ok）。
 *
 * DSL（行式；井号起注释；空行忽略）：
 *   wait &lt;ticks&gt;                 等 N 个客户端 tick
 *   press &lt;key&gt; &lt;down|up&gt;      按/松一个逻辑键（受仲裁与「只释放自己按过的键」约束）
 *   hold &lt;key&gt; &lt;ticks&gt;         按住 N tick 后自动松开（记账式）
 *   release                      释放 AI 自己按过的全部键
 *   cmd &lt;rest&gt;                 以玩家身份发命令（禁列 kill/tnt/fill 会被拒 =&gt; 本轮判红）
 *   shot                         截图
 *   mark &lt;name&gt;                记一个标记进 state
 *   assert &lt;field&gt; &lt;op&gt; &lt;value&gt; 类型化后置条件；不成立 =&gt; 本轮判红并停止
 *   stop                         正常结束本轮（绿）
 *
 * field：player.present | player.onGround（布尔）、player.health | pos.x | pos.y | pos.z（数值）、
 *        player.name | screen（字符串，字面 null 表示无界面）
 * op：== != &gt; &lt; &gt;= &lt;=
 */
public final class PlanInterpreter {
    public enum Kind { WAIT, PRESS, HOLD, RELEASE, CMD, SHOT, MARK, ASSERT, STOP,
                        BOT_SPAWN, BOT_MOVE, BOT_FOLLOW, BOT_DESPAWN }

    public static final class Step {
        public final Kind kind;
        public final List<String> args;
        public final int line;
        Step(Kind kind, List<String> args, int line) { this.kind = kind; this.args = args; this.line = line; }
    }

    private final GameBridge bridge;
    private final EvidenceWriter evidence;
    private final Path planFile;
    private final List<Step> steps = new ArrayList<>();
    private int index = 0;
    private int waitTicks = 0;
    private final Map<String, String> holds = new LinkedHashMap<>();
    private final List<String> marks = new ArrayList<>();
    private int round = 0;
    private boolean running = false;
    private String loadedHash = "";
    private String lastResult = "none";
    private int lastSteps = 0;
    private int planCheckCounter = 0;

    public PlanInterpreter(GameBridge bridge, EvidenceWriter evidence, Path planFile) {
        this.bridge = bridge;
        this.evidence = evidence;
        this.planFile = planFile;
    }

    public int round() { return round; }
    public boolean running() { return running; }
    public String lastResult() { return lastResult; }

    public Map<String, Object> status() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("round", round);
        m.put("running", running);
        m.put("stepIndex", index);
        m.put("stepCount", steps.size());
        m.put("lastResult", lastResult);
        m.put("lastSteps", lastSteps);
        m.put("planFile", planFile.toString());
        m.put("marks", new ArrayList<>(marks));
        return m;
    }

    /** 客户端 tick 调用（MC 线程）。 */
    public void tick(PlaytestCore core) {
        // 每 5 个 tick 看一次 plan.txt（按 tick 计，不依赖墙钟 ⇒ 可确定性测试）
        if (planCheckCounter++ % 5 == 0) maybeReload(core);
        if (!running) return;
        if (waitTicks > 0) {
            waitTicks--;
            if (waitTicks == 0 && !holds.isEmpty()) releaseHeld(core, "hold 到期");
            return;
        }
        if (index >= steps.size()) { endRound(core, true, "plan exhausted"); return; }
        Step s = steps.get(index);
        try {
            if (!exec(core, s)) { endRound(core, false, "step " + s.line + " failed: " + s.kind); return; }
        } catch (Throwable t) {
            evidence.log("[QA] step " + s.line + " threw: " + t);
            endRound(core, false, "exception at line " + s.line);
            return;
        }
        index++;
    }

    /** 文件变了就开新一轮（同一进程内）。 */
    private void maybeReload(PlaytestCore core) {
        String text;
        try {
            if (!Files.exists(planFile)) return;
            text = new String(Files.readAllBytes(planFile), StandardCharsets.UTF_8);
        } catch (IOException e) {
            return;
        }
        String hash = Integer.toHexString(text.hashCode()) + ":" + text.length();
        if (hash.equals(loadedHash)) return;
        loadedHash = hash;
        steps.clear();
        String[] lines = text.split("\n");
        for (int i = 0; i < lines.length; i++) {
            Step s = parse(lines[i], i + 1);
            if (s != null) steps.add(s);
        }
        if (running) {
            evidence.log("[QA] plan.txt 变更 => 中断上一轮并开新一轮（同一进程，未重启游戏）");
            releaseHeld(core, "plan reload");
        }
        startRound(core);
    }

    private Step parse(String raw, int lineNo) {
        String line = raw;
        int h = line.indexOf('#');
        if (h >= 0) line = line.substring(0, h);
        line = line.trim();
        if (line.isEmpty()) return null;
        String[] tok = line.split("\\s+", 2);
        String head = tok[0].toLowerCase();
        String rest = tok.length > 1 ? tok[1].trim() : "";
        List<String> args = new ArrayList<>();
        if (!rest.isEmpty()) for (String a : rest.split("\\s+")) args.add(a);
        switch (head) {
            case "wait":    return new Step(Kind.WAIT, args, lineNo);
            case "press":   return new Step(Kind.PRESS, args, lineNo);
            case "hold":    return new Step(Kind.HOLD, args, lineNo);
            case "release": return new Step(Kind.RELEASE, args, lineNo);
            case "cmd":     return new Step(Kind.CMD, java.util.Collections.singletonList(rest), lineNo);
            case "shot":    return new Step(Kind.SHOT, args, lineNo);
            case "mark":    return new Step(Kind.MARK, args, lineNo);
            case "assert":  return new Step(Kind.ASSERT, args, lineNo);
            case "stop":    return new Step(Kind.STOP, args, lineNo);
            case "bot_spawn":   return new Step(Kind.BOT_SPAWN, args, lineNo);
            case "bot_move":    return new Step(Kind.BOT_MOVE, args, lineNo);
            case "bot_follow":  return new Step(Kind.BOT_FOLLOW, args, lineNo);
            case "bot_despawn": return new Step(Kind.BOT_DESPAWN, args, lineNo);
            default:
                evidence.log("[QA] plan.txt:" + lineNo + " 未知指令「" + head + "」=> 本轮判红（不静默跳过）");
                return new Step(Kind.ASSERT, java.util.Arrays.asList("__unknown__", "==", head), lineNo);
        }
    }

    private void startRound(PlaytestCore core) {
        round++;
        index = 0;
        waitTicks = 0;
        holds.clear();
        marks.clear();
        running = true;
        evidence.truncateQaLog();
        evidence.log("[QA] ROUND " + round + " START steps=" + steps.size() + " plan=" + planFile);
        evidence.state(Json.of(core.status()));
    }

    private void endRound(PlaytestCore core, boolean ok, String reason) {
        running = false;
        lastResult = ok ? "ok" : "failed";
        lastSteps = index;
        releaseHeld(core, "round end");
        evidence.exitCode(ok ? 0 : 1);
        evidence.log("[QA] ROUND " + round + " DONE ok=" + ok + " steps=" + index + "/" + steps.size() + " reason=" + reason);
        Map<String, Object> line = new LinkedHashMap<>();
        line.put("round", round);
        line.put("ok", ok);
        line.put("steps", index);
        line.put("total", steps.size());
        line.put("reason", reason);
        line.put("at", java.time.Instant.now().toString());
        evidence.appendRounds(Json.of(line));
        evidence.state(Json.of(core.status()));
    }

    private void releaseHeld(PlaytestCore core, String why) {
        for (String k : new ArrayList<>(holds.keySet())) {
            core.dispatch("press", params("key", k, "down", Boolean.FALSE));
        }
        holds.clear();
        core.dispatch("release_all", new LinkedHashMap<>());
        evidence.log("[QA] 释放 AI 按过的键（" + why + "）");
    }

    private boolean exec(PlaytestCore core, Step s) {
        switch (s.kind) {
            case WAIT: {
                if (s.args.isEmpty()) return false;
                waitTicks = Integer.parseInt(s.args.get(0));
                return true;
            }
            case PRESS: {
                if (s.args.size() < 2) return false;
                boolean down = !"up".equalsIgnoreCase(s.args.get(1));
                Map<String, Object> r = core.dispatch("press", params("key", s.args.get(0), "down", down));
                boolean ok = "ok".equals(r.get("status"));
                if (!ok) evidence.log("[QA] press 被拒: " + r.get("code") + " " + r.get("message"));
                return ok;
            }
            case HOLD: {
                if (s.args.size() < 2) return false;
                String key = s.args.get(0);
                Map<String, Object> r = core.dispatch("press", params("key", key, "down", Boolean.TRUE));
                if (!"ok".equals(r.get("status"))) { evidence.log("[QA] hold 被拒: " + r.get("code")); return false; }
                holds.put(key, s.args.get(1));
                waitTicks = Integer.parseInt(s.args.get(1));
                return true;
            }
            case RELEASE:
                releaseHeld(core, "plan 显式 release");
                return true;
            case CMD: {
                Map<String, Object> r = core.dispatch("chat_command", params("command", s.args.get(0)));
                boolean ok = "ok".equals(r.get("status"));
                if (!ok) evidence.log("[QA] cmd 被拒: " + r.get("code") + " " + r.get("message"));
                return ok;
            }
            case SHOT: {
                Map<String, Object> r = core.dispatch("screenshot", new LinkedHashMap<>());
                return "ok".equals(r.get("status"));
            }
            case MARK: {
                if (s.args.isEmpty()) return false;
                marks.add(s.args.get(0));
                evidence.log("[QA] mark " + s.args.get(0));
                return true;
            }
            case ASSERT: {
                // 两种写法都收：三段式 <field> <op> <value>，以及两段式 <field> <value>（隐含 ==）
                if (s.args.size() < 2) return false;
                String field = s.args.get(0);
                String op;
                String want;
                if (s.args.size() >= 3) {
                    op = s.args.get(1);
                    want = s.args.get(2);
                } else {
                    op = "==";
                    want = s.args.get(1);
                }
                boolean ok = evalAssert(field, op, want);
                evidence.log("[QA] assert " + field + " " + op + " " + want + " -> " + ok);
                return ok;
            }
            case BOT_SPAWN: {
                Map<String, Object> q = params("name", s.args.isEmpty() ? "AI" : s.args.get(0));
                if (s.args.size() > 1) q.put("distance", s.args.get(1));
                return "ok".equals(core.dispatch("spawn_bot", q).get("status"));
            }
            case BOT_MOVE: {
                Map<String, Object> q = new LinkedHashMap<>();
                if (s.args.size() >= 3) {
                    q.put("x", s.args.get(0));
                    q.put("y", s.args.get(1));
                    q.put("z", s.args.get(2));
                } else {
                    q.put("mode", "front");
                    if (!s.args.isEmpty()) q.put("distance", s.args.get(0));
                }
                return "ok".equals(core.dispatch("bot_move", q).get("status"));
            }
            case BOT_FOLLOW:
                return "ok".equals(core.dispatch("bot_follow",
                        params("on", s.args.isEmpty() || !"off".equalsIgnoreCase(s.args.get(0)))).get("status"));
            case BOT_DESPAWN:
                return "ok".equals(core.dispatch("bot_despawn", new LinkedHashMap<>()).get("status"));
            case STOP:
                endRound(core, true, "stop");
                return true;
            default:
                return false;
        }
    }

    /** 类型化后置条件求值（唯一一处读状态的地方）。 */
    private boolean evalAssert(String field, String op, String want) {
        if ("__unknown__".equals(field)) return false;
        Map<String, Object> st = Json.parseObject(bridge.playerStateJson());
        Object have;
        switch (field) {
            case "player.present":  have = st.get("present"); break;
            case "player.onGround": have = st.get("onGround"); break;
            case "player.health":   have = st.get("health"); break;
            case "player.name":     have = st.get("name"); break;
            case "screen":          have = bridge.screenName(); break;
            case "pos.x":           have = st.get("x"); break;
            case "pos.y":           have = st.get("y"); break;
            case "pos.z":           have = st.get("z"); break;
            default:
                evidence.log("[QA] assert 未知字段「" + field + "」=> 判红（不静默通过）");
                return false;
        }
        if (have == null) return "null".equals(want);
        if (have instanceof Boolean || have instanceof Number) {
            double h = (have instanceof Boolean) ? (((Boolean) have) ? 1 : 0) : ((Number) have).doubleValue();
            double w;
            if ("true".equalsIgnoreCase(want)) w = 1;
            else if ("false".equalsIgnoreCase(want)) w = 0;
            else {
                try { w = Double.parseDouble(want); } catch (NumberFormatException e) { return false; }
            }
            switch (op) {
                case "==": return h == w;
                case "!=": return h != w;
                case ">":  return h > w;
                case "<":  return h < w;
                case ">=": return h >= w;
                case "<=": return h <= w;
                default:   return false;
            }
        }
        String h = String.valueOf(have);
        switch (op) {
            case "==": return h.equals(want);
            case "!=": return !h.equals(want);
            default:   return false;
        }
    }

    private static Map<String, Object> params(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]);
        return m;
    }
}
