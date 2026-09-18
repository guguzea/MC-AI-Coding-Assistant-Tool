# FluidActionResult

## Class signature

```java
public class FluidActionResult extends java.lang.Object
```

## Constructors

- `public FluidActionResult( ItemStack result)`

## Methods

- `public boolean isSuccess()`
- `public ItemStack getResult()`

## Description

Holds the result of a fluid action from FluidUtil . Failed actions will always have isSuccess() == false and an empty ItemStack result. See FAILURE . Successful actions will always have isSuccess() ==