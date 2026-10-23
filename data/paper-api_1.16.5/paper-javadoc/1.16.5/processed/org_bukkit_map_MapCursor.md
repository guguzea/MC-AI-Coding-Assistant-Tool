---
title: "org.bukkit.map.MapCursor"
package: "org.bukkit.map"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/map/MapCursor.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public MapCursor&#8203;(byte x, byte y, byte direction, byte type, boolean visible)`
- `public MapCursor&#8203;(byte x, byte y, byte direction, @NotNull @NotNull MapCursor.Type type, boolean visible)`
- `@Deprecated public MapCursor&#8203;(byte x, byte y, byte direction, byte type, boolean visible, @Nullable @Nullable String caption)`
- `@Deprecated public MapCursor&#8203;(byte x, byte y, byte direction, byte type, boolean visible, @Nullable Component caption)`
- `public MapCursor&#8203;(byte x, byte y, byte direction, @NotNull @NotNull MapCursor.Type type, boolean visible, @Nullable Component caption)`
- `public MapCursor&#8203;(byte x, byte y, byte direction, @NotNull @NotNull MapCursor.Type type, boolean visible, @Nullable @Nullable String caption)`
- `public byte getX()`
- `public byte getY()`
- `public byte getDirection()`
- `@NotNull public @NotNull MapCursor.Type getType()`
- `@Deprecated public byte getRawType()`
- `public boolean isVisible()`
- `public void setX&#8203;(byte x)`
- `public void setY&#8203;(byte y)`
- `public void setDirection&#8203;(byte direction)`
- `public void setType&#8203;(@NotNull @NotNull MapCursor.Type type)`
- `@Deprecated public void setRawType&#8203;(byte type)`
- `public void setVisible&#8203;(boolean visible)`
- `@Nullable public Component caption()`
- `public void caption&#8203;(@Nullable Component caption)`
- `@Nullable @Deprecated public @Nullable String getCaption()`
- `@Deprecated public void setCaption&#8203;(@Nullable @Nullable String caption)`
