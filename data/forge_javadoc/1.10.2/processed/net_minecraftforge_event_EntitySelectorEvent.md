# EntitySelectorEvent

## Class signature

```java
public class EntitySelectorEvent extends Event
```

## Constructors

- `public EntitySelectorEvent(java.util.Map<java.lang.String,java.lang.String> map, java.lang.String mainSelector, ICommandSender sender, Vec3d position)`

## Methods

- `public void addPredicate(com.google.common.base.Predicate< Entity > selector)`
- `public java.lang.String getMainSelector()`
- `public java.util.Map<java.lang.String,java.lang.String> getArgumentMap()`
- `public Vec3d getPosition()`
- `public ICommandSender getSender()`

## Description

EntitySelectorEvent is fired whenever Minecraft collects entity selectors. This happens (one or multiple times) when you use something like @a[gamemode=1] in a command. This event is fired via ForgeEv