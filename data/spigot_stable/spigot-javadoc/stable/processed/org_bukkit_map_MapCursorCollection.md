---
title: "org.bukkit.map.MapCursorCollection"
package: "org.bukkit.map"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/map/MapCursorCollection.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class MapCursorCollection**
`public final class MapCursorCollection extends Object`
- `public MapCursorCollection()`
- `public int size()`
- `@NotNull public MapCursor getCursor(int index)`
- `public boolean removeCursor(@NotNull MapCursor cursor)`
- `@NotNull public MapCursor addCursor(@NotNull MapCursor cursor)`
- `@NotNull public MapCursor addCursor(int x, int y, byte direction)`
- `@Deprecated(since="1.6.2") @NotNull public MapCursor addCursor(int x, int y, byte direction, byte type)`
- `@Deprecated(since="1.6.2") @NotNull public MapCursor addCursor(int x, int y, byte direction, byte type, boolean visible)`
- `@Deprecated(since="1.13") @NotNull public MapCursor addCursor(int x, int y, byte direction, byte type, boolean visible, @Nullable String caption)`
