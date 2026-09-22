# MultipleModsErrored

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.lang.RuntimeException → net.minecraftforge.fml.common.EnhancedRuntimeException → net.minecraftforge.fml.common.MultipleModsErrored

## Class signature

```java
public class MultipleModsErrored extends EnhancedRuntimeException implements IDisplayableError
```

## Constructors

- `MultipleModsErrored(java.util.List<WrongMinecraftVersionException> wrongMinecraftExceptions, java.util.List<MissingModsException> missingModsExceptions)`

## Methods

- `GuiScreen createGui()`
- `protected void printStackTrace(EnhancedRuntimeException.WrappedPrintStream stream)`

## Fields

- `java.util.List<MissingModsException> missingModsExceptions`
- `java.util.List<WrongMinecraftVersionException> wrongMinecraftExceptions`