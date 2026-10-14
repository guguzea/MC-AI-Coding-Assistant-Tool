---
title: "org.bukkit.entity.Allay"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Allay.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Allay**
`public interface Allay extends Creature, InventoryHolder`
- `boolean canDuplicate()`
- `void setCanDuplicate(boolean canDuplicate)`
- `long getDuplicationCooldown()`
- `void setDuplicationCooldown(long cooldown)`
- `void resetDuplicationCooldown()`
- `boolean isDancing()`
- `void startDancing(@NotNull Location location)`
- `void startDancing()`
- `void stopDancing()`
- `@Nullable Allay duplicateAllay()`
- `@Nullable Location getJukebox()`
