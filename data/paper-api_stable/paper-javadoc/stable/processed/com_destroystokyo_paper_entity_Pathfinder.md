---
title: "com.destroystokyo.paper.entity.Pathfinder"
package: "com.destroystokyo.paper.entity"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/entity/Pathfinder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Pathfinder**
`@NullMarked public interface Pathfinder`
- `Mob getEntity()`
- `void stopPathfinding()`
- `boolean hasPath()`
- `@Nullable Pathfinder.PathResult getCurrentPath()`
- `default @Nullable Pathfinder.PathResult findPath(Location loc)`
- `@Nullable Pathfinder.PathResult findPath(Location loc, @NonNegative int reachRange)`
- `default @Nullable Pathfinder.PathResult findPath(LivingEntity target)`
- `default @Nullable Pathfinder.PathResult findPath(Entity target)`
- `@Nullable Pathfinder.PathResult findPath(Entity target, @NonNegative int reachRange)`
- `default boolean moveTo(Location loc)`
- `default boolean moveTo(Location loc, double speed)`
- `default boolean moveTo(LivingEntity target)`
- `default boolean moveTo(LivingEntity target, double speed)`
- `default boolean moveTo(Entity target)`
- `default boolean moveTo(Entity target, double speed)`
- `default boolean moveTo(Pathfinder.PathResult path)`
- `boolean moveTo(Pathfinder.PathResult path, double speed)`
- `boolean canOpenDoors()`
- `void setCanOpenDoors(boolean canOpenDoors)`
- `boolean canPassDoors()`
- `void setCanPassDoors(boolean canPassDoors)`
- `boolean canFloat()`
- `void setCanFloat(boolean canFloat)`
