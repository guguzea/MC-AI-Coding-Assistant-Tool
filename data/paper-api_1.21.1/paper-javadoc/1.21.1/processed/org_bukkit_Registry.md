---
title: "org.bukkit.Registry"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/Registry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `static final Registry<Advancement> ADVANCEMENT`
- `static final Registry<Art> ART`
- `static final Registry<Attribute> ATTRIBUTE`
- `@Deprecated(since="1.21") static final Registry<PatternType> BANNER_PATTERN`
- `static final Registry<Biome> BIOME`
- `@Internal static final Registry<BlockType> BLOCK`
- `static final Registry<KeyedBossBar> BOSS_BARS`
- `static final Registry<Cat.Type> CAT_VARIANT`
- `@Deprecated(since="1.21") static final Registry<Enchantment> ENCHANTMENT`
- `static final Registry<EntityType> ENTITY_TYPE`
- `static final Registry<MusicInstrument> INSTRUMENT`
- `@Internal static final Registry<ItemType> ITEM`
- `static final Registry<LootTables> LOOT_TABLES`
- `static final Registry<Material> MATERIAL`
- `@Experimental static final Registry<MenuType> MENU`
- `static final Registry<PotionEffectType> EFFECT`
- `static final Registry<Particle> PARTICLE_TYPE`
- `static final Registry<PotionType> POTION`
- `static final Registry<Statistic> STATISTIC`
- `@Deprecated(since="1.20.6") static final Registry<Structure> STRUCTURE`
- `static final Registry<StructureType> STRUCTURE_TYPE`
- `static final Registry<Sound> SOUNDS`
- `@Deprecated(since="1.20.6") static final Registry<TrimMaterial> TRIM_MATERIAL`
- `@Deprecated(since="1.20.6") static final Registry<TrimPattern> TRIM_PATTERN`
- `@Deprecated(since="1.20.6") static final Registry<DamageType> DAMAGE_TYPE`
- `@Experimental @Deprecated(since="1.21") static final Registry<JukeboxSong> JUKEBOX_SONG`
- `static final Registry<Villager.Profession> VILLAGER_PROFESSION`
- `static final Registry<Villager.Type> VILLAGER_TYPE`
- `static final Registry<MemoryKey> MEMORY_MODULE_TYPE`
- `static final Registry<Fluid> FLUID`
- `static final Registry<Frog.Variant> FROG_VARIANT`
- `@Deprecated(since="1.20.6") static final Registry<Wolf.Variant> WOLF_VARIANT`
- `static final Registry<MapCursor.Type> MAP_DECORATION_TYPE`
- `static final Registry<GameEvent> GAME_EVENT`
- `static final Registry<PotionEffectType> POTION_EFFECT_TYPE`
- `@Nullable T get(@NotNull @NotNull NamespacedKey key)`
- `@Nullable default T get(@NotNull Key key)`
- `@Nullable default T get(@NotNull TypedKey<T> typedKey)`
- `@NotNull default T getOrThrow(@NotNull Key key)`
- `@NotNull default T getOrThrow(@NotNull TypedKey<T> key)`
- `@NotNull default @NotNull NamespacedKey getKeyOrThrow(@NotNull T value)`
- `@Nullable default @Nullable NamespacedKey getKey(@NotNull T value)`
- `@Experimental default boolean hasTag(@NotNull TagKey<T> key)`
- `@Experimental @NotNull default Tag<T> getTag(@NotNull TagKey<T> key)`
- `@NotNull T getOrThrow(@NotNull @NotNull NamespacedKey key)`
- `@NotNull @NotNull Stream<T> stream()`
- `@Nullable @Deprecated(forRemoval=true) default T match(@NotNull @NotNull String input)`
