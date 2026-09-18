---
title: "MerchantRecipeList"
description: "public class MerchantRecipeList extends java.util.ArrayList< MerchantRecipe >"
package: "net/minecraft/village"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/village/MerchantRecipeList.html"
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

- `@Nullable public MerchantRecipe canRecipeBeUsed( ItemStack p_77203_1_, @Nullable ItemStack p_77203_2_, int p_77203_3_)`
- `public void writeToBuf( PacketBuffer buffer)`
- `public void readRecipiesFromTags( NBTTagCompound compound)`
- `public NBTTagCompound getRecipiesAsTags()`
- `public static MerchantRecipeList readFromBuf( PacketBuffer buffer) throws java.io.IOException`
