# 方块开发（Forge 1.18.2）

## 快速开始

```java
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Properties.of(Material.STONE)
        .strength(1.5f, 6.0f)
        .requiresCorrectToolForDrops()
    )
);
```

## Decision: 选择方块类型

```
IF 需要持久数据
  → 方块实体（BlockEntity）→ 实现 EntityBlock 接口

IF 只是静态显示
  → 普通方块
```

## EntityBlock 方块

```java
public class MyBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyBlockEntity(pos, state);
    }
}
```

## 世界高度注意

1.18.2 世界高度为 **-64 到 320**（Caves & Cliffs 更新）。

## 常见错误

- ❌ `newBlockEntity()` 返回 null
- ❌ 在 BlockEntity 构造函数中访问 world
- ❌ `getTicker()` 在客户端返回非 null

## 参考资料

参见 `02-block.mdc`
