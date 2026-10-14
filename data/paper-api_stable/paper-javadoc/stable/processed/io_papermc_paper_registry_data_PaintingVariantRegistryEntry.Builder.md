---
title: "io.papermc.paper.registry.data.PaintingVariantRegistryEntry.Builder"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/PaintingVariantRegistryEntry.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PaintingVariantRegistryEntry.Builder**
`@NonExtendable public static interface PaintingVariantRegistryEntry.Builder extends PaintingVariantRegistryEntry, RegistryBuilder<Art>`
- `@Contract(value="_ -> this", mutates="this") PaintingVariantRegistryEntry.Builder width(@Range(from=1L,to=16L) int width)`
- `@Contract(value="_ -> this", mutates="this") PaintingVariantRegistryEntry.Builder height(@Range(from=1L,to=16L) int height)`
- `@Contract(value="_ -> this", mutates="this") PaintingVariantRegistryEntry.Builder title(@Nullable Component title)`
- `@Contract(value="_ -> this", mutates="this") PaintingVariantRegistryEntry.Builder author(@Nullable Component author)`
- `@Contract(value="_ -> this", mutates="this") PaintingVariantRegistryEntry.Builder assetId(Key assetId)`
