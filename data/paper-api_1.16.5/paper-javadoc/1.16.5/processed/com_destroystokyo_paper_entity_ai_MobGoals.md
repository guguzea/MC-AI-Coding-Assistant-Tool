---
title: "com.destroystokyo.paper.entity.ai.MobGoals"
package: "com.destroystokyo.paper.entity.ai"
source: https://jd.papermc.io/paper/1.16.5/com/destroystokyo/paper/entity/ai/MobGoals.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `<T extends Mob> void addGoal&#8203;(@NotNull T mob, int priority, @NotNull @NotNull Goal<T> goal)`
- `<T extends Mob> void removeGoal&#8203;(@NotNull T mob, @NotNull @NotNull Goal<T> goal)`
- `<T extends Mob> void removeAllGoals&#8203;(@NotNull T mob)`
- `<T extends Mob> void removeAllGoals&#8203;(@NotNull T mob, @NotNull @NotNull GoalType type)`
- `<T extends Mob> void removeGoal&#8203;(@NotNull T mob, @NotNull @NotNull GoalKey<T> key)`
- `<T extends Mob> boolean hasGoal&#8203;(@NotNull T mob, @NotNull @NotNull GoalKey<T> key)`
- `@Nullable <T extends Mob> @Nullable Goal<T> getGoal&#8203;(@NotNull T mob, @NotNull @NotNull GoalKey<T> key)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getGoals&#8203;(@NotNull T mob, @NotNull @NotNull GoalKey<T> key)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getAllGoals&#8203;(@NotNull T mob)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getAllGoals&#8203;(@NotNull T mob, @NotNull @NotNull GoalType type)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getAllGoalsWithout&#8203;(@NotNull T mob, @NotNull @NotNull GoalType type)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getRunningGoals&#8203;(@NotNull T mob)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getRunningGoals&#8203;(@NotNull T mob, @NotNull @NotNull GoalType type)`
- `@NotNull <T extends Mob> @NotNull Collection<Goal<T>> getRunningGoalsWithout&#8203;(@NotNull T mob, @NotNull @NotNull GoalType type)`
