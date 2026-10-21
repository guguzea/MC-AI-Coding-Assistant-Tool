# 03 — 物品栏与 GUI

## 逐字签名（全部核过）

`Inventory.md`：

| 行 | 签名 |
|---|---|
| `:13` | `int getSize()` |
| `:16` | `@Nullable ItemStack getItem(int index)` |
| `:17` | `void setItem(int index, @Nullable ItemStack item)` |
| `:18` | `@NotNull HashMap<Integer, ItemStack> addItem(@NotNull ItemStack... items) throws IllegalArgumentException` |
| `:41` | `@Nullable InventoryHolder getHolder()` |

## 两条从签名本身就能读出的契约

1. **`getItem` 返回 `@Nullable`** ⇒ 空槽是 `null`，不是"空气 ItemStack"。判空要用 `== null`，别去调它的方法。
2. **`addItem` 有返回值** ——`HashMap<Integer, ItemStack>`：**装不下的那些**（key = 槽位下标）。**丢弃返回值 = 静默丢物品**。这是签名明写的，不是经验之谈。

## 取得自定义 GUI 的归属

`getHolder()` 返回 `@Nullable InventoryHolder` ⇒ GUI 用 `InventoryHolder` 做归属标记，读回时**必须判空**再强转。

## 点击事件的三个读数（**已核，2026-10-15**）

`InventoryClickEvent.md`：

| 行 | 签名 |
|---|---|
| `:23` | `@Nullable public Inventory getClickedInventory()` |
| `:17` | `@Nullable public ItemStack getCurrentItem()` |
| `:27` | `@NotNull public InventoryAction getAction()` |

⚠ **前两个返回 `@Nullable`** —— 点在外框（玩家自己那半）时 `getClickedInventory()` 可能就是 null；**三者的可空性不同**（`:27` 是 `@NotNull`），判空要按签名逐个来，别一刀切。

## 真机侧已验证（2026-10-15，Paper 26.3-190 / JDK 25）

探针 `VerifyProbe#checkInventory` 在服务端 `onEnable` 里跑，落 `<证据目录>/v-inventory.ok`。**四项全过**：

| 检查 | 实测结果 |
|---|---|
| `Bukkit.createInventory(null, 9).getSize()` | `9` ✔ |
| `getHolder()` | **`null`**（与传 `null` holder 一致 ⇒ 签名里的 `@Nullable` 是真的） |
| `setItem(0, new ItemStack(Material.STONE))` → `getItem(0)` | **非 null，往返成立** |
| 九格各填 64 后 `addItem(new ItemStack(Material.STONE, 64))` | **返回 1 项** |

⚠ 最后一行把「签名明写的契约」变成了**实测**：`addItem` 的返回值**确实**装着装不下的东西，**丢掉它就等于静默丢 64 个物品**。

⚠ 这一段**取代**了原先「真机上没跑过任何 GUI」—— 物品栏本体已验；GUI 交互见下「GUI 交互事件」节（已真机核）。

## 未核实（明写）

- `ItemMeta` 的**极长尾成员**（`ItemMeta.md:71` 之后的行）本档未逐条抄 —— 上表已覆盖主线（显示名 / 附魔 / flags / tooltip / model / 伤害类型）。

## `ItemMeta` 的成员全貌（**已核，2026-10-16**）

声明（`ItemMeta.md:12`）：`public interface ItemMeta extends Cloneable, ConfigurationSerializable, **PersistentDataHolder**`
⇒ **它本身就是 `PersistentDataHolder`** ⇒ 物品的 PDC 从 `getItemMeta()` 拿（与 `07-pdc.md` 一致）。

**显示名有两条线，别混**：

| 线 | 成员 | 出处 |
|---|---|---|
| 旧（`display_name`） | `hasDisplayName` · `@NotNull getDisplayName` · `setDisplayName(@Nullable)` | `:13-15` |
| **新（`item_name`）** | `hasItemName` · `@NotNull getItemName` · `setItemName(@Nullable)` | `:16-18` |

**已废弃的线（逐条带 `since`）**：

| 成员 | 弃用标记 | 取代者（出处） |
|---|---|---|
| `has/get/setLocalizedName` | **`since="1.20.5", forRemoval=true`** | 显示名线（`:13-18`） |
| `has/get/setCustomModelData` | **`since="1.21.5"`** | **`CustomModelDataComponent`**：`has/get/setCustomModelDataComponent`（`:27-30`） |
| `is/setFireResistant` | `since="1.21.2"` | —（`:61-62`） |
| `getDamageResistant` | **`since="26.1"`** | `getDamageResistances()` / `setDamageResistant(Collection)`（`:65-67`） |

