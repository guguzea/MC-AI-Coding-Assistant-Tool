---
title: "org.bukkit.event.entity.FoodLevelChangeEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/FoodLevelChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class FoodLevelChangeEvent**
`public class FoodLevelChangeEvent extends EntityEvent implements Cancellable`
- `public FoodLevelChangeEvent(@NotNull HumanEntity what, int level)`
- `public FoodLevelChangeEvent(@NotNull HumanEntity what, int level, @Nullable ItemStack item)`
- `@NotNull public HumanEntity getEntity()`
- `@Nullable public ItemStack getItem()`
- `public int getFoodLevel()`
- `public void setFoodLevel(int level)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
