import java.io.File;

/**
 * **默认包** tick 代理 —— 给「**还没进世界**」的阶段提供 MC 线程上的每帧回调。
 *
 * 为什么需要它：ModLoader 的 onTick 由它自己的 EntityRendererProxy 调，而那个代理是
 * ModLoader.registerServer 在**集成服启动**时才装进 ats.p 的（registerServer 的字节码：
 * getstatic instance; new EntityRendererProxy(instance); putfield ats.p:Lbfb;）⇒ 进世界前
 * ModLoader.onTick 根本不会被调，setInGameHook 注册的 onTickInGame 也就不会跑。
 * 而 HTTP 动作必须在 **MC 线程**上执行（HTTP 线程碰 MC 会崩）⇒ 得自己造一个 tick 源。
 *
 * 形状照抄 ModLoader 自己的 EntityRendererProxy（extends bfb、覆写 b(float)、先 super 再回调）：
 *   EntityRendererProxy.b(float): aload_0; fload_1; invokespecial bfb.b(F)V;
 *                                 fload_1; getfield game:Lats; invokestatic ModLoader.onTick(FLats;)V
 * 调用点：ats 主循环里 getfield p:Lbfb; ... invokevirtual bfb.b:(F)V（每帧一次）。
 *
 * 装配时机由 mod_bandd_playtest 的看门狗负责（只在 ats.p 是朴素 bfb 时替换，绝不覆盖
 * ModLoader 的 EntityRendererProxy）。
 */
public class BanddTickProxy extends bfb {

    private final ats game;

    public BanddTickProxy(ats game) {
        super(game);
        this.game = game;
    }

    @Override
    public void b(float partialTicks) {
        super.b(partialTicks);
        mod_bandd_playtest.tickFromGameThread(this.game);
    }
}
