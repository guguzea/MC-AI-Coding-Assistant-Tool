# BrewedPotionTrigger

## Class signature

```java
public class BrewedPotionTrigger extends java.lang.Object implements ICriterionTrigger < BrewedPotionTrigger.Instance >
```

## Constructors

- `public BrewedPotionTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < BrewedPotionTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < BrewedPotionTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public BrewedPotionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, PotionType potionIn)`