---
title: "org.bukkit.event.entity.FoodLevelChangeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/FoodLevelChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class FoodLevelChangeEvent**
`public class FoodLevelChangeEvent extends EntityEvent implements Cancellable`
- `@Internal @Deprecated(since="1.21.5", forRemoval=true) public FoodLevelChangeEvent(@NotNull @NotNull HumanEntity human, int level)`
- `@Internal public FoodLevelChangeEvent(@NotNull @NotNull HumanEntity human, int level, @Nullable @Nullable ItemStack item)`
- `@NotNull public @NotNull HumanEntity getEntity()`
- `@Nullable public @Nullable ItemStack getItem()`
- `public int getFoodLevel()`
- `public void setFoodLevel(int level)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
