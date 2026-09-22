# FakePlayerFactory

**Inheritance:** java.lang.Object → net.minecraftforge.common.util.FakePlayerFactory

## Class signature

```java
public class FakePlayerFactory extends java.lang.Object
```

## Constructors

- `FakePlayerFactory()`

## Methods

- `static FakePlayer get(WorldServer world, com.mojang.authlib.GameProfile username)` — Get a fake player with a given username, Mods should either hold weak references to the return value, or listen for a WorldEvent.Unload and kill all references to prevent worlds staying in memory.
- `static FakePlayer getMinecraft(WorldServer world)`
- `static void unloadWorld(WorldServer world)`