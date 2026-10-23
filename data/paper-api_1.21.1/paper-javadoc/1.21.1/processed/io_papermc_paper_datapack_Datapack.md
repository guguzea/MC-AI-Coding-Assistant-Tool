---
title: "io.papermc.paper.datapack.Datapack"
package: "io.papermc.paper.datapack"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/datapack/Datapack.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Contract(pure=true) String getName()`
- `Component getTitle()`
- `Component getDescription()`
- `boolean isRequired()`
- `Datapack.Compatibility getCompatibility()`
- `@Unmodifiable Set<FeatureFlag> getRequiredFeatures()`
- `boolean isEnabled()`
- `void setEnabled(boolean enabled)`
- `DatapackSource getSource()`
- `@Contract(pure=true, value="-> new") Component computeDisplayName()`
