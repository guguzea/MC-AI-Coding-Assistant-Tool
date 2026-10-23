---
title: "org.bukkit.configuration.serialization.ConfigurationSerialization"
package: "org.bukkit.configuration.serialization"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
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
