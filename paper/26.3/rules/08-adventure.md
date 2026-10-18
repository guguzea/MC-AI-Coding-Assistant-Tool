# 08 — Adventure（文本组件）

## 为什么这一面绕不开它（**本次实测**）

Paper 侧 **`CommandSender` 继承 Adventure 的 `Audience`** —— 后果是**编译期就会撞上**：

```
放 paper-api.jar 单独编译 → javac 报：
  class file for net.kyori.adventure.key.Namespaced not found
```

⇒ **编译 classpath 至少三件**：`paper-api` + `adventure-api` + `adventure-key`。
（本次实测版本：`paper-api-26.3.build.178-stable.jar` · `adventure-api-5.2.0.jar` · `adventure-key-5.2.0.jar`；JDK 25。）

## 本档只给指针，不给 API 结论

**理由**：Adventure 是**上游外部库**，不在本仓的两个签名面里（`data/spigot_stable/` 是 `org.bukkit.*` 与 `org.spigotmc.*`；`data/paper-api_stable/` 是 `io.papermc.paper.*`）。**没有出处 ⇒ 本档不写签名**，避免编造。

要查：

- 本仓签名面里**引用到** Adventure 的地方：`search_docs platform=spigot --query "adventure"`（有结果，不代表覆盖全库）
- 上游：`https://jd.adventure.kyori.net/` —— **实测 2026-10-15：HTTP 000 不可达**（`docs.advntr.dev` 是 301）。⇒ **本档的签名不是从站点抄的，是从 jar `javap` 出来的**（见下）
- Paper 教程里讲 Component 的页：`search_docs platform=paper --query "Component"`（**CC BY-SA 4.0**，本档不复述）

## 依赖真相：从 `paper-api` 的 **POM** 读出来（**已核，2026-10-15**）

⚠ 先说一条走不通的路：`paper-api` 的 jar **里没有** `META-INF/maven/**/pom.xml`（实测解不出）—— **但 repo 上有**：

```
https://repo.papermc.io/repository/maven-public/io/papermc/paper/paper-api/26.3.build.178-stable/paper-api-26.3.build.178-stable.pom
```

它声明了 **22 条依赖**，与文本组件相关的：

| 坐标 | 版本 | 说明 |
|---|---|---|
| **`net.kyori:adventure-bom`** | **`5.2.0` `[import]`** | BOM ⇒ **它管的整套 `adventure-*` 都是 5.2.0** |
| `net.kyori:adventure-api` | 由 BOM 决定 | classpath 里用的就是 `5.2.0` ⇒ **与本件期望一致** ✔ |
| `net.kyori:adventure-key` | 由 BOM 决定 | 同上 ✔ |
| `net.kyori:adventure-text-minimessage` | 由 BOM 决定 | ⚠ **是独立的件**，**不在 `adventure-api` 里**（见下） |
| `com.mojang:brigadier` | `1.3.11` | 命令面用，见 `02-commands.md` |

⇒ **原「版本选择依据未核实」可以关掉**：我取的 `<latest>` = `5.2.0`，而 `paper-api` 的 BOM 也钉 `5.2.0` —— **不是碰巧，是对上的**。

⚠ **但 classpath 仍不全**：`MiniMessage` **不在 `adventure-api-5.2.0.jar` 里**（实测 `jar tf` 无 `minimessage` 条目）—— 它在 `net.kyori:adventure-text-minimessage`。⇒ **要用 `MiniMessage` 得再取一件**（本档的编译腿**没装**它）。

## 真签名（**`javap` 实测，2026-10-15**）

`jd.adventure.kyori.net` **HTTP 000 不可达**（本机网络），所以下面的签名**不是从站点抄的**，是**从 jar 里 `javap` 出来的**：

