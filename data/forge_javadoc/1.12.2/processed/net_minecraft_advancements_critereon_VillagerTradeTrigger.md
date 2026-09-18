# VillagerTradeTrigger

## Class signature

```java
public class VillagerTradeTrigger extends java.lang.Object implements ICriterionTrigger < VillagerTradeTrigger.Instance >
```

## Constructors

- `public VillagerTradeTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < VillagerTradeTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < VillagerTradeTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public VillagerTradeTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, EntityVillager villager, ItemStack item)`