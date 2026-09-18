# ChangeDimensionTrigger

## Class signature

```java
public class ChangeDimensionTrigger extends java.lang.Object implements ICriterionTrigger < ChangeDimensionTrigger.Instance >
```

## Constructors

- `public ChangeDimensionTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ChangeDimensionTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ChangeDimensionTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public ChangeDimensionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, DimensionType from, DimensionType to)`