# UsedTotemTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.UsedTotemTrigger

## Class signature

```java
public class UsedTotemTrigger extends java.lang.Object implements ICriterionTrigger<UsedTotemTrigger.Instance>
```

## Constructors

- `UsedTotemTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<UsedTotemTrigger.Instance> listener)`
- `UsedTotemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<UsedTotemTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, ItemStack item)`