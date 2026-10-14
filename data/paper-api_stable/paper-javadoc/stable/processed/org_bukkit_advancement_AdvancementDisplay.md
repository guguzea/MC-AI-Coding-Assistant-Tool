---
title: "org.bukkit.advancement.AdvancementDisplay"
package: "org.bukkit.advancement"
source: https://jd.papermc.io/paper/26.3/org/bukkit/advancement/AdvancementDisplay.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface AdvancementDisplay**
`@Deprecated(forRemoval=true) public interface AdvancementDisplay`
- `@NotNull @NotNull String getTitle()`
- `@NotNull @NotNull String getDescription()`
- `@NotNull @NotNull ItemStack getIcon()`
- `boolean shouldShowToast()`
- `boolean shouldAnnounceChat()`
- `boolean isHidden()`
- `@Contract("-> fail") default float getX()`
- `@Contract("-> fail") default float getY()`
- `@NotNull @NotNull AdvancementDisplayType getType()`
