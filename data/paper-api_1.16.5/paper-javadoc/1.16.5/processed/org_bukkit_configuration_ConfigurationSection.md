---
title: "org.bukkit.configuration.ConfigurationSection"
package: "org.bukkit.configuration"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/configuration/ConfigurationSection.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Set<String> getKeys&#8203;(boolean deep)`
- `@NotNull @NotNull Map<String,&#8203;Object> getValues&#8203;(boolean deep)`
- `boolean contains&#8203;(@NotNull @NotNull String path)`
- `boolean contains&#8203;(@NotNull @NotNull String path, boolean ignoreDefault)`
- `boolean isSet&#8203;(@NotNull @NotNull String path)`
- `@Nullable @Nullable String getCurrentPath()`
- `@NotNull @NotNull String getName()`
- `@Nullable @Nullable Configuration getRoot()`
- `@Nullable @Nullable ConfigurationSection getParent()`
- `@Nullable @Nullable Object get&#8203;(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable Object get&#8203;(@NotNull @NotNull String path, @Nullable @Nullable Object def)`
- `void set&#8203;(@NotNull @NotNull String path, @Nullable @Nullable Object value)`
- `@NotNull @NotNull ConfigurationSection createSection&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull ConfigurationSection createSection&#8203;(@NotNull @NotNull String path, @NotNull @NotNull Map<?,&#8203;?> map)`
- `@Nullable @Nullable String getString&#8203;(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable String getString&#8203;(@NotNull @NotNull String path, @Nullable @Nullable String def)`
- `boolean isString&#8203;(@NotNull @NotNull String path)`
- `int getInt&#8203;(@NotNull @NotNull String path)`
- `int getInt&#8203;(@NotNull @NotNull String path, int def)`
- `boolean isInt&#8203;(@NotNull @NotNull String path)`
- `boolean getBoolean&#8203;(@NotNull @NotNull String path)`
- `boolean getBoolean&#8203;(@NotNull @NotNull String path, boolean def)`
- `boolean isBoolean&#8203;(@NotNull @NotNull String path)`
- `double getDouble&#8203;(@NotNull @NotNull String path)`
- `double getDouble&#8203;(@NotNull @NotNull String path, double def)`
- `boolean isDouble&#8203;(@NotNull @NotNull String path)`
- `long getLong&#8203;(@NotNull @NotNull String path)`
- `long getLong&#8203;(@NotNull @NotNull String path, long def)`
- `boolean isLong&#8203;(@NotNull @NotNull String path)`
- `@Nullable @Nullable List<?> getList&#8203;(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable List<?> getList&#8203;(@NotNull @NotNull String path, @Nullable @Nullable List<?> def)`
- `boolean isList&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<String> getStringList&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Integer> getIntegerList&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Boolean> getBooleanList&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Double> getDoubleList&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Float> getFloatList&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Long> getLongList&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Byte> getByteList&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Character> getCharacterList&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Short> getShortList&#8203;(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Map<?,&#8203;?>> getMapList&#8203;(@NotNull @NotNull String path)`
- `@Nullable <T> T getObject&#8203;(@NotNull @NotNull String path, @NotNull @NotNull Class<T> clazz)`
- `@Contract("_, _, !null -> !null") @Nullable <T> T getObject&#8203;(@NotNull @NotNull String path, @NotNull @NotNull Class<T> clazz, @Nullable T def)`
- `@Nullable <T extends ConfigurationSerializable> T getSerializable&#8203;(@NotNull @NotNull String path, @NotNull @NotNull Class<T> clazz)`
- `@Contract("_, _, !null -> !null") @Nullable <T extends ConfigurationSerializable> T getSerializable&#8203;(@NotNull @NotNull String path, @NotNull @NotNull Class<T> clazz, @Nullable T def)`
- `@Nullable @Nullable Vector getVector&#8203;(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable Vector getVector&#8203;(@NotNull @NotNull String path, @Nullable @Nullable Vector def)`
- `boolean isVector&#8203;(@NotNull @NotNull String path)`
- `@Nullable @Nullable OfflinePlayer getOfflinePlayer&#8203;(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable OfflinePlayer getOfflinePlayer&#8203;(@NotNull @NotNull String path, @Nullable @Nullable OfflinePlayer def)`
- `boolean isOfflinePlayer&#8203;(@NotNull @NotNull String path)`
- `@Nullable @Nullable ItemStack getItemStack&#8203;(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable ItemStack getItemStack&#8203;(@NotNull @NotNull String path, @Nullable @Nullable ItemStack def)`
- `boolean isItemStack&#8203;(@NotNull @NotNull String path)`
- `@Nullable @Nullable Color getColor&#8203;(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable Color getColor&#8203;(@NotNull @NotNull String path, @Nullable @Nullable Color def)`
- `boolean isColor&#8203;(@NotNull @NotNull String path)`
- `@Nullable @Nullable Location getLocation&#8203;(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable Location getLocation&#8203;(@NotNull @NotNull String path, @Nullable @Nullable Location def)`
- `boolean isLocation&#8203;(@NotNull @NotNull String path)`
- `@Nullable @Nullable ConfigurationSection getConfigurationSection&#8203;(@NotNull @NotNull String path)`
- `boolean isConfigurationSection&#8203;(@NotNull @NotNull String path)`
- `@Nullable @Nullable ConfigurationSection getDefaultSection()`
- `void addDefault&#8203;(@NotNull @NotNull String path, @Nullable @Nullable Object value)`
