---
title: "org.bukkit.advancement.AdvancementProgress"
package: "org.bukkit.advancement"
source: https://jd.papermc.io/paper/26.3/org/bukkit/advancement/AdvancementProgress.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface AdvancementProgress**
`public interface AdvancementProgress`
- `@NotNull @NotNull Advancement getAdvancement()`
- `boolean isDone()`
- `boolean awardCriteria(@NotNull @NotNull String criteria)`
- `boolean revokeCriteria(@NotNull @NotNull String criteria)`
- `@Nullable @Nullable Date getDateAwarded(@NotNull @NotNull String criteria)`
- `@NotNull @NotNull Collection<String> getRemainingCriteria()`
- `@NotNull @NotNull Collection<String> getAwardedCriteria()`
