---
title: "org.bukkit.UnsafeValues"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/UnsafeValues.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `ComponentFlattener componentFlattener()`
- `@Deprecated(forRemoval=true) PlainComponentSerializer plainComponentSerializer()`
- `@Deprecated(forRemoval=true) PlainTextComponentSerializer plainTextSerializer()`
- `@Deprecated(forRemoval=true) GsonComponentSerializer gsonComponentSerializer()`
- `@Deprecated(forRemoval=true) GsonComponentSerializer colorDownsamplingGsonComponentSerializer()`
- `@Deprecated(forRemoval=true) LegacyComponentSerializer legacyComponentSerializer()`
- `Component resolveWithContext(Component component, CommandSender context, Entity scoreboardSubject, boolean bypassPermissions) throws IOException`
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
- `@Deprecated(since="1.21", forRemoval=true) Multimap<Attribute,AttributeModifier> getDefaultAttributeModifiers(Material material, EquipmentSlot slot)`
- `@Deprecated(since="1.21", forRemoval=true) CreativeCategory getCreativeCategory(Material material)`
- `@Deprecated(since="1.21", forRemoval=true) String getBlockTranslationKey(Material material)`
- `@Deprecated(since="1.21", forRemoval=true) String getItemTranslationKey(Material material)`
- `String getTranslationKey(EntityType entityType)`
- `String getTranslationKey(ItemStack itemStack)`
- `@Deprecated(since="1.21.3", forRemoval=true) String getTranslationKey(Attribute attribute)`
- `@Internal @Deprecated(since="1.20.2", forRemoval=true) PotionType.InternalPotionData getInternalPotionData(NamespacedKey key)`
- `@Internal @NotNull DamageSource.Builder createDamageSourceBuilder(@NotNull @NotNull DamageType damageType)`
- `@Internal String get(Class<?> aClass, String value)`
- `@Internal <B extends Keyed> B get(RegistryKey<B> registry, NamespacedKey key)`
- `@Internal Biome getCustomBiome()`
- `@Deprecated(forRemoval=true) boolean isSupportedApiVersion(String apiVersion)`
- `@Deprecated(forRemoval=true) static boolean isLegacyPlugin(Plugin plugin)`
- `default VersionFetcher getVersionFetcher()`
- `byte[] serializeItem(ItemStack item)`
- `ItemStack deserializeItem(byte[] data)`
- `@NotNull JsonObject serializeItemAsJson(@NotNull @NotNull ItemStack itemStack)`
- `@NotNull @NotNull ItemStack deserializeItemFromJson(@NotNull JsonObject data) throws IllegalArgumentException`
- `default byte @NotNull [] serializeEntity(@NotNull @NotNull Entity entity)`
- `byte @NotNull [] serializeEntity(@NotNull @NotNull Entity entity, @NotNull @NotNull EntitySerializationFlag... serializationFlags)`
- `@NotNull default @NotNull Entity deserializeEntity(byte @NotNull [] data, @NotNull @NotNull World world)`
- `@NotNull default @NotNull Entity deserializeEntity(byte @NotNull [] data, @NotNull @NotNull World world, boolean preserveUUID)`
- `@NotNull @NotNull Entity deserializeEntity(byte @NotNull [] data, @NotNull @NotNull World world, boolean preserveUUID, boolean preservePassengers)`
- `int nextEntityId()`
- `@NotNull @NotNull String getMainLevelName()`
- `int getProtocolVersion()`
- `boolean isValidRepairItemStack(@NotNull @NotNull ItemStack itemToBeRepaired, @NotNull @NotNull ItemStack repairMaterial)`
- `boolean hasDefaultEntityAttributes(@NotNull @NotNull NamespacedKey entityKey)`
- `@NotNull Attributable getDefaultEntityAttributes(@NotNull @NotNull NamespacedKey entityKey)`
- `@NotNull @Deprecated(since="1.21.3", forRemoval=true) @NotNull NamespacedKey getBiomeKey(RegionAccessor accessor, int x, int y, int z)`
- `@Deprecated(since="1.21.3", forRemoval=true) void setBiomeKey(RegionAccessor accessor, int x, int y, int z, NamespacedKey biomeKey)`
- `String getStatisticCriteriaKey(@NotNull Statistic statistic)`
- `@Deprecated(since="1.21.4") @Nullable @Nullable Color getSpawnEggLayerColor(EntityType entityType, int layer)`
- `@NotNull List<Component> computeTooltipLines(@NotNull @NotNull ItemStack itemStack, @NotNull TooltipContext tooltipContext, @Nullable Player player)`
- `ItemStack createEmptyStack()`
