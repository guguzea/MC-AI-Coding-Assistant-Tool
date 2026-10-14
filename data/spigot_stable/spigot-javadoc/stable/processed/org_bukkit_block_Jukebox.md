---
title: "org.bukkit.block.Jukebox"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Jukebox.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Jukebox**
`public interface Jukebox extends TileState, BlockInventoryHolder`
- `@NotNull Material getPlaying()`
- `void setPlaying(@Nullable Material record)`
- `boolean hasRecord()`
- `@NotNull ItemStack getRecord()`
- `void setRecord(@Nullable ItemStack record)`
- `boolean isPlaying()`
- `boolean startPlaying()`
- `void stopPlaying()`
- `boolean eject()`
- `@NotNull JukeboxInventory getInventory()`
- `@NotNull JukeboxInventory getSnapshotInventory()`
