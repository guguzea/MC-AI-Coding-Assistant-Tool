---
title: "org.bukkit.inventory.meta.MapMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/MapMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface MapMeta**
`public interface MapMeta extends ItemMeta`
- `boolean hasMapId()`
- `int getMapId()`
- `@Deprecated(since="1.13.2") void setMapId(int id)`
- `boolean hasMapView()`
- `@Nullable @Nullable MapView getMapView()`
- `void setMapView(@UndefinedNullability("implementation defined") MapView map)`
- `boolean isScaling()`
- `void setScaling(boolean value)`
- `@Deprecated(since="1.19.4") default boolean hasLocationName()`
- `@Deprecated(since="1.19.4") @Nullable default @Nullable String getLocationName()`
- `@Deprecated(since="1.19.4") default void setLocationName(@Nullable @Nullable String name)`
- `@Deprecated(since="26.3") @Contract("-> false") default boolean hasColor()`
- `@Deprecated(since="26.3") @Contract("-> null") @Nullable default @Nullable Color getColor()`
- `@Deprecated(since="26.3") default void setColor(@Nullable @Nullable Color color)`
- `@NotNull @NotNull MapMeta clone()`
