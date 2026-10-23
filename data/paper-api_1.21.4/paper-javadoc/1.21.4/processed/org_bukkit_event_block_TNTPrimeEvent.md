---
title: "org.bukkit.event.block.TNTPrimeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/block/TNTPrimeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public TNTPrimeEvent(@NotNull @NotNull Block block, @NotNull @NotNull TNTPrimeEvent.PrimeCause igniteCause, @Nullable @Nullable Entity primingEntity, @Nullable @Nullable Block primingBlock)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull TNTPrimeEvent.PrimeCause getCause()`
- `@Nullable public @Nullable Entity getPrimingEntity()`
- `@Nullable public @Nullable Block getPrimingBlock()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
