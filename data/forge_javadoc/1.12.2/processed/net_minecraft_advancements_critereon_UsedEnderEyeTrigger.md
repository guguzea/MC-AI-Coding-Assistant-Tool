# UsedEnderEyeTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.UsedEnderEyeTrigger

## Class signature

```java
public class UsedEnderEyeTrigger extends java.lang.Object implements ICriterionTrigger<UsedEnderEyeTrigger.Instance>
```

## Constructors

- `UsedEnderEyeTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<UsedEnderEyeTrigger.Instance> listener)`
- `UsedEnderEyeTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<UsedEnderEyeTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, BlockPos pos)`