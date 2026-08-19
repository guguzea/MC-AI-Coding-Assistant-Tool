---
name: mc-gui
description: Minecraft Forge GUI/菜单开发。创建自定义 Container、Screen、数据同步。触发词：Screen、Container、ContainerType、ScreenManager、transferStackInSlot、IForgeContainerType
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# GUI/菜单开发（Forge 1.14.4）

## Decision: 是否需要 Container

```
IF 交互时需要持久数据存储（机器进度、箱子物品）
  → 使用 Container + ContainerType + ContainerScreen

IF 只是显示 UI（无数据）
  → 直接使用 Screen（无需 Container）

IF 需要物品栏槽位（多格容器）
  → Container（slot 管理 + transferStackInSlot）
```

## 完整示例：方块交互打开 GUI

### 1. 注册 ContainerType

```java
public static final DeferredRegister<ContainerType<?>> MENUS =
    DeferredRegister.create(ForgeRegistries.CONTAINERS, MOD_ID);

public static final RegistryObject<ContainerType<MyMenu>> MY_MENU =
    MENUS.register("my_menu",
        () -> IForgeContainerType.create(MyMenu::new)
    );

// 在 mod 构造函数中
MENUS.register(modEventBus);
```

### 2. 实现 Container

```java
public class MyMenu extends Container {
    private final IIntArray dataSlots;

    // 客户端工厂走 IForgeContainerType：int + PlayerInventory + PacketBuffer
    public MyMenu(int windowId, PlayerInventory inv, PacketBuffer extraData) {
        super(MY_MENU.get(), windowId);
        // 添加槽位（示例：3 行 9 列容器 = 27 格，索引 0-26）
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(inv, col + row * 9, 8 + col * 18, 18 + row * 18));
            }
        }

        // 同步数据（服务端 → 客户端）
        this.dataSlots = new IntArray(1); // 1 个整数同步
        this.trackIntArray(this.dataSlots);
    }

    // 提供 getter 让 Screen 读取数据
    public IIntArray getData() {
        return this.dataSlots;
    }

    // Shift-点击转移物品
    @Override
    public ItemStack transferStackInSlot(PlayerEntity player, int slotIndex) {
        ItemStack stack = ItemStack.EMPTY;
        Slot slot = this.slots.get(slotIndex);

        if (slot.hasItem()) {
            ItemStack slotStack = slot.getItem();
            stack = slotStack.copy();

            // 从玩家物品栏（索引 0-35）→ 容器（索引 36 开始）
            if (slotIndex < 36) {
                if (!this.moveItemStackTo(slotStack, 36, this.slots.size(), false)) {
                    return ItemStack.EMPTY;
                }
            } else {
                // 从容器 → 玩家物品栏
                if (!this.moveItemStackTo(slotStack, 0, 36, false)) {
                    return ItemStack.EMPTY;
                }
            }

            slot.setChanged();
        }
        return stack;
    }

    @Override
    public boolean canInteractWith(PlayerEntity player) {
        return true; // 或添加距离检查
    }
}
```

### 3. 方块打开 GUI

本档用 `NetworkHooks.openGui`，不要 `openScreen`（邻版）。不要 `EntityBlock`。

```java
public class MyBlock extends Block {
    @Override
    public ActionResultType onBlockActivated(BlockState state, World world, BlockPos pos,
            PlayerEntity player, Hand hand, BlockRayTraceResult hit) {
        if (!world.isRemote && player instanceof ServerPlayerEntity) {
            TileEntity te = world.getTileEntity(pos);
            if (te instanceof INamedContainerProvider) {
                NetworkHooks.openGui((ServerPlayerEntity) player, (INamedContainerProvider) te, pos);
            }
        }
        return ActionResultType.SUCCESS;
    }
}
```

### 4. 客户端 Screen 注册

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onClientSetup(FMLClientSetupEvent event) {
        event.enqueueWork(() ->
            ScreenManager.registerFactory(MY_MENU.get(), MyScreen::new)
        );
    }
}
```

### 5. Screen 类（CLIENT ONLY）

```java
public class MyScreen extends ContainerScreen<MyMenu> {
    private int progress; // 本地缓存，用于渲染

    public MyScreen(MyMenu menu, PlayerInventory playerInventory, ITextComponent title) {
        super(menu, playerInventory, title);
        this.progress = 0;
    }

    @Override
    protected void init() {
        super.init();
        // 初始化 GUI 布局
    }

    @Override
    protected void tick() {
        super.tick();
        // 每帧同步数据
        this.progress = this.menu.getData().get(0);
    }

    @Override
    protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY) {
        this.minecraft.getTextureManager().bindTexture(BACKGROUND_TEXTURE);
        int x = (this.width - this.xSize) / 2;
        int y = (this.height - this.ySize) / 2;
        this.blit(x, y, 0, 0, this.xSize, this.ySize);
        int barWidth = (int)(this.progress / 100.0 * this.xSize);
        fill(x, y, x + barWidth, y + 14, 0xFF55FF55);
    }

    private static final ResourceLocation BACKGROUND_TEXTURE =
        new ResourceLocation(MOD_ID, "textures/gui/container/my_gui.png");
}
```

## IIntArray 同步（服务端 ↔ 客户端）

Container 自己持有 `IIntArray` 并提供 `getData()` getter，Screen 通过 `menu.getData()` 访问：

```java
// 服务端设置
this.menu.getData().set(0, newValue); // 自动同步到客户端

// 客户端读取（Screen 中）
int value = this.menu.getData().get(0);
```

## 常见错误

- ❌ `ScreenManager.registerFactory()` 放在服务端 → `FMLClientSetupEvent` 已经是客户端专用
- ❌ `transferStackInSlot` 返回空导致物品丢失 → 始终实现完整的转移逻辑
- ❌ 方块未提供 `INamedContainerProvider` → `onBlockActivated` 里检查 TileEntity
- ❌ 在 Container 构造函数中直接修改世界数据 → 使用 `detectAndSendChanges()`
- ❌ `canInteractWith()` 始终返回 true → 添加距离检查

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-registry` | ContainerType、Slot 等需要 DeferredRegister 注册 |
| `mc-item` | 物品栏槽位中的 ItemStack 交互 |
| `mc-capability` | Container 可附加 Capability 管理自定义数据 |
