---
title: "org.bukkit.metadata.MetadataStore"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/metadata/MetadataStore.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `void setMetadata&#8203;(@NotNull T subject, @NotNull @NotNull String metadataKey, @NotNull @NotNull MetadataValue newMetadataValue)`
- `@NotNull @NotNull List<MetadataValue> getMetadata&#8203;(@NotNull T subject, @NotNull @NotNull String metadataKey)`
- `boolean hasMetadata&#8203;(@NotNull T subject, @NotNull @NotNull String metadataKey)`
- `void removeMetadata&#8203;(@NotNull T subject, @NotNull @NotNull String metadataKey, @NotNull @NotNull Plugin owningPlugin)`
- `void invalidateAll&#8203;(@NotNull @NotNull Plugin owningPlugin)`
