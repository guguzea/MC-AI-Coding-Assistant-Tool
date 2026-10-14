---
title: "org.bukkit.GameEvent"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/GameEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class GameEvent**
`public abstract class GameEvent extends Object implements Keyed`
- `public static final GameEvent BLOCK_ACTIVATE`
- `public static final GameEvent BLOCK_ATTACH`
- `public static final GameEvent BLOCK_CHANGE`
- `public static final GameEvent BLOCK_CLOSE`
- `public static final GameEvent BLOCK_DEACTIVATE`
- `public static final GameEvent BLOCK_DESTROY`
- `public static final GameEvent BLOCK_DETACH`
- `public static final GameEvent BLOCK_OPEN`
- `public static final GameEvent BLOCK_PLACE`
- `public static final GameEvent BOUNCE`
- `public static final GameEvent CONTAINER_CLOSE`
- `public static final GameEvent CONTAINER_OPEN`
- `public static final GameEvent DRINK`
- `public static final GameEvent EAT`
- `public static final GameEvent ELYTRA_GLIDE`
- `public static final GameEvent ENTITY_ACTION`
- `public static final GameEvent ENTITY_DAMAGE`
- `public static final GameEvent ENTITY_DIE`
- `public static final GameEvent ENTITY_DISMOUNT`
- `public static final GameEvent ENTITY_INTERACT`
- `public static final GameEvent ENTITY_MOUNT`
- `public static final GameEvent ENTITY_PLACE`
- `public static final GameEvent EQUIP`
- `public static final GameEvent EXPLODE`
- `public static final GameEvent FLAP`
- `public static final GameEvent FLUID_PICKUP`
- `public static final GameEvent FLUID_PLACE`
- `public static final GameEvent HIT_GROUND`
- `public static final GameEvent INSTRUMENT_PLAY`
- `public static final GameEvent ITEM_INTERACT_FINISH`
- `public static final GameEvent ITEM_INTERACT_START`
- `public static final GameEvent JUKEBOX_PLAY`
- `public static final GameEvent JUKEBOX_STOP_PLAY`
- `public static final GameEvent LIGHTNING_STRIKE`
- `public static final GameEvent NOTE_BLOCK_PLAY`
- `public static final GameEvent PRIME_FUSE`
- `public static final GameEvent PROJECTILE_LAND`
- `public static final GameEvent PROJECTILE_SHOOT`
- `public static final GameEvent RESONATE_1`
- `public static final GameEvent RESONATE_2`
- `public static final GameEvent RESONATE_3`
- `public static final GameEvent RESONATE_4`
- `public static final GameEvent RESONATE_5`
- `public static final GameEvent RESONATE_6`
- `public static final GameEvent RESONATE_7`
- `public static final GameEvent RESONATE_8`
- `public static final GameEvent RESONATE_9`
- `public static final GameEvent RESONATE_10`
- `public static final GameEvent RESONATE_11`
- `public static final GameEvent RESONATE_12`
- `public static final GameEvent RESONATE_13`
- `public static final GameEvent RESONATE_14`
- `public static final GameEvent RESONATE_15`
- `public static final GameEvent SCULK_SENSOR_TENDRILS_CLICKING`
- `public static final GameEvent SHEAR`
- `public static final GameEvent SHRIEK`
- `public static final GameEvent SPLASH`
- `public static final GameEvent STEP`
- `public static final GameEvent SWIM`
- `public static final GameEvent TELEPORT`
- `public static final GameEvent UNEQUIP`
- `@Deprecated(since="1.19") public static final GameEvent BLOCK_PRESS`
- `@Deprecated(since="1.19") public static final GameEvent BLOCK_SWITCH`
- `@Deprecated(since="1.19") public static final GameEvent BLOCK_UNPRESS`
- `@Deprecated(since="1.19") public static final GameEvent BLOCK_UNSWITCH`
- `@Deprecated(since="1.20") public static final GameEvent DISPENSE_FAIL`
- `@Deprecated(since="1.19") public static final GameEvent DRINKING_FINISH`
- `@Deprecated(since="1.19") public static final GameEvent ELYTRA_FREE_FALL`
- `@Deprecated(since="1.19") public static final GameEvent ENTITY_DAMAGED`
- `@Deprecated(since="1.19") public static final GameEvent ENTITY_DYING`
- `@Deprecated(since="1.19") public static final GameEvent ENTITY_KILLED`
- `@Deprecated(since="1.20.2") public static final GameEvent ENTITY_ROAR`
- `@Deprecated(since="1.20.2") public static final GameEvent ENTITY_SHAKE`
- `@Deprecated(since="1.19") public static final GameEvent MOB_INTERACT`
- `@Deprecated(since="1.20") public static final GameEvent PISTON_CONTRACT`
- `@Deprecated(since="1.20") public static final GameEvent PISTON_EXTEND`
- `@Deprecated(since="1.19") public static final GameEvent RAVAGER_ROAR`
- `@Deprecated(since="1.19") public static final GameEvent RING_BELL`
- `@Deprecated(since="1.19") public static final GameEvent SHULKER_CLOSE`
- `@Deprecated(since="1.19") public static final GameEvent SHULKER_OPEN`
- `@Deprecated(since="1.19") public static final GameEvent WOLF_SHAKING`
- `public GameEvent()`
- `@Nullable @Deprecated(since="1.20.1") public static @Nullable GameEvent getByKey(@NotNull @NotNull NamespacedKey namespacedKey)`
- `@NotNull @Deprecated(since="1.20.1") public static @NotNull Collection<GameEvent> values()`
- `public abstract int getRange()`
- `public abstract int getVibrationLevel()`
