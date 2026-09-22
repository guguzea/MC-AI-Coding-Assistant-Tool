# CuredZombieVillagerTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.CuredZombieVillagerTrigger

## Class signature

```java
public class CuredZombieVillagerTrigger extends java.lang.Object implements ICriterionTrigger<CuredZombieVillagerTrigger.Instance>
```

## Constructors

- `CuredZombieVillagerTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<CuredZombieVillagerTrigger.Instance> listener)`
- `CuredZombieVillagerTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<CuredZombieVillagerTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, EntityZombie zombie, EntityVillager villager)`