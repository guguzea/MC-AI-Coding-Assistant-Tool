---
title: "org.bukkit.inventory.ItemFactory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/inventory/ItemFactory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@UndefinedNullability ItemMeta getItemMeta(@NotNull @NotNull Material material)`
- `boolean isApplicable(@Nullable @Nullable ItemMeta meta, @Nullable @Nullable ItemStack stack) throws IllegalArgumentException`
- `boolean isApplicable(@Nullable @Nullable ItemMeta meta, @Nullable @Nullable Material material) throws IllegalArgumentException`
- `boolean equals(@Nullable @Nullable ItemMeta meta1, @Nullable @Nullable ItemMeta meta2) throws IllegalArgumentException`
- `@Nullable @Nullable ItemMeta asMetaFor(@NotNull @NotNull ItemMeta meta, @NotNull @NotNull ItemStack stack) throws IllegalArgumentException`
- `@Nullable @Nullable ItemMeta asMetaFor(@NotNull @NotNull ItemMeta meta, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `@NotNull @NotNull Color getDefaultLeatherColor()`
- `@NotNull @NotNull ItemStack createItemStack(@NotNull @NotNull String input) throws IllegalArgumentException`
- `@Deprecated @NotNull @NotNull Material updateMaterial(@NotNull @NotNull ItemMeta meta, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `@Nullable @Nullable Material getSpawnEgg(@NotNull @NotNull EntityType type)`
- `@NotNull @NotNull ItemStack enchantWithLevels(@NotNull @NotNull ItemStack itemStack, @org.jetbrains.annotations.Range(from=1L, to=30L) int levels, boolean allowTreasure, @NotNull Random random)`
- `@NotNull HoverEvent<HoverEvent.ShowItem> asHoverEvent(@NotNull @NotNull ItemStack item, @NotNull UnaryOperator<HoverEvent.ShowItem> op)`
- `@NotNull Component displayName(@NotNull @NotNull ItemStack itemStack)`
- `@Nullable @Deprecated @Nullable String getI18NDisplayName(@Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull ItemStack ensureServerConversions(@NotNull @NotNull ItemStack item)`
- `@NotNull @Deprecated net.md_5.bungee.api.chat.hover.content.Content hoverContentOf(@NotNull @NotNull ItemStack itemStack)`
- `@NotNull @Deprecated net.md_5.bungee.api.chat.hover.content.Content hoverContentOf(@NotNull Entity entity)`
- `@NotNull @Deprecated net.md_5.bungee.api.chat.hover.content.Content hoverContentOf(@NotNull Entity entity, @Nullable @Nullable String customName)`
- `@NotNull @Deprecated net.md_5.bungee.api.chat.hover.content.Content hoverContentOf(@NotNull Entity entity, @Nullable net.md_5.bungee.api.chat.BaseComponent customName)`
- `@NotNull @Deprecated net.md_5.bungee.api.chat.hover.content.Content hoverContentOf(@NotNull Entity entity, @NotNull @NotNull net.md_5.bungee.api.chat.BaseComponent[] customName)`
