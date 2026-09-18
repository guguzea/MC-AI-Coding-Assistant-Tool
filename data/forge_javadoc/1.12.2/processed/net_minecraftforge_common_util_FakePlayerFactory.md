# FakePlayerFactory

## Class signature

```java
public class FakePlayerFactory extends java.lang.Object
```

## Constructors

- `public FakePlayerFactory()`

## Methods

- `public static FakePlayer getMinecraft( WorldServer world)`
- `public static FakePlayer get( WorldServer world, GameProfile username)`
- `public static void unloadWorld( WorldServer world)`

## Description

Get a fake player with a given username, Mods should either hold weak references to the return value, or listen for a WorldEvent.Unload and kill all references to prevent worlds staying in memory.