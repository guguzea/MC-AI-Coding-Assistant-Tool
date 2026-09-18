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