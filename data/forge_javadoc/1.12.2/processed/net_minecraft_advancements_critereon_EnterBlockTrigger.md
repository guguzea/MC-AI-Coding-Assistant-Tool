# EnterBlockTrigger

## Class signature

```java
public class EnterBlockTrigger extends java.lang.Object implements ICriterionTrigger < EnterBlockTrigger.Instance >
```

## Constructors

- `public EnterBlockTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EnterBlockTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EnterBlockTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public EnterBlockTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, IBlockState state)`