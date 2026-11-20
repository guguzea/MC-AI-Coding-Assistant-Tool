package com.bandd.playtest.core;

/**
 * 命令的**诚实回执**：把「解析成功没有 / 返回值 / 解析错误 / 出错位置」四件事分开报。
 *
 * 为什么需要它：{@code chat_command} 原来只回 {@code {"sent":"<原命令>"}} ⇒ **一条跑了但什么都没做的
 * 命令，和一条根本没解析的命令长得一模一样**（真机踩过：{@code gamerule doDaylightCycle false}
 * 在 1.21.11 被拒，只能靠人肉读聊天栏才发现）。
 *
 * 本类由适配层填充（core 不碰 MC），字段名即回执里的键名：
 * {@code parsed} / {@code result} / {@code error} / {@code cursor}。
 */
public final class CommandResult {
    /** 命令是否被派发器**完整解析**（无异常、整串消费完、确实指向一条可执行命令）。 */
    public final boolean parsed;
    /** 执行返回值 / 影响；观察不到时 null（如多人下真正执行在服务端，客户端拿不到返回值）。 */
    public final String result;
    /** 解析或执行错误文本；无错 null。 */
    public final String error;
    /** 错误位置（字符游标）；无错或不知 null。 */
    public final Integer cursor;

    public CommandResult(boolean parsed, String result, String error, Integer cursor) {
        this.parsed = parsed;
        this.result = result;
        this.error = error;
        this.cursor = cursor;
    }

    @Override
    public String toString() {
        return "CommandResult{parsed=" + parsed + ", result=" + result
                + ", error=" + error + ", cursor=" + cursor + "}";
    }
}
