---
title: "io.papermc.paper.datapack.DatapackRegistrar.Configurer"
package: "io.papermc.paper.datapack"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datapack/DatapackRegistrar.Configurer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DatapackRegistrar.Configurer**
`@NonExtendable public static interface DatapackRegistrar.Configurer`
- `@Contract(value="_ -> this", mutates="this") DatapackRegistrar.Configurer title(Component title)`
- `@Contract(value="_ -> this", mutates="this") DatapackRegistrar.Configurer autoEnableOnServerStart(boolean autoEnableOnServerStart)`
- `@Contract(value="_, _ -> this", mutates="this") DatapackRegistrar.Configurer position(boolean fixed, Datapack.Position position)`
