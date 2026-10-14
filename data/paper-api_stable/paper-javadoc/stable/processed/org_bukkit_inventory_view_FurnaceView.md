---
title: "org.bukkit.inventory.view.FurnaceView"
package: "org.bukkit.inventory.view"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/view/FurnaceView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface FurnaceView**
`public interface FurnaceView extends InventoryView`
- `@NotNull @NotNull FurnaceInventory getTopInventory()`
- `float getCookTime()`
- `float getBurnTime()`
- `boolean isBurning()`
- `void setCookTime(int cookProgress, int cookDuration)`
- `void setBurnTime(int burnProgress, int burnDuration)`
