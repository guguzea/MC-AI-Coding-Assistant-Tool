# RecipeUnlockedTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.RecipeUnlockedTrigger

## Class signature

```java
public class RecipeUnlockedTrigger extends java.lang.Object implements ICriterionTrigger<RecipeUnlockedTrigger.Instance>
```

## Constructors

- `RecipeUnlockedTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<RecipeUnlockedTrigger.Instance> listener)`
- `RecipeUnlockedTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<RecipeUnlockedTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, IRecipe recipe)`