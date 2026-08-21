---
name: mc-gui
description: Minecraft Forge GUI/菜单开发。创建自定义 ContainerMenu、Screen、DataSlot 数据同步。触发词：Screen、Menu、ContainerMenu、MenuType、MenuScreens、quickMoveStack、IContainerFactory、ContainerData、DataSlot
platform: forge
version: "1.18.2"
dependencies: []
mappings: parchment
---

# GUI/菜单开发（Forge 1.18.2）

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
    DeferredRegister.create(ForgeRegistries.CONTAINERS, MOD_ID);

public static final RegistryObject<MenuType<MyMenu>> MY_MENU =
    MENUS.register("my_menu",
        () -> IForgeMenuType.create(MyMenu::new)
    );

// 在 mod 构造函数中
MENUS.register(modEventBus);
```

### 2. 实现 AbstractContainerMenu

```java
public class MyMenu extends AbstractContainerMenu {
    private final SimpleContainerData dataSlots;

    // 服务端构造函数
    public MyMenu(int windowId, Inventory inv, Player player) {
        super(MY_MENU.get(), windowId);
        // 添加槽位（示例：3 行 9 列容器）
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(inv, col + row * 9, 8 + col * 18, 18 + row * 18));
            }
        }

        // 同步数据（服务端 → 客户端）
        this.dataSlots = new SimpleContainerData(1);
        this.addDataSlots(this.dataSlots);
    }

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

            if (slotIndex < 36) {
                if (!this.moveItemStackTo(slotStack, 36, this.slots.size(), false)) {
                    return ItemStack.EMPTY;
                }
            } else {
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
        return true;
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
            Component.literal("My Menu")
        );
    }

    @Override
    public InteractionResult use(BlockState state, Level level, BlockPos pos,
            Player player, InteractionHand hand, BlockHitResult result) {
        if (!level.isClientSide && player instanceof ServerPlayer serverPlayer) {
            MenuProvider p = state.getMenuProvider(level, pos);
            if (p != null) {
                NetworkHooks.openGui(serverPlayer, p);
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

## 常见错误

- ❌ `MenuScreens.register()` 放在服务端 → `FMLClientSetupEvent` 已经是客户端专用
- ❌ `quickMoveStack` 返回空导致物品丢失 → 始终实现完整的转移逻辑
- ❌ 方块 `getMenuProvider` 返回 null → `use()` 中检查 null

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | MenuType 需要 DeferredRegister 注册 |
| `mc-item` | 物品栏槽位中的 ItemStack 交互 |
| `mc-capability` | Container 可附加 Capability 管理自定义数据 |
