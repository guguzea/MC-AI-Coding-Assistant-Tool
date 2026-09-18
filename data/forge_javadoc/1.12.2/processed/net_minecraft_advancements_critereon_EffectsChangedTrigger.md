# EffectsChangedTrigger

## Class signature

```java
public class EffectsChangedTrigger extends java.lang.Object implements ICriterionTrigger < EffectsChangedTrigger.Instance >
```

## Constructors

- `public EffectsChangedTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EffectsChangedTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EffectsChangedTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public EffectsChangedTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player)`