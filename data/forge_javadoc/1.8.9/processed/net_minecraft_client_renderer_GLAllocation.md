# GLAllocation

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.GLAllocation

## Class signature

```java
public class GLAllocation extends java.lang.Object
```

## Constructors

- `GLAllocation()`

## Methods

- `static java.nio.ByteBuffer createDirectByteBuffer(int capacity)` — Creates and returns a direct byte buffer with the specified capacity.
- `static java.nio.FloatBuffer createDirectFloatBuffer(int capacity)` — Creates and returns a direct float buffer with the specified capacity.
- `static java.nio.IntBuffer createDirectIntBuffer(int capacity)` — Creates and returns a direct int buffer with the specified capacity.
- `static void deleteDisplayLists(int list)`
- `static void deleteDisplayLists(int list, int range)`
- `static int generateDisplayLists(int range)` — Generates the specified number of display lists and returns the first index.