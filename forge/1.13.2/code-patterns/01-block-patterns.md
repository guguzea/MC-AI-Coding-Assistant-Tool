# 方块相关模式（Forge 1.13.2）

## 模式: Basic Stone Block

```yaml
模式: Basic Stone Block
版本: Forge 1.13.2
平台: Forge
分类: block
依赖: []
扩展点: [方块实体, 特殊渲染]
---
# 定义
public static final Block MY_BLOCK = new Block(
    Block.Properties.create(Material.ROCK)
        .hardnessAndResistance(1.5f, 6.0f)
);

// 注册
@SubscribeEvent
public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
    event.getRegistry().register(
        MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
    );
}
```

## 模式: Block with ItemBlock

```yaml
模式: Block with ItemBlock
版本: Forge 1.13.2
平台: Forge
分类: block
依赖: []
扩展点: [物品注册]
---
# ItemBlock 定义
public static final Item MY_BLOCK_ITEM = new ItemBlock(MY_BLOCK,
    new Item.Properties().group(ItemGroup.BUILDING_BLOCKS));

# ItemBlock 注册（与方块同名）
@SubscribeEvent
public void onItemsRegistry(RegistryEvent.Register<Item> event) {
    event.getRegistry().register(MY_BLOCK_ITEM.setRegistryName(
        new ResourceLocation(MOD_ID, "my_block")
    ));
}
```

## 模式: TileEntity Block

```yaml
模式: TileEntity Block
版本: Forge 1.13.2
平台: Forge
分类: block
依赖: [TileEntity]
扩展点: [GUI, 数据存储]
---
// 1.13.2 构件 javap：本档无 ITileEntityProvider / createNewTileEntity（1.12.2 写法），
//   方块实体走 IForgeBlock 的 hasTileEntity(IBlockState) / createTileEntity(IBlockState, IBlockReader)；
//   本档也没有 DeferredRegister，TileEntityType 在 RegistryEvent.Register<TileEntityType<?>> 里注册。
public class MyTileEntityBlock extends Block {
    public MyTileEntityBlock() {
        super(Block.Properties.create(Material.WOOD));
    }

    @Override
    public boolean hasTileEntity(IBlockState state) {
        return true;
    }

    @Override
    public TileEntity createTileEntity(IBlockState state, IBlockReader world) {
        return new MyTileEntity();
    }
}

public class MyTileEntity extends TileEntity implements ITickable {
    private int counter = 0;

    public MyTileEntity() {
        super(MY_TILE_ENTITY);   // MY_TILE_ENTITY 是 TileEntityType<MyTileEntity>，见下注册
    }

    @Override
    public void tick() {   // 1.13.2 构件 javap：ITickable（net.minecraft.util）的方法是 tick()，不是 update()
        if (world.isRemote) return;
        counter++;
    }

    @Override
    public void read(NBTTagCompound compound) {   // 1.13.2 构件 javap：TileEntity 覆写 read/write，不是 readFromNBT/writeToNBT
        super.read(compound);
        counter = compound.getInt("counter");
    }

    @Override
    public NBTTagCompound write(NBTTagCompound compound) {
        super.write(compound);
        compound.setInt("counter", counter);   // 1.13.2 构件 javap：NBTTagCompound 是 setInt（无 setInteger）
        return compound;
    }
}

// 注册（1.13.2 构件 javap：TileEntityType.Builder.create(Supplier) 只吃一个工厂，build(Type) 传 null）
public static final TileEntityType<MyTileEntity> MY_TILE_ENTITY =
    TileEntityType.Builder.create(MyTileEntity::new).build(null);

@SubscribeEvent
public void onTileEntitiesRegistry(RegistryEvent.Register<TileEntityType<?>> event) {
    event.getRegistry().register(
        MY_TILE_ENTITY.setRegistryName(new ResourceLocation(MOD_ID, "my_tile_entity"))
    );
}
```
