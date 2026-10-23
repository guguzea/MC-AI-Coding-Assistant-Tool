---
title: "org.bukkit.metadata.MetadataStoreBase"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public abstract class org.bukkit.metadata.MetadataStoreBase<T>`
- `public org.bukkit.metadata.MetadataStoreBase()`
- `public synchronized void setMetadata(T, java.lang.String, org.bukkit.metadata.MetadataValue)`
- `public synchronized java.util.List<org.bukkit.metadata.MetadataValue> getMetadata(T, java.lang.String)`
- `public synchronized boolean hasMetadata(T, java.lang.String)`
- `public synchronized void removeMetadata(T, java.lang.String, org.bukkit.plugin.Plugin)`
- `public synchronized void invalidateAll(org.bukkit.plugin.Plugin)`
- `protected abstract java.lang.String disambiguate(T, java.lang.String)`
