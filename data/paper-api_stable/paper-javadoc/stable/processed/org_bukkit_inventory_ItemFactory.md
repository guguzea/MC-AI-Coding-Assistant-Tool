---
title: "org.bukkit.inventory.ItemFactory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/ItemFactory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemFactory**
`public interface ItemFactory`
- `@UndefinedNullability ItemMeta getItemMeta(@NotNull @NotNull Material material)`
- `boolean isApplicable(@Nullable @Nullable ItemMeta meta, @Nullable @Nullable ItemStack stack) throws IllegalArgumentException`
- `boolean isApplicable(@Nullable @Nullable ItemMeta meta, @Nullable @Nullable Material material) throws IllegalArgumentException`
- `boolean equals(@Nullable @Nullable ItemMeta meta1, @Nullable @Nullable ItemMeta meta2) throws IllegalArgumentException`
- `@Nullable @Nullable ItemMeta asMetaFor(@NotNull @NotNull ItemMeta meta, @NotNull @NotNull ItemStack stack) throws IllegalArgumentException`
- `@Nullable @Nullable ItemMeta asMetaFor(@NotNull @NotNull ItemMeta meta, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `@NotNull @NotNull Color getDefaultLeatherColor()`
- `@NotNull @NotNull ItemStack createItemStack(@NotNull @NotNull String input) throws IllegalArgumentException`
- `@Nullable @Nullable Material getSpawnEgg(@NotNull @NotNull EntityType type)`
- `@NotNull @Deprecated(since="1.19.3") @NotNull ItemStack enchantItem(@NotNull @NotNull Entity entity, @NotNull @NotNull ItemStack item, int level, boolean allowTreasures)`
- `@NotNull @Deprecated(since="1.19.3") @NotNull ItemStack enchantItem(@NotNull @NotNull World world, @NotNull @NotNull ItemStack item, int level, boolean allowTreasures)`
- `@NotNull @Deprecated(since="1.19.3") @NotNull ItemStack enchantItem(@NotNull @NotNull ItemStack item, int level, boolean allowTreasures)`
- `@NotNull HoverEvent<HoverEvent.ShowItem> asHoverEvent(@NotNull @NotNull ItemStack item, @NotNull UnaryOperator<HoverEvent.ShowItem> op)`
- `@NotNull Component displayName(@NotNull @NotNull ItemStack itemStack)`
- `@Nullable @Deprecated(since="1.18.1", forRemoval=true) @Nullable String getI18NDisplayName(@Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull ItemStack ensureServerConversions(@NotNull @NotNull ItemStack item)`
- `@NotNull @Deprecated net.md_5.bungee.api.chat.hover.content.Content hoverContentOf(@NotNull @NotNull ItemStack itemStack)`
- `@NotNull @Deprecated net.md_5.bungee.api.chat.hover.content.Content hoverContentOf(@NotNull Entity entity)`
- `@NotNull @Deprecated net.md_5.bungee.api.chat.hover.content.Content hoverContentOf(@NotNull Entity entity, @Nullable @Nullable String customName)`
- `@NotNull @Deprecated net.md_5.bungee.api.chat.hover.content.Content hoverContentOf(@NotNull Entity entity, @Nullable net.md_5.bungee.api.chat.BaseComponent customName)`
- `@NotNull @Deprecated net.md_5.bungee.api.chat.hover.content.Content hoverContentOf(@NotNull Entity entity, @NotNull net.md_5.bungee.api.chat.BaseComponent[] customName)`
- `@NotNull @NotNull ItemStack enchantWithLevels(@NotNull @NotNull ItemStack itemStack, int levels, boolean allowTreasure, @NotNull Random random)`
- `@NotNull @NotNull ItemStack enchantWithLevels(@NotNull @NotNull ItemStack itemStack, int levels, @NotNull RegistryKeySet<@NotNull Enchantment> keySet, @NotNull Random random)`
