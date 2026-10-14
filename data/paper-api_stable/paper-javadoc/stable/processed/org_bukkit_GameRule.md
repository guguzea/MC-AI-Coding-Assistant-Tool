---
title: "org.bukkit.GameRule"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/GameRule.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class GameRule<T>**
`@NonExtendable public abstract class GameRule<T> extends Object implements Translatable, FeatureDependant, Keyed`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> ANNOUNCE_ADVANCEMENTS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> COMMAND_BLOCK_OUTPUT`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DISABLE_PLAYER_MOVEMENT_CHECK`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DISABLE_ELYTRA_MOVEMENT_CHECK`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_DAYLIGHT_CYCLE`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_ENTITY_DROPS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_FIRE_TICK`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_LIMITED_CRAFTING`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> PROJECTILES_CAN_BREAK_BLOCKS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_MOB_LOOT`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_MOB_SPAWNING`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_TILE_DROPS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_WEATHER_CYCLE`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> KEEP_INVENTORY`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> LOG_ADMIN_COMMANDS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> MOB_GRIEFING`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> NATURAL_REGENERATION`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> REDUCED_DEBUG_INFO`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> SEND_COMMAND_FEEDBACK`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> SHOW_DEATH_MESSAGES`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> SPECTATORS_GENERATE_CHUNKS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DISABLE_RAIDS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_INSOMNIA`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_IMMEDIATE_RESPAWN`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DROWNING_DAMAGE`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> FALL_DAMAGE`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> FIRE_DAMAGE`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> FREEZE_DAMAGE`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_PATROL_SPAWNING`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_TRADER_SPAWNING`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_WARDEN_SPAWNING`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> FORGIVE_DEAD_PLAYERS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> UNIVERSAL_ANGER`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> BLOCK_EXPLOSION_DROP_DECAY`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> MOB_EXPLOSION_DROP_DECAY`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> TNT_EXPLOSION_DROP_DECAY`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> WATER_SOURCE_CONVERSION`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> LAVA_SOURCE_CONVERSION`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> GLOBAL_SOUND_EVENTS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> DO_VINES_SPREAD`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> ENDER_PEARLS_VANISH_ON_DEATH`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> ALLOW_FIRE_TICKS_AWAY_FROM_PLAYER`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> TNT_EXPLODES`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> LOCATOR_BAR`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> PVP`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> SPAWN_MONSTERS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> ALLOW_ENTERING_NETHER_USING_PORTALS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> COMMAND_BLOCKS_ENABLED`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Boolean> SPAWNER_BLOCKS_ENABLED`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> RANDOM_TICK_SPEED`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> SPAWN_RADIUS`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> MAX_ENTITY_CRAMMING`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> MAX_COMMAND_CHAIN_LENGTH`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> MAX_COMMAND_FORK_COUNT`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> COMMAND_MODIFICATION_BLOCK_LIMIT`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> PLAYERS_SLEEPING_PERCENTAGE`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> SNOW_ACCUMULATION_HEIGHT`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> PLAYERS_NETHER_PORTAL_DEFAULT_DELAY`
- `@Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> PLAYERS_NETHER_PORTAL_CREATIVE_DELAY`
- `@MinecraftExperimental(MINECART_IMPROVEMENTS) @Experimental @Deprecated(forRemoval=true, since="1.21.11") public static final GameRule<Integer> MINECART_MAX_SPEED`
- `public GameRule()`
- `@NotNull @Deprecated(since="1.21.11", forRemoval=true) public abstract @NotNull String getName()`
- `@NotNull public abstract @NotNull Class<T> getType()`
- `@NotNull public abstract T getDefaultValue()`
- `@Nullable @Deprecated(since="1.21.11", forRemoval=true) public static <T> @Nullable GameRule<T> getByName(@NotNull @NotNull String rule)`
- `@NotNull @Deprecated(since="1.21.11", forRemoval=true) public static @NotNull GameRule<?>[] values()`
- `@NotNull public abstract @NotNull String translationKey()`
