---
name: mc-gui
description: Minecraft Forge GUI/菜单开发。创建自定义 Container、Screen、数据同步。触发词：Screen、Container、ContainerType、ContainerScreens、IContainerProvider
platform: forge
version: "1.16.5"
dependencies: []
mappings: parchment
---

# GUI/菜单开发（Forge 1.16.5）

## Decision: 是否需要 Container

```
IF 交互时需要持久数据存储（机器进度、箱子物品）
  → 使用 AbstractContainerMenu + ContainerType + ContainerScreen

IF 只是显示 UI（无数据）
  → 直接使用 Screen（无需 Container）

IF 需要物品栏槽位（多格容器）
  → AbstractContainerMenu（slot 管理）
```

## 完整示例：方块交互打开 GUI

### 1. 注册 ContainerType

```java
public static final DeferredRegister<ContainerType<?>> CONTAINERS =
    DeferredRegister.create(ForgeRegistries.CONTAINERS, MOD_ID);

public static final RegistryObject<ContainerType<MyContainer>> MY_CONTAINER =
    CONTAINERS.register("my_container",
        () -> IContainerFactory.of(MyContainer::new)
    );

// 在 mod 构造函数中
CONTAINERS.register(modEventBus);
```

### 2. 实现 AbstractContainerMenu

```java
public class MyContainer extends AbstractContainerMenu {
    private final IIntArray dataSlots;

    // 服务端构造函数
    public MyContainer(int windowId, PlayerInventory inv, PacketBuffer extraData) {
        super(MyContainerTypes.MY_CONTAINER.get(), windowId);
        // 添加槽位（示例：3 行 9 列容器 = 27 格，索引 0-26）
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(inv, col + row * 9, 8 + col * 18, 18 + row * 18));
            }
        }

        // 同步数据（服务端 → 客户端）
        this.dataSlots = new IIntArray(1); // 1 个整数同步
        this.trackIntArray(this.dataSlots);
    }

    @Override
    public boolean canInteractWith(PlayerEntity playerIn) {
        return true; // 或添加距离检查
    }
}
```

### 3. 方块绑定 IContainerProvider

```java
public class MyBlock extends Block {
    @Override
    public ActionResult onBlockActivated(BlockState state, World world, BlockPos pos,
            PlayerEntity player, Hand hand, BlockRayTraceResult hit) {
        if (!world.isRemote) {
            // 服务端打开 GUI
            NetworkHooks.openGui(
                (ServerPlayerEntity) player,
                new SimpleNamedContainerProvider(
                    (id, inv, p) -> new MyContainer(id, inv, world, pos),
                    Text.of("My Container")
                ),
                pos
            );
        }
        return ActionResult.func_233537_a_(world.isRemote);
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
            ContainerScreens.register(MY_CONTAINER.get(), MyScreen::new)
        );
    }
}
```

### 5. Screen 类（CLIENT ONLY）

```java
public class MyScreen extends ContainerScreen<MyContainer> {
    private int progress;

    public MyScreen(MyContainer menu, PlayerInventory inventory, ITextComponent title) {
        super(menu, inventory, title);
        this.progress = 0;
    }

    @Override
    protected void init() {
        super.init();
    }

    @Override
    protected void tick() {
        super.tick();
        this.progress = this.menu.dataSlots.get(0);
    }

    @Override
    protected void renderGuiContainerBackground(float partialTicks, int mouseX, int mouseY) {
        RenderSystem.coloredLossyTexture(0xFFFFFFFF, 0xFF55FF55);
        // 绘制背景
    }
}
```

## 数据同步（IIntArray）

Menu 自己持有 `IIntArray` 并通过 `trackIntArray` 注册，Screen 通过 `menu.dataSlots` 访问：

```java
// 服务端设置
this.dataSlots.set(0, newValue); // 自动同步到客户端

// 客户端读取（Screen 中）
int value = this.menu.dataSlots.get(0);
```

## 常见错误

- ❌ `ContainerScreens.register()` 放在服务端 → `FMLClientSetupEvent` 已经是客户端专用
- ❌ `canInteractWith` 始终返回 true → 添加距离检查
- ❌ 在 Menu 构造函数中直接修改世界数据 → 使用 `detectAndSendChanges()`

## 参考资料

- 详细示例：参见 `10-gui.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | ContainerType 需要 DeferredRegister 注册 |
| `mc-item` | 物品栏槽位中的 ItemStack 交互 |
| `mc-capability` | Container 可附加 Capability 管理自定义数据 |
