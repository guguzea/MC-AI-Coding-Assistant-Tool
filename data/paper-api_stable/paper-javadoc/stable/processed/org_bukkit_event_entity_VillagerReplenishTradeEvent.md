---
title: "org.bukkit.event.entity.VillagerReplenishTradeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/VillagerReplenishTradeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class VillagerReplenishTradeEvent**
`public class VillagerReplenishTradeEvent extends EntityEvent implements Cancellable`
- `@Internal public VillagerReplenishTradeEvent(@NotNull @NotNull AbstractVillager villager, @NotNull @NotNull MerchantRecipe recipe)`
- `@NotNull public @NotNull AbstractVillager getEntity()`
- `@NotNull public @NotNull MerchantRecipe getRecipe()`
- `public void setRecipe(@NotNull @NotNull MerchantRecipe recipe)`
- `@Deprecated(since="1.18.1") public int getBonus()`
- `@Deprecated(since="1.18.1") public void setBonus(int bonus)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
