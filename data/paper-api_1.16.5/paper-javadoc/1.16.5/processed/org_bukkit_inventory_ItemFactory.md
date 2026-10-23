---
title: "org.bukkit.inventory.ItemFactory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/ItemFactory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `ItemMeta getItemMeta&#8203;(@NotNull @NotNull Material material)`
- `boolean isApplicable&#8203;(@Nullable @Nullable ItemMeta meta, @Nullable @Nullable ItemStack stack) throws IllegalArgumentException`
- `boolean isApplicable&#8203;(@Nullable @Nullable ItemMeta meta, @Nullable @Nullable Material material) throws IllegalArgumentException`
- `boolean equals&#8203;(@Nullable @Nullable ItemMeta meta1, @Nullable @Nullable ItemMeta meta2) throws IllegalArgumentException`
- `@Nullable @Nullable ItemMeta asMetaFor&#8203;(@NotNull @NotNull ItemMeta meta, @NotNull @NotNull ItemStack stack) throws IllegalArgumentException`
- `@Nullable @Nullable ItemMeta asMetaFor&#8203;(@NotNull @NotNull ItemMeta meta, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `@NotNull @NotNull Color getDefaultLeatherColor()`
- `@Deprecated @NotNull @NotNull Material updateMaterial&#8203;(@NotNull @NotNull ItemMeta meta, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `@NotNull HoverEvent<HoverEvent.ShowItem> asHoverEvent&#8203;(@NotNull @NotNull ItemStack item, @NotNull UnaryOperator<HoverEvent.ShowItem> op)`
- `@NotNull Component displayName&#8203;(@NotNull @NotNull ItemStack itemStack)`
- `@NotNull @NotNull ItemStack ensureServerConversions&#8203;(@NotNull @NotNull ItemStack item)`
- `@Nullable @Nullable String getI18NDisplayName&#8203;(@Nullable @Nullable ItemStack item)`
- `@NotNull Content hoverContentOf&#8203;(@NotNull @NotNull ItemStack itemStack)`
- `@NotNull @Deprecated Content hoverContentOf&#8203;(@NotNull Entity entity)`
- `@NotNull @Deprecated Content hoverContentOf&#8203;(@NotNull Entity entity, @Nullable @Nullable String customName)`
- `@NotNull @Deprecated Content hoverContentOf&#8203;(@NotNull Entity entity, @Nullable BaseComponent customName)`
- `@NotNull @Deprecated Content hoverContentOf&#8203;(@NotNull Entity entity, @NotNull @NotNull BaseComponent[] customName)`
