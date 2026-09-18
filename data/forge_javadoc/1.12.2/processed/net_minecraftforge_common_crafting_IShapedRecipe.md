# IShapedRecipe

## Class signature

```java
public interface IShapedRecipe extends IRecipe
```

## Methods

- `int getRecipeWidth()`
- `int getRecipeHeight()`

## Description

Used to mark a recipe that shape matters so that the recipe book and auto crafting picks the correct shape. Note: These methods can't be named 'getHeight' or 'getWidth' due to obfusication issues.