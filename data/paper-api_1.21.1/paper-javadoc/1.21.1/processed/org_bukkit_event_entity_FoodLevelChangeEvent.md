---
title: "org.bukkit.event.entity.FoodLevelChangeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/entity/FoodLevelChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public FoodLevelChangeEvent(@NotNull @NotNull HumanEntity what, int level)`
- `public FoodLevelChangeEvent(@NotNull @NotNull HumanEntity what, int level, @Nullable @Nullable ItemStack item)`
- `@NotNull public @NotNull HumanEntity getEntity()`
- `@Nullable public @Nullable ItemStack getItem()`
- `public int getFoodLevel()`
- `public void setFoodLevel(int level)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
