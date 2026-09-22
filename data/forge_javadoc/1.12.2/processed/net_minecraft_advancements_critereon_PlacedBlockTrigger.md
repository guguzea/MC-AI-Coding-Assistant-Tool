# PlacedBlockTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.PlacedBlockTrigger

## Class signature

```java
public class PlacedBlockTrigger extends java.lang.Object implements ICriterionTrigger<PlacedBlockTrigger.Instance>
```

## Constructors

- `PlacedBlockTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PlacedBlockTrigger.Instance> listener)`
- `PlacedBlockTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PlacedBlockTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, BlockPos pos, ItemStack item)`