---
title: "org.bukkit.ServerTickManager"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.ServerTickManager`
- `public abstract boolean isRunningNormally()`
- `public abstract boolean isStepping()`
- `public abstract boolean isSprinting()`
- `public abstract boolean isFrozen()`
- `public abstract float getTickRate()`
- `public abstract void setTickRate(float)`
- `public abstract void setFrozen(boolean)`
- `public abstract boolean stepGameIfFrozen(int)`
- `public abstract boolean stopStepping()`
- `public abstract boolean requestGameToSprint(int)`
- `public abstract boolean stopSprinting()`
- `public abstract boolean isFrozen(org.bukkit.entity.Entity)`
- `public abstract int getFrozenTicksToRun()`
