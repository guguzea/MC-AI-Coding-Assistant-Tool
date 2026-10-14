---
title: "org.bukkit.event.entity.VillagerAcquireTradeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/VillagerAcquireTradeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class VillagerAcquireTradeEvent**
`public class VillagerAcquireTradeEvent extends EntityEvent implements Cancellable`
- `@Internal public VillagerAcquireTradeEvent(@NotNull @NotNull AbstractVillager villager, @NotNull @NotNull MerchantRecipe recipe)`
- `@NotNull public @NotNull AbstractVillager getEntity()`
- `@NotNull public @NotNull MerchantRecipe getRecipe()`
- `public void setRecipe(@NotNull @NotNull MerchantRecipe recipe)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
