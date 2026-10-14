---
title: "org.bukkit.scoreboard.Objective"
package: "org.bukkit.scoreboard"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/scoreboard/Objective.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Objective**
`public interface Objective`
- `@NotNull String getName()`
- `@NotNull String getDisplayName()`
- `void setDisplayName(@NotNull String displayName)`
- `@Deprecated(since="1.19.2") @NotNull String getCriteria()`
- `@NotNull Criteria getTrackedCriteria()`
- `boolean isModifiable()`
- `@Nullable Scoreboard getScoreboard()`
- `void unregister()`
- `void setDisplaySlot(@Nullable DisplaySlot slot)`
- `@Nullable DisplaySlot getDisplaySlot()`
- `void setRenderType(@NotNull RenderType renderType)`
- `@NotNull RenderType getRenderType()`
- `@Deprecated(since="1.7.8") @NotNull Score getScore(@NotNull OfflinePlayer player)`
- `@NotNull Score getScore(@NotNull String entry)`
