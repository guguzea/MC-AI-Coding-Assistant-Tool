---
title: "org.bukkit.inventory.ItemStack"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/ItemStack.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ItemStack**
`public class ItemStack extends Object implements Cloneable, ConfigurationSerializable, Translatable`
- `protected ItemStack()`
- `public ItemStack(@NotNull Material type)`
- `public ItemStack(@NotNull Material type, int amount)`
- `@Deprecated(since="1.20.5") public ItemStack(@NotNull Material type, int amount, short damage)`
- `@Deprecated(since="1.4.5") public ItemStack(@NotNull Material type, int amount, short damage, @Nullable Byte data)`
- `public ItemStack(@NotNull ItemStack stack) throws IllegalArgumentException`
- `@NotNull public Material getType()`
- `public void setType(@NotNull Material type)`
- `public int getAmount()`
- `public void setAmount(int amount)`
- `@Nullable public MaterialData getData()`
- `public void setData(@Nullable MaterialData data)`
- `@Deprecated(since="1.13") public void setDurability(short durability)`
- `@Deprecated(since="1.13") public short getDurability()`
- `public int getMaxStackSize()`
- `public String toString()`
- `public boolean equals(Object obj)`
- `public boolean isSimilar(@Nullable ItemStack stack)`
- `@NotNull public ItemStack clone()`
- `public int hashCode()`
- `public boolean containsEnchantment(@NotNull Enchantment ench)`
- `public int getEnchantmentLevel(@NotNull Enchantment ench)`
- `@NotNull public Map<Enchantment, Integer> getEnchantments()`
- `public void addEnchantments(@NotNull Map<Enchantment, Integer> enchantments)`
- `public void addEnchantment(@NotNull Enchantment ench, int level)`
- `public void addUnsafeEnchantments(@NotNull Map<Enchantment, Integer> enchantments)`
- `public void addUnsafeEnchantment(@NotNull Enchantment ench, int level)`
- `public int removeEnchantment(@NotNull Enchantment ench)`
- `public void removeEnchantments()`
- `@NotNull public Map<String,Object> serialize()`
- `@NotNull public static ItemStack deserialize(@NotNull Map<String,Object> args)`
- `@Nullable public ItemMeta getItemMeta()`
- `public boolean hasItemMeta()`
- `public boolean setItemMeta(@Nullable ItemMeta itemMeta)`
- `@NotNull public String getTranslationKey()`
