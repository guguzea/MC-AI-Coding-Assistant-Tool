# 02 — 命令

## 旧接口（Bukkit 原生，已核）

`JavaPlugin` 直接 `@Override onCommand(...)`，签名**逐字**：

`JavaPlugin.md:30`
```java
public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command,
                         @NotNull String label, @NotNull String[] args)
```

- 返回 `false` ⇒ 服务端会把用法提示打给发送者（这是契约的一部分）。
- 取已注册的命令对象：`JavaPlugin.md:32` — `@Nullable public PluginCommand getCommand(@NotNull String name)`

命令要在 `plugin.yml` 里声明才进得来（见 `06-plugin-yml-config.md`）。

## Tab 补全（**已核，2026-10-15**）

`JavaPlugin.md:31`

```java
@Nullable public List<String> onTabComplete(@NotNull CommandSender sender, @NotNull Command command,
                                           @NotNull String alias, @NotNull String[] args)
```

⚠ **第 3 个形参名是 `alias`，不是 `label`** —— 与 `onCommand` 的 `label`（`JavaPlugin.md:30`）不同。逐字抄时别把两个混用（这是签名面能直接看出、而凭记忆最容易写错的一处）。

## Paper 的 Brigadier / Command API

Paper 有自己的命令 API（`io.papermc.paper.command.brigadier.*`、`Command API` 教程 20 页）。**本档只给指针，不给结论**：

- 签名面：`search_docs platform=paper-api --query "brigadier"`
- 教程：`search_docs platform=paper --query "command"`（67 页里的 `api/command-api/**`，**CC BY-SA 4.0** —— 本档不复述其正文）

## 未核实

- `onTabComplete` 的**第 3 形参名**（26.3 是 `alias`）在**其它 Bukkit 版本**上是否同名本档未核 —— 只核了 26.3 一份。

## Brigadier 的跨版本差异（**已核，2026-10-15 · 两版件对比**）

**先纠一处我自己的错读**：我先前说「`paper-api` 件里**有 54 条 brigadier 条目** ⇒ brigadier 类能直接从件拿到」—— **错的**。精确计数后：

| 前缀 | `paper-api-26.3` | `paper-api-1.21.4` |
|---|---|---|
| **`com/mojang/brigadier/`** | **0 条** | **0 条** |
| `io/papermc/paper/command/brigadier/` | **45 条**（38 个 `.class`） | **30 条**（24 个 `.class`） |

⇒ 我先前那 54 条匹配的是**任意路径里含 "brigadier" 的条目**，其实全是 **Paper 自己的包**。**`com.mojang.brigadier` 不在 `paper-api` 件里** —— 它是 POM 的 **compile 依赖**（`com.mojang:brigadier:1.3.11`），**编译时要单独取件**（或由构建工具按 POM 解析传递依赖）。

**跨版本差异（类清单对比，实际内容）**：

- **仅 26.3 有**：`argument/AxisSet` · `argument/position/ColumnBlockPosition` · `argument/position/ColumnFinePosition` · `argument/predicate/BlockInWorldPredicate`（+ `$Result`）· `argument/range/*` 一族
- **仅 1.21.4 有**：**`MessageComponentSerializerHolder`** —— 26.3 里被换成 **`MessageComponentSerializer$1Holder`**
- 规模：**38 → 24**（26.3 比 1.21.4 **多 14 个类**）

⇒ **处方**：跨版本写命令面时，**别假定 `io.papermc.paper.command.brigadier` 的成员在各版本一样**；`argument/*` 那一族是新增的，用之前先对**目标版本**的件核一遍类名。
- 命令**权限节点**的默认值语义（`permission-default` 的字典在 `PermissionDefault.md:13-16`，见 `04-permissions.md`，但"写在 plugin.yml 里怎么生效"本档未在真机验）
