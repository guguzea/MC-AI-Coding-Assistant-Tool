# PositionTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.PositionTrigger

## Class signature

```java
public class PositionTrigger extends java.lang.Object implements ICriterionTrigger<PositionTrigger.Instance>
```

## Constructors

- `PositionTrigger(ResourceLocation id)`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PositionTrigger.Instance> listener)`
- `PositionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PositionTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player)`