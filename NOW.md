# NOW.md — 当前状态

> 接续任务时读本文件；**状态实质变化时直接修订本节**，不追加矛盾快照。
> 核验：2026-10-09，范围＝本仓库工作副本（`E:\DSHProjects\dsh-windows-shell-policy`，`main`）。

## 当前目标

仓库处于 `v0.1.1` 功能完成、**已改名为 `dsh-windows-shell-manager`、完成模块化拆分、并已移除上游配置迁移功能（全新安装不再自动生成条目）、尚未提交到远端**的状态：包名与 owner 引用（`LAN-TINA-WS` → `EidnG3lZ`）已全局更新，HTTP API 路径改为 `/dsh-shell-manager/api/*`，`LICENSE` 保留上游版权并追加 fork 版权；`src/index.ts` 与 `src/client/index.ts` 已按职责拆为 `src/host/`（9 个模块）与 `src/client/`（8 个模块），`lib/` 已重新生成，长期文档已同步。下一步是复核本次改动并提交，再决定发版（npm 包名 `dsh-windows-shell-manager` 已实测可注册）。**该优先项请与仓库所有者确认。**
（依据：本次会话的改名与拆分产物、验证结果（见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §13）；改名决策见 [DECISIONS.md](DECISIONS.md) D14；`git log -1` 为 `d1ea7d1`。）

## 进展（事实，含证据）

| 事实 | 证据 | 状态 |
| --- | --- | --- |
| 版本 `0.1.1`，包名 `dsh-windows-shell-manager` | [package.json](package.json) | 已确认 |
| 源码已拆分：host `src/index.ts` 38 行 facade + `src/host/*.ts` 9 个模块（最大 302 行）；client `src/client/*.ts` 8 个模块（最大 400 行） | 本次会话直接编辑 `src/**` 并重建 `lib/**`；结构与行数见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §2.1 | 已确认 |
| 最新提交 `d1ea7d1`，分支 `main` 跟踪 `origin/main`，无 tag | `git log`/`git tag` | 已确认 |
| 工作副本含本次改名与拆分改动（新增 `src/host/`、`src/client/*.ts`、`lib/host/`、`lib/types/host/`；修改 `src/**` 标识、`lib/*`、`package.json`、`cordis.patch.yml`、`tsdown.config.ts`、`LICENSE`、两个测试与全部文档） | `git status --porcelain`（本次会话） | 已确认 |
| 新包名 `dsh-windows-shell-manager` 在 npm 上**未被占用**（HTTP 404） | `registry.npmjs.org/dsh-windows-shell-manager`（本次核对） | 已确认 |
| 原包名 `dsh-windows-shell-policy` 由上游作者持有（npm latest `0.0.7`，maintainer `lantianws`），故无法沿用 | npm registry（本次核对） | 已确认 |
| 测试已实际运行（本次改动的最终验证）：`tests/host-harness.mjs` 71/71、`tests/executable-and-args.mjs` 33/33；`tsc` 基线 exit 0 | 本次会话（harness 在完全权限下运行） | 已通过 |
| 已移除「从上游 `dsh-windows-shell-policy` 迁移配置」功能：`migrateLegacyEntries`、Config 的 `preferred`/`bashPath`、`readConfig` 的 legacy 归一化、`/status` 的 `migrated` 与 `preferred`/`configuredBashPath`、`POST /preferred` 与 `/bashpath` 端点、面板迁移提示均已删除；`currentEntries()` 现在返回配置里的 `shells` 数组，空数组即不生效 | 本次会话直接编辑 `src/**`、`tests/**` 与文档 | 已确认 |
| 全新安装不再生成条目：harness 新增「不注册任何工具 / entries 为空 / 不裁剪内置工具面 / 引导文本为空 / 旧端点 404」断言并通过 | `node tests/host-harness.mjs`（完全权限）**71/71 通过** | 已通过 |
| 本仓库无入库的 `node_modules`；本次会话复用已有 junction，直接跑 `tsc` + `tsdown`（**未跑 `build.sh`**，避免其 `rmSync`+symlink 在受限沙箱下 `EPERM`） | `git status` 不含 `node_modules`（被 `.gitignore` 忽略） | 已确认（junction 未入库） |
| DSH checkout `E:\DSHSource\current` 已 bootstrap（有 `node_modules`），`dsh --version` = `0.2.0-rc.2` | 本次核对 | 已确认 |
| web profile 未安装本插件（`node_modules/dsh-windows-shell-manager` 不存在，bundles/deps 无该项），无 disabled/patch 残留 | 读 profile `package.json` + grep `cordis.patch.yml` | 已确认 |
| web profile 依赖里存在同类插件 `dsh-gitbash-shell@0.33.0` | profile `package.json` deps | 已确认（冲突影响未评估） |

