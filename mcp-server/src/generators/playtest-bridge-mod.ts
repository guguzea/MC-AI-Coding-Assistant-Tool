/**
 * 老平台「最小桥 mod」模板生成器（1.7.10–1.12.2）。
 *
 * **为什么要它**：`playtest_bridge` 这套「HTTP 桥」路线此前只有第三方预编译件可用（BlackBoxPro 覆盖面 = fabric/neoforge 1.21.1 + 1.21.11、forge 1.12.2），
 * **1.7.10–1.11.2 一件都没有**。本生成器给出一份**最小、逐版本正确**的桥 mod 源码模板：tick 钩子 + 内嵌 `com.sun.net.httpserver`，
 * 协议与 `playtest_bridge` 一致（`/status`、`/execute`），⇒ 老平台不必改工具面就能走桥路线。
 *
 * **逐版本差异全部有出处**（每条都能在 `data/forge_javadoc/<ver>/raw/**` 找到实页；1.12.2 另有真构件 javap 复证）：
 *   - **包名在 1.8 换代**：1.7.10 = `cpw.mods.fml.*`；1.8.9+ = `net.minecraftforge.fml.*`（`@Mod` / `@SubscribeEvent` / `TickEvent` 三者同源）。
 *   - **注册总线不同**：1.7.10 用 `FMLCommonHandler.instance().bus()`（该档 javadoc **未** `@Deprecated`）；1.8.9+ 该法已 `@Deprecated`，
 *     改 `MinecraftForge.EVENT_BUS`（其 javadoc 逐字写 “all events for Forge will be fired on these”）。
 *   - **发聊天**：1.7.10 在 `EntityClientPlayerMP#sendChatMessage(String)`（`Minecraft.thePlayer` 的 javadoc 类型就是 `EntityClientPlayerMP`）；
 *     1.8.9+ 在 `EntityPlayerSP#sendChatMessage(String)`。⇒ 模板**不声明玩家变量类型**（直接 `mc.thePlayer.sendChatMessage(...)`），两个名字都对。
 *   - **读方块**：1.7.10 = `World#getBlock(int,int,int): Block`（**该档没有 `BlockPos`**）；1.8.9+ = `World#getBlockState(BlockPos): IBlockState`。
 *   - **注册名**：1.7.10 = 只回**类简单名**（`Block.blockRegistry` 的取名方法本档语料无背书）；1.8.9 = `Block#getRegistryName(): String`；
 *     1.9.4–1.12.2 = `IForgeRegistryEntry#getRegistryName(): ResourceLocation`。
 *   - **空气判定**：1.8.9 = `Block#isAir(IBlockAccess, BlockPos)`；1.9.4+ = `Block#isAir(IBlockState, IBlockAccess, BlockPos)`（**多一个参数**）；1.7.10 语料无该页 ⇒ 不回该字段。
 *   - **截图**：`ScreenShotHelper#saveScreenshot(File,int,int,Framebuffer)`（1.7.10/1.8.9 返 `IChatComponent`，1.9.4+ 返 `ITextComponent`）——
 *     模板**忽略返回值** ⇒ 不引入类型名，两代都对。
 *
 * **刻意不用的东西**：`TickEvent.Phase.END` / `TickEvent.Type.CLIENT` —— 语料里 `TickEvent.Phase`/`Type` 两页**只列 `valueOf`/`values`，不列常量名**，
 * 本仓不背书；而桥是**请求驱动**（HTTP 线程入队、tick 出队），不读 phase 也完全正确。
 *
 * **线程纪律（与 driver 同）**：HTTP 处理线程**只入队**，一切 MC 调用都在**客户端 tick 线程**执行（HTTP 线程碰 MC 会崩）。
 *
 * **与 driver 链的隔离**：本模板**不进** `PLAYTEST_VERIFIED_TIER`、不参与 driver 派发；它只在
 * `generate_playtest_driver(driverMode="external_bridge", platform="forge", version=<老档>)` 时作为**附加产物**给出。
 */

export const BRIDGE_MOD_VERSIONS: readonly string[] = ["1.7.10", "1.8.9", "1.9.4", "1.10.2", "1.11.2", "1.12.2"];

