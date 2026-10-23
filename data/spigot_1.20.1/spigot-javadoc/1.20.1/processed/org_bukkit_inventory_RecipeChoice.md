---
title: "org.bukkit.inventory.RecipeChoice"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public interface org.bukkit.inventory.RecipeChoice extends java.util.function.Predicate<org.bukkit.inventory.ItemStack>, java.lang.Cloneable`
- `public abstract org.bukkit.inventory.ItemStack getItemStack()`
- `public abstract org.bukkit.inventory.RecipeChoice clone()`
- `public abstract boolean test(org.bukkit.inventory.ItemStack)`
- `public default boolean test(java.lang.Object)`
- `public default java.lang.Object clone() throws java.lang.CloneNotSupportedException`
