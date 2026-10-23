---
title: "org.bukkit.inventory.ItemStack"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.inventory.ItemStack implements java.lang.Cloneable,org.bukkit.configuration.serialization.ConfigurationSerializable,org.bukkit.Translatable`
- `protected org.bukkit.inventory.ItemStack()`
- `public org.bukkit.inventory.ItemStack(org.bukkit.Material)`
- `public org.bukkit.inventory.ItemStack(org.bukkit.Material, int)`
- `public org.bukkit.inventory.ItemStack(org.bukkit.Material, int, short)`
- `public org.bukkit.inventory.ItemStack(org.bukkit.Material, int, short, java.lang.Byte)`
- `public org.bukkit.inventory.ItemStack(org.bukkit.inventory.ItemStack) throws java.lang.IllegalArgumentException`
- `public org.bukkit.Material getType()`
- `public void setType(org.bukkit.Material)`
- `public int getAmount()`
- `public void setAmount(int)`
- `public org.bukkit.material.MaterialData getData()`
- `public void setData(org.bukkit.material.MaterialData)`
- `public void setDurability(short)`
- `public short getDurability()`
- `public int getMaxStackSize()`
- `public java.lang.String toString()`
- `public boolean equals(java.lang.Object)`
- `public boolean isSimilar(org.bukkit.inventory.ItemStack)`
- `public org.bukkit.inventory.ItemStack clone()`
- `public int hashCode()`
- `public boolean containsEnchantment(org.bukkit.enchantments.Enchantment)`
- `public int getEnchantmentLevel(org.bukkit.enchantments.Enchantment)`
- `public java.util.Map<org.bukkit.enchantments.Enchantment, java.lang.Integer> getEnchantments()`
- `public void addEnchantments(java.util.Map<org.bukkit.enchantments.Enchantment, java.lang.Integer>)`
- `public void addEnchantment(org.bukkit.enchantments.Enchantment, int)`
- `public void addUnsafeEnchantments(java.util.Map<org.bukkit.enchantments.Enchantment, java.lang.Integer>)`
- `public void addUnsafeEnchantment(org.bukkit.enchantments.Enchantment, int)`
- `public int removeEnchantment(org.bukkit.enchantments.Enchantment)`
- `public void removeEnchantments()`
- `public java.util.Map<java.lang.String, java.lang.Object> serialize()`
- `public static org.bukkit.inventory.ItemStack deserialize(java.util.Map<java.lang.String, java.lang.Object>)`
- `public org.bukkit.inventory.meta.ItemMeta getItemMeta()`
- `public boolean hasItemMeta()`
- `public boolean setItemMeta(org.bukkit.inventory.meta.ItemMeta)`
- `public java.lang.String getTranslationKey()`
- `public java.lang.Object clone() throws java.lang.CloneNotSupportedException`
