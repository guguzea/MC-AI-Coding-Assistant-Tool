---
title: "org.bukkit.block.Campfire"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/Campfire.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Campfire**
`public interface Campfire extends TileState`
- `int getSize()`
- `@Nullable @Nullable ItemStack getItem(int index)`
- `void setItem(int index, @Nullable @Nullable ItemStack item)`
- `int getCookTime(int index)`
- `void setCookTime(int index, int cookTime)`
- `int getCookTimeTotal(int index)`
- `void setCookTimeTotal(int index, int cookTimeTotal)`
- `void stopCooking()`
- `void startCooking()`
- `boolean stopCooking(int index)`
- `boolean startCooking(int index)`
- `boolean isCookingDisabled(int index)`
