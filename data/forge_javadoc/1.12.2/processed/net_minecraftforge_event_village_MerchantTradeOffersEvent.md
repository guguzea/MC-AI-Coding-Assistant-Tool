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