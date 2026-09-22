# VillagerTradeTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.VillagerTradeTrigger

## Class signature

```java
public class VillagerTradeTrigger extends java.lang.Object implements ICriterionTrigger<VillagerTradeTrigger.Instance>
```

## Constructors

- `VillagerTradeTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<VillagerTradeTrigger.Instance> listener)`
- `VillagerTradeTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<VillagerTradeTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, EntityVillager villager, ItemStack item)`