---
title: "com.destroystokyo.paper.entity.Pathfinder"
package: "com.destroystokyo.paper.entity"
source: https://jd.papermc.io/paper/1.16.5/com/destroystokyo/paper/entity/Pathfinder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Mob getEntity()`
- `void stopPathfinding()`
- `boolean hasPath()`
- `@Nullable @Nullable Pathfinder.PathResult getCurrentPath()`
- `@Nullable @Nullable Pathfinder.PathResult findPath&#8203;(@NotNull @NotNull Location loc)`
- `@Nullable @Nullable Pathfinder.PathResult findPath&#8203;(@NotNull @NotNull LivingEntity target)`
- `default boolean moveTo&#8203;(@NotNull @NotNull Location loc)`
- `default boolean moveTo&#8203;(@NotNull @NotNull Location loc, double speed)`
- `default boolean moveTo&#8203;(@NotNull @NotNull LivingEntity target)`
- `default boolean moveTo&#8203;(@NotNull @NotNull LivingEntity target, double speed)`
- `default boolean moveTo&#8203;(@NotNull @NotNull Pathfinder.PathResult path)`
- `boolean moveTo&#8203;(@NotNull @NotNull Pathfinder.PathResult path, double speed)`
- `boolean canOpenDoors()`
- `void setCanOpenDoors&#8203;(boolean canOpenDoors)`
- `boolean canPassDoors()`
- `void setCanPassDoors&#8203;(boolean canPassDoors)`
- `boolean canFloat()`
- `void setCanFloat&#8203;(boolean canFloat)`
