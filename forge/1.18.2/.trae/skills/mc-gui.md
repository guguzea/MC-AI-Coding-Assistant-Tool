---
name: mc-gui
description: Minecraft Forge GUI/菜单开发。创建自定义 ContainerMenu、Screen。触发词：Screen、Menu、ContainerMenu、MenuType、quickMoveStack
platform: forge
version: "1.18.2"
---

# GUI/菜单开发（Forge 1.18.2）

## 注册 MenuType

```java
public static final DeferredRegister<MenuType<?>> MENUS =
    DeferredRegister.create(ForgeRegistries.CONTAINERS, MOD_ID);
```

## 参考资料

参见 `10-gui.mdc`
