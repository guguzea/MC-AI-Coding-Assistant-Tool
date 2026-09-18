# UsedTotemTrigger

## Class signature

```java
public class UsedTotemTrigger extends java.lang.Object implements ICriterionTrigger < UsedTotemTrigger.Instance >
```

## Constructors

- `public UsedTotemTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < UsedTotemTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < UsedTotemTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public UsedTotemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, ItemStack item)`