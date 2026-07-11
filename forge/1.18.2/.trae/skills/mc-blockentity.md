---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。BlockEntity 注册、Ticker、数据同步。触发词：BlockEntity、BlockEntityType、EntityBlock、getTicker
platform: forge
version: "1.18.2"
---

# 方块实体开发（Forge 1.18.2）

## 快速开始

```java
public static final DeferredRegister<BlockEntityType<?>> BLOCKENTITIES =
    DeferredRegister.create(ForgeRegistries.BLOCKENTITIES, MOD_ID);
```

## 数据同步

```java
@Override
public CompoundTag getUpdateTag() {
    CompoundTag nbt = super.getUpdateTag();
    nbt.putInt("counter", counter);
    return nbt;
}
```

## 参考资料

参见 `02-block.mdc`
