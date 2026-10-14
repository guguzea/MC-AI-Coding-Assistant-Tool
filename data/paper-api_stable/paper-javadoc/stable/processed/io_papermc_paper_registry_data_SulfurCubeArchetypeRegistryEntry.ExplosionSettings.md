---
title: "io.papermc.paper.registry.data.SulfurCubeArchetypeRegistryEntry.ExplosionSettings"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/SulfurCubeArchetypeRegistryEntry.ExplosionSettings.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SulfurCubeArchetypeRegistryEntry.ExplosionSettings**
`@NonExtendable public static interface SulfurCubeArchetypeRegistryEntry.ExplosionSettings`
- `@NonNegative int power()`
- `boolean incendiary()`
- `@Positive int fuseTicks()`
- `@Contract(value="_, _, _ -> new", pure=true) static SulfurCubeArchetypeRegistryEntry.ExplosionSettings of(@NonNegative int power, boolean incendiary, @Positive int fuseTicks)`
