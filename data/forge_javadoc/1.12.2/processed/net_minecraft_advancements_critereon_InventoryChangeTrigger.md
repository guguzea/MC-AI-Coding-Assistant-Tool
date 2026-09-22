# InventoryChangeTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.InventoryChangeTrigger

## Class signature

```java
public class InventoryChangeTrigger extends java.lang.Object implements ICriterionTrigger<InventoryChangeTrigger.Instance>
```

## Constructors

- `InventoryChangeTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<InventoryChangeTrigger.Instance> listener)`
- `InventoryChangeTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<InventoryChangeTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, InventoryPlayer inventory)`