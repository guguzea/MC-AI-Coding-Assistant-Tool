# ChangeDimensionTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.ChangeDimensionTrigger

## Class signature

```java
public class ChangeDimensionTrigger extends java.lang.Object implements ICriterionTrigger<ChangeDimensionTrigger.Instance>
```

## Constructors

- `ChangeDimensionTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ChangeDimensionTrigger.Instance> listener)`
- `ChangeDimensionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ChangeDimensionTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, DimensionType from, DimensionType to)`