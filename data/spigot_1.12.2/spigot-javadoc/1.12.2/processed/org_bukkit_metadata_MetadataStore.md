---
title: "org.bukkit.metadata.MetadataStore"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public interface org.bukkit.metadata.MetadataStore<T>`
- `public abstract void setMetadata(T, java.lang.String, org.bukkit.metadata.MetadataValue)`
- `public abstract java.util.List<org.bukkit.metadata.MetadataValue> getMetadata(T, java.lang.String)`
- `public abstract boolean hasMetadata(T, java.lang.String)`
- `public abstract void removeMetadata(T, java.lang.String, org.bukkit.plugin.Plugin)`
- `public abstract void invalidateAll(org.bukkit.plugin.Plugin)`
