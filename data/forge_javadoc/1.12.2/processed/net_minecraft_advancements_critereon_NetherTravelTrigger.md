# NetherTravelTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.NetherTravelTrigger

## Class signature

```java
public class NetherTravelTrigger extends java.lang.Object implements ICriterionTrigger<NetherTravelTrigger.Instance>
```

## Constructors

- `NetherTravelTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<NetherTravelTrigger.Instance> listener)`
- `NetherTravelTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<NetherTravelTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, Vec3d enteredNetherPosition)`