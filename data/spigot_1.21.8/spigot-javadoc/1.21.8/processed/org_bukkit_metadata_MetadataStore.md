---
title: "org.bukkit.metadata.MetadataStore"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.metadata.MetadataStore<T>`
- `public abstract void setMetadata(T, java.lang.String, org.bukkit.metadata.MetadataValue)`
- `public abstract java.util.List<org.bukkit.metadata.MetadataValue> getMetadata(T, java.lang.String)`
- `public abstract boolean hasMetadata(T, java.lang.String)`
- `public abstract void removeMetadata(T, java.lang.String, org.bukkit.plugin.Plugin)`
- `public abstract void invalidateAll(org.bukkit.plugin.Plugin)`
