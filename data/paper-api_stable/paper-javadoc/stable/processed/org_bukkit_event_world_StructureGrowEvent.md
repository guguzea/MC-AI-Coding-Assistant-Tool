---
title: "org.bukkit.event.world.StructureGrowEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/world/StructureGrowEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class StructureGrowEvent**
`public class StructureGrowEvent extends WorldEvent implements Cancellable`
- `@Internal public StructureGrowEvent(@NotNull @NotNull Location location, @NotNull @NotNull TreeType species, boolean bonemeal, @Nullable @Nullable Player player, @NotNull @NotNull List<BlockState> blocks)`
- `@NotNull public @NotNull Location getLocation()`
- `@NotNull public @NotNull TreeType getSpecies()`
- `public boolean isFromBonemeal()`
- `@Nullable public @Nullable Player getPlayer()`
- `@NotNull public @NotNull List<BlockState> getBlocks()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
