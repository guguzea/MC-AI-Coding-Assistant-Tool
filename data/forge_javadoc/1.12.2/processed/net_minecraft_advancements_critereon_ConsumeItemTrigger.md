# ConsumeItemTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.ConsumeItemTrigger

## Class signature

```java
public class ConsumeItemTrigger extends java.lang.Object implements ICriterionTrigger<ConsumeItemTrigger.Instance>
```

## Constructors

- `ConsumeItemTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ConsumeItemTrigger.Instance> listener)`
- `ConsumeItemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ConsumeItemTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, ItemStack item)`