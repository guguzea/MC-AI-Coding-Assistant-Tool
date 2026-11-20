package com.bandd.playtest.test;

import com.bandd.playtest.core.ActionQueue;
import com.bandd.playtest.core.Arbitration;
import com.bandd.playtest.core.Capabilities;
import com.bandd.playtest.core.HttpApi;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.PlaytestCore;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** core 的真测试（不需要 Minecraft）。跑法见 run-tests.ps1。 */
public final class CoreTest {
    private static int pass = 0;
    private static int fail = 0;

    public static void main(String[] args) throws Exception {
        Path tmp = Files.createTempDirectory("bandd-core-test");

        // ---------- 1. Json ----------
        Map<String, Object> req = Json.parseObject(
                "{\"id\":\"a1\",\"action\":\"press\",\"params\":{\"key\":\"forward\",\"down\":true}}");
        check("Json 解析顶层 id", "a1".equals(Json.str(req, "id", "")));
        @SuppressWarnings("unchecked")
        Map<String, Object> p = (Map<String, Object>) req.get("params");
        check("Json 解析嵌套 params.key", "forward".equals(Json.str(p, "key", "")));
        check("Json 解析嵌套 params.down(bool)", Json.bool(p, "down", false));
        check("Json 转义引号", Json.of("a\"b").equals("\"a\\\"b\""));
        check("Json 中文往返", "键".equals(Json.str(Json.parseObject("{\"k\":\"键\"}"), "k", "")));
        // 数值取值：裸数字与字符串等价（真机静默缺陷的回归位；见 PlaytestCore 的 Json.num 注释）
        Map<String, Object> numReq = Json.parseObject("{\"waitMs\":1500,\"sinceOffset\":\"2048\",\"frac\":1.5}");
        check("Json.num 裸数字 1500 → \"1500\"（不是 \"1500.0\"）", "1500".equals(Json.num(numReq, "waitMs", "0")));
        check("Json.num 字符串原样", "2048".equals(Json.num(numReq, "sinceOffset", "0")));
        check("Json.num 小数保留", "1.5".equals(Json.num(numReq, "frac", "0")));
        check("Json.num 缺省回落", "7".equals(Json.num(numReq, "missing", "7")));
        check("Json.num 负数", "-12".equals(Json.num(Json.parseObject("{\"n\":-12}"), "n", "0")));
        check("str 语义未改坏（裸数字仍是 \"1500.0\"）", "1500.0".equals(Json.str(numReq, "waitMs", "0")));

        // ---------- 2. Capabilities ----------
        check("能力自报：桥面非空", !Capabilities.BRIDGE.isEmpty());
        check("能力自报：driver 面含 press", Capabilities.DRIVER.contains("press"));
        check("能力自报：all() = 并集", Capabilities.all().size() == Capabilities.BRIDGE.size() + Capabilities.DRIVER.size());

        // ---------- 3. 仲裁：AUTO 让位 + 记账式释放 ----------
        {
            FakeBridge b = new FakeBridge();
            PlaytestCore core = new PlaytestCore(b, tmp.resolve("e1"), "tok");
            // AI 按下 forward
            Map<String, Object> r1 = core.dispatch("press", params("key", "forward", "down", Boolean.TRUE));
            check("AUTO: AI 按 forward 成功", "ok".equals(r1.get("status")));
            check("AUTO: 记账含 forward", core.arbitration().isOwned("forward"));
            // 真人按下 jump（AI 没按过）
            b.pressed.put("jump", true);
            core.onTick();   // 应触发让位
            check("AUTO: 检测到真人输入后让位", !core.arbitration().aiOwns());
            check("AUTO: yields 计数 +1", core.arbitration().yields() == 1);
            check("AUTO: 释放了 AI 的 forward", b.calls.contains("set:forward=false"));
            check("AUTO: 真人按着的 jump 未被清掉", !b.calls.contains("set:jump=false"));
            check("AUTO: 让位后 AI 不能再按", "failed".equals(core.dispatch("press", params("key", "back", "down", Boolean.TRUE)).get("status")));
            check("AUTO: take_over 后恢复", "ok".equals(core.dispatch("take_over", new LinkedHashMap<>()).get("status")) && core.arbitration().aiOwns());
        }

        // ---------- 4. 仲裁：DUAL 挡按键 ----------
        {
            FakeBridge b = new FakeBridge();
            PlaytestCore core = new PlaytestCore(b, tmp.resolve("e2"), "tok");
            core.dispatch("set_arbitration", params("mode", "DUAL"));
            Map<String, Object> r = core.dispatch("press", params("key", "forward", "down", Boolean.TRUE));
            check("DUAL: press 被拒", "failed".equals(r.get("status")) && "DRIVER_DISABLED".equals(r.get("code")));
            check("DUAL: 没有真的按键", !b.calls.contains("set:forward=true"));
        }

        // ---------- 5. 派发：禁列 / 缺参 / 未知动作 / 键不支持 ----------
        {
            FakeBridge b = new FakeBridge();
            PlaytestCore core = new PlaytestCore(b, tmp.resolve("e3"), "tok");
            check("禁列 kill", "COMMAND_FORBIDDEN".equals(core.dispatch("chat_command", params("command", "kill @e")).get("code")));
            check("禁列 /tnt", "COMMAND_FORBIDDEN".equals(core.dispatch("chat_command", params("command", "/tnt")).get("code")));
            check("禁列 fill", "COMMAND_FORBIDDEN".equals(core.dispatch("chat_command", params("command", "fill 0 0 0 1 1 1 stone")).get("code")));
            check("正常命令放行", "ok".equals(core.dispatch("chat_command", params("command", "time set day")).get("status")));
            check("缺参", "MISSING_REQUIRED_PARAM".equals(core.dispatch("chat_command", new LinkedHashMap<>()).get("code")));
            check("未知动作", "UNKNOWN_ACTION".equals(core.dispatch("nope", new LinkedHashMap<>()).get("code")));
            check("不支持的键", "KEY_NOT_SUPPORTED".equals(core.dispatch("press", params("key", "teleport", "down", Boolean.TRUE)).get("code")));
            check("open_world 路由", "ok".equals(core.dispatch("open_world", params("world", "playtest_demo")).get("status"))
                    && b.openedWorlds.contains("playtest_demo"));
            check("open_world 缺参判红", "MISSING_REQUIRED_PARAM".equals(core.dispatch("open_world", new LinkedHashMap<>()).get("code")));
            check("status 有 capabilities", core.status().containsKey("capabilities"));
            check("status 有 arbitration", core.status().containsKey("arbitration"));
        }

        // ---------- 6. ActionQueue：入队 → tick 才执行；超时返回 null ----------
        {
            FakeBridge b = new FakeBridge();
            PlaytestCore core = new PlaytestCore(b, tmp.resolve("e4"), "tok");
            ActionQueue.Job j = core.queue().submit("ping", new LinkedHashMap<>());
            check("入队后未执行（await 超时=null）", j.await(120) == null);
            core.onTick();
            Map<String, Object> res = j.await(500);
            check("tick 后执行完成", res != null && "ok".equals(res.get("status")));
        }

        // ---------- 7. EvidenceWriter：证据三件 ----------
        {
            FakeBridge b = new FakeBridge();
            Path ev = tmp.resolve("e5");
            PlaytestCore core = new PlaytestCore(b, ev, "tok");
            core.evidence().log("[QA] hello");
            core.evidence().state(Json.of(core.status()));
            core.onShutdown();
            check("证据: qa.log 落盘且含 [QA]", Files.exists(ev.resolve("qa.log"))
                    && new String(Files.readAllBytes(ev.resolve("qa.log"))).contains("[QA] hello"));
            check("证据: state.json 落盘", Files.exists(ev.resolve("state.json")));
            check("证据: exit-code.txt = 0", Files.exists(ev.resolve("exit-code.txt"))
                    && new String(Files.readAllBytes(ev.resolve("exit-code.txt"))).trim().equals("0"));
        }

        // ---------- 8. HttpApi：/status 免 token、/execute 要 token、端口自增 ----------
        {
            FakeBridge b = new FakeBridge();
            PlaytestCore core = new PlaytestCore(b, tmp.resolve("e6"), "secret-token");
            HttpApi api = new HttpApi(core);
            int port = api.start(39181);
            check("HTTP: 首占用 39181", port == 39181);

            // 用后台线程模拟客户端 tick
            Thread ticker = new Thread(() -> {
                while (!Thread.currentThread().isInterrupted()) {
                    core.onTick();
                    try { Thread.sleep(20); } catch (InterruptedException e) { return; }
                }
            });
            ticker.setDaemon(true);
            ticker.start();

            HttpClient http = HttpClient.newHttpClient();
            String status = get(http, "http://127.0.0.1:" + port + "/status");
            check("HTTP: /status 免 token 可用", status.contains("\"ok\":true") && status.contains("capabilities"));
            check("HTTP: /status 报平台", status.contains("\"platform\":\"fake\""));

            String noTok = post(http, "http://127.0.0.1:" + port + "/execute",
                    "{\"id\":\"x\",\"action\":\"ping\"}");
            check("HTTP: 无 token 被拒", noTok.contains("UNAUTHORIZED"));

            String withTok = post(http, "http://127.0.0.1:" + port + "/execute",
                    "{\"id\":\"x\",\"token\":\"secret-token\",\"action\":\"ping\"}");
            check("HTTP: 带 token 执行 ping", withTok.contains("\"status\":\"ok\"") && withTok.contains("pong"));

            String state = post(http, "http://127.0.0.1:" + port + "/execute",
                    "{\"id\":\"y\",\"token\":\"secret-token\",\"action\":\"query_player_state\"}");
            check("HTTP: query_player_state 返回 Tester", state.contains("Tester"));

            // 端口自增
            PlaytestCore core2 = new PlaytestCore(new FakeBridge(), tmp.resolve("e7"), "t2");
            HttpApi api2 = new HttpApi(core2);
            int port2 = api2.start(39181);
            check("HTTP: 端口被占自增到 39182", port2 == 39182);

            api.stop();
            api2.stop();
            ticker.interrupt();
        }

        // ---------- 9. PlanInterpreter：热载 + 证据 + 断言 + 禁列 ----------
        {
            FakeBridge b = new FakeBridge();
            Path ev = tmp.resolve("p1");
            Files.createDirectories(ev);
            Path planFile = ev.resolve("plan.txt");
            PlaytestCore core = new PlaytestCore(b, ev, "tok");

            // 轮 1：绿
            write(planFile, "# round1\nhold forward 3\nassert player.present true\nassert player.name == Tester\nmark m1\nstop\n");
            for (int i = 0; i < 60; i++) core.onTick();
            check("plan: 轮1 ok", "ok".equals(core.plan().lastResult()));
            check("plan: 轮1 exit-code=0", read(ev.resolve("exit-code.txt")).trim().equals("0"));
            check("plan: rounds.jsonl 1 行且 ok:true", countLines(ev.resolve("rounds.jsonl")) == 1
                    && read(ev.resolve("rounds.jsonl")).contains("\"ok\":true"));
            check("plan: qa.log 含本轮 START/DONE", read(ev.resolve("qa.log")).contains("ROUND 1 START")
                    && read(ev.resolve("qa.log")).contains("ROUND 1 DONE"));
            check("plan: hold 记账（按下又松开）", b.calls.contains("set:forward=true") && b.calls.contains("set:forward=false"));
            check("plan: state.json 里有 plan 段", read(ev.resolve("state.json")).contains("\"plan\""));

            // 轮 2：改 plan.txt ⇒ 同一进程热载开新一轮
            write(planFile, "# round2\nwait 1\nassert player.present true\nstop\n");
            for (int i = 0; i < 40; i++) core.onTick();
            check("plan: 热载后轮号=2", core.plan().round() == 2);
            check("plan: rounds.jsonl 2 行", countLines(ev.resolve("rounds.jsonl")) == 2);
            check("plan: qa.log 轮首截断（不含轮1）", !read(ev.resolve("qa.log")).contains("ROUND 1 START"));

            // 轮 3：断言不成立 ⇒ 判红
            write(planFile, "assert player.present false\nstop\n");
            for (int i = 0; i < 30; i++) core.onTick();
            check("plan: 断言失败判红", "failed".equals(core.plan().lastResult()));
            check("plan: exit-code=1", read(ev.resolve("exit-code.txt")).trim().equals("1"));
            check("plan: rounds.jsonl 记 ok:false", read(ev.resolve("rounds.jsonl")).contains("\"ok\":false"));

            // 轮 4：禁列命令 ⇒ 判红（fail-closed，不静默跳过）
            write(planFile, "cmd kill @e\nstop\n");
            for (int i = 0; i < 30; i++) core.onTick();
            check("plan: 禁列命令判红", "failed".equals(core.plan().lastResult()));
            check("plan: 禁列命令未真的发出", b.commands.isEmpty());

            // 轮 5：未知指令 ⇒ 判红
            write(planFile, "flyme to the moon\n");
            for (int i = 0; i < 30; i++) core.onTick();
            check("plan: 未知指令判红（不静默跳过）", "failed".equals(core.plan().lastResult()));

            // 轮 6：数值/字符串断言与比较符
            write(planFile, "assert pos.x > 1.0\nassert pos.x < 2.0\nassert player.name != Bob\nassert screen == null\nstop\n");
            for (int i = 0; i < 30; i++) core.onTick();
            check("plan: 数值与字符串断言全部成立 ⇒ 绿", "ok".equals(core.plan().lastResult()));
        }

        // ---------- 10. 化身（第二个角色）----------
        {
            FakeBridge b = new FakeBridge();
            PlaytestCore core = new PlaytestCore(b, tmp.resolve("b1"), "tok");
            check("bot: 未召唤时 bot_move 被拒", "NO_BOT".equals(core.dispatch("bot_move", params("x", "1", "y", "2", "z", "3")).get("code")));

            Map<String, Object> sp = core.dispatch("spawn_bot", params("name", "AI", "distance", "3"));
            check("bot: spawn_bot ok", "ok".equals(sp.get("status")));
            check("bot: 走适配层 spawnBot（不是聊天命令）", "AI@3.0".equals(b.botSpawnedAs));
            check("bot: status 自报载体", "fake_player".equals(core.botStatus().get("kind")));

            core.dispatch("bot_move", params("x", "10", "y", "64", "z", "10"));
            check("bot: bot_move 绝对坐标", "10.0,64.0,10.0".equals(b.botMoves.get(b.botMoves.size() - 1)));

            core.dispatch("bot_move", params("mode", "front"));
            check("bot: bot_move 玩家旁（近似前方）", "3.0,64.0,4.0".equals(b.botMoves.get(b.botMoves.size() - 1)));

            check("bot: bot_follow on", "ok".equals(core.dispatch("bot_follow", params("on", Boolean.TRUE)).get("status")));
            int before = b.botMoves.size();
            for (int i = 0; i < 25; i++) core.onTick();
            check("bot: follow 会周期性把化身挪到玩家旁", b.botMoves.size() > before);

            // 不支持载体的档要如实报错，不许假装成功
            b.botUnsupported = true;
            check("bot: 不支持时返回 BOT_UNSUPPORTED", "BOT_UNSUPPORTED".equals(core.dispatch("spawn_bot", params("name", "X")).get("code")));
            b.botUnsupported = false;

            // ---- 化身的"玩家功能" ----
            check("bot: bot_give ok", "ok".equals(core.dispatch("bot_give", params("item", "minecraft:diamond", "count", "3")).get("status")));
            check("bot: bot_give 真的给了 3 个", b.botGives.get(b.botGives.size() - 1).equals("3x minecraft:diamond"));
            check("bot: 物品 id 不存在时如实判红", "GIVE_FAILED".equals(core.dispatch("bot_give", params("item", "minecraft:nope")).get("code")));
            check("bot: bot_give 缺 item 判红", "MISSING_REQUIRED_PARAM".equals(core.dispatch("bot_give", new LinkedHashMap<>()).get("code")));

            check("bot: bot_look ok", "ok".equals(core.dispatch("bot_look", params("yaw", "90", "pitch", "-15")).get("status")));
            check("bot: bot_look 传到了适配层", "90.0/-15.0".equals(b.lastLook));
            check("bot: bot_look 非数字判红", "BAD_REQUEST".equals(core.dispatch("bot_look", params("yaw", "abc")).get("code")));

            check("bot: bot_break ok", "ok".equals(core.dispatch("bot_break", params("x", "10", "y", "64", "z", "10")).get("status")));
            check("bot: bot_break 坐标传对", b.botBroke.get(b.botBroke.size() - 1).equals("10.0,64.0,10.0"));
            check("bot: bot_break 缺坐标判红", "MISSING_REQUIRED_PARAM".equals(core.dispatch("bot_break", new LinkedHashMap<>()).get("code")));

            check("bot: bot_place ok", "ok".equals(core.dispatch("bot_place", params("x", "11", "y", "64", "z", "10")).get("status")));
            check("bot: bot_place 坐标传对", b.botPlaced.get(b.botPlaced.size() - 1).equals("11.0,64.0,10.0"));

            // 载体不支持时（如 fabric 档的 mannequin）必须如实报错
            b.botPlayerFnsSupported = false;
            check("bot: 不支持玩家功能时 bot_break 判红", "BREAK_FAILED".equals(core.dispatch("bot_break", params("x", "1", "y", "2", "z", "3")).get("code")));
            check("bot: 不支持玩家功能时 bot_give 判红", "GIVE_FAILED".equals(core.dispatch("bot_give", params("item", "minecraft:stone")).get("code")));
            check("bot: 不支持玩家功能时 bot_look 判红", "BOT_UNSUPPORTED".equals(core.dispatch("bot_look", params("yaw", "1")).get("code")));
            b.botPlayerFnsSupported = true;

            check("auth: set_auth false ok", "ok".equals(core.dispatch("set_auth", params("online", Boolean.FALSE)).get("status")));
            check("auth: 真的关掉了认证", Boolean.FALSE.equals(b.serverAuth));
            check("auth: set_auth true 也能开回来", "ok".equals(core.dispatch("set_auth", params("online", Boolean.TRUE)).get("status")) && Boolean.TRUE.equals(b.serverAuth));
            check("join: join_server ok", "ok".equals(core.dispatch("join_server", params("address", "127.0.0.1:54321")).get("status")));
            check("join: 地址传到适配层", b.joinedServers.get(b.joinedServers.size() - 1).equals("127.0.0.1:54321"));
            check("join: 缺 address 判红", "MISSING_REQUIRED_PARAM".equals(core.dispatch("join_server", new LinkedHashMap<>()).get("code")));
            int ticksBefore = b.botTicks;
            core.onServerTick(); core.onServerTick();
            check("join: 服务端 tick 入口驱动 tickBot", b.botTicks == ticksBefore + 2);
            check("bot: open_bot_inventory ok", "ok".equals(core.dispatch("open_bot_inventory", new LinkedHashMap<>()).get("status")));
            b.botInvSupported = false;
            check("bot: 不支持开物品栏时如实报错", "BOT_UNSUPPORTED".equals(core.dispatch("open_bot_inventory", new LinkedHashMap<>()).get("code")));
            b.botInvSupported = true;
            check("bot: bot_despawn ok", "ok".equals(core.dispatch("bot_despawn", new LinkedHashMap<>()).get("status")));
            check("bot: 其它 kill 仍禁（例外不放宽）", "COMMAND_FORBIDDEN".equals(core.dispatch("chat_command", params("command", "kill @e[type=zombie]")).get("code")));
            check("bot: kill 前缀变体仍禁", "COMMAND_FORBIDDEN".equals(core.dispatch("chat_command", params("command", "kill @e[tag=bandd_bot]")).get("code")));
            check("bot: 收回后 spawn 状态清掉", !Boolean.TRUE.equals(core.botStatus().get("spawned")));
        }

        // ---------- 11. 聊天桥 ----------
        {
            FakeBridge b = new FakeBridge();
            PlaytestCore core = new PlaytestCore(b, tmp.resolve("c1"), "tok");
            Map<String, Object> q0 = core.dispatch("query_chat", new LinkedHashMap<>());
            check("chat: 无新消息时 ok 且空表", "ok".equals(q0.get("status")) && dataList(q0).isEmpty());

            b.chatQueue.add("in: 你好 AI");
            b.chatQueue.add("out: hello");
            Map<String, Object> q1 = core.dispatch("query_chat", new LinkedHashMap<>());
            check("chat: 取到两条消息", dataList(q1).size() == 2);
            check("chat: 内容原样（含方向前缀）", dataList(q1).get(0).equals("in: 你好 AI"));
            check("chat: 取走后再取为空（已消费，不重复投递）", dataList(core.dispatch("query_chat", new LinkedHashMap<>())).isEmpty());

            core.dispatch("chat_say", params("text", "收到，我去挖矿"));
            String cmd = b.commands.get(b.commands.size() - 1);
            check("chat: chat_say 走 tellraw 且带 [AI] 前缀", cmd.startsWith("tellraw @a ") && cmd.contains("[AI] 收到，我去挖矿"));
            core.dispatch("chat_say", params("text", "他说\"hi\"\\ok"));
            String cmd2 = b.commands.get(b.commands.size() - 1);
            check("chat: chat_say 转义引号", cmd2.contains("\\\"hi\\\""));
            check("chat: chat_say 转义反斜杠", cmd2.contains("\\\\ok"));
            check("chat: 缺 text 判红", "MISSING_REQUIRED_PARAM".equals(core.dispatch("chat_say", new LinkedHashMap<>()).get("code")));
            check("chat: status 带 chatCount", core.status().containsKey("chatCount"));
        }

        // ---------- 12. 数值参数：经分发层与字符串等价（真机静默缺陷的回归位）----------
        // 现有用例只用字符串参数，所以漏掉了「裸数字经 Json.str 变 \"1500.0\" ⇒ Long/Integer.parseXxx 抛错
        // ⇒ 被 catch 吞掉 ⇒ 静默落回默认值」。这一段**不直调 LogTail**：
        //   query_log 走 HTTP /execute（JSON 里的裸数字）→ Json.parse → HttpApi → PlaytestCore.dispatch；
        //   bot_give / spawn_bot / bot_look / look / bot_break / bot_move 走 dispatch 收**真 Double**
        //   （与 Json.parse 出来的形状一致）。真机读数：数值 waitMs 曾被当成 0，70ms 就回 timedOut。
        {
            FakeBridge b = new FakeBridge();
            Path ev = tmp.resolve("n1");
            Files.createDirectories(ev);
            Path game = tmp.resolve("game");
            Files.createDirectories(game.resolve("logs"));
            Files.write(game.resolve("logs").resolve("latest.log"),
                    "alpha\nbravo\ncharlie\ndelta\n".getBytes(StandardCharsets.UTF_8));
            b.gameDir = game.toString();
            PlaytestCore core = new PlaytestCore(b, ev, "tok");
            HttpApi api = new HttpApi(core);
            int port = api.start(39281);
            HttpClient http = HttpClient.newHttpClient();
            String base = "http://127.0.0.1:" + port + "/execute";

            // (1) sinceOffset：裸数字 6 与字符串 "6" 必须同结果，且真的从第 6 字节起读（不是静默 0）
            Map<String, Object> fromStr = Json.parseObject(post(http, base,
                    "{\"id\":\"a\",\"token\":\"tok\",\"action\":\"query_log\",\"params\":{\"sinceOffset\":\"6\"}}"));
            Map<String, Object> fromNum = Json.parseObject(post(http, base,
                    "{\"id\":\"b\",\"token\":\"tok\",\"action\":\"query_log\",\"params\":{\"sinceOffset\":6}}"));
            Map<String, Object> fromZero = Json.parseObject(post(http, base,
                    "{\"id\":\"c\",\"token\":\"tok\",\"action\":\"query_log\",\"params\":{}}"));
            check("HTTP: 裸数字 sinceOffset=6 与字符串 \"6\" 等价", dataOf(fromNum).equals(dataOf(fromStr)));
            check("HTTP: 裸数字 sinceOffset=6 真的生效（3 行，从 bravo 起）",
                    linesOf(dataOf(fromNum)).size() == 3 && linesOf(dataOf(fromNum)).get(0).equals("bravo"));
            check("HTTP: 省略 sinceOffset 从 0 起读（4 行）", linesOf(dataOf(fromZero)).size() == 4);

            // (2) waitMs：裸数字 300 必须真的等 ~300ms 并回 timedOut=true（修复前 ≈0ms 就回）
            long t0 = System.nanoTime();
            String numResp = post(http, base,
                    "{\"id\":\"d\",\"token\":\"tok\",\"action\":\"query_log\",\"params\":{\"waitForPattern\":\"永不中\",\"waitMs\":300}}");
            long numMs = (System.nanoTime() - t0) / 1000000L;
            t0 = System.nanoTime();
            String strResp = post(http, base,
                    "{\"id\":\"e\",\"token\":\"tok\",\"action\":\"query_log\",\"params\":{\"waitForPattern\":\"永不中\",\"waitMs\":\"300\"}}");
            long strMs = (System.nanoTime() - t0) / 1000000L;
            System.out.println("  [info] query_log waitMs: numeric=" + numMs + "ms string=" + strMs + "ms");
            check("HTTP: 裸数字 waitMs=300 真的等了（>=250ms，不是 0）", numMs >= 250L);
            check("HTTP: 裸数字与字符串 waitMs 都回 timedOut=true",
                    Boolean.TRUE.equals(dataOf(Json.parseObject(numResp)).get("timedOut"))
                            && Boolean.TRUE.equals(dataOf(Json.parseObject(strResp)).get("timedOut")));
            check("HTTP: 裸数字与字符串 waitMs 耗时等价（差 <=150ms）", Math.abs(numMs - strMs) <= 150L);
            api.stop();

            // (3) bot_give 的 count 是同类点：Integer.parseInt 曾把裸数字 5 吞成默认 1
            core.dispatch("spawn_bot", params("name", "NumBot"));
            Map<String, Object> gNum = core.dispatch("bot_give", params("item", "minecraft:stone", "count", 5.0));
            Map<String, Object> gStr = core.dispatch("bot_give", params("item", "minecraft:stone", "count", "5"));
            check("dispatch: 裸数字 count=5 生效（不是默认 1）", "5x minecraft:stone".equals(dataOf(gNum).get("gave")));
            check("dispatch: 裸数字 count 与字符串 \"5\" 等价", dataOf(gNum).get("gave").equals(dataOf(gStr).get("gave")));

            // (4) Double 面同类点：distance / yaw / pitch / x-y-z 裸数字与字符串等价
            core.dispatch("spawn_bot", params("name", "D1", "distance", 7.5));
            check("dispatch: 裸数字 distance=7.5 真的传到适配层", "D1@7.5".equals(b.botSpawnedAs));
            core.dispatch("spawn_bot", params("name", "D2", "distance", "7.5"));
            check("dispatch: 裸数字 distance 与字符串 \"7.5\" 等价", "D2@7.5".equals(b.botSpawnedAs));
            core.dispatch("bot_look", params("yaw", 90.0, "pitch", -15.0));
            check("dispatch: 裸数字 bot_look yaw/pitch 传到适配层", "90.0/-15.0".equals(b.lastLook));
            core.dispatch("look", params("yaw", 45.0, "pitch", 10.0));
            check("dispatch: 裸数字 look yaw/pitch 传到适配层", "45.0/10.0".equals(b.lastPlayerLook));
            core.dispatch("look", params("yaw", "45", "pitch", "10"));
            check("dispatch: 裸数字 look 与字符串等价", "45.0/10.0".equals(b.lastPlayerLook));
            core.dispatch("bot_break", params("x", 10.0, "y", 64.0, "z", 10.0));
            check("dispatch: 裸数字 bot_break 坐标生效", "10.0,64.0,10.0".equals(b.botBroke.get(b.botBroke.size() - 1)));
            core.dispatch("bot_move", params("x", 1.0, "y", 2.0, "z", 3.0));
            check("dispatch: 裸数字 bot_move 坐标生效", "1.0,2.0,3.0".equals(b.botMoves.get(b.botMoves.size() - 1)));
        }

        System.out.println();
        System.out.println("=== core tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    private static Map<String, Object> params(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]);
        return m;
    }

    private static String get(HttpClient c, String url) throws Exception {
        return c.send(HttpRequest.newBuilder(URI.create(url)).GET().build(),
                HttpResponse.BodyHandlers.ofString()).body();
    }

    private static String post(HttpClient c, String url, String body) throws Exception {
        return c.send(HttpRequest.newBuilder(URI.create(url))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(body)).build(),
                HttpResponse.BodyHandlers.ofString()).body();
    }

