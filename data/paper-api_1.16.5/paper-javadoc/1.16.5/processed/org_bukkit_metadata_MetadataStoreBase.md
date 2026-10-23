---
title: "org.bukkit.metadata.MetadataStoreBase"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/metadata/MetadataStoreBase.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public MetadataStoreBase()`
- `public void setMetadata&#8203;(@NotNull T subject, @NotNull @NotNull String metadataKey, @NotNull @NotNull MetadataValue newMetadataValue)`
- `@NotNull public @NotNull List<MetadataValue> getMetadata&#8203;(@NotNull T subject, @NotNull @NotNull String metadataKey)`
- `public boolean hasMetadata&#8203;(@NotNull T subject, @NotNull @NotNull String metadataKey)`
- `public void removeMetadata&#8203;(@NotNull T subject, @NotNull @NotNull String metadataKey, @NotNull @NotNull Plugin owningPlugin)`
- `public void invalidateAll&#8203;(@NotNull @NotNull Plugin owningPlugin)`
- `public void removeAll&#8203;(@NotNull @NotNull Plugin owningPlugin)`
- `@NotNull protected abstract @NotNull String disambiguate&#8203;(@NotNull T subject, @NotNull @NotNull String metadataKey)`
