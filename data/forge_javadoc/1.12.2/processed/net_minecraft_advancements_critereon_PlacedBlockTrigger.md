# PlacedBlockTrigger

## Class signature

```java
public class PlacedBlockTrigger extends java.lang.Object implements ICriterionTrigger < PlacedBlockTrigger.Instance >
```

## Constructors

- `public PlacedBlockTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < PlacedBlockTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < PlacedBlockTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public PlacedBlockTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, BlockPos pos, ItemStack item)`