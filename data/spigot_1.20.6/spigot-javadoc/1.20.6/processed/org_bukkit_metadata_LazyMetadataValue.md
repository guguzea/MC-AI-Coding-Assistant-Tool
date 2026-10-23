---
title: "org.bukkit.metadata.LazyMetadataValue"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.metadata.LazyMetadataValue extends org.bukkit.metadata.MetadataValueAdapter`
- `public org.bukkit.metadata.LazyMetadataValue(org.bukkit.plugin.Plugin, java.util.concurrent.Callable<java.lang.Object>)`
- `public org.bukkit.metadata.LazyMetadataValue(org.bukkit.plugin.Plugin, org.bukkit.metadata.LazyMetadataValue$CacheStrategy, java.util.concurrent.Callable<java.lang.Object>)`
- `protected org.bukkit.metadata.LazyMetadataValue(org.bukkit.plugin.Plugin)`
- `public java.lang.Object value()`
- `public synchronized void invalidate()`
