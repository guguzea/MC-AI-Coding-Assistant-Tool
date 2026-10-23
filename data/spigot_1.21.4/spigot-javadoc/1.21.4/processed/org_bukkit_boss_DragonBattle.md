---
title: "org.bukkit.boss.DragonBattle"
package: "org.bukkit.boss"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.boss.DragonBattle`
- `public abstract org.bukkit.entity.EnderDragon getEnderDragon()`
- `public abstract org.bukkit.boss.BossBar getBossBar()`
- `public abstract org.bukkit.Location getEndPortalLocation()`
- `public abstract boolean generateEndPortal(boolean)`
- `public abstract boolean hasBeenPreviouslyKilled()`
- `public abstract void setPreviouslyKilled(boolean)`
- `public abstract void initiateRespawn()`
- `public abstract boolean initiateRespawn(java.util.Collection<org.bukkit.entity.EnderCrystal>)`
- `public abstract org.bukkit.boss.DragonBattle$RespawnPhase getRespawnPhase()`
- `public abstract boolean setRespawnPhase(org.bukkit.boss.DragonBattle$RespawnPhase)`
- `public abstract void resetCrystals()`
