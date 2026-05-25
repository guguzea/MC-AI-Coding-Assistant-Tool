---
name: mc-gui
description: Minecraft Forge GUI/菜单开发。创建自定义 ContainerMenu、Screen、DataSlot 数据同步。触发词：Screen、Menu、ContainerMenu、MenuType、MenuScreens、quickMoveStack、IContainerFactory、ContainerData、DataSlot
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# GUI/菜单开发（Forge 1.20.1）

## Decision: 是否需要 Menu

```
IF 交互时需要持久数据存储（机器进度、箱子物品）
  → 使用 AbstractContainerMenu + MenuType + Screen

IF 只是显示 UI（无数据）
  → 直接使用 Screen（无需 Menu）

IF 需要物品栏槽位（多格容器）
  → AbstractContainerMenu（slot 管理 + quickMoveStack）
```

## 完整示例：方块交互打开 GUI

### 1. 注册 MenuType

```java
public static final DeferredRegister<MenuType<?>> MENUS =
    DeferredRegister.create(ForgeRegistries.MENU_TYPES, MOD_ID);

public static final RegistryObject<MenuType<MyMenu>> MY_MENU =
    MENUS.register("my_menu",
        () -> new MenuType<>(MyMenu::new, FeatureFlags.DEFAULT_FLAGS)
    );

// 在 mod 构造函数中
MENUS.register(modEventBus);
```

### 2. 实现 AbstractContainerMenu

```java
public class MyMenu extends AbstractContainerMenu {
    private final SimpleContainerData dataSlots;

    // 服务端构造函数（3 参数：通过 NetworkHooks.openScreen 调用）
    public MyMenu(int windowId, Inventory inv, Player player) {
        super(MY_MENU.get(), windowId);
        // 添加槽位（示例：3 行 9 列容器 = 27 格，索引 0-26）
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(inv, col + row * 9, 8 + col * 18, 18 + row * 18));
            }
        }

        // 同步数据（服务端 → 客户端）
        this.dataSlots = new SimpleContainerData(1); // 1 个整数同步
        this.addDataSlots(this.dataSlots);
    }

    // 提供 getter 让 Screen 读取数据
    public SimpleContainerData getData() {
        return this.dataSlots;
    }

    // Shift-点击转移物品
    @Override
    public ItemStack quickMoveStack(Player player, int slotIndex) {
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
    public boolean stillValid(Player player) {
        return true; // 或添加距离检查
    }
}
```

### 3. 方块绑定 MenuProvider

```java
public class MyBlock extends Block implements EntityBlock {
    @Override
    public MenuProvider getMenuProvider(BlockState state, Level level, BlockPos pos) {
        return new SimpleMenuProvider(
            (id, inv, player) -> new MyMenu(id, inv, player),
            Component.translatable("block." + MOD_ID + ".my_block")
        );
    }

    @Override
    public InteractionResult use(BlockState state, Level level, BlockPos pos,
            Player player, InteractionHand hand, BlockHitResult result) {
        if (!level.isClientSide && player instanceof ServerPlayer serverPlayer) {
            MenuProvider p = state.getMenuProvider(level, pos);
            if (p != null) {
                NetworkHooks.openScreen(serverPlayer, p);
            }
        }
        return InteractionResult.sidedSuccess(level.isClientSide);
    }
}
```

### 4. 客户端 Screen 注册

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void init(FMLClientSetupEvent event) {
        event.enqueueWork(() ->
            MenuScreens.register(MY_MENU.get(), MyScreen::new)
        );
    }
}
```

### 5. Screen 类（CLIENT ONLY）

```java
public class MyScreen extends AbstractContainerMenuScreen<MyMenu> {
    private int progress; // 本地缓存，用于渲染

    public MyScreen(MyMenu menu, Inventory playerInventory, Component title) {
        super(menu, playerInventory, title);
        this.progress = 0;
    }

    @Override
    protected void init() {
        super.init();
        // 初始化 GUI 布局
    }

    @Override
    protected void containerTick() {
        super.containerTick();
        // 每帧同步数据
        this.progress = this.menu.getData().get(0);
    }

    @Override
    protected void renderBg(GuiGraphics graphics, float partialTick, int mouseX, int mouseY) {
        // blit 在 this.leftPos / this.topPos 位置绘制背景 PNG
        graphics.blit(BACKGROUND_TEXTURE, this.leftPos, this.topPos,
            0, 0, this.imageWidth, this.imageHeight);
        // 叠加进度条
        int barWidth = (int)(this.progress / 100.0 * this.imageWidth);
        graphics.fill(this.leftPos, this.topPos,
            this.leftPos + barWidth, this.topPos + 14, 0xFF55FF55);
    }

    private static final ResourceLocation BACKGROUND_TEXTURE =
        new ResourceLocation(MOD_ID, "textures/gui/container/my_gui.png");
}
```

## ContainerData 同步（服务端 ↔ 客户端）

Menu 自己持有 `SimpleContainerData` 并提供 `getData()` getter，Screen 通过 `menu.getData()` 访问：

```java
// 服务端设置
this.menu.getData().set(0, newValue); // 自动同步到客户端

// 客户端读取（Screen 中）
int value = this.menu.getData().get(0);
```

## DataSlot（槽位级别同步，已过时）

Forge 1.20.1 推荐使用 `ContainerData`/`SimpleContainerData` 而非 `DataSlot`。

## 常见错误

- ❌ `MenuScreens.register()` 放在服务端 → `FMLClientSetupEvent` 已经是客户端专用
- ❌ `quickMoveStack` 返回空导致物品丢失 → 始终实现完整的转移逻辑
- ❌ 方块 `getMenuProvider` 返回 null → `use()` 中检查 null
- ❌ 在 Menu 构造函数中直接修改世界数据 → 使用 `broadcastChanges()` 批量同步
- ❌ `stillValid()` 始终返回 true → 添加距离检查 `player.distanceToSqr(...) <= 8.0`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | MenuType、Slot 等需要 DeferredRegister 注册 |
| `mc-item` | 物品栏槽位中的 ItemStack 交互 |
| `mc-capability` | Container 可附加 Capability 管理自定义数据 |