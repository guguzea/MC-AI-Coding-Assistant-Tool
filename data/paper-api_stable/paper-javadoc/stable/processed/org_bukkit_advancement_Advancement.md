---
title: "org.bukkit.advancement.Advancement"
package: "org.bukkit.advancement"
source: https://jd.papermc.io/paper/26.3/org/bukkit/advancement/Advancement.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Advancement**
`public interface Advancement extends Keyed`
- `@NotNull @NotNull Collection<String> getCriteria()`
- `@NotNull @NotNull AdvancementRequirements getRequirements()`
- `@Nullable AdvancementDisplay getDisplay()`
- `@NotNull Component displayName()`
- `@Nullable @Nullable Advancement getParent()`
- `@NotNull @NotNull @Unmodifiable Collection<Advancement> getChildren()`
- `@NotNull @NotNull Advancement getRoot()`
