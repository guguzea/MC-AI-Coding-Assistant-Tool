---
title: "org.bukkit.map.MapCanvas"
package: "org.bukkit.map"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/map/MapCanvas.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull MapView getMapView()`
- `@NotNull @NotNull MapCursorCollection getCursors()`
- `void setCursors(@NotNull @NotNull MapCursorCollection cursors)`
- `void setPixelColor(int x, int y, @Nullable @Nullable Color color)`
- `@Nullable @Nullable Color getPixelColor(int x, int y)`
- `@NotNull @NotNull Color getBasePixelColor(int x, int y)`
- `void setPixel(int x, int y, byte color)`
- `@Deprecated byte getPixel(int x, int y)`
- `@Deprecated byte getBasePixel(int x, int y)`
- `void drawImage(int x, int y, @NotNull @NotNull Image image)`
- `void drawText(int x, int y, @NotNull @NotNull MapFont font, @NotNull @NotNull String text)`
