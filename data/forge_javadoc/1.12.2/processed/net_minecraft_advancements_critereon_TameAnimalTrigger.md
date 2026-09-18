# TameAnimalTrigger

## Class signature

```java
public class TameAnimalTrigger extends java.lang.Object implements ICriterionTrigger < TameAnimalTrigger.Instance >
```

## Constructors

- `public TameAnimalTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < TameAnimalTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < TameAnimalTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public TameAnimalTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, EntityAnimal entity)`