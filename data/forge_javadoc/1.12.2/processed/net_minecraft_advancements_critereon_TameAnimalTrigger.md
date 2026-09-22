# TameAnimalTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.TameAnimalTrigger

## Class signature

```java
public class TameAnimalTrigger extends java.lang.Object implements ICriterionTrigger<TameAnimalTrigger.Instance>
```

## Constructors

- `TameAnimalTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<TameAnimalTrigger.Instance> listener)`
- `TameAnimalTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<TameAnimalTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, EntityAnimal entity)`