interface VerFacts {
  modImport: string;
  subImport: string;
  tickImport: string;
  busRegister: string;
  blockAt: string;
  /** `Minecraft` 的玩家字段名 */
  player: string;
  /** `Minecraft` 的世界字段名 */
  world: string;
  /** `Minecraft` 的游戏目录字段名 */
  dataDir: string;
  /** 字段名置信度注记（模板里逐版本写出，别让用户以为都一样） */
  fieldNote: string;
}

/** 逐版本事实（每条 = 一次实页取证；见本文件头注释的名单）。 */
function facts(version: string): VerFacts {
  const legacy = version === "1.7.10";
  const p = legacy ? "cpw.mods.fml" : "net.minecraftforge.fml";
  const modImport = `import ${p}.common.Mod;`;
  const subImport = `import ${p}.common.eventhandler.SubscribeEvent;`;
  const tickImport = `import ${p}.common.gameevent.TickEvent;`;
  const busRegister = legacy
    ? "        cpw.mods.fml.common.FMLCommonHandler.instance().bus().register(this);"
    : "        net.minecraftforge.common.MinecraftForge.EVENT_BUS.register(this);";

  // ⚠ `Minecraft` 的字段名**随映射快照而异**，且本机只在 1.12.2 有构件可 javap：
  //   1.12.2（`stable_39` 真构件，**编译级实测**）= `player` / `world` / `gameDir`；
  //   1.7.10–1.11.2（**只有 javadoc 语料**，本机无构件）= `thePlayer` / `theWorld` / `mcDataDir`。
  //   两代不一致这件事本身已在 `forge/1.12.2/knowledge/common/verified-api.md` 记档（doc↔jar 冲突）。
  const fields = version === "1.12.2"
    ? { player: "player", world: "world", dataDir: "gameDir", fieldNote: "1.12.2 的字段名按 **stable_39 真构件 javap**（`player`/`world`/`gameDir`）—— 注意该档 javadoc 写的是 `thePlayer`/`theWorld`/`mcDataDir`，**别按文档写**" }
    : { player: "thePlayer", world: "theWorld", dataDir: "mcDataDir", fieldNote: `1.7.10–1.11.2 的字段名**只有 javadoc 语料**（\`thePlayer\`/\`theWorld\`/\`mcDataDir\`），本机无该档构件 ⇒ **未编译验证**；若你的工程按别的映射快照编译，按报错改这三个名字即可（类名/方法名不受影响）` };

  // 读方块 + 注册名（逐版本；1.7.10 无 BlockPos/IBlockState 页）
  const blockAt = legacy
    ? [
        "            net.minecraft.block.Block b = mc." + fields.world + ".getBlock(x, y, z);",
        '            out.append(",\\"cls\\":\\"").append(esc(b.getClass().getSimpleName())).append("\\"");',
        '            out.append(",\\"id\\":null");',
        '            out.append(",\\"air\\":null"); // 1.7.10：本档语料无 Block.isAir 页 ⇒ 不给该字段（别填假值）',
      ].join("\n")
    : version === "1.8.9"
      ? [
          "            net.minecraft.util.math.BlockPos pos = new net.minecraft.util.math.BlockPos(x, y, z);",
          "            net.minecraft.block.state.IBlockState st = mc." + fields.world + ".getBlockState(pos);",
          "            net.minecraft.block.Block b = st.getBlock();",
          '            out.append(",\\"cls\\":\\"").append(esc(b.getClass().getSimpleName())).append("\\"");',
          '            out.append(",\\"id\\":\\"").append(esc(String.valueOf(b.getRegistryName()))).append("\\"");',
          '            out.append(",\\"air\\":").append(b.isAir(mc.' + fields.world + ', pos));',
        ].join("\n")
      : [
          "            net.minecraft.util.math.BlockPos pos = new net.minecraft.util.math.BlockPos(x, y, z);",
          "            net.minecraft.block.state.IBlockState st = mc." + fields.world + ".getBlockState(pos);",
          "            net.minecraft.block.Block b = st.getBlock();",
          '            out.append(",\\"cls\\":\\"").append(esc(b.getClass().getSimpleName())).append("\\"");',
          '            out.append(",\\"id\\":\\"").append(esc(String.valueOf(b.getRegistryName()))).append("\\"");',
          '            out.append(",\\"air\\":").append(b.isAir(st, mc.' + fields.world + ', pos));',
        ].join("\n");

  return { modImport, subImport, tickImport, busRegister, blockAt, ...fields };
}

