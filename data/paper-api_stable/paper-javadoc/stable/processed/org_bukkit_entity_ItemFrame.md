---
title: "org.bukkit.entity.ItemFrame"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/ItemFrame.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemFrame**
`public interface ItemFrame extends Hanging`
- `@NotNull @NotNull ItemStack getItem()`
- `void setItem(@Nullable @Nullable ItemStack item)`
- `void setItem(@Nullable @Nullable ItemStack item, boolean playSound)`
- `float getItemDropChance()`
- `void setItemDropChance(float chance)`
- `@NotNull @NotNull Rotation getRotation()`
- `void setRotation(@NotNull @NotNull Rotation rotation) throws IllegalArgumentException`
- `boolean isVisible()`
- `void setVisible(boolean visible)`
- `boolean isFixed()`
- `void setFixed(boolean fixed)`
