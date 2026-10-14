---
title: "org.bukkit.boss.DragonBattle"
package: "org.bukkit.boss"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/boss/DragonBattle.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface DragonBattle**
`public interface DragonBattle`
- `@Nullable EnderDragon getEnderDragon()`
- `@NotNull BossBar getBossBar()`
- `@Nullable Location getEndPortalLocation()`
- `boolean generateEndPortal(boolean withPortals)`
- `boolean hasBeenPreviouslyKilled()`
- `void setPreviouslyKilled(boolean previouslyKilled)`
- `void initiateRespawn()`
- `boolean initiateRespawn(@Nullable Collection<EnderCrystal> enderCrystals)`
- `@NotNull DragonBattle.RespawnPhase getRespawnPhase()`
- `boolean setRespawnPhase(@NotNull DragonBattle.RespawnPhase phase)`
- `void resetCrystals()`
