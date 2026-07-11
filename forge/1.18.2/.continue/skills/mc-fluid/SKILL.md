---
name: mc-fluid
description: Minecraft Forge 流体开发。
platform: forge
version: "1.18.2"
---

# 流体开发（Forge 1.18.2）

## 注册 FluidType

```java
public static final DeferredRegister<FluidType> FLUID_TYPES =
    DeferredRegister.create(ForgeRegistries.FLUIDTYPES, MOD_ID);
```

## 参考资料

参见 `02-block.mdc`
