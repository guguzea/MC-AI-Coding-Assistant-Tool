---
title: "org.bukkit.entity.FishHook"
package: "org.bukkit.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.entity.FishHook extends org.bukkit.entity.Projectile`
- `public abstract int getMinWaitTime()`
- `public abstract void setMinWaitTime(int)`
- `public abstract int getMaxWaitTime()`
- `public abstract void setMaxWaitTime(int)`
- `public abstract boolean getApplyLure()`
- `public abstract void setApplyLure(boolean)`
- `public abstract double getBiteChance()`
- `public abstract void setBiteChance(double) throws java.lang.IllegalArgumentException`
- `public abstract boolean isInOpenWater()`
- `public abstract org.bukkit.entity.Entity getHookedEntity()`
- `public abstract void setHookedEntity(org.bukkit.entity.Entity)`
- `public abstract boolean pullHookedEntity()`
- `public abstract org.bukkit.entity.FishHook$HookState getState()`
