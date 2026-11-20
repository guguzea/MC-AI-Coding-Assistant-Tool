package com.bandd.playtest.core;

/**
 * core ↔ 逐档适配层 的唯一接口。**core 里不许出现任何 net.minecraft.* / 加载器类型**
 * （这样同一份 core 源码可以喂给每个 (加载器, MC 版本) 的 adapter）。
 */
public interface GameBridge {
    String platform();

    String mcVersion();

    /** 玩家与世界都在场（桥协议里的 ready）。 */
    boolean ready();

    /** 客户端 tick 调用一次（core 的队列在这里排空）。 */
    void tick();

    /** 玩家/世界读数（JSON 片段字符串）。 */
    String playerStateJson();

    /** 当前打开的界面名；无界面返回 null。 */
    String screenName();

    /** 截图，返回落盘路径。 */
    String screenshotPath();

    /**
     * 召唤**可见的**化身（第二个角色）。
     * 返回载体名（如 "fake_player" / "mannequin"）；本档或当前环境不支持则返回 null。
     */
    String spawnBot(String name, double distance);

    /** 把化身移到绝对坐标（可见性由适配层负责，core 不碰 MC）。 */
    void moveBotTo(double x, double y, double z);

    /**
     * 每个客户端 tick 驱动一次化身（core 调用）。
     * 为什么需要：**FakePlayer.tick() 是 NeoForge 置空的**（字节码只有 `return`）⇒ 玩家自身的
     * 捡拾/物理逻辑永不运行；这一钩子用来显式补上（如把附近掉落物喂给它）。
     */
    void tickBot();

    // ---- 化身的"玩家功能"（服务端 ServerPlayerGameMode 面；形状复用仓库已核实的 driver 调用）----
    /** 给化身发物品。item = "minecraft:diamond" 这类 id；失败返回 null。 */
    String giveBot(String item, int count);

    /** 把化身转向（yaw/pitch，MC 约定）。 */
    boolean lookBot(double yaw, double pitch);

    /** 化身挖掉一个方块（创造模式即时；对应仓库 driver 的 destroyBlock 口径）。 */
    String breakBotBlock(double x, double y, double z);

    /** 化身用手上的方块对着目标放（对应仓库 driver 的 useItemOn 口径）。 */
    String placeBotBlock(double x, double y, double z);

    /**
     * 开关**本机服务端**的会话认证（只对单人/局域网世界有意义）。
     * 为什么需要：集成服务器在构造里**强制** usesAuthentication(true)（字节码 iconst_1 实证），
     * 而开发环境的第二客户端是**离线会话** ⇒ 必然 "Invalid session"。关掉它，离线客户端才能进。
     */
    boolean setServerAuth(boolean online);

    /** 作为**真客户端**连到一个服务器/局域网世界（第二客户端路线的入口）。 */
    void joinServer(String address);

    /** 收回化身。 */
    void despawnBot();

    /**
     * 把**化身的物品栏**开到**真人**的屏幕上（假玩家自己开不了 GUI —— openMenu 被 NeoForge 写成空实现）。
     * 返回载体说明；不支持则 null。
     */
    String openBotInventory();

    /**
     * 取走**新收到**的聊天（自上次调用以来），并清空缓冲。
     * 适配层负责挂聊天事件；core 只做搬运与暴露。
     */
    java.util.List<String> drainChat();

    /** 进入/加载一个世界（driver 面：AI 或玩家都可用）。 */
    void openWorld(String worldName);

    /** 以玩家身份发一条命令（命令级动作）。 */
    void chatCommand(String command);

    /** 读**真人**是否正按着这个逻辑键（仲裁用）。 */
    boolean isPressed(String key);

    /** 写按键（玩家级动作）。 */
    void setPressed(String key, boolean down);

    /** 该档支持哪些逻辑键。 */
    java.util.List<String> supportedKeys();

    /**
     * **本档做不了**的动作名（供 /status 如实自报）。默认空 = 全都做得了。
     *
     * 为什么需要它：`PlaytestCore.status()` 原本**无条件**报 `Capabilities.all()` ⇒ 一个 MC 侧
     * 全 fail-closed 的档（如 ModLoader 三档：玩家/位置/截图/读方块/按键都没有出处）会在
     * `/status` 里**谎报**自己会按按键、会截图 —— 而 `/execute` 实际一律失败。
     * 「能力自报」谎报比没有自报更糟：调用方会据此排计划。
     *
     * Java 8 default 方法 ⇒ **现有适配层一行都不用改**（不实现 = 空 = 行为与从前完全一致）。
     * 动作名取自 {@link Capabilities}。
     */
    /**
     * **本机玩家**转视角（不是化身）—— `bot_look` 是给假玩家化身的，真客户端的「身体」就是 `mc.player` 自己。
     *
     * Java 8 default 方法 ⇒ **现有适配层一行都不用改**（不实现 = false = 行为与从前完全一致，
     * 且 `/status` 会把它列进 `actionsUnavailable`）。
     *
     * 语义：设玩家朝向（yaw ∈ [-180,180]，pitch ∈ [-90,90]）。真客户端里设完由客户端 tick
     * 自行把朝向发出去（多人/局域网时服务端看得到）。
     */
    default boolean look(double yaw, double pitch) {
        return false;
    }