function javaFor(version: string, modId: string): string {
  const f = facts(version);
  const pkg = `com.example.${modId.replace(/[^A-Za-z0-9_]/g, "_")}.playtest.bridge`;
  const java = `package ${pkg};

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

${f.modImport}
${f.subImport}
${f.tickImport}
import net.minecraft.client.Minecraft;

/**
 * 最小游玩测试桥（**本档 = forge ${version}**；测完必须按 README.bridge.md 撤除，绝不提交）。
 *
 * 协议与 \`playtest_bridge\` 一致：\`GET /status\`、\`POST /execute\`（body = \`{"action":"...","params":{...}}\`）。
 * **线程纪律**：HTTP 线程只入队；所有 Minecraft 调用都在客户端 tick 线程里做（HTTP 线程碰 MC 会崩）。
 * **不读 \`TickEvent.Phase\`**：语料不背书其枚举常量名，且请求驱动不需要（逐 tick 轮询队列即可）。
 *
 * 逐版本差异（出处见仓库 \`forge/${version}/knowledge/common/verified-api.md\`）：
 *   tick/注解/\\@Mod 的包 = ${version === "1.7.10" ? "cpw.mods.fml.*" : "net.minecraftforge.fml.*"}；
 *   注册总线 = ${version === "1.7.10" ? "FMLCommonHandler.instance().bus()" : "MinecraftForge.EVENT_BUS"}；
 *   读方块 = ${version === "1.7.10" ? "World.getBlock(int,int,int)" : "World.getBlockState(BlockPos)"}。
 */
@Mod(modid = "${modId}_playtest_bridge")
public class BridgeMod {

    /** 端口与驱动侧 \`playtest_bridge\` 的默认值一致（只绑 127.0.0.1，桥无鉴权 ⇒ 别暴露到公网）。 */
    public static final int PORT = 38081;

    private static HttpServer server;

    public BridgeMod() {
${f.busRegister}
        startServer();
    }

    @SubscribeEvent
    public void onClientTick(TickEvent.ClientTickEvent event) {
        Task t;
        while ((t = Task.QUEUE.poll()) != null) {
            try {
                t.result = execute(t.action, t.params);
            } catch (Throwable e) {
                t.error = String.valueOf(e);
            } finally {
                t.latch.countDown();
            }
        }
    }

    // ───────────────────────── MC 侧动作（都在 tick 线程执行） ─────────────────────────

    private String execute(String action, Map<String, String> params) {
        Minecraft mc = Minecraft.getMinecraft();
        if ("query_player_state".equals(action)) {
            StringBuilder out = new StringBuilder("{");
            boolean inWorld = mc.thePlayer != null && mc.theWorld != null;
            out.append("\\"inWorld\\":").append(inWorld);
            if (inWorld) {
                out.append(",\\"x\\":").append(mc.thePlayer.posX);
                out.append(",\\"y\\":").append(mc.thePlayer.posY);
                out.append(",\\"z\\":").append(mc.thePlayer.posZ);
                out.append(",\\"yaw\\":").append(mc.thePlayer.rotationYaw);
                out.append(",\\"pitch\\":").append(mc.thePlayer.rotationPitch);
                out.append(",\\"onGround\\":").append(mc.thePlayer.onGround);
            }
            out.append("}");
            return out.toString();
        }
        if ("chat_command".equals(action)) {
            String cmd = params.get("command");
            if (cmd == null || cmd.length() == 0) throw new IllegalArgumentException("chat_command 需要 command");
            // 命令要带前导 '/'；聊天不要。（1.7.10 是 EntityClientPlayerMP，1.8.9+ 是 EntityPlayerSP —— 方法同名 ⇒ 不声明类型名）
            mc.thePlayer.sendChatMessage(cmd.charAt(0) == '/' ? cmd : "/" + cmd);
            return "{\\"sent\\":\\"" + esc(cmd) + "\\"}";
        }
        if ("screenshot".equals(action)) {
            // 返回类型在 1.7.10/1.8.9 是 IChatComponent、1.9.4+ 是 ITextComponent ⇒ 忽略返回值，避免引入类型名
            net.minecraft.util.ScreenShotHelper.saveScreenshot(mc.mcDataDir, mc.displayWidth, mc.displayHeight, mc.getFramebuffer());
            File dir = new File(mc.mcDataDir, "screenshots");
            return "{\\"dir\\":\\"" + esc(dir.getAbsolutePath()) + "\\"}";
        }
        if ("block_at".equals(action)) {
            int x = intParam(params, "x");
            int y = intParam(params, "y");
            int z = intParam(params, "z");
            if (mc.theWorld == null) throw new IllegalStateException("block_at：不在世界");
            StringBuilder out = new StringBuilder("{");
            out.append("\\"x\\":").append(x).append(",\\"y\\":").append(y).append(",\\"z\\":").append(z);
${f.blockAt}
            out.append("}");
            return out.toString();
        }
        throw new IllegalArgumentException("未知 action：" + action);
    }

    // ───────────────────────── HTTP 侧（只入队 + 等结果） ─────────────────────────

    private static void startServer() {
        try {
            server = HttpServer.create(new InetSocketAddress("127.0.0.1", PORT), 0);
            server.createContext("/status", new Handler() {
                public void handle(HttpExchange ex) throws IOException {
                    respond(ex, 200, "{\\"ready\\":true,\\"version\\":\\"${version}\\",\\"bridge\\":\\"minimal\\"}");
                }
            });
            server.createContext("/execute", new Handler() {
                public void handle(HttpExchange ex) throws IOException {
                    String body = readAll(ex);
                    try {
                        Map<String, String> flat = flatJson(body);
                        String action = flat.get("action");
                        if (action == null) throw new IllegalArgumentException("body 需要 action");
                        Task t = new Task(action, flat);
                        Task.QUEUE.add(t);
                        // 等 tick 线程回填；客户端没在跑（菜单/未进世界）会超时
                        if (!t.latch.await(10000, TimeUnit.MILLISECONDS)) {
                            respond(ex, 504, "{\\"ok\\":false,\\"error\\":\\"TIMEOUT（客户端未在 tick 或未进世界）\\"}");
                            return;
                        }
                        if (t.error != null) {
                            respond(ex, 400, "{\\"ok\\":false,\\"error\\":\\"" + esc(t.error) + "\\"}");
                            return;
                        }
                        respond(ex, 200, "{\\"ok\\":true,\\"data\\":" + t.result + "}");
                    } catch (Throwable e) {
                        respond(ex, 400, "{\\"ok\\":false,\\"error\\":\\"" + esc(String.valueOf(e)) + "\\"}");
                    }
                }
            });
            server.setExecutor(null);
            server.start();
            System.out.println("[PT-BRIDGE] listening on 127.0.0.1:" + PORT + " (mc ${version})");
        } catch (IOException e) {
            System.out.println("[PT-BRIDGE] 起服务失败：" + e);
        }
    }

    /** 只绑 127.0.0.1 的极简 handler 基类（省得引外部依赖）。 */
    static abstract class Handler implements com.sun.net.httpserver.HttpHandler {
        protected static void respond(HttpExchange ex, int code, String json) throws IOException {
            byte[] b = json.getBytes(StandardCharsets.UTF_8);
            ex.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
            ex.sendResponseHeaders(code, b.length);
            OutputStream os = ex.getResponseBody();
            os.write(b);
            os.close();
        }
        protected static String readAll(HttpExchange ex) throws IOException {
            java.io.ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = ex.getRequestBody().read(buf)) > 0) bos.write(buf, 0, n);
            return new String(bos.toByteArray(), StandardCharsets.UTF_8);
        }
    }

    static class Task {
        static final java.util.concurrent.ConcurrentLinkedQueue<Task> QUEUE =
            new java.util.concurrent.ConcurrentLinkedQueue<Task>();
        final String action;
        final Map<String, String> params;
        final CountDownLatch latch = new CountDownLatch(1);
        volatile String result = "{}";
        volatile String error;
        Task(String action, Map<String, String> params) { this.action = action; this.params = params; }
    }

    // ───────────────────────── 手写 JSON（极简：扁平对象 / 字符串 / 数字 / 布尔） ─────────────────────────

    /** 把 \`{"action":"x","params":{"k":"v","n":1,"b":true}}\` 拍平成 k→v（数字/布尔按原样文本）。 */
    static Map<String, String> flatJson(String s) {
        Map<String, String> out = new LinkedHashMap<String, String>();
        if (s == null) return out;
        int i = 0;
        while (i < s.length()) {
            int k = s.indexOf('"', i);
            if (k < 0) break;
            int kEnd = s.indexOf('"', k + 1);
            if (kEnd < 0) break;
            String key = s.substring(k + 1, kEnd);
            int colon = s.indexOf(':', kEnd);
            if (colon < 0) break;
            int v = colon + 1;
            while (v < s.length() && Character.isWhitespace(s.charAt(v))) v++;
            if (v >= s.length()) break;
            char c = s.charAt(v);
            if (c == '"') {
                int e = v + 1;
                StringBuilder sb = new StringBuilder();
                while (e < s.length() && s.charAt(e) != '"') {
                    if (s.charAt(e) == '\\\\' && e + 1 < s.length()) { sb.append(s.charAt(e + 1)); e += 2; }
                    else { sb.append(s.charAt(e)); e++; }
                }
                out.put(key, sb.toString());
                i = e + 1;
            } else if (c == '{') {
                int depth = 0, e = v;
                for (; e < s.length(); e++) { if (s.charAt(e) == '{') depth++; else if (s.charAt(e) == '}') { depth--; if (depth == 0) { e++; break; } } }
                // 嵌套对象（params）：递归拍平，键名沿用内层
                out.putAll(flatJson(s.substring(v + 1, Math.max(v + 1, e - 1))));
                i = e;
            } else {
                int e = v;
                while (e < s.length() && ",}".indexOf(s.charAt(e)) < 0) e++;
                out.put(key, s.substring(v, e).trim());
                i = e;
            }
        }
        return out;
    }

    static int intParam(Map<String, String> p, String k) {
        String v = p.get(k);
        if (v == null) throw new IllegalArgumentException("缺参数 " + k);
        return (int) Math.floor(Double.parseDouble(v));
    }

    /** 只转义 \\\\ 与 " —— 够手写 JSON 用。 */
    static String esc(String s) {
        if (s == null) return "";
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '"' || c == '\\\\') b.append('\\\\').append(c);
            else if (c == '\\n') b.append("\\\\n");
            else if (c == '\\r') b.append("\\\\r");
            else b.append(c);
        }
        return b.toString();
    }

    /** 未用到但留着：URL 解码（将来支持 query 参数时用）。 */
    static String dec(String s) throws UnsupportedEncodingException { return URLDecoder.decode(s, "UTF-8"); }
}
`;
  // 逐版本字段名（`Minecraft` 的 player / world / 游戏目录）——**必须后替换**，别在模板里写死：
  //   1.12.2 = `player`/`world`/`gameDir`（真构件 javap 实证）；1.7.10–1.11.2 = `thePlayer`/`theWorld`/`mcDataDir`（javadoc，未编译验证）。
  return java
    .replaceAll("mc.thePlayer", "mc." + f.player)
    .replaceAll("mc.theWorld", "mc." + f.world)
    .replaceAll("mc.mcDataDir", "mc." + f.dataDir);
}

