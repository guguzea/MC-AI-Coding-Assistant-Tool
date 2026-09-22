# EnchantedItemTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.EnchantedItemTrigger

## Class signature

```java
public class EnchantedItemTrigger extends java.lang.Object implements ICriterionTrigger<EnchantedItemTrigger.Instance>
```

## Constructors

- `EnchantedItemTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EnchantedItemTrigger.Instance> listener)`
- `EnchantedItemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EnchantedItemTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, ItemStack item, int levelsSpent)`