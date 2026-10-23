---
title: "org.bukkit.configuration.ConfigurationSection"
package: "org.bukkit.configuration"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.configuration.ConfigurationSection`
- `public abstract java.util.Set<java.lang.String> getKeys(boolean)`
- `public abstract java.util.Map<java.lang.String, java.lang.Object> getValues(boolean)`
- `public abstract boolean contains(java.lang.String)`
- `public abstract boolean contains(java.lang.String, boolean)`
- `public abstract boolean isSet(java.lang.String)`
- `public abstract java.lang.String getCurrentPath()`
- `public abstract java.lang.String getName()`
- `public abstract org.bukkit.configuration.Configuration getRoot()`
- `public abstract org.bukkit.configuration.ConfigurationSection getParent()`
- `public abstract java.lang.Object get(java.lang.String)`
- `public abstract java.lang.Object get(java.lang.String, java.lang.Object)`
- `public abstract void set(java.lang.String, java.lang.Object)`
- `public abstract org.bukkit.configuration.ConfigurationSection createSection(java.lang.String)`
- `public abstract org.bukkit.configuration.ConfigurationSection createSection(java.lang.String, java.util.Map<?, ?>)`
- `public abstract java.lang.String getString(java.lang.String)`
- `public abstract java.lang.String getString(java.lang.String, java.lang.String)`
- `public abstract boolean isString(java.lang.String)`
- `public abstract int getInt(java.lang.String)`
- `public abstract int getInt(java.lang.String, int)`
- `public abstract boolean isInt(java.lang.String)`
- `public abstract boolean getBoolean(java.lang.String)`
- `public abstract boolean getBoolean(java.lang.String, boolean)`
- `public abstract boolean isBoolean(java.lang.String)`
- `public abstract double getDouble(java.lang.String)`
- `public abstract double getDouble(java.lang.String, double)`
- `public abstract boolean isDouble(java.lang.String)`
- `public abstract long getLong(java.lang.String)`
- `public abstract long getLong(java.lang.String, long)`
- `public abstract boolean isLong(java.lang.String)`
- `public abstract java.util.List<?> getList(java.lang.String)`
- `public abstract java.util.List<?> getList(java.lang.String, java.util.List<?>)`
- `public abstract boolean isList(java.lang.String)`
- `public abstract java.util.List<java.lang.String> getStringList(java.lang.String)`
- `public abstract java.util.List<java.lang.Integer> getIntegerList(java.lang.String)`
- `public abstract java.util.List<java.lang.Boolean> getBooleanList(java.lang.String)`
- `public abstract java.util.List<java.lang.Double> getDoubleList(java.lang.String)`
- `public abstract java.util.List<java.lang.Float> getFloatList(java.lang.String)`
- `public abstract java.util.List<java.lang.Long> getLongList(java.lang.String)`
- `public abstract java.util.List<java.lang.Byte> getByteList(java.lang.String)`
- `public abstract java.util.List<java.lang.Character> getCharacterList(java.lang.String)`
- `public abstract java.util.List<java.lang.Short> getShortList(java.lang.String)`
- `public abstract java.util.List<java.util.Map<?, ?>> getMapList(java.lang.String)`
- `public abstract <T> T getObject(java.lang.String, java.lang.Class<T>)`
- `public abstract <T> T getObject(java.lang.String, java.lang.Class<T>, T)`
- `public abstract <T extends org.bukkit.configuration.serialization.ConfigurationSerializable> T getSerializable(java.lang.String, java.lang.Class<T>)`
- `public abstract <T extends org.bukkit.configuration.serialization.ConfigurationSerializable> T getSerializable(java.lang.String, java.lang.Class<T>, T)`
- `public abstract org.bukkit.util.Vector getVector(java.lang.String)`
- `public abstract org.bukkit.util.Vector getVector(java.lang.String, org.bukkit.util.Vector)`
- `public abstract boolean isVector(java.lang.String)`
- `public abstract org.bukkit.OfflinePlayer getOfflinePlayer(java.lang.String)`
- `public abstract org.bukkit.OfflinePlayer getOfflinePlayer(java.lang.String, org.bukkit.OfflinePlayer)`
- `public abstract boolean isOfflinePlayer(java.lang.String)`
- `public abstract org.bukkit.inventory.ItemStack getItemStack(java.lang.String)`
- `public abstract org.bukkit.inventory.ItemStack getItemStack(java.lang.String, org.bukkit.inventory.ItemStack)`
- `public abstract boolean isItemStack(java.lang.String)`
- `public abstract org.bukkit.Color getColor(java.lang.String)`
- `public abstract org.bukkit.Color getColor(java.lang.String, org.bukkit.Color)`
- `public abstract boolean isColor(java.lang.String)`
- `public abstract org.bukkit.Location getLocation(java.lang.String)`
- `public abstract org.bukkit.Location getLocation(java.lang.String, org.bukkit.Location)`
- `public abstract boolean isLocation(java.lang.String)`
- `public abstract org.bukkit.configuration.ConfigurationSection getConfigurationSection(java.lang.String)`
- `public abstract boolean isConfigurationSection(java.lang.String)`
- `public abstract org.bukkit.configuration.ConfigurationSection getDefaultSection()`
- `public abstract void addDefault(java.lang.String, java.lang.Object)`
- `public abstract java.util.List<java.lang.String> getComments(java.lang.String)`
- `public abstract java.util.List<java.lang.String> getInlineComments(java.lang.String)`
- `public abstract void setComments(java.lang.String, java.util.List<java.lang.String>)`
- `public abstract void setInlineComments(java.lang.String, java.util.List<java.lang.String>)`