function mcmodInfo(modId: string, version: string): string {
  return JSON.stringify(
    [
      {
        modid: `${modId}_playtest_bridge`,
        name: `${modId} Playtest Bridge`,
        description: "最小游玩测试桥（playtest_bridge 协议；只绑 127.0.0.1）。测完即删。",
        version: "1.0.0",
        mcversion: version,
      },
    ],
    null,
    2,
  ) + "\n";
}

function readme(version: string, modId: string): string {
  return `# 最小游玩测试桥（forge ${version}）

> **测完必须撤除**：删掉本目录 + jar + \`run/mods\` 里的副本。证据只留在授权根内。

## 这是什么 / 为什么有它

\`playtest_bridge\` 那条路线此前只能靠第三方预编译件（BlackBoxPro，覆盖面 = fabric/neoforge 1.21.1 + 1.21.11、forge 1.12.2）。
**本档（forge ${version}）没有现成桥件** ⇒ 这份模板给一个**最小自建桥**：tick 钩子 + 内嵌 \`com.sun.net.httpserver\`，
协议与 \`playtest_bridge\` 一致，因此**工具面零改动**。

**隔离**：本模板**不在** \`PLAYTEST_VERIFIED_TIER\` 里、不参与 driver 派发 —— 桥是独立路线。

## 逐版本差异（都有实页出处，见仓库 \`forge/${version}/knowledge/common/verified-api.md\`）

| 项 | 本档取值 |
|---|---|
| \`@Mod\` / \`@SubscribeEvent\` / \`TickEvent\` 的包 | \`${version === "1.7.10" ? "cpw.mods.fml" : "net.minecraftforge.fml"}.common.*\` |
| 注册总线 | \`${version === "1.7.10" ? "FMLCommonHandler.instance().bus()（本档未 @Deprecated）" : "MinecraftForge.EVENT_BUS（本档 FMLCommonHandler.bus() 已 @Deprecated）"}\` |
| 读方块 | \`${version === "1.7.10" ? "World.getBlock(int,int,int) → Block" : "World.getBlockState(BlockPos) → IBlockState"}\` |
| 发聊天 | \`thePlayer.sendChatMessage(String)\`（${version === "1.7.10" ? "1.7.10 的实现在 EntityClientPlayerMP 上，1.8.9+ 在 EntityPlayerSP 上，方法同名" : "EntityPlayerSP 上"}） |
| 截图 | \`ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer)\`（返回值被忽略，规避 1.9.4 的返回类型改名） |

**⚠️ 字段名的置信度低于类名/方法名**：${facts(version).fieldNote}。

**刻意不读 \`TickEvent.Phase\`**：本档语料只给 \`valueOf\`/\`values\`、不给枚举常量名 ⇒ 本仓不背书；桥是**请求驱动**（HTTP 入队 → tick 出队），不读 phase 也完全正确。

## 怎么建 / 怎么装（**人在环：装 jar 前请先确认**）

- **forge 1.12.2**：丢进你会 Gradle 的 1.12.2 工程（或本仓 \`forge/1.12.2/scaffold\`）的 \`src/main/java/...\` + \`src/main/resources/mcmod.info\`，\`gradlew build\`。
- **1.7.10 / 1.8.9 / 1.9.4 / 1.10.2 / 1.11.2**：这些档**没有可用的本地 Gradle 载体**（本仓无 scaffold、构件不在盘）⇒ 需自备该档的 dev 环境（ForgeGradle 1.x/2.x 时代）手工 javac + 打 jar（含 \`mcmod.info\`）。**这一步本仓不代跑**。
- 装到**你自己**的实例（\`.minecraft/mods/\` 或实例的 mods 目录），客户端启动后日志应出现：
  \`[PT-BRIDGE] listening on 127.0.0.1:38081 (mc ${version})\`。

## 怎么用

\`\`\`bash
# 探活（桥无鉴权，只在本机用）
curl -s http://127.0.0.1:38081/status
# 查询玩家状态
curl -s -X POST http://127.0.0.1:38081/execute -d '{"action":"query_player_state"}'
# 发命令（会自动补前导 /）
curl -s -X POST http://127.0.0.1:38081/execute -d '{"action":"chat_command","params":{"command":"/time set day"}}'
# 读方块（1.7.10 只回 cls；1.8.9+ 另回 id 与 air）
curl -s -X POST http://127.0.0.1:38081/execute -d '{"action":"block_at","params":{"x":0,"y":64,"z":0}}'
# 截图（落到 <gameDir>/screenshots/）
curl -s -X POST http://127.0.0.1:38081/execute -d '{"action":"screenshot"}'
\`\`\`

MCP/CLI 侧用 \`playtest_bridge\`（同样只连 \`127.0.0.1\`）：\`status\` / \`execute\` / \`await\`。

## 边界（写清不吹）

- **动作只有 4 个**（\`query_player_state\` / \`chat_command\` / \`screenshot\` / \`block_at\`）—— 这是「最小」的定义。要移动/破坏/GUI，请加动作或改用有 driver 的档。
- **block_at 在 1.7.10 不给注册名**（该档语料里 \`blockRegistry\` 的取名方法无背书）⇒ 该档只能按**方块类简单名**断言，或在 1.7.10 上只做冒烟级。
- **超时语义**：客户端未在 tick（菜单/卡住）时 \`/execute\` 会 504 \`TIMEOUT\`；这**不等于**动作失败。
- **桥无鉴权**且绑定 \`127.0.0.1\` ⇒ 只本机、短会话；不要改绑公网。
- **不代用户接受 EULA**、**不代跑 Gradle**、**不代装 jar**（人在环）。
`;
}

export function generateBridgeMod(version: string, modId: string): { files: Record<string, string> } {
  const safeId = modId.replace(/[^A-Za-z0-9_]/g, "_");
  return {
    files: {
      [`playtest/bridge/BridgeMod.java`]: javaFor(version, modId),
      [`playtest/bridge/mcmod.info`]: mcmodInfo(safeId, version),
      [`playtest/bridge/README.bridge.md`]: readme(version, safeId),
    },
  };
}
