# LevitationTrigger

## Class signature

```java
public class LevitationTrigger extends java.lang.Object implements ICriterionTrigger < LevitationTrigger.Instance >
```

## Constructors

- `public LevitationTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < LevitationTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < LevitationTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public LevitationTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, Vec3d startPos, int duration)`