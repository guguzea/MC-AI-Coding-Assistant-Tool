---
title: "org.bukkit.inventory.meta.ItemMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public interface org.bukkit.inventory.meta.ItemMeta extends java.lang.Cloneable,org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public abstract boolean hasDisplayName()`
- `public abstract java.lang.String getDisplayName()`
- `public abstract void setDisplayName(java.lang.String)`
- `public abstract boolean hasLocalizedName()`
- `public abstract java.lang.String getLocalizedName()`
- `public abstract void setLocalizedName(java.lang.String)`
- `public abstract boolean hasLore()`
- `public abstract java.util.List<java.lang.String> getLore()`
- `public abstract void setLore(java.util.List<java.lang.String>)`
- `public abstract boolean hasEnchants()`
- `public abstract boolean hasEnchant(org.bukkit.enchantments.Enchantment)`
- `public abstract int getEnchantLevel(org.bukkit.enchantments.Enchantment)`
- `public abstract java.util.Map<org.bukkit.enchantments.Enchantment, java.lang.Integer> getEnchants()`
- `public abstract boolean addEnchant(org.bukkit.enchantments.Enchantment, int, boolean)`
- `public abstract boolean removeEnchant(org.bukkit.enchantments.Enchantment)`
- `public abstract boolean hasConflictingEnchant(org.bukkit.enchantments.Enchantment)`
- `public abstract void addItemFlags(org.bukkit.inventory.ItemFlag...)`
- `public abstract void removeItemFlags(org.bukkit.inventory.ItemFlag...)`
- `public abstract java.util.Set<org.bukkit.inventory.ItemFlag> getItemFlags()`
- `public abstract boolean hasItemFlag(org.bukkit.inventory.ItemFlag)`
- `public abstract boolean isUnbreakable()`
- `public abstract void setUnbreakable(boolean)`
- `public abstract org.bukkit.inventory.meta.ItemMeta clone()`
- `public abstract org.bukkit.inventory.meta.ItemMeta$Spigot spigot()`
