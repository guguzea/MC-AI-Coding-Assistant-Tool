# IMerchant

## Class signature

```java
public interface IMerchant
```

## Methods

- `EntityPlayer getCustomer()`
- `ITextComponent getDisplayName()`
- `BlockPos getPos()`
- `MerchantRecipeList getRecipes(EntityPlayer player)`
- `World getWorld()`
- `void setCustomer(EntityPlayer player)`
- `void setRecipes(MerchantRecipeList recipeList)`
- `void useRecipe(MerchantRecipe recipe)`
- `void verifySellingItem(ItemStack stack)`