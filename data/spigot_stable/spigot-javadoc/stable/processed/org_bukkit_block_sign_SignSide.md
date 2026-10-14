---
title: "org.bukkit.block.sign.SignSide"
package: "org.bukkit.block.sign"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/sign/SignSide.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface SignSide**
`public interface SignSide extends Colorable`
- `@NotNull String[] getLines()`
- `@NotNull String getLine(int index) throws IndexOutOfBoundsException`
- `void setLine(int index, @NotNull String line) throws IndexOutOfBoundsException`
- `boolean isGlowingText()`
- `void setGlowingText(boolean glowing)`
