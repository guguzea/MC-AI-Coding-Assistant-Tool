---
name: mc-compat-jei
description: Minecraft Forge JEI 兼容层，让 JEI 自动读取配方。触发词：JEI、RecipeCategory、jei_plugins
---

# JEI 兼容（Forge 1.15.2）

## Decision: 选择兼容方案

```
IF 配方已通过 DataGen 生成
  → JEI 自动读取 DataPack JSON，无需额外代码（推荐）

IF 需要自定义配方 UI（如 2x2 合成网格、多输入槽）
  → 使用 JEI 的 IRecipeCategory / IRecipeWrapper

IF 需要显示子类（sub-categories）
  → JEI hideOf() 等插件 API
```

## JEI 插件注册

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)
public class JEIPlugin {
    @SubscribeEvent
    public static void onJEIInit(RegistryEvent.Register<IRecipeCategory>> event) {
        // 注册自定义配方类别
    }

    @SubscribeEvent
    public static void onJEIRegistryInit(RegistryEvent.Register<IRecipeWrapper>> event) {
        // JEI 自动读取 DataGen 生成的配方 JSON
    }
}
```

## 常见错误

- ❌ 在服务端（`Dist.DEDICATED_SERVER`）注册 JEI（必须 `Dist.CLIENT`）
- ❌ 配方 JSON 放在错误路径（应在 `data/{modid}/recipes/`）

## 参考资料

- JEI Wiki：https://github.com/mezz/JustEnoughItems/wiki

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成的配方 JSON 自动被 JEI 读取，无需额外代码 |
| `mc-registry` | 自定义配方类需要注册表引用配方物品/方块 |
