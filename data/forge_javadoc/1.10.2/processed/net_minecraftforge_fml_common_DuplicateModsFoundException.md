# DuplicateModsFoundException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.lang.RuntimeException → net.minecraftforge.fml.common.EnhancedRuntimeException → net.minecraftforge.fml.common.LoaderException → net.minecraftforge.fml.common.DuplicateModsFoundException

## Class signature

```java
public class DuplicateModsFoundException extends LoaderException
```

## Constructors

- `DuplicateModsFoundException(com.google.common.collect.SetMultimap<ModContainer, java.io.File> dupes)`

## Methods

- `protected void printStackTrace(EnhancedRuntimeException.WrappedPrintStream stream)`

## Fields

- `com.google.common.collect.SetMultimap<ModContainer, java.io.File> dupes`