---
title: "org.bukkit.metadata.MetadataStore"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public interface org.bukkit.metadata.MetadataStore<T>`
- `public abstract void setMetadata(T, java.lang.String, org.bukkit.metadata.MetadataValue)`
- `public abstract java.util.List<org.bukkit.metadata.MetadataValue> getMetadata(T, java.lang.String)`
- `public abstract boolean hasMetadata(T, java.lang.String)`
- `public abstract void removeMetadata(T, java.lang.String, org.bukkit.plugin.Plugin)`
- `public abstract void invalidateAll(org.bukkit.plugin.Plugin)`
