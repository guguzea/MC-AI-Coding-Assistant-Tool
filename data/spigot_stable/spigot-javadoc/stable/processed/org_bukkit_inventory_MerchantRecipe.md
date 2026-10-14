---
title: "org.bukkit.inventory.MerchantRecipe"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/MerchantRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class MerchantRecipe**
`public class MerchantRecipe extends Object implements Recipe`
- `public MerchantRecipe(@NotNull ItemStack result, int maxUses)`
- `public MerchantRecipe(@NotNull ItemStack result, int uses, int maxUses, boolean experienceReward)`
- `public MerchantRecipe(@NotNull ItemStack result, int uses, int maxUses, boolean experienceReward, int villagerExperience, float priceMultiplier)`
- `public MerchantRecipe(@NotNull ItemStack result, int uses, int maxUses, boolean experienceReward, int villagerExperience, float priceMultiplier, int demand, int specialPrice)`
- `@NotNull public ItemStack getResult()`
- `public void addIngredient(@NotNull ItemStack item)`
- `public void removeIngredient(int index)`
- `public void setIngredients(@NotNull List<ItemStack> ingredients)`
- `@NotNull public List<ItemStack> getIngredients()`
- `@Nullable public ItemStack getAdjustedIngredient1()`
- `public void adjust(@Nullable ItemStack itemStack)`
- `public int getDemand()`
- `public void setDemand(int demand)`
- `public int getSpecialPrice()`
- `public void setSpecialPrice(int specialPrice)`
- `public int getUses()`
- `public void setUses(int uses)`
- `public int getMaxUses()`
- `public void setMaxUses(int maxUses)`
- `public boolean hasExperienceReward()`
- `public void setExperienceReward(boolean flag)`
- `public int getVillagerExperience()`
- `public void setVillagerExperience(int villagerExperience)`
- `public float getPriceMultiplier()`
- `public void setPriceMultiplier(float priceMultiplier)`
