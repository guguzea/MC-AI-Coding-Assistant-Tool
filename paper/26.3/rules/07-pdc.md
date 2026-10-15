# 07 — PDC（PersistentDataContainer）

## 五个方法（逐字，全核过）

`PersistentDataContainer.md`：

| 行 | 签名 |
|---|---|
| `:13` | `<P,C> void set(@NotNull NamespacedKey key, @NotNull PersistentDataType<P,C> type, @NotNull C value)` |
| `:14` | `<P,C> boolean has(@NotNull NamespacedKey key, @NotNull PersistentDataType<P,C> type)` |
| `:15` | `boolean has(@NotNull NamespacedKey key)` |
| `:16` | `@Nullable <P,C> C get(@NotNull NamespacedKey key, @NotNull PersistentDataType<P,C> type)` |
| `:19` | `void remove(@NotNull NamespacedKey key)` |

## 键怎么造（选**非 Internal** 的那个构造）

`NamespacedKey.md`：

| 行 | 签名 | 备注 |
|---|---|---|
| `:16` | `public NamespacedKey(@NotNull Plugin plugin, @NotNull String key)` | ✅ **插件该用这个**（非 `@Internal`） |
| `:15` | `@Internal public NamespacedKey(@NotNull String namespace, @NotNull String key)` | ⚠ 标了 `@Internal` |
| `:23` | `@NotNull public static NamespacedKey minecraft(@NotNull String key)` | 原版命名空间 |
| `:24` / `:25` | `@Nullable … fromString(…)` | 反解析，**返回可空** |

**从签名读得出的一条**：`get(...)` 返回 `@Nullable` ⇒ **PDC 的读必须是判空路径**（键不存在时给 null），`has(...)` 有**带类型**与**不带类型**两个重载。

## 常用类型常量（**已核，2026-10-15**）

`PersistentDataType.md`：

| 行 | 常量 | 泛型 |
|---|---|---|
| `:20` | `STRING` | `<String,String>` |
| `:15` | `INTEGER` | `<Integer,Integer>` |
| `:19` | `BOOLEAN` | **`<Byte,Boolean>`** |
| `:22` | `INTEGER_ARRAY` | `<int[],int[]>` |

⚠ **`BOOLEAN` 的表示类型是 `Byte` 不是 `Boolean`**（逐字如此）—— 这正是"凭记忆写必错"的一处。

## 挂在哪些对象上（**官方出处已核，2026-10-15**）

`api__pdc.md:232` 起 —— 官方逐条列出。**接口是 `PersistentDataHolder`**，签名面同样有出处：

`PersistentDataHolder.md:11-13`
```java
public interface PersistentDataHolder
//  方法：
@NotNull PersistentDataContainer getPersistentDataContainer();
```

⇒ **接口名 + 方法名两处都核过**（教程面 `api__pdc.md:233` + 签名面 `PersistentDataHolder.md:12-13`）。实现者：

| 对象 | 取法 / 注意（官方原文要点） |
|---|---|
| `ItemStack` | `:239-240` **1.21.1+** 有只读视图 `ItemStack#getPersistentDataContainer()`；**1.21.4+** 用 `editPersistentDataContainer(Consumer)` 改（`:63`）；更早版本走 `ItemMeta` |
| `ItemMeta` | `:273-274` `ItemMeta#getPersistentDataContainer()` |
| `Chunk` | `:249` `Chunk#getPersistentDataContainer()` |
| `World` | `:251` `World#getPersistentDataContainer()` |
| `Entity` | `:253` `Entity#getPersistentDataContainer()` |
| `TileState` | `:254-263` 要**先强转**成实现 `TileState` 的方块实体（不是所有方块都有），改完还要 **`.update()`** |
| `Structure` / `GeneratedStructure` | `:265` / `:267` |
| `Raid` | `:269` |
| `OfflinePlayer` | `:271-272` **只读**（直接读盘，改需阻塞 IO —— `:198-201`） |

⚠️ `Player` 不在 `:16-24` 的目录列表里 —— 但它是 `Entity` 的子类，按 `:253` 那条走（**这是我从官方列表推的，非官方逐字**）。

⚠️ 官方另两条注意：`:225-229` **数据不会自动跨 holder 复制**（把 ItemStack 放成方块**不会**带走 PDC）；`:33-34` PDC 会随实体卸载而保存。

## 真机侧已验证（2026-10-15，Paper 26.3-190 / JDK 25）

探针 `VerifyProbe#checkPdc` 在服务端 `onEnable` 里跑，落 `<证据目录>/v-pdc.ok`。**四项全过**：

| 检查 | 实测结果 |
|---|---|
| `Bukkit.getWorlds().get(0) instanceof PersistentDataHolder` | **`true`** ✔ |
| `set(k, STRING, "probe-value")` → `has` → `get` | `has=true` · `get="probe-value"` |
| `set(k2, BOOLEAN, TRUE)` → `get(k2, BOOLEAN)` | **`true`**（泛型是 `<Byte,Boolean>`，**读写都用 `Boolean`**） |
| `remove(k)` → `has(k)` | `false` |

