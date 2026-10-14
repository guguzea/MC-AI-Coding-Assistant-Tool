---
title: "org.bukkit.block.Banner"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/Banner.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Banner**
`public interface Banner extends TileState, Nameable`
- `@NotNull @NotNull DyeColor getBaseColor()`
- `void setBaseColor(@NotNull @NotNull DyeColor color)`
- `@NotNull @NotNull List<Pattern> getPatterns()`
- `void setPatterns(@NotNull @NotNull List<Pattern> patterns)`
- `void addPattern(@NotNull @NotNull Pattern pattern)`
- `@NotNull @NotNull Pattern getPattern(int i)`
- `@NotNull @NotNull Pattern removePattern(int i)`
- `void setPattern(int i, @NotNull @NotNull Pattern pattern)`
- `int numberOfPatterns()`
