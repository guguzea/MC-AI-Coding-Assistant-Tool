package com.bandd.playtest.core;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * **槽位角色表**：由「容器菜单的注册名（menuType）+ 槽位下标」推出该格的 {@code role}
 * 与**玩家槽区间**（{@code playerRange}）。
 *
 * <p>为什么这一段在 **core**（而不是逐档适配层）：角色只取决于**原版菜单的版式**
 * （哪个下标是合成输入格 / 结果格 / 燃料格），与「是 Fabric 还是 NeoForge」无关；
 * 放进 core 有两条直接好处：
 * <ol>
 *   <li>两档**逐字同表**，不会各写一份慢慢漂移；</li>
 *   <li>这份映射能用**纯 JDK 单测**钉死（见 {@code tests/.../GuiActionsTest.java}）——
 *       适配层那半边（Slot.x / Slot.y / 物品）才需要真机。</li>
 * </ol>
 *
 * <p>版式出处 = **逐档 javap -c 实证**（不是记忆；命令与读数见交付报告「② 新 API 的 javap 取证」）：
 * <pre>
 *   fabric 1.21.11（yarn 映射件）：
 *     PlayerScreenHandler    ：addResultSlot(154,28) / addInputSlots(98,18) / 4x ArmorSlot / addPlayerSlots(8,84) / 副手 (40,77)
 *     CraftingScreenHandler  ：getOutputSlot()=slots.get(0)；getInputSlots()=slots.subList(1,10)；insertItem(...,10,46,..)
 *     AbstractFurnaceScreenHandler：Slot(56,17)=料 / FurnaceFuelSlot(56,53)=燃料 / FurnaceOutputSlot(116,35)=成品 / addPlayerSlots(8,84)
 *     GenericContainerScreenHandler：N*9 容器格 + addPlayerSlots(...)
 *     HopperScreenHandler    ：5 容器格 + addPlayerSlots(8,51)
 *     CrafterScreenHandler   ：9x CrafterInputSlot + addPlayerSlots(8,84) + CrafterOutputSlot(134,35)
 *   neoforge 1.20.1（parchment 映射件）：同一批菜单类，id 串与版式逐项一致（见 MenuType 静态块 ldc 常量）
 *   id 串：inventory/crafting/furnace/blast_furnace/smoker/generic_9x1..9x6/generic_3x3/crafter_3x3/
 *          shulker_box/hopper/brewing_stand/anvil/smithing/stonecutter/grindstone/loom/
 *          cartography_table/merchant/beacon/enchantment/lectern
 * </pre>
 *
 * <p><b>诚实边界</b>：表外的 menuType 走**兜底规则**（「末 36 格 = 玩家主背包 27 + 快捷栏 9，
 * 其余 = 容器格」）并在回执里写 {@code roleKnown:false} + {@code roleNote} —— **不假装**认得版式。
 *
 * <p>Java 8 可用（本类无任何 MC / 加载器类型）。
 */
public final class SlotRoles {

    public static final String CRAFT_INPUT = "craft_input";
    public static final String CRAFT_RESULT = "craft_result";
    public static final String FUEL = "fuel";
    public static final String INPUT = "input";
    public static final String OUTPUT = "output";
    public static final String ARMOR = "armor";
    public static final String OFFHAND = "offhand";
    public static final String CONTAINER = "container";
    public static final String PLAYER_MAIN = "player_main";
    public static final String PLAYER_HOTBAR = "player_hotbar";
    public static final String UNKNOWN = "unknown";

    /** 全部 role 取值（供调用方与自己人核对；顺序 = 文档顺序）。 */
    public static final List<String> ALL_ROLES;
    static {
        List<String> l = new ArrayList<String>();
        l.add(CRAFT_INPUT);
        l.add(CRAFT_RESULT);
        l.add(FUEL);
        l.add(INPUT);
        l.add(OUTPUT);
        l.add(ARMOR);
        l.add(OFFHAND);
        l.add(CONTAINER);
        l.add(PLAYER_MAIN);
        l.add(PLAYER_HOTBAR);
        l.add(UNKNOWN);
        ALL_ROLES = java.util.Collections.unmodifiableList(l);
    }

    private SlotRoles() {}