**其它可用族**（`:31-70`）：`Enchantable` · 附魔族（`hasEnchant` / `getEnchantLevel` / `addEnchant(…, boolean ignoreLevelRestriction)` / `removeEnchant(s)` / `hasConflictingEnchant`）· `ItemFlag` 族 · **`isHideTooltip`/`setHideTooltip`** · **`TooltipStyle`**（`NamespacedKey`）· **`ItemModel`**（`NamespacedKey`）· `isUnbreakable` · `EnchantmentGlintOverride` · `isGlider` · `DamageType` 一族。

⚠ **一条范式**：这页是「**签名面能给出"哪条线已废弃 + 何时"**」的样板 —— 找替代 API 时**先看 `@Deprecated(since=…)`**，比翻教程快。

## `ItemMeta` 的显示名与 Lore（**已核，2026-10-15**）

`org_bukkit_inventory_meta_ItemMeta.md`：

| 行 | 签名 |
|---|---|
| `:13` | `boolean hasDisplayName()` |
| `:14` | **`@NotNull String getDisplayName()`** |
| `:15` | `void setDisplayName(@Nullable String name)` |
| `:22` | `boolean hasLore()` |
| `:23` | **`@Nullable List<String> getLore()`** |
| `:24` | `void setLore(@Nullable List<String> lore)` |

⚠ **两处可空性不对称，别按对称去写**：`getDisplayName()` 是 **`@NotNull`**（没设过也返回非 null，通常是空串），而 `getLore()` 是 **`@Nullable`**（没设过返回 `null`）。⇒ 判"有没有"用 `hasDisplayName()` / `hasLore()`，比 `!= null` 更贴签名。

⇒ 这**取代**了原「`ItemMeta` 自身的成员未逐个核」这一项（**只覆盖旧的字符串写法**）。
- 其余物品栏事件类（`InventoryDragEvent` / `InventoryMoveItemEvent` …）的 getter 名本档**未逐个核**。

## GUI 交互事件（**已真机核，2026-10-15 · 真客户端 + 人工点击**）

用**真 26.3 客户端**（NeoForge moddev `runClient`）连入一个 26.3 服务端；插件在 `PlayerJoinEvent` 里 `player.openInventory(Bukkit.createInventory(null, 9, "probe-gui"))`，然后**由人点**：

| 事件 | 实测（marker） |
|---|---|
| **`InventoryOpenEvent`** | 派发 ✔ · `getPlayer()` = **`Dev`**（`HumanEntity`，与方法签名一致） |
| **`InventoryClickEvent`** | 派发 ✔（**人工点击**）· `getAction()` = **`PICKUP_ALL`** · `getClickedInventory()` = 非 null · `getCurrentItem()` = 非 null |
| **`InventoryCloseEvent`** | 派发 ✔ |

⚠ **`getAction()` 的取值确实在变**（同一批日志里出现 `NOTHING` / `PICKUP_ALL` / `PLACE_ALL`）⇒ 它**不是常量占位**，是**按玩家实际操作**返回不同枚举 —— 这是"它真在反映点击"的判据。

⚠ **本档不写"怎么点"的实现**：点击由**人**做（**本档不做 UI 自动化**）。要复现，按本档的探针范式把物品栏开好、让人点一次即可。

⇒ 这**取代**了原「GUI 交互事件（打开/点击/关闭）未验」这一项。
- 其余物品栏事件类（`InventoryDragEvent` / `InventoryMoveItemEvent` …）的 getter 名本档**未逐个核**。

## 打开 / 关闭事件（**已核，2026-10-15**）

两个类都在 **`:14`** 声明**同一个**读数（`InventoryOpenEvent.md:14` 与 `InventoryCloseEvent.md:14`）：

| 出处 | 签名 |
|---|---|
| `InventoryOpenEvent.md:14` | `@NotNull public final HumanEntity getPlayer()` |
| `InventoryCloseEvent.md:14` | `@NotNull public final HumanEntity getPlayer()` |

⚠ **两处细节别踩**：
1. 返回类型是 **`HumanEntity`** 而不是 `Player`（`InventoryClickEvent` 那边也是这个形状）—— 要当玩家用得先判/转。
2. **`getView()` 不在这两个类上**（实测：搜 `getView` **0 命中**）⇒ 它在**父类 `InventoryEvent`**。**又一次"签名页只列本类声明的成员"**。

## `ItemStack` 的 `ItemMeta` 入口（**已核**）

`ItemStack.md`：

| 行 | 签名 | 要点 |
|---|---|---|
| `:44` | `@Nullable public ItemMeta getItemMeta()` | **`@Nullable`** ⇒ **必须判空**再改 |
| `:45` | `public boolean hasItemMeta()` | 判"有没有 meta"用这个，比 `getItemMeta() != null` 更贴签名 |

⚠ **`ItemMeta` 自身的成员**：主线见 `本文件:55` 起的「`ItemMeta` 的成员全貌」（已核）；极长尾成员见 `本文件:53` 的未核实条。
