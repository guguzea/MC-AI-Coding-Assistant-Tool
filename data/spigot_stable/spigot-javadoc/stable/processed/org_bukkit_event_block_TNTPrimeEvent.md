---
title: "org.bukkit.event.block.TNTPrimeEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/TNTPrimeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class TNTPrimeEvent**
`public class TNTPrimeEvent extends BlockEvent implements Cancellable`
- `public TNTPrimeEvent(@NotNull Block block, @NotNull TNTPrimeEvent.PrimeCause igniteCause, @Nullable Entity primingEntity, @Nullable Block primingBlock)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public TNTPrimeEvent.PrimeCause getCause()`
- `@Nullable public Entity getPrimingEntity()`
- `@Nullable public Block getPrimingBlock()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
