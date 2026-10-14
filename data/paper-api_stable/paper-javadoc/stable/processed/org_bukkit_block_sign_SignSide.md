---
title: "org.bukkit.block.sign.SignSide"
package: "org.bukkit.block.sign"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/sign/SignSide.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SignSide**
`public interface SignSide extends Colorable`
- `@NotNull List<Component> lines()`
- `@NotNull Component line(int index) throws IndexOutOfBoundsException`
- `void line(int index, @NotNull Component line) throws IndexOutOfBoundsException`
- `@NotNull @Deprecated @NotNull String[] getLines()`
- `@NotNull @Deprecated @NotNull String getLine(int index) throws IndexOutOfBoundsException`
- `@Deprecated void setLine(int index, @NotNull @NotNull String line) throws IndexOutOfBoundsException`
- `boolean isGlowingText()`
- `void setGlowingText(boolean glowing)`
