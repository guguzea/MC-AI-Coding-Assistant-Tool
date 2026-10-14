---
title: "org.bukkit.metadata.Metadatable"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/26.3/org/bukkit/metadata/Metadatable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Metadatable**
`@Deprecated public interface Metadatable`
- `void setMetadata(@NotNull @NotNull String metadataKey, @NotNull @NotNull MetadataValue newMetadataValue)`
- `@NotNull @NotNull List<MetadataValue> getMetadata(@NotNull @NotNull String metadataKey)`
- `boolean hasMetadata(@NotNull @NotNull String metadataKey)`
- `void removeMetadata(@NotNull @NotNull String metadataKey, @NotNull @NotNull Plugin owningPlugin)`
