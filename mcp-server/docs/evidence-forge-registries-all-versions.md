# 证据：Forge 全 16 档 `ForgeRegistries` 字段名（L7，2026-09-25）

**判据源**：`javap -p -classpath <该档 forge-universal.jar> net.minecraftforge.registries.ForgeRegistries`
（1.7.10 / 1.8.9 无该类 ⇒ 用 `cpw.mods.fml.common.registry.GameData`；1.9.4–1.12.2 的 ForgeRegistries 在 `net.minecraftforge.fml.common.registry` 包下）。

**构件**：`maven.minecraftforge.net/net/minecraftforge/forge/<dir>/forge-<dir>-universal.jar`，dir 逐档如下（promotions/maven-metadata 的最新；1.13.2–1.16.5 用 Gradle 缓存同版本号——注意缓存里这四档只有 `-launcher.jar`，**不含**该类，判据只认 universal）：

| MC 档 | forge 目录 | ForgeRegistries 字段数 |
| --- | --- | --- |
| 1.7.10 | 1.7.10-10.13.4.1614-1.7.10 | —（GameData：blockRegistry, itemRegistry） |
| 1.8.9 | 1.8.9-11.15.1.2318-1.8.9 | —（无 ForgeRegistries；GameData 只有 MIN/MAX_POTION_ID 两个 public final） |
| 1.9.4 | 1.9.4-12.17.0.2317-1.9.4 | 8 |
| 1.10.2 | 1.10.2-12.18.3.2511 | 8 |
| 1.11.2 | 1.11.2-13.20.1.2588 | 9 |
| 1.12.2 | 1.12.2-14.23.5.2864 | 11 |
| 1.13.2 | 1.13.2-25.0.223 | 12 |
| 1.14.4 | 1.14.4-28.2.26 | 31 |
| 1.15.2 | 1.15.2-31.2.50 | 35 |
| 1.16.5 | 1.16.5-36.2.34 | 35 |
| 1.17.1 | 1.17.1-37.1.1 | 35 |
| 1.18.2 | 1.18.2-40.3.12 | 32（**无 FLUID_TYPES**，与 L6 裁定互证） |
| 1.19.4 | 1.19.4-45.4.5 | 37 |
| 1.20.1 | 1.20.1-47.4.23 | 37 |
| 1.20.4 | 1.20.4-49.2.9 | 39 |
| 1.21.1 | 1.21.1-52.1.16 | 38（本批 16 档里**唯一不含 ENCHANTMENTS** 的一档，照实记录） |

原始 javap 产物 = `D:\mc-skill-temp\l7-registries\<ver>__<类名>.txt`（用户机本地，**不入库**，同 L6 警告；jar 也在那里）。

## 逐档全字段（`public static final` 名）

