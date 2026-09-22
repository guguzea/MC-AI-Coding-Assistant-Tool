# ConstructBeaconTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.ConstructBeaconTrigger

## Class signature

```java
public class ConstructBeaconTrigger extends java.lang.Object implements ICriterionTrigger<ConstructBeaconTrigger.Instance>
```

## Constructors

- `ConstructBeaconTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ConstructBeaconTrigger.Instance> listener)`
- `ConstructBeaconTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ConstructBeaconTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, TileEntityBeacon beacon)`