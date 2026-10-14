---
title: "org.bukkit.event.block.VaultDisplayItemEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/VaultDisplayItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class VaultDisplayItemEvent**
`public class VaultDisplayItemEvent extends BlockEvent implements Cancellable`
- `@Internal public VaultDisplayItemEvent(@NotNull @NotNull Block vault, @Nullable @Nullable ItemStack displayItem)`
- `@Nullable public @Nullable ItemStack getDisplayItem()`
- `public void setDisplayItem(@Nullable @Nullable ItemStack displayItem)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
