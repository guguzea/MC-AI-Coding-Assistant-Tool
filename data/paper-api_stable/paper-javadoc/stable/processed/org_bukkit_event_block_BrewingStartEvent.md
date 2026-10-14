---
title: "org.bukkit.event.block.BrewingStartEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BrewingStartEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BrewingStartEvent**
`public class BrewingStartEvent extends InventoryBlockStartEvent`
- `@Internal public BrewingStartEvent(@NotNull @NotNull Block brewingStand, @NotNull @NotNull ItemStack source, int brewingTime)`
- `@Deprecated(since="1.21", forRemoval=true) public int getTotalBrewTime()`
- `@Deprecated(since="1.21", forRemoval=true) public void setTotalBrewTime(int brewTime)`
- `public @Range(from=1L,to=2147483647L) int getRecipeBrewTime()`
- `public void setRecipeBrewTime(@Range(from=1L,to=2147483647L) int recipeBrewTime)`
- `public @Range(from=0L,to=2147483647L) int getBrewingTime()`
- `public void setBrewingTime(@Range(from=0L,to=2147483647L) int brewTime)`
