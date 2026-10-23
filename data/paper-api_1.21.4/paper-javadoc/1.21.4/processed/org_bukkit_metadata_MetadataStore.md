---
title: "org.bukkit.metadata.MetadataStore"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/metadata/MetadataStore.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `void setMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey, @NotNull @NotNull MetadataValue newMetadataValue)`
- `@NotNull @NotNull List<MetadataValue> getMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey)`
- `boolean hasMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey)`
- `void removeMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey, @NotNull @NotNull Plugin owningPlugin)`
- `void invalidateAll(@NotNull @NotNull Plugin owningPlugin)`
