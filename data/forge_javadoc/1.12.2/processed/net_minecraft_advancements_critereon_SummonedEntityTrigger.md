# SummonedEntityTrigger

## Class signature

```java
public class SummonedEntityTrigger extends java.lang.Object implements ICriterionTrigger < SummonedEntityTrigger.Instance >
```

## Constructors

- `public SummonedEntityTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < SummonedEntityTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < SummonedEntityTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public SummonedEntityTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, Entity entity)`