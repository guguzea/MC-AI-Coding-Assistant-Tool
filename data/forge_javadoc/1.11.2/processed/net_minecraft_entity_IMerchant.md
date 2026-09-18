# IMerchant

## Class signature

```java
public interface IMerchant
```

## Methods

- `void setCustomer( EntityPlayer player)`
- `EntityPlayer getCustomer()`
- `@Nullable MerchantRecipeList getRecipes( EntityPlayer player)`
- `void setRecipes(@Nullable MerchantRecipeList recipeList)`
- `void useRecipe( MerchantRecipe recipe)`
- `void verifySellingItem( ItemStack stack)`
- `ITextComponent getDisplayName()`
- `World getWorld()`
- `BlockPos getPos()`