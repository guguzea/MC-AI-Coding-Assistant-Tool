# AttachCapabilitiesEvent

## Class signature

```java
public class AttachCapabilitiesEvent extends Event
```

## Constructors

- `public AttachCapabilitiesEvent(java.lang.Object obj)`

## Methods

- `public java.lang.Object getObject()`
- `public void addCapability( ResourceLocation key, ICapabilityProvider cap)`
- `public java.util.Map< ResourceLocation , ICapabilityProvider > getCapabilities()`

## Description

Fired whenever an object with Capabilities support {currently TileEntity/Item/Entity) is created. Allowing for the attachment of arbitrary capability providers. Please note that as this is fired for A