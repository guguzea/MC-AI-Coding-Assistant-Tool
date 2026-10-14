---
title: "org.bukkit.inventory.view.AnvilView"
package: "org.bukkit.inventory.view"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/view/AnvilView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface AnvilView**
`public interface AnvilView extends InventoryView`
- `@NotNull AnvilInventory getTopInventory()`
- `@Nullable String getRenameText()`
- `int getRepairItemCountCost()`
- `int getRepairCost()`
- `int getMaximumRepairCost()`
- `void setRepairItemCountCost(int amount)`
- `void setRepairCost(int cost)`
- `void setMaximumRepairCost(int levels)`
