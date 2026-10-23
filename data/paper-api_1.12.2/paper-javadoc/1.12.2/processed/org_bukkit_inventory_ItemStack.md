---
title: "org.bukkit.inventory.ItemStack"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/inventory/ItemStack.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `ItemStack add()`
- `ItemStack add(int qty)`
- `void addEnchantment(Enchantment ench, int level)`
- `void addEnchantments(Map<Enchantment,Integer> enchantments)`
- `void addItemFlags(ItemFlag... itemFlags)`
- `void addUnsafeEnchantment(Enchantment ench, int level)`
- `void addUnsafeEnchantments(Map<Enchantment,Integer> enchantments)`
- `ItemStack asOne()`
- `ItemStack asQuantity(int qty)`
- `ItemStack clone()`
- `boolean containsEnchantment(Enchantment ench)`
- `static ItemStack deserialize(Map<String,Object> args)`
- `ItemStack ensureServerConversions()`
- `boolean equals(Object obj)`
- `int getAmount()`
- `MaterialData getData()`
- `short getDurability()`
- `int getEnchantmentLevel(Enchantment ench)`
- `Map<Enchantment,Integer> getEnchantments()`
- `String getI18NDisplayName()`
- `Set<ItemFlag> getItemFlags()`
- `ItemMeta getItemMeta()`
- `List<String> getLore()`
- `int getMaxItemUseDuration()`
- `int getMaxStackSize()`
- `Material getType()`
- `int getTypeId()`
- `int hashCode()`
- `boolean hasItemFlag(ItemFlag flag)`
- `boolean hasItemMeta()`
- `boolean isSimilar(ItemStack stack)`
- `int removeEnchantment(Enchantment ench)`
- `void removeItemFlags(ItemFlag... itemFlags)`
- `Map<String,Object> serialize()`
- `void setAmount(int amount)`
- `void setData(MaterialData data)`
- `void setDurability(short durability)`
- `boolean setItemMeta(ItemMeta itemMeta)`
- `void setLore(List<String> lore)`
- `void setType(Material type)`
- `void setTypeId(int type)`
- `ItemStack subtract()`
- `ItemStack subtract(int qty)`
- `String toString()`
