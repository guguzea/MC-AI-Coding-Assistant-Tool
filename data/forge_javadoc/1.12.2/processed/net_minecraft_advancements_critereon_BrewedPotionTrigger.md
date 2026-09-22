# BrewedPotionTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.BrewedPotionTrigger

## Class signature

```java
public class BrewedPotionTrigger extends java.lang.Object implements ICriterionTrigger<BrewedPotionTrigger.Instance>
```

## Constructors

- `BrewedPotionTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<BrewedPotionTrigger.Instance> listener)`
- `BrewedPotionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<BrewedPotionTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, PotionType potionIn)`