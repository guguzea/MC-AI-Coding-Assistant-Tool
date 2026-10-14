---
title: "org.bukkit.map.MapCanvas"
package: "org.bukkit.map"
source: https://jd.papermc.io/paper/26.3/org/bukkit/map/MapCanvas.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface MapCanvas**
`public interface MapCanvas`
- `@NotNull @NotNull MapView getMapView()`
- `@NotNull @NotNull MapCursorCollection getCursors()`
- `void setCursors(@NotNull @NotNull MapCursorCollection cursors)`
- `void setPixelColor(int x, int y, @Nullable @Nullable Color color)`
- `@Nullable @Nullable Color getPixelColor(int x, int y)`
- `@NotNull @NotNull Color getBasePixelColor(int x, int y)`
- `@Deprecated(since="1.20.5") void setPixel(int x, int y, byte color)`
- `@Deprecated(since="1.19", forRemoval=true) byte getPixel(int x, int y)`
- `@Deprecated(since="1.19", forRemoval=true) byte getBasePixel(int x, int y)`
- `void drawImage(int x, int y, @NotNull @NotNull Image image)`
- `void drawText(int x, int y, @NotNull @NotNull MapFont font, @NotNull @NotNull String text)`
