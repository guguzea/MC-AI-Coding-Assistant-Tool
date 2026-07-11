# 方块与 TileEntity 模式

## 方块类

```java
public class MyBlock extends Block {

    public MyBlock() {
        super(Block.Properties.create(Material.ROCK)
            .hardnessAndResistance(3.0f, 5.0f)
            .sound(SoundType.STONE)
        );
        setRegistryName(ExampleMod.MOD_ID, "my_block");
    }

    @Override
    public boolean hasTileEntity(IBlockState state) {
        return true;
    }

    @Override
    public TileEntity createTileEntity(World world, IBlockState state) {
        return new MyTileEntity();
    }
}
```

## TileEntity 类

```java
public class MyTileEntity extends TileEntity implements ITickable {

    private int counter;

    public MyTileEntity() {
        super();
    }

    @Override
    public void update() {
        counter++;
        if (!world.isRemote) {
            // Server-side logic
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

## 方块状态变体（BlockState）

```java
public enum EnumVariant {
    VARIANT_A, VARIANT_B, VARIANT_C
}

public class VariantBlock extends Block {

    public static final PropertyEnum<EnumVariant> VARIANT = PropertyEnum.create("variant", EnumVariant.class);

    public VariantBlock() {
        super(Block.Properties.create(Material.ROCK));
        setRegistryName(ExampleMod.MOD_ID, "variant_block");
    }

    @Override
    public IBlockState getStateForPlacement(World world, BlockPos pos, EnumFacing facing,
                                            float hitX, float hitY, float hitZ, int meta,
                                            EntityLivingBase placer, EnumHand hand) {
        return getDefaultState().withProperty(VARIANT, EnumVariant.values()[meta % EnumVariant.values().length]);
    }

    @Override
    public int getMetaFromState(IBlockState state) {
        return state.getValue(VARIANT).ordinal();
    }

    @Override
    public IBlockState getStateFromMeta(int meta) {
        return getDefaultState().withProperty(VARIANT, EnumVariant.values()[meta % EnumVariant.values().length]);
    }
}
```

## blockstates JSON

```json
{
  "variants": {
    "variant=a": { "model": "examplemod:block/variant_block" },
    "variant=b": { "model": "examplemod:block/variant_block" },
    "variant=c": { "model": "examplemod:block/variant_block" }
  }
}
```
