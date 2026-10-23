---
title: "org.bukkit.inventory.MerchantRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/MerchantRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public MerchantRecipe&#8203;(@NotNull @NotNull ItemStack result, int maxUses)`
- `public MerchantRecipe&#8203;(@NotNull @NotNull ItemStack result, int uses, int maxUses, boolean experienceReward)`
- `public MerchantRecipe&#8203;(@NotNull @NotNull ItemStack result, int uses, int maxUses, boolean experienceReward, int villagerExperience, float priceMultiplier)`
- `public MerchantRecipe&#8203;(@NotNull @NotNull ItemStack result, int uses, int maxUses, boolean experienceReward, int villagerExperience, float priceMultiplier, boolean ignoreDiscounts)`
- `@NotNull public @NotNull ItemStack getResult()`
- `public void addIngredient&#8203;(@NotNull @NotNull ItemStack item)`
- `public void removeIngredient&#8203;(int index)`
- `public void setIngredients&#8203;(@NotNull @NotNull List<ItemStack> ingredients)`
- `@NotNull public @NotNull List<ItemStack> getIngredients()`
- `public int getUses()`
- `public void setUses&#8203;(int uses)`
- `public int getMaxUses()`
- `public void setMaxUses&#8203;(int maxUses)`
- `public boolean hasExperienceReward()`
- `public void setExperienceReward&#8203;(boolean flag)`
- `public int getVillagerExperience()`
- `public void setVillagerExperience&#8203;(int villagerExperience)`
- `public float getPriceMultiplier()`
- `public void setPriceMultiplier&#8203;(float priceMultiplier)`
- `public boolean shouldIgnoreDiscounts()`
- `public void setIgnoreDiscounts&#8203;(boolean ignoreDiscounts)`
