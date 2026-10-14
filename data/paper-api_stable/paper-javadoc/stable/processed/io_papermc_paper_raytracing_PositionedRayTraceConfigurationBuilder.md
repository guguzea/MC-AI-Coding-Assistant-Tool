---
title: "io.papermc.paper.raytracing.PositionedRayTraceConfigurationBuilder"
package: "io.papermc.paper.raytracing"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/raytracing/PositionedRayTraceConfigurationBuilder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PositionedRayTraceConfigurationBuilder**
`@NullMarked public interface PositionedRayTraceConfigurationBuilder`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder start(Location start)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder direction(Vector direction)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder maxDistance(@NonNegative double maxDistance)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder fluidCollisionMode(FluidCollisionMode fluidCollisionMode)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder blockCollisionMode(BlockCollisionMode blockCollisionMode)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder ignorePassableBlocks(boolean ignorePassableBlocks)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder raySize(@NonNegative double raySize)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder entityFilter(Predicate<? super Entity> entityFilter)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder blockFilter(Predicate<? super Block> blockFilter)`
- `@Contract(value="_, _ -> this", mutates="this") PositionedRayTraceConfigurationBuilder targets(RayTraceTarget first, RayTraceTarget... others)`