    /**
     * **关掉当前界面**（本机客户端）。
     *
     * 为什么必须有：**有界面开着时 MC 不处理输入** —— 实测（forge 1.20.1 真机）
     * 聊天框/暂停菜单开着时按住 forward，位移恒为 0.000 格，而动作仍回 ok。
     * 尤其致命的是 pauseOnLostFocus（MC 默认 true）：**真人窗口在前台时，AI 客户端失焦
     * 会自己弹出 PauseScreen** ⇒ 驱动面整个失能。关掉它（options.txt）能缓解，但界面
     * 仍可能因别的原因出现 ⇒ 驱动前先 close_screen 是最稳的一步。
     *
     * Java 8 default ⇒ 未实现的档行为与从前一致（返回 false ⇒ CLOSE_UNSUPPORTED）。
     */
    /**
     * **破坏准星所指的方块**（本机客户端），返回被破坏的坐标串或 null。
     *
     * 为什么不用模拟 keyAttack：实测（forge 1.20.1 真机）hitResult 确实是 BLOCK
     * （截图里准星带选框）、attack 键 down 且 click 也发了、仲裁 ownedKeys=1，
     * 但方块 6 秒不破 —— 模拟按键那条链在挖矿上不可靠。
     * 改为直接调游戏自己的破坏 API（与仓库 driver 的 break 同路）。
     */
    default String mineLookingAt() {
        return null;
    }

    default boolean closeScreen() {
        return false;
    }

    default java.util.List<String> unavailableActions() {
        return java.util.Collections.emptyList();
    }

    /**
     * **本档有没有接到「游戏内设置页面」**（Cloth Config）。默认 {@code false} = 没有。
     *
     * <p>为什么默认 false、且必须由适配层自报：设置页面是**加载器相关**代码
     * （Fabric 走 ModMenu 的 {@code ModMenuApi} / Forge 走 {@code ConfigScreenHandler}），
     * core 判不出来。默认 false ⇒ 其余 54 档（含 11 个 Cloth 上游根本没有件的档）
     * **一行不改**，{@code /status} 里也**如实**报「本档不支持图形设置，请手改该文件」，
     * 而不是谎报自己会画界面。
     *
     * <p>只有真的把设置页面接上的档（fabric-1.21.11 / neoforge-1.20.1）才覆盖它报 true。
     */
    default boolean configGuiAvailable() {
        return false;
    }

    /** 设置页面由哪个件提供（如 {@code "cloth-config 21.11.153"}）；没接就回 null。 */
    default String configGuiProvider() {
        return null;
    }

    /**
     * **打开方式**的人话说明。
     * 为什么必须单独一位：Fabric 上 ModMenu 只是社区惯例、**不是本模组的必需前置**
     * ⇒ 除了 ModMenu 那条路，还另给一个不依赖第三方的打开方式（全局按键），这里如实报出来。
     */
    default String configGuiOpenHint() {
        return null;
    }

    /**
     * **打开游戏内设置页面**（客户端动作；{@code open_settings} 的落点）。
     *
     * <p>为什么由适配层做而不是 core：打开方式**逐档不同** —— fabric 走 ModMenu 的工厂 +
     * 全局按键 O 的同一个 Screen 构造器，neoforge 走 Forge 自带的
     * {@code ConfigScreenHandler.ConfigScreenFactory} + 聊天栏 {@code !settings}；
     * core 连 {@code Screen} 这个类型都不许碰。
     *
     * <p>返回**屏的类名**（{@code getClass().getSimpleName()}，便于调用方用 {@code query_widgets}
     * 交叉验证「开的是不是真的设置屏」）。**没造出来就返回 null**（未初始化 / Cloth 件缺失 /
     * 构建抛异常）—— core 据此如实回 {@code SETTINGS_GUI_UNSUPPORTED}，**绝不假装打开**。
     *
     * <p>Java 8 default 方法 ⇒ 其余 54 档（含 11 个 Cloth 上游根本没有件的档）**一行不改**，
     * 行为与从前逐字一致（{@code /status} 的 {@code actionsUnavailable} 里如实列着它）。
     */
    default String openSettingsScreen() {
        return null;
    }

    /**
     * **本机客户端当前所处的阶段**：`menu` | `singleplayer` | `connecting` | `multiplayer` 之一；
     * 判不出来返回 null。
     *
     * 为什么需要：`ready()` 的字节码只是 `Minecraft.getInstance() != null && mc.player != null
     * && mc.level != null` ⇒ **在 AI 自己的单人世界里也是 true**（本机实测）。外部脚本若
     * 「轮询 ready 直到 true」来判「AI 是否进了人类的世界」，会在 AI 自己的单人世界里**提前判绿**。
     * 这个字段必须能区分「自己的单人世界」与「已连上别人的服务器（含局域网）」。
     *
     * Java 8 default 方法 ⇒ **未实现的档行为与从前完全一致**（返回 null）。
     */
    default String clientPhase() {
        return null;
    }

    /**
     * 本机集成服务器（单人/局域网世界的服务端）**当前实际**监听的端口；没有则 0。
     *
     * 为什么需要：人类实例的日志会**残留旧会话**的 `Started serving on <port>` 行（本机实测：
     * 11:57 的行留在 13:02 收尾的日志里）⇒ 外部脚本「刮日志取端口」会把**旧端口**拿去 join。
     * 这个值必须来自**当前活着的服务器对象**，而不是日志文本。
     *
     * Java 8 default 方法 ⇒ **未实现的档行为与从前完全一致**（返回 0）。
     */
    default int lanPort() {
        return 0;
    }

