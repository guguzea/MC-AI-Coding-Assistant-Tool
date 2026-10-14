---
title: "org.bukkit.event.entity.VillagerReplenishTradeEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/VillagerReplenishTradeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class VillagerReplenishTradeEvent**
`public class VillagerReplenishTradeEvent extends EntityEvent implements Cancellable`
- `public VillagerReplenishTradeEvent(@NotNull AbstractVillager what, @NotNull MerchantRecipe recipe)`
- `@NotNull public MerchantRecipe getRecipe()`
- `public void setRecipe(@NotNull MerchantRecipe recipe)`
- `@Deprecated(since="1.18.1") public int getBonus()`
- `@Deprecated(since="1.18.1") public void setBonus(int bonus)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public AbstractVillager getEntity()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
