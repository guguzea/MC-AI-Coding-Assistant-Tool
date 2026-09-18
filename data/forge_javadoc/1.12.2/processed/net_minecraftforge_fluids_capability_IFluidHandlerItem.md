# IFluidHandlerItem

## Class signature

```java
public interface IFluidHandlerItem extends IFluidHandler
```

## Methods

- `ItemStack getContainer()`

## Description

ItemStacks handled by an IFluidHandler may change, so this class allows users of the fluid handler to get the container after it has been used.