---
title: "org.bukkit.boss.DragonBattle"
package: "org.bukkit.boss"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
