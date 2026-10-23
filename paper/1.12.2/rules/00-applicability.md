# 00 · Paper 1.12.2 档的适用性核查（**不是** 26.3 规则正文）

**本档不含独立的 10 条规则正文。** 服务端面的规则正文只有 `paper/26.3/rules/` 一份（00–09），
本档给它加的是**版本适用性**：26.3 每条出处指向的 API，在 Paper 1.12.2 的签名面里还在不在。

> 为什么不复制那 10 条：Paper 的**教程正文**上游不按 MC 版本分（只有一份当前文档），
> 26.3 的结论直接搬到 1.12.2 就是「没核过却声称适用」= 编造。本档只写能机核的部分。

## 本版事实（机核，非推断）

| 项 | 值 | 出处 |
|---|---|---|
| 签名面 | `data/paper-api_1.12.2/paper-javadoc/1.12.2/` | `meta.json` |
| `asOfVersion` | `1.12.2-R0.1-SNAPSHOT` | 上游 `index.html` 的 `<title>`，取数器双向对钉 |
| 类页 | **877** 篇 | `type-search-index.js` |
| 纯类型声明页（无成员签名） | **89** 篇（10.1%） | 页内含 `只输出类型声明` |

## 26.3 的签名面指针在本版的存活

| 状态 | 条数 |
|---|---|
| ✅ 类在 + 成员在（行号已按本版重定位） | **27** |
| ⚠ 类在、成员不在（该成员在本版被删/改名） | 9 |
| ❌ 类不在（本版没有这个类） | 3 |
| — 教程面指针（不分版本，未核） | 25 |

### ✅ 成员仍在（可直接沿用 26.3 的对应条款）

| 26.3 出处 | 本版出处（已重定位） |
|---|---|
| `org_bukkit_plugin_java_JavaPlugin.md:40` | `org_bukkit_plugin_java_JavaPlugin.md:18` |
| `org_bukkit_event_player_PlayerEvent.md:15` | `org_bukkit_event_player_PlayerEvent.md:12` |
| `org_bukkit_event_player_PlayerJoinEvent.md:14` | `org_bukkit_event_player_PlayerJoinEvent.md:13` |
| `org_bukkit_plugin_PluginManager.md:24` | `org_bukkit_plugin_PluginManager.md:32` |
| `org_bukkit_event_player_PlayerEvent.md:15` | `org_bukkit_event_player_PlayerEvent.md:12` |
| `org_bukkit_event_player_PlayerJoinEvent.md:14` | `org_bukkit_event_player_PlayerJoinEvent.md:13` |
| `org_bukkit_plugin_java_JavaPlugin.md:30` | `org_bukkit_plugin_java_JavaPlugin.md:27` |
| `org_bukkit_plugin_java_JavaPlugin.md:32` | `org_bukkit_plugin_java_JavaPlugin.md:12` |
| `org_bukkit_plugin_java_JavaPlugin.md:31` | `org_bukkit_plugin_java_JavaPlugin.md:31` |
| `org_bukkit_plugin_java_JavaPlugin.md:30` | `org_bukkit_plugin_java_JavaPlugin.md:27` |
| `org_bukkit_plugin_java_JavaPlugin.md:31` | `org_bukkit_plugin_java_JavaPlugin.md:31` |
| `org_bukkit_plugin_java_JavaPlugin.md:30` | `org_bukkit_plugin_java_JavaPlugin.md:27` |
| `org_bukkit_event_inventory_InventoryOpenEvent.md:14` | `org_bukkit_event_inventory_InventoryOpenEvent.md:13` |
| `org_bukkit_event_inventory_InventoryCloseEvent.md:14` | `org_bukkit_event_inventory_InventoryCloseEvent.md:14` |
| `org_bukkit_event_inventory_InventoryOpenEvent.md:14` | `org_bukkit_event_inventory_InventoryOpenEvent.md:13` |
| `org_bukkit_event_inventory_InventoryCloseEvent.md:14` | `org_bukkit_event_inventory_InventoryCloseEvent.md:14` |
| `org_bukkit_permissions_PermissionDefault.md:19` | `org_bukkit_permissions_PermissionDefault.md:12` |
| `org_bukkit_permissions_Permissible.md:15` | `org_bukkit_permissions_Permissible.md:16` |
| `org_bukkit_plugin_PluginManager.md:29` | `org_bukkit_plugin_PluginManager.md:20` |
| `org_bukkit_permissions_PermissionDefault.md:19` | `org_bukkit_permissions_PermissionDefault.md:12` |
| `org_bukkit_permissions_Permission.md:16` | `org_bukkit_permissions_Permission.md:2` |
| `org_bukkit_permissions_Permission.md:23` | `org_bukkit_permissions_Permission.md:14` |
| `org_bukkit_Bukkit.md:63` | `org_bukkit_Bukkit.md:74` |
| `org_bukkit_scheduler_BukkitTask.md:17` | `org_bukkit_scheduler_BukkitTask.md:11` |
| `org_bukkit_scheduler_BukkitTask.md:13` | `org_bukkit_scheduler_BukkitTask.md:13` |
| `org_bukkit_scheduler_BukkitScheduler.md:26` | `org_bukkit_scheduler_BukkitScheduler.md:18` |
| `org_bukkit_scheduler_BukkitScheduler.md:24` | `org_bukkit_scheduler_BukkitScheduler.md:14` |