## 阻塞

- 无硬阻塞。
- 受限文件沙箱下 `tests/host-harness.mjs` 无法完整运行（真实 spawn 走管道会 `EPERM`）；本次已在用户批准的一次性完全权限下跑通（71/71）。后续再跑仍需完全权限。

## 下一步（建议，未执行）

1. 复核本次改名与拆分并提交（`src/`、`lib/`、`package.json`、`cordis.patch.yml`、`LICENSE`、文档）；提交前按 [RUNBOOK.md](RUNBOOK.md)“发布”核对 `lib/` diff。**提交前还应在 GitHub 建仓 `EidnG3lZ/dsh-windows-shell-manager` 并推送**（`package.json` 的 `repository`/`homepage`/`bugs` 已指向该仓库名）。
2. 决定是否补一条 **client 类型基线**：`src/client` 被 `tsconfig.json` 的 `exclude` 排除，现有类型基线不覆盖它（本次用临时 config 检查，发现 9 条**拆分前就存在**的诊断，详见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §13.3）。
3. 若要装进本机 web profile 验证 UI：改 `src/**` 后**不要**在受限沙箱跑 `build.sh`（会 `EPERM` 且删掉已有 junction），改用手动 `tsc` + `tsdown`（[RUNBOOK.md](RUNBOOK.md)）。

## 待核实 / 待修正

- **`docs/ARCHITECTURE.md`**：结构更正（同日 §12）、模块拆分同步（同日 §13）与迁移功能移除记录（同日 §14）已完成——目录树、§4/§5 模块表、§11 符号索引按新模块改写，全文 `#L行号` 锚点改为模块文件链接。**仍待核实**：§3–§10 的功能性描述未随拆分逐句复核（链接已指向正确模块）。
- **`docs/ARCHITECTURE.md` §2.1 目录树的行号有既有漂移**：本次只修正了改动过的模块（config 206 / policy 166 / api 169 / apply 89 / card 369 / types 59），未逐一核对未改动模块（如 `tool.ts` 记 302、`styles.ts` 记 400）。行号不是契约，引用前按符号名在源码中复核。
- 新包名 `dsh-windows-shell-manager` 尚未在 npm 发布（本次核对为 404，可注册）：**待发布**。
- 新 GitHub 仓库 `EidnG3lZ/dsh-windows-shell-manager` **尚未创建**（本次核对为 404）；README 徽章与安装命令已按该名字写好，创建后才会生效。
- DSH 桌面端 profile 是否装配本插件：**待核实**（本次只核查了 web profile）。
- `docs/ARCHITECTURE.md` §9.3 记录的 ACL 修复与回滚脚本位置属于设备私有路径，未写入本套文档，仅在该文件内保留。

## 证据入口

- 生效规则：[AGENTS.md](AGENTS.md)｜路由：[PROJECT_INDEX.md](PROJECT_INDEX.md)｜操作：[RUNBOOK.md](RUNBOOK.md)
- 变更史：[CHANGELOG.md](CHANGELOG.md)｜结构：[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)｜规范与踩坑：[docs/conventions.md](docs/conventions.md)
