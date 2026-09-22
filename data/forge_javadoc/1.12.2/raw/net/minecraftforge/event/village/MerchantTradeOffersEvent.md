---
title: "MerchantTradeOffersEvent"
description: "public class MerchantTradeOffersEvent extends Event"
package: "net/minecraftforge/event/village"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/village/MerchantTradeOffersEvent.html"
sourceType: javadoc
---

# MerchantTradeOffersEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.village.MerchantTradeOffersEvent

## Class signature

```java
public class MerchantTradeOffersEvent extends Event
```

## Constructors

- `MerchantTradeOffersEvent(IMerchant merchant, EntityPlayer player, MerchantRecipeList list)`

## Methods

- `MerchantRecipeList getList()` — The recipe list (if not null ) returned from this function may be modified.
- `IMerchant getMerchant()`
- `EntityPlayer getPlayer()`
- `void setList(MerchantRecipeList list)`
