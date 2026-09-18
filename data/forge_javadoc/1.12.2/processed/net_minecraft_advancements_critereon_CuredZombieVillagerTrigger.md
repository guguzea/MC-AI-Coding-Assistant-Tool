# CuredZombieVillagerTrigger

## Class signature

```java
public class CuredZombieVillagerTrigger extends java.lang.Object implements ICriterionTrigger < CuredZombieVillagerTrigger.Instance >
```

## Constructors

- `public CuredZombieVillagerTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < CuredZombieVillagerTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < CuredZombieVillagerTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public CuredZombieVillagerTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, EntityZombie zombie, EntityVillager villager)`