# NpcMerchant

**Inheritance:** java.lang.Object → net.minecraft.entity.NpcMerchant

## Class signature

```java
public class NpcMerchant extends java.lang.Object implements IMerchant
```

## Constructors

- `NpcMerchant(EntityPlayer customerIn, ITextComponent nameIn)`

## Methods

- `EntityPlayer getCustomer()`
- `ITextComponent getDisplayName()`
- `MerchantRecipeList getRecipes(EntityPlayer player)`
- `void setCustomer(EntityPlayer player)`
- `void setRecipes(MerchantRecipeList recipeList)`
- `void useRecipe(MerchantRecipe recipe)`
- `void verifySellingItem(ItemStack stack)`