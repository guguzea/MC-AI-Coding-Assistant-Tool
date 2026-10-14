---
title: "org.bukkit.boss.DragonBattle"
package: "org.bukkit.boss"
source: https://jd.papermc.io/paper/26.3/org/bukkit/boss/DragonBattle.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DragonBattle**
`public interface DragonBattle`
- `@Nullable @Nullable EnderDragon getEnderDragon()`
- `@NotNull @NotNull BossBar getBossBar()`
- `@Nullable @Nullable Location getEndPortalLocation()`
- `boolean generateEndPortal(boolean withPortals)`
- `boolean hasBeenPreviouslyKilled()`
- `void setPreviouslyKilled(boolean previouslyKilled)`
- `void initiateRespawn()`
- `boolean initiateRespawn(@Nullable @Nullable Collection<EnderCrystal> crystals)`
- `@NotNull @NotNull DragonBattle.RespawnPhase getRespawnPhase()`
- `boolean setRespawnPhase(@NotNull @NotNull DragonBattle.RespawnPhase phase)`
- `void resetCrystals()`
- `int getGatewayCount()`
- `boolean spawnNewGateway()`
- `void spawnNewGateway(@NotNull Position position)`
- `@NotNull @Unmodifiable List<EnderCrystal> getRespawnCrystals()`
- `@NotNull @Unmodifiable List<EnderCrystal> getHealingCrystals()`