    /**
     * 执行一条命令并返回**诚实回执**（解析结果 + 执行结果 + 错误位置）。
     *
     * 为什么需要它：{@code chat_command} 原来只回 {@code {"sent":"<原命令>"}} ⇒ 一条跑了但什么都没做的
     * 命令，和一条根本没解析的命令长得一模一样。适配层走**客户端命令派发器**
     * （{@code CommandDispatcher.parse} + {@code execute}）拿到 {@code ParseResults} 与执行结果，
     * 塞进 {@link CommandResult}；core 只负责把它放进回执（**保留原 {@code sent} 字段**）。
     *
     * Java 8 default 方法 ⇒ **未实现的档行为与从前逐字一致**（返回 null ⇒ core 退回旧路：只回 sent）。
     * 被禁列过滤的命令由 core 在调用本方法**之前**拦下（仍回 COMMAND_FORBIDDEN）。
     */
    default CommandResult runCommand(String command) {
        return null;
    }

    /**
     * 当前 Screen 的**控件清单**（JSON 数组字符串）；没有界面时返回 {@code "[]"}
     * —— **空清单不是错误**。每项含控件类名 / 坐标 / 尺寸 / 渲染文本 / 可用 / 可见。
     *
     * Java 8 default ⇒ 未实现的档行为与从前一致（原来也没有这个动作，返回空清单）。
     */
    default String widgetsJson() {
        return "[]";
    }

    /**
     * **游戏实例目录**（用于推 {@code logs/latest.log}）；本档给不出返回 null。
     * 为什么由适配层给：目录只有 MC 侧知道（如 {@code Minecraft.gameDirectory}），core 不碰 MC。
     */
    default String gameDirectory() {
        return null;
    }

    // ==================================================================
    // 状态器面（query_state / query_map）—— 取值口 + 自报位
    // 与 look / closeScreen / widgetsJson 同套路：**全部 default**
    // ⇒ 其余 54 档一行不改、行为与从前逐字一致（= 如实「不支持」）。
    // ==================================================================

    /**
     * 本档是否提供状态器所需的取值面（{@link #blockAt} + {@link #topSolidY}）。
     * 默认 {@code false} = 不支持。
     *
     * 为什么必须单独一个自报位：那两个方法各有 default 实现（null / Integer.MIN_VALUE），
     * **不可能从返回值区分**「本档压根没实现」与「此刻这一格真取不到」。
     * {@code PlaytestCore.status()} 与 {@code dispatch} 都读它 ⇒ 老档在 /status 里
     * 如实把自己报进 {@code actionsUnavailable}，而不是谎报「会画地图」。
     */
    default boolean stateMapCapable() {
        return false;
    }

    /**
     * 坐标处方块的**注册名/id 字符串**（如 {@code "minecraft:stone"}；空气也照实回
     * {@code "minecraft:air"}）。**越界 / 未加载 / 本档不支持一律回 null** ⇒ core 当「未知」。
     *
     * 为什么必须 null 而不是空串/air：未加载的区块里 MC 的 {@code getBlockState} 会回
     * 「虚空空气」而不是报错（World/Level 的 isChunkLoaded/hasChunk 才是真判据）
     * ⇒ 不显式判「加载没加载」，AI 会把没加载的地方读成一片空气。
     */
    default String blockAt(int x, int y, int z) {
        return null;
    }

    /**
     * 该列**最高非空气方块**的 Y（地表高度）；越界 / 未加载 / 本档不支持回
     * {@link Integer#MIN_VALUE}。
     *
     * 为什么由适配层给而不是 core 逐层扫：逐层扫一列要几十次 {@code getBlockState}，
     * 48×48 就是十几万次；适配层一行高度图查询（getTopY / getHeight）就够。
     */
    default int topSolidY(int x, int z) {
        return Integer.MIN_VALUE;
    }

    /**
     * 世界环境（时间/天气）JSON 片段；本档取不到回 {@code null}（core 留 null **并如实说明**，
     * 不编 0=白天）。
     *
     * 形状（缺字段留 null，不编）：
     * {@code {"timeOfDay":<0..23999|null>,"dayTime":<long|null>,"raining":<bool|null>,"thundering":<bool|null>}}
     */
    default String worldEnvJson() {
        return null;
    }

    // ==================================================================
    // 实体扫描面（query_map / query_state 的 entities 叠加层）
    // 与 stateMapCapable 同套路：**全部 default** ⇒ 其余 54 档一行不改、
    // 行为与从前逐字一致（= 如实「不支持」，核心回 entitiesNote，不假装有）。
    // ==================================================================

    /**
     * 本档是否提供**实体扫描面**（{@link #nearbyEntitiesJson}）。默认 {@code false} = 不支持。
     *
     * <p>为什么必须单独一个自报位（与 {@link #stateMapCapable()} 完全同一个理由）：
     * {@code nearbyEntitiesJson} 的 default 是 {@code null}，**不可能从返回值区分**
     * 「本档压根没实现」与「此刻真的一只实体也没有」—— 前者要如实写
     * {@code entitiesNote} 说「本档不支持」，后者要如实给**空层**。两者都长成 null。
     *
     * <p>另外它还给 {@code /status} 一个**不碰 MC 的**取值口：{@code /status} 跑在 HTTP 线程上
     * （见 {@link HttpApi}），不能在那里调 {@code nearbyEntitiesJson} 去「探测」能力
     * （那是跨线程读游戏状态）。自报位是常量 ⇒ 随便读。
     */
    default boolean entityScanCapable() {
        return false;
    }

