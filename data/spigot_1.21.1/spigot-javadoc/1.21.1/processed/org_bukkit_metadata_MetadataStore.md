---
title: "org.bukkit.metadata.MetadataStore"
package: "org.bukkit.metadata"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.metadata.MetadataStore<T>`
- `public abstract void setMetadata(T, java.lang.String, org.bukkit.metadata.MetadataValue)`
- `public abstract java.util.List<org.bukkit.metadata.MetadataValue> getMetadata(T, java.lang.String)`
- `public abstract boolean hasMetadata(T, java.lang.String)`
- `public abstract void removeMetadata(T, java.lang.String, org.bukkit.plugin.Plugin)`
- `public abstract void invalidateAll(org.bukkit.plugin.Plugin)`
