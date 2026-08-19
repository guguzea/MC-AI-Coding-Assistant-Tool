---
name: mc-gui
description: Minecraft Forge GUI/菜单开发。创建自定义 Container、Screen、数据同步。触发词：Screen、Container、ContainerType、ContainerScreens、transferStackInSlot
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# GUI/菜单开发（Forge 1.15.2）

## Decision: 是否需要 Container

```
IF 交互时需要持久数据存储（机器进度、箱子物品）
  → 使用 Container + ContainerScreen

IF 只是显示 UI（无数据）
  → 直接使用 ContainerScreen（无需自定义 Container）

IF 需要物品栏槽位（多格容器）
  → Container（slot 管理 + transferStackInSlot）
```

## 完整示例：方块交互打开 GUI

### 1. 注册 ContainerType

```java
public static final RegistryObject<ContainerType<MyContainer>> MY_CONTAINER =
    CONTAINERS.register("my_container",
        () -> IForgeContainerType.create(MyContainer::new)
    );

// 在 mod 构造函数中
CONTAINERS.register(modEventBus);
```

### 2. 实现 Container

```java
public class MyContainer extends Container {
    // 服务端构造函数
    public MyContainer(int windowId, PlayerInventory inv, IInteractionObject target) {
        super(MyContainers.MY_CONTAINER.get(), windowId);
        // 添加槽位（示例：3 行 9 列容器 = 27 格，索引 0-26）
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(inv, col + row * 9, 8 + col * 18, 18 + row * 18));
            }
        }
    }

    // Shift-点击转移物品
    @Override
    public ItemStack transferStackInSlot(PlayerEntity player, int index) {
        ItemStack stack = ItemStack.EMPTY;
        Slot slot = this.inventorySlots.get(index);

        if (slot != null && slot.getHasStack()) {
            ItemStack slotStack = slot.getStack();
            stack = slotStack.copy();

            // 从玩家物品栏（索引 0-35）→ 容器（索引 36 开始）
            if (index < 36) {
                if (!this.mergeItemStack(slotStack, 36, this.inventorySlots.size(), false)) {
                    return ItemStack.EMPTY;
                }
            } else {
                // 从容器 → 玩家物品栏
                if (!this.mergeItemStack(slotStack, 0, 36, false)) {
                    return ItemStack.EMPTY;
                }
            }

            slot.onSlotChange(slotStack, stack);
        }
        return stack;
    }

    @Override
    public boolean canInteractWith(PlayerEntity player) {
        return true; // 或添加距离检查
    }
}
```

### 3. 方块绑定 Container

```java
public class MyBlock extends Block implements ITileEntityProvider {
    @Override
    public TileEntity createTileEntity(BlockState state, IBlockReader world) {
        return new MyTileEntity();
    }

    @Override
    public boolean onBlockActivated(BlockState state, World world, BlockPos pos,
            PlayerEntity player, Hand hand, BlockRayTraceResult hit) {
        if (!world.isRemote) {
            TileEntity tile = world.getTileEntity(pos);
            if (tile instanceof MyTileEntity) {
                NetworkHooks.openGui(
                    (ServerPlayerEntity) player,
                    new SimpleNamedContainerProvider(
                        (id, inv, p) -> new MyContainer(id, inv, (IInteractionObject) tile),
                        Component.translatable("block.my_mod.my_block")
                    )
                );
            }
        }
        return true;
    }
}
```

### 4. 客户端 Screen 注册

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void init(FMLClientSetupEvent event) {
        ContainerScreens.register(MyContainers.MY_CONTAINER.get(), MyScreen::new);
    }
}
```

### 5. Screen 类（CLIENT ONLY）

```java
public class MyScreen extends ContainerScreen<MyContainer> {
    public MyScreen(MyContainer container, PlayerInventory inv, ITextComponent title) {
        super(container, inv, title);
    }

    @Override
    protected void init() {
        super.init();
        // 初始化 GUI 布局
    }

    @Override
    protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY) {
        // blit 在 this.guiLeft / this.guiTop 位置绘制背景 PNG
        this.minecraft.getTextureManager().bindTexture(new ResourceLocation(MOD_ID, "textures/gui/container/my_gui.png"));
        blit(this.guiLeft, this.guiTop, 0, 0, this.xSize, this.ySize);
    }
}
```

## 常见错误

- ❌ `ContainerScreens.register()` 放在服务端 → `FMLClientSetupEvent` 已经是客户端专用
- ❌ `transferStackInSlot` 返回空导致物品丢失 → 始终实现完整的转移逻辑
- ❌ `canInteractWith` 始终返回 true → 添加距离检查

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | ContainerType 需要 DeferredRegister 注册 |
| `mc-item` | 物品栏槽位中的 ItemStack 交互 |
