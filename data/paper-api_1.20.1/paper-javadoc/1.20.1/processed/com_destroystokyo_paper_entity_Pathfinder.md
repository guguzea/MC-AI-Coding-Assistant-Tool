---
title: "com.destroystokyo.paper.entity.Pathfinder"
package: "com.destroystokyo.paper.entity"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/entity/Pathfinder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Mob getEntity()`
- `void stopPathfinding()`
- `boolean hasPath()`
- `@Nullable @Nullable Pathfinder.PathResult getCurrentPath()`
- `@Nullable @Nullable Pathfinder.PathResult findPath(@NotNull @NotNull Location loc)`
- `@Nullable @Nullable Pathfinder.PathResult findPath(@NotNull @NotNull LivingEntity target)`
- `default boolean moveTo(@NotNull @NotNull Location loc)`
- `default boolean moveTo(@NotNull @NotNull Location loc, double speed)`
- `default boolean moveTo(@NotNull @NotNull LivingEntity target)`
- `default boolean moveTo(@NotNull @NotNull LivingEntity target, double speed)`
- `default boolean moveTo(@NotNull @NotNull Pathfinder.PathResult path)`
- `boolean moveTo(@NotNull @NotNull Pathfinder.PathResult path, double speed)`
- `boolean canOpenDoors()`
- `void setCanOpenDoors(boolean canOpenDoors)`
- `boolean canPassDoors()`
- `void setCanPassDoors(boolean canPassDoors)`
- `boolean canFloat()`
- `void setCanFloat(boolean canFloat)`
