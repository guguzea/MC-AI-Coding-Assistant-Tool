# TileEntity 开发（Forge 1.12.2）

## 快速开始

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModTileEntities {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<TileEntity> event) {
        TileEntity.register(MOD_ID + ":my_tile", MyTileEntity.class);
    }
}
```

## TileEntity 类结构

```java
public class MyTileEntity extends TileEntity implements ITickable {
    private int counter = 0;

    public MyTileEntity() { super(); }

    @Override
    public void update() {
        counter++;
        if (counter % 20 == 0) {
            // 每秒执行
        }
    }

    @Override
    public NBTTagCompound writeToNBT(NBTTagCompound compound) {
        super.writeToNBT(compound);
        compound.setInteger("counter", counter);
        return compound;
    }

    @Override
    public void readFromNBT(NBTTagCompound compound) {
        super.readFromNBT(compound);
        counter = compound.getInteger("counter");
    }
}
```

## 关联到 Block

```java
public class MyTileBlock extends Block {
    @Override
    public boolean hasTileEntity(IBlockState state) { return true; }

    @Override
    public TileEntity createTileEntity(World world, IBlockState state) {
        return new MyTileEntity();
    }
}
```

## 常见错误

- ❌ `writeToNBT` / `readFromNBT` 重写后忘记调用 `super`
- ❌ 在构造函数中访问 world
- ❌ 忘记注册 TileEntity

## 参考资料

- 详细示例：参见 `02-block.mdc`
