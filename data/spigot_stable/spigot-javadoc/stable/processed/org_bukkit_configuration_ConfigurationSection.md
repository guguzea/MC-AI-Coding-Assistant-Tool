---
title: "org.bukkit.configuration.ConfigurationSection"
package: "org.bukkit.configuration"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/configuration/ConfigurationSection.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ConfigurationSection**
`public interface ConfigurationSection`
- `@NotNull Set<String> getKeys(boolean deep)`
- `@NotNull Map<String,Object> getValues(boolean deep)`
- `boolean contains(@NotNull String path)`
- `boolean contains(@NotNull String path, boolean ignoreDefault)`
- `boolean isSet(@NotNull String path)`
- `@Nullable String getCurrentPath()`
- `@NotNull String getName()`
- `@Nullable Configuration getRoot()`
- `@Nullable ConfigurationSection getParent()`
- `@Nullable Object get(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable Object get(@NotNull String path, @Nullable Object def)`
- `void set(@NotNull String path, @Nullable Object value)`
- `@NotNull ConfigurationSection createSection(@NotNull String path)`
- `@NotNull ConfigurationSection createSection(@NotNull String path, @NotNull Map<?,?> map)`
- `@Nullable String getString(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable String getString(@NotNull String path, @Nullable String def)`
- `boolean isString(@NotNull String path)`
- `int getInt(@NotNull String path)`
- `int getInt(@NotNull String path, int def)`
- `boolean isInt(@NotNull String path)`
- `boolean getBoolean(@NotNull String path)`
- `boolean getBoolean(@NotNull String path, boolean def)`
- `boolean isBoolean(@NotNull String path)`
- `double getDouble(@NotNull String path)`
- `double getDouble(@NotNull String path, double def)`
- `boolean isDouble(@NotNull String path)`
- `long getLong(@NotNull String path)`
- `long getLong(@NotNull String path, long def)`
- `boolean isLong(@NotNull String path)`
- `@Nullable List<?> getList(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable List<?> getList(@NotNull String path, @Nullable List<?> def)`
- `boolean isList(@NotNull String path)`
- `@NotNull List<String> getStringList(@NotNull String path)`
- `@NotNull List<Integer> getIntegerList(@NotNull String path)`
- `@NotNull List<Boolean> getBooleanList(@NotNull String path)`
- `@NotNull List<Double> getDoubleList(@NotNull String path)`
- `@NotNull List<Float> getFloatList(@NotNull String path)`
- `@NotNull List<Long> getLongList(@NotNull String path)`
- `@NotNull List<Byte> getByteList(@NotNull String path)`
- `@NotNull List<Character> getCharacterList(@NotNull String path)`
- `@NotNull List<Short> getShortList(@NotNull String path)`
- `@NotNull List<Map<?,?>> getMapList(@NotNull String path)`
- `@Nullable <T> T getObject(@NotNull String path, @NotNull Class<T> clazz)`
- `@Contract("_, _, !null -> !null") @Nullable <T> T getObject(@NotNull String path, @NotNull Class<T> clazz, @Nullable T def)`
- `@Nullable <T extends ConfigurationSerializable> T getSerializable(@NotNull String path, @NotNull Class<T> clazz)`
- `@Contract("_, _, !null -> !null") @Nullable <T extends ConfigurationSerializable> T getSerializable(@NotNull String path, @NotNull Class<T> clazz, @Nullable T def)`
- `@Nullable Vector getVector(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable Vector getVector(@NotNull String path, @Nullable Vector def)`
- `boolean isVector(@NotNull String path)`
- `@Nullable OfflinePlayer getOfflinePlayer(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable OfflinePlayer getOfflinePlayer(@NotNull String path, @Nullable OfflinePlayer def)`
- `boolean isOfflinePlayer(@NotNull String path)`
- `@Nullable ItemStack getItemStack(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable ItemStack getItemStack(@NotNull String path, @Nullable ItemStack def)`
- `boolean isItemStack(@NotNull String path)`
- `@Nullable Color getColor(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable Color getColor(@NotNull String path, @Nullable Color def)`
- `boolean isColor(@NotNull String path)`
- `@Nullable Location getLocation(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable Location getLocation(@NotNull String path, @Nullable Location def)`
- `boolean isLocation(@NotNull String path)`
- `@Nullable ConfigurationSection getConfigurationSection(@NotNull String path)`
- `boolean isConfigurationSection(@NotNull String path)`
- `@Nullable ConfigurationSection getDefaultSection()`
- `void addDefault(@NotNull String path, @Nullable Object value)`
- `@NotNull List<String> getComments(@NotNull String path)`
- `@NotNull List<String> getInlineComments(@NotNull String path)`
- `void setComments(@NotNull String path, @Nullable List<String> comments)`
- `void setInlineComments(@NotNull String path, @Nullable List<String> comments)`
