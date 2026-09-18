# NpcMerchant

## Class signature

```java
public class NpcMerchant extends java.lang.Object implements IMerchant
```

## Constructors

- `public NpcMerchant( EntityPlayer customerIn, ITextComponent nameIn)`

## Methods

- `public EntityPlayer getCustomer()`
- `public void setCustomer( EntityPlayer player)`
- `public MerchantRecipeList getRecipes( EntityPlayer player)`
- `public void setRecipes( MerchantRecipeList recipeList)`
- `public void useRecipe( MerchantRecipe recipe)`
- `public void verifySellingItem( ItemStack stack)`
- `public ITextComponent getDisplayName()`
- `public World getWorld()`
- `public BlockPos getPos()`