# MinecraftForge.html#EVENT_BUS

## Class signature

```java
public class MinecraftForge extends java.lang.Object
```

## Methods

- `public MinecraftForge()`
- `public static void addGrassSeed(@Nonnull ItemStack seed, int weight)`
- `public static void addGrassSeed(net.minecraftforge.common.ForgeHooks.SeedEntry seed)`
- `public static void initialize()`
- `public static void preloadCrashClasses( ASMDataTable table, java.lang.String modID, java.util.Set<java.lang.String> classes)`

## Description

The core Forge EventBusses, all events for Forge will be fired on these, you should use this to register all your listeners.