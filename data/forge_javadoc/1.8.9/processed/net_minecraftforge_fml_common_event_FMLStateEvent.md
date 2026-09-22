# FMLStateEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLStateEvent

## Class signature

```java
public abstract class FMLStateEvent extends FMLEvent
```

## Constructors

- `FMLStateEvent(java.lang.Object... data)`

## Methods

- `abstract LoaderState.ModState getModState()` — The current state of the mod
- `Side getSide()` — The side we're loading on.