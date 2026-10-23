---
title: "org.bukkit.GameRule"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/GameRule.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public static final GameRule<Boolean> ANNOUNCE_ADVANCEMENTS`
- `public static final GameRule<Boolean> COMMAND_BLOCK_OUTPUT`
- `public static final GameRule<Boolean> DISABLE_ELYTRA_MOVEMENT_CHECK`
- `public static final GameRule<Boolean> DO_DAYLIGHT_CYCLE`
- `public static final GameRule<Boolean> DO_ENTITY_DROPS`
- `public static final GameRule<Boolean> DO_FIRE_TICK`
- `public static final GameRule<Boolean> DO_LIMITED_CRAFTING`
- `public static final GameRule<Boolean> DO_MOB_LOOT`
- `public static final GameRule<Boolean> PROJECTILES_CAN_BREAK_BLOCKS`
- `public static final GameRule<Boolean> DO_MOB_SPAWNING`
- `public static final GameRule<Boolean> DO_TILE_DROPS`
- `public static final GameRule<Boolean> DO_WEATHER_CYCLE`
- `public static final GameRule<Boolean> KEEP_INVENTORY`
- `public static final GameRule<Boolean> LOG_ADMIN_COMMANDS`
- `public static final GameRule<Boolean> MOB_GRIEFING`
- `public static final GameRule<Boolean> NATURAL_REGENERATION`
- `public static final GameRule<Boolean> REDUCED_DEBUG_INFO`
- `public static final GameRule<Boolean> SEND_COMMAND_FEEDBACK`
- `public static final GameRule<Boolean> SHOW_DEATH_MESSAGES`
- `public static final GameRule<Boolean> SPECTATORS_GENERATE_CHUNKS`
- `public static final GameRule<Boolean> DISABLE_RAIDS`
- `public static final GameRule<Boolean> DO_INSOMNIA`
- `public static final GameRule<Boolean> DO_IMMEDIATE_RESPAWN`
- `public static final GameRule<Boolean> DROWNING_DAMAGE`
- `public static final GameRule<Boolean> FALL_DAMAGE`
- `public static final GameRule<Boolean> FIRE_DAMAGE`
- `public static final GameRule<Boolean> FREEZE_DAMAGE`
- `public static final GameRule<Boolean> DO_PATROL_SPAWNING`
- `public static final GameRule<Boolean> DO_TRADER_SPAWNING`
- `public static final GameRule<Boolean> DO_WARDEN_SPAWNING`
- `public static final GameRule<Boolean> FORGIVE_DEAD_PLAYERS`
- `public static final GameRule<Boolean> UNIVERSAL_ANGER`
- `public static final GameRule<Boolean> BLOCK_EXPLOSION_DROP_DECAY`
- `public static final GameRule<Boolean> MOB_EXPLOSION_DROP_DECAY`
- `public static final GameRule<Boolean> TNT_EXPLOSION_DROP_DECAY`
- `public static final GameRule<Boolean> WATER_SOURCE_CONVERSION`
- `public static final GameRule<Boolean> LAVA_SOURCE_CONVERSION`
- `public static final GameRule<Boolean> GLOBAL_SOUND_EVENTS`
- `public static final GameRule<Boolean> DO_VINES_SPREAD`
- `public static final GameRule<Boolean> ENDER_PEARLS_VANISH_ON_DEATH`
- `public static final GameRule<Integer> RANDOM_TICK_SPEED`
- `public static final GameRule<Integer> SPAWN_RADIUS`
- `public static final GameRule<Integer> MAX_ENTITY_CRAMMING`
- `public static final GameRule<Integer> MAX_COMMAND_CHAIN_LENGTH`
- `public static final GameRule<Integer> MAX_COMMAND_FORK_COUNT`
- `public static final GameRule<Integer> COMMAND_MODIFICATION_BLOCK_LIMIT`
- `public static final GameRule<Integer> PLAYERS_SLEEPING_PERCENTAGE`
- `public static final GameRule<Integer> SNOW_ACCUMULATION_HEIGHT`
- `public static final GameRule<Integer> PLAYERS_NETHER_PORTAL_DEFAULT_DELAY`
- `public static final GameRule<Integer> PLAYERS_NETHER_PORTAL_CREATIVE_DELAY`
- `public static final GameRule<Integer> SPAWN_CHUNK_RADIUS`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull Class<T> getType()`
- `public boolean equals(Object obj)`
- `public String toString()`
- `@Nullable public static @Nullable GameRule<?> getByName(@NotNull @NotNull String rule)`
- `@NotNull public static @NotNull GameRule<?>[] values()`
- `@NotNull public @NotNull String translationKey()`
