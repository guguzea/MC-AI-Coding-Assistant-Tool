---
title: "org.bukkit.Registry"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/Registry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Registry<T extends Keyed>**
`@NullMarked public interface Registry<T extends Keyed> extends Iterable<T>`
- `@Deprecated(since="1.21.4", forRemoval=true) static final Registry<Advancement> ADVANCEMENT`
- `@Deprecated(since="1.21.3") static final Registry<Art> ART`
- `static final Registry<Attribute> ATTRIBUTE`
- `@Deprecated(since="1.21") static final Registry<PatternType> BANNER_PATTERN`
- `@Deprecated(since="1.21.3") static final Registry<Biome> BIOME`
- `static final Registry<BlockType> BLOCK`
- `@Deprecated(since="1.21.4", forRemoval=true) static final Registry<KeyedBossBar> BOSS_BARS`
- `@Deprecated(since="1.21.5") static final Registry<Cat.Type> CAT_VARIANT`
- `@Deprecated(since="1.21") static final Registry<Enchantment> ENCHANTMENT`
- `static final Registry<EntityType> ENTITY_TYPE`
- `@Deprecated(since="1.21.2") static final Registry<MusicInstrument> INSTRUMENT`
- `static final Registry<ItemType> ITEM`
- `static final Registry<LootTables> LOOT_TABLES`
- `static final Registry<Material> MATERIAL`
- `static final Registry<MenuType> MENU`
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
- `static final Registry<PoiType> POINT_OF_INTEREST_TYPE`
- `static final Registry<Villager.Type> VILLAGER_TYPE`
- `static final Registry<MemoryKey<?>> MEMORY_MODULE_TYPE`
- `static final Registry<Fluid> FLUID`
- `@Deprecated(since="1.21.5") static final Registry<Frog.Variant> FROG_VARIANT`
- `@Deprecated(since="1.20.6") static final Registry<Wolf.Variant> WOLF_VARIANT`
- `static final Registry<MapCursor.Type> MAP_DECORATION_TYPE`
- `static final Registry<GameEvent> GAME_EVENT`
- `static final Registry<DataComponentType> DATA_COMPONENT_TYPE`
- `static final Registry<GameRule<?>> GAME_RULE`
- `@Nullable T get(NamespacedKey key)`
- `default @Nullable T get(Key key)`
- `default @Nullable T get(TypedKey<T> typedKey)`
- `default T getOrThrow(Key key)`
- `default T getOrThrow(TypedKey<T> key)`
- `default NamespacedKey getKeyOrThrow(T value)`
- `@Nullable NamespacedKey getKey(T value)`
- `boolean hasTag(TagKey<T> key)`
- `Tag<T> getTag(TagKey<T> key)`
- `default Collection<T> getTagValues(TagKey<T> key)`
- `Collection<Tag<T>> getTags()`
- `default T getOrThrow(NamespacedKey key)`
- `Stream<T> stream()`
- `Stream<NamespacedKey> keyStream()`
- `@Deprecated(forRemoval=true) default @Nullable T match(String input)`
- `int size()`
