# Food Items

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.21.1/develop/items/food.md
> 版本：1.21.1
> GitHub 路径：develop/items/food.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:45:24.817Z
> SHA256：f51716287e8fb85e596504f0f689eab3226a7ec6209e3c874aed9e4c6dcf663a
> 分支：main

---
title: Food Items
description: Learn how to add a FoodProperties to an item to make it edible, and configure it.
authors:
  - IMB11

search: false
---

Food is a core aspect of survival Minecraft, so when creating edible items you have to consider the food's usage with other edible items.

Unless you're making a mod with overpowered items, you should consider:

- How much hunger your edible item adds or removes.
- What potion effect(s) does it grant?
- Is it early-game or endgame accessible?

## Adding the Food Component {#adding-the-food-component}

To add a food component to an item, we can pass it to the `Item.Properties` instance:

```java
new Item.Properties().food(new FoodProperties.Builder().build())
```

Right now, this just makes the item edible and nothing more.

The `FoodProperties.Builder` class has many methods that allow you to modify what happens when a player eats your item:

| Method               | Description                                                                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nutrition`          | Sets the amount of hunger points your item will replenish.                                                                                                            |
| `saturationModifier` | Sets the amount of saturation points your item will add.                                                                                                              |
| `alwaysEdible`       | Allows your item to be eaten regardless of hunger level.                                                                                                              |
| `fast`              | Increases the speed your item is eaten.                                                                                                                                        |
| `effect`       | Adds a status effect when you eat your item. Usually a status effect instance and chance is passed to this method, where chance is a decimal percentage (`1f = 100%`) |

When you've modified the builder to your liking, you can call the `build()` method to get the `FoodProperties`.

@[code transcludeWith=:::5](@/reference/1.21.1/src/main/java/com/example/docs/item/ModItems.java)

Similar to the example in the [Creating Your First Item](./first-item) page, this will use the above component:

@[code transcludeWith=:::poisonous_apple](@/reference/1.21.1/src/main/java/com/example/docs/item/ModItems.java)

This makes the item:

- Always edible, it can be eaten regardless of hunger level.
- A "snack".
- Always give Poison II for 6 seconds when eaten.

<VideoPlayer src="/assets/develop/items/food_0.webm" title="Eating the Suspicious Substance" />
