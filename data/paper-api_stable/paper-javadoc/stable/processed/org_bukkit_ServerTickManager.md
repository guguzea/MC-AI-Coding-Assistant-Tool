---
title: "org.bukkit.ServerTickManager"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/ServerTickManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ServerTickManager**
`public interface ServerTickManager`
- `boolean isRunningNormally()`
- `boolean isStepping()`
- `boolean isSprinting()`
- `boolean isFrozen()`
- `float getTickRate()`
- `void setTickRate(float tick)`
- `void setFrozen(boolean frozen)`
- `boolean stepGameIfFrozen(int ticks)`
- `boolean stopStepping()`
- `boolean requestGameToSprint(int ticks)`
- `boolean stopSprinting()`
- `boolean isFrozen(@NotNull @NotNull Entity entity)`
- `int getFrozenTicksToRun()`
