# RecipeSorter

**Inheritance:** java.lang.Object → net.minecraftforge.oredict.RecipeSorter

## Class signature

```java
public class RecipeSorter extends java.lang.Object implements java.util.Comparator<IRecipe>
```

## Methods

- `int compare(IRecipe r1, IRecipe r2)`
- `static RecipeSorter.Category getCategory(java.lang.Class<?> recipe)`
- `static RecipeSorter.Category getCategory(IRecipe recipe)`
- `static void register(java.lang.String name, java.lang.Class<?> recipe, RecipeSorter.Category category, java.lang.String dependencies)`
- `static void setCategory(java.lang.Class<?> recipe, RecipeSorter.Category category)`
- `static void sortCraftManager()`

## Fields

- `static RecipeSorter INSTANCE`