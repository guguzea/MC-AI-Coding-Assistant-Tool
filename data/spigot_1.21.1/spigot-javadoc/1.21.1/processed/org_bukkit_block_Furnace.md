---
title: "org.bukkit.block.Furnace"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
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
