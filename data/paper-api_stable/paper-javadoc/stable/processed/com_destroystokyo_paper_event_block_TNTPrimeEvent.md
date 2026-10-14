---
title: "com.destroystokyo.paper.event.block.TNTPrimeEvent"
package: "com.destroystokyo.paper.event.block"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/block/TNTPrimeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class TNTPrimeEvent**
`@Deprecated(forRemoval=true, since="1.19.4") public class TNTPrimeEvent extends BlockEvent implements Cancellable`
- `@Internal public TNTPrimeEvent(@NotNull @NotNull Block block, @NotNull @NotNull TNTPrimeEvent.PrimeReason reason, @Nullable @Nullable Entity primerEntity)`
- `@NotNull public @NotNull TNTPrimeEvent.PrimeReason getReason()`
- `@Nullable public @Nullable Entity getPrimerEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
