---
title: "org.bukkit.metadata.Metadatable"
package: "org.bukkit.metadata"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/metadata/Metadatable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Metadatable**
`public interface Metadatable`
- `void setMetadata(@NotNull String metadataKey, @NotNull MetadataValue newMetadataValue)`
- `@NotNull List<MetadataValue> getMetadata(@NotNull String metadataKey)`
- `boolean hasMetadata(@NotNull String metadataKey)`
- `void removeMetadata(@NotNull String metadataKey, @NotNull Plugin owningPlugin)`
