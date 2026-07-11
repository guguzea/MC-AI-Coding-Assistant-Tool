# BlockEntity 命令（Forge 1.18.2）

## 快速开始

```java
public static final DeferredRegister<BlockEntityType<?>> BLOCKENTITIES =
    DeferredRegister.create(ForgeRegistries.BLOCKENTITIES, MOD_ID);

public static final RegistryObject<BlockEntityType<MyBE>> MY_BE =
    BLOCKENTITIES.register("mybe",
        () -> BlockEntityType.Builder.of(MyBE::new, EXAMPLE_BLOCK.get()).build(null)
    );
```

## EntityBlock 方块

```java
public class MyBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyBE(pos, state);
    }
}
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

## 常见错误

- ❌ 忘记调用 `super.saveAdditional()` 和 `super.load()`
- ❌ 数据变化后忘记调用 `setChanged()`

## 参考资料

参见 `02-block.mdc`
