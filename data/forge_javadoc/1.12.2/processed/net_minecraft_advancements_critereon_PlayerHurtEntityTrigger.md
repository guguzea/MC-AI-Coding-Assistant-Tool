# PlayerHurtEntityTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.PlayerHurtEntityTrigger

## Class signature

```java
public class PlayerHurtEntityTrigger extends java.lang.Object implements ICriterionTrigger<PlayerHurtEntityTrigger.Instance>
```

## Constructors

- `PlayerHurtEntityTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PlayerHurtEntityTrigger.Instance> listener)`
- `PlayerHurtEntityTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PlayerHurtEntityTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, Entity entityIn, DamageSource source, float amountDealt, float amountTaken, boolean blocked)`