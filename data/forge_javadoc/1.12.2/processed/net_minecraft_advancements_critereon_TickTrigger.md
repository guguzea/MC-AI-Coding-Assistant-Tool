# TickTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.TickTrigger

## Class signature

```java
public class TickTrigger extends java.lang.Object implements ICriterionTrigger<TickTrigger.Instance>
```

## Constructors

- `TickTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<TickTrigger.Instance> listener)`
- `TickTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<TickTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player)`

## Fields

- `static ResourceLocation ID`