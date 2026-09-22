# IMessage

## Class signature

```java
public interface IMessage
```

## Methods

- `void fromBytes(ByteBuf buf)` — Convert from the supplied buffer into your specific message type
- `void toBytes(ByteBuf buf)` — Deconstruct your message into the supplied byte buffer