---
title: "org.bukkit.event.entity.PlayerDeathEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/entity/PlayerDeathEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Internal public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, @Nullable Component deathMessage)`
- `@Internal public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, @Nullable Component deathMessage)`
- `@Internal public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable Component deathMessage)`
- `@Internal public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable Component deathMessage, boolean doExpDrop)`
- `@Deprecated public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, @Nullable @Nullable String deathMessage)`
- `@Deprecated public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, @Nullable @Nullable String deathMessage)`
- `@Deprecated public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable @Nullable String deathMessage)`
- `@Deprecated public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable @Nullable String deathMessage, boolean doExpDrop)`
- `@NotNull public @NotNull List<ItemStack> getItemsToKeep()`
- `public boolean shouldDropExperience()`
- `public void setShouldDropExperience(boolean doExpDrop)`
- `@NotNull public @NotNull Player getEntity()`
- `@NotNull public @NotNull Player getPlayer()`
- `public void deathMessage(@Nullable Component deathMessage)`
- `public @Nullable Component deathMessage()`
- `@Deprecated public void setDeathMessage(@Nullable @Nullable String deathMessage)`
- `@Nullable @Deprecated public @Nullable String getDeathMessage()`
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