    /**
     * 玩家周围 {@code radius}（**格**，三维直线距离）内**已加载**的实体明细（JSON 片段）；
     * 本档不支持 / 当前不在世界里一律回 {@code null}（core 如实说明，不假装有）。
     *
     * <p>形状（**只报取到的**，取不到就不报，不许编）：
     * <pre>
     * {"count":2,"entities":[
     *    {"type":"minecraft:zombie","cls":"Zombie","x":8.5,"y":65.0,"z":-6.5},
     *    {"type":"minecraft:item","cls":"ItemEntity","x":9.1,"y":65.0,"z":-7.2}]}
     * </pre>
     * <ul>
     *   <li>{@code type} = 该档的**实体注册名**（现代档 {@code minecraft:zombie}；老档可能是别的口径，
     *       逐档如实报，core 原样透出）；{@code cls} = 实体类简单名（诊断用）；</li>
     *   <li>坐标 = 世界绝对坐标（不是相对玩家的）；</li>
     *   <li>**默认应排除玩家自己**（与桥路线 {@code query_nearby_entities} 一致：{@code o == mc.player} 跳过）；</li>
     *   <li>本档只能看到**已加载**的实体 —— 取到啥报啥，**不承诺**「半径内全都看得到」。</li>
     * </ul>
     *
     * <p>Java 8 default ⇒ 未实现的档行为与从前逐字一致（返回 null）。
     */
    default String nearbyEntitiesJson(double radius) {
        return null;
    }

    // ==================================================================
    // 背包面（query_inventory / query_inventory_slot）
    // 形状**与桥路线对齐**（forge 1.7.10–1.12.2 的 query_inventory/query_inventory_slot）。
    // 同样全部 default ⇒ 其余 54 档一行不改。
    // ==================================================================

    /**
     * 本档是否提供**读背包面**（{@link #inventoryJson}）。默认 {@code false} = 不支持。
     *
     * <p>理由同 {@link #entityScanCapable()}：{@code null} 无法区分「没实现」与「取不到」，
     * 且 {@code /status}（HTTP 线程）不能现场调 {@code inventoryJson} 去探测。
     */
    default boolean inventoryCapable() {
        return false;
    }

    /**
     * 玩家背包内容（JSON 片段）。本档不支持 / 当前没有玩家一律回 {@code null}。
     *
     * <p>形状（**与桥路线 {@code query_inventory} 同形**，额外三个玩家真用得上的字段）：
     * <pre>
     * {"size":41,
     *  "slots":[{"slot":0,"itemId":"minecraft:stone","idKind":"registryName","count":64}, ...],  // **只列非空格**
     *  "selectedSlot":3,
     *  "mainHand":{"slot":3,"itemId":"minecraft:diamond_sword","idKind":"registryName","count":1},
     *  "hotbar":[{"slot":0,"empty":true}, {"slot":1,"itemId":"minecraft:stone","idKind":"registryName","count":64}, ...]}
     * </pre>
     * <ul>
     *   <li>{@code slots} **跳过空格子**（与桥一致）；每项含 {@code slot/itemId/idKind/count}；</li>
     *   <li>{@code idKind} = {@code itemId} 是哪个口径的名字。现代档给 {@code "registryName"}
     *       （如 {@code minecraft:stone}）；**桥路线给的是 {@code "unlocalizedName"}**（如 {@code item.stone}）
     *       —— 两个口径**逐字不同源**，调用方按 idKind 分派，别当同一个串比；</li>
     *   <li>{@code mainHand} = 主手那格（空格 / 没有玩家 ⇒ null）；{@code selectedSlot} = 选中的快捷栏下标；
     *       {@code hotbar} = 前 9 格（含空格，每项带 {@code empty}）；</li>
     *   <li>本档取不到的字段**留空 / 不报**，不许编 0。</li>
     * </ul>
     *
     * <p>Java 8 default ⇒ 未实现的档行为与从前逐字一致（返回 null ⇒ core 回
     * {@code INVENTORY_UNSUPPORTED}，并在 {@code /status} 的 {@code actionsUnavailable} 里如实列着）。
     */
    default String inventoryJson() {
        return null;
    }

    // ==================================================================
    // [T19] 「点屏幕 / 操作容器」一族（query_slots / click_slot / click_widget / use_on / place_block）
    // 与 look / closeScreen / widgetsJson 同套路：**全部 default** ⇒ 其余 54 档一行不改、
    // 行为与从前逐字一致（= 如实「不支持」，/status 里列进 actionsUnavailable）。
    // ==================================================================

    /**
     * 本档是否实现「点屏幕 / 操作容器」一族（见 {@link Capabilities#GUI_ACTIONS}）。
     * 默认 {@code false} = 不支持。
     *
     * <p>为什么必须单独一个自报位（与 {@link #stateMapCapable()} / {@link #inventoryCapable()}
     * 完全同一个理由）：这些方法的 default 各回 null / fail，**不可能从返回值区分**
     * 「本档压根没实现」与「此刻真没有界面 / 真点不动」—— 两者都长成失败。
     * 另外 {@code /status} 跑在 HTTP 线程上（见 {@link HttpApi}），不能在那里现场调
     * {@code slotsJson()} 去「探测」能力（那是跨线程读游戏状态）。自报位是常量 ⇒ 随便读。
     */
    default boolean guiActionCapable() {
        return false;
    }

