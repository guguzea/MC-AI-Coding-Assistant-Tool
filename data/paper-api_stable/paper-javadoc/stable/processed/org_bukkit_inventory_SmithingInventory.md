---
title: "org.bukkit.inventory.SmithingInventory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/SmithingInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SmithingInventory**
`public interface SmithingInventory extends Inventory`
- `@Nullable @Nullable ItemStack getResult()`
- `void setResult(@Nullable @Nullable ItemStack newResult)`
- `@Nullable @Nullable Recipe getRecipe()`
- `@Nullable default @Nullable ItemStack getInputTemplate()`
- `default void setInputTemplate(@Nullable @Nullable ItemStack itemStack)`
- `@Nullable default @Nullable ItemStack getInputEquipment()`
- `default void setInputEquipment(@Nullable @Nullable ItemStack itemStack)`
- `@Nullable default @Nullable ItemStack getInputMineral()`
- `default void setInputMineral(@Nullable @Nullable ItemStack itemStack)`
