---
title: "io.papermc.paper.registry.RegistryKey"
package: "io.papermc.paper.registry"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/RegistryKey.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegistryKey<T>**
`@NullMarked public sealed interface RegistryKey<T> extends Keyed`
- `static final RegistryKey<GameEvent> GAME_EVENT`
- `static final RegistryKey<StructureType> STRUCTURE_TYPE`
- `static final RegistryKey<PotionEffectType> MOB_EFFECT`
- `static final RegistryKey<BlockType> BLOCK`
- `static final RegistryKey<ItemType> ITEM`
- `static final RegistryKey<Villager.Profession> VILLAGER_PROFESSION`
- `static final RegistryKey<PoiType> POINT_OF_INTEREST_TYPE`
- `static final RegistryKey<Villager.Type> VILLAGER_TYPE`
- `static final RegistryKey<MapCursor.Type> MAP_DECORATION_TYPE`
- `static final RegistryKey<MenuType> MENU`
- `static final RegistryKey<Attribute> ATTRIBUTE`
- `static final RegistryKey<Fluid> FLUID`
- `static final RegistryKey<Sound> SOUND_EVENT`
- `static final RegistryKey<DataComponentType> DATA_COMPONENT_TYPE`
- `static final RegistryKey<GameRule<?>> GAME_RULE`
- `static final RegistryKey<Biome> BIOME`
- `static final RegistryKey<Structure> STRUCTURE`
- `static final RegistryKey<TrimMaterial> TRIM_MATERIAL`
- `static final RegistryKey<TrimPattern> TRIM_PATTERN`
- `static final RegistryKey<DamageType> DAMAGE_TYPE`
- `static final RegistryKey<Wolf.Variant> WOLF_VARIANT`
- `static final RegistryKey<Wolf.SoundVariant> WOLF_SOUND_VARIANT`
- `static final RegistryKey<Enchantment> ENCHANTMENT`
- `static final RegistryKey<JukeboxSong> JUKEBOX_SONG`
- `static final RegistryKey<PatternType> BANNER_PATTERN`
- `static final RegistryKey<PotPatternType> DECORATED_POT_PATTERN`
- `static final RegistryKey<Art> PAINTING_VARIANT`
- `static final RegistryKey<MusicInstrument> INSTRUMENT`
- `static final RegistryKey<Cat.Type> CAT_VARIANT`
- `static final RegistryKey<Cat.SoundVariant> CAT_SOUND_VARIANT`
- `static final RegistryKey<Frog.Variant> FROG_VARIANT`
- `static final RegistryKey<Chicken.Variant> CHICKEN_VARIANT`
- `static final RegistryKey<Chicken.SoundVariant> CHICKEN_SOUND_VARIANT`
- `static final RegistryKey<Cow.Variant> COW_VARIANT`
- `static final RegistryKey<Cow.SoundVariant> COW_SOUND_VARIANT`
- `static final RegistryKey<Pig.Variant> PIG_VARIANT`
- `static final RegistryKey<Pig.SoundVariant> PIG_SOUND_VARIANT`
- `static final RegistryKey<ZombieNautilus.Variant> ZOMBIE_NAUTILUS_VARIANT`
- `static final RegistryKey<SulfurCube.Archetype> SULFUR_CUBE_ARCHETYPE`
- `static final RegistryKey<Dialog> DIALOG`
- `static final RegistryKey<EntityType> ENTITY_TYPE`
- `static final RegistryKey<Particle> PARTICLE_TYPE`
- `static final RegistryKey<PotionType> POTION`
- `static final RegistryKey<MemoryKey<?>> MEMORY_MODULE_TYPE`
- `default TypedKey<T> typedKey(Key key)`
- `default TypedKey<T> typedKey(@KeyPattern String key)`
- `default TagKey<T> tagKey(Key key)`
- `default TagKey<T> tagKey(@KeyPattern String key)`
