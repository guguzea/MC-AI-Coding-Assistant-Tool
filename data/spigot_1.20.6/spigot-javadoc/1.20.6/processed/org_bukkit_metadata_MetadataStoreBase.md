---
title: "org.bukkit.metadata.MetadataStoreBase"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public abstract class org.bukkit.metadata.MetadataStoreBase<T>`
- `public org.bukkit.metadata.MetadataStoreBase()`
- `public synchronized void setMetadata(T, java.lang.String, org.bukkit.metadata.MetadataValue)`
- `public synchronized java.util.List<org.bukkit.metadata.MetadataValue> getMetadata(T, java.lang.String)`
- `public synchronized boolean hasMetadata(T, java.lang.String)`
- `public synchronized void removeMetadata(T, java.lang.String, org.bukkit.plugin.Plugin)`
- `public synchronized void invalidateAll(org.bukkit.plugin.Plugin)`
- `protected abstract java.lang.String disambiguate(T, java.lang.String)`
