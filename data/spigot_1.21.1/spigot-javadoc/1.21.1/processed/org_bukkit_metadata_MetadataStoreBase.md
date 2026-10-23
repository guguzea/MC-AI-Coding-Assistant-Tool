---
title: "org.bukkit.metadata.MetadataStoreBase"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public abstract class org.bukkit.metadata.MetadataStoreBase<T>`
- `public org.bukkit.metadata.MetadataStoreBase()`
- `public synchronized void setMetadata(T, java.lang.String, org.bukkit.metadata.MetadataValue)`
- `public synchronized java.util.List<org.bukkit.metadata.MetadataValue> getMetadata(T, java.lang.String)`
- `public synchronized boolean hasMetadata(T, java.lang.String)`
- `public synchronized void removeMetadata(T, java.lang.String, org.bukkit.plugin.Plugin)`
- `public synchronized void invalidateAll(org.bukkit.plugin.Plugin)`
- `protected abstract java.lang.String disambiguate(T, java.lang.String)`
