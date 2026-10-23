---
title: "org.bukkit.inventory.MerchantRecipe"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.inventory.MerchantRecipe implements org.bukkit.inventory.Recipe`
- `public org.bukkit.inventory.MerchantRecipe(org.bukkit.inventory.ItemStack, int)`
- `public org.bukkit.inventory.MerchantRecipe(org.bukkit.inventory.ItemStack, int, int, boolean)`
- `public org.bukkit.inventory.MerchantRecipe(org.bukkit.inventory.ItemStack, int, int, boolean, int, float)`
- `public org.bukkit.inventory.MerchantRecipe(org.bukkit.inventory.ItemStack, int, int, boolean, int, float, int, int)`
- `public org.bukkit.inventory.ItemStack getResult()`
- `public void addIngredient(org.bukkit.inventory.ItemStack)`
- `public void removeIngredient(int)`
- `public void setIngredients(java.util.List<org.bukkit.inventory.ItemStack>)`
- `public java.util.List<org.bukkit.inventory.ItemStack> getIngredients()`
- `public org.bukkit.inventory.ItemStack getAdjustedIngredient1()`
- `public void adjust(org.bukkit.inventory.ItemStack)`
- `public int getDemand()`
- `public void setDemand(int)`
- `public int getSpecialPrice()`
- `public void setSpecialPrice(int)`
- `public int getUses()`
- `public void setUses(int)`
- `public int getMaxUses()`
- `public void setMaxUses(int)`
- `public boolean hasExperienceReward()`
- `public void setExperienceReward(boolean)`
- `public int getVillagerExperience()`
- `public void setVillagerExperience(int)`
- `public float getPriceMultiplier()`
- `public void setPriceMultiplier(float)`
