# GUI/菜单开发（Forge 1.12.2）

## Decision: 是否需要 Container

```
IF 交互时需要持久数据存储
  → 使用 Container + IGuiHandler

IF 只是显示 UI（无数据）
  → 直接使用 GuiScreen

IF 需要物品栏槽位
  → Container
```

## 完整示例

### Container

```java
public class MyContainer extends Container {
    private final IInventory tile;

    public MyContainer(IInventory playerInv, IInventory tileInv) {
        this.tile = tileInv;
        // 添加玩家物品栏和快捷栏槽位
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(playerInv, col + row * 9 + 9, 8 + col * 18, 84 + row * 18));
            }
        }
        for (int col = 0; col < 9; col++) {
            this.addSlot(new Slot(playerInv, col, 8 + col * 18, 142));
        }
        // 添加 TileInventory 槽位
    }

    @Override
    public ItemStack transferStackInSlot(PlayerEntity player, int index) {
        return ItemStack.EMPTY;
    }

    @Override
    public boolean canInteractWith(PlayerEntity player) {
        return tile.isUsableByPlayer(player);
    }
}
```

### GuiHandler

```java
public class GuiHandler implements IGuiHandler {
    @Override
    public Object getServerGuiElement(int ID, EntityPlayer player, World world, int x, int y, int z) {
        TileEntity tile = world.getTileEntity(new BlockPos(x, y, z));
        if (tile instanceof MyTileEntity) {
            return new MyContainer(player.inventory, (IInventory) tile);
        }
        return null;
    }

    @Override
    public Object getClientGuiElement(int ID, EntityPlayer player, World world, int x, int y, int z) {
        TileEntity tile = world.getTileEntity(new BlockPos(x, y, z));
        if (tile instanceof MyTileEntity) {
            return new MyGui(new MyContainer(player.inventory, (IInventory) tile), player.inventory);
        }
        return null;
    }
}
```

### 方块打开 GUI

```java
@Override
public boolean onBlockActivated(World world, BlockPos pos, IBlockState state,
                                EntityPlayer player, EnumHand hand,
                                EnumFacing facing, float hitX, float hitY, float hitZ) {
    if (!world.isRemote) {
        player.openGui(MOD_ID, 0, world, pos.getX(), pos.getY(), pos.getZ());
    }
    return true;
}
```

### GuiScreen（客户端）

```java
@SideOnly(Side.CLIENT)
public class MyGui extends GuiScreen {
    private final Container container;

    @Override
    public void drawScreen(int mouseX, int mouseY, float partialTicks) {
        this.drawDefaultBackground();
        super.drawScreen(mouseX, mouseY, partialTicks);
        this.renderHoveredToolTip(mouseX, mouseY);
    }
}
```

## 常见错误

- ❌ `GuiHandler` 在服务端调用 → 无效果
- ❌ `transferStackInSlot` 未实现 → Shift-click 无效

## 参考资料

- 详细示例：参见 `10-gui.mdc`
