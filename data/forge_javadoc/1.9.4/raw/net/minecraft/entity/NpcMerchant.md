---
title: "NpcMerchant"
description: "public class NpcMerchant extends java.lang.Object implements IMerchant"
package: "net/minecraft/entity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/NpcMerchant.html"
sourceType: javadoc
---

# NpcMerchant

## Class signature

```java
public class NpcMerchant extends java.lang.Object implements IMerchant
```

## Constructors

- `public NpcMerchant( EntityPlayer customerIn, ITextComponent nameIn)`

## Methods

- `public EntityPlayer getCustomer()`
- `public void setCustomer( EntityPlayer player)`
- `public MerchantRecipeList getRecipes( EntityPlayer player)`
- `public void setRecipes( MerchantRecipeList recipeList)`
- `public void useRecipe( MerchantRecipe recipe)`
- `public void verifySellingItem( ItemStack stack)`
- `public ITextComponent getDisplayName()`
