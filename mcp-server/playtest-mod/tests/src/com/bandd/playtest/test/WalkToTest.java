package com.bandd.playtest.test;

import com.bandd.playtest.core.Capabilities;
import com.bandd.playtest.core.DangerTable;
import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.GuiResult;
import com.bandd.playtest.core.Json;
import com.bandd.playtest.core.Pathfinder;
import com.bandd.playtest.core.PlaytestCore;
import com.bandd.playtest.core.WalkTo;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * **[T39] 安全移动（walk_to）+ A* 真寻路 + select_slot 服务端同步** 的离线判据。
 *
 * <p>**纯离线**：地图是几张固定小方块图（平地 / 一堵墙 / 一片岩浆 / 断崖 / 未加载区块），
 * 一个 {@code net.minecraft.*} 都不出现。真机验不出这些 —— 随机地形里没法断言
 * 「这条 7 格的路一定存在」。跑法（**显式绝对目录，禁用 os.tmpdir()**）：
 * <pre>
 *   java -Dbandd.test.dir=D:/mc-skill-temp/t39/testwork -cp out com.bandd.playtest.test.WalkToTest
 * </pre>
 *
 * <h3>负控（故意把判据放开 ⇒ 必须变红）</h3>
 * <ol>
 *   <li>把 {@link DangerTable#classify} 对岩浆的分类改成 PASSABLE ⇒ L3 必红；</li>
 *   <li>把 {@link Pathfinder} 的落差上限放开到 99 且不看 {@code allow:fall} ⇒ L4/L11 必红；</li>
 *   <li>把 {@link DangerTable#classify} 对 null（未知）的分类改成 PASSABLE ⇒ L5 必红。</li>
 * </ol>
 */
public final class WalkToTest {
    private static int pass = 0;
    private static int fail = 0;
    private static Path base;

    public static void main(String[] args) throws Exception {
        String dir = System.getProperty("bandd.test.dir", "D:/mc-skill-temp/t39/testwork");
        base = Paths.get(dir, "run-" + System.nanoTime());
        Files.createDirectories(base);

        sectionDangerTable();
        sectionFlat();
        sectionWall();
        sectionLava();
        sectionCliff();
        sectionUnloaded();
        sectionBudget();
        sectionPlanOnly();
        sectionDangerNoAllow();
        sectionBridge();
        sectionRetreat();
        sectionFallSmall();
        sectionParamFace();
        sectionTargetSafety();
        sectionSlotSync();
        sectionCapabilities();
        sectionFakeArrivalAndDisplacement();
        sectionWalkArbitration();
        sectionFeetLevelHazards();

        System.out.println();
        System.out.println("=== T39/T41 walk_to / A* / select_slot-sync tests: PASS=" + pass + " FAIL=" + fail + " ===");
        if (fail > 0) System.exit(1);
    }

    // ==================================================================
    // 地图（纯函数；不碰 MC、不读盘）
    // ==================================================================

    /**
     * 一块**可复算**的小地图。
     *
     * <p>本类与 {@link Pathfinder} 用**同一套格坐标约定**：{@code floorY} 是**脚所在的那一层**
     * （= 玩家站着的 y），实心地面在 {@code floorY - 1}。所以默认世界里站在 (x,64,z) 的玩家
     * 脚下是 (x,63,z)=stone、脚与头 (x,64,z)/(x,65,z) 都是空气 —— 正好满足 standable 的三条。
     * （这条一开始写错了：把 y=64 同时当地面又当脚，导致平地也判站不住。）
     */
    static class MapBridge implements GameBridge {
        final Map<String, String> special = new LinkedHashMap<String, String>();
        int floorY = 64;
        String fillAbove = "minecraft:air";
        String fillAt = "minecraft:air";
        final List<Integer> unloadedX = new ArrayList<Integer>();
        int blockAtCalls = 0;
        double px = 0.5, py = 64.0, pz = 0.5;
        double health = 20.0;
        Boolean onGround = Boolean.TRUE;
        double stepPerTick = 0.55;
        boolean canMove = true;
        double damagePerTick = 0.0;
        final List<String> drives = new ArrayList<String>();

        void put(int x, int y, int z, String id) {
            special.put(x + "," + y + "," + z, id);
        }

        @Override public String platform() { return "walkmap"; }
        @Override public String mcVersion() { return "test"; }
        @Override public boolean ready() { return true; }
        @Override public void tick() { }

        @Override public String blockAt(int x, int y, int z) {
            blockAtCalls++;
            if (unloadedX.contains(Integer.valueOf(x))) return null;
            String k = x + "," + y + "," + z;
            String s = special.get(k);
            if (s != null) return s;
            if (y < floorY) return "minecraft:stone";     // 地面
            if (y == floorY) return fillAt;               // 脚那一层
            return fillAbove;                             // 头及以上
        }

        @Override public int topSolidY(int x, int z) {
            if (unloadedX.contains(Integer.valueOf(x))) return Integer.MIN_VALUE;
            return floorY - 1;                            // 最高的**实心**方块
        }

        @Override public boolean stateMapCapable() { return true; }

        @Override public String playerStateJson() {
            Map<String, Object> m = new LinkedHashMap<String, Object>();
            m.put("present", Boolean.TRUE);
            m.put("name", "Walker");
            m.put("x", px);
            m.put("y", py);
            m.put("z", pz);
            m.put("health", health);
            m.put("onGround", onGround);
            m.put("yaw", 0.0);
            m.put("pitch", 0.0);
            return Json.of(m);
        }

        @Override public String screenName() { return null; }
        @Override public String screenshotPath() { return null; }
        @Override public String spawnBot(String n, double d) { return null; }
        @Override public void moveBotTo(double x, double y, double z) { }
        @Override public void tickBot() { }
        @Override public String giveBot(String i, int c) { return null; }
        @Override public boolean lookBot(double y, double p) { return false; }
        @Override public String breakBotBlock(double x, double y, double z) { return null; }
        @Override public String placeBotBlock(double x, double y, double z) { return null; }
        @Override public boolean setServerAuth(boolean o) { return false; }
        @Override public void joinServer(String a) { }
        @Override public void despawnBot() { }
        @Override public String openBotInventory() { return null; }
        @Override public List<String> drainChat() { return new ArrayList<String>(); }
        @Override public void openWorld(String w) { }
        @Override public void chatCommand(String c) { }
        @Override public boolean isPressed(String k) { return false; }
        @Override public void setPressed(String k, boolean d) { }
        @Override public List<String> supportedKeys() { return Arrays.asList("forward"); }

        @Override public boolean walkCapable() { return true; }
        @Override public Boolean playerOnGround() { return onGround; }

        float lastForward = 0, lastStrafe = 0, lastYaw = Float.NaN;
        boolean lastJump = false;
        int stopCalls = 0;

        @Override public boolean walkDrive(float forward, float strafe, boolean jump, float yaw) {
            lastForward = forward; lastStrafe = strafe; lastJump = jump; lastYaw = yaw;
            drives.add(forward + "/" + strafe + "/" + jump + "/" + Math.round(yaw));
            if (!canMove) return true;
            if (forward == 0 && strafe == 0) return true;
            double rad = Math.toRadians(yaw);
            double dx = -Math.sin(rad);
            double dz = Math.cos(rad);
            px += dx * stepPerTick;
            pz += dz * stepPerTick;
            if (damagePerTick > 0) health = Math.max(0, health - damagePerTick);
            return true;
        }

        @Override public void walkStop() { stopCalls++; lastForward = 0; lastStrafe = 0; }
    }

    // ==================================================================
    // L0. 危险表本身
    // ==================================================================

    private static void sectionDangerTable() {
        check("L0-1 岩浆 = LETHAL（不是「高代价」，是必死）",
                DangerTable.classify("minecraft:lava") == DangerTable.LETHAL
                        && DangerTable.isLethal(DangerTable.LETHAL));
        check("L0-2 水 = WATER（可游，有代价）",
                DangerTable.classify("minecraft:water") == DangerTable.WATER);
        check("L0-3 火 / 仙人掌 / 甜浆果 / 粉雪 / 岩浆块 / 凋零玫瑰 各自成类",
                DangerTable.classify("minecraft:fire") == DangerTable.FIRE
                        && DangerTable.classify("minecraft:cactus") == DangerTable.CACTUS
                        && DangerTable.classify("minecraft:sweet_berry_bush") == DangerTable.SWEET_BERRY
                        && DangerTable.classify("minecraft:powder_snow") == DangerTable.POWDER_SNOW
                        && DangerTable.classify("minecraft:magma_block") == DangerTable.MAGMA
                        && DangerTable.classify("minecraft:wither_rose") == DangerTable.WITHER_ROSE);
        check("L0-4 未知（null / 认不出的 id）⇒ 未知格 / 保守实心，绝不可通行",
                DangerTable.classify(null) == DangerTable.UNKNOWN
                        && DangerTable.classify("") == DangerTable.UNKNOWN
                        && DangerTable.classify("some_mod:troll_block") == DangerTable.SOLID);
        check("L0-5 空气 / 草 / 火把 = PASSABLE；带方块状态后缀也认",
                DangerTable.classify("minecraft:air") == DangerTable.PASSABLE
                        && DangerTable.classify("minecraft:short_grass") == DangerTable.PASSABLE
                        && DangerTable.classify("minecraft:torch") == DangerTable.PASSABLE
                        && DangerTable.classify("minecraft:water[level=0]") == DangerTable.WATER);
        check("L0-6 落差 1..3 格 = 零伤害（原版从 4 格起才算）",
                DangerTable.fallDamage(1) == 0 && DangerTable.fallDamage(2) == 0
                        && DangerTable.fallDamage(3) == 0);
        check("L0-7 落差 4 格 = 1 点、10 格 = 7 点、23 格 = 20 点（ceil((h-3)*1)）",
                DangerTable.fallDamage(4) == 1 && DangerTable.fallDamage(10) == 7
                        && DangerTable.fallDamage(23) == 20);
        check("L0-8 岩浆不给伤害估算（必死不是掉多少血），其余危险都给正数",
                DangerTable.hazardDamagePerStep(DangerTable.LETHAL) == 0
                        && DangerTable.hazardDamagePerStep(DangerTable.FIRE) > 0
                        && DangerTable.hazardDamagePerStep(DangerTable.CACTUS) > 0);
        check("L0-9 逐类许可名齐备；岩浆没有许可名",
                Pathfinder.ALLOW_KINDS.containsAll(Arrays.asList("water", "fall", "fire", "cactus",
                        "sweetBerry", "powderSnow", "bridge", "dig", "probe"))
                        && DangerTable.allowName(DangerTable.LETHAL) == null);
    }

    // ==================================================================
    // L1. 平地
    // ==================================================================

    private static void sectionFlat() {
        MapBridge m = new MapBridge();
        Pathfinder.World w = new Pathfinder.World(m);
        Pathfinder.Config cfg = new Pathfinder.Config();
        Pathfinder.Result r = Pathfinder.plan(w, cfg, 0, 64, 0, 8, 64, 0);
        check("L1-1 平地 8 格：找得到路、9 个路点、长度约 8",
                r.found && r.path.size() == 9 && Math.abs(r.length - 8.0) < 0.01);
        check("L1-2 平地：0 处危险、0 估算伤害、stopReason=REACHED",
                r.dangers.isEmpty() && r.estimatedDamage == 0.0
                        && Pathfinder.REACHED.equals(r.stopReason));
        check("L1-3 平地：起点是路径第一个点、终点是最后一个",
                r.path.get(0).x == 0 && r.path.get(0).z == 0
                        && r.path.get(r.path.size() - 1).x == 8);
        Pathfinder.Result air = Pathfinder.plan(w, cfg, 0, 64, 0, 8, 200, 0);
        check("L1-4 目标在空中（y=200，站不住）⇒ 找不到，绝不假装到得了",
                !air.found && !Pathfinder.REACHED.equals(air.stopReason));
    }

    // ==================================================================
    // L2. 一堵墙
    // ==================================================================

    private static void sectionWall() {
        MapBridge m = new MapBridge();
        for (int z = -3; z <= 3; z++) {
            for (int y = 64; y <= 66; y++) m.put(4, y, z, "minecraft:stone");
        }
        Pathfinder.World w = new Pathfinder.World(m);
        Pathfinder.Config cfg = new Pathfinder.Config();
        Pathfinder.Result r = Pathfinder.plan(w, cfg, 0, 64, 0, 8, 64, 0);
        boolean avoidsWall = true;
        for (Pathfinder.Cell c : r.path) {
            if (c.x == 4 && c.z >= -3 && c.z <= 3) avoidsWall = false;
        }
        check("L2-1 一堵墙挡在中间 ⇒ 仍找得到路（绕过去）", r.found);
        check("L2-2 绕墙的路一格都没穿墙（x=4 且 z in [-3,3] 的实心格一个都没踩）", avoidsWall);
        check("L2-3 绕墙的路比直线长（>8 格），且 0 处危险",
                r.length > 8.0 && r.dangers.isEmpty());

        // 把起点**单独**砌进一个 3x3 的封闭盒子（墙 3 格高 = 跳不过去），目标在盒子外
        MapBridge box = new MapBridge();
        for (int x = -2; x <= 2; x++) {
            for (int z = -2; z <= 2; z++) {
                boolean edge = (Math.abs(x) == 2 || Math.abs(z) == 2);
                if (edge) for (int y = 64; y <= 66; y++) box.put(x, y, z, "minecraft:stone");
            }
        }
        Pathfinder.Result blocked = Pathfinder.plan(new Pathfinder.World(box), cfg, 0, 64, 0, 8, 64, 8);
        check("L2-4 起点被 3 格高墙彻底围死 ⇒ BLOCKED（不是 REACHED、也不是 BUDGET）",
                !blocked.found && Pathfinder.BLOCKED.equals(blocked.stopReason));
    }

    // ==================================================================
    // L3. 一片岩浆：绝不穿
    // ==================================================================

    private static void sectionLava() {
        MapBridge m = new MapBridge();
        // 岩浆沟必须**横穿整个搜索窗口**，否则 A* 会合法地绕过去（那就测不到"不穿岩浆"了）。
        // 默认 windowRadius=64 ⇒ 窗口 z ∈ [-64, 72]，这里铺 -200..200 保证绕不过。
        for (int z = -200; z <= 200; z++) m.put(4, 63, z, "minecraft:lava");
        Pathfinder.World w = new Pathfinder.World(m);
        Pathfinder.Config cfg = new Pathfinder.Config();
        Pathfinder.Result r = Pathfinder.plan(w, cfg, 0, 64, 0, 8, 64, 0);
        check("L3-1 中间一条横贯窗口的岩浆沟、无 bridge 许可 ⇒ 到不了（不假装能过）", !r.found);
        // **语义要点**：岩浆是"必死"，不是"有代价的风险" ⇒ 它【没有】许可名，
        // 所以放开全部危险许可也过不去 —— 正确理由是 BLOCKED（只能 bridge/dig，见 L9）。
        check("L3-2 到不了的理由是 BLOCKED（岩浆**永不**因许可而可通行）",
                Pathfinder.BLOCKED.equals(r.stopReason));
        check("L3-3 岩浆没有许可名 ⇒ needAllow 里不会出现它（放了也没用）",
                !r.needAllow.contains("lava") && DangerTable.allowName(DangerTable.LETHAL) == null);
        check("L3-4 不可行时 path 是空的（没有算了一条穿岩浆的路这种事）", r.path.isEmpty());
        check("L3-5 负控①判据：只要 classify(lava) 不是 LETHAL，这张图就会被判成可通行",
                DangerTable.classify("minecraft:lava") == DangerTable.LETHAL);

        // 真正"有代价但有许可"的危险：火（不是必死）—— 这条才走 DANGER 那条路
        MapBridge fire = new MapBridge();
        for (int z = -200; z <= 200; z++) fire.put(4, 63, z, "minecraft:fire");
        Pathfinder.Result fr = Pathfinder.plan(new Pathfinder.World(fire),
                new Pathfinder.Config(), 0, 64, 0, 8, 64, 0);
        check("L3-6 火沟（有许可品类）+ 无许可 ⇒ stopReason=DANGER（不是 BLOCKED）",
                !fr.found && Pathfinder.DANGER.equals(fr.stopReason));
        check("L3-7 DANGER 回执给足决策依据：dangerKind=fire + dangerAt 有坐标",
                "fire".equals(fr.dangerKind) && fr.dangerAt != null);
        check("L3-8 DANGER 回执给出敢走要付多少：riskRouteLength/riskRouteDangerCount/风险伤害",
                fr.riskRouteLen != null && fr.riskRouteDangerCount != null
                        && fr.riskRouteDangerCount.intValue() >= 1 && fr.riskRouteDamage != null
                        && fr.riskRouteDamage.doubleValue() > 0);
        check("L3-9 缺的许可如实列在 needAllow 里（这里应该是 fire）",
                fr.needAllow.contains("fire"));
        check("L3-10 不可行时 path 为空（不移动）", fr.path.isEmpty());

        // 给了 fire 许可 ⇒ 真过得去，且如实记危险格与估算伤害
        Pathfinder.Config fireOk = new Pathfinder.Config();
        fireOk.allow.add("fire");
        Pathfinder.Result fr2 = Pathfinder.plan(new Pathfinder.World(fire), fireOk, 0, 64, 0, 8, 64, 0);
        check("L3-11 给了 allow:[fire] ⇒ 过得去，且 dangers 里如实列出火格",
                fr2.found && fr2.dangers.size() >= 1 && fr2.estimatedDamage > 0);
        check("L3-12 火格的 dangerKind 是 fire（回执可逐格核对）",
                "fire".equals(fr2.dangers.get(0).kindName()));
    }

    // ==================================================================
    // L4. 断崖
    // ==================================================================

    private static void sectionCliff() {
        MapBridge m = new MapBridge();
        for (int x = 4; x <= 12; x++) {
            for (int z = -6; z <= 6; z++) {
                for (int y = 58; y < 64; y++) m.put(x, y, z, "minecraft:air");
                m.put(x, 57, z, "minecraft:stone");
            }
        }
        Pathfinder.World w = new Pathfinder.World(m);
        Pathfinder.Config cfg = new Pathfinder.Config();
        Pathfinder.Result r = Pathfinder.plan(w, cfg, 0, 64, 0, 8, 58, 0);
        check("L4-1 6 格断崖、无 fall 许可 ⇒ 到不了（默认只允许 3 格以内）", !r.found);
        boolean noDrop = r.path.isEmpty();
        check("L4-2 不可行时 path 为空（没有悄悄跳下去的路）", noDrop);

        Pathfinder.Config jump = new Pathfinder.Config();
        jump.allow.add("fall");
        jump.maxFall = 8;
        Pathfinder.Result r2 = Pathfinder.plan(new Pathfinder.World(m), jump, 0, 64, 0, 8, 58, 0);
        check("L4-3 给了 allow:[fall]+maxFall=8 ⇒ 过得去（许可真的生效）", r2.found);
        check("L4-4 过崖的估算伤害 = 3 点（ceil((6-3)*1)，按原版公式）",
                r2.found && Math.abs(r2.estimatedDamage - 3.0) < 0.001);
        check("L4-5 负控②判据：默认 maxFall 就是 3（4 格起才有伤害的上界）",
                new Pathfinder.Config().maxFall == 3 && Pathfinder.DEFAULT_MAX_FALL == 3);

        MapBridge small = new MapBridge();
        for (int x = 4; x <= 10; x++) {
            for (int z = -4; z <= 4; z++) {
                for (int y = 61; y < 64; y++) small.put(x, y, z, "minecraft:air");
                small.put(x, 60, z, "minecraft:stone");
            }
        }
        Pathfinder.Result r3 = Pathfinder.plan(new Pathfinder.World(small),
                new Pathfinder.Config(), 0, 64, 0, 8, 61, 0);
        check("L4-6 3 格落差默认可过（1..3 格落地零伤害 ⇒ 不该要许可）", r3.found);
        check("L4-7 3 格落差估算伤害 = 0（原版从 4 格起算）",
                r3.found && r3.estimatedDamage == 0.0);
    }

    // ==================================================================
    // L5. 未加载区块
    // ==================================================================

    private static void sectionUnloaded() {
        MapBridge m = new MapBridge();
        for (int x = 4; x <= 20; x++) m.unloadedX.add(Integer.valueOf(x));
        Pathfinder.World w = new Pathfinder.World(m);
        Pathfinder.Config cfg = new Pathfinder.Config();
        Pathfinder.Result r = Pathfinder.plan(w, cfg, 0, 64, 0, 10, 64, 0);
        check("L5-1 目标在未加载区块里 ⇒ 到不了（不假设可走）", !r.found);
        check("L5-2 不可行时路径为空（没有按空气走进去这种事）", r.path.isEmpty());
        check("L5-3 负控③判据：未知格分类是 UNKNOWN、且 standable 明确拒绝它",
                DangerTable.classify(null) == DangerTable.UNKNOWN
                        && !Pathfinder.standable(w, 10, 64, 0));
        Pathfinder.Result bad = Pathfinder.plan(w, cfg, 10, 64, 0, 12, 64, 0);
        check("L5-4 起点在未加载区 ⇒ NOT_IN_WORLD（不猜起点）",
                !bad.found && Pathfinder.NOT_IN_WORLD.equals(bad.stopReason));
    }

    // ==================================================================
    // L6. 搜索预算
    // ==================================================================

    private static void sectionBudget() {
        MapBridge m = new MapBridge();
        Pathfinder.World w = new Pathfinder.World(m);
        Pathfinder.Config cfg = new Pathfinder.Config();
        cfg.maxNodes = 8;
        Pathfinder.Result r = Pathfinder.plan(w, cfg, 0, 64, 0, 200, 64, 0);
        check("L6-1 预算耗尽 ⇒ 报 BUDGET（不是到不了）",
                !r.found && Pathfinder.BUDGET.equals(r.stopReason));
        check("L6-2 BUDGET 的人话明说是没搜完，不是到不了",
                r.note != null && r.note.contains("没搜完"));
        check("L6-3 预算耗尽时绝不报 reached（found 必须 false）", !r.found);

        Pathfinder.Config c2 = new Pathfinder.Config();
        c2.maxMillis = 1;
        Pathfinder.Result r2 = Pathfinder.plan(new Pathfinder.World(m), c2, 0, 64, 0, 500, 64, 0);
        check("L6-4 maxMillis 也生效：极小时报 BUDGET 或 BLOCKED（不是静默返回到达）",
                !r2.found && (Pathfinder.BUDGET.equals(r2.stopReason) || Pathfinder.BLOCKED.equals(r2.stopReason)));

        Pathfinder.Result r3 = Pathfinder.plan(new Pathfinder.World(m), new Pathfinder.Config(),
                0, 64, 0, 200, 64, 0);
        check("L6-5 同样的图、默认预算 ⇒ 走得到（证明 L6-1 的失败只因为预算）", r3.found);
    }

    // ==================================================================
    // L7. plan_only
    // ==================================================================

    private static void sectionPlanOnly() {
        MapBridge m = new MapBridge();
        PlaytestCore core = new PlaytestCore(m, evDir("plan"), "tok");
        double x0 = m.px, z0 = m.pz;
        Map<String, Object> res = core.dispatch("walk_to",
                params("x", Integer.valueOf(8), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                        "plan_only", Boolean.TRUE));
        Map<String, Object> d = data(res);
        check("L7-1 plan_only 成功 + planOnly=true + stopReason=PLANNED",
                isOk(res) && Boolean.TRUE.equals(d.get("planOnly"))
                        && Pathfinder.PLANNED.equals(d.get("stopReason")));
        check("L7-2 plan_only 的 reached 恒 false（没走就是没到）",
                Boolean.FALSE.equals(d.get("reached")) && Boolean.FALSE.equals(d.get("moved")));
        check("L7-3 plan_only 玩家一格都没动（px/pz 与调用前逐字相同）",
                m.px == x0 && m.pz == z0);
        check("L7-4 plan_only 的 walkDrive 一次都没被调（连输入都没写）",
                m.drives.isEmpty() && m.lastForward == 0);
        check("L7-5 plan_only 给路线长度 / 路点数 / 预算读数",
                d.get("routeLength") != null && d.get("waypointCount") != null
                        && d.get("nodesExpanded") != null);
        check("L7-6 plan_only 的 damageTaken 恒 0 + accountingNote 明说没移动任何人",
                Double.valueOf(0).equals(d.get("damageTaken"))
                        && String.valueOf(d.get("accountingNote")).contains("没有移动"));
        check("L7-7 plan_only 的 ticks 恒 0", Integer.valueOf(0).equals(d.get("ticks")));

        // ---- plan_only 在"要付代价"的图上：把代价全算出来，但**一步都不走** ----
        // 用**火**而不是岩浆：火是"有许可品类"（真能开），岩浆是必死（根本没许可可开）。
        MapBridge fire = new MapBridge();
        for (int z = -200; z <= 200; z++) fire.put(4, 63, z, "minecraft:fire");
        PlaytestCore fc = new PlaytestCore(fire, evDir("plan2"), "tok");
        double fx0 = fire.px;
        Map<String, Object> fr = fc.dispatch("walk_to",
                params("x", Integer.valueOf(8), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                        "plan_only", Boolean.TRUE));
        Map<String, Object> fd = data(fr);
        check("L7-8 plan_only 在火沟上：报出过不去 + 敢走的代价，且不移动",
                isOk(fr) && Boolean.FALSE.equals(fd.get("planFound"))
                        && fd.get("planStopReason") != null && fire.px == fx0);
        check("L7-9 plan_only 报 riskRouteLength/riskRouteDangerCount/riskRouteDamage + needAllow 含 fire",
                fd.get("riskRouteLength") != null && fd.get("riskRouteDangerCount") != null
                        && fd.get("riskRouteDamage") != null
                        && strList(fd.get("needAllow")).contains("fire"));
        check("L7-10 plan_only **walkDrive 一次都没被调** + ticks 恒 0（只算路不动人）",
                fire.drives.isEmpty() && Integer.valueOf(0).equals(fd.get("ticks")));

        // 岩浆沟 + allow:[bridge]：plan_only 能算出搭桥路线（bridge 是**能力**，不是风险许可）
        MapBridge lava = new MapBridge();
        for (int z = -200; z <= 200; z++) lava.put(4, 63, z, "minecraft:lava");
        PlaytestCore lc = new PlaytestCore(lava, evDir("plan3"), "tok");
        double lx = lava.px;
        Map<String, Object> lr = lc.dispatch("walk_to",
                params("x", Integer.valueOf(8), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                        "plan_only", Boolean.TRUE, "allow", Arrays.asList("water", "bridge")));
        Map<String, Object> ld = data(lr);
        check("L7-11 plan_only + allow:[bridge] 能算出跨岩浆的搭桥路线（routeLength 有值）",
                isOk(lr) && Boolean.TRUE.equals(ld.get("planFound"))
                        && ld.get("routeLength") != null && lava.px == lx && lava.drives.isEmpty());
    }

    // ==================================================================
    // L8. 无许可遇岩浆 ⇒ DANGER 且不前进
    // ==================================================================

    private static void sectionDangerNoAllow() {
        MapBridge m = new MapBridge();
        for (int z = -200; z <= 200; z++) m.put(4, 63, z, "minecraft:lava");
        PlaytestCore core = new PlaytestCore(m, evDir("dang"), "tok");
        double x0 = m.px;
        Map<String, Object> res = core.dispatch("walk_to",
                params("x", Integer.valueOf(8), "y", Integer.valueOf(64), "z", Integer.valueOf(0)));
        check("L8-1 无许可遇岩浆 ⇒ WALK_BLOCKED（core 的错误码）",
                "failed".equals(res.get("status")) && WalkTo.WALK_BLOCKED.equals(res.get("code")));
        // 岩浆**没有**许可名（必死不是风险）⇒ 这里的 stopReason 是 BLOCKED，不是 DANGER。
        // 换成人能许可的火沟，才是 DANGER 那条路（见 L3-6..L3-10 与 L8-7 之后的火沟用例）。
        check("L8-2 岩浆沟：stopReason=BLOCKED（岩浆永不因许可而可通行）",
                Pathfinder.BLOCKED.equals(res.get("stopReason")));
        check("L8-3 玩家一格都没动（moved=false 且 px 未变）",
                Boolean.FALSE.equals(res.get("moved")) && m.px == x0);
        check("L8-4 walkDrive 一次都没被调（连输入都没写）", m.drives.isEmpty());

        // ---- 有许可品类（火）+ 无许可 ⇒ DANGER，且把"敢走要付多少"逐项报出来 ----
        MapBridge fire = new MapBridge();
        for (int z = -200; z <= 200; z++) fire.put(4, 63, z, "minecraft:fire");
        PlaytestCore fc = new PlaytestCore(fire, evDir("dang2"), "tok");
        double fx0 = fire.px;
        Map<String, Object> fr = fc.dispatch("walk_to",
                params("x", Integer.valueOf(8), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                        "allow", Arrays.asList("water")));
        check("L8-5 火沟无 fire 许可 ⇒ WALK_BLOCKED + stopReason=DANGER",
                "failed".equals(fr.get("status")) && WalkTo.WALK_BLOCKED.equals(fr.get("code"))
                        && Pathfinder.DANGER.equals(fr.get("stopReason")));
        check("L8-6 DANGER 回执给 dangerKind=fire + dangerAt 坐标",
                "fire".equals(fr.get("dangerKind")) && fr.get("dangerAt") != null);
        check("L8-7 DANGER 回执给 detourAvailable + safeRouteLength/safeRouteDangerCount",
                fr.containsKey("detourAvailable") && fr.containsKey("safeRouteLength")
                        && fr.containsKey("safeRouteDangerCount"));
        check("L8-8 DANGER 回执给 riskRouteLength/riskRouteDangerCount/riskRouteDamage",
                fr.get("riskRouteLength") != null && fr.get("riskRouteDangerCount") != null
                        && fr.get("riskRouteDamage") != null);
        check("L8-9 DANGER 时玩家一格都没动 + walkDrive 没被调",
                Boolean.FALSE.equals(fr.get("moved")) && fire.px == fx0 && fire.drives.isEmpty());

        // ---- allow:[fire] ⇒ 真敢走，并如实记账（掉血 / 危险 tick）----
        MapBridge fire2 = new MapBridge();
        for (int z = -200; z <= 200; z++) fire2.put(4, 63, z, "minecraft:fire");
        PlaytestCore fc2 = new PlaytestCore(fire2, evDir("dang3"), "tok");
        Map<String, Object> okRes = runQueued(fc2, params(
                "x", Integer.valueOf(8), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "allow", Arrays.asList("water", "fire"), "maxTicks", Integer.valueOf(300)));
        check("L8-10 给了 allow:[fire] ⇒ 真的走过去了（reached=true）",
                isOk(okRes) && Boolean.TRUE.equals(data(okRes).get("reached")));
        check("L8-11 过去也不算白过：危险格数与估算伤害如实记在回执里",
                data(okRes).get("dangerCount") instanceof Number
                        && ((Number) data(okRes).get("dangerCount")).intValue() >= 1
                        && num(data(okRes).get("estimatedDamage")) > 0);
        check("L8-12 ticksInDanger 如实（>0，因为确实踩在火里）",
                data(okRes).get("ticksInDanger") instanceof Number
                        && ((Number) data(okRes).get("ticksInDanger")).intValue() > 0);
    }

    // ==================================================================
    // L9. allow:bridge ⇒ 真搭桥且记录 usedBridges
    // ==================================================================

    private static void sectionBridge() {
        MapBridge m = new MapBridge();
        for (int z = -200; z <= 200; z++) m.put(4, 63, z, "minecraft:lava");
        Pathfinder.World w = new Pathfinder.World(m);
        Pathfinder.Config cfg = new Pathfinder.Config();
        cfg.allow.add("bridge");
        Pathfinder.Result r = Pathfinder.plan(w, cfg, 0, 64, 0, 8, 64, 0);
        check("L9-1 给 allow:[bridge] ⇒ 找得到跨岩浆的路", r.found);
        check("L9-2 回执如实记 usedBridges >= 1（真搭了，不是闷头过去）", r.usedBridges >= 1);
        boolean noLavaStep = true;
        for (Pathfinder.Cell c : r.path) {
            if (DangerTable.classify(c.block) == DangerTable.LETHAL) noLavaStep = false;
        }
        check("L9-3 搭桥路线踩的仍然是空气（桥面），没有一格是岩浆", noLavaStep);

        MapBridge m2 = new MapBridge();
        for (int z = -200; z <= 200; z++) m2.put(4, 63, z, "minecraft:lava");
        PlaytestCore core = new PlaytestCore(m2, evDir("bridge"), "tok");
        Map<String, Object> res = runQueued(core, params("x", Integer.valueOf(8), "y", Integer.valueOf(64),
                "z", Integer.valueOf(0), "allow", Arrays.asList("water", "bridge"), "maxTicks", Integer.valueOf(200)));
        check("L9-4 真走完：reached=true + stopReason=REACHED",
                isOk(res) && Boolean.TRUE.equals(data(res).get("reached"))
                        && Pathfinder.REACHED.equals(data(res).get("stopReason")));
        check("L9-5 回执 usedBridges 如实（>=1，来自路线里的搭桥步）",
                data(res).get("usedBridges") instanceof Number
                        && ((Number) data(res).get("usedBridges")).intValue() >= 1);
        check("L9-6 走到之后 walkStop 被调用（不许松手后还在走）", m2.stopCalls >= 1);
    }

    // ==================================================================
    // L10. hp 跌破 minHp ⇒ 撤回
    // ==================================================================

    private static void sectionRetreat() {
        MapBridge m = new MapBridge();
        m.damagePerTick = 1.5;
        m.health = 14.0;
        PlaytestCore core = new PlaytestCore(m, evDir("retreat"), "tok");
        Map<String, Object> res = runQueued(core, params(
                "x", Integer.valueOf(40), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "minHp", Double.valueOf(10), "maxTicks", Integer.valueOf(400)));
        Map<String, Object> d = data(res);
        check("L10-1 血量跌破 minHp=10 ⇒ stopReason=DANGER_RETREAT",
                isOk(res) && Pathfinder.DANGER_RETREAT.equals(d.get("stopReason")));
        check("L10-2 reached=false（撤回了就不是到达）",
                Boolean.FALSE.equals(d.get("reached")));
        check("L10-3 血账如实：hpBefore=14、hpAfter<10、damageTaken>0",
                num(d.get("hpBefore")) == 14.0 && num(d.get("hpAfter")) < 10.0
                        && num(d.get("damageTaken")) > 0);
        check("L10-4 hpAfter 与 damageTaken 自洽（hpBefore - damageTaken == hpAfter）",
                Math.abs((num(d.get("hpBefore")) - num(d.get("damageTaken"))) - num(d.get("hpAfter"))) < 0.01);
        check("L10-5 撤回时 walkStop 被调用（先停手）", m.stopCalls >= 1);
        check("L10-6 note 明说是主动撤回（不许写成过去了就算成功）",
                String.valueOf(d.get("note")).contains("主动撤回"));

        MapBridge m2 = new MapBridge();
        m2.damagePerTick = 0.0;
        m2.health = 20.0;
        PlaytestCore c2 = new PlaytestCore(m2, evDir("retreat2"), "tok");
        Map<String, Object> res2 = runQueued(c2, params(
                "x", Integer.valueOf(40), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "minHp", Double.valueOf(0), "maxTicks", Integer.valueOf(400)));
        check("L10-7 对照：不掉血 + minHp=0 ⇒ 不撤回，正常到达（撤回确实由血量触发）",
                isOk(res2) && Pathfinder.REACHED.equals(data(res2).get("stopReason")));
    }

    // ==================================================================
    // L11. <=3 格落差默认可通过
    // ==================================================================

    private static void sectionFallSmall() {
        MapBridge m = new MapBridge();
        for (int x = 4; x <= 12; x++) {
            for (int z = -4; z <= 4; z++) {
                for (int y = 61; y < 64; y++) m.put(x, y, z, "minecraft:air");
                m.put(x, 60, z, "minecraft:stone");
            }
        }
        Pathfinder.World w = new Pathfinder.World(m);
        Pathfinder.Result r = Pathfinder.plan(w, new Pathfinder.Config(), 0, 64, 0, 8, 61, 0);
        check("L11-1 3 格落差默认可通过（不需要 allow:[fall]）", r.found);
        check("L11-2 3 格落差的估算伤害 = 0（原版零伤害区）", r.estimatedDamage == 0.0);

        MapBridge m4 = new MapBridge();
        for (int x = 4; x <= 12; x++) {
            for (int z = -4; z <= 4; z++) {
                for (int y = 60; y < 64; y++) m4.put(x, y, z, "minecraft:air");
                m4.put(x, 59, z, "minecraft:stone");
            }
        }
        Pathfinder.Result r4 = Pathfinder.plan(new Pathfinder.World(m4),
                new Pathfinder.Config(), 0, 64, 0, 8, 60, 0);
        check("L11-3 负控④ 4 格落差默认过不去（伤害从 4 格起算，要 fall 许可）", !r4.found);
        check("L11-4 4 格落差的估算伤害 = 1（ceil((4-3)*1)）",
                DangerTable.fallDamage(4) == 1.0);
    }

    // ==================================================================
    // L12. 参数面
    // ==================================================================

    private static void sectionParamFace() {
        MapBridge m = new MapBridge();
        PlaytestCore core = new PlaytestCore(m, evDir("param"), "tok");
        check("L12-1 缺 x/y/z 任一 ⇒ MISSING_REQUIRED_PARAM",
                "MISSING_REQUIRED_PARAM".equals(
                        core.dispatch("walk_to", params("y", Integer.valueOf(64))).get("code"))
                        && "MISSING_REQUIRED_PARAM".equals(
                                core.dispatch("walk_to", params()).get("code")));
        check("L12-2 x=1.5（非整）⇒ BAD_REQUEST（不静默 floor）",
                "BAD_REQUEST".equals(core.dispatch("walk_to",
                        params("x", 1.5, "y", Integer.valueOf(64), "z", Integer.valueOf(0))).get("code")));
        check("L12-3 tolerance=-1 ⇒ BAD_REQUEST",
                "BAD_REQUEST".equals(core.dispatch("walk_to", params(
                        "x", Integer.valueOf(2), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                        "tolerance", Integer.valueOf(-1))).get("code")));
        check("L12-4 maxTicks=0 ⇒ BAD_REQUEST",
                "BAD_REQUEST".equals(core.dispatch("walk_to", params(
                        "x", Integer.valueOf(2), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                        "maxTicks", Integer.valueOf(0))).get("code")));
        check("L12-5 allow 里拼错一个许可名 ⇒ BAD_REQUEST（免得以为给了其实没给）",
                "BAD_REQUEST".equals(core.dispatch("walk_to", params(
                        "x", Integer.valueOf(2), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                        "allow", Arrays.asList("lava"))).get("code")));
        check("L12-6 maxFall>3 但没给 allow:[fall] ⇒ BAD_REQUEST（要你签字）",
                "BAD_REQUEST".equals(core.dispatch("walk_to", params(
                        "x", Integer.valueOf(2), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                        "maxFall", Integer.valueOf(8))).get("code")));
        check("L12-7 给了 allow:[fall] 再给 maxFall=8 ⇒ 参数面通过（不报 BAD_REQUEST）",
                !"BAD_REQUEST".equals(core.dispatch("walk_to", params(
                        "x", Integer.valueOf(2), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                        "maxFall", Integer.valueOf(8), "allow", Arrays.asList("water", "fall"),
                        "plan_only", Boolean.TRUE)).get("code")));
        FakeBridge plain = new FakeBridge();
        Map<String, Object> r = new PlaytestCore(plain, evDir("param2"), "tok")
                .dispatch("walk_to", params("x", Integer.valueOf(2), "y", Integer.valueOf(64), "z", Integer.valueOf(0)));
        check("L12-8 未实现的档 ⇒ WALK_UNSUPPORTED（不假装会走）",
                WalkTo.UNSUPPORTED.equals(r.get("code")));
    }

    // ==================================================================
    // L13. 目标格的安全前置
    // ==================================================================

    private static void sectionTargetSafety() {
        MapBridge m = new MapBridge();
        m.put(5, 64, 0, "minecraft:stone");
        PlaytestCore core = new PlaytestCore(m, evDir("tgt"), "tok");
        double x0 = m.px;
        Map<String, Object> r = core.dispatch("walk_to",
                params("x", Integer.valueOf(5), "y", Integer.valueOf(64), "z", Integer.valueOf(0)));
        check("L13-1 目标格是实心 ⇒ WALK_BLOCKED（不移动，防窒息）",
                WalkTo.WALK_BLOCKED.equals(r.get("code")) && Boolean.FALSE.equals(r.get("moved")));
        check("L13-2 回执逐项给出目标三格的实测类别（feet/head/floor）",
                r.get("targetFeet") != null && r.get("targetHead") != null && r.get("targetFloor") != null);
        check("L13-3 玩家一格都没动 + walkDrive 没被调", m.px == x0 && m.drives.isEmpty());

        MapBridge m2 = new MapBridge();
        for (int y = 50; y <= 66; y++) m2.put(5, y, 0, "minecraft:air");
        PlaytestCore c2 = new PlaytestCore(m2, evDir("tgt2"), "tok");
        Map<String, Object> r2 = c2.dispatch("walk_to",
                params("x", Integer.valueOf(5), "y", Integer.valueOf(64), "z", Integer.valueOf(0)));
        check("L13-4 目标脚下没有实心 => WALK_BLOCKED（防摔）",
                WalkTo.WALK_BLOCKED.equals(r2.get("code")));

        MapBridge m3 = new MapBridge();
        m3.put(5, 65, 0, "minecraft:stone");
        PlaytestCore c3 = new PlaytestCore(m3, evDir("tgt3"), "tok");
        Map<String, Object> r3 = c3.dispatch("walk_to",
                params("x", Integer.valueOf(5), "y", Integer.valueOf(64), "z", Integer.valueOf(0)));
        check("L13-5 目标头顶被堵 ⇒ WALK_BLOCKED（防窒息：头顶必须留 2 格）",
                WalkTo.WALK_BLOCKED.equals(r3.get("code")));
    }

    // ==================================================================
    // L14. select_slot 的服务端同步
    // ==================================================================

    private static void sectionSlotSync() {
        SyncBridge sb = new SyncBridge();
        PlaytestCore core = new PlaytestCore(sb, evDir("slot"), "tok");
        Map<String, Object> r = core.dispatch("select_slot", params("slot", Integer.valueOf(1)));
        Map<String, Object> d = data(r);
        check("L14-1 有同步能力的档：serverSynced=true + packetSent=true + packetClass 实名",
                isOk(r) && Boolean.TRUE.equals(d.get("serverSynced"))
                        && Boolean.TRUE.equals(d.get("packetSent"))
                        && "ServerboundSetCarriedItemPacket".equals(d.get("packetClass")));
        check("L14-2 适配层真的被调了（syncedCalls=1，slot=1）",
                sb.syncedCalls == 1 && sb.lastSyncedSlot == 1);
        check("L14-3 clientConsistent=true + 旧键 consistent 同值（不破坏既有断言）",
                Boolean.TRUE.equals(d.get("clientConsistent"))
                        && Boolean.TRUE.equals(d.get("consistent")));
        check("L14-4 clientConsistentNote 明说它证明不了服务端认了",
                String.valueOf(d.get("clientConsistentNote")).contains("证明不了服务端"));
        check("L14-5 serverConfirmed 恒 null（客户端看不到服务端）+ note 指向真机判据",
                d.containsKey("serverConfirmed") && d.get("serverConfirmed") == null
                        && String.valueOf(d.get("serverConfirmedNote")).contains("真机"));

        SyncBridge noConn = new SyncBridge();
        noConn.packetSendable = false;
        Map<String, Object> r2 = new PlaytestCore(noConn, evDir("slot2"), "tok")
                .dispatch("select_slot", params("slot", Integer.valueOf(2)));
        Map<String, Object> d2 = data(r2);
        check("L14-6 没有连接可发：serverSynced=false（不假装同步了）+ syncNote 说清",
                isOk(r2) && Boolean.FALSE.equals(d2.get("serverSynced"))
                        && String.valueOf(d2.get("syncNote")).contains("没有连接"));

        HotbarOnlyBridge hb = new HotbarOnlyBridge();
        Map<String, Object> r3 = new PlaytestCore(hb, evDir("slot3"), "tok")
                .dispatch("select_slot", params("slot", Integer.valueOf(1)));
        Map<String, Object> d3 = data(r3);
        check("L14-7 未实现同步的档：serverSynced=null（不许假装）+ syncNote 给绕过办法",
                isOk(r3) && d3.containsKey("serverSynced") && d3.get("serverSynced") == null
                        && String.valueOf(d3.get("syncNote")).contains("slot 0"));

        Map<String, Object> rOut = core.dispatch("select_slot", params("slot", Integer.valueOf(9)));
        check("L14-8 slot=9 仍回 SLOT_OUT_OF_RANGE + slotMin/slotMax（既有断言不动）",
                "SLOT_OUT_OF_RANGE".equals(rOut.get("code"))
                        && Integer.valueOf(0).equals(rOut.get("slotMin")));
    }

    // ==================================================================
    // L15. 能力自报
    // ==================================================================

    private static void sectionCapabilities() {
        check("L15-1 WALK 是 DRIVER 的子集（不是第 3 张表）+ walk_to 在 DRIVER 里",
                Capabilities.DRIVER.containsAll(Capabilities.WALK)
                        && Capabilities.DRIVER.contains("walk_to"));
        check("L15-2 all() 仍是 BRIDGE + DRIVER 两表并集",
                Capabilities.all().size() == Capabilities.BRIDGE.size() + Capabilities.DRIVER.size());

        MapBridge m = new MapBridge();
        Map<String, Object> st = new PlaytestCore(m, evDir("cap"), "tok").status();
        check("L15-3 有移动能力的档：walk_to 不在 actionsUnavailable 里",
                !strList(st.get("actionsUnavailable")).contains("walk_to"));
        Map<String, Object> caps = mapAt(st, "capabilities");
        check("L15-4 capabilities.walk 单列一份且与 WALK 逐字相同",
                new ArrayList<Object>(Capabilities.WALK).equals(strList(caps.get("walk"))));

        Map<String, Object> st2 = new PlaytestCore(new FakeBridge(), evDir("cap2"), "tok").status();
        check("L15-5 未实现档：walk_to 如实进 actionsUnavailable（不谎报会走）",
                strList(st2.get("actionsUnavailable")).contains("walk_to"));

        // ---- 关键回归闸门：新能力轴**不得**把老档的 driverAvailable 拖成假否定 ----
        check("L15-6 DRIVER_BASELINE = DRIVER 去掉 WALK（别把新能力轴并进完整性判据）",
                !Capabilities.DRIVER_BASELINE.contains("walk_to")
                        && Capabilities.DRIVER_BASELINE.size() == Capabilities.DRIVER.size() - 1
                        && Capabilities.DRIVER_BASELINE.contains("press")
                        && Capabilities.DRIVER_BASELINE.contains("select_slot"));
        check("L15-7 会 GUI 但不会走路的档：driverAvailable **仍是 true**（不因 walk_to 被降级）",
                Boolean.TRUE.equals(mapAt(new PlaytestCore(new GuiOnlyBridge(), evDir("cap3"), "tok")
                        .status(), "capabilities").get("driverAvailable"))
                        && Boolean.FALSE.equals(mapAt(new PlaytestCore(new GuiOnlyBridge(),
                                evDir("cap4"), "tok").status(), "capabilities").get("walkAvailable")));
        // MapBridge 只接了移动面、没接 GUI 面 ⇒ driverAvailable=false 是**正确**的
        // （它确实驱动不全：不会点屏幕）。这条钉的是"两面各自独立如实报"。
        check("L15-8 只接移动面的档：walkAvailable=true、driverAvailable=false（两面独立如实报）",
                Boolean.TRUE.equals(mapAt(st, "capabilities").get("walkAvailable"))
                        && Boolean.FALSE.equals(mapAt(st, "capabilities").get("driverAvailable")));
    }

    // ==================================================================
    // L16. [T41] 假到达（初始已在容差内）vs 真实位移 + 低速末段不误判 BLOCKED
    // ==================================================================

    private static void sectionFakeArrivalAndDisplacement() {
        // 1) 初始已在 tolerance=1.0 内：px=12.5, pz=-10.5 到目标 (13, 64, -11) 中心 (13.5, 64, -10.5) 距离=1.0
        MapBridge m = new MapBridge();
        m.px = 12.5; m.py = 64.0; m.pz = -10.5;
        PlaytestCore core = new PlaytestCore(m, evDir("fake_arr"), "tok");
        Map<String, Object> res = runQueued(core, params(
                "x", Integer.valueOf(13), "y", Integer.valueOf(64), "z", Integer.valueOf(-11),
                "tolerance", Double.valueOf(1.0)));
        Map<String, Object> d = data(res);
        check("L16-1 初始距目标 1.0 ≤ tolerance=1.0：reached=true 且 ticks=0",
                isOk(res) && Boolean.TRUE.equals(d.get("reached"))
                        && Integer.valueOf(0).equals(d.get("ticks")));
        check("L16-2 诚实披露未移动：moved=false、actualDisplacement=0、alreadyWithinTolerance=true",
                Boolean.FALSE.equals(d.get("moved"))
                        && num(d.get("actualDisplacement")) == 0.0
                        && Boolean.TRUE.equals(d.get("alreadyWithinTolerance")));
        check("L16-3 回执含 startPos 且 note 明说初始已在容差内、未发生位移",
                d.get("startPos") instanceof Map
                        && String.valueOf(d.get("note")).contains("初始已在容差内")
                        && String.valueOf(d.get("note")).contains("未发生位移"));
        check("L16-4 未白走：walkDrive 一次都没调", m.drives.isEmpty());

        // 2) 收紧 tolerance=0.4，并以原版真实步速 ~0.215 格/tick 走完最后 1 格
        //    （回归闸门：旧实现会在 (tolerance, 1.15] 环内把终点路点跳过，立刻误报 BLOCKED-at-end）
        MapBridge m2 = new MapBridge();
        m2.px = 12.5; m2.py = 64.0; m2.pz = -10.5;
        m2.stepPerTick = 0.215;
        PlaytestCore core2 = new PlaytestCore(m2, evDir("tight_tol"), "tok");
        Map<String, Object> res2 = runQueued(core2, params(
                "x", Integer.valueOf(13), "y", Integer.valueOf(64), "z", Integer.valueOf(-11),
                "tolerance", Double.valueOf(0.4), "maxTicks", Integer.valueOf(100)));
        Map<String, Object> d2 = data(res2);
        check("L16-5 真实步速 0.215 + tolerance=0.4：不误报 BLOCKED-at-end，真走到位",
                isOk(res2) && Boolean.TRUE.equals(d2.get("reached"))
                        && Pathfinder.REACHED.equals(d2.get("stopReason"))
                        && num(d2.get("distance")) <= 0.4);
        check("L16-6 真实位移如实记账：ticks>0、moved=true、actualDisplacement>=0.5、alreadyWithinTolerance=false",
                num(d2.get("ticks")) > 0 && Boolean.TRUE.equals(d2.get("moved"))
                        && num(d2.get("actualDisplacement")) >= 0.5
                        && Boolean.FALSE.equals(d2.get("alreadyWithinTolerance")));
    }

    // ==================================================================
    // L17. [T41] 按键驱动 + Arbitration 联动（AUTO 不自让位、真人介入真让位、DUAL 拒走）
    // ==================================================================

    /** 模拟真实 KeyMapping.setDown / isDown + walkHeld 记账式释放的桥桩。 */
    static class KeyedMapBridge extends MapBridge {
        final Map<String, Boolean> pressed = new LinkedHashMap<String, Boolean>();
        final boolean[] walkHeld = new boolean[5];
        static final String[] WALK_KEYS = { "forward", "back", "left", "right", "jump" };

        @Override public List<String> supportedKeys() {
            return Arrays.asList("forward", "back", "left", "right", "jump", "attack");
        }

        @Override public boolean isPressed(String k) {
            return Boolean.TRUE.equals(pressed.get(k));
        }

        @Override public void setPressed(String k, boolean d) {
            pressed.put(k, Boolean.valueOf(d));
            if (!d) {
                for (int i = 0; i < WALK_KEYS.length; i++) {
                    if (WALK_KEYS[i].equals(k)) walkHeld[i] = false;
                }
            }
        }

        @Override public boolean walkDrive(float forward, float strafe, boolean jump, float yaw) {
            boolean[] want = { forward > 0.05f, forward < -0.05f, strafe > 0.05f, strafe < -0.05f, jump };
            for (int i = 0; i < WALK_KEYS.length; i++) {
                if (want[i]) {
                    pressed.put(WALK_KEYS[i], Boolean.TRUE);
                    walkHeld[i] = true;
                } else if (walkHeld[i]) {
                    pressed.put(WALK_KEYS[i], Boolean.FALSE);
                    walkHeld[i] = false;
                }
            }
            return super.walkDrive(forward, strafe, jump, yaw);
        }

        @Override public void walkStop() {
            for (int i = 0; i < WALK_KEYS.length; i++) {
                if (walkHeld[i]) pressed.put(WALK_KEYS[i], Boolean.FALSE);
                walkHeld[i] = false;
            }
            super.walkStop();
        }
    }

    private static void sectionWalkArbitration() {
        // 1) AUTO 模式下走 6 格（每 tick 真实按住 forward）：绝不自我触发 auto-yield，到位后释放键与归属
        KeyedMapBridge kb = new KeyedMapBridge();
        kb.stepPerTick = 0.215;
        PlaytestCore core = new PlaytestCore(kb, evDir("arb_ok"), "tok");
        Map<String, Object> r = runQueued(core, params(
                "x", Integer.valueOf(6), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "tolerance", Double.valueOf(0.5), "maxTicks", Integer.valueOf(200)));
        Map<String, Object> d = data(r);
        check("L17-1 AUTO 模式下按键驱动 walk_to 不自让位且真走到目标",
                isOk(r) && Boolean.TRUE.equals(d.get("reached")) && Boolean.TRUE.equals(d.get("moved"))
                        && core.arbitration().aiOwns() && core.arbitration().yields() == 0);
        check("L17-2 到位后释放 forward 且 Arbitration 不残留持有键",
                !kb.isPressed("forward") && !core.arbitration().isOwned("forward")
                        && core.arbitration().ownedCount() == 0);

        // 2) 行走途中真人按下 jump：AUTO 立刻让位、释放 AI 的 forward、绝不清真人的 jump、walk_to 收口为 YIELDED
        KeyedMapBridge kb2 = new KeyedMapBridge();
        kb2.stepPerTick = 0.215;
        PlaytestCore core2 = new PlaytestCore(kb2, evDir("arb_yield"), "tok");
        com.bandd.playtest.core.ActionQueue.Job job = core2.queue().submit("walk_to", params(
                "x", Integer.valueOf(20), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "maxTicks", Integer.valueOf(300)));
        core2.onTick();  // 登记
        core2.onTick();  // 第 1 步驱动 forward
        core2.onTick();  // 第 2 步驱动 forward
        boolean forwardWasDown = kb2.isPressed("forward") && core2.arbitration().isOwned("forward");
        kb2.pressed.put("jump", Boolean.TRUE);  // 真人按下 jump
        core2.onTick();  // 应检测到真人输入并让位 + 中止 walk_to
        Map<String, Object> yr = job.await(1);
        Map<String, Object> yd = data(yr);
        check("L17-3 行走中途确实持有 forward，真人按 jump 后 AUTO 让位（yields=1）",
                forwardWasDown && !core2.arbitration().aiOwns() && core2.arbitration().yields() == 1);
        check("L17-4 让位后释放 AI 的 forward、保留真人的 jump",
                !kb2.isPressed("forward") && kb2.isPressed("jump"));
        check("L17-5 walk_to 立刻收口：reached=false、stopReason=YIELDED",
                isOk(yr) && Boolean.FALSE.equals(yd.get("reached"))
                        && "YIELDED".equals(yd.get("stopReason")));

        // 3) 让位后（!aiOwns）：实际 walk_to 被拒（NOT_OWNING），但 plan_only 仍可用；take_over 后恢复
        Map<String, Object> blockedNoOwn = core2.dispatch("walk_to", params(
                "x", Integer.valueOf(5), "y", Integer.valueOf(64), "z", Integer.valueOf(0)));
        Map<String, Object> planNoOwn = core2.dispatch("walk_to", params(
                "x", Integer.valueOf(5), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "plan_only", Boolean.TRUE));
        check("L17-6 让位后 walk_to 报 NOT_OWNING + moved=false，但 plan_only 仍可用",
                "failed".equals(blockedNoOwn.get("status"))
                        && "NOT_OWNING".equals(blockedNoOwn.get("code"))
                        && Boolean.FALSE.equals(blockedNoOwn.get("moved"))
                        && isOk(planNoOwn));

        // 4) DUAL 模式下：实际 walk_to 被拒（DRIVER_DISABLED），但 plan_only 仍可用
        KeyedMapBridge kb3 = new KeyedMapBridge();
        PlaytestCore core3 = new PlaytestCore(kb3, evDir("arb_dual"), "tok");
        core3.dispatch("set_arbitration", params("mode", "DUAL"));
        Map<String, Object> dualWalk = core3.dispatch("walk_to", params(
                "x", Integer.valueOf(5), "y", Integer.valueOf(64), "z", Integer.valueOf(0)));
        Map<String, Object> dualPlan = core3.dispatch("walk_to", params(
                "x", Integer.valueOf(5), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "plan_only", Boolean.TRUE));
        check("L17-7 DUAL 模式挡 walk_to（DRIVER_DISABLED + moved=false）且不触键，但 plan_only 仍可用",
                "failed".equals(dualWalk.get("status"))
                        && "DRIVER_DISABLED".equals(dualWalk.get("code"))
                        && Boolean.FALSE.equals(dualWalk.get("moved"))
                        && kb3.drives.isEmpty() && isOk(dualPlan));
        check("L17-8 walk_to 的 HTTP 等待预算 ≥ 30s（匹配 DEFAULT_MAX_TICKS=600，不再 5s 误超时）",
                core3.timeoutMsFor("walk_to") >= 30000L);
    }

    // ==================================================================
    // L18. [T41 真机回归] 脚部格非实心危险（minecraft:fire / sweet_berry_bush 位于 y，而非 y-1）
    // ==================================================================

    private static MapBridge sealedCorridor(int xMin, int xMax) {
        MapBridge m = new MapBridge();
        for (int x = xMin; x <= xMax; x++) {
            for (int y = 64; y <= 66; y++) {
                m.put(x, y, -1, "minecraft:deepslate");
                m.put(x, y, 1, "minecraft:deepslate");
            }
            m.put(x, 66, 0, "minecraft:deepslate");   // 封顶：防止 risk(ignoreAllow) 翻墙绕过
        }
        for (int y = 64; y <= 66; y++) {
            m.put(xMin, y, 0, "minecraft:deepslate");
            m.put(xMax, y, 0, "minecraft:deepslate");
        }
        return m;
    }

    private static void sectionFeetLevelHazards() {
        // 构造真实 1 格宽全密封走廊：玩家在 (0,64,0)，地板 y=63 为 stone，两侧 z=±1 与顶 y=66 全封死，
        // 真实火方块位于脚部格 (2,64,0)（而不是 T39 假地图里的 y=63）。
        MapBridge fireCorridor = sealedCorridor(-1, 5);
        fireCorridor.put(2, 64, 0, "minecraft:fire");

        PlaytestCore fc = new PlaytestCore(fireCorridor, evDir("feet_fire_no_allow"), "tok");
        Map<String, Object> blocked = fc.dispatch("walk_to", params(
                "x", Integer.valueOf(4), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "maxTicks", Integer.valueOf(100)));
        check("L18-1 脚部格 minecraft:fire 无 allow:fire ⇒ WALK_BLOCKED + stopReason=DANGER + dangerKind=fire",
                "failed".equals(blocked.get("status"))
                        && WalkTo.WALK_BLOCKED.equals(blocked.get("code"))
                        && Pathfinder.DANGER.equals(blocked.get("stopReason"))
                        && "fire".equals(blocked.get("dangerKind"))
                        && "minecraft:fire".equals(blocked.get("dangerBlock"))
                        && Boolean.FALSE.equals(blocked.get("moved")));

        @SuppressWarnings("unchecked")
        List<Object> need = (List<Object>) blocked.get("needAllow");
        check("L18-2 脚部格 fire 的 DANGER 回执给 needAllow=[fire] 与 riskRouteDamage > 0",
                need != null && need.contains("fire")
                        && blocked.get("riskRouteDamage") instanceof Number
                        && ((Number) blocked.get("riskRouteDamage")).doubleValue() > 0.0);

        Map<String, Object> plan = fc.dispatch("walk_to", params(
                "x", Integer.valueOf(4), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "plan_only", Boolean.TRUE));
        Map<String, Object> pd = data(plan);
        check("L18-3 脚部格 fire 的 plan_only 同样回 planFound=false + planStopReason=DANGER",
                isOk(plan) && Boolean.FALSE.equals(pd.get("planFound"))
                        && Pathfinder.DANGER.equals(pd.get("planStopReason")));

        // 显式 allow:["fire"] ⇒ 真的穿过脚部格火块到达 (4,64,0) 并如实记账
        MapBridge fireAllow = sealedCorridor(-1, 5);
        fireAllow.put(2, 64, 0, "minecraft:fire");
        PlaytestCore fcAllow = new PlaytestCore(fireAllow, evDir("feet_fire_allow"), "tok");
        Map<String, Object> walked = runQueued(fcAllow, params(
                "x", Integer.valueOf(4), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "allow", Arrays.asList("water", "fire"), "maxTicks", Integer.valueOf(200)));
        Map<String, Object> wd = data(walked);
        check("L18-4 给了 allow:[fire] 就能穿过脚部格 fire 到达终点（reached=true, dangerCount>=1, ticksInDanger>0）",
                isOk(walked) && Boolean.TRUE.equals(wd.get("reached"))
                        && wd.get("dangerCount") instanceof Number
                        && ((Number) wd.get("dangerCount")).intValue() >= 1
                        && wd.get("ticksInDanger") instanceof Number
                        && ((Number) wd.get("ticksInDanger")).intValue() > 0);

        // 仙人掌是 14/16 实心柱，脚不能站进仙人掌格内（仍是 BLOCKED，不误当可穿行）
        MapBridge cactusWall = sealedCorridor(-1, 5);
        cactusWall.put(2, 64, 0, "minecraft:cactus");
        PlaytestCore cc = new PlaytestCore(cactusWall, evDir("feet_cactus"), "tok");
        Map<String, Object> cRes = cc.dispatch("walk_to", params(
                "x", Integer.valueOf(4), "y", Integer.valueOf(64), "z", Integer.valueOf(0),
                "allow", Arrays.asList("water", "cactus"), "plan_only", Boolean.TRUE));
        check("L18-5 仙人掌（实心碰撞柱）放脚部格即使 allow:[cactus] 也不可穿透（planFound=false, BLOCKED）",
                isOk(cRes) && Boolean.FALSE.equals(data(cRes).get("planFound"))
                        && Pathfinder.BLOCKED.equals(data(cRes).get("planStopReason")));
    }

    /** 会 GUI、会切槽丢物、但**不会走路**的老档（用来钉 L15-7 的假否定）。 */
    static class GuiOnlyBridge extends FakeBridge {
        @Override public boolean guiActionCapable() { return true; }
        @Override public boolean configGuiAvailable() { return true; }
        @Override public boolean inventoryCapable() { return true; }
    }

    // ==================================================================
    // 桩
    // ==================================================================

    static class SyncBridge extends FakeBridge {
        int syncedCalls = 0;
        int lastSyncedSlot = -999;
        boolean packetSendable = true;
        int selected = 0;

        @Override public boolean guiActionCapable() { return true; }
        @Override public boolean inventoryCapable() { return true; }
        @Override public boolean slotSyncCapable() { return true; }

        @Override public GuiResult selectSlot(int slot) {
            selected = slot;
            Map<String, Object> d = new LinkedHashMap<String, Object>();
            d.put("previousSlot", Integer.valueOf(0));
            d.put("selectedSlot", Integer.valueOf(slot));
            d.put("mainHand", null);
            return GuiResult.ok(d);
        }

        @Override public GuiResult setSelectedSlotSynced(int slot) {
            syncedCalls++;
            lastSyncedSlot = slot;
            selected = slot;
            Map<String, Object> d = new LinkedHashMap<String, Object>();
            d.put("previousSlot", Integer.valueOf(0));
            d.put("selectedSlot", Integer.valueOf(slot));
            d.put("mainHand", null);
            d.put("packetSent", Boolean.valueOf(packetSendable));
            if (packetSendable) d.put("packetClass", "ServerboundSetCarriedItemPacket");
            return GuiResult.ok(d);
        }

        @Override public String inventoryJson() {
            Map<String, Object> m = new LinkedHashMap<String, Object>();
            m.put("size", 41);
            m.put("slots", new ArrayList<Object>());
            m.put("selectedSlot", Integer.valueOf(selected));
            m.put("mainHand", null);
            return Json.of(m);
        }
    }

    static class HotbarOnlyBridge extends FakeBridge {
        int selected = 0;

        @Override public boolean guiActionCapable() { return true; }
        @Override public boolean inventoryCapable() { return true; }

        @Override public GuiResult selectSlot(int slot) {
            selected = slot;
            Map<String, Object> d = new LinkedHashMap<String, Object>();
            d.put("previousSlot", Integer.valueOf(0));
            d.put("selectedSlot", Integer.valueOf(slot));
            d.put("mainHand", null);
            return GuiResult.ok(d);
        }

        @Override public String inventoryJson() {
            Map<String, Object> m = new LinkedHashMap<String, Object>();
            m.put("size", 41);
            m.put("slots", new ArrayList<Object>());
            m.put("selectedSlot", Integer.valueOf(selected));
            m.put("mainHand", null);
            return Json.of(m);
        }
    }

    // ==================================================================
    // helpers
    // ==================================================================

    private static Map<String, Object> runQueued(PlaytestCore core, Map<String, Object> p) {
        com.bandd.playtest.core.ActionQueue.Job job = core.queue().submit("walk_to", p);
        Map<String, Object> res = job.await(1);
        for (int i = 0; i < 4000 && res == null; i++) {
            core.onTick();
            res = job.await(1);
        }
        return res;
    }

    private static Path evDir(String tag) {
        return base.resolve(tag);
    }

    private static double num(Object o) {
        return o instanceof Number ? ((Number) o).doubleValue() : Double.NaN;
    }

    static Map<String, Object> params(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        for (int i = 0; i + 1 < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]);
        return m;
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> data(Map<String, Object> res) {
        Object d = res == null ? null : res.get("data");
        return d instanceof Map ? (Map<String, Object>) d : new LinkedHashMap<String, Object>();
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> mapAt(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return v instanceof Map ? (Map<String, Object>) v : new LinkedHashMap<String, Object>();
    }

    @SuppressWarnings("unchecked")
    static List<String> strList(Object o) {
        List<String> out = new ArrayList<String>();
        if (o instanceof List) for (Object e : (List<Object>) o) out.add(String.valueOf(e));
        return out;
    }

    static boolean isOk(Map<String, Object> res) {
        return res != null && "ok".equals(res.get("status"));
    }

    private static void check(String name, boolean ok) {
        if (ok) {
            pass++;
            System.out.println("[PASS] " + name);
        } else {
            fail++;
            System.out.println("[FAIL] " + name);
        }
    }
}
