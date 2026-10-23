---
title: "org.bukkit.ServerTickManager"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/ServerTickManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

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
