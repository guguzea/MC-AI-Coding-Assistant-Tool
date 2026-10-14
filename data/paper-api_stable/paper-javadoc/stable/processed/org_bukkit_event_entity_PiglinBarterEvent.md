---
title: "org.bukkit.event.entity.PiglinBarterEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/PiglinBarterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PiglinBarterEvent**
`public class PiglinBarterEvent extends EntityEvent implements Cancellable`
- `@Internal public PiglinBarterEvent(@NotNull @NotNull Piglin piglin, @NotNull @NotNull ItemStack input, @NotNull @NotNull List<ItemStack> outcome)`
- `@NotNull public @NotNull Piglin getEntity()`
- `@NotNull public @NotNull ItemStack getInput()`
- `@NotNull public @NotNull List<ItemStack> getOutcome()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
