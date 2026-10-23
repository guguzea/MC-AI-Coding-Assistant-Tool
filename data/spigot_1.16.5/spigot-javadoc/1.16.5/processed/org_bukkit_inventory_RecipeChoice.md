---
title: "org.bukkit.inventory.RecipeChoice"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.inventory.RecipeChoice extends java.util.function.Predicate<org.bukkit.inventory.ItemStack>, java.lang.Cloneable`
- `public abstract org.bukkit.inventory.ItemStack getItemStack()`
- `public abstract org.bukkit.inventory.RecipeChoice clone()`
- `public abstract boolean test(org.bukkit.inventory.ItemStack)`
- `public default boolean test(java.lang.Object)`
- `public default java.lang.Object clone() throws java.lang.CloneNotSupportedException`
