---
title: "org.bukkit.ServerTickManager"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/ServerTickManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
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
- `boolean isFrozen(@NotNull Entity entity)`
- `int getFrozenTicksToRun()`
