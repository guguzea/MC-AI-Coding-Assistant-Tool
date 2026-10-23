---
title: "com.destroystokyo.paper.entity.Pathfinder"
package: "com.destroystokyo.paper.entity"
source: https://jd.papermc.io/paper/1.21.1/com/destroystokyo/paper/entity/Pathfinder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `Mob getEntity()`
- `void stopPathfinding()`
- `boolean hasPath()`
- `@Nullable Pathfinder.PathResult getCurrentPath()`
- `@Nullable Pathfinder.PathResult findPath(Location loc)`
- `@Nullable Pathfinder.PathResult findPath(LivingEntity target)`
- `default boolean moveTo(Location loc)`
- `default boolean moveTo(Location loc, double speed)`
- `default boolean moveTo(LivingEntity target)`
- `default boolean moveTo(LivingEntity target, double speed)`
- `default boolean moveTo(Pathfinder.PathResult path)`
- `boolean moveTo(Pathfinder.PathResult path, double speed)`
- `boolean canOpenDoors()`
- `void setCanOpenDoors(boolean canOpenDoors)`
- `boolean canPassDoors()`
- `void setCanPassDoors(boolean canPassDoors)`
- `boolean canFloat()`
- `void setCanFloat(boolean canFloat)`
