# BredAnimalsTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.BredAnimalsTrigger

## Class signature

```java
public class BredAnimalsTrigger extends java.lang.Object implements ICriterionTrigger<BredAnimalsTrigger.Instance>
```

## Constructors

- `BredAnimalsTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<BredAnimalsTrigger.Instance> listener)`
- `BredAnimalsTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<BredAnimalsTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, EntityAnimal parent1, EntityAnimal parent2, EntityAgeable child)`