    /** 玩家主背包格数（27 = 3x9），后接快捷栏 9 格。 */
    private static final int PLAYER_MAIN_COUNT = 27;
    private static final int PLAYER_HOTBAR_COUNT = 9;
    private static final int PLAYER_TOTAL = PLAYER_MAIN_COUNT + PLAYER_HOTBAR_COUNT;

    /**
     * 由 menuType + 下标推 role（表外走兜底）。
     *
     * @param menuType  容器菜单注册名（如 {@code minecraft:crafting}）；null / 未知 ⇒ 兜底
     * @param index     槽位下标（0 起）
     * @param slotCount 本菜单总槽位数（兜底规则要用）
     */
    public static String roleOf(String menuType, int index, int slotCount) {
        List<String> roles = rolesFor(menuType, slotCount);
        if (index < 0 || index >= roles.size()) return UNKNOWN;
        return roles.get(index);
    }

    /** 该菜单类型是否命中**精确表**（false = 走兜底）。 */
    public static boolean knownMenu(String menuType) {
        if (menuType == null) return false;
        // 特殊版式（背包屏带结果/合成/护甲/副手；熔炉一族；合成器）也各有独立分支 ⇒ 同属精确表。
        if ("minecraft:inventory".equals(menuType) || "minecraft:crafting".equals(menuType)
                || "minecraft:furnace".equals(menuType) || "minecraft:blast_furnace".equals(menuType)
                || "minecraft:smoker".equals(menuType) || "minecraft:crafter_3x3".equals(menuType)) {
            return true;
        }
        return fixedSpecOf(menuType) != null;
    }

    /**
     * 完整角色列表（长度 = 表定义的长度，可能短于 / 长于 slotCount；{@link #decorate} 负责对齐）。
     */
    public static List<String> rolesFor(String menuType, int slotCount) {
        List<String> r = new ArrayList<String>();
        // ---- 1) 玩家自己的背包屏（0 结果 / 1-4 合成 / 5-8 护甲 / 9-44 主+快捷 / 45 副手）----
        if ("minecraft:inventory".equals(menuType)) {
            r.add(CRAFT_RESULT);
            for (int i = 0; i < 4; i++) r.add(CRAFT_INPUT);
            for (int i = 0; i < 4; i++) r.add(ARMOR);
            addPlayerSlots(r);
            r.add(OFFHAND);
            return pad(r, slotCount, UNKNOWN);
        }
        // ---- 2) 工作台（0 结果 / 1-9 合成 3x3 / 10-45 玩家）----
        if ("minecraft:crafting".equals(menuType)) {
            r.add(CRAFT_RESULT);
            for (int i = 0; i < 9; i++) r.add(CRAFT_INPUT);
            addPlayerSlots(r);
            return pad(r, slotCount, UNKNOWN);
        }
        // ---- 3) 熔炉一族（0 料 / 1 燃料 / 2 成品 / 3-38 玩家）----
        if ("minecraft:furnace".equals(menuType)
                || "minecraft:blast_furnace".equals(menuType)
                || "minecraft:smoker".equals(menuType)) {
            r.add(INPUT);
            r.add(FUEL);
            r.add(OUTPUT);
            addPlayerSlots(r);
            return pad(r, slotCount, UNKNOWN);
        }
        // ---- 4) 合成器（0-8 合成输入 / 9-44 玩家 / 45 产出）----
        if ("minecraft:crafter_3x3".equals(menuType)) {
            for (int i = 0; i < 9; i++) r.add(CRAFT_INPUT);
            addPlayerSlots(r);
            r.add(CRAFT_RESULT);
            return pad(r, slotCount, UNKNOWN);
        }
        // ---- 5) 精确表里「N 个容器格 + 玩家」的机器 ----
        List<String> fixed = fixedSpecOf(menuType);
        if (fixed != null) {
            r.addAll(fixed);
            addPlayerSlots(r);
            return pad(r, slotCount, UNKNOWN);
        }
        // ---- 6) 兜底：末 36 格当玩家背包，其余当容器格（**不假装认得版式**）----
        int playerFrom = Math.max(0, slotCount - PLAYER_TOTAL);
        for (int i = 0; i < slotCount; i++) {
            r.add(i < playerFrom ? CONTAINER : playerRole(i - playerFrom));
        }
        return r;
    }

