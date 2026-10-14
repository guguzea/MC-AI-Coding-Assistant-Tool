---
title: "io.papermc.paper.datacomponent.item.MapDecorations"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/MapDecorations.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface MapDecorations**
`@NonExtendable public interface MapDecorations`
- `@Contract(value="_ -> new", pure=true) static MapDecorations mapDecorations(Map<String, MapDecorations.DecorationEntry> entries)`
- `@Contract(value="-> new", pure=true) static MapDecorations.Builder mapDecorations()`
- `@Contract(value="_, _, _, _ -> new", pure=true) static MapDecorations.DecorationEntry decorationEntry(MapCursor.Type type, double x, double z, float rotation)`
- `@Contract(pure=true) @Nullable MapDecorations.DecorationEntry decoration(String id)`
- `@Contract(pure=true) @Unmodifiable Map<String, MapDecorations.DecorationEntry> decorations()`
