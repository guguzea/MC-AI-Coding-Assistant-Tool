# TabCompleter

## Class signature

```java
public abstract class TabCompleter extends java.lang.Object
```

## Constructors

- `public TabCompleter( GuiTextField textFieldIn, boolean hasTargetBlockIn)`

## Methods

- `public void complete()`
- `@Nullable public abstract BlockPos getTargetBlockPos()`
- `public void setCompletions(java.lang.String[] newCompl)`
- `public void resetDidComplete()`
- `public void resetRequested()`