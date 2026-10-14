---
title: "org.bukkit.event.entity.PlayerDeathEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/PlayerDeathEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerDeathEvent**
`public class PlayerDeathEvent extends EntityDeathEvent`
- `@Internal public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, @Nullable @Nullable Component deathMessage, boolean showDeathMessages)`
- `@Internal public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, @Nullable @Nullable Component deathMessage, boolean showDeathMessages)`
- `@Internal public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable @Nullable Component deathMessage, boolean showDeathMessages)`
- `@Internal public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable @Nullable Component deathMessage, boolean showDeathMessages, boolean doExpDrop)`
- `@Internal @Deprecated(forRemoval=true) public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, @Nullable @Nullable String deathMessage)`
- `@Internal @Deprecated(forRemoval=true) public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, @Nullable @Nullable String deathMessage)`
- `@Internal @Deprecated(forRemoval=true) public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable @Nullable String deathMessage)`
- `@Internal @Deprecated(forRemoval=true) public PlayerDeathEvent(@NotNull @NotNull Player player, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull List<ItemStack> drops, int droppedExp, int newExp, int newTotalExp, int newLevel, @Nullable @Nullable String deathMessage, boolean doExpDrop)`
- `@NotNull public @NotNull Player getEntity()`
- `public boolean getShowDeathMessages()`
- `public void setShowDeathMessages(boolean displayDeathMessage)`
- `@NotNull public @NotNull Player getPlayer()`
- `public int getNewExp()`
- `public void setNewExp(int exp)`
- `public int getNewLevel()`
- `public void setNewLevel(int level)`
- `public int getNewTotalExp()`
- `public void setNewTotalExp(int totalExp)`
- `public void deathMessage(@Nullable @Nullable Component deathMessage)`
- `@Nullable public @Nullable Component deathMessage()`
- `@Deprecated public void setDeathMessage(@Nullable @Nullable String deathMessage)`
- `@Nullable @Deprecated public @Nullable String getDeathMessage()`
- `public void deathScreenMessageOverride(@Nullable @Nullable Component deathScreenMessageOverride)`
- `@Nullable public @Nullable Component deathScreenMessageOverride()`
- `public boolean shouldDropExperience()`
- `public void setShouldDropExperience(boolean doExpDrop)`
- `public boolean getKeepLevel()`
- `public void setKeepLevel(boolean keepLevel)`
- `public void setKeepInventory(boolean keepInventory)`
- `public boolean getKeepInventory()`
- `@NotNull public @NotNull List<ItemStack> getItemsToKeep()`
