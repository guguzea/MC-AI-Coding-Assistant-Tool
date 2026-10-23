---
title: "org.bukkit.inventory.RecipeChoice"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.inventory.RecipeChoice extends java.util.function.Predicate<org.bukkit.inventory.ItemStack>, java.lang.Cloneable`
- `public abstract org.bukkit.inventory.ItemStack getItemStack()`
- `public abstract org.bukkit.inventory.RecipeChoice clone()`
- `public abstract boolean test(org.bukkit.inventory.ItemStack)`
- `public default boolean test(java.lang.Object)`
- `public default java.lang.Object clone() throws java.lang.CloneNotSupportedException`
