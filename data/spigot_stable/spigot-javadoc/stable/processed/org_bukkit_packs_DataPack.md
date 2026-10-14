---
title: "org.bukkit.packs.DataPack"
package: "org.bukkit.packs"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/packs/DataPack.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface DataPack**
`public interface DataPack extends Keyed`
- `@NotNull String getTitle()`
- `@NotNull String getDescription()`
- `@Deprecated(since="1.21.9") int getPackFormat()`
- `@Deprecated(since="1.21.9") int getMinSupportedPackFormat()`
- `@Deprecated(since="1.21.9") int getMaxSupportedPackFormat()`
- `@NotNull DataPackFormat getMinSupportedFormat()`
- `@NotNull DataPackFormat getMaxSupportedFormat()`
- `boolean isEnabled()`
- `boolean isRequired()`
- `@NotNull DataPack.Compatibility getCompatibility()`
- `@NotNull Set<FeatureFlag> getRequestedFeatures()`
- `@NotNull DataPack.Source getSource()`