- **1.9.4 / 1.10.2 (8)**：BLOCKS, ITEMS, POTIONS, BIOMES, SOUND_EVENTS, POTION_TYPES, ENCHANTMENTS, VILLAGER_PROFESSIONS
- **1.11.2 (9)**：上者 + ENTITIES
- **1.12.2 (11)**：上者 + RECIPES, DATA_SERIALIZERS
- **1.13.2 (12)**：上者 + TILE_ENTITIES, MOD_DIMENSIONS（RECIPES 消失）
- **1.14.4 (31)**：BLOCKS, FLUIDS, ITEMS, POTIONS, BIOMES, SOUND_EVENTS, POTION_TYPES, ENCHANTMENTS, ENTITIES, TILE_ENTITIES, PARTICLE_TYPES, CONTAINERS, PAINTING_TYPES, RECIPE_SERIALIZERS, STAT_TYPES, PROFESSIONS, POI_TYPES, MEMORY_MODULE_TYPES, SENSOR_TYPES, SCHEDULES, ACTIVITIES, WORLD_CARVERS, SURFACE_BUILDERS, FEATURES, DECORATORS, BIOME_PROVIDER_TYPES, CHUNK_GENERATOR_TYPES, CHUNK_STATUS, MOD_DIMENSIONS, DATA_SERIALIZERS, LOOT_MODIFIER_SERIALIZERS
- **1.15.2 (35)**：1.14.4 −（BIOME_PROVIDER_TYPES, CHUNK_GENERATOR_TYPES 仍在）+ BLOCK_STATE_PROVIDER_TYPES, BLOCK_PLACER_TYPES, FOLIAGE_PLACER_TYPES, TREE_DECORATOR_TYPES（DECORATORS 消失）
- **1.16.5 (35)**：BLOCKS, FLUIDS, ITEMS, POTIONS, SOUND_EVENTS, POTION_TYPES, ENCHANTMENTS, ENTITIES, TILE_ENTITIES, PARTICLE_TYPES, CONTAINERS, PAINTING_TYPES, RECIPE_SERIALIZERS, ATTRIBUTES, STAT_TYPES, PROFESSIONS, POI_TYPES, MEMORY_MODULE_TYPES, SENSOR_TYPES, SCHEDULES, ACTIVITIES, WORLD_CARVERS, SURFACE_BUILDERS, FEATURES, DECORATORS, CHUNK_STATUS, STRUCTURE_FEATURES, BLOCK_STATE_PROVIDER_TYPES, BLOCK_PLACER_TYPES, FOLIAGE_PLACER_TYPES, TREE_DECORATOR_TYPES, BIOMES, DATA_SERIALIZERS, LOOT_MODIFIER_SERIALIZERS, WORLD_TYPES（**+ATTRIBUTES/STRUCTURE_FEATURES/WORLD_TYPES，−BIOME_PROVIDER_TYPES/CHUNK_GENERATOR_TYPES/MOD_DIMENSIONS**）
- **1.17.1 (35)**：1.16.5 的键大体保留（类名换 mojmap：TILE_ENTITIES→BLOCK_ENTITIES、PROFESSIONS 留、POTIONS 留），+ MOB_EFFECTS
- **1.18.2 (32)**：1.17.1 −（SURFACE_BUILDERS, DECORATORS）= 1.17.1 的 35 − 3；**仍无 FLUID_TYPES**
- **1.19.4 (37)**：**改名波** ENTITIES→ENTITY_TYPES、BLOCK_ENTITIES→BLOCK_ENTITY_TYPES、CONTAINERS→MENU_TYPES、PAINTING_TYPES→PAINTING_VARIANTS、PROFESSIONS→VILLAGER_PROFESSIONS、DATA_SERIALIZERS→ENTITY_DATA_SERIALIZERS、LOOT_MODIFIER_SERIALIZERS→GLOBAL_LOOT_MODIFIER_SERIALIZERS；−（SURFACE_BUILDERS, WORLD_TYPES）已于 1.18.2/1.19 落幕；+ RECIPE_TYPES, COMMAND_ARGUMENT_TYPES, HOLDER_SET_TYPES, DISPLAY_CONTEXTS
- **1.20.1 (37)**：与 1.19.4 逐名相同
- **1.20.4 (39)**：+ CONDITION_SERIALIZERS, INGREDIENT_SERIALIZERS
- **1.21.1 (38)**：1.20.4 − ENCHANTMENTS（照实记录，未在本档 javap 输出中出现）

## 跨档要点（写 mc-registry 类技能时的「版本禁手」）

1. **1.19 是键名分水岭**：上表 7 对改名全部发生在 1.19.4 一档内 ⇒ 1.18.2 及以下的 `ForgeRegistries.ENTITIES` / `.CONTAINERS` / `.TILE_ENTITIES` 写法**不得**平推到 1.19.4+（反之亦然）。
2. **`FLUID_TYPES` 只在 1.19.4+ 存在**；1.18.2 只有 `FLUIDS`（与 L6「1.18.2 无流体类型注册表」互证）。
3. **1.14.4 才有 `FLUIDS`**；1.13.2 及以下没有流体注册表字段。
4. `VILLAGER_PROFESSIONS` 从 1.9.4 就在；但 1.14.4–1.18.2 同义键写作 `PROFESSIONS`（1.19.4 改回 `VILLAGER_PROFESSIONS`）——不是新增。
5. `MOD_DIMENSIONS` 存在于 1.13.2–1.15.2，1.16.5 起消失（1.16 用 `WORLD_TYPES`? 不——1.16.5 是 `STRUCTURE_FEATURES`/`WORLD_TYPES` 在场、`MOD_DIMENSIONS` 不在场）。
6. `ENCHANTMENTS` 从 1.9.4 一路在，**1.21.1 首次缺席**（1.21 数据组件化；照实记录，语义解释另查上游）。

## 复核命令

```powershell
# 单档复核（jar 在 D:\mc-skill-temp）
& "C:\Users\zzrCN\.gradle\jdks\eclipse_adoptium-17-amd64-windows\jdk-17.0.18+8\bin\javap.exe" -p -classpath D:\mc-skill-temp\forge-1.20.4-49.2.9-universal.jar net.minecraftforge.registries.ForgeRegistries
# 与本文清单比对：字段名序列必须一致（数量见上表）
```

⚠️ 本文件依赖用户机本地 jar ⇒ 换机复核需按「构件」列重下；两个证据 jar 集与 `L6` 的 jar 一样**不在库内可复核**。
