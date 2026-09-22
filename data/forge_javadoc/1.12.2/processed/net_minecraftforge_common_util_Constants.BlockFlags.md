# Constants.BlockFlags

**Inheritance:** java.lang.Object → net.minecraftforge.common.util.Constants.BlockFlags

## Class signature

```java
public static class Constants.BlockFlags extends java.lang.Object
```

## Constructors

- `BlockFlags()`

## Fields

- `static int DEFAULT`
- `static int DEFAULT_AND_RERENDER`
- `static int NO_OBSERVERS` — Disables observers from seeing this update
- `static int NO_RERENDER` — Stops the blocks from being marked for a render update
- `static int NOTIFY_NEIGHBORS` — Calls neighborChanged on surrounding blocks
- `static int RERENDER_MAIN_THREAD` — Makes the block be re-rendered immediately, on the main thread.
- `static int SEND_TO_CLIENTS` — Sends the update to the client