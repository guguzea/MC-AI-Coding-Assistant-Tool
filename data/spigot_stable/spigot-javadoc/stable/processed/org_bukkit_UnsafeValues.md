---
title: "org.bukkit.UnsafeValues"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/UnsafeValues.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface UnsafeValues**
`@Deprecated(since="1.7.2") public interface UnsafeValues`
- `Material toLegacy(Material material)`
- `Material fromLegacy(Material material)`
- `Material fromLegacy(MaterialData material)`
- `Material fromLegacy(MaterialData material, boolean itemPriority)`
- `BlockData fromLegacy(Material material, byte data)`
- `Material getMaterial(String material, int version)`
- `int getDataVersion()`
- `ItemStack modifyItemStack(ItemStack stack, String arguments)`
- `void checkSupported(PluginDescriptionFile pdf) throws InvalidPluginException`
- `byte[] processClass(PluginDescriptionFile pdf, String path, byte[] clazz)`
- `Advancement loadAdvancement(NamespacedKey key, String advancement)`
- `boolean removeAdvancement(NamespacedKey key)`
- `@Deprecated(since="1.21", forRemoval=true) Multimap<Attribute, AttributeModifier> getDefaultAttributeModifiers(Material material, EquipmentSlot slot)`
- `@Deprecated(since="1.21", forRemoval=true) CreativeCategory getCreativeCategory(Material material)`
- `@Deprecated(since="1.21", forRemoval=true) String getBlockTranslationKey(Material material)`
- `@Deprecated(since="1.21", forRemoval=true) String getItemTranslationKey(Material material)`
- `String getTranslationKey(EntityType entityType)`
- `String getTranslationKey(ItemStack itemStack)`
- `@Deprecated(since="1.21.3", forRemoval=true) String getTranslationKey(Attribute attribute)`
- `@Nullable FeatureFlag getFeatureFlag(@NotNull NamespacedKey key)`
- `@Internal @Deprecated(since="1.20.2", forRemoval=true) PotionType.InternalPotionData getInternalPotionData(NamespacedKey key)`
- `@Internal @Nullable DamageEffect getDamageEffect(@NotNull String key)`
- `@Internal @NotNull DamageSource.Builder createDamageSourceBuilder(@NotNull DamageType damageType)`
- `@Internal String get(Class<?> aClass, String value)`
- `@Internal <B extends Keyed> B get(Registry<B> registry, NamespacedKey key)`
- `@Internal Biome getCustomBiome()`
- `@Internal Villager.ReputationType createReputationType(String key)`
- `@Internal Villager.ReputationEvent createReputationEvent(String key)`
