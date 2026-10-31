# Food Items

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/238533d819fcb5ec9405acb58fb0ac7655df63b1/develop/items/food.md
> 版本：26.2
> GitHub 路径：develop/items/food.md
> 抓取源：github_latest_pinned
> 抓取时间：2026-10-30T17:15:12.606Z
> SHA256：6ea99fdeafd1e2f3291c67df2e1f5352adeb28f06ff478a4d17fd203134936c5
> 分支：main@238533d819fcb5ec9405acb58fb0ac7655df63b1

---
title: Food Items
description: Learn how to add a FoodComponent to an item to make it edible, and configure it.
authors:
  - IMB11
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

The `FoodProperties.Builder` class has some methods that allow you to modify what happens when a player eats your item:

| Method               | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `nutrition`          | Sets the amount of hunger points your item will replenish. |
| `saturationModifier` | Sets the amount of saturation points your item will add.   |
| `alwaysEdible`       | Allows your item to be eaten regardless of hunger level.   |

When you've modified the builder to your liking, you can call the `build()` method to get the `FoodProperties`.

If you want to add mob effects to the player when they eat your food, you will need to add a `Consumable` component alongside the `FoodProperties` component as seen in the following example:

<<< @/reference/latest/src/main/java/com/example/docs/item/ModItems.java#custom_food

Similar to the example in the [Creating Your First Item](./first-item) page, we'll be using the above component:

<<< @/reference/latest/src/main/java/com/example/docs/item/ModItemIds.java#poisonous_apple

<<< @/reference/latest/src/main/java/com/example/docs/item/ModItems.java#poisonous_apple

This makes the item:

- Always edible, it can be eaten regardless of hunger level.
- Always give Poison II for 6 seconds when eaten.

<VideoPlayer src="/assets/develop/items/food_0.webm">Eating the Poisonous Apple</VideoPlayer>
