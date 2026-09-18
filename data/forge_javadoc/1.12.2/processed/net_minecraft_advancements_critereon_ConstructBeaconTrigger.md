# ConstructBeaconTrigger

## Class signature

```java
public class ConstructBeaconTrigger extends java.lang.Object implements ICriterionTrigger < ConstructBeaconTrigger.Instance >
```

## Constructors

- `public ConstructBeaconTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ConstructBeaconTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ConstructBeaconTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public ConstructBeaconTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, TileEntityBeacon beacon)`