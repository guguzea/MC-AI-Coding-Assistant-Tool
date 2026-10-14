---
title: "org.bukkit.Registry"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/Registry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Registry<T extends Keyed>**
`public interface Registry<T extends Keyed> extends Iterable<T>`
- `@Deprecated(since="1.21.4") static final Registry<Advancement> ADVANCEMENT`
- `static final Registry<Art> ART`
- `static final Registry<Attribute> ATTRIBUTE`
- `static final Registry<PatternType> BANNER_PATTERN`
- `static final Registry<Biome> BIOME`
- `@Internal static final Registry<BlockType> BLOCK`
- `@Deprecated(since="1.21.4") static final Registry<KeyedBossBar> BOSS_BARS`
- `static final Registry<Cat.Type> CAT_VARIANT`
- `static final Registry<Pig.Variant> PIG_VARIANT`
- `static final Registry<Cow.Variant> COW_VARIANT`
- `static final Registry<Chicken.Variant> CHICKEN_VARIANT`
- `static final Registry<ZombieNautilus.Variant> ZOMBIE_NAUTILUS_VARIANT`
- `static final Registry<Enchantment> ENCHANTMENT`
- `static final Registry<EntityType> ENTITY_TYPE`
- `static final Registry<MusicInstrument> INSTRUMENT`
- `@Internal static final Registry<ItemType> ITEM`
- `@Deprecated(since="1.21.4") static final Registry<LootTables> LOOT_TABLES`
- `static final Registry<Material> MATERIAL`
- `@Experimental static final Registry<MenuType> MENU`
- `static final Registry<PotionEffectType> EFFECT`
- `static final Registry<Particle> PARTICLE_TYPE`
- `static final Registry<PotionType> POTION`
- `static final Registry<Statistic> STATISTIC`
- `static final Registry<Structure> STRUCTURE`
- `static final Registry<StructureType> STRUCTURE_TYPE`
- `static final Registry<Sound> SOUNDS`
- `@Experimental static final Registry<TrimMaterial> TRIM_MATERIAL`
- `@Experimental static final Registry<TrimPattern> TRIM_PATTERN`
- `@Experimental static final Registry<DamageType> DAMAGE_TYPE`
- `@Experimental static final Registry<JukeboxSong> JUKEBOX_SONG`
- `static final Registry<Villager.Profession> VILLAGER_PROFESSION`
- `static final Registry<Villager.Type> VILLAGER_TYPE`
- `static final Registry<GameRule> GAME_RULE`
- `static final Registry<MemoryKey> MEMORY_MODULE_TYPE`
- `static final Registry<Fluid> FLUID`
- `static final Registry<Frog.Variant> FROG_VARIANT`
- `static final Registry<Wolf.Variant> WOLF_VARIANT`
- `static final Registry<MapCursor.Type> MAP_DECORATION_TYPE`
- `static final Registry<GameEvent> GAME_EVENT`
- `@Nullable T get(@NotNull NamespacedKey key)`
- `@NotNull T getOrThrow(@NotNull NamespacedKey key)`
- `@NotNull Stream<T> stream()`
- `@Nullable default T match(@NotNull String input)`
