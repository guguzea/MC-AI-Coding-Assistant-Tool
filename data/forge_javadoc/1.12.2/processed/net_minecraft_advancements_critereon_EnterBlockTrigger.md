# EnterBlockTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.EnterBlockTrigger

## Class signature

```java
public class EnterBlockTrigger extends java.lang.Object implements ICriterionTrigger<EnterBlockTrigger.Instance>
```

## Constructors

- `EnterBlockTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EnterBlockTrigger.Instance> listener)`
- `EnterBlockTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EnterBlockTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, IBlockState state)`