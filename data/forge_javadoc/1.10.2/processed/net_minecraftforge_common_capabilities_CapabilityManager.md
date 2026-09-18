# CapabilityManager

## Class signature

```java
public enum CapabilityManager extends java.lang.Enum< CapabilityManager >
```

## Methods

- `public static CapabilityManager [] values()`
- `public static CapabilityManager valueOf(java.lang.String name)`
- `public <T> void register(java.lang.Class<T> type, Capability.IStorage <T> storage, java.lang.Class<? extends T> implementation)`
- `public <T> void register(java.lang.Class<T> type, Capability.IStorage <T> storage, java.util.concurrent.Callable<? extends T> factory)`
- `public void injectCapabilities( ASMDataTable data)`

## Description

Registers a capability to be consumed by others.