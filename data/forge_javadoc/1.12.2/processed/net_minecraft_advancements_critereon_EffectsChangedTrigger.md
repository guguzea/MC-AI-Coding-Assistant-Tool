# EffectsChangedTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.EffectsChangedTrigger

## Class signature

```java
public class EffectsChangedTrigger extends java.lang.Object implements ICriterionTrigger<EffectsChangedTrigger.Instance>
```

## Constructors

- `EffectsChangedTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EffectsChangedTrigger.Instance> listener)`
- `EffectsChangedTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EffectsChangedTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player)`