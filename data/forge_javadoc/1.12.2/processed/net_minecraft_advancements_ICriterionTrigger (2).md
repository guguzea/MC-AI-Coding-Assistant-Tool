# ICriterionTrigger

## Class signature

```java
public interface ICriterionTrigger<T extends ICriterionInstance >
```

## Methods

- `ResourceLocation getId()`
- `void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < T > listener)`
- `void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < T > listener)`
- `void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `T deserializeInstance(JsonObject json, JsonDeserializationContext context)`