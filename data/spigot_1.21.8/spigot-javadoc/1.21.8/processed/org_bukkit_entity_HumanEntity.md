---
title: "org.bukkit.entity.HumanEntity"
package: "org.bukkit.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.entity.HumanEntity extends org.bukkit.entity.LivingEntity,org.bukkit.entity.AnimalTamer,org.bukkit.inventory.InventoryHolder`
- `public abstract java.lang.String getName()`
- `public abstract org.bukkit.inventory.PlayerInventory getInventory()`
- `public abstract org.bukkit.inventory.Inventory getEnderChest()`
- `public abstract org.bukkit.inventory.MainHand getMainHand()`
- `public abstract boolean setWindowProperty(org.bukkit.inventory.InventoryView$Property, int)`
- `public abstract int getEnchantmentSeed()`
- `public abstract void setEnchantmentSeed(int)`
- `public abstract org.bukkit.inventory.InventoryView getOpenInventory()`
- `public abstract org.bukkit.inventory.InventoryView openInventory(org.bukkit.inventory.Inventory)`
- `public abstract org.bukkit.inventory.InventoryView openWorkbench(org.bukkit.Location, boolean)`
- `public abstract org.bukkit.inventory.InventoryView openEnchanting(org.bukkit.Location, boolean)`
- `public abstract void openInventory(org.bukkit.inventory.InventoryView)`
- `public abstract org.bukkit.inventory.InventoryView openMerchant(org.bukkit.entity.Villager, boolean)`
- `public abstract org.bukkit.inventory.InventoryView openMerchant(org.bukkit.inventory.Merchant, boolean)`
- `public abstract void closeInventory()`
- `public abstract org.bukkit.inventory.ItemStack getItemInHand()`
- `public abstract void setItemInHand(org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.inventory.ItemStack getItemOnCursor()`
- `public abstract void setItemOnCursor(org.bukkit.inventory.ItemStack)`
- `public abstract boolean hasCooldown(org.bukkit.Material)`
- `public abstract int getCooldown(org.bukkit.Material)`
- `public abstract void setCooldown(org.bukkit.Material, int)`
- `public abstract boolean hasCooldown(org.bukkit.inventory.ItemStack)`
- `public abstract int getCooldown(org.bukkit.inventory.ItemStack)`
- `public abstract void setCooldown(org.bukkit.inventory.ItemStack, int)`
- `public abstract int getSleepTicks()`
- `public abstract boolean sleep(org.bukkit.Location, boolean)`
- `public abstract void wakeup(boolean)`
- `public abstract void startRiptideAttack(int, float, org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.Location getBedLocation()`
- `public abstract org.bukkit.GameMode getGameMode()`
- `public abstract void setGameMode(org.bukkit.GameMode)`
- `public abstract boolean isBlocking()`
- `public abstract boolean isHandRaised()`
- `public abstract int getExpToLevel()`
- `public abstract float getAttackCooldown()`
- `public abstract boolean discoverRecipe(org.bukkit.NamespacedKey)`
- `public abstract int discoverRecipes(java.util.Collection<org.bukkit.NamespacedKey>)`
- `public abstract boolean undiscoverRecipe(org.bukkit.NamespacedKey)`
- `public abstract int undiscoverRecipes(java.util.Collection<org.bukkit.NamespacedKey>)`
- `public abstract boolean hasDiscoveredRecipe(org.bukkit.NamespacedKey)`
- `public abstract java.util.Set<org.bukkit.NamespacedKey> getDiscoveredRecipes()`
- `public abstract org.bukkit.entity.Entity getShoulderEntityLeft()`
- `public abstract void setShoulderEntityLeft(org.bukkit.entity.Entity)`
- `public abstract org.bukkit.entity.Entity getShoulderEntityRight()`
- `public abstract void setShoulderEntityRight(org.bukkit.entity.Entity)`
- `public abstract boolean dropItem(boolean)`
- `public abstract float getExhaustion()`
- `public abstract void setExhaustion(float)`
- `public abstract float getSaturation()`
- `public abstract void setSaturation(float)`
- `public abstract int getFoodLevel()`
- `public abstract void setFoodLevel(int)`
- `public abstract int getSaturatedRegenRate()`
- `public abstract void setSaturatedRegenRate(int)`
- `public abstract int getUnsaturatedRegenRate()`
- `public abstract void setUnsaturatedRegenRate(int)`
- `public abstract int getStarvationRate()`
- `public abstract void setStarvationRate(int)`
- `public abstract org.bukkit.Location getLastDeathLocation()`
- `public abstract void setLastDeathLocation(org.bukkit.Location)`
- `public abstract org.bukkit.entity.Firework fireworkBoost(org.bukkit.inventory.ItemStack)`
- `public default org.bukkit.inventory.Inventory getInventory()`
