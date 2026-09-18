---
title: "MerchantTradeOffersEvent"
description: "MerchantTradeOffersEvent is fired when a list of villager trade offers is presented in IMerchant.getRecipes(EntityPlayer) , allowing mods to modify trade offers depending on the player. Be warned that"
package: "net/minecraftforge/event/village"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/village/MerchantTradeOffersEvent.html"
sourceType: javadoc
---

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
