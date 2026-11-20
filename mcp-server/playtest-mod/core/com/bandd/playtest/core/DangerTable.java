package com.bandd.playtest.core;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * **危险表**：方块 id ⇒ 通行类别 + 代价 + 伤害估算。寻路与 walk_to 共用这一张表。
 *
 * <h3>为什么单独一个类、且必须是一处可测的实体</h3>
 * 「哪些方块能走、走过去要付什么代价」是这条路线的安全边界。散在 {@link Pathfinder} 的
 * 启发式里既读不全、也没法被负控实验整体拆掉。这里只放**纯数据 + 纯函数**，Java 8 可编译，
 * 一个 {@code net.minecraft.*} 都不出现（方块信息全部经 {@link GameBridge#blockAt} 传进来）。
 *
 * <h3>分类原则：默认保守（未知 = 不可走，不在表里的方块 = 实心）</h3>
 * <ul>
 *   <li>{@code blockAt} 回 {@code null}（越界 / 未加载 / 本档不支持）⇒ {@link #UNKNOWN}。
 *       **未知格永不假设可走** —— 上一轮 {@code void_air} 那个坑是同一类错误
 *       （未加载区块被读成一片空气 ⇒ 地图上画出一片能走的假地面）。</li>
 *   <li>不在任何表里的方块 ⇒ {@link #SOLID}（保守：当作走不过去的实心块）。</li>
 *   <li>只有**显式列在** {@link #PASSABLE} 里的才是"脚下留空、可以站进去"的方块。</li>
 * </ul>
 *
 * <h3>岩浆：永远不许"走"</h3>
 * 走进去 = 必死，那是**自杀**而不是**风险** ⇒ 不设代价、不设许可开关；只允许
 * {@code bridge}（拿现成通路搭桥跨过）或 {@code dig}（挖道绕开）。见 {@link #LETHAL}。
 *
 * <h3>落差：3 格以内零伤害（本轮修正的一处规格错误）</h3>
 * 原版 {@code LivingEntity#calculateFallDamage} 的字节码逐条读下来是
 * <pre>
 *   ceil((fallDistance - 3.0F - jumpBoostAmplifier) * multiplier)
 * </pre>
 * 且 {@code calculateFallDamage(...) > 0} 才 {@code hurt(...)}（forge 1.20.1-47.4.10
 * mapped_parchment 件，{@code javap -p -c net.minecraft.world.entity.LivingEntity}，
 * 偏移 40-53 与 42-71 两段）。⇒ **1..3 格落地 = 0 点伤害**，4 格起才掉血。
 * 所以默认**允许 ≤3 格落差**，{@code ≥4} 才需要 {@code allow:fall} + {@code maxFall}。
 * 任务书初稿写的「≥2 格禁止」是错的，已在交付报告里点名。
 *
 * <p>Java 8 可用（本类无任何 MC / 加载器类型）。
 */
public final class DangerTable {

    // ==================================================================
    // 通行类别
    // ==================================================================

    /** 脚下留空、可以站进去（空气 / 草 / 花 / 火把 …）——**只有显式列出的才算**。 */
    public static final int PASSABLE = 0;
    /** 实心：站得上去、走不过去。**不在任何表里的方块一律归这里**（保守）。 */
    public static final int SOLID = 1;
    /** 水：可游泳通过，但要付时间代价（回执里给 {@code swimTicks}）。 */
    public static final int WATER = 2;
    /** 岩浆类：**永远不许走**（走进去必死）。只能 bridge 或 dig。 */
    public static final int LETHAL = 3;
    /** 火 / 营火：碰到就掉血；{@code allow:fire} 才允许踩。 */
    public static final int FIRE = 4;
    /** 仙人掌：碰到就掉血；{@code allow:cactus}。 */
    public static final int CACTUS = 5;
    /** 甜浆果丛：走进去减速 + 掉血；{@code allow:sweetBerry}。 */
    public static final int SWEET_BERRY = 6;
    /** 粉雪：陷进去 + 冻伤；{@code allow:powderSnow}。 */
    public static final int POWDER_SNOW = 7;
    /** 岩浆块：**能站**（是实心方块），但站上去每 10 tick 掉 1 点。按火一类处理。 */
    public static final int MAGMA = 8;
    /** 凋零玫瑰：碰到掉血。 */
    public static final int WITHER_ROSE = 9;
    /** 取不到（越界 / 未加载 / 本档不支持）——**未知，不许假设可走**。 */
    public static final int UNKNOWN = 10;

    /** 全部类别的稳定名字（回执与单测按名字断言，不按数字）。 */
    public static final String[] KIND_NAMES = {
            "passable", "solid", "water", "lava", "fire", "cactus",
            "sweetBerry", "powderSnow", "magma", "witherRose", "unknown"
    };

    public static String kindName(int kind) {
        return (kind >= 0 && kind < KIND_NAMES.length) ? KIND_NAMES[kind] : "unknown";
    }

    // ==================================================================
    // 表
    // ==================================================================

    /** 可以站进去的方块（脚下留空）。**只有这张表里的才算 PASSABLE。** */
    private static final Set<String> PASSABLE_IDS = new HashSet<String>(Arrays.asList(
            "minecraft:air", "minecraft:cave_air", "minecraft:void_air",
            // 草与花（碰撞箱为 0）
            "minecraft:short_grass", "minecraft:grass", "minecraft:tall_grass", "minecraft:fern",
            "minecraft:large_fern", "minecraft:dead_bush", "minecraft:vine",
            "minecraft:dandelion", "minecraft:poppy", "minecraft:blue_orchid", "minecraft:allium",
            "minecraft:azure_bluet", "minecraft:red_tulip", "minecraft:orange_tulip",
            "minecraft:white_tulip", "minecraft:pink_tulip", "minecraft:oxeye_daisy",
            "minecraft:cornflower", "minecraft:lily_of_the_valley", "minecraft:torchflower",
            "minecraft:wheat", "minecraft:carrots", "minecraft:potatoes", "minecraft:beetroots",
            "minecraft:oak_sapling", "minecraft:spruce_sapling", "minecraft:birch_sapling",
            "minecraft:jungle_sapling", "minecraft:acacia_sapling", "minecraft:dark_oak_sapling",
            "minecraft:sugar_cane", "minecraft:kelp", "minecraft:kelp_plant", "minecraft:seagrass",
            "minecraft:tall_seagrass", "minecraft:snow",           // 1 层雪：走得过，不算障碍
            // 照明 / 红石 / 轨道（碰撞箱为 0 或可跨越）
            "minecraft:torch", "minecraft:wall_torch", "minecraft:soul_torch",
            "minecraft:soul_wall_torch", "minecraft:redstone_torch", "minecraft:redstone_wall_torch",
            "minecraft:lantern", "minecraft:soul_lantern", "minecraft:lever",
            "minecraft:stone_button", "minecraft:oak_button", "minecraft:tripwire",
            "minecraft:rail", "minecraft:powered_rail", "minecraft:detector_rail",
            "minecraft:activator_rail", "minecraft:light", "minecraft:structure_void",
            "minecraft:ladder", "minecraft:scaffolding",
            // 液体本身在别的类别里判（水/岩浆），这里不列
            "minecraft:bubble_column"
    ));

    /** 水（可游）。 */
    private static final Set<String> WATER_BLOCKS = new HashSet<String>(Arrays.asList(
            "minecraft:water", "minecraft:flowing_water", "minecraft:bubble_column"));

    /** 岩浆类：**永远不许走**。 */
    private static final Set<String> LAVA_BLOCKS = new HashSet<String>(Arrays.asList(
            "minecraft:lava", "minecraft:flowing_lava"));
    /** 岩浆块：能站但掉血（单独一类，别与上一条混 —— 上一条走进去必死）。 */
    private static final Set<String> MAGMA_BLOCKS = new HashSet<String>(Arrays.asList(
            "minecraft:magma_block"));

    private static final Set<String> FIRE_BLOCKS = new HashSet<String>(Arrays.asList(
            "minecraft:fire", "minecraft:soul_fire",
            "minecraft:campfire", "minecraft:soul_campfire"));

    private static final Set<String> CACTUS_BLOCKS = new HashSet<String>(Arrays.asList(
            "minecraft:cactus"));

    private static final Set<String> SWEET_BERRY_BLOCKS = new HashSet<String>(Arrays.asList(
            "minecraft:sweet_berry_bush"));

    private static final Set<String> POWDER_SNOW_BLOCKS = new HashSet<String>(Arrays.asList(
            "minecraft:powder_snow"));

    private static final Set<String> WITHER_ROSE_BLOCKS = new HashSet<String>(Arrays.asList(
            "minecraft:wither_rose"));

    /** 旧档的 unlocalizedName 口径兜底（桥路线 forge 1.7.10–1.12.2 给 {@code tile.lava} 这类）。 */
    private static final Map<String, Integer> LEGACY = new HashMap<String, Integer>();
    static {
        LEGACY.put("tile.air", Integer.valueOf(PASSABLE));
        LEGACY.put("tile.water", Integer.valueOf(WATER));
        LEGACY.put("tile.lava", Integer.valueOf(LETHAL));
        LEGACY.put("tile.fire", Integer.valueOf(FIRE));
        LEGACY.put("tile.cactus", Integer.valueOf(CACTUS));
        LEGACY.put("tile.magma", Integer.valueOf(MAGMA));
    }

    private DangerTable() {
    }

    // ==================================================================
    // 分类
    // ==================================================================

    /**
     * 方块 id ⇒ 通行类别。{@code null} / 空串 ⇒ {@link #UNKNOWN}（**未知，不许假设可走**）。
     * 不在任何表里的 ⇒ {@link #SOLID}（保守）。
     */
    public static int classify(String blockId) {
        if (blockId == null || blockId.isEmpty()) return UNKNOWN;
        String id = blockId;
        int at = id.indexOf('[');           // 去掉方块状态后缀（如 minecraft:water[level=0]）
        if (at >= 0) id = id.substring(0, at);
        Integer legacy = LEGACY.get(id);
        if (legacy != null) return legacy.intValue();
        if (WATER_BLOCKS.contains(id)) return WATER;
        if (LAVA_BLOCKS.contains(id)) return LETHAL;
        if (MAGMA_BLOCKS.contains(id)) return MAGMA;
        if (FIRE_BLOCKS.contains(id)) return FIRE;
        if (CACTUS_BLOCKS.contains(id)) return CACTUS;
        if (SWEET_BERRY_BLOCKS.contains(id)) return SWEET_BERRY;
        if (POWDER_SNOW_BLOCKS.contains(id)) return POWDER_SNOW;
        if (WITHER_ROSE_BLOCKS.contains(id)) return WITHER_ROSE;
        if (PASSABLE_IDS.contains(id)) return PASSABLE;
        // 带前缀但认不出（如模组方块）、或原版没列进可通行表的 ⇒ 保守当实心
        return SOLID;
    }

    /** 能不能把脚放进去（站得住的那一格）。未知**不行**。 */
    public static boolean isClear(int kind) {
        return kind == PASSABLE;
    }

    /**
     * 能不能把**脚**放进去的非实心危险方块（火 / 甜浆果丛 / 粉雪 / 凋零玫瑰）。
     *
     * <p>[T41 真机实证] 原版里 {@code minecraft:fire} / {@code sweet_berry_bush} /
     * {@code powder_snow} / {@code wither_rose} 占据的是**脚所在格 (x,y,z)**（位于实心块 y-1 之上），
     * 而不是嵌在 y-1 地板格里。若 {@link Pathfinder#standable} 只放行 PASSABLE/WATER，
     * 这些真实方块在 {@code relax()} 调 {@link Pathfinder#hazardKindOf} 之前就会被拒为「站不住」，
     * 导致无许可时误报 {@code BLOCKED}（而非 {@code DANGER}）且即使给了 {@code allow:["fire"]} 也永远走不过去。
     * 注意：{@link #MAGMA}（整块实心）与 {@link #CACTUS}（14/16 实心柱）不可把脚放进其格内，故不在此列。
     */
    public static boolean isWalkableHazardFeet(int kind) {
        return kind == FIRE || kind == SWEET_BERRY || kind == POWDER_SNOW || kind == WITHER_ROSE;
    }

    /**
     * 能不能当**地板**（脚下那一格）。未知**不行**（不许假设踩得实）。
     *
     * <p>为什么火 / 甜浆果 / 粉雪 / 凋零玫瑰也算：它们都是**踩得进去的薄层**（碰撞箱低），
     * 玩家站在上面不会掉下去 —— 危险在"踩上去会掉血"，不在"踩不住"。
     * 岩浆**不算**地板（走进去是沉下去，不是站着）。
     */
    public static boolean isFloor(int kind) {
        return kind == SOLID || kind == MAGMA || kind == FIRE || kind == SWEET_BERRY
                || kind == POWDER_SNOW || kind == WITHER_ROSE;
    }

    /**
     * 踩上去 / 站进去**立刻**会掉血的类别（不含岩浆 —— 岩浆是必死，走另一条判据）。
     * 这些类别要么被许可、要么绕开。
     */
    public static boolean isHazard(int kind) {
        return kind == FIRE || kind == CACTUS || kind == SWEET_BERRY
                || kind == POWDER_SNOW || kind == MAGMA || kind == WITHER_ROSE;
    }

    /**
     * 危险类别 ⇒ {@code allow} 集合里的许可名（{@code null} = **没有**对应许可，
     * 也就是永不许可，例如岩浆）。
     */
    public static String allowName(int kind) {
        switch (kind) {
            case WATER: return "water";
            case FIRE: return "fire";
            case CACTUS: return "cactus";
            case SWEET_BERRY: return "sweetBerry";
            case POWDER_SNOW: return "powderSnow";
            case MAGMA: return "magma";
            case WITHER_ROSE: return "witherRose";
            default: return null;
        }
    }

    // ==================================================================
    // 代价
    // ==================================================================

    /**
     * 走**一格**的基础代价（格数 = 1 或 1.414）。危险类别在上面的基础上再加价：
     * 加价不是"惩罚"，是让 A* 在「同样长但更安全」的两条路之间**优先选安全那条**；
     * 允不允许走是另一件事（见 {@link #allowName(int)} 与寻路的许可判定）。
     */
    public static double extraCost(int kind) {
        switch (kind) {
            case WATER: return 2.0;          // 游泳慢：陆上 1 格 ≈ 水下 3 格
            case FIRE: return 6.0;
            case CACTUS: return 6.0;
            case SWEET_BERRY: return 4.0;
            case POWDER_SNOW: return 5.0;
            case MAGMA: return 3.0;
            case WITHER_ROSE: return 6.0;
            default: return 0.0;
        }
    }

    /** 搭桥跨过一格岩浆/缺口的代价（要放一个方块 + 走过去）。 */
    public static final double BRIDGE_COST = 12.0;
    /** 挖掉一格挡路方块的代价（挖 + 走过去）。 */
    public static final double DIG_COST = 8.0;
    /** 跳过（1 格抬升）的额外代价。 */
    public static final double JUMP_COST = 0.6;

    // ==================================================================
    // 伤害估算（按原版公式；plan_only 用它给调用方一个"要付多少血"的数）
    // ==================================================================

    /**
     * **落地伤害**（原版公式）：{@code ceil((fallDistance - 3.0) * multiplier)}，且只在 &gt;0 时才算。
     * 1..3 格 ⇒ 0；4 格 ⇒ 1；10 格 ⇒ 7；23 格 ⇒ 20（空手从满血摔死）。
     *
     * <p>出处：{@code LivingEntity#calculateFallDamage} 字节码偏移 40-53
     * （{@code fload_1; ldc 3.0f; fsub; ... fmul; Mth.ceil}），
     * forge 1.20.1-47.4.10 mapped_parchment 件。
     */
    public static double fallDamage(int blocks) {
        if (blocks <= 3) return 0.0;
        return Math.ceil((blocks - 3.0) * 1.0);
    }

    /**
     * 某一类危险**经过一格**的伤害估算（半颗心 = 1 点）。
     * 这些是**估算**，不是承诺 —— 回执里逐字标 {@code estimated:true}。
     * 岩浆**不给估算值**：走进去是必死，不是"掉多少血"的问题（回执里 {@code lethal:true}）。
     */
    public static double hazardDamagePerStep(int kind) {
        switch (kind) {
            case FIRE: return 4.0;           // 站在火里每次伤害 1 点，但会持续烧；按"穿过一格"估 4
            case CACTUS: return 1.0;         // 碰到一次 1 点
            case SWEET_BERRY: return 1.0;    // 走进去 1 点
            case MAGMA: return 1.0;          // 站上去每 10 tick 1 点
            case WITHER_ROSE: return 1.0;    // 碰到 1 点
            case POWDER_SNOW: return 2.0;    // 冻伤按"穿过一格"估 2（真实值取决于停留时长）
            default: return 0.0;
        }
    }

    /** 该类别是不是**必死**（岩浆）。必死 ⇒ 不进伤害估算，只进"绝不许走"。 */
    public static boolean isLethal(int kind) {
        return kind == LETHAL;
    }
}
