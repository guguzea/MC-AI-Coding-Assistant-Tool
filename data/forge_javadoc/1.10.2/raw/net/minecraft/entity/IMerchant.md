---
title: "IMerchant"
description: "public interface IMerchant"
package: "net/minecraft/entity"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/IMerchant.html"
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
