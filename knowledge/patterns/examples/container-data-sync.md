# ContainerData 进度同步（示范）

平台：Forge 1.20.1 · 依赖：mc-gui、`authored/menu-screen-sync`

机器进度条等**必须用 ContainerData**（或等价同步），不要只在 BE 里改 int 指望 GUI 自动更新。

```java
// Menu 构造：从 BE 暴露 data
super(TYPE, id);
this.blockEntity = be;
this.addDataSlots(new ContainerData() {
    @Override public int get(int i) { return i == 0 ? be.getProgress() : be.getMaxProgress(); }
    @Override public void set(int i, int v) { /* 一般只读，可留空 */ }
    @Override public int getCount() { return 2; }
});
```

Screen 侧：`this.menu` 的 `getData` / `ContainerData` 索引与 Menu 一致；`render` 里用 `menu.getData().get(0)` 画进度。

常见坑：在 `tick` 里直接改 Screen 字段而不经 ContainerData → 客户端不同步；详见 `authored/machine-be-gui-working`。
