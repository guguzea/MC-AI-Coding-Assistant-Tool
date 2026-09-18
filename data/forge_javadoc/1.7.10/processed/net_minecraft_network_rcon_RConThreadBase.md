# RConThreadBase

## Class signature

```java
public abstract class RConThreadBase extends java.lang.Object implements java.lang.Runnable
```

## Constructors

- `protected RConThreadBase( IServer p_i45300_1_, java.lang.String p_i45300_2_)`

## Methods

- `public void startThread()`
- `public boolean isRunning()`
- `protected void logDebug(java.lang.String p_72607_1_)`
- `protected void logInfo(java.lang.String p_72609_1_)`
- `protected void logWarning(java.lang.String p_72606_1_)`
- `protected void logSevere(java.lang.String p_72610_1_)`
- `protected int getNumberOfPlayers()`
- `protected void registerSocket(java.net.DatagramSocket p_72601_1_)`
- `protected boolean closeSocket(java.net.DatagramSocket p_72604_1_, boolean p_72604_2_)`
- `protected boolean closeServerSocket(java.net.ServerSocket p_72608_1_)`
- `protected boolean closeServerSocket_do(java.net.ServerSocket p_72605_1_, boolean p_72605_2_)`
- `protected void closeAllSockets()`
- `protected void closeAllSockets_do(boolean p_72612_1_)`