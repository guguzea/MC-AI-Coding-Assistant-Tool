---
title: "io.papermc.paper.raytracing.PositionedRayTraceConfigurationBuilder"
package: "io.papermc.paper.raytracing"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/raytracing/PositionedRayTraceConfigurationBuilder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder start(Location start)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder direction(Vector direction)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder maxDistance(@org.checkerframework.checker.index.qual.NonNegative double maxDistance)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder fluidCollisionMode(FluidCollisionMode fluidCollisionMode)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder ignorePassableBlocks(boolean ignorePassableBlocks)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder raySize(@org.checkerframework.checker.index.qual.NonNegative double raySize)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder entityFilter(Predicate<? super Entity> entityFilter)`
- `@Contract(value="_ -> this", mutates="this") PositionedRayTraceConfigurationBuilder blockFilter(Predicate<? super Block> blockFilter)`
- `@Contract(value="_, _ -> this", mutates="this") PositionedRayTraceConfigurationBuilder targets(RayTraceTarget first, RayTraceTarget... others)`
