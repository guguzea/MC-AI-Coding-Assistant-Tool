---
title: "org.bukkit.entity.Allay"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Allay.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Allay**
`public interface Allay extends Creature, InventoryHolder`
- `boolean canDuplicate()`
- `void setCanDuplicate(boolean canDuplicate)`
- `long getDuplicationCooldown()`
- `void setDuplicationCooldown(long cooldown)`
- `void resetDuplicationCooldown()`
- `boolean isDancing()`
- `void startDancing(@NotNull @NotNull Location location)`
- `void startDancing()`
- `void stopDancing()`
- `@Nullable @Nullable Allay duplicateAllay()`
- `@Nullable @Nullable Location getJukebox()`
