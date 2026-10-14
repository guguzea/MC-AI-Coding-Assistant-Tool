---
title: "org.bukkit.configuration.serialization.ConfigurationSerialization"
package: "org.bukkit.configuration.serialization"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/configuration/serialization/ConfigurationSerialization.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ConfigurationSerialization**
`public class ConfigurationSerialization extends Object`
- `public static final String SERIALIZED_TYPE_KEY`
- `protected ConfigurationSerialization(@NotNull Class<? extends ConfigurationSerializable> clazz)`
- `@Nullable protected Method getMethod(@NotNull String name, boolean isStatic)`
- `@Nullable protected Constructor<? extends ConfigurationSerializable> getConstructor()`
- `@Nullable protected ConfigurationSerializable deserializeViaMethod(@NotNull Method method, @NotNull Map<String,?> args)`
- `@Nullable protected ConfigurationSerializable deserializeViaCtor(@NotNull Constructor<? extends ConfigurationSerializable> ctor, @NotNull Map<String,?> args)`
- `@Nullable public ConfigurationSerializable deserialize(@NotNull Map<String,?> args)`
- `@Nullable public static ConfigurationSerializable deserializeObject(@NotNull Map<String,?> args, @NotNull Class<? extends ConfigurationSerializable> clazz)`
- `@Nullable public static ConfigurationSerializable deserializeObject(@NotNull Map<String,?> args)`
- `public static void registerClass(@NotNull Class<? extends ConfigurationSerializable> clazz)`
- `public static void registerClass(@NotNull Class<? extends ConfigurationSerializable> clazz, @NotNull String alias)`
- `public static void unregisterClass(@NotNull String alias)`
- `public static void unregisterClass(@NotNull Class<? extends ConfigurationSerializable> clazz)`
- `@Nullable public static Class<? extends ConfigurationSerializable> getClassByAlias(@NotNull String alias)`
- `@NotNull public static String getAlias(@NotNull Class<? extends ConfigurationSerializable> clazz)`
