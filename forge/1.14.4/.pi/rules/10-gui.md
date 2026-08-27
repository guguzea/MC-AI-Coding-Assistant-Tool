---
description: 10 — GUI / Container / Screen
---

# 10 — GUI / Container / Screen

> 适用版本：Forge 1.14.4

## Physical Side vs Logical Side

| Side | Meaning |
|------|---------|
| Physical CLIENT | The game process rendering the world |
| Physical SERVER | Dedicated server process (or integrated server in single-player) |
| Logical CLIENT | Code running on the client that can ONLY observe/render |
| Logical SERVER | Code running on the dedicated server that manages world state |

### Rules

- **Never** call client-only code from a logical server context
- **Never** modify server-side world data from the logical client
- Use `@OnlyIn(Dist.CLIENT)` for client-only code
- Use `DistExecutor` for safe side-aware execution without annotations

## DistExecutor

```java
DistExecutor.runWhenOn(Dist.CLIENT, () -> () -> MyClass.clientInit());
DistExecutor.runWhenOn(Dist.DEDICATED_SERVER, () -> () -> MyClass.dedicatedInit());
```

本档 DistExecutor **只有** `runWhenOn` / `callWhenOn` / `runForDist`（loader-api），**没有** `unsafeRunWhenOn` / `safeRunWhenOn`。

**Note:** `@OnlyIn` exists but **there is NO reason for using this annotation directly. Use `DistExecutor` or a check on `FMLEnvironment#dist` instead.**

## FMLEnvironment

```java
// Quick side check
if (FMLEnvironment.dist == Dist.CLIENT) {
    // client-only initialization
}

// NEVER use for game logic — only for initialization/setup
```

## GUI System Overview

```
Player interacts
      │
      ▼
Block#onBlockActivated (逻辑服务端) ──► NetworkHooks.openGui(ServerPlayerEntity, INamedContainerProvider, pos)
                                                           │
                                                           ▼
                                                   Container + ContainerScreen
                                                   （客户端 ScreenManager.registerFactory）
```

## Decision: Container type

```
IF interactable block with persistent data (machine, chest)
  → Container + ContainerType + IItemHandler + ContainerScreen

IF just a simple interaction (no data)
  → Screen directly (without Container)

IF inventory with multiple slots
  → Container (for slot management and transferStackInSlot)
```

## ContainerType Registration

```java
// 1. Define the Container class
public class MyContainer extends Container {
    public MyContainer(int windowId, PlayerInventory inv, PacketBuffer extraData) {
        super(MY_CONTAINER.get(), windowId);
        // extraData.readBlockPos() 后拿 TE / IItemHandler
    }

    @Override
    public boolean canInteractWith(PlayerEntity player) {
        return player.getDistanceSq(this.pos) <= 64.0D;
    }
}

// 2. Register ContainerType
public static final DeferredRegister<ContainerType<?>> CONTAINERS =
    new DeferredRegister<>(ForgeRegistries.CONTAINERS, MOD_ID);

public static final RegistryObject<ContainerType<MyContainer>> MY_CONTAINER =
    CONTAINERS.register("my_container",
        () -> IForgeContainerType.create(MyContainer::new)
    );
```

## Screen 注册（仅物理客户端）

`FMLClientSetupEvent` 在 **mod bus**。不要把 `GuiOpenEvent` 当 Screen 注册手段。

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void init(FMLClientSetupEvent event) {
        ScreenManager.registerFactory(MY_CONTAINER.get(), MyScreen::new);
    }
}
```

## Container → TileEntity binding

```java
// In TileEntity（ICapabilityProvider）
@Override
public <T> LazyOptional<T> getCapability(Capability<T> cap, Direction side) {
    if (cap == CapabilityItemHandler.ITEM_HANDLER_CAPABILITY) {
        return LazyOptional.of(() -> (T) handler);
    }
    return super.getCapability(cap, side);
}

// In Block
@Override
public boolean onBlockActivated(World world, BlockPos pos, BlockState state, PlayerEntity player,
                                 Hand hand, RayTraceResult hit) {
    if (!world.isRemote) {
        TileEntity tile = world.getTileEntity(pos);
        if (tile instanceof INamedContainerProvider) {
            NetworkHooks.openGui((ServerPlayerEntity) player,
                (INamedContainerProvider) tile, pos);
        }
    }
    return true;
}
```

## Common errors

- ❌ Opening a Container on the server without a registered `ContainerType` → crash
- ❌ `ScreenManager.registerFactory()` called on server → `FMLClientSetupEvent` already prevents this, but guard with `@OnlyIn(Dist.CLIENT)`
- ❌ `transferStackInSlot` not implemented → Shift-click does nothing
- ❌ Modifying world state in `Container` constructor → too early, use `onContainerClosed()` and `detectAndSendChanges()`
- ❌ Capability handler returning null → must return valid handler or `NullItemHandler`
