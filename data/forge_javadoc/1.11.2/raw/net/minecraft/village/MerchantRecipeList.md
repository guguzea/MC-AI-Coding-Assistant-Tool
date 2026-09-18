---
title: "MerchantRecipeList"
description: "public class MerchantRecipeList extends java.util.ArrayList< MerchantRecipe >"
package: "net/minecraft/village"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/village/MerchantRecipeList.html"
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

- `@Nullable public MerchantRecipe canRecipeBeUsed( ItemStack stack0, ItemStack stack1, int index)`
- `public void writeToBuf( PacketBuffer buffer)`
- `public void readRecipiesFromTags( NBTTagCompound compound)`
- `public NBTTagCompound getRecipiesAsTags()`
- `public static MerchantRecipeList readFromBuf( PacketBuffer buffer) throws java.io.IOException`
