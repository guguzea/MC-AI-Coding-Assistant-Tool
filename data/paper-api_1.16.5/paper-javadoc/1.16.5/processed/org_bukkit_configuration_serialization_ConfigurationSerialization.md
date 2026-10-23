---
title: "org.bukkit.configuration.serialization.ConfigurationSerialization"
package: "org.bukkit.configuration.serialization"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/configuration/serialization/ConfigurationSerialization.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public static final String SERIALIZED_TYPE_KEY`
- `protected ConfigurationSerialization&#8203;(@NotNull @NotNull Class<? extends ConfigurationSerializable> clazz)`
- `@Nullable protected @Nullable Method getMethod&#8203;(@NotNull @NotNull String name, boolean isStatic)`
- `@Nullable protected @Nullable Constructor<? extends ConfigurationSerializable> getConstructor()`
- `@Nullable protected @Nullable ConfigurationSerializable deserializeViaMethod&#8203;(@NotNull @NotNull Method method, @NotNull @NotNull Map<String,&#8203;?> args)`
- `@Nullable protected @Nullable ConfigurationSerializable deserializeViaCtor&#8203;(@NotNull @NotNull Constructor<? extends ConfigurationSerializable> ctor, @NotNull @NotNull Map<String,&#8203;?> args)`
- `@Nullable public @Nullable ConfigurationSerializable deserialize&#8203;(@NotNull @NotNull Map<String,&#8203;?> args)`
- `@Nullable public static @Nullable ConfigurationSerializable deserializeObject&#8203;(@NotNull @NotNull Map<String,&#8203;?> args, @NotNull @NotNull Class<? extends ConfigurationSerializable> clazz)`
- `@Nullable public static @Nullable ConfigurationSerializable deserializeObject&#8203;(@NotNull @NotNull Map<String,&#8203;?> args)`
- `public static void registerClass&#8203;(@NotNull @NotNull Class<? extends ConfigurationSerializable> clazz)`
- `public static void registerClass&#8203;(@NotNull @NotNull Class<? extends ConfigurationSerializable> clazz, @NotNull @NotNull String alias)`
- `public static void unregisterClass&#8203;(@NotNull @NotNull String alias)`
- `public static void unregisterClass&#8203;(@NotNull @NotNull Class<? extends ConfigurationSerializable> clazz)`
- `@Nullable public static @Nullable Class<? extends ConfigurationSerializable> getClassByAlias&#8203;(@NotNull @NotNull String alias)`
- `@NotNull public static @NotNull String getAlias&#8203;(@NotNull @NotNull Class<? extends ConfigurationSerializable> clazz)`
