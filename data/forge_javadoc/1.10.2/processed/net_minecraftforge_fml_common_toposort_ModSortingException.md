# ModSortingException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.lang.RuntimeException → net.minecraftforge.fml.common.EnhancedRuntimeException → net.minecraftforge.fml.common.toposort.ModSortingException

## Class signature

```java
public class ModSortingException extends EnhancedRuntimeException
```

## Constructors

- `ModSortingException(java.lang.String string, T node, java.util.Set<T> visitedNodes)`

## Methods

- `<T> ModSortingException.SortingExceptionData<T> getExceptionData()`
- `protected void printStackTrace(EnhancedRuntimeException.WrappedPrintStream stream)`