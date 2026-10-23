---
title: "org.bukkit.configuration.serialization.ConfigurationSerialization"
package: "org.bukkit.configuration.serialization"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/configuration/serialization/ConfigurationSerialization.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static String SERIALIZED_TYPE_KEY`
- `ConfigurationSerializable deserialize(Map<String,?> args)`
- `static ConfigurationSerializable deserializeObject(Map<String,?> args)`
- `static ConfigurationSerializable deserializeObject(Map<String,?> args, Class<? extends ConfigurationSerializable> clazz)`
- `protected ConfigurationSerializable deserializeViaCtor(Constructor<? extends ConfigurationSerializable> ctor, Map<String,?> args)`
- `protected ConfigurationSerializable deserializeViaMethod(Method method, Map<String,?> args)`
- `static String getAlias(Class<? extends ConfigurationSerializable> clazz)`
- `static Class<? extends ConfigurationSerializable> getClassByAlias(String alias)`
- `protected Constructor<? extends ConfigurationSerializable> getConstructor()`
- `protected Method getMethod(String name, boolean isStatic)`
- `static void registerClass(Class<? extends ConfigurationSerializable> clazz)`
- `static void registerClass(Class<? extends ConfigurationSerializable> clazz, String alias)`
- `static void unregisterClass(Class<? extends ConfigurationSerializable> clazz)`
- `static void unregisterClass(String alias)`
