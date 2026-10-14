---
title: "org.bukkit.event.entity.PiglinBarterEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/PiglinBarterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PiglinBarterEvent**
`public class PiglinBarterEvent extends EntityEvent implements Cancellable`
- `public PiglinBarterEvent(@NotNull Piglin what, @NotNull ItemStack input, @NotNull List<ItemStack> outcome)`
- `@NotNull public Piglin getEntity()`
- `@NotNull public ItemStack getInput()`
- `@NotNull public List<ItemStack> getOutcome()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
