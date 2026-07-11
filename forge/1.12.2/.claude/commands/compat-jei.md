# JEI 兼容（Forge 1.12.2）

## Decision: 选择兼容方案

```
IF 配方已通过 JSON 手动编写
  → JEI 自动读取 JSON，无需额外代码

IF 需要自定义配方 UI
  → 使用 JEI IRecipeHandler API

IF 需要显示子类
  → 使用 JEI CategoryExtension
```

## 方案 A：JEI 自动读取（JSON，无代码）

只要配方通过 JSON 文件放在 `assets/{modid}/recipes/`，JEI 会自动发现并显示。

## 方案 B：JEI 插件注册

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class JEIPlugin {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<IRecipeHandler>> event) {
        // 注册自定义配方处理器
    }
}
```

## 常见错误

- ❌ 在服务端注册 JEI → JEI 只在客户端存在
- ❌ 配方 JSON 放在错误路径

## 参考资料

- JEI GitHub：https://github.com/mezz/JustEnoughItems
