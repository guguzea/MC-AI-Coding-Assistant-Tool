---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。
platform: forge
version: "1.18.2"
---

# 方块实体开发（Forge 1.18.2）

## 注册 BlockEntityType

```java
public static final DeferredRegister<BlockEntityType<?>> BLOCKENTITIES =
    DeferredRegister.create(ForgeRegistries.BLOCKENTITIES, MOD_ID);
```

## 参考资料

参见 `02-block.mdc`
