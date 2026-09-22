# ForgeChunkManager

**Inheritance:** java.lang.Object → net.minecraftforge.common.ForgeChunkManager

## Class signature

```java
public class ForgeChunkManager extends java.lang.Object
```

## Constructors

- `ForgeChunkManager()`

## Methods

- `static void addConfigProperty(java.lang.Object mod, java.lang.String propertyName, java.lang.String value, Property.Type type)`
- `static Chunk fetchDormantChunk(long coords, World world)`
- `static void forceChunk(ForgeChunkManager.Ticket ticket, ChunkPos chunk)` — Force the supplied chunk coordinate to be loaded by the supplied ticket.
- `static Configuration getConfig()`
- `static ConfigCategory getConfigFor(java.lang.Object mod)`
- `static ConfigCategory getDefaultsCategory()`
- `static int getMaxChunkDepthFor(java.lang.String modId)`
- `static int getMaxTicketLengthFor(java.lang.String modId)`
- `static java.util.List<ConfigCategory> getModCategories()`
- `static<any> getPersistentChunksFor(World world)` — The list of persistent chunks in the world.
- `static java.util.Iterator<Chunk> getPersistentChunksIterableFor(World world, java.util.Iterator<Chunk> chunkIterator)`
- `static void putDormantChunk(long coords, Chunk chunk)`
- `static void releaseTicket(ForgeChunkManager.Ticket ticket)` — Release the ticket back to the system.
- `static void reorderChunk(ForgeChunkManager.Ticket ticket, ChunkPos chunk)` — Reorganize the internal chunk list so that the chunk supplied is at the *end* of the list This helps if you wish to guarantee a certain "automatic unload ordering" for the chunks in the ticket list
- `static ForgeChunkManager.Ticket requestPlayerTicket(java.lang.Object mod, java.lang.String player, World world, ForgeChunkManager.Type type)`
- `static ForgeChunkManager.Ticket requestTicket(java.lang.Object mod, World world, ForgeChunkManager.Type type)` — Request a chunkloading ticket of the appropriate type for the supplied mod
- `static boolean savedWorldHasForcedChunkTickets(java.io.File chunkDir)` — Allows dynamically loading world mods to test if there are chunk tickets in the world Mods that add dynamically generated worlds (like Mystcraft) should call this method to determine if the world should be loaded during server starting.
- `static void setForcedChunkLoadingCallback(java.lang.Object mod, ForgeChunkManager.LoadingCallback callback)` — Set a chunkloading callback for the supplied mod object
- `static void storeChunkNBT(Chunk chunk, NBTTagCompound nbt)`
- `static void syncConfigDefaults()` — Synchronizes the local fields with the values in the Configuration object.
- `static int ticketCountAvailableFor(java.lang.Object mod, World world)` — Discover the available tickets for the mod in the world
- `static int ticketCountAvailableFor(java.lang.String username)`
- `static void unforceChunk(ForgeChunkManager.Ticket ticket, ChunkPos chunk)` — Unforce the supplied chunk, allowing it to be unloaded and stop ticking.

## Fields

- `static boolean asyncChunkLoading`
- `static java.util.List<java.lang.String> MOD_PROP_ORDER`