---
name: mc-gui
description: Forge 1.12.2 GUI skill (Container, Slot, IGuiHandler, @SideOnly)
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# GUI/菜单开发（Forge 1.12.2）

## Decision: 是否需要 Container

```
IF 交互时需要持久数据存储（机器进度、箱子物品）
  → 使用 Container + IGuiHandler

IF 只是显示 UI（无数据）
  → 直接使用 GuiScreen（无需 Container）

IF 需要物品栏槽位（多格容器）
  → Container（slot 管理 + transferStackInSlot）
```

## 完整示例：方块交互打开 GUI

### 1. 创建 Container

```java
public class MyContainer extends Container {
    private final IInventory tile;

    public MyContainer(IInventory playerInv, IInventory tileInv) {
        this.tile = tileInv;
        // 玩家物品栏
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(playerInv, col + row * 9 + 9, 8 + col * 18, 84 + row * 18));
            }
        }
        // 玩家快捷栏
        for (int col = 0; col < 9; col++) {
            this.addSlot(new Slot(playerInv, col, 8 + col * 18, 142));
        }
        // 方块物品栏
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 3; col++) {
                this.addSlot(new Slot(tileInv, col + row * 3, 62 + col * 18, 17 + row * 18));
            }
        }
    }

    @Override
    public ItemStack transferStackInSlot(EntityPlayer player, int index) {
        return ItemStack.EMPTY;
    }

    @Override
    public boolean canInteractWith(EntityPlayer player) {
        return tile.isUsableByPlayer(player);
    }
}
```

### 2. 注册 IGuiHandler

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

### 3. 在 FMLInitializationEvent 中注册

```java
@Mod.EventHandler
public void init(FMLInitializationEvent event) {
    NetworkRegistry.INSTANCE.registerGuiHandler(MOD_ID, new GuiHandler());
}
```

### 4. 方块打开 GUI

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

### 5. GuiScreen（客户端）

```java
@SideOnly(Side.CLIENT)
public class MyGui extends GuiScreen {
    private final Container container;

    public MyGui(Container container, IInventory playerInventory) {
        this.container = container;
        this.playerInventory = playerInventory;
    }

    @Override
    public void drawScreen(int mouseX, int mouseY, float partialTicks) {
        this.drawDefaultBackground();
        super.drawScreen(mouseX, mouseY, partialTicks);
        this.renderHoveredToolTip(mouseX, mouseY);
    }

    @Override
    protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY) {
        drawRect(x, y, x + 176, y + 166, 0xFF000000);
    }
}
```

## 常见错误

- ❌ `GuiHandler` 在服务端调用 → 只在客户端有效果
- ❌ `transferStackInSlot` 返回空导致物品丢失
- ❌ `canInteractWith` 始终返回 true → 添加距离检查

## Key Forge 1.12.2 Specs

- IGuiHandler (not MenuType)
- Container (not Menu)
- Slot (not SlotContainer)
- @SideOnly(Side.CLIENT) (not @OnlyIn(Dist.CLIENT))
- player.openGui() (not openMenu())
- world.isRemote (not level.isClientSide)
