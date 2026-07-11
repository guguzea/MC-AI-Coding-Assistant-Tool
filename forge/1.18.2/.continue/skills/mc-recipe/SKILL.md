---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。
platform: forge
version: "1.18.2"
---

# 自定义配方开发（Forge 1.18.2）

## 注册 RecipeType

```java
public static final RecipeType<MyRecipe> MILLING =
    RecipeType.register(MOD_ID + ":milling");
```

## 参考资料

参见 `03-item.mdc`
