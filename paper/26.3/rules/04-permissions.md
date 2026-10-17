# 04 — 权限

## 默认值：**4 个常量，不是字符串**

`PermissionDefault.md:13-16`：

```
TRUE · FALSE · OP · NOT_OP
```

它是**对象**不是字符串 ⇒ 写进 `plugin.yml` 时按 YAML 的字面量写 `true`/`false`/`op`/`not op` 之类的**上游约定**（⚠ 那部分本档**未核实**，见下）。

判定求值：`PermissionDefault.md:19` — `public boolean getValue(boolean op)`：**给一个 op 标志，得到该默认值下的结果**。

## 从 `PluginManager` 查权限（已核）

| 行 | 签名 |
|---|---|
| `:29` | `@Nullable Permission getPermission(@NotNull String name)` |
| `:41` | `@NotNull Set<Permission> getPermissions()` |
| `:37` | `@NotNull Set<Permissible> getPermissionSubscriptions(@NotNull String permission)` |

## 判某人有没有权限（**已核，2026-10-15**）

`Permissible.md:15-16` —— **两个重载**，按你要判的东西选：

```java
boolean hasPermission(@NotNull String name);
boolean hasPermission(@NotNull Permission perm);
```

⇒ 传**权限名字符串**或**`Permission` 对象**都行；后者要先从 `PluginManager.getPermission(String)`（`PluginManager.md:29`，**返回可空**）拿到。

## 真机侧已验证（2026-10-15，Paper 26.3-190 / JDK 25）

探针 `VerifyProbe#checkPermission` 在服务端 `onEnable` 里跑，结果落 `<证据目录>/v-permission.ok`。**三项全过**：

| 检查 | 实测结果 |
|---|---|
| 四个 `PermissionDefault` 常量的 `getValue(boolean)` | **真值表全对**：`TRUE`→(true,true) · `FALSE`→(false,false) · `OP`→(true,false) · `NOT_OP`→(false,true)（实读 `PermissionDefault.md:19`） |
| `new Permission("x", PermissionDefault.OP).getDefault()` | **== `PermissionDefault.OP`**（ctor `Permission.md:16` / `getDefault` `:24`） |
| `Permission#getChildren()` | **可用**且返回 `java.util.Map`（`Permission.md:23`） |

⚠ 这一段**取代**了原先两条未核实项（「`Permission` 的构造与 `children` 语义未核」与「真机上没验过任何权限行为」）—— 它们**已不再是未核实项**。

## `plugin.yml` 的权限声明（**已真机核，2026-10-15 二轮**）

**声明式**路径也验过了。探针在 `plugin.yml` 里声明两条权限，然后**不看自己写的字符串**、只在**运行时从 `PluginManager` 问**：

```yaml
permissions:
  mcskill.probe.declared:
    description: verify default:true literal
    default: true
  mcskill.probe.oponly:
    description: verify default:op literal
    default: op
```

```java
Permission p = Bukkit.getPluginManager().getPermission("mcskill.probe.declared");
// p != null  ⇒ 声明的权限**真的被注册**进 PluginManager
// p.getDefault() == PermissionDefault.TRUE   ⇒ 字面量 `true` 映射正确
Permission q = Bukkit.getPluginManager().getPermission("mcskill.probe.oponly");
// q.getDefault() == PermissionDefault.OP     ⇒ 字面量 `op` 映射正确
```

实测（marker `v-perm-declared.ok`）：**两条都注册进 `PluginManager`、`true`→`TRUE`、`op`→`OP`** ✔

⇒ 这**取代**了原「`plugin.yml` 里 `permissions:` / `default:` 的合法字面量未核」这一项。**注意本档只验了 `true` / `op` 两个字面量**，其余字面量（`false` / `not op` / `permission` / 数字等）**未逐个验**。

## `default:` 的四个字面量（**已真机核，2026-10-15**）

四条字面量**都验了** —— 各自声明一条权限，再**从 `PluginManager` 问回来**（不看自己写的字符串）：

| `plugin.yml` 里写的 | 运行时 `getDefault()` | marker |
|---|---|---|
| `default: true` | `PermissionDefault.TRUE` | `v-perm-declared.ok` |
| `default: op` | `PermissionDefault.OP` | 同上 |
| `default: false` | `PermissionDefault.FALSE` | `v-perm-declared-more.ok` |
| `default: not op` | `PermissionDefault.NOT_OP` | 同上 |

⇒ 这**取代**了原「`default:` 除 `true`/`op` 外的其余字面量未逐个验」这一项。

