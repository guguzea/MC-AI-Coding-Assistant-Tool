---
title: "org.bukkit.GameRule"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/GameRule.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface GameRule<T>**
`public interface GameRule<T> extends Keyed, RegistryAware`
- `static final GameRule<Boolean> SHOW_ADVANCEMENT_MESSAGES`
- `static final GameRule<Boolean> COMMAND_BLOCK_OUTPUT`
- `static final GameRule<Boolean> PLAYER_MOVEMENT_CHECK`
- `static final GameRule<Boolean> ELYTRA_MOVEMENT_CHECK`
- `static final GameRule<Boolean> ADVANCE_TIME`
- `static final GameRule<Boolean> ENTITY_DROPS`
- `static final GameRule<Boolean> LIMITED_CRAFTING`
- `static final GameRule<Boolean> MOB_DROPS`
- `static final GameRule<Boolean> PROJECTILES_CAN_BREAK_BLOCKS`
- `static final GameRule<Boolean> SPAWN_MOBS`
- `static final GameRule<Boolean> BLOCK_DROPS`
- `static final GameRule<Boolean> ADVANCE_WEATHER`
- `static final GameRule<Boolean> KEEP_INVENTORY`
- `static final GameRule<Boolean> LOG_ADMIN_COMMANDS`
- `static final GameRule<Boolean> MOB_GRIEFING`
- `static final GameRule<Boolean> NATURAL_HEALTH_REGENERATION`
- `static final GameRule<Boolean> REDUCED_DEBUG_INFO`
- `static final GameRule<Boolean> SEND_COMMAND_FEEDBACK`
- `static final GameRule<Boolean> SHOW_DEATH_MESSAGES`
- `static final GameRule<Boolean> SPECTATORS_GENERATE_CHUNKS`
- `static final GameRule<Boolean> RAIDS`
- `static final GameRule<Boolean> SPAWN_PHANTOMS`
- `static final GameRule<Boolean> IMMEDIATE_RESPAWN`
- `static final GameRule<Boolean> DROWNING_DAMAGE`
- `static final GameRule<Boolean> FALL_DAMAGE`
- `static final GameRule<Boolean> FIRE_DAMAGE`
- `static final GameRule<Boolean> FREEZE_DAMAGE`
- `static final GameRule<Boolean> SPAWN_PATROLS`
- `static final GameRule<Boolean> SPAWN_WANDERING_TRADERS`
- `static final GameRule<Boolean> SPAWN_WARDENS`
- `static final GameRule<Boolean> FORGIVE_DEAD_PLAYERS`
- `static final GameRule<Boolean> UNIVERSAL_ANGER`
- `static final GameRule<Boolean> BLOCK_EXPLOSION_DROP_DECAY`
- `static final GameRule<Boolean> MOB_EXPLOSION_DROP_DECAY`
- `static final GameRule<Boolean> TNT_EXPLOSION_DROP_DECAY`
- `static final GameRule<Boolean> WATER_SOURCE_CONVERSION`
- `static final GameRule<Boolean> LAVA_SOURCE_CONVERSION`
- `static final GameRule<Boolean> GLOBAL_SOUND_EVENTS`
- `static final GameRule<Boolean> SPREAD_VINES`
- `static final GameRule<Boolean> ENDER_PEARLS_VANISH_ON_DEATH`
- `static final GameRule<Boolean> TNT_EXPLODES`
- `static final GameRule<Boolean> LOCATOR_BAR`
- `static final GameRule<Boolean> PVP`
- `static final GameRule<Boolean> ALLOW_ENTERING_NETHER_USING_PORTALS`
- `static final GameRule<Boolean> SPAWN_MONSTERS`
- `static final GameRule<Boolean> COMMAND_BLOCKS_WORK`
- `static final GameRule<Boolean> SPAWNER_BLOCKS_WORK`
- `static final GameRule<Integer> RANDOM_TICK_SPEED`
- `static final GameRule<Integer> RESPAWN_RADIUS`
- `static final GameRule<Integer> MAX_ENTITY_CRAMMING`
- `static final GameRule<Integer> MAX_COMMAND_SEQUENCE_LENGTH`
- `static final GameRule<Integer> MAX_COMMAND_FORKS`
- `static final GameRule<Integer> MAX_BLOCK_MODIFICATIONS`
- `static final GameRule<Integer> PLAYERS_SLEEPING_PERCENTAGE`
- `static final GameRule<Integer> MAX_SNOW_ACCUMULATION_HEIGHT`
- `static final GameRule<Integer> PLAYERS_NETHER_PORTAL_DEFAULT_DELAY`
- `static final GameRule<Integer> PLAYERS_NETHER_PORTAL_CREATIVE_DELAY`
- `@Experimental @MinecraftExperimental(MINECART_IMPROVEMENTS) static final GameRule<Integer> MAX_MINECART_SPEED`
- `static final GameRule<Integer> FIRE_SPREAD_RADIUS_AROUND_PLAYER`
- `@NotNull T getDefaultValue()`
- `@NotNull @Deprecated(since="1.21.11") NamespacedKey getKey()`
- `@NotNull @Deprecated(since="1.21.11") String getName()`
- `@NotNull Class<T> getType()`
- `@Nullable @Deprecated(since="1.21.11") static GameRule<?> getByName(@NotNull String rule)`
- `@NotNull @Deprecated(since="1.21.11") static GameRule<?>[] values()`
