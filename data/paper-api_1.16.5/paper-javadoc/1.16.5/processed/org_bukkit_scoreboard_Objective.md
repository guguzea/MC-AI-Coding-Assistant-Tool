---
title: "org.bukkit.scoreboard.Objective"
package: "org.bukkit.scoreboard"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/scoreboard/Objective.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull String getName() throws IllegalStateException`
- `@NotNull Component displayName() throws IllegalStateException`
- `void displayName&#8203;(@Nullable Component displayName) throws IllegalStateException, IllegalArgumentException`
- `@NotNull @Deprecated @NotNull String getDisplayName() throws IllegalStateException`
- `@Deprecated void setDisplayName&#8203;(@NotNull @NotNull String displayName) throws IllegalStateException, IllegalArgumentException`
- `@NotNull @NotNull String getCriteria() throws IllegalStateException`
- `boolean isModifiable() throws IllegalStateException`
- `@Nullable @Nullable Scoreboard getScoreboard()`
- `void unregister() throws IllegalStateException`
- `void setDisplaySlot&#8203;(@Nullable @Nullable DisplaySlot slot) throws IllegalStateException`
- `@Nullable @Nullable DisplaySlot getDisplaySlot() throws IllegalStateException`
- `void setRenderType&#8203;(@NotNull @NotNull RenderType renderType) throws IllegalStateException`
- `@NotNull @NotNull RenderType getRenderType() throws IllegalStateException`
- `@Deprecated @NotNull @NotNull Score getScore&#8203;(@NotNull @NotNull OfflinePlayer player) throws IllegalArgumentException, IllegalStateException`
- `@NotNull @NotNull Score getScore&#8203;(@NotNull @NotNull String entry) throws IllegalArgumentException, IllegalStateException`
