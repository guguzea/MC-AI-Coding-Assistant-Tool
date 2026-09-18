# KilledTrigger

## Class signature

```java
public class KilledTrigger extends java.lang.Object implements ICriterionTrigger < KilledTrigger.Instance >
```

## Constructors

- `public KilledTrigger( ResourceLocation id)`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < KilledTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < KilledTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public KilledTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, Entity entity, DamageSource source)`