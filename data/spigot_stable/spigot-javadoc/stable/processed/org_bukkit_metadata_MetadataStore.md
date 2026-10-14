---
title: "org.bukkit.metadata.MetadataStore"
package: "org.bukkit.metadata"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/metadata/MetadataStore.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface MetadataStore<T>**
`public interface MetadataStore<T>`
- `void setMetadata(@NotNull T subject, @NotNull String metadataKey, @NotNull MetadataValue newMetadataValue)`
- `@NotNull List<MetadataValue> getMetadata(@NotNull T subject, @NotNull String metadataKey)`
- `boolean hasMetadata(@NotNull T subject, @NotNull String metadataKey)`
- `void removeMetadata(@NotNull T subject, @NotNull String metadataKey, @NotNull Plugin owningPlugin)`
- `void invalidateAll(@NotNull Plugin owningPlugin)`
