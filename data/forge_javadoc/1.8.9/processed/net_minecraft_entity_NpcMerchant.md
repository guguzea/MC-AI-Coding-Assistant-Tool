# NpcMerchant

## Class signature

```java
public class NpcMerchant extends java.lang.Object implements IMerchant
```

## Constructors

- `public NpcMerchant( EntityPlayer p_i45817_1_, IChatComponent p_i45817_2_)`

## Methods

- `public EntityPlayer getCustomer()`
- `public void setCustomer( EntityPlayer p_70932_1_)`
- `public MerchantRecipeList getRecipes( EntityPlayer p_70934_1_)`
- `public void setRecipes( MerchantRecipeList recipeList)`
- `public void useRecipe( MerchantRecipe recipe)`
- `public void verifySellingItem( ItemStack stack)`
- `public IChatComponent getDisplayName()`

## Description

Get the formatted ChatComponent that will be used for the sender's username in chat