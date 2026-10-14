---
title: "io.papermc.paper.datapack.DiscoveredDatapack"
package: "io.papermc.paper.datapack"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datapack/DiscoveredDatapack.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DiscoveredDatapack**
`@NullMarked @NonExtendable public interface DiscoveredDatapack`
- `@Contract(pure=true) String getName()`
- `Component getTitle()`
- `Component getDescription()`
- `boolean isRequired()`
- `Datapack.Compatibility getCompatibility()`
- `@Unmodifiable Set<FeatureFlag> getRequiredFeatures()`
- `DatapackSource getSource()`
