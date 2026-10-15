import type { AppContext } from './context.js';
import type { ShellEntry } from './config.js';
import type { EntryStatus } from './policy.js';
export interface StatusApiDeps {
    /** 是否 Windows（/status 的 supported 字段）。 */
    isWindows: boolean;
    /** 当前生效条目（即配置里的 shells 数组；空数组表示插件不生效）。 */
    currentEntries(): ShellEntry[];
    /** 条目运行时视图。 */
    statusView(): EntryStatus[];
    /** 已成功注册的工具名。 */
    registeredNames(): readonly string[];
    /** 按最新配置对齐策略（/status 的兜底对齐）。 */
    reconcile(): void;
}
/** 注册面板读写用的 HTTP API（所有平台都会注册）。 */
export declare function registerStatusApi(ctx: AppContext, deps: StatusApiDeps): void;
