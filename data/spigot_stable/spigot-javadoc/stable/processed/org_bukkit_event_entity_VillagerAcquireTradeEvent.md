---
title: "org.bukkit.event.entity.VillagerAcquireTradeEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/VillagerAcquireTradeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class VillagerAcquireTradeEvent**
`public class VillagerAcquireTradeEvent extends EntityEvent implements Cancellable`
- `public VillagerAcquireTradeEvent(@NotNull AbstractVillager what, @NotNull MerchantRecipe recipe)`
- `@NotNull public MerchantRecipe getRecipe()`
- `public void setRecipe(@NotNull MerchantRecipe recipe)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public AbstractVillager getEntity()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
