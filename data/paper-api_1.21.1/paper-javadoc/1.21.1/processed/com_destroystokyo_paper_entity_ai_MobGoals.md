---
title: "com.destroystokyo.paper.entity.ai.MobGoals"
package: "com.destroystokyo.paper.entity.ai"
source: https://jd.papermc.io/paper/1.21.1/com/destroystokyo/paper/entity/ai/MobGoals.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `<T extends Mob> void addGoal(T mob, int priority, Goal<T> goal)`
- `<T extends Mob> void removeGoal(T mob, Goal<T> goal)`
- `<T extends Mob> void removeAllGoals(T mob)`
- `<T extends Mob> void removeAllGoals(T mob, GoalType type)`
- `<T extends Mob> void removeGoal(T mob, GoalKey<T> key)`
- `<T extends Mob> boolean hasGoal(T mob, GoalKey<T> key)`
- `<T extends Mob> @Nullable Goal<T> getGoal(T mob, GoalKey<T> key)`
- `<T extends Mob> Collection<Goal<T>> getGoals(T mob, GoalKey<T> key)`
- `<T extends Mob> Collection<Goal<T>> getAllGoals(T mob)`
- `<T extends Mob> Collection<Goal<T>> getAllGoals(T mob, GoalType type)`
- `<T extends Mob> Collection<Goal<T>> getAllGoalsWithout(T mob, GoalType type)`
- `<T extends Mob> Collection<Goal<T>> getRunningGoals(T mob)`
- `<T extends Mob> Collection<Goal<T>> getRunningGoals(T mob, GoalType type)`
- `<T extends Mob> Collection<Goal<T>> getRunningGoalsWithout(T mob, GoalType type)`
