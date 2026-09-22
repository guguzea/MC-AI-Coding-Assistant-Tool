# FunctionManager

**Inheritance:** java.lang.Object → net.minecraft.advancements.FunctionManager

## Class signature

```java
public class FunctionManager extends java.lang.Object implements ITickable
```

## Constructors

- `FunctionManager(java.io.File functionDirIn, MinecraftServer serverIn)`

## Methods

- `int execute(FunctionObject function, ICommandSender sender)`
- `ICommandManager getCommandManager()`
- `FunctionObject getFunction(ResourceLocation id)`
- `java.util.Map<ResourceLocation, FunctionObject> getFunctions()`
- `int getMaxCommandChainLength()`
- `void reload()`
- `void update()`