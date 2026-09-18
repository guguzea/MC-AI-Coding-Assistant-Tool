# ModSortingException

## Class signature

```java
public class ModSortingException extends EnhancedRuntimeException implements IDisplayableError
```

## Constructors

- `public ModSortingException(java.lang.String string, T node, java.util.Set<T> visitedNodes)`

## Methods

- `public <T> ModSortingException.SortingExceptionData <T> getExceptionData()`
- `protected void printStackTrace( EnhancedRuntimeException.WrappedPrintStream stream)`
- `public GuiScreen createGui()`