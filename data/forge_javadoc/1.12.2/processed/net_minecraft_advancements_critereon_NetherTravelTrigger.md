# NetherTravelTrigger

## Class signature

```java
public class NetherTravelTrigger extends java.lang.Object implements ICriterionTrigger < NetherTravelTrigger.Instance >
```

## Constructors

- `public NetherTravelTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < NetherTravelTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < NetherTravelTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public NetherTravelTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, Vec3d enteredNetherPosition)`