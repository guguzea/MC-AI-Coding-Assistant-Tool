# MCPDummyContainer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.DummyModContainer → net.minecraftforge.fml.common.MCPDummyContainer

## Class signature

```java
public class MCPDummyContainer extends DummyModContainer
```

## Methods

- `ModContainer.Disableable canBeDisabled()`
- `boolean registerBus(EventBus bus, LoadController controller)` — Register the event bus for the mod and the controller for error handling Returns if this bus was successfully registered - disabled mods and other mods that don't need real events should return false and avoid further processing

## Fields

- `MCPDummyContainer`