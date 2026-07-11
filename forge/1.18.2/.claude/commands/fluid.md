# Fluid 流体开发（Forge 1.18.2）

## 注册 FluidType

```java
public static final DeferredRegister<FluidType> FLUID_TYPES =
    DeferredRegister.create(ForgeRegistries.FLUIDTYPES, MOD_ID);
```

## Fluid 属性

```java
new ForgeFlowingFluid.Properties(source, flowing, block)
    .bucket(() -> MY_BUCKET.get())
    .block(() -> MY_FLUID_BLOCK.get());
```

## 常见错误

- ❌ 只注册 Fluid 不注册 FluidType
- ❌ BucketItem 引用未注册的 Fluid

## 参考资料

参见 `02-block.mdc`
