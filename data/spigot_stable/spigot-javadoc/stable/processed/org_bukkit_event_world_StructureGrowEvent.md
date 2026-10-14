---
title: "org.bukkit.event.world.StructureGrowEvent"
package: "org.bukkit.event.world"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/world/StructureGrowEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class StructureGrowEvent**
`public class StructureGrowEvent extends WorldEvent implements Cancellable`
- `public StructureGrowEvent(@NotNull Location location, @NotNull TreeType species, boolean bonemeal, @Nullable Player player, @NotNull List<BlockState> blocks)`
- `@NotNull public Location getLocation()`
- `@NotNull public TreeType getSpecies()`
- `public boolean isFromBonemeal()`
- `@Nullable public Player getPlayer()`
- `@NotNull public List<BlockState> getBlocks()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
