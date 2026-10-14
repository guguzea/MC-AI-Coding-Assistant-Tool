---
title: "org.bukkit.inventory.meta.BannerMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/BannerMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BannerMeta**
`public interface BannerMeta extends ItemMeta`
- `@NotNull List<Pattern> getPatterns()`
- `void setPatterns(@NotNull List<Pattern> patterns)`
- `void addPattern(@NotNull Pattern pattern)`
- `@NotNull Pattern getPattern(int i)`
- `@NotNull Pattern removePattern(int i)`
- `void setPattern(int i, @NotNull Pattern pattern)`
- `int numberOfPatterns()`
