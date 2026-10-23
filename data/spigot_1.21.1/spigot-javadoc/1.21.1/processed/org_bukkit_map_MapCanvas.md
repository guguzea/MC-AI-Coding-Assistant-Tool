---
title: "org.bukkit.map.MapCanvas"
package: "org.bukkit.map"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.map.MapCanvas`
- `public abstract org.bukkit.map.MapView getMapView()`
- `public abstract org.bukkit.map.MapCursorCollection getCursors()`
- `public abstract void setCursors(org.bukkit.map.MapCursorCollection)`
- `public abstract void setPixelColor(int, int, java.awt.Color)`
- `public abstract java.awt.Color getPixelColor(int, int)`
- `public abstract java.awt.Color getBasePixelColor(int, int)`
- `public abstract void setPixel(int, int, byte)`
- `public abstract byte getPixel(int, int)`
- `public abstract byte getBasePixel(int, int)`
- `public abstract void drawImage(int, int, java.awt.Image)`
- `public abstract void drawText(int, int, org.bukkit.map.MapFont, java.lang.String)`
