---
title: "RecipeSorter"
description: "public class RecipeSorter extends java.lang.Object implements java.util.Comparator< IRecipe >"
package: "net/minecraftforge/oredict"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/oredict/RecipeSorter.html"
sourceType: javadoc
---

# RecipeSorter

## Class signature

```java
public class RecipeSorter extends java.lang.Object implements java.util.Comparator< IRecipe >
```

## Methods

- `public int compare( IRecipe r1, IRecipe r2)`
- `public static void sortCraftManager()`
- `public static void register(java.lang.String name, java.lang.Class<?> recipe, RecipeSorter.Category category, java.lang.String dependencies)`
- `public static void setCategory(java.lang.Class<?> recipe, RecipeSorter.Category category)`
- `public static RecipeSorter.Category getCategory( IRecipe recipe)`
- `public static RecipeSorter.Category getCategory(java.lang.Class<?> recipe)`
