---
title: "org.bukkit.entity.memory.MemoryKey"
package: "org.bukkit.entity.memory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/memory/MemoryKey.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class MemoryKey<T>**
`public final class MemoryKey<T> extends Object implements Keyed, RegistryAware`
- `public static final MemoryKey<Location> HOME`
- `public static final MemoryKey<Location> POTENTIAL_JOB_SITE`
- `public static final MemoryKey<Location> JOB_SITE`
- `public static final MemoryKey<Location> MEETING_POINT`
- `public static final MemoryKey<Boolean> GOLEM_DETECTED_RECENTLY`
- `public static final MemoryKey<Boolean> DANGER_DETECTED_RECENTLY`
- `public static final MemoryKey<Long> LAST_SLEPT`
- `public static final MemoryKey<Long> LAST_WOKEN`
- `public static final MemoryKey<Long> LAST_WORKED_AT_POI`
- `public static final MemoryKey<Boolean> UNIVERSAL_ANGER`
- `public static final MemoryKey<Integer> CHARGE_COOLDOWN_TICKS`
- `public static final MemoryKey<Integer> ATTACK_TARGET_COOLDOWN`
- `public static final MemoryKey<UUID> ANGRY_AT`
- `public static final MemoryKey<Boolean> ADMIRING_ITEM`
- `public static final MemoryKey<Boolean> ADMIRING_DISABLED`
- `public static final MemoryKey<Boolean> HUNTED_RECENTLY`
- `public static final MemoryKey<Integer> PLAY_DEAD_TICKS`
- `public static final MemoryKey<Integer> TEMPTATION_COOLDOWN_TICKS`
- `public static final MemoryKey<Integer> GAZE_COOLDOWN_TICKS`
- `public static final MemoryKey<Boolean> IS_TEMPTED`
- `public static final MemoryKey<Integer> LONG_JUMP_COOLING_DOWN`
- `public static final MemoryKey<Boolean> HAS_HUNTING_COOLDOWN`
- `public static final MemoryKey<Integer> RAM_COOLDOWN_TICKS`
- `public static final MemoryKey<Boolean> IS_PANICKING`
- `public static final MemoryKey<UUID> LIKED_PLAYER`
- `public static final MemoryKey<Location> LIKED_NOTEBLOCK_POSITION`
- `public static final MemoryKey<Integer> LIKED_NOTEBLOCK_COOLDOWN_TICKS`
- `public static final MemoryKey<Integer> ITEM_PICKUP_COOLDOWN_TICKS`
- `@NotNull public NamespacedKey getKeyOrThrow()`
- `@Nullable public NamespacedKey getKeyOrNull()`
- `public boolean isRegistered()`
- `@NotNull @Deprecated(since="1.21.4") public NamespacedKey getKey()`
- `@NotNull public Class<T> getMemoryClass()`
- `@Nullable public static MemoryKey getByKey(@NotNull NamespacedKey namespacedKey)`
- `@NotNull public static Set<MemoryKey> values()`