    /**
     * **当前打开界面的槽位**（JSON 对象字符串）；**没有界面 / 界面上没有槽位菜单** 回 {@code null}。
     *
     * <p>为什么必须有它：合成格、熔炉的料与燃料、箱子里的东西**不是控件** ——
     * {@link #widgetsJson()} 一个都读不到。所以「能读状态」并不等于「看得见容器里的东西」。
     *
     * <p>形状（**适配层只给原始事实**；{@code role} / {@code playerRange} 由 core 的
     * {@link SlotRoles} 按 menuType+下标补，保证两档逐字同表）：
     * <pre>
     * {"screen":"CraftingScreen","menuType":"minecraft:crafting","containerId":0,
     *  "slots":[{"index":0,"x":124,"y":35,"empty":true},
     *           {"index":1,"x":30,"y":17,"empty":false,"itemId":"minecraft:oak_planks","count":3},
     *           ...]}
     * </pre>
     * <ul>
     *   <li>{@code screen} = 界面类简单名；{@code menuType} = 菜单注册名（{@code Registries.SCREEN_HANDLER}
     *       / {@code BuiltInRegistries.MENU} 的 id）；{@code containerId} = 菜单的 syncId / containerId；</li>
     *   <li>每项：{@code index}（下标）、{@code x}/{@code y}（**Slot 自己的坐标**，
     *       相对容器界面左上角 —— 不减去界面 leftPos/topPos）、{@code empty}、
     *       非空时 {@code itemId}（现代注册名）+ {@code count}；</li>
     *   <li>取不到的字段**不报**（core 会如实留 null / 0），**不许编**。</li>
     * </ul>
     *
     * <p>Java 8 default ⇒ 未实现的档行为与从前逐字一致（返回 null ⇒ core 回
     * {@code GUI_ACTIONS_UNSUPPORTED}，不假装空列表）。
     */
    default String slotsJson() {
        return null;
    }

    /**
     * **点槽位**（{@code click_slot}）—— 走**客户端交互管理器**这条现成通路
     * （fabric = {@code ClientPlayerInteractionManager#clickSlot}；neoforge =
     * {@code MultiPlayerGameMode#handleInventoryMouseClick}）。
     *
     * <p>语义**照原版**：{@code button=0} + shift=false ⇒ PICKUP（左键，拿起/放下整叠）；
     * {@code button=1} ⇒ PICKUP（右键，拿一半 / 放一个）；{@code shift=true} ⇒ QUICK_MOVE
     * （用原版的点击类型枚举，**不**另造一套）。
     *
     * <p>**fail-loud**（{@link GuiResult}）：没开界面 ⇒ {@code NO_SCREEN_OPEN}；
     * 下标越界 ⇒ {@code SLOT_OUT_OF_RANGE}（core 已先拦一道，这里是**第二道** ——
     * 适配层知道本档 slotCount）。**不许静默当成功**。
     */
    default GuiResult clickSlot(int slot, int button, boolean shift) {
        return GuiResult.fail(GuiResult.UNSUPPORTED, "本档未实现 click_slot（GameBridge#clickSlot）");
    }

    /**
     * **点控件**（{@code click_widget}）：{@code index} = {@link #widgetsJson()} 列表里的下标。
     *
     * <p>做法**照真实点击的代码路径**：算出该控件中心，调**界面的鼠标点击入口**
     * （fabric {@code Screen.mouseClicked(Click,boolean)} / neoforge
     * {@code Screen.mouseClicked(double,double,int)}）—— 这样按钮、页签、滑块都能按；
     * **不是** OS 级按键 / 鼠标注入。
     *
     * <p>fail-loud：没界面 ⇒ {@code NO_SCREEN_OPEN}；下标越界 ⇒ {@code WIDGET_OUT_OF_RANGE}；
     * 该控件不可点（不可见 / 被禁用 / 这一项不是可点控件）⇒ {@code WIDGET_NOT_CLICKABLE}；
     * 界面入口回 false ⇒ {@code WIDGET_CLICK_REJECTED}。
     */
    default GuiResult clickWidget(int index) {
        return GuiResult.fail(GuiResult.UNSUPPORTED, "本档未实现 click_widget（GameBridge#clickWidget）");
    }

    /**
     * **玩家朝某个方块右键**（{@code use_on}；用于开工作台 / 熔炉 / 箱子，以及按按钮）。
     *
     * <p>语义 = 原版「使用物品于方块」：先在客户端把朝向对准目标方块，再走交互通路
     * （fabric {@code ClientPlayerInteractionManager#interactBlock}；neoforge
     * {@code MultiPlayerGameMode#useItemOn}）。**不**模拟 OS 输入。
     *
     * <p>fail-loud：不在世界里 ⇒ {@code NOT_IN_WORLD}；超出触及距离 ⇒ {@code TARGET_TOO_FAR}；
     * 游戏没受理 ⇒ {@code USE_FAILED}。
     */
    default GuiResult useOn(double x, double y, double z) {
        return GuiResult.fail(GuiResult.UNSUPPORTED, "本档未实现 use_on（GameBridge#useOn）");
    }

    /**
     * **玩家在目标位置放置手持方块**（{@code place_block}；玩家级 —— 与化身级的
     * {@link #placeBotBlock} **语义分开、互不影响**）。
     *
     * <p>做法：查目标格是否可替换（不可 ⇒ {@code TARGET_NOT_PLACEABLE}）、手上有没有东西
     * （没有 ⇒ {@code NO_ITEM_IN_HAND}）、够不够得着（不够 ⇒ {@code TARGET_TOO_FAR}）；
     * 然后在目标格周围找一个**支撑面**，构造该面的 {@code BlockHitResult}、把朝向对准它，
     * 再走与 {@code use_on} 同一个交互通路（原版就是这么把方块放到「点中面的外一格」）。
     * 游戏没受理 ⇒ {@code PLACE_FAILED}。
     */
    default GuiResult placeBlock(double x, double y, double z) {
        return GuiResult.fail(GuiResult.UNSUPPORTED, "本档未实现 place_block（GameBridge#placeBlock）");
    }

    // ==================================================================
    // [T20-③] 窗口聚焦自报面（press 的诚实回执）
    // 全部 default ⇒ 其余 54 档一行不改（返回 null = 本档不报，core 如实写「未知」，不假装已聚焦）。
    // ==================================================================

