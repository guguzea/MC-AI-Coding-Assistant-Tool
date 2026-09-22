# ItemDurabilityTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.ItemDurabilityTrigger

## Class signature

```java
public class ItemDurabilityTrigger extends java.lang.Object implements ICriterionTrigger<ItemDurabilityTrigger.Instance>
```

## Constructors

- `ItemDurabilityTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ItemDurabilityTrigger.Instance> listener)`
- `ItemDurabilityTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ItemDurabilityTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, ItemStack itemIn, int newDurability)`