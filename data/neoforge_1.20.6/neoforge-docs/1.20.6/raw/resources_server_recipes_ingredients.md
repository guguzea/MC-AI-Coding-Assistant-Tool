---
title: "Ingredients"
version: "1.20.6"
pageId: "resources/server/recipes/ingredients"
url: "https://docs.neoforged.net/docs/1.20.6/resources/server/recipes/ingredients/"
platform: "neoforge"
fetchedAt: "2026-09-12T12:02:00.417Z"
---
# Ingredients

`Ingredient`s are predicate handlers for item-based inputs which check whether a certain `ItemStack` meets the condition to be a valid input in a recipe. All [vanilla recipes](https://minecraft.wiki/w/Recipe#List_of_recipe_types) that take inputs use an `Ingredient` or a list of `Ingredient`s, which is then merged into a single `Ingredient`.

## Custom Ingredients

Custom ingredients can be specified by setting `type` to the name of the [ingredient's serializer][serializer], with the exception of [compound ingredients](#compoundingredient). When no type is specified, the vanilla ingredient is used. Custom ingredients can also easily be used in [data generation](/docs/1.20.6/datagen/recipes) by calling `ICustomIngredient#toVanilla`.

### NeoForge Types

NeoForge provides a few additional `Ingredient` types for programmers to implement.

#### CompoundIngredient

Though they are functionally identical, compound ingredients replaces the way one would implement a list of ingredients in a recipe. They work as a set OR where the passed in stack must be within at least one of the supplied ingredients. This change was made to allow custom ingredients to work correctly within lists. As such, **no type** needs to be specified.

```json5

// For some input

[

    // At least one of these ingredients must match to succeed

    {

      // Ingredient

    },

    {

        // Custom ingredient

        "type": "examplemod:example_ingredient"

    }

]

```

#### DataComponentIngredient

`DataComponentIngredient`s compare the item, damage, and [data components](/docs/1.20.6/items/datacomponents) on an `ItemStack`. When `strict` is `true`, the `ItemStack` is checked for an exact match. Otherwise, if only the components specified match, the ingredient will pass. This can be used by specifying the `type` as `neoforge:components`.

```json5

// For some input

{

    "type": "neoforge:components",

    // Can be either a single item or list of items

    "items": "examplemod:example_item",

    "components": {

        // Add component information

    },

    // true requires an exact match

    // false only requires a match of the specified components

    "strict": true

}

```

### IntersectionIngredient

`IntersectionIngredient`s work as a set AND where the passed in stack must match all supplied ingredients. There must be at least two ingredients supplied to this. This can be used by specifying the `type` as `neoforge:intersection`.

```json5

// For some input

{

    "type": "neoforge:intersection",

    // All of these ingredients must return true to succeed

    "children": [

        {

            // Ingredient 1

        },

        {

            // Ingredient 2

        }

        // ...

    ]

}

```

### DifferenceIngredient

`DifferenceIngredient`s work as a set subtraction (SUB) where the passed in stack must match the first ingredient but must not match the second ingredient. This can be used by specifying the `type` as `neoforge:difference`.

```json5

// For some input

{

    "type": "neoforge:difference",

    "base": {

        // Ingredient the stack is in

    },

    "subtracted": {

        // Ingredient the stack is NOT in

    }

}

```

## Creating Custom Ingredients

Custom ingredients can be created by implementing `ICustomIngredient` and [registering](/docs/1.20.6/concepts/registries) the associated [IngredientType](#ingredienttype) to `NeoForgeRegistries.Keys.INGREDIENT_TYPES`.

### ICustomIngredient

There are four important methods to implement:

| Method | Description |
| --- | --- |
| test | Returns true if the stack matches this ingredient. |
| getItems | Returns the list of stacks this ingredient accepts; however, this does not need to be exhaustive as it is only for display purposes |
| isSimple | Returns false if information on the stack needs to be tested, or true if only the item needs to be checked |
| getType | Returns the type of this ingredient |

### IngredientType

`IngredientType` contains two values: a [map codec](/docs/1.20.6/datastorage/codecs) used to encode and decode the ingredient, and a [StreamCodec](/docs/1.20.6/networking/streamcodecs) to sync the ingredient if `ICustomIngredient#isSimple` returns `false`. If `#isSimple` is `true`, then `IngredientType` has a constructor overload that only takes in the map codec.

The `IngredientType` needs to be [registered](/docs/1.20.6/concepts/registries).

```java

// For some DeferredRegister<IngredientType<?>> REGISTRAR

public static final DeferredHolder<IngredientType<?>, IngredientType<ExampleIngredient>> EXAMPLE_INGREDIENT = REGISTRAR.register(

  "example_ingredient", () -> new IngredientType(...)

);

// In ExampleIngredient

@Override

public IngredientType<?> getType() {

  return EXAMPLE_INGREDIENT.get();

}

```
