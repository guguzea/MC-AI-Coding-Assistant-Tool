---
title: "org.bukkit.inventory.meta.ItemMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/inventory/meta/ItemMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static class ItemMeta.Spigot`
- `boolean addEnchant(Enchantment ench, int level, boolean ignoreLevelRestriction)`
- `void addItemFlags(ItemFlag... itemFlags)`
- `ItemMeta clone()`
- `String getDisplayName()`
- `int getEnchantLevel(Enchantment ench)`
- `Map<Enchantment,Integer> getEnchants()`
- `Set<ItemFlag> getItemFlags()`
- `String getLocalizedName()`
- `List<String> getLore()`
- `boolean hasConflictingEnchant(Enchantment ench)`
- `boolean hasDisplayName()`
- `boolean hasEnchant(Enchantment ench)`
- `boolean hasEnchants()`
- `boolean hasItemFlag(ItemFlag flag)`
- `boolean hasLocalizedName()`
- `boolean hasLore()`
- `boolean isUnbreakable()`
- `boolean removeEnchant(Enchantment ench)`
- `void removeItemFlags(ItemFlag... itemFlags)`
- `void setDisplayName(String name)`
- `void setLocalizedName(String name)`
- `void setLore(List<String> lore)`
- `void setUnbreakable(boolean unbreakable)`
- `ItemMeta.Spigot spigot()`
