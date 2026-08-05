---
id: authored/register-helpers
title: 注册辅助方法（Block + 同名 BlockItem）
tags: [registry, blockitem, deferredregister, forge, dry]
summary: 注册≠new；DeferredRegister 流程；registerBlock 自动 BlockItem；物品三重重载；避免重复注册与过早 get。
mcHint: 1.20.1+
sourceKind: authored
---

# 注册辅助方法（Block + 同名 BlockItem）

自写短文。

## 注册是什么（先对齐概念）

注册不是「创建一个普通 Java 对象就完事」，而是向游戏**声明**：存在某种内容，请在正确加载阶段加入全局注册表。未注册的方块/物品：世界、资源路径、网络同步都对不上。

| 通常要注册 | 通常不用注册 |
|------------|--------------|
| 方块、物品、BE 类型、Menu、声音、流体、实体、创造页签、配方类型… | 工具类、临时变量、纯算法、GUI 内部布局数据 |

`DeferredRegister` = 先声明，由 Forge 在正确阶段真正写入注册表。

## 标准三步

```java
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MODID);

public static void register(IEventBus bus) {
    BLOCKS.register(bus);
}
// 主类：ModBlocks.register(modBus);
```

每种注册表类型一个 DeferredRegister；都要挂到 **同一个** modEventBus。

## 方块 helper：注册并自动同名 BlockItem

可放置方块在背包里是 **BlockItem**。漏注册或注册名不一致 → 紫黑块 / 无法放置。

```java
private static <T extends Block> RegistryObject<T> registerBlock(String name, Supplier<T> block) {
    RegistryObject<T> obj = BLOCKS.register(name, block);
    ITEMS.register(name, () -> new BlockItem(obj.get(), new Item.Properties()));
    return obj;
}

// 使用
public static final RegistryObject<Block> RAW_BLOCK =
    registerBlock("raw_material_block", () -> new Block(BlockBehaviour.Properties.copy(Blocks.IRON_BLOCK)));
```

注意：

1. **Block 与 BlockItem 的 registry name 字符串必须相同**。  
2. 改用 helper 后，删掉 `ModItems` 里手写的重复 BlockItem，否则双重注册。  
3. 需要特殊 `Item.Properties`（堆叠、火焰免疫）时加重载：`registerBlock(name, block, props)`。  
4. lambda 里 `obj.get()` 在 DeferredRegister 回调中执行，一般安全；不要在静态字段初始化阶段对尚未注册完的对象 `.get()`。

## 物品 helper：三重重载（示意）

```java
private static RegistryObject<Item> registerItem(String name) {
    return ITEMS.register(name, () -> new Item(new Item.Properties()));
}

private static RegistryObject<Item> registerItem(String name, Function<Item.Properties, Item> factory) {
    return ITEMS.register(name, () -> factory.apply(new Item.Properties()));
}

private static RegistryObject<Item> registerSimplePropItem(String name, Consumer<Item.Properties> mod) {
    return ITEMS.register(name, () -> {
        Item.Properties p = new Item.Properties();
        mod.accept(p);
        return new Item(p);
    });
}
```

- 无属性：只传名字  
- 自定义 `Item` 子类：用 `factory`  
- 只改 Properties：用 `Consumer`

1.20+ 不要在 Properties 上调已移除的 `.tab(...)`（见 `authored/creative-tabs-1.20`）。

## 自检

- 每个可放置方块是否都有同名 BlockItem？  
- `ITEMS` / `BLOCKS` 是否都 `register(modBus)`？  
- 创造页签 `accept` 的是否为已注册对象？

## 不清楚时

- 创造页签：`authored/creative-tabs-1.20`  
- 工程化外链（禁转载，仅浏览）：https://www.mcmod.cn/post/6071.html  
- 规则：`01-registry.mdc` + `search_forge_docs`