    /**
     * 本机客户端窗口**当前是否聚焦**；本档不报 ⇒ {@code null}（**不假装已聚焦**）。
     *
     * <p>为什么必须由适配层给：真机实测（2026-11-11）窗口失焦时 {@code attack} / {@code use}
     * **不生效**，但旧回执照样写 {@code down}（假回执）。核心拿不到聚焦位（那是 GLFW /
     * {@code Minecraft} 的对象），只有适配层知道名字（neoforge 1.20.1 =
     * {@code Minecraft#isWindowActive()}；fabric 1.21.11 = {@code MinecraftClient#isWindowFocused()}）。
     *
     * <p>语义：{@code Boolean.TRUE} = 聚焦（按键**可能**生效）；{@code Boolean.FALSE} = 失焦
     * （单人世界 {@code pauseOnLostFocus=true} 还会弹暂停屏 ⇒ 按键**不会**生效）；
     * {@code null} = 本档不报 ⇒ core 回执里 {@code windowFocused:null} + {@code mayTakeEffect:null}
     * （**未知**，不假装）。
     *
     * <p>Java 8 default ⇒ 未实现的档行为与从前逐字一致。
     */
    default Boolean windowFocused() {
        return null;
    }

    // ==================================================================
    // [T20-①] mine 的破坏进度自报面（跨 tick 会话状态）
    // default ⇒ 未实现的档不报（core 的 mine 回执里 progress 留 null 并如实说明）。
    // ==================================================================

    /**
     * 上一次 {@code mine} 的**破坏进度自报**（只读内存字段；本档不报 ⇒ {@code null}）。
     *
     * <p>为什么需要：{@code mine} 是**跨 tick** 的（第一发只 START，实际破坏在后续 tick 由
     * {@code continueDestroyBlock} / {@code updateBlockBreakingProgress} 累计）。
     * 旧回执只回一个坐标 ⇒ 调用方看到 {@code ok} 以为已经挖穿，实际是黑盒
     * （真机实测：生存模式 40 次 mine / 22 秒，方块纹丝不动却一路 ok）。
     *
     * <p>形状（**取不到的字段留 null / 不报，不许编**；由
     * {@link MiningTracker#status()} 生成）：
     * <pre>
     * {"target":"x,y,z"|null,"hasTarget":bool,"targetBlock":"minecraft:stone"|null,
     *  "targetStillThere":bool,"miningTicks":int,"maxTicks":int,"elapsedMs":long|null,
     *  "minedCount":int,"lastMined":"x,y,z"|null,"lastStopReason":"MINE_BROKEN"|"MINE_TIMEOUT"|null,
     *  "lastStopTarget":"x,y,z"|null,"stops":int,"continueReturnedTrueCount":int,
     *  "continueReturnedTrueNote":"…","note":"…"}
     * </pre>
     *
     * <p>Java 8 default ⇒ 其余档一行不改。
     */
    default java.util.Map<String, Object> mineStatus() {
        return null;
    }

    // ==================================================================
    // [T22] 快捷栏 / 丢物品（select_slot / drop_item）—— 与 [T19] 的 GUI 一族**同一面**
    //   （都是「玩家级、走客户端交互管理器」的动作；自报位仍复用 guiActionCapable() 这一个
    //    先例，见 {@link #guiActionCapable()}。默认实现 fail-loud ⇒ 其余 54 档一行不改、
    //    /status 里如实列进 actionsUnavailable）。
    // 名字**各自 javap 取证**（两档字段名/方法名不同源，不许互相套用）：
    //   fabric 1.21.11（yarn 1.21.11+build.6 映射件）
    //     public int  PlayerInventory.getSelectedSlot();
    //     public void PlayerInventory.setSelectedSlot(int);
    //     public ItemStack PlayerInventory.getSelectedStack();
    //     public final Inventory Slot.inventory;   public int Slot.getIndex();
    //     public void ClientPlayerInteractionManager.clickSlot(int,int,int,SlotActionType,PlayerEntity);
    //     public final PlayerScreenHandler PlayerEntity.playerScreenHandler;
    //     public GameMode ClientPlayerInteractionManager.getCurrentGameMode();
    //     public boolean PlayerAbilities.flying;  public boolean PlayerAbilities.allowFlying;
    //     public boolean PlayerManager.areCheatsAllowed();
    //   neoforge 1.20.1（forge-1.20.1-47.4.10 mapped_parchment 件）
    //     public int Inventory.selected;   public ItemStack Inventory.getSelected();
    //     public final Container Slot.container;  public int Slot.getContainerSlot();
    //     public void MultiPlayerGameMode.handleInventoryMouseClick(int,int,int,ClickType,Player);
    //     public final InventoryMenu Player.inventoryMenu;
    //     public GameType MultiPlayerGameMode.getPlayerMode();
    //     public boolean Abilities.flying;  public boolean Abilities.mayfly;
    //     public boolean WorldData.getAllowCommands();
    // ==================================================================

    /**
     * **切换玩家选中的快捷栏槽位**（{@code select_slot}）—— 玩家级，走本档的选中槽字段/方法。
     *
     * <p>为什么必须有它：真机实测（fabric 1.21.11，T18）快捷栏永远锁在 slot0（{@code press} 也不支持
     * 数字键）⇒ 拿到镐子也切不过去。语义：把选中槽切到 {@code slot}（0..8）。
     *
     * <p>回执（{@code GuiResult.data}，**逐档读真实的选中槽字段**，不编）：
     * {@code previousSlot}（切换前）、{@code selectedSlot}（**切换后复读**）、
     * {@code mainHand}（切换后主手那格，形状同 {@code query_inventory} 的 {@code mainHand}；
     * 空格 ⇒ null）—— 调用方拿它与 {@code query_inventory.selectedSlot/mainHand} 交叉验证。
     *
     * <p>fail-loud：不在世界 / 没有玩家 ⇒ {@code NOT_IN_WORLD}；{@code slot} 不在 0..8 ⇒
     * {@code SLOT_OUT_OF_RANGE}（core 已先拦一道，这里是**第二道**）。
     */
    default GuiResult selectSlot(int slot) {
        return GuiResult.fail(GuiResult.UNSUPPORTED,
                "本档未实现 select_slot（GameBridge#selectSlot）");
    }

