# LevitationTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.LevitationTrigger

## Class signature

```java
public class LevitationTrigger extends java.lang.Object implements ICriterionTrigger<LevitationTrigger.Instance>
```

## Constructors

- `LevitationTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<LevitationTrigger.Instance> listener)`
- `LevitationTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<LevitationTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, Vec3d startPos, int duration)`