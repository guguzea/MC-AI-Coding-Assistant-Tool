---
title: "org.bukkit.entity.ItemFrame"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/ItemFrame.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ItemFrame**
`public interface ItemFrame extends Hanging`
- `@NotNull ItemStack getItem()`
- `void setItem(@Nullable ItemStack item)`
- `void setItem(@Nullable ItemStack item, boolean playSound)`
- `float getItemDropChance()`
- `void setItemDropChance(float chance)`
- `@NotNull Rotation getRotation()`
- `void setRotation(@NotNull Rotation rotation) throws IllegalArgumentException`
- `boolean isVisible()`
- `void setVisible(boolean visible)`
- `boolean isFixed()`
- `void setFixed(boolean fixed)`
