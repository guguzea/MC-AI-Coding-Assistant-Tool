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