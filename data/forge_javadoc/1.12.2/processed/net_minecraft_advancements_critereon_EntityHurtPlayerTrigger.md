# EntityHurtPlayerTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.EntityHurtPlayerTrigger

## Class signature

```java
public class EntityHurtPlayerTrigger extends java.lang.Object implements ICriterionTrigger<EntityHurtPlayerTrigger.Instance>
```

## Constructors

- `EntityHurtPlayerTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EntityHurtPlayerTrigger.Instance> listener)`
- `EntityHurtPlayerTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EntityHurtPlayerTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, DamageSource source, float amountDealt, float amountTaken, boolean wasBlocked)`