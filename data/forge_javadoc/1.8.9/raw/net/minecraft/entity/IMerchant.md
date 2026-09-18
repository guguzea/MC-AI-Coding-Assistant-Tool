---
title: "IMerchant"
description: "Get the formatted ChatComponent that will be used for the sender's username in chat"
package: "net/minecraft/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/IMerchant.html"
sourceType: javadoc
---

# IMerchant

## Class signature

```java
public interface IMerchant
```

## Methods

- `void setCustomer( EntityPlayer p_70932_1_)`
- `EntityPlayer getCustomer()`
- `MerchantRecipeList getRecipes( EntityPlayer p_70934_1_)`
- `void setRecipes( MerchantRecipeList recipeList)`
- `void useRecipe( MerchantRecipe recipe)`
- `void verifySellingItem( ItemStack stack)`
- `IChatComponent getDisplayName()`

## Description

Get the formatted ChatComponent that will be used for the sender's username in chat
