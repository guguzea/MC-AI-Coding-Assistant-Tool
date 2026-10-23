---
title: "org.bukkit.entity.HumanEntity"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/entity/HumanEntity.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull String getName()`
- `@NotNull @NotNull PlayerInventory getInventory()`
- `@NotNull @NotNull Inventory getEnderChest()`
- `@NotNull @NotNull MainHand getMainHand()`
- `boolean setWindowProperty&#8203;(@NotNull InventoryView.Property prop, int value)`
- `@NotNull @NotNull InventoryView getOpenInventory()`
- `@Nullable @Nullable InventoryView openInventory&#8203;(@NotNull @NotNull Inventory inventory)`
- `@Nullable @Nullable InventoryView openWorkbench&#8203;(@Nullable @Nullable Location location, boolean force)`
- `@Nullable @Nullable InventoryView openEnchanting&#8203;(@Nullable @Nullable Location location, boolean force)`
- `void openInventory&#8203;(@NotNull @NotNull InventoryView inventory)`
- `@Nullable @Nullable InventoryView openMerchant&#8203;(@NotNull @NotNull Villager trader, boolean force)`
- `@Nullable @Nullable InventoryView openMerchant&#8203;(@NotNull @NotNull Merchant merchant, boolean force)`
- `@Nullable @Nullable InventoryView openAnvil&#8203;(@Nullable @Nullable Location location, boolean force)`
- `@Nullable @Nullable InventoryView openCartographyTable&#8203;(@Nullable @Nullable Location location, boolean force)`
- `@Nullable @Nullable InventoryView openGrindstone&#8203;(@Nullable @Nullable Location location, boolean force)`
- `@Nullable @Nullable InventoryView openLoom&#8203;(@Nullable @Nullable Location location, boolean force)`
- `@Nullable @Nullable InventoryView openSmithingTable&#8203;(@Nullable @Nullable Location location, boolean force)`
- `@Nullable @Nullable InventoryView openStonecutter&#8203;(@Nullable @Nullable Location location, boolean force)`
- `void closeInventory()`
- `void closeInventory&#8203;(@NotNull InventoryCloseEvent.Reason reason)`
- `@Deprecated @NotNull @NotNull ItemStack getItemInHand()`
- `@Deprecated void setItemInHand&#8203;(@Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull ItemStack getItemOnCursor()`
- `void setItemOnCursor&#8203;(@Nullable @Nullable ItemStack item)`
- `boolean hasCooldown&#8203;(@NotNull @NotNull Material material)`
- `int getCooldown&#8203;(@NotNull @NotNull Material material)`
- `void setCooldown&#8203;(@NotNull @NotNull Material material, int ticks)`
- `boolean isDeeplySleeping()`
- `int getSleepTicks()`
- `@Nullable @Nullable Location getPotentialBedLocation()`
- `boolean sleep&#8203;(@NotNull @NotNull Location location, boolean force)`
- `void wakeup&#8203;(boolean setSpawnLocation)`
- `@NotNull @NotNull Location getBedLocation()`
- `@NotNull @NotNull GameMode getGameMode()`
- `void setGameMode&#8203;(@NotNull @NotNull GameMode mode)`
- `boolean isBlocking()`
- `boolean isHandRaised()`
- `int getExpToLevel()`
- `@Nullable @Nullable Entity releaseLeftShoulderEntity()`
- `@Nullable @Nullable Entity releaseRightShoulderEntity()`
- `float getAttackCooldown()`
- `boolean discoverRecipe&#8203;(@NotNull @NotNull NamespacedKey recipe)`
- `int discoverRecipes&#8203;(@NotNull @NotNull Collection<NamespacedKey> recipes)`
- `boolean undiscoverRecipe&#8203;(@NotNull @NotNull NamespacedKey recipe)`
- `int undiscoverRecipes&#8203;(@NotNull @NotNull Collection<NamespacedKey> recipes)`
- `boolean hasDiscoveredRecipe&#8203;(@NotNull @NotNull NamespacedKey recipe)`
- `@NotNull @NotNull Set<NamespacedKey> getDiscoveredRecipes()`
- `@Deprecated @Nullable @Nullable Entity getShoulderEntityLeft()`
- `@Deprecated void setShoulderEntityLeft&#8203;(@Nullable @Nullable Entity entity)`
- `@Deprecated @Nullable @Nullable Entity getShoulderEntityRight()`
- `@Deprecated void setShoulderEntityRight&#8203;(@Nullable @Nullable Entity entity)`
- `void openSign&#8203;(@NotNull Sign sign)`
- `boolean dropItem&#8203;(boolean dropAll)`
- `float getExhaustion()`
- `void setExhaustion&#8203;(float value)`
- `float getSaturation()`
- `void setSaturation&#8203;(float value)`
- `int getFoodLevel()`
- `void setFoodLevel&#8203;(int value)`
- `int getSaturatedRegenRate()`
- `void setSaturatedRegenRate&#8203;(int ticks)`
- `int getUnsaturatedRegenRate()`
- `void setUnsaturatedRegenRate&#8203;(int ticks)`
- `int getStarvationRate()`
- `void setStarvationRate&#8203;(int ticks)`
