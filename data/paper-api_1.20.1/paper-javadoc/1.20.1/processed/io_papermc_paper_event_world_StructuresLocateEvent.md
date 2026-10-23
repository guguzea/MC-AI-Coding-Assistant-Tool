---
title: "io.papermc.paper.event.world.StructuresLocateEvent"
package: "io.papermc.paper.event.world"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/world/StructuresLocateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public StructuresLocateEvent(@NotNull @NotNull World world, @NotNull @NotNull Location origin, @NotNull @NotNull List<Structure> structures, int radius, boolean findUnexplored)`
- `@NotNull public @NotNull Location getOrigin()`
- `@Nullable public @Nullable StructuresLocateEvent.Result getResult()`
- `public void setResult(@Nullable @Nullable StructuresLocateEvent.Result result)`
- `@Deprecated(forRemoval=true) @NotNull public @NotNull List<ConfiguredStructure> getConfiguredStructures()`
- `@Deprecated(forRemoval=true) public void setConfiguredStructures(@NotNull @NotNull List<ConfiguredStructure> configuredStructures)`
- `@NotNull public @NotNull @UnmodifiableView List<Structure> getStructures()`
- `public void setStructures(@NotNull @NotNull List<Structure> structures)`
- `public int getRadius()`
- `public void setRadius(int radius)`
- `public boolean shouldFindUnexplored()`
- `public void setFindUnexplored(boolean findUnexplored)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
