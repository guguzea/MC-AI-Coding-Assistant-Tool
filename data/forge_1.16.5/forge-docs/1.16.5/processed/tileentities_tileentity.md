# TileEntities

`TileEntities` are like simplified `Entities` that are bound to a Block. They are used to store dynamic data, execute tick based tasks, and dynamic rendering. Some examples from vanilla Minecraft would be handling of inventories on chests, smelting logic on furnaces, or area effects on beacons. More advanced examples exist in mods, such as quarries, sorting machines, pipes, and displays.


<!-- key:🟠 role:常见错误 -->


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note TileEntities aren&rsquo;t a solution for everything and they can cause lag when used wrongly. When possible, try to avoid them.

## Registering

Tile Entities are created and removed dynamically and as such are not registry objects on their own.

In order to create a `TileEntity`, you need to extend the `TileEntity` class. As such, another object is registered instead to easily create and refer to the *type* of the dynamic object. For a `TileEntity`, these are known as `TileEntityType`s.

A `TileEntityType` can be [registered](../../concepts/registries/#methods-for-registering) like any other registry object. To construct a `TileEntityType`, its builder form can be used via `TileEntityType$Builder#of`. This takes in two arguments: a `factory` representing some supplied method to create a new instance of the associated `TileEntity`, and a varargs of `validBlocks` which this `TileEntity` can be attached to. Building the `TileEntityType` is done by calling `TileEntityType$Builder#build`. This takes in a `Type` which represents the type-safe reference used to refer to this registry object in a `DataFixer`. Since `DataFixer`s are an optional system to use for mods, this can be passed as `null`.


<!-- key:🟢 role:示例代码 -->

```
// For some DeferredRegister<TileEntityType<?>> REGISTER
public static final RegistryObject<TileEntityType<MyTE>> MY_TE = REGISTER.register("myte", () -> TileEntityType.Builder.of(factory, validBlocks).build(null));
```

## Creating a `TileEntity

To create a <code>TileEntity` and attach it to a `Block`, two methods must be overridden within the `Block` subclass: ``` IForgeBlock#hasTileEntity(BlockState state) IForgeBlock#createTileEntity(BlockState state, IBlockReader world) ``` In most cases, `#hasTileEntity` will return `true` to indicate the block has a `TileEntity` and return a new instance of said `TileEntity` within `#createTileEntity`.

## Storing Data within your `TileEntity


<!-- key:🟠 role:常见错误 -->

In order to save data, override the following two methods: ``` TileEntity#save(CompoundNBT nbt) TileEntity#load(BlockState state, CompoundNBT nbt) ``` These methods are called whenever the <code>Chunk` containing the `TileEntity` gets loaded from/saved to NBT. Use them to read and write to the fields in your tile entity class.


<!-- key:🟠 role:常见错误 -->


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note Whenever your data changes, you need to call `TileEntity#setChanged`; otherwise, the `Chunk` containing your `TileEntity` might be skipped while the world is saved.


<!-- key:🔴 role:新手必读 (Important) -->

> **Important**: Important It is important that you call the `super` methods! The tag names id, x, y, z, ForgeData and ForgeCaps are reserved by the super methods.

## Ticking `TileEntities

If you need a ticking <code>TileEntity`, for example to keep track of the progress during a smelting process, you need to add the `net.minecraft.tileentity.ITickableTileEntity` interface to your `TileEntity`. Now you can implement all your calculations within `ITickableTileEntity#tick`.


<!-- key:🟠 role:常见错误 -->


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note This method is called each tick; therefore, you should avoid having complicated calculations in here. If possible, you should make more complex calculations every X ticks. (The amount of ticks in a second may be lower then 20 (twenty) but won&rsquo;t be higher)

## Synchronizing the Data to the Client

There are three ways of syncing data to the client: synchronizing on chunk load, on block updates, and with a custom network message.

### Synchronizing on Chunk Load

For this you need to override ``` TileEntity#getUpdateTag() IForgeTileEntity#handleUpdateTag(BlockState state, CompoundNBT nbt) ``` Again, this is pretty simple, the first method collects the data that should be sent to the client, while the second one processes that data. If your `TileEntity` doesn&rsquo;t contain much data, you might be able to use the methods out of the [Storing Data within your `TileEntity`](#storing-data-within-your-tileentity) section.


<!-- key:🔴 role:新手必读 (Important) -->

> **Important**: Important Synchronizing excessive/useless data for tile entities can lead to network congestion. You should optimize your network usage by sending only the information the client needs when the client needs it. For instance, it is more often than not unnecessary to send the inventory of a tile entity in the update tag, as this can be synchronized via its GUI.

### Synchronizing on Block Update

This method is a bit more complicated, but again you just need to override two methods. Here is a tiny example implementation of it: ``` @Override public SUpdateTileEntityPacket getUpdatePacket(){ CompoundNBT nbtTag = new CompoundNBT(); //Write your data into the nbtTag return new SUpdateTileEntityPacket(getBlockPos(), -1, nbtTag); } @Override public void onDataPacket(NetworkManager net, SUpdateTileEntityPacket pkt){ CompoundNBT tag = pkt.getTag(); //Handle your Data } ``` The Constructor of `SUpdateTileEntityPacket` takes:

- <li>The position of your `TileEntity`.
- <li>An ID, though it isn&rsquo;t really used besides by Vanilla; therefore, you can just put a -1 in there.
- <li>An `CompoundNBT` which should contain your data.

Now, to send the packet, an update notification must be given on the server. ``` World#sendBlockUpdated(BlockPos pos, BlockState oldState, BlockState newState, int flags) ``` The `pos` should be your `TileEntity`&rsquo;s position. For `oldState` and `newState`, you can pass the current `BlockState` at that position. `flags` is a bitmask that should contain `2`, which will sync the changes to the client. See `Constants$BlockFlags` for more info as well as the rest of the flags. The flag `2` is equivalent to `Constants$BlockFlags#BLOCK_UPDATE`.

### Synchronizing Using a Custom Network Message

This way of synchronizing is probably the most complicated but is usually the most optimized, as you can make sure that only the data you need to be synchronized is actually synchronized. You should first check out the [`Networking`](../../networking/) section and especially [`SimpleImpl`](../../networking/simpleimpl/) before attempting this. Once you&rsquo;ve created your custom network message, you can send it to all users that have the `TileEntity` loaded with `SimpleChannel#send(PacketDistributor$PacketTarget, MSG)`.


<!-- key:🔴 role:新手必读 (Warning) -->

> **Warning**: Warning It is important that you do safety checks, the TileEntity might already be destroyed/replaced when the message arrives at the player! You should also check if the chunk is loaded (World#hasChunkAt(BlockPos)).