---
title: "org.bukkit.inventory.ItemFactory"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/ItemFactory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ItemFactory**
`public interface ItemFactory`
- `@Nullable ItemMeta getItemMeta(@NotNull Material material)`
- `boolean isApplicable(@Nullable ItemMeta meta, @Nullable ItemStack stack) throws IllegalArgumentException`
- `boolean isApplicable(@Nullable ItemMeta meta, @Nullable Material material) throws IllegalArgumentException`
- `boolean equals(@Nullable ItemMeta meta1, @Nullable ItemMeta meta2) throws IllegalArgumentException`
- `@Nullable ItemMeta asMetaFor(@NotNull ItemMeta meta, @NotNull ItemStack stack) throws IllegalArgumentException`
- `@Nullable ItemMeta asMetaFor(@NotNull ItemMeta meta, @NotNull Material material) throws IllegalArgumentException`
- `@NotNull Color getDefaultLeatherColor()`
- `@NotNull ItemStack createItemStack(@NotNull String input) throws IllegalArgumentException`
- `@Nullable Material getSpawnEgg(@NotNull EntityType type)`
- `@NotNull ItemStack enchantItem(@NotNull Entity entity, @NotNull ItemStack item, int level, boolean allowTreasures)`
- `@NotNull ItemStack enchantItem(@NotNull World world, @NotNull ItemStack item, int level, boolean allowTreasures)`
- `@NotNull ItemStack enchantItem(@NotNull ItemStack item, int level, boolean allowTreasures)`
- `@NotNull ItemStack createExplorerMap(@NotNull World world, @NotNull Location structureLocation, @NotNull MapCursor.Type mapIcon)`