    /**
     * **丢弃物品栏某一格**（{@code drop_item}）—— 走与 {@code click_slot} **同一条**客户端交互管理器
     * 通路，用原版 {@code SlotActionType.THROW}（{@code button=0} 丢一个、{@code button=1} 丢整叠）。
     *
     * <p>为什么必须有它：真机实测（T18）{@code press drop} 回 {@code KEY_NOT_SUPPORTED} ⇒ 脏背包
     * 清不掉、诚实从零做不了。
     *
     * <p><b>slot 口径（与 {@code query_inventory} 的 {@code slots[].slot} 同一个空间）</b>：
     * 玩家物品栏下标（{@code 0..size-1}）。{@link #inventoryJson()} 的 {@code size} 就是上界；
     * {@code slot < 0} ⇒ 用**当前选中槽**（{@code selectedSlot}）。适配层把该下标映射到目标菜单
     * （没开容器 ⇒ 玩家自己的物品栏菜单；开着容器 ⇒ 当前容器菜单）里**同一个物品栏对象的那一格**
     * （按 {@code Slot} 的容器同一性与 {@code getIndex()/getContainerSlot()} 找，不靠版式硬编码）。
     *
     * <p><b>count / all</b>：原版 THROW 只有「丢一个 / 丢整叠」两种。{@code all=true}（或缺省 count）
     * ⇒ 整叠；{@code count=1} ⇒ 丢一个；{@code 1<count<叠数} ⇒ 连点 {@code count} 次丢一个。
     *
     * <p>回执（{@code GuiResult.data}）：{@code slot}、{@code count}（**实际丢掉的个数**）、
     * {@code requested}（请求的 count / all）、{@code empty}（丢后该格是否空）、
     * {@code remaining}（丢后该格剩余个数）、{@code id}（丢后该格物品 id；空 ⇒ null）。
     *
     * <p>fail-loud：不在世界 ⇒ {@code NOT_IN_WORLD}；下标越界 / 开容器时 armour/offhand 不在该菜单
     * ⇒ {@code SLOT_OUT_OF_RANGE}；没受理 ⇒ 如实失败。
     */
    default GuiResult dropItem(int slot, int count, boolean all) {
        return GuiResult.fail(GuiResult.UNSUPPORTED,
                "本档未实现 drop_item（GameBridge#dropItem）");
    }

    /**
     * **玩家模式 / 能力自报**（{@code query_player_state} 的 {@code gameMode/flying/canFly/cheats}）。
     * 默认 {@code null} = 本档不报（core 把四者一律留 null 并加人话，**不编**）。
     *
     * <p>为什么单独一个方法而不是塞进 {@link #playerStateJson()}：{@code playerStateJson} 被
     * {@code query_state}/{@code query_map} 也吃 ⇒ 往里加键会改动那两条的既有回执形状；本方法
     * **只喂 {@code query_player_state}**，其余动作逐字不变。
     *
     * <p>形状（**取不到的键留 null，不编**；适配层按本档实况给）：
     * <pre>
     * {"gameMode":"survival"|"creative"|"adventure"|"spectator"|null,
     *  "flying":bool|null,"canFly":bool|null,"cheats":bool|null,
     *  "note":"…（这一档从哪取的、哪个拿不到）"}
     * </pre>
     * {@code gameMode} 用**原版枚举名**（小写）；{@code cheats} 只对**本机集成服务器**有意义
     * （多人服拿不到 ⇒ 留 null）。
     */
    default String playerMetaJson() {
        return null;
    }

    // ==================================================================
    // [T39-①] select_slot 的**服务端同步**面
    //
    // 真机铁证（2026-11-19，forge 1.20.1 生存）：select_slot {slot:1} ⇒ 回执
    // mainHand=wooden_pickaxe / consistent=true，随后 query_inventory ⇒ selected=1 但
    // **mainHand=null** ⇒ 服务端仍认为空手 ⇒ 挖石头走「空手破坏」分支 ⇒ 石头不掉
    // cobblestone（requiresCorrectToolForDrops），而泥土/原木照掉 ⇒ 现象 = 只捡得到泥土与原木。
    //
    // 根因：{@code Inventory.selected} / {@code PlayerInventory.setSelectedSlot} **只改客户端
    // 本地字段**。原版把「选中槽」同步给服务端的是另一条路（两档各一条，均已 javap 取证）：
    //   neoforge 1.20.1：MultiPlayerGameMode#ensureHasSentCarriedItem() 里比 carriedIndex
    //     与 Inventory.selected，不等就 new ServerboundSetCarriedItemPacket(selected) +
    //     ClientPacketListener#send(Packet)（字节码偏移 0-45）
    //   fabric 1.21.11：ClientPlayerInteractionManager#syncSelectedSlot() 里比 lastSelectedSlot
    //     与 PlayerInventory.getSelectedSlot()，不等就 new UpdateSelectedSlotC2SPacket(slot) +
    //     ClientPlayNetworkHandler#sendPacket(Packet)（字节码偏移 0-45）
    // ⇒ 本组方法让适配层**显式**发那条原版包，并把「发没发出去」如实回给 core。
    // ==================================================================

