---
title: "io.papermc.paper.event.world.StructureLocateEvent"
package: "io.papermc.paper.event.world"
source: https://jd.papermc.io/paper/1.16.5/io/papermc/paper/event/world/StructureLocateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public StructureLocateEvent&#8203;(@NotNull @NotNull World world, @NotNull @NotNull Location origin, @NotNull @NotNull StructureType structureType, int radius, boolean findUnexplored)`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@Nullable public @Nullable Location getResult()`
- `public void setResult&#8203;(@Nullable @Nullable Location result)`
- `@NotNull public @NotNull StructureType getType()`
- `public void setType&#8203;(@NotNull @NotNull StructureType type)`
- `@NotNull public @NotNull Location getOrigin()`
- `public int getRadius()`
- `public void setRadius&#8203;(int radius)`
- `public boolean shouldFindUnexplored()`
- `public void setFindUnexplored&#8203;(boolean findUnexplored)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
