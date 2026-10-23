---
title: "org.bukkit.UnsafeValues"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/UnsafeValues.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `ComponentFlattener componentFlattener()`
- `@Deprecated(forRemoval=true) PlainComponentSerializer plainComponentSerializer()`
- `@Deprecated(forRemoval=true) PlainTextComponentSerializer plainTextSerializer()`
- `@Deprecated(forRemoval=true) GsonComponentSerializer gsonComponentSerializer()`
- `@Deprecated(forRemoval=true) GsonComponentSerializer colorDownsamplingGsonComponentSerializer()`
- `@Deprecated(forRemoval=true) LegacyComponentSerializer legacyComponentSerializer()`
- `Component resolveWithContext(Component component, CommandSender context, Entity scoreboardSubject, boolean bypassPermissions) throws IOException`
- `void reportTimings()`
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
- `Multimap<Attribute,AttributeModifier> getDefaultAttributeModifiers(Material material, EquipmentSlot slot)`
- `CreativeCategory getCreativeCategory(Material material)`
- `String getBlockTranslationKey(Material material)`
- `String getItemTranslationKey(Material material)`
- `String getTranslationKey(EntityType entityType)`
- `String getTranslationKey(ItemStack itemStack)`
- `@Nullable @Nullable FeatureFlag getFeatureFlag(@NotNull @NotNull NamespacedKey key)`
- `@Deprecated(forRemoval=true) boolean isSupportedApiVersion(String apiVersion)`
- `@Deprecated(forRemoval=true) static boolean isLegacyPlugin(Plugin plugin)`
- `String getTimingsServerName()`
- `default VersionFetcher getVersionFetcher()`
- `byte[] serializeItem(ItemStack item)`
- `ItemStack deserializeItem(byte[] data)`
- `byte[] serializeEntity(Entity entity)`
- `default Entity deserializeEntity(byte[] data, World world)`
- `Entity deserializeEntity(byte[] data, World world, boolean preserveUUID)`
- `int nextEntityId()`
- `@NotNull @NotNull String getMainLevelName()`
- `ItemRarity getItemRarity(Material material)`
- `ItemRarity getItemStackRarity(ItemStack itemStack)`
- `boolean isValidRepairItemStack(@NotNull @NotNull ItemStack itemToBeRepaired, @NotNull @NotNull ItemStack repairMaterial)`
- `@NotNull @NotNull Multimap<Attribute,AttributeModifier> getItemAttributes(@NotNull @NotNull Material material, @NotNull @NotNull EquipmentSlot equipmentSlot)`
- `int getProtocolVersion()`
- `boolean hasDefaultEntityAttributes(@NotNull @NotNull NamespacedKey entityKey)`
- `@NotNull Attributable getDefaultEntityAttributes(@NotNull @NotNull NamespacedKey entityKey)`
- `boolean isCollidable(@NotNull @NotNull Material material)`
- `@NotNull @NotNull NamespacedKey getBiomeKey(RegionAccessor accessor, int x, int y, int z)`
- `void setBiomeKey(RegionAccessor accessor, int x, int y, int z, NamespacedKey biomeKey)`
- `String getStatisticCriteriaKey(@NotNull Statistic statistic)`
