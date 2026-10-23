---
title: "org.bukkit.configuration.serialization.ConfigurationSerialization"
package: "org.bukkit.configuration.serialization"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.configuration.serialization.ConfigurationSerialization`
- `public static final java.lang.String SERIALIZED_TYPE_KEY`
- `protected org.bukkit.configuration.serialization.ConfigurationSerialization(java.lang.Class<? extends org.bukkit.configuration.serialization.ConfigurationSerializable>)`
- `protected java.lang.reflect.Method getMethod(java.lang.String, boolean)`
- `protected java.lang.reflect.Constructor<? extends org.bukkit.configuration.serialization.ConfigurationSerializable> getConstructor()`
- `protected org.bukkit.configuration.serialization.ConfigurationSerializable deserializeViaMethod(java.lang.reflect.Method, java.util.Map<java.lang.String, ?>)`
- `protected org.bukkit.configuration.serialization.ConfigurationSerializable deserializeViaCtor(java.lang.reflect.Constructor<? extends org.bukkit.configuration.serialization.ConfigurationSerializable>, java.util.Map<java.lang.String, ?>)`
- `public org.bukkit.configuration.serialization.ConfigurationSerializable deserialize(java.util.Map<java.lang.String, ?>)`
- `public static org.bukkit.configuration.serialization.ConfigurationSerializable deserializeObject(java.util.Map<java.lang.String, ?>, java.lang.Class<? extends org.bukkit.configuration.serialization.ConfigurationSerializable>)`
- `public static org.bukkit.configuration.serialization.ConfigurationSerializable deserializeObject(java.util.Map<java.lang.String, ?>)`
- `public static void registerClass(java.lang.Class<? extends org.bukkit.configuration.serialization.ConfigurationSerializable>)`
- `public static void registerClass(java.lang.Class<? extends org.bukkit.configuration.serialization.ConfigurationSerializable>, java.lang.String)`
- `public static void unregisterClass(java.lang.String)`
- `public static void unregisterClass(java.lang.Class<? extends org.bukkit.configuration.serialization.ConfigurationSerializable>)`
- `public static java.lang.Class<? extends org.bukkit.configuration.serialization.ConfigurationSerializable> getClassByAlias(java.lang.String)`
- `public static java.lang.String getAlias(java.lang.Class<? extends org.bukkit.configuration.serialization.ConfigurationSerializable>)`
