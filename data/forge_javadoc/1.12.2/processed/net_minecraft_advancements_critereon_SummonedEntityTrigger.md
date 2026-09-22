# SummonedEntityTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.SummonedEntityTrigger

## Class signature

```java
public class SummonedEntityTrigger extends java.lang.Object implements ICriterionTrigger<SummonedEntityTrigger.Instance>
```

## Constructors

- `SummonedEntityTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<SummonedEntityTrigger.Instance> listener)`
- `SummonedEntityTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<SummonedEntityTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, Entity entity)`