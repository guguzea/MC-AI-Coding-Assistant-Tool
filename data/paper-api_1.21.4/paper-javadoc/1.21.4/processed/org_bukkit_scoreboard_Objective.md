---
title: "org.bukkit.scoreboard.Objective"
package: "org.bukkit.scoreboard"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/scoreboard/Objective.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull String getName()`
- `@NotNull Component displayName()`
- `void displayName(@Nullable Component displayName)`
- `@NotNull @Deprecated @NotNull String getDisplayName()`
- `@Deprecated void setDisplayName(@NotNull @NotNull String displayName)`
- `@Deprecated(since="1.19.2") @NotNull @NotNull String getCriteria()`
- `@NotNull @NotNull Criteria getTrackedCriteria()`
- `boolean isModifiable()`
- `@Nullable @Nullable Scoreboard getScoreboard()`
- `void unregister()`
- `void setDisplaySlot(@Nullable @Nullable DisplaySlot slot)`
- `@Nullable @Nullable DisplaySlot getDisplaySlot()`
- `void setRenderType(@NotNull @NotNull RenderType renderType)`
- `@NotNull @NotNull RenderType getRenderType()`
- `@NotNull @NotNull Score getScore(@NotNull @NotNull OfflinePlayer player)`
- `@NotNull @NotNull Score getScore(@NotNull @NotNull String entry)`
- `@NotNull @NotNull Score getScoreFor(@NotNull Entity entity) throws IllegalArgumentException, IllegalStateException`
- `boolean willAutoUpdateDisplay()`
- `void setAutoUpdateDisplay(boolean autoUpdateDisplay)`
- `@Nullable NumberFormat numberFormat()`
- `void numberFormat(@Nullable NumberFormat format)`
