# BredAnimalsTrigger

## Class signature

```java
public class BredAnimalsTrigger extends java.lang.Object implements ICriterionTrigger < BredAnimalsTrigger.Instance >
```

## Constructors

- `public BredAnimalsTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < BredAnimalsTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < BredAnimalsTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public BredAnimalsTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, EntityAnimal parent1, EntityAnimal parent2, EntityAgeable child)`