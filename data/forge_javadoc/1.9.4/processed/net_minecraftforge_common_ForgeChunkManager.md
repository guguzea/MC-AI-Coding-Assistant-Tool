# ForgeChunkManager

## Class signature

```java
public class ForgeChunkManager extends java.lang.Object
```

## Constructors

- `public ForgeChunkManager()`

## Methods

- `public static java.util.Iterator< Chunk > getPersistentChunksIterableFor( World world, java.util.Iterator< Chunk > chunkIterator)`
- `public static boolean savedWorldHasForcedChunkTickets(java.io.File chunkDir)`
- `public static void setForcedChunkLoadingCallback(java.lang.Object mod, ForgeChunkManager.LoadingCallback callback)`
- `public static int ticketCountAvailableFor(java.lang.Object mod, World world)`
- `public static int getMaxTicketLengthFor(java.lang.String modId)`
- `public static int getMaxChunkDepthFor(java.lang.String modId)`
- `public static int ticketCountAvailableFor(java.lang.String username)`
- `public static ForgeChunkManager.Ticket requestPlayerTicket(java.lang.Object mod, java.lang.String player, World world, ForgeChunkManager.Type type)`
- `public static ForgeChunkManager.Ticket requestTicket(java.lang.Object mod, World world, ForgeChunkManager.Type type)`
- `public static void releaseTicket( ForgeChunkManager.Ticket ticket)`
- `public static void forceChunk( ForgeChunkManager.Ticket ticket, ChunkPos chunk)`
- `public static void reorderChunk( ForgeChunkManager.Ticket ticket, ChunkPos chunk)`
- `public static void unforceChunk( ForgeChunkManager.Ticket ticket, ChunkPos chunk)`
- `public static com.google.common.collect.ImmutableSetMultimap< ChunkPos , ForgeChunkManager.Ticket > getPersistentChunksFor( World world)`
- `public static void putDormantChunk(long coords, Chunk chunk)`
- `public static Chunk fetchDormantChunk(long coords, World world)`
- `public static void syncConfigDefaults()`
- `public static Configuration getConfig()`
- `public static ConfigCategory getDefaultsCategory()`
- `public static java.util.List< ConfigCategory > getModCategories()`
- `public static ConfigCategory getConfigFor(java.lang.Object mod)`
- `public static void addConfigProperty(java.lang.Object mod, java.lang.String propertyName, java.lang.String value, Property.Type type)`

## Description

Manages chunkloading for mods. The basic principle is a ticket based system. 1. Mods register a callback setForcedChunkLoadingCallback(Object, LoadingCallback) 2. Mods ask for a ticket requestTicket(O