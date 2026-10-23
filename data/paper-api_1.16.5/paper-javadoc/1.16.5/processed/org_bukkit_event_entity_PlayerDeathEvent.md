---
title: "org.bukkit.event.entity.PlayerDeathEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/PlayerDeathEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerDeathEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull List<ItemStack> drops, int droppedExp, @Nullable Component adventure$deathMessage)`
- `public PlayerDeathEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, @Nullable Component adventure$deathMessage, @Nullable @Nullable String deathMessage)`
- `public PlayerDeathEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable Component adventure$deathMessage, @Nullable @Nullable String deathMessage)`
- `public PlayerDeathEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable Component adventure$deathMessage, @Nullable @Nullable String deathMessage, boolean doExpDrop)`
- `public PlayerDeathEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull List<ItemStack> drops, int droppedExp, @Nullable @Nullable String deathMessage)`
- `@Deprecated public PlayerDeathEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, @Nullable @Nullable String deathMessage)`
- `@Deprecated public PlayerDeathEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable @Nullable String deathMessage)`
- `@Deprecated public PlayerDeathEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable @Nullable String deathMessage, boolean doExpDrop)`
- `@NotNull public @NotNull List<ItemStack> getItemsToKeep()`
- `public boolean shouldDropExperience()`
- `public void setShouldDropExperience&#8203;(boolean doExpDrop)`
- `@NotNull public @NotNull Player getEntity()`
- `public void deathMessage&#8203;(@Nullable Component deathMessage)`
- `@Nullable public Component deathMessage()`
- `@Deprecated public void setDeathMessage&#8203;(@Nullable @Nullable String deathMessage)`
- `@Nullable @Deprecated public @Nullable String getDeathMessage()`
- `public int getNewExp()`
- `public void setNewExp&#8203;(int exp)`
- `public int getNewLevel()`
- `public void setNewLevel&#8203;(int level)`
- `public int getNewTotalExp()`
- `public void setNewTotalExp&#8203;(int totalExp)`
- `public boolean getKeepLevel()`
- `public void setKeepLevel&#8203;(boolean keepLevel)`
- `public void setKeepInventory&#8203;(boolean keepInventory)`
- `public boolean getKeepInventory()`
