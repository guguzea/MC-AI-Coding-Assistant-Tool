# TabCompleter

**Inheritance:** java.lang.Object → net.minecraft.util.TabCompleter

## Class signature

```java
public abstract class TabCompleter extends java.lang.Object
```

## Constructors

- `TabCompleter(GuiTextField textFieldIn, boolean hasTargetBlockIn)`

## Methods

- `void complete()`
- `abstract BlockPos getTargetBlockPos()`
- `void resetDidComplete()`
- `void resetRequested()`
- `void setCompletions(java.lang.String... newCompl)`

## Fields

- `protected int completionIdx`
- `protected java.util.List<java.lang.String> completions`
- `protected boolean didComplete`
- `protected boolean hasTargetBlock`
- `protected boolean requestedCompletions`
- `protected GuiTextField textField`