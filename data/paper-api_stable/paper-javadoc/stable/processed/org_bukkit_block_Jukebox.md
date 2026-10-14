---
title: "org.bukkit.block.Jukebox"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/Jukebox.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Jukebox**
`public interface Jukebox extends TileStateInventoryHolder`
- `@NotNull @NotNull Material getPlaying()`
- `void setPlaying(@Nullable @Nullable Material record)`
- `boolean hasRecord()`
- `@NotNull @NotNull ItemStack getRecord()`
- `void setRecord(@Nullable @Nullable ItemStack record)`
- `boolean isPlaying()`
- `boolean startPlaying()`
- `void stopPlaying()`
- `boolean eject()`
- `@NotNull @NotNull JukeboxInventory getInventory()`
- `@NotNull @NotNull JukeboxInventory getSnapshotInventory()`
