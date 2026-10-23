---
title: "org.bukkit.map.MapCanvas"
package: "org.bukkit.map"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/map/MapCanvas.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull MapView getMapView()`
- `@NotNull @NotNull MapCursorCollection getCursors()`
- `void setCursors(@NotNull @NotNull MapCursorCollection cursors)`
- `void setPixelColor(int x, int y, @Nullable @Nullable Color color)`
- `@Nullable @Nullable Color getPixelColor(int x, int y)`
- `@NotNull @NotNull Color getBasePixelColor(int x, int y)`
- `@Deprecated void setPixel(int x, int y, byte color)`
- `@Deprecated(forRemoval=true, since="1.20.2") byte getPixel(int x, int y)`
- `@Deprecated(forRemoval=true, since="1.20.2") byte getBasePixel(int x, int y)`
- `void drawImage(int x, int y, @NotNull @NotNull Image image)`
- `void drawText(int x, int y, @NotNull @NotNull MapFont font, @NotNull @NotNull String text)`
