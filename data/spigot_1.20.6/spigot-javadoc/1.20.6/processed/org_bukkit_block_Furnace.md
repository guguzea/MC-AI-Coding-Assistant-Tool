---
title: "org.bukkit.block.Furnace"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
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
