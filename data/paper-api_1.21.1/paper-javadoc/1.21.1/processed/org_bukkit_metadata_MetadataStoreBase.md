---
title: "org.bukkit.metadata.MetadataStoreBase"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/metadata/MetadataStoreBase.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public MetadataStoreBase()`
- `public void setMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey, @NotNull @NotNull MetadataValue newMetadataValue)`
- `@NotNull public @NotNull List<MetadataValue> getMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey)`
- `public boolean hasMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey)`
- `public void removeMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey, @NotNull @NotNull Plugin owningPlugin)`
- `public void invalidateAll(@NotNull @NotNull Plugin owningPlugin)`
- `public void removeAll(@NotNull @NotNull Plugin owningPlugin)`
- `@NotNull protected abstract @NotNull String disambiguate(@NotNull T subject, @NotNull @NotNull String metadataKey)`
