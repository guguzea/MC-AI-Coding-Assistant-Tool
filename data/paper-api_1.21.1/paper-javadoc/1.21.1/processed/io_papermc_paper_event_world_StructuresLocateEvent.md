---
title: "io.papermc.paper.event.world.StructuresLocateEvent"
package: "io.papermc.paper.event.world"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/event/world/StructuresLocateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Internal public StructuresLocateEvent(World world, Location origin, List<Structure> structures, int radius, boolean findUnexplored)`
- `public Location getOrigin()`
- `public @Nullable StructuresLocateEvent.Result getResult()`
- `public void setResult(@Nullable StructuresLocateEvent.Result result)`
- `public @UnmodifiableView List<Structure> getStructures()`
- `public void setStructures(List<Structure> structures)`
- `public int getRadius()`
- `public void setRadius(int radius)`
- `public boolean shouldFindUnexplored()`
- `public void setFindUnexplored(boolean findUnexplored)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
