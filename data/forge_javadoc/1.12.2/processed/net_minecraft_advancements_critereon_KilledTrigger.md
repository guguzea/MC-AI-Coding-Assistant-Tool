# KilledTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.KilledTrigger

## Class signature

```java
public class KilledTrigger extends java.lang.Object implements ICriterionTrigger<KilledTrigger.Instance>
```

## Constructors

- `KilledTrigger(ResourceLocation id)`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<KilledTrigger.Instance> listener)`
- `KilledTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<KilledTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, Entity entity, DamageSource source)`