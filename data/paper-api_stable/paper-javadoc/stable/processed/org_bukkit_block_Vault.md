---
title: "org.bukkit.block.Vault"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/Vault.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Vault**
`@NullMarked public interface Vault extends TileState`
- `double getActivationRange()`
- `void setActivationRange(double activationRange)`
- `double getDeactivationRange()`
- `void setDeactivationRange(double deactivationRange)`
- `ItemStack getKeyItem()`
- `void setKeyItem(ItemStack key)`
- `LootTable getLootTable()`
- `void setLootTable(LootTable lootTable)`
- `@Nullable LootTable getDisplayedLootTable()`
- `void setDisplayedLootTable(@Nullable LootTable lootTable)`
- `long getNextStateUpdateTime()`
- `void setNextStateUpdateTime(long nextStateUpdateTime)`
- `@Unmodifiable Collection<UUID> getRewardedPlayers()`
- `boolean addRewardedPlayer(UUID playerUUID)`
- `boolean removeRewardedPlayer(UUID playerUUID)`
- `boolean hasRewardedPlayer(UUID playerUUID)`
- `@Unmodifiable Set<UUID> getConnectedPlayers()`
- `boolean hasConnectedPlayer(UUID playerUUID)`
- `ItemStack getDisplayedItem()`
- `void setDisplayedItem(ItemStack displayedItem)`
