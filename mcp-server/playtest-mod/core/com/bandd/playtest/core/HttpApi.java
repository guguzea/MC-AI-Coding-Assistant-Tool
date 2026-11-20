package com.bandd.playtest.core;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.Executors;

/**
 * HTTP 面（loopback + token）。协议与仓库的 playtest_bridge 对齐：
 *   GET  /status          → 状态 + 能力自报
 *   POST /execute         → {id, action, params} → {id, status, message?, data?}；HTTP 恒 200
 *
 * **安全默认**：只绑 127.0.0.1；端口被占则自增（最多 +20）；除 /status 外一律要 token。
 * **线程纪律**：本类只在 HTTP 线程跑，**绝不碰 MC**；动作全部入队，由客户端 tick 执行。
 */
public final class HttpApi {
    private final PlaytestCore core;
    private HttpServer server;
    private int port;

    public HttpApi(PlaytestCore core) { this.core = core; }

    public int start(int preferredPort) throws IOException {
        IOException last = null;
        for (int p = preferredPort; p < preferredPort + 20; p++) {
            try {
                server = HttpServer.create(new InetSocketAddress("127.0.0.1", p), 0);
                port = p;
                break;
            } catch (IOException e) {
                last = e;
            }
        }
        if (server == null) throw last == null ? new IOException("no port") : last;
        server.createContext("/status", this::handleStatus);
        server.createContext("/execute", this::handleExecute);
        server.setExecutor(Executors.newSingleThreadExecutor(r -> {
            Thread t = new Thread(r, "bandd-playtest-http");
            t.setDaemon(true);
            return t;
        }));
        server.start();
        core.setPort(port);
        core.evidence().log("[QA] http listening on 127.0.0.1:" + port);
        return port;
    }

    public int port() { return port; }

    public void stop() {
        if (server != null) server.stop(0);
    }

    private void handleStatus(HttpExchange ex) throws IOException {
        try {
            respond(ex, 200, Json.of(core.status()));
        } catch (Throwable t) {
            respond(ex, 200, Json.of(PlaytestCore.error("STATUS_FAILED", String.valueOf(t))));
        }
    }

    private void handleExecute(HttpExchange ex) throws IOException {
        Map<String, Object> out;
        try {
            String body = new String(readAll(ex), StandardCharsets.UTF_8);
            Map<String, Object> req = Json.parseObject(body);
            String id = Json.str(req, "id", "");
            String token = Json.str(req, "token", header(ex, "X-Bandd-Token"));
            if (core.token() != null && !core.token().isEmpty() && !core.token().equals(token)) {
                out = PlaytestCore.error("UNAUTHORIZED", "token 不对或缺失（见 <gameDir>/config/bandd_playtest.json）");
            } else {
                String action = Json.str(req, "action", "");
                Map<String, Object> params = new LinkedHashMap<>();
                Object pv = req.get("params");
                if (pv instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> pm = (Map<String, Object>) pv;
                    params = pm;
                }
                if (core.isOffThreadAction(action)) {
                    // 只读文件 / 有界等待的动作（query_log）在 HTTP 线程直接跑：
                    // 它不碰 MC 状态，且 waitMs 最长 60s —— 放 tick 线程会把游戏冻住。
                    Map<String, Object> res = core.dispatch(action, params);
                    res.put("id", id);
                    res.put("action", action);
                    out = res;
                } else {
                    // 入队 → 等 tick 线程执行（HTTP 线程不碰 MC）
                    ActionQueue.Job job = core.queue().submit(action, params);
                    long budget = core.timeoutMsFor(action);
                    Map<String, Object> res = job.await(budget);
                    if (res == null) {
                        out = PlaytestCore.error("PLAYTEST_TIMEOUT",
                                (budget / 1000) + "s 内未完成（长动作如 open_world 需更久；游戏卡住也会这样）");
                    } else {
                        res.put("id", id);
                        res.put("action", action);
                        out = res;
                    }
                }
            }
        } catch (Throwable t) {
            out = PlaytestCore.error("BAD_REQUEST", String.valueOf(t));
        }
        respond(ex, 200, Json.of(out));
    }

    private static byte[] readAll(HttpExchange ex) throws IOException {
        java.io.ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream();
        byte[] buf = new byte[4096];
        int n;
        while ((n = ex.getRequestBody().read(buf)) > 0) bos.write(buf, 0, n);
        return bos.toByteArray();
    }

    private static String header(HttpExchange ex, String name) {
        String v = ex.getRequestHeaders().getFirst(name);
        return v == null ? "" : v;
    }

    private static void respond(HttpExchange ex, int code, String body) throws IOException {
        byte[] b = body.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
        ex.sendResponseHeaders(code, b.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(b);
        }
    }
}
