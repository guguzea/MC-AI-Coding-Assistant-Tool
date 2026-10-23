---
title: "org.bukkit.map.MapCursorCollection"
package: "org.bukkit.map"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/map/MapCursorCollection.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public MapCursorCollection()`
- `public int size()`
- `@NotNull public @NotNull MapCursor getCursor(int index)`
- `public boolean removeCursor(@NotNull @NotNull MapCursor cursor)`
- `@NotNull public @NotNull MapCursor addCursor(@NotNull @NotNull MapCursor cursor)`
- `@NotNull public @NotNull MapCursor addCursor(int x, int y, byte direction)`
- `@Deprecated @NotNull public @NotNull MapCursor addCursor(int x, int y, byte direction, byte type)`
- `@Deprecated @NotNull public @NotNull MapCursor addCursor(int x, int y, byte direction, byte type, boolean visible)`
- `@Deprecated @NotNull public @NotNull MapCursor addCursor(int x, int y, byte direction, byte type, boolean visible, @Nullable @Nullable String caption)`
- `@Deprecated @NotNull public @NotNull MapCursor addCursor(int x, int y, byte direction, byte type, boolean visible, @Nullable Component caption)`
