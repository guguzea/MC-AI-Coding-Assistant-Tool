# IMerchant

## Class signature

```java
public interface IMerchant
```

## Methods

- `EntityPlayer getCustomer()`
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `MerchantRecipeList getRecipes(EntityPlayer p_70934_1_)`
- `void setCustomer(EntityPlayer p_70932_1_)`
- `void setRecipes(MerchantRecipeList recipeList)`
- `void useRecipe(MerchantRecipe recipe)`
- `void verifySellingItem(ItemStack stack)` — Notifies the merchant of a possible merchantrecipe being fulfilled or not.