---
description: 10 — GUI / Container / GuiScreen
---

# 10 — GUI / Container / GuiScreen

> 适用版本：Forge 1.12.2

---

## 约束

### GUI 系统架构

```
Player interacts
      │
      ▼
Block#onBlockActivated (Server) ──► player.openGui ──► IGuiHandler ──► getServerGuiElement
                                                                        │
                                                                        ▼
                                                              Container + GuiContainer pair
```

### Proxy 模式

- 所有 GUI 必须在客户端初始化
- 使用 `@SideOnly(Side.CLIENT)` 标注 GuiScreen 类
- 使用 `IGuiHandler` 接口定义 GUI 逻辑

---

## Decision Flow

### Decision: Container/Menu type

```
IF 可交互方块带持久数据（机器、箱子等）
  → Container + IGuiHandler + GuiScreen

IF 只是简单的交互（无数据）
  → GuiScreen 直接打开（不推荐）

IF 物品栏带多个槽位
  → Container（用于槽位管理和 shift-click）
```

### Decision: GUI 打开方式

```
IF 从方块打开 GUI
  → Block#onBlockActivated 中调用 player.openGui
  → 在 IGuiHandler.getServerGuiElement 中创建 Container

IF 从物品打开 GUI
  → Item#onItemRightClick 中调用 player.openGui

IF 从网络消息打开 GUI
  → 服务端发送消息后调用 player.openGui
```

---

## 示例：Container 类

```java
// containers/ContainerExample.java
public class ContainerExample extends Container {
    private final World world;
    private final BlockPos pos;

    public ContainerExample(InventoryPlayer playerInventory, World world, BlockPos pos) {
        this.world = world;
        this.pos = pos;
        // 槽位布局
        for (int y = 0; y < 3; y++) {
            for (int x = 0; x < 9; x++) {
                this.addSlotToContainer(new Slot(playerInventory, x + y * 9 + 9,
                        8 + x * 18, 84 + y * 18));
            }
        }
        for (int x = 0; x < 9; x++) {
            this.addSlotToContainer(new Slot(playerInventory, x, 8 + x * 18, 142));
        }
    }

    @Override
    public boolean canInteractWith(EntityPlayer player) {
        return player.getDistanceSq(this.pos) <= 64.0D;
    }

    @Override
    public ItemStack transferStackInSlot(EntityPlayer player, int index) {
        ItemStack stack = ItemStack.EMPTY;
        Slot slot = this.inventorySlots.get(index);
        if (slot != null && slot.getHasStack()) {
            ItemStack stack1 = slot.getStack();
            stack = stack1.copy();
            if (index < 27) {
                if (!this.mergeItemStack(stack1, 27, 36, true)) {
                    return ItemStack.EMPTY;
                }
            } else if (!this.mergeItemStack(stack1, 0, 27, false)) {
                return ItemStack.EMPTY;
            }
            if (stack1.isEmpty()) {
                slot.putStack(ItemStack.EMPTY);
            } else {
                slot.onSlotChanged();
            }
        }
        return stack;
    }
}
```

## 示例：IGuiHandler

```java
// gui/ModGuiHandler.java
public class ModGuiHandler implements IGuiHandler {
    public static final int GUI_EXAMPLE = 0;

    @Override
    public Object getServerGuiElement(int id, EntityPlayer player, World world, int x, int y, int z) {
        if (id == GUI_EXAMPLE) {
            BlockPos pos = new BlockPos(x, y, z);
            TileEntity tile = world.getTileEntity(pos);
            if (tile instanceof TileEntityExample) {
                return new ContainerExample(player.inventory, world, pos);
            }
        }
        return null;
    }

    @Override
    public Object getClientGuiElement(int id, EntityPlayer player, World world, int x, int y, int z) {
        if (id == GUI_EXAMPLE) {
            BlockPos pos = new BlockPos(x, y, z);
            TileEntity tile = world.getTileEntity(pos);
            if (tile instanceof TileEntityExample) {
                return new GuiExample(player.inventory, world, pos);
            }
        }
        return null;
    }
}
```

## 示例：GuiScreen（客户端）

```java
// gui/GuiExample.java
@SideOnly(Side.CLIENT)
public class GuiExample extends GuiContainer {
    private static final ResourceLocation TEXTURES =
            new ResourceLocation(ExampleMod.MODID, "textures/gui/container/example.png");

    public GuiExample(InventoryPlayer playerInventory, World world, BlockPos pos) {
        super(new ContainerExample(playerInventory, world, pos));
        this.xSize = 176;
        this.ySize = 166;
    }

    @Override
    protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY) {
        GlStateManager.color(1.0f, 1.0f, 1.0f, 1.0f);
        this.mc.getTextureManager().bindTexture(TEXTURES);
        int x = (this.width - this.xSize) / 2;
        int y = (this.height - this.ySize) / 2;
        this.drawTexturedModalRect(x, y, 0, 0, this.xSize, this.ySize);
    }

    @Override
    protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY) {
        this.fontRenderer.drawString("Example Container", 8, 6, 0x404040);
        this.fontRenderer.drawString("Inventory", 8, 74, 0x404040);
    }
}
```

## 示例：注册 GUI Handler

```java
// ExampleMod.java
@EventHandler
public void init(FMLInitializationEvent event) {
    NetworkRegistry.INSTANCE.registerGuiHandler(ExampleMod.instance, new ModGuiHandler());
}
```

## 示例：方块打开 GUI

```java
// blocks/BlockExample.java
@Override
public boolean onBlockActivated(World world, BlockPos pos, IBlockState state,
        EntityPlayer player, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ) {
    if (!world.isRemote) {
        player.openGui(ExampleMod.instance, ModGuiHandler.GUI_EXAMPLE,
                world, pos.getX(), pos.getY(), pos.getZ());
    }
    return true;
}
```

## 常见错误

- ❌ 在服务端创建 GuiScreen → 必须使用 IGuiHandler
- ❌ Container.getSlot() 越界 → 检查 index 范围
- ❌ shift-click 未实现 → Container.transferStackInSlot 必须正确实现
- ❌ 纹理路径错误 → 确认 resources 目录结构正确