    /** 精确表里「固定容器格」那一截（不含玩家槽）；不在表里回 null。 */
    private static List<String> fixedSpecOf(String menuType) {
        if (menuType == null) return null;
        if ("minecraft:generic_9x1".equals(menuType)) return n(CONTAINER, 9);
        if ("minecraft:generic_9x2".equals(menuType)) return n(CONTAINER, 18);
        if ("minecraft:generic_9x3".equals(menuType)) return n(CONTAINER, 27);
        if ("minecraft:generic_9x4".equals(menuType)) return n(CONTAINER, 36);
        if ("minecraft:generic_9x5".equals(menuType)) return n(CONTAINER, 45);
        if ("minecraft:generic_9x6".equals(menuType)) return n(CONTAINER, 54);
        if ("minecraft:generic_3x3".equals(menuType)) return n(CONTAINER, 9);
        if ("minecraft:shulker_box".equals(menuType)) return n(CONTAINER, 27);
        if ("minecraft:hopper".equals(menuType)) return n(CONTAINER, 5);
        if ("minecraft:lectern".equals(menuType)) return n(CONTAINER, 1);
        if ("minecraft:brewing_stand".equals(menuType)) {
            // 3 个药水格（PotionSlot）+ 1 个原料格（IngredientSlot）+ 1 个燃料格（FuelSlot）
            List<String> l = n(INPUT, 4);
            l.add(FUEL);
            return l;
        }
        if ("minecraft:anvil".equals(menuType)) return roles(INPUT, INPUT, OUTPUT);
        if ("minecraft:smithing".equals(menuType)) return roles(INPUT, INPUT, INPUT, OUTPUT);
        if ("minecraft:stonecutter".equals(menuType)) return roles(INPUT, OUTPUT);
        if ("minecraft:grindstone".equals(menuType)) return roles(INPUT, INPUT, OUTPUT);
        if ("minecraft:loom".equals(menuType)) return roles(INPUT, INPUT, INPUT, OUTPUT);
        if ("minecraft:cartography_table".equals(menuType)) return roles(INPUT, INPUT, OUTPUT);
        if ("minecraft:merchant".equals(menuType)) return roles(INPUT, INPUT, OUTPUT);
        if ("minecraft:beacon".equals(menuType)) return roles(INPUT);
        if ("minecraft:enchantment".equals(menuType)) return roles(INPUT, INPUT);
        return null;
    }

    private static void addPlayerSlots(List<String> r) {
        for (int i = 0; i < PLAYER_MAIN_COUNT; i++) r.add(PLAYER_MAIN);
        for (int i = 0; i < PLAYER_HOTBAR_COUNT; i++) r.add(PLAYER_HOTBAR);
    }

    private static String playerRole(int i) {
        return i < PLAYER_MAIN_COUNT ? PLAYER_MAIN : PLAYER_HOTBAR;
    }

    private static List<String> n(String role, int count) {
        List<String> l = new ArrayList<String>();
        for (int i = 0; i < count; i++) l.add(role);
        return l;
    }

    private static List<String> roles(String... rs) {
        List<String> l = new ArrayList<String>();
        for (String s : rs) l.add(s);
        return l;
    }

    /** 把固定表对齐到 slotCount（短了补 UNKNOWN，长了截断）—— **如实**，不硬塞。 */
    private static List<String> pad(List<String> r, int slotCount, String filler) {
        while (r.size() < slotCount) r.add(filler);
        while (r.size() > slotCount) r.remove(r.size() - 1);
        return r;
    }

