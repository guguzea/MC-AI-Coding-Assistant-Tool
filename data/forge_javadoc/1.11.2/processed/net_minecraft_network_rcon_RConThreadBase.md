# RConThreadBase

## Class signature

```java
public abstract class RConThreadBase extends java.lang.Object implements java.lang.Runnable
```

## Constructors

- `protected RConThreadBase( IServer serverIn, java.lang.String threadName)`

## Methods

- `public void startThread()`
- `public boolean isRunning()`
- `protected void logDebug(java.lang.String msg)`
- `protected void logInfo(java.lang.String msg)`
- `protected void logWarning(java.lang.String msg)`
- `protected void logSevere(java.lang.String msg)`
- `protected int getNumberOfPlayers()`
- `protected void registerSocket(java.net.DatagramSocket socket)`
- `protected boolean closeSocket(java.net.DatagramSocket socket, boolean removeFromList)`
- `protected boolean closeServerSocket(java.net.ServerSocket socket)`
- `protected boolean closeServerSocket_do(java.net.ServerSocket socket, boolean removeFromList)`
- `protected void closeAllSockets()`
- `protected void closeAllSockets_do(boolean logWarning)`