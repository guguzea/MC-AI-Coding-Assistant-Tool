# RecipeSorter

**Inheritance:** java.lang.Object → net.minecraftforge.oredict.RecipeSorter

## Class signature

```java
public class RecipeSorter extends java.lang.Object implements java.util.Comparator<IRecipe>
```

## Methods

- `@Deprecated int compare(IRecipe r1, IRecipe r2)`
- `@Deprecated static RecipeSorter.Category getCategory(java.lang.Class<?> recipe)`
- `@Deprecated static RecipeSorter.Category getCategory(IRecipe recipe)`
- `@Deprecated static void register(java.lang.String name, java.lang.Class<?> recipe, RecipeSorter.Category category, java.lang.String dependencies)`
- `@Deprecated static void setCategory(java.lang.Class<?> recipe, RecipeSorter.Category category)`
- `@Deprecated static void sortCraftManager()`

## Fields

- `static RecipeSorter INSTANCE`