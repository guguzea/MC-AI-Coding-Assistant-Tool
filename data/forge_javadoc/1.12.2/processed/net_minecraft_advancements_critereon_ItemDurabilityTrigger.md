# ItemDurabilityTrigger

## Class signature

```java
public class ItemDurabilityTrigger extends java.lang.Object implements ICriterionTrigger < ItemDurabilityTrigger.Instance >
```

## Constructors

- `public ItemDurabilityTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ItemDurabilityTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ItemDurabilityTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public ItemDurabilityTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, ItemStack itemIn, int newDurability)`