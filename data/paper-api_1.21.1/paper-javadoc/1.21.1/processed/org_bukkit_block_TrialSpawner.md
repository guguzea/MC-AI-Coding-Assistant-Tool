---
title: "org.bukkit.block.TrialSpawner"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/block/TrialSpawner.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `int getCooldownLength()`
- `void setCooldownLength(int ticks)`
- `int getRequiredPlayerRange()`
- `void setRequiredPlayerRange(int requiredPlayerRange)`
- `@NotNull @NotNull Collection<Player> getTrackedPlayers()`
- `boolean isTrackingPlayer(@NotNull @NotNull Player player)`
- `void startTrackingPlayer(@NotNull @NotNull Player player)`
- `void stopTrackingPlayer(@NotNull @NotNull Player player)`
- `@NotNull @NotNull Collection<Entity> getTrackedEntities()`
- `boolean isTrackingEntity(@NotNull @NotNull Entity entity)`
- `void startTrackingEntity(@NotNull @NotNull Entity entity)`
- `void stopTrackingEntity(@NotNull @NotNull Entity entity)`
- `boolean isOminous()`
- `void setOminous(boolean ominous)`
- `@NotNull @NotNull TrialSpawnerConfiguration getNormalConfiguration()`
- `@NotNull @NotNull TrialSpawnerConfiguration getOminousConfiguration()`
