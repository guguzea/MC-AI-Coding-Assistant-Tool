---
title: "io.papermc.paper.datacomponent.item.UseCooldown"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/UseCooldown.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface UseCooldown**
`@NonExtendable public interface UseCooldown`
- `@Contract(value="_ -> new", pure=true) static UseCooldown.Builder useCooldown(@Positive float seconds)`
- `@Contract(pure=true) @Positive float seconds()`
- `@Contract(pure=true) @Nullable Key cooldownGroup()`
