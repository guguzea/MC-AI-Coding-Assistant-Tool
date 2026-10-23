---
title: "org.bukkit.metadata.LazyMetadataValue"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.metadata.LazyMetadataValue extends org.bukkit.metadata.MetadataValueAdapter`
- `public org.bukkit.metadata.LazyMetadataValue(org.bukkit.plugin.Plugin, java.util.concurrent.Callable<java.lang.Object>)`
- `public org.bukkit.metadata.LazyMetadataValue(org.bukkit.plugin.Plugin, org.bukkit.metadata.LazyMetadataValue$CacheStrategy, java.util.concurrent.Callable<java.lang.Object>)`
- `protected org.bukkit.metadata.LazyMetadataValue(org.bukkit.plugin.Plugin)`
- `public java.lang.Object value()`
- `public synchronized void invalidate()`
