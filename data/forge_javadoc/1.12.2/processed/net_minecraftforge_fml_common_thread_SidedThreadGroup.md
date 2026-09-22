# SidedThreadGroup

**Inheritance:** java.lang.Object → java.lang.ThreadGroup → net.minecraftforge.fml.common.thread.SidedThreadGroup

## Class signature

```java
public final class SidedThreadGroup extends java.lang.ThreadGroup implements java.util.concurrent.ThreadFactory
```

## Methods

- `Side getSide()` — Gets the side this sided thread group belongs to.
- `java.lang.Thread newThread(java.lang.Runnable runnable)`