# MerchantTradeOffersEvent

## Class signature

```java
public class MerchantTradeOffersEvent extends Event
```

## Constructors

- `public MerchantTradeOffersEvent( IMerchant merchant, EntityPlayer player, MerchantRecipeList list)`

## Methods

- `public MerchantRecipeList getList()`
- `public void setList( MerchantRecipeList list)`
- `public IMerchant getMerchant()`
- `public EntityPlayer getPlayer()`

## Description

MerchantTradeOffersEvent is fired when a list of villager trade offers is presented in IMerchant.getRecipes(EntityPlayer) , allowing mods to modify trade offers depending on the player. Be warned that