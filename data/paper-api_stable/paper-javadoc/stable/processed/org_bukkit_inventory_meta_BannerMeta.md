---
title: "org.bukkit.inventory.meta.BannerMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/BannerMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BannerMeta**
`public interface BannerMeta extends ItemMeta`
- `@NotNull @NotNull List<Pattern> getPatterns()`
- `void setPatterns(@NotNull @NotNull List<Pattern> patterns)`
- `void addPattern(@NotNull @NotNull Pattern pattern)`
- `@NotNull @NotNull Pattern getPattern(int i)`
- `@NotNull @NotNull Pattern removePattern(int i)`
- `void setPattern(int i, @NotNull @NotNull Pattern pattern)`
- `int numberOfPatterns()`
