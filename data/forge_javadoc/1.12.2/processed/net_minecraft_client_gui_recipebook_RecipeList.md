# RecipeList

## Class signature

```java
public class RecipeList extends java.lang.Object
```

## Constructors

- `public RecipeList()`

## Methods

- `public boolean isNotEmpty()`
- `public void updateKnownRecipes( RecipeBook book)`
- `public void canCraft( RecipeItemHelper handler, int width, int height, RecipeBook book)`
- `public boolean isCraftable( IRecipe recipe)`
- `public boolean containsCraftableRecipes()`
- `public boolean containsValidRecipes()`
- `public java.util.List< IRecipe > getRecipes()`
- `public java.util.List< IRecipe > getRecipes(boolean p_194208_1_)`
- `public java.util.List< IRecipe > getDisplayRecipes(boolean onlyCraftable)`
- `public void add( IRecipe recipe)`
- `public boolean hasSingleResultItem()`