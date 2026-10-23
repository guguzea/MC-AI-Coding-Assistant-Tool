---
title: "org.bukkit.block.Furnace"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.block.Furnace extends org.bukkit.block.Container`
- `public abstract short getBurnTime()`
- `public abstract void setBurnTime(short)`
- `public abstract short getCookTime()`
- `public abstract void setCookTime(short)`
- `public abstract int getCookTimeTotal()`
- `public abstract void setCookTimeTotal(int)`
- `public abstract java.util.Map<org.bukkit.inventory.CookingRecipe<?>, java.lang.Integer> getRecipesUsed()`
- `public abstract org.bukkit.inventory.FurnaceInventory getInventory()`
- `public abstract org.bukkit.inventory.FurnaceInventory getSnapshotInventory()`
- `public default org.bukkit.inventory.Inventory getSnapshotInventory()`
- `public default org.bukkit.inventory.Inventory getInventory()`
