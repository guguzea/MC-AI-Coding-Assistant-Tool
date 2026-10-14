---
title: "org.bukkit.UnsafeValues"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/UnsafeValues.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
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
- `ItemStack modifyItemStack(ItemStack item, String components)`
- `void checkSupported(PluginDescriptionFile pdf) throws InvalidPluginException`
- `byte[] processClass(PluginDescriptionFile pdf, String path, byte[] clazz)`
- `@Nullable default @Nullable Advancement loadAdvancement(NamespacedKey key, @Language("json") String advancement)`
- `@Nullable @Nullable Advancement loadAdvancement(Key key, @Language("json") String advancement, boolean persist)`
- `List<Advancement> loadAdvancements(Map<Key,String> advancements, boolean persist)`
- `boolean removeAdvancement(NamespacedKey key)`
- `@Internal @Deprecated(since="1.20.2", forRemoval=true) PotionType.InternalPotionData getInternalPotionData(NamespacedKey key)`
- `@Internal String get(Class<?> elementClass, String value)`
- `@Internal @Nullable <B extends Keyed> B get(RegistryKey<B> registry, NamespacedKey key)`
- `@Deprecated(forRemoval=true) boolean isSupportedApiVersion(String apiVersion)`
- `@Deprecated(forRemoval=true) static boolean isLegacyPlugin(Plugin plugin)`
- `@NotNull JsonObject serializeItemAsJson(@NotNull @NotNull ItemStack itemStack)`
- `@NotNull @NotNull ItemStack deserializeItemFromJson(@NotNull JsonObject data) throws IllegalArgumentException`
- `default byte @NotNull [] serializeEntity(@NotNull @NotNull Entity entity)`
- `byte @NotNull [] serializeEntity(@NotNull @NotNull Entity entity, @NotNull @NotNull EntitySerializationFlag... serializationFlags)`
- `@NotNull default @NotNull Entity deserializeEntity(byte @NotNull [] data, @NotNull @NotNull World world)`
- `@NotNull default @NotNull Entity deserializeEntity(byte @NotNull [] data, @NotNull @NotNull World world, boolean preserveUUID)`
- `@NotNull @NotNull Entity deserializeEntity(byte @NotNull [] data, @NotNull @NotNull World world, boolean preserveUUID, boolean preservePassengers)`
- `int nextEntityId(World world)`
- `@NotNull @NotNull String getMainLevelName()`
- `int getProtocolVersion()`
- `@NotNull @NotNull ItemStack deserializeStack(@NotNull @NotNull Map<String,Object> args)`
- `@NotNull @NotNull ItemStack deserializeItemHover(@NotNull HoverEvent.ShowItem itemHover)`
