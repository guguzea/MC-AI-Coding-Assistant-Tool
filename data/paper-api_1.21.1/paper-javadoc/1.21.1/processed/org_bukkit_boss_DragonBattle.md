---
title: "org.bukkit.boss.DragonBattle"
package: "org.bukkit.boss"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/boss/DragonBattle.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable EnderDragon getEnderDragon()`
- `@NotNull @NotNull BossBar getBossBar()`
- `@Nullable @Nullable Location getEndPortalLocation()`
- `boolean generateEndPortal(boolean withPortals)`
- `boolean hasBeenPreviouslyKilled()`
- `void setPreviouslyKilled(boolean previouslyKilled)`
- `void initiateRespawn()`
- `boolean initiateRespawn(@Nullable @Nullable Collection<EnderCrystal> enderCrystals)`
- `@NotNull @NotNull DragonBattle.RespawnPhase getRespawnPhase()`
- `boolean setRespawnPhase(@NotNull @NotNull DragonBattle.RespawnPhase phase)`
- `void resetCrystals()`
- `int getGatewayCount()`
- `boolean spawnNewGateway()`
- `void spawnNewGateway(@NotNull Position position)`
- `@NotNull @Unmodifiable List<EnderCrystal> getRespawnCrystals()`
- `@NotNull @Unmodifiable List<EnderCrystal> getHealingCrystals()`
