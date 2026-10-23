---
title: "org.bukkit.inventory.MerchantRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/inventory/MerchantRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public MerchantRecipe(@NotNull @NotNull ItemStack result, int maxUses)`
- `public MerchantRecipe(@NotNull @NotNull ItemStack result, int uses, int maxUses, boolean experienceReward)`
- `public MerchantRecipe(@NotNull @NotNull ItemStack result, int uses, int maxUses, boolean experienceReward, int villagerExperience, float priceMultiplier)`
- `public MerchantRecipe(@NotNull @NotNull ItemStack result, int uses, int maxUses, boolean experienceReward, int villagerExperience, float priceMultiplier, int demand, int specialPrice)`
- `public MerchantRecipe(@NotNull @NotNull ItemStack result, int uses, int maxUses, boolean experienceReward, int villagerExperience, float priceMultiplier, boolean ignoreDiscounts)`
- `public MerchantRecipe(@NotNull @NotNull ItemStack result, int uses, int maxUses, boolean experienceReward, int villagerExperience, float priceMultiplier, int demand, int specialPrice, boolean ignoreDiscounts)`
- `public MerchantRecipe(@NotNull @NotNull MerchantRecipe recipe)`
- `@NotNull public @NotNull ItemStack getResult()`
- `public void addIngredient(@NotNull @NotNull ItemStack item)`
- `public void removeIngredient(int index)`
- `public void setIngredients(@NotNull @NotNull List<ItemStack> ingredients)`
- `@NotNull public @NotNull List<ItemStack> getIngredients()`
- `@Nullable public @Nullable ItemStack getAdjustedIngredient1()`
- `public void adjust(@Nullable @Nullable ItemStack itemStack)`
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
- `public boolean shouldIgnoreDiscounts()`
- `public void setIgnoreDiscounts(boolean ignoreDiscounts)`
