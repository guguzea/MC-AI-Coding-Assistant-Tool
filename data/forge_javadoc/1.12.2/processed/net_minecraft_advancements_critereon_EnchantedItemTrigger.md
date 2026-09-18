# EnchantedItemTrigger

## Class signature

```java
public class EnchantedItemTrigger extends java.lang.Object implements ICriterionTrigger < EnchantedItemTrigger.Instance >
```

## Constructors

- `public EnchantedItemTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EnchantedItemTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EnchantedItemTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public EnchantedItemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, ItemStack item, int levelsSpent)`