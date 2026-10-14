---
title: "org.bukkit.generator.WorldInfo"
package: "org.bukkit.generator"
source: https://jd.papermc.io/paper/26.3/org/bukkit/generator/WorldInfo.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface WorldInfo**
`public interface WorldInfo extends FeatureFlagSetHolder, Keyed`
- `@Obsolete @NotNull @NotNull String getName()`
- `@NotNull @NotNull UUID getUID()`
- `@NotNull World.Environment getEnvironment()`
- `long getSeed()`
- `int getMinHeight()`
- `int getMaxHeight()`
- `@NotNull @NotNull BiomeProvider vanillaBiomeProvider()`
