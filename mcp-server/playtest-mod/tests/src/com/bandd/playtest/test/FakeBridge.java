package com.bandd.playtest.test;

import com.bandd.playtest.core.GameBridge;
import com.bandd.playtest.core.Json;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 假桥：不碰 Minecraft，用来真跑 core（仲裁 / 派发 / 证据 / HTTP）。
 *
 * <p>[T19] 由 {@code final} 放开为可继承：新套 {@code GuiActionsTest} 需要「**界面能力可配置**」
 * 的假桥（{@code guiActionCapable/slotsJson/clickSlot/...}），直接在既有假桥上开子类最省事，
 * 也保证既有十套用的还是**同一个** FakeBridge（行为逐字不变 —— 只去掉 final，一个字都没动）。
 */
public class FakeBridge implements GameBridge {
    public final Map<String, Boolean> pressed = new LinkedHashMap<>();
    public final List<String> calls = new ArrayList<>();
    public final List<String> commands = new ArrayList<>();
    public boolean ready = true;
    public String screen = null;

    @Override public String platform() { return "fake"; }
    @Override public String mcVersion() { return "test"; }
    @Override public boolean ready() { return ready; }
    @Override public void tick() { }
    @Override public String playerStateJson() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("present", Boolean.TRUE);
        m.put("name", "Tester");
        m.put("x", 1.5);
        m.put("y", 64.0);
        m.put("z", 2.5);
        m.put("health", 20.0);
        m.put("onGround", Boolean.TRUE);
        return Json.of(m);
    }
    @Override public String screenName() { return screen; }
    @Override public String screenshotPath() { calls.add("screenshot"); return "/tmp/fake-shots"; }
    public final List<String> openedWorlds = new ArrayList<>();
    public final List<String> botMoves = new ArrayList<>();
    public final List<String> chatQueue = new ArrayList<>();
    @Override public List<String> drainChat() {
        List<String> o = new ArrayList<>(chatQueue);
        chatQueue.clear();
        return o;
    }
    public String botSpawnedAs = null;
    public boolean botUnsupported = false;
    @Override public String spawnBot(String name, double distance) {
        if (botUnsupported) return null;
        botSpawnedAs = name + "@" + distance;
        return "fake_player";
    }
    @Override public void moveBotTo(double x, double y, double z) { botMoves.add(x + "," + y + "," + z); }
    @Override public void despawnBot() { botSpawnedAs = null; }
    public int botTicks = 0;
    public final List<String> botGives = new ArrayList<>();
    public String lastLook = null;
    public final List<String> botBroke = new ArrayList<>();
    public final List<String> botPlaced = new ArrayList<>();
    public boolean botPlayerFnsSupported = true;
    public final List<String> joinedServers = new ArrayList<>();
    @Override public void joinServer(String address) { joinedServers.add(address); }
    public Boolean serverAuth = null;
    @Override public boolean setServerAuth(boolean online) { serverAuth = online; return true; }
    @Override public String giveBot(String item, int count) {
        if (!botPlayerFnsSupported) return null;
        if ("minecraft:nope".equals(item)) return null;
        botGives.add(count + "x " + item);
        return count + "x " + item;
    }
    @Override public boolean lookBot(double yaw, double pitch) {
        if (!botPlayerFnsSupported) return false;
        lastLook = yaw + "/" + pitch;
        return true;
    }
    @Override public String breakBotBlock(double x, double y, double z) {
        if (!botPlayerFnsSupported) return null;
        botBroke.add(x + "," + y + "," + z);
        return "broke@" + x + "," + y + "," + z;
    }
    @Override public String placeBotBlock(double x, double y, double z) {
        if (!botPlayerFnsSupported) return null;
        botPlaced.add(x + "," + y + "," + z);
        return "placed@" + x + "," + y + "," + z;
    }
    @Override public void tickBot() { botTicks++; }
    public boolean botInvSupported = true;
    @Override public String openBotInventory() { return botInvSupported ? "chest_9x4 -> human screen" : null; }
    /** 供 query_log 用：由测试显式给一个游戏目录（不实现则 core 回 LOG_UNSUPPORTED，与从前一致）。 */
    public String gameDir = null;
    @Override public String gameDirectory() { return gameDir; }
    /** 本机玩家转视角的落点（look 动作）。 */
    public String lastPlayerLook = null;
    @Override public boolean look(double yaw, double pitch) { lastPlayerLook = yaw + "/" + pitch; return true; }
    @Override public void openWorld(String worldName) { openedWorlds.add(worldName); }
    @Override public void chatCommand(String c) { commands.add(c); }
    @Override public boolean isPressed(String key) { return Boolean.TRUE.equals(pressed.get(key)); }
    @Override public void setPressed(String key, boolean down) {
        calls.add("set:" + key + "=" + down);
        pressed.put(key, down);
    }
    @Override public List<String> supportedKeys() {
        return Arrays.asList("forward", "back", "left", "right", "jump", "sneak", "sprint", "attack", "use", "inventory");
    }
}