    /**
     * 把适配层给的**原始槽位 JSON**（{@code {screen,menuType,containerId,slots:[{index,x,y,empty,itemId?,count?}]}}）
     * 规范化成回执：补 {@code role} / {@code playerRange} / {@code slotCount} / 角色计数 / 口径说明。
     *
     * <p>为什么不直接原样透出：{@link Json#parseObject} 把 JSON 数字一律读成 {@code Double}
     * ⇒ 原样透出会让 {@code count:64} 变成 {@code 64.0}（调用方按整数比对就"对不上"）。
     * 与 {@code query_inventory} 的 {@code parseInventory} 同一套口径。
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> decorate(Map<String, Object> raw) {
        Map<String, Object> src = raw == null ? new LinkedHashMap<String, Object>() : raw;
        String screen = src.get("screen") == null ? null : String.valueOf(src.get("screen"));
        String menuType = src.get("menuType") == null ? null : String.valueOf(src.get("menuType"));
        Object rawSlots = src.get("slots");
        List<Object> in = (rawSlots instanceof List) ? (List<Object>) rawSlots : new ArrayList<Object>();
        int slotCount = in.size();
        List<String> roles = rolesFor(menuType, slotCount);

        List<Object> out = new ArrayList<Object>();
        Map<String, Object> counts = new LinkedHashMap<String, Object>();
        Set<String> seenRoles = new LinkedHashSet<String>();
        int playerFrom = -1;
        int playerTo = -1;
        for (int i = 0; i < slotCount; i++) {
            Map<String, Object> e = (in.get(i) instanceof Map)
                    ? new LinkedHashMap<String, Object>((Map<String, Object>) in.get(i))
                    : new LinkedHashMap<String, Object>();
            // index 以**列表位置**为准（适配层给了也以位置对齐，防止两者漂移而不报）
            Object statedIndex = e.get("index");
            int idx = (statedIndex instanceof Number) ? ((Number) statedIndex).intValue() : i;
            if (idx != i) {
                e.put("indexStatedByAdapter", Integer.valueOf(idx));
            }
            e.put("index", Integer.valueOf(i));
            String role = (i < roles.size()) ? roles.get(i) : UNKNOWN;
            e.put("role", role);
            boolean empty = Boolean.TRUE.equals(e.get("empty")) || e.get("itemId") == null;
            e.put("empty", Boolean.valueOf(empty));
            if (empty) {
                e.put("itemId", null);
                e.put("count", Integer.valueOf(0));
            } else {
                e.put("itemId", String.valueOf(e.get("itemId")));
                Object c = e.get("count");
                e.put("count", c instanceof Number ? (Object) Integer.valueOf(((Number) c).intValue()) : null);
                e.put("idKind", "registryName");
            }
            Object xv = e.get("x");
            e.put("x", xv instanceof Number ? (Object) Integer.valueOf(((Number) xv).intValue()) : null);
            Object yv = e.get("y");
            e.put("y", yv instanceof Number ? (Object) Integer.valueOf(((Number) yv).intValue()) : null);
            e.put("playerSlot", Boolean.valueOf(
                    PLAYER_MAIN.equals(role) || PLAYER_HOTBAR.equals(role)));
            if (PLAYER_MAIN.equals(role) || PLAYER_HOTBAR.equals(role)) {
                if (playerFrom < 0) playerFrom = i;
                playerTo = i;
            }
            counts.put(role, Integer.valueOf(((Number) counts.getOrDefault(role, Integer.valueOf(0))).intValue() + 1));
            seenRoles.add(role);
            out.add(e);
        }

        boolean known = knownMenu(menuType);
        Map<String, Object> data = new LinkedHashMap<String, Object>();
        data.put("screen", screen);
        data.put("menuType", menuType);
        Object cid = src.get("containerId");
        data.put("containerId", cid instanceof Number ? (Object) Integer.valueOf(((Number) cid).intValue()) : null);
        data.put("slotCount", Integer.valueOf(slotCount));
        if (playerFrom >= 0) {
            Map<String, Object> pr = new LinkedHashMap<String, Object>();
            pr.put("from", Integer.valueOf(playerFrom));
            pr.put("to", Integer.valueOf(playerTo));
            pr.put("note", "主背包 27 格后接快捷栏 9 格（共 36 格）");
            data.put("playerRange", pr);
        } else {
            data.put("playerRange", null);
            data.put("playerRangeNote", "本菜单里没识别出玩家槽（角色表未命中该 menuType）");
        }
        data.put("roles", counts);
        data.put("roleKnown", Boolean.valueOf(known));
        data.put("roleNote", known
                ? "role 由「menuType + 下标」的**原版版式精确表**推出（javap -c 实证，见 SlotRoles 类注释）"
                : "该 menuType 不在精确表里 ⇒ 走**兜底规则**（末 36 格当玩家主背包 27 + 快捷栏 9，"
                        + "其余当容器格）—— **不假装**认得这一档的版式；roleKnown:false");
        data.put("rolesAll", new ArrayList<Object>(seenRoles));
        data.put("slotCountNote", "slotCount = 本菜单的槽位总数（含玩家 36 格）");
        data.put("idKind", "registryName");
        data.put("idKindNote", "itemId 走现代注册名（如 minecraft:stone）；"
                + "桥路线（forge 1.7.10-1.12.2）同类字段给的是 unlocalizedName（如 item.stone）");
        data.put("slots", out);
        return data;
    }
}
