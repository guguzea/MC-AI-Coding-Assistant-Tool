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
// Run on the CLIENT only
DistExecutor.unsafeRunWhenOn(Dist.CLIENT, () -> MyClass::clientInit);

// Run on the DEDICATED_SERVER only
DistExecutor.unsafeRunWhenOn(Dist.DEDICATED_SERVER, () -> MyClass::serverInit);

// Safe version with supplier (avoids classloading issues on wrong side)
DistExecutor.safeRunWhenOn(Dist.CLIENT, () -> () -> MyClass.clientInit());
```

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
Block#onBlockActivated (Server) ──► creates IItemHandler ──► openContainer (Server)
                                                           │
                                                           ▼
                                                   Container + ContainerScreen pair
                                                           │
                                                   Container.openGui()
                                                           │
                                                           ▼
                                                   Renders Screen
```

## Decision: Container type

```
IF interactable block with persistent data (machine, chest)
  → AbstractContainerMenu + ContainerType + IItemHandler + ContainerScreen

IF just a simple interaction (no data)
  → Screen directly (without Container)

IF inventory with multiple slots
  → AbstractContainerMenu (for slot management and transferStackInSlot)
```

## ContainerType Registration

```java
// 1. Define the Container class
public class MyContainer extends AbstractContainerMenu {
    public MyContainer(int windowId, PlayerInventory inv, IItemHandler handler) {
        super(MY_CONTAINER_TYPE.get(), windowId);
        // slot layout...
    }

    // Shift-click transfer logic
    @Override
    public ItemStack transferStackInSlot(PlayerEntity player, int index) {
        return ItemStack.EMPTY; // or implement slot transfer
    }

    @Override
    public boolean canInteractWith(PlayerEntity player) {
        return true;
    }
}

// 2. Register ContainerType
public static final DeferredRegister<ContainerType<?>> CONTAINERS =
    DeferredRegister.create(ForgeRegistries.CONTAINERS, MOD_ID);

public static final RegistryObject<ContainerType<MyContainer>> MY_CONTAINER =
    CONTAINERS.register("my_container",
        () -> new ContainerType<>(MyContainer::new)
    );
```

## Screen registration (CLIENT ONLY)

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void init(FMLClientSetupEvent event) {
        ScreenManager.registerFactory(MY_CONTAINER_TYPE.get(), MyScreen::new);
    }
}
```

## Container → TileEntity binding

```java
// In TileEntity
public IItemHandler getCapability(Capability<IItemHandler> cap, Direction side) {
    return handler;
}

// In Block
@Override
public boolean onBlockActivated(World world, BlockPos pos, BlockState state, PlayerEntity player,
                                 Hand hand, RayTraceResult hit) {
    if (!world.isRemote) {
        TileEntity tile = world.getTileEntity(pos);
        if (tile instanceof IItemHandlerProvider) {
            NetworkHooks.openGui((ServerPlayerEntity) player,
                new ResourceLocation(MOD_ID, "my_gui"),
                buf -> buf.writeBlockPos(pos));
        }
    }
    return true;
}
```

## GUI Handler

```java
// In mod's GUI handler registry
@SubscribeEvent
public static void onGuiOpen(GuiOpenEvent event) {
    if (event.getGui() != null) {
        // Handle GUI opening
    }
}
```

## Common errors

- ❌ Opening a Container on the server without a registered `ContainerType` → crash
- ❌ `ScreenManager.registerFactory()` called on server → `FMLClientSetupEvent` already prevents this, but guard with `@OnlyIn(Dist.CLIENT)`
- ❌ `transferStackInSlot` not implemented → Shift-click does nothing
- ❌ Modifying world state in `AbstractContainerMenu` constructor → too early, use `onContainerClosed()` and `detectAndSendChanges()`
- ❌ Capability handler returning null → must return valid handler or `NullItemHandler`
