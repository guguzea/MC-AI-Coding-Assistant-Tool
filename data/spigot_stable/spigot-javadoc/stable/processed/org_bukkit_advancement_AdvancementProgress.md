---
title: "org.bukkit.advancement.AdvancementProgress"
package: "org.bukkit.advancement"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/advancement/AdvancementProgress.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface AdvancementProgress**
`public interface AdvancementProgress`
- `@NotNull Advancement getAdvancement()`
- `boolean isDone()`
- `boolean awardCriteria(@NotNull String criteria)`
- `boolean revokeCriteria(@NotNull String criteria)`
- `@Nullable Date getDateAwarded(@NotNull String criteria)`
- `@NotNull Collection<String> getRemainingCriteria()`
- `@NotNull Collection<String> getAwardedCriteria()`
