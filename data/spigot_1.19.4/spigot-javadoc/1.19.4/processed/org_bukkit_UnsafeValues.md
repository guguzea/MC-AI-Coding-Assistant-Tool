---
title: "org.bukkit.UnsafeValues"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.UnsafeValues`
- `public abstract org.bukkit.Material toLegacy(org.bukkit.Material)`
- `public abstract org.bukkit.Material fromLegacy(org.bukkit.Material)`
- `public abstract org.bukkit.Material fromLegacy(org.bukkit.material.MaterialData)`
- `public abstract org.bukkit.Material fromLegacy(org.bukkit.material.MaterialData, boolean)`
- `public abstract org.bukkit.block.data.BlockData fromLegacy(org.bukkit.Material, byte)`
- `public abstract org.bukkit.Material getMaterial(java.lang.String, int)`
- `public abstract int getDataVersion()`
- `public abstract org.bukkit.inventory.ItemStack modifyItemStack(org.bukkit.inventory.ItemStack, java.lang.String)`
- `public abstract void checkSupported(org.bukkit.plugin.PluginDescriptionFile) throws org.bukkit.plugin.InvalidPluginException`
- `public abstract byte[] processClass(org.bukkit.plugin.PluginDescriptionFile, java.lang.String, byte[])`
- `public abstract org.bukkit.advancement.Advancement loadAdvancement(org.bukkit.NamespacedKey, java.lang.String)`
- `public abstract boolean removeAdvancement(org.bukkit.NamespacedKey)`
- `public abstract com.google.common.collect.Multimap<org.bukkit.attribute.Attribute, org.bukkit.attribute.AttributeModifier> getDefaultAttributeModifiers(org.bukkit.Material, org.bukkit.inventory.EquipmentSlot)`
- `public abstract org.bukkit.inventory.CreativeCategory getCreativeCategory(org.bukkit.Material)`
- `public abstract java.lang.String getBlockTranslationKey(org.bukkit.Material)`
- `public abstract java.lang.String getItemTranslationKey(org.bukkit.Material)`
- `public abstract java.lang.String getTranslationKey(org.bukkit.entity.EntityType)`
- `public abstract java.lang.String getTranslationKey(org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.FeatureFlag getFeatureFlag(org.bukkit.NamespacedKey)`