```java
public interface net.kyori.adventure.text.Component
        extends ComponentBuilderApplicable, ComponentLike, HoverEventSource<Component>,
                StyleGetter, StyleSetter<Component> {
    public static final BiPredicate<? super Component, ? super Component> EQUALS;
    public static final BiPredicate<? super Component, ? super Component> EQUALS_IDENTITY;
    public static final Predicate<? super Component> IS_NOT_EMPTY;
    public static TextComponent empty();
    public static TextComponent newline();
    public static TextComponent space();
    public static Component join(JoinConfiguration, ComponentLike...);
    public static Collector<Component, ?, Component> toComponent();
}
```

```java
public interface net.kyori.adventure.audience.Audience extends Pointered {
    public default void sendMessage(ComponentLike);
    public default void sendMessage(Component);
    public default void sendMessage(Component, ChatType.Bound);
    public default void sendMessage(ComponentLike, ChatType.Bound);
    public default void sendMessage(SignedMessage, ChatType.Bound);
}
```

⇒ **`sendMessage` 是 5 个重载**；带 `ChatType.Bound` / `SignedMessage` 的那几条是**签名消息**用的。

## `MiniMessage` 真签名（**`javap` 实测，2026-10-15**）

件 = `net.kyori:adventure-text-minimessage:5.2.0`（**199 KB · 独立件**，版本由上面那张 BOM 表钉住）：

```java
public interface net.kyori.adventure.text.minimessage.MiniMessage
        extends ComponentSerializer<Component, Component, String> {
    public static MiniMessage miniMessage();
    public static MiniMessage miniMessage(MiniMessage.Preset);
    public abstract Component deserialize(String, Pointered);
    public abstract Component deserialize(String, TagResolver);
    public abstract Component deserialize(String, Pointered, TagResolver);
    public default Component deserialize(String, TagResolver...);
    public default Component deserialize(String, Pointered, TagResolver...);
    // 另有 6 个 deserializeToTree 重载
}
```

⇒ 这**取代**了原「`MiniMessage` 的任何签名」这一项。

⚠ **取件路径也实测过了**：另一个依赖 `net.md-5:bungeecord-chat` 在 **Maven Central 404**，**须走 `repo.papermc.io/repository/maven-public`**（实测 200）。

## 真机落点（**已真机核，2026-10-15**）

探针里直接：

```java
Bukkit.getConsoleSender().sendMessage(net.kyori.adventure.text.Component.text("PROBE-TEXT-COMPONENT-LANDED"));
```

⇒ **标记串出现在了服务端日志里**（runner 在完整日志里找，`落点 = true`；marker `v-text-sent.ok`）。

⚠ **这条同时把 classpath 的第 6 件坐实了**：这份代码要用 **`net.md-5:bungeecord-chat`** 才编得过（缺件时 javac 报 `error: cannot access BaseComponent`）—— 该件在 **Maven Central 是 404**，须走 `repo.papermc.io`。

## 未核实（明写）

- **可点击/悬停组件的「点击行为」**仍未验 —— 组件**投递 + 客户端渲染**已验（`v-chat-clickable` / `v-chat-chattype-bound`）；**点下去会不会执行**要真实 UI 点击聊天行。
  **已推进到的位置**（2026-10-17 实测，勿重踩）：驱动器**能打开 `ChatScreen`**（`screen=ChatScreen` 实测成立），
  但 ① `stepTicks` 是**轮内 tick**（用它做步骤入口会自旋到 `budget exhausted`）；② `ChatScreen` 底部是**横跨整宽的输入框**（`y = height - 8` 起扫会全命中它，点了不发命令）。
  **正解方向**：用 `ChatComponent#captureClickableText(ActiveTextCollector, int, int, DisplayMode)`（javap 实测 **public**）拿到**可点击文本的精确矩形**再点；`ChatScreen#handleComponentClicked` 是 **private** 不可用。
  ⚠ 且**消息命中的判定用的是真实鼠标位置**（合成事件坐标无效）：实测点底部输入框能中（5 次）、点消息区 **0 次**（120 点全空）⇒ 还需先把真实鼠标移到目标处。详见 `09-traps.md` 的 **T15**。

