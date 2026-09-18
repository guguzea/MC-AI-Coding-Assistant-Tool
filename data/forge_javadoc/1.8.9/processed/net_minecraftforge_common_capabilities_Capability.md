# Capability

## Class signature

```java
public class Capability<T> extends java.lang.Object
```

## Methods

- `public java.lang.String getName()`
- `public Capability.IStorage < T > getStorage()`
- `public T getDefaultInstance()`

## Description

This is the core holder object Capabilities. Each capability will have ONE instance of this class, and it will the the one passed into the ICapabilityProvider functions. The CapabilityManager is in ch