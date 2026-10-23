---
title: "org.bukkit.UnsafeValues"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/UnsafeValues.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `ComponentFlattener componentFlattener()`
- `PlainComponentSerializer plainComponentSerializer()`
- `GsonComponentSerializer gsonComponentSerializer()`
- `GsonComponentSerializer colorDownsamplingGsonComponentSerializer()`
- `LegacyComponentSerializer legacyComponentSerializer()`
- `void reportTimings()`
- `Material toLegacy&#8203;(Material material)`
- `Material fromLegacy&#8203;(Material material)`
- `Material fromLegacy&#8203;(MaterialData material)`
- `Material fromLegacy&#8203;(MaterialData material, boolean itemPriority)`
- `BlockData fromLegacy&#8203;(Material material, byte data)`
- `Material getMaterial&#8203;(String material, int version)`
- `int getDataVersion()`
- `ItemStack modifyItemStack&#8203;(ItemStack stack, String arguments)`
- `void checkSupported&#8203;(PluginDescriptionFile pdf) throws InvalidPluginException`
- `byte[] processClass&#8203;(PluginDescriptionFile pdf, String path, byte[] clazz)`
- `Advancement loadAdvancement&#8203;(NamespacedKey key, String advancement)`
- `boolean removeAdvancement&#8203;(NamespacedKey key)`
- `String getTimingsServerName()`
- `default VersionFetcher getVersionFetcher()`
- `boolean isSupportedApiVersion&#8203;(String apiVersion)`
- `static boolean isLegacyPlugin&#8203;(Plugin plugin)`
- `byte[] serializeItem&#8203;(ItemStack item)`
- `ItemStack deserializeItem&#8203;(byte[] data)`
- `String getTranslationKey&#8203;(Material mat)`
- `String getTranslationKey&#8203;(Block block)`
- `String getTranslationKey&#8203;(EntityType type)`
- `String getTranslationKey&#8203;(ItemStack itemStack)`
- `int nextEntityId()`
- `ItemRarity getItemRarity&#8203;(Material material)`
- `ItemRarity getItemStackRarity&#8203;(ItemStack itemStack)`
- `boolean isValidRepairItemStack&#8203;(@NotNull @NotNull ItemStack itemToBeRepaired, @NotNull @NotNull ItemStack repairMaterial)`
- `@NotNull Multimap<Attribute,&#8203;AttributeModifier> getItemAttributes&#8203;(@NotNull @NotNull Material material, @NotNull EquipmentSlot equipmentSlot)`
- `int getProtocolVersion()`
