---
title: "org.bukkit.inventory.view.FurnaceView"
package: "org.bukkit.inventory.view"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/view/FurnaceView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface FurnaceView**
`public interface FurnaceView extends InventoryView`
- `@NotNull FurnaceInventory getTopInventory()`
- `float getCookTime()`
- `float getBurnTime()`
- `boolean isBurning()`
- `void setCookTime(int cookProgress, int cookDuration)`
- `void setBurnTime(int burnProgress, int burnDuration)`
