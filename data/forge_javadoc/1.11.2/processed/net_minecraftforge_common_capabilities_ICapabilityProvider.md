# ICapabilityProvider

## Class signature

```java
public interface ICapabilityProvider
```

## Methods

- `boolean hasCapability(@Nonnull Capability <?> capability, @Nullable EnumFacing facing)`
- `@Nullable <T> T getCapability(@Nonnull Capability <T> capability, @Nullable EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.