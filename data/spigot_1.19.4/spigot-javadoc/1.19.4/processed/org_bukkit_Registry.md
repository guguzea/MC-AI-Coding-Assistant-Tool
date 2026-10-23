---
title: "org.bukkit.Registry"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.Registry<T extends org.bukkit.Keyed> extends java.lang.Iterable<T>`
- `public static final org.bukkit.Registry<org.bukkit.advancement.Advancement> ADVANCEMENT`
- `public static final org.bukkit.Registry<org.bukkit.Art> ART`
- `public static final org.bukkit.Registry<org.bukkit.attribute.Attribute> ATTRIBUTE`
- `public static final org.bukkit.Registry<org.bukkit.block.Biome> BIOME`
- `public static final org.bukkit.Registry<org.bukkit.boss.KeyedBossBar> BOSS_BARS`
- `public static final org.bukkit.Registry<org.bukkit.enchantments.Enchantment> ENCHANTMENT`
- `public static final org.bukkit.Registry<org.bukkit.entity.EntityType> ENTITY_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.loot.LootTables> LOOT_TABLES`
- `public static final org.bukkit.Registry<org.bukkit.Material> MATERIAL`
- `public static final org.bukkit.Registry<org.bukkit.Statistic> STATISTIC`
- `public static final org.bukkit.Registry<org.bukkit.generator.structure.Structure> STRUCTURE`
- `public static final org.bukkit.Registry<org.bukkit.generator.structure.StructureType> STRUCTURE_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.Sound> SOUNDS`
- `public static final org.bukkit.Registry<org.bukkit.inventory.meta.trim.TrimMaterial> TRIM_MATERIAL`
- `public static final org.bukkit.Registry<org.bukkit.inventory.meta.trim.TrimPattern> TRIM_PATTERN`
- `public static final org.bukkit.Registry<org.bukkit.entity.Villager$Profession> VILLAGER_PROFESSION`
- `public static final org.bukkit.Registry<org.bukkit.entity.Villager$Type> VILLAGER_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.entity.memory.MemoryKey> MEMORY_MODULE_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.Fluid> FLUID`
- `public static final org.bukkit.Registry<org.bukkit.entity.Frog$Variant> FROG_VARIANT`
- `public static final org.bukkit.Registry<org.bukkit.GameEvent> GAME_EVENT`
- `public abstract T get(org.bukkit.NamespacedKey)`
- `public default T match(java.lang.String)`
