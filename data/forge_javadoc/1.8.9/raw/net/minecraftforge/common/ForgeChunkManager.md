---
title: "ForgeChunkManager"
description: "Manages chunkloading for mods. The basic principle is a ticket based system. 1. Mods register a callback setForcedChunkLoadingCallback(Object, LoadingCallback) 2. Mods ask for a ticket requestTicket(O"
package: "net/minecraftforge/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/ForgeChunkManager.html"
sourceType: javadoc
---

# ForgeChunkManager

## Class signature

```java
public class ForgeChunkManager extends java.lang.Object
```

## Constructors

- `public ForgeChunkManager()`

## Methods

- `public static boolean savedWorldHasForcedChunkTickets(java.io.File chunkDir)`
- `public static void setForcedChunkLoadingCallback(java.lang.Object mod, ForgeChunkManager.LoadingCallback callback)`
- `public static int ticketCountAvailableFor(java.lang.Object mod, World world)`
- `public static int getMaxTicketLengthFor(java.lang.String modId)`
- `public static int getMaxChunkDepthFor(java.lang.String modId)`
- `public static int ticketCountAvailableFor(java.lang.String username)`
- `public static ForgeChunkManager.Ticket requestPlayerTicket(java.lang.Object mod, java.lang.String player, World world, ForgeChunkManager.Type type)`
- `public static ForgeChunkManager.Ticket requestTicket(java.lang.Object mod, World world, ForgeChunkManager.Type type)`
- `public static void releaseTicket( ForgeChunkManager.Ticket ticket)`
- `public static void forceChunk( ForgeChunkManager.Ticket ticket, ChunkCoordIntPair chunk)`
- `public static void reorderChunk( ForgeChunkManager.Ticket ticket, ChunkCoordIntPair chunk)`
- `public static void unforceChunk( ForgeChunkManager.Ticket ticket, ChunkCoordIntPair chunk)`
- `public static <any> getPersistentChunksFor( World world)`
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
