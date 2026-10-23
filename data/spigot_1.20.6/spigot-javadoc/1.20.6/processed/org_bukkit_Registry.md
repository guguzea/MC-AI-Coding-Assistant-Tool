---
title: "org.bukkit.Registry"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.Registry<T extends org.bukkit.Keyed> extends java.lang.Iterable<T>`
- `public static final org.bukkit.Registry<org.bukkit.advancement.Advancement> ADVANCEMENT`
- `public static final org.bukkit.Registry<org.bukkit.Art> ART`
- `public static final org.bukkit.Registry<org.bukkit.attribute.Attribute> ATTRIBUTE`
- `public static final org.bukkit.Registry<org.bukkit.block.banner.PatternType> BANNER_PATTERN`
- `public static final org.bukkit.Registry<org.bukkit.block.Biome> BIOME`
- `public static final org.bukkit.Registry<org.bukkit.block.BlockType> BLOCK`
- `public static final org.bukkit.Registry<org.bukkit.boss.KeyedBossBar> BOSS_BARS`
- `public static final org.bukkit.Registry<org.bukkit.entity.Cat$Type> CAT_VARIANT`
- `public static final org.bukkit.Registry<org.bukkit.enchantments.Enchantment> ENCHANTMENT`
- `public static final org.bukkit.Registry<org.bukkit.entity.EntityType> ENTITY_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.MusicInstrument> INSTRUMENT`
- `public static final org.bukkit.Registry<org.bukkit.inventory.ItemType> ITEM`
- `public static final org.bukkit.Registry<org.bukkit.loot.LootTables> LOOT_TABLES`
- `public static final org.bukkit.Registry<org.bukkit.Material> MATERIAL`
- `public static final org.bukkit.Registry<org.bukkit.potion.PotionEffectType> EFFECT`
- `public static final org.bukkit.Registry<org.bukkit.Particle> PARTICLE_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.potion.PotionType> POTION`
- `public static final org.bukkit.Registry<org.bukkit.Statistic> STATISTIC`
- `public static final org.bukkit.Registry<org.bukkit.generator.structure.Structure> STRUCTURE`
- `public static final org.bukkit.Registry<org.bukkit.generator.structure.StructureType> STRUCTURE_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.Sound> SOUNDS`
- `public static final org.bukkit.Registry<org.bukkit.inventory.meta.trim.TrimMaterial> TRIM_MATERIAL`
- `public static final org.bukkit.Registry<org.bukkit.inventory.meta.trim.TrimPattern> TRIM_PATTERN`
- `public static final org.bukkit.Registry<org.bukkit.damage.DamageType> DAMAGE_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.entity.Villager$Profession> VILLAGER_PROFESSION`
- `public static final org.bukkit.Registry<org.bukkit.entity.Villager$Type> VILLAGER_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.entity.memory.MemoryKey> MEMORY_MODULE_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.Fluid> FLUID`
- `public static final org.bukkit.Registry<org.bukkit.entity.Frog$Variant> FROG_VARIANT`
- `public static final org.bukkit.Registry<org.bukkit.entity.Wolf$Variant> WOLF_VARIANT`
- `public static final org.bukkit.Registry<org.bukkit.map.MapCursor$Type> MAP_DECORATION_TYPE`
- `public static final org.bukkit.Registry<org.bukkit.GameEvent> GAME_EVENT`
- `public abstract T get(org.bukkit.NamespacedKey)`
- `public abstract java.util.stream.Stream<T> stream()`
- `public default T match(java.lang.String)`
