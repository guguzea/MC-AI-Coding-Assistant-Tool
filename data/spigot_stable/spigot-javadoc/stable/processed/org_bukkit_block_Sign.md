---
title: "org.bukkit.block.Sign"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Sign.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Sign**
`public interface Sign extends TileState, Colorable`
- `@Deprecated(since="1.20") @NotNull String[] getLines()`
- `@Deprecated(since="1.20") @NotNull String getLine(int index) throws IndexOutOfBoundsException`
- `@Deprecated(since="1.20") void setLine(int index, @NotNull String line) throws IndexOutOfBoundsException`
- `@Deprecated(since="1.20.1") boolean isEditable()`
- `@Deprecated(since="1.20.1") void setEditable(boolean editable)`
- `boolean isWaxed()`
- `void setWaxed(boolean waxed)`
- `@Deprecated(since="1.20") boolean isGlowingText()`
- `@Deprecated(since="1.20") void setGlowingText(boolean glowing)`
- `@NotNull @Deprecated(since="1.20") DyeColor getColor()`
- `@Deprecated(since="1.20") void setColor(@NotNull DyeColor color)`
- `@NotNull SignSide getSide(@NotNull Side side)`
- `@NotNull SignSide getTargetSide(@NotNull Player player)`
- `@Nullable Player getAllowedEditor()`
