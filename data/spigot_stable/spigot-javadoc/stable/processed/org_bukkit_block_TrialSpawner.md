---
title: "org.bukkit.block.TrialSpawner"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/TrialSpawner.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface TrialSpawner**
`public interface TrialSpawner extends TileState`
- `int getCooldownLength()`
- `void setCooldownLength(int ticks)`
- `int getRequiredPlayerRange()`
- `void setRequiredPlayerRange(int requiredPlayerRange)`
- `@NotNull Collection<Player> getTrackedPlayers()`
- `boolean isTrackingPlayer(@NotNull Player player)`
- `void startTrackingPlayer(@NotNull Player player)`
- `void stopTrackingPlayer(@NotNull Player player)`
- `@NotNull Collection<Entity> getTrackedEntities()`
- `boolean isTrackingEntity(@NotNull Entity entity)`
- `void startTrackingEntity(@NotNull Entity entity)`
- `void stopTrackingEntity(@NotNull Entity entity)`
- `boolean isOminous()`
- `void setOminous(boolean ominous)`
- `@NotNull TrialSpawnerConfiguration getNormalConfiguration()`
- `@NotNull TrialSpawnerConfiguration getOminousConfiguration()`
