# CraftingManager

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.CraftingManager

## Class signature

```java
public class CraftingManager extends java.lang.Object
```

## Constructors

- `CraftingManager()`

## Methods

- `static IRecipe findMatchingRecipe(InventoryCrafting craftMatrix, World worldIn)`
- `static ItemStack findMatchingResult(InventoryCrafting craftMatrix, World worldIn)`
- `@Deprecated static int getIDForRecipe(IRecipe recipe)`
- `static IRecipe getRecipe(ResourceLocation name)`
- `@Deprecated static IRecipe getRecipeById(int id)`
- `static NonNullList<ItemStack> getRemainingItems(InventoryCrafting craftMatrix, World worldIn)`
- `static boolean init()`

## Fields

- `static RegistryNamespaced<ResourceLocation, IRecipe> REGISTRY`