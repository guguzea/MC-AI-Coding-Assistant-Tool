---
title: "org.bukkit.event.block.TNTPrimeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/TNTPrimeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class TNTPrimeEvent**
`public class TNTPrimeEvent extends BlockEvent implements Cancellable`
- `@Internal public TNTPrimeEvent(@NotNull @NotNull Block block, @NotNull @NotNull TNTPrimeEvent.PrimeCause igniteCause, @Nullable @Nullable Entity primingEntity, @Nullable @Nullable Block primingBlock)`
- `@NotNull public @NotNull TNTPrimeEvent.PrimeCause getCause()`
- `@Nullable public @Nullable Entity getPrimingEntity()`
- `@Nullable public @Nullable Block getPrimingBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
