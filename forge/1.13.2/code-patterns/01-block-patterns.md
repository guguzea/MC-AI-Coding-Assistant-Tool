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
    Block.Properties.create(Material.STONE)
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
    new Item.Properties().group(ItemGroup.TAB_BUILDING_BLOCKS));

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
public class MyTileEntityBlock extends Block implements ITileEntityProvider {
    public MyTileEntityBlock() {
        super(Block.Properties.create(Material.WOOD));
    }

    @Override
    public TileEntity createNewTileEntity(IBlockReader world) {
        return new MyTileEntity();
    }
}

public class MyTileEntity extends TileEntity implements ITickable {
    private int counter = 0;

    public MyTileEntity() {
        super(TileEntityTypeRegistry.MY_TILE_ENTITY.get());
    }

    @Override
    public void update() {
        if (world.isRemote) return;
        counter++;
    }

    @Override
    public void writeToNBT(NBTTagCompound compound) {
        super.writeToNBT(compound);
        compound.setInteger("counter", counter);
    }

    @Override
    public void readFromNBT(NBTTagCompound compound) {
        super.readFromNBT(compound);
        counter = compound.getInteger("counter");
    }
}
```
