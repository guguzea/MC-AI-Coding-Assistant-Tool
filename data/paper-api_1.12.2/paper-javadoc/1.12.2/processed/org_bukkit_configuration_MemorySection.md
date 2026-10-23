---
title: "org.bukkit.configuration.MemorySection"
package: "org.bukkit.configuration"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/configuration/MemorySection.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `protected Map<String,Object> map`
- `void addDefault(String path, Object value)`
- `boolean contains(String path)`
- `boolean contains(String path, boolean ignoreDefault)`
- `static String createPath(ConfigurationSection section, String key)`
- `static String createPath(ConfigurationSection section, String key, ConfigurationSection relativeTo)`
- `ConfigurationSection createSection(String path)`
- `ConfigurationSection createSection(String path, Map<?,?> map)`
- `Object get(String path)`
- `Object get(String path, Object def)`
- `boolean getBoolean(String path)`
- `boolean getBoolean(String path, boolean def)`
- `List<Boolean> getBooleanList(String path)`
- `List<Byte> getByteList(String path)`
- `List<Character> getCharacterList(String path)`
- `Color getColor(String path)`
- `Color getColor(String path, Color def)`
- `ConfigurationSection getConfigurationSection(String path)`
- `String getCurrentPath()`
- `protected Object getDefault(String path)`
- `ConfigurationSection getDefaultSection()`
- `double getDouble(String path)`
- `double getDouble(String path, double def)`
- `List<Double> getDoubleList(String path)`
- `List<Float> getFloatList(String path)`
- `int getInt(String path)`
- `int getInt(String path, int def)`
- `List<Integer> getIntegerList(String path)`
- `ItemStack getItemStack(String path)`
- `ItemStack getItemStack(String path, ItemStack def)`
- `Set<String> getKeys(boolean deep)`
- `List<?> getList(String path)`
- `List<?> getList(String path, List<?> def)`
- `long getLong(String path)`
- `long getLong(String path, long def)`
- `List<Long> getLongList(String path)`
- `List<Map<?,?>> getMapList(String path)`
- `String getName()`
- `OfflinePlayer getOfflinePlayer(String path)`
- `OfflinePlayer getOfflinePlayer(String path, OfflinePlayer def)`
- `ConfigurationSection getParent()`
- `Configuration getRoot()`
- `<T extends ConfigurationSerializable>T getSerializable(String path, Class<T> clazz)`
- `<T extends ConfigurationSerializable>T getSerializable(String path, Class<T> clazz, T def)`
- `List<Short> getShortList(String path)`
- `String getString(String path)`
- `String getString(String path, String def)`
- `List<String> getStringList(String path)`
- `Map<String,Object> getValues(boolean deep)`
- `Vector getVector(String path)`
- `Vector getVector(String path, Vector def)`
- `boolean isBoolean(String path)`
- `boolean isColor(String path)`
- `boolean isConfigurationSection(String path)`
- `boolean isDouble(String path)`
- `boolean isInt(String path)`
- `boolean isItemStack(String path)`
- `boolean isList(String path)`
- `boolean isLong(String path)`
- `boolean isOfflinePlayer(String path)`
- `protected boolean isPrimitiveWrapper(Object input)`
- `boolean isSet(String path)`
- `boolean isString(String path)`
- `boolean isVector(String path)`
- `protected void mapChildrenKeys(Set<String> output, ConfigurationSection section, boolean deep)`
- `protected void mapChildrenValues(Map<String,Object> output, ConfigurationSection section, boolean deep)`
- `void set(String path, Object value)`
- `String toString()`
