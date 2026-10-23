---
title: "org.bukkit.metadata.MetadataStore"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/metadata/MetadataStore.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `List<MetadataValue> getMetadata(T subject, String metadataKey)`
- `boolean hasMetadata(T subject, String metadataKey)`
- `void invalidateAll(Plugin owningPlugin)`
- `void removeMetadata(T subject, String metadataKey, Plugin owningPlugin)`
- `void setMetadata(T subject, String metadataKey, MetadataValue newMetadataValue)`
