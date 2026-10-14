---
title: "org.bukkit.configuration.ConfigurationSection"
package: "org.bukkit.configuration"
source: https://jd.papermc.io/paper/26.3/org/bukkit/configuration/ConfigurationSection.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ConfigurationSection**
`public interface ConfigurationSection`
- `@NotNull @NotNull Set<String> getKeys(boolean deep)`
- `@NotNull @NotNull Map<String,Object> getValues(boolean deep)`
- `boolean contains(@NotNull @NotNull String path)`
- `boolean contains(@NotNull @NotNull String path, boolean ignoreDefault)`
- `boolean isSet(@NotNull @NotNull String path)`
- `@Nullable @Nullable String getCurrentPath()`
- `@NotNull @NotNull String getName()`
- `@Nullable @Nullable Configuration getRoot()`
- `@Nullable @Nullable ConfigurationSection getParent()`
- `@Nullable @Nullable Object get(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable Object get(@NotNull @NotNull String path, @Nullable @Nullable Object def)`
- `void set(@NotNull @NotNull String path, @Nullable @Nullable Object value)`
- `@NotNull @NotNull ConfigurationSection createSection(@NotNull @NotNull String path)`
- `@NotNull @NotNull ConfigurationSection createSection(@NotNull @NotNull String path, @NotNull @NotNull Map<?,?> map)`
- `@Nullable @Nullable String getString(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable String getString(@NotNull @NotNull String path, @Nullable @Nullable String def)`
- `boolean isString(@NotNull @NotNull String path)`
- `int getInt(@NotNull @NotNull String path)`
- `int getInt(@NotNull @NotNull String path, int def)`
- `boolean isInt(@NotNull @NotNull String path)`
- `boolean getBoolean(@NotNull @NotNull String path)`
- `boolean getBoolean(@NotNull @NotNull String path, boolean def)`
- `boolean isBoolean(@NotNull @NotNull String path)`
- `double getDouble(@NotNull @NotNull String path)`
- `double getDouble(@NotNull @NotNull String path, double def)`
- `boolean isDouble(@NotNull @NotNull String path)`
- `long getLong(@NotNull @NotNull String path)`
- `long getLong(@NotNull @NotNull String path, long def)`
- `boolean isLong(@NotNull @NotNull String path)`
- `@Nullable @Nullable List<?> getList(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable List<?> getList(@NotNull @NotNull String path, @Nullable @Nullable List<?> def)`
- `boolean isList(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<String> getStringList(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Integer> getIntegerList(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Boolean> getBooleanList(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Double> getDoubleList(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Float> getFloatList(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Long> getLongList(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Byte> getByteList(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Character> getCharacterList(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Short> getShortList(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<Map<?,?>> getMapList(@NotNull @NotNull String path)`
- `@Nullable <T> T getObject(@NotNull @NotNull String path, @NotNull @NotNull Class<T> clazz)`
- `@Contract("_, _, !null -> !null") @Nullable <T> T getObject(@NotNull @NotNull String path, @NotNull @NotNull Class<T> clazz, @Nullable T def)`
- `@Nullable <T extends ConfigurationSerializable> T getSerializable(@NotNull @NotNull String path, @NotNull @NotNull Class<T> clazz)`
- `@Contract("_, _, !null -> !null") @Nullable <T extends ConfigurationSerializable> T getSerializable(@NotNull @NotNull String path, @NotNull @NotNull Class<T> clazz, @Nullable T def)`
- `@Nullable @Nullable Vector getVector(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable Vector getVector(@NotNull @NotNull String path, @Nullable @Nullable Vector def)`
- `boolean isVector(@NotNull @NotNull String path)`
- `@Nullable @Nullable OfflinePlayer getOfflinePlayer(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable OfflinePlayer getOfflinePlayer(@NotNull @NotNull String path, @Nullable @Nullable OfflinePlayer def)`
- `boolean isOfflinePlayer(@NotNull @NotNull String path)`
- `@Nullable @Nullable ItemStack getItemStack(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable ItemStack getItemStack(@NotNull @NotNull String path, @Nullable @Nullable ItemStack def)`
- `boolean isItemStack(@NotNull @NotNull String path)`
- `@Nullable @Nullable Color getColor(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable Color getColor(@NotNull @NotNull String path, @Nullable @Nullable Color def)`
- `boolean isColor(@NotNull @NotNull String path)`
- `@Nullable @Nullable Location getLocation(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable @Nullable Location getLocation(@NotNull @NotNull String path, @Nullable @Nullable Location def)`
- `boolean isLocation(@NotNull @NotNull String path)`
- `@Nullable @Nullable ConfigurationSection getConfigurationSection(@NotNull @NotNull String path)`
- `boolean isConfigurationSection(@NotNull @NotNull String path)`
- `@Nullable @Nullable ConfigurationSection getDefaultSection()`
- `void addDefault(@NotNull @NotNull String path, @Nullable @Nullable Object value)`
- `@NotNull @NotNull List<String> getComments(@NotNull @NotNull String path)`
- `@NotNull @NotNull List<String> getInlineComments(@NotNull @NotNull String path)`
- `void setComments(@NotNull @NotNull String path, @Nullable @Nullable List<String> comments)`
- `void setInlineComments(@NotNull @NotNull String path, @Nullable @Nullable List<String> comments)`
- `default @Nullable Component getRichMessage(@NotNull @NotNull String path)`
- `@Contract("_, !null -> !null") default @Nullable Component getRichMessage(@NotNull @NotNull String path, @Nullable Component fallback)`
- `default void setRichMessage(@NotNull @NotNull String path, @Nullable Component value)`
- `@Nullable default <C extends Component> C getComponent(@NotNull @NotNull String path, @NotNull ComponentDecoder<? super String, C> decoder)`
- `@Contract("_, _, !null -> !null") @Nullable default <C extends Component> C getComponent(@NotNull @NotNull String path, @NotNull ComponentDecoder<? super String, C> decoder, @Nullable C fallback)`
- `default <C extends Component> void setComponent(@NotNull @NotNull String path, @NotNull ComponentEncoder<C,String> encoder, @Nullable C value)`
