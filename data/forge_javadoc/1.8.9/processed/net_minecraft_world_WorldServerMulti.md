# WorldServerMulti

## Class signature

```java
public class WorldServerMulti extends WorldServer
```

## Constructors

- `public WorldServerMulti( MinecraftServer server, ISaveHandler saveHandlerIn, int dimensionId, WorldServer delegate, Profiler profilerIn)`

## Methods

- `protected void saveLevel() throws MinecraftException`
- `public World init()`
- `public void flush()`

## Description

Syncs all changes to disk and wait for completion.