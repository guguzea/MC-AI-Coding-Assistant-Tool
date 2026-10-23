---
title: "org.bukkit.boss.DragonBattle"
package: "org.bukkit.boss"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
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
