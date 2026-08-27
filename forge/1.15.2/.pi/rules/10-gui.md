---
description: Client-Server separation and GUI (Forge 1.15.2)
---

# Client-Server separation and GUI (Forge 1.15.2)

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
Block#onBlockActivated (Server) ──► creates ITextComponent ──► openContainer (Server)
                                                       │
                                                       ▼
                                              Container + ContainerScreen pair
                                                       │
                                               ScreenManager.registerFactory()
                                                       │
                                                       ▼
                                                   Renders Screen
```

## Decision: Container type

```
IF interactable block with persistent data (machine, chest)
  → Container + ContainerScreen

IF just a simple interaction (no data)
  → ContainerScreen directly (without Container)

IF inventory with multiple slots
  → Container (for slot management and transferHandler)
```

## Container Registration

```java
// 1. Define the Container class
public class MyContainer extends Container {
    public MyContainer(int windowId, PlayerInventory inv, IInteractionObject target) {
        super(null, windowId);
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
public static final RegistryObject<ContainerType<MyContainer>> MY_CONTAINER =
    CONTAINERS.register("my_container",
        () -> IForgeContainerType.create(MyContainer::new)
    );
```

## Screen registration (CLIENT ONLY)

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void init(FMLClientSetupEvent event) {
        ScreenManager.registerFactory(MyContainers.MY_CONTAINER.get(), MyScreen::new);
    }
}
```

## Data Synchronization

```java
// Define synced data
// In TileEntity:
private int syncData;

@Override
public CompoundNBT getUpdateTag() {
    CompoundNBT nbt = super.getUpdateTag();
    nbt.putInt("syncData", syncData);
    return nbt;
}

@Override
public SUpdateTileEntityPacket getUpdatePacket() {
    return new SUpdateTileEntityPacket(this.pos, -1, this.getUpdateTag());
}

// Set from server
public void setSyncData(int value) {
    this.syncData = value;
    this.markDirty();
    this.world.notifyBlockUpdate(pos, getBlockState(), getBlockState(), 3);
}
```

## Block → Container binding

```java
public class MyBlock extends Block {
    @Override
    public boolean onBlockActivated(BlockState state, World world, BlockPos pos,
            PlayerEntity player, Hand hand, BlockRayTraceResult hit) {
        if (!world.isRemote) {
            NetworkHooks.openGui(
                (ServerPlayerEntity) player,
                new SimpleNamedContainerProvider(
                    (id, inv, p) -> new MyContainer(id, inv, target),
                    new TranslationTextComponent("container.my_container")
                )
            );
        }
        return true;
    }
}
```

## Common errors

- ❌ Opening a Container on the server without a registered `ContainerType` → crash
- ❌ `ScreenManager.registerFactory()` called on server → `FMLClientSetupEvent` already prevents this, but guard with `@OnlyIn(Dist.CLIENT)`
- ❌ `transferStackInSlot` not implemented → Shift-click does nothing
- ❌ Modifying world state in `Container` constructor → too early, use `onContainerOpened()`
- ❌ Data set from client → must be set server-side only
