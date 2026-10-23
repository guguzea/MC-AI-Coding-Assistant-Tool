---
title: "org.bukkit.Registry$SimpleRegistry"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public final class org.bukkit.Registry$SimpleRegistry<T extends java.lang.Enum<T> & org.bukkit.Keyed> implements org.bukkit.Registry<T>`
- `protected org.bukkit.Registry$SimpleRegistry(java.lang.Class<T>)`
- `protected org.bukkit.Registry$SimpleRegistry(java.lang.Class<T>, java.util.function.Predicate<T>)`
- `public T get(org.bukkit.NamespacedKey)`
- `public T getOrThrow(org.bukkit.NamespacedKey)`
- `public java.util.stream.Stream<T> stream()`
- `public java.util.Iterator<T> iterator()`
- `public java.lang.Class<T> getType()`
- `public org.bukkit.Keyed getOrThrow(org.bukkit.NamespacedKey)`
- `public org.bukkit.Keyed get(org.bukkit.NamespacedKey)`
