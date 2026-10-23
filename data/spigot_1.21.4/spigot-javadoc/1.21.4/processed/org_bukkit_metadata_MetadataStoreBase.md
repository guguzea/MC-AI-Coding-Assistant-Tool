---
title: "org.bukkit.metadata.MetadataStoreBase"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public abstract class org.bukkit.metadata.MetadataStoreBase<T>`
- `public org.bukkit.metadata.MetadataStoreBase()`
- `public synchronized void setMetadata(T, java.lang.String, org.bukkit.metadata.MetadataValue)`
- `public synchronized java.util.List<org.bukkit.metadata.MetadataValue> getMetadata(T, java.lang.String)`
- `public synchronized boolean hasMetadata(T, java.lang.String)`
- `public synchronized void removeMetadata(T, java.lang.String, org.bukkit.plugin.Plugin)`
- `public synchronized void invalidateAll(org.bukkit.plugin.Plugin)`
- `protected abstract java.lang.String disambiguate(T, java.lang.String)`
