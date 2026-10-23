---
title: "org.bukkit.map.MapCursor"
package: "org.bukkit.map"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/map/MapCursor.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public MapCursor(byte x, byte y, byte direction, byte type, boolean visible)`
- `public MapCursor(byte x, byte y, byte direction, @NotNull @NotNull MapCursor.Type type, boolean visible)`
- `@Deprecated public MapCursor(byte x, byte y, byte direction, byte type, boolean visible, @Nullable @Nullable String caption)`
- `@Deprecated public MapCursor(byte x, byte y, byte direction, byte type, boolean visible, @Nullable Component caption)`
- `public MapCursor(byte x, byte y, byte direction, @NotNull @NotNull MapCursor.Type type, boolean visible, @Nullable Component caption)`
- `public MapCursor(byte x, byte y, byte direction, @NotNull @NotNull MapCursor.Type type, boolean visible, @Nullable @Nullable String caption)`
- `public byte getX()`
- `public byte getY()`
- `public byte getDirection()`
- `@NotNull public @NotNull MapCursor.Type getType()`
- `@Deprecated public byte getRawType()`
- `public boolean isVisible()`
- `public void setX(byte x)`
- `public void setY(byte y)`
- `public void setDirection(byte direction)`
- `public void setType(@NotNull @NotNull MapCursor.Type type)`
- `@Deprecated public void setRawType(byte type)`
- `public void setVisible(boolean visible)`
- `public @Nullable Component caption()`
- `public void caption(@Nullable Component caption)`
- `@Nullable @Deprecated public @Nullable String getCaption()`
- `@Deprecated public void setCaption(@Nullable @Nullable String caption)`