    /**
     * 本档有没有实现「把选中槽**同步给服务端**」这条面（{@link #setSelectedSlotSynced}）。
     * 默认 {@code false} = 没实现 ⇒ core 回执里 {@code serverSynced=null} + 人话，
     * **绝不假装同步了**。
     *
     * <p>为什么必须单独一个自报位（与 {@code inventoryCapable()} 完全同一个理由）：
     * {@code setSelectedSlotSynced} 的默认实现回 null，**不可能从返回值区分**
     * 「本档压根没实现」与「本档实现了但这会儿没有连接」。
     */
    default boolean slotSyncCapable() {
        return false;
    }

    /**
     * 切选中槽**并按原版那条路把新槽位发给服务端**。
     *
     * <p>返回值（{@code GuiResult}）：
     * <ul>
     *   <li>{@code ok=true} + {@code data} 里 {@code packetSent=true} ⇒ **包真的进了连接**；
     *       {@code packetClass} = 用的哪个原版包（{@code ServerboundSetCarriedItemPacket} /
     *       {@code UpdateSelectedSlotC2SPacket}）；{@code selectedSlot} = 发出去之后**复读**的值；</li>
     *   <li>{@code ok=true} + {@code packetSent=false} ⇒ 槽位改了但**没有连接可发**
     *       （单机菜单 / 还没进世界）⇒ 回执里 {@code serverSynced=false}，core 如实标；</li>
     *   <li>{@code ok=false} + {@code NOT_IN_WORLD} ⇒ 没有玩家。</li>
     * </ul>
     *
     * <p><b>不做的事</b>：不伪造「服务端已确认」。服务端到底认没认，客户端**看不见** ——
     * 唯一的间接判据是「挖一个需要正确工具的方块，看它掉不掉落」（见
     * {@code WalkTo} 之外的 {@code ToolDropProbe}）。所以 {@code serverSynced} 只有三态：
     * {@code true}（包已进连接）、{@code false}（没发 / 发失败）、{@code null}（本档不报）。
     *
     * <p>Java 8 default ⇒ 其余 54 档一行不改（返回 null ⇒ 行为与从前逐字一致）。
     */
    default GuiResult setSelectedSlotSynced(int slot) {
        return null;
    }

    // ==================================================================
    // [T39-②③ / T41] walk_to 的**移动面**
    //
    // 铁规：**绝不许**宿主级置前 / 键鼠注入（SetForegroundWindow / SendInput 一律禁止）。
    // 移动必须走**游戏自己的按键状态**，两档均已 javap 取证：
    //   根因（T40 实测 + javap 核实）：LocalPlayer.input 运行时是 KeyboardInput，
    //     每 tick 在 LocalPlayer#aiStep / ClientPlayerEntity#tickMovement 之前都会执行
    //     KeyboardInput#tick()，从 Options.keyUp..keyJump.isDown()（1.20.1）或
    //     GameOptions.forwardKey..jumpKey.isPressed()（1.21.11）重算并覆写
    //     forwardImpulse/leftImpulse/jumping 或 playerInput/movementVector。
    //     因此在 ClientTickEvent END 直接写 Input 字段会在下一 tick 物理读取前被清空。
    //   修复：
    //     neoforge 1.20.1：驱动 mc.options.keyUp/keyDown/keyLeft/keyRight/keyJump.setDown(boolean)
    //     fabric 1.21.11：驱动 c.options.forwardKey/backKey/leftKey/rightKey/jumpKey.setPressed(boolean)
    //   只动本适配层自己按过的移动键（记账式释放，绝不清真人的键），且由 PlaytestCore 与
    //   Arbitration 同步持有状态，避免 AUTO 仲裁把 walk_to 自己的按键误判为真人输入。
    //   不碰窗口焦点（pauseOnLostFocus=false 且无打开界面时，后台失焦窗口也可正常走原版物理）。
    // ==================================================================

    /**
     * 本档有没有实现移动面（{@link #walkDrive}）。默认 {@code false} = 不支持 ⇒
     * {@code walk_to} 回 {@code WALK_UNSUPPORTED}，{@code /status} 里如实列着。
     */
    default boolean walkCapable() {
        return false;
    }

    /**
     * 给本 tick 的玩家写入移动输入（**只写游戏自己的移动按键状态**，不碰 OS / 窗口）。
     *
     * <p>{@code forward} ∈ [-1,1]（&gt;0 前进，&lt;0 后退）；
     * {@code strafe} ∈ [-1,1]（遵循原版 {@code leftImpulse} 约定：&gt;0 左移，&lt;0 右移）；
     * {@code jump} = 这一 tick 要不要跳；
     * {@code yaw} = NaN 表示不改朝向，否则设成这个朝向（度）。
     *
     * <p>返回 {@code true} = 写进去了；{@code false} = 本档没实现 / 没有玩家 / 界面正开着。
     */
    default boolean walkDrive(float forward, float strafe, boolean jump, float yaw) {
        return false;
    }

    /**
     * 停掉移动输入（只释放 {@link #walkDrive} 自己按住过的移动键，不误清真人按键）。
     * **每轮结束或仲裁让位时必须调**，否则玩家会一直朝前走（真机上那是掉进岩浆的经典姿势）。
     */
    default void walkStop() {
    }

    /**
     * 玩家的**当前脚下是否踩实**（{@code onGround}）；本档不报 ⇒ {@code null}。
     * 为什么单独一位：{@code playerStateJson} 里已有 {@code onGround}，但那是
     * {@code query_state}/{@code query_map} 也在吃的公共面，往里加键会改动既有回执形状。
     */
    default Boolean playerOnGround() {
        return null;
    }
}
