---
title: "MerchantRecipeList"
description: "can par1,par2 be used to in crafting recipe par3"
package: "net/minecraft/village"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/village/MerchantRecipeList.html"
sourceType: javadoc
---

# MerchantRecipeList

## Class signature

```java
public class MerchantRecipeList extends java.util.ArrayList< MerchantRecipe >
```

## Constructors

- `public MerchantRecipeList()`
- `public MerchantRecipeList( NBTTagCompound compound)`

## Methods

- `public MerchantRecipe canRecipeBeUsed( ItemStack p_77203_1_, ItemStack p_77203_2_, int p_77203_3_)`
- `public void writeToBuf( PacketBuffer buffer)`
- `public void readRecipiesFromTags( NBTTagCompound compound)`
- `public NBTTagCompound getRecipiesAsTags()`
- `public static MerchantRecipeList readFromBuf( PacketBuffer buffer) throws java.io.IOException`

## Description

can par1,par2 be used to in crafting recipe par3
