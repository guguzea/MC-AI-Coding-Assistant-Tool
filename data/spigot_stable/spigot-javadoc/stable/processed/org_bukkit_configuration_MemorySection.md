---
title: "org.bukkit.configuration.MemorySection"
package: "org.bukkit.configuration"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/configuration/MemorySection.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class MemorySection**
`public class MemorySection extends Object implements ConfigurationSection`
- `protected final Map<String, org.bukkit.configuration.SectionPathData> map`
- `protected MemorySection()`
- `protected MemorySection(@NotNull ConfigurationSection parent, @NotNull String path)`
- `@NotNull public Set<String> getKeys(boolean deep)`
- `@NotNull public Map<String,Object> getValues(boolean deep)`
- `public boolean contains(@NotNull String path)`
- `public boolean contains(@NotNull String path, boolean ignoreDefault)`
- `public boolean isSet(@NotNull String path)`
- `@NotNull public String getCurrentPath()`
- `@NotNull public String getName()`
- `@Nullable public Configuration getRoot()`
- `@Nullable public ConfigurationSection getParent()`
- `public void addDefault(@NotNull String path, @Nullable Object value)`
- `@Nullable public ConfigurationSection getDefaultSection()`
- `public void set(@NotNull String path, @Nullable Object value)`
- `@Nullable public Object get(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable public Object get(@NotNull String path, @Nullable Object def)`
- `@NotNull public ConfigurationSection createSection(@NotNull String path)`
- `@NotNull public ConfigurationSection createSection(@NotNull String path, @NotNull Map<?,?> map)`
- `@Nullable public String getString(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable public String getString(@NotNull String path, @Nullable String def)`
- `public boolean isString(@NotNull String path)`
- `public int getInt(@NotNull String path)`
- `public int getInt(@NotNull String path, int def)`
- `public boolean isInt(@NotNull String path)`
- `public boolean getBoolean(@NotNull String path)`
- `public boolean getBoolean(@NotNull String path, boolean def)`
- `public boolean isBoolean(@NotNull String path)`
- `public double getDouble(@NotNull String path)`
- `public double getDouble(@NotNull String path, double def)`
- `public boolean isDouble(@NotNull String path)`
- `public long getLong(@NotNull String path)`
- `public long getLong(@NotNull String path, long def)`
- `public boolean isLong(@NotNull String path)`
- `@Nullable public List<?> getList(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable public List<?> getList(@NotNull String path, @Nullable List<?> def)`
- `public boolean isList(@NotNull String path)`
- `@NotNull public List<String> getStringList(@NotNull String path)`
- `@NotNull public List<Integer> getIntegerList(@NotNull String path)`
- `@NotNull public List<Boolean> getBooleanList(@NotNull String path)`
- `@NotNull public List<Double> getDoubleList(@NotNull String path)`
- `@NotNull public List<Float> getFloatList(@NotNull String path)`
- `@NotNull public List<Long> getLongList(@NotNull String path)`
- `@NotNull public List<Byte> getByteList(@NotNull String path)`
- `@NotNull public List<Character> getCharacterList(@NotNull String path)`
- `@NotNull public List<Short> getShortList(@NotNull String path)`
- `@NotNull public List<Map<?,?>> getMapList(@NotNull String path)`
- `@Nullable public <T> T getObject(@NotNull String path, @NotNull Class<T> clazz)`
- `@Contract("_, _, !null -> !null") @Nullable public <T> T getObject(@NotNull String path, @NotNull Class<T> clazz, @Nullable T def)`
- `@Nullable public <T extends ConfigurationSerializable> T getSerializable(@NotNull String path, @NotNull Class<T> clazz)`
- `@Contract("_, _, !null -> !null") @Nullable public <T extends ConfigurationSerializable> T getSerializable(@NotNull String path, @NotNull Class<T> clazz, @Nullable T def)`
- `@Nullable public Vector getVector(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable public Vector getVector(@NotNull String path, @Nullable Vector def)`
- `public boolean isVector(@NotNull String path)`
- `@Nullable public OfflinePlayer getOfflinePlayer(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable public OfflinePlayer getOfflinePlayer(@NotNull String path, @Nullable OfflinePlayer def)`
- `public boolean isOfflinePlayer(@NotNull String path)`
- `@Nullable public ItemStack getItemStack(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable public ItemStack getItemStack(@NotNull String path, @Nullable ItemStack def)`
- `public boolean isItemStack(@NotNull String path)`
- `@Nullable public Color getColor(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable public Color getColor(@NotNull String path, @Nullable Color def)`
- `public boolean isColor(@NotNull String path)`
- `@Nullable public Location getLocation(@NotNull String path)`
- `@Contract("_, !null -> !null") @Nullable public Location getLocation(@NotNull String path, @Nullable Location def)`
- `public boolean isLocation(@NotNull String path)`
- `@Nullable public ConfigurationSection getConfigurationSection(@NotNull String path)`
- `public boolean isConfigurationSection(@NotNull String path)`
- `protected boolean isPrimitiveWrapper(@Nullable Object input)`
- `@Nullable protected Object getDefault(@NotNull String path)`
- `protected void mapChildrenKeys(@NotNull Set<String> output, @NotNull ConfigurationSection section, boolean deep)`
- `protected void mapChildrenValues(@NotNull Map<String,Object> output, @NotNull ConfigurationSection section, boolean deep)`
- `@NotNull public static String createPath(@NotNull ConfigurationSection section, @Nullable String key)`
- `@NotNull public static String createPath(@NotNull ConfigurationSection section, @Nullable String key, @Nullable ConfigurationSection relativeTo)`
- `@NotNull public List<String> getComments(@NotNull String path)`
- `@NotNull public List<String> getInlineComments(@NotNull String path)`
- `public void setComments(@NotNull String path, @Nullable List<String> comments)`
- `public void setInlineComments(@NotNull String path, @Nullable List<String> comments)`
- `public String toString()`
