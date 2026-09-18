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
- `World getWorld()`
- `BlockPos getPos()`