    private static void write(Path p, String text) throws Exception {
        Files.write(p, text.getBytes(StandardCharsets.UTF_8));
    }

    private static String read(Path p) throws Exception {
        return Files.exists(p) ? new String(Files.readAllBytes(p), StandardCharsets.UTF_8) : "";
    }

    private static int countLines(Path p) throws Exception {
        String s = read(p).trim();
        return s.isEmpty() ? 0 : s.split("\n").length;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> dataOf(Map<String, Object> res) {
        Object d = res.get("data");
        return (d instanceof Map) ? (Map<String, Object>) d : new LinkedHashMap<>();
    }

    @SuppressWarnings("unchecked")
    private static List<String> linesOf(Map<String, Object> data) {
        Object l = data.get("lines");
        return (l instanceof List) ? (List<String>) l : java.util.Collections.emptyList();
    }

    @SuppressWarnings("unchecked")
    private static List<String> dataList(Map<String, Object> res) {
        Object d = res.get("data");
        if (!(d instanceof Map)) return java.util.Collections.emptyList();
        Object m = ((Map<String, Object>) d).get("messages");
        return (m instanceof List) ? (List<String>) m : java.util.Collections.emptyList();
    }

    private static void check(String name, boolean ok) {
        if (ok) { pass++; System.out.println("[PASS] " + name); }
        else { fail++; System.out.println("[FAIL] " + name); }
    }
}
