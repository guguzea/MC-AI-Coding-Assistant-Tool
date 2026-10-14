---
title: "org.bukkit.metadata.MetadataStoreBase"
package: "org.bukkit.metadata"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/metadata/MetadataStoreBase.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class MetadataStoreBase<T>**
`public abstract class MetadataStoreBase<T> extends Object`
- `public MetadataStoreBase()`
- `public void setMetadata(@NotNull T subject, @NotNull String metadataKey, @NotNull MetadataValue newMetadataValue)`
- `@NotNull public List<MetadataValue> getMetadata(@NotNull T subject, @NotNull String metadataKey)`
- `public boolean hasMetadata(@NotNull T subject, @NotNull String metadataKey)`
- `public void removeMetadata(@NotNull T subject, @NotNull String metadataKey, @NotNull Plugin owningPlugin)`
- `public void invalidateAll(@NotNull Plugin owningPlugin)`
- `@NotNull protected abstract String disambiguate(@NotNull T subject, @NotNull String metadataKey)`
