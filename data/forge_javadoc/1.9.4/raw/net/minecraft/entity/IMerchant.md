---
title: "IMerchant"
description: "public interface IMerchant"
package: "net/minecraft/entity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/IMerchant.html"
sourceType: javadoc
---

# IMerchant

## Class signature

```java
public interface IMerchant
```

## Methods

- `void setCustomer( EntityPlayer player)`
- `EntityPlayer getCustomer()`
- `MerchantRecipeList getRecipes( EntityPlayer player)`
- `void setRecipes( MerchantRecipeList recipeList)`
- `void useRecipe( MerchantRecipe recipe)`
- `void verifySellingItem( ItemStack stack)`
- `ITextComponent getDisplayName()`
