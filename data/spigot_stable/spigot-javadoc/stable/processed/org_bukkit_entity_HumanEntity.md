---
title: "org.bukkit.entity.HumanEntity"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/HumanEntity.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface HumanEntity**
`public interface HumanEntity extends LivingEntity, AnimalTamer, InventoryHolder`
- `@NotNull String getName()`
- `@NotNull PlayerInventory getInventory()`
- `@NotNull Inventory getEnderChest()`
- `@NotNull MainHand getMainHand()`
- `boolean isModelPartShown(@NotNull PlayerModelPart part)`
- `@Deprecated(forRemoval=true, since="1.21") boolean setWindowProperty(@NotNull InventoryView.Property prop, int value)`
- `int getEnchantmentSeed()`
- `void setEnchantmentSeed(int seed)`
- `@NotNull InventoryView getOpenInventory()`
- `@Nullable InventoryView openInventory(@NotNull Inventory inventory)`
- `@Deprecated(since="1.21.4") @Nullable InventoryView openWorkbench(@Nullable Location location, boolean force)`
- `@Deprecated(since="1.21.4") @Nullable InventoryView openEnchanting(@Nullable Location location, boolean force)`
- `void openInventory(@NotNull InventoryView inventory)`
- `@Deprecated(since="1.21.4") @Nullable InventoryView openMerchant(@NotNull Villager trader, boolean force)`
- `@Deprecated(since="1.21.4") @Nullable InventoryView openMerchant(@NotNull Merchant merchant, boolean force)`
- `void closeInventory()`
- `@Deprecated(since="1.9") @NotNull ItemStack getItemInHand()`
- `@Deprecated(since="1.9") void setItemInHand(@Nullable ItemStack item)`
- `@NotNull ItemStack getItemOnCursor()`
- `void setItemOnCursor(@Nullable ItemStack item)`
- `boolean hasCooldown(@NotNull Material material)`
- `int getCooldown(@NotNull Material material)`
- `void setCooldown(@NotNull Material material, int ticks)`
- `boolean hasCooldown(@NotNull ItemStack item)`
- `int getCooldown(@NotNull ItemStack item)`
- `void setCooldown(@NotNull ItemStack item, int ticks)`
- `int getSleepTicks()`
- `boolean sleep(@NotNull Location location, boolean force)`
- `void wakeup(boolean setSpawnLocation)`
- `void startRiptideAttack(int duration, float attackStrength, @Nullable ItemStack attackItem)`
- `@NotNull Location getBedLocation()`
- `@NotNull GameMode getGameMode()`
- `void setGameMode(@NotNull GameMode mode)`
- `boolean isBlocking()`
- `boolean isHandRaised()`
- `int getExpToLevel()`
- `float getAttackCooldown()`
- `boolean discoverRecipe(@NotNull NamespacedKey recipe)`
- `int discoverRecipes(@NotNull Collection<NamespacedKey> recipes)`
- `boolean undiscoverRecipe(@NotNull NamespacedKey recipe)`
- `int undiscoverRecipes(@NotNull Collection<NamespacedKey> recipes)`
- `boolean hasDiscoveredRecipe(@NotNull NamespacedKey recipe)`
- `@NotNull Set<NamespacedKey> getDiscoveredRecipes()`
- `@Deprecated(since="1.12") @Nullable Entity getShoulderEntityLeft()`
- `@Deprecated(since="1.12") void setShoulderEntityLeft(@Nullable Entity entity)`
- `@Deprecated(since="1.12") @Nullable Entity getShoulderEntityRight()`
- `@Deprecated(since="1.12") void setShoulderEntityRight(@Nullable Entity entity)`
- `boolean dropItem(boolean dropAll)`
- `float getExhaustion()`
- `void setExhaustion(float value)`
- `float getSaturation()`
- `void setSaturation(float value)`
- `int getFoodLevel()`
- `void setFoodLevel(int value)`
- `int getSaturatedRegenRate()`
- `void setSaturatedRegenRate(int ticks)`
- `int getUnsaturatedRegenRate()`
- `void setUnsaturatedRegenRate(int ticks)`
- `int getStarvationRate()`
- `void setStarvationRate(int ticks)`
- `@Nullable Location getLastDeathLocation()`
- `void setLastDeathLocation(@Nullable Location location)`
- `@Nullable Firework fireworkBoost(@NotNull ItemStack fireworkItemStack)`
