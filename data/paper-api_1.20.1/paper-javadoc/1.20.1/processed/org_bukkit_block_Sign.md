---
title: "org.bukkit.block.Sign"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/block/Sign.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@NotNull List<Component> lines()`
- `@NotNull @Deprecated Component line(int index) throws IndexOutOfBoundsException`
- `@Deprecated void line(int index, @NotNull Component line) throws IndexOutOfBoundsException`
- `@Deprecated @NotNull @NotNull String[] getLines()`
- `@Deprecated @NotNull @NotNull String getLine(int index) throws IndexOutOfBoundsException`
- `@Deprecated void setLine(int index, @NotNull @NotNull String line) throws IndexOutOfBoundsException`
- `@Deprecated boolean isEditable()`
- `@Deprecated void setEditable(boolean editable)`
- `boolean isWaxed()`
- `void setWaxed(boolean waxed)`
- `@Deprecated boolean isGlowingText()`
- `@Deprecated void setGlowingText(boolean glowing)`
- `@NotNull @Deprecated @NotNull DyeColor getColor()`
- `@Deprecated void setColor(@NotNull @NotNull DyeColor color)`
- `@NotNull @NotNull SignSide getSide(@NotNull @NotNull Side side)`
- `@NotNull default @NotNull Side getInteractableSideFor(@NotNull Entity entity)`
- `@NotNull default @NotNull Side getInteractableSideFor(@NotNull Position position)`
- `@NotNull @NotNull Side getInteractableSideFor(double x, double z)`
