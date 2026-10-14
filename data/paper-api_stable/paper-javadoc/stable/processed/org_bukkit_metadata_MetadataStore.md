---
title: "org.bukkit.metadata.MetadataStore"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/26.3/org/bukkit/metadata/MetadataStore.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface MetadataStore<T>**
`@Deprecated public interface MetadataStore<T>`
- `void setMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey, @NotNull @NotNull MetadataValue newMetadataValue)`
- `@NotNull @NotNull List<MetadataValue> getMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey)`
- `boolean hasMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey)`
- `void removeMetadata(@NotNull T subject, @NotNull @NotNull String metadataKey, @NotNull @NotNull Plugin owningPlugin)`
- `void invalidateAll(@NotNull @NotNull Plugin owningPlugin)`
