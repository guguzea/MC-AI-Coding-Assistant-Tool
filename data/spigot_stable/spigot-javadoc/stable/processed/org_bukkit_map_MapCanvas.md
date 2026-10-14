---
title: "org.bukkit.map.MapCanvas"
package: "org.bukkit.map"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/map/MapCanvas.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface MapCanvas**
`public interface MapCanvas`
- `@NotNull MapView getMapView()`
- `@NotNull MapCursorCollection getCursors()`
- `void setCursors(@NotNull MapCursorCollection cursors)`
- `void setPixelColor(int x, int y, @Nullable Color color)`
- `@Nullable Color getPixelColor(int x, int y)`
- `@NotNull Color getBasePixelColor(int x, int y)`
- `@Deprecated(since="1.20.5") void setPixel(int x, int y, byte color)`
- `@Deprecated(since="1.19") byte getPixel(int x, int y)`
- `@Deprecated(since="1.19") byte getBasePixel(int x, int y)`
- `void drawImage(int x, int y, @NotNull Image image)`
- `void drawText(int x, int y, @NotNull MapFont font, @NotNull String text)`
