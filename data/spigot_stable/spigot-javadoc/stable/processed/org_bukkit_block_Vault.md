---
title: "org.bukkit.block.Vault"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Vault.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Vault**
`public interface Vault extends TileState`
- `double getActivationRange()`
- `void setActivationRange(double range)`
- `double getDeactivationRange()`
- `void setDeactivationRange(double range)`
- `@NotNull LootTable getLootTable()`
- `void setLootTable(@NotNull LootTable table)`
- `@Nullable LootTable getDisplayLootTable()`
- `void setDisplayLootTable(@Nullable LootTable table)`
- `@NotNull ItemStack getKeyItem()`
- `void setKeyItem(@NotNull ItemStack keyItem)`
- `@NotNull Set<UUID> getRewardedPlayers()`