⚠ **一条「官方文档 vs 实测」的差异（值得记）**：官方 `getting-started__plugin-yml.md:152-153` 说 `default` 的字面量是 **`op` / `notop`**（**无空格**）；而本档真机测的是 **`not op`（带空格）也生效**。⇒ **两种写法是否都接受，本档没有同时对照**（只实测了带空格那种）。**按官方写 `notop` 更稳**；要写带空格的，请照本档的 marker 复验一次。

## 未核实（明写 —— 这里最容易被通识带偏）

- `default:` 的**大小写/空白变体**（如 `TRUE`、`not  op`）本档未逐验 —— 已验的是 `true`/`op`/`false`/`not op` 四个**规范写法**。

## `default:` **只吃四个字面量**（2026-10-16 第二个否定结论）

我先前把 `default: permission` 与 `default: 0` 都列成"未验"。真机跑下来**两条都是否定结论**：

```
[ERROR]: Permission node 'mcskill.probe.permnode'  in plugin description file for PaperQaServer v1.0.0 is invalid
[ERROR]: Permission node 'mcskill.probe.numlit'    in plugin description file for PaperQaServer v1.0.0 is invalid
```

| `plugin.yml` 里写的 | 结果 |
|---|---|
| `default: 0`（**数字写法**） | ❌ **非法** ⇒ 权限不注册（marker `v-perm-numeric-lit.FAIL`） |
| `default: permission` | ❌ **非法** ⇒ 权限不注册（marker `v-perm-permission-lit.FAIL`） |
| `default: true` / `op` / `false` / `not op` | ✅ 四条全部注册且映射正确 |

⇒ **`default:` 只接受那四种规范写法** —— 与「`PermissionDefault` 只有四个常量」**完全自洽**。**别写数字、别写 `permission`。**

## `default: permission` —— **验到它不成立**（2026-10-15）

这一项原先写作「未验」，**真机跑完得到的是否定结论**（我一开始竟把它当成"第五个字面量"）：

```
[ERROR]: Permission node 'mcskill.probe.permnode' in plugin description file for PaperQaServer v1.0.0 is invalid
   at org.bukkit.permissions.Permission.loadPermission(Permission.java:303)
   at org.bukkit.permissions.Permission.loadPermissions(Permission.java:240)
   at org.bukkit.plugin.PluginDescriptionFile.getPermissions(PluginDescriptionFile.java:945)
```

⇒ **`default: permission` 不是合法字面量**：Bukkit 在 `Permission.loadPermission` 里判它 **invalid**，该权限**不会注册进 `PluginManager`**（探针 `getPermission("mcskill.probe.permnode")` 返回 **null**；marker `v-perm-permission-lit.FAIL`）。

⇒ **与另一条实测完全自洽**：`PermissionDefault` **只有四个常量**（`TRUE`/`FALSE`/`OP`/`NOT_OP`，`PermissionDefault.md:13-16`）—— **没有"第五个值"可映射**。**别在 `plugin.yml` 里写 `default: permission`。**

## op 玩家的判定（**已真机核，2026-10-15 · 同一玩家两种身份对照**）

| 身份 | `isOp()` | `hasPermission(declared, default:true)` | `hasPermission(oponly, default:op)` |
|---|---|---|---|
| 普通玩家 | **false** | `true` | **`false`** |
| **op 玩家**（控制台 `op Dev`） | **true** | `true` | **`true`** ✔ |

⇒ **同一玩家 `Dev`、两种身份各跑一次**（marker 均为 `v-player-join.ok`）⇒ `default: op` 的语义**两个方向都验了**：非 op 不给、op 给。

## 对「真人玩家」的判定（**已真机核，2026-10-15 · 真客户端**）

普通玩家 `Dev`（**`isOp()=false`**）连入后的实测：

| 权限（`plugin.yml` 里声明的） | `player.hasPermission(...)` |
|---|---|
| `mcskill.probe.declared`（**`default: true`**） | **`true`** ✔ |
| `mcskill.probe.oponly`（**`default: op`**） | **`false`** ✔ |

⇒ **语义完全对**：`default: true` 对**普通玩家**成立；`default: op` 对**非 op 玩家**不成立。这同时说明前面那条「字面量 → `PermissionDefault` 枚举」的映射**真的作用到了运行时判定**上（不只是注册进 `PluginManager` 而已）。

⇒ 这**取代**了原「权限对真人玩家的最终判定未验」这一项。
- **`default: permission`** 这个字面量**本档未验**（只验了上表四个）。
