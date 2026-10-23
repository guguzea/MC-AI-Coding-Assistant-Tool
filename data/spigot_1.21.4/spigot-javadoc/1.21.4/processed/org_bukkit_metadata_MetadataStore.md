---
title: "org.bukkit.metadata.MetadataStore"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.metadata.MetadataStore<T>`
- `public abstract void setMetadata(T, java.lang.String, org.bukkit.metadata.MetadataValue)`
- `public abstract java.util.List<org.bukkit.metadata.MetadataValue> getMetadata(T, java.lang.String)`
- `public abstract boolean hasMetadata(T, java.lang.String)`
- `public abstract void removeMetadata(T, java.lang.String, org.bukkit.plugin.Plugin)`
- `public abstract void invalidateAll(org.bukkit.plugin.Plugin)`
