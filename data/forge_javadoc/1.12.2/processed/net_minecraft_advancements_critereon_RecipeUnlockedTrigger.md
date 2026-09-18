# RecipeUnlockedTrigger

## Class signature

```java
public class RecipeUnlockedTrigger extends java.lang.Object implements ICriterionTrigger < RecipeUnlockedTrigger.Instance >
```

## Constructors

- `public RecipeUnlockedTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < RecipeUnlockedTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < RecipeUnlockedTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public RecipeUnlockedTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, IRecipe recipe)`