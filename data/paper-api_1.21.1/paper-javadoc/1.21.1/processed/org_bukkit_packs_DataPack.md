---
title: "org.bukkit.packs.DataPack"
package: "org.bukkit.packs"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/packs/DataPack.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull String getTitle()`
- `@NotNull @NotNull String getDescription()`
- `int getPackFormat()`
- `int getMinSupportedPackFormat()`
- `int getMaxSupportedPackFormat()`
- `boolean isEnabled()`
- `boolean isRequired()`
- `@NotNull @NotNull DataPack.Compatibility getCompatibility()`
- `@NotNull @NotNull Set<FeatureFlag> getRequestedFeatures()`
- `@NotNull @NotNull DataPack.Source getSource()`
