# Mermaid class diagrams

Declared types and signatures; unknown types are `unknown`. Receivers are omitted.
Fields are associations, not lifetime ownership. Calls are static heuristic estimates.
Members and connections within each view are uncapped.
Parallel arrows are summarized.
Cross-diagram relationships are retained in the complete relationship list.

Included: 279 boxes. Calls without in-scope endpoints: 0.

## Test filtering

Mode: exclude.
Saved detector version: 2.
Test paths: `scripts/forgetful-test-server.py`, `test`.
Keep paths: none.
Calls removed by test filtering: 805. Type relationships removed: 194.

- `scripts/forgetful-test-server.py`: 4 source occurrences (test-path).
- `test/async-recall-pi-integration.test.ts`: 16 source occurrences (test-path).
- `test/background-startup-pi.test.ts`: 3 source occurrences (test-path).
- `test/background-ui-pi.test.ts`: 13 source occurrences (test-path).
- `test/capture-backlog-history-pi.test.ts`: 13 source occurrences (test-path).
- `test/capture-batches.test.ts`: 8 source occurrences (test-path).
- `test/capture-cancellation.test.ts`: 8 source occurrences (test-path).
- `test/capture-cleanup-pi.test.ts`: 6 source occurrences (test-path).
- `test/capture-context-pi.test.ts`: 2 source occurrences (test-path).
- `test/capture-context.test.ts`: 2 source occurrences (test-path).
- `test/capture-drain-pi.test.ts`: 7 source occurrences (test-path).
- `test/capture-error-diagnostic.test.ts`: 2 source occurrences (test-path).
- `test/capture-execution.test.ts`: 4 source occurrences (test-path).
- `test/capture-gate-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture-history-model.test.ts`: 4 source occurrences (test-path).
- `test/capture-history-restart-pi.test.ts`: 7 source occurrences (test-path).
- `test/capture-history.test.ts`: 4 source occurrences (test-path).
- `test/capture-immediate-feedback.test.ts`: 6 source occurrences (test-path).
- `test/capture-integration-validation.test.ts`: 3 source occurrences (test-path).
- `test/capture-link-error-feedback.test.ts`: 7 source occurrences (test-path).
- `test/capture-link-presence.test.ts`: 2 source occurrences (test-path).
- `test/capture-links.test.ts`: 4 source occurrences (test-path).
- `test/capture-maintenance-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture-maintenance.test.ts`: 5 source occurrences (test-path).
- `test/capture-overlap-context.test.ts`: 3 source occurrences (test-path).
- `test/capture-pause.test.ts`: 2 source occurrences (test-path).
- `test/capture-project-warning-pi.test.ts`: 2 source occurrences (test-path).
- `test/capture-resolution-context.test.ts`: 2 source occurrences (test-path).
- `test/capture-resolution-execution.test.ts`: 3 source occurrences (test-path).
- `test/capture-review-recovery.test.ts`: 12 source occurrences (test-path).
- `test/capture-shutdown-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture-source-conflict-pi.test.ts`: 5 source occurrences (test-path).
- `test/capture-source-feedback.test.ts`: 2 source occurrences (test-path).
- `test/capture-structured-arguments.test.ts`: 18 source occurrences (test-path).
- `test/capture-trust-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture-validation-changes.test.ts`: 26 source occurrences (test-path).
- `test/capture.test.ts`: 43 source occurrences (test-path).
- `test/config.test.ts`: 2 source occurrences (test-path).
- `test/conflict-handoff-pi.test.ts`: 5 source occurrences (test-path).
- `test/extension-surface-pi.test.ts`: 2 source occurrences (test-path).
- `test/extension.test.ts`: 58 source occurrences (test-path).
- `test/fixtures/background-ui-provider.ts`: 2 source occurrences (test-path).
- `test/fixtures/live-context-provider.ts`: 9 source occurrences (test-path).
- `test/fixtures/memory-quality.ts`: 13 source occurrences (test-path).
- `test/fixtures/planning-adapter-off.ts`: 2 source occurrences (test-path).
- `test/fixtures/planning-adapter-short.ts`: 2 source occurrences (test-path).
- `test/fixtures/planning-adapter.ts`: 5 source occurrences (test-path).
- `test/fixtures/planning-mount-probe.ts`: 2 source occurrences (test-path).
- `test/fixtures/planning-ui-driver.ts`: 2 source occurrences (test-path).
- `test/fixtures/planning-view.ts`: 3 source occurrences (test-path).
- `test/foreground-drain-pi.test.ts`: 2 source occurrences (test-path).
- `test/forgetful-integration.test.ts`: 3 source occurrences (test-path).
- `test/full-conversation-pi.test.ts`: 2 source occurrences (test-path).
- `test/http-validation.test.ts`: 2 source occurrences (test-path).
- `test/knowledge-capture.test.ts`: 21 source occurrences (test-path).
- `test/knowledge-execution.test.ts`: 4 source occurrences (test-path).
- `test/knowledge-exploration-errors.test.ts`: 6 source occurrences (test-path).
- `test/knowledge-tool-execution.test.ts`: 4 source occurrences (test-path).
- `test/knowledge-tools.test.ts`: 12 source occurrences (test-path).
- `test/live-capture-maintenance.test.ts`: 2 source occurrences (test-path).
- `test/live-capture-submission.test.ts`: 18 source occurrences (test-path).
- `test/live-connected-memory-quality.test.ts`: 2 source occurrences (test-path).
- `test/live-context-quality.test.ts`: 16 source occurrences (test-path).
- `test/live-memory-quality.test.ts`: 9 source occurrences (test-path).
- `test/live-recall-submission.test.ts`: 17 source occurrences (test-path).
- `test/log-helpers.ts`: 3 source occurrences (test-path).
- `test/logging.test.ts`: 3 source occurrences (test-path).
- `test/model-budget.test.ts`: 5 source occurrences (test-path).
- `test/model-context.test.ts`: 21 source occurrences (test-path).
- `test/model-read-tools.test.ts`: 8 source occurrences (test-path).
- `test/model.test.ts`: 8 source occurrences (test-path).
- `test/pi-integration.test.ts`: 9 source occurrences (test-path).
- `test/pi-tool-session.ts`: 6 source occurrences (test-path).
- `test/planning-api.test.ts`: 3 source occurrences (test-path).
- `test/planning-integration.test.ts`: 3 source occurrences (test-path).
- `test/planning-pi.test.ts`: 3 source occurrences (test-path).
- `test/planning-settings.test.ts`: 2 source occurrences (test-path).
- `test/planning-terminal.test.ts`: 4 source occurrences (test-path).
- `test/planning-view.test.ts`: 3 source occurrences (test-path).
- `test/planning.test.ts`: 11 source occurrences (test-path).
- `test/provider-context.ts`: 4 source occurrences (test-path).
- `test/queue-history-refresh.test.ts`: 4 source occurrences (test-path).
- `test/queue-summary-paths.test.ts`: 9 source occurrences (test-path).
- `test/queue.test.ts`: 5 source occurrences (test-path).
- `test/real-forgetful.ts`: 2 source occurrences (test-path).
- `test/recall-concurrency-pi.test.ts`: 4 source occurrences (test-path).
- `test/recall-concurrency.test.ts`: 6 source occurrences (test-path).
- `test/recall-enrichment-errors.test.ts`: 4 source occurrences (test-path).
- `test/recall-persistence-native-pi.test.ts`: 21 source occurrences (test-path).
- `test/recall-persistence-pi.test.ts`: 21 source occurrences (test-path).
- `test/recall-plan.test.ts`: 3 source occurrences (test-path).
- `test/recall.test.ts`: 35 source occurrences (test-path).
- `test/repository-validation.test.ts`: 2 source occurrences (test-path).
- `test/server-owned-validation.test.ts`: 2 source occurrences (test-path).
- `test/setup-pi.test.ts`: 2 source occurrences (test-path).
- `test/snapshot.test.ts`: 3 source occurrences (test-path).
- `test/source-inspection.test.ts`: 3 source occurrences (test-path).
- `test/validation-links.test.ts`: 18 source occurrences (test-path).
- `test/validation-recall.test.ts`: 11 source occurrences (test-path).
- `test/validation-resource-identity.test.ts`: 2 source occurrences (test-path).
- `test/validation-writer.test.ts`: 4 source occurrences (test-path).

## Diagram 1

```mermaid
classDiagram
    direction TB
    class c0000["index.ts"] {
        <<module>>
        defaultExtension(pi: ExtensionAPI) unknown
    }
    class c0003["ActivityLoader"] {
        <<class>>
        -started: unknown
        -elapsedTimer: ReturnType~typeof setInterval~
        constructor(tui: TUI, spinnerColor: Type1, messageColor: Type1, label: string) unknown
        -label: string
        setLabel(label: string) void
        -refresh() void
        dispose() void
    }
    class c0004["ForgetfulActivity"] {
        <<class>>
        -stages: unknown
        -loader: ActivityLoader
        -closed: unknown
        -idleNotice: string
        constructor(ctx: ExtensionContext) unknown
        -ctx: ExtensionContext
        set(key: string, label: string) void
        notice(message: string) void
        -refresh() void
        close() void
    }
    class c0005["ApiPlanningReader"] {
        <<class>>
        -transport: ForgetfulHttpTransport
        constructor(options: Type2) unknown
        -options: Type2
        sanitize(text: string) string
        -clean(value: T) T
        -read(action: Type3, missing: Type4) Promise~PlanningResult~T~~
        capabilities(signal: AbortSignal) Type5
        projects(signal: AbortSignal) Type6
        plans(projectId: number, signal: AbortSignal) Type7
        tasks(planId: number, signal: AbortSignal) Type8
        plan(Signature1)
        task(Signature2)
    }
    class c0006["src/adapters/forgetful/planning.ts"] {
        <<module>>
        object(value: unknown, field: string) Type9
        invalid(field: string, expected: string) never
        integer(value: unknown, field: string, min: unknown) number
        string(value: unknown, field: string) string
        nullableString(value: unknown, field: string) Type10
        boolean(value: unknown, field: string) boolean
        choice(value: unknown, field: string, values: readonly T[]) T
        parent(value: unknown, field: string, expected: number) number
        list(payload: unknown, key: string, parse: Type11) T[]
        taskRecord(data: Type9, planId: number) PlanningTaskRecord
    }
    class c0007["LocalPlanningPreferences"] {
        <<class>>
        constructor(path: string) unknown
        -path: string
        read() Promise~boolean~
        write(enabled: boolean) Promise~void~
    }
    class c0008["BrowserView"] {
        <<interface>>
        body: string[]
        footer: string
    }
    class c0009["PiPlanningView"] {
        <<class>>
        -ctx: ExtensionContext
        -tui: TUI
        -panel: OverlayHandle
        -panelComponent: Component
        -unsubscribe: Type12
        -promptActive: unknown
        -browserOpen: unknown
        -browser: Promise~void~
        -finishBrowser: Type12
        -disposed: unknown
        -visibility: boolean
        -host: Component
        -measuring: unknown
        constructor(controller: PlanningWorkflow) unknown
        -controller: PlanningWorkflow
        mount(ctx: ExtensionContext) void
        -mountHost() void
        -releaseHost() void
        -run(work: Promise~void~) void
        -hasPanelSpace() boolean
        -syncVisibility() void
        -syncPanel() void
        -sync() void
        setPromptActive(active: boolean) void
        command(action: string) Promise~void~
        toggle() Promise~void~
        open() Promise~void~
        -close() void
        status() string
        -display(state: PlanningState) string
        dispose() void
    }
    class c0010["PlanBrowser"] {
        <<class>>
        -picker: unknown
        -projectId: number
        -planText: unknown
        -scroll: unknown
        -maxScroll: unknown
        -pageSize: unknown
        -identity: unknown
        constructor(Signature3)
        -theme: Theme
        -tui: TUI
        -close: Type12
        -controller: PlanningWorkflow
        -run: Type13
        invalidate() void
        handleInput(data: string) void
        -pickerInput(data: string, state: PlanningState) void
        -scrollInput(data: string) void
        -listInput(data: string, state: PlanningState) void
        -taskText(state: PlanningState, width: number) string[]
        -planLines(state: PlanningState, width: number) string[]
        render(width: number) string[]
        -header(state: PlanningState) string[]
        -pickerView(state: PlanningState, top: string[], room: number) BrowserView
        -textView(state: PlanningState, top: string[], room: number, inner: number) BrowserView
        -listView(state: PlanningState, top: string[], room: number) BrowserView
    }
    class c0011["src/adapters/pi/planning.ts"] {
        <<module>>
        text(value: Type14) string
        box(lines: string[], width: number, theme: Theme) string[]
        timestamp(value: number) string
        availability(state: PlanningState) string
        taskLabel(task: PlanningTaskSummary) string
        plural(count: number, noun: string) string
        verticalStep(data: string) number
        emptyTaskList(state: PlanningState, hasPlan: boolean, group: PlanningPlanTasks) string
        counts(state: PlanningState, id: number) string
        panelPlan(Signature4)
        renderPlanningPanel(state: PlanningState, width: number, theme: Theme) string[]
    }
    class c0012["Overview"] {
        <<interface>>
        plans: PlanningPlanSummary[]
        planTasks: Type15
        selectedPlanId: Type16
        selectedTaskId: Type16
        inspectingTask: boolean
        planDetail: Type17
        taskDetail: Type18
        detailError: Type19
    }
    class c0013["PlanningController"] {
        <<class>>
        -current: PlanningState
        -listeners: unknown
        -pending: AbortController
        -active: Type20
        -generation: unknown
        -disposed: unknown
        -capabilityChecked: unknown
        -retryBlocked: unknown
        -failures: unknown
        -browserProjectId: number
        -cancelTimer: Type12
        -preferenceWrite: Promise~void~
        constructor(options: PlanningControllerOptions) unknown
        -options: PlanningControllerOptions
        state() PlanningState
        subscribe(listener: Type21) Type12
        -publish(update: Partial~PlanningState~) void
        -visible() boolean
        -invalidate() void
        openDetails() Promise~void~
        closeDetails() Promise~void~
        setPanel(enabled: boolean) Promise~void~
        togglePanel() Promise~void~
        -changePanel(value: Type22) Promise~void~
        setPanelVisible(visible: boolean) Promise~void~
        setConnection(input: Type23) Promise~void~
        selectProject(id: number) Promise~void~
        selectPlan(id: number) Promise~void~
        selectTask(id: number) Promise~void~
        inspectTask() Promise~void~
        closeTask() Promise~void~
        -accept(result: PlanningResult~T~, signal: AbortSignal) T
        -partial(result: PlanningResult~T~, signal: AbortSignal) PlanningResult~T~
        refresh() Promise~void~
        -startRefresh(recheck: boolean) Promise~void~
        -readOverview(recheck: boolean, generation: number) Promise~void~
        -readCapability(recheck: boolean, signal: AbortSignal) Promise~boolean~
        -readProject(signal: AbortSignal) Type24
        -readPlans(projectId: number, signal: AbortSignal) Promise~void~
        -readPlanTasks(plans: PlanningPlanSummary[], signal: AbortSignal) Type25
        -readDetails(Signature5)
        -publishFailure(error: unknown) void
        -settle() void
        dispose() void
    }
    class c0014["PlanningControllerOptions"] {
        <<interface>>
        reader: PlanningReader
        preferences: PlanningPreferences
        clock: PlanningClock
        repoName: string
        enabled: boolean
        ready: boolean
        initialPreference: boolean
    }
    class c0015["PlanningReadFailure"] {
        <<class>>
        constructor(failure: PlanningError) unknown
        failure: PlanningError
    }
    class c0016["src/application/planning.ts"] {
        <<module>>
        throwIfCancelled(signal: AbortSignal) void
        connectionAvailability(enabled: boolean, ready: boolean) Type26
        failureAvailability(kind: Type27) Type26
        noPlanData() Partial~PlanningState~
        removePlan(overview: Overview, planId: number) void
    }
    class c0017["PlanningClock"] {
        <<interface>>
        +now() number
        +schedule(callback: Type12, delayMs: number) Type12
    }
    class c0018["PlanningError"] {
        <<interface>>
        kind: Type28
        message: string
        status: number
        responseBody: string
    }
    class c0019["PlanningPlanTasks"] {
        <<interface>>
        tasks: PlanningTaskSummary[]
        activeTasks: PlanningTaskSummary[]
        counts: PlanningCounts
        error: PlanningError
        lastRefresh: number
    }
    class c0020["PlanningPreferences"] {
        <<interface>>
        +read() Promise~boolean~
        +write(enabled: boolean) Promise~void~
    }
    class c0021["PlanningReader"] {
        <<interface>>
        +capabilities(signal: AbortSignal) Type5
        +projects(signal: AbortSignal) Type6
        +plans(projectId: number, signal: AbortSignal) Type7
        +plan(Signature6)
        +task(Signature7)
        +tasks(planId: number, signal: AbortSignal) Type8
    }
    class c0022["PlanningResult"] {
        <<type_alias>>
        alias: Type29
        error: PlanningError
        ok: true
        ok: false
        value: T
    }
    class c0023["PlanningState"] {
        <<interface>>
        panelEnabled: boolean
        panelVisible: boolean
        detailsOpen: boolean
        inspectingTask: boolean
        enabled: boolean
        ready: boolean
        capability: PlanningCapability
        availability: Type30
        loading: boolean
        error: PlanningError
        projects: PlanningProject[]
        selectedProjectId: number
        mappedProjectId: number
        selectedPlanId: number
        selectedTaskId: number
        plans: PlanningPlanSummary[]
        planTasks: Type31
        planDetail: PlanningPlan
        taskDetail: PlanningTask
        detailError: PlanningError
        lastRefresh: number
        stale: boolean
    }
    class c0024["PlanningWorkflow"] {
        <<interface>>
        state: PlanningState
        +subscribe(listener: Type21) Type12
        +openDetails() Promise~void~
        +closeDetails() Promise~void~
        +setPanel(enabled: boolean) Promise~void~
        +togglePanel() Promise~void~
        +setPanelVisible(visible: boolean) Promise~void~
        +selectProject(id: number) Promise~void~
        +selectPlan(id: number) Promise~void~
        +selectTask(id: number) Promise~void~
        +inspectTask() Promise~void~
        +closeTask() Promise~void~
        +refresh() Promise~void~
        +setConnection(input: Type23) Promise~void~
        +dispose() void
    }
    class c0025["PlanningRuntime"] {
        <<type_alias>>
        alias: ReturnType~typeof createPlanningRuntime~
    }
    class c0026["src/bootstrap/planning.ts"] {
        <<module>>
        createPlanningRuntime(Signature8)
    }
    class c0027["CaptureCorrectionCycle"] {
        <<interface>>
        cycle: number
        attempts: number
        phase: Type33
        failureKind: Type34
        failure: unknown
    }
    class c0028["CaptureSelectionError"] {
        <<class>>
    }
    class c0029["src/capture-feedback.ts"] {
        <<module>>
        correctableCaptureError(error: unknown) boolean
        initialCorrectionCycle() CaptureCorrectionCycle
        captureFailureReport(failure: unknown) Type35
    }
    class c0030["CaptureLinkReview"] {
        <<interface>>
        status: Type36
        memory: Memory
        memories: Memory[]
        automaticIds: number[]
        unreviewed: Type37
        decisions: LinkDecision[]
        verifiedIds: number[]
        reason: string
        previous: PreviousConnections
        resources: Type38
        preservation: PreservationDecision
        preservationVerified: boolean
        executionResults: ConnectionResult[]
        previousResults: ConnectionResult[]
        failures: Type39
    }
    class c0031["ConnectionResult"] {
        <<interface>>
        operation: Type40
        targetId: number
        status: Type41
        error: string
        httpStatus: number
    }
    class c0032["LinkDecision"] {
        <<interface>>
        memoryId: number
        action: Type42
        reason: string
    }
    class c0033["PreservationDecision"] {
        <<interface>>
        status: Type43
        documentIds: number[]
        codeArtifactIds: number[]
        entityIds: number[]
        reason: string
    }
    class c0034["PreviousConnections"] {
        <<interface>>
        memory: Memory
        documents: Document[]
        codeArtifacts: CodeArtifact[]
        entities: Entity[]
        entityIds: number[]
        complete: boolean
    }
    class c0035["src/capture-links.ts"] {
        <<module>>
        wantsEdge(decision: LinkDecision) boolean
        exclusiveMemory(memory: Memory, destination: number) boolean
        readSelectedMemory(client: ForgetfulClient, id: number, unreviewed: Type45) Type44
        prepareLinkReview(Signature9)
        validateLinkDecisions(Signature10)
        validateLinkReviews(value: unknown, inputs: Type49) Type48
        operationError(error: unknown) string
        authorizedMemory(Signature11)
        executeConnection(Signature12)
        applyLinkReview(Signature13)
        finishLinkExecution(initial: CaptureLinkReview, save: Type52) Promise~CaptureLinkReview~
        readAttachmentRecords(Signature14)
        preparePreviousConnections(Signature15)
        preserveConnections(Signature16)
    }
    class c0036["MergeAccess"] {
        <<interface>>
        destination: number
        scope: Scope
        beforeRead: Type53
    }
    class c0037["MergeConnections"] {
        <<interface>>
        memoryIds: number[]
        entityIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
        receipts: Type55
    }
    class c0038["MergeExecution"] {
        <<interface>>
        save: Type53
        assertCanWrite: Type12
    }
    class c0039["MergeWriteUncertain"] {
        <<class>>
    }
    class c0040["src/capture-merge.ts"] {
        <<module>>
        union(...lists: Type56) number[]
        collectMergeConnections(Signature17)
        requireResourceScope(Signature18)
        checkMergeEntity(client: ForgetfulClient, id: number, access: MergeAccess) Promise~void~
        checkMergeAttachments(Signature19)
        preflightMergeConnections(Signature20)
        preserveMergeConnections(Signature21)
    }
    class c0041["CandidateExtraction"] {
        <<interface>>
        candidates: CaptureCandidate[]
        skipped: Type59
    }
    class c0042["CandidateValidation"] {
        <<type_alias>>
        alias: Type60
        valid: true
        value: T
        reason: string
        valid: false
    }
    class c0043["CaptureAction"] {
        <<type_alias>>
        alias: Type61
    }
    class c0044["CaptureActivityPhase"] {
        <<type_alias>>
        alias: Type62
    }
    class c0045["CaptureAdvanceInput"] {
        <<interface>>
        sessionId: string
        branchId: string
        entryIds: string[]
        finalEntryId: string
        snapshotId: string
    }
    class c0046["CaptureBatchInput"] {
        <<interface>>
        candidate: CaptureCandidate
        destinationProjectId: number
        overlaps: Memory[]
        neighborhood: CaptureNeighborhood
    }
    class c0047["CaptureBranch"] {
        <<interface>>
        sessionId: string
        branchId: string
    }
    class c0048["CaptureCandidate"] {
        <<interface>>
        kind: Type63
        searchDescription: string
        id: string
        title: string
        content: string
        context: string
        keywords: string[]
        tags: string[]
        importance: number
        sourceEntryIds: string[]
        evidenceType: Type64
        destinationProjectId: number
        destinationProjectName: string
        destinationRationale: string
        sourceFiles: string[]
        sourceRepo: string
        sourceUrl: string
        encodingVersion: string
        entities: CaptureEntityResource[]
        documents: CaptureDocumentResource[]
        codeArtifacts: CaptureCodeArtifactResource[]
        relationships: CaptureRelationshipResource[]
    }
    class c0049["CaptureCheckpointOptions"] {
        <<interface>>
        sessionId: string
        branchId: string
        excludeBranches: CaptureBranch[]
    }
    class c0050["CaptureCheckpointResult"] {
        <<interface>>
        processed: number
        processedJobIds: string[]
        discardedJobs: Type65
        paused: boolean
        errors: string[]
        deferredBranches: CaptureBranch[]
        continuation: Type66
    }
    class c0051["CaptureCodeArtifactResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0052["CaptureDecision"] {
        <<interface>>
        action: CaptureAction
        reason: string
        conflictingMemoryId: number
        conflictingMemoryIds: number[]
        memoryId: number
        oldClaim: string
        newClaim: string
        sourceEntryIds: string[]
        partial: boolean
        equivalentCandidateId: string
        relationshipKeys: string[]
        reuse: CaptureResourceReuse
        enrich: boolean
        entityMemoryKeys: string[]
    }
    class c0053["CaptureDiagnosticCandidate"] {
        <<interface>>
        id: string
        sourceEntryIds: string[]
        title: string
        content: string
        stage: string
        action: CaptureAction
        destinationProjectId: number
        reason: string
        memoryId: number
        replacementId: number
        retiredCount: number
        conflictId: string
        linkReview: Type67
    }
    class c0054["CaptureDiagnosticConflict"] {
        <<interface>>
        id: string
        status: Type68
        candidateId: string
        destinationProjectId: number
        sourceEntryIds: string[]
        oldMemoryIds: number[]
        reason: string
        replacementId: number
    }
    class c0055["CaptureDiagnosticJob"] {
        <<interface>>
        id: string
        status: QueueJobStatus
        attempts: number
        callCount: number
        sessionId: string
        branchId: string
        candidates: CaptureDiagnosticCandidate[]
        submissionRejections: string[]
        lastError: string
    }
    class c0056["CaptureDiagnostics"] {
        <<interface>>
        jobs: CaptureDiagnosticJob[]
        conflicts: CaptureDiagnosticConflict[]
    }
    class c0057["CaptureDocumentResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0058["CaptureEnqueueResult"] {
        <<interface>>
        queued: boolean
        jobId: string
        reason: string
    }
    class c0059["CaptureEntityResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0060["CaptureMergePlan"] {
        <<interface>>
        candidate: CaptureCandidate
        memories: Memory[]
        connections: MergeConnections
    }
    class c0061["CaptureNeighborhood"] {
        <<interface>>
        entities: Entity[]
        documents: Document[]
        codeArtifacts: CodeArtifact[]
        relationships: EntityRelationship[]
        truncated: boolean
    }
    class c0062["CaptureOperation"] {
        <<interface>>
        jobId: string
        conflictId: string
        uncertainWrite: CaptureUncertainWrite
        supersession: SupersessionReceipt
        modelFailure: Type69
    }
    class c0063["CapturePause"] {
        <<class>>
        constructor(reason: string) unknown
    }
    class c0064["CapturePendingConflict"] {
        <<interface>>
        verifiedOrigin: Type70
    }
    class c0065["CaptureProgress"] {
        <<class>>
    }
    class c0066["CaptureRelationshipResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0067["CaptureResolveResult"] {
        <<interface>>
        status: Type71
        conflict: PendingConflict
    }
    class c0068["CaptureResourceReuse"] {
        <<interface>>
        entities: Type72
        documents: Type72
        codeArtifacts: Type72
        relationships: Type72
    }
    class c0069["CaptureService"] {
        <<class>>
        -queue: DurableQueueStore
        -client: ForgetfulClient
        -readSavedMemory: Type73
        -model: MemoryModelClient
        -identity: QueueIdentity
        -sessionId: string
        -branchId: string
        -policy: string
        -isEnabled: Type74
        -getMode: Type75
        -canWriteNow: Type22
        -canReadNow: Type22
        -maxModelCalls: number
        -maxJobsPerCheckpoint: number
        -now: Type76
        -knowledgeWriter: KnowledgeWriter
        -logger: DiagnosticLogger
        -stopped: unknown
        -cancellation: unknown
        -interruptedModelJobs: unknown
        -operations: unknown
        -onActivity: Type77
        -activities: unknown
        -activityPhase: CaptureActivityPhase
        constructor(options: CaptureServiceOptions) unknown
        -readSignal(signal: AbortSignal) AbortSignal
        -activity(phase: CaptureActivityPhase, operation: Type3) Promise~T~
        -publishActivity() void
        -read(operation: Type78, signal: AbortSignal, phase: Type79) Promise~T~
        -mutate(operation: Type78, signal: AbortSignal) Promise~T~
        -cancellableClient(client: ForgetfulClient) ForgetfulClient
        -cancellableKnowledge(client: KnowledgeClient) KnowledgeClient
        -correlation(job: QueueJob, candidateId: string) unknown
        -emit(level: Type80, event: string, data: Type9) void
        -enabled(mode: CaptureMode) Promise~boolean~
        -ensureModelCallAllowed(job: QueueJob) Promise~void~
        -assertWriteAllowedNow() void
        -ensureWriteAllowed(jobMode: CaptureMode) Promise~void~
        -policyFor(snapshot: CaptureSnapshot, purpose: Type81) string
        enqueue(snapshot: CaptureSnapshot) Promise~CaptureEnqueueResult~
        -enqueueSnapshot(snapshot: CaptureSnapshot) Promise~CaptureEnqueueResult~
        -resolveDestination(candidate: CaptureCandidate, context: WorkContext) Type24
        -addConflict(Signature22)
        -checkpointOutcome(Signature23)
        -destinationProjects(Signature24)
        -validateDecision(Signature25)
        -createMemory(Signature26)
        -writeKnowledge(Signature27)
        -supersessionAlreadyApplied(Signature28)
        -applySupersession(Signature29)
        -recordSupersession(receipt: SupersessionReceipt) Promise~void~
        -finishSupersession(Signature30)
        -processReplacementCheckpoint(Signature31)
        -processKnowledgeCheckpoint(Signature32)
        -prepareDestination(job: QueueJob, candidate: CaptureCandidate) Type84
        -loadOverlaps(Signature33)
        -neighborhoodEntity(job: QueueJob, id: number, destination: number) Type87
        -neighborhoodMatches(job: QueueJob, input: unknown) Promise~Entity[]~
        -neighborhoodEntities(Signature34)
        -neighborhoodRelationships(job: QueueJob, entities: Entity[]) Type89
        -existingNeighborhood(Signature35)
        -prepareOverlapBatch(job: QueueJob, candidates: CaptureCandidate[]) Type90
        -decideOverlapBatch(job: QueueJob, candidates: CaptureCandidate[]) Promise~QueueJob~
        -decideOverlap(Signature36)
        -recordEscalation(Signature37)
        -supersedeCandidate(Signature38)
        -readMaintenanceTargets(Signature39)
        -confirmedRetirement(id: number) boolean
        -preflightRetirement(Signature40)
        -composeMerge(Signature41)
        -verifyRequestedMerge(Signature42)
        -finishMerge(Signature43)
        -mergeCandidate(Signature44)
        -retireCandidate(Signature45)
        -equivalentMemory(Signature46)
        -skipCandidate(Signature47)
        -applyDecision(Signature48)
        -processCandidate(Signature49)
        -evidenceReadTool(job: QueueJob) ModelReadTool
        -sourceInspectionTool(job: QueueJob) ModelReadTool
        -loadCandidates(job: QueueJob) Type93
        -reviewExecutionFailure(job: QueueJob, candidate: CaptureCandidate) Promise~QueueJob~
        -correctedCaptureOutcome(outcome: Type9, corrected: Type94, rejectedMerge: Type95) Type9
        -isModelFailure(error: unknown) boolean
        -saveCorrectableFailure(Signature50)
        -recordCandidateFailure(Signature51)
        -candidateUncertainty(outcome: Type86, error: unknown) Type97
        -connectionUncertainty(outcome: Type86) Type97
        -pauseCandidate(Signature52)
        -correctCandidateFailures(Signature53)
        -processCandidates(Signature54)
        -processOrderedCandidates(Signature55)
        -refreshLinkReview(Signature56)
        -migrateLegacyLinkReview(Signature57)
        -prepareLinkReviews(job: QueueJob, candidates: CaptureCandidate[]) Type100
        -planLinkReviews(Signature58)
        -executeLinkReview(job: QueueJob, candidate: CaptureCandidate) Promise~QueueJob~
        -recordLinkReviewFailure(current: QueueJob, failure: Type101) Promise~void~
        -previousSupersessionCompleted(Signature59)
        -finishReviewedSupersession(Signature60)
        -executeLinkReviews(job: QueueJob, candidates: CaptureCandidate[]) Type102
        -reviewLinks(job: QueueJob, candidates: CaptureCandidate[]) Promise~QueueJob~
        -processJob(job: QueueJob, result: CaptureCheckpointResult) Type103
        -runBranchWorker(Signature61)
        -processBranchJob(job: QueueJob, result: CaptureCheckpointResult) Type104
        -recordBranchFailure(Signature62)
        -checkpointBranch(Signature63)
        -checkpointBranches(options: Type105) Promise~CaptureBranch[]~
        -appendCheckpointResult(Signature64)
        checkpoint(options: Type105) Promise~CaptureCheckpointResult~
        processPending(options: CaptureCheckpointOptions) Promise~CaptureCheckpointResult~
        diagnostics(options: Type106) Promise~CaptureDiagnostics~
        pendingConflicts(options: Type107) Promise~CapturePendingConflict[]~
        pendingConflicts(sessionId: string, branchId: string) Promise~CapturePendingConflict[]~
        pendingConflicts(Signature65)
        -verifyConflictOrigin(conflict: PendingConflict) Promise~CapturePendingConflict~
        -ownedConflict(conflictId: string) Promise~PendingConflict~
        -rejectConflict(Signature66)
        -selectResolutionEvidence(Signature67)
        -validateResolutionEvidence(Signature68)
        -resolutionTarget(conflict: PendingConflict) ConflictResolutionTarget
        -markConflictResolved(Signature69)
        -revisionResources(current: Memory, destination: number, previous: Memory) unknown
        -planConflictReplacement(Signature70)
        -updateResolutionReplacement(Signature71)
        -createResolutionReplacement(conflict: PendingConflict) Promise~number~
        -linkResolutionEntity(Signature72)
        -executeResolutionLinks(conflict: PendingConflict, replacementId: number) Promise~void~
        -applyConflictResolution(Signature73)
        -failConflictResolution(conflictId: string, error: unknown) Promise~never~
        -resolveConflictOwned(Signature74)
        resolveConflict(Signature75)
        resolve(conflictId: string, input: ResolveConflictInput) Promise~CaptureResolveResult~
        advance(input: Type110) Promise~void~
        advanceWatermark(input: Type110) Promise~void~
        watermark(context: Type111) unknown
        stop(_sessionId: string, _branchId: string) void
    }
    class c0070["CaptureServiceOptions"] {
        <<interface>>
        logger: DiagnosticLogger
        onActivity: Type112
        queue: DurableQueueStore
        client: ForgetfulClient
        model: MemoryModelClient
        instanceId: string
        endpoint: string
        accountId: string
        sessionId: string
        branchId: string
        policy: string
        isEnabled: Type74
        getMode: Type75
        canWriteNow: Type22
        canReadNow: Type22
        maxCandidates: number
        maxModelCalls: number
        maxJobsPerCheckpoint: number
        now: Type76
    }
    class c0071["CaptureUncertainWrite"] {
        <<class>>
    }
    class c0072["ConflictResolutionEvidence"] {
        <<interface>>
        evidenceEntryIds: string[]
        selectedAdditionalEntries: EvidenceEntry[]
        reason: string
        additionalEvidence: string
    }
    class c0073["ConflictResolutionTarget"] {
        <<interface>>
        oldMemory: Memory
        candidate: CaptureCandidate
        fakeJob: QueueJob
    }
    class c0074["InvalidCaptureOutput"] {
        <<class>>
        constructor(reason: string) unknown
    }
    class c0075["MissingCaptureDestination"] {
        <<class>>
        constructor(candidate: CaptureCandidate, projects: Type113) unknown
        projects: Type113
    }
    class c0076["ResolveConflictInput"] {
        <<interface>>
        action: Type114
        reason: string
        evidenceEntryIds: string[]
        additionalEvidence: string
        additionalEntries: EvidenceEntry[]
        conversation: readonly unknown[]
    }
    class c0077["src/capture.ts"] {
        <<module>>
        reusableMergeComposition(plan: Type95, decision: Type115) boolean
        conflictResolutionEvidence(evidence: ConflictResolutionEvidence) unknown
        blockedSave(diagnostic: string) Error
        clone(value: T) T
        record(value: unknown) Type86
        stringValue(value: unknown, max: number) Type116
        strings(value: unknown, max: unknown, itemMax: number) string[]
        projectId(value: unknown) Type16
        snapshotForPersistence(snapshot: CaptureSnapshot) CaptureSnapshot
        captureWorkMetadata(snapshot: CaptureSnapshot) unknown
        sourceEvidence(candidate: CaptureCandidate, snapshot: CaptureSnapshot) EvidenceEntry[]
        sharedSourceEvidence(Signature76)
        invalidCandidate(reason: string) CandidateValidation~T~
        validCandidate(value: T) CandidateValidation~T~
        captureResource(raw: unknown, kind: string, index: number) Type9
        captureEvidenceError(ids: string[], snapshot: CaptureSnapshot) Type116
        eligibleCandidate(Signature77)
        parseCandidates(Signature78)
        boundedSubmissionRejections(value: readonly string[]) string[]
        appendSubmissionRejection(rejections: string[], reason: string) void
        captureCandidateSubmission(Signature79)
        decisionMemoryId(response: Type9) Type16
        decisionTargetMemoryId(response: Type9) Type16
        decisionMemoryIds(response: Type9) Type119
        decisionEvidenceIds(response: Type9) Type120
        decisionText(response: Type9, field: Type121) Type116
        decisionPartial(response: Type9) boolean
        applyEnrichmentDecision(response: Type9, decision: CaptureDecision) void
        applyEquivalentCandidate(response: Type9, decision: CaptureDecision) void
        parseDecision(value: unknown) CaptureDecision
        decisionConflictIds(decision: CaptureDecision) number[]
        firstConflictId(decision: CaptureDecision) Type16
        currentProjectId(context: WorkContext) Type16
        captureProvenance(candidate: CaptureCandidate, context: WorkContext) unknown
        memoryInput(Signature80)
        resourceInput(input: T, defaults: Type9) T
        captureKnowledgePlan(Signature81)
        overlapCandidate(candidate: CaptureCandidate) Type9
        definitelyRejected(error: unknown) boolean
        errorMessage(error: unknown) string
        scrubError(error: unknown) string
        isFinalOutcome(outcome: unknown) boolean
        trustedAdditionalEntries(value: unknown) EvidenceEntry[]
    }
    class c0078["src/concurrency.ts"] {
        <<module>>
        mapConcurrent(items: readonly T[], concurrency: number, operation: Type123) Promise~R[]~
    }
    class c0079["ForgetfulConfig"] {
        <<interface>>
        planningPanel: boolean
        enabled: boolean
        captureMode: CaptureMode
        verbosity: Verbosity
        logging: FileLogLevel
        logDirectory: string
        scope: Scope
        scopeSource: ScopeSource
        instance: ForgetfulInstanceConfig
        recallDeadlineMs: number
        recallModelTimeoutMs: number
        recallConcurrency: number
        contextLimitTokens: number
        model: ModelSelection
        prompts: PromptOverlays
        warnings: string[]
        paths: Type124
    }
    class c0080["ForgetfulInstanceConfig"] {
        <<interface>>
        baseUrl: string
        token: string
        tokenEnv: string
        timeoutMs: number
    }
    class c0081["JsonReadResult"] {
        <<interface>>
        value: unknown
        exists: boolean
        malformed: boolean
    }
    class c0082["LoadConfigOptions"] {
        <<interface>>
        agentDir: string
        cwd: string
        trusted: boolean
        env: NodeJS.ProcessEnv
        userSettingsPath: string
        projectSettingsPath: string
        userPromptDir: string
        projectPromptDir: string
    }
    class c0083["ModelSelection"] {
        <<interface>>
        provider: string
        id: string
    }
    class c0084["PersistedProjectSettings"] {
        <<interface>>
        scope: unknown
    }
    class c0085["PersistedUserSettings"] {
        <<interface>>
        base_url: unknown
        token: unknown
        token_env: unknown
        timeout_ms: unknown
        enabled: unknown
        planning_panel: unknown
        capture: unknown
        capture_mode: unknown
        debug: unknown
        verbosity: unknown
        logging: unknown
        log_directory: unknown
        recall_model_timeout_ms: unknown
        recall_concurrency: unknown
        context_limit_tokens: unknown
        model: unknown
    }
    class c0086["PromptName"] {
        <<type_alias>>
        alias: Type125
    }
    class c0087["PromptOverlays"] {
        <<interface>>
        classification: string
        recall: string
        capture: string
    }
    class c0088["ScopeSource"] {
        <<type_alias>>
        alias: Type126
    }
    class c0089["Verbosity"] {
        <<type_alias>>
        alias: Type127
    }
    class c0090["src/config.ts"] {
        <<module>>
        isRecallConcurrency(value: unknown) value is number
        resolveRecallConcurrency(value: unknown, warnings: string[]) number
        resolveContextLimit(value: unknown, warnings: string[]) number
        isFileLogLevel(value: unknown) value is FileLogLevel
        resolveLogDirectory(value: unknown, agentDir: string, warnings: string[]) string
        isVerbosity(value: unknown) value is Verbosity
        resolveVerbosity(user: PersistedUserSettings, warnings: string[]) Verbosity
        isRecord(value: unknown) Type128
        parseModel(value: unknown) Type129
        asBoolean(value: unknown, fallback: boolean) boolean
        asPositiveInteger(value: unknown, fallback: number) number
        asString(value: unknown) Type116
        readJson(path: string) Promise~JsonReadResult~
        readPromptDirectory(Signature82)
        mergePrompts(Signature83)
        resolveCaptureMode(value: unknown, warnings: string[]) CaptureMode
        resolveScope(Signature84)
        defaultAgentDir() string
        userSettingsPath(agentDir: unknown) string
        projectSettingsPath(cwd: string) string
        loadForgetfulConfig(options: LoadConfigOptions) Promise~ForgetfulConfig~
        writeJson(path: string, value: unknown) Promise~void~
        writeProjectScope(cwd: string, scope: Scope) Promise~void~
        updateUserSettings(path: string, update: Type131) Promise~void~
        updateForgetfulConnection(path: string, connection: Type132) Promise~void~
        modelToString(model: Type129) Type116
        readPlanningPanel(path: string) Promise~boolean~
    }
    class c0091["CaptureHistorySummary"] {
        <<interface>>
        throughEntryId: string
        text: string
    }
    class c0092["CaptureMode"] {
        <<type_alias>>
        alias: Type133
    }
    class c0093["CaptureSnapshot"] {
        <<interface>>
        id: string
        context: WorkContext
        instanceId: string
        entries: EvidenceEntry[]
        conversation: readonly unknown[]
        conversationCoverage: Type134
        sourceConversation: readonly unknown[]
        historySummary: CaptureHistorySummary
        processedThroughEntryId: Type10
        leafEntryId: string
        finalEntryId: string
        mode: CaptureMode
        scope: Scope
        policy: string
        modelVersion: string
        createdAt: string
    }
    class c0094["CodeArtifact"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0095["CodeArtifactInput"] {
        <<interface>>
        title: string
        description: string
        code: string
        language: string
        tags: string[]
        project_id: Type135
    }
    class c0096["CodeArtifactSummary"] {
        <<type_alias>>
        alias: Type136
    }
    class c0097["CompactedConversation"] {
        <<interface>>
        summary: string
        summarizedThroughEntryId: string
        retainedConversation: readonly unknown[]
    }
    class c0098["Document"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0099["DocumentInput"] {
        <<interface>>
        title: string
        description: string
        content: string
        document_type: string
        tags: string[]
        project_id: Type135
    }
    class c0100["DocumentSummary"] {
        <<type_alias>>
        alias: Type137
    }
    class c0101["Entity"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0102["EntityInput"] {
        <<interface>>
        name: string
        entity_type: EntityType
        custom_type: string
        notes: string
        tags: string[]
        aka: string[]
        project_ids: number[]
    }
    class c0103["EntityRelationship"] {
        <<interface>>
        id: number
    }
    class c0104["EntityRelationshipInput"] {
        <<interface>>
        source_entity_id: number
        target_entity_id: number
        relationship_type: string
    }
    class c0105["EntityType"] {
        <<type_alias>>
        alias: Type138
    }
    class c0106["EvidenceEntry"] {
        <<interface>>
        id: string
        role: Type139
        text: string
        toolName: string
        toolCallId: string
        isError: boolean
        details: unknown
    }
    class c0107["FileSummary"] {
        <<interface>>
        id: number
        filename: string
        description: string
        mime_type: string
        size_bytes: number
        tags: string[]
        project_id: Type135
    }
    class c0108["ForgetfulClient"] {
        <<interface>>
        knowledge: KnowledgeClient
        +getMemoryEntityIds(id: number, signal: AbortSignal) Promise~number[]~
        +search(request: SearchRequest, signal: AbortSignal) Promise~Memory[]~
        +queryMemory(request: SearchRequest, signal: AbortSignal) Promise~MemorySearchResult~
        +listProjects(repoName: string, signal: AbortSignal) Promise~Project[]~
        +createProject(input: ProjectInput, signal: AbortSignal) Promise~Project~
        +linkProject(id: number, repoName: string, signal: AbortSignal) Promise~Project~
        +create(input: MemoryInput, signal: AbortSignal) Promise~MemoryCreateResult~
        +get(id: number, signal: AbortSignal) Promise~Memory~
        +obsolete(Signature85)
        +supersede(Signature86)
    }
    class c0109["KnowledgeClient"] {
        <<interface>>
        +searchEntities(query: string, limit: number, signal: AbortSignal) Promise~Entity[]~
        +getEntity(id: number, signal: AbortSignal) Promise~Entity~
        +createEntity(input: EntityInput, signal: AbortSignal) Promise~Entity~
        +updateEntity(Signature87)
        +getEntityMemories(id: number, signal: AbortSignal) Type140
        +linkEntityMemory(entityId: number, memoryId: number, signal: AbortSignal) Promise~void~
        +getRelationships(id: number, signal: AbortSignal) Promise~EntityRelationship[]~
        +createRelationship(Signature88)
        +listDocuments(projectId: number, signal: AbortSignal) Promise~DocumentSummary[]~
        +getDocument(id: number, signal: AbortSignal) Promise~Document~
        +createDocument(input: DocumentInput, signal: AbortSignal) Promise~Document~
        +updateDocument(Signature89)
        +listCodeArtifacts(Signature90)
        +getCodeArtifact(id: number, signal: AbortSignal) Promise~CodeArtifact~
        +createCodeArtifact(input: CodeArtifactInput, signal: AbortSignal) Promise~CodeArtifact~
        +updateCodeArtifact(Signature91)
        +listFiles(projectId: number, signal: AbortSignal) Promise~FileSummary[]~
        +getFile(id: number, signal: AbortSignal) Promise~StoredFile~
        +updateMemory(Signature92)
        +linkMemories(id: number, relatedIds: number[], signal: AbortSignal) Promise~void~
        +unlinkMemories(id: number, targetId: number, signal: AbortSignal) Promise~void~
    }
    class c0110["LinkedMemory"] {
        <<interface>>
        memory: Memory
        link_source_id: number
    }
    class c0111["Memory"] {
        <<interface>>
        id: number
        is_obsolete: boolean
        superseded_by: Type135
        obsolete_reason: Type10
        obsoleted_at: Type10
        linked_memory_ids: number[]
        access_count: number
        last_accessed_at: Type10
        updated_at: string
    }
    class c0112["MemoryCreateResult"] {
        <<interface>>
        id: number
        autoLinkedMemoryIds: number[]
    }
    class c0113["MemoryInput"] {
        <<interface>>
        title: string
        content: string
        context: string
        keywords: string[]
        tags: string[]
        importance: number
        project_ids: number[]
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
        document_ids: number[]
        code_artifact_ids: number[]
        file_ids: number[]
    }
    class c0114["MemoryModelClient"] {
        <<interface>>
        +prepareCapture(request: ModelRequest) Type141
        +complete(request: ModelRequest) Promise~unknown~
    }
    class c0115["MemorySearchResult"] {
        <<interface>>
        query: string
        primary_memories: Memory[]
        linked_memories: LinkedMemory[]
        total_count: number
        token_count: number
        truncated: boolean
    }
    class c0116["ModelEvidencePage"] {
        <<class>>
        constructor(entryId: string, record: unknown, offset: number, limit: number) unknown
        entryId: string
        record: unknown
        offset: number
        limit: number
    }
    class c0117["ModelReadErrorResult"] {
        <<class>>
        constructor(value: unknown) unknown
        value: unknown
    }
    class c0118["ModelReadTool"] {
        <<interface>>
        name: string
        description: string
        parameters: unknown
        +execute(input: unknown, signal: AbortSignal) Promise~unknown~
    }
    class c0119["ModelRequest"] {
        <<interface>>
        purpose: Type142
        policy: string
        input: unknown
        conversation: readonly unknown[]
        onConversationCompacted: Type143
        signal: AbortSignal
        submission: ModelSubmissionTool
        readTools: ModelReadTool[]
        readConcurrency: number
        readBatchContext: Type144
        diagnosticContext: Type145
    }
    class c0120["ModelSubmissionError"] {
        <<class>>
        constructor(message: string, rejectionReasons: string[]) unknown
        rejectionReasons: string[]
    }
    class c0121["ModelSubmissionTool"] {
        <<interface>>
        name: string
        description: string
        parameters: unknown
        +validate(input: unknown) unknown
        +onRejection(reason: string, input: unknown) void
    }
    class c0122["ModelTaskPause"] {
        <<class>>
    }
    class c0123["Project"] {
        <<interface>>
        id: number
        name: string
        repo_name: Type10
        description: string
    }
    class c0124["ProjectInput"] {
        <<interface>>
        name: string
        description: string
        repo_name: string
    }
    class c0125["Provenance"] {
        <<interface>>
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
    }
    class c0126["Scope"] {
        <<type_alias>>
        alias: Type146
    }
    class c0127["SearchRequest"] {
        <<interface>>
        query: string
        query_context: string
        project_ids: number[]
        strict_project_filter: boolean
        k: number
        include_links: boolean
        max_links: number
        max_links_per_primary: number
    }
    class c0128["StoredFile"] {
        <<interface>>
        data: string
    }
    class c0129["WorkContext"] {
        <<interface>>
        cwd: string
        repoName: string
        project: Project
        projectDiscoveryPending: boolean
        sessionId: string
        branchId: string
    }
    class c0130["PlanStatus"] {
        <<type_alias>>
        alias: Type147
    }
    class c0131["PlanningCapability"] {
        <<type_alias>>
        alias: Type148
    }
    class c0132["PlanningCounts"] {
        <<interface>>
        cancelled: number
        done: number
        total: number
    }
    class c0133["PlanningCriterion"] {
        <<interface>>
        id: number
        task_id: number
        description: string
        met: boolean
        met_at: Type10
    }
    class c0134["PlanningPlan"] {
        <<interface>>
        goal: Type10
        context: Type10
    }
    class c0135["PlanningPlanSummary"] {
        <<interface>>
        id: number
        title: string
        project_id: number
        status: PlanStatus
        task_count: number
    }
    class c0136["PlanningProject"] {
        <<interface>>
        id: number
        name: string
        repo_name: Type10
    }
    class c0137["PlanningTask"] {
        <<interface>>
        description: Type10
        criteria: PlanningCriterion[]
        dependency_ids: number[]
    }
    class c0138["PlanningTaskRecord"] {
        <<interface>>
        id: number
        title: string
        plan_id: number
        state: TaskState
        priority: TaskPriority
        assigned_agent: Type10
        version: number
    }
    class c0139["PlanningTaskSummary"] {
        <<interface>>
        criteria_met: number
        criteria_total: number
        blocked: boolean
    }
    class c0140["TaskPriority"] {
        <<type_alias>>
        alias: Type149
    }
    class c0141["TaskState"] {
        <<type_alias>>
        alias: Type150
    }
    class c0142["src/domain/planning.ts"] {
        <<module>>
        taskCounts(tasks: PlanningTaskSummary[]) PlanningCounts
        activeTasks(tasks: PlanningTaskSummary[]) PlanningTaskSummary[]
        sortPlans(plans: PlanningPlanSummary[]) PlanningPlanSummary[]
        mappedProject(projects: PlanningProject[], repoName: string) Type16
    }
    class c0143["AutomaticCaptureJobOutcome"] {
        <<interface>>
        ready: boolean
        terminal: boolean
        noCandidates: boolean
        candidateStages: Type151
        failure: Type152
    }
    class c0144["AutomaticRecall"] {
        <<type_alias>>
        alias: RecallJob
    }
    class c0145["BoundedWaitOutcome"] {
        <<type_alias>>
        alias: Type153
        kind: Type154
        value: T
        kind: Type155
        kind: Type156
        error: unknown
        kind: Type157
    }
    class c0146["CaptureFeedbackItem"] {
        <<interface>>
        jobId: string
        state: CaptureFeedbackState
        outcome: AutomaticCaptureJobOutcome
    }
    class c0147["CaptureFeedbackState"] {
        <<interface>>
        reportedCandidateKeys: Set~string~
        lastFailureKey: string
        lastUnavailable: boolean
        retried: boolean
    }
    class c0148["CaptureServicePort"] {
        <<interface>>
        +enqueue(snapshot: CaptureSnapshot) Promise~unknown~
        +checkpoint(options: CaptureCheckpointOptions) Promise~CaptureCheckpointResult~
        +advanceWatermark(update: Type158) Promise~unknown~
        +stop(sessionId: string, branchId: string) Type159
        +pendingConflicts(options: Type107) Promise~unknown[]~
        +diagnostics(options: Type106) Promise~unknown~
        +resolveConflict(conflictId: string, resolution: Type160) Promise~unknown~
    }
    class c0149["DiagnosticCandidate"] {
        <<interface>>
        id: unknown
        stage: unknown
        action: unknown
        destinationProjectId: unknown
        sourceEntryIds: unknown
        reason: unknown
        replacementId: unknown
        title: unknown
        content: unknown
        durationMs: unknown
    }
    class c0150["DiagnosticParts"] {
        <<interface>>
        candidates: number
        stages: Type161
        outcomes: string[]
    }
    class c0151["ExtensionWorkContext"] {
        <<interface>>
        projects: Project[]
    }
    class c0152["ForgetfulExtensionDependencies"] {
        <<interface>>
        client: ForgetfulClient
        createClient: Type162
        recall: RecallServicePort
        capture: CaptureServicePort
        createRecall: Type163
        createCapture: Type164
        resolveWorkContext: Type165
    }
    class c0153["ForgetfulExtensionOptions"] {
        <<interface>>
        agentDir: string
        config: Type166
        dependencies: ForgetfulExtensionDependencies
        policies: Type167
    }
    class c0154["PendingQueuedRecall"] {
        <<type_alias>>
        alias: RecallJob
    }
    class c0155["PolicyName"] {
        <<type_alias>>
        alias: Type168
    }
    class c0156["PreparedRuntime"] {
        <<interface>>
        logger: FileLogger
        config: ForgetfulConfig
        client: ForgetfulClient
        model: PiMemoryModel
        recall: RecallServicePort
        context: ExtensionWorkContext
        sessionId: string
        currentLeaf: Type10
        branchId: string
        queueDirectory: string
    }
    class c0157["RecallActivity"] {
        <<interface>>
        memoryCount: number
        scope: Scope
        reason: string
    }
    class c0158["RecallContextMessage"] {
        <<interface>>
        role: string
        content: unknown
        customType: unknown
        details: unknown
    }
    class c0159["RecallJob"] {
        <<interface>>
        key: string
        jobId: string
        kind: Type169
        runtime: Runtime
        branchId: string
        generation: number
        prompt: string
        controller: AbortController
        promise: Promise~RecallResult~
        userEntryId: string
        phase: Type170
        result: RecallResult
        boundarySeen: boolean
        terminalConsumed: boolean
        resultSent: boolean
    }
    class c0160["RecallServicePort"] {
        <<interface>>
        +recall(request: Type171) Promise~RecallResult~
        +deeper(request: DeeperRecallRequest) Promise~RecallResult~
    }
    class c0161["Runtime"] {
        <<interface>>
        logger: FileLogger
        activity: ForgetfulActivity
        planning: PlanningRuntime
        sessionId: string
        generation: number
        cwd: string
        config: ForgetfulConfig
        client: ForgetfulClient
        model: PiMemoryModel
        recall: RecallServicePort
        capture: CaptureServicePort
        queue: DurableQueueStore
        context: ExtensionWorkContext
        branchId: string
        baselineEntryId: Type10
        lastCaptureEntryId: string
        pendingCaptureJobs: Type172
        recoveryResult: CaptureCheckpointResult
        captureFeedbackFlush: Promise~void~
        captureCheckpointTail: Promise~void~
        captureRetryScheduled: boolean
        captureTriggerId: number
        captureDeferrals: Type173
        settledCaptureTail: Promise~void~
        lifecycleController: AbortController
        initialization: Promise~void~
        ready: boolean
        discoveryError: unknown
        lastRecall: RecallActivity
        skipNextCapture: boolean
    }
    class c0162["SetupAuthentication"] {
        <<interface>>
        tokenEnv: string
        token: string
    }
    class c0163["State"] {
        <<interface>>
        runtime: Runtime
        pendingQueuedRecall: Type174
        automaticRecalls: Type175
        recallJobs: Type176
        skipNextCapture: boolean
        shownWarnings: Set~string~
        generation: number
        loading: Promise~Runtime~
    }
    class c0164["src/extension.ts"] {
        <<module>>
        boundedWait(Signature93)
        setupEndpointSuggestion(value: string) string
        promptSetupEndpoint(ctx: ExtensionContext, config: ForgetfulConfig) Type178
        promptSetupAuthentication(ctx: ExtensionContext) Type179
        makeInstanceId(config: ForgetfulConfig) string
        policyText(config: ForgetfulConfig, policies: Type167, name: PolicyName) string
        sessionKey(ctx: ExtensionContext, branchId: string) string
        boundedErrorDiagnostic(error: unknown) string
        textMessage(text: string) UserMessage
        snapshotWorkContext(context: ExtensionWorkContext) ExtensionWorkContext
        messageContentText(content: unknown) string
        usefulRecallText(result: RecallResult) string
        savedRecallResultText(result: RecallResult, kind: Type169) string
        automaticRecallTerminalText(Signature94)
        automaticRecallResultStatus(result: RecallResult) Type180
        recallActivitySummary(activity: RecallActivity) string
        recordRecallActivity(Signature95)
        recallContextEntries(ctx: ExtensionContext) EvidenceEntry[]
        latestBranchUserEntry(ctx: ExtensionContext) Type181
        latestContextUserPrompt(messages: Type182) Type116
        conflictBelongsToActiveBranch(Signature96)
        defaultWorkContext(ctx: ExtensionContext, branchId: string) ExtensionWorkContext
        canonicalRepository(remote: string) Type116
        qualifiedRepository(host: string, path: string) Type116
        discoverWorkContext(Signature97)
        parseSelection(value: string) Type129
        pickMemoryModel(ctx: ExtensionContext, currentModel: Type184) Type183
        notify(ctx: ExtensionContext, message: string, type: Type185) void
        log(Signature98)
        logFailure(Signature99)
        diagnosticSourceIds(value: unknown) string
        claimText(value: unknown) string
        diagnosticCandidateDetail(value: unknown, stages: Type161) Type116
        collectDiagnosticParts(jobs: unknown[]) DiagnosticParts
        diagnosticSummary(value: unknown) string
        captureJobId(value: unknown) Type116
        captureWasQueued(value: unknown) boolean
        captureProcessedJobIds(value: Type187) string[]
        captureFeedbackReason(value: unknown) Type116
        automaticCaptureJobOutcome(value: unknown, jobId: string) Type188
        readCaptureOutcome(Signature100)
        recordCaptureRetry(#123; state#44; outcome #125;: CaptureFeedbackItem) Type190
        collectCaptureFeedback(items: CaptureFeedbackItem[]) unknown
        captureCount(count: number, singular: string, plural: string) string
        skippedReasonBreakdown(reasons: Type161) string
        captureFailurePart(summary: Type191, noOtherParts: boolean) Type116
        captureFeedbackParts(summary: Type191) string[]
        automaticCaptureFeedback(items: CaptureFeedbackItem[], unavailable: number) Type192
        createForgetfulExtension(options: ForgetfulExtensionOptions) ExtensionFactory
    }
    class c0165["src/foreground-tools.ts"] {
        <<module>>
        registerForegroundTool(pi: ExtensionAPI, definition: ToolDefinition~T~) void
    }
    class c0166["ApiKnowledgeClient"] {
        <<class>>
        constructor(request: KnowledgeRequest, parseMemory: Type193) unknown
        -request: KnowledgeRequest
        -parseMemory: Type193
        searchEntities(query: string, limit: unknown, signal: AbortSignal) Promise~Entity[]~
        getEntity(entityId: number, signal: AbortSignal) Promise~Entity~
        createEntity(input: EntityInput, signal: AbortSignal) Promise~Entity~
        updateEntity(entityId: number, input: Partial~EntityInput~, signal: AbortSignal) unknown
        getEntityMemories(entityId: number, signal: AbortSignal) unknown
        linkEntityMemory(entityId: number, memoryId: number, signal: AbortSignal) Promise~void~
        getRelationships(entityId: number, signal: AbortSignal) Promise~EntityRelationship[]~
        createRelationship(input: EntityRelationshipInput, signal: AbortSignal) unknown
        listDocuments(projectId: number, signal: AbortSignal) Promise~DocumentSummary[]~
        getDocument(documentId: number, signal: AbortSignal) Promise~Document~
        createDocument(input: DocumentInput, signal: AbortSignal) Promise~Document~
        updateDocument(Signature101)
        listCodeArtifacts(projectId: number, signal: AbortSignal) Promise~CodeArtifactSummary[]~
        getCodeArtifact(artifactId: number, signal: AbortSignal) Promise~CodeArtifact~
        createCodeArtifact(input: CodeArtifactInput, signal: AbortSignal) Promise~CodeArtifact~
        updateCodeArtifact(Signature102)
        updateMemory(memoryId: number, input: Partial~MemoryInput~, signal: AbortSignal) unknown
        linkMemories(memoryId: number, relatedIds: number[], signal: AbortSignal) Promise~void~
        unlinkMemories(memoryId: number, targetId: number, signal: AbortSignal) Promise~void~
        listFiles(projectId: number, signal: AbortSignal) Promise~FileSummary[]~
        getFile(fileId: number, signal: AbortSignal) Promise~StoredFile~
    }
    class c0167["KnowledgeRequest"] {
        <<type_alias>>
        alias: Type194
    }
    class c0168["src/http-knowledge.ts"] {
        <<module>>
        object(value: unknown) Type9
        text(value: unknown, max: number, empty: unknown, field: unknown) string
        id(value: unknown) number
        ids(value: unknown) number[]
        strings(value: unknown, max: unknown) string[]
        records(value: unknown, key: string) unknown[]
        provenance(value: Type9) Provenance
        entityBody(input: Partial~EntityInput~, partial: unknown) Type9
        entity(value: unknown) Entity
        relationshipBody(input: EntityRelationshipInput) Type9
        relationship(value: unknown) EntityRelationship
        memoryMetadata(value: Type9) Type9
        resourceBody(input: Type195, code: boolean, partial: unknown) Type9
        document(value: unknown) Document
        artifact(value: unknown) CodeArtifact
        summary(value: unknown, code: boolean) Type196
        requestSegment(value: unknown) string
        projectPath(path: string, projectId: number) string
        fileSummary(value: unknown) FileSummary
    }
    class c0169["ApiForgetfulClient"] {
        <<class>>
        knowledge: unknown
        search(request: SearchRequest, signal: AbortSignal) Promise~Memory[]~
        queryMemory(request: SearchRequest, signal: AbortSignal) Promise~MemorySearchResult~
        listProjects(repoName: string, signal: AbortSignal) Promise~Project[]~
        createProject(input: ProjectInput, signal: AbortSignal) Promise~Project~
        linkProject(id: number, repoName: string, signal: AbortSignal) Promise~Project~
        create(input: MemoryInput, signal: AbortSignal) Promise~MemoryCreateResult~
        get(id: number, signal: AbortSignal) Promise~Memory~
        getMemoryEntityIds(id: number, signal: AbortSignal) Promise~number[]~
        supersede(Signature103)
        obsolete(Signature104)
        -validId(id: number) number
    }
    class c0170["ApiForgetfulClientOptions"] {
        <<interface>>
        baseUrl: string
        token: string
        timeoutMs: number
        maxResponseBytes: number
        fetchImpl: typeof fetch
    }
    class c0171["ForgetfulAbortError"] {
        <<class>>
        constructor(message: unknown) unknown
    }
    class c0172["ForgetfulHttpError"] {
        <<class>>
        status: number
        responseBody: string
        constructor(message: string, status: number, responseBody: string) unknown
    }
    class c0173["ForgetfulHttpTransport"] {
        <<class>>
        -baseUrl: URL
        -token: string
        -timeoutMs: number
        -maxResponseBytes: number
        -maxFileResponseBytes: number
        -fetchImpl: typeof fetch
        constructor(options: ApiForgetfulClientOptions) unknown
        getJson(path: string, signal: AbortSignal) Promise~unknown~
        getDeployment(path: string, signal: AbortSignal) Promise~unknown~
        #endpoint(path: string) string
        -responseByteLimit(method: string, url: URL) number
        #request(Signature105)
        -throwResponseError(Signature106)
        -readResponse(response: Response, signal: AbortSignal, maxBytes: number) Promise~string~
    }
    class c0174["ForgetfulSchemaError"] {
        <<class>>
        constructor(message: string) unknown
    }
    class c0175["ForgetfulTimeoutError"] {
        <<class>>
        constructor(message: unknown) unknown
    }
    class c0176["src/http.ts"] {
        <<module>>
        isObject(value: unknown) Type128
        directEntityId(edge: unknown, memoryId: number) Type16
        requiredString(value: unknown, field: string, allowEmpty: unknown) string
        projectText(value: string, field: string, max: number) string
        optionalString(value: unknown, field: string) Type116
        requiredInteger(value: unknown, field: string) number
        nonNegativeInteger(value: unknown, field: string) number
        integerArray(value: unknown, field: string) number[]
        stringArray(value: unknown, field: string) string[]
        parseMemory(value: unknown, where: string) Memory
        parseProject(value: unknown, where: string) Project
        parseJson(text: string, where: string) unknown
        localHost(hostname: string) boolean
        trimTrailingSlashes(pathname: string) string
        makeAbortError() ForgetfulAbortError
        defaultWhenOmitted(value: Type199, fallback: T) T
        searchBody(request: SearchRequest) Type9
        uniqueMemories(memories: Memory[]) Memory[]
        parseLinkedMemories(value: unknown) LinkedMemory[]
        parseSearchPayload(Signature107)
        flattenSearchResult(result: MemorySearchResult) Memory[]
    }
    class c0177["Attachments"] {
        <<interface>>
        documents: Document[]
        artifacts: CodeArtifact[]
        files: FileSummary[]
        fileIds: number[]
    }
    class c0178["ExpansionContext"] {
        <<interface>>
        failures: Type200
    }
    class c0179["KnowledgeExpansionRequest"] {
        <<interface>>
        memories: Memory[]
        entityNames: string[]
        scope: Scope
        projectId: number
        signal: AbortSignal
    }
    class c0180["KnowledgeExpansionResult"] {
        <<interface>>
        text: string
        memoryIds: number[]
        entityIds: number[]
        relationshipIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
        failures: Type201
    }
    class c0181["KnowledgeReadService"] {
        <<class>>
        -readMemory: MemoryReader
        constructor(client: KnowledgeClient, options: Type202) unknown
        -client: KnowledgeClient
        expand(request: KnowledgeExpansionRequest) Promise~KnowledgeExpansionResult~
        -findEntities(request: ExpansionContext) Promise~Entity[]~
        -findRelationships(Signature108)
        -collectRelationships(Signature109)
        -resolveRelationshipEndpoints(Signature110)
        -formatRelationships(Signature111)
        -findEntityMemories(Signature112)
        -collectEntityMemories(Signature113)
        -isAllowedEntityMemory(id: number, request: ExpansionContext) Promise~boolean~
        -findAttachments(request: ExpansionContext) Promise~Attachments~
        -formatExpansion(Signature114)
        -appendEntityLines(lines: string[], entities: Entity[]) void
        -appendRelationshipLines(lines: string[], relationships: RelationshipExpansion[]) void
        -appendLinkedMemoryLines(lines: string[], linkedMemories: LinkedMemoryExpansion[]) void
        -appendDocumentLines(lines: string[], documents: Document[]) void
        -appendArtifactLines(lines: string[], artifacts: CodeArtifact[]) void
        -appendFileLines(lines: string[], files: FileSummary[], fileIds: number[]) void
        -emptyExpansion() KnowledgeExpansionResult
    }
    class c0182["KnowledgeReadServiceOptions"] {
        <<interface>>
        readMemory: MemoryReader
    }
    class c0183["LinkedMemoryExpansion"] {
        <<type_alias>>
        entity: Entity
        id: number
        title: string
    }
    class c0184["MemoryReader"] {
        <<type_alias>>
        alias: Type206
    }
    class c0185["RelationshipExpansion"] {
        <<type_alias>>
        relationship: EntityRelationship
        source: Entity
        target: Entity
    }
    class c0186["src/knowledge-read.ts"] {
        <<module>>
        validId(value: unknown) value is number
        validEntity(value: unknown) value is Entity
        validRelationship(value: unknown) value is EntityRelationship
        validMemory(value: unknown) value is Memory
        inEntityScope(entity: Entity, scope: Scope, projectId: number) boolean
        inProjectScope(resourceProjectId: Type57, scope: Scope, projectId: number) boolean
        clean(value: string) string
        safeCall(operation: Type3, request: ExpansionContext, operationName: string) Type207
    }
    class c0187["KnowledgeReadContext"] {
        <<interface>>
        client: ForgetfulClient
        knowledge: KnowledgeClient
        request: KnowledgeReadRequest
        context: KnowledgeToolContext
        projectId: number
        signal: AbortSignal
    }
    class c0188["KnowledgeReadRequest"] {
        <<type_alias>>
        alias: Type208
        operation: string
    }
    class c0189["KnowledgeToolContext"] {
        <<interface>>
        cwd: string
        repoName: string
        commit: string
        project: Type209
        scope: Scope
    }
    class c0190["KnowledgeToolResult"] {
        <<interface>>
        content: Type210
        details: Type9
        file: StoredFile
    }
    class c0191["KnowledgeWriteContext"] {
        <<interface>>
        client: ForgetfulClient
        knowledge: KnowledgeClient
        request: KnowledgeWriteRequest
        context: KnowledgeToolContext
        projectId: number
        signal: AbortSignal
        beforeWrite: Type53
        checkWriteState: Type12
    }
    class c0192["KnowledgeWriteRequest"] {
        <<type_alias>>
        alias: Type208
        operation: string
    }
    class c0193["ResolvedWriteProject"] {
        <<interface>>
        id: number
        repoName: string
    }
    class c0194["ToolImage"] {
        <<type_alias>>
        data: string
        mimeType: string
        type: Type211
    }
    class c0195["ToolText"] {
        <<type_alias>>
        text: string
        type: Type212
    }
    class c0196["src/knowledge-tools.ts"] {
        <<module>>
        leftoverSearchField(description: string) unknown
        isEntityType(value: unknown) value is EntityType
        record(value: unknown, label: string) Type9
        requiredText(value: unknown, field: string, max: number) string
        optionalText(value: unknown, field: string, max: number) Type116
        requiredId(value: unknown, field: string) number
        optionalId(value: unknown, field: string) Type16
        boundedId(value: unknown, field: string, maximum: number) Type16
        requiredIds(value: unknown, field: string) number[]
        optionalIds(value: unknown, field: string) Type119
        requiredStrings(value: unknown, field: string, maxItems: unknown) string[]
        optionalStrings(value: unknown, field: string, maxItems: unknown) Type120
        optionalImportance(value: unknown) Type16
        commit(value: unknown) Type116
        checkOperation(value: unknown, choices: Set~string~) string
        containsSensitiveData(value: unknown) boolean
        rejectSensitiveInput(value: unknown) void
        need(input: Type9, fields: Type213) void
        validateReadSearch(input: Type9, op: string) void
        validateReadPagination(input: Type9, op: string) void
        validateKnowledgeReadRequest(value: unknown) KnowledgeReadRequest
        validateEntityFields(input: Type9) void
        validateKnowledgeWriteRequest(value: unknown) KnowledgeWriteRequest
        rich(client: ForgetfulClient) KnowledgeClient
        currentProject(context: KnowledgeToolContext, requested: number) number
        resolveWriteProject(Signature115)
        inMemoryProject(memory: Memory, projectId: number) boolean
        inEntityProject(entity: Entity, projectId: number) boolean
        json(value: unknown) string
        page(value: Type214, field: Type215, offset: number, limit: number) unknown
        listPage(values: T[], offset: number, limit: number) Type216
        boundedListPage(values: T[], offset: number, limit: number) Type217
        fileContent(file: StoredFile, offset: number, limit: number) Type218
        readResult(value: unknown, details: Type9) KnowledgeToolResult
        assertReadMemory(Signature116)
        assertReadEntity(Signature117)
        requireReadKnowledge(read: KnowledgeReadContext) KnowledgeClient
        requestedReadProject(read: KnowledgeReadContext) Type16
        readProjects(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readMemories(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readMemory(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readEntities(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readEntity(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readEntityMemories(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readRelationships(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readDocuments(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readDocument(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readCodeArtifacts(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readCodeArtifact(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readFiles(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readFile(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        executeKnowledgeRead(Signature118)
        provenance(context: KnowledgeToolContext, request: Type9) Type219
        effectiveCommit(context: KnowledgeToolContext, request: Type9) Type116
        updateProvenance(Signature119)
        beforeMutation(beforeWrite: Type220, signal: AbortSignal) Promise~void~
        memoryInProject(Signature120)
        entityInProject(Signature121)
        hydrateEntities(Signature122)
        validateAttachments(Signature123)
        compactString(value: unknown) unknown
        compactObjectEntry(key: string, value: unknown, depth: number) unknown
        compactWriteValue(value: unknown, depth: unknown) unknown
        writeResult(value: unknown, operation: string) KnowledgeToolResult
        createMemory(Signature124)
        createEntity(Signature125)
        createDocument(Signature126)
        createCodeArtifact(Signature127)
        replacementMemory(write: KnowledgeWriteContext) Promise~Memory~
        updateMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        supersedeMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        linkMemories(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateEntity(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        linkEntityMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        createRelationship(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateDocument(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateCodeArtifact(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        executeKnowledgeWrite(Signature128)
    }
    class c0197["KnowledgeAttachmentIds"] {
        <<interface>>
        documentIds: number[]
        codeArtifactIds: number[]
    }
    class c0198["KnowledgeCodeArtifactPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: CodeArtifactInput
    }
    class c0199["KnowledgeDocumentPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: DocumentInput
    }
    class c0200["KnowledgeEntityMemoryLinkPlan"] {
        <<interface>>
        entityKey: string
    }
    class c0201["KnowledgeEntityPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: EntityInput
    }
    class c0202["KnowledgeMemoryReader"] {
        <<type_alias>>
        alias: Type206
    }
    class c0203["KnowledgeRelationshipPlan"] {
        <<interface>>
        key: string
        existingId: number
        sourceEntityKey: string
        targetEntityKey: string
        input: EntityRelationshipInput
    }
    class c0204["KnowledgeWriteCheckpoint"] {
        <<type_alias>>
        alias: Type221
    }
    class c0205["KnowledgeWriteGuard"] {
        <<type_alias>>
        alias: Type53
    }
    class c0206["KnowledgeWritePlan"] {
        <<interface>>
        operationId: string
        projectId: number
        memoryId: number
        expectedClaim: Type222
        attachResources: boolean
        existingDocumentIds: number[]
        existingCodeArtifactIds: number[]
        entities: KnowledgeEntityPlan[]
        documents: KnowledgeDocumentPlan[]
        codeArtifacts: KnowledgeCodeArtifactPlan[]
        relationships: KnowledgeRelationshipPlan[]
        entityMemoryLinks: KnowledgeEntityMemoryLinkPlan[]
        linkedMemoryIds: number[]
    }
    class c0207["KnowledgeWriteReceipt"] {
        <<interface>>
        key: string
        id: number
        occurrence: number
    }
    class c0208["KnowledgeWriteSave"] {
        <<type_alias>>
        alias: Type53
    }
    class c0209["KnowledgeWriteState"] {
        <<interface>>
        failure: Type223
        instructionId: string
        entities: KnowledgeWriteReceipt[]
        documents: KnowledgeWriteReceipt[]
        codeArtifacts: KnowledgeWriteReceipt[]
        relationships: KnowledgeWriteReceipt[]
        entityMemoryLinks: string[]
        linkedMemories: string[]
        attachmentsApplied: boolean
        pendingCreates: string[]
    }
    class c0210["KnowledgeWriter"] {
        <<class>>
        constructor(Signature129)
        -client: WriteClient
        -readMemory: KnowledgeMemoryReader
        -assertCanWrite: Type12
        -attachmentMemory(plan: KnowledgeWritePlan, signal: AbortSignal) Promise~Memory~
        -recordCreateFailure(Signature130)
        -createOnce(Signature131)
        -writeEntity(Signature132)
        -writeEntities(Signature133)
        -writeDocument(Signature134)
        -writeDocuments(Signature135)
        -writeCodeArtifact(Signature136)
        -writeCodeArtifacts(Signature137)
        -requestedAttachmentIds(Signature138)
        -attachmentIds(memory: Memory, requested: KnowledgeAttachmentIds) KnowledgeAttachmentIds
        -attachmentsDiffer(memory: Memory, ids: KnowledgeAttachmentIds) boolean
        -attachmentPatch(ids: KnowledgeAttachmentIds) Type226
        -writeConnection(Signature139)
        -writeAttachments(Signature140)
        -writeRelationship(Signature141)
        -writeRelationships(Signature142)
        -writeEntityMemoryLink(Signature143)
        -writeEntityMemoryLinks(Signature144)
        -writeLinkedMemory(Signature145)
        -writeLinkedMemories(Signature146)
        execute(Signature147)
    }
    class c0211["ResourceSlot"] {
        <<type_alias>>
        alias: Type228
        occurrence: number
    }
    class c0212["WriteClient"] {
        <<type_alias>>
        alias: Type229
    }
    class c0213["src/knowledge-write.ts"] {
        <<module>>
        resourceSlots(resources: T[]) ResourceSlot~T~[]
        copyState(value: KnowledgeWriteState) KnowledgeWriteState
        positiveId(value: unknown) value is number
        rejectedCreate(error: unknown) boolean
        stateWithNumber(Signature148)
        stateId(values: KnowledgeWriteReceipt[], key: string, occurrence: unknown) Type16
        selectedIds(values: KnowledgeWriteReceipt[], resources: Type230) number[]
        uniqueIds(values: number[]) number[]
        sameIds(left: Type119, right: number[]) boolean
        receipts(value: unknown) KnowledgeWriteReceipt[]
        normalizedState(previous: Partial~KnowledgeWriteState~) KnowledgeWriteState
        hasValue(values: string[], value: string) boolean
        instructionId(plan: KnowledgeWritePlan) string
    }
    class c0214["DiagnosticLogger"] {
        <<interface>>
        +emit(level: Type80, event: string, data: Type9) void
        +flush() Promise~void~
    }
    class c0215["FileLogLevel"] {
        <<type_alias>>
        alias: Type231
    }
    class c0216["FileLogger"] {
        <<class>>
        filePath: string
        -level: FileLogLevel
        -pending: unknown
        -generation: unknown
        -failed: unknown
        -closed: unknown
        -warned: unknown
        -maxEventBytes: number
        -maxFileBytes: number
        -maxFiles: number
        -fileBytes: unknown
        -fileCount: unknown
        -pendingBytes: unknown
        -debugPendingBytes: unknown
        constructor(options: Type232) unknown
        -options: Type232
        setLevel(level: FileLogLevel) void
        emit(level: Type80, event: string, data: Type9) void
        -enqueue(level: Type80, event: string, data: Type9) void
        -encode(level: Type80, row: Type9) Type233
        -fitLine(row: Type9) string
        -write(lines: string[], trace: boolean, generation: number) Promise~void~
        -traceLines(row: Type9, payload: string) Type120
        -traceFileCount(lines: string[], used: unknown) number
        -rotate() Promise~void~
        -warn(error: unknown) void
        close() Promise~void~
        flush() Promise~void~
    }
    class c0217["src/logging.ts"] {
        <<module>>
        processExited(pid: number) boolean
        listLogFiles(directory: string) unknown
        pruneDirectory(directory: string, current: Type22) Promise~void~
        limit(value: Type16, fallback: number) number
        excludeCredentials(value: unknown) unknown
        correlation(data: unknown) Type9
    }
    class c0218["src/memory-context.ts"] {
        <<module>>
        storedMemoryContext(context: string) string
        replacementMemoryContext(context: string) string
        replacementMemoryInput(input: MemoryInput) MemoryInput
    }
    class c0219["CompactedMemoryHistory"] {
        <<interface>>
        summary: string
        retainedMessages: Message[]
    }
    class c0220["ContextWindowError"] {
        <<class>>
    }
    class c0221["MemoryHistorySummaryOptions"] {
        <<interface>>
        model: Model~any~
        compactionSettings: CompactionSettings
        contextLimitTokens: number
        signal: AbortSignal
        sessionId: string
        complete: SummaryCompletion
    }
    class c0222["MemoryTaskContext"] {
        <<class>>
        -settings: typeof DEFAULT_COMPACTION_SETTINGS
        -contextWindow: number
        -originalHistory: Set~Message~
        -compactedHistory: CompactedMemoryHistory
        -summaryMessage: Message
        constructor(Signature149)
        -model: Model~any~
        -task: Message
        getCompactedHistory() Type235
        prepare(Signature150)
        prepareCapture(Signature151)
        -prepareContext(Signature152)
        -applySummary(Signature153)
        -outputAllowance(context: Context) number
    }
    class c0223["SummaryCompletion"] {
        <<type_alias>>
        alias: Type238
    }
    class c0224["src/model-context.ts"] {
        <<module>>
        objectRecord(value: unknown) Type128
        modelEvidence(record: unknown) unknown
        evidenceMessage(record: unknown, label: string, timestamp: number) UserMessage
        evidencePageContent(page: ModelEvidencePage) Type239
        textTokens(text: string) number
        contextTokens(context: Context) number
        assertFits(Signature154)
        validatePositiveSafeInteger(value: unknown, label: string) number
        entriesFor(messages: Message[]) SessionMessageEntry[]
        recentCutIndex(messages: Message[], keepRecentTokens: number) number
        assertImageSupport(context: Context, model: Model~any~) void
        summaryEvidence(message: Message, index: number) UserMessage
        privateContextWindow(model: Model~any~, contextLimitTokens: unknown) number
        compactionSettings(settings: CompactionSettings) typeof DEFAULT_COMPACTION_SETTINGS
        outputCeiling(Signature155)
        resolvedOutputAllowance(Signature156)
        smallerSummaryBatch(messages: Message[], count: number) number
        summarizeMemoryHistory(Signature157)
    }
    class c0225["MemoryModelHeaderTransform"] {
        <<type_alias>>
        alias: Type241
    }
    class c0226["ModelPickerContext"] {
        <<interface>>
        modelRegistry: Type242
        scopedModels: Type243
    }
    class c0227["ModelRegistryPort"] {
        <<interface>>
        +find(provider: string, modelId: string) Type184
        +complete(Signature158)
    }
    class c0228["PiMemoryModel"] {
        <<class>>
        version: string
        -classificationTimeoutMs: number
        -sessionId: string
        -transformHeaders: MemoryModelHeaderTransform
        -logger: DiagnosticLogger
        -compactionSettings: CompactionSettings
        -contextLimitTokens: number
        constructor(Signature159)
        -registry: ModelRegistryPort
        -selection: ModelSelection
        complete(request: ModelRequest) Promise~unknown~
        prepareCapture(request: ModelRequest) Type141
        -emit(level: Type80, event: string, request: ModelRequest, data: Type9) void
        -completeRequest(request: ModelRequest, preparationOnly: unknown) Promise~unknown~
        -completeAttempt(Signature160)
        -executeRead(Signature161)
        -validateSubmission(submission: ModelSubmissionTool, tool: Tool, call: ToolCall) unknown
        -completeWithSubmission(Signature162)
    }
    class c0229["PiMemoryModelOptions"] {
        <<interface>>
        logger: DiagnosticLogger
        classificationTimeoutMs: number
        timeoutMs: number
        sessionId: string
        transformHeaders: MemoryModelHeaderTransform
        compactionSettings: CompactionSettings
        contextLimitTokens: number
    }
    class c0230["RequestDeadline"] {
        <<interface>>
        controller: AbortController
        callerAbort: Promise~never~
        timeout: Promise~never~
        timedOut: boolean
        providerCalls: number
        compactionCalls: number
        +cleanup() void
    }
    class c0231["src/model.ts"] {
        <<module>>
        serializeInput(input: unknown) string
        ensureCompletionFinished(Signature163)
        modelLabel(model: ModelSelection) string
        isOpenCodeModel(model: Model~any~) boolean
        openCodeSessionHeaders(model: Model~any~, sessionId: Type116) Type246
        requestTimeout(request: ModelRequest, classificationTimeoutMs: number) number
        requestOptions(Signature164)
        textBlock(text: string) TextContent
        submissionTool(submission: Type248) Tool
        toolCalls(message: AssistantMessage) ToolCall[]
        rejectionText(error: unknown) string
        sanitizedAssistantForHistory(message: AssistantMessage) AssistantMessage
        errorToolResult(call: ToolCall, error: string) ToolResultMessage
        appendCallCountCorrection(Signature165)
        requestDeadline(request: ModelRequest, timeoutMs: number) RequestDeadline
        throwRequestFailure(Signature166)
        resolveMemoryModel(Signature167)
        modelSelectionFromModel(model: Model~any~) ModelSelection
        availableMemoryModels(ctx: ModelPickerContext) Model~any~[]
    }
    class c0232["src/privacy.ts"] {
        <<module>>
        sanitizeText(text: string) string
        diagnosticMessage(error: unknown) string
        errorMessage(error: unknown) string
        hasSensitiveData(text: string) boolean
        isMemoryOperation(toolName: string) boolean
        sanitizeValue(value: unknown) unknown
    }
    class c0233["AgentProjectInitInput"] {
        <<interface>>
        name: string
        description: string
        projectId: number
    }
    class c0234["ProjectInitError"] {
        <<class>>
    }
    class c0235["src/project-init.ts"] {
        <<module>>
        existingMapping(projects: Project[], repoName: string) Type250
        validateAgentProjectDetails(repoName: string, input: AgentProjectInitInput) ProjectInput
        promptNewProject(ctx: ExtensionContext, repoName: string) Type251
        promptExistingProject(Signature168)
        initialiseProject(Signature169)
        initialiseProjectForAgent(Signature170)
    }
    class c0236["DurableQueueStore"] {
        <<class>>
        filePath: string
        lockPath: string
        -directory: string
        -instanceId: string
        -endpoint: string
        -accountId: string
        -staleLockMs: number
        -staleJobMs: number
        -maxAttempts: number
        -retentionMs: number
        -now: Type76
        -snapshotPrefix: string
        constructor(options: Type253) unknown
        -defaultIdentity() QueueIdentity
        -ensureDirectory() Promise~void~
        -snapshotPath(digest: string) string
        -syncDirectory() Promise~void~
        -readSnapshot(digest: string) Promise~SnapshotPayload~
        -storeSnapshot(payload: SnapshotPayload) Promise~string~
        -hydrateJob(job: StoredQueueJob) Promise~QueueJob~
        -releaseTerminalSnapshot(state: QueueState, job: StoredQueueJob) void
        -appendInspections(job: StoredQueueJob, additions: EvidenceEntry[]) Promise~void~
        -collectSnapshots(state: QueueState) Promise~void~
        -readState() Promise~QueueState~
        -writeState(state: QueueState) Promise~void~
        -acquireFileLock(path: string) Promise~FileLock~
        -recoverExistingLock(path: string, error: unknown) Promise~void~
        -createFileLock(path: string, token: string) Promise~FileLock~
        -releaseFileLock(path: string, token: string) Promise~void~
        -removeAbandonedLock(path: string) Promise~void~
        -withFileLock(path: string, operation: Type3) Promise~T~
        -withMutationFileLock(operation: Type3) Promise~T~
        -mutate(operation: Type254) Promise~T~
        -pruneFailedJobs(state: QueueState) boolean
        -prune(state: QueueState) void
        -updateWatermark(state: QueueState, update: WatermarkAdvance) QueueWatermark
        enqueue(snapshot: CaptureSnapshot) Promise~QueueEnqueueResult~
        enqueueSnapshot(snapshot: CaptureSnapshot) Promise~QueueEnqueueResult~
        advanceWatermark(update: Type255) Promise~QueueWatermark~
        getWatermark(sessionId: string, branchId: string) Promise~QueueWatermark~
        resolveBranchId(Signature171)
        currentWatermark(context: Type111) Promise~QueueWatermark~
        completeProjectDiscovery(context: Type256) Promise~void~
        listPending(identity: QueueIdentity) Promise~QueueJob[]~
        listJobs(identity: QueueIdentity) Promise~QueueJob[]~
        listJobMetadata(identity: QueueIdentity) Promise~QueueJobMetadata[]~
        getJob(jobId: string) Type96
        refreshCaptureHistory(jobId: string) Type257
        -reusableHistory(snapshot: CaptureSnapshot, watermark: QueueWatermark) Type258
        hasClaimableWork(identity: QueueIdentity, excludeBranches: Type259) Promise~boolean~
        claimNext(identity: QueueIdentity, branch: Type260, onDiscarded: Type261) Type96
        -matchesBranch(job: QueueJob, branch: Type262) boolean
        -runningJobCanBeRecovered(job: QueueJob, currentTime: number) boolean
        -claimJob(job: QueueJob) void
        releaseProgress(jobId: string, replenishModelCalls: unknown) Promise~void~
        cancel(Signature172)
        checkpoint(jobId: string, patch: QueueCheckpoint) Promise~QueueJob~
        checkpoint(jobId: string, candidateId: string, outcome: unknown) Promise~QueueJob~
        checkpoint(jobId: string, patchOrCandidate: Type263, outcome: unknown) Promise~QueueJob~
        -compactJobSnapshot(Signature173)
        -recordCompletedCapture(state: QueueState, job: StoredQueueJob) Promise~void~
        -applyCheckpointPatch(job: StoredQueueJob, patch: QueueCheckpoint) void
        complete(jobId: string) Promise~QueueJob~
        addConflict(conflict: PendingConflict) Promise~PendingConflict~
        getConflict(conflictId: string) Type264
        pendingConflicts(Signature174)
        listPendingConflicts(Signature175)
        markConflictHandedOff(conflictId: string, entryId: string) Promise~void~
        updateConflict(Signature176)
        withWorkerLock(identity: QueueIdentity, branch: Type260, operation: Type3) Type207
        close() Promise~void~
    }
    class c0237["DurableQueueStoreOptions"] {
        <<interface>>
        directory: string
        filePath: string
        lockPath: string
        instanceId: string
        endpoint: string
        accountId: string
        staleLockMs: number
        staleJobMs: number
        maxAttempts: number
        retentionMs: number
        now: Type76
    }
    class c0238["FileLock"] {
        <<interface>>
        token: string
        +release() Promise~void~
    }
    class c0239["HistoryCache"] {
        <<interface>>
        digest: string
        throughEntryId: string
        entryIds: string[]
    }
    class c0240["PendingConflict"] {
        <<interface>>
        id: string
        jobId: string
        candidateId: string
        binding: QueueIdentity
        sessionId: string
        branchId: string
        context: WorkContext
        destinationProjectId: number
        oldMemoryId: number
        oldMemoryIds: number[]
        oldClaim: string
        newClaim: string
        oldMemory: unknown
        candidate: unknown
        sourceEntryIds: string[]
        evidence: string[]
        partial: boolean
        reason: string
        status: Type265
        handoffEntryId: string
        replacementId: number
        uncertainWrite: string
        supersession: SupersessionReceipt
        replacement: Type266
        resolution: unknown
        createdAt: string
        updatedAt: string
    }
    class c0241["QueueBusyError"] {
        <<class>>
        constructor(path: string) unknown
    }
    class c0242["QueueCheckpoint"] {
        <<interface>>
        status: QueueJobStatus
        callCount: number
        extractedCandidates: unknown[]
        candidateOutcomes: Type9
        submissionRejections: string[]
        lastError: string
        startedAt: string
        supersession: SupersessionReceipt
        inspectionEntries: EvidenceEntry[]
        compactedConversation: CompactedConversation
    }
    class c0243["QueueEnqueueResult"] {
        <<interface>>
        queued: boolean
        jobId: string
        reason: string
        historyError: string
    }
    class c0244["QueueIdentity"] {
        <<interface>>
        instanceId: string
        endpoint: string
        accountId: string
    }
    class c0245["QueueJob"] {
        <<interface>>
        id: string
        dedupeKey: string
        binding: QueueIdentity
        snapshot: CaptureSnapshot
        status: QueueJobStatus
        attempts: number
        callCount: number
        resumeAttempt: boolean
        extractedCandidates: unknown[]
        candidateOutcomes: Type9
        submissionRejections: string[]
        lastError: string
        uncertainWrite: string
        supersession: SupersessionReceipt
        createdAt: string
        updatedAt: string
        startedAt: string
        ownerPid: number
    }
    class c0246["QueueJobMetadata"] {
        <<interface>>
        snapshot: Type267
    }
    class c0247["QueueJobStatus"] {
        <<type_alias>>
        alias: Type268
    }
    class c0248["QueueState"] {
        <<interface>>
        version: Type269
        jobs: StoredQueueJob[]
        conflicts: PendingConflict[]
        watermarks: Type270
    }
    class c0249["QueueWatermark"] {
        <<interface>>
        sessionId: string
        branchId: string
        lastEntryId: string
        capturedThroughEntryId: string
        consideredEntryIds: string[]
        snapshotIds: string[]
        dedupeKeys: string[]
        historyDigest: string
        historyThroughEntryId: string
        historyEntryIds: string[]
        historyAlternatives: HistoryCache[]
        updatedAt: string
    }
    class c0250["SnapshotPayload"] {
        <<type_alias>>
        alias: Type271
        historyEntryIds: string[]
    }
    class c0251["StoredQueueJob"] {
        <<interface>>
        snapshotDigest: string
        inspectionDigest: string
    }
    class c0252["SupersessionReceipt"] {
        <<interface>>
        oldMemoryId: number
        replacementId: number
        operation: Type272
        status: Type41
    }
    class c0253["WatermarkAdvance"] {
        <<interface>>
        sessionId: string
        branchId: string
        entryIds: string[]
        finalEntryId: string
        snapshotId: string
        dedupeKey: string
    }
    class c0254["src/queue.ts"] {
        <<module>>
        jsonSnapshot(value: T) T
        nowIso(now: Type76) string
        contextKey(sessionId: string, branchId: string) string
        dedupeKey(snapshot: CaptureSnapshot) string
        jobIdFor(key: string) string
        scrubDiagnostic(value: string) string
        outcomeRecord(value: unknown) Type9
        interruptedWrite(job: QueueJob) boolean
        releaseCompletedArtifacts(job: StoredQueueJob) void
        normaliseState(value: unknown) QueueState
        validateInspectionEntry(input: EvidenceEntry, reserved: Set~string~) void
        isProcessAlive(pid: unknown) boolean
        identityMatches(job: QueueJob, identity: QueueIdentity) boolean
        conflictIdentityMatches(conflict: PendingConflict, identity: QueueIdentity) boolean
        shouldRetain(timestamp: string, now: number, retentionMs: number) boolean
        diagnosticError(error: unknown) string
        recordId(value: unknown) Type116
        orderedSourceEntryIds(snapshot: CaptureSnapshot) Type120
        summaryCursor(snapshot: CaptureSnapshot) Type273
        cursorComparison(candidate: Type274, current: Type275) Type16
        clearHistoryCache(watermark: QueueWatermark) void
        historyCaches(watermark: QueueWatermark) HistoryCache[]
        setHistoryCaches(watermark: QueueWatermark, caches: HistoryCache[]) void
    }
    class c0255["DeadlineSignal"] {
        <<interface>>
        signal: AbortSignal
        finish: Type12
        pause: Type12
        resume: Type12
        expired: Type22
        diagnostic: Type276
    }
    class c0256["DeeperRecallRequest"] {
        <<interface>>
        query: string
        context: WorkContext
        scope: Scope
        signal: AbortSignal
        deadlineMs: number
        projects: Project[]
    }
    class c0257["RecallPlan"] {
        <<interface>>
        search: boolean
        queries: string[]
        queryIntent: string
        entities: string[]
        repositorySpecific: boolean
        projectId: number
    }
    class c0258["RecallRequest"] {
        <<interface>>
        diagnosticContext: Type277
        prompt: string
        context: WorkContext
        scope: Scope
        classificationPolicy: string
        recallPolicy: string
        signal: AbortSignal
        deadlineMs: number
        authorizeProject: Type278
        projects: Project[]
        sessionContext: EvidenceEntry[]
        onPlan: Type279
    }
    class c0259["RecallResult"] {
        <<interface>>
        text: string
        historicalText: string
        handlingPolicy: string
        memoryIds: number[]
        scope: Scope
        reason: string
        toolError: string
        toolErrorFromForgetful: boolean
        diagnostic: string
        debugTrace: string
        reviewValidationDebug: string
        entityIds: number[]
        relationshipIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
    }
    class c0260["RecallService"] {
        <<class>>
        -defaultDeadlineMs: number
        -failureThreshold: number
        -cooldownMs: number
        -now: Type280
        -knowledge: KnowledgeReadService
        -concurrency: number
        -failures: unknown
        -openedAt: Type16
        constructor(Signature177)
        -client: ForgetfulClient
        -model: MemoryModelClient
        recall(request: RecallRequest) Promise~RecallResult~
        -recallReadTool(Signature178)
        -finishFailure(Signature179)
        -finishReview(Signature180)
        deeper(request: DeeperRecallRequest) Promise~RecallResult~
        -memoryInScope(memory: Memory, scope: Scope, projectId: number) boolean
        -optionalKnowledge(Signature181)
        -resultWithKnowledge(Signature182)
        -plannerInput(request: RecallRequest) unknown
        -authorizeProjectSelection(Signature183)
        -requestsDifferentProject(Signature184)
        -searchMemories(Signature185)
        -searchFailure(error: unknown) unknown
        -searchRequest(Signature186)
        -queryContext(plan: RecallPlan) string
        -resolveScope(Signature187)
        -contextProjectResolution(context: WorkContext) ScopeResolution
        -matchResolution(matches: Project[]) ScopeResolution
        -ensureLive(deadline: DeadlineSignal) void
        -empty(scope: Scope, reason: string) RecallResult
        -circuitOpen() boolean
        -recordFailure() void
        -recordSuccess() void
    }
    class c0261["RecallServiceOptions"] {
        <<interface>>
        concurrency: number
        deadlineMs: number
        circuitFailureThreshold: number
        circuitCooldownMs: number
        now: Type280
    }
    class c0262["ReviewValidationError"] {
        <<class>>
        constructor(message: string, debug: string) unknown
        debug: string
    }
    class c0263["ScopeResolution"] {
        <<interface>>
        projectId: number
        project: Project
        reason: string
    }
    class c0264["SearchOutcome"] {
        <<interface>>
        memories: Memory[]
        failed: boolean
        diagnostic: string
        failure: unknown
    }
    class c0265["src/recall.ts"] {
        <<module>>
        isForgetfulResponseError(error: unknown) Type285
        isObject(value: unknown) Type128
        plannerString(value: unknown, field: string, required: unknown) string
        positiveInteger(value: unknown, field: string) number
        abortError() Error
        isAbort(error: unknown) boolean
        failureReason(deadline: DeadlineSignal, callerSignal: AbortSignal) string
        exceptionDiagnostic(stage: string, error: unknown) string
        trim(value: string, max: number) string
        repositoryIdentity(context: WorkContext) Type116
        repoAwareQuery(query: string, context: WorkContext, repositorySpecific: boolean) string
        availableProjects(context: WorkContext, supplied: Project[]) Project[]
        createDeadlineSignal(callerSignal: Type198, deadlineMs: number) DeadlineSignal
        raceAbort(promise: Promise~T~, signal: AbortSignal) Promise~T~
        parseQueries(value: unknown, search: boolean) string[]
        parseEntities(value: unknown) string[]
        parsePlan(value: unknown) RecallPlan
        validateMemory(value: unknown) Type286
        formatRecall(Signature188)
        reviewSources(result: Partial~RecallResult~) Type288
        sourceLabels(sources: ReturnType~typeof reviewSources~) string[]
        boundDebugText(value: string, max: number, marker: string) string
        reviewerOutputText(value: unknown) string
        reviewMismatchDirection(value: unknown) Type116
        reviewValidationDebug(Signature189)
        submissionAttemptTrace(rejections: string[], exhausted: unknown, label: Type289) string
        parseReview(value: unknown, candidates: RecallResult) Type290
        recallReviewSubmission(Signature190)
        sanitizePolicy(value: string) string
    }
    class c0266["src/repository.ts"] {
        <<module>>
        repositoryName(value: string) string
    }
    class c0267["SetupHelp"] {
        <<interface>>
        newInstance: boolean
        route: Type292
    }
    class c0268["src/setup.ts"] {
        <<module>>
        promptSetupHelp(ctx: ExtensionContext) Type293
        buildSetupPrompt(help: SetupHelp, agentDir: string, settingsPath: string) string
    }
    class c0269["CaptureSnapshotWithStatus"] {
        <<interface>>
        finalStopReason: string
    }
    class c0270["MessageRecord"] {
        <<interface>>
        role: unknown
        content: unknown
        toolName: unknown
        isError: unknown
        stopReason: unknown
        toolCallId: unknown
        details: unknown
    }
    class c0271["SnapshotOptions"] {
        <<interface>>
        session: SnapshotSessionReader
        context: WorkContext
        instanceId: string
        mode: CaptureMode
        scope: Scope
        policy: string
        modelVersion: string
        afterEntryId: Type10
        baselineEntryId: Type10
        branchId: string
        createdAt: string
        leafEntryId: string
        excludedEvidenceEntryIds: readonly string[]
        includeToolEvidence: Type294
    }
    class c0272["SnapshotResult"] {
        <<type_alias>>
        alias: Type295
        snapshot: CaptureSnapshotWithStatus
        status: Type296
        finalEntryId: string
        reason: string
        status: Type297
    }
    class c0273["SnapshotSessionReader"] {
        <<interface>>
        +getSessionId() string
        +getLeafId() Type10
        +getBranch(fromId: string) SessionEntry[]
    }
    class c0274["src/snapshot.ts"] {
        <<module>>
        isRecord(value: unknown) Type128
        asMessage(entry: SessionEntry) Type298
        contentText(content: unknown) string
        safeText(text: string) string
        sanitizeConversation(value: unknown) unknown
        sanitizeCaptureConversation(conversation: readonly unknown[]) unknown[]
        sanitizeCaptureSnapshot(snapshot: CaptureSnapshot) CaptureSnapshot
        conversationForEntry(entry: SessionEntry) unknown
        rootId(branch: SessionEntry[], fallback: string) string
        snapshotId(sessionId: string, branchId: string, finalEntryId: string) string
        deltaStartIndex(Signature191)
        toolEvidence(id: string, message: MessageRecord, includeToolEvidence: Type300) Type299
        evidenceForEntry(entry: SessionEntry, includeToolEvidence: Type301) Type299
        lastAssistantEntry(entries: SessionEntry[]) Type302
        collectEvidence(entries: SessionEntry[], includeToolEvidence: Type300) EvidenceEntry[]
        captureSummaryRecord(history: CaptureHistorySummary) unknown
        captureConversation(snapshot: CaptureSnapshot) readonly unknown[]
        compactCaptureSnapshot(Signature192)
        reuseCaptureHistory(snapshot: CaptureSnapshot, history: Type303) CaptureSnapshot
        buildCaptureSnapshot(options: SnapshotOptions) SnapshotResult
    }
    class c0275["SourceInspectionError"] {
        <<interface>>
        name: string
        message: string
        code: string
    }
    class c0276["SourceInspectionRequest"] {
        <<type_alias>>
        alias: Type304
        path: string
        path: never
        url: never
        url: string
    }
    class c0277["SourceInspectionResult"] {
        <<type_alias>>
        alias: Type305
        status: Type306
        identifier: string
        content: string
        observedAt: string
        contentHash: string
        sanitized: boolean
        page: Type307
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
        fileState: Type308
        provenanceError: SourceInspectionError
        httpStatus: number
        status: Type309
        observedAt: string
        error: SourceInspectionError
        source_url: string
        httpStatus: number
        httpStatusText: string
        body: string
    }
    class c0278["SourceInspector"] {
        <<class>>
        -root: Type310
        constructor(options: SourceInspectorOptions) unknown
        -options: SourceInspectorOptions
        inspect(input: unknown, signal: AbortSignal) Promise~SourceInspectionResult~
        -inspectUrl(request: Type311, signal: AbortSignal) Promise~SourceInspectionResult~
        -getUrl(url: URL, allowLoopback: boolean, signal: AbortSignal) Type312
        -check(signal: AbortSignal) void
        -readFile(cwd: string, path: string, signal: AbortSignal) Promise~Buffer~
        -provenance(cwd: string, path: string, bytes: Buffer, signal: AbortSignal) unknown
        -git(cwd: string, args: string[], signal: AbortSignal) Promise~string~
    }
    class c0279["SourceInspectorOptions"] {
        <<interface>>
        cwd: string
        repoName: string
        canRead: Type22
    }
    class c0280["src/source-inspection.ts"] {
        <<module>>
        loopback(host: string) boolean
        validateUrl(url: URL) string
        validateAddress(address: string, allowLoopback: boolean) void
        errorDetails(error: unknown) SourceInspectionError
        sourceContent(bytes: Buffer, request: SourceInspectionRequest) unknown
        requireInside(cwd: string, path: string) void
    }
    c0000 ..> c0164 : defaultExtension() calls createForgetfulExtension()
    c0003 ..> c0004 : setLabel() calls refresh()
    c0003 ..> c0069 : dispose() calls stop()
    c0004 --> c0003 : field loader
    c0004 ..> c0003 : 4 relationships (see list)
    c0004 ..> c0004 : 3 relationships (see list)
    c0004 ..> c0069 : refresh() calls now()
    c0005 ..> c0005 : 9 relationships (see list)
    c0005 ..> c0006 : 33 relationships (see list)
    c0005 ..|> c0021 : implements
    c0005 ..> c0022 : 7 relationships (see list)
    c0005 ..> c0131 : type in capabilities
    c0005 ..> c0134 : type in plan
    c0005 ..> c0135 : type in plans
    c0005 ..> c0136 : type in projects
    c0005 ..> c0137 : type in task
    c0005 ..> c0139 : type in tasks
    c0005 --> c0170 : field options
    c0005 ..> c0170 : type in constructor
    c0005 --> c0173 : field transport
    c0005 ..> c0173 : 7 relationships (see list)
    c0005 ..> c0186 : clean() calls clean()
    c0005 ..> c0232 : 2 relationships (see list)
    c0006 ..> c0006 : 16 relationships (see list)
    c0006 ..> c0138 : type in taskRecord
    c0006 ..> c0174 : invalid() constructs ForgetfulSchemaError
    c0007 ..|> c0020 : implements
    c0007 ..> c0090 : 3 relationships (see list)
    c0009 ..> c0003 : command() calls refresh()
    c0009 ..> c0009 : 25 relationships (see list)
    c0009 ..> c0010 : 2 relationships (see list)
    c0009 ..> c0011 : 5 relationships (see list)
    c0009 ..> c0013 : 8 relationships (see list)
    c0009 ..> c0023 : type in display
    c0009 --> c0024 : field controller
    c0009 ..> c0024 : type in constructor
    c0009 ..> c0164 : 3 relationships (see list)
    c0009 ..> c0265 : command() calls trim()
    c0010 ..> c0003 : handleInput() calls refresh()
    c0010 ..> c0008 : 3 relationships (see list)
    c0010 ..> c0009 : 4 relationships (see list)
    c0010 ..> c0010 : 9 relationships (see list)
    c0010 ..> c0011 : 12 relationships (see list)
    c0010 ..> c0013 : 5 relationships (see list)
    c0010 ..> c0023 : 8 relationships (see list)
    c0010 --> c0024 : field controller
    c0010 ..> c0024 : type in constructor
    c0011 ..> c0011 : 11 relationships (see list)
    c0011 ..> c0019 : type in emptyTaskList
    c0011 ..> c0023 : 5 relationships (see list)
    c0011 ..> c0135 : type in panelPlan
    c0011 ..> c0139 : type in taskLabel
    c0011 ..> c0232 : text() calls sanitizeText()
    c0012 --> c0018 : field detailError
    c0012 --> c0023 : field planTasks
    c0012 --> c0134 : field planDetail
    c0012 --> c0135 : field plans
    c0012 --> c0137 : field taskDetail
    c0013 ..> c0005 : 6 relationships (see list)
    c0013 ..> c0007 : changePanel() calls write()
    c0013 ..> c0012 : type in readDetails
    c0013 ..> c0013 : 59 relationships (see list)
    c0013 --> c0014 : field options
    c0013 ..> c0014 : type in constructor
    c0013 ..> c0015 : 2 relationships (see list)
    c0013 ..> c0016 : 8 relationships (see list)
    c0013 ..> c0022 : 2 relationships (see list)
    c0013 --> c0023 : field current
    c0013 ..> c0023 : 4 relationships (see list)
    c0013 ..|> c0024 : implements
    c0013 ..> c0069 : 2 relationships (see list)
    c0013 ..> c0135 : type in readPlanTasks
    c0013 ..> c0139 : type in readDetails
    c0013 ..> c0142 : 4 relationships (see list)
    c0014 --> c0017 : field clock
    c0014 --> c0020 : field preferences
    c0014 --> c0021 : field reader
    c0015 --> c0018 : field failure
    c0015 ..> c0018 : type in constructor
    c0016 ..> c0012 : type in removePlan
    c0016 ..> c0015 : throwIfCancelled() constructs PlanningReadFailure
    c0016 ..> c0018 : type in failureAvailability
    c0016 ..> c0023 : 3 relationships (see list)
    c0019 --> c0018 : field error
    c0019 --> c0132 : field counts
    c0019 --> c0139 : 2 relationships (see list)
    c0021 ..> c0022 : 6 relationships (see list)
    c0021 ..> c0131 : type in capabilities
    c0021 ..> c0134 : type in plan
    c0021 ..> c0135 : type in plans
    c0021 ..> c0136 : type in projects
    c0021 ..> c0137 : type in task
    c0021 ..> c0139 : type in tasks
    c0022 --> c0018 : field error
    c0023 --> c0018 : 2 relationships (see list)
    c0023 --> c0019 : field planTasks
    c0023 --> c0131 : field capability
    c0023 --> c0134 : field planDetail
    c0023 --> c0135 : field plans
    c0023 --> c0136 : field projects
    c0023 --> c0137 : field taskDetail
    c0024 --> c0023 : field state
    c0024 ..> c0023 : type in subscribe
    c0026 ..> c0005 : createPlanningRuntime() constructs ApiPlanningReader
    c0026 ..> c0007 : createPlanningRuntime() constructs LocalPlanningPreferences
    c0026 ..> c0009 : 6 relationships (see list)
    c0026 ..> c0013 : 3 relationships (see list)
    c0026 ..> c0069 : createPlanningRuntime() calls now()
    c0026 ..> c0079 : type in createPlanningRuntime
    c0029 ..> c0027 : type in initialCorrectionCycle
    c0029 ..> c0118 : type in captureFailureReport
    c0029 ..> c0232 : captureFailureReport() calls sanitizeValue()
    c0030 --> c0031 : 2 relationships (see list)
    c0030 --> c0032 : field decisions
    c0030 --> c0033 : field preservation
    c0030 --> c0034 : field previous
    c0030 --> c0094 : field resources
    c0030 --> c0098 : field resources
    c0030 --> c0111 : 2 relationships (see list)
    c0034 --> c0094 : field codeArtifacts
    c0034 --> c0098 : field documents
    c0034 --> c0101 : field entities
    c0034 --> c0111 : field memory
    c0035 ..> c0004 : 2 relationships (see list)
    c0035 ..> c0028 : authorizedMemory() constructs CaptureSelectionError
    c0035 ..> c0030 : 8 relationships (see list)
    c0035 ..> c0031 : type in executeConnection
    c0035 ..> c0032 : 3 relationships (see list)
    c0035 ..> c0033 : type in validateLinkReviews
    c0035 ..> c0034 : type in preparePreviousConnections
    c0035 ..> c0035 : 10 relationships (see list)
    c0035 ..> c0094 : type in readAttachmentRecords
    c0035 ..> c0098 : type in readAttachmentRecords
    c0035 ..> c0108 : 7 relationships (see list)
    c0035 ..> c0111 : 6 relationships (see list)
    c0035 ..> c0126 : 3 relationships (see list)
    c0035 ..> c0166 : 8 relationships (see list)
    c0035 ..> c0169 : 6 relationships (see list)
    c0035 ..> c0210 : executeConnection() calls execute()
    c0035 ..> c0232 : 5 relationships (see list)
    c0035 ..> c0265 : validateLinkDecisions() calls trim()
    c0036 --> c0126 : field scope
    c0038 --|> c0036 : inherits
    c0040 ..> c0028 : 3 relationships (see list)
    c0040 ..> c0036 : 4 relationships (see list)
    c0040 ..> c0037 : 4 relationships (see list)
    c0040 ..> c0038 : type in preserveMergeConnections
    c0040 ..> c0040 : 8 relationships (see list)
    c0040 ..> c0108 : 5 relationships (see list)
    c0040 ..> c0111 : type in collectMergeConnections
    c0040 ..> c0166 : 7 relationships (see list)
    c0040 ..> c0169 : 2 relationships (see list)
    c0040 ..> c0210 : preserveMergeConnections() calls execute()
    c0041 --> c0048 : field candidates
    c0046 --> c0048 : field candidate
    c0046 --> c0061 : field neighborhood
    c0046 --> c0111 : field overlaps
    c0048 --> c0051 : field codeArtifacts
    c0048 --> c0057 : field documents
    c0048 --> c0059 : field entities
    c0048 --> c0066 : field relationships
    c0049 --> c0047 : field excludeBranches
    c0050 --> c0047 : field deferredBranches
    c0051 --|> c0198 : inherits
    c0052 --> c0043 : field action
    c0052 --> c0068 : field reuse
    c0053 --> c0030 : field linkReview
    c0053 --> c0043 : field action
    c0054 --> c0240 : field status
    c0055 --> c0053 : field candidates
    c0055 --> c0247 : field status
    c0056 --> c0054 : field conflicts
    c0056 --> c0055 : field jobs
    c0057 --|> c0199 : inherits
    c0059 --|> c0201 : inherits
    c0060 --> c0037 : field connections
    c0060 --> c0048 : field candidate
    c0060 --> c0111 : field memories
    c0061 --> c0094 : field codeArtifacts
    c0061 --> c0098 : field documents
    c0061 --> c0101 : field entities
    c0061 --> c0103 : field relationships
    c0062 --> c0071 : field uncertainWrite
    c0062 --> c0252 : field supersession
    c0063 --|> c0122 : inherits
    c0064 --|> c0240 : inherits
    c0066 --|> c0203 : inherits
    c0067 --> c0240 : field conflict
    c0069 ..> c0004 : activity() calls set()
    c0069 ..> c0009 : 2 relationships (see list)
    c0069 ..> c0028 : 9 relationships (see list)
    c0069 ..> c0029 : 13 relationships (see list)
    c0069 ..> c0030 : 5 relationships (see list)
    c0069 ..> c0035 : 4 relationships (see list)
    c0069 ..> c0040 : 6 relationships (see list)
    c0069 --> c0044 : field activityPhase
    c0069 ..> c0044 : type in activity
    c0069 ..> c0045 : 2 relationships (see list)
    c0069 ..> c0046 : type in prepareOverlapBatch
    c0069 ..> c0047 : 3 relationships (see list)
    c0069 ..> c0048 : 42 relationships (see list)
    c0069 ..> c0049 : 3 relationships (see list)
    c0069 ..> c0050 : 13 relationships (see list)
    c0069 ..> c0052 : 13 relationships (see list)
    c0069 ..> c0056 : type in diagnostics
    c0069 ..> c0058 : 2 relationships (see list)
    c0069 ..> c0060 : 3 relationships (see list)
    c0069 ..> c0061 : 2 relationships (see list)
    c0069 ..> c0063 : 13 relationships (see list)
    c0069 ..> c0064 : 2 relationships (see list)
    c0069 ..> c0065 : ensureModelCallAllowed() constructs CaptureProgress
    c0069 ..> c0067 : 6 relationships (see list)
    c0069 ..> c0069 : 215 relationships (see list)
    c0069 --> c0070 : field onActivity
    c0069 ..> c0070 : type in constructor
    c0069 ..> c0071 : 9 relationships (see list)
    c0069 ..> c0072 : 3 relationships (see list)
    c0069 ..> c0073 : 2 relationships (see list)
    c0069 ..> c0074 : 4 relationships (see list)
    c0069 ..> c0075 : resolveDestination() constructs MissingCaptureDestination
    c0069 ..> c0076 : 6 relationships (see list)
    c0069 ..> c0077 : 107 relationships (see list)
    c0069 --> c0092 : field getMode
    c0069 ..> c0092 : 3 relationships (see list)
    c0069 ..> c0093 : 7 relationships (see list)
    c0069 ..> c0101 : 4 relationships (see list)
    c0069 ..> c0103 : type in neighborhoodRelationships
    c0069 --> c0108 : field client
    c0069 ..> c0108 : type in cancellableClient
    c0069 ..> c0109 : type in cancellableKnowledge
    c0069 --> c0111 : field readSavedMemory
    c0069 ..> c0111 : 15 relationships (see list)
    c0069 ..> c0112 : type in createMemory
    c0069 --> c0114 : field model
    c0069 ..> c0116 : evidenceReadTool() constructs ModelEvidencePage
    c0069 ..> c0117 : sourceInspectionTool() constructs ModelReadErrorResult
    c0069 ..> c0118 : 2 relationships (see list)
    c0069 ..> c0129 : 4 relationships (see list)
    c0069 ..> c0166 : 35 relationships (see list)
    c0069 ..> c0169 : 32 relationships (see list)
    c0069 --> c0210 : field knowledgeWriter
    c0069 ..> c0210 : 2 relationships (see list)
    c0069 --> c0214 : field logger
    c0069 ..> c0216 : 14 relationships (see list)
    c0069 ..> c0217 : 12 relationships (see list)
    c0069 ..> c0218 : 4 relationships (see list)
    c0069 ..> c0222 : loadCandidates() calls prepareCapture()
    c0069 ..> c0232 : 23 relationships (see list)
    c0069 --> c0236 : field queue
    c0069 ..> c0236 : 70 relationships (see list)
    c0069 ..> c0240 : 13 relationships (see list)
    c0069 --> c0244 : field identity
    c0069 ..> c0245 : 57 relationships (see list)
    c0069 ..> c0252 : type in recordSupersession
    c0069 ..> c0265 : 3 relationships (see list)
    c0069 ..> c0274 : 8 relationships (see list)
    c0069 ..> c0278 : 2 relationships (see list)
    c0070 --> c0044 : field onActivity
    c0070 --> c0092 : field getMode
    c0070 --> c0108 : field client
    c0070 --> c0114 : field model
    c0070 --> c0214 : field logger
    c0070 --> c0236 : field queue
    c0071 --|> c0063 : inherits
    c0072 --> c0106 : field selectedAdditionalEntries
    c0073 --> c0048 : field candidate
    c0073 --> c0111 : field oldMemory
    c0073 --> c0245 : field fakeJob
    c0075 --|> c0028 : inherits
    c0075 ..> c0048 : type in constructor
    c0076 --> c0106 : field additionalEntries
    c0077 ..> c0041 : type in parseCandidates
    c0077 ..> c0042 : 3 relationships (see list)
    c0077 ..> c0048 : 7 relationships (see list)
    c0077 ..> c0052 : 6 relationships (see list)
    c0077 ..> c0060 : type in reusableMergeComposition
    c0077 ..> c0072 : type in conflictResolutionEvidence
    c0077 ..> c0074 : 11 relationships (see list)
    c0077 ..> c0077 : 36 relationships (see list)
    c0077 ..> c0093 : 8 relationships (see list)
    c0077 ..> c0106 : 3 relationships (see list)
    c0077 ..> c0111 : type in captureKnowledgePlan
    c0077 ..> c0113 : type in memoryInput
    c0077 ..> c0121 : type in captureCandidateSubmission
    c0077 ..> c0129 : 4 relationships (see list)
    c0077 ..> c0169 : 2 relationships (see list)
    c0077 ..> c0206 : type in captureKnowledgePlan
    c0077 ..> c0232 : 10 relationships (see list)
    c0077 ..> c0265 : 7 relationships (see list)
    c0077 ..> c0274 : snapshotForPersistence() calls sanitizeCaptureSnapshot()
    c0077 ..> c0278 : errorMessage() calls inspect()
    c0079 --> c0080 : field instance
    c0079 --> c0083 : field model
    c0079 --> c0087 : field prompts
    c0079 --> c0088 : field scopeSource
    c0079 --> c0089 : field verbosity
    c0079 --> c0092 : field captureMode
    c0079 --> c0126 : field scope
    c0079 --> c0215 : field logging
    c0090 ..> c0009 : 2 relationships (see list)
    c0090 ..> c0069 : resolveLogDirectory() calls resolve()
    c0090 ..> c0079 : type in loadForgetfulConfig
    c0090 ..> c0081 : 2 relationships (see list)
    c0090 ..> c0082 : type in loadForgetfulConfig
    c0090 ..> c0083 : 2 relationships (see list)
    c0090 ..> c0085 : 2 relationships (see list)
    c0090 ..> c0087 : 2 relationships (see list)
    c0090 ..> c0088 : type in resolveScope
    c0090 ..> c0089 : 2 relationships (see list)
    c0090 ..> c0090 : 33 relationships (see list)
    c0090 ..> c0092 : type in resolveCaptureMode
    c0090 ..> c0126 : 2 relationships (see list)
    c0090 ..> c0196 : 2 relationships (see list)
    c0090 ..> c0215 : type in isFileLogLevel
    c0090 ..> c0216 : writeJson() calls close()
    c0090 ..> c0265 : 4 relationships (see list)
    c0093 --> c0091 : field historySummary
    c0093 --> c0092 : field mode
    c0093 --> c0106 : field entries
    c0093 --> c0126 : field scope
    c0093 --> c0129 : field context
    c0094 --|> c0095 : inherits
    c0095 --|> c0125 : inherits
    c0098 --|> c0099 : inherits
    c0099 --|> c0125 : inherits
    c0101 --|> c0102 : inherits
    c0102 --> c0105 : field entity_type
    c0102 --|> c0125 : inherits
    c0103 --|> c0104 : inherits
    c0104 --|> c0125 : inherits
    c0108 --> c0109 : field knowledge
    c0108 ..> c0111 : 2 relationships (see list)
    c0108 ..> c0112 : type in create
    c0108 ..> c0113 : type in create
    c0108 ..> c0115 : type in queryMemory
    c0108 ..> c0123 : 3 relationships (see list)
    c0108 ..> c0124 : type in createProject
    c0108 ..> c0127 : 2 relationships (see list)
    c0109 ..> c0094 : 3 relationships (see list)
    c0109 ..> c0095 : 2 relationships (see list)
    c0109 ..> c0096 : type in listCodeArtifacts
    c0109 ..> c0098 : 3 relationships (see list)
    c0109 ..> c0099 : 2 relationships (see list)
    c0109 ..> c0100 : type in listDocuments
    c0109 ..> c0101 : 4 relationships (see list)
    c0109 ..> c0102 : 2 relationships (see list)
    c0109 ..> c0103 : 2 relationships (see list)
    c0109 ..> c0104 : type in createRelationship
    c0109 ..> c0107 : type in listFiles
    c0109 ..> c0111 : type in updateMemory
    c0109 ..> c0113 : type in updateMemory
    c0109 ..> c0128 : type in getFile
    c0110 --> c0111 : field memory
    c0111 --|> c0113 : inherits
    c0114 ..> c0119 : 2 relationships (see list)
    c0115 --> c0110 : field linked_memories
    c0115 --> c0111 : field primary_memories
    c0119 --> c0097 : field onConversationCompacted
    c0119 --> c0118 : field readTools
    c0119 --> c0121 : field submission
    c0128 --|> c0107 : inherits
    c0129 --> c0123 : field project
    c0134 --|> c0135 : inherits
    c0135 --> c0130 : field status
    c0137 --> c0133 : field criteria
    c0137 --|> c0138 : inherits
    c0138 --> c0140 : field priority
    c0138 --> c0141 : field state
    c0139 --|> c0138 : inherits
    c0142 ..> c0132 : type in taskCounts
    c0142 ..> c0135 : type in sortPlans
    c0142 ..> c0136 : type in mappedProject
    c0142 ..> c0139 : 2 relationships (see list)
    c0146 --> c0143 : field outcome
    c0146 --> c0147 : field state
    c0148 ..> c0049 : type in checkpoint
    c0148 ..> c0050 : type in checkpoint
    c0148 ..> c0093 : type in enqueue
    c0148 ..> c0106 : type in resolveConflict
    c0151 --> c0123 : field projects
    c0151 --|> c0129 : inherits
    c0152 --> c0079 : 2 relationships (see list)
    c0152 --> c0108 : 4 relationships (see list)
    c0152 --> c0148 : 2 relationships (see list)
    c0152 --> c0151 : field resolveWorkContext
    c0152 --> c0160 : 2 relationships (see list)
    c0152 --> c0228 : 2 relationships (see list)
    c0153 --> c0082 : field config
    c0153 --> c0152 : field dependencies
    c0153 --> c0155 : field policies
    c0156 --> c0079 : field config
    c0156 --> c0108 : field client
    c0156 --> c0151 : field context
    c0156 --> c0160 : field recall
    c0156 --> c0216 : field logger
    c0156 --> c0228 : field model
    c0157 --> c0126 : field scope
    c0159 --> c0161 : field runtime
    c0159 --> c0259 : 2 relationships (see list)
    c0160 ..> c0106 : type in recall
    c0160 ..> c0256 : type in deeper
    c0160 ..> c0258 : type in recall
    c0160 ..> c0259 : 2 relationships (see list)
    c0161 --> c0004 : field activity
    c0161 --> c0025 : field planning
    c0161 --> c0047 : field captureDeferrals
    c0161 --> c0050 : field recoveryResult
    c0161 --> c0079 : field config
    c0161 --> c0108 : field client
    c0161 --> c0147 : field pendingCaptureJobs
    c0161 --> c0148 : field capture
    c0161 --> c0151 : field context
    c0161 --> c0157 : field lastRecall
    c0161 --> c0160 : field recall
    c0161 --> c0216 : field logger
    c0161 --> c0228 : field model
    c0161 --> c0236 : field queue
    c0163 --> c0144 : field automaticRecalls
    c0163 --> c0154 : field pendingQueuedRecall
    c0163 --> c0159 : field recallJobs
    c0163 --> c0161 : 2 relationships (see list)
    c0164 ..> c0004 : 3 relationships (see list)
    c0164 ..> c0009 : createForgetfulExtension() calls setPromptActive()
    c0164 ..> c0050 : 2 relationships (see list)
    c0164 ..> c0069 : 5 relationships (see list)
    c0164 ..> c0079 : 5 relationships (see list)
    c0164 ..> c0083 : type in parseSelection
    c0164 ..> c0089 : type in log
    c0164 ..> c0106 : type in recallContextEntries
    c0164 ..> c0143 : 3 relationships (see list)
    c0164 ..> c0145 : type in boundedWait
    c0164 ..> c0146 : 3 relationships (see list)
    c0164 ..> c0148 : type in readCaptureOutcome
    c0164 ..> c0150 : type in collectDiagnosticParts
    c0164 ..> c0151 : 3 relationships (see list)
    c0164 ..> c0153 : type in createForgetfulExtension
    c0164 ..> c0155 : type in policyText
    c0164 ..> c0157 : type in recallActivitySummary
    c0164 ..> c0161 : 3 relationships (see list)
    c0164 ..> c0162 : type in promptSetupAuthentication
    c0164 ..> c0164 : 34 relationships (see list)
    c0164 ..> c0165 : createForgetfulExtension() calls registerForegroundTool()
    c0164 ..> c0169 : 4 relationships (see list)
    c0164 ..> c0231 : 3 relationships (see list)
    c0164 ..> c0232 : 13 relationships (see list)
    c0164 ..> c0259 : 5 relationships (see list)
    c0164 ..> c0265 : 8 relationships (see list)
    c0164 ..> c0266 : qualifiedRepository() calls repositoryName()
    c0166 ..> c0094 : 2 relationships (see list)
    c0166 ..> c0095 : 2 relationships (see list)
    c0166 ..> c0096 : type in listCodeArtifacts
    c0166 ..> c0098 : 2 relationships (see list)
    c0166 ..> c0099 : 2 relationships (see list)
    c0166 ..> c0100 : type in listDocuments
    c0166 ..> c0101 : 3 relationships (see list)
    c0166 ..> c0102 : 2 relationships (see list)
    c0166 ..> c0103 : type in getRelationships
    c0166 ..> c0104 : type in createRelationship
    c0166 ..> c0107 : type in listFiles
    c0166 ..|> c0109 : implements
    c0166 --> c0111 : field parseMemory
    c0166 ..> c0111 : type in constructor
    c0166 ..> c0113 : type in updateMemory
    c0166 ..> c0128 : type in getFile
    c0166 --> c0167 : field request
    c0166 ..> c0167 : type in constructor
    c0166 ..> c0168 : 45 relationships (see list)
    c0166 ..> c0173 : 21 relationships (see list)
    c0166 ..> c0174 : 4 relationships (see list)
    c0166 ..> c0176 : 2 relationships (see list)
    c0168 ..> c0094 : type in artifact
    c0168 ..> c0095 : type in resourceBody
    c0168 ..> c0096 : type in summary
    c0168 ..> c0098 : type in document
    c0168 ..> c0099 : type in resourceBody
    c0168 ..> c0100 : type in summary
    c0168 ..> c0101 : type in entity
    c0168 ..> c0102 : type in entityBody
    c0168 ..> c0103 : type in relationship
    c0168 ..> c0104 : type in relationshipBody
    c0168 ..> c0107 : type in fileSummary
    c0168 ..> c0125 : type in provenance
    c0168 ..> c0168 : 40 relationships (see list)
    c0168 ..> c0174 : 8 relationships (see list)
    c0168 ..> c0265 : text() calls trim()
    c0169 ..> c0004 : listProjects() calls set()
    c0169 ..|> c0108 : implements
    c0169 ..> c0111 : 2 relationships (see list)
    c0169 ..> c0112 : type in create
    c0169 ..> c0113 : type in create
    c0169 ..> c0115 : type in queryMemory
    c0169 ..> c0123 : 3 relationships (see list)
    c0169 ..> c0124 : type in createProject
    c0169 ..> c0127 : 2 relationships (see list)
    c0169 ..> c0168 : 3 relationships (see list)
    c0169 ..> c0169 : 2 relationships (see list)
    c0169 --|> c0173 : inherits
    c0169 ..> c0173 : 10 relationships (see list)
    c0169 ..> c0174 : 4 relationships (see list)
    c0169 ..> c0176 : 18 relationships (see list)
    c0169 ..> c0266 : 2 relationships (see list)
    c0173 ..> c0004 : readResponse() calls set()
    c0173 ..> c0005 : readResponse() calls read()
    c0173 ..> c0169 : readResponse() calls get()
    c0173 ..> c0170 : type in constructor
    c0173 ..> c0172 : throwResponseError() constructs ForgetfulHttpError
    c0173 ..> c0173 : 8 relationships (see list)
    c0173 ..> c0174 : readResponse() constructs ForgetfulSchemaError
    c0173 ..> c0175 : request() constructs ForgetfulTimeoutError
    c0173 ..> c0176 : 4 relationships (see list)
    c0173 ..> c0236 : readResponse() calls cancel()
    c0176 ..> c0004 : uniqueMemories() calls set()
    c0176 ..> c0110 : type in parseLinkedMemories
    c0176 ..> c0111 : 3 relationships (see list)
    c0176 ..> c0115 : 2 relationships (see list)
    c0176 ..> c0123 : type in parseProject
    c0176 ..> c0127 : type in searchBody
    c0176 ..> c0168 : parseMemory() calls memoryMetadata()
    c0176 ..> c0171 : 2 relationships (see list)
    c0176 ..> c0174 : 12 relationships (see list)
    c0176 ..> c0176 : 23 relationships (see list)
    c0176 ..> c0265 : projectText() calls trim()
    c0177 --> c0094 : field artifacts
    c0177 --> c0098 : field documents
    c0177 --> c0107 : field files
    c0178 --|> c0179 : inherits
    c0178 --> c0180 : field failures
    c0179 --> c0111 : field memories
    c0179 --> c0126 : field scope
    c0181 ..> c0004 : 3 relationships (see list)
    c0181 ..> c0094 : type in appendArtifactLines
    c0181 ..> c0098 : type in appendDocumentLines
    c0181 ..> c0101 : 9 relationships (see list)
    c0181 ..> c0103 : 3 relationships (see list)
    c0181 ..> c0107 : type in appendFileLines
    c0181 --> c0109 : field client
    c0181 ..> c0109 : type in constructor
    c0181 ..> c0166 : 8 relationships (see list)
    c0181 ..> c0169 : formatRelationships() calls get()
    c0181 ..> c0177 : 2 relationships (see list)
    c0181 ..> c0178 : 8 relationships (see list)
    c0181 ..> c0179 : 2 relationships (see list)
    c0181 ..> c0180 : 3 relationships (see list)
    c0181 ..> c0181 : 17 relationships (see list)
    c0181 ..> c0182 : type in constructor
    c0181 ..> c0183 : 4 relationships (see list)
    c0181 --> c0184 : field readMemory
    c0181 ..> c0184 : type in constructor
    c0181 ..> c0185 : 4 relationships (see list)
    c0181 ..> c0186 : 22 relationships (see list)
    c0181 ..> c0232 : expand() calls errorMessage()
    c0181 ..> c0265 : findEntities() calls trim()
    c0182 --> c0184 : field readMemory
    c0183 --> c0101 : field entity
    c0185 --> c0101 : 2 relationships (see list)
    c0185 --> c0103 : field relationship
    c0186 ..> c0101 : 2 relationships (see list)
    c0186 ..> c0103 : type in validRelationship
    c0186 ..> c0111 : type in validMemory
    c0186 ..> c0126 : 2 relationships (see list)
    c0186 ..> c0178 : type in safeCall
    c0186 ..> c0186 : 5 relationships (see list)
    c0186 ..> c0232 : 3 relationships (see list)
    c0186 ..> c0265 : validRelationship() calls trim()
    c0187 --> c0108 : field client
    c0187 --> c0109 : field knowledge
    c0187 --> c0188 : field request
    c0187 --> c0189 : field context
    c0189 --> c0126 : field scope
    c0190 --> c0128 : field file
    c0190 --> c0194 : field content
    c0190 --> c0195 : field content
    c0191 --> c0108 : field client
    c0191 --> c0109 : field knowledge
    c0191 --> c0189 : field context
    c0191 --> c0192 : field request
    c0196 ..> c0094 : type in page
    c0196 ..> c0098 : type in page
    c0196 ..> c0101 : 4 relationships (see list)
    c0196 ..> c0105 : type in isEntityType
    c0196 ..> c0108 : 7 relationships (see list)
    c0196 ..> c0109 : 9 relationships (see list)
    c0196 ..> c0111 : 4 relationships (see list)
    c0196 ..> c0125 : type in updateProvenance
    c0196 ..> c0128 : type in fileContent
    c0196 ..> c0166 : 28 relationships (see list)
    c0196 ..> c0169 : 10 relationships (see list)
    c0196 ..> c0187 : 15 relationships (see list)
    c0196 ..> c0188 : 2 relationships (see list)
    c0196 ..> c0189 : 13 relationships (see list)
    c0196 ..> c0190 : 29 relationships (see list)
    c0196 ..> c0191 : 9 relationships (see list)
    c0196 ..> c0192 : 2 relationships (see list)
    c0196 ..> c0193 : type in resolveWriteProject
    c0196 ..> c0194 : type in fileContent
    c0196 ..> c0195 : type in fileContent
    c0196 ..> c0196 : 176 relationships (see list)
    c0196 ..> c0218 : replacementMemory() calls replacementMemoryContext()
    c0196 ..> c0232 : containsSensitiveData() calls hasSensitiveData()
    c0196 ..> c0265 : 2 relationships (see list)
    c0198 --> c0095 : field input
    c0199 --> c0099 : field input
    c0201 --> c0102 : field input
    c0203 --> c0104 : field input
    c0206 --> c0198 : field codeArtifacts
    c0206 --> c0199 : field documents
    c0206 --> c0200 : field entityMemoryLinks
    c0206 --> c0201 : field entities
    c0206 --> c0203 : field relationships
    c0209 --> c0207 : 4 relationships (see list)
    c0210 ..> c0094 : type in writeCodeArtifact
    c0210 ..> c0098 : type in writeDocument
    c0210 ..> c0101 : type in writeEntity
    c0210 ..> c0103 : type in writeRelationship
    c0210 ..> c0111 : 3 relationships (see list)
    c0210 ..> c0166 : 10 relationships (see list)
    c0210 ..> c0169 : createOnce() calls create()
    c0210 ..> c0181 : attachmentMemory() calls readMemory()
    c0210 ..> c0197 : 4 relationships (see list)
    c0210 ..> c0198 : type in writeCodeArtifact
    c0210 ..> c0199 : type in writeDocument
    c0210 ..> c0200 : type in writeEntityMemoryLink
    c0210 ..> c0201 : type in writeEntity
    c0210 --> c0202 : field readMemory
    c0210 ..> c0202 : type in constructor
    c0210 ..> c0203 : type in writeRelationship
    c0210 ..> c0204 : type in execute
    c0210 ..> c0205 : 16 relationships (see list)
    c0210 ..> c0206 : 18 relationships (see list)
    c0210 ..> c0208 : 16 relationships (see list)
    c0210 ..> c0209 : 18 relationships (see list)
    c0210 ..> c0210 : 27 relationships (see list)
    c0210 ..> c0211 : 4 relationships (see list)
    c0210 --> c0212 : field client
    c0210 ..> c0212 : type in constructor
    c0210 ..> c0213 : 30 relationships (see list)
    c0210 ..> c0232 : 2 relationships (see list)
    c0210 ..> c0278 : 2 relationships (see list)
    c0213 ..> c0004 : resourceSlots() calls set()
    c0213 ..> c0169 : resourceSlots() calls get()
    c0213 ..> c0206 : type in instructionId
    c0213 ..> c0207 : 4 relationships (see list)
    c0213 ..> c0209 : 2 relationships (see list)
    c0213 ..> c0211 : type in resourceSlots
    c0213 ..> c0213 : 6 relationships (see list)
    c0216 ..> c0069 : 2 relationships (see list)
    c0216 ..|> c0214 : implements
    c0216 --> c0215 : 2 relationships (see list)
    c0216 ..> c0215 : 2 relationships (see list)
    c0216 ..> c0216 : 12 relationships (see list)
    c0216 ..> c0217 : 6 relationships (see list)
    c0216 ..> c0232 : enqueue() calls sanitizeValue()
    c0217 ..> c0013 : pruneDirectory() calls current()
    c0217 ..> c0217 : 2 relationships (see list)
    c0218 ..> c0113 : type in replacementMemoryInput
    c0218 ..> c0218 : replacementMemoryInput() calls replacementMemoryContext()
    c0218 ..> c0232 : storedMemoryContext() calls sanitizeText()
    c0221 --> c0223 : field complete
    c0222 ..> c0069 : applySummary() calls now()
    c0222 --> c0219 : field compactedHistory
    c0222 ..> c0219 : 5 relationships (see list)
    c0222 ..> c0222 : 6 relationships (see list)
    c0222 ..> c0223 : 3 relationships (see list)
    c0222 ..> c0224 : 9 relationships (see list)
    c0222 ..> c0265 : applySummary() calls trim()
    c0224 ..> c0069 : summarizeMemoryHistory() calls now()
    c0224 ..> c0116 : type in evidencePageContent
    c0224 ..> c0220 : 2 relationships (see list)
    c0224 ..> c0221 : type in summarizeMemoryHistory
    c0224 ..> c0224 : 19 relationships (see list)
    c0224 ..> c0228 : summarizeMemoryHistory() calls complete()
    c0224 ..> c0232 : 2 relationships (see list)
    c0226 --> c0227 : field modelRegistry
    c0228 ..> c0069 : 6 relationships (see list)
    c0228 ..> c0078 : completeWithSubmission() calls mapConcurrent()
    c0228 --> c0083 : field selection
    c0228 ..> c0083 : type in constructor
    c0228 ..> c0090 : completeRequest() calls isRecallConcurrency()
    c0228 ..|> c0114 : implements
    c0228 ..> c0118 : type in executeRead
    c0228 ..> c0119 : 7 relationships (see list)
    c0228 ..> c0120 : completeWithSubmission() constructs ModelSubmissionError
    c0228 ..> c0121 : type in validateSubmission
    c0228 ..> c0210 : executeRead() calls execute()
    c0228 --> c0214 : field logger
    c0228 ..> c0216 : 6 relationships (see list)
    c0228 ..> c0222 : 3 relationships (see list)
    c0228 ..> c0224 : 2 relationships (see list)
    c0228 --> c0225 : field transformHeaders
    c0228 --> c0227 : field registry
    c0228 ..> c0227 : type in constructor
    c0228 ..> c0228 : 7 relationships (see list)
    c0228 ..> c0229 : type in constructor
    c0228 ..> c0230 : 3 relationships (see list)
    c0228 ..> c0231 : 24 relationships (see list)
    c0228 ..> c0232 : 2 relationships (see list)
    c0229 --> c0214 : field logger
    c0229 --> c0225 : field transformHeaders
    c0231 ..> c0069 : 2 relationships (see list)
    c0231 ..> c0083 : 3 relationships (see list)
    c0231 ..> c0118 : type in submissionTool
    c0231 ..> c0119 : 4 relationships (see list)
    c0231 ..> c0121 : type in submissionTool
    c0231 ..> c0225 : type in requestOptions
    c0231 ..> c0226 : type in availableMemoryModels
    c0231 ..> c0227 : type in resolveMemoryModel
    c0231 ..> c0228 : 3 relationships (see list)
    c0231 ..> c0229 : type in resolveMemoryModel
    c0231 ..> c0230 : type in requestDeadline
    c0231 ..> c0231 : 7 relationships (see list)
    c0231 ..> c0232 : 8 relationships (see list)
    c0232 ..> c0232 : 4 relationships (see list)
    c0232 ..> c0278 : diagnosticMessage() calls inspect()
    c0235 ..> c0108 : 3 relationships (see list)
    c0235 ..> c0123 : 4 relationships (see list)
    c0235 ..> c0124 : 2 relationships (see list)
    c0235 ..> c0164 : promptExistingProject() calls notify()
    c0235 ..> c0169 : 7 relationships (see list)
    c0235 ..> c0232 : 2 relationships (see list)
    c0235 ..> c0233 : 2 relationships (see list)
    c0235 ..> c0234 : 6 relationships (see list)
    c0235 ..> c0235 : 5 relationships (see list)
    c0235 ..> c0265 : 3 relationships (see list)
    c0236 ..> c0004 : mutate() calls set()
    c0236 ..> c0009 : 9 relationships (see list)
    c0236 ..> c0093 : 4 relationships (see list)
    c0236 ..> c0097 : type in compactJobSnapshot
    c0236 ..> c0106 : type in appendInspections
    c0236 ..> c0123 : type in completeProjectDiscovery
    c0236 ..> c0129 : 2 relationships (see list)
    c0236 ..> c0169 : 2 relationships (see list)
    c0236 ..> c0196 : 4 relationships (see list)
    c0236 ..> c0232 : 2 relationships (see list)
    c0236 ..> c0236 : 97 relationships (see list)
    c0236 ..> c0237 : type in constructor
    c0236 ..> c0238 : 2 relationships (see list)
    c0236 ..> c0240 : 5 relationships (see list)
    c0236 ..> c0241 : 3 relationships (see list)
    c0236 ..> c0242 : 2 relationships (see list)
    c0236 ..> c0243 : 2 relationships (see list)
    c0236 ..> c0244 : 9 relationships (see list)
    c0236 ..> c0245 : 11 relationships (see list)
    c0236 ..> c0246 : type in listJobMetadata
    c0236 ..> c0248 : 9 relationships (see list)
    c0236 ..> c0249 : 5 relationships (see list)
    c0236 ..> c0250 : 3 relationships (see list)
    c0236 ..> c0251 : 6 relationships (see list)
    c0236 ..> c0253 : 2 relationships (see list)
    c0236 ..> c0254 : 70 relationships (see list)
    c0236 ..> c0265 : reusableHistory() calls trim()
    c0236 ..> c0274 : 5 relationships (see list)
    c0240 --> c0106 : field replacement
    c0240 --> c0113 : field replacement
    c0240 --> c0129 : field context
    c0240 --> c0244 : field binding
    c0240 --> c0252 : field supersession
    c0242 --> c0097 : field compactedConversation
    c0242 --> c0106 : field inspectionEntries
    c0242 --> c0247 : field status
    c0242 --> c0252 : field supersession
    c0245 --> c0093 : field snapshot
    c0245 --> c0244 : field binding
    c0245 --> c0247 : field status
    c0245 --> c0252 : field supersession
    c0246 --> c0093 : field snapshot
    c0248 --> c0240 : field conflicts
    c0248 --> c0249 : field watermarks
    c0248 --> c0251 : field jobs
    c0249 --> c0239 : field historyAlternatives
    c0251 --|> c0245 : inherits
    c0254 ..> c0093 : 3 relationships (see list)
    c0254 ..> c0106 : type in validateInspectionEntry
    c0254 ..> c0169 : releaseCompletedArtifacts() calls get()
    c0254 ..> c0232 : scrubDiagnostic() calls sanitizeText()
    c0254 ..> c0236 : nowIso() calls now()
    c0254 ..> c0239 : 2 relationships (see list)
    c0254 ..> c0240 : type in conflictIdentityMatches
    c0254 ..> c0244 : 2 relationships (see list)
    c0254 ..> c0245 : 2 relationships (see list)
    c0254 ..> c0248 : type in normaliseState
    c0254 ..> c0249 : 3 relationships (see list)
    c0254 ..> c0251 : type in releaseCompletedArtifacts
    c0254 ..> c0254 : 6 relationships (see list)
    c0256 --> c0123 : field projects
    c0256 --> c0126 : field scope
    c0256 --> c0129 : field context
    c0258 --> c0106 : field sessionContext
    c0258 --> c0119 : field diagnosticContext
    c0258 --> c0123 : field projects
    c0258 --> c0126 : field scope
    c0258 --> c0129 : field context
    c0258 --> c0257 : field onPlan
    c0259 --> c0126 : field scope
    c0260 ..> c0013 : resultWithKnowledge() calls visible()
    c0260 ..> c0078 : searchMemories() calls mapConcurrent()
    c0260 ..> c0090 : 3 relationships (see list)
    c0260 --> c0108 : field client
    c0260 ..> c0108 : type in constructor
    c0260 ..> c0111 : 2 relationships (see list)
    c0260 --> c0114 : field model
    c0260 ..> c0114 : type in constructor
    c0260 ..> c0118 : type in recallReadTool
    c0260 ..> c0123 : 2 relationships (see list)
    c0260 ..> c0126 : 7 relationships (see list)
    c0260 ..> c0127 : type in searchRequest
    c0260 ..> c0129 : 3 relationships (see list)
    c0260 ..> c0169 : 3 relationships (see list)
    c0260 ..> c0180 : 2 relationships (see list)
    c0260 --> c0181 : field knowledge
    c0260 ..> c0181 : 2 relationships (see list)
    c0260 ..> c0196 : recallReadTool() calls executeKnowledgeRead()
    c0260 ..> c0228 : recall() calls complete()
    c0260 ..> c0232 : 9 relationships (see list)
    c0260 ..> c0255 : 4 relationships (see list)
    c0260 ..> c0256 : type in deeper
    c0260 ..> c0257 : 5 relationships (see list)
    c0260 ..> c0258 : 7 relationships (see list)
    c0260 ..> c0259 : 7 relationships (see list)
    c0260 ..> c0260 : 34 relationships (see list)
    c0260 ..> c0261 : type in constructor
    c0260 ..> c0262 : finishReview() constructs ReviewValidationError
    c0260 ..> c0263 : 6 relationships (see list)
    c0260 ..> c0264 : type in searchMemories
    c0260 ..> c0265 : 35 relationships (see list)
    c0263 --> c0123 : field project
    c0264 --> c0111 : field memories
    c0265 ..> c0004 : availableProjects() calls set()
    c0265 ..> c0111 : 2 relationships (see list)
    c0265 ..> c0121 : type in recallReviewSubmission
    c0265 ..> c0123 : type in availableProjects
    c0265 ..> c0129 : 3 relationships (see list)
    c0265 ..> c0180 : type in formatRecall
    c0265 ..> c0232 : 11 relationships (see list)
    c0265 ..> c0255 : 2 relationships (see list)
    c0265 ..> c0257 : type in parsePlan
    c0265 ..> c0259 : 4 relationships (see list)
    c0265 ..> c0260 : createDeadlineSignal() calls now()
    c0265 ..> c0265 : 26 relationships (see list)
    c0266 ..> c0265 : repositoryName() calls trim()
    c0268 ..> c0267 : 2 relationships (see list)
    c0269 --|> c0093 : inherits
    c0271 --> c0092 : field mode
    c0271 --> c0126 : field scope
    c0271 --> c0129 : field context
    c0271 --> c0273 : field session
    c0272 --> c0269 : field snapshot
    c0274 ..> c0091 : 2 relationships (see list)
    c0274 ..> c0093 : 4 relationships (see list)
    c0274 ..> c0097 : type in compactCaptureSnapshot
    c0274 ..> c0106 : 3 relationships (see list)
    c0274 ..> c0232 : 9 relationships (see list)
    c0274 ..> c0265 : 2 relationships (see list)
    c0274 ..> c0270 : 3 relationships (see list)
    c0274 ..> c0271 : 3 relationships (see list)
    c0274 ..> c0272 : type in buildCaptureSnapshot
    c0274 ..> c0274 : 27 relationships (see list)
    c0277 --> c0275 : 2 relationships (see list)
    c0278 ..> c0004 : readFile() calls close()
    c0278 ..> c0009 : readFile() calls open()
    c0278 ..> c0069 : 3 relationships (see list)
    c0278 ..> c0169 : getUrl() calls get()
    c0278 ..> c0196 : readFile() calls readFile()
    c0278 ..> c0210 : git() calls execute()
    c0278 ..> c0232 : 3 relationships (see list)
    c0278 ..> c0265 : provenance() calls trim()
    c0278 ..> c0276 : type in inspectUrl
    c0278 ..> c0277 : 2 relationships (see list)
    c0278 ..> c0278 : 10 relationships (see list)
    c0278 --> c0279 : field options
    c0278 ..> c0279 : type in constructor
    c0278 ..> c0280 : 11 relationships (see list)
    c0280 ..> c0232 : 4 relationships (see list)
    c0280 ..> c0275 : type in errorDetails
    c0280 ..> c0276 : type in sourceContent
    c0280 ..> c0278 : validateAddress() calls check()
    c0280 ..> c0280 : validateAddress() calls loopback()
```

## Source index

- c0000: `index.ts` — `index.ts`:1
- c0003: `ActivityLoader` — `src/activity.ts`:6
- c0004: `ForgetfulActivity` — `src/activity.ts`:35
- c0005: `ApiPlanningReader` — `src/adapters/forgetful/planning.ts`:67
- c0006: `src/adapters/forgetful/planning.ts` — `src/adapters/forgetful/planning.ts`:1
- c0007: `LocalPlanningPreferences` — `src/adapters/local/planning-settings.ts`:5
- c0008: `BrowserView` — `src/adapters/pi/planning.ts`:117
- c0009: `PiPlanningView` — `src/adapters/pi/planning.ts`:323
- c0010: `PlanBrowser` — `src/adapters/pi/planning.ts`:120
- c0011: `src/adapters/pi/planning.ts` — `src/adapters/pi/planning.ts`:1
- c0012: `Overview` — `src/application/planning.ts`:40
- c0013: `PlanningController` — `src/application/planning.ts`:70
- c0014: `PlanningControllerOptions` — `src/application/planning.ts`:59
- c0015: `PlanningReadFailure` — `src/application/planning.ts`:11
- c0016: `src/application/planning.ts` — `src/application/planning.ts`:1
- c0017: `PlanningClock` — `src/application/ports/planning.ts`:32
- c0018: `PlanningError` — `src/application/ports/planning.ts`:6
- c0019: `PlanningPlanTasks` — `src/application/ports/planning.ts`:37
- c0020: `PlanningPreferences` — `src/application/ports/planning.ts`:27
- c0021: `PlanningReader` — `src/application/ports/planning.ts`:16
- c0022: `PlanningResult` — `src/application/ports/planning.ts`:13
- c0023: `PlanningState` — `src/application/ports/planning.ts`:45
- c0024: `PlanningWorkflow` — `src/application/ports/planning.ts`:72
- c0025: `PlanningRuntime` — `src/bootstrap/planning.ts`:60
- c0026: `src/bootstrap/planning.ts` — `src/bootstrap/planning.ts`:1
- c0027: `CaptureCorrectionCycle` — `src/capture-feedback.ts`:6
- c0028: `CaptureSelectionError` — `src/capture-feedback.ts`:15
- c0029: `src/capture-feedback.ts` — `src/capture-feedback.ts`:1
- c0030: `CaptureLinkReview` — `src/capture-links.ts`:43
- c0031: `ConnectionResult` — `src/capture-links.ts`:61
- c0032: `LinkDecision` — `src/capture-links.ts`:15
- c0033: `PreservationDecision` — `src/capture-links.ts`:25
- c0034: `PreviousConnections` — `src/capture-links.ts`:33
- c0035: `src/capture-links.ts` — `src/capture-links.ts`:1
- c0036: `MergeAccess` — `src/capture-merge.ts`:41
- c0037: `MergeConnections` — `src/capture-merge.ts`:5
- c0038: `MergeExecution` — `src/capture-merge.ts`:47
- c0039: `MergeWriteUncertain` — `src/capture-merge.ts`:16
- c0040: `src/capture-merge.ts` — `src/capture-merge.ts`:1
- c0041: `CandidateExtraction` — `src/capture.ts`:737
- c0042: `CandidateValidation` — `src/capture.ts`:663
- c0043: `CaptureAction` — `src/capture.ts`:76
- c0044: `CaptureActivityPhase` — `src/capture.ts`:174
- c0045: `CaptureAdvanceInput` — `src/capture.ts`:320
- c0046: `CaptureBatchInput` — `src/capture.ts`:135
- c0047: `CaptureBranch` — `src/capture.ts`:201
- c0048: `CaptureCandidate` — `src/capture.ts`:78
- c0049: `CaptureCheckpointOptions` — `src/capture.ts`:206
- c0050: `CaptureCheckpointResult` — `src/capture.ts`:212
- c0051: `CaptureCodeArtifactResource` — `src/capture.ts`:112
- c0052: `CaptureDecision` — `src/capture.ts`:142
- c0053: `CaptureDiagnosticCandidate` — `src/capture.ts`:225
- c0054: `CaptureDiagnosticConflict` — `src/capture.ts`:253
- c0055: `CaptureDiagnosticJob` — `src/capture.ts`:241
- c0056: `CaptureDiagnostics` — `src/capture.ts`:264
- c0057: `CaptureDocumentResource` — `src/capture.ts`:108
- c0058: `CaptureEnqueueResult` — `src/capture.ts`:269
- c0059: `CaptureEntityResource` — `src/capture.ts`:104
- c0060: `CaptureMergePlan` — `src/capture.ts`:159
- c0061: `CaptureNeighborhood` — `src/capture.ts`:127
- c0062: `CaptureOperation` — `src/capture.ts`:362
- c0063: `CapturePause` — `src/capture.ts`:328
- c0064: `CapturePendingConflict` — `src/capture.ts`:315
- c0065: `CaptureProgress` — `src/capture.ts`:352
- c0066: `CaptureRelationshipResource` — `src/capture.ts`:116
- c0067: `CaptureResolveResult` — `src/capture.ts`:309
- c0068: `CaptureResourceReuse` — `src/capture.ts`:120
- c0069: `CaptureService` — `src/capture.ts`:1141
- c0070: `CaptureServiceOptions` — `src/capture.ts`:176
- c0071: `CaptureUncertainWrite` — `src/capture.ts`:350
- c0072: `ConflictResolutionEvidence` — `src/capture.ts`:275
- c0073: `ConflictResolutionTarget` — `src/capture.ts`:292
- c0074: `InvalidCaptureOutput` — `src/capture.ts`:335
- c0075: `MissingCaptureDestination` — `src/capture.ts`:342
- c0076: `ResolveConflictInput` — `src/capture.ts`:298
- c0077: `src/capture.ts` — `src/capture.ts`:1
- c0078: `src/concurrency.ts` — `src/concurrency.ts`:1
- c0079: `ForgetfulConfig` — `src/config.ts`:92
- c0080: `ForgetfulInstanceConfig` — `src/config.ts`:79
- c0081: `JsonReadResult` — `src/config.ts`:149
- c0082: `LoadConfigOptions` — `src/config.ts`:115
- c0083: `ModelSelection` — `src/config.ts`:74
- c0084: `PersistedProjectSettings` — `src/config.ts`:145
- c0085: `PersistedUserSettings` — `src/config.ts`:126
- c0086: `PromptName` — `src/config.ts`:40
- c0087: `PromptOverlays` — `src/config.ts`:86
- c0088: `ScopeSource` — `src/config.ts`:39
- c0089: `Verbosity` — `src/config.ts`:59
- c0090: `src/config.ts` — `src/config.ts`:1
- c0091: `CaptureHistorySummary` — `src/contracts.ts`:315
- c0092: `CaptureMode` — `src/contracts.ts`:2
- c0093: `CaptureSnapshot` — `src/contracts.ts`:326
- c0094: `CodeArtifact` — `src/contracts.ts`:93
- c0095: `CodeArtifactInput` — `src/contracts.ts`:84
- c0096: `CodeArtifactSummary` — `src/contracts.ts`:98
- c0097: `CompactedConversation` — `src/contracts.ts`:320
- c0098: `Document` — `src/contracts.ts`:77
- c0099: `DocumentInput` — `src/contracts.ts`:68
- c0100: `DocumentSummary` — `src/contracts.ts`:82
- c0101: `Entity` — `src/contracts.ts`:53
- c0102: `EntityInput` — `src/contracts.ts`:43
- c0103: `EntityRelationship` — `src/contracts.ts`:64
- c0104: `EntityRelationshipInput` — `src/contracts.ts`:58
- c0105: `EntityType` — `src/contracts.ts`:41
- c0106: `EvidenceEntry` — `src/contracts.ts`:305
- c0107: `FileSummary` — `src/contracts.ts`:100
- c0108: `ForgetfulClient` — `src/contracts.ts`:189
- c0109: `KnowledgeClient` — `src/contracts.ts`:115
- c0110: `LinkedMemory` — `src/contracts.ts`:157
- c0111: `Memory` — `src/contracts.ts`:145
- c0112: `MemoryCreateResult` — `src/contracts.ts`:183
- c0113: `MemoryInput` — `src/contracts.ts`:17
- c0114: `MemoryModelClient` — `src/contracts.ts`:289
- c0115: `MemorySearchResult` — `src/contracts.ts`:163
- c0116: `ModelEvidencePage` — `src/contracts.ts`:245
- c0117: `ModelReadErrorResult` — `src/contracts.ts`:255
- c0118: `ModelReadTool` — `src/contracts.ts`:259
- c0119: `ModelRequest` — `src/contracts.ts`:215
- c0120: `ModelSubmissionError` — `src/contracts.ts`:278
- c0121: `ModelSubmissionTool` — `src/contracts.ts`:269
- c0122: `ModelTaskPause` — `src/contracts.ts`:267
- c0123: `Project` — `src/contracts.ts`:4
- c0124: `ProjectInput` — `src/contracts.ts`:11
- c0125: `Provenance` — `src/contracts.ts`:34
- c0126: `Scope` — `src/contracts.ts`:1
- c0127: `SearchRequest` — `src/contracts.ts`:172
- c0128: `StoredFile` — `src/contracts.ts`:110
- c0129: `WorkContext` — `src/contracts.ts`:295
- c0130: `PlanStatus` — `src/domain/planning.ts`:2
- c0131: `PlanningCapability` — `src/domain/planning.ts`:1
- c0132: `PlanningCounts` — `src/domain/planning.ts`:55
- c0133: `PlanningCriterion` — `src/domain/planning.ts`:41
- c0134: `PlanningPlan` — `src/domain/planning.ts`:20
- c0135: `PlanningPlanSummary` — `src/domain/planning.ts`:12
- c0136: `PlanningProject` — `src/domain/planning.ts`:6
- c0137: `PlanningTask` — `src/domain/planning.ts`:49
- c0138: `PlanningTaskRecord` — `src/domain/planning.ts`:25
- c0139: `PlanningTaskSummary` — `src/domain/planning.ts`:35
- c0140: `TaskPriority` — `src/domain/planning.ts`:4
- c0141: `TaskState` — `src/domain/planning.ts`:3
- c0142: `src/domain/planning.ts` — `src/domain/planning.ts`:1
- c0143: `AutomaticCaptureJobOutcome` — `src/extension.ts`:1048
- c0144: `AutomaticRecall` — `src/extension.ts`:431
- c0145: `BoundedWaitOutcome` — `src/extension.ts`:141
- c0146: `CaptureFeedbackItem` — `src/extension.ts`:1158
- c0147: `CaptureFeedbackState` — `src/extension.ts`:1027
- c0148: `CaptureServicePort` — `src/extension.ts`:286
- c0149: `DiagnosticCandidate` — `src/extension.ts`:884
- c0150: `DiagnosticParts` — `src/extension.ts`:897
- c0151: `ExtensionWorkContext` — `src/extension.ts`:320
- c0152: `ForgetfulExtensionDependencies` — `src/extension.ts`:324
- c0153: `ForgetfulExtensionOptions` — `src/extension.ts`:349
- c0154: `PendingQueuedRecall` — `src/extension.ts`:389
- c0155: `PolicyName` — `src/extension.ts`:277
- c0156: `PreparedRuntime` — `src/extension.ts`:444
- c0157: `RecallActivity` — `src/extension.ts`:391
- c0158: `RecallContextMessage` — `src/extension.ts`:364
- c0159: `RecallJob` — `src/extension.ts`:371
- c0160: `RecallServicePort` — `src/extension.ts`:279
- c0161: `Runtime` — `src/extension.ts`:397
- c0162: `SetupAuthentication` — `src/extension.ts`:227
- c0163: `State` — `src/extension.ts`:433
- c0164: `src/extension.ts` — `src/extension.ts`:1
- c0165: `src/foreground-tools.ts` — `src/foreground-tools.ts`:1
- c0166: `ApiKnowledgeClient` — `src/http-knowledge.ts`:199
- c0167: `KnowledgeRequest` — `src/http-knowledge.ts`:9
- c0168: `src/http-knowledge.ts` — `src/http-knowledge.ts`:1
- c0169: `ApiForgetfulClient` — `src/http.ts`:598
- c0170: `ApiForgetfulClientOptions` — `src/http.ts`:25
- c0171: `ForgetfulAbortError` — `src/http.ts`:59
- c0172: `ForgetfulHttpError` — `src/http.ts`:33
- c0173: `ForgetfulHttpTransport` — `src/http.ts`:394
- c0174: `ForgetfulSchemaError` — `src/http.ts`:45
- c0175: `ForgetfulTimeoutError` — `src/http.ts`:52
- c0176: `src/http.ts` — `src/http.ts`:1
- c0177: `Attachments` — `src/knowledge-read.ts`:51
- c0178: `ExpansionContext` — `src/knowledge-read.ts`:39
- c0179: `KnowledgeExpansionRequest` — `src/knowledge-read.ts`:19
- c0180: `KnowledgeExpansionResult` — `src/knowledge-read.ts`:27
- c0181: `KnowledgeReadService` — `src/knowledge-read.ts`:155
- c0182: `KnowledgeReadServiceOptions` — `src/knowledge-read.ts`:63
- c0183: `LinkedMemoryExpansion` — `src/knowledge-read.ts`:49
- c0184: `MemoryReader` — `src/knowledge-read.ts`:58
- c0185: `RelationshipExpansion` — `src/knowledge-read.ts`:43
- c0186: `src/knowledge-read.ts` — `src/knowledge-read.ts`:1
- c0187: `KnowledgeReadContext` — `src/knowledge-tools.ts`:630
- c0188: `KnowledgeReadRequest` — `src/knowledge-tools.ts`:169
- c0189: `KnowledgeToolContext` — `src/knowledge-tools.ts`:23
- c0190: `KnowledgeToolResult` — `src/knowledge-tools.ts`:33
- c0191: `KnowledgeWriteContext` — `src/knowledge-tools.ts`:1272
- c0192: `KnowledgeWriteRequest` — `src/knowledge-tools.ts`:170
- c0193: `ResolvedWriteProject` — `src/knowledge-tools.ts`:445
- c0194: `ToolImage` — `src/knowledge-tools.ts`:32
- c0195: `ToolText` — `src/knowledge-tools.ts`:31
- c0196: `src/knowledge-tools.ts` — `src/knowledge-tools.ts`:1
- c0197: `KnowledgeAttachmentIds` — `src/knowledge-write.ts`:128
- c0198: `KnowledgeCodeArtifactPlan` — `src/knowledge-write.ts`:44
- c0199: `KnowledgeDocumentPlan` — `src/knowledge-write.ts`:38
- c0200: `KnowledgeEntityMemoryLinkPlan` — `src/knowledge-write.ts`:58
- c0201: `KnowledgeEntityPlan` — `src/knowledge-write.ts`:32
- c0202: `KnowledgeMemoryReader` — `src/knowledge-write.ts`:108
- c0203: `KnowledgeRelationshipPlan` — `src/knowledge-write.ts`:50
- c0204: `KnowledgeWriteCheckpoint` — `src/knowledge-write.ts`:102
- c0205: `KnowledgeWriteGuard` — `src/knowledge-write.ts`:106
- c0206: `KnowledgeWritePlan` — `src/knowledge-write.ts`:62
- c0207: `KnowledgeWriteReceipt` — `src/knowledge-write.ts`:79
- c0208: `KnowledgeWriteSave` — `src/knowledge-write.ts`:113
- c0209: `KnowledgeWriteState` — `src/knowledge-write.ts`:86
- c0210: `KnowledgeWriter` — `src/knowledge-write.ts`:264
- c0211: `ResourceSlot` — `src/knowledge-write.ts`:115
- c0212: `WriteClient` — `src/knowledge-write.ts`:18
- c0213: `src/knowledge-write.ts` — `src/knowledge-write.ts`:1
- c0214: `DiagnosticLogger` — `src/logging.ts`:95
- c0215: `FileLogLevel` — `src/logging.ts`:93
- c0216: `FileLogger` — `src/logging.ts`:110
- c0217: `src/logging.ts` — `src/logging.ts`:1
- c0218: `src/memory-context.ts` — `src/memory-context.ts`:1
- c0219: `CompactedMemoryHistory` — `src/model-context.ts`:245
- c0220: `ContextWindowError` — `src/model-context.ts`:30
- c0221: `MemoryHistorySummaryOptions` — `src/model-context.ts`:378
- c0222: `MemoryTaskContext` — `src/model-context.ts`:252
- c0223: `SummaryCompletion` — `src/model-context.ts`:25
- c0224: `src/model-context.ts` — `src/model-context.ts`:1
- c0225: `MemoryModelHeaderTransform` — `src/model.ts`:46
- c0226: `ModelPickerContext` — `src/model.ts`:50
- c0227: `ModelRegistryPort` — `src/model.ts`:37
- c0228: `PiMemoryModel` — `src/model.ts`:320
- c0229: `PiMemoryModelOptions` — `src/model.ts`:60
- c0230: `RequestDeadline` — `src/model.ts`:241
- c0231: `src/model.ts` — `src/model.ts`:1
- c0232: `src/privacy.ts` — `src/privacy.ts`:1
- c0233: `AgentProjectInitInput` — `src/project-init.ts`:8
- c0234: `ProjectInitError` — `src/project-init.ts`:6
- c0235: `src/project-init.ts` — `src/project-init.ts`:1
- c0236: `DurableQueueStore` — `src/queue.ts`:511
- c0237: `DurableQueueStoreOptions` — `src/queue.ts`:193
- c0238: `FileLock` — `src/queue.ts`:225
- c0239: `HistoryCache` — `src/queue.ts`:42
- c0240: `PendingConflict` — `src/queue.ts`:103
- c0241: `QueueBusyError` — `src/queue.ts`:230
- c0242: `QueueCheckpoint` — `src/queue.ts`:179
- c0243: `QueueEnqueueResult` — `src/queue.ts`:163
- c0244: `QueueIdentity` — `src/queue.ts`:36
- c0245: `QueueJob` — `src/queue.ts`:69
- c0246: `QueueJobMetadata` — `src/queue.ts`:99
- c0247: `QueueJobStatus` — `src/queue.ts`:29
- c0248: `QueueState` — `src/queue.ts`:218
- c0249: `QueueWatermark` — `src/queue.ts`:48
- c0250: `SnapshotPayload` — `src/queue.ts`:212
- c0251: `StoredQueueJob` — `src/queue.ts`:207
- c0252: `SupersessionReceipt` — `src/queue.ts`:92
- c0253: `WatermarkAdvance` — `src/queue.ts`:170
- c0254: `src/queue.ts` — `src/queue.ts`:1
- c0255: `DeadlineSignal` — `src/recall.ts`:206
- c0256: `DeeperRecallRequest` — `src/recall.ts`:153
- c0257: `RecallPlan` — `src/recall.ts`:188
- c0258: `RecallRequest` — `src/recall.ts`:136
- c0259: `RecallResult` — `src/recall.ts`:162
- c0260: `RecallService` — `src/recall.ts`:673
- c0261: `RecallServiceOptions` — `src/recall.ts`:198
- c0262: `ReviewValidationError` — `src/recall.ts`:611
- c0263: `ScopeResolution` — `src/recall.ts`:215
- c0264: `SearchOutcome` — `src/recall.ts`:221
- c0265: `src/recall.ts` — `src/recall.ts`:1
- c0266: `src/repository.ts` — `src/repository.ts`:1
- c0267: `SetupHelp` — `src/setup.ts`:3
- c0268: `src/setup.ts` — `src/setup.ts`:1
- c0269: `CaptureSnapshotWithStatus` — `src/snapshot.ts`:39
- c0270: `MessageRecord` — `src/snapshot.ts`:47
- c0271: `SnapshotOptions` — `src/snapshot.ts`:20
- c0272: `SnapshotResult` — `src/snapshot.ts`:43
- c0273: `SnapshotSessionReader` — `src/snapshot.ts`:14
- c0274: `src/snapshot.ts` — `src/snapshot.ts`:1
- c0275: `SourceInspectionError` — `src/source-inspection.ts`:37
- c0276: `SourceInspectionRequest` — `src/source-inspection.ts`:33
- c0277: `SourceInspectionResult` — `src/source-inspection.ts`:43
- c0278: `SourceInspector` — `src/source-inspection.ts`:149
- c0279: `SourceInspectorOptions` — `src/source-inspection.ts`:15
- c0280: `src/source-inspection.ts` — `src/source-inspection.ts`:1

## Relationships

- c0000 ..> c0164: `defaultExtension() calls createForgetfulExtension()`
- c0003 ..> c0004: `setLabel() calls refresh()`
- c0003 ..> c0069: `dispose() calls stop()`
- c0004 --> c0003: `field loader`
- c0004 ..> c0003: `close() calls dispose()`
- c0004 ..> c0003: `refresh() calls dispose()`
- c0004 ..> c0003: `refresh() calls setLabel()`
- c0004 ..> c0003: `refresh() constructs ActivityLoader`
- c0004 ..> c0004: `constructor() calls refresh()`
- c0004 ..> c0004: `notice() calls refresh()`
- c0004 ..> c0004: `set() calls refresh()`
- c0004 ..> c0069: `refresh() calls now()`
- c0005 ..> c0005: `capabilities() calls read()`
- c0005 ..> c0005: `clean() calls sanitize()`
- c0005 ..> c0005: `plan() calls read()`
- c0005 ..> c0005: `plans() calls read()`
- c0005 ..> c0005: `projects() calls read()`
- c0005 ..> c0005: `projects() calls sanitize()`
- c0005 ..> c0005: `read() calls clean()`
- c0005 ..> c0005: `task() calls read()`
- c0005 ..> c0005: `tasks() calls read()`
- c0005 ..> c0006: `capabilities() calls boolean()`
- c0005 ..> c0006: `capabilities() calls object()`
- c0005 ..> c0006: `plan() calls choice()`
- c0005 ..> c0006: `plan() calls integer()`
- c0005 ..> c0006: `plan() calls nullableString()`
- c0005 ..> c0006: `plan() calls object()`
- c0005 ..> c0006: `plan() calls parent()`
- c0005 ..> c0006: `plan() calls string()`
- c0005 ..> c0006: `plans() calls choice()`
- c0005 ..> c0006: `plans() calls integer()`
- c0005 ..> c0006: `plans() calls list()`
- c0005 ..> c0006: `plans() calls object()`
- c0005 ..> c0006: `plans() calls parent()`
- c0005 ..> c0006: `plans() calls string()`
- c0005 ..> c0006: `projects() calls integer()`
- c0005 ..> c0006: `projects() calls list()`
- c0005 ..> c0006: `projects() calls nullableString()`
- c0005 ..> c0006: `projects() calls object()`
- c0005 ..> c0006: `projects() calls string()`
- c0005 ..> c0006: `task() calls boolean()`
- c0005 ..> c0006: `task() calls integer()`
- c0005 ..> c0006: `task() calls invalid()`
- c0005 ..> c0006: `task() calls nullableString()`
- c0005 ..> c0006: `task() calls object()`
- c0005 ..> c0006: `task() calls parent()`
- c0005 ..> c0006: `task() calls string()`
- c0005 ..> c0006: `task() calls taskRecord()`
- c0005 ..> c0006: `tasks() calls boolean()`
- c0005 ..> c0006: `tasks() calls integer()`
- c0005 ..> c0006: `tasks() calls invalid()`
- c0005 ..> c0006: `tasks() calls list()`
- c0005 ..> c0006: `tasks() calls object()`
- c0005 ..> c0006: `tasks() calls taskRecord()`
- c0005 ..|> c0021: `implements`
- c0005 ..> c0022: `type in capabilities`
- c0005 ..> c0022: `type in plan`
- c0005 ..> c0022: `type in plans`
- c0005 ..> c0022: `type in projects`
- c0005 ..> c0022: `type in read`
- c0005 ..> c0022: `type in task`
- c0005 ..> c0022: `type in tasks`
- c0005 ..> c0131: `type in capabilities`
- c0005 ..> c0134: `type in plan`
- c0005 ..> c0135: `type in plans`
- c0005 ..> c0136: `type in projects`
- c0005 ..> c0137: `type in task`
- c0005 ..> c0139: `type in tasks`
- c0005 --> c0170: `field options`
- c0005 ..> c0170: `type in constructor`
- c0005 --> c0173: `field transport`
- c0005 ..> c0173: `capabilities() calls getDeployment()`
- c0005 ..> c0173: `constructor() constructs ForgetfulHttpTransport`
- c0005 ..> c0173: `plan() calls getJson()`
- c0005 ..> c0173: `plans() calls getJson()`
- c0005 ..> c0173: `projects() calls getJson()`
- c0005 ..> c0173: `task() calls getJson()`
- c0005 ..> c0173: `tasks() calls getJson()`
- c0005 ..> c0186: `clean() calls clean()`
- c0005 ..> c0232: `read() calls errorMessage()`
- c0005 ..> c0232: `sanitize() calls sanitizeText()`
- c0006 ..> c0006: `boolean() calls invalid()`
- c0006 ..> c0006: `choice() calls invalid()`
- c0006 ..> c0006: `integer() calls invalid()`
- c0006 ..> c0006: `list() calls integer()`
- c0006 ..> c0006: `list() calls invalid()`
- c0006 ..> c0006: `list() calls object()`
- c0006 ..> c0006: `nullableString() calls string()`
- c0006 ..> c0006: `object() calls invalid()`
- c0006 ..> c0006: `parent() calls integer()`
- c0006 ..> c0006: `parent() calls invalid()`
- c0006 ..> c0006: `string() calls invalid()`
- c0006 ..> c0006: `taskRecord() calls choice()`
- c0006 ..> c0006: `taskRecord() calls integer()`
- c0006 ..> c0006: `taskRecord() calls nullableString()`
- c0006 ..> c0006: `taskRecord() calls parent()`
- c0006 ..> c0006: `taskRecord() calls string()`
- c0006 ..> c0138: `type in taskRecord`
- c0006 ..> c0174: `invalid() constructs ForgetfulSchemaError`
- c0007 ..|> c0020: `implements`
- c0007 ..> c0090: `constructor() calls userSettingsPath()`
- c0007 ..> c0090: `read() calls readPlanningPanel()`
- c0007 ..> c0090: `write() calls updateUserSettings()`
- c0009 ..> c0003: `command() calls refresh()`
- c0009 ..> c0009: `close() calls finishBrowser()`
- c0009 ..> c0009: `command() calls close()`
- c0009 ..> c0009: `command() calls open()`
- c0009 ..> c0009: `dispose() calls finishBrowser()`
- c0009 ..> c0009: `dispose() calls releaseHost()`
- c0009 ..> c0009: `dispose() calls run()`
- c0009 ..> c0009: `dispose() calls unsubscribe()`
- c0009 ..> c0009: `mount() calls sync()`
- c0009 ..> c0009: `mountHost() calls syncPanel()`
- c0009 ..> c0009: `mountHost() calls syncVisibility()`
- c0009 ..> c0009: `open() calls close()`
- c0009 ..> c0009: `open() calls finishBrowser()`
- c0009 ..> c0009: `open() calls run()`
- c0009 ..> c0009: `open() calls sync()`
- c0009 ..> c0009: `setPromptActive() calls sync()`
- c0009 ..> c0009: `status() calls display()`
- c0009 ..> c0009: `sync() calls close()`
- c0009 ..> c0009: `sync() calls mountHost()`
- c0009 ..> c0009: `sync() calls releaseHost()`
- c0009 ..> c0009: `sync() calls syncPanel()`
- c0009 ..> c0009: `sync() calls syncVisibility()`
- c0009 ..> c0009: `syncVisibility() calls hasPanelSpace()`
- c0009 ..> c0009: `syncVisibility() calls run()`
- c0009 ..> c0009: `toggle() calls close()`
- c0009 ..> c0009: `toggle() calls open()`
- c0009 ..> c0010: `hasPanelSpace() calls render()`
- c0009 ..> c0010: `open() constructs PlanBrowser`
- c0009 ..> c0011: `mountHost() calls renderPlanningPanel()`
- c0009 ..> c0011: `open() calls text()`
- c0009 ..> c0011: `run() calls text()`
- c0009 ..> c0011: `status() calls text()`
- c0009 ..> c0011: `status() calls timestamp()`
- c0009 ..> c0013: `command() calls setPanel()`
- c0009 ..> c0013: `command() calls togglePanel()`
- c0009 ..> c0013: `dispose() calls closeDetails()`
- c0009 ..> c0013: `dispose() calls setPanelVisible()`
- c0009 ..> c0013: `mount() calls subscribe()`
- c0009 ..> c0013: `open() calls closeDetails()`
- c0009 ..> c0013: `open() calls openDetails()`
- c0009 ..> c0013: `syncVisibility() calls setPanelVisible()`
- c0009 ..> c0023: `type in display`
- c0009 --> c0024: `field controller`
- c0009 ..> c0024: `type in constructor`
- c0009 ..> c0164: `command() calls notify()`
- c0009 ..> c0164: `open() calls notify()`
- c0009 ..> c0164: `run() calls notify()`
- c0009 ..> c0265: `command() calls trim()`
- c0010 ..> c0003: `handleInput() calls refresh()`
- c0010 ..> c0008: `type in listView`
- c0010 ..> c0008: `type in pickerView`
- c0010 ..> c0008: `type in textView`
- c0010 ..> c0009: `handleInput() calls close()`
- c0010 ..> c0009: `handleInput() calls run()`
- c0010 ..> c0009: `listInput() calls run()`
- c0010 ..> c0009: `pickerInput() calls run()`
- c0010 ..> c0010: `handleInput() calls listInput()`
- c0010 ..> c0010: `handleInput() calls pickerInput()`
- c0010 ..> c0010: `handleInput() calls scrollInput()`
- c0010 ..> c0010: `render() calls header()`
- c0010 ..> c0010: `render() calls listView()`
- c0010 ..> c0010: `render() calls pickerView()`
- c0010 ..> c0010: `render() calls textView()`
- c0010 ..> c0010: `textView() calls planLines()`
- c0010 ..> c0010: `textView() calls taskText()`
- c0010 ..> c0011: `header() calls availability()`
- c0010 ..> c0011: `header() calls text()`
- c0010 ..> c0011: `listView() calls counts()`
- c0010 ..> c0011: `listView() calls emptyTaskList()`
- c0010 ..> c0011: `listView() calls taskLabel()`
- c0010 ..> c0011: `listView() calls text()`
- c0010 ..> c0011: `pickerInput() calls verticalStep()`
- c0010 ..> c0011: `pickerView() calls text()`
- c0010 ..> c0011: `planLines() calls text()`
- c0010 ..> c0011: `render() calls box()`
- c0010 ..> c0011: `taskText() calls taskLabel()`
- c0010 ..> c0011: `taskText() calls text()`
- c0010 ..> c0013: `handleInput() calls closeTask()`
- c0010 ..> c0013: `listInput() calls inspectTask()`
- c0010 ..> c0013: `listInput() calls selectPlan()`
- c0010 ..> c0013: `listInput() calls selectTask()`
- c0010 ..> c0013: `pickerInput() calls selectProject()`
- c0010 ..> c0023: `type in header`
- c0010 ..> c0023: `type in listInput`
- c0010 ..> c0023: `type in listView`
- c0010 ..> c0023: `type in pickerInput`
- c0010 ..> c0023: `type in pickerView`
- c0010 ..> c0023: `type in planLines`
- c0010 ..> c0023: `type in taskText`
- c0010 ..> c0023: `type in textView`
- c0010 --> c0024: `field controller`
- c0010 ..> c0024: `type in constructor`
- c0011 ..> c0011: `availability() calls timestamp()`
- c0011 ..> c0011: `panelPlan() calls counts()`
- c0011 ..> c0011: `panelPlan() calls plural()`
- c0011 ..> c0011: `panelPlan() calls taskLabel()`
- c0011 ..> c0011: `panelPlan() calls text()`
- c0011 ..> c0011: `renderPlanningPanel() calls availability()`
- c0011 ..> c0011: `renderPlanningPanel() calls box()`
- c0011 ..> c0011: `renderPlanningPanel() calls panelPlan()`
- c0011 ..> c0011: `renderPlanningPanel() calls plural()`
- c0011 ..> c0011: `renderPlanningPanel() calls text()`
- c0011 ..> c0011: `taskLabel() calls text()`
- c0011 ..> c0019: `type in emptyTaskList`
- c0011 ..> c0023: `type in availability`
- c0011 ..> c0023: `type in counts`
- c0011 ..> c0023: `type in emptyTaskList`
- c0011 ..> c0023: `type in panelPlan`
- c0011 ..> c0023: `type in renderPlanningPanel`
- c0011 ..> c0135: `type in panelPlan`
- c0011 ..> c0139: `type in taskLabel`
- c0011 ..> c0232: `text() calls sanitizeText()`
- c0012 --> c0018: `field detailError`
- c0012 --> c0023: `field planTasks`
- c0012 --> c0134: `field planDetail`
- c0012 --> c0135: `field plans`
- c0012 --> c0137: `field taskDetail`
- c0013 ..> c0005: `readCapability() calls capabilities()`
- c0013 ..> c0005: `readDetails() calls plan()`
- c0013 ..> c0005: `readDetails() calls task()`
- c0013 ..> c0005: `readPlanTasks() calls tasks()`
- c0013 ..> c0005: `readPlans() calls plans()`
- c0013 ..> c0005: `readProject() calls projects()`
- c0013 ..> c0007: `changePanel() calls write()`
- c0013 ..> c0012: `type in readDetails`
- c0013 ..> c0013: `changePanel() calls invalidate()`
- c0013 ..> c0013: `changePanel() calls publish()`
- c0013 ..> c0013: `changePanel() calls startRefresh()`
- c0013 ..> c0013: `closeDetails() calls invalidate()`
- c0013 ..> c0013: `closeDetails() calls publish()`
- c0013 ..> c0013: `closeDetails() calls startRefresh()`
- c0013 ..> c0013: `closeTask() calls invalidate()`
- c0013 ..> c0013: `closeTask() calls publish()`
- c0013 ..> c0013: `closeTask() calls startRefresh()`
- c0013 ..> c0013: `dispose() calls invalidate()`
- c0013 ..> c0013: `inspectTask() calls invalidate()`
- c0013 ..> c0013: `inspectTask() calls publish()`
- c0013 ..> c0013: `inspectTask() calls startRefresh()`
- c0013 ..> c0013: `invalidate() calls cancelTimer()`
- c0013 ..> c0013: `invalidate() calls publish()`
- c0013 ..> c0013: `openDetails() calls invalidate()`
- c0013 ..> c0013: `openDetails() calls publish()`
- c0013 ..> c0013: `openDetails() calls startRefresh()`
- c0013 ..> c0013: `publishFailure() calls publish()`
- c0013 ..> c0013: `readCapability() calls accept()`
- c0013 ..> c0013: `readCapability() calls publish()`
- c0013 ..> c0013: `readDetails() calls partial()`
- c0013 ..> c0013: `readOverview() calls publish()`
- c0013 ..> c0013: `readOverview() calls publishFailure()`
- c0013 ..> c0013: `readOverview() calls readCapability()`
- c0013 ..> c0013: `readOverview() calls readPlans()`
- c0013 ..> c0013: `readOverview() calls readProject()`
- c0013 ..> c0013: `readOverview() calls settle()`
- c0013 ..> c0013: `readPlanTasks() calls partial()`
- c0013 ..> c0013: `readPlans() calls accept()`
- c0013 ..> c0013: `readPlans() calls publish()`
- c0013 ..> c0013: `readPlans() calls readDetails()`
- c0013 ..> c0013: `readPlans() calls readPlanTasks()`
- c0013 ..> c0013: `readProject() calls accept()`
- c0013 ..> c0013: `readProject() calls publish()`
- c0013 ..> c0013: `refresh() calls startRefresh()`
- c0013 ..> c0013: `selectPlan() calls invalidate()`
- c0013 ..> c0013: `selectPlan() calls publish()`
- c0013 ..> c0013: `selectPlan() calls startRefresh()`
- c0013 ..> c0013: `selectProject() calls invalidate()`
- c0013 ..> c0013: `selectProject() calls publish()`
- c0013 ..> c0013: `selectProject() calls startRefresh()`
- c0013 ..> c0013: `selectTask() calls invalidate()`
- c0013 ..> c0013: `selectTask() calls publish()`
- c0013 ..> c0013: `selectTask() calls startRefresh()`
- c0013 ..> c0013: `setConnection() calls invalidate()`
- c0013 ..> c0013: `setConnection() calls publish()`
- c0013 ..> c0013: `setConnection() calls startRefresh()`
- c0013 ..> c0013: `setPanel() calls changePanel()`
- c0013 ..> c0013: `setPanelVisible() calls invalidate()`
- c0013 ..> c0013: `setPanelVisible() calls publish()`
- c0013 ..> c0013: `setPanelVisible() calls startRefresh()`
- c0013 ..> c0013: `settle() calls publish()`
- c0013 ..> c0013: `settle() calls startRefresh()`
- c0013 ..> c0013: `settle() calls visible()`
- c0013 ..> c0013: `startRefresh() calls cancelTimer()`
- c0013 ..> c0013: `startRefresh() calls readOverview()`
- c0013 ..> c0013: `startRefresh() calls visible()`
- c0013 ..> c0013: `togglePanel() calls changePanel()`
- c0013 --> c0014: `field options`
- c0013 ..> c0014: `type in constructor`
- c0013 ..> c0015: `accept() constructs PlanningReadFailure`
- c0013 ..> c0015: `partial() constructs PlanningReadFailure`
- c0013 ..> c0016: `accept() calls throwIfCancelled()`
- c0013 ..> c0016: `constructor() calls connectionAvailability()`
- c0013 ..> c0016: `partial() calls throwIfCancelled()`
- c0013 ..> c0016: `publishFailure() calls failureAvailability()`
- c0013 ..> c0016: `readCapability() calls noPlanData()`
- c0013 ..> c0016: `readDetails() calls removePlan()`
- c0013 ..> c0016: `readProject() calls noPlanData()`
- c0013 ..> c0016: `setConnection() calls connectionAvailability()`
- c0013 ..> c0022: `type in accept`
- c0013 ..> c0022: `type in partial`
- c0013 --> c0023: `field current`
- c0013 ..> c0023: `type in publish`
- c0013 ..> c0023: `type in readPlanTasks`
- c0013 ..> c0023: `type in state`
- c0013 ..> c0023: `type in subscribe`
- c0013 ..|> c0024: `implements`
- c0013 ..> c0069: `readPlanTasks() calls now()`
- c0013 ..> c0069: `readPlans() calls now()`
- c0013 ..> c0135: `type in readPlanTasks`
- c0013 ..> c0139: `type in readDetails`
- c0013 ..> c0142: `readPlanTasks() calls activeTasks()`
- c0013 ..> c0142: `readPlanTasks() calls taskCounts()`
- c0013 ..> c0142: `readPlans() calls sortPlans()`
- c0013 ..> c0142: `readProject() calls mappedProject()`
- c0014 --> c0017: `field clock`
- c0014 --> c0020: `field preferences`
- c0014 --> c0021: `field reader`
- c0015 --> c0018: `field failure`
- c0015 ..> c0018: `type in constructor`
- c0016 ..> c0012: `type in removePlan`
- c0016 ..> c0015: `throwIfCancelled() constructs PlanningReadFailure`
- c0016 ..> c0018: `type in failureAvailability`
- c0016 ..> c0023: `type in connectionAvailability`
- c0016 ..> c0023: `type in failureAvailability`
- c0016 ..> c0023: `type in noPlanData`
- c0019 --> c0018: `field error`
- c0019 --> c0132: `field counts`
- c0019 --> c0139: `field activeTasks`
- c0019 --> c0139: `field tasks`
- c0021 ..> c0022: `type in capabilities`
- c0021 ..> c0022: `type in plan`
- c0021 ..> c0022: `type in plans`
- c0021 ..> c0022: `type in projects`
- c0021 ..> c0022: `type in task`
- c0021 ..> c0022: `type in tasks`
- c0021 ..> c0131: `type in capabilities`
- c0021 ..> c0134: `type in plan`
- c0021 ..> c0135: `type in plans`
- c0021 ..> c0136: `type in projects`
- c0021 ..> c0137: `type in task`
- c0021 ..> c0139: `type in tasks`
- c0022 --> c0018: `field error`
- c0023 --> c0018: `field detailError`
- c0023 --> c0018: `field error`
- c0023 --> c0019: `field planTasks`
- c0023 --> c0131: `field capability`
- c0023 --> c0134: `field planDetail`
- c0023 --> c0135: `field plans`
- c0023 --> c0136: `field projects`
- c0023 --> c0137: `field taskDetail`
- c0024 --> c0023: `field state`
- c0024 ..> c0023: `type in subscribe`
- c0026 ..> c0005: `createPlanningRuntime() constructs ApiPlanningReader`
- c0026 ..> c0007: `createPlanningRuntime() constructs LocalPlanningPreferences`
- c0026 ..> c0009: `createPlanningRuntime() calls command()`
- c0026 ..> c0009: `createPlanningRuntime() calls mount()`
- c0026 ..> c0009: `createPlanningRuntime() calls setPromptActive()`
- c0026 ..> c0009: `createPlanningRuntime() calls status()`
- c0026 ..> c0009: `createPlanningRuntime() calls toggle()`
- c0026 ..> c0009: `createPlanningRuntime() constructs PiPlanningView`
- c0026 ..> c0013: `createPlanningRuntime() calls dispose()`
- c0026 ..> c0013: `createPlanningRuntime() calls setConnection()`
- c0026 ..> c0013: `createPlanningRuntime() constructs PlanningController`
- c0026 ..> c0069: `createPlanningRuntime() calls now()`
- c0026 ..> c0079: `type in createPlanningRuntime`
- c0029 ..> c0027: `type in initialCorrectionCycle`
- c0029 ..> c0118: `type in captureFailureReport`
- c0029 ..> c0232: `captureFailureReport() calls sanitizeValue()`
- c0030 --> c0031: `field executionResults`
- c0030 --> c0031: `field previousResults`
- c0030 --> c0032: `field decisions`
- c0030 --> c0033: `field preservation`
- c0030 --> c0034: `field previous`
- c0030 --> c0094: `field resources`
- c0030 --> c0098: `field resources`
- c0030 --> c0111: `field memories`
- c0030 --> c0111: `field memory`
- c0034 --> c0094: `field codeArtifacts`
- c0034 --> c0098: `field documents`
- c0034 --> c0101: `field entities`
- c0034 --> c0111: `field memory`
- c0035 ..> c0004: `validateLinkDecisions() calls set()`
- c0035 ..> c0004: `validateLinkReviews() calls set()`
- c0035 ..> c0028: `authorizedMemory() constructs CaptureSelectionError`
- c0035 ..> c0030: `type in applyLinkReview`
- c0035 ..> c0030: `type in executeConnection`
- c0035 ..> c0030: `type in finishLinkExecution`
- c0035 ..> c0030: `type in prepareLinkReview`
- c0035 ..> c0030: `type in preserveConnections`
- c0035 ..> c0030: `type in readSelectedMemory`
- c0035 ..> c0030: `type in validateLinkDecisions`
- c0035 ..> c0030: `type in validateLinkReviews`
- c0035 ..> c0031: `type in executeConnection`
- c0035 ..> c0032: `type in validateLinkDecisions`
- c0035 ..> c0032: `type in validateLinkReviews`
- c0035 ..> c0032: `type in wantsEdge`
- c0035 ..> c0033: `type in validateLinkReviews`
- c0035 ..> c0034: `type in preparePreviousConnections`
- c0035 ..> c0035: `applyLinkReview() calls authorizedMemory()`
- c0035 ..> c0035: `applyLinkReview() calls executeConnection()`
- c0035 ..> c0035: `applyLinkReview() calls finishLinkExecution()`
- c0035 ..> c0035: `executeConnection() calls operationError()`
- c0035 ..> c0035: `prepareLinkReview() calls exclusiveMemory()`
- c0035 ..> c0035: `prepareLinkReview() calls readAttachmentRecords()`
- c0035 ..> c0035: `prepareLinkReview() calls readSelectedMemory()`
- c0035 ..> c0035: `preserveConnections() calls executeConnection()`
- c0035 ..> c0035: `validateLinkDecisions() calls wantsEdge()`
- c0035 ..> c0035: `validateLinkReviews() calls validateLinkDecisions()`
- c0035 ..> c0094: `type in readAttachmentRecords`
- c0035 ..> c0098: `type in readAttachmentRecords`
- c0035 ..> c0108: `type in applyLinkReview`
- c0035 ..> c0108: `type in authorizedMemory`
- c0035 ..> c0108: `type in prepareLinkReview`
- c0035 ..> c0108: `type in preparePreviousConnections`
- c0035 ..> c0108: `type in preserveConnections`
- c0035 ..> c0108: `type in readAttachmentRecords`
- c0035 ..> c0108: `type in readSelectedMemory`
- c0035 ..> c0111: `type in authorizedMemory`
- c0035 ..> c0111: `type in exclusiveMemory`
- c0035 ..> c0111: `type in prepareLinkReview`
- c0035 ..> c0111: `type in preparePreviousConnections`
- c0035 ..> c0111: `type in readAttachmentRecords`
- c0035 ..> c0111: `type in readSelectedMemory`
- c0035 ..> c0126: `type in applyLinkReview`
- c0035 ..> c0126: `type in authorizedMemory`
- c0035 ..> c0126: `type in prepareLinkReview`
- c0035 ..> c0166: `applyLinkReview() calls linkMemories()`
- c0035 ..> c0166: `preparePreviousConnections() calls getCodeArtifact()`
- c0035 ..> c0166: `preparePreviousConnections() calls getDocument()`
- c0035 ..> c0166: `preparePreviousConnections() calls getEntity()`
- c0035 ..> c0166: `preserveConnections() calls linkEntityMemory()`
- c0035 ..> c0166: `preserveConnections() calls updateMemory()`
- c0035 ..> c0166: `readAttachmentRecords() calls getCodeArtifact()`
- c0035 ..> c0166: `readAttachmentRecords() calls getDocument()`
- c0035 ..> c0169: `authorizedMemory() calls get()`
- c0035 ..> c0169: `prepareLinkReview() calls get()`
- c0035 ..> c0169: `preparePreviousConnections() calls get()`
- c0035 ..> c0169: `preparePreviousConnections() calls getMemoryEntityIds()`
- c0035 ..> c0169: `readSelectedMemory() calls get()`
- c0035 ..> c0169: `validateLinkDecisions() calls get()`
- c0035 ..> c0210: `executeConnection() calls execute()`
- c0035 ..> c0232: `operationError() calls errorMessage()`
- c0035 ..> c0232: `prepareLinkReview() calls hasSensitiveData()`
- c0035 ..> c0232: `preparePreviousConnections() calls hasSensitiveData()`
- c0035 ..> c0232: `readAttachmentRecords() calls hasSensitiveData()`
- c0035 ..> c0232: `validateLinkDecisions() calls hasSensitiveData()`
- c0035 ..> c0265: `validateLinkDecisions() calls trim()`
- c0036 --> c0126: `field scope`
- c0038 --|> c0036: `inherits`
- c0040 ..> c0028: `checkMergeEntity() constructs CaptureSelectionError`
- c0040 ..> c0028: `preflightMergeConnections() constructs CaptureSelectionError`
- c0040 ..> c0028: `requireResourceScope() constructs CaptureSelectionError`
- c0040 ..> c0036: `type in checkMergeAttachments`
- c0040 ..> c0036: `type in checkMergeEntity`
- c0040 ..> c0036: `type in preflightMergeConnections`
- c0040 ..> c0036: `type in requireResourceScope`
- c0040 ..> c0037: `type in checkMergeAttachments`
- c0040 ..> c0037: `type in collectMergeConnections`
- c0040 ..> c0037: `type in preflightMergeConnections`
- c0040 ..> c0037: `type in preserveMergeConnections`
- c0040 ..> c0038: `type in preserveMergeConnections`
- c0040 ..> c0040: `checkMergeAttachments() calls requireResourceScope()`
- c0040 ..> c0040: `collectMergeConnections() calls union()`
- c0040 ..> c0040: `preflightMergeConnections() calls checkMergeAttachments()`
- c0040 ..> c0040: `preflightMergeConnections() calls checkMergeEntity()`
- c0040 ..> c0040: `preserveMergeConnections() calls checkMergeAttachments()`
- c0040 ..> c0040: `preserveMergeConnections() calls checkMergeEntity()`
- c0040 ..> c0040: `preserveMergeConnections() calls preflightMergeConnections()`
- c0040 ..> c0040: `preserveMergeConnections() calls union()`
- c0040 ..> c0108: `type in checkMergeAttachments`
- c0040 ..> c0108: `type in checkMergeEntity`
- c0040 ..> c0108: `type in collectMergeConnections`
- c0040 ..> c0108: `type in preflightMergeConnections`
- c0040 ..> c0108: `type in preserveMergeConnections`
- c0040 ..> c0111: `type in collectMergeConnections`
- c0040 ..> c0166: `checkMergeAttachments() calls getCodeArtifact()`
- c0040 ..> c0166: `checkMergeAttachments() calls getDocument()`
- c0040 ..> c0166: `checkMergeAttachments() calls getFile()`
- c0040 ..> c0166: `checkMergeEntity() calls getEntity()`
- c0040 ..> c0166: `preserveMergeConnections() calls linkEntityMemory()`
- c0040 ..> c0166: `preserveMergeConnections() calls linkMemories()`
- c0040 ..> c0166: `preserveMergeConnections() calls updateMemory()`
- c0040 ..> c0169: `collectMergeConnections() calls getMemoryEntityIds()`
- c0040 ..> c0169: `preflightMergeConnections() calls get()`
- c0040 ..> c0210: `preserveMergeConnections() calls execute()`
- c0041 --> c0048: `field candidates`
- c0046 --> c0048: `field candidate`
- c0046 --> c0061: `field neighborhood`
- c0046 --> c0111: `field overlaps`
- c0048 --> c0051: `field codeArtifacts`
- c0048 --> c0057: `field documents`
- c0048 --> c0059: `field entities`
- c0048 --> c0066: `field relationships`
- c0049 --> c0047: `field excludeBranches`
- c0050 --> c0047: `field deferredBranches`
- c0051 --|> c0198: `inherits`
- c0052 --> c0043: `field action`
- c0052 --> c0068: `field reuse`
- c0053 --> c0030: `field linkReview`
- c0053 --> c0043: `field action`
- c0054 --> c0240: `field status`
- c0055 --> c0053: `field candidates`
- c0055 --> c0247: `field status`
- c0056 --> c0054: `field conflicts`
- c0056 --> c0055: `field jobs`
- c0057 --|> c0199: `inherits`
- c0059 --|> c0201: `inherits`
- c0060 --> c0037: `field connections`
- c0060 --> c0048: `field candidate`
- c0060 --> c0111: `field memories`
- c0061 --> c0094: `field codeArtifacts`
- c0061 --> c0098: `field documents`
- c0061 --> c0101: `field entities`
- c0061 --> c0103: `field relationships`
- c0062 --> c0071: `field uncertainWrite`
- c0062 --> c0252: `field supersession`
- c0063 --|> c0122: `inherits`
- c0064 --|> c0240: `inherits`
- c0066 --|> c0203: `inherits`
- c0067 --> c0240: `field conflict`
- c0069 ..> c0004: `activity() calls set()`
- c0069 ..> c0009: `resolveConflict() calls run()`
- c0069 ..> c0009: `runBranchWorker() calls run()`
- c0069 ..> c0028: `composeMerge() constructs CaptureSelectionError`
- c0069 ..> c0028: `equivalentMemory() constructs CaptureSelectionError`
- c0069 ..> c0028: `finishMerge() constructs CaptureSelectionError`
- c0069 ..> c0028: `processCandidates() constructs CaptureSelectionError`
- c0069 ..> c0028: `readMaintenanceTargets() constructs CaptureSelectionError`
- c0069 ..> c0028: `retireCandidate() constructs CaptureSelectionError`
- c0069 ..> c0028: `supersedeCandidate() constructs CaptureSelectionError`
- c0069 ..> c0028: `supersessionAlreadyApplied() constructs CaptureSelectionError`
- c0069 ..> c0028: `verifyRequestedMerge() constructs CaptureSelectionError`
- c0069 ..> c0029: `executeLinkReview() calls initialCorrectionCycle()`
- c0069 ..> c0029: `migrateLegacyLinkReview() calls initialCorrectionCycle()`
- c0069 ..> c0029: `planLinkReviews() calls captureFailureReport()`
- c0069 ..> c0029: `planLinkReviews() calls initialCorrectionCycle()`
- c0069 ..> c0029: `processOrderedCandidates() calls initialCorrectionCycle()`
- c0069 ..> c0029: `recordCandidateFailure() calls correctableCaptureError()`
- c0069 ..> c0029: `recordCandidateFailure() calls initialCorrectionCycle()`
- c0069 ..> c0029: `recordLinkReviewFailure() calls correctableCaptureError()`
- c0069 ..> c0029: `refreshLinkReview() calls correctableCaptureError()`
- c0069 ..> c0029: `reviewExecutionFailure() calls captureFailureReport()`
- c0069 ..> c0029: `reviewExecutionFailure() calls initialCorrectionCycle()`
- c0069 ..> c0029: `saveCorrectableFailure() calls correctableCaptureError()`
- c0069 ..> c0029: `saveCorrectableFailure() calls initialCorrectionCycle()`
- c0069 ..> c0030: `type in planLinkReviews`
- c0069 ..> c0030: `type in prepareLinkReviews`
- c0069 ..> c0030: `type in previousSupersessionCompleted`
- c0069 ..> c0030: `type in recordLinkReviewFailure`
- c0069 ..> c0030: `type in refreshLinkReview`
- c0069 ..> c0035: `executeLinkReview() calls applyLinkReview()`
- c0069 ..> c0035: `executeLinkReview() calls preserveConnections()`
- c0069 ..> c0035: `refreshLinkReview() calls prepareLinkReview()`
- c0069 ..> c0035: `refreshLinkReview() calls preparePreviousConnections()`
- c0069 ..> c0040: `composeMerge() calls collectMergeConnections()`
- c0069 ..> c0040: `composeMerge() calls preflightMergeConnections()`
- c0069 ..> c0040: `finishMerge() calls collectMergeConnections()`
- c0069 ..> c0040: `finishMerge() calls preserveMergeConnections()`
- c0069 ..> c0040: `mergeCandidate() calls collectMergeConnections()`
- c0069 ..> c0040: `mergeCandidate() calls preflightMergeConnections()`
- c0069 --> c0044: `field activityPhase`
- c0069 ..> c0044: `type in activity`
- c0069 ..> c0045: `type in advance`
- c0069 ..> c0045: `type in advanceWatermark`
- c0069 ..> c0046: `type in prepareOverlapBatch`
- c0069 ..> c0047: `type in checkpointBranch`
- c0069 ..> c0047: `type in checkpointBranches`
- c0069 ..> c0047: `type in runBranchWorker`
- c0069 ..> c0048: `type in addConflict`
- c0069 ..> c0048: `type in applyDecision`
- c0069 ..> c0048: `type in composeMerge`
- c0069 ..> c0048: `type in correctCandidateFailures`
- c0069 ..> c0048: `type in correctedCaptureOutcome`
- c0069 ..> c0048: `type in createMemory`
- c0069 ..> c0048: `type in decideOverlap`
- c0069 ..> c0048: `type in decideOverlapBatch`
- c0069 ..> c0048: `type in destinationProjects`
- c0069 ..> c0048: `type in executeLinkReview`
- c0069 ..> c0048: `type in executeLinkReviews`
- c0069 ..> c0048: `type in existingNeighborhood`
- c0069 ..> c0048: `type in finishMerge`
- c0069 ..> c0048: `type in finishReviewedSupersession`
- c0069 ..> c0048: `type in finishSupersession`
- c0069 ..> c0048: `type in loadCandidates`
- c0069 ..> c0048: `type in loadOverlaps`
- c0069 ..> c0048: `type in mergeCandidate`
- c0069 ..> c0048: `type in neighborhoodEntities`
- c0069 ..> c0048: `type in planConflictReplacement`
- c0069 ..> c0048: `type in planLinkReviews`
- c0069 ..> c0048: `type in prepareDestination`
- c0069 ..> c0048: `type in prepareLinkReviews`
- c0069 ..> c0048: `type in prepareOverlapBatch`
- c0069 ..> c0048: `type in processCandidate`
- c0069 ..> c0048: `type in processCandidates`
- c0069 ..> c0048: `type in processKnowledgeCheckpoint`
- c0069 ..> c0048: `type in processOrderedCandidates`
- c0069 ..> c0048: `type in processReplacementCheckpoint`
- c0069 ..> c0048: `type in recordCandidateFailure`
- c0069 ..> c0048: `type in recordEscalation`
- c0069 ..> c0048: `type in recordLinkReviewFailure`
- c0069 ..> c0048: `type in refreshLinkReview`
- c0069 ..> c0048: `type in resolveDestination`
- c0069 ..> c0048: `type in retireCandidate`
- c0069 ..> c0048: `type in reviewExecutionFailure`
- c0069 ..> c0048: `type in reviewLinks`
- c0069 ..> c0048: `type in saveCorrectableFailure`
- c0069 ..> c0048: `type in skipCandidate`
- c0069 ..> c0048: `type in supersedeCandidate`
- c0069 ..> c0048: `type in validateDecision`
- c0069 ..> c0048: `type in writeKnowledge`
- c0069 ..> c0049: `type in checkpoint`
- c0069 ..> c0049: `type in checkpointBranches`
- c0069 ..> c0049: `type in processPending`
- c0069 ..> c0050: `type in appendCheckpointResult`
- c0069 ..> c0050: `type in checkpoint`
- c0069 ..> c0050: `type in checkpointBranch`
- c0069 ..> c0050: `type in correctCandidateFailures`
- c0069 ..> c0050: `type in pauseCandidate`
- c0069 ..> c0050: `type in processBranchJob`
- c0069 ..> c0050: `type in processCandidates`
- c0069 ..> c0050: `type in processJob`
- c0069 ..> c0050: `type in processOrderedCandidates`
- c0069 ..> c0050: `type in processPending`
- c0069 ..> c0050: `type in recordBranchFailure`
- c0069 ..> c0050: `type in recordCandidateFailure`
- c0069 ..> c0050: `type in runBranchWorker`
- c0069 ..> c0052: `type in addConflict`
- c0069 ..> c0052: `type in applyDecision`
- c0069 ..> c0052: `type in composeMerge`
- c0069 ..> c0052: `type in correctedCaptureOutcome`
- c0069 ..> c0052: `type in decideOverlap`
- c0069 ..> c0052: `type in finishMerge`
- c0069 ..> c0052: `type in finishSupersession`
- c0069 ..> c0052: `type in mergeCandidate`
- c0069 ..> c0052: `type in recordEscalation`
- c0069 ..> c0052: `type in retireCandidate`
- c0069 ..> c0052: `type in skipCandidate`
- c0069 ..> c0052: `type in supersedeCandidate`
- c0069 ..> c0052: `type in validateDecision`
- c0069 ..> c0056: `type in diagnostics`
- c0069 ..> c0058: `type in enqueue`
- c0069 ..> c0058: `type in enqueueSnapshot`
- c0069 ..> c0060: `type in composeMerge`
- c0069 ..> c0060: `type in correctedCaptureOutcome`
- c0069 ..> c0060: `type in finishMerge`
- c0069 ..> c0061: `type in existingNeighborhood`
- c0069 ..> c0061: `type in validateDecision`
- c0069 ..> c0063: `assertWriteAllowedNow() constructs CapturePause`
- c0069 ..> c0063: `decideOverlap() constructs CapturePause`
- c0069 ..> c0063: `ensureModelCallAllowed() constructs CapturePause`
- c0069 ..> c0063: `ensureWriteAllowed() constructs CapturePause`
- c0069 ..> c0063: `evidenceReadTool() constructs CapturePause`
- c0069 ..> c0063: `loadOverlaps() constructs CapturePause`
- c0069 ..> c0063: `neighborhoodEntity() constructs CapturePause`
- c0069 ..> c0063: `neighborhoodMatches() constructs CapturePause`
- c0069 ..> c0063: `neighborhoodRelationships() constructs CapturePause`
- c0069 ..> c0063: `processCandidate() constructs CapturePause`
- c0069 ..> c0063: `processJob() constructs CapturePause`
- c0069 ..> c0063: `stop() constructs CapturePause`
- c0069 ..> c0063: `type in pauseCandidate`
- c0069 ..> c0064: `type in pendingConflicts`
- c0069 ..> c0064: `type in verifyConflictOrigin`
- c0069 ..> c0065: `ensureModelCallAllowed() constructs CaptureProgress`
- c0069 ..> c0067: `type in applyConflictResolution`
- c0069 ..> c0067: `type in markConflictResolved`
- c0069 ..> c0067: `type in rejectConflict`
- c0069 ..> c0067: `type in resolve`
- c0069 ..> c0067: `type in resolveConflict`
- c0069 ..> c0067: `type in resolveConflictOwned`
- c0069 ..> c0069: `activity() calls publishActivity()`
- c0069 ..> c0069: `advanceWatermark() calls advance()`
- c0069 ..> c0069: `applyConflictResolution() calls applySupersession()`
- c0069 ..> c0069: `applyConflictResolution() calls createResolutionReplacement()`
- c0069 ..> c0069: `applyConflictResolution() calls ensureWriteAllowed()`
- c0069 ..> c0069: `applyConflictResolution() calls executeResolutionLinks()`
- c0069 ..> c0069: `applyConflictResolution() calls failConflictResolution()`
- c0069 ..> c0069: `applyConflictResolution() calls markConflictResolved()`
- c0069 ..> c0069: `applyConflictResolution() calls planConflictReplacement()`
- c0069 ..> c0069: `applyConflictResolution() calls updateResolutionReplacement()`
- c0069 ..> c0069: `applyDecision() calls checkpointOutcome()`
- c0069 ..> c0069: `applyDecision() calls createMemory()`
- c0069 ..> c0069: `applyDecision() calls ensureModelCallAllowed()`
- c0069 ..> c0069: `applyDecision() calls equivalentMemory()`
- c0069 ..> c0069: `applyDecision() calls mergeCandidate()`
- c0069 ..> c0069: `applyDecision() calls recordEscalation()`
- c0069 ..> c0069: `applyDecision() calls retireCandidate()`
- c0069 ..> c0069: `applyDecision() calls skipCandidate()`
- c0069 ..> c0069: `applyDecision() calls supersedeCandidate()`
- c0069 ..> c0069: `applyDecision() calls writeKnowledge()`
- c0069 ..> c0069: `applySupersession() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `applySupersession() calls recordSupersession()`
- c0069 ..> c0069: `applySupersession() calls supersessionAlreadyApplied()`
- c0069 ..> c0069: `assertWriteAllowedNow() calls canWriteNow()`
- c0069 ..> c0069: `cancellableClient() calls read()`
- c0069 ..> c0069: `cancellableKnowledge() calls read()`
- c0069 ..> c0069: `checkpoint() calls appendCheckpointResult()`
- c0069 ..> c0069: `checkpoint() calls checkpointBranch()`
- c0069 ..> c0069: `checkpoint() calls checkpointBranches()`
- c0069 ..> c0069: `checkpoint() calls enabled()`
- c0069 ..> c0069: `checkpointBranch() calls runBranchWorker()`
- c0069 ..> c0069: `composeMerge() calls checkpointOutcome()`
- c0069 ..> c0069: `composeMerge() calls ensureModelCallAllowed()`
- c0069 ..> c0069: `composeMerge() calls ensureWriteAllowed()`
- c0069 ..> c0069: `composeMerge() calls readMaintenanceTargets()`
- c0069 ..> c0069: `constructor() calls activity()`
- c0069 ..> c0069: `constructor() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `constructor() calls cancellableClient()`
- c0069 ..> c0069: `constructor() calls read()`
- c0069 ..> c0069: `correctCandidateFailures() calls recordCandidateFailure()`
- c0069 ..> c0069: `correctCandidateFailures() calls reviewExecutionFailure()`
- c0069 ..> c0069: `createMemory() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `createMemory() calls checkpointOutcome()`
- c0069 ..> c0069: `createMemory() calls ensureWriteAllowed()`
- c0069 ..> c0069: `createResolutionReplacement() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `createResolutionReplacement() calls ensureWriteAllowed()`
- c0069 ..> c0069: `decideOverlap() calls checkpointOutcome()`
- c0069 ..> c0069: `decideOverlap() calls enabled()`
- c0069 ..> c0069: `decideOverlap() calls ensureModelCallAllowed()`
- c0069 ..> c0069: `decideOverlap() calls existingNeighborhood()`
- c0069 ..> c0069: `decideOverlap() calls policyFor()`
- c0069 ..> c0069: `decideOverlap() calls validateDecision()`
- c0069 ..> c0069: `decideOverlapBatch() calls ensureModelCallAllowed()`
- c0069 ..> c0069: `decideOverlapBatch() calls policyFor()`
- c0069 ..> c0069: `decideOverlapBatch() calls prepareOverlapBatch()`
- c0069 ..> c0069: `destinationProjects() calls resolveDestination()`
- c0069 ..> c0069: `enabled() calls getMode()`
- c0069 ..> c0069: `enabled() calls isEnabled()`
- c0069 ..> c0069: `enqueueSnapshot() calls getMode()`
- c0069 ..> c0069: `enqueueSnapshot() calls isEnabled()`
- c0069 ..> c0069: `ensureModelCallAllowed() calls enabled()`
- c0069 ..> c0069: `ensureWriteAllowed() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `ensureWriteAllowed() calls enabled()`
- c0069 ..> c0069: `ensureWriteAllowed() calls getMode()`
- c0069 ..> c0069: `equivalentMemory() calls ensureWriteAllowed()`
- c0069 ..> c0069: `evidenceReadTool() calls canReadNow()`
- c0069 ..> c0069: `evidenceReadTool() calls enabled()`
- c0069 ..> c0069: `executeLinkReview() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `executeLinkReview() calls checkpointOutcome()`
- c0069 ..> c0069: `executeLinkReview() calls ensureWriteAllowed()`
- c0069 ..> c0069: `executeLinkReview() calls finishReviewedSupersession()`
- c0069 ..> c0069: `executeLinkReview() calls previousSupersessionCompleted()`
- c0069 ..> c0069: `executeLinkReview() calls recordLinkReviewFailure()`
- c0069 ..> c0069: `executeLinkReviews() calls executeLinkReview()`
- c0069 ..> c0069: `executeResolutionLinks() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `executeResolutionLinks() calls ensureWriteAllowed()`
- c0069 ..> c0069: `executeResolutionLinks() calls linkResolutionEntity()`
- c0069 ..> c0069: `existingNeighborhood() calls neighborhoodEntities()`
- c0069 ..> c0069: `existingNeighborhood() calls neighborhoodRelationships()`
- c0069 ..> c0069: `finishMerge() calls applySupersession()`
- c0069 ..> c0069: `finishMerge() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `finishMerge() calls checkpointOutcome()`
- c0069 ..> c0069: `finishMerge() calls ensureWriteAllowed()`
- c0069 ..> c0069: `finishMerge() calls readMaintenanceTargets()`
- c0069 ..> c0069: `finishMerge() calls verifyRequestedMerge()`
- c0069 ..> c0069: `finishReviewedSupersession() calls finishSupersession()`
- c0069 ..> c0069: `finishSupersession() calls applySupersession()`
- c0069 ..> c0069: `finishSupersession() calls checkpointOutcome()`
- c0069 ..> c0069: `linkResolutionEntity() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `linkResolutionEntity() calls ensureWriteAllowed()`
- c0069 ..> c0069: `loadCandidates() calls ensureModelCallAllowed()`
- c0069 ..> c0069: `loadCandidates() calls evidenceReadTool()`
- c0069 ..> c0069: `loadCandidates() calls policyFor()`
- c0069 ..> c0069: `loadCandidates() calls sourceInspectionTool()`
- c0069 ..> c0069: `loadOverlaps() calls checkpointOutcome()`
- c0069 ..> c0069: `loadOverlaps() calls enabled()`
- c0069 ..> c0069: `mergeCandidate() calls checkpointOutcome()`
- c0069 ..> c0069: `mergeCandidate() calls composeMerge()`
- c0069 ..> c0069: `mergeCandidate() calls createMemory()`
- c0069 ..> c0069: `mergeCandidate() calls ensureWriteAllowed()`
- c0069 ..> c0069: `mergeCandidate() calls finishMerge()`
- c0069 ..> c0069: `mergeCandidate() calls readMaintenanceTargets()`
- c0069 ..> c0069: `mergeCandidate() calls writeKnowledge()`
- c0069 ..> c0069: `migrateLegacyLinkReview() calls checkpointOutcome()`
- c0069 ..> c0069: `migrateLegacyLinkReview() calls connectionUncertainty()`
- c0069 ..> c0069: `mutate() calls activity()`
- c0069 ..> c0069: `mutate() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `neighborhoodEntities() calls neighborhoodEntity()`
- c0069 ..> c0069: `neighborhoodEntities() calls neighborhoodMatches()`
- c0069 ..> c0069: `neighborhoodEntity() calls enabled()`
- c0069 ..> c0069: `neighborhoodMatches() calls enabled()`
- c0069 ..> c0069: `neighborhoodRelationships() calls enabled()`
- c0069 ..> c0069: `ownedConflict() calls verifyConflictOrigin()`
- c0069 ..> c0069: `pendingConflicts() calls verifyConflictOrigin()`
- c0069 ..> c0069: `planConflictReplacement() calls ensureWriteAllowed()`
- c0069 ..> c0069: `planConflictReplacement() calls readSavedMemory()`
- c0069 ..> c0069: `planConflictReplacement() calls revisionResources()`
- c0069 ..> c0069: `planLinkReviews() calls ensureModelCallAllowed()`
- c0069 ..> c0069: `planLinkReviews() calls ensureWriteAllowed()`
- c0069 ..> c0069: `preflightRetirement() calls confirmedRetirement()`
- c0069 ..> c0069: `preflightRetirement() calls readMaintenanceTargets()`
- c0069 ..> c0069: `prepareDestination() calls checkpointOutcome()`
- c0069 ..> c0069: `prepareDestination() calls destinationProjects()`
- c0069 ..> c0069: `prepareLinkReviews() calls checkpointOutcome()`
- c0069 ..> c0069: `prepareLinkReviews() calls ensureWriteAllowed()`
- c0069 ..> c0069: `prepareLinkReviews() calls migrateLegacyLinkReview()`
- c0069 ..> c0069: `prepareLinkReviews() calls refreshLinkReview()`
- c0069 ..> c0069: `prepareOverlapBatch() calls existingNeighborhood()`
- c0069 ..> c0069: `prepareOverlapBatch() calls loadOverlaps()`
- c0069 ..> c0069: `prepareOverlapBatch() calls prepareDestination()`
- c0069 ..> c0069: `previousSupersessionCompleted() calls ensureWriteAllowed()`
- c0069 ..> c0069: `processBranchJob() calls processJob()`
- c0069 ..> c0069: `processBranchJob() calls recordBranchFailure()`
- c0069 ..> c0069: `processCandidate() calls applyDecision()`
- c0069 ..> c0069: `processCandidate() calls checkpointOutcome()`
- c0069 ..> c0069: `processCandidate() calls decideOverlap()`
- c0069 ..> c0069: `processCandidate() calls enabled()`
- c0069 ..> c0069: `processCandidate() calls getMode()`
- c0069 ..> c0069: `processCandidate() calls loadOverlaps()`
- c0069 ..> c0069: `processCandidate() calls mergeCandidate()`
- c0069 ..> c0069: `processCandidate() calls prepareDestination()`
- c0069 ..> c0069: `processCandidate() calls processKnowledgeCheckpoint()`
- c0069 ..> c0069: `processCandidate() calls processReplacementCheckpoint()`
- c0069 ..> c0069: `processCandidate() calls retireCandidate()`
- c0069 ..> c0069: `processCandidates() calls correctCandidateFailures()`
- c0069 ..> c0069: `processCandidates() calls processOrderedCandidates()`
- c0069 ..> c0069: `processCandidates() calls recordCandidateFailure()`
- c0069 ..> c0069: `processCandidates() calls saveCorrectableFailure()`
- c0069 ..> c0069: `processJob() calls decideOverlapBatch()`
- c0069 ..> c0069: `processJob() calls enabled()`
- c0069 ..> c0069: `processJob() calls getMode()`
- c0069 ..> c0069: `processJob() calls loadCandidates()`
- c0069 ..> c0069: `processJob() calls processCandidates()`
- c0069 ..> c0069: `processJob() calls reviewLinks()`
- c0069 ..> c0069: `processKnowledgeCheckpoint() calls finishSupersession()`
- c0069 ..> c0069: `processKnowledgeCheckpoint() calls writeKnowledge()`
- c0069 ..> c0069: `processOrderedCandidates() calls checkpointOutcome()`
- c0069 ..> c0069: `processOrderedCandidates() calls processCandidate()`
- c0069 ..> c0069: `processOrderedCandidates() calls processCandidates()`
- c0069 ..> c0069: `processOrderedCandidates() calls recordCandidateFailure()`
- c0069 ..> c0069: `processOrderedCandidates() calls saveCorrectableFailure()`
- c0069 ..> c0069: `processReplacementCheckpoint() calls finishSupersession()`
- c0069 ..> c0069: `processReplacementCheckpoint() calls writeKnowledge()`
- c0069 ..> c0069: `publishActivity() calls onActivity()`
- c0069 ..> c0069: `read() calls activity()`
- c0069 ..> c0069: `read() calls readSignal()`
- c0069 ..> c0069: `readMaintenanceTargets() calls ensureWriteAllowed()`
- c0069 ..> c0069: `recordCandidateFailure() calls candidateUncertainty()`
- c0069 ..> c0069: `recordCandidateFailure() calls checkpointOutcome()`
- c0069 ..> c0069: `recordCandidateFailure() calls isModelFailure()`
- c0069 ..> c0069: `recordCandidateFailure() calls pauseCandidate()`
- c0069 ..> c0069: `recordEscalation() calls checkpointOutcome()`
- c0069 ..> c0069: `recordLinkReviewFailure() calls checkpointOutcome()`
- c0069 ..> c0069: `recordLinkReviewFailure() calls connectionUncertainty()`
- c0069 ..> c0069: `refreshLinkReview() calls ensureWriteAllowed()`
- c0069 ..> c0069: `resolve() calls resolveConflict()`
- c0069 ..> c0069: `resolveConflict() calls resolveConflictOwned()`
- c0069 ..> c0069: `resolveConflictOwned() calls applyConflictResolution()`
- c0069 ..> c0069: `resolveConflictOwned() calls enabled()`
- c0069 ..> c0069: `resolveConflictOwned() calls ownedConflict()`
- c0069 ..> c0069: `resolveConflictOwned() calls rejectConflict()`
- c0069 ..> c0069: `resolveConflictOwned() calls resolutionTarget()`
- c0069 ..> c0069: `resolveConflictOwned() calls validateResolutionEvidence()`
- c0069 ..> c0069: `retireCandidate() calls applySupersession()`
- c0069 ..> c0069: `retireCandidate() calls checkpointOutcome()`
- c0069 ..> c0069: `retireCandidate() calls confirmedRetirement()`
- c0069 ..> c0069: `retireCandidate() calls ensureWriteAllowed()`
- c0069 ..> c0069: `retireCandidate() calls preflightRetirement()`
- c0069 ..> c0069: `reviewExecutionFailure() calls checkpointOutcome()`
- c0069 ..> c0069: `reviewExecutionFailure() calls correctedCaptureOutcome()`
- c0069 ..> c0069: `reviewExecutionFailure() calls ensureModelCallAllowed()`
- c0069 ..> c0069: `reviewLinks() calls executeLinkReviews()`
- c0069 ..> c0069: `reviewLinks() calls planLinkReviews()`
- c0069 ..> c0069: `reviewLinks() calls prepareLinkReviews()`
- c0069 ..> c0069: `revisionResources() calls read()`
- c0069 ..> c0069: `runBranchWorker() calls enabled()`
- c0069 ..> c0069: `runBranchWorker() calls processBranchJob()`
- c0069 ..> c0069: `saveCorrectableFailure() calls candidateUncertainty()`
- c0069 ..> c0069: `saveCorrectableFailure() calls checkpointOutcome()`
- c0069 ..> c0069: `saveCorrectableFailure() calls isModelFailure()`
- c0069 ..> c0069: `skipCandidate() calls checkpointOutcome()`
- c0069 ..> c0069: `skipCandidate() calls writeKnowledge()`
- c0069 ..> c0069: `supersedeCandidate() calls checkpointOutcome()`
- c0069 ..> c0069: `supersedeCandidate() calls createMemory()`
- c0069 ..> c0069: `supersedeCandidate() calls ensureModelCallAllowed()`
- c0069 ..> c0069: `supersedeCandidate() calls ensureWriteAllowed()`
- c0069 ..> c0069: `supersedeCandidate() calls finishSupersession()`
- c0069 ..> c0069: `supersedeCandidate() calls writeKnowledge()`
- c0069 ..> c0069: `supersessionAlreadyApplied() calls ensureWriteAllowed()`
- c0069 ..> c0069: `updateResolutionReplacement() calls assertWriteAllowedNow()`
- c0069 ..> c0069: `updateResolutionReplacement() calls ensureWriteAllowed()`
- c0069 ..> c0069: `validateResolutionEvidence() calls selectResolutionEvidence()`
- c0069 ..> c0069: `verifyRequestedMerge() calls ensureWriteAllowed()`
- c0069 ..> c0069: `writeKnowledge() calls checkpointOutcome()`
- c0069 ..> c0069: `writeKnowledge() calls ensureWriteAllowed()`
- c0069 --> c0070: `field onActivity`
- c0069 ..> c0070: `type in constructor`
- c0069 ..> c0071: `applySupersession() constructs CaptureUncertainWrite`
- c0069 ..> c0071: `candidateUncertainty() constructs CaptureUncertainWrite`
- c0069 ..> c0071: `connectionUncertainty() constructs CaptureUncertainWrite`
- c0069 ..> c0071: `createMemory() constructs CaptureUncertainWrite`
- c0069 ..> c0071: `mutate() constructs CaptureUncertainWrite`
- c0069 ..> c0071: `processJob() constructs CaptureUncertainWrite`
- c0069 ..> c0071: `reviewExecutionFailure() constructs CaptureUncertainWrite`
- c0069 ..> c0071: `type in candidateUncertainty`
- c0069 ..> c0071: `type in connectionUncertainty`
- c0069 ..> c0072: `type in applyConflictResolution`
- c0069 ..> c0072: `type in planConflictReplacement`
- c0069 ..> c0072: `type in validateResolutionEvidence`
- c0069 ..> c0073: `type in applyConflictResolution`
- c0069 ..> c0073: `type in resolutionTarget`
- c0069 ..> c0074: `destinationProjects() constructs InvalidCaptureOutput`
- c0069 ..> c0074: `processKnowledgeCheckpoint() constructs InvalidCaptureOutput`
- c0069 ..> c0074: `processReplacementCheckpoint() constructs InvalidCaptureOutput`
- c0069 ..> c0074: `validateDecision() constructs InvalidCaptureOutput`
- c0069 ..> c0075: `resolveDestination() constructs MissingCaptureDestination`
- c0069 ..> c0076: `type in rejectConflict`
- c0069 ..> c0076: `type in resolve`
- c0069 ..> c0076: `type in resolveConflict`
- c0069 ..> c0076: `type in resolveConflictOwned`
- c0069 ..> c0076: `type in selectResolutionEvidence`
- c0069 ..> c0076: `type in validateResolutionEvidence`
- c0069 ..> c0077: `addConflict() calls clone()`
- c0069 ..> c0077: `addConflict() calls sourceEvidence()`
- c0069 ..> c0077: `applyConflictResolution() calls blockedSave()`
- c0069 ..> c0077: `applyConflictResolution() calls conflictResolutionEvidence()`
- c0069 ..> c0077: `applyDecision() calls firstConflictId()`
- c0069 ..> c0077: `applySupersession() calls definitelyRejected()`
- c0069 ..> c0077: `candidateUncertainty() calls record()`
- c0069 ..> c0077: `checkpointBranch() calls scrubError()`
- c0069 ..> c0077: `checkpointOutcome() calls clone()`
- c0069 ..> c0077: `checkpointOutcome() calls record()`
- c0069 ..> c0077: `composeMerge() calls captureWorkMetadata()`
- c0069 ..> c0077: `composeMerge() calls decisionConflictIds()`
- c0069 ..> c0077: `composeMerge() calls record()`
- c0069 ..> c0077: `composeMerge() calls sourceEvidence()`
- c0069 ..> c0077: `correctCandidateFailures() calls isFinalOutcome()`
- c0069 ..> c0077: `correctedCaptureOutcome() calls decisionConflictIds()`
- c0069 ..> c0077: `correctedCaptureOutcome() calls record()`
- c0069 ..> c0077: `correctedCaptureOutcome() calls reusableMergeComposition()`
- c0069 ..> c0077: `createMemory() calls definitelyRejected()`
- c0069 ..> c0077: `createMemory() calls memoryInput()`
- c0069 ..> c0077: `createMemory() calls projectId()`
- c0069 ..> c0077: `createMemory() calls record()`
- c0069 ..> c0077: `createResolutionReplacement() calls definitelyRejected()`
- c0069 ..> c0077: `createResolutionReplacement() calls projectId()`
- c0069 ..> c0077: `decideOverlap() calls appendSubmissionRejection()`
- c0069 ..> c0077: `decideOverlap() calls boundedSubmissionRejections()`
- c0069 ..> c0077: `decideOverlap() calls captureWorkMetadata()`
- c0069 ..> c0077: `decideOverlap() calls decisionConflictIds()`
- c0069 ..> c0077: `decideOverlap() calls overlapCandidate()`
- c0069 ..> c0077: `decideOverlap() calls parseDecision()`
- c0069 ..> c0077: `decideOverlap() calls sourceEvidence()`
- c0069 ..> c0077: `decideOverlapBatch() calls appendSubmissionRejection()`
- c0069 ..> c0077: `decideOverlapBatch() calls boundedSubmissionRejections()`
- c0069 ..> c0077: `decideOverlapBatch() calls captureWorkMetadata()`
- c0069 ..> c0077: `decideOverlapBatch() calls overlapCandidate()`
- c0069 ..> c0077: `decideOverlapBatch() calls record()`
- c0069 ..> c0077: `decideOverlapBatch() calls scrubError()`
- c0069 ..> c0077: `decideOverlapBatch() calls sharedSourceEvidence()`
- c0069 ..> c0077: `diagnostics() calls boundedSubmissionRejections()`
- c0069 ..> c0077: `diagnostics() calls projectId()`
- c0069 ..> c0077: `diagnostics() calls record()`
- c0069 ..> c0077: `diagnostics() calls scrubError()`
- c0069 ..> c0077: `diagnostics() calls stringValue()`
- c0069 ..> c0077: `diagnostics() calls strings()`
- c0069 ..> c0077: `enqueue() calls scrubError()`
- c0069 ..> c0077: `enqueueSnapshot() calls snapshotForPersistence()`
- c0069 ..> c0077: `equivalentMemory() calls projectId()`
- c0069 ..> c0077: `equivalentMemory() calls record()`
- c0069 ..> c0077: `evidenceReadTool() calls record()`
- c0069 ..> c0077: `executeLinkReview() calls record()`
- c0069 ..> c0077: `executeLinkReviews() calls record()`
- c0069 ..> c0077: `finishMerge() calls record()`
- c0069 ..> c0077: `finishSupersession() calls record()`
- c0069 ..> c0077: `loadCandidates() calls appendSubmissionRejection()`
- c0069 ..> c0077: `loadCandidates() calls boundedSubmissionRejections()`
- c0069 ..> c0077: `loadCandidates() calls captureCandidateSubmission()`
- c0069 ..> c0077: `loadCandidates() calls captureWorkMetadata()`
- c0069 ..> c0077: `loadCandidates() calls parseCandidates()`
- c0069 ..> c0077: `loadCandidates() calls record()`
- c0069 ..> c0077: `loadCandidates() calls strings()`
- c0069 ..> c0077: `loadOverlaps() calls record()`
- c0069 ..> c0077: `mergeCandidate() calls projectId()`
- c0069 ..> c0077: `mergeCandidate() calls record()`
- c0069 ..> c0077: `neighborhoodMatches() calls record()`
- c0069 ..> c0077: `pauseCandidate() calls scrubError()`
- c0069 ..> c0077: `planLinkReviews() calls appendSubmissionRejection()`
- c0069 ..> c0077: `planLinkReviews() calls boundedSubmissionRejections()`
- c0069 ..> c0077: `planLinkReviews() calls captureWorkMetadata()`
- c0069 ..> c0077: `planLinkReviews() calls record()`
- c0069 ..> c0077: `planLinkReviews() calls sharedSourceEvidence()`
- c0069 ..> c0077: `preflightRetirement() calls record()`
- c0069 ..> c0077: `prepareLinkReviews() calls record()`
- c0069 ..> c0077: `prepareOverlapBatch() calls isFinalOutcome()`
- c0069 ..> c0077: `prepareOverlapBatch() calls record()`
- c0069 ..> c0077: `processCandidate() calls isFinalOutcome()`
- c0069 ..> c0077: `processCandidate() calls record()`
- c0069 ..> c0077: `processJob() calls isFinalOutcome()`
- c0069 ..> c0077: `processKnowledgeCheckpoint() calls projectId()`
- c0069 ..> c0077: `processKnowledgeCheckpoint() calls record()`
- c0069 ..> c0077: `processOrderedCandidates() calls isFinalOutcome()`
- c0069 ..> c0077: `processOrderedCandidates() calls record()`
- c0069 ..> c0077: `processReplacementCheckpoint() calls projectId()`
- c0069 ..> c0077: `processReplacementCheckpoint() calls record()`
- c0069 ..> c0077: `recordBranchFailure() calls scrubError()`
- c0069 ..> c0077: `recordCandidateFailure() calls record()`
- c0069 ..> c0077: `recordCandidateFailure() calls scrubError()`
- c0069 ..> c0077: `recordLinkReviewFailure() calls record()`
- c0069 ..> c0077: `refreshLinkReview() calls projectId()`
- c0069 ..> c0077: `refreshLinkReview() calls record()`
- c0069 ..> c0077: `resolutionTarget() calls record()`
- c0069 ..> c0077: `resolveDestination() calls currentProjectId()`
- c0069 ..> c0077: `resolveDestination() calls projectId()`
- c0069 ..> c0077: `retireCandidate() calls decisionConflictIds()`
- c0069 ..> c0077: `retireCandidate() calls record()`
- c0069 ..> c0077: `reviewExecutionFailure() calls captureWorkMetadata()`
- c0069 ..> c0077: `reviewExecutionFailure() calls record()`
- c0069 ..> c0077: `reviewLinks() calls record()`
- c0069 ..> c0077: `saveCorrectableFailure() calls record()`
- c0069 ..> c0077: `saveCorrectableFailure() calls scrubError()`
- c0069 ..> c0077: `skipCandidate() calls firstConflictId()`
- c0069 ..> c0077: `skipCandidate() calls record()`
- c0069 ..> c0077: `supersedeCandidate() calls decisionConflictIds()`
- c0069 ..> c0077: `validateResolutionEvidence() calls stringValue()`
- c0069 ..> c0077: `validateResolutionEvidence() calls trustedAdditionalEntries()`
- c0069 ..> c0077: `verifyConflictOrigin() calls record()`
- c0069 ..> c0077: `writeKnowledge() calls captureKnowledgePlan()`
- c0069 ..> c0077: `writeKnowledge() calls record()`
- c0069 --> c0092: `field getMode`
- c0069 ..> c0092: `type in enabled`
- c0069 ..> c0092: `type in ensureWriteAllowed`
- c0069 ..> c0092: `type in refreshLinkReview`
- c0069 ..> c0093: `type in advance`
- c0069 ..> c0093: `type in advanceWatermark`
- c0069 ..> c0093: `type in checkpoint`
- c0069 ..> c0093: `type in checkpointBranches`
- c0069 ..> c0093: `type in enqueue`
- c0069 ..> c0093: `type in enqueueSnapshot`
- c0069 ..> c0093: `type in policyFor`
- c0069 ..> c0101: `type in neighborhoodEntities`
- c0069 ..> c0101: `type in neighborhoodEntity`
- c0069 ..> c0101: `type in neighborhoodMatches`
- c0069 ..> c0101: `type in neighborhoodRelationships`
- c0069 ..> c0103: `type in neighborhoodRelationships`
- c0069 --> c0108: `field client`
- c0069 ..> c0108: `type in cancellableClient`
- c0069 ..> c0109: `type in cancellableKnowledge`
- c0069 --> c0111: `field readSavedMemory`
- c0069 ..> c0111: `type in addConflict`
- c0069 ..> c0111: `type in applyDecision`
- c0069 ..> c0111: `type in applySupersession`
- c0069 ..> c0111: `type in decideOverlap`
- c0069 ..> c0111: `type in equivalentMemory`
- c0069 ..> c0111: `type in finishSupersession`
- c0069 ..> c0111: `type in loadOverlaps`
- c0069 ..> c0111: `type in planConflictReplacement`
- c0069 ..> c0111: `type in readMaintenanceTargets`
- c0069 ..> c0111: `type in recordEscalation`
- c0069 ..> c0111: `type in revisionResources`
- c0069 ..> c0111: `type in skipCandidate`
- c0069 ..> c0111: `type in supersedeCandidate`
- c0069 ..> c0111: `type in validateDecision`
- c0069 ..> c0111: `type in writeKnowledge`
- c0069 ..> c0112: `type in createMemory`
- c0069 --> c0114: `field model`
- c0069 ..> c0116: `evidenceReadTool() constructs ModelEvidencePage`
- c0069 ..> c0117: `sourceInspectionTool() constructs ModelReadErrorResult`
- c0069 ..> c0118: `type in evidenceReadTool`
- c0069 ..> c0118: `type in sourceInspectionTool`
- c0069 ..> c0129: `type in destinationProjects`
- c0069 ..> c0129: `type in planConflictReplacement`
- c0069 ..> c0129: `type in resolveDestination`
- c0069 ..> c0129: `type in watermark`
- c0069 ..> c0166: `cancellableKnowledge() calls createCodeArtifact()`
- c0069 ..> c0166: `cancellableKnowledge() calls createDocument()`
- c0069 ..> c0166: `cancellableKnowledge() calls createEntity()`
- c0069 ..> c0166: `cancellableKnowledge() calls createRelationship()`
- c0069 ..> c0166: `cancellableKnowledge() calls getCodeArtifact()`
- c0069 ..> c0166: `cancellableKnowledge() calls getDocument()`
- c0069 ..> c0166: `cancellableKnowledge() calls getEntity()`
- c0069 ..> c0166: `cancellableKnowledge() calls getEntityMemories()`
- c0069 ..> c0166: `cancellableKnowledge() calls getFile()`
- c0069 ..> c0166: `cancellableKnowledge() calls getRelationships()`
- c0069 ..> c0166: `cancellableKnowledge() calls linkEntityMemory()`
- c0069 ..> c0166: `cancellableKnowledge() calls linkMemories()`
- c0069 ..> c0166: `cancellableKnowledge() calls listCodeArtifacts()`
- c0069 ..> c0166: `cancellableKnowledge() calls listDocuments()`
- c0069 ..> c0166: `cancellableKnowledge() calls listFiles()`
- c0069 ..> c0166: `cancellableKnowledge() calls searchEntities()`
- c0069 ..> c0166: `cancellableKnowledge() calls updateCodeArtifact()`
- c0069 ..> c0166: `cancellableKnowledge() calls updateDocument()`
- c0069 ..> c0166: `cancellableKnowledge() calls updateEntity()`
- c0069 ..> c0166: `cancellableKnowledge() calls updateMemory()`
- c0069 ..> c0166: `executeResolutionLinks() calls linkMemories()`
- c0069 ..> c0166: `existingNeighborhood() calls getCodeArtifact()`
- c0069 ..> c0166: `existingNeighborhood() calls getDocument()`
- c0069 ..> c0166: `existingNeighborhood() calls listCodeArtifacts()`
- c0069 ..> c0166: `existingNeighborhood() calls listDocuments()`
- c0069 ..> c0166: `linkResolutionEntity() calls linkEntityMemory()`
- c0069 ..> c0166: `neighborhoodEntity() calls getEntity()`
- c0069 ..> c0166: `neighborhoodMatches() calls searchEntities()`
- c0069 ..> c0166: `neighborhoodRelationships() calls getRelationships()`
- c0069 ..> c0166: `revisionResources() calls getCodeArtifact()`
- c0069 ..> c0166: `revisionResources() calls getDocument()`
- c0069 ..> c0166: `revisionResources() calls getEntity()`
- c0069 ..> c0166: `revisionResources() calls getFile()`
- c0069 ..> c0166: `updateResolutionReplacement() calls updateMemory()`
- c0069 ..> c0166: `verifyRequestedMerge() calls getEntity()`
- c0069 ..> c0169: `applyConflictResolution() calls get()`
- c0069 ..> c0169: `applySupersession() calls supersede()`
- c0069 ..> c0169: `cancellableClient() calls create()`
- c0069 ..> c0169: `cancellableClient() calls createProject()`
- c0069 ..> c0169: `cancellableClient() calls get()`
- c0069 ..> c0169: `cancellableClient() calls linkProject()`
- c0069 ..> c0169: `cancellableClient() calls listProjects()`
- c0069 ..> c0169: `cancellableClient() calls search()`
- c0069 ..> c0169: `cancellableClient() calls supersede()`
- c0069 ..> c0169: `constructor() calls get()`
- c0069 ..> c0169: `createMemory() calls create()`
- c0069 ..> c0169: `createResolutionReplacement() calls create()`
- c0069 ..> c0169: `decideOverlapBatch() calls get()`
- c0069 ..> c0169: `diagnostics() calls get()`
- c0069 ..> c0169: `equivalentMemory() calls get()`
- c0069 ..> c0169: `executeResolutionLinks() calls get()`
- c0069 ..> c0169: `finishMerge() calls get()`
- c0069 ..> c0169: `linkResolutionEntity() calls getMemoryEntityIds()`
- c0069 ..> c0169: `loadOverlaps() calls search()`
- c0069 ..> c0169: `planLinkReviews() calls get()`
- c0069 ..> c0169: `previousSupersessionCompleted() calls get()`
- c0069 ..> c0169: `read() calls get()`
- c0069 ..> c0169: `readMaintenanceTargets() calls get()`
- c0069 ..> c0169: `resolveDestination() calls listProjects()`
- c0069 ..> c0169: `retireCandidate() calls get()`
- c0069 ..> c0169: `revisionResources() calls get()`
- c0069 ..> c0169: `revisionResources() calls getMemoryEntityIds()`
- c0069 ..> c0169: `skipCandidate() calls get()`
- c0069 ..> c0169: `supersedeCandidate() calls get()`
- c0069 ..> c0169: `supersessionAlreadyApplied() calls get()`
- c0069 ..> c0169: `verifyConflictOrigin() calls get()`
- c0069 ..> c0169: `verifyRequestedMerge() calls get()`
- c0069 --> c0210: `field knowledgeWriter`
- c0069 ..> c0210: `constructor() constructs KnowledgeWriter`
- c0069 ..> c0210: `writeKnowledge() calls execute()`
- c0069 --> c0214: `field logger`
- c0069 ..> c0216: `checkpointBranch() calls emit()`
- c0069 ..> c0216: `checkpointOutcome() calls emit()`
- c0069 ..> c0216: `createMemory() calls emit()`
- c0069 ..> c0216: `decideOverlap() calls emit()`
- c0069 ..> c0216: `emit() calls emit()`
- c0069 ..> c0216: `enqueue() calls emit()`
- c0069 ..> c0216: `enqueueSnapshot() calls emit()`
- c0069 ..> c0216: `enqueueSnapshot() calls enqueue()`
- c0069 ..> c0216: `loadCandidates() calls emit()`
- c0069 ..> c0216: `processBranchJob() calls emit()`
- c0069 ..> c0216: `recordBranchFailure() calls emit()`
- c0069 ..> c0216: `recordCandidateFailure() calls emit()`
- c0069 ..> c0216: `runBranchWorker() calls emit()`
- c0069 ..> c0216: `saveCorrectableFailure() calls emit()`
- c0069 ..> c0217: `checkpointOutcome() calls correlation()`
- c0069 ..> c0217: `composeMerge() calls correlation()`
- c0069 ..> c0217: `createMemory() calls correlation()`
- c0069 ..> c0217: `decideOverlap() calls correlation()`
- c0069 ..> c0217: `decideOverlapBatch() calls correlation()`
- c0069 ..> c0217: `loadCandidates() calls correlation()`
- c0069 ..> c0217: `planLinkReviews() calls correlation()`
- c0069 ..> c0217: `processBranchJob() calls correlation()`
- c0069 ..> c0217: `recordBranchFailure() calls correlation()`
- c0069 ..> c0217: `recordCandidateFailure() calls correlation()`
- c0069 ..> c0217: `reviewExecutionFailure() calls correlation()`
- c0069 ..> c0217: `saveCorrectableFailure() calls correlation()`
- c0069 ..> c0218: `createMemory() calls replacementMemoryInput()`
- c0069 ..> c0218: `createResolutionReplacement() calls replacementMemoryInput()`
- c0069 ..> c0218: `planConflictReplacement() calls replacementMemoryInput()`
- c0069 ..> c0218: `updateResolutionReplacement() calls replacementMemoryInput()`
- c0069 ..> c0222: `loadCandidates() calls prepareCapture()`
- c0069 ..> c0232: `addConflict() calls sanitizeText()`
- c0069 ..> c0232: `addConflict() calls sanitizeValue()`
- c0069 ..> c0232: `applySupersession() calls errorMessage()`
- c0069 ..> c0232: `candidateUncertainty() calls errorMessage()`
- c0069 ..> c0232: `createMemory() calls errorMessage()`
- c0069 ..> c0232: `createResolutionReplacement() calls errorMessage()`
- c0069 ..> c0232: `decideOverlap() calls sanitizeValue()`
- c0069 ..> c0232: `diagnostics() calls sanitizeText()`
- c0069 ..> c0232: `emit() calls sanitizeValue()`
- c0069 ..> c0232: `existingNeighborhood() calls hasSensitiveData()`
- c0069 ..> c0232: `failConflictResolution() calls errorMessage()`
- c0069 ..> c0232: `loadCandidates() calls sanitizeText()`
- c0069 ..> c0232: `loadOverlaps() calls sanitizeValue()`
- c0069 ..> c0232: `mutate() calls errorMessage()`
- c0069 ..> c0232: `neighborhoodEntity() calls hasSensitiveData()`
- c0069 ..> c0232: `neighborhoodRelationships() calls hasSensitiveData()`
- c0069 ..> c0232: `recordCandidateFailure() calls errorMessage()`
- c0069 ..> c0232: `recordLinkReviewFailure() calls errorMessage()`
- c0069 ..> c0232: `refreshLinkReview() calls errorMessage()`
- c0069 ..> c0232: `rejectConflict() calls sanitizeText()`
- c0069 ..> c0232: `reviewExecutionFailure() calls errorMessage()`
- c0069 ..> c0232: `saveCorrectableFailure() calls errorMessage()`
- c0069 ..> c0232: `skipCandidate() calls sanitizeValue()`
- c0069 --> c0236: `field queue`
- c0069 ..> c0236: `addConflict() calls addConflict()`
- c0069 ..> c0236: `addConflict() calls now()`
- c0069 ..> c0236: `advance() calls advanceWatermark()`
- c0069 ..> c0236: `applyConflictResolution() calls updateConflict()`
- c0069 ..> c0236: `cancellableClient() calls mutate()`
- c0069 ..> c0236: `cancellableKnowledge() calls mutate()`
- c0069 ..> c0236: `checkpoint() calls hasClaimableWork()`
- c0069 ..> c0236: `checkpointBranch() calls withWorkerLock()`
- c0069 ..> c0236: `checkpointBranches() calls listJobMetadata()`
- c0069 ..> c0236: `checkpointOutcome() calls checkpoint()`
- c0069 ..> c0236: `checkpointOutcome() calls getJob()`
- c0069 ..> c0236: `composeMerge() calls checkpoint()`
- c0069 ..> c0236: `composeMerge() calls complete()`
- c0069 ..> c0236: `constructor() calls complete()`
- c0069 ..> c0236: `createResolutionReplacement() calls updateConflict()`
- c0069 ..> c0236: `decideOverlap() calls checkpoint()`
- c0069 ..> c0236: `decideOverlap() calls complete()`
- c0069 ..> c0236: `decideOverlapBatch() calls checkpoint()`
- c0069 ..> c0236: `decideOverlapBatch() calls complete()`
- c0069 ..> c0236: `diagnostics() calls listJobMetadata()`
- c0069 ..> c0236: `diagnostics() calls pendingConflicts()`
- c0069 ..> c0236: `enqueue() calls enqueueSnapshot()`
- c0069 ..> c0236: `enqueueSnapshot() calls advanceWatermark()`
- c0069 ..> c0236: `executeLinkReviews() calls getJob()`
- c0069 ..> c0236: `executeResolutionLinks() calls updateConflict()`
- c0069 ..> c0236: `failConflictResolution() calls getConflict()`
- c0069 ..> c0236: `failConflictResolution() calls updateConflict()`
- c0069 ..> c0236: `loadCandidates() calls checkpoint()`
- c0069 ..> c0236: `loadCandidates() calls complete()`
- c0069 ..> c0236: `loadCandidates() calls getJob()`
- c0069 ..> c0236: `loadCandidates() calls refreshCaptureHistory()`
- c0069 ..> c0236: `markConflictResolved() calls updateConflict()`
- c0069 ..> c0236: `ownedConflict() calls getConflict()`
- c0069 ..> c0236: `pauseCandidate() calls checkpoint()`
- c0069 ..> c0236: `pauseCandidate() calls getJob()`
- c0069 ..> c0236: `pendingConflicts() calls pendingConflicts()`
- c0069 ..> c0236: `planConflictReplacement() calls complete()`
- c0069 ..> c0236: `planConflictReplacement() calls getJob()`
- c0069 ..> c0236: `planLinkReviews() calls checkpoint()`
- c0069 ..> c0236: `planLinkReviews() calls complete()`
- c0069 ..> c0236: `processBranchJob() calls getJob()`
- c0069 ..> c0236: `processBranchJob() calls now()`
- c0069 ..> c0236: `processBranchJob() calls releaseProgress()`
- c0069 ..> c0236: `processJob() calls checkpoint()`
- c0069 ..> c0236: `processJob() calls complete()`
- c0069 ..> c0236: `processJob() calls getJob()`
- c0069 ..> c0236: `processJob() calls releaseProgress()`
- c0069 ..> c0236: `processPending() calls checkpoint()`
- c0069 ..> c0236: `recordBranchFailure() calls cancel()`
- c0069 ..> c0236: `recordBranchFailure() calls checkpoint()`
- c0069 ..> c0236: `recordBranchFailure() calls getJob()`
- c0069 ..> c0236: `recordBranchFailure() calls now()`
- c0069 ..> c0236: `recordCandidateFailure() calls cancel()`
- c0069 ..> c0236: `recordCandidateFailure() calls checkpoint()`
- c0069 ..> c0236: `recordCandidateFailure() calls getJob()`
- c0069 ..> c0236: `recordEscalation() calls addConflict()`
- c0069 ..> c0236: `recordLinkReviewFailure() calls getJob()`
- c0069 ..> c0236: `recordSupersession() calls checkpoint()`
- c0069 ..> c0236: `recordSupersession() calls updateConflict()`
- c0069 ..> c0236: `rejectConflict() calls updateConflict()`
- c0069 ..> c0236: `resolveConflict() calls getConflict()`
- c0069 ..> c0236: `resolveConflict() calls withWorkerLock()`
- c0069 ..> c0236: `reviewExecutionFailure() calls checkpoint()`
- c0069 ..> c0236: `reviewExecutionFailure() calls complete()`
- c0069 ..> c0236: `runBranchWorker() calls claimNext()`
- c0069 ..> c0236: `saveCorrectableFailure() calls getJob()`
- c0069 ..> c0236: `sourceInspectionTool() calls checkpoint()`
- c0069 ..> c0236: `updateResolutionReplacement() calls updateConflict()`
- c0069 ..> c0236: `verifyConflictOrigin() calls getJob()`
- c0069 ..> c0236: `watermark() calls getWatermark()`
- c0069 ..> c0240: `type in addConflict`
- c0069 ..> c0240: `type in applyConflictResolution`
- c0069 ..> c0240: `type in createResolutionReplacement`
- c0069 ..> c0240: `type in executeResolutionLinks`
- c0069 ..> c0240: `type in linkResolutionEntity`
- c0069 ..> c0240: `type in ownedConflict`
- c0069 ..> c0240: `type in planConflictReplacement`
- c0069 ..> c0240: `type in rejectConflict`
- c0069 ..> c0240: `type in resolutionTarget`
- c0069 ..> c0240: `type in selectResolutionEvidence`
- c0069 ..> c0240: `type in updateResolutionReplacement`
- c0069 ..> c0240: `type in validateResolutionEvidence`
- c0069 ..> c0240: `type in verifyConflictOrigin`
- c0069 --> c0244: `field identity`
- c0069 ..> c0245: `type in addConflict`
- c0069 ..> c0245: `type in applyDecision`
- c0069 ..> c0245: `type in applySupersession`
- c0069 ..> c0245: `type in checkpointOutcome`
- c0069 ..> c0245: `type in composeMerge`
- c0069 ..> c0245: `type in correctCandidateFailures`
- c0069 ..> c0245: `type in correlation`
- c0069 ..> c0245: `type in createMemory`
- c0069 ..> c0245: `type in decideOverlap`
- c0069 ..> c0245: `type in decideOverlapBatch`
- c0069 ..> c0245: `type in ensureModelCallAllowed`
- c0069 ..> c0245: `type in equivalentMemory`
- c0069 ..> c0245: `type in evidenceReadTool`
- c0069 ..> c0245: `type in executeLinkReview`
- c0069 ..> c0245: `type in executeLinkReviews`
- c0069 ..> c0245: `type in existingNeighborhood`
- c0069 ..> c0245: `type in finishMerge`
- c0069 ..> c0245: `type in finishReviewedSupersession`
- c0069 ..> c0245: `type in finishSupersession`
- c0069 ..> c0245: `type in loadCandidates`
- c0069 ..> c0245: `type in loadOverlaps`
- c0069 ..> c0245: `type in mergeCandidate`
- c0069 ..> c0245: `type in migrateLegacyLinkReview`
- c0069 ..> c0245: `type in neighborhoodEntities`
- c0069 ..> c0245: `type in neighborhoodEntity`
- c0069 ..> c0245: `type in neighborhoodMatches`
- c0069 ..> c0245: `type in neighborhoodRelationships`
- c0069 ..> c0245: `type in pauseCandidate`
- c0069 ..> c0245: `type in planLinkReviews`
- c0069 ..> c0245: `type in preflightRetirement`
- c0069 ..> c0245: `type in prepareDestination`
- c0069 ..> c0245: `type in prepareLinkReviews`
- c0069 ..> c0245: `type in prepareOverlapBatch`
- c0069 ..> c0245: `type in previousSupersessionCompleted`
- c0069 ..> c0245: `type in processBranchJob`
- c0069 ..> c0245: `type in processCandidate`
- c0069 ..> c0245: `type in processCandidates`
- c0069 ..> c0245: `type in processJob`
- c0069 ..> c0245: `type in processKnowledgeCheckpoint`
- c0069 ..> c0245: `type in processOrderedCandidates`
- c0069 ..> c0245: `type in processReplacementCheckpoint`
- c0069 ..> c0245: `type in readMaintenanceTargets`
- c0069 ..> c0245: `type in recordBranchFailure`
- c0069 ..> c0245: `type in recordCandidateFailure`
- c0069 ..> c0245: `type in recordEscalation`
- c0069 ..> c0245: `type in recordLinkReviewFailure`
- c0069 ..> c0245: `type in refreshLinkReview`
- c0069 ..> c0245: `type in retireCandidate`
- c0069 ..> c0245: `type in reviewExecutionFailure`
- c0069 ..> c0245: `type in reviewLinks`
- c0069 ..> c0245: `type in saveCorrectableFailure`
- c0069 ..> c0245: `type in skipCandidate`
- c0069 ..> c0245: `type in sourceInspectionTool`
- c0069 ..> c0245: `type in supersedeCandidate`
- c0069 ..> c0245: `type in supersessionAlreadyApplied`
- c0069 ..> c0245: `type in verifyRequestedMerge`
- c0069 ..> c0245: `type in writeKnowledge`
- c0069 ..> c0252: `type in recordSupersession`
- c0069 ..> c0265: `composeMerge() calls trim()`
- c0069 ..> c0265: `neighborhoodMatches() calls trim()`
- c0069 ..> c0265: `retireCandidate() calls trim()`
- c0069 ..> c0274: `composeMerge() calls captureConversation()`
- c0069 ..> c0274: `decideOverlap() calls captureConversation()`
- c0069 ..> c0274: `decideOverlapBatch() calls captureConversation()`
- c0069 ..> c0274: `loadCandidates() calls captureConversation()`
- c0069 ..> c0274: `planConflictReplacement() calls captureConversation()`
- c0069 ..> c0274: `planConflictReplacement() calls sanitizeCaptureConversation()`
- c0069 ..> c0274: `planLinkReviews() calls captureConversation()`
- c0069 ..> c0274: `reviewExecutionFailure() calls captureConversation()`
- c0069 ..> c0278: `sourceInspectionTool() calls inspect()`
- c0069 ..> c0278: `sourceInspectionTool() constructs SourceInspector`
- c0070 --> c0044: `field onActivity`
- c0070 --> c0092: `field getMode`
- c0070 --> c0108: `field client`
- c0070 --> c0114: `field model`
- c0070 --> c0214: `field logger`
- c0070 --> c0236: `field queue`
- c0071 --|> c0063: `inherits`
- c0072 --> c0106: `field selectedAdditionalEntries`
- c0073 --> c0048: `field candidate`
- c0073 --> c0111: `field oldMemory`
- c0073 --> c0245: `field fakeJob`
- c0075 --|> c0028: `inherits`
- c0075 ..> c0048: `type in constructor`
- c0076 --> c0106: `field additionalEntries`
- c0077 ..> c0041: `type in parseCandidates`
- c0077 ..> c0042: `type in eligibleCandidate`
- c0077 ..> c0042: `type in invalidCandidate`
- c0077 ..> c0042: `type in validCandidate`
- c0077 ..> c0048: `type in captureKnowledgePlan`
- c0077 ..> c0048: `type in captureProvenance`
- c0077 ..> c0048: `type in eligibleCandidate`
- c0077 ..> c0048: `type in memoryInput`
- c0077 ..> c0048: `type in overlapCandidate`
- c0077 ..> c0048: `type in sharedSourceEvidence`
- c0077 ..> c0048: `type in sourceEvidence`
- c0077 ..> c0052: `type in applyEnrichmentDecision`
- c0077 ..> c0052: `type in applyEquivalentCandidate`
- c0077 ..> c0052: `type in decisionConflictIds`
- c0077 ..> c0052: `type in firstConflictId`
- c0077 ..> c0052: `type in parseDecision`
- c0077 ..> c0052: `type in reusableMergeComposition`
- c0077 ..> c0060: `type in reusableMergeComposition`
- c0077 ..> c0072: `type in conflictResolutionEvidence`
- c0077 ..> c0074: `applyEnrichmentDecision() constructs InvalidCaptureOutput`
- c0077 ..> c0074: `applyEquivalentCandidate() constructs InvalidCaptureOutput`
- c0077 ..> c0074: `captureResource() constructs InvalidCaptureOutput`
- c0077 ..> c0074: `decisionEvidenceIds() constructs InvalidCaptureOutput`
- c0077 ..> c0074: `decisionMemoryId() constructs InvalidCaptureOutput`
- c0077 ..> c0074: `decisionMemoryIds() constructs InvalidCaptureOutput`
- c0077 ..> c0074: `decisionPartial() constructs InvalidCaptureOutput`
- c0077 ..> c0074: `decisionTargetMemoryId() constructs InvalidCaptureOutput`
- c0077 ..> c0074: `decisionText() constructs InvalidCaptureOutput`
- c0077 ..> c0074: `parseCandidates() constructs InvalidCaptureOutput`
- c0077 ..> c0074: `parseDecision() constructs InvalidCaptureOutput`
- c0077 ..> c0077: `appendSubmissionRejection() calls boundedSubmissionRejections()`
- c0077 ..> c0077: `captureEvidenceError() calls record()`
- c0077 ..> c0077: `captureEvidenceError() calls stringValue()`
- c0077 ..> c0077: `captureKnowledgePlan() calls captureProvenance()`
- c0077 ..> c0077: `captureKnowledgePlan() calls resourceInput()`
- c0077 ..> c0077: `captureResource() calls record()`
- c0077 ..> c0077: `currentProjectId() calls projectId()`
- c0077 ..> c0077: `decisionMemoryId() calls projectId()`
- c0077 ..> c0077: `decisionMemoryIds() calls projectId()`
- c0077 ..> c0077: `decisionTargetMemoryId() calls projectId()`
- c0077 ..> c0077: `eligibleCandidate() calls captureEvidenceError()`
- c0077 ..> c0077: `eligibleCandidate() calls captureResource()`
- c0077 ..> c0077: `eligibleCandidate() calls invalidCandidate()`
- c0077 ..> c0077: `eligibleCandidate() calls record()`
- c0077 ..> c0077: `eligibleCandidate() calls stringValue()`
- c0077 ..> c0077: `eligibleCandidate() calls validCandidate()`
- c0077 ..> c0077: `isFinalOutcome() calls record()`
- c0077 ..> c0077: `memoryInput() calls captureProvenance()`
- c0077 ..> c0077: `parseCandidates() calls eligibleCandidate()`
- c0077 ..> c0077: `parseCandidates() calls record()`
- c0077 ..> c0077: `parseCandidates() calls stringValue()`
- c0077 ..> c0077: `parseDecision() calls applyEnrichmentDecision()`
- c0077 ..> c0077: `parseDecision() calls applyEquivalentCandidate()`
- c0077 ..> c0077: `parseDecision() calls decisionEvidenceIds()`
- c0077 ..> c0077: `parseDecision() calls decisionMemoryId()`
- c0077 ..> c0077: `parseDecision() calls decisionMemoryIds()`
- c0077 ..> c0077: `parseDecision() calls decisionPartial()`
- c0077 ..> c0077: `parseDecision() calls decisionTargetMemoryId()`
- c0077 ..> c0077: `parseDecision() calls decisionText()`
- c0077 ..> c0077: `parseDecision() calls record()`
- c0077 ..> c0077: `resourceInput() calls record()`
- c0077 ..> c0077: `reusableMergeComposition() calls decisionConflictIds()`
- c0077 ..> c0077: `sharedSourceEvidence() calls sourceEvidence()`
- c0077 ..> c0077: `snapshotForPersistence() calls clone()`
- c0077 ..> c0077: `trustedAdditionalEntries() calls record()`
- c0077 ..> c0077: `trustedAdditionalEntries() calls stringValue()`
- c0077 ..> c0093: `type in captureCandidateSubmission`
- c0077 ..> c0093: `type in captureEvidenceError`
- c0077 ..> c0093: `type in captureWorkMetadata`
- c0077 ..> c0093: `type in eligibleCandidate`
- c0077 ..> c0093: `type in parseCandidates`
- c0077 ..> c0093: `type in sharedSourceEvidence`
- c0077 ..> c0093: `type in snapshotForPersistence`
- c0077 ..> c0093: `type in sourceEvidence`
- c0077 ..> c0106: `type in sharedSourceEvidence`
- c0077 ..> c0106: `type in sourceEvidence`
- c0077 ..> c0106: `type in trustedAdditionalEntries`
- c0077 ..> c0111: `type in captureKnowledgePlan`
- c0077 ..> c0113: `type in memoryInput`
- c0077 ..> c0121: `type in captureCandidateSubmission`
- c0077 ..> c0129: `type in captureKnowledgePlan`
- c0077 ..> c0129: `type in captureProvenance`
- c0077 ..> c0129: `type in currentProjectId`
- c0077 ..> c0129: `type in memoryInput`
- c0077 ..> c0169: `captureEvidenceError() calls get()`
- c0077 ..> c0169: `sourceEvidence() calls get()`
- c0077 ..> c0206: `type in captureKnowledgePlan`
- c0077 ..> c0232: `boundedSubmissionRejections() calls sanitizeText()`
- c0077 ..> c0232: `captureEvidenceError() calls isMemoryOperation()`
- c0077 ..> c0232: `captureEvidenceError() calls sanitizeText()`
- c0077 ..> c0232: `captureWorkMetadata() calls isMemoryOperation()`
- c0077 ..> c0232: `scrubError() calls errorMessage()`
- c0077 ..> c0232: `scrubError() calls sanitizeText()`
- c0077 ..> c0232: `strings() calls sanitizeText()`
- c0077 ..> c0232: `trustedAdditionalEntries() calls hasSensitiveData()`
- c0077 ..> c0232: `trustedAdditionalEntries() calls isMemoryOperation()`
- c0077 ..> c0232: `trustedAdditionalEntries() calls sanitizeText()`
- c0077 ..> c0265: `applyEnrichmentDecision() calls trim()`
- c0077 ..> c0265: `applyEquivalentCandidate() calls trim()`
- c0077 ..> c0265: `decisionEvidenceIds() calls trim()`
- c0077 ..> c0265: `eligibleCandidate() calls trim()`
- c0077 ..> c0265: `parseDecision() calls trim()`
- c0077 ..> c0265: `stringValue() calls trim()`
- c0077 ..> c0265: `strings() calls trim()`
- c0077 ..> c0274: `snapshotForPersistence() calls sanitizeCaptureSnapshot()`
- c0077 ..> c0278: `errorMessage() calls inspect()`
- c0079 --> c0080: `field instance`
- c0079 --> c0083: `field model`
- c0079 --> c0087: `field prompts`
- c0079 --> c0088: `field scopeSource`
- c0079 --> c0089: `field verbosity`
- c0079 --> c0092: `field captureMode`
- c0079 --> c0126: `field scope`
- c0079 --> c0215: `field logging`
- c0090 ..> c0009: `writeJson() calls open()`
- c0090 ..> c0009: `writeJson() calls sync()`
- c0090 ..> c0069: `resolveLogDirectory() calls resolve()`
- c0090 ..> c0079: `type in loadForgetfulConfig`
- c0090 ..> c0081: `type in readJson`
- c0090 ..> c0081: `type in resolveScope`
- c0090 ..> c0082: `type in loadForgetfulConfig`
- c0090 ..> c0083: `type in modelToString`
- c0090 ..> c0083: `type in parseModel`
- c0090 ..> c0085: `type in resolveVerbosity`
- c0090 ..> c0085: `type in updateUserSettings`
- c0090 ..> c0087: `type in mergePrompts`
- c0090 ..> c0087: `type in readPromptDirectory`
- c0090 ..> c0088: `type in resolveScope`
- c0090 ..> c0089: `type in isVerbosity`
- c0090 ..> c0089: `type in resolveVerbosity`
- c0090 ..> c0090: `loadForgetfulConfig() calls asBoolean()`
- c0090 ..> c0090: `loadForgetfulConfig() calls asPositiveInteger()`
- c0090 ..> c0090: `loadForgetfulConfig() calls asString()`
- c0090 ..> c0090: `loadForgetfulConfig() calls defaultAgentDir()`
- c0090 ..> c0090: `loadForgetfulConfig() calls isFileLogLevel()`
- c0090 ..> c0090: `loadForgetfulConfig() calls isRecord()`
- c0090 ..> c0090: `loadForgetfulConfig() calls mergePrompts()`
- c0090 ..> c0090: `loadForgetfulConfig() calls parseModel()`
- c0090 ..> c0090: `loadForgetfulConfig() calls projectSettingsPath()`
- c0090 ..> c0090: `loadForgetfulConfig() calls readJson()`
- c0090 ..> c0090: `loadForgetfulConfig() calls readPromptDirectory()`
- c0090 ..> c0090: `loadForgetfulConfig() calls resolveCaptureMode()`
- c0090 ..> c0090: `loadForgetfulConfig() calls resolveContextLimit()`
- c0090 ..> c0090: `loadForgetfulConfig() calls resolveLogDirectory()`
- c0090 ..> c0090: `loadForgetfulConfig() calls resolveRecallConcurrency()`
- c0090 ..> c0090: `loadForgetfulConfig() calls resolveScope()`
- c0090 ..> c0090: `loadForgetfulConfig() calls resolveVerbosity()`
- c0090 ..> c0090: `loadForgetfulConfig() calls userSettingsPath()`
- c0090 ..> c0090: `parseModel() calls isRecord()`
- c0090 ..> c0090: `readPlanningPanel() calls isRecord()`
- c0090 ..> c0090: `readPlanningPanel() calls readJson()`
- c0090 ..> c0090: `resolveRecallConcurrency() calls isRecallConcurrency()`
- c0090 ..> c0090: `resolveScope() calls isRecord()`
- c0090 ..> c0090: `resolveVerbosity() calls isVerbosity()`
- c0090 ..> c0090: `updateForgetfulConnection() calls isRecord()`
- c0090 ..> c0090: `updateForgetfulConnection() calls readJson()`
- c0090 ..> c0090: `updateForgetfulConnection() calls writeJson()`
- c0090 ..> c0090: `updateUserSettings() calls isRecord()`
- c0090 ..> c0090: `updateUserSettings() calls readJson()`
- c0090 ..> c0090: `updateUserSettings() calls writeJson()`
- c0090 ..> c0090: `userSettingsPath() calls defaultAgentDir()`
- c0090 ..> c0090: `writeProjectScope() calls projectSettingsPath()`
- c0090 ..> c0090: `writeProjectScope() calls writeJson()`
- c0090 ..> c0092: `type in resolveCaptureMode`
- c0090 ..> c0126: `type in resolveScope`
- c0090 ..> c0126: `type in writeProjectScope`
- c0090 ..> c0196: `readJson() calls readFile()`
- c0090 ..> c0196: `readPromptDirectory() calls readFile()`
- c0090 ..> c0215: `type in isFileLogLevel`
- c0090 ..> c0216: `writeJson() calls close()`
- c0090 ..> c0265: `asString() calls trim()`
- c0090 ..> c0265: `parseModel() calls trim()`
- c0090 ..> c0265: `readPromptDirectory() calls trim()`
- c0090 ..> c0265: `resolveLogDirectory() calls trim()`
- c0093 --> c0091: `field historySummary`
- c0093 --> c0092: `field mode`
- c0093 --> c0106: `field entries`
- c0093 --> c0126: `field scope`
- c0093 --> c0129: `field context`
- c0094 --|> c0095: `inherits`
- c0095 --|> c0125: `inherits`
- c0098 --|> c0099: `inherits`
- c0099 --|> c0125: `inherits`
- c0101 --|> c0102: `inherits`
- c0102 --> c0105: `field entity_type`
- c0102 --|> c0125: `inherits`
- c0103 --|> c0104: `inherits`
- c0104 --|> c0125: `inherits`
- c0108 --> c0109: `field knowledge`
- c0108 ..> c0111: `type in get`
- c0108 ..> c0111: `type in search`
- c0108 ..> c0112: `type in create`
- c0108 ..> c0113: `type in create`
- c0108 ..> c0115: `type in queryMemory`
- c0108 ..> c0123: `type in createProject`
- c0108 ..> c0123: `type in linkProject`
- c0108 ..> c0123: `type in listProjects`
- c0108 ..> c0124: `type in createProject`
- c0108 ..> c0127: `type in queryMemory`
- c0108 ..> c0127: `type in search`
- c0109 ..> c0094: `type in createCodeArtifact`
- c0109 ..> c0094: `type in getCodeArtifact`
- c0109 ..> c0094: `type in updateCodeArtifact`
- c0109 ..> c0095: `type in createCodeArtifact`
- c0109 ..> c0095: `type in updateCodeArtifact`
- c0109 ..> c0096: `type in listCodeArtifacts`
- c0109 ..> c0098: `type in createDocument`
- c0109 ..> c0098: `type in getDocument`
- c0109 ..> c0098: `type in updateDocument`
- c0109 ..> c0099: `type in createDocument`
- c0109 ..> c0099: `type in updateDocument`
- c0109 ..> c0100: `type in listDocuments`
- c0109 ..> c0101: `type in createEntity`
- c0109 ..> c0101: `type in getEntity`
- c0109 ..> c0101: `type in searchEntities`
- c0109 ..> c0101: `type in updateEntity`
- c0109 ..> c0102: `type in createEntity`
- c0109 ..> c0102: `type in updateEntity`
- c0109 ..> c0103: `type in createRelationship`
- c0109 ..> c0103: `type in getRelationships`
- c0109 ..> c0104: `type in createRelationship`
- c0109 ..> c0107: `type in listFiles`
- c0109 ..> c0111: `type in updateMemory`
- c0109 ..> c0113: `type in updateMemory`
- c0109 ..> c0128: `type in getFile`
- c0110 --> c0111: `field memory`
- c0111 --|> c0113: `inherits`
- c0114 ..> c0119: `type in complete`
- c0114 ..> c0119: `type in prepareCapture`
- c0115 --> c0110: `field linked_memories`
- c0115 --> c0111: `field primary_memories`
- c0119 --> c0097: `field onConversationCompacted`
- c0119 --> c0118: `field readTools`
- c0119 --> c0121: `field submission`
- c0128 --|> c0107: `inherits`
- c0129 --> c0123: `field project`
- c0134 --|> c0135: `inherits`
- c0135 --> c0130: `field status`
- c0137 --> c0133: `field criteria`
- c0137 --|> c0138: `inherits`
- c0138 --> c0140: `field priority`
- c0138 --> c0141: `field state`
- c0139 --|> c0138: `inherits`
- c0142 ..> c0132: `type in taskCounts`
- c0142 ..> c0135: `type in sortPlans`
- c0142 ..> c0136: `type in mappedProject`
- c0142 ..> c0139: `type in activeTasks`
- c0142 ..> c0139: `type in taskCounts`
- c0146 --> c0143: `field outcome`
- c0146 --> c0147: `field state`
- c0148 ..> c0049: `type in checkpoint`
- c0148 ..> c0050: `type in checkpoint`
- c0148 ..> c0093: `type in enqueue`
- c0148 ..> c0106: `type in resolveConflict`
- c0151 --> c0123: `field projects`
- c0151 --|> c0129: `inherits`
- c0152 --> c0079: `field createCapture`
- c0152 --> c0079: `field createRecall`
- c0152 --> c0108: `field client`
- c0152 --> c0108: `field createCapture`
- c0152 --> c0108: `field createClient`
- c0152 --> c0108: `field createRecall`
- c0152 --> c0148: `field capture`
- c0152 --> c0148: `field createCapture`
- c0152 --> c0151: `field resolveWorkContext`
- c0152 --> c0160: `field createRecall`
- c0152 --> c0160: `field recall`
- c0152 --> c0228: `field createCapture`
- c0152 --> c0228: `field createRecall`
- c0153 --> c0082: `field config`
- c0153 --> c0152: `field dependencies`
- c0153 --> c0155: `field policies`
- c0156 --> c0079: `field config`
- c0156 --> c0108: `field client`
- c0156 --> c0151: `field context`
- c0156 --> c0160: `field recall`
- c0156 --> c0216: `field logger`
- c0156 --> c0228: `field model`
- c0157 --> c0126: `field scope`
- c0159 --> c0161: `field runtime`
- c0159 --> c0259: `field promise`
- c0159 --> c0259: `field result`
- c0160 ..> c0106: `type in recall`
- c0160 ..> c0256: `type in deeper`
- c0160 ..> c0258: `type in recall`
- c0160 ..> c0259: `type in deeper`
- c0160 ..> c0259: `type in recall`
- c0161 --> c0004: `field activity`
- c0161 --> c0025: `field planning`
- c0161 --> c0047: `field captureDeferrals`
- c0161 --> c0050: `field recoveryResult`
- c0161 --> c0079: `field config`
- c0161 --> c0108: `field client`
- c0161 --> c0147: `field pendingCaptureJobs`
- c0161 --> c0148: `field capture`
- c0161 --> c0151: `field context`
- c0161 --> c0157: `field lastRecall`
- c0161 --> c0160: `field recall`
- c0161 --> c0216: `field logger`
- c0161 --> c0228: `field model`
- c0161 --> c0236: `field queue`
- c0163 --> c0144: `field automaticRecalls`
- c0163 --> c0154: `field pendingQueuedRecall`
- c0163 --> c0159: `field recallJobs`
- c0163 --> c0161: `field loading`
- c0163 --> c0161: `field runtime`
- c0164 ..> c0004: `collectCaptureFeedback() calls set()`
- c0164 ..> c0004: `diagnosticCandidateDetail() calls set()`
- c0164 ..> c0004: `pickMemoryModel() calls refresh()`
- c0164 ..> c0009: `createForgetfulExtension() calls setPromptActive()`
- c0164 ..> c0050: `type in captureProcessedJobIds`
- c0164 ..> c0050: `type in readCaptureOutcome`
- c0164 ..> c0069: `log() calls emit()`
- c0164 ..> c0069: `logFailure() calls emit()`
- c0164 ..> c0069: `readCaptureOutcome() calls diagnostics()`
- c0164 ..> c0069: `recordRecallActivity() calls emit()`
- c0164 ..> c0069: `textMessage() calls now()`
- c0164 ..> c0079: `type in log`
- c0164 ..> c0079: `type in logFailure`
- c0164 ..> c0079: `type in makeInstanceId`
- c0164 ..> c0079: `type in policyText`
- c0164 ..> c0079: `type in promptSetupEndpoint`
- c0164 ..> c0083: `type in parseSelection`
- c0164 ..> c0089: `type in log`
- c0164 ..> c0106: `type in recallContextEntries`
- c0164 ..> c0143: `type in automaticCaptureJobOutcome`
- c0164 ..> c0143: `type in readCaptureOutcome`
- c0164 ..> c0143: `type in recordCaptureRetry`
- c0164 ..> c0145: `type in boundedWait`
- c0164 ..> c0146: `type in automaticCaptureFeedback`
- c0164 ..> c0146: `type in collectCaptureFeedback`
- c0164 ..> c0146: `type in recordCaptureRetry`
- c0164 ..> c0148: `type in readCaptureOutcome`
- c0164 ..> c0150: `type in collectDiagnosticParts`
- c0164 ..> c0151: `type in defaultWorkContext`
- c0164 ..> c0151: `type in discoverWorkContext`
- c0164 ..> c0151: `type in snapshotWorkContext`
- c0164 ..> c0153: `type in createForgetfulExtension`
- c0164 ..> c0155: `type in policyText`
- c0164 ..> c0157: `type in recallActivitySummary`
- c0164 ..> c0161: `type in conflictBelongsToActiveBranch`
- c0164 ..> c0161: `type in readCaptureOutcome`
- c0164 ..> c0161: `type in recordRecallActivity`
- c0164 ..> c0162: `type in promptSetupAuthentication`
- c0164 ..> c0164: `automaticCaptureFeedback() calls captureCount()`
- c0164 ..> c0164: `automaticCaptureFeedback() calls captureFeedbackParts()`
- c0164 ..> c0164: `automaticCaptureFeedback() calls collectCaptureFeedback()`
- c0164 ..> c0164: `automaticCaptureJobOutcome() calls boundedErrorDiagnostic()`
- c0164 ..> c0164: `automaticCaptureJobOutcome() calls captureFeedbackReason()`
- c0164 ..> c0164: `automaticRecallTerminalText() calls usefulRecallText()`
- c0164 ..> c0164: `canonicalRepository() calls qualifiedRepository()`
- c0164 ..> c0164: `captureFailurePart() calls captureCount()`
- c0164 ..> c0164: `captureFeedbackParts() calls captureCount()`
- c0164 ..> c0164: `captureFeedbackParts() calls captureFailurePart()`
- c0164 ..> c0164: `captureFeedbackParts() calls skippedReasonBreakdown()`
- c0164 ..> c0164: `collectCaptureFeedback() calls recordCaptureRetry()`
- c0164 ..> c0164: `collectDiagnosticParts() calls diagnosticCandidateDetail()`
- c0164 ..> c0164: `createForgetfulExtension() calls logFailure()`
- c0164 ..> c0164: `createForgetfulExtension() calls notify()`
- c0164 ..> c0164: `createForgetfulExtension() calls sessionKey()`
- c0164 ..> c0164: `diagnosticCandidateDetail() calls diagnosticSourceIds()`
- c0164 ..> c0164: `diagnosticSummary() calls collectDiagnosticParts()`
- c0164 ..> c0164: `discoverWorkContext() calls canonicalRepository()`
- c0164 ..> c0164: `discoverWorkContext() calls defaultWorkContext()`
- c0164 ..> c0164: `latestBranchUserEntry() calls messageContentText()`
- c0164 ..> c0164: `latestContextUserPrompt() calls messageContentText()`
- c0164 ..> c0164: `log() calls notify()`
- c0164 ..> c0164: `logFailure() calls boundedErrorDiagnostic()`
- c0164 ..> c0164: `logFailure() calls log()`
- c0164 ..> c0164: `pickMemoryModel() calls parseSelection()`
- c0164 ..> c0164: `promptSetupAuthentication() calls notify()`
- c0164 ..> c0164: `promptSetupEndpoint() calls notify()`
- c0164 ..> c0164: `promptSetupEndpoint() calls setupEndpointSuggestion()`
- c0164 ..> c0164: `readCaptureOutcome() calls automaticCaptureJobOutcome()`
- c0164 ..> c0164: `recallContextEntries() calls messageContentText()`
- c0164 ..> c0164: `recordRecallActivity() calls log()`
- c0164 ..> c0164: `recordRecallActivity() calls recallActivitySummary()`
- c0164 ..> c0164: `savedRecallResultText() calls usefulRecallText()`
- c0164 ..> c0165: `createForgetfulExtension() calls registerForegroundTool()`
- c0164 ..> c0169: `collectCaptureFeedback() calls get()`
- c0164 ..> c0169: `diagnosticCandidateDetail() calls get()`
- c0164 ..> c0169: `log() calls get()`
- c0164 ..> c0169: `logFailure() calls get()`
- c0164 ..> c0231: `pickMemoryModel() calls availableMemoryModels()`
- c0164 ..> c0231: `pickMemoryModel() calls modelLabel()`
- c0164 ..> c0231: `pickMemoryModel() calls modelSelectionFromModel()`
- c0164 ..> c0232: `automaticCaptureJobOutcome() calls sanitizeText()`
- c0164 ..> c0232: `automaticRecallTerminalText() calls sanitizeText()`
- c0164 ..> c0232: `boundedErrorDiagnostic() calls sanitizeText()`
- c0164 ..> c0232: `captureFeedbackReason() calls sanitizeText()`
- c0164 ..> c0232: `captureJobId() calls sanitizeText()`
- c0164 ..> c0232: `captureProcessedJobIds() calls sanitizeText()`
- c0164 ..> c0232: `diagnosticCandidateDetail() calls sanitizeText()`
- c0164 ..> c0232: `diagnosticSourceIds() calls sanitizeText()`
- c0164 ..> c0232: `log() calls sanitizeText()`
- c0164 ..> c0232: `recallActivitySummary() calls sanitizeText()`
- c0164 ..> c0232: `recallContextEntries() calls sanitizeText()`
- c0164 ..> c0232: `recordRecallActivity() calls sanitizeText()`
- c0164 ..> c0232: `usefulRecallText() calls sanitizeText()`
- c0164 ..> c0259: `type in automaticRecallResultStatus`
- c0164 ..> c0259: `type in automaticRecallTerminalText`
- c0164 ..> c0259: `type in recordRecallActivity`
- c0164 ..> c0259: `type in savedRecallResultText`
- c0164 ..> c0259: `type in usefulRecallText`
- c0164 ..> c0265: `canonicalRepository() calls trim()`
- c0164 ..> c0265: `captureFeedbackReason() calls trim()`
- c0164 ..> c0265: `createForgetfulExtension() calls trim()`
- c0164 ..> c0265: `promptSetupAuthentication() calls trim()`
- c0164 ..> c0265: `promptSetupEndpoint() calls trim()`
- c0164 ..> c0265: `recallContextEntries() calls trim()`
- c0164 ..> c0265: `setupEndpointSuggestion() calls trim()`
- c0164 ..> c0265: `usefulRecallText() calls trim()`
- c0164 ..> c0266: `qualifiedRepository() calls repositoryName()`
- c0166 ..> c0094: `type in createCodeArtifact`
- c0166 ..> c0094: `type in getCodeArtifact`
- c0166 ..> c0095: `type in createCodeArtifact`
- c0166 ..> c0095: `type in updateCodeArtifact`
- c0166 ..> c0096: `type in listCodeArtifacts`
- c0166 ..> c0098: `type in createDocument`
- c0166 ..> c0098: `type in getDocument`
- c0166 ..> c0099: `type in createDocument`
- c0166 ..> c0099: `type in updateDocument`
- c0166 ..> c0100: `type in listDocuments`
- c0166 ..> c0101: `type in createEntity`
- c0166 ..> c0101: `type in getEntity`
- c0166 ..> c0101: `type in searchEntities`
- c0166 ..> c0102: `type in createEntity`
- c0166 ..> c0102: `type in updateEntity`
- c0166 ..> c0103: `type in getRelationships`
- c0166 ..> c0104: `type in createRelationship`
- c0166 ..> c0107: `type in listFiles`
- c0166 ..|> c0109: `implements`
- c0166 --> c0111: `field parseMemory`
- c0166 ..> c0111: `type in constructor`
- c0166 ..> c0113: `type in updateMemory`
- c0166 ..> c0128: `type in getFile`
- c0166 --> c0167: `field request`
- c0166 ..> c0167: `type in constructor`
- c0166 ..> c0168: `createCodeArtifact() calls artifact()`
- c0166 ..> c0168: `createDocument() calls document()`
- c0166 ..> c0168: `createEntity() calls entity()`
- c0166 ..> c0168: `createRelationship() calls relationship()`
- c0166 ..> c0168: `createRelationship() calls requestSegment()`
- c0166 ..> c0168: `getCodeArtifact() calls artifact()`
- c0166 ..> c0168: `getCodeArtifact() calls requestSegment()`
- c0166 ..> c0168: `getDocument() calls document()`
- c0166 ..> c0168: `getDocument() calls requestSegment()`
- c0166 ..> c0168: `getEntity() calls entity()`
- c0166 ..> c0168: `getEntity() calls requestSegment()`
- c0166 ..> c0168: `getEntityMemories() calls id()`
- c0166 ..> c0168: `getEntityMemories() calls object()`
- c0166 ..> c0168: `getEntityMemories() calls records()`
- c0166 ..> c0168: `getEntityMemories() calls requestSegment()`
- c0166 ..> c0168: `getEntityMemories() calls text()`
- c0166 ..> c0168: `getFile() calls fileSummary()`
- c0166 ..> c0168: `getFile() calls object()`
- c0166 ..> c0168: `getFile() calls requestSegment()`
- c0166 ..> c0168: `getFile() calls text()`
- c0166 ..> c0168: `getRelationships() calls records()`
- c0166 ..> c0168: `getRelationships() calls requestSegment()`
- c0166 ..> c0168: `linkEntityMemory() calls object()`
- c0166 ..> c0168: `linkEntityMemory() calls requestSegment()`
- c0166 ..> c0168: `linkMemories() calls ids()`
- c0166 ..> c0168: `linkMemories() calls object()`
- c0166 ..> c0168: `linkMemories() calls requestSegment()`
- c0166 ..> c0168: `listCodeArtifacts() calls projectPath()`
- c0166 ..> c0168: `listCodeArtifacts() calls records()`
- c0166 ..> c0168: `listCodeArtifacts() calls summary()`
- c0166 ..> c0168: `listDocuments() calls projectPath()`
- c0166 ..> c0168: `listDocuments() calls records()`
- c0166 ..> c0168: `listDocuments() calls summary()`
- c0166 ..> c0168: `listFiles() calls projectPath()`
- c0166 ..> c0168: `listFiles() calls records()`
- c0166 ..> c0168: `searchEntities() calls records()`
- c0166 ..> c0168: `unlinkMemories() calls object()`
- c0166 ..> c0168: `unlinkMemories() calls requestSegment()`
- c0166 ..> c0168: `updateCodeArtifact() calls artifact()`
- c0166 ..> c0168: `updateCodeArtifact() calls requestSegment()`
- c0166 ..> c0168: `updateDocument() calls document()`
- c0166 ..> c0168: `updateDocument() calls requestSegment()`
- c0166 ..> c0168: `updateEntity() calls entity()`
- c0166 ..> c0168: `updateEntity() calls requestSegment()`
- c0166 ..> c0168: `updateMemory() calls requestSegment()`
- c0166 ..> c0173: `createCodeArtifact() calls request()`
- c0166 ..> c0173: `createDocument() calls request()`
- c0166 ..> c0173: `createEntity() calls request()`
- c0166 ..> c0173: `createRelationship() calls request()`
- c0166 ..> c0173: `getCodeArtifact() calls request()`
- c0166 ..> c0173: `getDocument() calls request()`
- c0166 ..> c0173: `getEntity() calls request()`
- c0166 ..> c0173: `getEntityMemories() calls request()`
- c0166 ..> c0173: `getFile() calls request()`
- c0166 ..> c0173: `getRelationships() calls request()`
- c0166 ..> c0173: `linkEntityMemory() calls request()`
- c0166 ..> c0173: `linkMemories() calls request()`
- c0166 ..> c0173: `listCodeArtifacts() calls request()`
- c0166 ..> c0173: `listDocuments() calls request()`
- c0166 ..> c0173: `listFiles() calls request()`
- c0166 ..> c0173: `searchEntities() calls request()`
- c0166 ..> c0173: `unlinkMemories() calls request()`
- c0166 ..> c0173: `updateCodeArtifact() calls request()`
- c0166 ..> c0173: `updateDocument() calls request()`
- c0166 ..> c0173: `updateEntity() calls request()`
- c0166 ..> c0173: `updateMemory() calls request()`
- c0166 ..> c0174: `getFile() constructs ForgetfulSchemaError`
- c0166 ..> c0174: `linkEntityMemory() constructs ForgetfulSchemaError`
- c0166 ..> c0174: `linkMemories() constructs ForgetfulSchemaError`
- c0166 ..> c0174: `unlinkMemories() constructs ForgetfulSchemaError`
- c0166 ..> c0176: `linkMemories() calls parseMemory()`
- c0166 ..> c0176: `updateMemory() calls parseMemory()`
- c0168 ..> c0094: `type in artifact`
- c0168 ..> c0095: `type in resourceBody`
- c0168 ..> c0096: `type in summary`
- c0168 ..> c0098: `type in document`
- c0168 ..> c0099: `type in resourceBody`
- c0168 ..> c0100: `type in summary`
- c0168 ..> c0101: `type in entity`
- c0168 ..> c0102: `type in entityBody`
- c0168 ..> c0103: `type in relationship`
- c0168 ..> c0104: `type in relationshipBody`
- c0168 ..> c0107: `type in fileSummary`
- c0168 ..> c0125: `type in provenance`
- c0168 ..> c0168: `artifact() calls id()`
- c0168 ..> c0168: `artifact() calls object()`
- c0168 ..> c0168: `artifact() calls resourceBody()`
- c0168 ..> c0168: `document() calls id()`
- c0168 ..> c0168: `document() calls object()`
- c0168 ..> c0168: `document() calls resourceBody()`
- c0168 ..> c0168: `entity() calls entityBody()`
- c0168 ..> c0168: `entity() calls id()`
- c0168 ..> c0168: `entity() calls object()`
- c0168 ..> c0168: `entityBody() calls ids()`
- c0168 ..> c0168: `entityBody() calls object()`
- c0168 ..> c0168: `entityBody() calls provenance()`
- c0168 ..> c0168: `entityBody() calls strings()`
- c0168 ..> c0168: `entityBody() calls text()`
- c0168 ..> c0168: `fileSummary() calls id()`
- c0168 ..> c0168: `fileSummary() calls object()`
- c0168 ..> c0168: `fileSummary() calls strings()`
- c0168 ..> c0168: `fileSummary() calls text()`
- c0168 ..> c0168: `memoryMetadata() calls ids()`
- c0168 ..> c0168: `memoryMetadata() calls provenance()`
- c0168 ..> c0168: `provenance() calls strings()`
- c0168 ..> c0168: `provenance() calls text()`
- c0168 ..> c0168: `records() calls object()`
- c0168 ..> c0168: `relationship() calls id()`
- c0168 ..> c0168: `relationship() calls object()`
- c0168 ..> c0168: `relationship() calls relationshipBody()`
- c0168 ..> c0168: `relationshipBody() calls id()`
- c0168 ..> c0168: `relationshipBody() calls object()`
- c0168 ..> c0168: `relationshipBody() calls provenance()`
- c0168 ..> c0168: `relationshipBody() calls text()`
- c0168 ..> c0168: `resourceBody() calls id()`
- c0168 ..> c0168: `resourceBody() calls object()`
- c0168 ..> c0168: `resourceBody() calls provenance()`
- c0168 ..> c0168: `resourceBody() calls strings()`
- c0168 ..> c0168: `resourceBody() calls text()`
- c0168 ..> c0168: `summary() calls id()`
- c0168 ..> c0168: `summary() calls object()`
- c0168 ..> c0168: `summary() calls provenance()`
- c0168 ..> c0168: `summary() calls strings()`
- c0168 ..> c0168: `summary() calls text()`
- c0168 ..> c0174: `entityBody() constructs ForgetfulSchemaError`
- c0168 ..> c0174: `fileSummary() constructs ForgetfulSchemaError`
- c0168 ..> c0174: `id() constructs ForgetfulSchemaError`
- c0168 ..> c0174: `ids() constructs ForgetfulSchemaError`
- c0168 ..> c0174: `object() constructs ForgetfulSchemaError`
- c0168 ..> c0174: `records() constructs ForgetfulSchemaError`
- c0168 ..> c0174: `strings() constructs ForgetfulSchemaError`
- c0168 ..> c0174: `text() constructs ForgetfulSchemaError`
- c0168 ..> c0265: `text() calls trim()`
- c0169 ..> c0004: `listProjects() calls set()`
- c0169 ..|> c0108: `implements`
- c0169 ..> c0111: `type in get`
- c0169 ..> c0111: `type in search`
- c0169 ..> c0112: `type in create`
- c0169 ..> c0113: `type in create`
- c0169 ..> c0115: `type in queryMemory`
- c0169 ..> c0123: `type in createProject`
- c0169 ..> c0123: `type in linkProject`
- c0169 ..> c0123: `type in listProjects`
- c0169 ..> c0124: `type in createProject`
- c0169 ..> c0127: `type in queryMemory`
- c0169 ..> c0127: `type in search`
- c0169 ..> c0168: `get() calls requestSegment()`
- c0169 ..> c0168: `getMemoryEntityIds() calls requestSegment()`
- c0169 ..> c0168: `obsolete() calls requestSegment()`
- c0169 ..> c0169: `linkProject() calls validId()`
- c0169 ..> c0169: `supersede() calls obsolete()`
- c0169 --|> c0173: `inherits`
- c0169 ..> c0173: `create() calls request()`
- c0169 ..> c0173: `createProject() calls request()`
- c0169 ..> c0173: `get() calls request()`
- c0169 ..> c0173: `getMemoryEntityIds() calls request()`
- c0169 ..> c0173: `linkProject() calls request()`
- c0169 ..> c0173: `listProjects() calls endpoint()`
- c0169 ..> c0173: `listProjects() calls request()`
- c0169 ..> c0173: `obsolete() calls request()`
- c0169 ..> c0173: `queryMemory() calls request()`
- c0169 ..> c0173: `search() calls request()`
- c0169 ..> c0174: `create() constructs ForgetfulSchemaError`
- c0169 ..> c0174: `getMemoryEntityIds() constructs ForgetfulSchemaError`
- c0169 ..> c0174: `listProjects() constructs ForgetfulSchemaError`
- c0169 ..> c0174: `obsolete() constructs ForgetfulSchemaError`
- c0169 ..> c0176: `create() calls integerArray()`
- c0169 ..> c0176: `create() calls isObject()`
- c0169 ..> c0176: `create() calls requiredInteger()`
- c0169 ..> c0176: `createProject() calls parseProject()`
- c0169 ..> c0176: `createProject() calls projectText()`
- c0169 ..> c0176: `get() calls parseMemory()`
- c0169 ..> c0176: `getMemoryEntityIds() calls directEntityId()`
- c0169 ..> c0176: `getMemoryEntityIds() calls isObject()`
- c0169 ..> c0176: `linkProject() calls parseProject()`
- c0169 ..> c0176: `listProjects() calls isObject()`
- c0169 ..> c0176: `listProjects() calls parseProject()`
- c0169 ..> c0176: `obsolete() calls isObject()`
- c0169 ..> c0176: `queryMemory() calls defaultWhenOmitted()`
- c0169 ..> c0176: `queryMemory() calls parseSearchPayload()`
- c0169 ..> c0176: `queryMemory() calls searchBody()`
- c0169 ..> c0176: `search() calls flattenSearchResult()`
- c0169 ..> c0176: `search() calls parseSearchPayload()`
- c0169 ..> c0176: `search() calls searchBody()`
- c0169 ..> c0266: `createProject() calls repositoryName()`
- c0169 ..> c0266: `linkProject() calls repositoryName()`
- c0173 ..> c0004: `readResponse() calls set()`
- c0173 ..> c0005: `readResponse() calls read()`
- c0173 ..> c0169: `readResponse() calls get()`
- c0173 ..> c0170: `type in constructor`
- c0173 ..> c0172: `throwResponseError() constructs ForgetfulHttpError`
- c0173 ..> c0173: `getDeployment() calls request()`
- c0173 ..> c0173: `getJson() calls request()`
- c0173 ..> c0173: `request() calls endpoint()`
- c0173 ..> c0173: `request() calls fetchImpl()`
- c0173 ..> c0173: `request() calls readResponse()`
- c0173 ..> c0173: `request() calls responseByteLimit()`
- c0173 ..> c0173: `request() calls throwResponseError()`
- c0173 ..> c0173: `throwResponseError() calls readResponse()`
- c0173 ..> c0174: `readResponse() constructs ForgetfulSchemaError`
- c0173 ..> c0175: `request() constructs ForgetfulTimeoutError`
- c0173 ..> c0176: `constructor() calls localHost()`
- c0173 ..> c0176: `constructor() calls trimTrailingSlashes()`
- c0173 ..> c0176: `request() calls makeAbortError()`
- c0173 ..> c0176: `request() calls parseJson()`
- c0173 ..> c0236: `readResponse() calls cancel()`
- c0176 ..> c0004: `uniqueMemories() calls set()`
- c0176 ..> c0110: `type in parseLinkedMemories`
- c0176 ..> c0111: `type in flattenSearchResult`
- c0176 ..> c0111: `type in parseMemory`
- c0176 ..> c0111: `type in uniqueMemories`
- c0176 ..> c0115: `type in flattenSearchResult`
- c0176 ..> c0115: `type in parseSearchPayload`
- c0176 ..> c0123: `type in parseProject`
- c0176 ..> c0127: `type in searchBody`
- c0176 ..> c0168: `parseMemory() calls memoryMetadata()`
- c0176 ..> c0171: `makeAbortError() constructs ForgetfulAbortError`
- c0176 ..> c0171: `type in makeAbortError`
- c0176 ..> c0174: `directEntityId() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `integerArray() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `nonNegativeInteger() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `optionalString() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `parseJson() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `parseLinkedMemories() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `parseMemory() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `parseProject() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `parseSearchPayload() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `requiredInteger() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `requiredString() constructs ForgetfulSchemaError`
- c0176 ..> c0174: `stringArray() constructs ForgetfulSchemaError`
- c0176 ..> c0176: `directEntityId() calls isObject()`
- c0176 ..> c0176: `directEntityId() calls requiredInteger()`
- c0176 ..> c0176: `flattenSearchResult() calls uniqueMemories()`
- c0176 ..> c0176: `parseLinkedMemories() calls isObject()`
- c0176 ..> c0176: `parseLinkedMemories() calls parseMemory()`
- c0176 ..> c0176: `parseLinkedMemories() calls requiredInteger()`
- c0176 ..> c0176: `parseMemory() calls integerArray()`
- c0176 ..> c0176: `parseMemory() calls isObject()`
- c0176 ..> c0176: `parseMemory() calls nonNegativeInteger()`
- c0176 ..> c0176: `parseMemory() calls optionalString()`
- c0176 ..> c0176: `parseMemory() calls requiredInteger()`
- c0176 ..> c0176: `parseMemory() calls requiredString()`
- c0176 ..> c0176: `parseMemory() calls stringArray()`
- c0176 ..> c0176: `parseProject() calls isObject()`
- c0176 ..> c0176: `parseProject() calls optionalString()`
- c0176 ..> c0176: `parseProject() calls requiredInteger()`
- c0176 ..> c0176: `parseProject() calls requiredString()`
- c0176 ..> c0176: `parseSearchPayload() calls isObject()`
- c0176 ..> c0176: `parseSearchPayload() calls nonNegativeInteger()`
- c0176 ..> c0176: `parseSearchPayload() calls parseLinkedMemories()`
- c0176 ..> c0176: `parseSearchPayload() calls parseMemory()`
- c0176 ..> c0176: `parseSearchPayload() calls requiredString()`
- c0176 ..> c0176: `searchBody() calls defaultWhenOmitted()`
- c0176 ..> c0265: `projectText() calls trim()`
- c0177 --> c0094: `field artifacts`
- c0177 --> c0098: `field documents`
- c0177 --> c0107: `field files`
- c0178 --|> c0179: `inherits`
- c0178 --> c0180: `field failures`
- c0179 --> c0111: `field memories`
- c0179 --> c0126: `field scope`
- c0181 ..> c0004: `collectRelationships() calls set()`
- c0181 ..> c0004: `findEntities() calls set()`
- c0181 ..> c0004: `resolveRelationshipEndpoints() calls set()`
- c0181 ..> c0094: `type in appendArtifactLines`
- c0181 ..> c0098: `type in appendDocumentLines`
- c0181 ..> c0101: `type in appendEntityLines`
- c0181 ..> c0101: `type in collectEntityMemories`
- c0181 ..> c0101: `type in collectRelationships`
- c0181 ..> c0101: `type in findEntities`
- c0181 ..> c0101: `type in findEntityMemories`
- c0181 ..> c0101: `type in findRelationships`
- c0181 ..> c0101: `type in formatExpansion`
- c0181 ..> c0101: `type in formatRelationships`
- c0181 ..> c0101: `type in resolveRelationshipEndpoints`
- c0181 ..> c0103: `type in collectRelationships`
- c0181 ..> c0103: `type in formatRelationships`
- c0181 ..> c0103: `type in resolveRelationshipEndpoints`
- c0181 ..> c0107: `type in appendFileLines`
- c0181 --> c0109: `field client`
- c0181 ..> c0109: `type in constructor`
- c0181 ..> c0166: `collectRelationships() calls getRelationships()`
- c0181 ..> c0166: `findAttachments() calls getCodeArtifact()`
- c0181 ..> c0166: `findAttachments() calls getDocument()`
- c0181 ..> c0166: `findAttachments() calls listFiles()`
- c0181 ..> c0166: `findEntities() calls getEntity()`
- c0181 ..> c0166: `findEntities() calls searchEntities()`
- c0181 ..> c0166: `findEntityMemories() calls getEntityMemories()`
- c0181 ..> c0166: `resolveRelationshipEndpoints() calls getEntity()`
- c0181 ..> c0169: `formatRelationships() calls get()`
- c0181 ..> c0177: `type in findAttachments`
- c0181 ..> c0177: `type in formatExpansion`
- c0181 ..> c0178: `type in collectEntityMemories`
- c0181 ..> c0178: `type in collectRelationships`
- c0181 ..> c0178: `type in findAttachments`
- c0181 ..> c0178: `type in findEntities`
- c0181 ..> c0178: `type in findEntityMemories`
- c0181 ..> c0178: `type in findRelationships`
- c0181 ..> c0178: `type in isAllowedEntityMemory`
- c0181 ..> c0178: `type in resolveRelationshipEndpoints`
- c0181 ..> c0179: `type in expand`
- c0181 ..> c0179: `type in formatRelationships`
- c0181 ..> c0180: `type in emptyExpansion`
- c0181 ..> c0180: `type in expand`
- c0181 ..> c0180: `type in formatExpansion`
- c0181 ..> c0181: `collectEntityMemories() calls isAllowedEntityMemory()`
- c0181 ..> c0181: `expand() calls emptyExpansion()`
- c0181 ..> c0181: `expand() calls findAttachments()`
- c0181 ..> c0181: `expand() calls findEntities()`
- c0181 ..> c0181: `expand() calls findEntityMemories()`
- c0181 ..> c0181: `expand() calls findRelationships()`
- c0181 ..> c0181: `expand() calls formatExpansion()`
- c0181 ..> c0181: `findEntityMemories() calls collectEntityMemories()`
- c0181 ..> c0181: `findRelationships() calls collectRelationships()`
- c0181 ..> c0181: `findRelationships() calls formatRelationships()`
- c0181 ..> c0181: `findRelationships() calls resolveRelationshipEndpoints()`
- c0181 ..> c0181: `formatExpansion() calls appendArtifactLines()`
- c0181 ..> c0181: `formatExpansion() calls appendDocumentLines()`
- c0181 ..> c0181: `formatExpansion() calls appendEntityLines()`
- c0181 ..> c0181: `formatExpansion() calls appendFileLines()`
- c0181 ..> c0181: `formatExpansion() calls appendLinkedMemoryLines()`
- c0181 ..> c0181: `formatExpansion() calls appendRelationshipLines()`
- c0181 ..> c0182: `type in constructor`
- c0181 ..> c0183: `type in appendLinkedMemoryLines`
- c0181 ..> c0183: `type in collectEntityMemories`
- c0181 ..> c0183: `type in findEntityMemories`
- c0181 ..> c0183: `type in formatExpansion`
- c0181 --> c0184: `field readMemory`
- c0181 ..> c0184: `type in constructor`
- c0181 ..> c0185: `type in appendRelationshipLines`
- c0181 ..> c0185: `type in findRelationships`
- c0181 ..> c0185: `type in formatExpansion`
- c0181 ..> c0185: `type in formatRelationships`
- c0181 ..> c0186: `appendArtifactLines() calls clean()`
- c0181 ..> c0186: `appendDocumentLines() calls clean()`
- c0181 ..> c0186: `appendEntityLines() calls clean()`
- c0181 ..> c0186: `appendFileLines() calls clean()`
- c0181 ..> c0186: `appendLinkedMemoryLines() calls clean()`
- c0181 ..> c0186: `appendRelationshipLines() calls clean()`
- c0181 ..> c0186: `collectEntityMemories() calls validId()`
- c0181 ..> c0186: `collectRelationships() calls safeCall()`
- c0181 ..> c0186: `collectRelationships() calls validRelationship()`
- c0181 ..> c0186: `expand() calls safeCall()`
- c0181 ..> c0186: `findAttachments() calls inProjectScope()`
- c0181 ..> c0186: `findAttachments() calls safeCall()`
- c0181 ..> c0186: `findAttachments() calls validId()`
- c0181 ..> c0186: `findEntities() calls inEntityScope()`
- c0181 ..> c0186: `findEntities() calls safeCall()`
- c0181 ..> c0186: `findEntities() calls validEntity()`
- c0181 ..> c0186: `findEntityMemories() calls safeCall()`
- c0181 ..> c0186: `formatRelationships() calls inEntityScope()`
- c0181 ..> c0186: `isAllowedEntityMemory() calls safeCall()`
- c0181 ..> c0186: `isAllowedEntityMemory() calls validMemory()`
- c0181 ..> c0186: `resolveRelationshipEndpoints() calls safeCall()`
- c0181 ..> c0186: `resolveRelationshipEndpoints() calls validEntity()`
- c0181 ..> c0232: `expand() calls errorMessage()`
- c0181 ..> c0265: `findEntities() calls trim()`
- c0182 --> c0184: `field readMemory`
- c0183 --> c0101: `field entity`
- c0185 --> c0101: `field source`
- c0185 --> c0101: `field target`
- c0185 --> c0103: `field relationship`
- c0186 ..> c0101: `type in inEntityScope`
- c0186 ..> c0101: `type in validEntity`
- c0186 ..> c0103: `type in validRelationship`
- c0186 ..> c0111: `type in validMemory`
- c0186 ..> c0126: `type in inEntityScope`
- c0186 ..> c0126: `type in inProjectScope`
- c0186 ..> c0178: `type in safeCall`
- c0186 ..> c0186: `inEntityScope() calls validId()`
- c0186 ..> c0186: `inProjectScope() calls validId()`
- c0186 ..> c0186: `validEntity() calls validId()`
- c0186 ..> c0186: `validMemory() calls validId()`
- c0186 ..> c0186: `validRelationship() calls validId()`
- c0186 ..> c0232: `clean() calls sanitizeText()`
- c0186 ..> c0232: `safeCall() calls errorMessage()`
- c0186 ..> c0232: `safeCall() calls sanitizeText()`
- c0186 ..> c0265: `validRelationship() calls trim()`
- c0187 --> c0108: `field client`
- c0187 --> c0109: `field knowledge`
- c0187 --> c0188: `field request`
- c0187 --> c0189: `field context`
- c0189 --> c0126: `field scope`
- c0190 --> c0128: `field file`
- c0190 --> c0194: `field content`
- c0190 --> c0195: `field content`
- c0191 --> c0108: `field client`
- c0191 --> c0109: `field knowledge`
- c0191 --> c0189: `field context`
- c0191 --> c0192: `field request`
- c0196 ..> c0094: `type in page`
- c0196 ..> c0098: `type in page`
- c0196 ..> c0101: `type in assertReadEntity`
- c0196 ..> c0101: `type in entityInProject`
- c0196 ..> c0101: `type in hydrateEntities`
- c0196 ..> c0101: `type in inEntityProject`
- c0196 ..> c0105: `type in isEntityType`
- c0196 ..> c0108: `type in assertReadMemory`
- c0196 ..> c0108: `type in createMemory`
- c0196 ..> c0108: `type in executeKnowledgeRead`
- c0196 ..> c0108: `type in executeKnowledgeWrite`
- c0196 ..> c0108: `type in memoryInProject`
- c0196 ..> c0108: `type in resolveWriteProject`
- c0196 ..> c0108: `type in rich`
- c0196 ..> c0109: `type in assertReadEntity`
- c0196 ..> c0109: `type in createCodeArtifact`
- c0196 ..> c0109: `type in createDocument`
- c0196 ..> c0109: `type in createEntity`
- c0196 ..> c0109: `type in entityInProject`
- c0196 ..> c0109: `type in hydrateEntities`
- c0196 ..> c0109: `type in requireReadKnowledge`
- c0196 ..> c0109: `type in rich`
- c0196 ..> c0109: `type in validateAttachments`
- c0196 ..> c0111: `type in assertReadMemory`
- c0196 ..> c0111: `type in inMemoryProject`
- c0196 ..> c0111: `type in memoryInProject`
- c0196 ..> c0111: `type in replacementMemory`
- c0196 ..> c0125: `type in updateProvenance`
- c0196 ..> c0128: `type in fileContent`
- c0196 ..> c0166: `assertReadEntity() calls getEntity()`
- c0196 ..> c0166: `createCodeArtifact() calls createCodeArtifact()`
- c0196 ..> c0166: `createDocument() calls createDocument()`
- c0196 ..> c0166: `createEntity() calls createEntity()`
- c0196 ..> c0166: `createRelationship() calls createRelationship()`
- c0196 ..> c0166: `entityInProject() calls getEntity()`
- c0196 ..> c0166: `hydrateEntities() calls getEntity()`
- c0196 ..> c0166: `linkEntityMemory() calls linkEntityMemory()`
- c0196 ..> c0166: `linkMemories() calls linkMemories()`
- c0196 ..> c0166: `readCodeArtifact() calls getCodeArtifact()`
- c0196 ..> c0166: `readCodeArtifacts() calls listCodeArtifacts()`
- c0196 ..> c0166: `readDocument() calls getDocument()`
- c0196 ..> c0166: `readDocuments() calls listDocuments()`
- c0196 ..> c0166: `readEntities() calls searchEntities()`
- c0196 ..> c0166: `readEntityMemories() calls getEntityMemories()`
- c0196 ..> c0166: `readFile() calls getFile()`
- c0196 ..> c0166: `readFiles() calls listFiles()`
- c0196 ..> c0166: `readRelationships() calls getEntity()`
- c0196 ..> c0166: `readRelationships() calls getRelationships()`
- c0196 ..> c0166: `updateCodeArtifact() calls getCodeArtifact()`
- c0196 ..> c0166: `updateCodeArtifact() calls updateCodeArtifact()`
- c0196 ..> c0166: `updateDocument() calls getDocument()`
- c0196 ..> c0166: `updateDocument() calls updateDocument()`
- c0196 ..> c0166: `updateEntity() calls updateEntity()`
- c0196 ..> c0166: `updateMemory() calls updateMemory()`
- c0196 ..> c0166: `validateAttachments() calls getCodeArtifact()`
- c0196 ..> c0166: `validateAttachments() calls getDocument()`
- c0196 ..> c0166: `validateAttachments() calls getFile()`
- c0196 ..> c0169: `assertReadMemory() calls get()`
- c0196 ..> c0169: `createMemory() calls create()`
- c0196 ..> c0169: `memoryInProject() calls get()`
- c0196 ..> c0169: `readEntityMemories() calls get()`
- c0196 ..> c0169: `readMemories() calls queryMemory()`
- c0196 ..> c0169: `readProjects() calls listProjects()`
- c0196 ..> c0169: `replacementMemory() calls create()`
- c0196 ..> c0169: `replacementMemory() calls get()`
- c0196 ..> c0169: `resolveWriteProject() calls listProjects()`
- c0196 ..> c0169: `supersedeMemory() calls supersede()`
- c0196 ..> c0187: `type in readCodeArtifact`
- c0196 ..> c0187: `type in readCodeArtifacts`
- c0196 ..> c0187: `type in readDocument`
- c0196 ..> c0187: `type in readDocuments`
- c0196 ..> c0187: `type in readEntities`
- c0196 ..> c0187: `type in readEntity`
- c0196 ..> c0187: `type in readEntityMemories`
- c0196 ..> c0187: `type in readFile`
- c0196 ..> c0187: `type in readFiles`
- c0196 ..> c0187: `type in readMemories`
- c0196 ..> c0187: `type in readMemory`
- c0196 ..> c0187: `type in readProjects`
- c0196 ..> c0187: `type in readRelationships`
- c0196 ..> c0187: `type in requestedReadProject`
- c0196 ..> c0187: `type in requireReadKnowledge`
- c0196 ..> c0188: `type in executeKnowledgeRead`
- c0196 ..> c0188: `type in validateKnowledgeReadRequest`
- c0196 ..> c0189: `type in assertReadEntity`
- c0196 ..> c0189: `type in assertReadMemory`
- c0196 ..> c0189: `type in createCodeArtifact`
- c0196 ..> c0189: `type in createDocument`
- c0196 ..> c0189: `type in createEntity`
- c0196 ..> c0189: `type in createMemory`
- c0196 ..> c0189: `type in currentProject`
- c0196 ..> c0189: `type in effectiveCommit`
- c0196 ..> c0189: `type in executeKnowledgeRead`
- c0196 ..> c0189: `type in executeKnowledgeWrite`
- c0196 ..> c0189: `type in provenance`
- c0196 ..> c0189: `type in resolveWriteProject`
- c0196 ..> c0189: `type in updateProvenance`
- c0196 ..> c0190: `type in createCodeArtifact`
- c0196 ..> c0190: `type in createDocument`
- c0196 ..> c0190: `type in createEntity`
- c0196 ..> c0190: `type in createMemory`
- c0196 ..> c0190: `type in createRelationship`
- c0196 ..> c0190: `type in executeKnowledgeRead`
- c0196 ..> c0190: `type in executeKnowledgeWrite`
- c0196 ..> c0190: `type in linkEntityMemory`
- c0196 ..> c0190: `type in linkMemories`
- c0196 ..> c0190: `type in readCodeArtifact`
- c0196 ..> c0190: `type in readCodeArtifacts`
- c0196 ..> c0190: `type in readDocument`
- c0196 ..> c0190: `type in readDocuments`
- c0196 ..> c0190: `type in readEntities`
- c0196 ..> c0190: `type in readEntity`
- c0196 ..> c0190: `type in readEntityMemories`
- c0196 ..> c0190: `type in readFile`
- c0196 ..> c0190: `type in readFiles`
- c0196 ..> c0190: `type in readMemories`
- c0196 ..> c0190: `type in readMemory`
- c0196 ..> c0190: `type in readProjects`
- c0196 ..> c0190: `type in readRelationships`
- c0196 ..> c0190: `type in readResult`
- c0196 ..> c0190: `type in supersedeMemory`
- c0196 ..> c0190: `type in updateCodeArtifact`
- c0196 ..> c0190: `type in updateDocument`
- c0196 ..> c0190: `type in updateEntity`
- c0196 ..> c0190: `type in updateMemory`
- c0196 ..> c0190: `type in writeResult`
- c0196 ..> c0191: `type in createRelationship`
- c0196 ..> c0191: `type in linkEntityMemory`
- c0196 ..> c0191: `type in linkMemories`
- c0196 ..> c0191: `type in replacementMemory`
- c0196 ..> c0191: `type in supersedeMemory`
- c0196 ..> c0191: `type in updateCodeArtifact`
- c0196 ..> c0191: `type in updateDocument`
- c0196 ..> c0191: `type in updateEntity`
- c0196 ..> c0191: `type in updateMemory`
- c0196 ..> c0192: `type in executeKnowledgeWrite`
- c0196 ..> c0192: `type in validateKnowledgeWriteRequest`
- c0196 ..> c0193: `type in resolveWriteProject`
- c0196 ..> c0194: `type in fileContent`
- c0196 ..> c0195: `type in fileContent`
- c0196 ..> c0196: `assertReadEntity() calls currentProject()`
- c0196 ..> c0196: `assertReadEntity() calls inEntityProject()`
- c0196 ..> c0196: `assertReadMemory() calls currentProject()`
- c0196 ..> c0196: `assertReadMemory() calls inMemoryProject()`
- c0196 ..> c0196: `boundedId() calls optionalId()`
- c0196 ..> c0196: `boundedListPage() calls compactWriteValue()`
- c0196 ..> c0196: `boundedListPage() calls json()`
- c0196 ..> c0196: `boundedListPage() calls listPage()`
- c0196 ..> c0196: `commit() calls optionalText()`
- c0196 ..> c0196: `compactObjectEntry() calls compactWriteValue()`
- c0196 ..> c0196: `compactWriteValue() calls compactObjectEntry()`
- c0196 ..> c0196: `compactWriteValue() calls compactString()`
- c0196 ..> c0196: `createCodeArtifact() calls beforeMutation()`
- c0196 ..> c0196: `createCodeArtifact() calls provenance()`
- c0196 ..> c0196: `createCodeArtifact() calls writeResult()`
- c0196 ..> c0196: `createDocument() calls beforeMutation()`
- c0196 ..> c0196: `createDocument() calls provenance()`
- c0196 ..> c0196: `createDocument() calls writeResult()`
- c0196 ..> c0196: `createEntity() calls beforeMutation()`
- c0196 ..> c0196: `createEntity() calls provenance()`
- c0196 ..> c0196: `createEntity() calls writeResult()`
- c0196 ..> c0196: `createMemory() calls beforeMutation()`
- c0196 ..> c0196: `createMemory() calls provenance()`
- c0196 ..> c0196: `createMemory() calls rich()`
- c0196 ..> c0196: `createMemory() calls validateAttachments()`
- c0196 ..> c0196: `createMemory() calls writeResult()`
- c0196 ..> c0196: `createRelationship() calls beforeMutation()`
- c0196 ..> c0196: `createRelationship() calls entityInProject()`
- c0196 ..> c0196: `createRelationship() calls provenance()`
- c0196 ..> c0196: `createRelationship() calls writeResult()`
- c0196 ..> c0196: `executeKnowledgeRead() calls currentProject()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readCodeArtifact()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readCodeArtifacts()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readDocument()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readDocuments()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readEntities()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readEntity()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readEntityMemories()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readFile()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readFiles()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readMemories()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readMemory()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readProjects()`
- c0196 ..> c0196: `executeKnowledgeRead() calls readRelationships()`
- c0196 ..> c0196: `executeKnowledgeRead() calls validateKnowledgeReadRequest()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls createCodeArtifact()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls createDocument()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls createEntity()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls createMemory()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls createRelationship()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls effectiveCommit()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls linkEntityMemory()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls linkMemories()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls rejectSensitiveInput()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls resolveWriteProject()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls rich()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls supersedeMemory()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls updateCodeArtifact()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls updateDocument()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls updateEntity()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls updateMemory()`
- c0196 ..> c0196: `executeKnowledgeWrite() calls validateKnowledgeWriteRequest()`
- c0196 ..> c0196: `fileContent() calls json()`
- c0196 ..> c0196: `linkEntityMemory() calls beforeMutation()`
- c0196 ..> c0196: `linkEntityMemory() calls entityInProject()`
- c0196 ..> c0196: `linkEntityMemory() calls memoryInProject()`
- c0196 ..> c0196: `linkEntityMemory() calls writeResult()`
- c0196 ..> c0196: `linkMemories() calls beforeMutation()`
- c0196 ..> c0196: `linkMemories() calls memoryInProject()`
- c0196 ..> c0196: `linkMemories() calls writeResult()`
- c0196 ..> c0196: `need() calls requiredText()`
- c0196 ..> c0196: `optionalId() calls requiredId()`
- c0196 ..> c0196: `optionalIds() calls requiredIds()`
- c0196 ..> c0196: `optionalStrings() calls requiredStrings()`
- c0196 ..> c0196: `optionalText() calls requiredText()`
- c0196 ..> c0196: `provenance() calls effectiveCommit()`
- c0196 ..> c0196: `readCodeArtifact() calls page()`
- c0196 ..> c0196: `readCodeArtifact() calls readResult()`
- c0196 ..> c0196: `readCodeArtifact() calls requireReadKnowledge()`
- c0196 ..> c0196: `readCodeArtifacts() calls boundedListPage()`
- c0196 ..> c0196: `readCodeArtifacts() calls readResult()`
- c0196 ..> c0196: `readCodeArtifacts() calls requestedReadProject()`
- c0196 ..> c0196: `readCodeArtifacts() calls requireReadKnowledge()`
- c0196 ..> c0196: `readDocument() calls page()`
- c0196 ..> c0196: `readDocument() calls readResult()`
- c0196 ..> c0196: `readDocument() calls requireReadKnowledge()`
- c0196 ..> c0196: `readDocuments() calls boundedListPage()`
- c0196 ..> c0196: `readDocuments() calls readResult()`
- c0196 ..> c0196: `readDocuments() calls requestedReadProject()`
- c0196 ..> c0196: `readDocuments() calls requireReadKnowledge()`
- c0196 ..> c0196: `readEntities() calls boundedListPage()`
- c0196 ..> c0196: `readEntities() calls hydrateEntities()`
- c0196 ..> c0196: `readEntities() calls inEntityProject()`
- c0196 ..> c0196: `readEntities() calls readResult()`
- c0196 ..> c0196: `readEntities() calls requestedReadProject()`
- c0196 ..> c0196: `readEntities() calls requireReadKnowledge()`
- c0196 ..> c0196: `readEntity() calls assertReadEntity()`
- c0196 ..> c0196: `readEntity() calls readResult()`
- c0196 ..> c0196: `readEntity() calls requireReadKnowledge()`
- c0196 ..> c0196: `readEntityMemories() calls assertReadEntity()`
- c0196 ..> c0196: `readEntityMemories() calls compactWriteValue()`
- c0196 ..> c0196: `readEntityMemories() calls inMemoryProject()`
- c0196 ..> c0196: `readEntityMemories() calls listPage()`
- c0196 ..> c0196: `readEntityMemories() calls readResult()`
- c0196 ..> c0196: `readEntityMemories() calls requireReadKnowledge()`
- c0196 ..> c0196: `readFile() calls fileContent()`
- c0196 ..> c0196: `readFile() calls requireReadKnowledge()`
- c0196 ..> c0196: `readFiles() calls boundedListPage()`
- c0196 ..> c0196: `readFiles() calls readResult()`
- c0196 ..> c0196: `readFiles() calls requestedReadProject()`
- c0196 ..> c0196: `readFiles() calls requireReadKnowledge()`
- c0196 ..> c0196: `readMemories() calls inMemoryProject()`
- c0196 ..> c0196: `readMemories() calls readResult()`
- c0196 ..> c0196: `readMemories() calls requestedReadProject()`
- c0196 ..> c0196: `readMemory() calls assertReadMemory()`
- c0196 ..> c0196: `readMemory() calls readResult()`
- c0196 ..> c0196: `readProjects() calls boundedListPage()`
- c0196 ..> c0196: `readProjects() calls readResult()`
- c0196 ..> c0196: `readRelationships() calls assertReadEntity()`
- c0196 ..> c0196: `readRelationships() calls inEntityProject()`
- c0196 ..> c0196: `readRelationships() calls listPage()`
- c0196 ..> c0196: `readRelationships() calls readResult()`
- c0196 ..> c0196: `readRelationships() calls requireReadKnowledge()`
- c0196 ..> c0196: `readResult() calls json()`
- c0196 ..> c0196: `rejectSensitiveInput() calls containsSensitiveData()`
- c0196 ..> c0196: `replacementMemory() calls beforeMutation()`
- c0196 ..> c0196: `replacementMemory() calls memoryInProject()`
- c0196 ..> c0196: `replacementMemory() calls provenance()`
- c0196 ..> c0196: `replacementMemory() calls validateAttachments()`
- c0196 ..> c0196: `requestedReadProject() calls currentProject()`
- c0196 ..> c0196: `requiredIds() calls requiredId()`
- c0196 ..> c0196: `requiredStrings() calls requiredText()`
- c0196 ..> c0196: `resolveWriteProject() calls currentProject()`
- c0196 ..> c0196: `supersedeMemory() calls beforeMutation()`
- c0196 ..> c0196: `supersedeMemory() calls memoryInProject()`
- c0196 ..> c0196: `supersedeMemory() calls replacementMemory()`
- c0196 ..> c0196: `supersedeMemory() calls writeResult()`
- c0196 ..> c0196: `updateCodeArtifact() calls beforeMutation()`
- c0196 ..> c0196: `updateCodeArtifact() calls updateProvenance()`
- c0196 ..> c0196: `updateCodeArtifact() calls writeResult()`
- c0196 ..> c0196: `updateDocument() calls beforeMutation()`
- c0196 ..> c0196: `updateDocument() calls updateProvenance()`
- c0196 ..> c0196: `updateDocument() calls writeResult()`
- c0196 ..> c0196: `updateEntity() calls beforeMutation()`
- c0196 ..> c0196: `updateEntity() calls entityInProject()`
- c0196 ..> c0196: `updateEntity() calls updateProvenance()`
- c0196 ..> c0196: `updateEntity() calls writeResult()`
- c0196 ..> c0196: `updateMemory() calls beforeMutation()`
- c0196 ..> c0196: `updateMemory() calls memoryInProject()`
- c0196 ..> c0196: `updateMemory() calls updateProvenance()`
- c0196 ..> c0196: `updateMemory() calls validateAttachments()`
- c0196 ..> c0196: `updateMemory() calls writeResult()`
- c0196 ..> c0196: `updateProvenance() calls effectiveCommit()`
- c0196 ..> c0196: `validateEntityFields() calls isEntityType()`
- c0196 ..> c0196: `validateEntityFields() calls optionalText()`
- c0196 ..> c0196: `validateKnowledgeReadRequest() calls checkOperation()`
- c0196 ..> c0196: `validateKnowledgeReadRequest() calls record()`
- c0196 ..> c0196: `validateKnowledgeReadRequest() calls validateReadPagination()`
- c0196 ..> c0196: `validateKnowledgeReadRequest() calls validateReadSearch()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls checkOperation()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls commit()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls need()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls optionalId()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls optionalIds()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls optionalImportance()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls optionalStrings()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls optionalText()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls record()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls requiredId()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls requiredIds()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls requiredStrings()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls requiredText()`
- c0196 ..> c0196: `validateKnowledgeWriteRequest() calls validateEntityFields()`
- c0196 ..> c0196: `validateReadPagination() calls boundedId()`
- c0196 ..> c0196: `writeResult() calls compactWriteValue()`
- c0196 ..> c0196: `writeResult() calls json()`
- c0196 ..> c0218: `replacementMemory() calls replacementMemoryContext()`
- c0196 ..> c0232: `containsSensitiveData() calls hasSensitiveData()`
- c0196 ..> c0265: `requiredText() calls trim()`
- c0196 ..> c0265: `resolveWriteProject() calls trim()`
- c0198 --> c0095: `field input`
- c0199 --> c0099: `field input`
- c0201 --> c0102: `field input`
- c0203 --> c0104: `field input`
- c0206 --> c0198: `field codeArtifacts`
- c0206 --> c0199: `field documents`
- c0206 --> c0200: `field entityMemoryLinks`
- c0206 --> c0201: `field entities`
- c0206 --> c0203: `field relationships`
- c0209 --> c0207: `field codeArtifacts`
- c0209 --> c0207: `field documents`
- c0209 --> c0207: `field entities`
- c0209 --> c0207: `field relationships`
- c0210 ..> c0094: `type in writeCodeArtifact`
- c0210 ..> c0098: `type in writeDocument`
- c0210 ..> c0101: `type in writeEntity`
- c0210 ..> c0103: `type in writeRelationship`
- c0210 ..> c0111: `type in attachmentIds`
- c0210 ..> c0111: `type in attachmentMemory`
- c0210 ..> c0111: `type in attachmentsDiffer`
- c0210 ..> c0166: `writeAttachments() calls updateMemory()`
- c0210 ..> c0166: `writeCodeArtifact() calls createCodeArtifact()`
- c0210 ..> c0166: `writeCodeArtifact() calls getCodeArtifact()`
- c0210 ..> c0166: `writeDocument() calls createDocument()`
- c0210 ..> c0166: `writeDocument() calls getDocument()`
- c0210 ..> c0166: `writeEntity() calls createEntity()`
- c0210 ..> c0166: `writeEntity() calls getEntity()`
- c0210 ..> c0166: `writeEntityMemoryLink() calls linkEntityMemory()`
- c0210 ..> c0166: `writeLinkedMemory() calls linkMemories()`
- c0210 ..> c0166: `writeRelationship() calls createRelationship()`
- c0210 ..> c0169: `createOnce() calls create()`
- c0210 ..> c0181: `attachmentMemory() calls readMemory()`
- c0210 ..> c0197: `type in attachmentIds`
- c0210 ..> c0197: `type in attachmentPatch`
- c0210 ..> c0197: `type in attachmentsDiffer`
- c0210 ..> c0197: `type in requestedAttachmentIds`
- c0210 ..> c0198: `type in writeCodeArtifact`
- c0210 ..> c0199: `type in writeDocument`
- c0210 ..> c0200: `type in writeEntityMemoryLink`
- c0210 ..> c0201: `type in writeEntity`
- c0210 --> c0202: `field readMemory`
- c0210 ..> c0202: `type in constructor`
- c0210 ..> c0203: `type in writeRelationship`
- c0210 ..> c0204: `type in execute`
- c0210 ..> c0205: `type in createOnce`
- c0210 ..> c0205: `type in execute`
- c0210 ..> c0205: `type in writeAttachments`
- c0210 ..> c0205: `type in writeCodeArtifact`
- c0210 ..> c0205: `type in writeCodeArtifacts`
- c0210 ..> c0205: `type in writeConnection`
- c0210 ..> c0205: `type in writeDocument`
- c0210 ..> c0205: `type in writeDocuments`
- c0210 ..> c0205: `type in writeEntities`
- c0210 ..> c0205: `type in writeEntity`
- c0210 ..> c0205: `type in writeEntityMemoryLink`
- c0210 ..> c0205: `type in writeEntityMemoryLinks`
- c0210 ..> c0205: `type in writeLinkedMemories`
- c0210 ..> c0205: `type in writeLinkedMemory`
- c0210 ..> c0205: `type in writeRelationship`
- c0210 ..> c0205: `type in writeRelationships`
- c0210 ..> c0206: `type in attachmentMemory`
- c0210 ..> c0206: `type in createOnce`
- c0210 ..> c0206: `type in execute`
- c0210 ..> c0206: `type in requestedAttachmentIds`
- c0210 ..> c0206: `type in writeAttachments`
- c0210 ..> c0206: `type in writeCodeArtifact`
- c0210 ..> c0206: `type in writeCodeArtifacts`
- c0210 ..> c0206: `type in writeConnection`
- c0210 ..> c0206: `type in writeDocument`
- c0210 ..> c0206: `type in writeDocuments`
- c0210 ..> c0206: `type in writeEntities`
- c0210 ..> c0206: `type in writeEntity`
- c0210 ..> c0206: `type in writeEntityMemoryLink`
- c0210 ..> c0206: `type in writeEntityMemoryLinks`
- c0210 ..> c0206: `type in writeLinkedMemories`
- c0210 ..> c0206: `type in writeLinkedMemory`
- c0210 ..> c0206: `type in writeRelationship`
- c0210 ..> c0206: `type in writeRelationships`
- c0210 ..> c0208: `type in createOnce`
- c0210 ..> c0208: `type in recordCreateFailure`
- c0210 ..> c0208: `type in writeAttachments`
- c0210 ..> c0208: `type in writeCodeArtifact`
- c0210 ..> c0208: `type in writeCodeArtifacts`
- c0210 ..> c0208: `type in writeConnection`
- c0210 ..> c0208: `type in writeDocument`
- c0210 ..> c0208: `type in writeDocuments`
- c0210 ..> c0208: `type in writeEntities`
- c0210 ..> c0208: `type in writeEntity`
- c0210 ..> c0208: `type in writeEntityMemoryLink`
- c0210 ..> c0208: `type in writeEntityMemoryLinks`
- c0210 ..> c0208: `type in writeLinkedMemories`
- c0210 ..> c0208: `type in writeLinkedMemory`
- c0210 ..> c0208: `type in writeRelationship`
- c0210 ..> c0208: `type in writeRelationships`
- c0210 ..> c0209: `type in createOnce`
- c0210 ..> c0209: `type in execute`
- c0210 ..> c0209: `type in recordCreateFailure`
- c0210 ..> c0209: `type in requestedAttachmentIds`
- c0210 ..> c0209: `type in writeAttachments`
- c0210 ..> c0209: `type in writeCodeArtifact`
- c0210 ..> c0209: `type in writeCodeArtifacts`
- c0210 ..> c0209: `type in writeConnection`
- c0210 ..> c0209: `type in writeDocument`
- c0210 ..> c0209: `type in writeDocuments`
- c0210 ..> c0209: `type in writeEntities`
- c0210 ..> c0209: `type in writeEntity`
- c0210 ..> c0209: `type in writeEntityMemoryLink`
- c0210 ..> c0209: `type in writeEntityMemoryLinks`
- c0210 ..> c0209: `type in writeLinkedMemories`
- c0210 ..> c0209: `type in writeLinkedMemory`
- c0210 ..> c0209: `type in writeRelationship`
- c0210 ..> c0209: `type in writeRelationships`
- c0210 ..> c0210: `createOnce() calls recordCreateFailure()`
- c0210 ..> c0210: `execute() calls writeAttachments()`
- c0210 ..> c0210: `execute() calls writeCodeArtifacts()`
- c0210 ..> c0210: `execute() calls writeDocuments()`
- c0210 ..> c0210: `execute() calls writeEntities()`
- c0210 ..> c0210: `execute() calls writeEntityMemoryLinks()`
- c0210 ..> c0210: `execute() calls writeLinkedMemories()`
- c0210 ..> c0210: `execute() calls writeRelationships()`
- c0210 ..> c0210: `writeAttachments() calls attachmentIds()`
- c0210 ..> c0210: `writeAttachments() calls attachmentMemory()`
- c0210 ..> c0210: `writeAttachments() calls attachmentPatch()`
- c0210 ..> c0210: `writeAttachments() calls attachmentsDiffer()`
- c0210 ..> c0210: `writeAttachments() calls requestedAttachmentIds()`
- c0210 ..> c0210: `writeAttachments() calls writeConnection()`
- c0210 ..> c0210: `writeCodeArtifact() calls createOnce()`
- c0210 ..> c0210: `writeCodeArtifacts() calls writeCodeArtifact()`
- c0210 ..> c0210: `writeConnection() calls execute()`
- c0210 ..> c0210: `writeDocument() calls createOnce()`
- c0210 ..> c0210: `writeDocuments() calls writeDocument()`
- c0210 ..> c0210: `writeEntities() calls writeEntity()`
- c0210 ..> c0210: `writeEntity() calls createOnce()`
- c0210 ..> c0210: `writeEntityMemoryLink() calls writeConnection()`
- c0210 ..> c0210: `writeEntityMemoryLinks() calls writeEntityMemoryLink()`
- c0210 ..> c0210: `writeLinkedMemories() calls writeLinkedMemory()`
- c0210 ..> c0210: `writeLinkedMemory() calls writeConnection()`
- c0210 ..> c0210: `writeRelationship() calls createOnce()`
- c0210 ..> c0210: `writeRelationships() calls writeRelationship()`
- c0210 ..> c0211: `type in writeCodeArtifact`
- c0210 ..> c0211: `type in writeDocument`
- c0210 ..> c0211: `type in writeEntity`
- c0210 ..> c0211: `type in writeRelationship`
- c0210 --> c0212: `field client`
- c0210 ..> c0212: `type in constructor`
- c0210 ..> c0213: `attachmentIds() calls uniqueIds()`
- c0210 ..> c0213: `attachmentsDiffer() calls sameIds()`
- c0210 ..> c0213: `createOnce() calls positiveId()`
- c0210 ..> c0213: `execute() calls copyState()`
- c0210 ..> c0213: `execute() calls instructionId()`
- c0210 ..> c0213: `execute() calls normalizedState()`
- c0210 ..> c0213: `recordCreateFailure() calls rejectedCreate()`
- c0210 ..> c0213: `requestedAttachmentIds() calls selectedIds()`
- c0210 ..> c0213: `requestedAttachmentIds() calls uniqueIds()`
- c0210 ..> c0213: `writeCodeArtifacts() calls positiveId()`
- c0210 ..> c0213: `writeCodeArtifacts() calls resourceSlots()`
- c0210 ..> c0213: `writeCodeArtifacts() calls stateId()`
- c0210 ..> c0213: `writeCodeArtifacts() calls stateWithNumber()`
- c0210 ..> c0213: `writeConnection() calls rejectedCreate()`
- c0210 ..> c0213: `writeDocuments() calls positiveId()`
- c0210 ..> c0213: `writeDocuments() calls resourceSlots()`
- c0210 ..> c0213: `writeDocuments() calls stateId()`
- c0210 ..> c0213: `writeDocuments() calls stateWithNumber()`
- c0210 ..> c0213: `writeEntities() calls positiveId()`
- c0210 ..> c0213: `writeEntities() calls resourceSlots()`
- c0210 ..> c0213: `writeEntities() calls stateId()`
- c0210 ..> c0213: `writeEntities() calls stateWithNumber()`
- c0210 ..> c0213: `writeEntityMemoryLink() calls hasValue()`
- c0210 ..> c0213: `writeEntityMemoryLink() calls stateId()`
- c0210 ..> c0213: `writeLinkedMemory() calls hasValue()`
- c0210 ..> c0213: `writeRelationship() calls stateId()`
- c0210 ..> c0213: `writeRelationships() calls positiveId()`
- c0210 ..> c0213: `writeRelationships() calls resourceSlots()`
- c0210 ..> c0213: `writeRelationships() calls stateId()`
- c0210 ..> c0213: `writeRelationships() calls stateWithNumber()`
- c0210 ..> c0232: `createOnce() calls errorMessage()`
- c0210 ..> c0232: `writeConnection() calls errorMessage()`
- c0210 ..> c0278: `createOnce() calls inspect()`
- c0210 ..> c0278: `writeConnection() calls inspect()`
- c0213 ..> c0004: `resourceSlots() calls set()`
- c0213 ..> c0169: `resourceSlots() calls get()`
- c0213 ..> c0206: `type in instructionId`
- c0213 ..> c0207: `type in receipts`
- c0213 ..> c0207: `type in selectedIds`
- c0213 ..> c0207: `type in stateId`
- c0213 ..> c0207: `type in stateWithNumber`
- c0213 ..> c0209: `type in copyState`
- c0213 ..> c0209: `type in normalizedState`
- c0213 ..> c0211: `type in resourceSlots`
- c0213 ..> c0213: `normalizedState() calls receipts()`
- c0213 ..> c0213: `receipts() calls positiveId()`
- c0213 ..> c0213: `selectedIds() calls positiveId()`
- c0213 ..> c0213: `selectedIds() calls resourceSlots()`
- c0213 ..> c0213: `selectedIds() calls stateId()`
- c0213 ..> c0213: `stateWithNumber() calls positiveId()`
- c0216 ..> c0069: `enqueue() calls enqueue()`
- c0216 ..> c0069: `flush() calls resolve()`
- c0216 ..|> c0214: `implements`
- c0216 --> c0215: `field level`
- c0216 --> c0215: `field options`
- c0216 ..> c0215: `type in constructor`
- c0216 ..> c0215: `type in setLevel`
- c0216 ..> c0216: `close() calls flush()`
- c0216 ..> c0216: `emit() calls enqueue()`
- c0216 ..> c0216: `emit() calls warn()`
- c0216 ..> c0216: `encode() calls fitLine()`
- c0216 ..> c0216: `encode() calls traceLines()`
- c0216 ..> c0216: `enqueue() calls encode()`
- c0216 ..> c0216: `enqueue() calls warn()`
- c0216 ..> c0216: `enqueue() calls write()`
- c0216 ..> c0216: `flush() calls warn()`
- c0216 ..> c0216: `traceLines() calls traceFileCount()`
- c0216 ..> c0216: `write() calls rotate()`
- c0216 ..> c0216: `write() calls traceFileCount()`
- c0216 ..> c0217: `constructor() calls limit()`
- c0216 ..> c0217: `enqueue() calls correlation()`
- c0216 ..> c0217: `enqueue() calls excludeCredentials()`
- c0216 ..> c0217: `fitLine() calls correlation()`
- c0216 ..> c0217: `traceLines() calls correlation()`
- c0216 ..> c0217: `write() calls pruneDirectory()`
- c0216 ..> c0232: `enqueue() calls sanitizeValue()`
- c0217 ..> c0013: `pruneDirectory() calls current()`
- c0217 ..> c0217: `pruneDirectory() calls listLogFiles()`
- c0217 ..> c0217: `pruneDirectory() calls processExited()`
- c0218 ..> c0113: `type in replacementMemoryInput`
- c0218 ..> c0218: `replacementMemoryInput() calls replacementMemoryContext()`
- c0218 ..> c0232: `storedMemoryContext() calls sanitizeText()`
- c0221 --> c0223: `field complete`
- c0222 ..> c0069: `applySummary() calls now()`
- c0222 --> c0219: `field compactedHistory`
- c0222 ..> c0219: `type in constructor`
- c0222 ..> c0219: `type in getCompactedHistory`
- c0222 ..> c0219: `type in prepare`
- c0222 ..> c0219: `type in prepareCapture`
- c0222 ..> c0219: `type in prepareContext`
- c0222 ..> c0222: `prepare() calls prepareContext()`
- c0222 ..> c0222: `prepareCapture() calls outputAllowance()`
- c0222 ..> c0222: `prepareCapture() calls prepareContext()`
- c0222 ..> c0222: `prepareContext() calls applySummary()`
- c0222 ..> c0222: `prepareContext() calls getCompactedHistory()`
- c0222 ..> c0222: `prepareContext() calls outputAllowance()`
- c0222 ..> c0223: `type in prepare`
- c0222 ..> c0223: `type in prepareCapture`
- c0222 ..> c0223: `type in prepareContext`
- c0222 ..> c0224: `applySummary() calls contextTokens()`
- c0222 ..> c0224: `constructor() calls compactionSettings()`
- c0222 ..> c0224: `constructor() calls privateContextWindow()`
- c0222 ..> c0224: `outputAllowance() calls resolvedOutputAllowance()`
- c0222 ..> c0224: `prepareContext() calls assertImageSupport()`
- c0222 ..> c0224: `prepareContext() calls contextTokens()`
- c0222 ..> c0224: `prepareContext() calls outputCeiling()`
- c0222 ..> c0224: `prepareContext() calls recentCutIndex()`
- c0222 ..> c0224: `prepareContext() calls summarizeMemoryHistory()`
- c0222 ..> c0265: `applySummary() calls trim()`
- c0224 ..> c0069: `summarizeMemoryHistory() calls now()`
- c0224 ..> c0116: `type in evidencePageContent`
- c0224 ..> c0220: `assertFits() constructs ContextWindowError`
- c0224 ..> c0220: `smallerSummaryBatch() constructs ContextWindowError`
- c0224 ..> c0221: `type in summarizeMemoryHistory`
- c0224 ..> c0224: `assertFits() calls contextTokens()`
- c0224 ..> c0224: `contextTokens() calls textTokens()`
- c0224 ..> c0224: `evidenceMessage() calls modelEvidence()`
- c0224 ..> c0224: `evidencePageContent() calls evidenceMessage()`
- c0224 ..> c0224: `modelEvidence() calls objectRecord()`
- c0224 ..> c0224: `outputCeiling() calls validatePositiveSafeInteger()`
- c0224 ..> c0224: `privateContextWindow() calls validatePositiveSafeInteger()`
- c0224 ..> c0224: `recentCutIndex() calls entriesFor()`
- c0224 ..> c0224: `resolvedOutputAllowance() calls assertFits()`
- c0224 ..> c0224: `resolvedOutputAllowance() calls contextTokens()`
- c0224 ..> c0224: `resolvedOutputAllowance() calls outputCeiling()`
- c0224 ..> c0224: `summarizeMemoryHistory() calls assertFits()`
- c0224 ..> c0224: `summarizeMemoryHistory() calls assertImageSupport()`
- c0224 ..> c0224: `summarizeMemoryHistory() calls compactionSettings()`
- c0224 ..> c0224: `summarizeMemoryHistory() calls outputCeiling()`
- c0224 ..> c0224: `summarizeMemoryHistory() calls privateContextWindow()`
- c0224 ..> c0224: `summarizeMemoryHistory() calls smallerSummaryBatch()`
- c0224 ..> c0224: `summarizeMemoryHistory() calls summaryEvidence()`
- c0224 ..> c0224: `summaryEvidence() calls evidenceMessage()`
- c0224 ..> c0228: `summarizeMemoryHistory() calls complete()`
- c0224 ..> c0232: `evidenceMessage() calls sanitizeValue()`
- c0224 ..> c0232: `summarizeMemoryHistory() calls sanitizeText()`
- c0226 --> c0227: `field modelRegistry`
- c0228 ..> c0069: `complete() calls now()`
- c0228 ..> c0069: `completeAttempt() calls now()`
- c0228 ..> c0069: `completeRequest() calls now()`
- c0228 ..> c0069: `completeWithSubmission() calls now()`
- c0228 ..> c0069: `executeRead() calls now()`
- c0228 ..> c0069: `prepareCapture() calls now()`
- c0228 ..> c0078: `completeWithSubmission() calls mapConcurrent()`
- c0228 --> c0083: `field selection`
- c0228 ..> c0083: `type in constructor`
- c0228 ..> c0090: `completeRequest() calls isRecallConcurrency()`
- c0228 ..|> c0114: `implements`
- c0228 ..> c0118: `type in executeRead`
- c0228 ..> c0119: `type in complete`
- c0228 ..> c0119: `type in completeAttempt`
- c0228 ..> c0119: `type in completeRequest`
- c0228 ..> c0119: `type in completeWithSubmission`
- c0228 ..> c0119: `type in emit`
- c0228 ..> c0119: `type in executeRead`
- c0228 ..> c0119: `type in prepareCapture`
- c0228 ..> c0120: `completeWithSubmission() constructs ModelSubmissionError`
- c0228 ..> c0121: `type in validateSubmission`
- c0228 ..> c0210: `executeRead() calls execute()`
- c0228 --> c0214: `field logger`
- c0228 ..> c0216: `complete() calls emit()`
- c0228 ..> c0216: `completeAttempt() calls emit()`
- c0228 ..> c0216: `completeRequest() calls emit()`
- c0228 ..> c0216: `emit() calls emit()`
- c0228 ..> c0216: `executeRead() calls emit()`
- c0228 ..> c0216: `prepareCapture() calls emit()`
- c0228 ..> c0222: `completeRequest() calls prepareCapture()`
- c0228 ..> c0222: `completeRequest() constructs MemoryTaskContext`
- c0228 ..> c0222: `completeWithSubmission() calls prepare()`
- c0228 ..> c0224: `completeRequest() calls evidenceMessage()`
- c0228 ..> c0224: `executeRead() calls evidencePageContent()`
- c0228 --> c0225: `field transformHeaders`
- c0228 --> c0227: `field registry`
- c0228 ..> c0227: `type in constructor`
- c0228 ..> c0228: `complete() calls completeRequest()`
- c0228 ..> c0228: `completeAttempt() calls complete()`
- c0228 ..> c0228: `completeRequest() calls completeWithSubmission()`
- c0228 ..> c0228: `completeWithSubmission() calls completeAttempt()`
- c0228 ..> c0228: `completeWithSubmission() calls executeRead()`
- c0228 ..> c0228: `completeWithSubmission() calls validateSubmission()`
- c0228 ..> c0228: `prepareCapture() calls completeRequest()`
- c0228 ..> c0229: `type in constructor`
- c0228 ..> c0230: `type in completeAttempt`
- c0228 ..> c0230: `type in completeWithSubmission`
- c0228 ..> c0230: `type in executeRead`
- c0228 ..> c0231: `complete() calls rejectionText()`
- c0228 ..> c0231: `completeAttempt() calls rejectionText()`
- c0228 ..> c0231: `completeRequest() calls modelLabel()`
- c0228 ..> c0231: `completeRequest() calls requestDeadline()`
- c0228 ..> c0231: `completeRequest() calls requestOptions()`
- c0228 ..> c0231: `completeRequest() calls requestTimeout()`
- c0228 ..> c0231: `completeRequest() calls serializeInput()`
- c0228 ..> c0231: `completeRequest() calls submissionTool()`
- c0228 ..> c0231: `completeRequest() calls throwRequestFailure()`
- c0228 ..> c0231: `completeWithSubmission() calls appendCallCountCorrection()`
- c0228 ..> c0231: `completeWithSubmission() calls ensureCompletionFinished()`
- c0228 ..> c0231: `completeWithSubmission() calls errorToolResult()`
- c0228 ..> c0231: `completeWithSubmission() calls rejectionText()`
- c0228 ..> c0231: `completeWithSubmission() calls sanitizedAssistantForHistory()`
- c0228 ..> c0231: `completeWithSubmission() calls serializeInput()`
- c0228 ..> c0231: `completeWithSubmission() calls submissionTool()`
- c0228 ..> c0231: `completeWithSubmission() calls toolCalls()`
- c0228 ..> c0231: `constructor() calls modelLabel()`
- c0228 ..> c0231: `executeRead() calls errorToolResult()`
- c0228 ..> c0231: `executeRead() calls rejectionText()`
- c0228 ..> c0231: `executeRead() calls serializeInput()`
- c0228 ..> c0231: `executeRead() calls submissionTool()`
- c0228 ..> c0231: `executeRead() calls textBlock()`
- c0228 ..> c0231: `prepareCapture() calls rejectionText()`
- c0228 ..> c0232: `completeRequest() calls sanitizeText()`
- c0228 ..> c0232: `emit() calls sanitizeValue()`
- c0229 --> c0214: `field logger`
- c0229 --> c0225: `field transformHeaders`
- c0231 ..> c0069: `appendCallCountCorrection() calls now()`
- c0231 ..> c0069: `errorToolResult() calls now()`
- c0231 ..> c0083: `type in modelLabel`
- c0231 ..> c0083: `type in modelSelectionFromModel`
- c0231 ..> c0083: `type in resolveMemoryModel`
- c0231 ..> c0118: `type in submissionTool`
- c0231 ..> c0119: `type in ensureCompletionFinished`
- c0231 ..> c0119: `type in requestDeadline`
- c0231 ..> c0119: `type in requestTimeout`
- c0231 ..> c0119: `type in throwRequestFailure`
- c0231 ..> c0121: `type in submissionTool`
- c0231 ..> c0225: `type in requestOptions`
- c0231 ..> c0226: `type in availableMemoryModels`
- c0231 ..> c0227: `type in resolveMemoryModel`
- c0231 ..> c0228: `requestOptions() calls transformHeaders()`
- c0231 ..> c0228: `resolveMemoryModel() constructs PiMemoryModel`
- c0231 ..> c0228: `type in resolveMemoryModel`
- c0231 ..> c0229: `type in resolveMemoryModel`
- c0231 ..> c0230: `type in requestDeadline`
- c0231 ..> c0231: `appendCallCountCorrection() calls errorToolResult()`
- c0231 ..> c0231: `appendCallCountCorrection() calls rejectionText()`
- c0231 ..> c0231: `appendCallCountCorrection() calls sanitizedAssistantForHistory()`
- c0231 ..> c0231: `errorToolResult() calls textBlock()`
- c0231 ..> c0231: `openCodeSessionHeaders() calls isOpenCodeModel()`
- c0231 ..> c0231: `requestOptions() calls openCodeSessionHeaders()`
- c0231 ..> c0231: `sanitizedAssistantForHistory() calls textBlock()`
- c0231 ..> c0232: `appendCallCountCorrection() calls sanitizeText()`
- c0231 ..> c0232: `ensureCompletionFinished() calls sanitizeText()`
- c0231 ..> c0232: `rejectionText() calls errorMessage()`
- c0231 ..> c0232: `sanitizedAssistantForHistory() calls sanitizeText()`
- c0231 ..> c0232: `sanitizedAssistantForHistory() calls sanitizeValue()`
- c0231 ..> c0232: `serializeInput() calls sanitizeText()`
- c0231 ..> c0232: `serializeInput() calls sanitizeValue()`
- c0231 ..> c0232: `throwRequestFailure() calls sanitizeText()`
- c0232 ..> c0232: `errorMessage() calls diagnosticMessage()`
- c0232 ..> c0232: `errorMessage() calls sanitizeText()`
- c0232 ..> c0232: `hasSensitiveData() calls sanitizeText()`
- c0232 ..> c0232: `sanitizeValue() calls sanitizeText()`
- c0232 ..> c0278: `diagnosticMessage() calls inspect()`
- c0235 ..> c0108: `type in initialiseProject`
- c0235 ..> c0108: `type in initialiseProjectForAgent`
- c0235 ..> c0108: `type in promptExistingProject`
- c0235 ..> c0123: `type in existingMapping`
- c0235 ..> c0123: `type in initialiseProject`
- c0235 ..> c0123: `type in initialiseProjectForAgent`
- c0235 ..> c0123: `type in promptExistingProject`
- c0235 ..> c0124: `type in promptNewProject`
- c0235 ..> c0124: `type in validateAgentProjectDetails`
- c0235 ..> c0164: `promptExistingProject() calls notify()`
- c0235 ..> c0169: `initialiseProject() calls createProject()`
- c0235 ..> c0169: `initialiseProject() calls linkProject()`
- c0235 ..> c0169: `initialiseProject() calls listProjects()`
- c0235 ..> c0169: `initialiseProjectForAgent() calls createProject()`
- c0235 ..> c0169: `initialiseProjectForAgent() calls linkProject()`
- c0235 ..> c0169: `initialiseProjectForAgent() calls listProjects()`
- c0235 ..> c0169: `promptExistingProject() calls listProjects()`
- c0235 ..> c0232: `promptExistingProject() calls sanitizeText()`
- c0235 ..> c0232: `promptNewProject() calls sanitizeText()`
- c0235 ..> c0233: `type in initialiseProjectForAgent`
- c0235 ..> c0233: `type in validateAgentProjectDetails`
- c0235 ..> c0234: `existingMapping() constructs ProjectInitError`
- c0235 ..> c0234: `initialiseProject() constructs ProjectInitError`
- c0235 ..> c0234: `initialiseProjectForAgent() constructs ProjectInitError`
- c0235 ..> c0234: `promptExistingProject() constructs ProjectInitError`
- c0235 ..> c0234: `promptNewProject() constructs ProjectInitError`
- c0235 ..> c0234: `validateAgentProjectDetails() constructs ProjectInitError`
- c0235 ..> c0235: `initialiseProject() calls existingMapping()`
- c0235 ..> c0235: `initialiseProject() calls promptExistingProject()`
- c0235 ..> c0235: `initialiseProject() calls promptNewProject()`
- c0235 ..> c0235: `initialiseProjectForAgent() calls existingMapping()`
- c0235 ..> c0235: `initialiseProjectForAgent() calls validateAgentProjectDetails()`
- c0235 ..> c0265: `promptExistingProject() calls trim()`
- c0235 ..> c0265: `promptNewProject() calls trim()`
- c0235 ..> c0265: `validateAgentProjectDetails() calls trim()`
- c0236 ..> c0004: `mutate() calls set()`
- c0236 ..> c0009: `createFileLock() calls open()`
- c0236 ..> c0009: `createFileLock() calls sync()`
- c0236 ..> c0009: `readSnapshot() calls open()`
- c0236 ..> c0009: `storeSnapshot() calls open()`
- c0236 ..> c0009: `storeSnapshot() calls sync()`
- c0236 ..> c0009: `syncDirectory() calls open()`
- c0236 ..> c0009: `syncDirectory() calls sync()`
- c0236 ..> c0009: `writeState() calls open()`
- c0236 ..> c0009: `writeState() calls sync()`
- c0236 ..> c0093: `type in advanceWatermark`
- c0236 ..> c0093: `type in enqueue`
- c0236 ..> c0093: `type in enqueueSnapshot`
- c0236 ..> c0093: `type in reusableHistory`
- c0236 ..> c0097: `type in compactJobSnapshot`
- c0236 ..> c0106: `type in appendInspections`
- c0236 ..> c0123: `type in completeProjectDiscovery`
- c0236 ..> c0129: `type in completeProjectDiscovery`
- c0236 ..> c0129: `type in currentWatermark`
- c0236 ..> c0169: `mutate() calls get()`
- c0236 ..> c0169: `resolveBranchId() calls get()`
- c0236 ..> c0196: `readSnapshot() calls readFile()`
- c0236 ..> c0196: `readState() calls readFile()`
- c0236 ..> c0196: `releaseFileLock() calls readFile()`
- c0236 ..> c0196: `removeAbandonedLock() calls readFile()`
- c0236 ..> c0232: `addConflict() calls sanitizeValue()`
- c0236 ..> c0232: `appendInspections() calls sanitizeValue()`
- c0236 ..> c0236: `acquireFileLock() calls createFileLock()`
- c0236 ..> c0236: `acquireFileLock() calls ensureDirectory()`
- c0236 ..> c0236: `acquireFileLock() calls recoverExistingLock()`
- c0236 ..> c0236: `addConflict() calls mutate()`
- c0236 ..> c0236: `addConflict() calls prune()`
- c0236 ..> c0236: `advanceWatermark() calls mutate()`
- c0236 ..> c0236: `advanceWatermark() calls prune()`
- c0236 ..> c0236: `advanceWatermark() calls updateWatermark()`
- c0236 ..> c0236: `appendInspections() calls readSnapshot()`
- c0236 ..> c0236: `appendInspections() calls storeSnapshot()`
- c0236 ..> c0236: `cancel() calls mutate()`
- c0236 ..> c0236: `checkpoint() calls appendInspections()`
- c0236 ..> c0236: `checkpoint() calls applyCheckpointPatch()`
- c0236 ..> c0236: `checkpoint() calls compactJobSnapshot()`
- c0236 ..> c0236: `checkpoint() calls hydrateJob()`
- c0236 ..> c0236: `checkpoint() calls mutate()`
- c0236 ..> c0236: `checkpoint() calls pruneFailedJobs()`
- c0236 ..> c0236: `checkpoint() calls recordCompletedCapture()`
- c0236 ..> c0236: `checkpoint() calls releaseTerminalSnapshot()`
- c0236 ..> c0236: `claimNext() calls claimJob()`
- c0236 ..> c0236: `claimNext() calls defaultIdentity()`
- c0236 ..> c0236: `claimNext() calls hydrateJob()`
- c0236 ..> c0236: `claimNext() calls matchesBranch()`
- c0236 ..> c0236: `claimNext() calls now()`
- c0236 ..> c0236: `claimNext() calls runningJobCanBeRecovered()`
- c0236 ..> c0236: `collectSnapshots() calls now()`
- c0236 ..> c0236: `collectSnapshots() calls snapshotPath()`
- c0236 ..> c0236: `collectSnapshots() calls syncDirectory()`
- c0236 ..> c0236: `compactJobSnapshot() calls hydrateJob()`
- c0236 ..> c0236: `compactJobSnapshot() calls storeSnapshot()`
- c0236 ..> c0236: `complete() calls checkpoint()`
- c0236 ..> c0236: `completeProjectDiscovery() calls defaultIdentity()`
- c0236 ..> c0236: `completeProjectDiscovery() calls mutate()`
- c0236 ..> c0236: `createFileLock() calls close()`
- c0236 ..> c0236: `createFileLock() calls releaseFileLock()`
- c0236 ..> c0236: `currentWatermark() calls getWatermark()`
- c0236 ..> c0236: `enqueue() calls mutate()`
- c0236 ..> c0236: `enqueue() calls prune()`
- c0236 ..> c0236: `enqueue() calls reusableHistory()`
- c0236 ..> c0236: `enqueue() calls updateWatermark()`
- c0236 ..> c0236: `enqueueSnapshot() calls enqueue()`
- c0236 ..> c0236: `getConflict() calls readState()`
- c0236 ..> c0236: `getJob() calls hydrateJob()`
- c0236 ..> c0236: `getJob() calls mutate()`
- c0236 ..> c0236: `getWatermark() calls readState()`
- c0236 ..> c0236: `hasClaimableWork() calls matchesBranch()`
- c0236 ..> c0236: `hasClaimableWork() calls mutate()`
- c0236 ..> c0236: `hasClaimableWork() calls now()`
- c0236 ..> c0236: `hasClaimableWork() calls runningJobCanBeRecovered()`
- c0236 ..> c0236: `hydrateJob() calls readSnapshot()`
- c0236 ..> c0236: `listJobMetadata() calls mutate()`
- c0236 ..> c0236: `listJobs() calls hydrateJob()`
- c0236 ..> c0236: `listJobs() calls mutate()`
- c0236 ..> c0236: `listPending() calls defaultIdentity()`
- c0236 ..> c0236: `listPending() calls hydrateJob()`
- c0236 ..> c0236: `listPending() calls mutate()`
- c0236 ..> c0236: `listPendingConflicts() calls pendingConflicts()`
- c0236 ..> c0236: `markConflictHandedOff() calls defaultIdentity()`
- c0236 ..> c0236: `markConflictHandedOff() calls getConflict()`
- c0236 ..> c0236: `markConflictHandedOff() calls mutate()`
- c0236 ..> c0236: `markConflictHandedOff() calls withWorkerLock()`
- c0236 ..> c0236: `mutate() calls pruneFailedJobs()`
- c0236 ..> c0236: `mutate() calls readState()`
- c0236 ..> c0236: `mutate() calls withMutationFileLock()`
- c0236 ..> c0236: `mutate() calls writeState()`
- c0236 ..> c0236: `pendingConflicts() calls readState()`
- c0236 ..> c0236: `prune() calls now()`
- c0236 ..> c0236: `readSnapshot() calls close()`
- c0236 ..> c0236: `readSnapshot() calls snapshotPath()`
- c0236 ..> c0236: `recordCompletedCapture() calls hydrateJob()`
- c0236 ..> c0236: `recordCompletedCapture() calls readSnapshot()`
- c0236 ..> c0236: `recordCompletedCapture() calls storeSnapshot()`
- c0236 ..> c0236: `recoverExistingLock() calls removeAbandonedLock()`
- c0236 ..> c0236: `refreshCaptureHistory() calls compactJobSnapshot()`
- c0236 ..> c0236: `refreshCaptureHistory() calls hydrateJob()`
- c0236 ..> c0236: `refreshCaptureHistory() calls mutate()`
- c0236 ..> c0236: `refreshCaptureHistory() calls reusableHistory()`
- c0236 ..> c0236: `releaseProgress() calls mutate()`
- c0236 ..> c0236: `removeAbandonedLock() calls now()`
- c0236 ..> c0236: `resolveBranchId() calls readState()`
- c0236 ..> c0236: `reusableHistory() calls readSnapshot()`
- c0236 ..> c0236: `storeSnapshot() calls close()`
- c0236 ..> c0236: `storeSnapshot() calls readSnapshot()`
- c0236 ..> c0236: `storeSnapshot() calls snapshotPath()`
- c0236 ..> c0236: `storeSnapshot() calls syncDirectory()`
- c0236 ..> c0236: `syncDirectory() calls close()`
- c0236 ..> c0236: `updateConflict() calls mutate()`
- c0236 ..> c0236: `withFileLock() calls acquireFileLock()`
- c0236 ..> c0236: `withMutationFileLock() calls withFileLock()`
- c0236 ..> c0236: `withWorkerLock() calls acquireFileLock()`
- c0236 ..> c0236: `writeState() calls close()`
- c0236 ..> c0236: `writeState() calls collectSnapshots()`
- c0236 ..> c0236: `writeState() calls ensureDirectory()`
- c0236 ..> c0236: `writeState() calls pruneFailedJobs()`
- c0236 ..> c0236: `writeState() calls releaseTerminalSnapshot()`
- c0236 ..> c0236: `writeState() calls storeSnapshot()`
- c0236 ..> c0236: `writeState() calls syncDirectory()`
- c0236 ..> c0237: `type in constructor`
- c0236 ..> c0238: `type in acquireFileLock`
- c0236 ..> c0238: `type in createFileLock`
- c0236 ..> c0240: `type in addConflict`
- c0236 ..> c0240: `type in getConflict`
- c0236 ..> c0240: `type in listPendingConflicts`
- c0236 ..> c0240: `type in pendingConflicts`
- c0236 ..> c0240: `type in updateConflict`
- c0236 ..> c0241: `acquireFileLock() constructs QueueBusyError`
- c0236 ..> c0241: `removeAbandonedLock() constructs QueueBusyError`
- c0236 ..> c0241: `withMutationFileLock() constructs QueueBusyError`
- c0236 ..> c0242: `type in applyCheckpointPatch`
- c0236 ..> c0242: `type in checkpoint`
- c0236 ..> c0243: `type in enqueue`
- c0236 ..> c0243: `type in enqueueSnapshot`
- c0236 ..> c0244: `type in claimNext`
- c0236 ..> c0244: `type in defaultIdentity`
- c0236 ..> c0244: `type in hasClaimableWork`
- c0236 ..> c0244: `type in listJobMetadata`
- c0236 ..> c0244: `type in listJobs`
- c0236 ..> c0244: `type in listPending`
- c0236 ..> c0244: `type in listPendingConflicts`
- c0236 ..> c0244: `type in pendingConflicts`
- c0236 ..> c0244: `type in withWorkerLock`
- c0236 ..> c0245: `type in checkpoint`
- c0236 ..> c0245: `type in claimJob`
- c0236 ..> c0245: `type in claimNext`
- c0236 ..> c0245: `type in complete`
- c0236 ..> c0245: `type in getJob`
- c0236 ..> c0245: `type in hydrateJob`
- c0236 ..> c0245: `type in listJobs`
- c0236 ..> c0245: `type in listPending`
- c0236 ..> c0245: `type in matchesBranch`
- c0236 ..> c0245: `type in refreshCaptureHistory`
- c0236 ..> c0245: `type in runningJobCanBeRecovered`
- c0236 ..> c0246: `type in listJobMetadata`
- c0236 ..> c0248: `type in collectSnapshots`
- c0236 ..> c0248: `type in mutate`
- c0236 ..> c0248: `type in prune`
- c0236 ..> c0248: `type in pruneFailedJobs`
- c0236 ..> c0248: `type in readState`
- c0236 ..> c0248: `type in recordCompletedCapture`
- c0236 ..> c0248: `type in releaseTerminalSnapshot`
- c0236 ..> c0248: `type in updateWatermark`
- c0236 ..> c0248: `type in writeState`
- c0236 ..> c0249: `type in advanceWatermark`
- c0236 ..> c0249: `type in currentWatermark`
- c0236 ..> c0249: `type in getWatermark`
- c0236 ..> c0249: `type in reusableHistory`
- c0236 ..> c0249: `type in updateWatermark`
- c0236 ..> c0250: `type in readSnapshot`
- c0236 ..> c0250: `type in reusableHistory`
- c0236 ..> c0250: `type in storeSnapshot`
- c0236 ..> c0251: `type in appendInspections`
- c0236 ..> c0251: `type in applyCheckpointPatch`
- c0236 ..> c0251: `type in compactJobSnapshot`
- c0236 ..> c0251: `type in hydrateJob`
- c0236 ..> c0251: `type in recordCompletedCapture`
- c0236 ..> c0251: `type in releaseTerminalSnapshot`
- c0236 ..> c0253: `type in advanceWatermark`
- c0236 ..> c0253: `type in updateWatermark`
- c0236 ..> c0254: `addConflict() calls jsonSnapshot()`
- c0236 ..> c0254: `addConflict() calls nowIso()`
- c0236 ..> c0254: `addConflict() calls scrubDiagnostic()`
- c0236 ..> c0254: `advanceWatermark() calls dedupeKey()`
- c0236 ..> c0254: `advanceWatermark() calls jsonSnapshot()`
- c0236 ..> c0254: `appendInspections() calls jsonSnapshot()`
- c0236 ..> c0254: `appendInspections() calls validateInspectionEntry()`
- c0236 ..> c0254: `applyCheckpointPatch() calls jsonSnapshot()`
- c0236 ..> c0254: `applyCheckpointPatch() calls nowIso()`
- c0236 ..> c0254: `applyCheckpointPatch() calls scrubDiagnostic()`
- c0236 ..> c0254: `cancel() calls nowIso()`
- c0236 ..> c0254: `cancel() calls scrubDiagnostic()`
- c0236 ..> c0254: `checkpoint() calls releaseCompletedArtifacts()`
- c0236 ..> c0254: `claimJob() calls nowIso()`
- c0236 ..> c0254: `claimNext() calls identityMatches()`
- c0236 ..> c0254: `claimNext() calls interruptedWrite()`
- c0236 ..> c0254: `collectSnapshots() calls historyCaches()`
- c0236 ..> c0254: `completeProjectDiscovery() calls identityMatches()`
- c0236 ..> c0254: `createFileLock() calls nowIso()`
- c0236 ..> c0254: `enqueue() calls contextKey()`
- c0236 ..> c0254: `enqueue() calls dedupeKey()`
- c0236 ..> c0254: `enqueue() calls jobIdFor()`
- c0236 ..> c0254: `enqueue() calls jsonSnapshot()`
- c0236 ..> c0254: `enqueue() calls nowIso()`
- c0236 ..> c0254: `getConflict() calls jsonSnapshot()`
- c0236 ..> c0254: `getWatermark() calls contextKey()`
- c0236 ..> c0254: `getWatermark() calls jsonSnapshot()`
- c0236 ..> c0254: `getWatermark() calls nowIso()`
- c0236 ..> c0254: `hasClaimableWork() calls identityMatches()`
- c0236 ..> c0254: `hasClaimableWork() calls interruptedWrite()`
- c0236 ..> c0254: `hydrateJob() calls jsonSnapshot()`
- c0236 ..> c0254: `listJobMetadata() calls identityMatches()`
- c0236 ..> c0254: `listJobs() calls identityMatches()`
- c0236 ..> c0254: `listPending() calls identityMatches()`
- c0236 ..> c0254: `markConflictHandedOff() calls conflictIdentityMatches()`
- c0236 ..> c0254: `markConflictHandedOff() calls interruptedWrite()`
- c0236 ..> c0254: `markConflictHandedOff() calls nowIso()`
- c0236 ..> c0254: `pendingConflicts() calls conflictIdentityMatches()`
- c0236 ..> c0254: `pendingConflicts() calls jsonSnapshot()`
- c0236 ..> c0254: `prune() calls clearHistoryCache()`
- c0236 ..> c0254: `prune() calls contextKey()`
- c0236 ..> c0254: `prune() calls historyCaches()`
- c0236 ..> c0254: `prune() calls setHistoryCaches()`
- c0236 ..> c0254: `prune() calls shouldRetain()`
- c0236 ..> c0254: `readState() calls normaliseState()`
- c0236 ..> c0254: `recordCompletedCapture() calls contextKey()`
- c0236 ..> c0254: `recordCompletedCapture() calls cursorComparison()`
- c0236 ..> c0254: `recordCompletedCapture() calls historyCaches()`
- c0236 ..> c0254: `recordCompletedCapture() calls nowIso()`
- c0236 ..> c0254: `recordCompletedCapture() calls orderedSourceEntryIds()`
- c0236 ..> c0254: `recordCompletedCapture() calls setHistoryCaches()`
- c0236 ..> c0254: `recordCompletedCapture() calls summaryCursor()`
- c0236 ..> c0254: `refreshCaptureHistory() calls contextKey()`
- c0236 ..> c0254: `refreshCaptureHistory() calls cursorComparison()`
- c0236 ..> c0254: `refreshCaptureHistory() calls interruptedWrite()`
- c0236 ..> c0254: `refreshCaptureHistory() calls orderedSourceEntryIds()`
- c0236 ..> c0254: `refreshCaptureHistory() calls recordId()`
- c0236 ..> c0254: `releaseProgress() calls nowIso()`
- c0236 ..> c0254: `removeAbandonedLock() calls isProcessAlive()`
- c0236 ..> c0254: `resolveBranchId() calls contextKey()`
- c0236 ..> c0254: `reusableHistory() calls diagnosticError()`
- c0236 ..> c0254: `reusableHistory() calls historyCaches()`
- c0236 ..> c0254: `reusableHistory() calls orderedSourceEntryIds()`
- c0236 ..> c0254: `reusableHistory() calls setHistoryCaches()`
- c0236 ..> c0254: `runningJobCanBeRecovered() calls isProcessAlive()`
- c0236 ..> c0254: `updateConflict() calls jsonSnapshot()`
- c0236 ..> c0254: `updateConflict() calls nowIso()`
- c0236 ..> c0254: `updateWatermark() calls contextKey()`
- c0236 ..> c0254: `updateWatermark() calls nowIso()`
- c0236 ..> c0254: `writeState() calls releaseCompletedArtifacts()`
- c0236 ..> c0265: `reusableHistory() calls trim()`
- c0236 ..> c0274: `compactJobSnapshot() calls compactCaptureSnapshot()`
- c0236 ..> c0274: `enqueue() calls reuseCaptureHistory()`
- c0236 ..> c0274: `enqueue() calls sanitizeCaptureSnapshot()`
- c0236 ..> c0274: `refreshCaptureHistory() calls captureConversation()`
- c0236 ..> c0274: `writeState() calls sanitizeCaptureSnapshot()`
- c0240 --> c0106: `field replacement`
- c0240 --> c0113: `field replacement`
- c0240 --> c0129: `field context`
- c0240 --> c0244: `field binding`
- c0240 --> c0252: `field supersession`
- c0242 --> c0097: `field compactedConversation`
- c0242 --> c0106: `field inspectionEntries`
- c0242 --> c0247: `field status`
- c0242 --> c0252: `field supersession`
- c0245 --> c0093: `field snapshot`
- c0245 --> c0244: `field binding`
- c0245 --> c0247: `field status`
- c0245 --> c0252: `field supersession`
- c0246 --> c0093: `field snapshot`
- c0248 --> c0240: `field conflicts`
- c0248 --> c0249: `field watermarks`
- c0248 --> c0251: `field jobs`
- c0249 --> c0239: `field historyAlternatives`
- c0251 --|> c0245: `inherits`
- c0254 ..> c0093: `type in dedupeKey`
- c0254 ..> c0093: `type in orderedSourceEntryIds`
- c0254 ..> c0093: `type in summaryCursor`
- c0254 ..> c0106: `type in validateInspectionEntry`
- c0254 ..> c0169: `releaseCompletedArtifacts() calls get()`
- c0254 ..> c0232: `scrubDiagnostic() calls sanitizeText()`
- c0254 ..> c0236: `nowIso() calls now()`
- c0254 ..> c0239: `type in historyCaches`
- c0254 ..> c0239: `type in setHistoryCaches`
- c0254 ..> c0240: `type in conflictIdentityMatches`
- c0254 ..> c0244: `type in conflictIdentityMatches`
- c0254 ..> c0244: `type in identityMatches`
- c0254 ..> c0245: `type in identityMatches`
- c0254 ..> c0245: `type in interruptedWrite`
- c0254 ..> c0248: `type in normaliseState`
- c0254 ..> c0249: `type in clearHistoryCache`
- c0254 ..> c0249: `type in historyCaches`
- c0254 ..> c0249: `type in setHistoryCaches`
- c0254 ..> c0251: `type in releaseCompletedArtifacts`
- c0254 ..> c0254: `conflictIdentityMatches() calls identityMatches()`
- c0254 ..> c0254: `interruptedWrite() calls outcomeRecord()`
- c0254 ..> c0254: `releaseCompletedArtifacts() calls outcomeRecord()`
- c0254 ..> c0254: `releaseCompletedArtifacts() calls scrubDiagnostic()`
- c0254 ..> c0254: `setHistoryCaches() calls clearHistoryCache()`
- c0254 ..> c0254: `summaryCursor() calls orderedSourceEntryIds()`
- c0256 --> c0123: `field projects`
- c0256 --> c0126: `field scope`
- c0256 --> c0129: `field context`
- c0258 --> c0106: `field sessionContext`
- c0258 --> c0119: `field diagnosticContext`
- c0258 --> c0123: `field projects`
- c0258 --> c0126: `field scope`
- c0258 --> c0129: `field context`
- c0258 --> c0257: `field onPlan`
- c0259 --> c0126: `field scope`
- c0260 ..> c0013: `resultWithKnowledge() calls visible()`
- c0260 ..> c0078: `searchMemories() calls mapConcurrent()`
- c0260 ..> c0090: `constructor() calls isRecallConcurrency()`
- c0260 ..> c0090: `deeper() calls resolveScope()`
- c0260 ..> c0090: `recall() calls resolveScope()`
- c0260 --> c0108: `field client`
- c0260 ..> c0108: `type in constructor`
- c0260 ..> c0111: `type in memoryInScope`
- c0260 ..> c0111: `type in optionalKnowledge`
- c0260 --> c0114: `field model`
- c0260 ..> c0114: `type in constructor`
- c0260 ..> c0118: `type in recallReadTool`
- c0260 ..> c0123: `type in matchResolution`
- c0260 ..> c0123: `type in resolveScope`
- c0260 ..> c0126: `type in empty`
- c0260 ..> c0126: `type in memoryInScope`
- c0260 ..> c0126: `type in optionalKnowledge`
- c0260 ..> c0126: `type in requestsDifferentProject`
- c0260 ..> c0126: `type in resolveScope`
- c0260 ..> c0126: `type in searchMemories`
- c0260 ..> c0126: `type in searchRequest`
- c0260 ..> c0127: `type in searchRequest`
- c0260 ..> c0129: `type in contextProjectResolution`
- c0260 ..> c0129: `type in resolveScope`
- c0260 ..> c0129: `type in searchRequest`
- c0260 ..> c0169: `deeper() calls search()`
- c0260 ..> c0169: `resolveScope() calls listProjects()`
- c0260 ..> c0169: `searchMemories() calls search()`
- c0260 ..> c0180: `type in optionalKnowledge`
- c0260 ..> c0180: `type in resultWithKnowledge`
- c0260 --> c0181: `field knowledge`
- c0260 ..> c0181: `constructor() constructs KnowledgeReadService`
- c0260 ..> c0181: `optionalKnowledge() calls expand()`
- c0260 ..> c0196: `recallReadTool() calls executeKnowledgeRead()`
- c0260 ..> c0228: `recall() calls complete()`
- c0260 ..> c0232: `deeper() calls sanitizeText()`
- c0260 ..> c0232: `finishReview() calls sanitizeText()`
- c0260 ..> c0232: `optionalKnowledge() calls errorMessage()`
- c0260 ..> c0232: `plannerInput() calls sanitizeText()`
- c0260 ..> c0232: `queryContext() calls sanitizeText()`
- c0260 ..> c0232: `recall() calls sanitizeText()`
- c0260 ..> c0232: `recall() calls sanitizeValue()`
- c0260 ..> c0232: `searchFailure() calls errorMessage()`
- c0260 ..> c0232: `searchFailure() calls sanitizeValue()`
- c0260 ..> c0255: `type in authorizeProjectSelection`
- c0260 ..> c0255: `type in ensureLive`
- c0260 ..> c0255: `type in finishFailure`
- c0260 ..> c0255: `type in searchMemories`
- c0260 ..> c0256: `type in deeper`
- c0260 ..> c0257: `type in authorizeProjectSelection`
- c0260 ..> c0257: `type in queryContext`
- c0260 ..> c0257: `type in requestsDifferentProject`
- c0260 ..> c0257: `type in searchMemories`
- c0260 ..> c0257: `type in searchRequest`
- c0260 ..> c0258: `type in authorizeProjectSelection`
- c0260 ..> c0258: `type in finishFailure`
- c0260 ..> c0258: `type in plannerInput`
- c0260 ..> c0258: `type in recall`
- c0260 ..> c0258: `type in recallReadTool`
- c0260 ..> c0258: `type in requestsDifferentProject`
- c0260 ..> c0258: `type in searchMemories`
- c0260 ..> c0259: `type in deeper`
- c0260 ..> c0259: `type in empty`
- c0260 ..> c0259: `type in finishFailure`
- c0260 ..> c0259: `type in finishReview`
- c0260 ..> c0259: `type in recall`
- c0260 ..> c0259: `type in recallReadTool`
- c0260 ..> c0259: `type in resultWithKnowledge`
- c0260 ..> c0260: `authorizeProjectSelection() calls requestsDifferentProject()`
- c0260 ..> c0260: `circuitOpen() calls now()`
- c0260 ..> c0260: `deeper() calls circuitOpen()`
- c0260 ..> c0260: `deeper() calls empty()`
- c0260 ..> c0260: `deeper() calls memoryInScope()`
- c0260 ..> c0260: `deeper() calls optionalKnowledge()`
- c0260 ..> c0260: `deeper() calls recordFailure()`
- c0260 ..> c0260: `deeper() calls recordSuccess()`
- c0260 ..> c0260: `deeper() calls resultWithKnowledge()`
- c0260 ..> c0260: `finishFailure() calls empty()`
- c0260 ..> c0260: `finishFailure() calls recordFailure()`
- c0260 ..> c0260: `finishReview() calls recordFailure()`
- c0260 ..> c0260: `finishReview() calls recordSuccess()`
- c0260 ..> c0260: `recall() calls authorizeProjectSelection()`
- c0260 ..> c0260: `recall() calls circuitOpen()`
- c0260 ..> c0260: `recall() calls empty()`
- c0260 ..> c0260: `recall() calls ensureLive()`
- c0260 ..> c0260: `recall() calls finishFailure()`
- c0260 ..> c0260: `recall() calls finishReview()`
- c0260 ..> c0260: `recall() calls memoryInScope()`
- c0260 ..> c0260: `recall() calls optionalKnowledge()`
- c0260 ..> c0260: `recall() calls plannerInput()`
- c0260 ..> c0260: `recall() calls recallReadTool()`
- c0260 ..> c0260: `recall() calls recordSuccess()`
- c0260 ..> c0260: `recall() calls resultWithKnowledge()`
- c0260 ..> c0260: `recall() calls searchMemories()`
- c0260 ..> c0260: `recall() calls searchRequest()`
- c0260 ..> c0260: `recordFailure() calls now()`
- c0260 ..> c0260: `resolveScope() calls contextProjectResolution()`
- c0260 ..> c0260: `resolveScope() calls matchResolution()`
- c0260 ..> c0260: `searchMemories() calls ensureLive()`
- c0260 ..> c0260: `searchMemories() calls searchFailure()`
- c0260 ..> c0260: `searchMemories() calls searchRequest()`
- c0260 ..> c0260: `searchRequest() calls queryContext()`
- c0260 ..> c0261: `type in constructor`
- c0260 ..> c0262: `finishReview() constructs ReviewValidationError`
- c0260 ..> c0263: `type in contextProjectResolution`
- c0260 ..> c0263: `type in matchResolution`
- c0260 ..> c0263: `type in recallReadTool`
- c0260 ..> c0263: `type in resolveScope`
- c0260 ..> c0263: `type in searchMemories`
- c0260 ..> c0263: `type in searchRequest`
- c0260 ..> c0264: `type in searchMemories`
- c0260 ..> c0265: `authorizeProjectSelection() calls raceAbort()`
- c0260 ..> c0265: `deeper() calls createDeadlineSignal()`
- c0260 ..> c0265: `deeper() calls failureReason()`
- c0260 ..> c0265: `deeper() calls formatRecall()`
- c0260 ..> c0265: `deeper() calls isForgetfulResponseError()`
- c0260 ..> c0265: `deeper() calls raceAbort()`
- c0260 ..> c0265: `deeper() calls trim()`
- c0260 ..> c0265: `ensureLive() calls abortError()`
- c0260 ..> c0265: `finishFailure() calls failureReason()`
- c0260 ..> c0265: `finishFailure() calls submissionAttemptTrace()`
- c0260 ..> c0265: `finishReview() calls parseReview()`
- c0260 ..> c0265: `finishReview() calls reviewMismatchDirection()`
- c0260 ..> c0265: `finishReview() calls reviewSources()`
- c0260 ..> c0265: `finishReview() calls reviewValidationDebug()`
- c0260 ..> c0265: `finishReview() calls sourceLabels()`
- c0260 ..> c0265: `finishReview() calls submissionAttemptTrace()`
- c0260 ..> c0265: `optionalKnowledge() calls raceAbort()`
- c0260 ..> c0265: `plannerInput() calls availableProjects()`
- c0260 ..> c0265: `recall() calls boundDebugText()`
- c0260 ..> c0265: `recall() calls createDeadlineSignal()`
- c0260 ..> c0265: `recall() calls formatRecall()`
- c0260 ..> c0265: `recall() calls parsePlan()`
- c0260 ..> c0265: `recall() calls raceAbort()`
- c0260 ..> c0265: `recall() calls recallReviewSubmission()`
- c0260 ..> c0265: `recall() calls reviewSources()`
- c0260 ..> c0265: `recall() calls sanitizePolicy()`
- c0260 ..> c0265: `recall() calls submissionAttemptTrace()`
- c0260 ..> c0265: `recall() calls trim()`
- c0260 ..> c0265: `recallReadTool() calls abortError()`
- c0260 ..> c0265: `recallReadTool() calls reviewSources()`
- c0260 ..> c0265: `resolveScope() calls availableProjects()`
- c0260 ..> c0265: `searchMemories() calls exceptionDiagnostic()`
- c0260 ..> c0265: `searchMemories() calls isAbort()`
- c0260 ..> c0265: `searchMemories() calls raceAbort()`
- c0260 ..> c0265: `searchRequest() calls repoAwareQuery()`
- c0263 --> c0123: `field project`
- c0264 --> c0111: `field memories`
- c0265 ..> c0004: `availableProjects() calls set()`
- c0265 ..> c0111: `type in formatRecall`
- c0265 ..> c0111: `type in validateMemory`
- c0265 ..> c0121: `type in recallReviewSubmission`
- c0265 ..> c0123: `type in availableProjects`
- c0265 ..> c0129: `type in availableProjects`
- c0265 ..> c0129: `type in repoAwareQuery`
- c0265 ..> c0129: `type in repositoryIdentity`
- c0265 ..> c0180: `type in formatRecall`
- c0265 ..> c0232: `exceptionDiagnostic() calls sanitizeText()`
- c0265 ..> c0232: `formatRecall() calls sanitizeText()`
- c0265 ..> c0232: `parseReview() calls sanitizeText()`
- c0265 ..> c0232: `plannerString() calls sanitizeText()`
- c0265 ..> c0232: `repoAwareQuery() calls sanitizeText()`
- c0265 ..> c0232: `repositoryIdentity() calls sanitizeText()`
- c0265 ..> c0232: `reviewMismatchDirection() calls sanitizeText()`
- c0265 ..> c0232: `reviewerOutputText() calls sanitizeText()`
- c0265 ..> c0232: `reviewerOutputText() calls sanitizeValue()`
- c0265 ..> c0232: `sanitizePolicy() calls sanitizeText()`
- c0265 ..> c0232: `submissionAttemptTrace() calls sanitizeText()`
- c0265 ..> c0255: `type in createDeadlineSignal`
- c0265 ..> c0255: `type in failureReason`
- c0265 ..> c0257: `type in parsePlan`
- c0265 ..> c0259: `type in parseReview`
- c0265 ..> c0259: `type in recallReviewSubmission`
- c0265 ..> c0259: `type in reviewSources`
- c0265 ..> c0259: `type in reviewValidationDebug`
- c0265 ..> c0260: `createDeadlineSignal() calls now()`
- c0265 ..> c0265: `createDeadlineSignal() calls exceptionDiagnostic()`
- c0265 ..> c0265: `formatRecall() calls trim()`
- c0265 ..> c0265: `parseEntities() calls plannerString()`
- c0265 ..> c0265: `parsePlan() calls isObject()`
- c0265 ..> c0265: `parsePlan() calls parseEntities()`
- c0265 ..> c0265: `parsePlan() calls parseQueries()`
- c0265 ..> c0265: `parsePlan() calls plannerString()`
- c0265 ..> c0265: `parsePlan() calls positiveInteger()`
- c0265 ..> c0265: `parseQueries() calls plannerString()`
- c0265 ..> c0265: `parseReview() calls isObject()`
- c0265 ..> c0265: `parseReview() calls reviewSources()`
- c0265 ..> c0265: `parseReview() calls sourceLabels()`
- c0265 ..> c0265: `parseReview() calls trim()`
- c0265 ..> c0265: `plannerString() calls trim()`
- c0265 ..> c0265: `raceAbort() calls abortError()`
- c0265 ..> c0265: `repoAwareQuery() calls repositoryIdentity()`
- c0265 ..> c0265: `repoAwareQuery() calls trim()`
- c0265 ..> c0265: `repositoryIdentity() calls trim()`
- c0265 ..> c0265: `reviewMismatchDirection() calls isObject()`
- c0265 ..> c0265: `reviewMismatchDirection() calls trim()`
- c0265 ..> c0265: `reviewValidationDebug() calls boundDebugText()`
- c0265 ..> c0265: `reviewValidationDebug() calls reviewSources()`
- c0265 ..> c0265: `reviewValidationDebug() calls reviewerOutputText()`
- c0265 ..> c0265: `reviewValidationDebug() calls sourceLabels()`
- c0265 ..> c0265: `submissionAttemptTrace() calls trim()`
- c0265 ..> c0265: `validateMemory() calls isObject()`
- c0266 ..> c0265: `repositoryName() calls trim()`
- c0268 ..> c0267: `type in buildSetupPrompt`
- c0268 ..> c0267: `type in promptSetupHelp`
- c0269 --|> c0093: `inherits`
- c0271 --> c0092: `field mode`
- c0271 --> c0126: `field scope`
- c0271 --> c0129: `field context`
- c0271 --> c0273: `field session`
- c0272 --> c0269: `field snapshot`
- c0274 ..> c0091: `type in captureSummaryRecord`
- c0274 ..> c0091: `type in reuseCaptureHistory`
- c0274 ..> c0093: `type in captureConversation`
- c0274 ..> c0093: `type in compactCaptureSnapshot`
- c0274 ..> c0093: `type in reuseCaptureHistory`
- c0274 ..> c0093: `type in sanitizeCaptureSnapshot`
- c0274 ..> c0097: `type in compactCaptureSnapshot`
- c0274 ..> c0106: `type in collectEvidence`
- c0274 ..> c0106: `type in evidenceForEntry`
- c0274 ..> c0106: `type in toolEvidence`
- c0274 ..> c0232: `captureSummaryRecord() calls sanitizeText()`
- c0274 ..> c0232: `compactCaptureSnapshot() calls sanitizeText()`
- c0274 ..> c0232: `conversationForEntry() calls isMemoryOperation()`
- c0274 ..> c0232: `safeText() calls sanitizeText()`
- c0274 ..> c0232: `sanitizeCaptureSnapshot() calls sanitizeValue()`
- c0274 ..> c0232: `sanitizeConversation() calls sanitizeText()`
- c0274 ..> c0232: `sanitizeConversation() calls sanitizeValue()`
- c0274 ..> c0232: `toolEvidence() calls isMemoryOperation()`
- c0274 ..> c0232: `toolEvidence() calls sanitizeValue()`
- c0274 ..> c0265: `compactCaptureSnapshot() calls trim()`
- c0274 ..> c0265: `safeText() calls trim()`
- c0274 ..> c0270: `type in asMessage`
- c0274 ..> c0270: `type in lastAssistantEntry`
- c0274 ..> c0270: `type in toolEvidence`
- c0274 ..> c0271: `type in buildCaptureSnapshot`
- c0274 ..> c0271: `type in collectEvidence`
- c0274 ..> c0271: `type in toolEvidence`
- c0274 ..> c0272: `type in buildCaptureSnapshot`
- c0274 ..> c0274: `asMessage() calls isRecord()`
- c0274 ..> c0274: `buildCaptureSnapshot() calls collectEvidence()`
- c0274 ..> c0274: `buildCaptureSnapshot() calls deltaStartIndex()`
- c0274 ..> c0274: `buildCaptureSnapshot() calls lastAssistantEntry()`
- c0274 ..> c0274: `buildCaptureSnapshot() calls rootId()`
- c0274 ..> c0274: `buildCaptureSnapshot() calls snapshotId()`
- c0274 ..> c0274: `captureConversation() calls isRecord()`
- c0274 ..> c0274: `collectEvidence() calls evidenceForEntry()`
- c0274 ..> c0274: `compactCaptureSnapshot() calls captureConversation()`
- c0274 ..> c0274: `compactCaptureSnapshot() calls captureSummaryRecord()`
- c0274 ..> c0274: `compactCaptureSnapshot() calls isRecord()`
- c0274 ..> c0274: `contentText() calls isRecord()`
- c0274 ..> c0274: `conversationForEntry() calls asMessage()`
- c0274 ..> c0274: `conversationForEntry() calls isRecord()`
- c0274 ..> c0274: `conversationForEntry() calls sanitizeConversation()`
- c0274 ..> c0274: `evidenceForEntry() calls asMessage()`
- c0274 ..> c0274: `evidenceForEntry() calls contentText()`
- c0274 ..> c0274: `evidenceForEntry() calls isRecord()`
- c0274 ..> c0274: `evidenceForEntry() calls safeText()`
- c0274 ..> c0274: `evidenceForEntry() calls toolEvidence()`
- c0274 ..> c0274: `lastAssistantEntry() calls asMessage()`
- c0274 ..> c0274: `reuseCaptureHistory() calls captureSummaryRecord()`
- c0274 ..> c0274: `reuseCaptureHistory() calls isRecord()`
- c0274 ..> c0274: `sanitizeCaptureSnapshot() calls sanitizeCaptureConversation()`
- c0274 ..> c0274: `sanitizeConversation() calls isRecord()`
- c0274 ..> c0274: `toolEvidence() calls contentText()`
- c0274 ..> c0274: `toolEvidence() calls safeText()`
- c0277 --> c0275: `field error`
- c0277 --> c0275: `field provenanceError`
- c0278 ..> c0004: `readFile() calls close()`
- c0278 ..> c0009: `readFile() calls open()`
- c0278 ..> c0069: `getUrl() calls resolve()`
- c0278 ..> c0069: `git() calls resolve()`
- c0278 ..> c0069: `inspect() calls resolve()`
- c0278 ..> c0169: `getUrl() calls get()`
- c0278 ..> c0196: `readFile() calls readFile()`
- c0278 ..> c0210: `git() calls execute()`
- c0278 ..> c0232: `inspect() calls sanitizeValue()`
- c0278 ..> c0232: `inspectUrl() calls sanitizeText()`
- c0278 ..> c0232: `inspectUrl() calls sanitizeValue()`
- c0278 ..> c0265: `provenance() calls trim()`
- c0278 ..> c0276: `type in inspectUrl`
- c0278 ..> c0277: `type in inspect`
- c0278 ..> c0277: `type in inspectUrl`
- c0278 ..> c0278: `getUrl() calls check()`
- c0278 ..> c0278: `git() calls check()`
- c0278 ..> c0278: `inspect() calls check()`
- c0278 ..> c0278: `inspect() calls inspectUrl()`
- c0278 ..> c0278: `inspect() calls provenance()`
- c0278 ..> c0278: `inspect() calls readFile()`
- c0278 ..> c0278: `inspectUrl() calls check()`
- c0278 ..> c0278: `inspectUrl() calls getUrl()`
- c0278 ..> c0278: `provenance() calls git()`
- c0278 ..> c0278: `readFile() calls check()`
- c0278 --> c0279: `field options`
- c0278 ..> c0279: `type in constructor`
- c0278 ..> c0280: `getUrl() calls validateAddress()`
- c0278 ..> c0280: `getUrl() calls validateUrl()`
- c0278 ..> c0280: `git() calls requireInside()`
- c0278 ..> c0280: `inspect() calls errorDetails()`
- c0278 ..> c0280: `inspect() calls requireInside()`
- c0278 ..> c0280: `inspect() calls sourceContent()`
- c0278 ..> c0280: `inspectUrl() calls loopback()`
- c0278 ..> c0280: `inspectUrl() calls sourceContent()`
- c0278 ..> c0280: `inspectUrl() calls validateUrl()`
- c0278 ..> c0280: `provenance() calls errorDetails()`
- c0278 ..> c0280: `readFile() calls requireInside()`
- c0280 ..> c0232: `errorDetails() calls sanitizeText()`
- c0280 ..> c0232: `sourceContent() calls sanitizeText()`
- c0280 ..> c0232: `validateUrl() calls sanitizeText()`
- c0280 ..> c0232: `validateUrl() calls sanitizeValue()`
- c0280 ..> c0275: `type in errorDetails`
- c0280 ..> c0276: `type in sourceContent`
- c0280 ..> c0278: `validateAddress() calls check()`
- c0280 ..> c0280: `validateAddress() calls loopback()`

## Type key

- Type1: `(text: string) => string`
- Type2: `ApiForgetfulClientOptions & { secrets?: string[] }`
- Type3: `() => Promise<T>`
- Type4: `"missing" | "unavailable"`
- Type5: `Promise<PlanningResult<PlanningCapability>>`
- Type6: `Promise<PlanningResult<PlanningProject[]>>`
- Type7: `Promise<PlanningResult<PlanningPlanSummary[]>>`
- Type8: `Promise<PlanningResult<PlanningTaskSummary[]>>`
- Type9: `Record<string, unknown>`
- Type10: `string | null`
- Type11: `(value: unknown) => T`
- Type12: `() => void`
- Type13: `(work: Promise<void>) => void`
- Type14: `string | null | undefined`
- Type15: `PlanningState["planTasks"]`
- Type16: `number | undefined`
- Type17: `PlanningPlan | undefined`
- Type18: `PlanningTask | undefined`
- Type19: `PlanningError | undefined`
- Type20: `{ generation: number; promise: Promise<void> }`
- Type21: `(state: PlanningState) => void`
- Type22: `() => boolean`
- Type23: `{ enabled: boolean; ready: boolean; repoName?: string }`
- Type24: `Promise<number | undefined>`
- Type25: `Promise<PlanningState["planTasks"]>`
- Type26: `PlanningState["availability"]`
- Type27: `PlanningError["kind"]`
- Type28: `"denied" | "unavailable" | "transient" | "missing" | "invalid" | "cancelled"`
- Type29: `{ ok: true; value: T } | { ok: false; error: PlanningError }`
- Type30: `"idle" | "off" | "not-ready" | "loading" | "ready" | "no-project" | "disabled" |
  "unavailable" | "denied" | "error"`
- Type31: `Record<number, PlanningPlanTasks>`
- Type32: `() => Promise<string | undefined>`
- Type33: `"ready" | "needs-review" | "exhausted"`
- Type34: `"correctable" | "retry"`
- Type35: `{ tool: ModelReadTool; requireObserved: () => void; }`
- Type36: `"pending" | "planned" | "complete" | "partial" | "unsupported"`
- Type37: `Array<{ memoryId: number; reason: string }>`
- Type38: `{ documents: Document[]; codeArtifacts: CodeArtifact[] }`
- Type39: `Array<{ operation: string; error: string }>`
- Type40: `"link" | "unlink" | "attachments" | "entity"`
- Type41: `"started" | "completed" | "failed"`
- Type42: `"keep" | "reject" | "add" | "ignore" | "unresolved"`
- Type43: `"complete" | "unresolved"`
- Type44: `Promise<Memory | undefined>`
- Type45: `NonNullable<CaptureLinkReview["unreviewed"]>`
- Type46: `{ automaticIds?: number[]; beforeRead: () => Promise<void>; includeAttachments?: boolean
  }`
- Type47: `Map<string, boolean>`
- Type48: `Map<string, { decisions: LinkDecision[]; preservation?: PreservationDecision }>`
- Type49: `Array<{ candidateId: string; review: CaptureLinkReview }>`
- Type50: `ConnectionResult["operation"]`
- Type51: `(markDispatched: () => void) => Promise<unknown>`
- Type52: `(review: CaptureLinkReview) => Promise<void>`
- Type53: `() => Promise<void>`
- Type54: `Promise<{ documents: Document[]; codeArtifacts: CodeArtifact[] }>`
- Type55: `Record<string, { status: "started" | "completed" | "rejected"; error?: string; input?:
  unknown; }>`
- Type56: `(number[] | undefined)[]`
- Type57: `number | null | undefined`
- Type58: `Pick<MergeConnections, "documentIds" | "codeArtifactIds" | "fileIds">`
- Type59: `Array<{ id: string; reason: string }>`
- Type60: `| { valid: true; value: T } | { valid: false; reason: string }`
- Type61: `"create" | "skip" | "supersede" | "escalate" | "retire" | "merge"`
- Type62: `"reviewing" | "saving" | "checking"`
- Type63: `"memory" | "maintenance"`
- Type64: `"userDecision" | "verifiedToolChange" | "observation"`
- Type65: `Array<{ jobId: string; error: string }>`
- Type66: `"ready" | "busy"`
- Type67: `{ status: CaptureLinkReview["status"]; unreviewedCount: number; reason?: string }`
- Type68: `PendingConflict["status"]`
- Type69: `{ error: unknown }`
- Type70: `{ entryId: string; inspectionEntryIds: string[] } | null`
- Type71: `"resolved" | "deferred" | "rejected"`
- Type72: `Array<{ key: string; id: number }>`
- Type73: `(id: number) => Promise<Memory>`
- Type74: `() => boolean | Promise<boolean>`
- Type75: `() => CaptureMode | Promise<CaptureMode>`
- Type76: `() => Date`
- Type77: `CaptureServiceOptions["onActivity"]`
- Type78: `(signal: AbortSignal) => Promise<T>`
- Type79: `"reviewing" | "checking"`
- Type80: `"info" | "debug"`
- Type81: `"capture" | "overlap" | "overlapBatch"`
- Type82: `"created" | "skipped" | "replacement-created"`
- Type83: `Promise<"applied" | "already">`
- Type84: `Promise<{ job: QueueJob; destination?: number }>`
- Type85: `Promise< | { status: "ready"; job: QueueJob; outcome: Record<string, unknown> |
  undefined; overlaps: Memory[]; } | { status: "skipped"; job: QueueJob } >`
- Type86: `Record<string, unknown> | undefined`
- Type87: `Promise<Entity | undefined>`
- Type88: `Promise<{ entities: Entity[]; truncated: boolean }>`
- Type89: `Promise<{ relationships: EntityRelationship[]; truncated: boolean }>`
- Type90: `Promise<{ job: QueueJob; inputs: CaptureBatchInput[] }>`
- Type91: `Promise< | { status: "ready"; job: QueueJob; decision: CaptureDecision } | { status:
  "skipped"; job: QueueJob } >`
- Type92: `Promise<{ job: QueueJob; plan: CaptureMergePlan }>`
- Type93: `Promise<{ job: QueueJob; candidates: CaptureCandidate[]; progress?: boolean }>`
- Type94: `{ candidate: CaptureCandidate; decision?: CaptureDecision }`
- Type95: `CaptureMergePlan | undefined`
- Type96: `Promise<QueueJob | undefined>`
- Type97: `CaptureUncertainWrite | undefined`
- Type98: `Promise<{ job: QueueJob; stopped: boolean }>`
- Type99: `CaptureLinkReview | undefined`
- Type100: `Promise<{ job: QueueJob; inputs: Array<{ candidateId: string; review: CaptureLinkReview
  }> }>`
- Type101: `{ candidate: CaptureCandidate; outcome: Record<string, unknown>; review:
  CaptureLinkReview; operation: string; error: unknown; }`
- Type102: `Promise<{ job: QueueJob; needsCorrection: boolean }>`
- Type103: `Promise<"progress" | void>`
- Type104: `Promise<"advance" | "progress" | "deferred">`
- Type105: `CaptureSnapshot | CaptureCheckpointOptions`
- Type106: `{ sessionId?: string; branchId?: string; jobId?: string; limit?: number; }`
- Type107: `{ sessionId?: string; branchId?: string; }`
- Type108: `{ sessionId?: string; branchId?: string } | string`
- Type109: `Promise<NonNullable<PendingConflict["replacement"]>>`
- Type110: `CaptureAdvanceInput | CaptureSnapshot`
- Type111: `Pick<WorkContext, "sessionId" | "branchId">`
- Type112: `(phase: CaptureActivityPhase | undefined) => void`
- Type113: `{ id: number; name: string }[]`
- Type114: `"supersede" | "skip" | "defer"`
- Type115: `CaptureDecision | undefined`
- Type116: `string | undefined`
- Type117: `(id: string, raw: unknown, reason?: string) => void`
- Type118: `(reason: string) => void`
- Type119: `number[] | undefined`
- Type120: `string[] | undefined`
- Type121: `"reason" | "oldClaim" | "newClaim"`
- Type122: `KnowledgeWritePlan | undefined`
- Type123: `(item: T, index: number) => Promise<R>`
- Type124: `{ userSettings: string; projectSettings: string; }`
- Type125: `"classification" | "recall" | "capture"`
- Type126: `"default" | "project" | "invalid"`
- Type127: `"debug" | "info" | "warning" | "error"`
- Type128: `value is Record<string, unknown>`
- Type129: `ModelSelection | undefined`
- Type130: `{ scope: Scope; scopeSource: ScopeSource }`
- Type131: `Partial< Pick< PersistedUserSettings, | "base_url" | "token_env" | "timeout_ms" |
  "enabled" | "planning_panel" | "capture_mode" | "debug" | "verbosity" | "logging" |
  "log_directory" | "recall_model_timeout_ms" | "recall_concurrency" | "context_limit_tokens" |
  "model" > >`
- Type132: `{ baseUrl: string; tokenEnv?: string }`
- Type133: `"auto" | "observe" | "off"`
- Type134: `"complete" | "legacy-partial" | "summarized"`
- Type135: `number | null`
- Type136: `Omit<CodeArtifact, "code">`
- Type137: `Omit<Document, "content">`
- Type138: `"Organization" | "Individual" | "Team" | "Device" | "System" | "Other"`
- Type139: `"user" | "assistant" | "toolResult"`
- Type140: `Promise<{ id: number; title: string }[]>`
- Type141: `Promise<"ready" | "progress">`
- Type142: `"classification" | "recall-review" | "capture" | "overlap"`
- Type143: `(view: CompactedConversation) => Promise<void>`
- Type144: `() => unknown`
- Type145: `{ jobId?: string; sessionId?: string; branchId?: string; candidateId?: string; }`
- Type146: `"global" | "project"`
- Type147: `"draft" | "active" | "completed" | "archived"`
- Type148: `"unknown" | "enabled" | "disabled"`
- Type149: `"P0" | "P1" | "P2" | "P3"`
- Type150: `"todo" | "doing" | "waiting" | "done" | "cancelled"`
- Type151: `Array<{ key: string; stage: string; reason?: string; count?: number }>`
- Type152: `{ detail: string; retryPending: boolean; key: string }`
- Type153: `| { kind: "completed"; value: T } | { kind: "aborted" } | { kind: "timed-out" } | {
  kind: "failed"; error: unknown }`
- Type154: `"completed"`
- Type155: `"aborted"`
- Type156: `"timed-out"`
- Type157: `"failed"`
- Type158: `{ sessionId: string; branchId: string; entryIds: string[]; finalEntryId?: string;
  snapshotId?: string; }`
- Type159: `void | Promise<void>`
- Type160: `{ action: "supersede" | "skip" | "defer"; reason?: string; evidenceEntryIds?: string[];
  additionalEvidence?: string; additionalEntries?: EvidenceEntry[]; conversation?: readonly
  unknown[]; }`
- Type161: `Map<string, number>`
- Type162: `(options: { baseUrl: string; token?: string; timeoutMs: number; }) => ForgetfulClient`
- Type163: `( client: ForgetfulClient, model: PiMemoryModel, config: ForgetfulConfig, ) =>
  RecallServicePort`
- Type164: `( config: ForgetfulConfig, client: ForgetfulClient | undefined, model: PiMemoryModel |
  undefined, ) => CaptureServicePort | undefined`
- Type165: `( ctx: ExtensionContext, branchId: string, ) => Promise<ExtensionWorkContext> |
  ExtensionWorkContext`
- Type166: `Partial< Pick< LoadConfigOptions, | "userSettingsPath" | "projectSettingsPath" |
  "userPromptDir" | "projectPromptDir" > >`
- Type167: `Partial<Record<PolicyName, string>>`
- Type168: `keyof typeof DEFAULT_MEMORY_POLICIES | "capture" | "overlap"`
- Type169: `"automatic" | "queued"`
- Type170: `"pending" | "retrieval" | "terminal"`
- Type171: `RecallRequest & { sessionContext?: EvidenceEntry[] }`
- Type172: `Map<string, CaptureFeedbackState>`
- Type173: `{ throughTriggerId: number; branches: CaptureBranch[] }`
- Type174: `Map<string, PendingQueuedRecall[]>`
- Type175: `Map<string, AutomaticRecall>`
- Type176: `Map<string, RecallJob>`
- Type177: `readonly (AbortSignal | undefined)[]`
- Type178: `Promise<string | undefined>`
- Type179: `Promise<SetupAuthentication | undefined>`
- Type180: `"context" | "failure" | "no-context"`
- Type181: `{ id: string; prompt: string } | undefined`
- Type182: `Array<{ role: string; content?: unknown }>`
- Type183: `Promise<Model<any> | undefined>`
- Type184: `Model<any> | undefined`
- Type185: `"info" | "warning" | "error"`
- Type186: `"warning" | "error"`
- Type187: `CaptureCheckpointResult | undefined`
- Type188: `AutomaticCaptureJobOutcome | undefined`
- Type189: `Promise<AutomaticCaptureJobOutcome | undefined>`
- Type190: `{ failure?: NonNullable<AutomaticCaptureJobOutcome["failure"]>; recovered: boolean; }`
- Type191: `ReturnType<typeof collectCaptureFeedback>`
- Type192: `{ message?: string; terminalJobIds: string[] }`
- Type193: `(value: unknown) => Memory`
- Type194: `( path: string, method: string, body: unknown, signal: AbortSignal | undefined,
  statuses: number[], ) => Promise<unknown>`
- Type195: `Partial<DocumentInput | CodeArtifactInput>`
- Type196: `DocumentSummary | CodeArtifactSummary`
- Type197: `string | URL`
- Type198: `AbortSignal | undefined`
- Type199: `T | undefined`
- Type200: `NonNullable<KnowledgeExpansionResult["failures"]>`
- Type201: `{ operation: string; message: string }[]`
- Type202: `KnowledgeReadServiceOptions | MemoryReader`
- Type203: `Promise<Map<number, Entity>>`
- Type204: `Map<number, Entity>`
- Type205: `({ id: number; title: string }[] | undefined)[]`
- Type206: `( id: number, signal?: AbortSignal, ) => Promise<Memory>`
- Type207: `Promise<T | undefined>`
- Type208: `Record<string, unknown> & { operation: string }`
- Type209: `{ id: number; name: string }`
- Type210: `Array<ToolText | ToolImage>`
- Type211: `"image"`
- Type212: `"text"`
- Type213: `Array<[string, number]>`
- Type214: `Document | CodeArtifact`
- Type215: `"content" | "code"`
- Type216: `{ items: T[]; offset: number; limit: number; total: number; truncated: boolean }`
- Type217: `{ items: unknown[]; offset: number; limit: number; total: number; truncated: boolean;
  next_offset: number }`
- Type218: `{ content: Array<ToolText | ToolImage>; kind: string }`
- Type219: `{ source_repo?: string; source_files?: string[]; encoding_version?: string; }`
- Type220: `(() => Promise<void>) | undefined`
- Type221: `( state: KnowledgeWriteState, ) => Promise<void>`
- Type222: `{ title: string; content: string }`
- Type223: `{ kind: string; key: string; occurrence: number; input: unknown; error: string }`
- Type224: `{ kind: string; key: string; occurrence: number; input: unknown; create: () =>
  Promise<T>; }`
- Type225: `KnowledgeWriteGuard | undefined`
- Type226: `{ document_ids?: number[]; code_artifact_ids?: number[]; }`
- Type227: `{ kind: string; key: string; input: unknown; execute: () => Promise<unknown> }`
- Type228: `T & { occurrence: number }`
- Type229: `Pick< KnowledgeClient, | "getEntity" | "createEntity" | "getDocument" | "createDocument"
  | "getCodeArtifact" | "createCodeArtifact" | "createRelationship" | "linkEntityMemory" |
  "linkMemories" | "updateMemory" >`
- Type230: `{ key: string }[]`
- Type231: `"off" | "info" | "debug"`
- Type232: `{ directory: string; sessionId: string; level: FileLogLevel; onError?: (error: unknown)
  => void; maxFileBytes?: number; maxFiles?: number; maxEventBytes?: number; }`
- Type233: `{ lines: string[]; trace: boolean }`
- Type234: `CompactedMemoryHistory & { summaryMessage: Message }`
- Type235: `CompactedMemoryHistory | undefined`
- Type236: `(history: CompactedMemoryHistory) => Promise<void>`
- Type237: `Promise<number | "progress">`
- Type238: `( context: Context, options: SimpleStreamOptions, ) => Promise<AssistantMessage>`
- Type239: `ToolResultMessage["content"]`
- Type240: `Promise<{ summary: string; count: number }>`
- Type241: `( headers: ProviderHeaders, ) => ProviderHeaders | Promise<ProviderHeaders>`
- Type242: `ModelRegistryPort & { getAvailable?: () => Model<any>[]; }`
- Type243: `readonly { model: Model<any> }[]`
- Type244: `"task" | "compaction"`
- Type245: `() => Promise<number>`
- Type246: `ProviderHeaders | undefined`
- Type247: `MemoryModelHeaderTransform | undefined`
- Type248: `ModelSubmissionTool | ModelReadTool`
- Type249: `PiMemoryModel | undefined`
- Type250: `Project | undefined`
- Type251: `Promise<ProjectInput | undefined>`
- Type252: `Promise<Project | undefined>`
- Type253: `DurableQueueStoreOptions | string`
- Type254: `( state: QueueState, ) => | Promise<{ value: T; changed?: boolean }> | { value: T;
  changed?: boolean }`
- Type255: `WatermarkAdvance | CaptureSnapshot`
- Type256: `WorkContext & { projects?: Project[] }`
- Type257: `Promise<{ job: QueueJob; historyError?: string }>`
- Type258: `Promise<{ history?: NonNullable<SnapshotPayload["historySummary"]>; historyError?:
  string; }>`
- Type259: `Array<{ sessionId: string; branchId: string }>`
- Type260: `{ sessionId: string; branchId: string }`
- Type261: `(outcomes: Array<{ jobId: string; error: string }>) => void`
- Type262: `{ sessionId: string; branchId: string } | undefined`
- Type263: `QueueCheckpoint | string`
- Type264: `Promise<PendingConflict | undefined>`
- Type265: `"pending" | "handed_off" | "resolved" | "rejected"`
- Type266: `{ // Missing version identifies legacy implicit preservation plans; never execute as
  explicit. planVersion?: 1; requestKey?: string; requestPayload?: string; request?: {
  evidenceEntryIds: string[]; selectedAdditionalEntries: EvidenceEntry[]; reason?: string;
  additionalEvidence?: string; }; // The model's update selection and this plan's actual target are
  distinct from older targets. replacementMemoryId?: number; memoryId?: number; priorMemoryId?:
  number; updateComplete?: boolean; executionError?: string; // Service creation output, separate
  from model-selected manual link operations. autoLinkedMemoryIds?: number[]; completedEntityIds?:
  number[]; completedMemoryIds?: number[]; creationError?: string; input: MemoryInput; candidate:
  unknown; entityIds: number[]; memoryIds: number[]; linksComplete?: boolean; creationAttempted?:
  boolean; knowledgeState?: unknown; }`
- Type267: `Omit<CaptureSnapshot, "entries" | "conversation" | "sourceConversation">`
- Type268: `| "pending" | "running" | "paused" | "complete" | "failed"`
- Type269: `1 | 2`
- Type270: `Record<string, QueueWatermark>`
- Type271: `Pick<CaptureSnapshot, "entries" | "conversation" | "sourceConversation" |
  "historySummary"> & { /** Full source ordering for completed caches; kept outside the bounded
  queue index. */ historyEntryIds?: string[]; }`
- Type272: `"retire"`
- Type273: `{ throughEntryId: string; entryIds: string[]; } | undefined`
- Type274: `{ throughEntryId: string; entryIds: string[] }`
- Type275: `{ throughEntryId?: string; entryIds?: string[] }`
- Type276: `(stage: string, error: unknown) => string`
- Type277: `NonNullable<ModelRequest["diagnosticContext"]>`
- Type278: `(projectId: number, reason: string) => Promise<boolean>`
- Type279: `(plan: RecallPlan) => void`
- Type280: `() => number`
- Type281: `{ stage: string; debugTrace: string; plannerRejections: string[]; reviewRejections:
  string[]; failedReviewDebug: string | undefined; }`
- Type282: `Promise<KnowledgeExpansionResult | undefined>`
- Type283: `KnowledgeExpansionResult | undefined`
- Type284: `Project[] | undefined`
- Type285: `error is Error & { responseBody: string }`
- Type286: `Memory | undefined`
- Type287: `{ text: string; ids: number[]; knowledgeText: string }`
- Type288: `Record<keyof typeof SOURCE_FIELDS, number[]>`
- Type289: `"Review" | "Planner"`
- Type290: `{ summary: string; reason: string; sources: ReturnType<typeof reviewSources>; }`
- Type291: `(debug: string) => void`
- Type292: `"CLI" | "MCP"`
- Type293: `Promise<SetupHelp | "manual" | undefined>`
- Type294: `(toolName: string, text: string) => boolean`
- Type295: `| { status: "ready"; snapshot: CaptureSnapshotWithStatus } | { status: "skipped";
  reason: string; finalEntryId?: string }`
- Type296: `"ready"`
- Type297: `"skipped"`
- Type298: `MessageRecord | undefined`
- Type299: `EvidenceEntry | undefined`
- Type300: `SnapshotOptions["includeToolEvidence"]`
- Type301: `| ((toolName: string, text: string) => boolean) | undefined`
- Type302: `{ entry: SessionEntry; message: MessageRecord } | undefined`
- Type303: `CaptureHistorySummary | undefined`
- Type304: `Pick< Static<typeof SOURCE_INSPECTION_PARAMETERS>, "offset" | "limit" > & ({ path:
  string; url?: never } | { url: string; path?: never })`
- Type305: `{ status: "ok"; identifier: string; content: string; observedAt: string; /** SHA-256 of
  the complete observed source bytes, before sanitizing or paging. */ contentHash: string;
  sanitized: boolean; page: { offset: number; totalCharacters: number; nextOffset?: number };
  source_repo?: string; source_files?: string[]; source_url?: string; encoding_version?: string; /**
  Describes the observed file bytes, not the repository/index as a whole. */ fileState?: "committed"
  | "modified" | "uncommitted" | "unknown"; provenanceError?: SourceInspectionError; httpStatus?:
  number; } | { status: "error"; observedAt: string; error: SourceInspectionError; source_url?:
  string; httpStatus?: number; httpStatusText?: string; body?: string; }`
- Type306: `"ok"`
- Type307: `{ offset: number; totalCharacters: number; nextOffset?: number }`
- Type308: `"committed" | "modified" | "uncommitted" | "unknown"`
- Type309: `"error"`
- Type310: `{ path: string; dev: number; ino: number }`
- Type311: `SourceInspectionRequest & { url: string }`
- Type312: `Promise<{ bytes: Buffer; status: number; statusText: string; location?: string; }>`

## Signature key

- Signature1: `plan(planId: number, projectId: number, signal: AbortSignal)
  Promise<PlanningResult<PlanningPlan>>`
- Signature2: `task(taskId: number, planId: number, signal: AbortSignal)
  Promise<PlanningResult<PlanningTask>>`
- Signature3: `constructor(tui: TUI, theme: Theme, controller: PlanningWorkflow, close: () => void,
  run: (work: Promise<void>) => void) unknown`
- Signature4: `panelPlan(state: PlanningState, plan: PlanningPlanSummary, width: number, theme:
  Theme) string[]`
- Signature5: `-readDetails(overview: Overview, planId: number, projectId: number, tasks:
  PlanningTaskSummary[], signal: AbortSignal) Promise<void>`
- Signature6: `+plan(planId: number, projectId: number, signal: AbortSignal)
  Promise<PlanningResult<PlanningPlan>>`
- Signature7: `+task(taskId: number, planId: number, signal: AbortSignal)
  Promise<PlanningResult<PlanningTask>>`
- Signature8: `createPlanningRuntime(ctx: ExtensionContext, config: ForgetfulConfig,
  discoverRepository: () => Promise<string | undefined>) unknown`
- Signature9: `prepareLinkReview(client: ForgetfulClient, memoryId: number, destination: number,
  scope: Scope, overlaps: Memory[], options: { automaticIds?: number[]; beforeRead: () =>
  Promise<void>; includeAttachments?: boolean }) Promise<CaptureLinkReview>`
- Signature10: `validateLinkDecisions(decisions: LinkDecision[], review: CaptureLinkReview, edges:
  Map<string, boolean>, candidateId: string) void`
- Signature11: `authorizedMemory(client: ForgetfulClient, id: number, destination: number, scope:
  Scope) Promise<Memory>`
- Signature12: `executeConnection(review: CaptureLinkReview, operation:
  ConnectionResult["operation"], targetId: number, execute: (markDispatched: () => void) =>
  Promise<unknown>, save: (review: CaptureLinkReview) => Promise<void>) Promise<void>`
- Signature13: `applyLinkReview(client: ForgetfulClient, destination: number, scope: Scope, initial:
  CaptureLinkReview, save: (review: CaptureLinkReview) => Promise<void>, beforeWrite: () =>
  Promise<void>, assertCanWrite: () => void) Promise<CaptureLinkReview>`
- Signature14: `readAttachmentRecords(client: ForgetfulClient, memory: Memory, beforeRead: () =>
  Promise<void>) Promise<{ documents: Document[]; codeArtifacts: CodeArtifact[] }>`
- Signature15: `preparePreviousConnections(client: ForgetfulClient, expected: Memory,
  _replacementId: number, _destination: number, beforeRead: () => Promise<void>)
  Promise<PreviousConnections>`
- Signature16: `preserveConnections(client: ForgetfulClient, initial: CaptureLinkReview,
  beforeWrite: () => Promise<void>, save: (review: CaptureLinkReview) => Promise<void>,
  assertCanWrite: () => void) Promise<CaptureLinkReview>`
- Signature17: `collectMergeConnections(client: ForgetfulClient, memories: Memory[], previous:
  MergeConnections) Promise<MergeConnections>`
- Signature18: `requireResourceScope(id: number, projectId: number | null | undefined, kind: string,
  access: MergeAccess) void`
- Signature19: `checkMergeAttachments(client: ForgetfulClient, plan: Pick<MergeConnections,
  "documentIds" | "codeArtifactIds" | "fileIds">, access: MergeAccess) Promise<void>`
- Signature20: `preflightMergeConnections(client: ForgetfulClient, plan: MergeConnections, access:
  MergeAccess) Promise<void>`
- Signature21: `preserveMergeConnections(client: ForgetfulClient, replacementId: number, plan:
  MergeConnections, options: MergeExecution) Promise<void>`
- Signature22: `-addConflict(job: QueueJob, candidate: CaptureCandidate, destinationProjectId:
  number, decision: CaptureDecision, reason: string, oldMemory: Memory, replacementId: number)
  Promise<PendingConflict>`
- Signature23: `-checkpointOutcome(job: QueueJob, candidateId: string, outcome: unknown)
  Promise<QueueJob>`
- Signature24: `-destinationProjects(candidate: CaptureCandidate, context: WorkContext)
  Promise<number[]>`
- Signature25: `-validateDecision(decision: CaptureDecision, _candidate: CaptureCandidate,
  _overlaps: Memory[], _batch: unknown, _neighborhood: CaptureNeighborhood) void`
- Signature26: `-createMemory(job: QueueJob, candidate: CaptureCandidate, destination: number,
  projectIds: unknown, replacement: unknown) Promise<MemoryCreateResult>`
- Signature27: `-writeKnowledge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  memoryId: number, baseOutcome: Record<string, unknown>, finalStage: "created" | "skipped" |
  "replacement-created", existingMemory: Memory) Promise<QueueJob>`
- Signature28: `-supersessionAlreadyApplied(job: QueueJob, oldMemoryId: number, replacementId:
  number | undefined, destination: number) Promise<boolean>`
- Signature29: `-applySupersession(job: QueueJob, oldMemory: Memory, replacementId: number |
  undefined, reason: string, destination: number) Promise<"applied" | "already">`
- Signature30: `-finishSupersession(job: QueueJob, candidate: CaptureCandidate, destination: number,
  oldMemory: Memory, replacementId: number, reason: string, decision: CaptureDecision)
  Promise<QueueJob>`
- Signature31: `-processReplacementCheckpoint(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature32: `-processKnowledgeCheckpoint(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature33: `-loadOverlaps(job: QueueJob, candidate: CaptureCandidate, outcome: Record<string,
  unknown> | undefined, destination: number) Promise< | { status: "ready"; job: QueueJob; outcome:
  Record<string, unknown> | undefined; overlaps: Memory[]; } | { status: "skipped"; job: QueueJob }
  >`
- Signature34: `-neighborhoodEntities(job: QueueJob, candidate: CaptureCandidate, destination:
  number) Promise<{ entities: Entity[]; truncated: boolean }>`
- Signature35: `-existingNeighborhood(job: QueueJob, candidate: CaptureCandidate, destination:
  number) Promise<CaptureNeighborhood>`
- Signature36: `-decideOverlap(job: QueueJob, candidate: CaptureCandidate, outcome: Record<string,
  unknown> | undefined, overlaps: Memory[], destination: number) Promise< | { status: "ready"; job:
  QueueJob; decision: CaptureDecision } | { status: "skipped"; job: QueueJob } >`
- Signature37: `-recordEscalation(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision, reason: string, oldMemory: Memory, outcomeReason: string)
  Promise<QueueJob>`
- Signature38: `-supersedeCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature39: `-readMaintenanceTargets(job: QueueJob, ids: number[], destination: number)
  Promise<Memory[]>`
- Signature40: `-preflightRetirement(job: QueueJob, candidateId: string, destination: number, ids:
  number[]) Promise<void>`
- Signature41: `-composeMerge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<{ job: QueueJob; plan: CaptureMergePlan }>`
- Signature42: `-verifyRequestedMerge(job: QueueJob, outcome: Record<string, unknown> | undefined,
  replacementId: number, destination: number) Promise<void>`
- Signature43: `-finishMerge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision, plan: CaptureMergePlan, replacementId: number) Promise<QueueJob>`
- Signature44: `-mergeCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<QueueJob>`
- Signature45: `-retireCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<QueueJob>`
- Signature46: `-equivalentMemory(job: QueueJob, candidateId: string, destination: number)
  Promise<Memory>`
- Signature47: `-skipCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature48: `-applyDecision(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature49: `-processCandidate(job: QueueJob, candidate: CaptureCandidate, outcome: unknown)
  Promise<QueueJob>`
- Signature50: `-saveCorrectableFailure(job: QueueJob, candidate: CaptureCandidate, error: unknown)
  Promise<QueueJob | undefined>`
- Signature51: `-recordCandidateFailure(currentJob: QueueJob, candidate: CaptureCandidate, error:
  unknown, result: CaptureCheckpointResult) Promise<void>`
- Signature52: `-pauseCandidate(job: QueueJob, error: CapturePause, result: CaptureCheckpointResult)
  Promise<void>`
- Signature53: `-correctCandidateFailures(job: QueueJob, candidates: CaptureCandidate[], result:
  CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature54: `-processCandidates(job: QueueJob, candidates: CaptureCandidate[], result:
  CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature55: `-processOrderedCandidates(job: QueueJob, candidates: CaptureCandidate[], ordered:
  CaptureCandidate[], result: CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature56: `-refreshLinkReview(current: QueueJob, candidates: CaptureCandidate[], outcome:
  Record<string, unknown>, mode: CaptureMode, prior: CaptureLinkReview | undefined)
  Promise<CaptureLinkReview>`
- Signature57: `-migrateLegacyLinkReview(job: QueueJob, candidateId: string, outcome: Record<string,
  unknown>) Promise<QueueJob>`
- Signature58: `-planLinkReviews(job: QueueJob, candidates: CaptureCandidate[], inputs: Array<{
  candidateId: string; review: CaptureLinkReview }>) Promise<QueueJob>`
- Signature59: `-previousSupersessionCompleted(job: QueueJob, outcome: Record<string, unknown>,
  review: CaptureLinkReview) Promise<boolean>`
- Signature60: `-finishReviewedSupersession(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature61: `-runBranchWorker(branch: CaptureBranch, budget: number, result:
  CaptureCheckpointResult) Promise<void>`
- Signature62: `-recordBranchFailure(job: QueueJob, result: CaptureCheckpointResult, error: unknown,
  started: number) Promise<void>`
- Signature63: `-checkpointBranch(branch: CaptureBranch, budget: number)
  Promise<CaptureCheckpointResult>`
- Signature64: `-appendCheckpointResult(total: CaptureCheckpointResult, result:
  CaptureCheckpointResult) void`
- Signature65: `pendingConflicts(optionsOrSession: { sessionId?: string; branchId?: string } |
  string, branchId: string) Promise<CapturePendingConflict[]>`
- Signature66: `-rejectConflict(conflict: PendingConflict, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature67: `-selectResolutionEvidence(conflict: PendingConflict, input: ResolveConflictInput,
  additionalIds: string[]) string[]`
- Signature68: `-validateResolutionEvidence(conflict: PendingConflict, input: ResolveConflictInput)
  ConflictResolutionEvidence`
- Signature69: `-markConflictResolved(conflictId: string, resolution: unknown)
  Promise<CaptureResolveResult>`
- Signature70: `-planConflictReplacement(conflict: PendingConflict, candidate: CaptureCandidate,
  evidence: ConflictResolutionEvidence, context: WorkContext, current: Memory, requestPayload:
  string, conversation: readonly unknown[]) Promise<NonNullable<PendingConflict["replacement"]>>`
- Signature71: `-updateResolutionReplacement(conflict: PendingConflict, replacementId: number)
  Promise<void>`
- Signature72: `-linkResolutionEntity(conflict: PendingConflict, replacementId: number, id: number)
  Promise<void>`
- Signature73: `-applyConflictResolution(conflict: PendingConflict, evidence:
  ConflictResolutionEvidence, target: ConflictResolutionTarget, requestPayload: string,
  conversation: readonly unknown[]) Promise<CaptureResolveResult>`
- Signature74: `-resolveConflictOwned(conflictId: string, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature75: `resolveConflict(conflictId: string, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature76: `sharedSourceEvidence(candidates: CaptureCandidate[], snapshot: CaptureSnapshot)
  EvidenceEntry[]`
- Signature77: `eligibleCandidate(value: unknown, snapshot: CaptureSnapshot, index: number)
  CandidateValidation<CaptureCandidate>`
- Signature78: `parseCandidates(value: unknown, snapshot: CaptureSnapshot, onCandidate: (id: string,
  raw: unknown, reason?: string) => void) CandidateExtraction`
- Signature79: `captureCandidateSubmission(snapshot: CaptureSnapshot, recordRejection: (reason:
  string) => void) ModelSubmissionTool`
- Signature80: `memoryInput(candidate: CaptureCandidate, projectIds: number[], context: WorkContext)
  MemoryInput`
- Signature81: `captureKnowledgePlan(candidate: CaptureCandidate, destination: number, memoryId:
  number, context: WorkContext, existingMemory: Memory, operationId: unknown, entityMemoryKeys:
  string[]) KnowledgeWritePlan | undefined`
- Signature82: `readPromptDirectory(path: string, trusted: boolean, warnings: string[])
  Promise<PromptOverlays>`
- Signature83: `mergePrompts(globalPrompts: PromptOverlays, projectPrompts: PromptOverlays)
  PromptOverlays`
- Signature84: `resolveScope(projectData: JsonReadResult, projectPath: string, trusted: boolean,
  warnings: string[]) { scope: Scope; scopeSource: ScopeSource }`
- Signature85: `+obsolete(id: number, reason: string, replacementId: number, signal: AbortSignal)
  Promise<void>`
- Signature86: `+supersede(id: number, replacementId: number, reason: string, signal: AbortSignal)
  Promise<void>`
- Signature87: `+updateEntity(id: number, input: Partial<EntityInput>, signal: AbortSignal)
  Promise<Entity>`
- Signature88: `+createRelationship(input: EntityRelationshipInput, signal: AbortSignal)
  Promise<EntityRelationship>`
- Signature89: `+updateDocument(id: number, input: Partial<DocumentInput>, signal: AbortSignal)
  Promise<Document>`
- Signature90: `+listCodeArtifacts(projectId: number, signal: AbortSignal)
  Promise<CodeArtifactSummary[]>`
- Signature91: `+updateCodeArtifact(id: number, input: Partial<CodeArtifactInput>, signal:
  AbortSignal) Promise<CodeArtifact>`
- Signature92: `+updateMemory(id: number, input: Partial<MemoryInput>, signal: AbortSignal)
  Promise<Memory>`
- Signature93: `boundedWait(promise: Promise<T>, signals: readonly (AbortSignal | undefined)[],
  timeoutMs: number) Promise<BoundedWaitOutcome<T>>`
- Signature94: `automaticRecallTerminalText(result: RecallResult, kind: "automatic" | "queued",
  resultInHistory: unknown) string`
- Signature95: `recordRecallActivity(runtime: Runtime, result: RecallResult, ctx: ExtensionContext,
  elapsedMs: number) void`
- Signature96: `conflictBelongsToActiveBranch(conflict: Record<string, unknown>, runtime: Runtime,
  ctx: ExtensionContext) boolean`
- Signature97: `discoverWorkContext(pi: ExtensionAPI, ctx: ExtensionContext, branchId: string)
  Promise<ExtensionWorkContext>`
- Signature98: `log(ctx: ExtensionContext, config: ForgetfulConfig, message: string, level:
  Verbosity, fileMessage: unknown) void`
- Signature99: `logFailure(ctx: ExtensionContext, config: ForgetfulConfig, message: string, error:
  unknown, level: "warning" | "error") void`
- Signature100: `readCaptureOutcome(capture: CaptureServicePort, runtime: Runtime, jobId: string,
  checkpointResult: CaptureCheckpointResult) Promise<AutomaticCaptureJobOutcome | undefined>`
- Signature101: `updateDocument(documentId: number, input: Partial<DocumentInput>, signal:
  AbortSignal) unknown`
- Signature102: `updateCodeArtifact(artifactId: number, input: Partial<CodeArtifactInput>, signal:
  AbortSignal) unknown`
- Signature103: `supersede(id: number, replacementId: number, reason: string, signal: AbortSignal)
  Promise<void>`
- Signature104: `obsolete(id: number, reason: string, replacementId: number, signal: AbortSignal)
  Promise<void>`
- Signature105: `#request(pathOrUrl: string | URL, method: string, body: unknown, callerSignal:
  AbortSignal | undefined, expectedStatuses: number[]) Promise<unknown>`
- Signature106: `-throwResponseError(response: Response, method: string, url: URL, signal:
  AbortSignal, maxBytes: number) Promise<never>`
- Signature107: `parseSearchPayload(payload: unknown, fallbackQuery: string, requireMetadata:
  unknown) MemorySearchResult`
- Signature108: `-findRelationships(entities: Entity[], request: ExpansionContext)
  Promise<RelationshipExpansion[]>`
- Signature109: `-collectRelationships(entities: Entity[], request: ExpansionContext)
  Promise<EntityRelationship[]>`
- Signature110: `-resolveRelationshipEndpoints(entities: Entity[], relationships:
  EntityRelationship[], request: ExpansionContext) Promise<Map<number, Entity>>`
- Signature111: `-formatRelationships(entities: Entity[], relationships: EntityRelationship[],
  endpoints: Map<number, Entity>, request: KnowledgeExpansionRequest) RelationshipExpansion[]`
- Signature112: `-findEntityMemories(entities: Entity[], request: ExpansionContext)
  Promise<LinkedMemoryExpansion[]>`
- Signature113: `-collectEntityMemories(entities: Entity[], linked: ({ id: number; title: string }[]
  | undefined)[], request: ExpansionContext) Promise<LinkedMemoryExpansion[]>`
- Signature114: `-formatExpansion(entities: Entity[], relationships: RelationshipExpansion[],
  linkedMemories: LinkedMemoryExpansion[], attachments: Attachments) KnowledgeExpansionResult`
- Signature115: `resolveWriteProject(client: ForgetfulClient, context: KnowledgeToolContext,
  requested: number | undefined, signal: AbortSignal) Promise<ResolvedWriteProject>`
- Signature116: `assertReadMemory(client: ForgetfulClient, id: number, context:
  KnowledgeToolContext, signal: AbortSignal) Promise<Memory>`
- Signature117: `assertReadEntity(knowledge: KnowledgeClient, id: number, context:
  KnowledgeToolContext, signal: AbortSignal) Promise<Entity>`
- Signature118: `executeKnowledgeRead(client: ForgetfulClient, rawRequest: KnowledgeReadRequest,
  context: KnowledgeToolContext, signal: AbortSignal) Promise<KnowledgeToolResult>`
- Signature119: `updateProvenance(existing: Provenance, request: Record<string, unknown>, context:
  KnowledgeToolContext, destinationProjectId: number) Provenance`
- Signature120: `memoryInProject(client: ForgetfulClient, memoryId: number, projectId: number,
  signal: AbortSignal, editable: unknown) Promise<Memory>`
- Signature121: `entityInProject(knowledge: KnowledgeClient, entityId: number, projectId: number,
  signal: AbortSignal, editable: unknown) Promise<Entity>`
- Signature122: `hydrateEntities(knowledge: KnowledgeClient, candidates: Entity[], signal:
  AbortSignal) Promise<Entity[]>`
- Signature123: `validateAttachments(knowledge: KnowledgeClient, projectId: number, request:
  Record<string, unknown>, signal: AbortSignal) Promise<void>`
- Signature124: `createMemory(client: ForgetfulClient, request: Record<string, unknown>, context:
  KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite: (() =>
  Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature125: `createEntity(knowledge: KnowledgeClient, request: Record<string, unknown>, context:
  KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite: (() =>
  Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature126: `createDocument(knowledge: KnowledgeClient, request: Record<string, unknown>,
  context: KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite:
  (() => Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature127: `createCodeArtifact(knowledge: KnowledgeClient, request: Record<string, unknown>,
  context: KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite:
  (() => Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature128: `executeKnowledgeWrite(client: ForgetfulClient, rawRequest: KnowledgeWriteRequest,
  context: KnowledgeToolContext, signal: AbortSignal, beforeWrite: () => Promise<void>,
  checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature129: `constructor(client: WriteClient, readMemory: KnowledgeMemoryReader, assertCanWrite:
  () => void) unknown`
- Signature130: `-recordCreateFailure(attempt: string, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, error: unknown) Promise<void>`
- Signature131: `-createOnce(operation: { kind: string; key: string; occurrence: number; input:
  unknown; create: () => Promise<T>; }, plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, beforeWrite: KnowledgeWriteGuard | undefined) Promise<T>`
- Signature132: `-writeEntity(resource: ResourceSlot<KnowledgeEntityPlan>, plan: KnowledgeWritePlan,
  state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined,
  beforeWrite: KnowledgeWriteGuard | undefined) Promise<Entity>`
- Signature133: `-writeEntities(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature134: `-writeDocument(resource: ResourceSlot<KnowledgeDocumentPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<Document>`
- Signature135: `-writeDocuments(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature136: `-writeCodeArtifact(resource: ResourceSlot<KnowledgeCodeArtifactPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<CodeArtifact>`
- Signature137: `-writeCodeArtifacts(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature138: `-requestedAttachmentIds(plan: KnowledgeWritePlan, state: KnowledgeWriteState)
  KnowledgeAttachmentIds`
- Signature139: `-writeConnection(operation: { kind: string; key: string; input: unknown; execute:
  () => Promise<unknown> }, plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, beforeWrite: KnowledgeWriteGuard | undefined) Promise<void>`
- Signature140: `-writeAttachments(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature141: `-writeRelationship(resource: ResourceSlot<KnowledgeRelationshipPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<EntityRelationship>`
- Signature142: `-writeRelationships(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature143: `-writeEntityMemoryLink(resource: KnowledgeEntityMemoryLinkPlan, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<void>`
- Signature144: `-writeEntityMemoryLinks(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature145: `-writeLinkedMemory(linkedMemoryId: number, plan: KnowledgeWritePlan, state:
  KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite:
  KnowledgeWriteGuard | undefined) Promise<void>`
- Signature146: `-writeLinkedMemories(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature147: `execute(plan: KnowledgeWritePlan, previous: Partial<KnowledgeWriteState>,
  checkpoint: KnowledgeWriteCheckpoint, signal: AbortSignal, beforeWrite: KnowledgeWriteGuard)
  Promise<KnowledgeWriteState>`
- Signature148: `stateWithNumber(values: KnowledgeWriteReceipt[], key: string, id: number,
  occurrence: number) void`
- Signature149: `constructor(model: Model<any>, task: Message, settings: CompactionSettings,
  contextLimitTokens: unknown, initialHistory: CompactedMemoryHistory & { summaryMessage: Message })
  unknown`
- Signature150: `prepare(context: Context, signal: AbortSignal, sessionId: string | undefined,
  complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) => Promise<void>)
  Promise<number>`
- Signature151: `prepareCapture(context: Context, signal: AbortSignal, sessionId: string |
  undefined, complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) =>
  Promise<void>) Promise<"ready" | "progress">`
- Signature152: `-prepareContext(context: Context, signal: AbortSignal, sessionId: string |
  undefined, complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) =>
  Promise<void>, maxChunks: unknown) Promise<number | "progress">`
- Signature153: `-applySummary(context: Context, summary: string, lastRecord: Message, previousSize:
  number) number`
- Signature154: `assertFits(context: Context, model: Model<any>, output: number, contextWindow:
  number) void`
- Signature155: `outputCeiling(model: Model<any>, settings: typeof DEFAULT_COMPACTION_SETTINGS,
  requestedMaxTokens: unknown) number`
- Signature156: `resolvedOutputAllowance(context: Context, model: Model<any>, contextWindow: number,
  settings: typeof DEFAULT_COMPACTION_SETTINGS, requestedMaxTokens: unknown) number`
- Signature157: `summarizeMemoryHistory(messages: Message[], options: MemoryHistorySummaryOptions,
  previousSummary: string) Promise<{ summary: string; count: number }>`
- Signature158: `+complete(model: Model<any>, context: Context, options: ModelsSimpleStreamOptions)
  Promise<AssistantMessage>`
- Signature159: `constructor(registry: ModelRegistryPort, selection: ModelSelection, options:
  PiMemoryModelOptions) unknown`
- Signature160: `-completeAttempt(model: Model<any>, context: Context, options:
  ModelsSimpleStreamOptions, request: ModelRequest, deadline: RequestDeadline, attempt: number,
  kind: "task" | "compaction") Promise<AssistantMessage>`
- Signature161: `-executeRead(read: ModelReadTool, call: ToolCall, request: ModelRequest, deadline:
  RequestDeadline) Promise<ToolResultMessage>`
- Signature162: `-completeWithSubmission(model: Model<any>, context: Context, options:
  ModelsSimpleStreamOptions, request: ModelRequest, deadline: RequestDeadline, prepare: () =>
  Promise<number>) Promise<unknown>`
- Signature163: `ensureCompletionFinished(response: AssistantMessage, request: ModelRequest,
  timedOut: boolean, allowToolUse: boolean) void`
- Signature164: `requestOptions(model: Model<any>, sessionId: string | undefined, transformHeaders:
  MemoryModelHeaderTransform | undefined, signal: AbortSignal) ModelsSimpleStreamOptions`
- Signature165: `appendCallCountCorrection(context: Context, response: AssistantMessage, calls:
  ToolCall[], submissionName: string, base: string, readNames: string[]) void`
- Signature166: `throwRequestFailure(error: unknown, request: ModelRequest, timedOut: boolean,
  timeoutMs: number) never`
- Signature167: `resolveMemoryModel(registry: ModelRegistryPort, selection: ModelSelection |
  undefined, options: PiMemoryModelOptions) PiMemoryModel | undefined`
- Signature168: `promptExistingProject(client: ForgetfulClient, ctx: ExtensionContext, repoName:
  string) Promise<Project | undefined>`
- Signature169: `initialiseProject(client: ForgetfulClient, ctx: ExtensionContext, repoName: string,
  ensureCurrent: () => Promise<void>) Promise<Project | undefined>`
- Signature170: `initialiseProjectForAgent(client: ForgetfulClient, ctx: ExtensionContext, repoName:
  string, input: AgentProjectInitInput, ensureCurrent: () => Promise<void>) Promise<Project>`
- Signature171: `resolveBranchId(sessionId: string, activeEntryIds: readonly string[],
  fallbackBranchId: string) Promise<string>`
- Signature172: `cancel(jobId: string, interruptedModelCall: unknown, uncertainWrite: string)
  Promise<void>`
- Signature173: `-compactJobSnapshot(job: StoredQueueJob, conversation: CompactedConversation)
  Promise<void>`
- Signature174: `pendingConflicts(identity: QueueIdentity, sessionId: string, branchId: string)
  Promise<PendingConflict[]>`
- Signature175: `listPendingConflicts(identity: QueueIdentity, sessionId: string, branchId: string)
  Promise<PendingConflict[]>`
- Signature176: `updateConflict(conflictId: string, patch: Partial<PendingConflict>)
  Promise<PendingConflict>`
- Signature177: `constructor(client: ForgetfulClient, model: MemoryModelClient, options:
  RecallServiceOptions) unknown`
- Signature178: `-recallReadTool(request: RecallRequest, resolution: ScopeResolution, candidates:
  RecallResult) ModelReadTool`
- Signature179: `-finishFailure(request: RecallRequest, deadline: DeadlineSignal, error: unknown,
  trace: { stage: string; debugTrace: string; plannerRejections: string[]; reviewRejections:
  string[]; failedReviewDebug: string | undefined; }) RecallResult`
- Signature180: `-finishReview(output: unknown, candidates: RecallResult, recallPolicy: string,
  debugTrace: string, searchFailed: boolean, reviewRejections: string[]) RecallResult`
- Signature181: `-optionalKnowledge(memories: Memory[], entityNames: string[], scope: Scope,
  projectId: number | undefined, signal: AbortSignal) Promise<KnowledgeExpansionResult | undefined>`
- Signature182: `-resultWithKnowledge(result: RecallResult, expansion: KnowledgeExpansionResult |
  undefined, knowledgeText: string) RecallResult`
- Signature183: `-authorizeProjectSelection(request: RecallRequest, deadline: DeadlineSignal, plan:
  RecallPlan) Promise<string | undefined>`
- Signature184: `-requestsDifferentProject(request: RecallRequest, plan: RecallPlan, scope: Scope)
  boolean`
- Signature185: `-searchMemories(request: RecallRequest, plan: RecallPlan, scope: Scope, resolution:
  ScopeResolution, deadline: DeadlineSignal) Promise<SearchOutcome>`
- Signature186: `-searchRequest(query: string, plan: RecallPlan, context: WorkContext, scope: Scope,
  resolution: ScopeResolution) SearchRequest`
- Signature187: `-resolveScope(context: WorkContext, scope: Scope, selectedId: number | undefined,
  supplied: Project[] | undefined, signal: AbortSignal) Promise<ScopeResolution>`
- Signature188: `formatRecall(memories: Memory[], entities: string[], recallPolicy: string,
  expansion: KnowledgeExpansionResult) { text: string; ids: number[]; knowledgeText: string }`
- Signature189: `reviewValidationDebug(value: unknown, candidates: RecallResult, mismatchDirection:
  string | undefined) string`
- Signature190: `recallReviewSubmission(candidates: RecallResult, rejections: string[], setDebug:
  (debug: string) => void) ModelSubmissionTool`
- Signature191: `deltaStartIndex(branch: SessionEntry[], afterEntryId: string | null | undefined,
  baselineEntryId: string | null | undefined) number | undefined`
- Signature192: `compactCaptureSnapshot(snapshot: CaptureSnapshot, view: CompactedConversation)
  CaptureSnapshot`

## Extraction warnings

- `Unresolved or out-of-scope base: ActivityLoader -> Loader`
- `Unresolved or out-of-scope base: CaptureProgress -> Error`
- `Unresolved or out-of-scope base: CaptureSelectionError -> Error`
- `Unresolved or out-of-scope base: ContextWindowError -> Error`
- `Unresolved or out-of-scope base: ForgetfulAbortError -> Error`
- `Unresolved or out-of-scope base: ForgetfulHttpError -> Error`
- `Unresolved or out-of-scope base: ForgetfulSchemaError -> Error`
- `Unresolved or out-of-scope base: ForgetfulTimeoutError -> Error`
- `Unresolved or out-of-scope base: InvalidCaptureOutput -> Error`
- `Unresolved or out-of-scope base: MergeWriteUncertain -> Error`
- `Unresolved or out-of-scope base: ModelSubmissionError -> Error`
- `Unresolved or out-of-scope base: ModelTaskPause -> Error`
- `Unresolved or out-of-scope base: PlanBrowser -> Component`
- `Unresolved or out-of-scope base: PlanningReadFailure -> Error`
- `Unresolved or out-of-scope base: ProjectInitError -> Error`
- `Unresolved or out-of-scope base: QueueBusyError -> Error`
- `Unresolved or out-of-scope base: QueueJobMetadata -> Omit<QueueJob, "snapshot">`
- `Unresolved or out-of-scope base: ReviewValidationError -> Error`
