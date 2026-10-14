---
title: "io.papermc.paper.datacomponent.item.SignText"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/SignText.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SignText**
`@NonExtendable public interface SignText extends BuildableDataComponent<SignText, SignText.Builder>`
- `@Contract(value="_ -> new", pure=true) static SignText signText(List<? extends ComponentLike> lines)`
- `@Contract(value="-> new", pure=true) static SignText.Builder signText()`
- `@Contract(pure=true) List<Component> lines()`
- `@Contract(pure=true) DyeColor color()`
- `@Contract(pure=true) boolean hasGlowingText()`
