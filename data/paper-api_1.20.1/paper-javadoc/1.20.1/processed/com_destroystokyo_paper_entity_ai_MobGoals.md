---
title: "com.destroystokyo.paper.entity.ai.MobGoals"
package: "com.destroystokyo.paper.entity.ai"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/entity/ai/MobGoals.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `<T extends Mob> void addGoal(@NotNull T mob, int priority, @NotNull @NotNull Goal<T> goal)`
- `<T extends Mob> void removeGoal(@NotNull T mob, @NotNull @NotNull Goal<T> goal)`
- `<T extends Mob> void removeAllGoals(@NotNull T mob)`
- `<T extends Mob> void removeAllGoals(@NotNull T mob, @NotNull @NotNull GoalType type)`
- `<T extends Mob> void removeGoal(@NotNull T mob, @NotNull @NotNull GoalKey<T> key)`
- `<T extends Mob> boolean hasGoal(@NotNull T mob, @NotNull @NotNull GoalKey<T> key)`
- `@Nullable <T extends Mob> @Nullable Goal<T> getGoal(@NotNull T mob, @NotNull @NotNull GoalKey<T> key)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getGoals(@NotNull T mob, @NotNull @NotNull GoalKey<T> key)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getAllGoals(@NotNull T mob)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getAllGoals(@NotNull T mob, @NotNull @NotNull GoalType type)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getAllGoalsWithout(@NotNull T mob, @NotNull @NotNull GoalType type)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getRunningGoals(@NotNull T mob)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getRunningGoals(@NotNull T mob, @NotNull @NotNull GoalType type)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getRunningGoalsWithout(@NotNull T mob, @NotNull @NotNull GoalType type)`