⚠ **第一行是本档最该记的一条**：它**印证了那个推断** —— `org_bukkit_World.md` 里搜 `PersistentDataContainer` **0 命中**，是因为签名页**只列本类声明的成员**，`World` 是**继承** `PersistentDataHolder`（`PersistentDataHolder.md:11-13`）拿到该方法的。**"签名页查不到"≠"没有这个方法"**。

⚠ 这一段**取代**了原先「真机上没验过 PDC 读写」这一项。

## 跨重启持久性（**已真机核，2026-10-15 二轮 · 两阶段**）

**两阶段跑**（同一世界、两个独立 `java` 进程）：

| 阶段 | 动作 | 结果 |
|---|---|---|
| 1（全新世界） | `world.getPersistentDataContainer().set(key, STRING, "cross-restart")`，写值后落 `pdc-phase1.ok` | `PASS pdc-phase1.ok` |
| 1 收尾 | plan 的 `stop` → `Bukkit.shutdown()` → **进程优雅退出**（`java exit=0`） | 世界落盘 |
| **2（同世界、新进程）** | 探针看到 `pdc-phase1.ok` 存在 ⇒ 读同一个 key | **读到 `"cross-restart"`** ⇒ `PASS v-pdc-persist` |

⇒ **世界 PDC 的写值**确实**跨进程重启**保住了（落盘 / 读回成立）。

⚠ **范围说明**：验的是 **`World` 的 PDC**；**`Entity` / `ItemStack` / `Chunk` 的跨重启**未验（两者落盘路径不同，别把这条外推）。

## 其它 holder 的跨重启（**已真机核，2026-10-15 两阶段**）

| holder | 验到什么 | 判据 |
|---|---|---|
| **`Chunk`** | ✅ **跨进程重启后仍读到 `"chunk-cross-restart"`** | 阶段1 写值（`world.getChunkAt(spawn)`）→ 优雅停服 → 阶段2 **新进程**读回；marker `v-pdc-chunk.ok` |
| **`ItemStack`（经 `ItemMeta`）** | ✅ **可读写**，且**放进容器再 `getItem` 取回**仍读到 `"item-pdc"` | marker `v-pdc-itemstack.ok` |

⚠ **选 `Chunk` 的理由**：它**由服务端自动存盘**，不需要玩家、也不需要放方块 ⇒ 是最干净的非 `World` holder 跨重启测试。

⚠ **`ItemStack` 那行验的"跨 holder"形态要如实限定**：我验的是「**经 `Inventory` 往返**」，**不是**官方 `api__pdc.md:226`/`:228` 讲的那条「**把 ItemStack 放成方块**（带 TileState）不自动复制」—— **官方那条仍未验**。

## 未核实

- **`Entity` 的 PDC 跨重启**未验：探针自己 `spawnEntity(..., EntityType.ZOMBIE)` 后**能读写它的 PDC**（marker `pdc-entity-phase1.ok`）；但**跨重启那半没验成** —— 重启后 `spawn` 的是**另一只**实体、读不到旧值（marker `v-pdc-entity-scope` 如实记为「**只验了可读写，未验跨重启**」）。要真验得让那只实体**被存盘**（例如放过若干 tick 再停服，而不是紧接着 `stop`）。
- **`ItemStack` 的 PDC 跨重启**未验（**同进程读写 + 经 `Inventory` 往返已验**）。

## `TileState` 的 PDC 跨重启（**已真机核，2026-10-15 · 两阶段**）

| 阶段 | 动作 | 结果 |
|---|---|---|
| 1 | `world.getBlockAt(spawn.add(0,5,0)).setType(Material.CHEST)` → `getState() instanceof TileState` 成立 → 写 PDC → **`update(true, false)`** | 落 `pdc-tilestate-phase1.ok` |
| **2**（新进程、同世界） | 读同一个 key | **读到 `"tilestate-cross-restart"`** ⇒ `v-pdc-tilestate.ok` |

⚠ **必须配 `update(true,false)` 才算写回** —— 只改 `BlockState` 对象**不落盘**（官方 `api__pdc.md:254-263` 同样强调了这一步）。

## 已验到的 holder 一览（2026-10-15）

| holder | 同进程往返 | **跨进程重启** |
|---|---|---|
| `World` | ✔ | **✔ `"cross-restart"`** |
| `Chunk` | ✔ | **✔ `"chunk-cross-restart"`** |
| **`TileState`** | ✔ | **✔ `"tilestate-cross-restart"`** |
| `ItemStack`（经 `ItemMeta`） | ✔（含**放进容器再取回**仍在） | 未验 |
| `Entity` | ✔ | 未验（如实） |
- 官方 `api__pdc.md:226` / `:228` 那条「**数据不会自动跨 holder 复制**」**未验**。
