# MCPDummyContainer

## Class signature

```java
public class MCPDummyContainer extends DummyModContainer
```

## Constructors

- `public MCPDummyContainer( ModMetadata metadata)`

## Methods

- `public boolean registerBus(com.google.common.eventbus.EventBus bus, LoadController controller)`
- `public ModContainer.Disableable canBeDisabled()`

## Description

Register the event bus for the mod and the controller for error handling Returns if this bus was successfully registered - disabled mods and other mods that don't need real events should return false