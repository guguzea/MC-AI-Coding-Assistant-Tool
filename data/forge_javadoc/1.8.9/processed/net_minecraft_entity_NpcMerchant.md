# NpcMerchant

**Inheritance:** java.lang.Object → net.minecraft.entity.NpcMerchant

## Class signature

```java
public class NpcMerchant extends java.lang.Object implements IMerchant
```

## Constructors

- `NpcMerchant(EntityPlayer p_i45817_1_, IChatComponent p_i45817_2_)`

## Methods

- `EntityPlayer getCustomer()`
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `MerchantRecipeList getRecipes(EntityPlayer p_70934_1_)`
- `void setCustomer(EntityPlayer p_70932_1_)`
- `void setRecipes(MerchantRecipeList recipeList)`
- `void useRecipe(MerchantRecipe recipe)`
- `void verifySellingItem(ItemStack stack)` — Notifies the merchant of a possible merchantrecipe being fulfilled or not.