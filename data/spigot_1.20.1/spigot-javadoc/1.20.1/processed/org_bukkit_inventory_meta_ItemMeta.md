---
title: "org.bukkit.inventory.meta.ItemMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public interface org.bukkit.inventory.meta.ItemMeta extends java.lang.Cloneable,org.bukkit.configuration.serialization.ConfigurationSerializable,org.bukkit.persistence.PersistentDataHolder`
- `public abstract boolean hasDisplayName()`
- `public abstract java.lang.String getDisplayName()`
- `public abstract void setDisplayName(java.lang.String)`
- `public abstract boolean hasLocalizedName()`
- `public abstract java.lang.String getLocalizedName()`
- `public abstract void setLocalizedName(java.lang.String)`
- `public abstract boolean hasLore()`
- `public abstract java.util.List<java.lang.String> getLore()`
- `public abstract void setLore(java.util.List<java.lang.String>)`
- `public abstract boolean hasCustomModelData()`
- `public abstract int getCustomModelData()`
- `public abstract void setCustomModelData(java.lang.Integer)`
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
- `public abstract boolean hasAttributeModifiers()`
- `public abstract com.google.common.collect.Multimap<org.bukkit.attribute.Attribute, org.bukkit.attribute.AttributeModifier> getAttributeModifiers()`
- `public abstract com.google.common.collect.Multimap<org.bukkit.attribute.Attribute, org.bukkit.attribute.AttributeModifier> getAttributeModifiers(org.bukkit.inventory.EquipmentSlot)`
- `public abstract java.util.Collection<org.bukkit.attribute.AttributeModifier> getAttributeModifiers(org.bukkit.attribute.Attribute)`
- `public abstract boolean addAttributeModifier(org.bukkit.attribute.Attribute, org.bukkit.attribute.AttributeModifier)`
- `public abstract void setAttributeModifiers(com.google.common.collect.Multimap<org.bukkit.attribute.Attribute, org.bukkit.attribute.AttributeModifier>)`
- `public abstract boolean removeAttributeModifier(org.bukkit.attribute.Attribute)`
- `public abstract boolean removeAttributeModifier(org.bukkit.inventory.EquipmentSlot)`
- `public abstract boolean removeAttributeModifier(org.bukkit.attribute.Attribute, org.bukkit.attribute.AttributeModifier)`
- `public abstract java.lang.String getAsString()`
- `public abstract org.bukkit.inventory.meta.tags.CustomItemTagContainer getCustomTagContainer()`
- `public abstract void setVersion(int)`
- `public abstract org.bukkit.inventory.meta.ItemMeta clone()`
- `public default java.lang.Object clone() throws java.lang.CloneNotSupportedException`
