# RecipeBook

**Inheritance:** java.lang.Object → net.minecraft.stats.RecipeBook

## Class signature

```java
public class RecipeBook extends java.lang.Object
```

## Constructors

- `RecipeBook()`

## Methods

- `void copyFrom(RecipeBook that)`
- `@Deprecated protected static int getRecipeId(IRecipe recipe)`
- `boolean isFilteringCraftable()`
- `boolean isGuiOpen()`
- `boolean isNew(IRecipe recipe)`
- `boolean isUnlocked(IRecipe recipe)`
- `void lock(IRecipe recipe)`
- `void markNew(IRecipe recipe)`
- `void markSeen(IRecipe recipe)`
- `void setFilteringCraftable(boolean shouldFilter)`
- `void setGuiOpen(boolean open)`
- `void unlock(IRecipe recipe)`

## Fields

- `protected boolean isFilteringCraftable`
- `protected boolean isGuiOpen`
- `protected java.util.BitSet newRecipes`
- `protected java.util.BitSet recipes`