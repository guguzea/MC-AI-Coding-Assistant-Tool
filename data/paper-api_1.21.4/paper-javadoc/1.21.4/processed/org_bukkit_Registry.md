---
title: "org.bukkit.Registry"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/Registry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(since="1.21.4", forRemoval=true) static final Registry<Advancement> ADVANCEMENT`
- `@Deprecated(since="1.21.3") static final Registry<Art> ART`
- `static final Registry<Attribute> ATTRIBUTE`
- `@Deprecated(since="1.21") static final Registry<PatternType> BANNER_PATTERN`
- `@Deprecated(since="1.21.3") static final Registry<Biome> BIOME`
- `@Experimental static final Registry<BlockType> BLOCK`
- `@Deprecated(since="1.21.4", forRemoval=true) static final Registry<KeyedBossBar> BOSS_BARS`
- `static final Registry<Cat.Type> CAT_VARIANT`
- `@Deprecated(since="1.21") static final Registry<Enchantment> ENCHANTMENT`
- `static final Registry<EntityType> ENTITY_TYPE`
- `@Deprecated(since="1.21.2") static final Registry<MusicInstrument> INSTRUMENT`
- `@Experimental static final Registry<ItemType> ITEM`
- `static final Registry<LootTables> LOOT_TABLES`
- `static final Registry<Material> MATERIAL`
- `@Experimental static final Registry<MenuType> MENU`
- `static final Registry<PotionEffectType> MOB_EFFECT`
- `static final Registry<Particle> PARTICLE_TYPE`
- `static final Registry<PotionType> POTION`
- `static final Registry<Statistic> STATISTIC`
- `@Deprecated(since="1.20.6") static final Registry<Structure> STRUCTURE`
- `static final Registry<StructureType> STRUCTURE_TYPE`
- `static final Registry<Sound> SOUND_EVENT`
- `@Deprecated(since="1.20.6") static final Registry<TrimMaterial> TRIM_MATERIAL`
- `@Deprecated(since="1.20.6") static final Registry<TrimPattern> TRIM_PATTERN`
- `@Deprecated(since="1.20.6") static final Registry<DamageType> DAMAGE_TYPE`
- `@Deprecated(since="1.21") static final Registry<JukeboxSong> JUKEBOX_SONG`
- `static final Registry<Villager.Profession> VILLAGER_PROFESSION`
- `static final Registry<Villager.Type> VILLAGER_TYPE`
- `static final Registry<MemoryKey> MEMORY_MODULE_TYPE`
- `static final Registry<Fluid> FLUID`
- `static final Registry<Frog.Variant> FROG_VARIANT`
- `@Deprecated(since="1.20.6") static final Registry<Wolf.Variant> WOLF_VARIANT`
- `static final Registry<MapCursor.Type> MAP_DECORATION_TYPE`
- `static final Registry<GameEvent> GAME_EVENT`
- `static final Registry<DataComponentType> DATA_COMPONENT_TYPE`
- `@Nullable T get(NamespacedKey key)`
- `default @Nullable T get(Key key)`
- `default @Nullable T get(TypedKey<T> typedKey)`
- `default T getOrThrow(Key key)`
- `default T getOrThrow(TypedKey<T> key)`
- `default NamespacedKey getKeyOrThrow(T value)`
- `@Nullable NamespacedKey getKey(T value)`
- `@Experimental boolean hasTag(TagKey<T> key)`
- `@Experimental Tag<T> getTag(TagKey<T> key)`
- `@Experimental Collection<Tag<T>> getTags()`
- `default T getOrThrow(NamespacedKey key)`
- `Stream<T> stream()`
- `@Deprecated(forRemoval=true) default @Nullable T match(String input)`
- `int size()`
