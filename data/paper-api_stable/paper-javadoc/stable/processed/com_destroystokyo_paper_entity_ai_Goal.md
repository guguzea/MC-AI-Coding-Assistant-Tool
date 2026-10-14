---
title: "com.destroystokyo.paper.entity.ai.Goal"
package: "com.destroystokyo.paper.entity.ai"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/entity/ai/Goal.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Goal<T extends Mob>**
`@NullMarked public interface Goal<T extends Mob>`
- `boolean shouldActivate()`
- `default boolean shouldStayActive()`
- `default void start()`
- `default void stop()`
- `default void tick()`
- `GoalKey<T> getKey()`
- `EnumSet<GoalType> getTypes()`
