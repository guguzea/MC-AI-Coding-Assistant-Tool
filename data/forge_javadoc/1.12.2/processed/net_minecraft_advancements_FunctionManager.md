# FunctionManager

## Class signature

```java
public class FunctionManager extends java.lang.Object implements ITickable
```

## Constructors

- `public FunctionManager(java.io.File functionDirIn, MinecraftServer serverIn)`

## Methods

- `public FunctionObject getFunction( ResourceLocation id)`
- `public ICommandManager getCommandManager()`
- `public int getMaxCommandChainLength()`
- `public java.util.Map< ResourceLocation , FunctionObject > getFunctions()`
- `public void update()`
- `public int execute( FunctionObject function, ICommandSender sender)`
- `public void reload()`