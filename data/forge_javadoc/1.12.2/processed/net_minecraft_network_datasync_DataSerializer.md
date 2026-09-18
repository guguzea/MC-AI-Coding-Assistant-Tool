# DataSerializer

## Class signature

```java
public interface DataSerializer<T>
```

## Methods

- `void write( PacketBuffer buf, T value)`
- `T read( PacketBuffer buf) throws java.io.IOException`
- `DataParameter < T > createKey(int id)`
- `T copyValue( T value)`