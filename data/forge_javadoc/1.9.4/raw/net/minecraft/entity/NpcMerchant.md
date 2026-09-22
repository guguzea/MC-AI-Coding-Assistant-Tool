---
title: "NpcMerchant"
description: "public class NpcMerchant extends java.lang.Object implements IMerchant"
package: "net/minecraft/entity"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/NpcMerchant.html"
sourceType: javadoc
---

# NpcMerchant

**Inheritance:** java.lang.Object → net.minecraft.entity.NpcMerchant

## Class signature

```java
public class NpcMerchant extends java.lang.Object implements IMerchant
```

## Constructors

- `NpcMerchant(EntityPlayer customerIn, ITextComponent nameIn)`

## Methods

- `EntityPlayer getCustomer()`
- `ITextComponent getDisplayName()`
- `MerchantRecipeList getRecipes(EntityPlayer player)`
- `void setCustomer(EntityPlayer player)`
- `void setRecipes(MerchantRecipeList recipeList)`
- `void useRecipe(MerchantRecipe recipe)`
- `void verifySellingItem(ItemStack stack)`
