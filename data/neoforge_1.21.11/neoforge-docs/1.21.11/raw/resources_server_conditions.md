---
title: "Conditions"
version: "1.21.11"
pageId: "resources/server/conditions"
url: "https://docs.neoforged.net/docs/1.21.11/resources/server/conditions/"
platform: "neoforge"
fetchedAt: "2026-09-12T12:09:39.803Z"
---
# Data Load Conditions

Sometimes, it is desirable to disable or enable certain features if another mod is present, or if any mod adds another type of ore, etc. For these use cases, NeoForge adds data load conditions. These were originally called recipe conditions, since recipes were the original use case for this system, but it has since been extended to other systems. This is also why some of the built-in conditions are limited to items.

Most JSON files can optionally declare a `neoforge:conditions` block in the root, which will be evaluated before the data file is actually loaded. Loading will continue if and only if all conditions pass, otherwise the data file will be ignored. (The exception to this rule are [loot tables](/docs/1.21.11/resources/server/loottables/), which will be replaced with an empty loot table instead.)

```json5

{

    "neoforge:conditions": [

        {

            // Condition 1

        },

        {

            // Condition 2

        },

        // ...

    ],

    // The rest of the data file

}

```

> **Note**
> note

If the value to load is not a map/object, it is stored within `neoforge:value`:

```json5

{

    "neoforge:conditions": [ /* ...*/ ],

    "neoforge:value": 2 // The value to load

}

```

For example, if we want to only load our file if a mod with id `examplemod` is present, our file would look something like this:

```json5

{

    "neoforge:conditions": [

        {

            "type": "neoforge:mod_loaded",

            "modid": "examplemod"

        }

    ],

    "type": "minecraft:crafting_shaped",

    // ...

}

```

> **Note**
> note

Most vanilla files have been patched to use conditions using the `ConditionalCodec` wrapper. However, not all systems, especially those not using a [codec](/docs/1.21.11/datastorage/codecs), can use conditions. To find out whether a data file can use conditions, check the backing codec definition.

## Built-In Conditions

### neoforge:always and neoforge:never

These consist of no data and return the expected value.

```json5

{

    // Will always return true (or false for "neoforge:never")

    "type": "neoforge:always"

}

```

> **Tip**
> tip

Using the `neoforge:never` condition very cleanly allows disabling any data file. Simply place a file with the following contents at the needed location:

```json5

{"neoforge:conditions":[{"type":"neoforge:never"}]}

```

Disabling files this way will **not** cause log spam.

### neoforge:not

This condition accepts another condition and inverts it.

```json5

{

    // Inverts the result of the stored condition

    "type": "neoforge:not",

    "value": {

        // Another condition

    }

}

```

### neoforge:and and neoforge:or

These conditions accept the condition(s) being operated upon and apply the expected logic. There is no limit to the amount of accepted conditions.

```json5

{

    // ANDs the stored conditions together (or ORs for "neoforge:or")

    "type": "neoforge:and",

    "values": [

        {

            // First condition

        },

        {

            // Second condition

        }

    ]

}

```

### neoforge:mod_loaded

This condition returns true if a mod with the given mod id is loaded, and false otherwise.

```json5

{

    "type": "neoforge:mod_loaded",

    // Returns true if "examplemod" is loaded

    "modid": "examplemod"

}

```

### neoforge:registered

This condition returns true if an object in a specific registry with the given registry name has been registered, and false otherwise.

```json5

{

    "type": "neoforge:registered",

    // The registry to check the value for

    // Defaults to `minecraft:item`

    "registry": "minecraft:item",

    // Returns true if "examplemod:example_item" has been registered

    "value": "examplemod:example_item"

}

```

### neoforge:tag_empty

This condition returns true if the given registry [tag](/docs/1.21.11/resources/server/tags) is empty, and false otherwise.

```json5

{

    "type": "neoforge:tag_empty",

    // The registry to check the tag for

    // Defaults to `minecraft:item`

    "registry": "minecraft:item",

    // Returns true if "examplemod:example_tag" is an empty tag

    "tag": "examplemod:example_tag"

}

```

### neoforge:feature_flags_enabled

This condition returns true if the provided [feature flags](/docs/1.21.11/advanced/featureflags) are enabled, and false otherwise.

```json5

{

    "type": "neoforge:feature_flags_enabled",

    // Returns true if the "examplemod:example_feature" is enabled

    "flags": [

        "examplemod:example_feature"

    ]

}

```

## Creating Custom Conditions

Custom conditions can be created by implementing `ICondition` and its `#test(IContext)` method, as well as creating a [map codec](/docs/1.21.11/datastorage/codecs) for it. The `IContext` parameter in `#test` has access to some parts of the game state. Currently, this only allows you to query tags from registries. Some objects with conditions may be loaded earlier than tags, in which case the context will be `IContext.EMPTY` and not contain any tag information at all.

For example, let's assume we want to implement an `xor` condition, then our condition would look something like this:

```java

public record XorCondition(ICondition first, ICondition second) implements ICondition {

    public static final MapCodec<XorCondition> CODEC = RecordCodecBuilder.mapCodec(inst -> inst.group(

            ICondition.CODEC.fieldOf("first").forGetter(XorCondition::first),

            ICondition.CODEC.fieldOf("second").forGetter(XorCondition::second)

    ).apply(inst, XorCondition::new));

    @Override

    public boolean test(ICondition.IContext context) {

        return this.first.test(context) ^ this.second.test(context);

    }

    @Override

    public MapCodec<? extends ICondition> codec() {

        return CODEC;

    }

}

```

Conditions are a registry of codecs. As such, we need to [register](/docs/1.21.11/concepts/registries) our codec, like so:

```java

public static final DeferredRegister<MapCodec<? extends ICondition>> CONDITION_CODECS =

        DeferredRegister.create(NeoForgeRegistries.Keys.CONDITION_CODECS, ExampleMod.MOD_ID);

public static final Supplier<MapCodec<XorCondition>> XOR =

        CONDITION_CODECS.register("xor", () -> XorCondition.CODEC);

```

And then, we can use our condition in some data file (assuming we registered the condition under the `examplemod` namespace):

```json5

{

    "neoforge:conditions": [

        {

            "type": "examplemod:xor",

            "first": {

                // Either this condition is true

                "type": "..."

            },

            "second": {

                // Or this condition, not both!

                "type": "..."

            }

        }

    ],

    // The rest of the data file

}

```

## Datagen

While any datapack JSON file can use load conditions, only a few [data providers](/docs/1.21.11/resources/#data-generation) have been modified to be able to generate them. These include:

- [RecipeProvider](/docs/1.21.11/resources/server/recipes/#data-generation) (via `RecipeOutput#withConditions`), including recipe advancements
- `JsonCodecProvider` and its subclass `SpriteSourceProvider`
- [DataMapProvider](/docs/1.21.11/resources/server/datamaps/#data-generation)
- [GlobalLootModifierProvider](/docs/1.21.11/resources/server/loottables/glm#datagen)
- [DatapackBuiltinEntriesProvider](/docs/1.21.11/concepts/registries#data-generation-for-datapack-registries) (via `Map<ResourceKey<?>, List<ICondition>>` parameter)

For the conditions themselves, the `NeoForgeConditions` class provides static helpers for each of the built-in condition types that return the corresponding `ICondition`s.
