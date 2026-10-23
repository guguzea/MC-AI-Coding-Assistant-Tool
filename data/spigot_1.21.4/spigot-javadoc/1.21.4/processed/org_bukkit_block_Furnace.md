---
title: "org.bukkit.block.Furnace"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
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
