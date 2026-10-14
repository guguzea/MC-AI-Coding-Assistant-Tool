---
title: "io.papermc.paper.datacomponent.item.SignText.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/SignText.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SignText.Builder**
`@NonExtendable public static interface SignText.Builder extends DataComponentBuilder<SignText>`
- `@Contract(value="_ -> this", mutates="this") SignText.Builder lines(List<? extends ComponentLike> lines)`
- `@Contract(value="_, _ -> this", mutates="this") SignText.Builder line(int index, ComponentLike line)`
- `@Contract(value="_ -> this", mutates="this") SignText.Builder color(DyeColor color)`
- `@Contract(value="_ -> this", mutates="this") SignText.Builder hasGlowingText(boolean hasGlowingText)`
