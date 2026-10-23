---
title: "org.bukkit.UnsafeValues"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
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
- `public abstract java.lang.String getTranslationKey(org.bukkit.attribute.Attribute)`
- `public abstract org.bukkit.FeatureFlag getFeatureFlag(org.bukkit.NamespacedKey)`
- `public abstract org.bukkit.potion.PotionType$InternalPotionData getInternalPotionData(org.bukkit.NamespacedKey)`
- `public abstract org.bukkit.damage.DamageEffect getDamageEffect(java.lang.String)`
- `public abstract org.bukkit.damage.DamageSource$Builder createDamageSourceBuilder(org.bukkit.damage.DamageType)`
- `public abstract java.lang.String get(java.lang.Class<?>, java.lang.String)`
- `public abstract <B extends org.bukkit.Keyed> B get(org.bukkit.Registry<B>, org.bukkit.NamespacedKey)`
