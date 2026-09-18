# InventoryChangeTrigger

## Class signature

```java
public class InventoryChangeTrigger extends java.lang.Object implements ICriterionTrigger < InventoryChangeTrigger.Instance >
```

## Constructors

- `public InventoryChangeTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < InventoryChangeTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < InventoryChangeTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public InventoryChangeTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, InventoryPlayer inventory)`