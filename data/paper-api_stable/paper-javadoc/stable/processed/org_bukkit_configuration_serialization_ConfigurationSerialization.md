---
title: "org.bukkit.configuration.serialization.ConfigurationSerialization"
package: "org.bukkit.configuration.serialization"
source: https://jd.papermc.io/paper/26.3/org/bukkit/configuration/serialization/ConfigurationSerialization.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class ConfigurationSerialization**
`public class ConfigurationSerialization extends Object`
- `public static final String SERIALIZED_TYPE_KEY`
- `protected ConfigurationSerialization(@NotNull @NotNull Class<? extends ConfigurationSerializable> clazz)`
- `@Nullable protected @Nullable Method getMethod(@NotNull @NotNull String name, boolean isStatic)`
- `@Nullable protected @Nullable Constructor<? extends ConfigurationSerializable> getConstructor()`
- `@Nullable protected @Nullable ConfigurationSerializable deserializeViaMethod(@NotNull @NotNull Method method, @NotNull @NotNull Map<String,?> args)`
- `@Nullable protected @Nullable ConfigurationSerializable deserializeViaCtor(@NotNull @NotNull Constructor<? extends ConfigurationSerializable> ctor, @NotNull @NotNull Map<String,?> args)`
- `@Nullable public @Nullable ConfigurationSerializable deserialize(@NotNull @NotNull Map<String,?> args)`
- `@Nullable public static @Nullable ConfigurationSerializable deserializeObject(@NotNull @NotNull Map<String,?> args, @NotNull @NotNull Class<? extends ConfigurationSerializable> clazz)`
- `@Nullable public static @Nullable ConfigurationSerializable deserializeObject(@NotNull @NotNull Map<String,?> args)`
- `public static void registerClass(@NotNull @NotNull Class<? extends ConfigurationSerializable> clazz)`
- `public static void registerClass(@NotNull @NotNull Class<? extends ConfigurationSerializable> clazz, @NotNull @NotNull String alias)`
- `public static void unregisterClass(@NotNull @NotNull String alias)`
- `public static void unregisterClass(@NotNull @NotNull Class<? extends ConfigurationSerializable> clazz)`
- `@Nullable public static @Nullable Class<? extends ConfigurationSerializable> getClassByAlias(@NotNull @NotNull String alias)`
- `@NotNull public static @NotNull String getAlias(@NotNull @NotNull Class<? extends ConfigurationSerializable> clazz)`
