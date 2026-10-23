---
title: "org.bukkit.advancement.AdvancementProgress"
package: "org.bukkit.advancement"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/advancement/AdvancementProgress.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Advancement getAdvancement()`
- `boolean isDone()`
- `boolean awardCriteria(@NotNull @NotNull String criteria)`
- `boolean revokeCriteria(@NotNull @NotNull String criteria)`
- `@Nullable @Nullable Date getDateAwarded(@NotNull @NotNull String criteria)`
- `@NotNull @NotNull Collection<String> getRemainingCriteria()`
- `@NotNull @NotNull Collection<String> getAwardedCriteria()`
