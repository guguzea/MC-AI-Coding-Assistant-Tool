---
title: "org.bukkit.event.entity.PlayerDeathEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/PlayerDeathEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerDeathEvent**
`public class PlayerDeathEvent extends EntityDeathEvent`
- `public PlayerDeathEvent(@NotNull Player player, @NotNull DamageSource damageSource, @NotNull List<ItemStack> drops, int droppedExp, @Nullable String deathMessage)`
- `public PlayerDeathEvent(@NotNull Player player, @NotNull DamageSource damageSource, @NotNull List<ItemStack> drops, int droppedExp, int newExp, @Nullable String deathMessage)`
- `public PlayerDeathEvent(@NotNull Player player, @NotNull DamageSource damageSource, @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable String deathMessage)`
- `@NotNull public Player getEntity()`
- `public void setDeathMessage(@Nullable String deathMessage)`
- `@Nullable public String getDeathMessage()`
- `public int getNewExp()`
- `public void setNewExp(int exp)`
- `public int getNewLevel()`
- `public void setNewLevel(int level)`
- `public int getNewTotalExp()`
- `public void setNewTotalExp(int totalExp)`
- `public boolean getKeepLevel()`
- `public void setKeepLevel(boolean keepLevel)`
- `public void setKeepInventory(boolean keepInventory)`
- `public boolean getKeepInventory()`
