---
description: 03 — 物品（NeoForge 26.3）
---

# 03 — 物品（NeoForge 26.3）

> 证据类型：官方 MDK 模板源码（不是 docs 正文）。出处 `MDK-26.3-ModDevGradle@f31f90e7:src/main/java/com/example/examplemod/ExampleMod.java`。

## 简单物品（`:54-55`）

```java
public static final DeferredItem<Item> EXAMPLE_ITEM =
    ITEMS.registerSimpleItem("example_item", p -> p.food(new FoodProperties.Builder()
        .alwaysEdible().nutrition(1).saturationModifier(2f).build()));
```

- `ITEMS.registerSimpleItem(String, Function<Item.Properties, ? extends Item>)` —— 第二参同样是**属性修改器**
- `FoodProperties.Builder` 的链式名：`alwaysEdible()` / `nutrition(int)` / `saturationModifier(float)` / `build()`

## 方块物品（`:51`）

```java
public static final DeferredItem<BlockItem> EXAMPLE_BLOCK_ITEM =
    ITEMS.registerSimpleBlockItem("example_block", EXAMPLE_BLOCK);
```

`registerSimpleBlockItem(String, Supplier<Block>)` —— 传的是那块的 `DeferredBlock`，名字必须与方块同名。

## 进创造栏

| 场景 | 做法 | 出处 |
|---|---|---|
| 自己的 tab | `CreativeModeTab.builder().displayItems((p, out) -> out.accept(item))` | `ExampleMod.java:62-63` |
| 加进**原版** tab | 监听 `BuildCreativeModeTabContentsEvent`，判 `event.getTabKey() == CreativeModeTabs.BUILDING_BLOCKS` 后 `event.accept(...)` | `ExampleMod.java:105-108` |

```java
private void addCreative(BuildCreativeModeTabContentsEvent event) {
    if (event.getTabKey() == CreativeModeTabs.BUILDING_BLOCKS) {
        event.accept(EXAMPLE_BLOCK_ITEM);
    }
}
```

事件由 `modEventBus.addListener(this::addCreative)` 挂上（`:85`），**不是** `NeoForge.EVENT_BUS`。

## 常见错误

- ❌ 用 `ITEMS.register("x", () -> new Item(new Item.Properties()))` 却不给 `Item.Properties` 任何 id 相关设置 —— 本版 id 由 `DeferredRegister` 的 namespace + `register` 的 name 决定，无需手工 `Identifier`
- ❌ 把 `registerSimpleBlockItem` 的方块写成 `() -> new Block(...)`（要传**已注册的** `DeferredBlock`）
- ❌ 往原版 tab 加物品时用 `displayItems`（那是自有 tab 才有的 builder 回调）
