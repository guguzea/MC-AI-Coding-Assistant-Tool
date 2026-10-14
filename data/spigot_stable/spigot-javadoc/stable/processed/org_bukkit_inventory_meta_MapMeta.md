---
title: "org.bukkit.inventory.meta.MapMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/MapMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface MapMeta**
`public interface MapMeta extends ItemMeta`
- `@Deprecated(since="1.13.2") boolean hasMapId()`
- `@Deprecated(since="1.13.2") int getMapId()`
- `@Deprecated(since="1.13.2") void setMapId(int id)`
- `boolean hasMapView()`
- `@Nullable MapView getMapView()`
- `void setMapView(MapView map)`
- `boolean isScaling()`
- `void setScaling(boolean value)`
- `@Deprecated(since="1.19.4") boolean hasLocationName()`
- `@Deprecated(since="1.19.4") @Nullable String getLocationName()`
- `@Deprecated(since="1.19.4") void setLocationName(@Nullable String name)`
- `@Deprecated(since="26.3") boolean hasColor()`
- `@Nullable @Deprecated(since="26.3") Color getColor()`
- `@Deprecated(since="26.3") void setColor(@Nullable Color color)`
- `@NotNull MapMeta clone()`
