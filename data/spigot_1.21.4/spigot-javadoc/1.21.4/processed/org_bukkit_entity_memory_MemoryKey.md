---
title: "org.bukkit.entity.memory.MemoryKey"
package: "org.bukkit.entity.memory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public final class org.bukkit.entity.memory.MemoryKey<T> implements org.bukkit.Keyed, org.bukkit.registry.RegistryAware`
- `public static final org.bukkit.entity.memory.MemoryKey<org.bukkit.Location> HOME`
- `public static final org.bukkit.entity.memory.MemoryKey<org.bukkit.Location> POTENTIAL_JOB_SITE`
- `public static final org.bukkit.entity.memory.MemoryKey<org.bukkit.Location> JOB_SITE`
- `public static final org.bukkit.entity.memory.MemoryKey<org.bukkit.Location> MEETING_POINT`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Boolean> GOLEM_DETECTED_RECENTLY`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Long> LAST_SLEPT`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Long> LAST_WOKEN`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Long> LAST_WORKED_AT_POI`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Boolean> UNIVERSAL_ANGER`
- `public static final org.bukkit.entity.memory.MemoryKey<java.util.UUID> ANGRY_AT`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Boolean> ADMIRING_ITEM`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Boolean> ADMIRING_DISABLED`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Boolean> HUNTED_RECENTLY`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Integer> PLAY_DEAD_TICKS`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Integer> TEMPTATION_COOLDOWN_TICKS`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Boolean> IS_TEMPTED`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Integer> LONG_JUMP_COOLING_DOWN`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Boolean> HAS_HUNTING_COOLDOWN`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Integer> RAM_COOLDOWN_TICKS`
- `public static final org.bukkit.entity.memory.MemoryKey<java.util.UUID> LIKED_PLAYER`
- `public static final org.bukkit.entity.memory.MemoryKey<org.bukkit.Location> LIKED_NOTEBLOCK_POSITION`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Integer> LIKED_NOTEBLOCK_COOLDOWN_TICKS`
- `public static final org.bukkit.entity.memory.MemoryKey<java.lang.Integer> ITEM_PICKUP_COOLDOWN_TICKS`
- `public static final org.bukkit.entity.memory.MemoryKey<org.bukkit.Location> SNIFFER_EXPLORED_POSITIONS`
- `public org.bukkit.NamespacedKey getKeyOrThrow()`
- `public org.bukkit.NamespacedKey getKeyOrNull()`
- `public boolean isRegistered()`
- `public org.bukkit.NamespacedKey getKey()`
- `public java.lang.Class<T> getMemoryClass()`
- `public static org.bukkit.entity.memory.MemoryKey getByKey(org.bukkit.NamespacedKey)`
- `public static java.util.Set<org.bukkit.entity.memory.MemoryKey> values()`
