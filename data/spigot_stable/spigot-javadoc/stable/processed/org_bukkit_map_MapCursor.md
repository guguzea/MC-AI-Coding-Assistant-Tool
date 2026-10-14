---
title: "org.bukkit.map.MapCursor"
package: "org.bukkit.map"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/map/MapCursor.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class MapCursor**
`public final class MapCursor extends Object`
- `@Deprecated(since="1.6.2") public MapCursor(byte x, byte y, byte direction, byte type, boolean visible)`
- `public MapCursor(byte x, byte y, byte direction, @NotNull MapCursor.Type type, boolean visible)`
- `@Deprecated(since="1.13") public MapCursor(byte x, byte y, byte direction, byte type, boolean visible, @Nullable String caption)`
- `public MapCursor(byte x, byte y, byte direction, @NotNull MapCursor.Type type, boolean visible, @Nullable String caption)`
- `public byte getX()`
- `public byte getY()`
- `public byte getDirection()`
- `@NotNull public MapCursor.Type getType()`
- `@Deprecated(since="1.6.2") public byte getRawType()`
- `public boolean isVisible()`
- `public void setX(byte x)`
- `public void setY(byte y)`
- `public void setDirection(byte direction)`
- `public void setType(@NotNull MapCursor.Type type)`
- `@Deprecated(since="1.6.2") public void setRawType(byte type)`
- `public void setVisible(boolean visible)`
- `@Nullable public String getCaption()`
- `public void setCaption(@Nullable String caption)`