## `ChatType.Bound` 签名消息（**已真机核，2026-10-17 · 判据在客户端侧**）

**javap 实测**（`adventure-api-5.2.0.jar`）：`ChatType.Bound` 是**接口**（`type()` / `name()` / `target()`），**不能 new** —— 要经
`ChatType#bind(ComponentLike)` 或 `bind(ComponentLike, ComponentLike)` 造；发送用 Audience 的
`sendMessage(Component, ChatType.Bound)`（`08` 第 70 行那条重载）。

探针在 `PlayerJoinEvent` 里：

```java
net.kyori.adventure.chat.ChatType.Bound bound =
    net.kyori.adventure.chat.ChatType.CHAT.bind(net.kyori.adventure.text.Component.text("ProbeName"));
p.sendMessage(net.kyori.adventure.text.Component.text("PROBE-CHATTYPE-BOUND"), bound);
```

⇒ **服务端 marker `v-chat-chattype-bound.ok`**，**客户端日志**逐字：

```
[19:39:38] [Render thread/INFO] [minecraft/ChatComponent]: [System] [CHAT] **<ProbeName>** PROBE-CHATTYPE-BOUND
```

⇒ **bound 的 `name` 组件被客户端渲染成了前缀 `<ProbeName>`** —— 这就是「签名消息那条重载**真的把 ChatType 传到了客户端**」的判据（不是只发了条普通 system 消息）。

⚠ **范围**：本项验的是**投递 + 渲染**；**点击行为**见上「未核实」。

## 发给真人玩家（**已真机核，2026-10-16 · 判据在客户端侧**）

探针在 `PlayerJoinEvent` 里发两条：

```java
p.sendMessage(Component.text("PROBE-CHAT-PLAIN-LANDED"));                                   // 明文组件
p.sendMessage(MiniMessage.miniMessage().deserialize("<red>PROBE-CHAT-MM-LANDED</red>"));    // MiniMessage 解析后
```

**客户端日志**逐字（`auto-client.log`）：

```
[09:27:39] [Render thread/INFO] [minecraft/ChatComponent]: [System] [CHAT] PROBE-CHAT-PLAIN-LANDED
[09:27:39] [Render thread/INFO] [minecraft/ChatComponent]: [System] [CHAT] PROBE-CHAT-MM-LANDED
```

⇒ **两条都到达了真人客户端**（`<red>…</red>` 的标签被解析后发出，客户端只看到纯文本内容）⇒ 「发给玩家」与「`MiniMessage` 渲染」两项**一并验成**。
⚠ **判据放在客户端侧**是刻意的：服务端只能说"我发出去了"，**只有客户端日志能证明"到了"**（实测服务端日志里**没有**这两条 ⇒ 拿服务端日志当判据会得到假否定）。

## `MiniMessage` 解析行为（**已核，2026-10-15 · 纯 JVM，不用起服**）

```java
MiniMessage mm = MiniMessage.miniMessage();
Component c = mm.deserialize("<red>hi</red> <bold>world</bold>");
```
实测（`javac` + `java`，classpath = `adventure-api` + `adventure-key` + `adventure-text-minimessage`）：

| 检查 | 实测 |
|---|---|
| 返回类型 | `net.kyori.adventure.text.**TextComponentImpl**`（`Component` 的实现类） |
| 标签解析 | `children = **3**`（`<red>hi</red>` / `" "` / `<bold>world</bold>`）⇒ **真解析了** |
| 样式 | 输出里可见 `color=red`、`decorations=…` ⇒ **样式生效** |
| `<gradient:red:blue>x</gradient>` | **`ok = true`** |
| **未知标签** `<not_a_real_tag>` | **不抛异常**（静默接受） |

⇒ 这**部分取代**了原「`MiniMessage` 的任何签名未验」那项（签名已 `javap` 出来，**解析行为现在也验了**）；但**发给玩家的渲染**仍未验。
- 「版本号与 BOM 相同」只验到**号相同**，**未验**运行时路径（编译通过之外的）
