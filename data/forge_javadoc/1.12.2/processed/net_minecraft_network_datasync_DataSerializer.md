# DataSerializer

## Class signature

```java
public interface DataSerializer<T>
```

## Methods

- `T copyValue(T value)`
- `DataParameter<T> createKey(int id)`
- `T read(PacketBuffer buf)`
- `void write(PacketBuffer buf, T value)`