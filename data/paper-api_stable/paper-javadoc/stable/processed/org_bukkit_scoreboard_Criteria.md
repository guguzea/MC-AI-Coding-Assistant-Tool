---
title: "org.bukkit.scoreboard.Criteria"
package: "org.bukkit.scoreboard"
source: https://jd.papermc.io/paper/26.3/org/bukkit/scoreboard/Criteria.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Criteria**
`public interface Criteria`
- `static final Criteria DUMMY`
- `static final Criteria TRIGGER`
- `static final Criteria DEATH_COUNT`
- `static final Criteria PLAYER_KILL_COUNT`
- `static final Criteria TOTAL_KILL_COUNT`
- `static final Criteria HEALTH`
- `static final Criteria FOOD`
- `static final Criteria AIR`
- `static final Criteria ARMOR`
- `static final Criteria XP`
- `static final Criteria LEVEL`
- `static final Criteria TEAM_KILL_BLACK`
- `static final Criteria TEAM_KILL_DARK_BLUE`
- `static final Criteria TEAM_KILL_DARK_GREEN`
- `static final Criteria TEAM_KILL_DARK_AQUA`
- `static final Criteria TEAM_KILL_DARK_RED`
- `static final Criteria TEAM_KILL_DARK_PURPLE`
- `static final Criteria TEAM_KILL_GOLD`
- `static final Criteria TEAM_KILL_GRAY`
- `static final Criteria TEAM_KILL_DARK_GRAY`
- `static final Criteria TEAM_KILL_BLUE`
- `static final Criteria TEAM_KILL_GREEN`
- `static final Criteria TEAM_KILL_AQUA`
- `static final Criteria TEAM_KILL_RED`
- `static final Criteria TEAM_KILL_LIGHT_PURPLE`
- `static final Criteria TEAM_KILL_YELLOW`
- `static final Criteria TEAM_KILL_WHITE`
- `static final Criteria KILLED_BY_TEAM_BLACK`
- `static final Criteria KILLED_BY_TEAM_DARK_BLUE`
- `static final Criteria KILLED_BY_TEAM_DARK_GREEN`
- `static final Criteria KILLED_BY_TEAM_DARK_AQUA`
- `static final Criteria KILLED_BY_TEAM_DARK_RED`
- `static final Criteria KILLED_BY_TEAM_DARK_PURPLE`
- `static final Criteria KILLED_BY_TEAM_GOLD`
- `static final Criteria KILLED_BY_TEAM_GRAY`
- `static final Criteria KILLED_BY_TEAM_DARK_GRAY`
- `static final Criteria KILLED_BY_TEAM_BLUE`
- `static final Criteria KILLED_BY_TEAM_GREEN`
- `static final Criteria KILLED_BY_TEAM_AQUA`
- `static final Criteria KILLED_BY_TEAM_RED`
- `static final Criteria KILLED_BY_TEAM_LIGHT_PURPLE`
- `static final Criteria KILLED_BY_TEAM_YELLOW`
- `static final Criteria KILLED_BY_TEAM_WHITE`
- `@NotNull @NotNull String getName()`
- `boolean isReadOnly()`
- `@NotNull @NotNull RenderType getDefaultRenderType()`
- `@NotNull static @NotNull Criteria statistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material)`
- `@NotNull static @NotNull Criteria statistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType)`
- `@NotNull static @NotNull Criteria statistic(@NotNull @NotNull Statistic statistic)`
- `@NotNull static @NotNull Criteria create(@NotNull @NotNull String name)`
