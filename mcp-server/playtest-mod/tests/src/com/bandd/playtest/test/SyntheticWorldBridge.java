package com.bandd.playtest.test;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * **合成世界**（假桥）：不碰 Minecraft、不读盘 —— 高度与方块由一个**纯函数**给。
 *
 * <p>为什么需要它：状态器的判据（分帧扫描 / 网格几何 / 玩家标记 / truncated / 未知格）
 * 必须在**确定性世界**上验，真机（随机地形、区块随机加载）验不出「第几格画了 +」。
 *
 * <p>世界形状（可复算）：{@code surfaceY(x,z) = 64 + floorMod(x*3 + z*5, 7)} ⇒ 高度 ∈ [64,70]
 * ⇒ 高度字段宽 2、每格宽 3；方块 id 按高度分三档（stone / grass_block / snow_block）。
 * {@code x < unloadedBelowX} 的列视为**未加载** ⇒ {@code topSolidY} 回 MIN_VALUE、
 * {@code blockAt} 回 null（验「未知格」路径）。
 */
public class SyntheticWorldBridge implements GameBridge {

    // ---- 可调的世界状态 ----
    public double px = 8.0, py = 65.0, pz = -8.0;
    public double yaw = 90.0, pitch = 12.5;
    public String dimension = "minecraft:overworld";
    public boolean ready = true;
    public String screen = null;
    /** x < 此值的列视为未加载（默认 Integer.MIN_VALUE = 全部加载）。 */
    public int unloadedBelowX = Integer.MIN_VALUE;

    // ---- 调用计数（用来证明「查询不现场全扫」「分帧预算生效」）----
    public int blockAtCalls = 0;
    public int topSolidYCalls = 0;
    public int playerStateCalls = 0;

    public static int surfaceY(int x, int z) {
        return 64 + Math.floorMod(x * 3 + z * 5, 7);
    }

    public static String surfaceBlock(int x, int z) {
        int h = surfaceY(x, z);
        if (h <= 65) return "minecraft:stone";
        if (h <= 69) return "minecraft:grass_block";
        return "minecraft:snow_block";
    }

    public boolean loadedAt(int x, int z) {
        return ready && x >= unloadedBelowX;
    }

    // ================= 状态器取值面 =================

    @Override
    public boolean stateMapCapable() {
        return true;
    }

    @Override
    public int topSolidY(int x, int z) {
        topSolidYCalls++;
        if (!loadedAt(x, z)) return Integer.MIN_VALUE;
        return surfaceY(x, z);
    }

    @Override
    public String blockAt(int x, int y, int z) {
        blockAtCalls++;
        if (!loadedAt(x, z)) return null;
        int h = surfaceY(x, z);
        if (y > h) return "minecraft:air";
        if (y == h) return surfaceBlock(x, z);
        return "minecraft:stone";
    }

    @Override
    public String worldEnvJson() {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("timeOfDay", 6000);
        m.put("dayTime", 18000);
        m.put("raining", Boolean.FALSE);
        m.put("thundering", Boolean.TRUE);
        return Json.of(m);
    }

    // ================= 桥的其余面（本测试不用，最小实现）=================

    @Override public String platform() { return "synthetic"; }

    @Override public String mcVersion() { return "test"; }

    @Override public boolean ready() { return ready; }

    @Override public void tick() { }

    @Override
    public String playerStateJson() {
        playerStateCalls++;
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("present", Boolean.TRUE);
        m.put("name", "Synthetic");
        m.put("x", px);
        m.put("y", py);
        m.put("z", pz);
        m.put("yaw", yaw);
        m.put("pitch", pitch);
        m.put("health", 20.0);
        m.put("onGround", Boolean.TRUE);
        m.put("dimension", dimension);
        m.put("screen", screen);
        return Json.of(m);
    }

    @Override public String screenName() { return screen; }

    @Override public String screenshotPath() { return null; }

    @Override public String spawnBot(String name, double distance) { return null; }

    @Override public void moveBotTo(double x, double y, double z) { }

    @Override public void tickBot() { }

    @Override public String giveBot(String item, int count) { return null; }

    @Override public boolean lookBot(double yaw, double pitch) { return false; }

    @Override public String breakBotBlock(double x, double y, double z) { return null; }

    @Override public String placeBotBlock(double x, double y, double z) { return null; }

    @Override public boolean setServerAuth(boolean online) { return false; }

    @Override public void joinServer(String address) { }

    @Override public void despawnBot() { }

    @Override public String openBotInventory() { return null; }

    @Override public List<String> drainChat() { return new ArrayList<String>(); }

    @Override public void openWorld(String worldName) { }

    @Override public void chatCommand(String command) { }

    @Override public boolean isPressed(String key) { return false; }

    @Override public void setPressed(String key, boolean down) { }

    @Override public List<String> supportedKeys() {
        return Arrays.asList("forward", "back", "left", "right", "jump", "sneak", "sprint",
                "attack", "use", "inventory");
    }
}
