# 事件相关反模式

## ❌ 在 TickEvent 中执行重操作

```java
// 错误
@SubscribeEvent
public void onServerTick(TickEvent.ServerTickEvent event) {
    if (event.phase == TickEvent.Phase.END) {
        for (Entity entity : world.getAllEntities()) { // ❌ 每 tick 遍历所有实体
            processHeavy(entity);
        }
    }
}
```

**错误症状**：服务端严重卡顿，TPS 下降

**正确方案**：使用计数器，每 N tick 处理一批

```java
private int tickCounter = 0;

@SubscribeEvent
public void onServerTick(TickEvent.ServerTickEvent event) {
    if (event.phase == TickEvent.Phase.END) {
        tickCounter++;
        if (tickCounter % 20 == 0) {  // 每秒处理一次
            scheduleProcessing();
        }
    }
}
```
