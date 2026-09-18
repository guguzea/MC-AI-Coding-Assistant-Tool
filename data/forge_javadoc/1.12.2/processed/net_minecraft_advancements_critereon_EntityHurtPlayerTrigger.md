# EntityHurtPlayerTrigger

## Class signature

```java
public class EntityHurtPlayerTrigger extends java.lang.Object implements ICriterionTrigger < EntityHurtPlayerTrigger.Instance >
```

## Constructors

- `public EntityHurtPlayerTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EntityHurtPlayerTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EntityHurtPlayerTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public EntityHurtPlayerTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, DamageSource source, float amountDealt, float amountTaken, boolean wasBlocked)`