### ⚠ 成员不在本版（**不得**照用 26.3 的对应条款）

- `org_bukkit_event_EventHandler.md:12` —— 成员 `Retention` 在 Paper 1.12.2 的 `EventHandler` 页面里找不到
- `org_bukkit_event_EventHandler.md:13` —— 成员 `null` 在 Paper 1.12.2 的 `EventHandler` 页面里找不到
- `org_bukkit_event_EventPriority.md:13` —— 成员 `null` 在 Paper 1.12.2 的 `EventPriority` 页面里找不到
- `org_bukkit_event_EventHandler.md:14` —— 成员 `null` 在 Paper 1.12.2 的 `EventHandler` 页面里找不到
- `org_bukkit_permissions_PermissionDefault.md:13` —— 成员 `null` 在 Paper 1.12.2 的 `PermissionDefault` 页面里找不到
- `org_bukkit_inventory_meta_ItemMeta.md:71` —— 成员 `setDamageType` 在 Paper 1.12.2 的 `ItemMeta` 页面里找不到
- `org_bukkit_inventory_meta_ItemMeta.md:12` —— 成员 `null` 在 Paper 1.12.2 的 `ItemMeta` 页面里找不到
- `org_bukkit_permissions_PermissionDefault.md:13` —— 成员 `null` 在 Paper 1.12.2 的 `PermissionDefault` 页面里找不到
- `org_bukkit_permissions_PermissionDefault.md:13` —— 成员 `null` 在 Paper 1.12.2 的 `PermissionDefault` 页面里找不到

### ❌ 类不在本版

- `org_bukkit_persistence_PersistentDataHolder.md:11` —— Paper 1.12.2 没有 `PersistentDataHolder`
- `org_bukkit_persistence_PersistentDataHolder.md:12` —— Paper 1.12.2 没有 `PersistentDataHolder`
- `org_bukkit_persistence_PersistentDataHolder.md:11` —— Paper 1.12.2 没有 `PersistentDataHolder`

## 怎么写

1. **规则正文读 `paper/26.3/rules/`**（00–09 十篇），那里每条都带出处。
2. 动笔前先查本档上面两张表：命中「⚠ 成员不在」或「❌ 类不在」的条款，**不许照用**。
3. 要用本版才有的 API：查 `get_doc_full platform=paper-api id=1.12.2/<fqcn 扁平化>`。

## 未核实（明写，别当已核）

- **没有**在 Paper 1.12.2 上真机跑过任何插件（本档零真机；26.3 档的 JDK/classpath/api-version 实测结论不自动继承）。
- **没有**逐方法比对成员签名（只核「这个方法名还在不在」，不核参数表是否变化）。
- 教程面指针（25 处）指向的是**当前文档**，其正文可能已按新版改写，未按 1.12.2 复核。
- 「纯类型声明页」89 篇是上游页面本身没有成员签名（注解/嵌套 record/纯继承接口），不是抓取失败；但也意味着这些类的成员本档没有证据。
