# IMerchant

## Class signature

```java
public interface IMerchant
```

## Methods

- `EntityPlayer getCustomer()`
- `ITextComponent getDisplayName()`
- `MerchantRecipeList getRecipes(EntityPlayer player)`
- `void setCustomer(EntityPlayer player)`
- `void setRecipes(MerchantRecipeList recipeList)`
- `void useRecipe(MerchantRecipe recipe)`
- `void verifySellingItem(ItemStack stack)`