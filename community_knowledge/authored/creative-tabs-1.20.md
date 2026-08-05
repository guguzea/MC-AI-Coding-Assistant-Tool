---
id: authored/creative-tabs-1.20
title: 创造页签 1.20+（CreativeModeTab）
tags: [creative-tab, item, 1.20, deferredregister]
summary: 1.18/1.19 的 Properties.tab 已移除；DeferredRegister 注册页签；displayItems 或 BuildCreativeModeTabContentsEvent 填充；本地化键。
mcHint: 1.20+
sourceKind: authored
---

# 创造页签 1.20+（CreativeModeTab）

自写短文。细节以当前 Forge 文档 / `03-item` 规则为准。

## 版本差异

| 版本 | 做法 |
|------|------|
| 1.18 / 1.19 | `new Item.Properties().tab(CreativeModeTab.TAB_MISC)` 等，构造时挂页签 |
| **1.20+** | **去掉** `.tab(...)`；单独注册 `CreativeModeTab`，再在填充回调里 `accept` 物品 |

从 1.18 教程抄代码到 1.20 时，`.tab` 编译失败或行为不对是最常见坑。

## 注册页签

```java
public static final DeferredRegister<CreativeModeTab> CREATIVE_TABS =
    DeferredRegister.create(Registries.CREATIVE_MODE_TAB, MODID);

public static final RegistryObject<CreativeModeTab> MAIN = CREATIVE_TABS.register("main",
    () -> CreativeModeTab.builder()
        .title(Component.translatable("itemGroup." + MODID + ".main")) // 键名按项目约定
        .icon(() -> ModItems.EXAMPLE.get().getDefaultInstance())
        .displayItems((params, output) -> {
            output.accept(ModItems.EXAMPLE.get());
            output.accept(ModBlocks.EXAMPLE_BLOCK.get());
        })
        .build());
```

主类 / 总线：`CREATIVE_TABS.register(modEventBus)`。

也可用 **`BuildCreativeModeTabContentsEvent`** 向原版或自定义页签追加物品（适合「加到建筑方块页」等）；自定义整页仍用 `DeferredRegister`。

## 时机与空引用

- `icon` / `displayItems` 里调用 `RegistryObject.get()` 时，对应物品必须已经由 `ITEMS.register(bus)` 挂上且处于合法阶段。  
- 不要在静态字段初始化顺序混乱时互相 `.get()`。  
- 页签注册名（如 `"main"`）会进入内部 ID；本地化键常与 `itemGroup.<modid>.…` 或 builder 里 `translatable` 的键一致，**键名写错会显示原始键**。

## 本地化

`assets/<modid>/lang/zh_cn.json`：

```json
{
  "itemGroup.examplemod.main": "示例模组"
}
```

具体键以你 `Component.translatable(...)` 传入的字符串为准。

## 自检

- 创造模式能看到自定义页签图标与物品。  
- 物品构造函数中已无 `.tab`。  
- 服务端启动无客户端类问题（页签注册在双方都可接受的位置）。

## 不清楚时

- 本地化键：`authored/localization-lang`  
- API：`search_forge_docs` / `query_api`（CreativeModeTab、BuildCreativeModeTabContentsEvent）  
- 勿从 1.18/1.19 教程照搬 `.tab(...)`
