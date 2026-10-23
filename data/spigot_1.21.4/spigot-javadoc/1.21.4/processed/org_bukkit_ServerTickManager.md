---
title: "org.bukkit.ServerTickManager"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
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
