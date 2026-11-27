# Mermaid class diagrams

Declared types and signatures; unknown types are `unknown`. Receivers are omitted.
Fields are associations, not lifetime ownership. Calls are static heuristic estimates.
Members and connections within each view are uncapped.
Parallel arrows are summarized.
Cross-diagram relationships are retained in the complete relationship list.

Included: 283 boxes. Calls without in-scope endpoints: 0.

## Test filtering

Mode: exclude.
Saved detector version: 2.
Test paths: `scripts/forgetful-test-server.py`, `test`.
Keep paths: none.
Calls removed by test filtering: 806. Type relationships removed: 194.

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
- `test/model-context.test.ts`: 22 source occurrences (test-path).
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
    class c0030["src/capture-limits.ts"] {
        <<module>>
        fieldLimitGuidance(limits: Type36) string
    }
    class c0031["CaptureLinkReview"] {
        <<interface>>
        status: Type37
        memory: Memory
        memories: Memory[]
        automaticIds: number[]
        unreviewed: Type38
        decisions: LinkDecision[]
        verifiedIds: number[]
        reason: string
        previous: PreviousConnections
        resources: Type39
        preservation: PreservationDecision
        preservationVerified: boolean
        executionResults: ConnectionResult[]
        previousResults: ConnectionResult[]
        failures: Type40
    }
    class c0032["ConnectionResult"] {
        <<interface>>
        operation: Type41
        targetId: number
        status: Type42
        error: string
        httpStatus: number
    }
    class c0033["LinkDecision"] {
        <<interface>>
        memoryId: number
        action: Type43
        reason: string
    }
    class c0034["PreservationDecision"] {
        <<interface>>
        status: Type44
        documentIds: number[]
        codeArtifactIds: number[]
        entityIds: number[]
        reason: string
    }
    class c0035["PreviousConnections"] {
        <<interface>>
        memory: Memory
        documents: Document[]
        codeArtifacts: CodeArtifact[]
        entities: Entity[]
        entityIds: number[]
        complete: boolean
    }
    class c0036["src/capture-links.ts"] {
        <<module>>
        wantsEdge(decision: LinkDecision) boolean
        exclusiveMemory(memory: Memory, destination: number) boolean
        readSelectedMemory(client: ForgetfulClient, id: number, unreviewed: Type46) Type45
        prepareLinkReview(Signature9)
        validateLinkDecisions(Signature10)
        validateLinkReviews(value: unknown, inputs: Type50) Type49
        operationError(error: unknown) string
        authorizedMemory(Signature11)
        executeConnection(Signature12)
        applyLinkReview(Signature13)
        finishLinkExecution(initial: CaptureLinkReview, save: Type53) Promise~CaptureLinkReview~
        readAttachmentRecords(Signature14)
        preparePreviousConnections(Signature15)
        preserveConnections(Signature16)
    }
    class c0037["MergeAccess"] {
        <<interface>>
        destination: number
        scope: Scope
        beforeRead: Type54
    }
    class c0038["MergeConnections"] {
        <<interface>>
        memoryIds: number[]
        entityIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
        receipts: Type56
    }
    class c0039["MergeExecution"] {
        <<interface>>
        save: Type54
        assertCanWrite: Type12
    }
    class c0040["MergeWriteUncertain"] {
        <<class>>
    }
    class c0041["src/capture-merge.ts"] {
        <<module>>
        union(...lists: Type57) number[]
        collectMergeConnections(Signature17)
        requireResourceScope(Signature18)
        checkMergeEntity(client: ForgetfulClient, id: number, access: MergeAccess) Promise~void~
        checkMergeAttachments(Signature19)
        preflightMergeConnections(Signature20)
        preserveMergeConnections(Signature21)
    }
    class c0042["CandidateExtraction"] {
        <<interface>>
        candidates: CaptureCandidate[]
        skipped: Type60
    }
    class c0043["CandidateValidation"] {
        <<type_alias>>
        alias: Type61
        valid: true
        value: T
        reason: string
        valid: false
    }
    class c0044["CaptureAction"] {
        <<type_alias>>
        alias: Type62
    }
    class c0045["CaptureActivityPhase"] {
        <<type_alias>>
        alias: Type63
    }
    class c0046["CaptureAdvanceInput"] {
        <<interface>>
        sessionId: string
        branchId: string
        entryIds: string[]
        finalEntryId: string
        snapshotId: string
    }
    class c0047["CaptureBatchInput"] {
        <<interface>>
        candidate: CaptureCandidate
        destinationProjectId: number
        overlaps: Memory[]
        neighborhood: CaptureNeighborhood
    }
    class c0048["CaptureBranch"] {
        <<interface>>
        sessionId: string
        branchId: string
    }
    class c0049["CaptureCandidate"] {
        <<interface>>
        kind: Type64
        searchDescription: string
        id: string
        title: string
        content: string
        context: string
        keywords: string[]
        tags: string[]
        importance: number
        sourceEntryIds: string[]
        evidenceType: Type65
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
    class c0050["CaptureCheckpointOptions"] {
        <<interface>>
        sessionId: string
        branchId: string
        excludeBranches: CaptureBranch[]
    }
    class c0051["CaptureCheckpointResult"] {
        <<interface>>
        processed: number
        processedJobIds: string[]
        discardedJobs: Type66
        paused: boolean
        errors: string[]
        deferredBranches: CaptureBranch[]
        continuation: Type67
    }
    class c0052["CaptureCodeArtifactResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0053["CaptureDecision"] {
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
    class c0054["CaptureDiagnosticCandidate"] {
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
        linkReview: Type68
    }
    class c0055["CaptureDiagnosticConflict"] {
        <<interface>>
        id: string
        status: Type69
        candidateId: string
        destinationProjectId: number
        sourceEntryIds: string[]
        oldMemoryIds: number[]
        reason: string
        replacementId: number
    }
    class c0056["CaptureDiagnosticJob"] {
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
    class c0057["CaptureDiagnostics"] {
        <<interface>>
        jobs: CaptureDiagnosticJob[]
        conflicts: CaptureDiagnosticConflict[]
    }
    class c0058["CaptureDocumentResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0059["CaptureEnqueueResult"] {
        <<interface>>
        queued: boolean
        jobId: string
        reason: string
    }
    class c0060["CaptureEntityResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0061["CaptureMergePlan"] {
        <<interface>>
        candidate: CaptureCandidate
        memories: Memory[]
        connections: MergeConnections
    }
    class c0062["CaptureNeighborhood"] {
        <<interface>>
        entities: Entity[]
        documents: Document[]
        codeArtifacts: CodeArtifact[]
        relationships: EntityRelationship[]
        truncated: boolean
    }
    class c0063["CaptureOperation"] {
        <<interface>>
        jobId: string
        conflictId: string
        uncertainWrite: CaptureUncertainWrite
        supersession: SupersessionReceipt
        modelFailure: Type70
    }
    class c0064["CapturePause"] {
        <<class>>
        constructor(reason: string) unknown
    }
    class c0065["CapturePendingConflict"] {
        <<interface>>
        verifiedOrigin: Type71
    }
    class c0066["CaptureProgress"] {
        <<class>>
    }
    class c0067["CaptureRelationshipResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0068["CaptureResolveResult"] {
        <<interface>>
        status: Type72
        conflict: PendingConflict
    }
    class c0069["CaptureResourceReuse"] {
        <<interface>>
        entities: Type73
        documents: Type73
        codeArtifacts: Type73
        relationships: Type73
    }
    class c0070["CaptureService"] {
        <<class>>
        -queue: DurableQueueStore
        -client: ForgetfulClient
        -readSavedMemory: Type74
        -model: MemoryModelClient
        -identity: QueueIdentity
        -sessionId: string
        -branchId: string
        -policy: string
        -isEnabled: Type75
        -getMode: Type76
        -canWriteNow: Type22
        -canReadNow: Type22
        -maxModelCalls: number
        -maxJobsPerCheckpoint: number
        -now: Type77
        -knowledgeWriter: KnowledgeWriter
        -logger: DiagnosticLogger
        -passLimits: Type78
        -stopped: unknown
        -cancellation: unknown
        -interruptedModelJobs: unknown
        -operations: unknown
        -onActivity: Type79
        -activities: unknown
        -activityPhase: CaptureActivityPhase
        constructor(options: CaptureServiceOptions) unknown
        -readSignal(signal: AbortSignal) AbortSignal
        -activity(phase: CaptureActivityPhase, operation: Type3) Promise~T~
        -publishActivity() void
        -read(operation: Type80, signal: AbortSignal, phase: Type81) Promise~T~
        -mutate(operation: Type80, signal: AbortSignal) Promise~T~
        -cancellableClient(client: ForgetfulClient) ForgetfulClient
        -cancellableKnowledge(client: KnowledgeClient) KnowledgeClient
        -correlation(job: QueueJob, candidateId: string) unknown
        -emit(level: Type82, event: string, data: Type9) void
        -enabled(mode: CaptureMode) Promise~boolean~
        -ensureModelCallAllowed(job: QueueJob) Promise~void~
        -assertWriteAllowedNow() void
        -ensureWriteAllowed(jobMode: CaptureMode) Promise~void~
        -policyFor(Signature22)
        -fieldLimits() Type78
        enqueue(snapshot: CaptureSnapshot) Promise~CaptureEnqueueResult~
        -enqueueSnapshot(snapshot: CaptureSnapshot) Promise~CaptureEnqueueResult~
        -resolveDestination(candidate: CaptureCandidate, context: WorkContext) Type24
        -addConflict(Signature23)
        -checkpointOutcome(Signature24)
        -destinationProjects(Signature25)
        -validateDecision(Signature26)
        -createMemory(Signature27)
        -writeKnowledge(Signature28)
        -supersessionAlreadyApplied(Signature29)
        -applySupersession(Signature30)
        -recordSupersession(receipt: SupersessionReceipt) Promise~void~
        -finishSupersession(Signature31)
        -processReplacementCheckpoint(Signature32)
        -processKnowledgeCheckpoint(Signature33)
        -prepareDestination(job: QueueJob, candidate: CaptureCandidate) Type86
        -loadOverlaps(Signature34)
        -neighborhoodEntity(job: QueueJob, id: number, destination: number) Type89
        -neighborhoodMatches(job: QueueJob, input: unknown) Promise~Entity[]~
        -neighborhoodEntities(Signature35)
        -neighborhoodRelationships(job: QueueJob, entities: Entity[]) Type91
        -existingNeighborhood(Signature36)
        -prepareOverlapBatch(job: QueueJob, candidates: CaptureCandidate[]) Type92
        -decideOverlapBatch(job: QueueJob, candidates: CaptureCandidate[]) Promise~QueueJob~
        -decideOverlap(Signature37)
        -recordEscalation(Signature38)
        -supersedeCandidate(Signature39)
        -readMaintenanceTargets(Signature40)
        -confirmedRetirement(id: number) boolean
        -preflightRetirement(Signature41)
        -composeMerge(Signature42)
        -verifyRequestedMerge(Signature43)
        -finishMerge(Signature44)
        -mergeCandidate(Signature45)
        -retireCandidate(Signature46)
        -equivalentMemory(Signature47)
        -skipCandidate(Signature48)
        -applyDecision(Signature49)
        -processCandidate(Signature50)
        -evidenceReadTool(job: QueueJob) ModelReadTool
        -sourceInspectionTool(job: QueueJob) ModelReadTool
        -loadCandidates(job: QueueJob) Type95
        -reviewExecutionFailure(job: QueueJob, candidate: CaptureCandidate) Promise~QueueJob~
        -correctedCaptureOutcome(outcome: Type9, corrected: Type96, rejectedMerge: Type97) Type9
        -isModelFailure(error: unknown) boolean
        -saveCorrectableFailure(Signature51)
        -recordCandidateFailure(Signature52)
        -candidateUncertainty(outcome: Type88, error: unknown) Type99
        -connectionUncertainty(outcome: Type88) Type99
        -pauseCandidate(Signature53)
        -correctCandidateFailures(Signature54)
        -processCandidates(Signature55)
        -processOrderedCandidates(Signature56)
        -refreshLinkReview(Signature57)
        -migrateLegacyLinkReview(Signature58)
        -prepareLinkReviews(job: QueueJob, candidates: CaptureCandidate[]) Type102
        -planLinkReviews(Signature59)
        -executeLinkReview(job: QueueJob, candidate: CaptureCandidate) Promise~QueueJob~
        -recordLinkReviewFailure(current: QueueJob, failure: Type103) Promise~void~
        -previousSupersessionCompleted(Signature60)
        -finishReviewedSupersession(Signature61)
        -executeLinkReviews(job: QueueJob, candidates: CaptureCandidate[]) Type104
        -reviewLinks(job: QueueJob, candidates: CaptureCandidate[]) Promise~QueueJob~
        -processJob(job: QueueJob, result: CaptureCheckpointResult) Type105
        -runBranchWorker(Signature62)
        -processBranchJob(job: QueueJob, result: CaptureCheckpointResult) Type106
        -recordBranchFailure(Signature63)
        -checkpointBranch(Signature64)
        -checkpointBranches(options: Type107) Promise~CaptureBranch[]~
        -appendCheckpointResult(Signature65)
        checkpoint(options: Type107) Promise~CaptureCheckpointResult~
        processPending(options: CaptureCheckpointOptions) Promise~CaptureCheckpointResult~
        diagnostics(options: Type108) Promise~CaptureDiagnostics~
        pendingConflicts(options: Type109) Promise~CapturePendingConflict[]~
        pendingConflicts(sessionId: string, branchId: string) Promise~CapturePendingConflict[]~
        pendingConflicts(Signature66)
        -verifyConflictOrigin(conflict: PendingConflict) Promise~CapturePendingConflict~
        -ownedConflict(conflictId: string) Promise~PendingConflict~
        -rejectConflict(Signature67)
        -selectResolutionEvidence(Signature68)
        -validateResolutionEvidence(Signature69)
        -resolutionTarget(conflict: PendingConflict) ConflictResolutionTarget
        -markConflictResolved(Signature70)
        -revisionResources(current: Memory, destination: number, previous: Memory) unknown
        -planConflictReplacement(Signature71)
        -updateResolutionReplacement(Signature72)
        -createResolutionReplacement(conflict: PendingConflict) Promise~number~
        -linkResolutionEntity(Signature73)
        -executeResolutionLinks(conflict: PendingConflict, replacementId: number) Promise~void~
        -applyConflictResolution(Signature74)
        -failConflictResolution(conflictId: string, error: unknown) Promise~never~
        -resolveConflictOwned(Signature75)
        resolveConflict(Signature76)
        resolve(conflictId: string, input: ResolveConflictInput) Promise~CaptureResolveResult~
        advance(input: Type112) Promise~void~
        advanceWatermark(input: Type112) Promise~void~
        watermark(context: Type113) unknown
        stop(_sessionId: string, _branchId: string) void
    }
    class c0071["CaptureServiceOptions"] {
        <<interface>>
        logger: DiagnosticLogger
        onActivity: Type114
        queue: DurableQueueStore
        client: ForgetfulClient
        model: MemoryModelClient
        instanceId: string
        endpoint: string
        accountId: string
        sessionId: string
        branchId: string
        policy: string
        isEnabled: Type75
        getMode: Type76
        canWriteNow: Type22
        canReadNow: Type22
        maxCandidates: number
        maxModelCalls: number
        maxJobsPerCheckpoint: number
        now: Type77
    }
    class c0072["CaptureUncertainWrite"] {
        <<class>>
    }
    class c0073["ConflictResolutionEvidence"] {
        <<interface>>
        evidenceEntryIds: string[]
        selectedAdditionalEntries: EvidenceEntry[]
        reason: string
        additionalEvidence: string
    }
    class c0074["ConflictResolutionTarget"] {
        <<interface>>
        oldMemory: Memory
        candidate: CaptureCandidate
        fakeJob: QueueJob
    }
    class c0075["InvalidCaptureOutput"] {
        <<class>>
        constructor(reason: string) unknown
    }
    class c0076["MissingCaptureDestination"] {
        <<class>>
        constructor(candidate: CaptureCandidate, projects: Type115) unknown
        projects: Type115
    }
    class c0077["ResolveConflictInput"] {
        <<interface>>
        action: Type116
        reason: string
        evidenceEntryIds: string[]
        additionalEvidence: string
        additionalEntries: EvidenceEntry[]
        conversation: readonly unknown[]
    }
    class c0078["src/capture.ts"] {
        <<module>>
        reusableMergeComposition(plan: Type97, decision: Type117) boolean
        conflictResolutionEvidence(evidence: ConflictResolutionEvidence) unknown
        blockedSave(diagnostic: string) Error
        clone(value: T) T
        record(value: unknown) Type88
        stringValue(value: unknown, max: number) Type118
        strings(value: unknown, max: unknown, itemMax: number) string[]
        projectId(value: unknown) Type16
        snapshotForPersistence(snapshot: CaptureSnapshot) CaptureSnapshot
        captureWorkMetadata(snapshot: CaptureSnapshot) unknown
        sourceEvidence(candidate: CaptureCandidate, snapshot: CaptureSnapshot) EvidenceEntry[]
        sharedSourceEvidence(Signature77)
        invalidCandidate(reason: string) CandidateValidation~T~
        validCandidate(value: T) CandidateValidation~T~
        captureResource(raw: unknown, kind: string, index: number) Type9
        captureEvidenceError(ids: string[], snapshot: CaptureSnapshot) Type118
        eligibleCandidate(Signature78)
        parseCandidates(Signature79)
        boundedSubmissionRejections(value: readonly string[]) string[]
        appendSubmissionRejection(rejections: string[], reason: string) void
        captureCandidateSubmission(Signature80)
        decisionMemoryId(response: Type9) Type16
        decisionTargetMemoryId(response: Type9) Type16
        decisionMemoryIds(response: Type9) Type121
        decisionEvidenceIds(response: Type9) Type122
        decisionText(response: Type9, field: Type123) Type118
        decisionPartial(response: Type9) boolean
        applyEnrichmentDecision(response: Type9, decision: CaptureDecision) void
        applyEquivalentCandidate(response: Type9, decision: CaptureDecision) void
        parseDecision(value: unknown) CaptureDecision
        decisionConflictIds(decision: CaptureDecision) number[]
        firstConflictId(decision: CaptureDecision) Type16
        currentProjectId(context: WorkContext) Type16
        captureProvenance(candidate: CaptureCandidate, context: WorkContext) unknown
        memoryInput(Signature81)
        resourceInput(input: T, defaults: Type9) T
        captureKnowledgePlan(Signature82)
        overlapCandidate(candidate: CaptureCandidate) Type9
        errorMessage(error: unknown) string
        scrubError(error: unknown) string
        isFinalOutcome(outcome: unknown) boolean
        trustedAdditionalEntries(value: unknown) EvidenceEntry[]
    }
    class c0079["src/concurrency.ts"] {
        <<module>>
        mapConcurrent(items: readonly T[], concurrency: number, operation: Type125) Promise~R[]~
    }
    class c0080["ForgetfulConfig"] {
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
        paths: Type126
    }
    class c0081["ForgetfulInstanceConfig"] {
        <<interface>>
        baseUrl: string
        token: string
        tokenEnv: string
        timeoutMs: number
    }
    class c0082["JsonReadResult"] {
        <<interface>>
        value: unknown
        exists: boolean
        malformed: boolean
    }
    class c0083["LoadConfigOptions"] {
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
    class c0084["ModelSelection"] {
        <<interface>>
        provider: string
        id: string
    }
    class c0085["PersistedProjectSettings"] {
        <<interface>>
        scope: unknown
    }
    class c0086["PersistedUserSettings"] {
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
    class c0087["PromptName"] {
        <<type_alias>>
        alias: Type127
    }
    class c0088["PromptOverlays"] {
        <<interface>>
        classification: string
        recall: string
        capture: string
    }
    class c0089["ScopeSource"] {
        <<type_alias>>
        alias: Type128
    }
    class c0090["Verbosity"] {
        <<type_alias>>
        alias: Type129
    }
    class c0091["src/config.ts"] {
        <<module>>
        isRecallConcurrency(value: unknown) value is number
        resolveRecallConcurrency(value: unknown, warnings: string[]) number
        resolveContextLimit(value: unknown, warnings: string[]) number
        isFileLogLevel(value: unknown) value is FileLogLevel
        resolveLogDirectory(value: unknown, agentDir: string, warnings: string[]) string
        isVerbosity(value: unknown) value is Verbosity
        resolveVerbosity(user: PersistedUserSettings, warnings: string[]) Verbosity
        isRecord(value: unknown) Type130
        parseModel(value: unknown) Type131
        asBoolean(value: unknown, fallback: boolean) boolean
        asPositiveInteger(value: unknown, fallback: number) number
        asString(value: unknown) Type118
        readJson(path: string) Promise~JsonReadResult~
        readPromptDirectory(Signature83)
        mergePrompts(Signature84)
        resolveCaptureMode(value: unknown, warnings: string[]) CaptureMode
        resolveScope(Signature85)
        defaultAgentDir() string
        userSettingsPath(agentDir: unknown) string
        projectSettingsPath(cwd: string) string
        loadForgetfulConfig(options: LoadConfigOptions) Promise~ForgetfulConfig~
        writeJson(path: string, value: unknown) Promise~void~
        writeProjectScope(cwd: string, scope: Scope) Promise~void~
        updateUserSettings(path: string, update: Type133) Promise~void~
        updateForgetfulConnection(path: string, connection: Type134) Promise~void~
        modelToString(model: Type131) Type118
        readPlanningPanel(path: string) Promise~boolean~
    }
    class c0092["CaptureHistorySummary"] {
        <<interface>>
        throughEntryId: string
        text: string
    }
    class c0093["CaptureMode"] {
        <<type_alias>>
        alias: Type135
    }
    class c0094["CaptureSnapshot"] {
        <<interface>>
        id: string
        context: WorkContext
        instanceId: string
        entries: EvidenceEntry[]
        conversation: readonly unknown[]
        conversationCoverage: Type136
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
    class c0095["CodeArtifact"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0096["CodeArtifactInput"] {
        <<interface>>
        title: string
        description: string
        code: string
        language: string
        tags: string[]
        project_id: Type137
    }
    class c0097["CodeArtifactSummary"] {
        <<type_alias>>
        alias: Type138
    }
    class c0098["CompactedConversation"] {
        <<interface>>
        summary: string
        summarizedThroughEntryId: string
        retainedConversation: readonly unknown[]
    }
    class c0099["Document"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0100["DocumentInput"] {
        <<interface>>
        title: string
        description: string
        content: string
        document_type: string
        tags: string[]
        project_id: Type137
    }
    class c0101["DocumentSummary"] {
        <<type_alias>>
        alias: Type139
    }
    class c0102["Entity"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0103["EntityInput"] {
        <<interface>>
        name: string
        entity_type: EntityType
        custom_type: string
        notes: string
        tags: string[]
        aka: string[]
        project_ids: number[]
    }
    class c0104["EntityRelationship"] {
        <<interface>>
        id: number
    }
    class c0105["EntityRelationshipInput"] {
        <<interface>>
        source_entity_id: number
        target_entity_id: number
        relationship_type: string
    }
    class c0106["EntityType"] {
        <<type_alias>>
        alias: Type140
    }
    class c0107["EvidenceEntry"] {
        <<interface>>
        id: string
        role: Type141
        text: string
        toolName: string
        toolCallId: string
        isError: boolean
        details: unknown
    }
    class c0108["FileSummary"] {
        <<interface>>
        id: number
        filename: string
        description: string
        mime_type: string
        size_bytes: number
        tags: string[]
        project_id: Type137
    }
    class c0109["ForgetfulClient"] {
        <<interface>>
        knowledge: KnowledgeClient
        +fieldLimits(signal: AbortSignal) Type78
        +getMemoryEntityIds(id: number, signal: AbortSignal) Promise~number[]~
        +search(request: SearchRequest, signal: AbortSignal) Promise~Memory[]~
        +queryMemory(request: SearchRequest, signal: AbortSignal) Promise~MemorySearchResult~
        +listProjects(repoName: string, signal: AbortSignal) Promise~Project[]~
        +createProject(input: ProjectInput, signal: AbortSignal) Promise~Project~
        +linkProject(id: number, repoName: string, signal: AbortSignal) Promise~Project~
        +create(input: MemoryInput, signal: AbortSignal) Promise~MemoryCreateResult~
        +get(id: number, signal: AbortSignal) Promise~Memory~
        +obsolete(Signature86)
        +supersede(Signature87)
    }
    class c0110["ForgetfulFieldBound"] {
        <<interface>>
        max_length: number
        max_items: number
        max_decoded_bytes: number
    }
    class c0111["ForgetfulFieldLimits"] {
        <<type_alias>>
        alias: Type142
    }
    class c0112["KnowledgeClient"] {
        <<interface>>
        +searchEntities(query: string, limit: number, signal: AbortSignal) Promise~Entity[]~
        +getEntity(id: number, signal: AbortSignal) Promise~Entity~
        +createEntity(input: EntityInput, signal: AbortSignal) Promise~Entity~
        +updateEntity(Signature88)
        +getEntityMemories(id: number, signal: AbortSignal) Type143
        +linkEntityMemory(entityId: number, memoryId: number, signal: AbortSignal) Promise~void~
        +getRelationships(id: number, signal: AbortSignal) Promise~EntityRelationship[]~
        +createRelationship(Signature89)
        +listDocuments(projectId: number, signal: AbortSignal) Promise~DocumentSummary[]~
        +getDocument(id: number, signal: AbortSignal) Promise~Document~
        +createDocument(input: DocumentInput, signal: AbortSignal) Promise~Document~
        +updateDocument(Signature90)
        +listCodeArtifacts(Signature91)
        +getCodeArtifact(id: number, signal: AbortSignal) Promise~CodeArtifact~
        +createCodeArtifact(input: CodeArtifactInput, signal: AbortSignal) Promise~CodeArtifact~
        +updateCodeArtifact(Signature92)
        +listFiles(projectId: number, signal: AbortSignal) Promise~FileSummary[]~
        +getFile(id: number, signal: AbortSignal) Promise~StoredFile~
        +updateMemory(Signature93)
        +linkMemories(id: number, relatedIds: number[], signal: AbortSignal) Promise~void~
        +unlinkMemories(id: number, targetId: number, signal: AbortSignal) Promise~void~
    }
    class c0113["LinkedMemory"] {
        <<interface>>
        memory: Memory
        link_source_id: number
    }
    class c0114["Memory"] {
        <<interface>>
        id: number
        is_obsolete: boolean
        superseded_by: Type137
        obsolete_reason: Type10
        obsoleted_at: Type10
        linked_memory_ids: number[]
        access_count: number
        last_accessed_at: Type10
        updated_at: string
    }
    class c0115["MemoryCreateResult"] {
        <<interface>>
        id: number
        autoLinkedMemoryIds: number[]
    }
    class c0116["MemoryInput"] {
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
    class c0117["MemoryModelClient"] {
        <<interface>>
        +prepareCapture(request: ModelRequest) Type144
        +complete(request: ModelRequest) Promise~unknown~
    }
    class c0118["MemorySearchResult"] {
        <<interface>>
        query: string
        primary_memories: Memory[]
        linked_memories: LinkedMemory[]
        total_count: number
        token_count: number
        truncated: boolean
    }
    class c0119["ModelEvidencePage"] {
        <<class>>
        constructor(entryId: string, record: unknown, offset: number, limit: number) unknown
        entryId: string
        record: unknown
        offset: number
        limit: number
    }
    class c0120["ModelReadErrorResult"] {
        <<class>>
        constructor(value: unknown) unknown
        value: unknown
    }
    class c0121["ModelReadTool"] {
        <<interface>>
        name: string
        description: string
        parameters: unknown
        +execute(input: unknown, signal: AbortSignal) Promise~unknown~
    }
    class c0122["ModelRequest"] {
        <<interface>>
        purpose: Type145
        policy: string
        input: unknown
        conversation: readonly unknown[]
        onConversationCompacted: Type146
        signal: AbortSignal
        submission: ModelSubmissionTool
        readTools: ModelReadTool[]
        readConcurrency: number
        readBatchContext: Type147
        diagnosticContext: Type148
    }
    class c0123["ModelSubmissionError"] {
        <<class>>
        constructor(message: string, rejectionReasons: string[]) unknown
        rejectionReasons: string[]
    }
    class c0124["ModelSubmissionTool"] {
        <<interface>>
        name: string
        description: string
        parameters: unknown
        +validate(input: unknown) unknown
        +onRejection(reason: string, input: unknown) void
    }
    class c0125["ModelTaskPause"] {
        <<class>>
    }
    class c0126["Project"] {
        <<interface>>
        id: number
        name: string
        repo_name: Type10
        description: string
    }
    class c0127["ProjectInput"] {
        <<interface>>
        name: string
        description: string
        repo_name: string
    }
    class c0128["Provenance"] {
        <<interface>>
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
    }
    class c0129["Scope"] {
        <<type_alias>>
        alias: Type149
    }
    class c0130["SearchRequest"] {
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
    class c0131["StoredFile"] {
        <<interface>>
        data: string
    }
    class c0132["WorkContext"] {
        <<interface>>
        cwd: string
        repoName: string
        project: Project
        projectDiscoveryPending: boolean
        sessionId: string
        branchId: string
    }
    class c0133["src/contracts.ts"] {
        <<module>>
        rejectedHttpStatus(status: unknown) boolean
        rejectedHttpError(error: unknown) boolean
    }
    class c0134["PlanStatus"] {
        <<type_alias>>
        alias: Type150
    }
    class c0135["PlanningCapability"] {
        <<type_alias>>
        alias: Type151
    }
    class c0136["PlanningCounts"] {
        <<interface>>
        cancelled: number
        done: number
        total: number
    }
    class c0137["PlanningCriterion"] {
        <<interface>>
        id: number
        task_id: number
        description: string
        met: boolean
        met_at: Type10
    }
    class c0138["PlanningPlan"] {
        <<interface>>
        goal: Type10
        context: Type10
    }
    class c0139["PlanningPlanSummary"] {
        <<interface>>
        id: number
        title: string
        project_id: number
        status: PlanStatus
        task_count: number
    }
    class c0140["PlanningProject"] {
        <<interface>>
        id: number
        name: string
        repo_name: Type10
    }
    class c0141["PlanningTask"] {
        <<interface>>
        description: Type10
        criteria: PlanningCriterion[]
        dependency_ids: number[]
    }
    class c0142["PlanningTaskRecord"] {
        <<interface>>
        id: number
        title: string
        plan_id: number
        state: TaskState
        priority: TaskPriority
        assigned_agent: Type10
        version: number
    }
    class c0143["PlanningTaskSummary"] {
        <<interface>>
        criteria_met: number
        criteria_total: number
        blocked: boolean
    }
    class c0144["TaskPriority"] {
        <<type_alias>>
        alias: Type152
    }
    class c0145["TaskState"] {
        <<type_alias>>
        alias: Type153
    }
    class c0146["src/domain/planning.ts"] {
        <<module>>
        taskCounts(tasks: PlanningTaskSummary[]) PlanningCounts
        activeTasks(tasks: PlanningTaskSummary[]) PlanningTaskSummary[]
        sortPlans(plans: PlanningPlanSummary[]) PlanningPlanSummary[]
        mappedProject(projects: PlanningProject[], repoName: string) Type16
    }
    class c0147["AutomaticCaptureJobOutcome"] {
        <<interface>>
        ready: boolean
        terminal: boolean
        noCandidates: boolean
        candidateStages: Type154
        failure: Type155
    }
    class c0148["AutomaticRecall"] {
        <<type_alias>>
        alias: RecallJob
    }
    class c0149["BoundedWaitOutcome"] {
        <<type_alias>>
        alias: Type156
        kind: Type157
        value: T
        kind: Type158
        kind: Type159
        error: unknown
        kind: Type160
    }
    class c0150["CaptureFeedbackItem"] {
        <<interface>>
        jobId: string
        state: CaptureFeedbackState
        outcome: AutomaticCaptureJobOutcome
    }
    class c0151["CaptureFeedbackState"] {
        <<interface>>
        reportedCandidateKeys: Set~string~
        lastFailureKey: string
        lastUnavailable: boolean
        retried: boolean
    }
    class c0152["CaptureServicePort"] {
        <<interface>>
        +enqueue(snapshot: CaptureSnapshot) Promise~unknown~
        +checkpoint(options: CaptureCheckpointOptions) Promise~CaptureCheckpointResult~
        +advanceWatermark(update: Type161) Promise~unknown~
        +stop(sessionId: string, branchId: string) Type162
        +pendingConflicts(options: Type109) Promise~unknown[]~
        +diagnostics(options: Type108) Promise~unknown~
        +resolveConflict(conflictId: string, resolution: Type163) Promise~unknown~
    }
    class c0153["DiagnosticCandidate"] {
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
    class c0154["DiagnosticParts"] {
        <<interface>>
        candidates: number
        stages: Type164
        outcomes: string[]
    }
    class c0155["ExtensionWorkContext"] {
        <<interface>>
        projects: Project[]
    }
    class c0156["ForgetfulExtensionDependencies"] {
        <<interface>>
        client: ForgetfulClient
        createClient: Type165
        recall: RecallServicePort
        capture: CaptureServicePort
        createRecall: Type166
        createCapture: Type167
        resolveWorkContext: Type168
    }
    class c0157["ForgetfulExtensionOptions"] {
        <<interface>>
        agentDir: string
        config: Type169
        dependencies: ForgetfulExtensionDependencies
        policies: Type170
    }
    class c0158["PendingQueuedRecall"] {
        <<type_alias>>
        alias: RecallJob
    }
    class c0159["PolicyName"] {
        <<type_alias>>
        alias: Type171
    }
    class c0160["PreparedRuntime"] {
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
    class c0161["RecallActivity"] {
        <<interface>>
        memoryCount: number
        scope: Scope
        reason: string
    }
    class c0162["RecallContextMessage"] {
        <<interface>>
        role: string
        content: unknown
        customType: unknown
        details: unknown
    }
    class c0163["RecallJob"] {
        <<interface>>
        key: string
        jobId: string
        kind: Type172
        runtime: Runtime
        branchId: string
        generation: number
        prompt: string
        controller: AbortController
        promise: Promise~RecallResult~
        userEntryId: string
        phase: Type173
        result: RecallResult
        boundarySeen: boolean
        terminalConsumed: boolean
        resultSent: boolean
    }
    class c0164["RecallServicePort"] {
        <<interface>>
        +recall(request: Type174) Promise~RecallResult~
        +deeper(request: DeeperRecallRequest) Promise~RecallResult~
    }
    class c0165["Runtime"] {
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
        pendingCaptureJobs: Type175
        recoveryResult: CaptureCheckpointResult
        captureFeedbackFlush: Promise~void~
        captureCheckpointTail: Promise~void~
        captureRetryScheduled: boolean
        captureTriggerId: number
        captureDeferrals: Type176
        settledCaptureTail: Promise~void~
        lifecycleController: AbortController
        initialization: Promise~void~
        ready: boolean
        discoveryError: unknown
        lastRecall: RecallActivity
        skipNextCapture: boolean
    }
    class c0166["SetupAuthentication"] {
        <<interface>>
        tokenEnv: string
        token: string
    }
    class c0167["State"] {
        <<interface>>
        runtime: Runtime
        pendingQueuedRecall: Type177
        automaticRecalls: Type178
        recallJobs: Type179
        skipNextCapture: boolean
        shownWarnings: Set~string~
        generation: number
        loading: Promise~Runtime~
    }
    class c0168["src/extension.ts"] {
        <<module>>
        boundedWait(Signature94)
        setupEndpointSuggestion(value: string) string
        promptSetupEndpoint(ctx: ExtensionContext, config: ForgetfulConfig) Type181
        promptSetupAuthentication(ctx: ExtensionContext) Type182
        makeInstanceId(config: ForgetfulConfig) string
        policyText(config: ForgetfulConfig, policies: Type170, name: PolicyName) string
        sessionKey(ctx: ExtensionContext, branchId: string) string
        boundedErrorDiagnostic(error: unknown) string
        textMessage(text: string) UserMessage
        snapshotWorkContext(context: ExtensionWorkContext) ExtensionWorkContext
        messageContentText(content: unknown) string
        usefulRecallText(result: RecallResult) string
        savedRecallResultText(result: RecallResult, kind: Type172) string
        automaticRecallTerminalText(Signature95)
        automaticRecallResultStatus(result: RecallResult) Type183
        recallActivitySummary(activity: RecallActivity) string
        recordRecallActivity(Signature96)
        recallContextEntries(ctx: ExtensionContext) EvidenceEntry[]
        latestBranchUserEntry(ctx: ExtensionContext) Type184
        latestContextUserPrompt(messages: Type185) Type118
        conflictBelongsToActiveBranch(Signature97)
        defaultWorkContext(ctx: ExtensionContext, branchId: string) ExtensionWorkContext
        canonicalRepository(remote: string) Type118
        qualifiedRepository(host: string, path: string) Type118
        discoverWorkContext(Signature98)
        parseSelection(value: string) Type131
        pickMemoryModel(ctx: ExtensionContext, currentModel: Type187) Type186
        notify(ctx: ExtensionContext, message: string, type: Type188) void
        log(Signature99)
        logFailure(Signature100)
        diagnosticSourceIds(value: unknown) string
        claimText(value: unknown) string
        diagnosticCandidateDetail(value: unknown, stages: Type164) Type118
        collectDiagnosticParts(jobs: unknown[]) DiagnosticParts
        diagnosticSummary(value: unknown) string
        captureJobId(value: unknown) Type118
        captureWasQueued(value: unknown) boolean
        captureProcessedJobIds(value: Type190) string[]
        captureFeedbackReason(value: unknown) Type118
        automaticCaptureJobOutcome(value: unknown, jobId: string) Type191
        readCaptureOutcome(Signature101)
        recordCaptureRetry(#123; state#44; outcome #125;: CaptureFeedbackItem) Type193
        collectCaptureFeedback(items: CaptureFeedbackItem[]) unknown
        captureCount(count: number, singular: string, plural: string) string
        skippedReasonBreakdown(reasons: Type164) string
        captureFailurePart(summary: Type194, noOtherParts: boolean) Type118
        captureFeedbackParts(summary: Type194) string[]
        automaticCaptureFeedback(items: CaptureFeedbackItem[], unavailable: number) Type195
        createForgetfulExtension(options: ForgetfulExtensionOptions) ExtensionFactory
    }
    class c0169["src/foreground-tools.ts"] {
        <<module>>
        registerForegroundTool(pi: ExtensionAPI, definition: ToolDefinition~T~) void
    }
    class c0170["ApiKnowledgeClient"] {
        <<class>>
        constructor(request: KnowledgeRequest, parseMemory: Type196) unknown
        -request: KnowledgeRequest
        -parseMemory: Type196
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
        updateDocument(Signature102)
        listCodeArtifacts(projectId: number, signal: AbortSignal) Promise~CodeArtifactSummary[]~
        getCodeArtifact(artifactId: number, signal: AbortSignal) Promise~CodeArtifact~
        createCodeArtifact(input: CodeArtifactInput, signal: AbortSignal) Promise~CodeArtifact~
        updateCodeArtifact(Signature103)
        updateMemory(memoryId: number, input: Partial~MemoryInput~, signal: AbortSignal) unknown
        linkMemories(memoryId: number, relatedIds: number[], signal: AbortSignal) Promise~void~
        unlinkMemories(memoryId: number, targetId: number, signal: AbortSignal) Promise~void~
        listFiles(projectId: number, signal: AbortSignal) Promise~FileSummary[]~
        getFile(fileId: number, signal: AbortSignal) Promise~StoredFile~
    }
    class c0171["KnowledgeRequest"] {
        <<type_alias>>
        alias: Type197
    }
    class c0172["src/http-knowledge.ts"] {
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
        resourceBody(input: Type198, code: boolean, partial: unknown) Type9
        document(value: unknown) Document
        artifact(value: unknown) CodeArtifact
        summary(value: unknown, code: boolean) Type199
        requestSegment(value: unknown) string
        projectPath(path: string, projectId: number) string
        fileSummary(value: unknown) FileSummary
    }
    class c0173["ApiForgetfulClient"] {
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
        supersede(Signature104)
        obsolete(Signature105)
        -validId(id: number) number
    }
    class c0174["ApiForgetfulClientOptions"] {
        <<interface>>
        baseUrl: string
        token: string
        timeoutMs: number
        maxResponseBytes: number
        fetchImpl: typeof fetch
    }
    class c0175["ForgetfulAbortError"] {
        <<class>>
        constructor(message: unknown) unknown
    }
    class c0176["ForgetfulHttpError"] {
        <<class>>
        status: number
        responseBody: string
        constructor(message: string, status: number, responseBody: string) unknown
    }
    class c0177["ForgetfulHttpTransport"] {
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
        fieldLimits(signal: AbortSignal) Type78
        #endpoint(path: string) string
        -responseByteLimit(method: string, url: URL) number
        #request(Signature106)
        -throwResponseError(Signature107)
        -readResponse(response: Response, signal: AbortSignal, maxBytes: number) Promise~string~
    }
    class c0178["ForgetfulSchemaError"] {
        <<class>>
        constructor(message: string) unknown
    }
    class c0179["ForgetfulTimeoutError"] {
        <<class>>
        constructor(message: unknown) unknown
    }
    class c0180["src/http.ts"] {
        <<module>>
        plainObject(value: unknown) Type88
        parseFieldLimits(payload: unknown) Type36
        isObject(value: unknown) Type130
        directEntityId(edge: unknown, memoryId: number) Type16
        requiredString(value: unknown, field: string, allowEmpty: unknown) string
        projectText(value: string, field: string, max: number) string
        optionalString(value: unknown, field: string) Type118
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
        defaultWhenOmitted(value: Type202, fallback: T) T
        searchBody(request: SearchRequest) Type9
        uniqueMemories(memories: Memory[]) Memory[]
        parseLinkedMemories(value: unknown) LinkedMemory[]
        parseSearchPayload(Signature108)
        flattenSearchResult(result: MemorySearchResult) Memory[]
    }
    class c0181["Attachments"] {
        <<interface>>
        documents: Document[]
        artifacts: CodeArtifact[]
        files: FileSummary[]
        fileIds: number[]
    }
    class c0182["ExpansionContext"] {
        <<interface>>
        failures: Type203
    }
    class c0183["KnowledgeExpansionRequest"] {
        <<interface>>
        memories: Memory[]
        entityNames: string[]
        scope: Scope
        projectId: number
        signal: AbortSignal
    }
    class c0184["KnowledgeExpansionResult"] {
        <<interface>>
        text: string
        memoryIds: number[]
        entityIds: number[]
        relationshipIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
        failures: Type204
    }
    class c0185["KnowledgeReadService"] {
        <<class>>
        -readMemory: MemoryReader
        constructor(client: KnowledgeClient, options: Type205) unknown
        -client: KnowledgeClient
        expand(request: KnowledgeExpansionRequest) Promise~KnowledgeExpansionResult~
        -findEntities(request: ExpansionContext) Promise~Entity[]~
        -findRelationships(Signature109)
        -collectRelationships(Signature110)
        -resolveRelationshipEndpoints(Signature111)
        -formatRelationships(Signature112)
        -findEntityMemories(Signature113)
        -collectEntityMemories(Signature114)
        -isAllowedEntityMemory(id: number, request: ExpansionContext) Promise~boolean~
        -findAttachments(request: ExpansionContext) Promise~Attachments~
        -formatExpansion(Signature115)
        -appendEntityLines(lines: string[], entities: Entity[]) void
        -appendRelationshipLines(lines: string[], relationships: RelationshipExpansion[]) void
        -appendLinkedMemoryLines(lines: string[], linkedMemories: LinkedMemoryExpansion[]) void
        -appendDocumentLines(lines: string[], documents: Document[]) void
        -appendArtifactLines(lines: string[], artifacts: CodeArtifact[]) void
        -appendFileLines(lines: string[], files: FileSummary[], fileIds: number[]) void
        -emptyExpansion() KnowledgeExpansionResult
    }
    class c0186["KnowledgeReadServiceOptions"] {
        <<interface>>
        readMemory: MemoryReader
    }
    class c0187["LinkedMemoryExpansion"] {
        <<type_alias>>
        entity: Entity
        id: number
        title: string
    }
    class c0188["MemoryReader"] {
        <<type_alias>>
        alias: Type209
    }
    class c0189["RelationshipExpansion"] {
        <<type_alias>>
        relationship: EntityRelationship
        source: Entity
        target: Entity
    }
    class c0190["src/knowledge-read.ts"] {
        <<module>>
        validId(value: unknown) value is number
        validEntity(value: unknown) value is Entity
        validRelationship(value: unknown) value is EntityRelationship
        validMemory(value: unknown) value is Memory
        inEntityScope(entity: Entity, scope: Scope, projectId: number) boolean
        inProjectScope(resourceProjectId: Type58, scope: Scope, projectId: number) boolean
        clean(value: string) string
        safeCall(operation: Type3, request: ExpansionContext, operationName: string) Type210
    }
    class c0191["KnowledgeReadContext"] {
        <<interface>>
        client: ForgetfulClient
        knowledge: KnowledgeClient
        request: KnowledgeReadRequest
        context: KnowledgeToolContext
        projectId: number
        signal: AbortSignal
    }
    class c0192["KnowledgeReadRequest"] {
        <<type_alias>>
        alias: Type211
        operation: string
    }
    class c0193["KnowledgeToolContext"] {
        <<interface>>
        cwd: string
        repoName: string
        commit: string
        project: Type212
        scope: Scope
    }
    class c0194["KnowledgeToolResult"] {
        <<interface>>
        content: Type213
        details: Type9
        file: StoredFile
    }
    class c0195["KnowledgeWriteContext"] {
        <<interface>>
        client: ForgetfulClient
        knowledge: KnowledgeClient
        request: KnowledgeWriteRequest
        context: KnowledgeToolContext
        projectId: number
        signal: AbortSignal
        beforeWrite: Type54
        checkWriteState: Type12
    }
    class c0196["KnowledgeWriteRequest"] {
        <<type_alias>>
        alias: Type211
        operation: string
    }
    class c0197["ResolvedWriteProject"] {
        <<interface>>
        id: number
        repoName: string
    }
    class c0198["ToolImage"] {
        <<type_alias>>
        data: string
        mimeType: string
        type: Type214
    }
    class c0199["ToolText"] {
        <<type_alias>>
        text: string
        type: Type215
    }
    class c0200["src/knowledge-tools.ts"] {
        <<module>>
        leftoverSearchField(description: string) unknown
        isEntityType(value: unknown) value is EntityType
        record(value: unknown, label: string) Type9
        requiredText(value: unknown, field: string, max: number) string
        optionalText(value: unknown, field: string, max: number) Type118
        requiredId(value: unknown, field: string) number
        optionalId(value: unknown, field: string) Type16
        boundedId(value: unknown, field: string, maximum: number) Type16
        requiredIds(value: unknown, field: string) number[]
        optionalIds(value: unknown, field: string) Type121
        requiredStrings(value: unknown, field: string, maxItems: unknown) string[]
        optionalStrings(value: unknown, field: string, maxItems: unknown) Type122
        optionalImportance(value: unknown) Type16
        commit(value: unknown) Type118
        checkOperation(value: unknown, choices: Set~string~) string
        containsSensitiveData(value: unknown) boolean
        rejectSensitiveInput(value: unknown) void
        need(input: Type9, fields: Type216) void
        validateReadSearch(input: Type9, op: string) void
        validateReadPagination(input: Type9, op: string) void
        validateKnowledgeReadRequest(value: unknown) KnowledgeReadRequest
        validateEntityFields(input: Type9) void
        validateKnowledgeWriteRequest(value: unknown) KnowledgeWriteRequest
        rich(client: ForgetfulClient) KnowledgeClient
        currentProject(context: KnowledgeToolContext, requested: number) number
        resolveWriteProject(Signature116)
        inMemoryProject(memory: Memory, projectId: number) boolean
        inEntityProject(entity: Entity, projectId: number) boolean
        json(value: unknown) string
        page(value: Type217, field: Type218, offset: number, limit: number) unknown
        listPage(values: T[], offset: number, limit: number) Type219
        boundedListPage(values: T[], offset: number, limit: number) Type220
        fileContent(file: StoredFile, offset: number, limit: number) Type221
        readResult(value: unknown, details: Type9) KnowledgeToolResult
        assertReadMemory(Signature117)
        assertReadEntity(Signature118)
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
        executeKnowledgeRead(Signature119)
        provenance(context: KnowledgeToolContext, request: Type9) Type222
        effectiveCommit(context: KnowledgeToolContext, request: Type9) Type118
        updateProvenance(Signature120)
        beforeMutation(beforeWrite: Type223, signal: AbortSignal) Promise~void~
        memoryInProject(Signature121)
        entityInProject(Signature122)
        hydrateEntities(Signature123)
        validateAttachments(Signature124)
        compactString(value: unknown) unknown
        compactObjectEntry(key: string, value: unknown, depth: number) unknown
        compactWriteValue(value: unknown, depth: unknown) unknown
        writeResult(value: unknown, operation: string) KnowledgeToolResult
        createMemory(Signature125)
        createEntity(Signature126)
        createDocument(Signature127)
        createCodeArtifact(Signature128)
        replacementMemory(write: KnowledgeWriteContext) Promise~Memory~
        updateMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        supersedeMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        linkMemories(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateEntity(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        linkEntityMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        createRelationship(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateDocument(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateCodeArtifact(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        executeKnowledgeWrite(Signature129)
    }
    class c0201["KnowledgeAttachmentIds"] {
        <<interface>>
        documentIds: number[]
        codeArtifactIds: number[]
    }
    class c0202["KnowledgeCodeArtifactPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: CodeArtifactInput
    }
    class c0203["KnowledgeDocumentPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: DocumentInput
    }
    class c0204["KnowledgeEntityMemoryLinkPlan"] {
        <<interface>>
        entityKey: string
    }
    class c0205["KnowledgeEntityPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: EntityInput
    }
    class c0206["KnowledgeMemoryReader"] {
        <<type_alias>>
        alias: Type209
    }
    class c0207["KnowledgeRelationshipPlan"] {
        <<interface>>
        key: string
        existingId: number
        sourceEntityKey: string
        targetEntityKey: string
        input: EntityRelationshipInput
    }
    class c0208["KnowledgeWriteCheckpoint"] {
        <<type_alias>>
        alias: Type224
    }
    class c0209["KnowledgeWriteGuard"] {
        <<type_alias>>
        alias: Type54
    }
    class c0210["KnowledgeWritePlan"] {
        <<interface>>
        operationId: string
        projectId: number
        memoryId: number
        expectedClaim: Type225
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
    class c0211["KnowledgeWriteReceipt"] {
        <<interface>>
        key: string
        id: number
        occurrence: number
    }
    class c0212["KnowledgeWriteSave"] {
        <<type_alias>>
        alias: Type54
    }
    class c0213["KnowledgeWriteState"] {
        <<interface>>
        failure: Type226
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
    class c0214["KnowledgeWriter"] {
        <<class>>
        constructor(Signature130)
        -client: WriteClient
        -readMemory: KnowledgeMemoryReader
        -assertCanWrite: Type12
        -attachmentMemory(plan: KnowledgeWritePlan, signal: AbortSignal) Promise~Memory~
        -recordCreateFailure(Signature131)
        -createOnce(Signature132)
        -writeEntity(Signature133)
        -writeEntities(Signature134)
        -writeDocument(Signature135)
        -writeDocuments(Signature136)
        -writeCodeArtifact(Signature137)
        -writeCodeArtifacts(Signature138)
        -requestedAttachmentIds(Signature139)
        -attachmentIds(memory: Memory, requested: KnowledgeAttachmentIds) KnowledgeAttachmentIds
        -attachmentsDiffer(memory: Memory, ids: KnowledgeAttachmentIds) boolean
        -attachmentPatch(ids: KnowledgeAttachmentIds) Type229
        -writeConnection(Signature140)
        -writeAttachments(Signature141)
        -writeRelationship(Signature142)
        -writeRelationships(Signature143)
        -writeEntityMemoryLink(Signature144)
        -writeEntityMemoryLinks(Signature145)
        -writeLinkedMemory(Signature146)
        -writeLinkedMemories(Signature147)
        execute(Signature148)
    }
    class c0215["ResourceSlot"] {
        <<type_alias>>
        alias: Type231
        occurrence: number
    }
    class c0216["WriteClient"] {
        <<type_alias>>
        alias: Type232
    }
    class c0217["src/knowledge-write.ts"] {
        <<module>>
        resourceSlots(resources: T[]) ResourceSlot~T~[]
        copyState(value: KnowledgeWriteState) KnowledgeWriteState
        positiveId(value: unknown) value is number
        stateWithNumber(Signature149)
        stateId(values: KnowledgeWriteReceipt[], key: string, occurrence: unknown) Type16
        selectedIds(values: KnowledgeWriteReceipt[], resources: Type233) number[]
        uniqueIds(values: number[]) number[]
        sameIds(left: Type121, right: number[]) boolean
        receipts(value: unknown) KnowledgeWriteReceipt[]
        normalizedState(previous: Partial~KnowledgeWriteState~) KnowledgeWriteState
        hasValue(values: string[], value: string) boolean
        instructionId(plan: KnowledgeWritePlan) string
    }
    class c0218["DiagnosticLogger"] {
        <<interface>>
        +emit(level: Type82, event: string, data: Type9) void
        +flush() Promise~void~
    }
    class c0219["FileLogLevel"] {
        <<type_alias>>
        alias: Type234
    }
    class c0220["FileLogger"] {
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
        constructor(options: Type235) unknown
        -options: Type235
        setLevel(level: FileLogLevel) void
        emit(level: Type82, event: string, data: Type9) void
        -enqueue(level: Type82, event: string, data: Type9) void
        -encode(level: Type82, row: Type9) Type236
        -fitLine(row: Type9) string
        -write(lines: string[], trace: boolean, generation: number) Promise~void~
        -traceLines(row: Type9, payload: string) Type122
        -traceFileCount(lines: string[], used: unknown) number
        -rotate() Promise~void~
        -warn(error: unknown) void
        close() Promise~void~
        flush() Promise~void~
    }
    class c0221["src/logging.ts"] {
        <<module>>
        processExited(pid: number) boolean
        listLogFiles(directory: string) unknown
        pruneDirectory(directory: string, current: Type22) Promise~void~
        limit(value: Type16, fallback: number) number
        excludeCredentials(value: unknown) unknown
        correlation(data: unknown) Type9
    }
    class c0222["src/memory-context.ts"] {
        <<module>>
        storedMemoryContext(context: string) string
        replacementMemoryContext(context: string) string
        replacementMemoryInput(input: MemoryInput) MemoryInput
    }
    class c0223["CompactedMemoryHistory"] {
        <<interface>>
        summary: string
        retainedMessages: Message[]
    }
    class c0224["ContextWindowError"] {
        <<class>>
    }
    class c0225["MemoryHistorySummaryOptions"] {
        <<interface>>
        model: Model~any~
        compactionSettings: CompactionSettings
        contextLimitTokens: number
        signal: AbortSignal
        sessionId: string
        complete: SummaryCompletion
    }
    class c0226["MemoryTaskContext"] {
        <<class>>
        -settings: typeof DEFAULT_COMPACTION_SETTINGS
        -contextWindow: number
        -originalHistory: Set~Message~
        -compactedHistory: CompactedMemoryHistory
        -summaryMessage: Message
        constructor(Signature150)
        -model: Model~any~
        -task: Message
        getCompactedHistory() Type238
        prepare(Signature151)
        prepareCapture(Signature152)
        -prepareContext(Signature153)
        -applySummary(Signature154)
        -outputAllowance(context: Context) number
    }
    class c0227["SummaryCompletion"] {
        <<type_alias>>
        alias: Type241
    }
    class c0228["src/model-context.ts"] {
        <<module>>
        objectRecord(value: unknown) Type130
        modelEvidence(record: unknown) unknown
        evidenceMessage(record: unknown, label: string, timestamp: number) UserMessage
        evidencePageContent(page: ModelEvidencePage) Type242
        textTokens(text: string) number
        contextTokens(context: Context) number
        assertFits(Signature155)
        validatePositiveSafeInteger(value: unknown, label: string) number
        entriesFor(messages: Message[]) SessionMessageEntry[]
        recentCutIndex(messages: Message[], keepRecentTokens: number) number
        assertImageSupport(context: Context, model: Model~any~) void
        summaryEvidence(message: Message, index: number) UserMessage
        privateContextWindow(model: Model~any~, contextLimitTokens: unknown) number
        compactionSettings(settings: CompactionSettings) typeof DEFAULT_COMPACTION_SETTINGS
        outputCeiling(Signature156)
        resolvedOutputAllowance(Signature157)
        smallerSummaryBatch(messages: Message[], count: number) number
        summarizeMemoryHistory(Signature158)
    }
    class c0229["MemoryModelHeaderTransform"] {
        <<type_alias>>
        alias: Type244
    }
    class c0230["ModelPickerContext"] {
        <<interface>>
        modelRegistry: Type245
        scopedModels: Type246
    }
    class c0231["ModelRegistryPort"] {
        <<interface>>
        +find(provider: string, modelId: string) Type187
        +complete(Signature159)
    }
    class c0232["PiMemoryModel"] {
        <<class>>
        version: string
        -classificationTimeoutMs: number
        -sessionId: string
        -transformHeaders: MemoryModelHeaderTransform
        -logger: DiagnosticLogger
        -compactionSettings: CompactionSettings
        -contextLimitTokens: number
        constructor(Signature160)
        -registry: ModelRegistryPort
        -selection: ModelSelection
        complete(request: ModelRequest) Promise~unknown~
        prepareCapture(request: ModelRequest) Type144
        -emit(level: Type82, event: string, request: ModelRequest, data: Type9) void
        -completeRequest(request: ModelRequest, preparationOnly: unknown) Promise~unknown~
        -completeAttempt(Signature161)
        -executeRead(Signature162)
        -validateSubmission(submission: ModelSubmissionTool, tool: Tool, call: ToolCall) unknown
        -completeWithSubmission(Signature163)
    }
    class c0233["PiMemoryModelOptions"] {
        <<interface>>
        logger: DiagnosticLogger
        classificationTimeoutMs: number
        timeoutMs: number
        sessionId: string
        transformHeaders: MemoryModelHeaderTransform
        compactionSettings: CompactionSettings
        contextLimitTokens: number
    }
    class c0234["RequestDeadline"] {
        <<interface>>
        controller: AbortController
        callerAbort: Promise~never~
        timeout: Promise~never~
        timedOut: boolean
        providerCalls: number
        compactionCalls: number
        +cleanup() void
    }
    class c0235["src/model.ts"] {
        <<module>>
        serializeInput(input: unknown) string
        ensureCompletionFinished(Signature164)
        modelLabel(model: ModelSelection) string
        isOpenCodeModel(model: Model~any~) boolean
        openCodeSessionHeaders(model: Model~any~, sessionId: Type118) Type249
        requestTimeout(request: ModelRequest, classificationTimeoutMs: number) number
        requestOptions(Signature165)
        textBlock(text: string) TextContent
        submissionTool(submission: Type251) Tool
        toolCalls(message: AssistantMessage) ToolCall[]
        rejectionText(error: unknown) string
        sanitizedAssistantForHistory(message: AssistantMessage) AssistantMessage
        errorToolResult(call: ToolCall, error: string) ToolResultMessage
        appendCallCountCorrection(Signature166)
        requestDeadline(request: ModelRequest, timeoutMs: number) RequestDeadline
        throwRequestFailure(Signature167)
        resolveMemoryModel(Signature168)
        modelSelectionFromModel(model: Model~any~) ModelSelection
        availableMemoryModels(ctx: ModelPickerContext) Model~any~[]
    }
    class c0236["src/privacy.ts"] {
        <<module>>
        sanitizeText(text: string) string
        diagnosticMessage(error: unknown) string
        errorMessage(error: unknown) string
        hasSensitiveData(text: string) boolean
        isMemoryOperation(toolName: string) boolean
        sanitizeValue(value: unknown) unknown
    }
    class c0237["AgentProjectInitInput"] {
        <<interface>>
        name: string
        description: string
        projectId: number
    }
    class c0238["ProjectInitError"] {
        <<class>>
    }
    class c0239["src/project-init.ts"] {
        <<module>>
        existingMapping(projects: Project[], repoName: string) Type253
        validateAgentProjectDetails(repoName: string, input: AgentProjectInitInput) ProjectInput
        promptNewProject(ctx: ExtensionContext, repoName: string) Type254
        promptExistingProject(Signature169)
        initialiseProject(Signature170)
        initialiseProjectForAgent(Signature171)
    }
    class c0240["DurableQueueStore"] {
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
        -now: Type77
        -snapshotPrefix: string
        constructor(options: Type256) unknown
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
        -mutate(operation: Type257) Promise~T~
        -pruneFailedJobs(state: QueueState) boolean
        -prune(state: QueueState) void
        -updateWatermark(state: QueueState, update: WatermarkAdvance) QueueWatermark
        enqueue(snapshot: CaptureSnapshot) Promise~QueueEnqueueResult~
        enqueueSnapshot(snapshot: CaptureSnapshot) Promise~QueueEnqueueResult~
        advanceWatermark(update: Type258) Promise~QueueWatermark~
        getWatermark(sessionId: string, branchId: string) Promise~QueueWatermark~
        resolveBranchId(Signature172)
        currentWatermark(context: Type113) Promise~QueueWatermark~
        completeProjectDiscovery(context: Type259) Promise~void~
        listPending(identity: QueueIdentity) Promise~QueueJob[]~
        listJobs(identity: QueueIdentity) Promise~QueueJob[]~
        listJobMetadata(identity: QueueIdentity) Promise~QueueJobMetadata[]~
        getJob(jobId: string) Type98
        refreshCaptureHistory(jobId: string) Type260
        -reusableHistory(snapshot: CaptureSnapshot, watermark: QueueWatermark) Type261
        hasClaimableWork(identity: QueueIdentity, excludeBranches: Type262) Promise~boolean~
        claimNext(identity: QueueIdentity, branch: Type263, onDiscarded: Type264) Type98
        -matchesBranch(job: QueueJob, branch: Type265) boolean
        -runningJobCanBeRecovered(job: QueueJob, currentTime: number) boolean
        -claimJob(job: QueueJob) void
        releaseProgress(jobId: string, replenishModelCalls: unknown) Promise~void~
        cancel(Signature173)
        checkpoint(jobId: string, patch: QueueCheckpoint) Promise~QueueJob~
        checkpoint(jobId: string, candidateId: string, outcome: unknown) Promise~QueueJob~
        checkpoint(jobId: string, patchOrCandidate: Type266, outcome: unknown) Promise~QueueJob~
        -compactJobSnapshot(Signature174)
        -recordCompletedCapture(state: QueueState, job: StoredQueueJob) Promise~void~
        -applyCheckpointPatch(job: StoredQueueJob, patch: QueueCheckpoint) void
        complete(jobId: string) Promise~QueueJob~
        addConflict(conflict: PendingConflict) Promise~PendingConflict~
        getConflict(conflictId: string) Type267
        pendingConflicts(Signature175)
        listPendingConflicts(Signature176)
        markConflictHandedOff(conflictId: string, entryId: string) Promise~void~
        updateConflict(Signature177)
        withWorkerLock(identity: QueueIdentity, branch: Type263, operation: Type3) Type210
        close() Promise~void~
    }
    class c0241["DurableQueueStoreOptions"] {
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
        now: Type77
    }
    class c0242["FileLock"] {
        <<interface>>
        token: string
        +release() Promise~void~
    }
    class c0243["HistoryCache"] {
        <<interface>>
        digest: string
        throughEntryId: string
        entryIds: string[]
    }
    class c0244["PendingConflict"] {
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
        status: Type268
        handoffEntryId: string
        replacementId: number
        uncertainWrite: string
        supersession: SupersessionReceipt
        replacement: Type269
        resolution: unknown
        createdAt: string
        updatedAt: string
    }
    class c0245["QueueBusyError"] {
        <<class>>
        constructor(path: string) unknown
    }
    class c0246["QueueCheckpoint"] {
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
    class c0247["QueueEnqueueResult"] {
        <<interface>>
        queued: boolean
        jobId: string
        reason: string
        historyError: string
    }
    class c0248["QueueIdentity"] {
        <<interface>>
        instanceId: string
        endpoint: string
        accountId: string
    }
    class c0249["QueueJob"] {
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
    class c0250["QueueJobMetadata"] {
        <<interface>>
        snapshot: Type270
    }
    class c0251["QueueJobStatus"] {
        <<type_alias>>
        alias: Type271
    }
    class c0252["QueueState"] {
        <<interface>>
        version: Type272
        jobs: StoredQueueJob[]
        conflicts: PendingConflict[]
        watermarks: Type273
    }
    class c0253["QueueWatermark"] {
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
    class c0254["SnapshotPayload"] {
        <<type_alias>>
        alias: Type274
        historyEntryIds: string[]
    }
    class c0255["StoredQueueJob"] {
        <<interface>>
        snapshotDigest: string
        inspectionDigest: string
    }
    class c0256["SupersessionReceipt"] {
        <<interface>>
        oldMemoryId: number
        replacementId: number
        operation: Type275
        status: Type42
    }
    class c0257["WatermarkAdvance"] {
        <<interface>>
        sessionId: string
        branchId: string
        entryIds: string[]
        finalEntryId: string
        snapshotId: string
        dedupeKey: string
    }
    class c0258["src/queue.ts"] {
        <<module>>
        jsonSnapshot(value: T) T
        nowIso(now: Type77) string
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
        recordId(value: unknown) Type118
        orderedSourceEntryIds(snapshot: CaptureSnapshot) Type122
        summaryCursor(snapshot: CaptureSnapshot) Type276
        cursorComparison(candidate: Type277, current: Type278) Type16
        clearHistoryCache(watermark: QueueWatermark) void
        historyCaches(watermark: QueueWatermark) HistoryCache[]
        setHistoryCaches(watermark: QueueWatermark, caches: HistoryCache[]) void
    }
    class c0259["DeadlineSignal"] {
        <<interface>>
        signal: AbortSignal
        finish: Type12
        pause: Type12
        resume: Type12
        expired: Type22
        diagnostic: Type279
    }
    class c0260["DeeperRecallRequest"] {
        <<interface>>
        query: string
        context: WorkContext
        scope: Scope
        signal: AbortSignal
        deadlineMs: number
        projects: Project[]
    }
    class c0261["RecallPlan"] {
        <<interface>>
        search: boolean
        queries: string[]
        queryIntent: string
        entities: string[]
        repositorySpecific: boolean
        projectId: number
    }
    class c0262["RecallRequest"] {
        <<interface>>
        diagnosticContext: Type280
        prompt: string
        context: WorkContext
        scope: Scope
        classificationPolicy: string
        recallPolicy: string
        signal: AbortSignal
        deadlineMs: number
        authorizeProject: Type281
        projects: Project[]
        sessionContext: EvidenceEntry[]
        onPlan: Type282
    }
    class c0263["RecallResult"] {
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
    class c0264["RecallService"] {
        <<class>>
        -defaultDeadlineMs: number
        -failureThreshold: number
        -cooldownMs: number
        -now: Type283
        -knowledge: KnowledgeReadService
        -concurrency: number
        -failures: unknown
        -openedAt: Type16
        constructor(Signature178)
        -client: ForgetfulClient
        -model: MemoryModelClient
        recall(request: RecallRequest) Promise~RecallResult~
        -recallReadTool(Signature179)
        -finishFailure(Signature180)
        -finishReview(Signature181)
        deeper(request: DeeperRecallRequest) Promise~RecallResult~
        -memoryInScope(memory: Memory, scope: Scope, projectId: number) boolean
        -optionalKnowledge(Signature182)
        -resultWithKnowledge(Signature183)
        -plannerInput(request: RecallRequest) unknown
        -authorizeProjectSelection(Signature184)
        -requestsDifferentProject(Signature185)
        -searchMemories(Signature186)
        -searchFailure(error: unknown) unknown
        -searchRequest(Signature187)
        -queryContext(plan: RecallPlan) string
        -resolveScope(Signature188)
        -contextProjectResolution(context: WorkContext) ScopeResolution
        -matchResolution(matches: Project[]) ScopeResolution
        -ensureLive(deadline: DeadlineSignal) void
        -empty(scope: Scope, reason: string) RecallResult
        -circuitOpen() boolean
        -recordFailure() void
        -recordSuccess() void
    }
    class c0265["RecallServiceOptions"] {
        <<interface>>
        concurrency: number
        deadlineMs: number
        circuitFailureThreshold: number
        circuitCooldownMs: number
        now: Type283
    }
    class c0266["ReviewValidationError"] {
        <<class>>
        constructor(message: string, debug: string) unknown
        debug: string
    }
    class c0267["ScopeResolution"] {
        <<interface>>
        projectId: number
        project: Project
        reason: string
    }
    class c0268["SearchOutcome"] {
        <<interface>>
        memories: Memory[]
        failed: boolean
        diagnostic: string
        failure: unknown
    }
    class c0269["src/recall.ts"] {
        <<module>>
        isForgetfulResponseError(error: unknown) Type288
        isObject(value: unknown) Type130
        plannerString(value: unknown, field: string, required: unknown) string
        positiveInteger(value: unknown, field: string) number
        abortError() Error
        isAbort(error: unknown) boolean
        failureReason(deadline: DeadlineSignal, callerSignal: AbortSignal) string
        exceptionDiagnostic(stage: string, error: unknown) string
        trim(value: string, max: number) string
        repositoryIdentity(context: WorkContext) Type118
        repoAwareQuery(query: string, context: WorkContext, repositorySpecific: boolean) string
        availableProjects(context: WorkContext, supplied: Project[]) Project[]
        createDeadlineSignal(callerSignal: Type201, deadlineMs: number) DeadlineSignal
        raceAbort(promise: Promise~T~, signal: AbortSignal) Promise~T~
        parseQueries(value: unknown, search: boolean) string[]
        parseEntities(value: unknown) string[]
        parsePlan(value: unknown) RecallPlan
        validateMemory(value: unknown) Type289
        formatRecall(Signature189)
        reviewSources(result: Partial~RecallResult~) Type291
        sourceLabels(sources: ReturnType~typeof reviewSources~) string[]
        boundDebugText(value: string, max: number, marker: string) string
        reviewerOutputText(value: unknown) string
        reviewMismatchDirection(value: unknown) Type118
        reviewValidationDebug(Signature190)
        submissionAttemptTrace(rejections: string[], exhausted: unknown, label: Type292) string
        parseReview(value: unknown, candidates: RecallResult) Type293
        recallReviewSubmission(Signature191)
        sanitizePolicy(value: string) string
    }
    class c0270["src/repository.ts"] {
        <<module>>
        repositoryName(value: string) string
    }
    class c0271["SetupHelp"] {
        <<interface>>
        newInstance: boolean
        route: Type295
    }
    class c0272["src/setup.ts"] {
        <<module>>
        promptSetupHelp(ctx: ExtensionContext) Type296
        buildSetupPrompt(help: SetupHelp, agentDir: string, settingsPath: string) string
    }
    class c0273["CaptureSnapshotWithStatus"] {
        <<interface>>
        finalStopReason: string
    }
    class c0274["MessageRecord"] {
        <<interface>>
        role: unknown
        content: unknown
        toolName: unknown
        isError: unknown
        stopReason: unknown
        toolCallId: unknown
        details: unknown
    }
    class c0275["SnapshotOptions"] {
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
        includeToolEvidence: Type297
    }
    class c0276["SnapshotResult"] {
        <<type_alias>>
        alias: Type298
        snapshot: CaptureSnapshotWithStatus
        status: Type299
        finalEntryId: string
        reason: string
        status: Type300
    }
    class c0277["SnapshotSessionReader"] {
        <<interface>>
        +getSessionId() string
        +getLeafId() Type10
        +getBranch(fromId: string) SessionEntry[]
    }
    class c0278["src/snapshot.ts"] {
        <<module>>
        isRecord(value: unknown) Type130
        asMessage(entry: SessionEntry) Type301
        contentText(content: unknown) string
        safeText(text: string) string
        sanitizeConversation(value: unknown) unknown
        sanitizeCaptureConversation(conversation: readonly unknown[]) unknown[]
        sanitizeCaptureSnapshot(snapshot: CaptureSnapshot) CaptureSnapshot
        conversationForEntry(entry: SessionEntry) unknown
        rootId(branch: SessionEntry[], fallback: string) string
        snapshotId(sessionId: string, branchId: string, finalEntryId: string) string
        deltaStartIndex(Signature192)
        toolEvidence(id: string, message: MessageRecord, includeToolEvidence: Type303) Type302
        evidenceForEntry(entry: SessionEntry, includeToolEvidence: Type304) Type302
        lastAssistantEntry(entries: SessionEntry[]) Type305
        collectEvidence(entries: SessionEntry[], includeToolEvidence: Type303) EvidenceEntry[]
        captureSummaryRecord(history: CaptureHistorySummary) unknown
        captureConversation(snapshot: CaptureSnapshot) readonly unknown[]
        compactCaptureSnapshot(Signature193)
        reuseCaptureHistory(snapshot: CaptureSnapshot, history: Type306) CaptureSnapshot
        buildCaptureSnapshot(options: SnapshotOptions) SnapshotResult
    }
    class c0279["SourceInspectionError"] {
        <<interface>>
        name: string
        message: string
        code: string
    }
    class c0280["SourceInspectionRequest"] {
        <<type_alias>>
        alias: Type307
        path: string
        path: never
        url: never
        url: string
    }
    class c0281["SourceInspectionResult"] {
        <<type_alias>>
        alias: Type308
        status: Type309
        identifier: string
        content: string
        observedAt: string
        contentHash: string
        sanitized: boolean
        page: Type310
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
        fileState: Type311
        provenanceError: SourceInspectionError
        httpStatus: number
        status: Type312
        observedAt: string
        error: SourceInspectionError
        source_url: string
        httpStatus: number
        httpStatusText: string
        body: string
    }
    class c0282["SourceInspector"] {
        <<class>>
        -root: Type313
        constructor(options: SourceInspectorOptions) unknown
        -options: SourceInspectorOptions
        inspect(input: unknown, signal: AbortSignal) Promise~SourceInspectionResult~
        -inspectUrl(request: Type314, signal: AbortSignal) Promise~SourceInspectionResult~
        -getUrl(url: URL, allowLoopback: boolean, signal: AbortSignal) Type315
        -check(signal: AbortSignal) void
        -readFile(cwd: string, path: string, signal: AbortSignal) Promise~Buffer~
        -provenance(cwd: string, path: string, bytes: Buffer, signal: AbortSignal) unknown
        -git(cwd: string, args: string[], signal: AbortSignal) Promise~string~
    }
    class c0283["SourceInspectorOptions"] {
        <<interface>>
        cwd: string
        repoName: string
        canRead: Type22
    }
    class c0284["src/source-inspection.ts"] {
        <<module>>
        loopback(host: string) boolean
        validateUrl(url: URL) string
        validateAddress(address: string, allowLoopback: boolean) void
        errorDetails(error: unknown) SourceInspectionError
        sourceContent(bytes: Buffer, request: SourceInspectionRequest) unknown
        requireInside(cwd: string, path: string) void
    }
    c0000 ..> c0168 : defaultExtension() calls createForgetfulExtension()
    c0003 ..> c0004 : setLabel() calls refresh()
    c0003 ..> c0070 : dispose() calls stop()
    c0004 --> c0003 : field loader
    c0004 ..> c0003 : 4 relationships (see list)
    c0004 ..> c0004 : 3 relationships (see list)
    c0004 ..> c0070 : refresh() calls now()
    c0005 ..> c0005 : 9 relationships (see list)
    c0005 ..> c0006 : 33 relationships (see list)
    c0005 ..|> c0021 : implements
    c0005 ..> c0022 : 7 relationships (see list)
    c0005 ..> c0135 : type in capabilities
    c0005 ..> c0138 : type in plan
    c0005 ..> c0139 : type in plans
    c0005 ..> c0140 : type in projects
    c0005 ..> c0141 : type in task
    c0005 ..> c0143 : type in tasks
    c0005 --> c0174 : field options
    c0005 ..> c0174 : type in constructor
    c0005 --> c0177 : field transport
    c0005 ..> c0177 : 7 relationships (see list)
    c0005 ..> c0190 : clean() calls clean()
    c0005 ..> c0236 : 2 relationships (see list)
    c0006 ..> c0006 : 16 relationships (see list)
    c0006 ..> c0142 : type in taskRecord
    c0006 ..> c0178 : invalid() constructs ForgetfulSchemaError
    c0007 ..|> c0020 : implements
    c0007 ..> c0091 : 3 relationships (see list)
    c0009 ..> c0003 : command() calls refresh()
    c0009 ..> c0009 : 25 relationships (see list)
    c0009 ..> c0010 : 2 relationships (see list)
    c0009 ..> c0011 : 5 relationships (see list)
    c0009 ..> c0013 : 8 relationships (see list)
    c0009 ..> c0023 : type in display
    c0009 --> c0024 : field controller
    c0009 ..> c0024 : type in constructor
    c0009 ..> c0168 : 3 relationships (see list)
    c0009 ..> c0269 : command() calls trim()
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
    c0011 ..> c0139 : type in panelPlan
    c0011 ..> c0143 : type in taskLabel
    c0011 ..> c0236 : text() calls sanitizeText()
    c0012 --> c0018 : field detailError
    c0012 --> c0023 : field planTasks
    c0012 --> c0138 : field planDetail
    c0012 --> c0139 : field plans
    c0012 --> c0141 : field taskDetail
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
    c0013 ..> c0070 : 2 relationships (see list)
    c0013 ..> c0139 : type in readPlanTasks
    c0013 ..> c0143 : type in readDetails
    c0013 ..> c0146 : 4 relationships (see list)
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
    c0019 --> c0136 : field counts
    c0019 --> c0143 : 2 relationships (see list)
    c0021 ..> c0022 : 6 relationships (see list)
    c0021 ..> c0135 : type in capabilities
    c0021 ..> c0138 : type in plan
    c0021 ..> c0139 : type in plans
    c0021 ..> c0140 : type in projects
    c0021 ..> c0141 : type in task
    c0021 ..> c0143 : type in tasks
    c0022 --> c0018 : field error
    c0023 --> c0018 : 2 relationships (see list)
    c0023 --> c0019 : field planTasks
    c0023 --> c0135 : field capability
    c0023 --> c0138 : field planDetail
    c0023 --> c0139 : field plans
    c0023 --> c0140 : field projects
    c0023 --> c0141 : field taskDetail
    c0024 --> c0023 : field state
    c0024 ..> c0023 : type in subscribe
    c0026 ..> c0005 : createPlanningRuntime() constructs ApiPlanningReader
    c0026 ..> c0007 : createPlanningRuntime() constructs LocalPlanningPreferences
    c0026 ..> c0009 : 6 relationships (see list)
    c0026 ..> c0013 : 3 relationships (see list)
    c0026 ..> c0070 : createPlanningRuntime() calls now()
    c0026 ..> c0080 : type in createPlanningRuntime
    c0029 ..> c0027 : type in initialCorrectionCycle
    c0029 ..> c0121 : type in captureFailureReport
    c0029 ..> c0133 : correctableCaptureError() calls rejectedHttpError()
    c0029 ..> c0236 : captureFailureReport() calls sanitizeValue()
    c0030 ..> c0111 : type in fieldLimitGuidance
    c0031 --> c0032 : 2 relationships (see list)
    c0031 --> c0033 : field decisions
    c0031 --> c0034 : field preservation
    c0031 --> c0035 : field previous
    c0031 --> c0095 : field resources
    c0031 --> c0099 : field resources
    c0031 --> c0114 : 2 relationships (see list)
    c0035 --> c0095 : field codeArtifacts
    c0035 --> c0099 : field documents
    c0035 --> c0102 : field entities
    c0035 --> c0114 : field memory
    c0036 ..> c0004 : 2 relationships (see list)
    c0036 ..> c0028 : authorizedMemory() constructs CaptureSelectionError
    c0036 ..> c0031 : 8 relationships (see list)
    c0036 ..> c0032 : type in executeConnection
    c0036 ..> c0033 : 3 relationships (see list)
    c0036 ..> c0034 : type in validateLinkReviews
    c0036 ..> c0035 : type in preparePreviousConnections
    c0036 ..> c0036 : 10 relationships (see list)
    c0036 ..> c0095 : type in readAttachmentRecords
    c0036 ..> c0099 : type in readAttachmentRecords
    c0036 ..> c0109 : 7 relationships (see list)
    c0036 ..> c0114 : 6 relationships (see list)
    c0036 ..> c0129 : 3 relationships (see list)
    c0036 ..> c0133 : executeConnection() calls rejectedHttpStatus()
    c0036 ..> c0170 : 8 relationships (see list)
    c0036 ..> c0173 : 6 relationships (see list)
    c0036 ..> c0214 : executeConnection() calls execute()
    c0036 ..> c0236 : 5 relationships (see list)
    c0036 ..> c0269 : validateLinkDecisions() calls trim()
    c0037 --> c0129 : field scope
    c0039 --|> c0037 : inherits
    c0041 ..> c0028 : 3 relationships (see list)
    c0041 ..> c0037 : 4 relationships (see list)
    c0041 ..> c0038 : 4 relationships (see list)
    c0041 ..> c0039 : type in preserveMergeConnections
    c0041 ..> c0041 : 8 relationships (see list)
    c0041 ..> c0109 : 5 relationships (see list)
    c0041 ..> c0114 : type in collectMergeConnections
    c0041 ..> c0170 : 7 relationships (see list)
    c0041 ..> c0173 : 2 relationships (see list)
    c0041 ..> c0214 : preserveMergeConnections() calls execute()
    c0042 --> c0049 : field candidates
    c0047 --> c0049 : field candidate
    c0047 --> c0062 : field neighborhood
    c0047 --> c0114 : field overlaps
    c0049 --> c0052 : field codeArtifacts
    c0049 --> c0058 : field documents
    c0049 --> c0060 : field entities
    c0049 --> c0067 : field relationships
    c0050 --> c0048 : field excludeBranches
    c0051 --> c0048 : field deferredBranches
    c0052 --|> c0202 : inherits
    c0053 --> c0044 : field action
    c0053 --> c0069 : field reuse
    c0054 --> c0031 : field linkReview
    c0054 --> c0044 : field action
    c0055 --> c0244 : field status
    c0056 --> c0054 : field candidates
    c0056 --> c0251 : field status
    c0057 --> c0055 : field conflicts
    c0057 --> c0056 : field jobs
    c0058 --|> c0203 : inherits
    c0060 --|> c0205 : inherits
    c0061 --> c0038 : field connections
    c0061 --> c0049 : field candidate
    c0061 --> c0114 : field memories
    c0062 --> c0095 : field codeArtifacts
    c0062 --> c0099 : field documents
    c0062 --> c0102 : field entities
    c0062 --> c0104 : field relationships
    c0063 --> c0072 : field uncertainWrite
    c0063 --> c0256 : field supersession
    c0064 --|> c0125 : inherits
    c0065 --|> c0244 : inherits
    c0067 --|> c0207 : inherits
    c0068 --> c0244 : field conflict
    c0070 ..> c0004 : activity() calls set()
    c0070 ..> c0009 : 2 relationships (see list)
    c0070 ..> c0028 : 9 relationships (see list)
    c0070 ..> c0029 : 13 relationships (see list)
    c0070 ..> c0030 : 3 relationships (see list)
    c0070 ..> c0031 : 5 relationships (see list)
    c0070 ..> c0036 : 4 relationships (see list)
    c0070 ..> c0041 : 6 relationships (see list)
    c0070 --> c0045 : field activityPhase
    c0070 ..> c0045 : type in activity
    c0070 ..> c0046 : 2 relationships (see list)
    c0070 ..> c0047 : type in prepareOverlapBatch
    c0070 ..> c0048 : 3 relationships (see list)
    c0070 ..> c0049 : 42 relationships (see list)
    c0070 ..> c0050 : 3 relationships (see list)
    c0070 ..> c0051 : 13 relationships (see list)
    c0070 ..> c0053 : 13 relationships (see list)
    c0070 ..> c0057 : type in diagnostics
    c0070 ..> c0059 : 2 relationships (see list)
    c0070 ..> c0061 : 3 relationships (see list)
    c0070 ..> c0062 : 2 relationships (see list)
    c0070 ..> c0064 : 13 relationships (see list)
    c0070 ..> c0065 : 2 relationships (see list)
    c0070 ..> c0066 : ensureModelCallAllowed() constructs CaptureProgress
    c0070 ..> c0068 : 6 relationships (see list)
    c0070 ..> c0070 : 219 relationships (see list)
    c0070 --> c0071 : field onActivity
    c0070 ..> c0071 : type in constructor
    c0070 ..> c0072 : 9 relationships (see list)
    c0070 ..> c0073 : 3 relationships (see list)
    c0070 ..> c0074 : 2 relationships (see list)
    c0070 ..> c0075 : 4 relationships (see list)
    c0070 ..> c0076 : resolveDestination() constructs MissingCaptureDestination
    c0070 ..> c0077 : 6 relationships (see list)
    c0070 ..> c0078 : 105 relationships (see list)
    c0070 --> c0093 : field getMode
    c0070 ..> c0093 : 3 relationships (see list)
    c0070 ..> c0094 : 7 relationships (see list)
    c0070 ..> c0102 : 4 relationships (see list)
    c0070 ..> c0104 : type in neighborhoodRelationships
    c0070 --> c0109 : field client
    c0070 ..> c0109 : type in cancellableClient
    c0070 --> c0111 : field passLimits
    c0070 ..> c0111 : 2 relationships (see list)
    c0070 ..> c0112 : type in cancellableKnowledge
    c0070 --> c0114 : field readSavedMemory
    c0070 ..> c0114 : 15 relationships (see list)
    c0070 ..> c0115 : type in createMemory
    c0070 --> c0117 : field model
    c0070 ..> c0119 : evidenceReadTool() constructs ModelEvidencePage
    c0070 ..> c0120 : sourceInspectionTool() constructs ModelReadErrorResult
    c0070 ..> c0121 : 2 relationships (see list)
    c0070 ..> c0132 : 4 relationships (see list)
    c0070 ..> c0133 : 5 relationships (see list)
    c0070 ..> c0170 : 35 relationships (see list)
    c0070 ..> c0173 : 32 relationships (see list)
    c0070 ..> c0177 : fieldLimits() calls fieldLimits()
    c0070 --> c0214 : field knowledgeWriter
    c0070 ..> c0214 : 2 relationships (see list)
    c0070 --> c0218 : field logger
    c0070 ..> c0220 : 15 relationships (see list)
    c0070 ..> c0221 : 12 relationships (see list)
    c0070 ..> c0222 : 4 relationships (see list)
    c0070 ..> c0226 : loadCandidates() calls prepareCapture()
    c0070 ..> c0236 : 23 relationships (see list)
    c0070 --> c0240 : field queue
    c0070 ..> c0240 : 70 relationships (see list)
    c0070 ..> c0244 : 13 relationships (see list)
    c0070 --> c0248 : field identity
    c0070 ..> c0249 : 57 relationships (see list)
    c0070 ..> c0256 : type in recordSupersession
    c0070 ..> c0269 : 3 relationships (see list)
    c0070 ..> c0278 : 8 relationships (see list)
    c0070 ..> c0282 : 2 relationships (see list)
    c0071 --> c0045 : field onActivity
    c0071 --> c0093 : field getMode
    c0071 --> c0109 : field client
    c0071 --> c0117 : field model
    c0071 --> c0218 : field logger
    c0071 --> c0240 : field queue
    c0072 --|> c0064 : inherits
    c0073 --> c0107 : field selectedAdditionalEntries
    c0074 --> c0049 : field candidate
    c0074 --> c0114 : field oldMemory
    c0074 --> c0249 : field fakeJob
    c0076 --|> c0028 : inherits
    c0076 ..> c0049 : type in constructor
    c0077 --> c0107 : field additionalEntries
    c0078 ..> c0042 : type in parseCandidates
    c0078 ..> c0043 : 3 relationships (see list)
    c0078 ..> c0049 : 7 relationships (see list)
    c0078 ..> c0053 : 6 relationships (see list)
    c0078 ..> c0061 : type in reusableMergeComposition
    c0078 ..> c0073 : type in conflictResolutionEvidence
    c0078 ..> c0075 : 11 relationships (see list)
    c0078 ..> c0078 : 36 relationships (see list)
    c0078 ..> c0094 : 8 relationships (see list)
    c0078 ..> c0107 : 3 relationships (see list)
    c0078 ..> c0114 : type in captureKnowledgePlan
    c0078 ..> c0116 : type in memoryInput
    c0078 ..> c0124 : type in captureCandidateSubmission
    c0078 ..> c0132 : 4 relationships (see list)
    c0078 ..> c0173 : 2 relationships (see list)
    c0078 ..> c0210 : type in captureKnowledgePlan
    c0078 ..> c0236 : 10 relationships (see list)
    c0078 ..> c0269 : 7 relationships (see list)
    c0078 ..> c0278 : snapshotForPersistence() calls sanitizeCaptureSnapshot()
    c0078 ..> c0282 : errorMessage() calls inspect()
    c0080 --> c0081 : field instance
    c0080 --> c0084 : field model
    c0080 --> c0088 : field prompts
    c0080 --> c0089 : field scopeSource
    c0080 --> c0090 : field verbosity
    c0080 --> c0093 : field captureMode
    c0080 --> c0129 : field scope
    c0080 --> c0219 : field logging
    c0091 ..> c0009 : 2 relationships (see list)
    c0091 ..> c0070 : resolveLogDirectory() calls resolve()
    c0091 ..> c0080 : type in loadForgetfulConfig
    c0091 ..> c0082 : 2 relationships (see list)
    c0091 ..> c0083 : type in loadForgetfulConfig
    c0091 ..> c0084 : 2 relationships (see list)
    c0091 ..> c0086 : 2 relationships (see list)
    c0091 ..> c0088 : 2 relationships (see list)
    c0091 ..> c0089 : type in resolveScope
    c0091 ..> c0090 : 2 relationships (see list)
    c0091 ..> c0091 : 33 relationships (see list)
    c0091 ..> c0093 : type in resolveCaptureMode
    c0091 ..> c0129 : 2 relationships (see list)
    c0091 ..> c0200 : 2 relationships (see list)
    c0091 ..> c0219 : type in isFileLogLevel
    c0091 ..> c0220 : writeJson() calls close()
    c0091 ..> c0269 : 4 relationships (see list)
    c0094 --> c0092 : field historySummary
    c0094 --> c0093 : field mode
    c0094 --> c0107 : field entries
    c0094 --> c0129 : field scope
    c0094 --> c0132 : field context
    c0095 --|> c0096 : inherits
    c0096 --|> c0128 : inherits
    c0099 --|> c0100 : inherits
    c0100 --|> c0128 : inherits
    c0102 --|> c0103 : inherits
    c0103 --> c0106 : field entity_type
    c0103 --|> c0128 : inherits
    c0104 --|> c0105 : inherits
    c0105 --|> c0128 : inherits
    c0109 ..> c0111 : type in fieldLimits
    c0109 --> c0112 : field knowledge
    c0109 ..> c0114 : 2 relationships (see list)
    c0109 ..> c0115 : type in create
    c0109 ..> c0116 : type in create
    c0109 ..> c0118 : type in queryMemory
    c0109 ..> c0126 : 3 relationships (see list)
    c0109 ..> c0127 : type in createProject
    c0109 ..> c0130 : 2 relationships (see list)
    c0112 ..> c0095 : 3 relationships (see list)
    c0112 ..> c0096 : 2 relationships (see list)
    c0112 ..> c0097 : type in listCodeArtifacts
    c0112 ..> c0099 : 3 relationships (see list)
    c0112 ..> c0100 : 2 relationships (see list)
    c0112 ..> c0101 : type in listDocuments
    c0112 ..> c0102 : 4 relationships (see list)
    c0112 ..> c0103 : 2 relationships (see list)
    c0112 ..> c0104 : 2 relationships (see list)
    c0112 ..> c0105 : type in createRelationship
    c0112 ..> c0108 : type in listFiles
    c0112 ..> c0114 : type in updateMemory
    c0112 ..> c0116 : type in updateMemory
    c0112 ..> c0131 : type in getFile
    c0113 --> c0114 : field memory
    c0114 --|> c0116 : inherits
    c0117 ..> c0122 : 2 relationships (see list)
    c0118 --> c0113 : field linked_memories
    c0118 --> c0114 : field primary_memories
    c0122 --> c0098 : field onConversationCompacted
    c0122 --> c0121 : field readTools
    c0122 --> c0124 : field submission
    c0131 --|> c0108 : inherits
    c0132 --> c0126 : field project
    c0133 ..> c0133 : rejectedHttpError() calls rejectedHttpStatus()
    c0138 --|> c0139 : inherits
    c0139 --> c0134 : field status
    c0141 --> c0137 : field criteria
    c0141 --|> c0142 : inherits
    c0142 --> c0144 : field priority
    c0142 --> c0145 : field state
    c0143 --|> c0142 : inherits
    c0146 ..> c0136 : type in taskCounts
    c0146 ..> c0139 : type in sortPlans
    c0146 ..> c0140 : type in mappedProject
    c0146 ..> c0143 : 2 relationships (see list)
    c0150 --> c0147 : field outcome
    c0150 --> c0151 : field state
    c0152 ..> c0050 : type in checkpoint
    c0152 ..> c0051 : type in checkpoint
    c0152 ..> c0094 : type in enqueue
    c0152 ..> c0107 : type in resolveConflict
    c0155 --> c0126 : field projects
    c0155 --|> c0132 : inherits
    c0156 --> c0080 : 2 relationships (see list)
    c0156 --> c0109 : 4 relationships (see list)
    c0156 --> c0152 : 2 relationships (see list)
    c0156 --> c0155 : field resolveWorkContext
    c0156 --> c0164 : 2 relationships (see list)
    c0156 --> c0232 : 2 relationships (see list)
    c0157 --> c0083 : field config
    c0157 --> c0156 : field dependencies
    c0157 --> c0159 : field policies
    c0160 --> c0080 : field config
    c0160 --> c0109 : field client
    c0160 --> c0155 : field context
    c0160 --> c0164 : field recall
    c0160 --> c0220 : field logger
    c0160 --> c0232 : field model
    c0161 --> c0129 : field scope
    c0163 --> c0165 : field runtime
    c0163 --> c0263 : 2 relationships (see list)
    c0164 ..> c0107 : type in recall
    c0164 ..> c0260 : type in deeper
    c0164 ..> c0262 : type in recall
    c0164 ..> c0263 : 2 relationships (see list)
    c0165 --> c0004 : field activity
    c0165 --> c0025 : field planning
    c0165 --> c0048 : field captureDeferrals
    c0165 --> c0051 : field recoveryResult
    c0165 --> c0080 : field config
    c0165 --> c0109 : field client
    c0165 --> c0151 : field pendingCaptureJobs
    c0165 --> c0152 : field capture
    c0165 --> c0155 : field context
    c0165 --> c0161 : field lastRecall
    c0165 --> c0164 : field recall
    c0165 --> c0220 : field logger
    c0165 --> c0232 : field model
    c0165 --> c0240 : field queue
    c0167 --> c0148 : field automaticRecalls
    c0167 --> c0158 : field pendingQueuedRecall
    c0167 --> c0163 : field recallJobs
    c0167 --> c0165 : 2 relationships (see list)
    c0168 ..> c0004 : 3 relationships (see list)
    c0168 ..> c0009 : createForgetfulExtension() calls setPromptActive()
    c0168 ..> c0051 : 2 relationships (see list)
    c0168 ..> c0070 : 5 relationships (see list)
    c0168 ..> c0080 : 5 relationships (see list)
    c0168 ..> c0084 : type in parseSelection
    c0168 ..> c0090 : type in log
    c0168 ..> c0107 : type in recallContextEntries
    c0168 ..> c0147 : 3 relationships (see list)
    c0168 ..> c0149 : type in boundedWait
    c0168 ..> c0150 : 3 relationships (see list)
    c0168 ..> c0152 : type in readCaptureOutcome
    c0168 ..> c0154 : type in collectDiagnosticParts
    c0168 ..> c0155 : 3 relationships (see list)
    c0168 ..> c0157 : type in createForgetfulExtension
    c0168 ..> c0159 : type in policyText
    c0168 ..> c0161 : type in recallActivitySummary
    c0168 ..> c0165 : 3 relationships (see list)
    c0168 ..> c0166 : type in promptSetupAuthentication
    c0168 ..> c0168 : 34 relationships (see list)
    c0168 ..> c0169 : createForgetfulExtension() calls registerForegroundTool()
    c0168 ..> c0173 : 4 relationships (see list)
    c0168 ..> c0235 : 3 relationships (see list)
    c0168 ..> c0236 : 13 relationships (see list)
    c0168 ..> c0263 : 5 relationships (see list)
    c0168 ..> c0269 : 8 relationships (see list)
    c0168 ..> c0270 : qualifiedRepository() calls repositoryName()
    c0170 ..> c0095 : 2 relationships (see list)
    c0170 ..> c0096 : 2 relationships (see list)
    c0170 ..> c0097 : type in listCodeArtifacts
    c0170 ..> c0099 : 2 relationships (see list)
    c0170 ..> c0100 : 2 relationships (see list)
    c0170 ..> c0101 : type in listDocuments
    c0170 ..> c0102 : 3 relationships (see list)
    c0170 ..> c0103 : 2 relationships (see list)
    c0170 ..> c0104 : type in getRelationships
    c0170 ..> c0105 : type in createRelationship
    c0170 ..> c0108 : type in listFiles
    c0170 ..|> c0112 : implements
    c0170 --> c0114 : field parseMemory
    c0170 ..> c0114 : type in constructor
    c0170 ..> c0116 : type in updateMemory
    c0170 ..> c0131 : type in getFile
    c0170 --> c0171 : field request
    c0170 ..> c0171 : type in constructor
    c0170 ..> c0172 : 45 relationships (see list)
    c0170 ..> c0177 : 21 relationships (see list)
    c0170 ..> c0178 : 4 relationships (see list)
    c0170 ..> c0180 : 2 relationships (see list)
    c0172 ..> c0095 : type in artifact
    c0172 ..> c0096 : type in resourceBody
    c0172 ..> c0097 : type in summary
    c0172 ..> c0099 : type in document
    c0172 ..> c0100 : type in resourceBody
    c0172 ..> c0101 : type in summary
    c0172 ..> c0102 : type in entity
    c0172 ..> c0103 : type in entityBody
    c0172 ..> c0104 : type in relationship
    c0172 ..> c0105 : type in relationshipBody
    c0172 ..> c0108 : type in fileSummary
    c0172 ..> c0128 : type in provenance
    c0172 ..> c0172 : 40 relationships (see list)
    c0172 ..> c0178 : 8 relationships (see list)
    c0172 ..> c0269 : text() calls trim()
    c0173 ..> c0004 : listProjects() calls set()
    c0173 ..|> c0109 : implements
    c0173 ..> c0114 : 2 relationships (see list)
    c0173 ..> c0115 : type in create
    c0173 ..> c0116 : type in create
    c0173 ..> c0118 : type in queryMemory
    c0173 ..> c0126 : 3 relationships (see list)
    c0173 ..> c0127 : type in createProject
    c0173 ..> c0130 : 2 relationships (see list)
    c0173 ..> c0172 : 3 relationships (see list)
    c0173 ..> c0173 : 2 relationships (see list)
    c0173 --|> c0177 : inherits
    c0173 ..> c0177 : 10 relationships (see list)
    c0173 ..> c0178 : 4 relationships (see list)
    c0173 ..> c0180 : 18 relationships (see list)
    c0173 ..> c0270 : 2 relationships (see list)
    c0177 ..> c0004 : readResponse() calls set()
    c0177 ..> c0005 : readResponse() calls read()
    c0177 ..> c0111 : type in fieldLimits
    c0177 ..> c0173 : readResponse() calls get()
    c0177 ..> c0174 : type in constructor
    c0177 ..> c0176 : throwResponseError() constructs ForgetfulHttpError
    c0177 ..> c0177 : 9 relationships (see list)
    c0177 ..> c0178 : readResponse() constructs ForgetfulSchemaError
    c0177 ..> c0179 : request() constructs ForgetfulTimeoutError
    c0177 ..> c0180 : 5 relationships (see list)
    c0177 ..> c0240 : readResponse() calls cancel()
    c0180 ..> c0004 : uniqueMemories() calls set()
    c0180 ..> c0111 : type in parseFieldLimits
    c0180 ..> c0113 : type in parseLinkedMemories
    c0180 ..> c0114 : 3 relationships (see list)
    c0180 ..> c0118 : 2 relationships (see list)
    c0180 ..> c0126 : type in parseProject
    c0180 ..> c0130 : type in searchBody
    c0180 ..> c0172 : parseMemory() calls memoryMetadata()
    c0180 ..> c0175 : 2 relationships (see list)
    c0180 ..> c0178 : 12 relationships (see list)
    c0180 ..> c0180 : 24 relationships (see list)
    c0180 ..> c0269 : projectText() calls trim()
    c0181 --> c0095 : field artifacts
    c0181 --> c0099 : field documents
    c0181 --> c0108 : field files
    c0182 --|> c0183 : inherits
    c0182 --> c0184 : field failures
    c0183 --> c0114 : field memories
    c0183 --> c0129 : field scope
    c0185 ..> c0004 : 3 relationships (see list)
    c0185 ..> c0095 : type in appendArtifactLines
    c0185 ..> c0099 : type in appendDocumentLines
    c0185 ..> c0102 : 9 relationships (see list)
    c0185 ..> c0104 : 3 relationships (see list)
    c0185 ..> c0108 : type in appendFileLines
    c0185 --> c0112 : field client
    c0185 ..> c0112 : type in constructor
    c0185 ..> c0170 : 8 relationships (see list)
    c0185 ..> c0173 : formatRelationships() calls get()
    c0185 ..> c0181 : 2 relationships (see list)
    c0185 ..> c0182 : 8 relationships (see list)
    c0185 ..> c0183 : 2 relationships (see list)
    c0185 ..> c0184 : 3 relationships (see list)
    c0185 ..> c0185 : 17 relationships (see list)
    c0185 ..> c0186 : type in constructor
    c0185 ..> c0187 : 4 relationships (see list)
    c0185 --> c0188 : field readMemory
    c0185 ..> c0188 : type in constructor
    c0185 ..> c0189 : 4 relationships (see list)
    c0185 ..> c0190 : 22 relationships (see list)
    c0185 ..> c0236 : expand() calls errorMessage()
    c0185 ..> c0269 : findEntities() calls trim()
    c0186 --> c0188 : field readMemory
    c0187 --> c0102 : field entity
    c0189 --> c0102 : 2 relationships (see list)
    c0189 --> c0104 : field relationship
    c0190 ..> c0102 : 2 relationships (see list)
    c0190 ..> c0104 : type in validRelationship
    c0190 ..> c0114 : type in validMemory
    c0190 ..> c0129 : 2 relationships (see list)
    c0190 ..> c0182 : type in safeCall
    c0190 ..> c0190 : 5 relationships (see list)
    c0190 ..> c0236 : 3 relationships (see list)
    c0190 ..> c0269 : validRelationship() calls trim()
    c0191 --> c0109 : field client
    c0191 --> c0112 : field knowledge
    c0191 --> c0192 : field request
    c0191 --> c0193 : field context
    c0193 --> c0129 : field scope
    c0194 --> c0131 : field file
    c0194 --> c0198 : field content
    c0194 --> c0199 : field content
    c0195 --> c0109 : field client
    c0195 --> c0112 : field knowledge
    c0195 --> c0193 : field context
    c0195 --> c0196 : field request
    c0200 ..> c0095 : type in page
    c0200 ..> c0099 : type in page
    c0200 ..> c0102 : 4 relationships (see list)
    c0200 ..> c0106 : type in isEntityType
    c0200 ..> c0109 : 7 relationships (see list)
    c0200 ..> c0112 : 9 relationships (see list)
    c0200 ..> c0114 : 4 relationships (see list)
    c0200 ..> c0128 : type in updateProvenance
    c0200 ..> c0131 : type in fileContent
    c0200 ..> c0170 : 28 relationships (see list)
    c0200 ..> c0173 : 10 relationships (see list)
    c0200 ..> c0191 : 15 relationships (see list)
    c0200 ..> c0192 : 2 relationships (see list)
    c0200 ..> c0193 : 13 relationships (see list)
    c0200 ..> c0194 : 29 relationships (see list)
    c0200 ..> c0195 : 9 relationships (see list)
    c0200 ..> c0196 : 2 relationships (see list)
    c0200 ..> c0197 : type in resolveWriteProject
    c0200 ..> c0198 : type in fileContent
    c0200 ..> c0199 : type in fileContent
    c0200 ..> c0200 : 176 relationships (see list)
    c0200 ..> c0222 : replacementMemory() calls replacementMemoryContext()
    c0200 ..> c0236 : containsSensitiveData() calls hasSensitiveData()
    c0200 ..> c0269 : 2 relationships (see list)
    c0202 --> c0096 : field input
    c0203 --> c0100 : field input
    c0205 --> c0103 : field input
    c0207 --> c0105 : field input
    c0210 --> c0202 : field codeArtifacts
    c0210 --> c0203 : field documents
    c0210 --> c0204 : field entityMemoryLinks
    c0210 --> c0205 : field entities
    c0210 --> c0207 : field relationships
    c0213 --> c0211 : 4 relationships (see list)
    c0214 ..> c0095 : type in writeCodeArtifact
    c0214 ..> c0099 : type in writeDocument
    c0214 ..> c0102 : type in writeEntity
    c0214 ..> c0104 : type in writeRelationship
    c0214 ..> c0114 : 3 relationships (see list)
    c0214 ..> c0133 : 2 relationships (see list)
    c0214 ..> c0170 : 10 relationships (see list)
    c0214 ..> c0173 : createOnce() calls create()
    c0214 ..> c0185 : attachmentMemory() calls readMemory()
    c0214 ..> c0201 : 4 relationships (see list)
    c0214 ..> c0202 : type in writeCodeArtifact
    c0214 ..> c0203 : type in writeDocument
    c0214 ..> c0204 : type in writeEntityMemoryLink
    c0214 ..> c0205 : type in writeEntity
    c0214 --> c0206 : field readMemory
    c0214 ..> c0206 : type in constructor
    c0214 ..> c0207 : type in writeRelationship
    c0214 ..> c0208 : type in execute
    c0214 ..> c0209 : 16 relationships (see list)
    c0214 ..> c0210 : 18 relationships (see list)
    c0214 ..> c0212 : 16 relationships (see list)
    c0214 ..> c0213 : 18 relationships (see list)
    c0214 ..> c0214 : 27 relationships (see list)
    c0214 ..> c0215 : 4 relationships (see list)
    c0214 --> c0216 : field client
    c0214 ..> c0216 : type in constructor
    c0214 ..> c0217 : 28 relationships (see list)
    c0214 ..> c0236 : 2 relationships (see list)
    c0214 ..> c0282 : 2 relationships (see list)
    c0217 ..> c0004 : resourceSlots() calls set()
    c0217 ..> c0173 : resourceSlots() calls get()
    c0217 ..> c0210 : type in instructionId
    c0217 ..> c0211 : 4 relationships (see list)
    c0217 ..> c0213 : 2 relationships (see list)
    c0217 ..> c0215 : type in resourceSlots
    c0217 ..> c0217 : 6 relationships (see list)
    c0220 ..> c0070 : 2 relationships (see list)
    c0220 ..|> c0218 : implements
    c0220 --> c0219 : 2 relationships (see list)
    c0220 ..> c0219 : 2 relationships (see list)
    c0220 ..> c0220 : 12 relationships (see list)
    c0220 ..> c0221 : 6 relationships (see list)
    c0220 ..> c0236 : enqueue() calls sanitizeValue()
    c0221 ..> c0013 : pruneDirectory() calls current()
    c0221 ..> c0221 : 2 relationships (see list)
    c0222 ..> c0116 : type in replacementMemoryInput
    c0222 ..> c0222 : replacementMemoryInput() calls replacementMemoryContext()
    c0222 ..> c0236 : storedMemoryContext() calls sanitizeText()
    c0225 --> c0227 : field complete
    c0226 ..> c0070 : applySummary() calls now()
    c0226 --> c0223 : field compactedHistory
    c0226 ..> c0223 : 5 relationships (see list)
    c0226 ..> c0226 : 6 relationships (see list)
    c0226 ..> c0227 : 3 relationships (see list)
    c0226 ..> c0228 : 9 relationships (see list)
    c0226 ..> c0269 : applySummary() calls trim()
    c0228 ..> c0070 : summarizeMemoryHistory() calls now()
    c0228 ..> c0119 : type in evidencePageContent
    c0228 ..> c0224 : 2 relationships (see list)
    c0228 ..> c0225 : type in summarizeMemoryHistory
    c0228 ..> c0228 : 19 relationships (see list)
    c0228 ..> c0232 : summarizeMemoryHistory() calls complete()
    c0228 ..> c0236 : 2 relationships (see list)
    c0230 --> c0231 : field modelRegistry
    c0232 ..> c0070 : 6 relationships (see list)
    c0232 ..> c0079 : completeWithSubmission() calls mapConcurrent()
    c0232 --> c0084 : field selection
    c0232 ..> c0084 : type in constructor
    c0232 ..> c0091 : completeRequest() calls isRecallConcurrency()
    c0232 ..|> c0117 : implements
    c0232 ..> c0121 : type in executeRead
    c0232 ..> c0122 : 7 relationships (see list)
    c0232 ..> c0123 : completeWithSubmission() constructs ModelSubmissionError
    c0232 ..> c0124 : type in validateSubmission
    c0232 ..> c0214 : executeRead() calls execute()
    c0232 --> c0218 : field logger
    c0232 ..> c0220 : 6 relationships (see list)
    c0232 ..> c0226 : 3 relationships (see list)
    c0232 ..> c0228 : 2 relationships (see list)
    c0232 --> c0229 : field transformHeaders
    c0232 --> c0231 : field registry
    c0232 ..> c0231 : type in constructor
    c0232 ..> c0232 : 7 relationships (see list)
    c0232 ..> c0233 : type in constructor
    c0232 ..> c0234 : 3 relationships (see list)
    c0232 ..> c0235 : 24 relationships (see list)
    c0232 ..> c0236 : 2 relationships (see list)
    c0233 --> c0218 : field logger
    c0233 --> c0229 : field transformHeaders
    c0235 ..> c0070 : 2 relationships (see list)
    c0235 ..> c0084 : 3 relationships (see list)
    c0235 ..> c0121 : type in submissionTool
    c0235 ..> c0122 : 4 relationships (see list)
    c0235 ..> c0124 : type in submissionTool
    c0235 ..> c0229 : type in requestOptions
    c0235 ..> c0230 : type in availableMemoryModels
    c0235 ..> c0231 : type in resolveMemoryModel
    c0235 ..> c0232 : 3 relationships (see list)
    c0235 ..> c0233 : type in resolveMemoryModel
    c0235 ..> c0234 : type in requestDeadline
    c0235 ..> c0235 : 7 relationships (see list)
    c0235 ..> c0236 : 8 relationships (see list)
    c0236 ..> c0236 : 4 relationships (see list)
    c0236 ..> c0282 : diagnosticMessage() calls inspect()
    c0239 ..> c0109 : 3 relationships (see list)
    c0239 ..> c0126 : 4 relationships (see list)
    c0239 ..> c0127 : 2 relationships (see list)
    c0239 ..> c0168 : promptExistingProject() calls notify()
    c0239 ..> c0173 : 7 relationships (see list)
    c0239 ..> c0236 : 2 relationships (see list)
    c0239 ..> c0237 : 2 relationships (see list)
    c0239 ..> c0238 : 6 relationships (see list)
    c0239 ..> c0239 : 5 relationships (see list)
    c0239 ..> c0269 : 3 relationships (see list)
    c0240 ..> c0004 : mutate() calls set()
    c0240 ..> c0009 : 9 relationships (see list)
    c0240 ..> c0094 : 4 relationships (see list)
    c0240 ..> c0098 : type in compactJobSnapshot
    c0240 ..> c0107 : type in appendInspections
    c0240 ..> c0126 : type in completeProjectDiscovery
    c0240 ..> c0132 : 2 relationships (see list)
    c0240 ..> c0173 : 2 relationships (see list)
    c0240 ..> c0200 : 4 relationships (see list)
    c0240 ..> c0236 : 2 relationships (see list)
    c0240 ..> c0240 : 97 relationships (see list)
    c0240 ..> c0241 : type in constructor
    c0240 ..> c0242 : 2 relationships (see list)
    c0240 ..> c0244 : 5 relationships (see list)
    c0240 ..> c0245 : 3 relationships (see list)
    c0240 ..> c0246 : 2 relationships (see list)
    c0240 ..> c0247 : 2 relationships (see list)
    c0240 ..> c0248 : 9 relationships (see list)
    c0240 ..> c0249 : 11 relationships (see list)
    c0240 ..> c0250 : type in listJobMetadata
    c0240 ..> c0252 : 9 relationships (see list)
    c0240 ..> c0253 : 5 relationships (see list)
    c0240 ..> c0254 : 3 relationships (see list)
    c0240 ..> c0255 : 6 relationships (see list)
    c0240 ..> c0257 : 2 relationships (see list)
    c0240 ..> c0258 : 70 relationships (see list)
    c0240 ..> c0269 : reusableHistory() calls trim()
    c0240 ..> c0278 : 5 relationships (see list)
    c0244 --> c0107 : field replacement
    c0244 --> c0116 : field replacement
    c0244 --> c0132 : field context
    c0244 --> c0248 : field binding
    c0244 --> c0256 : field supersession
    c0246 --> c0098 : field compactedConversation
    c0246 --> c0107 : field inspectionEntries
    c0246 --> c0251 : field status
    c0246 --> c0256 : field supersession
    c0249 --> c0094 : field snapshot
    c0249 --> c0248 : field binding
    c0249 --> c0251 : field status
    c0249 --> c0256 : field supersession
    c0250 --> c0094 : field snapshot
    c0252 --> c0244 : field conflicts
    c0252 --> c0253 : field watermarks
    c0252 --> c0255 : field jobs
    c0253 --> c0243 : field historyAlternatives
    c0255 --|> c0249 : inherits
    c0258 ..> c0094 : 3 relationships (see list)
    c0258 ..> c0107 : type in validateInspectionEntry
    c0258 ..> c0173 : releaseCompletedArtifacts() calls get()
    c0258 ..> c0236 : scrubDiagnostic() calls sanitizeText()
    c0258 ..> c0240 : nowIso() calls now()
    c0258 ..> c0243 : 2 relationships (see list)
    c0258 ..> c0244 : type in conflictIdentityMatches
    c0258 ..> c0248 : 2 relationships (see list)
    c0258 ..> c0249 : 2 relationships (see list)
    c0258 ..> c0252 : type in normaliseState
    c0258 ..> c0253 : 3 relationships (see list)
    c0258 ..> c0255 : type in releaseCompletedArtifacts
    c0258 ..> c0258 : 6 relationships (see list)
    c0260 --> c0126 : field projects
    c0260 --> c0129 : field scope
    c0260 --> c0132 : field context
    c0262 --> c0107 : field sessionContext
    c0262 --> c0122 : field diagnosticContext
    c0262 --> c0126 : field projects
    c0262 --> c0129 : field scope
    c0262 --> c0132 : field context
    c0262 --> c0261 : field onPlan
    c0263 --> c0129 : field scope
    c0264 ..> c0013 : resultWithKnowledge() calls visible()
    c0264 ..> c0079 : searchMemories() calls mapConcurrent()
    c0264 ..> c0091 : 3 relationships (see list)
    c0264 --> c0109 : field client
    c0264 ..> c0109 : type in constructor
    c0264 ..> c0114 : 2 relationships (see list)
    c0264 --> c0117 : field model
    c0264 ..> c0117 : type in constructor
    c0264 ..> c0121 : type in recallReadTool
    c0264 ..> c0126 : 2 relationships (see list)
    c0264 ..> c0129 : 7 relationships (see list)
    c0264 ..> c0130 : type in searchRequest
    c0264 ..> c0132 : 3 relationships (see list)
    c0264 ..> c0173 : 3 relationships (see list)
    c0264 ..> c0184 : 2 relationships (see list)
    c0264 --> c0185 : field knowledge
    c0264 ..> c0185 : 2 relationships (see list)
    c0264 ..> c0200 : recallReadTool() calls executeKnowledgeRead()
    c0264 ..> c0232 : recall() calls complete()
    c0264 ..> c0236 : 9 relationships (see list)
    c0264 ..> c0259 : 4 relationships (see list)
    c0264 ..> c0260 : type in deeper
    c0264 ..> c0261 : 5 relationships (see list)
    c0264 ..> c0262 : 7 relationships (see list)
    c0264 ..> c0263 : 7 relationships (see list)
    c0264 ..> c0264 : 34 relationships (see list)
    c0264 ..> c0265 : type in constructor
    c0264 ..> c0266 : finishReview() constructs ReviewValidationError
    c0264 ..> c0267 : 6 relationships (see list)
    c0264 ..> c0268 : type in searchMemories
    c0264 ..> c0269 : 35 relationships (see list)
    c0267 --> c0126 : field project
    c0268 --> c0114 : field memories
    c0269 ..> c0004 : availableProjects() calls set()
    c0269 ..> c0114 : 2 relationships (see list)
    c0269 ..> c0124 : type in recallReviewSubmission
    c0269 ..> c0126 : type in availableProjects
    c0269 ..> c0132 : 3 relationships (see list)
    c0269 ..> c0184 : type in formatRecall
    c0269 ..> c0236 : 11 relationships (see list)
    c0269 ..> c0259 : 2 relationships (see list)
    c0269 ..> c0261 : type in parsePlan
    c0269 ..> c0263 : 4 relationships (see list)
    c0269 ..> c0264 : createDeadlineSignal() calls now()
    c0269 ..> c0269 : 26 relationships (see list)
    c0270 ..> c0269 : repositoryName() calls trim()
    c0272 ..> c0271 : 2 relationships (see list)
    c0273 --|> c0094 : inherits
    c0275 --> c0093 : field mode
    c0275 --> c0129 : field scope
    c0275 --> c0132 : field context
    c0275 --> c0277 : field session
    c0276 --> c0273 : field snapshot
    c0278 ..> c0092 : 2 relationships (see list)
    c0278 ..> c0094 : 4 relationships (see list)
    c0278 ..> c0098 : type in compactCaptureSnapshot
    c0278 ..> c0107 : 3 relationships (see list)
    c0278 ..> c0236 : 9 relationships (see list)
    c0278 ..> c0269 : 2 relationships (see list)
    c0278 ..> c0274 : 3 relationships (see list)
    c0278 ..> c0275 : 3 relationships (see list)
    c0278 ..> c0276 : type in buildCaptureSnapshot
    c0278 ..> c0278 : 27 relationships (see list)
    c0281 --> c0279 : 2 relationships (see list)
    c0282 ..> c0004 : readFile() calls close()
    c0282 ..> c0009 : readFile() calls open()
    c0282 ..> c0070 : 3 relationships (see list)
    c0282 ..> c0173 : getUrl() calls get()
    c0282 ..> c0200 : readFile() calls readFile()
    c0282 ..> c0214 : git() calls execute()
    c0282 ..> c0236 : 3 relationships (see list)
    c0282 ..> c0269 : provenance() calls trim()
    c0282 ..> c0280 : type in inspectUrl
    c0282 ..> c0281 : 2 relationships (see list)
    c0282 ..> c0282 : 10 relationships (see list)
    c0282 --> c0283 : field options
    c0282 ..> c0283 : type in constructor
    c0282 ..> c0284 : 11 relationships (see list)
    c0284 ..> c0236 : 4 relationships (see list)
    c0284 ..> c0279 : type in errorDetails
    c0284 ..> c0280 : type in sourceContent
    c0284 ..> c0282 : validateAddress() calls check()
    c0284 ..> c0284 : validateAddress() calls loopback()
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
- c0030: `src/capture-limits.ts` — `src/capture-limits.ts`:1
- c0031: `CaptureLinkReview` — `src/capture-links.ts`:44
- c0032: `ConnectionResult` — `src/capture-links.ts`:62
- c0033: `LinkDecision` — `src/capture-links.ts`:16
- c0034: `PreservationDecision` — `src/capture-links.ts`:26
- c0035: `PreviousConnections` — `src/capture-links.ts`:34
- c0036: `src/capture-links.ts` — `src/capture-links.ts`:1
- c0037: `MergeAccess` — `src/capture-merge.ts`:43
- c0038: `MergeConnections` — `src/capture-merge.ts`:7
- c0039: `MergeExecution` — `src/capture-merge.ts`:49
- c0040: `MergeWriteUncertain` — `src/capture-merge.ts`:18
- c0041: `src/capture-merge.ts` — `src/capture-merge.ts`:1
- c0042: `CandidateExtraction` — `src/capture.ts`:740
- c0043: `CandidateValidation` — `src/capture.ts`:666
- c0044: `CaptureAction` — `src/capture.ts`:79
- c0045: `CaptureActivityPhase` — `src/capture.ts`:177
- c0046: `CaptureAdvanceInput` — `src/capture.ts`:323
- c0047: `CaptureBatchInput` — `src/capture.ts`:138
- c0048: `CaptureBranch` — `src/capture.ts`:204
- c0049: `CaptureCandidate` — `src/capture.ts`:81
- c0050: `CaptureCheckpointOptions` — `src/capture.ts`:209
- c0051: `CaptureCheckpointResult` — `src/capture.ts`:215
- c0052: `CaptureCodeArtifactResource` — `src/capture.ts`:115
- c0053: `CaptureDecision` — `src/capture.ts`:145
- c0054: `CaptureDiagnosticCandidate` — `src/capture.ts`:228
- c0055: `CaptureDiagnosticConflict` — `src/capture.ts`:256
- c0056: `CaptureDiagnosticJob` — `src/capture.ts`:244
- c0057: `CaptureDiagnostics` — `src/capture.ts`:267
- c0058: `CaptureDocumentResource` — `src/capture.ts`:111
- c0059: `CaptureEnqueueResult` — `src/capture.ts`:272
- c0060: `CaptureEntityResource` — `src/capture.ts`:107
- c0061: `CaptureMergePlan` — `src/capture.ts`:162
- c0062: `CaptureNeighborhood` — `src/capture.ts`:130
- c0063: `CaptureOperation` — `src/capture.ts`:365
- c0064: `CapturePause` — `src/capture.ts`:331
- c0065: `CapturePendingConflict` — `src/capture.ts`:318
- c0066: `CaptureProgress` — `src/capture.ts`:355
- c0067: `CaptureRelationshipResource` — `src/capture.ts`:119
- c0068: `CaptureResolveResult` — `src/capture.ts`:312
- c0069: `CaptureResourceReuse` — `src/capture.ts`:123
- c0070: `CaptureService` — `src/capture.ts`:1139
- c0071: `CaptureServiceOptions` — `src/capture.ts`:179
- c0072: `CaptureUncertainWrite` — `src/capture.ts`:353
- c0073: `ConflictResolutionEvidence` — `src/capture.ts`:278
- c0074: `ConflictResolutionTarget` — `src/capture.ts`:295
- c0075: `InvalidCaptureOutput` — `src/capture.ts`:338
- c0076: `MissingCaptureDestination` — `src/capture.ts`:345
- c0077: `ResolveConflictInput` — `src/capture.ts`:301
- c0078: `src/capture.ts` — `src/capture.ts`:1
- c0079: `src/concurrency.ts` — `src/concurrency.ts`:1
- c0080: `ForgetfulConfig` — `src/config.ts`:92
- c0081: `ForgetfulInstanceConfig` — `src/config.ts`:79
- c0082: `JsonReadResult` — `src/config.ts`:149
- c0083: `LoadConfigOptions` — `src/config.ts`:115
- c0084: `ModelSelection` — `src/config.ts`:74
- c0085: `PersistedProjectSettings` — `src/config.ts`:145
- c0086: `PersistedUserSettings` — `src/config.ts`:126
- c0087: `PromptName` — `src/config.ts`:40
- c0088: `PromptOverlays` — `src/config.ts`:86
- c0089: `ScopeSource` — `src/config.ts`:39
- c0090: `Verbosity` — `src/config.ts`:59
- c0091: `src/config.ts` — `src/config.ts`:1
- c0092: `CaptureHistorySummary` — `src/contracts.ts`:340
- c0093: `CaptureMode` — `src/contracts.ts`:2
- c0094: `CaptureSnapshot` — `src/contracts.ts`:351
- c0095: `CodeArtifact` — `src/contracts.ts`:93
- c0096: `CodeArtifactInput` — `src/contracts.ts`:84
- c0097: `CodeArtifactSummary` — `src/contracts.ts`:98
- c0098: `CompactedConversation` — `src/contracts.ts`:345
- c0099: `Document` — `src/contracts.ts`:77
- c0100: `DocumentInput` — `src/contracts.ts`:68
- c0101: `DocumentSummary` — `src/contracts.ts`:82
- c0102: `Entity` — `src/contracts.ts`:53
- c0103: `EntityInput` — `src/contracts.ts`:43
- c0104: `EntityRelationship` — `src/contracts.ts`:64
- c0105: `EntityRelationshipInput` — `src/contracts.ts`:58
- c0106: `EntityType` — `src/contracts.ts`:41
- c0107: `EvidenceEntry` — `src/contracts.ts`:330
- c0108: `FileSummary` — `src/contracts.ts`:100
- c0109: `ForgetfulClient` — `src/contracts.ts`:212
- c0110: `ForgetfulFieldBound` — `src/contracts.ts`:203
- c0111: `ForgetfulFieldLimits` — `src/contracts.ts`:210
- c0112: `KnowledgeClient` — `src/contracts.ts`:115
- c0113: `LinkedMemory` — `src/contracts.ts`:157
- c0114: `Memory` — `src/contracts.ts`:145
- c0115: `MemoryCreateResult` — `src/contracts.ts`:183
- c0116: `MemoryInput` — `src/contracts.ts`:17
- c0117: `MemoryModelClient` — `src/contracts.ts`:314
- c0118: `MemorySearchResult` — `src/contracts.ts`:163
- c0119: `ModelEvidencePage` — `src/contracts.ts`:270
- c0120: `ModelReadErrorResult` — `src/contracts.ts`:280
- c0121: `ModelReadTool` — `src/contracts.ts`:284
- c0122: `ModelRequest` — `src/contracts.ts`:240
- c0123: `ModelSubmissionError` — `src/contracts.ts`:303
- c0124: `ModelSubmissionTool` — `src/contracts.ts`:294
- c0125: `ModelTaskPause` — `src/contracts.ts`:292
- c0126: `Project` — `src/contracts.ts`:4
- c0127: `ProjectInput` — `src/contracts.ts`:11
- c0128: `Provenance` — `src/contracts.ts`:34
- c0129: `Scope` — `src/contracts.ts`:1
- c0130: `SearchRequest` — `src/contracts.ts`:172
- c0131: `StoredFile` — `src/contracts.ts`:110
- c0132: `WorkContext` — `src/contracts.ts`:320
- c0133: `src/contracts.ts` — `src/contracts.ts`:1
- c0134: `PlanStatus` — `src/domain/planning.ts`:2
- c0135: `PlanningCapability` — `src/domain/planning.ts`:1
- c0136: `PlanningCounts` — `src/domain/planning.ts`:55
- c0137: `PlanningCriterion` — `src/domain/planning.ts`:41
- c0138: `PlanningPlan` — `src/domain/planning.ts`:20
- c0139: `PlanningPlanSummary` — `src/domain/planning.ts`:12
- c0140: `PlanningProject` — `src/domain/planning.ts`:6
- c0141: `PlanningTask` — `src/domain/planning.ts`:49
- c0142: `PlanningTaskRecord` — `src/domain/planning.ts`:25
- c0143: `PlanningTaskSummary` — `src/domain/planning.ts`:35
- c0144: `TaskPriority` — `src/domain/planning.ts`:4
- c0145: `TaskState` — `src/domain/planning.ts`:3
- c0146: `src/domain/planning.ts` — `src/domain/planning.ts`:1
- c0147: `AutomaticCaptureJobOutcome` — `src/extension.ts`:1048
- c0148: `AutomaticRecall` — `src/extension.ts`:431
- c0149: `BoundedWaitOutcome` — `src/extension.ts`:141
- c0150: `CaptureFeedbackItem` — `src/extension.ts`:1158
- c0151: `CaptureFeedbackState` — `src/extension.ts`:1027
- c0152: `CaptureServicePort` — `src/extension.ts`:286
- c0153: `DiagnosticCandidate` — `src/extension.ts`:884
- c0154: `DiagnosticParts` — `src/extension.ts`:897
- c0155: `ExtensionWorkContext` — `src/extension.ts`:320
- c0156: `ForgetfulExtensionDependencies` — `src/extension.ts`:324
- c0157: `ForgetfulExtensionOptions` — `src/extension.ts`:349
- c0158: `PendingQueuedRecall` — `src/extension.ts`:389
- c0159: `PolicyName` — `src/extension.ts`:277
- c0160: `PreparedRuntime` — `src/extension.ts`:444
- c0161: `RecallActivity` — `src/extension.ts`:391
- c0162: `RecallContextMessage` — `src/extension.ts`:364
- c0163: `RecallJob` — `src/extension.ts`:371
- c0164: `RecallServicePort` — `src/extension.ts`:279
- c0165: `Runtime` — `src/extension.ts`:397
- c0166: `SetupAuthentication` — `src/extension.ts`:227
- c0167: `State` — `src/extension.ts`:433
- c0168: `src/extension.ts` — `src/extension.ts`:1
- c0169: `src/foreground-tools.ts` — `src/foreground-tools.ts`:1
- c0170: `ApiKnowledgeClient` — `src/http-knowledge.ts`:199
- c0171: `KnowledgeRequest` — `src/http-knowledge.ts`:9
- c0172: `src/http-knowledge.ts` — `src/http-knowledge.ts`:1
- c0173: `ApiForgetfulClient` — `src/http.ts`:639
- c0174: `ApiForgetfulClientOptions` — `src/http.ts`:26
- c0175: `ForgetfulAbortError` — `src/http.ts`:88
- c0176: `ForgetfulHttpError` — `src/http.ts`:62
- c0177: `ForgetfulHttpTransport` — `src/http.ts`:423
- c0178: `ForgetfulSchemaError` — `src/http.ts`:74
- c0179: `ForgetfulTimeoutError` — `src/http.ts`:81
- c0180: `src/http.ts` — `src/http.ts`:1
- c0181: `Attachments` — `src/knowledge-read.ts`:51
- c0182: `ExpansionContext` — `src/knowledge-read.ts`:39
- c0183: `KnowledgeExpansionRequest` — `src/knowledge-read.ts`:19
- c0184: `KnowledgeExpansionResult` — `src/knowledge-read.ts`:27
- c0185: `KnowledgeReadService` — `src/knowledge-read.ts`:155
- c0186: `KnowledgeReadServiceOptions` — `src/knowledge-read.ts`:63
- c0187: `LinkedMemoryExpansion` — `src/knowledge-read.ts`:49
- c0188: `MemoryReader` — `src/knowledge-read.ts`:58
- c0189: `RelationshipExpansion` — `src/knowledge-read.ts`:43
- c0190: `src/knowledge-read.ts` — `src/knowledge-read.ts`:1
- c0191: `KnowledgeReadContext` — `src/knowledge-tools.ts`:630
- c0192: `KnowledgeReadRequest` — `src/knowledge-tools.ts`:169
- c0193: `KnowledgeToolContext` — `src/knowledge-tools.ts`:23
- c0194: `KnowledgeToolResult` — `src/knowledge-tools.ts`:33
- c0195: `KnowledgeWriteContext` — `src/knowledge-tools.ts`:1272
- c0196: `KnowledgeWriteRequest` — `src/knowledge-tools.ts`:170
- c0197: `ResolvedWriteProject` — `src/knowledge-tools.ts`:445
- c0198: `ToolImage` — `src/knowledge-tools.ts`:32
- c0199: `ToolText` — `src/knowledge-tools.ts`:31
- c0200: `src/knowledge-tools.ts` — `src/knowledge-tools.ts`:1
- c0201: `KnowledgeAttachmentIds` — `src/knowledge-write.ts`:129
- c0202: `KnowledgeCodeArtifactPlan` — `src/knowledge-write.ts`:45
- c0203: `KnowledgeDocumentPlan` — `src/knowledge-write.ts`:39
- c0204: `KnowledgeEntityMemoryLinkPlan` — `src/knowledge-write.ts`:59
- c0205: `KnowledgeEntityPlan` — `src/knowledge-write.ts`:33
- c0206: `KnowledgeMemoryReader` — `src/knowledge-write.ts`:109
- c0207: `KnowledgeRelationshipPlan` — `src/knowledge-write.ts`:51
- c0208: `KnowledgeWriteCheckpoint` — `src/knowledge-write.ts`:103
- c0209: `KnowledgeWriteGuard` — `src/knowledge-write.ts`:107
- c0210: `KnowledgeWritePlan` — `src/knowledge-write.ts`:63
- c0211: `KnowledgeWriteReceipt` — `src/knowledge-write.ts`:80
- c0212: `KnowledgeWriteSave` — `src/knowledge-write.ts`:114
- c0213: `KnowledgeWriteState` — `src/knowledge-write.ts`:87
- c0214: `KnowledgeWriter` — `src/knowledge-write.ts`:260
- c0215: `ResourceSlot` — `src/knowledge-write.ts`:116
- c0216: `WriteClient` — `src/knowledge-write.ts`:19
- c0217: `src/knowledge-write.ts` — `src/knowledge-write.ts`:1
- c0218: `DiagnosticLogger` — `src/logging.ts`:95
- c0219: `FileLogLevel` — `src/logging.ts`:93
- c0220: `FileLogger` — `src/logging.ts`:110
- c0221: `src/logging.ts` — `src/logging.ts`:1
- c0222: `src/memory-context.ts` — `src/memory-context.ts`:1
- c0223: `CompactedMemoryHistory` — `src/model-context.ts`:245
- c0224: `ContextWindowError` — `src/model-context.ts`:30
- c0225: `MemoryHistorySummaryOptions` — `src/model-context.ts`:378
- c0226: `MemoryTaskContext` — `src/model-context.ts`:252
- c0227: `SummaryCompletion` — `src/model-context.ts`:25
- c0228: `src/model-context.ts` — `src/model-context.ts`:1
- c0229: `MemoryModelHeaderTransform` — `src/model.ts`:46
- c0230: `ModelPickerContext` — `src/model.ts`:50
- c0231: `ModelRegistryPort` — `src/model.ts`:37
- c0232: `PiMemoryModel` — `src/model.ts`:320
- c0233: `PiMemoryModelOptions` — `src/model.ts`:60
- c0234: `RequestDeadline` — `src/model.ts`:241
- c0235: `src/model.ts` — `src/model.ts`:1
- c0236: `src/privacy.ts` — `src/privacy.ts`:1
- c0237: `AgentProjectInitInput` — `src/project-init.ts`:8
- c0238: `ProjectInitError` — `src/project-init.ts`:6
- c0239: `src/project-init.ts` — `src/project-init.ts`:1
- c0240: `DurableQueueStore` — `src/queue.ts`:511
- c0241: `DurableQueueStoreOptions` — `src/queue.ts`:193
- c0242: `FileLock` — `src/queue.ts`:225
- c0243: `HistoryCache` — `src/queue.ts`:42
- c0244: `PendingConflict` — `src/queue.ts`:103
- c0245: `QueueBusyError` — `src/queue.ts`:230
- c0246: `QueueCheckpoint` — `src/queue.ts`:179
- c0247: `QueueEnqueueResult` — `src/queue.ts`:163
- c0248: `QueueIdentity` — `src/queue.ts`:36
- c0249: `QueueJob` — `src/queue.ts`:69
- c0250: `QueueJobMetadata` — `src/queue.ts`:99
- c0251: `QueueJobStatus` — `src/queue.ts`:29
- c0252: `QueueState` — `src/queue.ts`:218
- c0253: `QueueWatermark` — `src/queue.ts`:48
- c0254: `SnapshotPayload` — `src/queue.ts`:212
- c0255: `StoredQueueJob` — `src/queue.ts`:207
- c0256: `SupersessionReceipt` — `src/queue.ts`:92
- c0257: `WatermarkAdvance` — `src/queue.ts`:170
- c0258: `src/queue.ts` — `src/queue.ts`:1
- c0259: `DeadlineSignal` — `src/recall.ts`:206
- c0260: `DeeperRecallRequest` — `src/recall.ts`:153
- c0261: `RecallPlan` — `src/recall.ts`:188
- c0262: `RecallRequest` — `src/recall.ts`:136
- c0263: `RecallResult` — `src/recall.ts`:162
- c0264: `RecallService` — `src/recall.ts`:673
- c0265: `RecallServiceOptions` — `src/recall.ts`:198
- c0266: `ReviewValidationError` — `src/recall.ts`:611
- c0267: `ScopeResolution` — `src/recall.ts`:215
- c0268: `SearchOutcome` — `src/recall.ts`:221
- c0269: `src/recall.ts` — `src/recall.ts`:1
- c0270: `src/repository.ts` — `src/repository.ts`:1
- c0271: `SetupHelp` — `src/setup.ts`:3
- c0272: `src/setup.ts` — `src/setup.ts`:1
- c0273: `CaptureSnapshotWithStatus` — `src/snapshot.ts`:39
- c0274: `MessageRecord` — `src/snapshot.ts`:47
- c0275: `SnapshotOptions` — `src/snapshot.ts`:20
- c0276: `SnapshotResult` — `src/snapshot.ts`:43
- c0277: `SnapshotSessionReader` — `src/snapshot.ts`:14
- c0278: `src/snapshot.ts` — `src/snapshot.ts`:1
- c0279: `SourceInspectionError` — `src/source-inspection.ts`:37
- c0280: `SourceInspectionRequest` — `src/source-inspection.ts`:33
- c0281: `SourceInspectionResult` — `src/source-inspection.ts`:43
- c0282: `SourceInspector` — `src/source-inspection.ts`:149
- c0283: `SourceInspectorOptions` — `src/source-inspection.ts`:15
- c0284: `src/source-inspection.ts` — `src/source-inspection.ts`:1

## Relationships

- c0000 ..> c0168: `defaultExtension() calls createForgetfulExtension()`
- c0003 ..> c0004: `setLabel() calls refresh()`
- c0003 ..> c0070: `dispose() calls stop()`
- c0004 --> c0003: `field loader`
- c0004 ..> c0003: `close() calls dispose()`
- c0004 ..> c0003: `refresh() calls dispose()`
- c0004 ..> c0003: `refresh() calls setLabel()`
- c0004 ..> c0003: `refresh() constructs ActivityLoader`
- c0004 ..> c0004: `constructor() calls refresh()`
- c0004 ..> c0004: `notice() calls refresh()`
- c0004 ..> c0004: `set() calls refresh()`
- c0004 ..> c0070: `refresh() calls now()`
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
- c0005 ..> c0135: `type in capabilities`
- c0005 ..> c0138: `type in plan`
- c0005 ..> c0139: `type in plans`
- c0005 ..> c0140: `type in projects`
- c0005 ..> c0141: `type in task`
- c0005 ..> c0143: `type in tasks`
- c0005 --> c0174: `field options`
- c0005 ..> c0174: `type in constructor`
- c0005 --> c0177: `field transport`
- c0005 ..> c0177: `capabilities() calls getDeployment()`
- c0005 ..> c0177: `constructor() constructs ForgetfulHttpTransport`
- c0005 ..> c0177: `plan() calls getJson()`
- c0005 ..> c0177: `plans() calls getJson()`
- c0005 ..> c0177: `projects() calls getJson()`
- c0005 ..> c0177: `task() calls getJson()`
- c0005 ..> c0177: `tasks() calls getJson()`
- c0005 ..> c0190: `clean() calls clean()`
- c0005 ..> c0236: `read() calls errorMessage()`
- c0005 ..> c0236: `sanitize() calls sanitizeText()`
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
- c0006 ..> c0142: `type in taskRecord`
- c0006 ..> c0178: `invalid() constructs ForgetfulSchemaError`
- c0007 ..|> c0020: `implements`
- c0007 ..> c0091: `constructor() calls userSettingsPath()`
- c0007 ..> c0091: `read() calls readPlanningPanel()`
- c0007 ..> c0091: `write() calls updateUserSettings()`
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
- c0009 ..> c0168: `command() calls notify()`
- c0009 ..> c0168: `open() calls notify()`
- c0009 ..> c0168: `run() calls notify()`
- c0009 ..> c0269: `command() calls trim()`
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
- c0011 ..> c0139: `type in panelPlan`
- c0011 ..> c0143: `type in taskLabel`
- c0011 ..> c0236: `text() calls sanitizeText()`
- c0012 --> c0018: `field detailError`
- c0012 --> c0023: `field planTasks`
- c0012 --> c0138: `field planDetail`
- c0012 --> c0139: `field plans`
- c0012 --> c0141: `field taskDetail`
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
- c0013 ..> c0070: `readPlanTasks() calls now()`
- c0013 ..> c0070: `readPlans() calls now()`
- c0013 ..> c0139: `type in readPlanTasks`
- c0013 ..> c0143: `type in readDetails`
- c0013 ..> c0146: `readPlanTasks() calls activeTasks()`
- c0013 ..> c0146: `readPlanTasks() calls taskCounts()`
- c0013 ..> c0146: `readPlans() calls sortPlans()`
- c0013 ..> c0146: `readProject() calls mappedProject()`
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
- c0019 --> c0136: `field counts`
- c0019 --> c0143: `field activeTasks`
- c0019 --> c0143: `field tasks`
- c0021 ..> c0022: `type in capabilities`
- c0021 ..> c0022: `type in plan`
- c0021 ..> c0022: `type in plans`
- c0021 ..> c0022: `type in projects`
- c0021 ..> c0022: `type in task`
- c0021 ..> c0022: `type in tasks`
- c0021 ..> c0135: `type in capabilities`
- c0021 ..> c0138: `type in plan`
- c0021 ..> c0139: `type in plans`
- c0021 ..> c0140: `type in projects`
- c0021 ..> c0141: `type in task`
- c0021 ..> c0143: `type in tasks`
- c0022 --> c0018: `field error`
- c0023 --> c0018: `field detailError`
- c0023 --> c0018: `field error`
- c0023 --> c0019: `field planTasks`
- c0023 --> c0135: `field capability`
- c0023 --> c0138: `field planDetail`
- c0023 --> c0139: `field plans`
- c0023 --> c0140: `field projects`
- c0023 --> c0141: `field taskDetail`
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
- c0026 ..> c0070: `createPlanningRuntime() calls now()`
- c0026 ..> c0080: `type in createPlanningRuntime`
- c0029 ..> c0027: `type in initialCorrectionCycle`
- c0029 ..> c0121: `type in captureFailureReport`
- c0029 ..> c0133: `correctableCaptureError() calls rejectedHttpError()`
- c0029 ..> c0236: `captureFailureReport() calls sanitizeValue()`
- c0030 ..> c0111: `type in fieldLimitGuidance`
- c0031 --> c0032: `field executionResults`
- c0031 --> c0032: `field previousResults`
- c0031 --> c0033: `field decisions`
- c0031 --> c0034: `field preservation`
- c0031 --> c0035: `field previous`
- c0031 --> c0095: `field resources`
- c0031 --> c0099: `field resources`
- c0031 --> c0114: `field memories`
- c0031 --> c0114: `field memory`
- c0035 --> c0095: `field codeArtifacts`
- c0035 --> c0099: `field documents`
- c0035 --> c0102: `field entities`
- c0035 --> c0114: `field memory`
- c0036 ..> c0004: `validateLinkDecisions() calls set()`
- c0036 ..> c0004: `validateLinkReviews() calls set()`
- c0036 ..> c0028: `authorizedMemory() constructs CaptureSelectionError`
- c0036 ..> c0031: `type in applyLinkReview`
- c0036 ..> c0031: `type in executeConnection`
- c0036 ..> c0031: `type in finishLinkExecution`
- c0036 ..> c0031: `type in prepareLinkReview`
- c0036 ..> c0031: `type in preserveConnections`
- c0036 ..> c0031: `type in readSelectedMemory`
- c0036 ..> c0031: `type in validateLinkDecisions`
- c0036 ..> c0031: `type in validateLinkReviews`
- c0036 ..> c0032: `type in executeConnection`
- c0036 ..> c0033: `type in validateLinkDecisions`
- c0036 ..> c0033: `type in validateLinkReviews`
- c0036 ..> c0033: `type in wantsEdge`
- c0036 ..> c0034: `type in validateLinkReviews`
- c0036 ..> c0035: `type in preparePreviousConnections`
- c0036 ..> c0036: `applyLinkReview() calls authorizedMemory()`
- c0036 ..> c0036: `applyLinkReview() calls executeConnection()`
- c0036 ..> c0036: `applyLinkReview() calls finishLinkExecution()`
- c0036 ..> c0036: `executeConnection() calls operationError()`
- c0036 ..> c0036: `prepareLinkReview() calls exclusiveMemory()`
- c0036 ..> c0036: `prepareLinkReview() calls readAttachmentRecords()`
- c0036 ..> c0036: `prepareLinkReview() calls readSelectedMemory()`
- c0036 ..> c0036: `preserveConnections() calls executeConnection()`
- c0036 ..> c0036: `validateLinkDecisions() calls wantsEdge()`
- c0036 ..> c0036: `validateLinkReviews() calls validateLinkDecisions()`
- c0036 ..> c0095: `type in readAttachmentRecords`
- c0036 ..> c0099: `type in readAttachmentRecords`
- c0036 ..> c0109: `type in applyLinkReview`
- c0036 ..> c0109: `type in authorizedMemory`
- c0036 ..> c0109: `type in prepareLinkReview`
- c0036 ..> c0109: `type in preparePreviousConnections`
- c0036 ..> c0109: `type in preserveConnections`
- c0036 ..> c0109: `type in readAttachmentRecords`
- c0036 ..> c0109: `type in readSelectedMemory`
- c0036 ..> c0114: `type in authorizedMemory`
- c0036 ..> c0114: `type in exclusiveMemory`
- c0036 ..> c0114: `type in prepareLinkReview`
- c0036 ..> c0114: `type in preparePreviousConnections`
- c0036 ..> c0114: `type in readAttachmentRecords`
- c0036 ..> c0114: `type in readSelectedMemory`
- c0036 ..> c0129: `type in applyLinkReview`
- c0036 ..> c0129: `type in authorizedMemory`
- c0036 ..> c0129: `type in prepareLinkReview`
- c0036 ..> c0133: `executeConnection() calls rejectedHttpStatus()`
- c0036 ..> c0170: `applyLinkReview() calls linkMemories()`
- c0036 ..> c0170: `preparePreviousConnections() calls getCodeArtifact()`
- c0036 ..> c0170: `preparePreviousConnections() calls getDocument()`
- c0036 ..> c0170: `preparePreviousConnections() calls getEntity()`
- c0036 ..> c0170: `preserveConnections() calls linkEntityMemory()`
- c0036 ..> c0170: `preserveConnections() calls updateMemory()`
- c0036 ..> c0170: `readAttachmentRecords() calls getCodeArtifact()`
- c0036 ..> c0170: `readAttachmentRecords() calls getDocument()`
- c0036 ..> c0173: `authorizedMemory() calls get()`
- c0036 ..> c0173: `prepareLinkReview() calls get()`
- c0036 ..> c0173: `preparePreviousConnections() calls get()`
- c0036 ..> c0173: `preparePreviousConnections() calls getMemoryEntityIds()`
- c0036 ..> c0173: `readSelectedMemory() calls get()`
- c0036 ..> c0173: `validateLinkDecisions() calls get()`
- c0036 ..> c0214: `executeConnection() calls execute()`
- c0036 ..> c0236: `operationError() calls errorMessage()`
- c0036 ..> c0236: `prepareLinkReview() calls hasSensitiveData()`
- c0036 ..> c0236: `preparePreviousConnections() calls hasSensitiveData()`
- c0036 ..> c0236: `readAttachmentRecords() calls hasSensitiveData()`
- c0036 ..> c0236: `validateLinkDecisions() calls hasSensitiveData()`
- c0036 ..> c0269: `validateLinkDecisions() calls trim()`
- c0037 --> c0129: `field scope`
- c0039 --|> c0037: `inherits`
- c0041 ..> c0028: `checkMergeEntity() constructs CaptureSelectionError`
- c0041 ..> c0028: `preflightMergeConnections() constructs CaptureSelectionError`
- c0041 ..> c0028: `requireResourceScope() constructs CaptureSelectionError`
- c0041 ..> c0037: `type in checkMergeAttachments`
- c0041 ..> c0037: `type in checkMergeEntity`
- c0041 ..> c0037: `type in preflightMergeConnections`
- c0041 ..> c0037: `type in requireResourceScope`
- c0041 ..> c0038: `type in checkMergeAttachments`
- c0041 ..> c0038: `type in collectMergeConnections`
- c0041 ..> c0038: `type in preflightMergeConnections`
- c0041 ..> c0038: `type in preserveMergeConnections`
- c0041 ..> c0039: `type in preserveMergeConnections`
- c0041 ..> c0041: `checkMergeAttachments() calls requireResourceScope()`
- c0041 ..> c0041: `collectMergeConnections() calls union()`
- c0041 ..> c0041: `preflightMergeConnections() calls checkMergeAttachments()`
- c0041 ..> c0041: `preflightMergeConnections() calls checkMergeEntity()`
- c0041 ..> c0041: `preserveMergeConnections() calls checkMergeAttachments()`
- c0041 ..> c0041: `preserveMergeConnections() calls checkMergeEntity()`
- c0041 ..> c0041: `preserveMergeConnections() calls preflightMergeConnections()`
- c0041 ..> c0041: `preserveMergeConnections() calls union()`
- c0041 ..> c0109: `type in checkMergeAttachments`
- c0041 ..> c0109: `type in checkMergeEntity`
- c0041 ..> c0109: `type in collectMergeConnections`
- c0041 ..> c0109: `type in preflightMergeConnections`
- c0041 ..> c0109: `type in preserveMergeConnections`
- c0041 ..> c0114: `type in collectMergeConnections`
- c0041 ..> c0170: `checkMergeAttachments() calls getCodeArtifact()`
- c0041 ..> c0170: `checkMergeAttachments() calls getDocument()`
- c0041 ..> c0170: `checkMergeAttachments() calls getFile()`
- c0041 ..> c0170: `checkMergeEntity() calls getEntity()`
- c0041 ..> c0170: `preserveMergeConnections() calls linkEntityMemory()`
- c0041 ..> c0170: `preserveMergeConnections() calls linkMemories()`
- c0041 ..> c0170: `preserveMergeConnections() calls updateMemory()`
- c0041 ..> c0173: `collectMergeConnections() calls getMemoryEntityIds()`
- c0041 ..> c0173: `preflightMergeConnections() calls get()`
- c0041 ..> c0214: `preserveMergeConnections() calls execute()`
- c0042 --> c0049: `field candidates`
- c0047 --> c0049: `field candidate`
- c0047 --> c0062: `field neighborhood`
- c0047 --> c0114: `field overlaps`
- c0049 --> c0052: `field codeArtifacts`
- c0049 --> c0058: `field documents`
- c0049 --> c0060: `field entities`
- c0049 --> c0067: `field relationships`
- c0050 --> c0048: `field excludeBranches`
- c0051 --> c0048: `field deferredBranches`
- c0052 --|> c0202: `inherits`
- c0053 --> c0044: `field action`
- c0053 --> c0069: `field reuse`
- c0054 --> c0031: `field linkReview`
- c0054 --> c0044: `field action`
- c0055 --> c0244: `field status`
- c0056 --> c0054: `field candidates`
- c0056 --> c0251: `field status`
- c0057 --> c0055: `field conflicts`
- c0057 --> c0056: `field jobs`
- c0058 --|> c0203: `inherits`
- c0060 --|> c0205: `inherits`
- c0061 --> c0038: `field connections`
- c0061 --> c0049: `field candidate`
- c0061 --> c0114: `field memories`
- c0062 --> c0095: `field codeArtifacts`
- c0062 --> c0099: `field documents`
- c0062 --> c0102: `field entities`
- c0062 --> c0104: `field relationships`
- c0063 --> c0072: `field uncertainWrite`
- c0063 --> c0256: `field supersession`
- c0064 --|> c0125: `inherits`
- c0065 --|> c0244: `inherits`
- c0067 --|> c0207: `inherits`
- c0068 --> c0244: `field conflict`
- c0070 ..> c0004: `activity() calls set()`
- c0070 ..> c0009: `resolveConflict() calls run()`
- c0070 ..> c0009: `runBranchWorker() calls run()`
- c0070 ..> c0028: `composeMerge() constructs CaptureSelectionError`
- c0070 ..> c0028: `equivalentMemory() constructs CaptureSelectionError`
- c0070 ..> c0028: `finishMerge() constructs CaptureSelectionError`
- c0070 ..> c0028: `processCandidates() constructs CaptureSelectionError`
- c0070 ..> c0028: `readMaintenanceTargets() constructs CaptureSelectionError`
- c0070 ..> c0028: `retireCandidate() constructs CaptureSelectionError`
- c0070 ..> c0028: `supersedeCandidate() constructs CaptureSelectionError`
- c0070 ..> c0028: `supersessionAlreadyApplied() constructs CaptureSelectionError`
- c0070 ..> c0028: `verifyRequestedMerge() constructs CaptureSelectionError`
- c0070 ..> c0029: `executeLinkReview() calls initialCorrectionCycle()`
- c0070 ..> c0029: `migrateLegacyLinkReview() calls initialCorrectionCycle()`
- c0070 ..> c0029: `planLinkReviews() calls captureFailureReport()`
- c0070 ..> c0029: `planLinkReviews() calls initialCorrectionCycle()`
- c0070 ..> c0029: `processOrderedCandidates() calls initialCorrectionCycle()`
- c0070 ..> c0029: `recordCandidateFailure() calls correctableCaptureError()`
- c0070 ..> c0029: `recordCandidateFailure() calls initialCorrectionCycle()`
- c0070 ..> c0029: `recordLinkReviewFailure() calls correctableCaptureError()`
- c0070 ..> c0029: `refreshLinkReview() calls correctableCaptureError()`
- c0070 ..> c0029: `reviewExecutionFailure() calls captureFailureReport()`
- c0070 ..> c0029: `reviewExecutionFailure() calls initialCorrectionCycle()`
- c0070 ..> c0029: `saveCorrectableFailure() calls correctableCaptureError()`
- c0070 ..> c0029: `saveCorrectableFailure() calls initialCorrectionCycle()`
- c0070 ..> c0030: `composeMerge() calls fieldLimitGuidance()`
- c0070 ..> c0030: `policyFor() calls fieldLimitGuidance()`
- c0070 ..> c0030: `reviewExecutionFailure() calls fieldLimitGuidance()`
- c0070 ..> c0031: `type in planLinkReviews`
- c0070 ..> c0031: `type in prepareLinkReviews`
- c0070 ..> c0031: `type in previousSupersessionCompleted`
- c0070 ..> c0031: `type in recordLinkReviewFailure`
- c0070 ..> c0031: `type in refreshLinkReview`
- c0070 ..> c0036: `executeLinkReview() calls applyLinkReview()`
- c0070 ..> c0036: `executeLinkReview() calls preserveConnections()`
- c0070 ..> c0036: `refreshLinkReview() calls prepareLinkReview()`
- c0070 ..> c0036: `refreshLinkReview() calls preparePreviousConnections()`
- c0070 ..> c0041: `composeMerge() calls collectMergeConnections()`
- c0070 ..> c0041: `composeMerge() calls preflightMergeConnections()`
- c0070 ..> c0041: `finishMerge() calls collectMergeConnections()`
- c0070 ..> c0041: `finishMerge() calls preserveMergeConnections()`
- c0070 ..> c0041: `mergeCandidate() calls collectMergeConnections()`
- c0070 ..> c0041: `mergeCandidate() calls preflightMergeConnections()`
- c0070 --> c0045: `field activityPhase`
- c0070 ..> c0045: `type in activity`
- c0070 ..> c0046: `type in advance`
- c0070 ..> c0046: `type in advanceWatermark`
- c0070 ..> c0047: `type in prepareOverlapBatch`
- c0070 ..> c0048: `type in checkpointBranch`
- c0070 ..> c0048: `type in checkpointBranches`
- c0070 ..> c0048: `type in runBranchWorker`
- c0070 ..> c0049: `type in addConflict`
- c0070 ..> c0049: `type in applyDecision`
- c0070 ..> c0049: `type in composeMerge`
- c0070 ..> c0049: `type in correctCandidateFailures`
- c0070 ..> c0049: `type in correctedCaptureOutcome`
- c0070 ..> c0049: `type in createMemory`
- c0070 ..> c0049: `type in decideOverlap`
- c0070 ..> c0049: `type in decideOverlapBatch`
- c0070 ..> c0049: `type in destinationProjects`
- c0070 ..> c0049: `type in executeLinkReview`
- c0070 ..> c0049: `type in executeLinkReviews`
- c0070 ..> c0049: `type in existingNeighborhood`
- c0070 ..> c0049: `type in finishMerge`
- c0070 ..> c0049: `type in finishReviewedSupersession`
- c0070 ..> c0049: `type in finishSupersession`
- c0070 ..> c0049: `type in loadCandidates`
- c0070 ..> c0049: `type in loadOverlaps`
- c0070 ..> c0049: `type in mergeCandidate`
- c0070 ..> c0049: `type in neighborhoodEntities`
- c0070 ..> c0049: `type in planConflictReplacement`
- c0070 ..> c0049: `type in planLinkReviews`
- c0070 ..> c0049: `type in prepareDestination`
- c0070 ..> c0049: `type in prepareLinkReviews`
- c0070 ..> c0049: `type in prepareOverlapBatch`
- c0070 ..> c0049: `type in processCandidate`
- c0070 ..> c0049: `type in processCandidates`
- c0070 ..> c0049: `type in processKnowledgeCheckpoint`
- c0070 ..> c0049: `type in processOrderedCandidates`
- c0070 ..> c0049: `type in processReplacementCheckpoint`
- c0070 ..> c0049: `type in recordCandidateFailure`
- c0070 ..> c0049: `type in recordEscalation`
- c0070 ..> c0049: `type in recordLinkReviewFailure`
- c0070 ..> c0049: `type in refreshLinkReview`
- c0070 ..> c0049: `type in resolveDestination`
- c0070 ..> c0049: `type in retireCandidate`
- c0070 ..> c0049: `type in reviewExecutionFailure`
- c0070 ..> c0049: `type in reviewLinks`
- c0070 ..> c0049: `type in saveCorrectableFailure`
- c0070 ..> c0049: `type in skipCandidate`
- c0070 ..> c0049: `type in supersedeCandidate`
- c0070 ..> c0049: `type in validateDecision`
- c0070 ..> c0049: `type in writeKnowledge`
- c0070 ..> c0050: `type in checkpoint`
- c0070 ..> c0050: `type in checkpointBranches`
- c0070 ..> c0050: `type in processPending`
- c0070 ..> c0051: `type in appendCheckpointResult`
- c0070 ..> c0051: `type in checkpoint`
- c0070 ..> c0051: `type in checkpointBranch`
- c0070 ..> c0051: `type in correctCandidateFailures`
- c0070 ..> c0051: `type in pauseCandidate`
- c0070 ..> c0051: `type in processBranchJob`
- c0070 ..> c0051: `type in processCandidates`
- c0070 ..> c0051: `type in processJob`
- c0070 ..> c0051: `type in processOrderedCandidates`
- c0070 ..> c0051: `type in processPending`
- c0070 ..> c0051: `type in recordBranchFailure`
- c0070 ..> c0051: `type in recordCandidateFailure`
- c0070 ..> c0051: `type in runBranchWorker`
- c0070 ..> c0053: `type in addConflict`
- c0070 ..> c0053: `type in applyDecision`
- c0070 ..> c0053: `type in composeMerge`
- c0070 ..> c0053: `type in correctedCaptureOutcome`
- c0070 ..> c0053: `type in decideOverlap`
- c0070 ..> c0053: `type in finishMerge`
- c0070 ..> c0053: `type in finishSupersession`
- c0070 ..> c0053: `type in mergeCandidate`
- c0070 ..> c0053: `type in recordEscalation`
- c0070 ..> c0053: `type in retireCandidate`
- c0070 ..> c0053: `type in skipCandidate`
- c0070 ..> c0053: `type in supersedeCandidate`
- c0070 ..> c0053: `type in validateDecision`
- c0070 ..> c0057: `type in diagnostics`
- c0070 ..> c0059: `type in enqueue`
- c0070 ..> c0059: `type in enqueueSnapshot`
- c0070 ..> c0061: `type in composeMerge`
- c0070 ..> c0061: `type in correctedCaptureOutcome`
- c0070 ..> c0061: `type in finishMerge`
- c0070 ..> c0062: `type in existingNeighborhood`
- c0070 ..> c0062: `type in validateDecision`
- c0070 ..> c0064: `assertWriteAllowedNow() constructs CapturePause`
- c0070 ..> c0064: `decideOverlap() constructs CapturePause`
- c0070 ..> c0064: `ensureModelCallAllowed() constructs CapturePause`
- c0070 ..> c0064: `ensureWriteAllowed() constructs CapturePause`
- c0070 ..> c0064: `evidenceReadTool() constructs CapturePause`
- c0070 ..> c0064: `loadOverlaps() constructs CapturePause`
- c0070 ..> c0064: `neighborhoodEntity() constructs CapturePause`
- c0070 ..> c0064: `neighborhoodMatches() constructs CapturePause`
- c0070 ..> c0064: `neighborhoodRelationships() constructs CapturePause`
- c0070 ..> c0064: `processCandidate() constructs CapturePause`
- c0070 ..> c0064: `processJob() constructs CapturePause`
- c0070 ..> c0064: `stop() constructs CapturePause`
- c0070 ..> c0064: `type in pauseCandidate`
- c0070 ..> c0065: `type in pendingConflicts`
- c0070 ..> c0065: `type in verifyConflictOrigin`
- c0070 ..> c0066: `ensureModelCallAllowed() constructs CaptureProgress`
- c0070 ..> c0068: `type in applyConflictResolution`
- c0070 ..> c0068: `type in markConflictResolved`
- c0070 ..> c0068: `type in rejectConflict`
- c0070 ..> c0068: `type in resolve`
- c0070 ..> c0068: `type in resolveConflict`
- c0070 ..> c0068: `type in resolveConflictOwned`
- c0070 ..> c0070: `activity() calls publishActivity()`
- c0070 ..> c0070: `advanceWatermark() calls advance()`
- c0070 ..> c0070: `applyConflictResolution() calls applySupersession()`
- c0070 ..> c0070: `applyConflictResolution() calls createResolutionReplacement()`
- c0070 ..> c0070: `applyConflictResolution() calls ensureWriteAllowed()`
- c0070 ..> c0070: `applyConflictResolution() calls executeResolutionLinks()`
- c0070 ..> c0070: `applyConflictResolution() calls failConflictResolution()`
- c0070 ..> c0070: `applyConflictResolution() calls markConflictResolved()`
- c0070 ..> c0070: `applyConflictResolution() calls planConflictReplacement()`
- c0070 ..> c0070: `applyConflictResolution() calls updateResolutionReplacement()`
- c0070 ..> c0070: `applyDecision() calls checkpointOutcome()`
- c0070 ..> c0070: `applyDecision() calls createMemory()`
- c0070 ..> c0070: `applyDecision() calls ensureModelCallAllowed()`
- c0070 ..> c0070: `applyDecision() calls equivalentMemory()`
- c0070 ..> c0070: `applyDecision() calls mergeCandidate()`
- c0070 ..> c0070: `applyDecision() calls recordEscalation()`
- c0070 ..> c0070: `applyDecision() calls retireCandidate()`
- c0070 ..> c0070: `applyDecision() calls skipCandidate()`
- c0070 ..> c0070: `applyDecision() calls supersedeCandidate()`
- c0070 ..> c0070: `applyDecision() calls writeKnowledge()`
- c0070 ..> c0070: `applySupersession() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `applySupersession() calls recordSupersession()`
- c0070 ..> c0070: `applySupersession() calls supersessionAlreadyApplied()`
- c0070 ..> c0070: `assertWriteAllowedNow() calls canWriteNow()`
- c0070 ..> c0070: `cancellableClient() calls read()`
- c0070 ..> c0070: `cancellableKnowledge() calls read()`
- c0070 ..> c0070: `checkpoint() calls appendCheckpointResult()`
- c0070 ..> c0070: `checkpoint() calls checkpointBranch()`
- c0070 ..> c0070: `checkpoint() calls checkpointBranches()`
- c0070 ..> c0070: `checkpoint() calls enabled()`
- c0070 ..> c0070: `checkpointBranch() calls runBranchWorker()`
- c0070 ..> c0070: `composeMerge() calls checkpointOutcome()`
- c0070 ..> c0070: `composeMerge() calls ensureModelCallAllowed()`
- c0070 ..> c0070: `composeMerge() calls ensureWriteAllowed()`
- c0070 ..> c0070: `composeMerge() calls fieldLimits()`
- c0070 ..> c0070: `composeMerge() calls readMaintenanceTargets()`
- c0070 ..> c0070: `constructor() calls activity()`
- c0070 ..> c0070: `constructor() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `constructor() calls cancellableClient()`
- c0070 ..> c0070: `constructor() calls read()`
- c0070 ..> c0070: `correctCandidateFailures() calls recordCandidateFailure()`
- c0070 ..> c0070: `correctCandidateFailures() calls reviewExecutionFailure()`
- c0070 ..> c0070: `createMemory() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `createMemory() calls checkpointOutcome()`
- c0070 ..> c0070: `createMemory() calls ensureWriteAllowed()`
- c0070 ..> c0070: `createResolutionReplacement() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `createResolutionReplacement() calls ensureWriteAllowed()`
- c0070 ..> c0070: `decideOverlap() calls checkpointOutcome()`
- c0070 ..> c0070: `decideOverlap() calls enabled()`
- c0070 ..> c0070: `decideOverlap() calls ensureModelCallAllowed()`
- c0070 ..> c0070: `decideOverlap() calls existingNeighborhood()`
- c0070 ..> c0070: `decideOverlap() calls policyFor()`
- c0070 ..> c0070: `decideOverlap() calls validateDecision()`
- c0070 ..> c0070: `decideOverlapBatch() calls ensureModelCallAllowed()`
- c0070 ..> c0070: `decideOverlapBatch() calls policyFor()`
- c0070 ..> c0070: `decideOverlapBatch() calls prepareOverlapBatch()`
- c0070 ..> c0070: `destinationProjects() calls resolveDestination()`
- c0070 ..> c0070: `enabled() calls getMode()`
- c0070 ..> c0070: `enabled() calls isEnabled()`
- c0070 ..> c0070: `enqueueSnapshot() calls getMode()`
- c0070 ..> c0070: `enqueueSnapshot() calls isEnabled()`
- c0070 ..> c0070: `ensureModelCallAllowed() calls enabled()`
- c0070 ..> c0070: `ensureWriteAllowed() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `ensureWriteAllowed() calls enabled()`
- c0070 ..> c0070: `ensureWriteAllowed() calls getMode()`
- c0070 ..> c0070: `equivalentMemory() calls ensureWriteAllowed()`
- c0070 ..> c0070: `evidenceReadTool() calls canReadNow()`
- c0070 ..> c0070: `evidenceReadTool() calls enabled()`
- c0070 ..> c0070: `executeLinkReview() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `executeLinkReview() calls checkpointOutcome()`
- c0070 ..> c0070: `executeLinkReview() calls ensureWriteAllowed()`
- c0070 ..> c0070: `executeLinkReview() calls finishReviewedSupersession()`
- c0070 ..> c0070: `executeLinkReview() calls previousSupersessionCompleted()`
- c0070 ..> c0070: `executeLinkReview() calls recordLinkReviewFailure()`
- c0070 ..> c0070: `executeLinkReviews() calls executeLinkReview()`
- c0070 ..> c0070: `executeResolutionLinks() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `executeResolutionLinks() calls ensureWriteAllowed()`
- c0070 ..> c0070: `executeResolutionLinks() calls linkResolutionEntity()`
- c0070 ..> c0070: `existingNeighborhood() calls neighborhoodEntities()`
- c0070 ..> c0070: `existingNeighborhood() calls neighborhoodRelationships()`
- c0070 ..> c0070: `fieldLimits() calls read()`
- c0070 ..> c0070: `finishMerge() calls applySupersession()`
- c0070 ..> c0070: `finishMerge() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `finishMerge() calls checkpointOutcome()`
- c0070 ..> c0070: `finishMerge() calls ensureWriteAllowed()`
- c0070 ..> c0070: `finishMerge() calls readMaintenanceTargets()`
- c0070 ..> c0070: `finishMerge() calls verifyRequestedMerge()`
- c0070 ..> c0070: `finishReviewedSupersession() calls finishSupersession()`
- c0070 ..> c0070: `finishSupersession() calls applySupersession()`
- c0070 ..> c0070: `finishSupersession() calls checkpointOutcome()`
- c0070 ..> c0070: `linkResolutionEntity() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `linkResolutionEntity() calls ensureWriteAllowed()`
- c0070 ..> c0070: `loadCandidates() calls ensureModelCallAllowed()`
- c0070 ..> c0070: `loadCandidates() calls evidenceReadTool()`
- c0070 ..> c0070: `loadCandidates() calls fieldLimits()`
- c0070 ..> c0070: `loadCandidates() calls policyFor()`
- c0070 ..> c0070: `loadCandidates() calls sourceInspectionTool()`
- c0070 ..> c0070: `loadOverlaps() calls checkpointOutcome()`
- c0070 ..> c0070: `loadOverlaps() calls enabled()`
- c0070 ..> c0070: `mergeCandidate() calls checkpointOutcome()`
- c0070 ..> c0070: `mergeCandidate() calls composeMerge()`
- c0070 ..> c0070: `mergeCandidate() calls createMemory()`
- c0070 ..> c0070: `mergeCandidate() calls ensureWriteAllowed()`
- c0070 ..> c0070: `mergeCandidate() calls finishMerge()`
- c0070 ..> c0070: `mergeCandidate() calls readMaintenanceTargets()`
- c0070 ..> c0070: `mergeCandidate() calls writeKnowledge()`
- c0070 ..> c0070: `migrateLegacyLinkReview() calls checkpointOutcome()`
- c0070 ..> c0070: `migrateLegacyLinkReview() calls connectionUncertainty()`
- c0070 ..> c0070: `mutate() calls activity()`
- c0070 ..> c0070: `mutate() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `neighborhoodEntities() calls neighborhoodEntity()`
- c0070 ..> c0070: `neighborhoodEntities() calls neighborhoodMatches()`
- c0070 ..> c0070: `neighborhoodEntity() calls enabled()`
- c0070 ..> c0070: `neighborhoodMatches() calls enabled()`
- c0070 ..> c0070: `neighborhoodRelationships() calls enabled()`
- c0070 ..> c0070: `ownedConflict() calls verifyConflictOrigin()`
- c0070 ..> c0070: `pendingConflicts() calls verifyConflictOrigin()`
- c0070 ..> c0070: `planConflictReplacement() calls ensureWriteAllowed()`
- c0070 ..> c0070: `planConflictReplacement() calls readSavedMemory()`
- c0070 ..> c0070: `planConflictReplacement() calls revisionResources()`
- c0070 ..> c0070: `planLinkReviews() calls ensureModelCallAllowed()`
- c0070 ..> c0070: `planLinkReviews() calls ensureWriteAllowed()`
- c0070 ..> c0070: `preflightRetirement() calls confirmedRetirement()`
- c0070 ..> c0070: `preflightRetirement() calls readMaintenanceTargets()`
- c0070 ..> c0070: `prepareDestination() calls checkpointOutcome()`
- c0070 ..> c0070: `prepareDestination() calls destinationProjects()`
- c0070 ..> c0070: `prepareLinkReviews() calls checkpointOutcome()`
- c0070 ..> c0070: `prepareLinkReviews() calls ensureWriteAllowed()`
- c0070 ..> c0070: `prepareLinkReviews() calls migrateLegacyLinkReview()`
- c0070 ..> c0070: `prepareLinkReviews() calls refreshLinkReview()`
- c0070 ..> c0070: `prepareOverlapBatch() calls existingNeighborhood()`
- c0070 ..> c0070: `prepareOverlapBatch() calls loadOverlaps()`
- c0070 ..> c0070: `prepareOverlapBatch() calls prepareDestination()`
- c0070 ..> c0070: `previousSupersessionCompleted() calls ensureWriteAllowed()`
- c0070 ..> c0070: `processBranchJob() calls processJob()`
- c0070 ..> c0070: `processBranchJob() calls recordBranchFailure()`
- c0070 ..> c0070: `processCandidate() calls applyDecision()`
- c0070 ..> c0070: `processCandidate() calls checkpointOutcome()`
- c0070 ..> c0070: `processCandidate() calls decideOverlap()`
- c0070 ..> c0070: `processCandidate() calls enabled()`
- c0070 ..> c0070: `processCandidate() calls getMode()`
- c0070 ..> c0070: `processCandidate() calls loadOverlaps()`
- c0070 ..> c0070: `processCandidate() calls mergeCandidate()`
- c0070 ..> c0070: `processCandidate() calls prepareDestination()`
- c0070 ..> c0070: `processCandidate() calls processKnowledgeCheckpoint()`
- c0070 ..> c0070: `processCandidate() calls processReplacementCheckpoint()`
- c0070 ..> c0070: `processCandidate() calls retireCandidate()`
- c0070 ..> c0070: `processCandidates() calls correctCandidateFailures()`
- c0070 ..> c0070: `processCandidates() calls processOrderedCandidates()`
- c0070 ..> c0070: `processCandidates() calls recordCandidateFailure()`
- c0070 ..> c0070: `processCandidates() calls saveCorrectableFailure()`
- c0070 ..> c0070: `processJob() calls decideOverlapBatch()`
- c0070 ..> c0070: `processJob() calls enabled()`
- c0070 ..> c0070: `processJob() calls getMode()`
- c0070 ..> c0070: `processJob() calls loadCandidates()`
- c0070 ..> c0070: `processJob() calls processCandidates()`
- c0070 ..> c0070: `processJob() calls reviewLinks()`
- c0070 ..> c0070: `processKnowledgeCheckpoint() calls finishSupersession()`
- c0070 ..> c0070: `processKnowledgeCheckpoint() calls writeKnowledge()`
- c0070 ..> c0070: `processOrderedCandidates() calls checkpointOutcome()`
- c0070 ..> c0070: `processOrderedCandidates() calls processCandidate()`
- c0070 ..> c0070: `processOrderedCandidates() calls processCandidates()`
- c0070 ..> c0070: `processOrderedCandidates() calls recordCandidateFailure()`
- c0070 ..> c0070: `processOrderedCandidates() calls saveCorrectableFailure()`
- c0070 ..> c0070: `processReplacementCheckpoint() calls finishSupersession()`
- c0070 ..> c0070: `processReplacementCheckpoint() calls writeKnowledge()`
- c0070 ..> c0070: `publishActivity() calls onActivity()`
- c0070 ..> c0070: `read() calls activity()`
- c0070 ..> c0070: `read() calls readSignal()`
- c0070 ..> c0070: `readMaintenanceTargets() calls ensureWriteAllowed()`
- c0070 ..> c0070: `recordCandidateFailure() calls candidateUncertainty()`
- c0070 ..> c0070: `recordCandidateFailure() calls checkpointOutcome()`
- c0070 ..> c0070: `recordCandidateFailure() calls isModelFailure()`
- c0070 ..> c0070: `recordCandidateFailure() calls pauseCandidate()`
- c0070 ..> c0070: `recordEscalation() calls checkpointOutcome()`
- c0070 ..> c0070: `recordLinkReviewFailure() calls checkpointOutcome()`
- c0070 ..> c0070: `recordLinkReviewFailure() calls connectionUncertainty()`
- c0070 ..> c0070: `refreshLinkReview() calls ensureWriteAllowed()`
- c0070 ..> c0070: `resolve() calls resolveConflict()`
- c0070 ..> c0070: `resolveConflict() calls resolveConflictOwned()`
- c0070 ..> c0070: `resolveConflictOwned() calls applyConflictResolution()`
- c0070 ..> c0070: `resolveConflictOwned() calls enabled()`
- c0070 ..> c0070: `resolveConflictOwned() calls ownedConflict()`
- c0070 ..> c0070: `resolveConflictOwned() calls rejectConflict()`
- c0070 ..> c0070: `resolveConflictOwned() calls resolutionTarget()`
- c0070 ..> c0070: `resolveConflictOwned() calls validateResolutionEvidence()`
- c0070 ..> c0070: `retireCandidate() calls applySupersession()`
- c0070 ..> c0070: `retireCandidate() calls checkpointOutcome()`
- c0070 ..> c0070: `retireCandidate() calls confirmedRetirement()`
- c0070 ..> c0070: `retireCandidate() calls ensureWriteAllowed()`
- c0070 ..> c0070: `retireCandidate() calls preflightRetirement()`
- c0070 ..> c0070: `reviewExecutionFailure() calls checkpointOutcome()`
- c0070 ..> c0070: `reviewExecutionFailure() calls correctedCaptureOutcome()`
- c0070 ..> c0070: `reviewExecutionFailure() calls ensureModelCallAllowed()`
- c0070 ..> c0070: `reviewExecutionFailure() calls fieldLimits()`
- c0070 ..> c0070: `reviewLinks() calls executeLinkReviews()`
- c0070 ..> c0070: `reviewLinks() calls planLinkReviews()`
- c0070 ..> c0070: `reviewLinks() calls prepareLinkReviews()`
- c0070 ..> c0070: `revisionResources() calls read()`
- c0070 ..> c0070: `runBranchWorker() calls enabled()`
- c0070 ..> c0070: `runBranchWorker() calls processBranchJob()`
- c0070 ..> c0070: `saveCorrectableFailure() calls candidateUncertainty()`
- c0070 ..> c0070: `saveCorrectableFailure() calls checkpointOutcome()`
- c0070 ..> c0070: `saveCorrectableFailure() calls isModelFailure()`
- c0070 ..> c0070: `skipCandidate() calls checkpointOutcome()`
- c0070 ..> c0070: `skipCandidate() calls writeKnowledge()`
- c0070 ..> c0070: `supersedeCandidate() calls checkpointOutcome()`
- c0070 ..> c0070: `supersedeCandidate() calls createMemory()`
- c0070 ..> c0070: `supersedeCandidate() calls ensureModelCallAllowed()`
- c0070 ..> c0070: `supersedeCandidate() calls ensureWriteAllowed()`
- c0070 ..> c0070: `supersedeCandidate() calls finishSupersession()`
- c0070 ..> c0070: `supersedeCandidate() calls writeKnowledge()`
- c0070 ..> c0070: `supersessionAlreadyApplied() calls ensureWriteAllowed()`
- c0070 ..> c0070: `updateResolutionReplacement() calls assertWriteAllowedNow()`
- c0070 ..> c0070: `updateResolutionReplacement() calls ensureWriteAllowed()`
- c0070 ..> c0070: `validateResolutionEvidence() calls selectResolutionEvidence()`
- c0070 ..> c0070: `verifyRequestedMerge() calls ensureWriteAllowed()`
- c0070 ..> c0070: `writeKnowledge() calls checkpointOutcome()`
- c0070 ..> c0070: `writeKnowledge() calls ensureWriteAllowed()`
- c0070 --> c0071: `field onActivity`
- c0070 ..> c0071: `type in constructor`
- c0070 ..> c0072: `applySupersession() constructs CaptureUncertainWrite`
- c0070 ..> c0072: `candidateUncertainty() constructs CaptureUncertainWrite`
- c0070 ..> c0072: `connectionUncertainty() constructs CaptureUncertainWrite`
- c0070 ..> c0072: `createMemory() constructs CaptureUncertainWrite`
- c0070 ..> c0072: `mutate() constructs CaptureUncertainWrite`
- c0070 ..> c0072: `processJob() constructs CaptureUncertainWrite`
- c0070 ..> c0072: `reviewExecutionFailure() constructs CaptureUncertainWrite`
- c0070 ..> c0072: `type in candidateUncertainty`
- c0070 ..> c0072: `type in connectionUncertainty`
- c0070 ..> c0073: `type in applyConflictResolution`
- c0070 ..> c0073: `type in planConflictReplacement`
- c0070 ..> c0073: `type in validateResolutionEvidence`
- c0070 ..> c0074: `type in applyConflictResolution`
- c0070 ..> c0074: `type in resolutionTarget`
- c0070 ..> c0075: `destinationProjects() constructs InvalidCaptureOutput`
- c0070 ..> c0075: `processKnowledgeCheckpoint() constructs InvalidCaptureOutput`
- c0070 ..> c0075: `processReplacementCheckpoint() constructs InvalidCaptureOutput`
- c0070 ..> c0075: `validateDecision() constructs InvalidCaptureOutput`
- c0070 ..> c0076: `resolveDestination() constructs MissingCaptureDestination`
- c0070 ..> c0077: `type in rejectConflict`
- c0070 ..> c0077: `type in resolve`
- c0070 ..> c0077: `type in resolveConflict`
- c0070 ..> c0077: `type in resolveConflictOwned`
- c0070 ..> c0077: `type in selectResolutionEvidence`
- c0070 ..> c0077: `type in validateResolutionEvidence`
- c0070 ..> c0078: `addConflict() calls clone()`
- c0070 ..> c0078: `addConflict() calls sourceEvidence()`
- c0070 ..> c0078: `applyConflictResolution() calls blockedSave()`
- c0070 ..> c0078: `applyConflictResolution() calls conflictResolutionEvidence()`
- c0070 ..> c0078: `applyDecision() calls firstConflictId()`
- c0070 ..> c0078: `candidateUncertainty() calls record()`
- c0070 ..> c0078: `checkpointBranch() calls scrubError()`
- c0070 ..> c0078: `checkpointOutcome() calls clone()`
- c0070 ..> c0078: `checkpointOutcome() calls record()`
- c0070 ..> c0078: `composeMerge() calls captureWorkMetadata()`
- c0070 ..> c0078: `composeMerge() calls decisionConflictIds()`
- c0070 ..> c0078: `composeMerge() calls record()`
- c0070 ..> c0078: `composeMerge() calls sourceEvidence()`
- c0070 ..> c0078: `correctCandidateFailures() calls isFinalOutcome()`
- c0070 ..> c0078: `correctedCaptureOutcome() calls decisionConflictIds()`
- c0070 ..> c0078: `correctedCaptureOutcome() calls record()`
- c0070 ..> c0078: `correctedCaptureOutcome() calls reusableMergeComposition()`
- c0070 ..> c0078: `createMemory() calls memoryInput()`
- c0070 ..> c0078: `createMemory() calls projectId()`
- c0070 ..> c0078: `createMemory() calls record()`
- c0070 ..> c0078: `createResolutionReplacement() calls projectId()`
- c0070 ..> c0078: `decideOverlap() calls appendSubmissionRejection()`
- c0070 ..> c0078: `decideOverlap() calls boundedSubmissionRejections()`
- c0070 ..> c0078: `decideOverlap() calls captureWorkMetadata()`
- c0070 ..> c0078: `decideOverlap() calls decisionConflictIds()`
- c0070 ..> c0078: `decideOverlap() calls overlapCandidate()`
- c0070 ..> c0078: `decideOverlap() calls parseDecision()`
- c0070 ..> c0078: `decideOverlap() calls sourceEvidence()`
- c0070 ..> c0078: `decideOverlapBatch() calls appendSubmissionRejection()`
- c0070 ..> c0078: `decideOverlapBatch() calls boundedSubmissionRejections()`
- c0070 ..> c0078: `decideOverlapBatch() calls captureWorkMetadata()`
- c0070 ..> c0078: `decideOverlapBatch() calls overlapCandidate()`
- c0070 ..> c0078: `decideOverlapBatch() calls record()`
- c0070 ..> c0078: `decideOverlapBatch() calls scrubError()`
- c0070 ..> c0078: `decideOverlapBatch() calls sharedSourceEvidence()`
- c0070 ..> c0078: `diagnostics() calls boundedSubmissionRejections()`
- c0070 ..> c0078: `diagnostics() calls projectId()`
- c0070 ..> c0078: `diagnostics() calls record()`
- c0070 ..> c0078: `diagnostics() calls scrubError()`
- c0070 ..> c0078: `diagnostics() calls stringValue()`
- c0070 ..> c0078: `diagnostics() calls strings()`
- c0070 ..> c0078: `enqueue() calls scrubError()`
- c0070 ..> c0078: `enqueueSnapshot() calls snapshotForPersistence()`
- c0070 ..> c0078: `equivalentMemory() calls projectId()`
- c0070 ..> c0078: `equivalentMemory() calls record()`
- c0070 ..> c0078: `evidenceReadTool() calls record()`
- c0070 ..> c0078: `executeLinkReview() calls record()`
- c0070 ..> c0078: `executeLinkReviews() calls record()`
- c0070 ..> c0078: `fieldLimits() calls scrubError()`
- c0070 ..> c0078: `finishMerge() calls record()`
- c0070 ..> c0078: `finishSupersession() calls record()`
- c0070 ..> c0078: `loadCandidates() calls appendSubmissionRejection()`
- c0070 ..> c0078: `loadCandidates() calls boundedSubmissionRejections()`
- c0070 ..> c0078: `loadCandidates() calls captureCandidateSubmission()`
- c0070 ..> c0078: `loadCandidates() calls captureWorkMetadata()`
- c0070 ..> c0078: `loadCandidates() calls parseCandidates()`
- c0070 ..> c0078: `loadCandidates() calls record()`
- c0070 ..> c0078: `loadCandidates() calls strings()`
- c0070 ..> c0078: `loadOverlaps() calls record()`
- c0070 ..> c0078: `mergeCandidate() calls projectId()`
- c0070 ..> c0078: `mergeCandidate() calls record()`
- c0070 ..> c0078: `neighborhoodMatches() calls record()`
- c0070 ..> c0078: `pauseCandidate() calls scrubError()`
- c0070 ..> c0078: `planLinkReviews() calls appendSubmissionRejection()`
- c0070 ..> c0078: `planLinkReviews() calls boundedSubmissionRejections()`
- c0070 ..> c0078: `planLinkReviews() calls captureWorkMetadata()`
- c0070 ..> c0078: `planLinkReviews() calls record()`
- c0070 ..> c0078: `planLinkReviews() calls sharedSourceEvidence()`
- c0070 ..> c0078: `preflightRetirement() calls record()`
- c0070 ..> c0078: `prepareLinkReviews() calls record()`
- c0070 ..> c0078: `prepareOverlapBatch() calls isFinalOutcome()`
- c0070 ..> c0078: `prepareOverlapBatch() calls record()`
- c0070 ..> c0078: `processCandidate() calls isFinalOutcome()`
- c0070 ..> c0078: `processCandidate() calls record()`
- c0070 ..> c0078: `processJob() calls isFinalOutcome()`
- c0070 ..> c0078: `processKnowledgeCheckpoint() calls projectId()`
- c0070 ..> c0078: `processKnowledgeCheckpoint() calls record()`
- c0070 ..> c0078: `processOrderedCandidates() calls isFinalOutcome()`
- c0070 ..> c0078: `processOrderedCandidates() calls record()`
- c0070 ..> c0078: `processReplacementCheckpoint() calls projectId()`
- c0070 ..> c0078: `processReplacementCheckpoint() calls record()`
- c0070 ..> c0078: `recordBranchFailure() calls scrubError()`
- c0070 ..> c0078: `recordCandidateFailure() calls record()`
- c0070 ..> c0078: `recordCandidateFailure() calls scrubError()`
- c0070 ..> c0078: `recordLinkReviewFailure() calls record()`
- c0070 ..> c0078: `refreshLinkReview() calls projectId()`
- c0070 ..> c0078: `refreshLinkReview() calls record()`
- c0070 ..> c0078: `resolutionTarget() calls record()`
- c0070 ..> c0078: `resolveDestination() calls currentProjectId()`
- c0070 ..> c0078: `resolveDestination() calls projectId()`
- c0070 ..> c0078: `retireCandidate() calls decisionConflictIds()`
- c0070 ..> c0078: `retireCandidate() calls record()`
- c0070 ..> c0078: `reviewExecutionFailure() calls captureWorkMetadata()`
- c0070 ..> c0078: `reviewExecutionFailure() calls record()`
- c0070 ..> c0078: `reviewLinks() calls record()`
- c0070 ..> c0078: `saveCorrectableFailure() calls record()`
- c0070 ..> c0078: `saveCorrectableFailure() calls scrubError()`
- c0070 ..> c0078: `skipCandidate() calls firstConflictId()`
- c0070 ..> c0078: `skipCandidate() calls record()`
- c0070 ..> c0078: `supersedeCandidate() calls decisionConflictIds()`
- c0070 ..> c0078: `validateResolutionEvidence() calls stringValue()`
- c0070 ..> c0078: `validateResolutionEvidence() calls trustedAdditionalEntries()`
- c0070 ..> c0078: `verifyConflictOrigin() calls record()`
- c0070 ..> c0078: `writeKnowledge() calls captureKnowledgePlan()`
- c0070 ..> c0078: `writeKnowledge() calls record()`
- c0070 --> c0093: `field getMode`
- c0070 ..> c0093: `type in enabled`
- c0070 ..> c0093: `type in ensureWriteAllowed`
- c0070 ..> c0093: `type in refreshLinkReview`
- c0070 ..> c0094: `type in advance`
- c0070 ..> c0094: `type in advanceWatermark`
- c0070 ..> c0094: `type in checkpoint`
- c0070 ..> c0094: `type in checkpointBranches`
- c0070 ..> c0094: `type in enqueue`
- c0070 ..> c0094: `type in enqueueSnapshot`
- c0070 ..> c0094: `type in policyFor`
- c0070 ..> c0102: `type in neighborhoodEntities`
- c0070 ..> c0102: `type in neighborhoodEntity`
- c0070 ..> c0102: `type in neighborhoodMatches`
- c0070 ..> c0102: `type in neighborhoodRelationships`
- c0070 ..> c0104: `type in neighborhoodRelationships`
- c0070 --> c0109: `field client`
- c0070 ..> c0109: `type in cancellableClient`
- c0070 --> c0111: `field passLimits`
- c0070 ..> c0111: `type in fieldLimits`
- c0070 ..> c0111: `type in policyFor`
- c0070 ..> c0112: `type in cancellableKnowledge`
- c0070 --> c0114: `field readSavedMemory`
- c0070 ..> c0114: `type in addConflict`
- c0070 ..> c0114: `type in applyDecision`
- c0070 ..> c0114: `type in applySupersession`
- c0070 ..> c0114: `type in decideOverlap`
- c0070 ..> c0114: `type in equivalentMemory`
- c0070 ..> c0114: `type in finishSupersession`
- c0070 ..> c0114: `type in loadOverlaps`
- c0070 ..> c0114: `type in planConflictReplacement`
- c0070 ..> c0114: `type in readMaintenanceTargets`
- c0070 ..> c0114: `type in recordEscalation`
- c0070 ..> c0114: `type in revisionResources`
- c0070 ..> c0114: `type in skipCandidate`
- c0070 ..> c0114: `type in supersedeCandidate`
- c0070 ..> c0114: `type in validateDecision`
- c0070 ..> c0114: `type in writeKnowledge`
- c0070 ..> c0115: `type in createMemory`
- c0070 --> c0117: `field model`
- c0070 ..> c0119: `evidenceReadTool() constructs ModelEvidencePage`
- c0070 ..> c0120: `sourceInspectionTool() constructs ModelReadErrorResult`
- c0070 ..> c0121: `type in evidenceReadTool`
- c0070 ..> c0121: `type in sourceInspectionTool`
- c0070 ..> c0132: `type in destinationProjects`
- c0070 ..> c0132: `type in planConflictReplacement`
- c0070 ..> c0132: `type in resolveDestination`
- c0070 ..> c0132: `type in watermark`
- c0070 ..> c0133: `applySupersession() calls rejectedHttpError()`
- c0070 ..> c0133: `connectionUncertainty() calls rejectedHttpStatus()`
- c0070 ..> c0133: `createMemory() calls rejectedHttpError()`
- c0070 ..> c0133: `createResolutionReplacement() calls rejectedHttpError()`
- c0070 ..> c0133: `migrateLegacyLinkReview() calls rejectedHttpStatus()`
- c0070 ..> c0170: `cancellableKnowledge() calls createCodeArtifact()`
- c0070 ..> c0170: `cancellableKnowledge() calls createDocument()`
- c0070 ..> c0170: `cancellableKnowledge() calls createEntity()`
- c0070 ..> c0170: `cancellableKnowledge() calls createRelationship()`
- c0070 ..> c0170: `cancellableKnowledge() calls getCodeArtifact()`
- c0070 ..> c0170: `cancellableKnowledge() calls getDocument()`
- c0070 ..> c0170: `cancellableKnowledge() calls getEntity()`
- c0070 ..> c0170: `cancellableKnowledge() calls getEntityMemories()`
- c0070 ..> c0170: `cancellableKnowledge() calls getFile()`
- c0070 ..> c0170: `cancellableKnowledge() calls getRelationships()`
- c0070 ..> c0170: `cancellableKnowledge() calls linkEntityMemory()`
- c0070 ..> c0170: `cancellableKnowledge() calls linkMemories()`
- c0070 ..> c0170: `cancellableKnowledge() calls listCodeArtifacts()`
- c0070 ..> c0170: `cancellableKnowledge() calls listDocuments()`
- c0070 ..> c0170: `cancellableKnowledge() calls listFiles()`
- c0070 ..> c0170: `cancellableKnowledge() calls searchEntities()`
- c0070 ..> c0170: `cancellableKnowledge() calls updateCodeArtifact()`
- c0070 ..> c0170: `cancellableKnowledge() calls updateDocument()`
- c0070 ..> c0170: `cancellableKnowledge() calls updateEntity()`
- c0070 ..> c0170: `cancellableKnowledge() calls updateMemory()`
- c0070 ..> c0170: `executeResolutionLinks() calls linkMemories()`
- c0070 ..> c0170: `existingNeighborhood() calls getCodeArtifact()`
- c0070 ..> c0170: `existingNeighborhood() calls getDocument()`
- c0070 ..> c0170: `existingNeighborhood() calls listCodeArtifacts()`
- c0070 ..> c0170: `existingNeighborhood() calls listDocuments()`
- c0070 ..> c0170: `linkResolutionEntity() calls linkEntityMemory()`
- c0070 ..> c0170: `neighborhoodEntity() calls getEntity()`
- c0070 ..> c0170: `neighborhoodMatches() calls searchEntities()`
- c0070 ..> c0170: `neighborhoodRelationships() calls getRelationships()`
- c0070 ..> c0170: `revisionResources() calls getCodeArtifact()`
- c0070 ..> c0170: `revisionResources() calls getDocument()`
- c0070 ..> c0170: `revisionResources() calls getEntity()`
- c0070 ..> c0170: `revisionResources() calls getFile()`
- c0070 ..> c0170: `updateResolutionReplacement() calls updateMemory()`
- c0070 ..> c0170: `verifyRequestedMerge() calls getEntity()`
- c0070 ..> c0173: `applyConflictResolution() calls get()`
- c0070 ..> c0173: `applySupersession() calls supersede()`
- c0070 ..> c0173: `cancellableClient() calls create()`
- c0070 ..> c0173: `cancellableClient() calls createProject()`
- c0070 ..> c0173: `cancellableClient() calls get()`
- c0070 ..> c0173: `cancellableClient() calls linkProject()`
- c0070 ..> c0173: `cancellableClient() calls listProjects()`
- c0070 ..> c0173: `cancellableClient() calls search()`
- c0070 ..> c0173: `cancellableClient() calls supersede()`
- c0070 ..> c0173: `constructor() calls get()`
- c0070 ..> c0173: `createMemory() calls create()`
- c0070 ..> c0173: `createResolutionReplacement() calls create()`
- c0070 ..> c0173: `decideOverlapBatch() calls get()`
- c0070 ..> c0173: `diagnostics() calls get()`
- c0070 ..> c0173: `equivalentMemory() calls get()`
- c0070 ..> c0173: `executeResolutionLinks() calls get()`
- c0070 ..> c0173: `finishMerge() calls get()`
- c0070 ..> c0173: `linkResolutionEntity() calls getMemoryEntityIds()`
- c0070 ..> c0173: `loadOverlaps() calls search()`
- c0070 ..> c0173: `planLinkReviews() calls get()`
- c0070 ..> c0173: `previousSupersessionCompleted() calls get()`
- c0070 ..> c0173: `read() calls get()`
- c0070 ..> c0173: `readMaintenanceTargets() calls get()`
- c0070 ..> c0173: `resolveDestination() calls listProjects()`
- c0070 ..> c0173: `retireCandidate() calls get()`
- c0070 ..> c0173: `revisionResources() calls get()`
- c0070 ..> c0173: `revisionResources() calls getMemoryEntityIds()`
- c0070 ..> c0173: `skipCandidate() calls get()`
- c0070 ..> c0173: `supersedeCandidate() calls get()`
- c0070 ..> c0173: `supersessionAlreadyApplied() calls get()`
- c0070 ..> c0173: `verifyConflictOrigin() calls get()`
- c0070 ..> c0173: `verifyRequestedMerge() calls get()`
- c0070 ..> c0177: `fieldLimits() calls fieldLimits()`
- c0070 --> c0214: `field knowledgeWriter`
- c0070 ..> c0214: `constructor() constructs KnowledgeWriter`
- c0070 ..> c0214: `writeKnowledge() calls execute()`
- c0070 --> c0218: `field logger`
- c0070 ..> c0220: `checkpointBranch() calls emit()`
- c0070 ..> c0220: `checkpointOutcome() calls emit()`
- c0070 ..> c0220: `createMemory() calls emit()`
- c0070 ..> c0220: `decideOverlap() calls emit()`
- c0070 ..> c0220: `emit() calls emit()`
- c0070 ..> c0220: `enqueue() calls emit()`
- c0070 ..> c0220: `enqueueSnapshot() calls emit()`
- c0070 ..> c0220: `enqueueSnapshot() calls enqueue()`
- c0070 ..> c0220: `fieldLimits() calls emit()`
- c0070 ..> c0220: `loadCandidates() calls emit()`
- c0070 ..> c0220: `processBranchJob() calls emit()`
- c0070 ..> c0220: `recordBranchFailure() calls emit()`
- c0070 ..> c0220: `recordCandidateFailure() calls emit()`
- c0070 ..> c0220: `runBranchWorker() calls emit()`
- c0070 ..> c0220: `saveCorrectableFailure() calls emit()`
- c0070 ..> c0221: `checkpointOutcome() calls correlation()`
- c0070 ..> c0221: `composeMerge() calls correlation()`
- c0070 ..> c0221: `createMemory() calls correlation()`
- c0070 ..> c0221: `decideOverlap() calls correlation()`
- c0070 ..> c0221: `decideOverlapBatch() calls correlation()`
- c0070 ..> c0221: `loadCandidates() calls correlation()`
- c0070 ..> c0221: `planLinkReviews() calls correlation()`
- c0070 ..> c0221: `processBranchJob() calls correlation()`
- c0070 ..> c0221: `recordBranchFailure() calls correlation()`
- c0070 ..> c0221: `recordCandidateFailure() calls correlation()`
- c0070 ..> c0221: `reviewExecutionFailure() calls correlation()`
- c0070 ..> c0221: `saveCorrectableFailure() calls correlation()`
- c0070 ..> c0222: `createMemory() calls replacementMemoryInput()`
- c0070 ..> c0222: `createResolutionReplacement() calls replacementMemoryInput()`
- c0070 ..> c0222: `planConflictReplacement() calls replacementMemoryInput()`
- c0070 ..> c0222: `updateResolutionReplacement() calls replacementMemoryInput()`
- c0070 ..> c0226: `loadCandidates() calls prepareCapture()`
- c0070 ..> c0236: `addConflict() calls sanitizeText()`
- c0070 ..> c0236: `addConflict() calls sanitizeValue()`
- c0070 ..> c0236: `applySupersession() calls errorMessage()`
- c0070 ..> c0236: `candidateUncertainty() calls errorMessage()`
- c0070 ..> c0236: `createMemory() calls errorMessage()`
- c0070 ..> c0236: `createResolutionReplacement() calls errorMessage()`
- c0070 ..> c0236: `decideOverlap() calls sanitizeValue()`
- c0070 ..> c0236: `diagnostics() calls sanitizeText()`
- c0070 ..> c0236: `emit() calls sanitizeValue()`
- c0070 ..> c0236: `existingNeighborhood() calls hasSensitiveData()`
- c0070 ..> c0236: `failConflictResolution() calls errorMessage()`
- c0070 ..> c0236: `loadCandidates() calls sanitizeText()`
- c0070 ..> c0236: `loadOverlaps() calls sanitizeValue()`
- c0070 ..> c0236: `mutate() calls errorMessage()`
- c0070 ..> c0236: `neighborhoodEntity() calls hasSensitiveData()`
- c0070 ..> c0236: `neighborhoodRelationships() calls hasSensitiveData()`
- c0070 ..> c0236: `recordCandidateFailure() calls errorMessage()`
- c0070 ..> c0236: `recordLinkReviewFailure() calls errorMessage()`
- c0070 ..> c0236: `refreshLinkReview() calls errorMessage()`
- c0070 ..> c0236: `rejectConflict() calls sanitizeText()`
- c0070 ..> c0236: `reviewExecutionFailure() calls errorMessage()`
- c0070 ..> c0236: `saveCorrectableFailure() calls errorMessage()`
- c0070 ..> c0236: `skipCandidate() calls sanitizeValue()`
- c0070 --> c0240: `field queue`
- c0070 ..> c0240: `addConflict() calls addConflict()`
- c0070 ..> c0240: `addConflict() calls now()`
- c0070 ..> c0240: `advance() calls advanceWatermark()`
- c0070 ..> c0240: `applyConflictResolution() calls updateConflict()`
- c0070 ..> c0240: `cancellableClient() calls mutate()`
- c0070 ..> c0240: `cancellableKnowledge() calls mutate()`
- c0070 ..> c0240: `checkpoint() calls hasClaimableWork()`
- c0070 ..> c0240: `checkpointBranch() calls withWorkerLock()`
- c0070 ..> c0240: `checkpointBranches() calls listJobMetadata()`
- c0070 ..> c0240: `checkpointOutcome() calls checkpoint()`
- c0070 ..> c0240: `checkpointOutcome() calls getJob()`
- c0070 ..> c0240: `composeMerge() calls checkpoint()`
- c0070 ..> c0240: `composeMerge() calls complete()`
- c0070 ..> c0240: `constructor() calls complete()`
- c0070 ..> c0240: `createResolutionReplacement() calls updateConflict()`
- c0070 ..> c0240: `decideOverlap() calls checkpoint()`
- c0070 ..> c0240: `decideOverlap() calls complete()`
- c0070 ..> c0240: `decideOverlapBatch() calls checkpoint()`
- c0070 ..> c0240: `decideOverlapBatch() calls complete()`
- c0070 ..> c0240: `diagnostics() calls listJobMetadata()`
- c0070 ..> c0240: `diagnostics() calls pendingConflicts()`
- c0070 ..> c0240: `enqueue() calls enqueueSnapshot()`
- c0070 ..> c0240: `enqueueSnapshot() calls advanceWatermark()`
- c0070 ..> c0240: `executeLinkReviews() calls getJob()`
- c0070 ..> c0240: `executeResolutionLinks() calls updateConflict()`
- c0070 ..> c0240: `failConflictResolution() calls getConflict()`
- c0070 ..> c0240: `failConflictResolution() calls updateConflict()`
- c0070 ..> c0240: `loadCandidates() calls checkpoint()`
- c0070 ..> c0240: `loadCandidates() calls complete()`
- c0070 ..> c0240: `loadCandidates() calls getJob()`
- c0070 ..> c0240: `loadCandidates() calls refreshCaptureHistory()`
- c0070 ..> c0240: `markConflictResolved() calls updateConflict()`
- c0070 ..> c0240: `ownedConflict() calls getConflict()`
- c0070 ..> c0240: `pauseCandidate() calls checkpoint()`
- c0070 ..> c0240: `pauseCandidate() calls getJob()`
- c0070 ..> c0240: `pendingConflicts() calls pendingConflicts()`
- c0070 ..> c0240: `planConflictReplacement() calls complete()`
- c0070 ..> c0240: `planConflictReplacement() calls getJob()`
- c0070 ..> c0240: `planLinkReviews() calls checkpoint()`
- c0070 ..> c0240: `planLinkReviews() calls complete()`
- c0070 ..> c0240: `processBranchJob() calls getJob()`
- c0070 ..> c0240: `processBranchJob() calls now()`
- c0070 ..> c0240: `processBranchJob() calls releaseProgress()`
- c0070 ..> c0240: `processJob() calls checkpoint()`
- c0070 ..> c0240: `processJob() calls complete()`
- c0070 ..> c0240: `processJob() calls getJob()`
- c0070 ..> c0240: `processJob() calls releaseProgress()`
- c0070 ..> c0240: `processPending() calls checkpoint()`
- c0070 ..> c0240: `recordBranchFailure() calls cancel()`
- c0070 ..> c0240: `recordBranchFailure() calls checkpoint()`
- c0070 ..> c0240: `recordBranchFailure() calls getJob()`
- c0070 ..> c0240: `recordBranchFailure() calls now()`
- c0070 ..> c0240: `recordCandidateFailure() calls cancel()`
- c0070 ..> c0240: `recordCandidateFailure() calls checkpoint()`
- c0070 ..> c0240: `recordCandidateFailure() calls getJob()`
- c0070 ..> c0240: `recordEscalation() calls addConflict()`
- c0070 ..> c0240: `recordLinkReviewFailure() calls getJob()`
- c0070 ..> c0240: `recordSupersession() calls checkpoint()`
- c0070 ..> c0240: `recordSupersession() calls updateConflict()`
- c0070 ..> c0240: `rejectConflict() calls updateConflict()`
- c0070 ..> c0240: `resolveConflict() calls getConflict()`
- c0070 ..> c0240: `resolveConflict() calls withWorkerLock()`
- c0070 ..> c0240: `reviewExecutionFailure() calls checkpoint()`
- c0070 ..> c0240: `reviewExecutionFailure() calls complete()`
- c0070 ..> c0240: `runBranchWorker() calls claimNext()`
- c0070 ..> c0240: `saveCorrectableFailure() calls getJob()`
- c0070 ..> c0240: `sourceInspectionTool() calls checkpoint()`
- c0070 ..> c0240: `updateResolutionReplacement() calls updateConflict()`
- c0070 ..> c0240: `verifyConflictOrigin() calls getJob()`
- c0070 ..> c0240: `watermark() calls getWatermark()`
- c0070 ..> c0244: `type in addConflict`
- c0070 ..> c0244: `type in applyConflictResolution`
- c0070 ..> c0244: `type in createResolutionReplacement`
- c0070 ..> c0244: `type in executeResolutionLinks`
- c0070 ..> c0244: `type in linkResolutionEntity`
- c0070 ..> c0244: `type in ownedConflict`
- c0070 ..> c0244: `type in planConflictReplacement`
- c0070 ..> c0244: `type in rejectConflict`
- c0070 ..> c0244: `type in resolutionTarget`
- c0070 ..> c0244: `type in selectResolutionEvidence`
- c0070 ..> c0244: `type in updateResolutionReplacement`
- c0070 ..> c0244: `type in validateResolutionEvidence`
- c0070 ..> c0244: `type in verifyConflictOrigin`
- c0070 --> c0248: `field identity`
- c0070 ..> c0249: `type in addConflict`
- c0070 ..> c0249: `type in applyDecision`
- c0070 ..> c0249: `type in applySupersession`
- c0070 ..> c0249: `type in checkpointOutcome`
- c0070 ..> c0249: `type in composeMerge`
- c0070 ..> c0249: `type in correctCandidateFailures`
- c0070 ..> c0249: `type in correlation`
- c0070 ..> c0249: `type in createMemory`
- c0070 ..> c0249: `type in decideOverlap`
- c0070 ..> c0249: `type in decideOverlapBatch`
- c0070 ..> c0249: `type in ensureModelCallAllowed`
- c0070 ..> c0249: `type in equivalentMemory`
- c0070 ..> c0249: `type in evidenceReadTool`
- c0070 ..> c0249: `type in executeLinkReview`
- c0070 ..> c0249: `type in executeLinkReviews`
- c0070 ..> c0249: `type in existingNeighborhood`
- c0070 ..> c0249: `type in finishMerge`
- c0070 ..> c0249: `type in finishReviewedSupersession`
- c0070 ..> c0249: `type in finishSupersession`
- c0070 ..> c0249: `type in loadCandidates`
- c0070 ..> c0249: `type in loadOverlaps`
- c0070 ..> c0249: `type in mergeCandidate`
- c0070 ..> c0249: `type in migrateLegacyLinkReview`
- c0070 ..> c0249: `type in neighborhoodEntities`
- c0070 ..> c0249: `type in neighborhoodEntity`
- c0070 ..> c0249: `type in neighborhoodMatches`
- c0070 ..> c0249: `type in neighborhoodRelationships`
- c0070 ..> c0249: `type in pauseCandidate`
- c0070 ..> c0249: `type in planLinkReviews`
- c0070 ..> c0249: `type in preflightRetirement`
- c0070 ..> c0249: `type in prepareDestination`
- c0070 ..> c0249: `type in prepareLinkReviews`
- c0070 ..> c0249: `type in prepareOverlapBatch`
- c0070 ..> c0249: `type in previousSupersessionCompleted`
- c0070 ..> c0249: `type in processBranchJob`
- c0070 ..> c0249: `type in processCandidate`
- c0070 ..> c0249: `type in processCandidates`
- c0070 ..> c0249: `type in processJob`
- c0070 ..> c0249: `type in processKnowledgeCheckpoint`
- c0070 ..> c0249: `type in processOrderedCandidates`
- c0070 ..> c0249: `type in processReplacementCheckpoint`
- c0070 ..> c0249: `type in readMaintenanceTargets`
- c0070 ..> c0249: `type in recordBranchFailure`
- c0070 ..> c0249: `type in recordCandidateFailure`
- c0070 ..> c0249: `type in recordEscalation`
- c0070 ..> c0249: `type in recordLinkReviewFailure`
- c0070 ..> c0249: `type in refreshLinkReview`
- c0070 ..> c0249: `type in retireCandidate`
- c0070 ..> c0249: `type in reviewExecutionFailure`
- c0070 ..> c0249: `type in reviewLinks`
- c0070 ..> c0249: `type in saveCorrectableFailure`
- c0070 ..> c0249: `type in skipCandidate`
- c0070 ..> c0249: `type in sourceInspectionTool`
- c0070 ..> c0249: `type in supersedeCandidate`
- c0070 ..> c0249: `type in supersessionAlreadyApplied`
- c0070 ..> c0249: `type in verifyRequestedMerge`
- c0070 ..> c0249: `type in writeKnowledge`
- c0070 ..> c0256: `type in recordSupersession`
- c0070 ..> c0269: `composeMerge() calls trim()`
- c0070 ..> c0269: `neighborhoodMatches() calls trim()`
- c0070 ..> c0269: `retireCandidate() calls trim()`
- c0070 ..> c0278: `composeMerge() calls captureConversation()`
- c0070 ..> c0278: `decideOverlap() calls captureConversation()`
- c0070 ..> c0278: `decideOverlapBatch() calls captureConversation()`
- c0070 ..> c0278: `loadCandidates() calls captureConversation()`
- c0070 ..> c0278: `planConflictReplacement() calls captureConversation()`
- c0070 ..> c0278: `planConflictReplacement() calls sanitizeCaptureConversation()`
- c0070 ..> c0278: `planLinkReviews() calls captureConversation()`
- c0070 ..> c0278: `reviewExecutionFailure() calls captureConversation()`
- c0070 ..> c0282: `sourceInspectionTool() calls inspect()`
- c0070 ..> c0282: `sourceInspectionTool() constructs SourceInspector`
- c0071 --> c0045: `field onActivity`
- c0071 --> c0093: `field getMode`
- c0071 --> c0109: `field client`
- c0071 --> c0117: `field model`
- c0071 --> c0218: `field logger`
- c0071 --> c0240: `field queue`
- c0072 --|> c0064: `inherits`
- c0073 --> c0107: `field selectedAdditionalEntries`
- c0074 --> c0049: `field candidate`
- c0074 --> c0114: `field oldMemory`
- c0074 --> c0249: `field fakeJob`
- c0076 --|> c0028: `inherits`
- c0076 ..> c0049: `type in constructor`
- c0077 --> c0107: `field additionalEntries`
- c0078 ..> c0042: `type in parseCandidates`
- c0078 ..> c0043: `type in eligibleCandidate`
- c0078 ..> c0043: `type in invalidCandidate`
- c0078 ..> c0043: `type in validCandidate`
- c0078 ..> c0049: `type in captureKnowledgePlan`
- c0078 ..> c0049: `type in captureProvenance`
- c0078 ..> c0049: `type in eligibleCandidate`
- c0078 ..> c0049: `type in memoryInput`
- c0078 ..> c0049: `type in overlapCandidate`
- c0078 ..> c0049: `type in sharedSourceEvidence`
- c0078 ..> c0049: `type in sourceEvidence`
- c0078 ..> c0053: `type in applyEnrichmentDecision`
- c0078 ..> c0053: `type in applyEquivalentCandidate`
- c0078 ..> c0053: `type in decisionConflictIds`
- c0078 ..> c0053: `type in firstConflictId`
- c0078 ..> c0053: `type in parseDecision`
- c0078 ..> c0053: `type in reusableMergeComposition`
- c0078 ..> c0061: `type in reusableMergeComposition`
- c0078 ..> c0073: `type in conflictResolutionEvidence`
- c0078 ..> c0075: `applyEnrichmentDecision() constructs InvalidCaptureOutput`
- c0078 ..> c0075: `applyEquivalentCandidate() constructs InvalidCaptureOutput`
- c0078 ..> c0075: `captureResource() constructs InvalidCaptureOutput`
- c0078 ..> c0075: `decisionEvidenceIds() constructs InvalidCaptureOutput`
- c0078 ..> c0075: `decisionMemoryId() constructs InvalidCaptureOutput`
- c0078 ..> c0075: `decisionMemoryIds() constructs InvalidCaptureOutput`
- c0078 ..> c0075: `decisionPartial() constructs InvalidCaptureOutput`
- c0078 ..> c0075: `decisionTargetMemoryId() constructs InvalidCaptureOutput`
- c0078 ..> c0075: `decisionText() constructs InvalidCaptureOutput`
- c0078 ..> c0075: `parseCandidates() constructs InvalidCaptureOutput`
- c0078 ..> c0075: `parseDecision() constructs InvalidCaptureOutput`
- c0078 ..> c0078: `appendSubmissionRejection() calls boundedSubmissionRejections()`
- c0078 ..> c0078: `captureEvidenceError() calls record()`
- c0078 ..> c0078: `captureEvidenceError() calls stringValue()`
- c0078 ..> c0078: `captureKnowledgePlan() calls captureProvenance()`
- c0078 ..> c0078: `captureKnowledgePlan() calls resourceInput()`
- c0078 ..> c0078: `captureResource() calls record()`
- c0078 ..> c0078: `currentProjectId() calls projectId()`
- c0078 ..> c0078: `decisionMemoryId() calls projectId()`
- c0078 ..> c0078: `decisionMemoryIds() calls projectId()`
- c0078 ..> c0078: `decisionTargetMemoryId() calls projectId()`
- c0078 ..> c0078: `eligibleCandidate() calls captureEvidenceError()`
- c0078 ..> c0078: `eligibleCandidate() calls captureResource()`
- c0078 ..> c0078: `eligibleCandidate() calls invalidCandidate()`
- c0078 ..> c0078: `eligibleCandidate() calls record()`
- c0078 ..> c0078: `eligibleCandidate() calls stringValue()`
- c0078 ..> c0078: `eligibleCandidate() calls validCandidate()`
- c0078 ..> c0078: `isFinalOutcome() calls record()`
- c0078 ..> c0078: `memoryInput() calls captureProvenance()`
- c0078 ..> c0078: `parseCandidates() calls eligibleCandidate()`
- c0078 ..> c0078: `parseCandidates() calls record()`
- c0078 ..> c0078: `parseCandidates() calls stringValue()`
- c0078 ..> c0078: `parseDecision() calls applyEnrichmentDecision()`
- c0078 ..> c0078: `parseDecision() calls applyEquivalentCandidate()`
- c0078 ..> c0078: `parseDecision() calls decisionEvidenceIds()`
- c0078 ..> c0078: `parseDecision() calls decisionMemoryId()`
- c0078 ..> c0078: `parseDecision() calls decisionMemoryIds()`
- c0078 ..> c0078: `parseDecision() calls decisionPartial()`
- c0078 ..> c0078: `parseDecision() calls decisionTargetMemoryId()`
- c0078 ..> c0078: `parseDecision() calls decisionText()`
- c0078 ..> c0078: `parseDecision() calls record()`
- c0078 ..> c0078: `resourceInput() calls record()`
- c0078 ..> c0078: `reusableMergeComposition() calls decisionConflictIds()`
- c0078 ..> c0078: `sharedSourceEvidence() calls sourceEvidence()`
- c0078 ..> c0078: `snapshotForPersistence() calls clone()`
- c0078 ..> c0078: `trustedAdditionalEntries() calls record()`
- c0078 ..> c0078: `trustedAdditionalEntries() calls stringValue()`
- c0078 ..> c0094: `type in captureCandidateSubmission`
- c0078 ..> c0094: `type in captureEvidenceError`
- c0078 ..> c0094: `type in captureWorkMetadata`
- c0078 ..> c0094: `type in eligibleCandidate`
- c0078 ..> c0094: `type in parseCandidates`
- c0078 ..> c0094: `type in sharedSourceEvidence`
- c0078 ..> c0094: `type in snapshotForPersistence`
- c0078 ..> c0094: `type in sourceEvidence`
- c0078 ..> c0107: `type in sharedSourceEvidence`
- c0078 ..> c0107: `type in sourceEvidence`
- c0078 ..> c0107: `type in trustedAdditionalEntries`
- c0078 ..> c0114: `type in captureKnowledgePlan`
- c0078 ..> c0116: `type in memoryInput`
- c0078 ..> c0124: `type in captureCandidateSubmission`
- c0078 ..> c0132: `type in captureKnowledgePlan`
- c0078 ..> c0132: `type in captureProvenance`
- c0078 ..> c0132: `type in currentProjectId`
- c0078 ..> c0132: `type in memoryInput`
- c0078 ..> c0173: `captureEvidenceError() calls get()`
- c0078 ..> c0173: `sourceEvidence() calls get()`
- c0078 ..> c0210: `type in captureKnowledgePlan`
- c0078 ..> c0236: `boundedSubmissionRejections() calls sanitizeText()`
- c0078 ..> c0236: `captureEvidenceError() calls isMemoryOperation()`
- c0078 ..> c0236: `captureEvidenceError() calls sanitizeText()`
- c0078 ..> c0236: `captureWorkMetadata() calls isMemoryOperation()`
- c0078 ..> c0236: `scrubError() calls errorMessage()`
- c0078 ..> c0236: `scrubError() calls sanitizeText()`
- c0078 ..> c0236: `strings() calls sanitizeText()`
- c0078 ..> c0236: `trustedAdditionalEntries() calls hasSensitiveData()`
- c0078 ..> c0236: `trustedAdditionalEntries() calls isMemoryOperation()`
- c0078 ..> c0236: `trustedAdditionalEntries() calls sanitizeText()`
- c0078 ..> c0269: `applyEnrichmentDecision() calls trim()`
- c0078 ..> c0269: `applyEquivalentCandidate() calls trim()`
- c0078 ..> c0269: `decisionEvidenceIds() calls trim()`
- c0078 ..> c0269: `eligibleCandidate() calls trim()`
- c0078 ..> c0269: `parseDecision() calls trim()`
- c0078 ..> c0269: `stringValue() calls trim()`
- c0078 ..> c0269: `strings() calls trim()`
- c0078 ..> c0278: `snapshotForPersistence() calls sanitizeCaptureSnapshot()`
- c0078 ..> c0282: `errorMessage() calls inspect()`
- c0080 --> c0081: `field instance`
- c0080 --> c0084: `field model`
- c0080 --> c0088: `field prompts`
- c0080 --> c0089: `field scopeSource`
- c0080 --> c0090: `field verbosity`
- c0080 --> c0093: `field captureMode`
- c0080 --> c0129: `field scope`
- c0080 --> c0219: `field logging`
- c0091 ..> c0009: `writeJson() calls open()`
- c0091 ..> c0009: `writeJson() calls sync()`
- c0091 ..> c0070: `resolveLogDirectory() calls resolve()`
- c0091 ..> c0080: `type in loadForgetfulConfig`
- c0091 ..> c0082: `type in readJson`
- c0091 ..> c0082: `type in resolveScope`
- c0091 ..> c0083: `type in loadForgetfulConfig`
- c0091 ..> c0084: `type in modelToString`
- c0091 ..> c0084: `type in parseModel`
- c0091 ..> c0086: `type in resolveVerbosity`
- c0091 ..> c0086: `type in updateUserSettings`
- c0091 ..> c0088: `type in mergePrompts`
- c0091 ..> c0088: `type in readPromptDirectory`
- c0091 ..> c0089: `type in resolveScope`
- c0091 ..> c0090: `type in isVerbosity`
- c0091 ..> c0090: `type in resolveVerbosity`
- c0091 ..> c0091: `loadForgetfulConfig() calls asBoolean()`
- c0091 ..> c0091: `loadForgetfulConfig() calls asPositiveInteger()`
- c0091 ..> c0091: `loadForgetfulConfig() calls asString()`
- c0091 ..> c0091: `loadForgetfulConfig() calls defaultAgentDir()`
- c0091 ..> c0091: `loadForgetfulConfig() calls isFileLogLevel()`
- c0091 ..> c0091: `loadForgetfulConfig() calls isRecord()`
- c0091 ..> c0091: `loadForgetfulConfig() calls mergePrompts()`
- c0091 ..> c0091: `loadForgetfulConfig() calls parseModel()`
- c0091 ..> c0091: `loadForgetfulConfig() calls projectSettingsPath()`
- c0091 ..> c0091: `loadForgetfulConfig() calls readJson()`
- c0091 ..> c0091: `loadForgetfulConfig() calls readPromptDirectory()`
- c0091 ..> c0091: `loadForgetfulConfig() calls resolveCaptureMode()`
- c0091 ..> c0091: `loadForgetfulConfig() calls resolveContextLimit()`
- c0091 ..> c0091: `loadForgetfulConfig() calls resolveLogDirectory()`
- c0091 ..> c0091: `loadForgetfulConfig() calls resolveRecallConcurrency()`
- c0091 ..> c0091: `loadForgetfulConfig() calls resolveScope()`
- c0091 ..> c0091: `loadForgetfulConfig() calls resolveVerbosity()`
- c0091 ..> c0091: `loadForgetfulConfig() calls userSettingsPath()`
- c0091 ..> c0091: `parseModel() calls isRecord()`
- c0091 ..> c0091: `readPlanningPanel() calls isRecord()`
- c0091 ..> c0091: `readPlanningPanel() calls readJson()`
- c0091 ..> c0091: `resolveRecallConcurrency() calls isRecallConcurrency()`
- c0091 ..> c0091: `resolveScope() calls isRecord()`
- c0091 ..> c0091: `resolveVerbosity() calls isVerbosity()`
- c0091 ..> c0091: `updateForgetfulConnection() calls isRecord()`
- c0091 ..> c0091: `updateForgetfulConnection() calls readJson()`
- c0091 ..> c0091: `updateForgetfulConnection() calls writeJson()`
- c0091 ..> c0091: `updateUserSettings() calls isRecord()`
- c0091 ..> c0091: `updateUserSettings() calls readJson()`
- c0091 ..> c0091: `updateUserSettings() calls writeJson()`
- c0091 ..> c0091: `userSettingsPath() calls defaultAgentDir()`
- c0091 ..> c0091: `writeProjectScope() calls projectSettingsPath()`
- c0091 ..> c0091: `writeProjectScope() calls writeJson()`
- c0091 ..> c0093: `type in resolveCaptureMode`
- c0091 ..> c0129: `type in resolveScope`
- c0091 ..> c0129: `type in writeProjectScope`
- c0091 ..> c0200: `readJson() calls readFile()`
- c0091 ..> c0200: `readPromptDirectory() calls readFile()`
- c0091 ..> c0219: `type in isFileLogLevel`
- c0091 ..> c0220: `writeJson() calls close()`
- c0091 ..> c0269: `asString() calls trim()`
- c0091 ..> c0269: `parseModel() calls trim()`
- c0091 ..> c0269: `readPromptDirectory() calls trim()`
- c0091 ..> c0269: `resolveLogDirectory() calls trim()`
- c0094 --> c0092: `field historySummary`
- c0094 --> c0093: `field mode`
- c0094 --> c0107: `field entries`
- c0094 --> c0129: `field scope`
- c0094 --> c0132: `field context`
- c0095 --|> c0096: `inherits`
- c0096 --|> c0128: `inherits`
- c0099 --|> c0100: `inherits`
- c0100 --|> c0128: `inherits`
- c0102 --|> c0103: `inherits`
- c0103 --> c0106: `field entity_type`
- c0103 --|> c0128: `inherits`
- c0104 --|> c0105: `inherits`
- c0105 --|> c0128: `inherits`
- c0109 ..> c0111: `type in fieldLimits`
- c0109 --> c0112: `field knowledge`
- c0109 ..> c0114: `type in get`
- c0109 ..> c0114: `type in search`
- c0109 ..> c0115: `type in create`
- c0109 ..> c0116: `type in create`
- c0109 ..> c0118: `type in queryMemory`
- c0109 ..> c0126: `type in createProject`
- c0109 ..> c0126: `type in linkProject`
- c0109 ..> c0126: `type in listProjects`
- c0109 ..> c0127: `type in createProject`
- c0109 ..> c0130: `type in queryMemory`
- c0109 ..> c0130: `type in search`
- c0112 ..> c0095: `type in createCodeArtifact`
- c0112 ..> c0095: `type in getCodeArtifact`
- c0112 ..> c0095: `type in updateCodeArtifact`
- c0112 ..> c0096: `type in createCodeArtifact`
- c0112 ..> c0096: `type in updateCodeArtifact`
- c0112 ..> c0097: `type in listCodeArtifacts`
- c0112 ..> c0099: `type in createDocument`
- c0112 ..> c0099: `type in getDocument`
- c0112 ..> c0099: `type in updateDocument`
- c0112 ..> c0100: `type in createDocument`
- c0112 ..> c0100: `type in updateDocument`
- c0112 ..> c0101: `type in listDocuments`
- c0112 ..> c0102: `type in createEntity`
- c0112 ..> c0102: `type in getEntity`
- c0112 ..> c0102: `type in searchEntities`
- c0112 ..> c0102: `type in updateEntity`
- c0112 ..> c0103: `type in createEntity`
- c0112 ..> c0103: `type in updateEntity`
- c0112 ..> c0104: `type in createRelationship`
- c0112 ..> c0104: `type in getRelationships`
- c0112 ..> c0105: `type in createRelationship`
- c0112 ..> c0108: `type in listFiles`
- c0112 ..> c0114: `type in updateMemory`
- c0112 ..> c0116: `type in updateMemory`
- c0112 ..> c0131: `type in getFile`
- c0113 --> c0114: `field memory`
- c0114 --|> c0116: `inherits`
- c0117 ..> c0122: `type in complete`
- c0117 ..> c0122: `type in prepareCapture`
- c0118 --> c0113: `field linked_memories`
- c0118 --> c0114: `field primary_memories`
- c0122 --> c0098: `field onConversationCompacted`
- c0122 --> c0121: `field readTools`
- c0122 --> c0124: `field submission`
- c0131 --|> c0108: `inherits`
- c0132 --> c0126: `field project`
- c0133 ..> c0133: `rejectedHttpError() calls rejectedHttpStatus()`
- c0138 --|> c0139: `inherits`
- c0139 --> c0134: `field status`
- c0141 --> c0137: `field criteria`
- c0141 --|> c0142: `inherits`
- c0142 --> c0144: `field priority`
- c0142 --> c0145: `field state`
- c0143 --|> c0142: `inherits`
- c0146 ..> c0136: `type in taskCounts`
- c0146 ..> c0139: `type in sortPlans`
- c0146 ..> c0140: `type in mappedProject`
- c0146 ..> c0143: `type in activeTasks`
- c0146 ..> c0143: `type in taskCounts`
- c0150 --> c0147: `field outcome`
- c0150 --> c0151: `field state`
- c0152 ..> c0050: `type in checkpoint`
- c0152 ..> c0051: `type in checkpoint`
- c0152 ..> c0094: `type in enqueue`
- c0152 ..> c0107: `type in resolveConflict`
- c0155 --> c0126: `field projects`
- c0155 --|> c0132: `inherits`
- c0156 --> c0080: `field createCapture`
- c0156 --> c0080: `field createRecall`
- c0156 --> c0109: `field client`
- c0156 --> c0109: `field createCapture`
- c0156 --> c0109: `field createClient`
- c0156 --> c0109: `field createRecall`
- c0156 --> c0152: `field capture`
- c0156 --> c0152: `field createCapture`
- c0156 --> c0155: `field resolveWorkContext`
- c0156 --> c0164: `field createRecall`
- c0156 --> c0164: `field recall`
- c0156 --> c0232: `field createCapture`
- c0156 --> c0232: `field createRecall`
- c0157 --> c0083: `field config`
- c0157 --> c0156: `field dependencies`
- c0157 --> c0159: `field policies`
- c0160 --> c0080: `field config`
- c0160 --> c0109: `field client`
- c0160 --> c0155: `field context`
- c0160 --> c0164: `field recall`
- c0160 --> c0220: `field logger`
- c0160 --> c0232: `field model`
- c0161 --> c0129: `field scope`
- c0163 --> c0165: `field runtime`
- c0163 --> c0263: `field promise`
- c0163 --> c0263: `field result`
- c0164 ..> c0107: `type in recall`
- c0164 ..> c0260: `type in deeper`
- c0164 ..> c0262: `type in recall`
- c0164 ..> c0263: `type in deeper`
- c0164 ..> c0263: `type in recall`
- c0165 --> c0004: `field activity`
- c0165 --> c0025: `field planning`
- c0165 --> c0048: `field captureDeferrals`
- c0165 --> c0051: `field recoveryResult`
- c0165 --> c0080: `field config`
- c0165 --> c0109: `field client`
- c0165 --> c0151: `field pendingCaptureJobs`
- c0165 --> c0152: `field capture`
- c0165 --> c0155: `field context`
- c0165 --> c0161: `field lastRecall`
- c0165 --> c0164: `field recall`
- c0165 --> c0220: `field logger`
- c0165 --> c0232: `field model`
- c0165 --> c0240: `field queue`
- c0167 --> c0148: `field automaticRecalls`
- c0167 --> c0158: `field pendingQueuedRecall`
- c0167 --> c0163: `field recallJobs`
- c0167 --> c0165: `field loading`
- c0167 --> c0165: `field runtime`
- c0168 ..> c0004: `collectCaptureFeedback() calls set()`
- c0168 ..> c0004: `diagnosticCandidateDetail() calls set()`
- c0168 ..> c0004: `pickMemoryModel() calls refresh()`
- c0168 ..> c0009: `createForgetfulExtension() calls setPromptActive()`
- c0168 ..> c0051: `type in captureProcessedJobIds`
- c0168 ..> c0051: `type in readCaptureOutcome`
- c0168 ..> c0070: `log() calls emit()`
- c0168 ..> c0070: `logFailure() calls emit()`
- c0168 ..> c0070: `readCaptureOutcome() calls diagnostics()`
- c0168 ..> c0070: `recordRecallActivity() calls emit()`
- c0168 ..> c0070: `textMessage() calls now()`
- c0168 ..> c0080: `type in log`
- c0168 ..> c0080: `type in logFailure`
- c0168 ..> c0080: `type in makeInstanceId`
- c0168 ..> c0080: `type in policyText`
- c0168 ..> c0080: `type in promptSetupEndpoint`
- c0168 ..> c0084: `type in parseSelection`
- c0168 ..> c0090: `type in log`
- c0168 ..> c0107: `type in recallContextEntries`
- c0168 ..> c0147: `type in automaticCaptureJobOutcome`
- c0168 ..> c0147: `type in readCaptureOutcome`
- c0168 ..> c0147: `type in recordCaptureRetry`
- c0168 ..> c0149: `type in boundedWait`
- c0168 ..> c0150: `type in automaticCaptureFeedback`
- c0168 ..> c0150: `type in collectCaptureFeedback`
- c0168 ..> c0150: `type in recordCaptureRetry`
- c0168 ..> c0152: `type in readCaptureOutcome`
- c0168 ..> c0154: `type in collectDiagnosticParts`
- c0168 ..> c0155: `type in defaultWorkContext`
- c0168 ..> c0155: `type in discoverWorkContext`
- c0168 ..> c0155: `type in snapshotWorkContext`
- c0168 ..> c0157: `type in createForgetfulExtension`
- c0168 ..> c0159: `type in policyText`
- c0168 ..> c0161: `type in recallActivitySummary`
- c0168 ..> c0165: `type in conflictBelongsToActiveBranch`
- c0168 ..> c0165: `type in readCaptureOutcome`
- c0168 ..> c0165: `type in recordRecallActivity`
- c0168 ..> c0166: `type in promptSetupAuthentication`
- c0168 ..> c0168: `automaticCaptureFeedback() calls captureCount()`
- c0168 ..> c0168: `automaticCaptureFeedback() calls captureFeedbackParts()`
- c0168 ..> c0168: `automaticCaptureFeedback() calls collectCaptureFeedback()`
- c0168 ..> c0168: `automaticCaptureJobOutcome() calls boundedErrorDiagnostic()`
- c0168 ..> c0168: `automaticCaptureJobOutcome() calls captureFeedbackReason()`
- c0168 ..> c0168: `automaticRecallTerminalText() calls usefulRecallText()`
- c0168 ..> c0168: `canonicalRepository() calls qualifiedRepository()`
- c0168 ..> c0168: `captureFailurePart() calls captureCount()`
- c0168 ..> c0168: `captureFeedbackParts() calls captureCount()`
- c0168 ..> c0168: `captureFeedbackParts() calls captureFailurePart()`
- c0168 ..> c0168: `captureFeedbackParts() calls skippedReasonBreakdown()`
- c0168 ..> c0168: `collectCaptureFeedback() calls recordCaptureRetry()`
- c0168 ..> c0168: `collectDiagnosticParts() calls diagnosticCandidateDetail()`
- c0168 ..> c0168: `createForgetfulExtension() calls logFailure()`
- c0168 ..> c0168: `createForgetfulExtension() calls notify()`
- c0168 ..> c0168: `createForgetfulExtension() calls sessionKey()`
- c0168 ..> c0168: `diagnosticCandidateDetail() calls diagnosticSourceIds()`
- c0168 ..> c0168: `diagnosticSummary() calls collectDiagnosticParts()`
- c0168 ..> c0168: `discoverWorkContext() calls canonicalRepository()`
- c0168 ..> c0168: `discoverWorkContext() calls defaultWorkContext()`
- c0168 ..> c0168: `latestBranchUserEntry() calls messageContentText()`
- c0168 ..> c0168: `latestContextUserPrompt() calls messageContentText()`
- c0168 ..> c0168: `log() calls notify()`
- c0168 ..> c0168: `logFailure() calls boundedErrorDiagnostic()`
- c0168 ..> c0168: `logFailure() calls log()`
- c0168 ..> c0168: `pickMemoryModel() calls parseSelection()`
- c0168 ..> c0168: `promptSetupAuthentication() calls notify()`
- c0168 ..> c0168: `promptSetupEndpoint() calls notify()`
- c0168 ..> c0168: `promptSetupEndpoint() calls setupEndpointSuggestion()`
- c0168 ..> c0168: `readCaptureOutcome() calls automaticCaptureJobOutcome()`
- c0168 ..> c0168: `recallContextEntries() calls messageContentText()`
- c0168 ..> c0168: `recordRecallActivity() calls log()`
- c0168 ..> c0168: `recordRecallActivity() calls recallActivitySummary()`
- c0168 ..> c0168: `savedRecallResultText() calls usefulRecallText()`
- c0168 ..> c0169: `createForgetfulExtension() calls registerForegroundTool()`
- c0168 ..> c0173: `collectCaptureFeedback() calls get()`
- c0168 ..> c0173: `diagnosticCandidateDetail() calls get()`
- c0168 ..> c0173: `log() calls get()`
- c0168 ..> c0173: `logFailure() calls get()`
- c0168 ..> c0235: `pickMemoryModel() calls availableMemoryModels()`
- c0168 ..> c0235: `pickMemoryModel() calls modelLabel()`
- c0168 ..> c0235: `pickMemoryModel() calls modelSelectionFromModel()`
- c0168 ..> c0236: `automaticCaptureJobOutcome() calls sanitizeText()`
- c0168 ..> c0236: `automaticRecallTerminalText() calls sanitizeText()`
- c0168 ..> c0236: `boundedErrorDiagnostic() calls sanitizeText()`
- c0168 ..> c0236: `captureFeedbackReason() calls sanitizeText()`
- c0168 ..> c0236: `captureJobId() calls sanitizeText()`
- c0168 ..> c0236: `captureProcessedJobIds() calls sanitizeText()`
- c0168 ..> c0236: `diagnosticCandidateDetail() calls sanitizeText()`
- c0168 ..> c0236: `diagnosticSourceIds() calls sanitizeText()`
- c0168 ..> c0236: `log() calls sanitizeText()`
- c0168 ..> c0236: `recallActivitySummary() calls sanitizeText()`
- c0168 ..> c0236: `recallContextEntries() calls sanitizeText()`
- c0168 ..> c0236: `recordRecallActivity() calls sanitizeText()`
- c0168 ..> c0236: `usefulRecallText() calls sanitizeText()`
- c0168 ..> c0263: `type in automaticRecallResultStatus`
- c0168 ..> c0263: `type in automaticRecallTerminalText`
- c0168 ..> c0263: `type in recordRecallActivity`
- c0168 ..> c0263: `type in savedRecallResultText`
- c0168 ..> c0263: `type in usefulRecallText`
- c0168 ..> c0269: `canonicalRepository() calls trim()`
- c0168 ..> c0269: `captureFeedbackReason() calls trim()`
- c0168 ..> c0269: `createForgetfulExtension() calls trim()`
- c0168 ..> c0269: `promptSetupAuthentication() calls trim()`
- c0168 ..> c0269: `promptSetupEndpoint() calls trim()`
- c0168 ..> c0269: `recallContextEntries() calls trim()`
- c0168 ..> c0269: `setupEndpointSuggestion() calls trim()`
- c0168 ..> c0269: `usefulRecallText() calls trim()`
- c0168 ..> c0270: `qualifiedRepository() calls repositoryName()`
- c0170 ..> c0095: `type in createCodeArtifact`
- c0170 ..> c0095: `type in getCodeArtifact`
- c0170 ..> c0096: `type in createCodeArtifact`
- c0170 ..> c0096: `type in updateCodeArtifact`
- c0170 ..> c0097: `type in listCodeArtifacts`
- c0170 ..> c0099: `type in createDocument`
- c0170 ..> c0099: `type in getDocument`
- c0170 ..> c0100: `type in createDocument`
- c0170 ..> c0100: `type in updateDocument`
- c0170 ..> c0101: `type in listDocuments`
- c0170 ..> c0102: `type in createEntity`
- c0170 ..> c0102: `type in getEntity`
- c0170 ..> c0102: `type in searchEntities`
- c0170 ..> c0103: `type in createEntity`
- c0170 ..> c0103: `type in updateEntity`
- c0170 ..> c0104: `type in getRelationships`
- c0170 ..> c0105: `type in createRelationship`
- c0170 ..> c0108: `type in listFiles`
- c0170 ..|> c0112: `implements`
- c0170 --> c0114: `field parseMemory`
- c0170 ..> c0114: `type in constructor`
- c0170 ..> c0116: `type in updateMemory`
- c0170 ..> c0131: `type in getFile`
- c0170 --> c0171: `field request`
- c0170 ..> c0171: `type in constructor`
- c0170 ..> c0172: `createCodeArtifact() calls artifact()`
- c0170 ..> c0172: `createDocument() calls document()`
- c0170 ..> c0172: `createEntity() calls entity()`
- c0170 ..> c0172: `createRelationship() calls relationship()`
- c0170 ..> c0172: `createRelationship() calls requestSegment()`
- c0170 ..> c0172: `getCodeArtifact() calls artifact()`
- c0170 ..> c0172: `getCodeArtifact() calls requestSegment()`
- c0170 ..> c0172: `getDocument() calls document()`
- c0170 ..> c0172: `getDocument() calls requestSegment()`
- c0170 ..> c0172: `getEntity() calls entity()`
- c0170 ..> c0172: `getEntity() calls requestSegment()`
- c0170 ..> c0172: `getEntityMemories() calls id()`
- c0170 ..> c0172: `getEntityMemories() calls object()`
- c0170 ..> c0172: `getEntityMemories() calls records()`
- c0170 ..> c0172: `getEntityMemories() calls requestSegment()`
- c0170 ..> c0172: `getEntityMemories() calls text()`
- c0170 ..> c0172: `getFile() calls fileSummary()`
- c0170 ..> c0172: `getFile() calls object()`
- c0170 ..> c0172: `getFile() calls requestSegment()`
- c0170 ..> c0172: `getFile() calls text()`
- c0170 ..> c0172: `getRelationships() calls records()`
- c0170 ..> c0172: `getRelationships() calls requestSegment()`
- c0170 ..> c0172: `linkEntityMemory() calls object()`
- c0170 ..> c0172: `linkEntityMemory() calls requestSegment()`
- c0170 ..> c0172: `linkMemories() calls ids()`
- c0170 ..> c0172: `linkMemories() calls object()`
- c0170 ..> c0172: `linkMemories() calls requestSegment()`
- c0170 ..> c0172: `listCodeArtifacts() calls projectPath()`
- c0170 ..> c0172: `listCodeArtifacts() calls records()`
- c0170 ..> c0172: `listCodeArtifacts() calls summary()`
- c0170 ..> c0172: `listDocuments() calls projectPath()`
- c0170 ..> c0172: `listDocuments() calls records()`
- c0170 ..> c0172: `listDocuments() calls summary()`
- c0170 ..> c0172: `listFiles() calls projectPath()`
- c0170 ..> c0172: `listFiles() calls records()`
- c0170 ..> c0172: `searchEntities() calls records()`
- c0170 ..> c0172: `unlinkMemories() calls object()`
- c0170 ..> c0172: `unlinkMemories() calls requestSegment()`
- c0170 ..> c0172: `updateCodeArtifact() calls artifact()`
- c0170 ..> c0172: `updateCodeArtifact() calls requestSegment()`
- c0170 ..> c0172: `updateDocument() calls document()`
- c0170 ..> c0172: `updateDocument() calls requestSegment()`
- c0170 ..> c0172: `updateEntity() calls entity()`
- c0170 ..> c0172: `updateEntity() calls requestSegment()`
- c0170 ..> c0172: `updateMemory() calls requestSegment()`
- c0170 ..> c0177: `createCodeArtifact() calls request()`
- c0170 ..> c0177: `createDocument() calls request()`
- c0170 ..> c0177: `createEntity() calls request()`
- c0170 ..> c0177: `createRelationship() calls request()`
- c0170 ..> c0177: `getCodeArtifact() calls request()`
- c0170 ..> c0177: `getDocument() calls request()`
- c0170 ..> c0177: `getEntity() calls request()`
- c0170 ..> c0177: `getEntityMemories() calls request()`
- c0170 ..> c0177: `getFile() calls request()`
- c0170 ..> c0177: `getRelationships() calls request()`
- c0170 ..> c0177: `linkEntityMemory() calls request()`
- c0170 ..> c0177: `linkMemories() calls request()`
- c0170 ..> c0177: `listCodeArtifacts() calls request()`
- c0170 ..> c0177: `listDocuments() calls request()`
- c0170 ..> c0177: `listFiles() calls request()`
- c0170 ..> c0177: `searchEntities() calls request()`
- c0170 ..> c0177: `unlinkMemories() calls request()`
- c0170 ..> c0177: `updateCodeArtifact() calls request()`
- c0170 ..> c0177: `updateDocument() calls request()`
- c0170 ..> c0177: `updateEntity() calls request()`
- c0170 ..> c0177: `updateMemory() calls request()`
- c0170 ..> c0178: `getFile() constructs ForgetfulSchemaError`
- c0170 ..> c0178: `linkEntityMemory() constructs ForgetfulSchemaError`
- c0170 ..> c0178: `linkMemories() constructs ForgetfulSchemaError`
- c0170 ..> c0178: `unlinkMemories() constructs ForgetfulSchemaError`
- c0170 ..> c0180: `linkMemories() calls parseMemory()`
- c0170 ..> c0180: `updateMemory() calls parseMemory()`
- c0172 ..> c0095: `type in artifact`
- c0172 ..> c0096: `type in resourceBody`
- c0172 ..> c0097: `type in summary`
- c0172 ..> c0099: `type in document`
- c0172 ..> c0100: `type in resourceBody`
- c0172 ..> c0101: `type in summary`
- c0172 ..> c0102: `type in entity`
- c0172 ..> c0103: `type in entityBody`
- c0172 ..> c0104: `type in relationship`
- c0172 ..> c0105: `type in relationshipBody`
- c0172 ..> c0108: `type in fileSummary`
- c0172 ..> c0128: `type in provenance`
- c0172 ..> c0172: `artifact() calls id()`
- c0172 ..> c0172: `artifact() calls object()`
- c0172 ..> c0172: `artifact() calls resourceBody()`
- c0172 ..> c0172: `document() calls id()`
- c0172 ..> c0172: `document() calls object()`
- c0172 ..> c0172: `document() calls resourceBody()`
- c0172 ..> c0172: `entity() calls entityBody()`
- c0172 ..> c0172: `entity() calls id()`
- c0172 ..> c0172: `entity() calls object()`
- c0172 ..> c0172: `entityBody() calls ids()`
- c0172 ..> c0172: `entityBody() calls object()`
- c0172 ..> c0172: `entityBody() calls provenance()`
- c0172 ..> c0172: `entityBody() calls strings()`
- c0172 ..> c0172: `entityBody() calls text()`
- c0172 ..> c0172: `fileSummary() calls id()`
- c0172 ..> c0172: `fileSummary() calls object()`
- c0172 ..> c0172: `fileSummary() calls strings()`
- c0172 ..> c0172: `fileSummary() calls text()`
- c0172 ..> c0172: `memoryMetadata() calls ids()`
- c0172 ..> c0172: `memoryMetadata() calls provenance()`
- c0172 ..> c0172: `provenance() calls strings()`
- c0172 ..> c0172: `provenance() calls text()`
- c0172 ..> c0172: `records() calls object()`
- c0172 ..> c0172: `relationship() calls id()`
- c0172 ..> c0172: `relationship() calls object()`
- c0172 ..> c0172: `relationship() calls relationshipBody()`
- c0172 ..> c0172: `relationshipBody() calls id()`
- c0172 ..> c0172: `relationshipBody() calls object()`
- c0172 ..> c0172: `relationshipBody() calls provenance()`
- c0172 ..> c0172: `relationshipBody() calls text()`
- c0172 ..> c0172: `resourceBody() calls id()`
- c0172 ..> c0172: `resourceBody() calls object()`
- c0172 ..> c0172: `resourceBody() calls provenance()`
- c0172 ..> c0172: `resourceBody() calls strings()`
- c0172 ..> c0172: `resourceBody() calls text()`
- c0172 ..> c0172: `summary() calls id()`
- c0172 ..> c0172: `summary() calls object()`
- c0172 ..> c0172: `summary() calls provenance()`
- c0172 ..> c0172: `summary() calls strings()`
- c0172 ..> c0172: `summary() calls text()`
- c0172 ..> c0178: `entityBody() constructs ForgetfulSchemaError`
- c0172 ..> c0178: `fileSummary() constructs ForgetfulSchemaError`
- c0172 ..> c0178: `id() constructs ForgetfulSchemaError`
- c0172 ..> c0178: `ids() constructs ForgetfulSchemaError`
- c0172 ..> c0178: `object() constructs ForgetfulSchemaError`
- c0172 ..> c0178: `records() constructs ForgetfulSchemaError`
- c0172 ..> c0178: `strings() constructs ForgetfulSchemaError`
- c0172 ..> c0178: `text() constructs ForgetfulSchemaError`
- c0172 ..> c0269: `text() calls trim()`
- c0173 ..> c0004: `listProjects() calls set()`
- c0173 ..|> c0109: `implements`
- c0173 ..> c0114: `type in get`
- c0173 ..> c0114: `type in search`
- c0173 ..> c0115: `type in create`
- c0173 ..> c0116: `type in create`
- c0173 ..> c0118: `type in queryMemory`
- c0173 ..> c0126: `type in createProject`
- c0173 ..> c0126: `type in linkProject`
- c0173 ..> c0126: `type in listProjects`
- c0173 ..> c0127: `type in createProject`
- c0173 ..> c0130: `type in queryMemory`
- c0173 ..> c0130: `type in search`
- c0173 ..> c0172: `get() calls requestSegment()`
- c0173 ..> c0172: `getMemoryEntityIds() calls requestSegment()`
- c0173 ..> c0172: `obsolete() calls requestSegment()`
- c0173 ..> c0173: `linkProject() calls validId()`
- c0173 ..> c0173: `supersede() calls obsolete()`
- c0173 --|> c0177: `inherits`
- c0173 ..> c0177: `create() calls request()`
- c0173 ..> c0177: `createProject() calls request()`
- c0173 ..> c0177: `get() calls request()`
- c0173 ..> c0177: `getMemoryEntityIds() calls request()`
- c0173 ..> c0177: `linkProject() calls request()`
- c0173 ..> c0177: `listProjects() calls endpoint()`
- c0173 ..> c0177: `listProjects() calls request()`
- c0173 ..> c0177: `obsolete() calls request()`
- c0173 ..> c0177: `queryMemory() calls request()`
- c0173 ..> c0177: `search() calls request()`
- c0173 ..> c0178: `create() constructs ForgetfulSchemaError`
- c0173 ..> c0178: `getMemoryEntityIds() constructs ForgetfulSchemaError`
- c0173 ..> c0178: `listProjects() constructs ForgetfulSchemaError`
- c0173 ..> c0178: `obsolete() constructs ForgetfulSchemaError`
- c0173 ..> c0180: `create() calls integerArray()`
- c0173 ..> c0180: `create() calls isObject()`
- c0173 ..> c0180: `create() calls requiredInteger()`
- c0173 ..> c0180: `createProject() calls parseProject()`
- c0173 ..> c0180: `createProject() calls projectText()`
- c0173 ..> c0180: `get() calls parseMemory()`
- c0173 ..> c0180: `getMemoryEntityIds() calls directEntityId()`
- c0173 ..> c0180: `getMemoryEntityIds() calls isObject()`
- c0173 ..> c0180: `linkProject() calls parseProject()`
- c0173 ..> c0180: `listProjects() calls isObject()`
- c0173 ..> c0180: `listProjects() calls parseProject()`
- c0173 ..> c0180: `obsolete() calls isObject()`
- c0173 ..> c0180: `queryMemory() calls defaultWhenOmitted()`
- c0173 ..> c0180: `queryMemory() calls parseSearchPayload()`
- c0173 ..> c0180: `queryMemory() calls searchBody()`
- c0173 ..> c0180: `search() calls flattenSearchResult()`
- c0173 ..> c0180: `search() calls parseSearchPayload()`
- c0173 ..> c0180: `search() calls searchBody()`
- c0173 ..> c0270: `createProject() calls repositoryName()`
- c0173 ..> c0270: `linkProject() calls repositoryName()`
- c0177 ..> c0004: `readResponse() calls set()`
- c0177 ..> c0005: `readResponse() calls read()`
- c0177 ..> c0111: `type in fieldLimits`
- c0177 ..> c0173: `readResponse() calls get()`
- c0177 ..> c0174: `type in constructor`
- c0177 ..> c0176: `throwResponseError() constructs ForgetfulHttpError`
- c0177 ..> c0177: `fieldLimits() calls getDeployment()`
- c0177 ..> c0177: `getDeployment() calls request()`
- c0177 ..> c0177: `getJson() calls request()`
- c0177 ..> c0177: `request() calls endpoint()`
- c0177 ..> c0177: `request() calls fetchImpl()`
- c0177 ..> c0177: `request() calls readResponse()`
- c0177 ..> c0177: `request() calls responseByteLimit()`
- c0177 ..> c0177: `request() calls throwResponseError()`
- c0177 ..> c0177: `throwResponseError() calls readResponse()`
- c0177 ..> c0178: `readResponse() constructs ForgetfulSchemaError`
- c0177 ..> c0179: `request() constructs ForgetfulTimeoutError`
- c0177 ..> c0180: `constructor() calls localHost()`
- c0177 ..> c0180: `constructor() calls trimTrailingSlashes()`
- c0177 ..> c0180: `fieldLimits() calls parseFieldLimits()`
- c0177 ..> c0180: `request() calls makeAbortError()`
- c0177 ..> c0180: `request() calls parseJson()`
- c0177 ..> c0240: `readResponse() calls cancel()`
- c0180 ..> c0004: `uniqueMemories() calls set()`
- c0180 ..> c0111: `type in parseFieldLimits`
- c0180 ..> c0113: `type in parseLinkedMemories`
- c0180 ..> c0114: `type in flattenSearchResult`
- c0180 ..> c0114: `type in parseMemory`
- c0180 ..> c0114: `type in uniqueMemories`
- c0180 ..> c0118: `type in flattenSearchResult`
- c0180 ..> c0118: `type in parseSearchPayload`
- c0180 ..> c0126: `type in parseProject`
- c0180 ..> c0130: `type in searchBody`
- c0180 ..> c0172: `parseMemory() calls memoryMetadata()`
- c0180 ..> c0175: `makeAbortError() constructs ForgetfulAbortError`
- c0180 ..> c0175: `type in makeAbortError`
- c0180 ..> c0178: `directEntityId() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `integerArray() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `nonNegativeInteger() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `optionalString() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `parseJson() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `parseLinkedMemories() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `parseMemory() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `parseProject() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `parseSearchPayload() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `requiredInteger() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `requiredString() constructs ForgetfulSchemaError`
- c0180 ..> c0178: `stringArray() constructs ForgetfulSchemaError`
- c0180 ..> c0180: `directEntityId() calls isObject()`
- c0180 ..> c0180: `directEntityId() calls requiredInteger()`
- c0180 ..> c0180: `flattenSearchResult() calls uniqueMemories()`
- c0180 ..> c0180: `parseFieldLimits() calls plainObject()`
- c0180 ..> c0180: `parseLinkedMemories() calls isObject()`
- c0180 ..> c0180: `parseLinkedMemories() calls parseMemory()`
- c0180 ..> c0180: `parseLinkedMemories() calls requiredInteger()`
- c0180 ..> c0180: `parseMemory() calls integerArray()`
- c0180 ..> c0180: `parseMemory() calls isObject()`
- c0180 ..> c0180: `parseMemory() calls nonNegativeInteger()`
- c0180 ..> c0180: `parseMemory() calls optionalString()`
- c0180 ..> c0180: `parseMemory() calls requiredInteger()`
- c0180 ..> c0180: `parseMemory() calls requiredString()`
- c0180 ..> c0180: `parseMemory() calls stringArray()`
- c0180 ..> c0180: `parseProject() calls isObject()`
- c0180 ..> c0180: `parseProject() calls optionalString()`
- c0180 ..> c0180: `parseProject() calls requiredInteger()`
- c0180 ..> c0180: `parseProject() calls requiredString()`
- c0180 ..> c0180: `parseSearchPayload() calls isObject()`
- c0180 ..> c0180: `parseSearchPayload() calls nonNegativeInteger()`
- c0180 ..> c0180: `parseSearchPayload() calls parseLinkedMemories()`
- c0180 ..> c0180: `parseSearchPayload() calls parseMemory()`
- c0180 ..> c0180: `parseSearchPayload() calls requiredString()`
- c0180 ..> c0180: `searchBody() calls defaultWhenOmitted()`
- c0180 ..> c0269: `projectText() calls trim()`
- c0181 --> c0095: `field artifacts`
- c0181 --> c0099: `field documents`
- c0181 --> c0108: `field files`
- c0182 --|> c0183: `inherits`
- c0182 --> c0184: `field failures`
- c0183 --> c0114: `field memories`
- c0183 --> c0129: `field scope`
- c0185 ..> c0004: `collectRelationships() calls set()`
- c0185 ..> c0004: `findEntities() calls set()`
- c0185 ..> c0004: `resolveRelationshipEndpoints() calls set()`
- c0185 ..> c0095: `type in appendArtifactLines`
- c0185 ..> c0099: `type in appendDocumentLines`
- c0185 ..> c0102: `type in appendEntityLines`
- c0185 ..> c0102: `type in collectEntityMemories`
- c0185 ..> c0102: `type in collectRelationships`
- c0185 ..> c0102: `type in findEntities`
- c0185 ..> c0102: `type in findEntityMemories`
- c0185 ..> c0102: `type in findRelationships`
- c0185 ..> c0102: `type in formatExpansion`
- c0185 ..> c0102: `type in formatRelationships`
- c0185 ..> c0102: `type in resolveRelationshipEndpoints`
- c0185 ..> c0104: `type in collectRelationships`
- c0185 ..> c0104: `type in formatRelationships`
- c0185 ..> c0104: `type in resolveRelationshipEndpoints`
- c0185 ..> c0108: `type in appendFileLines`
- c0185 --> c0112: `field client`
- c0185 ..> c0112: `type in constructor`
- c0185 ..> c0170: `collectRelationships() calls getRelationships()`
- c0185 ..> c0170: `findAttachments() calls getCodeArtifact()`
- c0185 ..> c0170: `findAttachments() calls getDocument()`
- c0185 ..> c0170: `findAttachments() calls listFiles()`
- c0185 ..> c0170: `findEntities() calls getEntity()`
- c0185 ..> c0170: `findEntities() calls searchEntities()`
- c0185 ..> c0170: `findEntityMemories() calls getEntityMemories()`
- c0185 ..> c0170: `resolveRelationshipEndpoints() calls getEntity()`
- c0185 ..> c0173: `formatRelationships() calls get()`
- c0185 ..> c0181: `type in findAttachments`
- c0185 ..> c0181: `type in formatExpansion`
- c0185 ..> c0182: `type in collectEntityMemories`
- c0185 ..> c0182: `type in collectRelationships`
- c0185 ..> c0182: `type in findAttachments`
- c0185 ..> c0182: `type in findEntities`
- c0185 ..> c0182: `type in findEntityMemories`
- c0185 ..> c0182: `type in findRelationships`
- c0185 ..> c0182: `type in isAllowedEntityMemory`
- c0185 ..> c0182: `type in resolveRelationshipEndpoints`
- c0185 ..> c0183: `type in expand`
- c0185 ..> c0183: `type in formatRelationships`
- c0185 ..> c0184: `type in emptyExpansion`
- c0185 ..> c0184: `type in expand`
- c0185 ..> c0184: `type in formatExpansion`
- c0185 ..> c0185: `collectEntityMemories() calls isAllowedEntityMemory()`
- c0185 ..> c0185: `expand() calls emptyExpansion()`
- c0185 ..> c0185: `expand() calls findAttachments()`
- c0185 ..> c0185: `expand() calls findEntities()`
- c0185 ..> c0185: `expand() calls findEntityMemories()`
- c0185 ..> c0185: `expand() calls findRelationships()`
- c0185 ..> c0185: `expand() calls formatExpansion()`
- c0185 ..> c0185: `findEntityMemories() calls collectEntityMemories()`
- c0185 ..> c0185: `findRelationships() calls collectRelationships()`
- c0185 ..> c0185: `findRelationships() calls formatRelationships()`
- c0185 ..> c0185: `findRelationships() calls resolveRelationshipEndpoints()`
- c0185 ..> c0185: `formatExpansion() calls appendArtifactLines()`
- c0185 ..> c0185: `formatExpansion() calls appendDocumentLines()`
- c0185 ..> c0185: `formatExpansion() calls appendEntityLines()`
- c0185 ..> c0185: `formatExpansion() calls appendFileLines()`
- c0185 ..> c0185: `formatExpansion() calls appendLinkedMemoryLines()`
- c0185 ..> c0185: `formatExpansion() calls appendRelationshipLines()`
- c0185 ..> c0186: `type in constructor`
- c0185 ..> c0187: `type in appendLinkedMemoryLines`
- c0185 ..> c0187: `type in collectEntityMemories`
- c0185 ..> c0187: `type in findEntityMemories`
- c0185 ..> c0187: `type in formatExpansion`
- c0185 --> c0188: `field readMemory`
- c0185 ..> c0188: `type in constructor`
- c0185 ..> c0189: `type in appendRelationshipLines`
- c0185 ..> c0189: `type in findRelationships`
- c0185 ..> c0189: `type in formatExpansion`
- c0185 ..> c0189: `type in formatRelationships`
- c0185 ..> c0190: `appendArtifactLines() calls clean()`
- c0185 ..> c0190: `appendDocumentLines() calls clean()`
- c0185 ..> c0190: `appendEntityLines() calls clean()`
- c0185 ..> c0190: `appendFileLines() calls clean()`
- c0185 ..> c0190: `appendLinkedMemoryLines() calls clean()`
- c0185 ..> c0190: `appendRelationshipLines() calls clean()`
- c0185 ..> c0190: `collectEntityMemories() calls validId()`
- c0185 ..> c0190: `collectRelationships() calls safeCall()`
- c0185 ..> c0190: `collectRelationships() calls validRelationship()`
- c0185 ..> c0190: `expand() calls safeCall()`
- c0185 ..> c0190: `findAttachments() calls inProjectScope()`
- c0185 ..> c0190: `findAttachments() calls safeCall()`
- c0185 ..> c0190: `findAttachments() calls validId()`
- c0185 ..> c0190: `findEntities() calls inEntityScope()`
- c0185 ..> c0190: `findEntities() calls safeCall()`
- c0185 ..> c0190: `findEntities() calls validEntity()`
- c0185 ..> c0190: `findEntityMemories() calls safeCall()`
- c0185 ..> c0190: `formatRelationships() calls inEntityScope()`
- c0185 ..> c0190: `isAllowedEntityMemory() calls safeCall()`
- c0185 ..> c0190: `isAllowedEntityMemory() calls validMemory()`
- c0185 ..> c0190: `resolveRelationshipEndpoints() calls safeCall()`
- c0185 ..> c0190: `resolveRelationshipEndpoints() calls validEntity()`
- c0185 ..> c0236: `expand() calls errorMessage()`
- c0185 ..> c0269: `findEntities() calls trim()`
- c0186 --> c0188: `field readMemory`
- c0187 --> c0102: `field entity`
- c0189 --> c0102: `field source`
- c0189 --> c0102: `field target`
- c0189 --> c0104: `field relationship`
- c0190 ..> c0102: `type in inEntityScope`
- c0190 ..> c0102: `type in validEntity`
- c0190 ..> c0104: `type in validRelationship`
- c0190 ..> c0114: `type in validMemory`
- c0190 ..> c0129: `type in inEntityScope`
- c0190 ..> c0129: `type in inProjectScope`
- c0190 ..> c0182: `type in safeCall`
- c0190 ..> c0190: `inEntityScope() calls validId()`
- c0190 ..> c0190: `inProjectScope() calls validId()`
- c0190 ..> c0190: `validEntity() calls validId()`
- c0190 ..> c0190: `validMemory() calls validId()`
- c0190 ..> c0190: `validRelationship() calls validId()`
- c0190 ..> c0236: `clean() calls sanitizeText()`
- c0190 ..> c0236: `safeCall() calls errorMessage()`
- c0190 ..> c0236: `safeCall() calls sanitizeText()`
- c0190 ..> c0269: `validRelationship() calls trim()`
- c0191 --> c0109: `field client`
- c0191 --> c0112: `field knowledge`
- c0191 --> c0192: `field request`
- c0191 --> c0193: `field context`
- c0193 --> c0129: `field scope`
- c0194 --> c0131: `field file`
- c0194 --> c0198: `field content`
- c0194 --> c0199: `field content`
- c0195 --> c0109: `field client`
- c0195 --> c0112: `field knowledge`
- c0195 --> c0193: `field context`
- c0195 --> c0196: `field request`
- c0200 ..> c0095: `type in page`
- c0200 ..> c0099: `type in page`
- c0200 ..> c0102: `type in assertReadEntity`
- c0200 ..> c0102: `type in entityInProject`
- c0200 ..> c0102: `type in hydrateEntities`
- c0200 ..> c0102: `type in inEntityProject`
- c0200 ..> c0106: `type in isEntityType`
- c0200 ..> c0109: `type in assertReadMemory`
- c0200 ..> c0109: `type in createMemory`
- c0200 ..> c0109: `type in executeKnowledgeRead`
- c0200 ..> c0109: `type in executeKnowledgeWrite`
- c0200 ..> c0109: `type in memoryInProject`
- c0200 ..> c0109: `type in resolveWriteProject`
- c0200 ..> c0109: `type in rich`
- c0200 ..> c0112: `type in assertReadEntity`
- c0200 ..> c0112: `type in createCodeArtifact`
- c0200 ..> c0112: `type in createDocument`
- c0200 ..> c0112: `type in createEntity`
- c0200 ..> c0112: `type in entityInProject`
- c0200 ..> c0112: `type in hydrateEntities`
- c0200 ..> c0112: `type in requireReadKnowledge`
- c0200 ..> c0112: `type in rich`
- c0200 ..> c0112: `type in validateAttachments`
- c0200 ..> c0114: `type in assertReadMemory`
- c0200 ..> c0114: `type in inMemoryProject`
- c0200 ..> c0114: `type in memoryInProject`
- c0200 ..> c0114: `type in replacementMemory`
- c0200 ..> c0128: `type in updateProvenance`
- c0200 ..> c0131: `type in fileContent`
- c0200 ..> c0170: `assertReadEntity() calls getEntity()`
- c0200 ..> c0170: `createCodeArtifact() calls createCodeArtifact()`
- c0200 ..> c0170: `createDocument() calls createDocument()`
- c0200 ..> c0170: `createEntity() calls createEntity()`
- c0200 ..> c0170: `createRelationship() calls createRelationship()`
- c0200 ..> c0170: `entityInProject() calls getEntity()`
- c0200 ..> c0170: `hydrateEntities() calls getEntity()`
- c0200 ..> c0170: `linkEntityMemory() calls linkEntityMemory()`
- c0200 ..> c0170: `linkMemories() calls linkMemories()`
- c0200 ..> c0170: `readCodeArtifact() calls getCodeArtifact()`
- c0200 ..> c0170: `readCodeArtifacts() calls listCodeArtifacts()`
- c0200 ..> c0170: `readDocument() calls getDocument()`
- c0200 ..> c0170: `readDocuments() calls listDocuments()`
- c0200 ..> c0170: `readEntities() calls searchEntities()`
- c0200 ..> c0170: `readEntityMemories() calls getEntityMemories()`
- c0200 ..> c0170: `readFile() calls getFile()`
- c0200 ..> c0170: `readFiles() calls listFiles()`
- c0200 ..> c0170: `readRelationships() calls getEntity()`
- c0200 ..> c0170: `readRelationships() calls getRelationships()`
- c0200 ..> c0170: `updateCodeArtifact() calls getCodeArtifact()`
- c0200 ..> c0170: `updateCodeArtifact() calls updateCodeArtifact()`
- c0200 ..> c0170: `updateDocument() calls getDocument()`
- c0200 ..> c0170: `updateDocument() calls updateDocument()`
- c0200 ..> c0170: `updateEntity() calls updateEntity()`
- c0200 ..> c0170: `updateMemory() calls updateMemory()`
- c0200 ..> c0170: `validateAttachments() calls getCodeArtifact()`
- c0200 ..> c0170: `validateAttachments() calls getDocument()`
- c0200 ..> c0170: `validateAttachments() calls getFile()`
- c0200 ..> c0173: `assertReadMemory() calls get()`
- c0200 ..> c0173: `createMemory() calls create()`
- c0200 ..> c0173: `memoryInProject() calls get()`
- c0200 ..> c0173: `readEntityMemories() calls get()`
- c0200 ..> c0173: `readMemories() calls queryMemory()`
- c0200 ..> c0173: `readProjects() calls listProjects()`
- c0200 ..> c0173: `replacementMemory() calls create()`
- c0200 ..> c0173: `replacementMemory() calls get()`
- c0200 ..> c0173: `resolveWriteProject() calls listProjects()`
- c0200 ..> c0173: `supersedeMemory() calls supersede()`
- c0200 ..> c0191: `type in readCodeArtifact`
- c0200 ..> c0191: `type in readCodeArtifacts`
- c0200 ..> c0191: `type in readDocument`
- c0200 ..> c0191: `type in readDocuments`
- c0200 ..> c0191: `type in readEntities`
- c0200 ..> c0191: `type in readEntity`
- c0200 ..> c0191: `type in readEntityMemories`
- c0200 ..> c0191: `type in readFile`
- c0200 ..> c0191: `type in readFiles`
- c0200 ..> c0191: `type in readMemories`
- c0200 ..> c0191: `type in readMemory`
- c0200 ..> c0191: `type in readProjects`
- c0200 ..> c0191: `type in readRelationships`
- c0200 ..> c0191: `type in requestedReadProject`
- c0200 ..> c0191: `type in requireReadKnowledge`
- c0200 ..> c0192: `type in executeKnowledgeRead`
- c0200 ..> c0192: `type in validateKnowledgeReadRequest`
- c0200 ..> c0193: `type in assertReadEntity`
- c0200 ..> c0193: `type in assertReadMemory`
- c0200 ..> c0193: `type in createCodeArtifact`
- c0200 ..> c0193: `type in createDocument`
- c0200 ..> c0193: `type in createEntity`
- c0200 ..> c0193: `type in createMemory`
- c0200 ..> c0193: `type in currentProject`
- c0200 ..> c0193: `type in effectiveCommit`
- c0200 ..> c0193: `type in executeKnowledgeRead`
- c0200 ..> c0193: `type in executeKnowledgeWrite`
- c0200 ..> c0193: `type in provenance`
- c0200 ..> c0193: `type in resolveWriteProject`
- c0200 ..> c0193: `type in updateProvenance`
- c0200 ..> c0194: `type in createCodeArtifact`
- c0200 ..> c0194: `type in createDocument`
- c0200 ..> c0194: `type in createEntity`
- c0200 ..> c0194: `type in createMemory`
- c0200 ..> c0194: `type in createRelationship`
- c0200 ..> c0194: `type in executeKnowledgeRead`
- c0200 ..> c0194: `type in executeKnowledgeWrite`
- c0200 ..> c0194: `type in linkEntityMemory`
- c0200 ..> c0194: `type in linkMemories`
- c0200 ..> c0194: `type in readCodeArtifact`
- c0200 ..> c0194: `type in readCodeArtifacts`
- c0200 ..> c0194: `type in readDocument`
- c0200 ..> c0194: `type in readDocuments`
- c0200 ..> c0194: `type in readEntities`
- c0200 ..> c0194: `type in readEntity`
- c0200 ..> c0194: `type in readEntityMemories`
- c0200 ..> c0194: `type in readFile`
- c0200 ..> c0194: `type in readFiles`
- c0200 ..> c0194: `type in readMemories`
- c0200 ..> c0194: `type in readMemory`
- c0200 ..> c0194: `type in readProjects`
- c0200 ..> c0194: `type in readRelationships`
- c0200 ..> c0194: `type in readResult`
- c0200 ..> c0194: `type in supersedeMemory`
- c0200 ..> c0194: `type in updateCodeArtifact`
- c0200 ..> c0194: `type in updateDocument`
- c0200 ..> c0194: `type in updateEntity`
- c0200 ..> c0194: `type in updateMemory`
- c0200 ..> c0194: `type in writeResult`
- c0200 ..> c0195: `type in createRelationship`
- c0200 ..> c0195: `type in linkEntityMemory`
- c0200 ..> c0195: `type in linkMemories`
- c0200 ..> c0195: `type in replacementMemory`
- c0200 ..> c0195: `type in supersedeMemory`
- c0200 ..> c0195: `type in updateCodeArtifact`
- c0200 ..> c0195: `type in updateDocument`
- c0200 ..> c0195: `type in updateEntity`
- c0200 ..> c0195: `type in updateMemory`
- c0200 ..> c0196: `type in executeKnowledgeWrite`
- c0200 ..> c0196: `type in validateKnowledgeWriteRequest`
- c0200 ..> c0197: `type in resolveWriteProject`
- c0200 ..> c0198: `type in fileContent`
- c0200 ..> c0199: `type in fileContent`
- c0200 ..> c0200: `assertReadEntity() calls currentProject()`
- c0200 ..> c0200: `assertReadEntity() calls inEntityProject()`
- c0200 ..> c0200: `assertReadMemory() calls currentProject()`
- c0200 ..> c0200: `assertReadMemory() calls inMemoryProject()`
- c0200 ..> c0200: `boundedId() calls optionalId()`
- c0200 ..> c0200: `boundedListPage() calls compactWriteValue()`
- c0200 ..> c0200: `boundedListPage() calls json()`
- c0200 ..> c0200: `boundedListPage() calls listPage()`
- c0200 ..> c0200: `commit() calls optionalText()`
- c0200 ..> c0200: `compactObjectEntry() calls compactWriteValue()`
- c0200 ..> c0200: `compactWriteValue() calls compactObjectEntry()`
- c0200 ..> c0200: `compactWriteValue() calls compactString()`
- c0200 ..> c0200: `createCodeArtifact() calls beforeMutation()`
- c0200 ..> c0200: `createCodeArtifact() calls provenance()`
- c0200 ..> c0200: `createCodeArtifact() calls writeResult()`
- c0200 ..> c0200: `createDocument() calls beforeMutation()`
- c0200 ..> c0200: `createDocument() calls provenance()`
- c0200 ..> c0200: `createDocument() calls writeResult()`
- c0200 ..> c0200: `createEntity() calls beforeMutation()`
- c0200 ..> c0200: `createEntity() calls provenance()`
- c0200 ..> c0200: `createEntity() calls writeResult()`
- c0200 ..> c0200: `createMemory() calls beforeMutation()`
- c0200 ..> c0200: `createMemory() calls provenance()`
- c0200 ..> c0200: `createMemory() calls rich()`
- c0200 ..> c0200: `createMemory() calls validateAttachments()`
- c0200 ..> c0200: `createMemory() calls writeResult()`
- c0200 ..> c0200: `createRelationship() calls beforeMutation()`
- c0200 ..> c0200: `createRelationship() calls entityInProject()`
- c0200 ..> c0200: `createRelationship() calls provenance()`
- c0200 ..> c0200: `createRelationship() calls writeResult()`
- c0200 ..> c0200: `executeKnowledgeRead() calls currentProject()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readCodeArtifact()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readCodeArtifacts()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readDocument()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readDocuments()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readEntities()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readEntity()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readEntityMemories()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readFile()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readFiles()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readMemories()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readMemory()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readProjects()`
- c0200 ..> c0200: `executeKnowledgeRead() calls readRelationships()`
- c0200 ..> c0200: `executeKnowledgeRead() calls validateKnowledgeReadRequest()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls createCodeArtifact()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls createDocument()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls createEntity()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls createMemory()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls createRelationship()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls effectiveCommit()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls linkEntityMemory()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls linkMemories()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls rejectSensitiveInput()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls resolveWriteProject()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls rich()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls supersedeMemory()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls updateCodeArtifact()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls updateDocument()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls updateEntity()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls updateMemory()`
- c0200 ..> c0200: `executeKnowledgeWrite() calls validateKnowledgeWriteRequest()`
- c0200 ..> c0200: `fileContent() calls json()`
- c0200 ..> c0200: `linkEntityMemory() calls beforeMutation()`
- c0200 ..> c0200: `linkEntityMemory() calls entityInProject()`
- c0200 ..> c0200: `linkEntityMemory() calls memoryInProject()`
- c0200 ..> c0200: `linkEntityMemory() calls writeResult()`
- c0200 ..> c0200: `linkMemories() calls beforeMutation()`
- c0200 ..> c0200: `linkMemories() calls memoryInProject()`
- c0200 ..> c0200: `linkMemories() calls writeResult()`
- c0200 ..> c0200: `need() calls requiredText()`
- c0200 ..> c0200: `optionalId() calls requiredId()`
- c0200 ..> c0200: `optionalIds() calls requiredIds()`
- c0200 ..> c0200: `optionalStrings() calls requiredStrings()`
- c0200 ..> c0200: `optionalText() calls requiredText()`
- c0200 ..> c0200: `provenance() calls effectiveCommit()`
- c0200 ..> c0200: `readCodeArtifact() calls page()`
- c0200 ..> c0200: `readCodeArtifact() calls readResult()`
- c0200 ..> c0200: `readCodeArtifact() calls requireReadKnowledge()`
- c0200 ..> c0200: `readCodeArtifacts() calls boundedListPage()`
- c0200 ..> c0200: `readCodeArtifacts() calls readResult()`
- c0200 ..> c0200: `readCodeArtifacts() calls requestedReadProject()`
- c0200 ..> c0200: `readCodeArtifacts() calls requireReadKnowledge()`
- c0200 ..> c0200: `readDocument() calls page()`
- c0200 ..> c0200: `readDocument() calls readResult()`
- c0200 ..> c0200: `readDocument() calls requireReadKnowledge()`
- c0200 ..> c0200: `readDocuments() calls boundedListPage()`
- c0200 ..> c0200: `readDocuments() calls readResult()`
- c0200 ..> c0200: `readDocuments() calls requestedReadProject()`
- c0200 ..> c0200: `readDocuments() calls requireReadKnowledge()`
- c0200 ..> c0200: `readEntities() calls boundedListPage()`
- c0200 ..> c0200: `readEntities() calls hydrateEntities()`
- c0200 ..> c0200: `readEntities() calls inEntityProject()`
- c0200 ..> c0200: `readEntities() calls readResult()`
- c0200 ..> c0200: `readEntities() calls requestedReadProject()`
- c0200 ..> c0200: `readEntities() calls requireReadKnowledge()`
- c0200 ..> c0200: `readEntity() calls assertReadEntity()`
- c0200 ..> c0200: `readEntity() calls readResult()`
- c0200 ..> c0200: `readEntity() calls requireReadKnowledge()`
- c0200 ..> c0200: `readEntityMemories() calls assertReadEntity()`
- c0200 ..> c0200: `readEntityMemories() calls compactWriteValue()`
- c0200 ..> c0200: `readEntityMemories() calls inMemoryProject()`
- c0200 ..> c0200: `readEntityMemories() calls listPage()`
- c0200 ..> c0200: `readEntityMemories() calls readResult()`
- c0200 ..> c0200: `readEntityMemories() calls requireReadKnowledge()`
- c0200 ..> c0200: `readFile() calls fileContent()`
- c0200 ..> c0200: `readFile() calls requireReadKnowledge()`
- c0200 ..> c0200: `readFiles() calls boundedListPage()`
- c0200 ..> c0200: `readFiles() calls readResult()`
- c0200 ..> c0200: `readFiles() calls requestedReadProject()`
- c0200 ..> c0200: `readFiles() calls requireReadKnowledge()`
- c0200 ..> c0200: `readMemories() calls inMemoryProject()`
- c0200 ..> c0200: `readMemories() calls readResult()`
- c0200 ..> c0200: `readMemories() calls requestedReadProject()`
- c0200 ..> c0200: `readMemory() calls assertReadMemory()`
- c0200 ..> c0200: `readMemory() calls readResult()`
- c0200 ..> c0200: `readProjects() calls boundedListPage()`
- c0200 ..> c0200: `readProjects() calls readResult()`
- c0200 ..> c0200: `readRelationships() calls assertReadEntity()`
- c0200 ..> c0200: `readRelationships() calls inEntityProject()`
- c0200 ..> c0200: `readRelationships() calls listPage()`
- c0200 ..> c0200: `readRelationships() calls readResult()`
- c0200 ..> c0200: `readRelationships() calls requireReadKnowledge()`
- c0200 ..> c0200: `readResult() calls json()`
- c0200 ..> c0200: `rejectSensitiveInput() calls containsSensitiveData()`
- c0200 ..> c0200: `replacementMemory() calls beforeMutation()`
- c0200 ..> c0200: `replacementMemory() calls memoryInProject()`
- c0200 ..> c0200: `replacementMemory() calls provenance()`
- c0200 ..> c0200: `replacementMemory() calls validateAttachments()`
- c0200 ..> c0200: `requestedReadProject() calls currentProject()`
- c0200 ..> c0200: `requiredIds() calls requiredId()`
- c0200 ..> c0200: `requiredStrings() calls requiredText()`
- c0200 ..> c0200: `resolveWriteProject() calls currentProject()`
- c0200 ..> c0200: `supersedeMemory() calls beforeMutation()`
- c0200 ..> c0200: `supersedeMemory() calls memoryInProject()`
- c0200 ..> c0200: `supersedeMemory() calls replacementMemory()`
- c0200 ..> c0200: `supersedeMemory() calls writeResult()`
- c0200 ..> c0200: `updateCodeArtifact() calls beforeMutation()`
- c0200 ..> c0200: `updateCodeArtifact() calls updateProvenance()`
- c0200 ..> c0200: `updateCodeArtifact() calls writeResult()`
- c0200 ..> c0200: `updateDocument() calls beforeMutation()`
- c0200 ..> c0200: `updateDocument() calls updateProvenance()`
- c0200 ..> c0200: `updateDocument() calls writeResult()`
- c0200 ..> c0200: `updateEntity() calls beforeMutation()`
- c0200 ..> c0200: `updateEntity() calls entityInProject()`
- c0200 ..> c0200: `updateEntity() calls updateProvenance()`
- c0200 ..> c0200: `updateEntity() calls writeResult()`
- c0200 ..> c0200: `updateMemory() calls beforeMutation()`
- c0200 ..> c0200: `updateMemory() calls memoryInProject()`
- c0200 ..> c0200: `updateMemory() calls updateProvenance()`
- c0200 ..> c0200: `updateMemory() calls validateAttachments()`
- c0200 ..> c0200: `updateMemory() calls writeResult()`
- c0200 ..> c0200: `updateProvenance() calls effectiveCommit()`
- c0200 ..> c0200: `validateEntityFields() calls isEntityType()`
- c0200 ..> c0200: `validateEntityFields() calls optionalText()`
- c0200 ..> c0200: `validateKnowledgeReadRequest() calls checkOperation()`
- c0200 ..> c0200: `validateKnowledgeReadRequest() calls record()`
- c0200 ..> c0200: `validateKnowledgeReadRequest() calls validateReadPagination()`
- c0200 ..> c0200: `validateKnowledgeReadRequest() calls validateReadSearch()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls checkOperation()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls commit()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls need()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls optionalId()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls optionalIds()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls optionalImportance()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls optionalStrings()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls optionalText()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls record()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls requiredId()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls requiredIds()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls requiredStrings()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls requiredText()`
- c0200 ..> c0200: `validateKnowledgeWriteRequest() calls validateEntityFields()`
- c0200 ..> c0200: `validateReadPagination() calls boundedId()`
- c0200 ..> c0200: `writeResult() calls compactWriteValue()`
- c0200 ..> c0200: `writeResult() calls json()`
- c0200 ..> c0222: `replacementMemory() calls replacementMemoryContext()`
- c0200 ..> c0236: `containsSensitiveData() calls hasSensitiveData()`
- c0200 ..> c0269: `requiredText() calls trim()`
- c0200 ..> c0269: `resolveWriteProject() calls trim()`
- c0202 --> c0096: `field input`
- c0203 --> c0100: `field input`
- c0205 --> c0103: `field input`
- c0207 --> c0105: `field input`
- c0210 --> c0202: `field codeArtifacts`
- c0210 --> c0203: `field documents`
- c0210 --> c0204: `field entityMemoryLinks`
- c0210 --> c0205: `field entities`
- c0210 --> c0207: `field relationships`
- c0213 --> c0211: `field codeArtifacts`
- c0213 --> c0211: `field documents`
- c0213 --> c0211: `field entities`
- c0213 --> c0211: `field relationships`
- c0214 ..> c0095: `type in writeCodeArtifact`
- c0214 ..> c0099: `type in writeDocument`
- c0214 ..> c0102: `type in writeEntity`
- c0214 ..> c0104: `type in writeRelationship`
- c0214 ..> c0114: `type in attachmentIds`
- c0214 ..> c0114: `type in attachmentMemory`
- c0214 ..> c0114: `type in attachmentsDiffer`
- c0214 ..> c0133: `recordCreateFailure() calls rejectedHttpError()`
- c0214 ..> c0133: `writeConnection() calls rejectedHttpError()`
- c0214 ..> c0170: `writeAttachments() calls updateMemory()`
- c0214 ..> c0170: `writeCodeArtifact() calls createCodeArtifact()`
- c0214 ..> c0170: `writeCodeArtifact() calls getCodeArtifact()`
- c0214 ..> c0170: `writeDocument() calls createDocument()`
- c0214 ..> c0170: `writeDocument() calls getDocument()`
- c0214 ..> c0170: `writeEntity() calls createEntity()`
- c0214 ..> c0170: `writeEntity() calls getEntity()`
- c0214 ..> c0170: `writeEntityMemoryLink() calls linkEntityMemory()`
- c0214 ..> c0170: `writeLinkedMemory() calls linkMemories()`
- c0214 ..> c0170: `writeRelationship() calls createRelationship()`
- c0214 ..> c0173: `createOnce() calls create()`
- c0214 ..> c0185: `attachmentMemory() calls readMemory()`
- c0214 ..> c0201: `type in attachmentIds`
- c0214 ..> c0201: `type in attachmentPatch`
- c0214 ..> c0201: `type in attachmentsDiffer`
- c0214 ..> c0201: `type in requestedAttachmentIds`
- c0214 ..> c0202: `type in writeCodeArtifact`
- c0214 ..> c0203: `type in writeDocument`
- c0214 ..> c0204: `type in writeEntityMemoryLink`
- c0214 ..> c0205: `type in writeEntity`
- c0214 --> c0206: `field readMemory`
- c0214 ..> c0206: `type in constructor`
- c0214 ..> c0207: `type in writeRelationship`
- c0214 ..> c0208: `type in execute`
- c0214 ..> c0209: `type in createOnce`
- c0214 ..> c0209: `type in execute`
- c0214 ..> c0209: `type in writeAttachments`
- c0214 ..> c0209: `type in writeCodeArtifact`
- c0214 ..> c0209: `type in writeCodeArtifacts`
- c0214 ..> c0209: `type in writeConnection`
- c0214 ..> c0209: `type in writeDocument`
- c0214 ..> c0209: `type in writeDocuments`
- c0214 ..> c0209: `type in writeEntities`
- c0214 ..> c0209: `type in writeEntity`
- c0214 ..> c0209: `type in writeEntityMemoryLink`
- c0214 ..> c0209: `type in writeEntityMemoryLinks`
- c0214 ..> c0209: `type in writeLinkedMemories`
- c0214 ..> c0209: `type in writeLinkedMemory`
- c0214 ..> c0209: `type in writeRelationship`
- c0214 ..> c0209: `type in writeRelationships`
- c0214 ..> c0210: `type in attachmentMemory`
- c0214 ..> c0210: `type in createOnce`
- c0214 ..> c0210: `type in execute`
- c0214 ..> c0210: `type in requestedAttachmentIds`
- c0214 ..> c0210: `type in writeAttachments`
- c0214 ..> c0210: `type in writeCodeArtifact`
- c0214 ..> c0210: `type in writeCodeArtifacts`
- c0214 ..> c0210: `type in writeConnection`
- c0214 ..> c0210: `type in writeDocument`
- c0214 ..> c0210: `type in writeDocuments`
- c0214 ..> c0210: `type in writeEntities`
- c0214 ..> c0210: `type in writeEntity`
- c0214 ..> c0210: `type in writeEntityMemoryLink`
- c0214 ..> c0210: `type in writeEntityMemoryLinks`
- c0214 ..> c0210: `type in writeLinkedMemories`
- c0214 ..> c0210: `type in writeLinkedMemory`
- c0214 ..> c0210: `type in writeRelationship`
- c0214 ..> c0210: `type in writeRelationships`
- c0214 ..> c0212: `type in createOnce`
- c0214 ..> c0212: `type in recordCreateFailure`
- c0214 ..> c0212: `type in writeAttachments`
- c0214 ..> c0212: `type in writeCodeArtifact`
- c0214 ..> c0212: `type in writeCodeArtifacts`
- c0214 ..> c0212: `type in writeConnection`
- c0214 ..> c0212: `type in writeDocument`
- c0214 ..> c0212: `type in writeDocuments`
- c0214 ..> c0212: `type in writeEntities`
- c0214 ..> c0212: `type in writeEntity`
- c0214 ..> c0212: `type in writeEntityMemoryLink`
- c0214 ..> c0212: `type in writeEntityMemoryLinks`
- c0214 ..> c0212: `type in writeLinkedMemories`
- c0214 ..> c0212: `type in writeLinkedMemory`
- c0214 ..> c0212: `type in writeRelationship`
- c0214 ..> c0212: `type in writeRelationships`
- c0214 ..> c0213: `type in createOnce`
- c0214 ..> c0213: `type in execute`
- c0214 ..> c0213: `type in recordCreateFailure`
- c0214 ..> c0213: `type in requestedAttachmentIds`
- c0214 ..> c0213: `type in writeAttachments`
- c0214 ..> c0213: `type in writeCodeArtifact`
- c0214 ..> c0213: `type in writeCodeArtifacts`
- c0214 ..> c0213: `type in writeConnection`
- c0214 ..> c0213: `type in writeDocument`
- c0214 ..> c0213: `type in writeDocuments`
- c0214 ..> c0213: `type in writeEntities`
- c0214 ..> c0213: `type in writeEntity`
- c0214 ..> c0213: `type in writeEntityMemoryLink`
- c0214 ..> c0213: `type in writeEntityMemoryLinks`
- c0214 ..> c0213: `type in writeLinkedMemories`
- c0214 ..> c0213: `type in writeLinkedMemory`
- c0214 ..> c0213: `type in writeRelationship`
- c0214 ..> c0213: `type in writeRelationships`
- c0214 ..> c0214: `createOnce() calls recordCreateFailure()`
- c0214 ..> c0214: `execute() calls writeAttachments()`
- c0214 ..> c0214: `execute() calls writeCodeArtifacts()`
- c0214 ..> c0214: `execute() calls writeDocuments()`
- c0214 ..> c0214: `execute() calls writeEntities()`
- c0214 ..> c0214: `execute() calls writeEntityMemoryLinks()`
- c0214 ..> c0214: `execute() calls writeLinkedMemories()`
- c0214 ..> c0214: `execute() calls writeRelationships()`
- c0214 ..> c0214: `writeAttachments() calls attachmentIds()`
- c0214 ..> c0214: `writeAttachments() calls attachmentMemory()`
- c0214 ..> c0214: `writeAttachments() calls attachmentPatch()`
- c0214 ..> c0214: `writeAttachments() calls attachmentsDiffer()`
- c0214 ..> c0214: `writeAttachments() calls requestedAttachmentIds()`
- c0214 ..> c0214: `writeAttachments() calls writeConnection()`
- c0214 ..> c0214: `writeCodeArtifact() calls createOnce()`
- c0214 ..> c0214: `writeCodeArtifacts() calls writeCodeArtifact()`
- c0214 ..> c0214: `writeConnection() calls execute()`
- c0214 ..> c0214: `writeDocument() calls createOnce()`
- c0214 ..> c0214: `writeDocuments() calls writeDocument()`
- c0214 ..> c0214: `writeEntities() calls writeEntity()`
- c0214 ..> c0214: `writeEntity() calls createOnce()`
- c0214 ..> c0214: `writeEntityMemoryLink() calls writeConnection()`
- c0214 ..> c0214: `writeEntityMemoryLinks() calls writeEntityMemoryLink()`
- c0214 ..> c0214: `writeLinkedMemories() calls writeLinkedMemory()`
- c0214 ..> c0214: `writeLinkedMemory() calls writeConnection()`
- c0214 ..> c0214: `writeRelationship() calls createOnce()`
- c0214 ..> c0214: `writeRelationships() calls writeRelationship()`
- c0214 ..> c0215: `type in writeCodeArtifact`
- c0214 ..> c0215: `type in writeDocument`
- c0214 ..> c0215: `type in writeEntity`
- c0214 ..> c0215: `type in writeRelationship`
- c0214 --> c0216: `field client`
- c0214 ..> c0216: `type in constructor`
- c0214 ..> c0217: `attachmentIds() calls uniqueIds()`
- c0214 ..> c0217: `attachmentsDiffer() calls sameIds()`
- c0214 ..> c0217: `createOnce() calls positiveId()`
- c0214 ..> c0217: `execute() calls copyState()`
- c0214 ..> c0217: `execute() calls instructionId()`
- c0214 ..> c0217: `execute() calls normalizedState()`
- c0214 ..> c0217: `requestedAttachmentIds() calls selectedIds()`
- c0214 ..> c0217: `requestedAttachmentIds() calls uniqueIds()`
- c0214 ..> c0217: `writeCodeArtifacts() calls positiveId()`
- c0214 ..> c0217: `writeCodeArtifacts() calls resourceSlots()`
- c0214 ..> c0217: `writeCodeArtifacts() calls stateId()`
- c0214 ..> c0217: `writeCodeArtifacts() calls stateWithNumber()`
- c0214 ..> c0217: `writeDocuments() calls positiveId()`
- c0214 ..> c0217: `writeDocuments() calls resourceSlots()`
- c0214 ..> c0217: `writeDocuments() calls stateId()`
- c0214 ..> c0217: `writeDocuments() calls stateWithNumber()`
- c0214 ..> c0217: `writeEntities() calls positiveId()`
- c0214 ..> c0217: `writeEntities() calls resourceSlots()`
- c0214 ..> c0217: `writeEntities() calls stateId()`
- c0214 ..> c0217: `writeEntities() calls stateWithNumber()`
- c0214 ..> c0217: `writeEntityMemoryLink() calls hasValue()`
- c0214 ..> c0217: `writeEntityMemoryLink() calls stateId()`
- c0214 ..> c0217: `writeLinkedMemory() calls hasValue()`
- c0214 ..> c0217: `writeRelationship() calls stateId()`
- c0214 ..> c0217: `writeRelationships() calls positiveId()`
- c0214 ..> c0217: `writeRelationships() calls resourceSlots()`
- c0214 ..> c0217: `writeRelationships() calls stateId()`
- c0214 ..> c0217: `writeRelationships() calls stateWithNumber()`
- c0214 ..> c0236: `createOnce() calls errorMessage()`
- c0214 ..> c0236: `writeConnection() calls errorMessage()`
- c0214 ..> c0282: `createOnce() calls inspect()`
- c0214 ..> c0282: `writeConnection() calls inspect()`
- c0217 ..> c0004: `resourceSlots() calls set()`
- c0217 ..> c0173: `resourceSlots() calls get()`
- c0217 ..> c0210: `type in instructionId`
- c0217 ..> c0211: `type in receipts`
- c0217 ..> c0211: `type in selectedIds`
- c0217 ..> c0211: `type in stateId`
- c0217 ..> c0211: `type in stateWithNumber`
- c0217 ..> c0213: `type in copyState`
- c0217 ..> c0213: `type in normalizedState`
- c0217 ..> c0215: `type in resourceSlots`
- c0217 ..> c0217: `normalizedState() calls receipts()`
- c0217 ..> c0217: `receipts() calls positiveId()`
- c0217 ..> c0217: `selectedIds() calls positiveId()`
- c0217 ..> c0217: `selectedIds() calls resourceSlots()`
- c0217 ..> c0217: `selectedIds() calls stateId()`
- c0217 ..> c0217: `stateWithNumber() calls positiveId()`
- c0220 ..> c0070: `enqueue() calls enqueue()`
- c0220 ..> c0070: `flush() calls resolve()`
- c0220 ..|> c0218: `implements`
- c0220 --> c0219: `field level`
- c0220 --> c0219: `field options`
- c0220 ..> c0219: `type in constructor`
- c0220 ..> c0219: `type in setLevel`
- c0220 ..> c0220: `close() calls flush()`
- c0220 ..> c0220: `emit() calls enqueue()`
- c0220 ..> c0220: `emit() calls warn()`
- c0220 ..> c0220: `encode() calls fitLine()`
- c0220 ..> c0220: `encode() calls traceLines()`
- c0220 ..> c0220: `enqueue() calls encode()`
- c0220 ..> c0220: `enqueue() calls warn()`
- c0220 ..> c0220: `enqueue() calls write()`
- c0220 ..> c0220: `flush() calls warn()`
- c0220 ..> c0220: `traceLines() calls traceFileCount()`
- c0220 ..> c0220: `write() calls rotate()`
- c0220 ..> c0220: `write() calls traceFileCount()`
- c0220 ..> c0221: `constructor() calls limit()`
- c0220 ..> c0221: `enqueue() calls correlation()`
- c0220 ..> c0221: `enqueue() calls excludeCredentials()`
- c0220 ..> c0221: `fitLine() calls correlation()`
- c0220 ..> c0221: `traceLines() calls correlation()`
- c0220 ..> c0221: `write() calls pruneDirectory()`
- c0220 ..> c0236: `enqueue() calls sanitizeValue()`
- c0221 ..> c0013: `pruneDirectory() calls current()`
- c0221 ..> c0221: `pruneDirectory() calls listLogFiles()`
- c0221 ..> c0221: `pruneDirectory() calls processExited()`
- c0222 ..> c0116: `type in replacementMemoryInput`
- c0222 ..> c0222: `replacementMemoryInput() calls replacementMemoryContext()`
- c0222 ..> c0236: `storedMemoryContext() calls sanitizeText()`
- c0225 --> c0227: `field complete`
- c0226 ..> c0070: `applySummary() calls now()`
- c0226 --> c0223: `field compactedHistory`
- c0226 ..> c0223: `type in constructor`
- c0226 ..> c0223: `type in getCompactedHistory`
- c0226 ..> c0223: `type in prepare`
- c0226 ..> c0223: `type in prepareCapture`
- c0226 ..> c0223: `type in prepareContext`
- c0226 ..> c0226: `prepare() calls prepareContext()`
- c0226 ..> c0226: `prepareCapture() calls outputAllowance()`
- c0226 ..> c0226: `prepareCapture() calls prepareContext()`
- c0226 ..> c0226: `prepareContext() calls applySummary()`
- c0226 ..> c0226: `prepareContext() calls getCompactedHistory()`
- c0226 ..> c0226: `prepareContext() calls outputAllowance()`
- c0226 ..> c0227: `type in prepare`
- c0226 ..> c0227: `type in prepareCapture`
- c0226 ..> c0227: `type in prepareContext`
- c0226 ..> c0228: `applySummary() calls contextTokens()`
- c0226 ..> c0228: `constructor() calls compactionSettings()`
- c0226 ..> c0228: `constructor() calls privateContextWindow()`
- c0226 ..> c0228: `outputAllowance() calls resolvedOutputAllowance()`
- c0226 ..> c0228: `prepareContext() calls assertImageSupport()`
- c0226 ..> c0228: `prepareContext() calls contextTokens()`
- c0226 ..> c0228: `prepareContext() calls outputCeiling()`
- c0226 ..> c0228: `prepareContext() calls recentCutIndex()`
- c0226 ..> c0228: `prepareContext() calls summarizeMemoryHistory()`
- c0226 ..> c0269: `applySummary() calls trim()`
- c0228 ..> c0070: `summarizeMemoryHistory() calls now()`
- c0228 ..> c0119: `type in evidencePageContent`
- c0228 ..> c0224: `assertFits() constructs ContextWindowError`
- c0228 ..> c0224: `smallerSummaryBatch() constructs ContextWindowError`
- c0228 ..> c0225: `type in summarizeMemoryHistory`
- c0228 ..> c0228: `assertFits() calls contextTokens()`
- c0228 ..> c0228: `contextTokens() calls textTokens()`
- c0228 ..> c0228: `evidenceMessage() calls modelEvidence()`
- c0228 ..> c0228: `evidencePageContent() calls evidenceMessage()`
- c0228 ..> c0228: `modelEvidence() calls objectRecord()`
- c0228 ..> c0228: `outputCeiling() calls validatePositiveSafeInteger()`
- c0228 ..> c0228: `privateContextWindow() calls validatePositiveSafeInteger()`
- c0228 ..> c0228: `recentCutIndex() calls entriesFor()`
- c0228 ..> c0228: `resolvedOutputAllowance() calls assertFits()`
- c0228 ..> c0228: `resolvedOutputAllowance() calls contextTokens()`
- c0228 ..> c0228: `resolvedOutputAllowance() calls outputCeiling()`
- c0228 ..> c0228: `summarizeMemoryHistory() calls assertFits()`
- c0228 ..> c0228: `summarizeMemoryHistory() calls assertImageSupport()`
- c0228 ..> c0228: `summarizeMemoryHistory() calls compactionSettings()`
- c0228 ..> c0228: `summarizeMemoryHistory() calls outputCeiling()`
- c0228 ..> c0228: `summarizeMemoryHistory() calls privateContextWindow()`
- c0228 ..> c0228: `summarizeMemoryHistory() calls smallerSummaryBatch()`
- c0228 ..> c0228: `summarizeMemoryHistory() calls summaryEvidence()`
- c0228 ..> c0228: `summaryEvidence() calls evidenceMessage()`
- c0228 ..> c0232: `summarizeMemoryHistory() calls complete()`
- c0228 ..> c0236: `evidenceMessage() calls sanitizeValue()`
- c0228 ..> c0236: `summarizeMemoryHistory() calls sanitizeText()`
- c0230 --> c0231: `field modelRegistry`
- c0232 ..> c0070: `complete() calls now()`
- c0232 ..> c0070: `completeAttempt() calls now()`
- c0232 ..> c0070: `completeRequest() calls now()`
- c0232 ..> c0070: `completeWithSubmission() calls now()`
- c0232 ..> c0070: `executeRead() calls now()`
- c0232 ..> c0070: `prepareCapture() calls now()`
- c0232 ..> c0079: `completeWithSubmission() calls mapConcurrent()`
- c0232 --> c0084: `field selection`
- c0232 ..> c0084: `type in constructor`
- c0232 ..> c0091: `completeRequest() calls isRecallConcurrency()`
- c0232 ..|> c0117: `implements`
- c0232 ..> c0121: `type in executeRead`
- c0232 ..> c0122: `type in complete`
- c0232 ..> c0122: `type in completeAttempt`
- c0232 ..> c0122: `type in completeRequest`
- c0232 ..> c0122: `type in completeWithSubmission`
- c0232 ..> c0122: `type in emit`
- c0232 ..> c0122: `type in executeRead`
- c0232 ..> c0122: `type in prepareCapture`
- c0232 ..> c0123: `completeWithSubmission() constructs ModelSubmissionError`
- c0232 ..> c0124: `type in validateSubmission`
- c0232 ..> c0214: `executeRead() calls execute()`
- c0232 --> c0218: `field logger`
- c0232 ..> c0220: `complete() calls emit()`
- c0232 ..> c0220: `completeAttempt() calls emit()`
- c0232 ..> c0220: `completeRequest() calls emit()`
- c0232 ..> c0220: `emit() calls emit()`
- c0232 ..> c0220: `executeRead() calls emit()`
- c0232 ..> c0220: `prepareCapture() calls emit()`
- c0232 ..> c0226: `completeRequest() calls prepareCapture()`
- c0232 ..> c0226: `completeRequest() constructs MemoryTaskContext`
- c0232 ..> c0226: `completeWithSubmission() calls prepare()`
- c0232 ..> c0228: `completeRequest() calls evidenceMessage()`
- c0232 ..> c0228: `executeRead() calls evidencePageContent()`
- c0232 --> c0229: `field transformHeaders`
- c0232 --> c0231: `field registry`
- c0232 ..> c0231: `type in constructor`
- c0232 ..> c0232: `complete() calls completeRequest()`
- c0232 ..> c0232: `completeAttempt() calls complete()`
- c0232 ..> c0232: `completeRequest() calls completeWithSubmission()`
- c0232 ..> c0232: `completeWithSubmission() calls completeAttempt()`
- c0232 ..> c0232: `completeWithSubmission() calls executeRead()`
- c0232 ..> c0232: `completeWithSubmission() calls validateSubmission()`
- c0232 ..> c0232: `prepareCapture() calls completeRequest()`
- c0232 ..> c0233: `type in constructor`
- c0232 ..> c0234: `type in completeAttempt`
- c0232 ..> c0234: `type in completeWithSubmission`
- c0232 ..> c0234: `type in executeRead`
- c0232 ..> c0235: `complete() calls rejectionText()`
- c0232 ..> c0235: `completeAttempt() calls rejectionText()`
- c0232 ..> c0235: `completeRequest() calls modelLabel()`
- c0232 ..> c0235: `completeRequest() calls requestDeadline()`
- c0232 ..> c0235: `completeRequest() calls requestOptions()`
- c0232 ..> c0235: `completeRequest() calls requestTimeout()`
- c0232 ..> c0235: `completeRequest() calls serializeInput()`
- c0232 ..> c0235: `completeRequest() calls submissionTool()`
- c0232 ..> c0235: `completeRequest() calls throwRequestFailure()`
- c0232 ..> c0235: `completeWithSubmission() calls appendCallCountCorrection()`
- c0232 ..> c0235: `completeWithSubmission() calls ensureCompletionFinished()`
- c0232 ..> c0235: `completeWithSubmission() calls errorToolResult()`
- c0232 ..> c0235: `completeWithSubmission() calls rejectionText()`
- c0232 ..> c0235: `completeWithSubmission() calls sanitizedAssistantForHistory()`
- c0232 ..> c0235: `completeWithSubmission() calls serializeInput()`
- c0232 ..> c0235: `completeWithSubmission() calls submissionTool()`
- c0232 ..> c0235: `completeWithSubmission() calls toolCalls()`
- c0232 ..> c0235: `constructor() calls modelLabel()`
- c0232 ..> c0235: `executeRead() calls errorToolResult()`
- c0232 ..> c0235: `executeRead() calls rejectionText()`
- c0232 ..> c0235: `executeRead() calls serializeInput()`
- c0232 ..> c0235: `executeRead() calls submissionTool()`
- c0232 ..> c0235: `executeRead() calls textBlock()`
- c0232 ..> c0235: `prepareCapture() calls rejectionText()`
- c0232 ..> c0236: `completeRequest() calls sanitizeText()`
- c0232 ..> c0236: `emit() calls sanitizeValue()`
- c0233 --> c0218: `field logger`
- c0233 --> c0229: `field transformHeaders`
- c0235 ..> c0070: `appendCallCountCorrection() calls now()`
- c0235 ..> c0070: `errorToolResult() calls now()`
- c0235 ..> c0084: `type in modelLabel`
- c0235 ..> c0084: `type in modelSelectionFromModel`
- c0235 ..> c0084: `type in resolveMemoryModel`
- c0235 ..> c0121: `type in submissionTool`
- c0235 ..> c0122: `type in ensureCompletionFinished`
- c0235 ..> c0122: `type in requestDeadline`
- c0235 ..> c0122: `type in requestTimeout`
- c0235 ..> c0122: `type in throwRequestFailure`
- c0235 ..> c0124: `type in submissionTool`
- c0235 ..> c0229: `type in requestOptions`
- c0235 ..> c0230: `type in availableMemoryModels`
- c0235 ..> c0231: `type in resolveMemoryModel`
- c0235 ..> c0232: `requestOptions() calls transformHeaders()`
- c0235 ..> c0232: `resolveMemoryModel() constructs PiMemoryModel`
- c0235 ..> c0232: `type in resolveMemoryModel`
- c0235 ..> c0233: `type in resolveMemoryModel`
- c0235 ..> c0234: `type in requestDeadline`
- c0235 ..> c0235: `appendCallCountCorrection() calls errorToolResult()`
- c0235 ..> c0235: `appendCallCountCorrection() calls rejectionText()`
- c0235 ..> c0235: `appendCallCountCorrection() calls sanitizedAssistantForHistory()`
- c0235 ..> c0235: `errorToolResult() calls textBlock()`
- c0235 ..> c0235: `openCodeSessionHeaders() calls isOpenCodeModel()`
- c0235 ..> c0235: `requestOptions() calls openCodeSessionHeaders()`
- c0235 ..> c0235: `sanitizedAssistantForHistory() calls textBlock()`
- c0235 ..> c0236: `appendCallCountCorrection() calls sanitizeText()`
- c0235 ..> c0236: `ensureCompletionFinished() calls sanitizeText()`
- c0235 ..> c0236: `rejectionText() calls errorMessage()`
- c0235 ..> c0236: `sanitizedAssistantForHistory() calls sanitizeText()`
- c0235 ..> c0236: `sanitizedAssistantForHistory() calls sanitizeValue()`
- c0235 ..> c0236: `serializeInput() calls sanitizeText()`
- c0235 ..> c0236: `serializeInput() calls sanitizeValue()`
- c0235 ..> c0236: `throwRequestFailure() calls sanitizeText()`
- c0236 ..> c0236: `errorMessage() calls diagnosticMessage()`
- c0236 ..> c0236: `errorMessage() calls sanitizeText()`
- c0236 ..> c0236: `hasSensitiveData() calls sanitizeText()`
- c0236 ..> c0236: `sanitizeValue() calls sanitizeText()`
- c0236 ..> c0282: `diagnosticMessage() calls inspect()`
- c0239 ..> c0109: `type in initialiseProject`
- c0239 ..> c0109: `type in initialiseProjectForAgent`
- c0239 ..> c0109: `type in promptExistingProject`
- c0239 ..> c0126: `type in existingMapping`
- c0239 ..> c0126: `type in initialiseProject`
- c0239 ..> c0126: `type in initialiseProjectForAgent`
- c0239 ..> c0126: `type in promptExistingProject`
- c0239 ..> c0127: `type in promptNewProject`
- c0239 ..> c0127: `type in validateAgentProjectDetails`
- c0239 ..> c0168: `promptExistingProject() calls notify()`
- c0239 ..> c0173: `initialiseProject() calls createProject()`
- c0239 ..> c0173: `initialiseProject() calls linkProject()`
- c0239 ..> c0173: `initialiseProject() calls listProjects()`
- c0239 ..> c0173: `initialiseProjectForAgent() calls createProject()`
- c0239 ..> c0173: `initialiseProjectForAgent() calls linkProject()`
- c0239 ..> c0173: `initialiseProjectForAgent() calls listProjects()`
- c0239 ..> c0173: `promptExistingProject() calls listProjects()`
- c0239 ..> c0236: `promptExistingProject() calls sanitizeText()`
- c0239 ..> c0236: `promptNewProject() calls sanitizeText()`
- c0239 ..> c0237: `type in initialiseProjectForAgent`
- c0239 ..> c0237: `type in validateAgentProjectDetails`
- c0239 ..> c0238: `existingMapping() constructs ProjectInitError`
- c0239 ..> c0238: `initialiseProject() constructs ProjectInitError`
- c0239 ..> c0238: `initialiseProjectForAgent() constructs ProjectInitError`
- c0239 ..> c0238: `promptExistingProject() constructs ProjectInitError`
- c0239 ..> c0238: `promptNewProject() constructs ProjectInitError`
- c0239 ..> c0238: `validateAgentProjectDetails() constructs ProjectInitError`
- c0239 ..> c0239: `initialiseProject() calls existingMapping()`
- c0239 ..> c0239: `initialiseProject() calls promptExistingProject()`
- c0239 ..> c0239: `initialiseProject() calls promptNewProject()`
- c0239 ..> c0239: `initialiseProjectForAgent() calls existingMapping()`
- c0239 ..> c0239: `initialiseProjectForAgent() calls validateAgentProjectDetails()`
- c0239 ..> c0269: `promptExistingProject() calls trim()`
- c0239 ..> c0269: `promptNewProject() calls trim()`
- c0239 ..> c0269: `validateAgentProjectDetails() calls trim()`
- c0240 ..> c0004: `mutate() calls set()`
- c0240 ..> c0009: `createFileLock() calls open()`
- c0240 ..> c0009: `createFileLock() calls sync()`
- c0240 ..> c0009: `readSnapshot() calls open()`
- c0240 ..> c0009: `storeSnapshot() calls open()`
- c0240 ..> c0009: `storeSnapshot() calls sync()`
- c0240 ..> c0009: `syncDirectory() calls open()`
- c0240 ..> c0009: `syncDirectory() calls sync()`
- c0240 ..> c0009: `writeState() calls open()`
- c0240 ..> c0009: `writeState() calls sync()`
- c0240 ..> c0094: `type in advanceWatermark`
- c0240 ..> c0094: `type in enqueue`
- c0240 ..> c0094: `type in enqueueSnapshot`
- c0240 ..> c0094: `type in reusableHistory`
- c0240 ..> c0098: `type in compactJobSnapshot`
- c0240 ..> c0107: `type in appendInspections`
- c0240 ..> c0126: `type in completeProjectDiscovery`
- c0240 ..> c0132: `type in completeProjectDiscovery`
- c0240 ..> c0132: `type in currentWatermark`
- c0240 ..> c0173: `mutate() calls get()`
- c0240 ..> c0173: `resolveBranchId() calls get()`
- c0240 ..> c0200: `readSnapshot() calls readFile()`
- c0240 ..> c0200: `readState() calls readFile()`
- c0240 ..> c0200: `releaseFileLock() calls readFile()`
- c0240 ..> c0200: `removeAbandonedLock() calls readFile()`
- c0240 ..> c0236: `addConflict() calls sanitizeValue()`
- c0240 ..> c0236: `appendInspections() calls sanitizeValue()`
- c0240 ..> c0240: `acquireFileLock() calls createFileLock()`
- c0240 ..> c0240: `acquireFileLock() calls ensureDirectory()`
- c0240 ..> c0240: `acquireFileLock() calls recoverExistingLock()`
- c0240 ..> c0240: `addConflict() calls mutate()`
- c0240 ..> c0240: `addConflict() calls prune()`
- c0240 ..> c0240: `advanceWatermark() calls mutate()`
- c0240 ..> c0240: `advanceWatermark() calls prune()`
- c0240 ..> c0240: `advanceWatermark() calls updateWatermark()`
- c0240 ..> c0240: `appendInspections() calls readSnapshot()`
- c0240 ..> c0240: `appendInspections() calls storeSnapshot()`
- c0240 ..> c0240: `cancel() calls mutate()`
- c0240 ..> c0240: `checkpoint() calls appendInspections()`
- c0240 ..> c0240: `checkpoint() calls applyCheckpointPatch()`
- c0240 ..> c0240: `checkpoint() calls compactJobSnapshot()`
- c0240 ..> c0240: `checkpoint() calls hydrateJob()`
- c0240 ..> c0240: `checkpoint() calls mutate()`
- c0240 ..> c0240: `checkpoint() calls pruneFailedJobs()`
- c0240 ..> c0240: `checkpoint() calls recordCompletedCapture()`
- c0240 ..> c0240: `checkpoint() calls releaseTerminalSnapshot()`
- c0240 ..> c0240: `claimNext() calls claimJob()`
- c0240 ..> c0240: `claimNext() calls defaultIdentity()`
- c0240 ..> c0240: `claimNext() calls hydrateJob()`
- c0240 ..> c0240: `claimNext() calls matchesBranch()`
- c0240 ..> c0240: `claimNext() calls now()`
- c0240 ..> c0240: `claimNext() calls runningJobCanBeRecovered()`
- c0240 ..> c0240: `collectSnapshots() calls now()`
- c0240 ..> c0240: `collectSnapshots() calls snapshotPath()`
- c0240 ..> c0240: `collectSnapshots() calls syncDirectory()`
- c0240 ..> c0240: `compactJobSnapshot() calls hydrateJob()`
- c0240 ..> c0240: `compactJobSnapshot() calls storeSnapshot()`
- c0240 ..> c0240: `complete() calls checkpoint()`
- c0240 ..> c0240: `completeProjectDiscovery() calls defaultIdentity()`
- c0240 ..> c0240: `completeProjectDiscovery() calls mutate()`
- c0240 ..> c0240: `createFileLock() calls close()`
- c0240 ..> c0240: `createFileLock() calls releaseFileLock()`
- c0240 ..> c0240: `currentWatermark() calls getWatermark()`
- c0240 ..> c0240: `enqueue() calls mutate()`
- c0240 ..> c0240: `enqueue() calls prune()`
- c0240 ..> c0240: `enqueue() calls reusableHistory()`
- c0240 ..> c0240: `enqueue() calls updateWatermark()`
- c0240 ..> c0240: `enqueueSnapshot() calls enqueue()`
- c0240 ..> c0240: `getConflict() calls readState()`
- c0240 ..> c0240: `getJob() calls hydrateJob()`
- c0240 ..> c0240: `getJob() calls mutate()`
- c0240 ..> c0240: `getWatermark() calls readState()`
- c0240 ..> c0240: `hasClaimableWork() calls matchesBranch()`
- c0240 ..> c0240: `hasClaimableWork() calls mutate()`
- c0240 ..> c0240: `hasClaimableWork() calls now()`
- c0240 ..> c0240: `hasClaimableWork() calls runningJobCanBeRecovered()`
- c0240 ..> c0240: `hydrateJob() calls readSnapshot()`
- c0240 ..> c0240: `listJobMetadata() calls mutate()`
- c0240 ..> c0240: `listJobs() calls hydrateJob()`
- c0240 ..> c0240: `listJobs() calls mutate()`
- c0240 ..> c0240: `listPending() calls defaultIdentity()`
- c0240 ..> c0240: `listPending() calls hydrateJob()`
- c0240 ..> c0240: `listPending() calls mutate()`
- c0240 ..> c0240: `listPendingConflicts() calls pendingConflicts()`
- c0240 ..> c0240: `markConflictHandedOff() calls defaultIdentity()`
- c0240 ..> c0240: `markConflictHandedOff() calls getConflict()`
- c0240 ..> c0240: `markConflictHandedOff() calls mutate()`
- c0240 ..> c0240: `markConflictHandedOff() calls withWorkerLock()`
- c0240 ..> c0240: `mutate() calls pruneFailedJobs()`
- c0240 ..> c0240: `mutate() calls readState()`
- c0240 ..> c0240: `mutate() calls withMutationFileLock()`
- c0240 ..> c0240: `mutate() calls writeState()`
- c0240 ..> c0240: `pendingConflicts() calls readState()`
- c0240 ..> c0240: `prune() calls now()`
- c0240 ..> c0240: `readSnapshot() calls close()`
- c0240 ..> c0240: `readSnapshot() calls snapshotPath()`
- c0240 ..> c0240: `recordCompletedCapture() calls hydrateJob()`
- c0240 ..> c0240: `recordCompletedCapture() calls readSnapshot()`
- c0240 ..> c0240: `recordCompletedCapture() calls storeSnapshot()`
- c0240 ..> c0240: `recoverExistingLock() calls removeAbandonedLock()`
- c0240 ..> c0240: `refreshCaptureHistory() calls compactJobSnapshot()`
- c0240 ..> c0240: `refreshCaptureHistory() calls hydrateJob()`
- c0240 ..> c0240: `refreshCaptureHistory() calls mutate()`
- c0240 ..> c0240: `refreshCaptureHistory() calls reusableHistory()`
- c0240 ..> c0240: `releaseProgress() calls mutate()`
- c0240 ..> c0240: `removeAbandonedLock() calls now()`
- c0240 ..> c0240: `resolveBranchId() calls readState()`
- c0240 ..> c0240: `reusableHistory() calls readSnapshot()`
- c0240 ..> c0240: `storeSnapshot() calls close()`
- c0240 ..> c0240: `storeSnapshot() calls readSnapshot()`
- c0240 ..> c0240: `storeSnapshot() calls snapshotPath()`
- c0240 ..> c0240: `storeSnapshot() calls syncDirectory()`
- c0240 ..> c0240: `syncDirectory() calls close()`
- c0240 ..> c0240: `updateConflict() calls mutate()`
- c0240 ..> c0240: `withFileLock() calls acquireFileLock()`
- c0240 ..> c0240: `withMutationFileLock() calls withFileLock()`
- c0240 ..> c0240: `withWorkerLock() calls acquireFileLock()`
- c0240 ..> c0240: `writeState() calls close()`
- c0240 ..> c0240: `writeState() calls collectSnapshots()`
- c0240 ..> c0240: `writeState() calls ensureDirectory()`
- c0240 ..> c0240: `writeState() calls pruneFailedJobs()`
- c0240 ..> c0240: `writeState() calls releaseTerminalSnapshot()`
- c0240 ..> c0240: `writeState() calls storeSnapshot()`
- c0240 ..> c0240: `writeState() calls syncDirectory()`
- c0240 ..> c0241: `type in constructor`
- c0240 ..> c0242: `type in acquireFileLock`
- c0240 ..> c0242: `type in createFileLock`
- c0240 ..> c0244: `type in addConflict`
- c0240 ..> c0244: `type in getConflict`
- c0240 ..> c0244: `type in listPendingConflicts`
- c0240 ..> c0244: `type in pendingConflicts`
- c0240 ..> c0244: `type in updateConflict`
- c0240 ..> c0245: `acquireFileLock() constructs QueueBusyError`
- c0240 ..> c0245: `removeAbandonedLock() constructs QueueBusyError`
- c0240 ..> c0245: `withMutationFileLock() constructs QueueBusyError`
- c0240 ..> c0246: `type in applyCheckpointPatch`
- c0240 ..> c0246: `type in checkpoint`
- c0240 ..> c0247: `type in enqueue`
- c0240 ..> c0247: `type in enqueueSnapshot`
- c0240 ..> c0248: `type in claimNext`
- c0240 ..> c0248: `type in defaultIdentity`
- c0240 ..> c0248: `type in hasClaimableWork`
- c0240 ..> c0248: `type in listJobMetadata`
- c0240 ..> c0248: `type in listJobs`
- c0240 ..> c0248: `type in listPending`
- c0240 ..> c0248: `type in listPendingConflicts`
- c0240 ..> c0248: `type in pendingConflicts`
- c0240 ..> c0248: `type in withWorkerLock`
- c0240 ..> c0249: `type in checkpoint`
- c0240 ..> c0249: `type in claimJob`
- c0240 ..> c0249: `type in claimNext`
- c0240 ..> c0249: `type in complete`
- c0240 ..> c0249: `type in getJob`
- c0240 ..> c0249: `type in hydrateJob`
- c0240 ..> c0249: `type in listJobs`
- c0240 ..> c0249: `type in listPending`
- c0240 ..> c0249: `type in matchesBranch`
- c0240 ..> c0249: `type in refreshCaptureHistory`
- c0240 ..> c0249: `type in runningJobCanBeRecovered`
- c0240 ..> c0250: `type in listJobMetadata`
- c0240 ..> c0252: `type in collectSnapshots`
- c0240 ..> c0252: `type in mutate`
- c0240 ..> c0252: `type in prune`
- c0240 ..> c0252: `type in pruneFailedJobs`
- c0240 ..> c0252: `type in readState`
- c0240 ..> c0252: `type in recordCompletedCapture`
- c0240 ..> c0252: `type in releaseTerminalSnapshot`
- c0240 ..> c0252: `type in updateWatermark`
- c0240 ..> c0252: `type in writeState`
- c0240 ..> c0253: `type in advanceWatermark`
- c0240 ..> c0253: `type in currentWatermark`
- c0240 ..> c0253: `type in getWatermark`
- c0240 ..> c0253: `type in reusableHistory`
- c0240 ..> c0253: `type in updateWatermark`
- c0240 ..> c0254: `type in readSnapshot`
- c0240 ..> c0254: `type in reusableHistory`
- c0240 ..> c0254: `type in storeSnapshot`
- c0240 ..> c0255: `type in appendInspections`
- c0240 ..> c0255: `type in applyCheckpointPatch`
- c0240 ..> c0255: `type in compactJobSnapshot`
- c0240 ..> c0255: `type in hydrateJob`
- c0240 ..> c0255: `type in recordCompletedCapture`
- c0240 ..> c0255: `type in releaseTerminalSnapshot`
- c0240 ..> c0257: `type in advanceWatermark`
- c0240 ..> c0257: `type in updateWatermark`
- c0240 ..> c0258: `addConflict() calls jsonSnapshot()`
- c0240 ..> c0258: `addConflict() calls nowIso()`
- c0240 ..> c0258: `addConflict() calls scrubDiagnostic()`
- c0240 ..> c0258: `advanceWatermark() calls dedupeKey()`
- c0240 ..> c0258: `advanceWatermark() calls jsonSnapshot()`
- c0240 ..> c0258: `appendInspections() calls jsonSnapshot()`
- c0240 ..> c0258: `appendInspections() calls validateInspectionEntry()`
- c0240 ..> c0258: `applyCheckpointPatch() calls jsonSnapshot()`
- c0240 ..> c0258: `applyCheckpointPatch() calls nowIso()`
- c0240 ..> c0258: `applyCheckpointPatch() calls scrubDiagnostic()`
- c0240 ..> c0258: `cancel() calls nowIso()`
- c0240 ..> c0258: `cancel() calls scrubDiagnostic()`
- c0240 ..> c0258: `checkpoint() calls releaseCompletedArtifacts()`
- c0240 ..> c0258: `claimJob() calls nowIso()`
- c0240 ..> c0258: `claimNext() calls identityMatches()`
- c0240 ..> c0258: `claimNext() calls interruptedWrite()`
- c0240 ..> c0258: `collectSnapshots() calls historyCaches()`
- c0240 ..> c0258: `completeProjectDiscovery() calls identityMatches()`
- c0240 ..> c0258: `createFileLock() calls nowIso()`
- c0240 ..> c0258: `enqueue() calls contextKey()`
- c0240 ..> c0258: `enqueue() calls dedupeKey()`
- c0240 ..> c0258: `enqueue() calls jobIdFor()`
- c0240 ..> c0258: `enqueue() calls jsonSnapshot()`
- c0240 ..> c0258: `enqueue() calls nowIso()`
- c0240 ..> c0258: `getConflict() calls jsonSnapshot()`
- c0240 ..> c0258: `getWatermark() calls contextKey()`
- c0240 ..> c0258: `getWatermark() calls jsonSnapshot()`
- c0240 ..> c0258: `getWatermark() calls nowIso()`
- c0240 ..> c0258: `hasClaimableWork() calls identityMatches()`
- c0240 ..> c0258: `hasClaimableWork() calls interruptedWrite()`
- c0240 ..> c0258: `hydrateJob() calls jsonSnapshot()`
- c0240 ..> c0258: `listJobMetadata() calls identityMatches()`
- c0240 ..> c0258: `listJobs() calls identityMatches()`
- c0240 ..> c0258: `listPending() calls identityMatches()`
- c0240 ..> c0258: `markConflictHandedOff() calls conflictIdentityMatches()`
- c0240 ..> c0258: `markConflictHandedOff() calls interruptedWrite()`
- c0240 ..> c0258: `markConflictHandedOff() calls nowIso()`
- c0240 ..> c0258: `pendingConflicts() calls conflictIdentityMatches()`
- c0240 ..> c0258: `pendingConflicts() calls jsonSnapshot()`
- c0240 ..> c0258: `prune() calls clearHistoryCache()`
- c0240 ..> c0258: `prune() calls contextKey()`
- c0240 ..> c0258: `prune() calls historyCaches()`
- c0240 ..> c0258: `prune() calls setHistoryCaches()`
- c0240 ..> c0258: `prune() calls shouldRetain()`
- c0240 ..> c0258: `readState() calls normaliseState()`
- c0240 ..> c0258: `recordCompletedCapture() calls contextKey()`
- c0240 ..> c0258: `recordCompletedCapture() calls cursorComparison()`
- c0240 ..> c0258: `recordCompletedCapture() calls historyCaches()`
- c0240 ..> c0258: `recordCompletedCapture() calls nowIso()`
- c0240 ..> c0258: `recordCompletedCapture() calls orderedSourceEntryIds()`
- c0240 ..> c0258: `recordCompletedCapture() calls setHistoryCaches()`
- c0240 ..> c0258: `recordCompletedCapture() calls summaryCursor()`
- c0240 ..> c0258: `refreshCaptureHistory() calls contextKey()`
- c0240 ..> c0258: `refreshCaptureHistory() calls cursorComparison()`
- c0240 ..> c0258: `refreshCaptureHistory() calls interruptedWrite()`
- c0240 ..> c0258: `refreshCaptureHistory() calls orderedSourceEntryIds()`
- c0240 ..> c0258: `refreshCaptureHistory() calls recordId()`
- c0240 ..> c0258: `releaseProgress() calls nowIso()`
- c0240 ..> c0258: `removeAbandonedLock() calls isProcessAlive()`
- c0240 ..> c0258: `resolveBranchId() calls contextKey()`
- c0240 ..> c0258: `reusableHistory() calls diagnosticError()`
- c0240 ..> c0258: `reusableHistory() calls historyCaches()`
- c0240 ..> c0258: `reusableHistory() calls orderedSourceEntryIds()`
- c0240 ..> c0258: `reusableHistory() calls setHistoryCaches()`
- c0240 ..> c0258: `runningJobCanBeRecovered() calls isProcessAlive()`
- c0240 ..> c0258: `updateConflict() calls jsonSnapshot()`
- c0240 ..> c0258: `updateConflict() calls nowIso()`
- c0240 ..> c0258: `updateWatermark() calls contextKey()`
- c0240 ..> c0258: `updateWatermark() calls nowIso()`
- c0240 ..> c0258: `writeState() calls releaseCompletedArtifacts()`
- c0240 ..> c0269: `reusableHistory() calls trim()`
- c0240 ..> c0278: `compactJobSnapshot() calls compactCaptureSnapshot()`
- c0240 ..> c0278: `enqueue() calls reuseCaptureHistory()`
- c0240 ..> c0278: `enqueue() calls sanitizeCaptureSnapshot()`
- c0240 ..> c0278: `refreshCaptureHistory() calls captureConversation()`
- c0240 ..> c0278: `writeState() calls sanitizeCaptureSnapshot()`
- c0244 --> c0107: `field replacement`
- c0244 --> c0116: `field replacement`
- c0244 --> c0132: `field context`
- c0244 --> c0248: `field binding`
- c0244 --> c0256: `field supersession`
- c0246 --> c0098: `field compactedConversation`
- c0246 --> c0107: `field inspectionEntries`
- c0246 --> c0251: `field status`
- c0246 --> c0256: `field supersession`
- c0249 --> c0094: `field snapshot`
- c0249 --> c0248: `field binding`
- c0249 --> c0251: `field status`
- c0249 --> c0256: `field supersession`
- c0250 --> c0094: `field snapshot`
- c0252 --> c0244: `field conflicts`
- c0252 --> c0253: `field watermarks`
- c0252 --> c0255: `field jobs`
- c0253 --> c0243: `field historyAlternatives`
- c0255 --|> c0249: `inherits`
- c0258 ..> c0094: `type in dedupeKey`
- c0258 ..> c0094: `type in orderedSourceEntryIds`
- c0258 ..> c0094: `type in summaryCursor`
- c0258 ..> c0107: `type in validateInspectionEntry`
- c0258 ..> c0173: `releaseCompletedArtifacts() calls get()`
- c0258 ..> c0236: `scrubDiagnostic() calls sanitizeText()`
- c0258 ..> c0240: `nowIso() calls now()`
- c0258 ..> c0243: `type in historyCaches`
- c0258 ..> c0243: `type in setHistoryCaches`
- c0258 ..> c0244: `type in conflictIdentityMatches`
- c0258 ..> c0248: `type in conflictIdentityMatches`
- c0258 ..> c0248: `type in identityMatches`
- c0258 ..> c0249: `type in identityMatches`
- c0258 ..> c0249: `type in interruptedWrite`
- c0258 ..> c0252: `type in normaliseState`
- c0258 ..> c0253: `type in clearHistoryCache`
- c0258 ..> c0253: `type in historyCaches`
- c0258 ..> c0253: `type in setHistoryCaches`
- c0258 ..> c0255: `type in releaseCompletedArtifacts`
- c0258 ..> c0258: `conflictIdentityMatches() calls identityMatches()`
- c0258 ..> c0258: `interruptedWrite() calls outcomeRecord()`
- c0258 ..> c0258: `releaseCompletedArtifacts() calls outcomeRecord()`
- c0258 ..> c0258: `releaseCompletedArtifacts() calls scrubDiagnostic()`
- c0258 ..> c0258: `setHistoryCaches() calls clearHistoryCache()`
- c0258 ..> c0258: `summaryCursor() calls orderedSourceEntryIds()`
- c0260 --> c0126: `field projects`
- c0260 --> c0129: `field scope`
- c0260 --> c0132: `field context`
- c0262 --> c0107: `field sessionContext`
- c0262 --> c0122: `field diagnosticContext`
- c0262 --> c0126: `field projects`
- c0262 --> c0129: `field scope`
- c0262 --> c0132: `field context`
- c0262 --> c0261: `field onPlan`
- c0263 --> c0129: `field scope`
- c0264 ..> c0013: `resultWithKnowledge() calls visible()`
- c0264 ..> c0079: `searchMemories() calls mapConcurrent()`
- c0264 ..> c0091: `constructor() calls isRecallConcurrency()`
- c0264 ..> c0091: `deeper() calls resolveScope()`
- c0264 ..> c0091: `recall() calls resolveScope()`
- c0264 --> c0109: `field client`
- c0264 ..> c0109: `type in constructor`
- c0264 ..> c0114: `type in memoryInScope`
- c0264 ..> c0114: `type in optionalKnowledge`
- c0264 --> c0117: `field model`
- c0264 ..> c0117: `type in constructor`
- c0264 ..> c0121: `type in recallReadTool`
- c0264 ..> c0126: `type in matchResolution`
- c0264 ..> c0126: `type in resolveScope`
- c0264 ..> c0129: `type in empty`
- c0264 ..> c0129: `type in memoryInScope`
- c0264 ..> c0129: `type in optionalKnowledge`
- c0264 ..> c0129: `type in requestsDifferentProject`
- c0264 ..> c0129: `type in resolveScope`
- c0264 ..> c0129: `type in searchMemories`
- c0264 ..> c0129: `type in searchRequest`
- c0264 ..> c0130: `type in searchRequest`
- c0264 ..> c0132: `type in contextProjectResolution`
- c0264 ..> c0132: `type in resolveScope`
- c0264 ..> c0132: `type in searchRequest`
- c0264 ..> c0173: `deeper() calls search()`
- c0264 ..> c0173: `resolveScope() calls listProjects()`
- c0264 ..> c0173: `searchMemories() calls search()`
- c0264 ..> c0184: `type in optionalKnowledge`
- c0264 ..> c0184: `type in resultWithKnowledge`
- c0264 --> c0185: `field knowledge`
- c0264 ..> c0185: `constructor() constructs KnowledgeReadService`
- c0264 ..> c0185: `optionalKnowledge() calls expand()`
- c0264 ..> c0200: `recallReadTool() calls executeKnowledgeRead()`
- c0264 ..> c0232: `recall() calls complete()`
- c0264 ..> c0236: `deeper() calls sanitizeText()`
- c0264 ..> c0236: `finishReview() calls sanitizeText()`
- c0264 ..> c0236: `optionalKnowledge() calls errorMessage()`
- c0264 ..> c0236: `plannerInput() calls sanitizeText()`
- c0264 ..> c0236: `queryContext() calls sanitizeText()`
- c0264 ..> c0236: `recall() calls sanitizeText()`
- c0264 ..> c0236: `recall() calls sanitizeValue()`
- c0264 ..> c0236: `searchFailure() calls errorMessage()`
- c0264 ..> c0236: `searchFailure() calls sanitizeValue()`
- c0264 ..> c0259: `type in authorizeProjectSelection`
- c0264 ..> c0259: `type in ensureLive`
- c0264 ..> c0259: `type in finishFailure`
- c0264 ..> c0259: `type in searchMemories`
- c0264 ..> c0260: `type in deeper`
- c0264 ..> c0261: `type in authorizeProjectSelection`
- c0264 ..> c0261: `type in queryContext`
- c0264 ..> c0261: `type in requestsDifferentProject`
- c0264 ..> c0261: `type in searchMemories`
- c0264 ..> c0261: `type in searchRequest`
- c0264 ..> c0262: `type in authorizeProjectSelection`
- c0264 ..> c0262: `type in finishFailure`
- c0264 ..> c0262: `type in plannerInput`
- c0264 ..> c0262: `type in recall`
- c0264 ..> c0262: `type in recallReadTool`
- c0264 ..> c0262: `type in requestsDifferentProject`
- c0264 ..> c0262: `type in searchMemories`
- c0264 ..> c0263: `type in deeper`
- c0264 ..> c0263: `type in empty`
- c0264 ..> c0263: `type in finishFailure`
- c0264 ..> c0263: `type in finishReview`
- c0264 ..> c0263: `type in recall`
- c0264 ..> c0263: `type in recallReadTool`
- c0264 ..> c0263: `type in resultWithKnowledge`
- c0264 ..> c0264: `authorizeProjectSelection() calls requestsDifferentProject()`
- c0264 ..> c0264: `circuitOpen() calls now()`
- c0264 ..> c0264: `deeper() calls circuitOpen()`
- c0264 ..> c0264: `deeper() calls empty()`
- c0264 ..> c0264: `deeper() calls memoryInScope()`
- c0264 ..> c0264: `deeper() calls optionalKnowledge()`
- c0264 ..> c0264: `deeper() calls recordFailure()`
- c0264 ..> c0264: `deeper() calls recordSuccess()`
- c0264 ..> c0264: `deeper() calls resultWithKnowledge()`
- c0264 ..> c0264: `finishFailure() calls empty()`
- c0264 ..> c0264: `finishFailure() calls recordFailure()`
- c0264 ..> c0264: `finishReview() calls recordFailure()`
- c0264 ..> c0264: `finishReview() calls recordSuccess()`
- c0264 ..> c0264: `recall() calls authorizeProjectSelection()`
- c0264 ..> c0264: `recall() calls circuitOpen()`
- c0264 ..> c0264: `recall() calls empty()`
- c0264 ..> c0264: `recall() calls ensureLive()`
- c0264 ..> c0264: `recall() calls finishFailure()`
- c0264 ..> c0264: `recall() calls finishReview()`
- c0264 ..> c0264: `recall() calls memoryInScope()`
- c0264 ..> c0264: `recall() calls optionalKnowledge()`
- c0264 ..> c0264: `recall() calls plannerInput()`
- c0264 ..> c0264: `recall() calls recallReadTool()`
- c0264 ..> c0264: `recall() calls recordSuccess()`
- c0264 ..> c0264: `recall() calls resultWithKnowledge()`
- c0264 ..> c0264: `recall() calls searchMemories()`
- c0264 ..> c0264: `recall() calls searchRequest()`
- c0264 ..> c0264: `recordFailure() calls now()`
- c0264 ..> c0264: `resolveScope() calls contextProjectResolution()`
- c0264 ..> c0264: `resolveScope() calls matchResolution()`
- c0264 ..> c0264: `searchMemories() calls ensureLive()`
- c0264 ..> c0264: `searchMemories() calls searchFailure()`
- c0264 ..> c0264: `searchMemories() calls searchRequest()`
- c0264 ..> c0264: `searchRequest() calls queryContext()`
- c0264 ..> c0265: `type in constructor`
- c0264 ..> c0266: `finishReview() constructs ReviewValidationError`
- c0264 ..> c0267: `type in contextProjectResolution`
- c0264 ..> c0267: `type in matchResolution`
- c0264 ..> c0267: `type in recallReadTool`
- c0264 ..> c0267: `type in resolveScope`
- c0264 ..> c0267: `type in searchMemories`
- c0264 ..> c0267: `type in searchRequest`
- c0264 ..> c0268: `type in searchMemories`
- c0264 ..> c0269: `authorizeProjectSelection() calls raceAbort()`
- c0264 ..> c0269: `deeper() calls createDeadlineSignal()`
- c0264 ..> c0269: `deeper() calls failureReason()`
- c0264 ..> c0269: `deeper() calls formatRecall()`
- c0264 ..> c0269: `deeper() calls isForgetfulResponseError()`
- c0264 ..> c0269: `deeper() calls raceAbort()`
- c0264 ..> c0269: `deeper() calls trim()`
- c0264 ..> c0269: `ensureLive() calls abortError()`
- c0264 ..> c0269: `finishFailure() calls failureReason()`
- c0264 ..> c0269: `finishFailure() calls submissionAttemptTrace()`
- c0264 ..> c0269: `finishReview() calls parseReview()`
- c0264 ..> c0269: `finishReview() calls reviewMismatchDirection()`
- c0264 ..> c0269: `finishReview() calls reviewSources()`
- c0264 ..> c0269: `finishReview() calls reviewValidationDebug()`
- c0264 ..> c0269: `finishReview() calls sourceLabels()`
- c0264 ..> c0269: `finishReview() calls submissionAttemptTrace()`
- c0264 ..> c0269: `optionalKnowledge() calls raceAbort()`
- c0264 ..> c0269: `plannerInput() calls availableProjects()`
- c0264 ..> c0269: `recall() calls boundDebugText()`
- c0264 ..> c0269: `recall() calls createDeadlineSignal()`
- c0264 ..> c0269: `recall() calls formatRecall()`
- c0264 ..> c0269: `recall() calls parsePlan()`
- c0264 ..> c0269: `recall() calls raceAbort()`
- c0264 ..> c0269: `recall() calls recallReviewSubmission()`
- c0264 ..> c0269: `recall() calls reviewSources()`
- c0264 ..> c0269: `recall() calls sanitizePolicy()`
- c0264 ..> c0269: `recall() calls submissionAttemptTrace()`
- c0264 ..> c0269: `recall() calls trim()`
- c0264 ..> c0269: `recallReadTool() calls abortError()`
- c0264 ..> c0269: `recallReadTool() calls reviewSources()`
- c0264 ..> c0269: `resolveScope() calls availableProjects()`
- c0264 ..> c0269: `searchMemories() calls exceptionDiagnostic()`
- c0264 ..> c0269: `searchMemories() calls isAbort()`
- c0264 ..> c0269: `searchMemories() calls raceAbort()`
- c0264 ..> c0269: `searchRequest() calls repoAwareQuery()`
- c0267 --> c0126: `field project`
- c0268 --> c0114: `field memories`
- c0269 ..> c0004: `availableProjects() calls set()`
- c0269 ..> c0114: `type in formatRecall`
- c0269 ..> c0114: `type in validateMemory`
- c0269 ..> c0124: `type in recallReviewSubmission`
- c0269 ..> c0126: `type in availableProjects`
- c0269 ..> c0132: `type in availableProjects`
- c0269 ..> c0132: `type in repoAwareQuery`
- c0269 ..> c0132: `type in repositoryIdentity`
- c0269 ..> c0184: `type in formatRecall`
- c0269 ..> c0236: `exceptionDiagnostic() calls sanitizeText()`
- c0269 ..> c0236: `formatRecall() calls sanitizeText()`
- c0269 ..> c0236: `parseReview() calls sanitizeText()`
- c0269 ..> c0236: `plannerString() calls sanitizeText()`
- c0269 ..> c0236: `repoAwareQuery() calls sanitizeText()`
- c0269 ..> c0236: `repositoryIdentity() calls sanitizeText()`
- c0269 ..> c0236: `reviewMismatchDirection() calls sanitizeText()`
- c0269 ..> c0236: `reviewerOutputText() calls sanitizeText()`
- c0269 ..> c0236: `reviewerOutputText() calls sanitizeValue()`
- c0269 ..> c0236: `sanitizePolicy() calls sanitizeText()`
- c0269 ..> c0236: `submissionAttemptTrace() calls sanitizeText()`
- c0269 ..> c0259: `type in createDeadlineSignal`
- c0269 ..> c0259: `type in failureReason`
- c0269 ..> c0261: `type in parsePlan`
- c0269 ..> c0263: `type in parseReview`
- c0269 ..> c0263: `type in recallReviewSubmission`
- c0269 ..> c0263: `type in reviewSources`
- c0269 ..> c0263: `type in reviewValidationDebug`
- c0269 ..> c0264: `createDeadlineSignal() calls now()`
- c0269 ..> c0269: `createDeadlineSignal() calls exceptionDiagnostic()`
- c0269 ..> c0269: `formatRecall() calls trim()`
- c0269 ..> c0269: `parseEntities() calls plannerString()`
- c0269 ..> c0269: `parsePlan() calls isObject()`
- c0269 ..> c0269: `parsePlan() calls parseEntities()`
- c0269 ..> c0269: `parsePlan() calls parseQueries()`
- c0269 ..> c0269: `parsePlan() calls plannerString()`
- c0269 ..> c0269: `parsePlan() calls positiveInteger()`
- c0269 ..> c0269: `parseQueries() calls plannerString()`
- c0269 ..> c0269: `parseReview() calls isObject()`
- c0269 ..> c0269: `parseReview() calls reviewSources()`
- c0269 ..> c0269: `parseReview() calls sourceLabels()`
- c0269 ..> c0269: `parseReview() calls trim()`
- c0269 ..> c0269: `plannerString() calls trim()`
- c0269 ..> c0269: `raceAbort() calls abortError()`
- c0269 ..> c0269: `repoAwareQuery() calls repositoryIdentity()`
- c0269 ..> c0269: `repoAwareQuery() calls trim()`
- c0269 ..> c0269: `repositoryIdentity() calls trim()`
- c0269 ..> c0269: `reviewMismatchDirection() calls isObject()`
- c0269 ..> c0269: `reviewMismatchDirection() calls trim()`
- c0269 ..> c0269: `reviewValidationDebug() calls boundDebugText()`
- c0269 ..> c0269: `reviewValidationDebug() calls reviewSources()`
- c0269 ..> c0269: `reviewValidationDebug() calls reviewerOutputText()`
- c0269 ..> c0269: `reviewValidationDebug() calls sourceLabels()`
- c0269 ..> c0269: `submissionAttemptTrace() calls trim()`
- c0269 ..> c0269: `validateMemory() calls isObject()`
- c0270 ..> c0269: `repositoryName() calls trim()`
- c0272 ..> c0271: `type in buildSetupPrompt`
- c0272 ..> c0271: `type in promptSetupHelp`
- c0273 --|> c0094: `inherits`
- c0275 --> c0093: `field mode`
- c0275 --> c0129: `field scope`
- c0275 --> c0132: `field context`
- c0275 --> c0277: `field session`
- c0276 --> c0273: `field snapshot`
- c0278 ..> c0092: `type in captureSummaryRecord`
- c0278 ..> c0092: `type in reuseCaptureHistory`
- c0278 ..> c0094: `type in captureConversation`
- c0278 ..> c0094: `type in compactCaptureSnapshot`
- c0278 ..> c0094: `type in reuseCaptureHistory`
- c0278 ..> c0094: `type in sanitizeCaptureSnapshot`
- c0278 ..> c0098: `type in compactCaptureSnapshot`
- c0278 ..> c0107: `type in collectEvidence`
- c0278 ..> c0107: `type in evidenceForEntry`
- c0278 ..> c0107: `type in toolEvidence`
- c0278 ..> c0236: `captureSummaryRecord() calls sanitizeText()`
- c0278 ..> c0236: `compactCaptureSnapshot() calls sanitizeText()`
- c0278 ..> c0236: `conversationForEntry() calls isMemoryOperation()`
- c0278 ..> c0236: `safeText() calls sanitizeText()`
- c0278 ..> c0236: `sanitizeCaptureSnapshot() calls sanitizeValue()`
- c0278 ..> c0236: `sanitizeConversation() calls sanitizeText()`
- c0278 ..> c0236: `sanitizeConversation() calls sanitizeValue()`
- c0278 ..> c0236: `toolEvidence() calls isMemoryOperation()`
- c0278 ..> c0236: `toolEvidence() calls sanitizeValue()`
- c0278 ..> c0269: `compactCaptureSnapshot() calls trim()`
- c0278 ..> c0269: `safeText() calls trim()`
- c0278 ..> c0274: `type in asMessage`
- c0278 ..> c0274: `type in lastAssistantEntry`
- c0278 ..> c0274: `type in toolEvidence`
- c0278 ..> c0275: `type in buildCaptureSnapshot`
- c0278 ..> c0275: `type in collectEvidence`
- c0278 ..> c0275: `type in toolEvidence`
- c0278 ..> c0276: `type in buildCaptureSnapshot`
- c0278 ..> c0278: `asMessage() calls isRecord()`
- c0278 ..> c0278: `buildCaptureSnapshot() calls collectEvidence()`
- c0278 ..> c0278: `buildCaptureSnapshot() calls deltaStartIndex()`
- c0278 ..> c0278: `buildCaptureSnapshot() calls lastAssistantEntry()`
- c0278 ..> c0278: `buildCaptureSnapshot() calls rootId()`
- c0278 ..> c0278: `buildCaptureSnapshot() calls snapshotId()`
- c0278 ..> c0278: `captureConversation() calls isRecord()`
- c0278 ..> c0278: `collectEvidence() calls evidenceForEntry()`
- c0278 ..> c0278: `compactCaptureSnapshot() calls captureConversation()`
- c0278 ..> c0278: `compactCaptureSnapshot() calls captureSummaryRecord()`
- c0278 ..> c0278: `compactCaptureSnapshot() calls isRecord()`
- c0278 ..> c0278: `contentText() calls isRecord()`
- c0278 ..> c0278: `conversationForEntry() calls asMessage()`
- c0278 ..> c0278: `conversationForEntry() calls isRecord()`
- c0278 ..> c0278: `conversationForEntry() calls sanitizeConversation()`
- c0278 ..> c0278: `evidenceForEntry() calls asMessage()`
- c0278 ..> c0278: `evidenceForEntry() calls contentText()`
- c0278 ..> c0278: `evidenceForEntry() calls isRecord()`
- c0278 ..> c0278: `evidenceForEntry() calls safeText()`
- c0278 ..> c0278: `evidenceForEntry() calls toolEvidence()`
- c0278 ..> c0278: `lastAssistantEntry() calls asMessage()`
- c0278 ..> c0278: `reuseCaptureHistory() calls captureSummaryRecord()`
- c0278 ..> c0278: `reuseCaptureHistory() calls isRecord()`
- c0278 ..> c0278: `sanitizeCaptureSnapshot() calls sanitizeCaptureConversation()`
- c0278 ..> c0278: `sanitizeConversation() calls isRecord()`
- c0278 ..> c0278: `toolEvidence() calls contentText()`
- c0278 ..> c0278: `toolEvidence() calls safeText()`
- c0281 --> c0279: `field error`
- c0281 --> c0279: `field provenanceError`
- c0282 ..> c0004: `readFile() calls close()`
- c0282 ..> c0009: `readFile() calls open()`
- c0282 ..> c0070: `getUrl() calls resolve()`
- c0282 ..> c0070: `git() calls resolve()`
- c0282 ..> c0070: `inspect() calls resolve()`
- c0282 ..> c0173: `getUrl() calls get()`
- c0282 ..> c0200: `readFile() calls readFile()`
- c0282 ..> c0214: `git() calls execute()`
- c0282 ..> c0236: `inspect() calls sanitizeValue()`
- c0282 ..> c0236: `inspectUrl() calls sanitizeText()`
- c0282 ..> c0236: `inspectUrl() calls sanitizeValue()`
- c0282 ..> c0269: `provenance() calls trim()`
- c0282 ..> c0280: `type in inspectUrl`
- c0282 ..> c0281: `type in inspect`
- c0282 ..> c0281: `type in inspectUrl`
- c0282 ..> c0282: `getUrl() calls check()`
- c0282 ..> c0282: `git() calls check()`
- c0282 ..> c0282: `inspect() calls check()`
- c0282 ..> c0282: `inspect() calls inspectUrl()`
- c0282 ..> c0282: `inspect() calls provenance()`
- c0282 ..> c0282: `inspect() calls readFile()`
- c0282 ..> c0282: `inspectUrl() calls check()`
- c0282 ..> c0282: `inspectUrl() calls getUrl()`
- c0282 ..> c0282: `provenance() calls git()`
- c0282 ..> c0282: `readFile() calls check()`
- c0282 --> c0283: `field options`
- c0282 ..> c0283: `type in constructor`
- c0282 ..> c0284: `getUrl() calls validateAddress()`
- c0282 ..> c0284: `getUrl() calls validateUrl()`
- c0282 ..> c0284: `git() calls requireInside()`
- c0282 ..> c0284: `inspect() calls errorDetails()`
- c0282 ..> c0284: `inspect() calls requireInside()`
- c0282 ..> c0284: `inspect() calls sourceContent()`
- c0282 ..> c0284: `inspectUrl() calls loopback()`
- c0282 ..> c0284: `inspectUrl() calls sourceContent()`
- c0282 ..> c0284: `inspectUrl() calls validateUrl()`
- c0282 ..> c0284: `provenance() calls errorDetails()`
- c0282 ..> c0284: `readFile() calls requireInside()`
- c0284 ..> c0236: `errorDetails() calls sanitizeText()`
- c0284 ..> c0236: `sourceContent() calls sanitizeText()`
- c0284 ..> c0236: `validateUrl() calls sanitizeText()`
- c0284 ..> c0236: `validateUrl() calls sanitizeValue()`
- c0284 ..> c0279: `type in errorDetails`
- c0284 ..> c0280: `type in sourceContent`
- c0284 ..> c0282: `validateAddress() calls check()`
- c0284 ..> c0284: `validateAddress() calls loopback()`

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
- Type36: `ForgetfulFieldLimits | undefined`
- Type37: `"pending" | "planned" | "complete" | "partial" | "unsupported"`
- Type38: `Array<{ memoryId: number; reason: string }>`
- Type39: `{ documents: Document[]; codeArtifacts: CodeArtifact[] }`
- Type40: `Array<{ operation: string; error: string }>`
- Type41: `"link" | "unlink" | "attachments" | "entity"`
- Type42: `"started" | "completed" | "failed"`
- Type43: `"keep" | "reject" | "add" | "ignore" | "unresolved"`
- Type44: `"complete" | "unresolved"`
- Type45: `Promise<Memory | undefined>`
- Type46: `NonNullable<CaptureLinkReview["unreviewed"]>`
- Type47: `{ automaticIds?: number[]; beforeRead: () => Promise<void>; includeAttachments?: boolean
  }`
- Type48: `Map<string, boolean>`
- Type49: `Map<string, { decisions: LinkDecision[]; preservation?: PreservationDecision }>`
- Type50: `Array<{ candidateId: string; review: CaptureLinkReview }>`
- Type51: `ConnectionResult["operation"]`
- Type52: `(markDispatched: () => void) => Promise<unknown>`
- Type53: `(review: CaptureLinkReview) => Promise<void>`
- Type54: `() => Promise<void>`
- Type55: `Promise<{ documents: Document[]; codeArtifacts: CodeArtifact[] }>`
- Type56: `Record<string, { status: "started" | "completed" | "rejected"; error?: string; input?:
  unknown; }>`
- Type57: `(number[] | undefined)[]`
- Type58: `number | null | undefined`
- Type59: `Pick<MergeConnections, "documentIds" | "codeArtifactIds" | "fileIds">`
- Type60: `Array<{ id: string; reason: string }>`
- Type61: `| { valid: true; value: T } | { valid: false; reason: string }`
- Type62: `"create" | "skip" | "supersede" | "escalate" | "retire" | "merge"`
- Type63: `"reviewing" | "saving" | "checking"`
- Type64: `"memory" | "maintenance"`
- Type65: `"userDecision" | "verifiedToolChange" | "observation"`
- Type66: `Array<{ jobId: string; error: string }>`
- Type67: `"ready" | "busy"`
- Type68: `{ status: CaptureLinkReview["status"]; unreviewedCount: number; reason?: string }`
- Type69: `PendingConflict["status"]`
- Type70: `{ error: unknown }`
- Type71: `{ entryId: string; inspectionEntryIds: string[] } | null`
- Type72: `"resolved" | "deferred" | "rejected"`
- Type73: `Array<{ key: string; id: number }>`
- Type74: `(id: number) => Promise<Memory>`
- Type75: `() => boolean | Promise<boolean>`
- Type76: `() => CaptureMode | Promise<CaptureMode>`
- Type77: `() => Date`
- Type78: `Promise<ForgetfulFieldLimits | undefined>`
- Type79: `CaptureServiceOptions["onActivity"]`
- Type80: `(signal: AbortSignal) => Promise<T>`
- Type81: `"reviewing" | "checking"`
- Type82: `"info" | "debug"`
- Type83: `"capture" | "overlap" | "overlapBatch"`
- Type84: `"created" | "skipped" | "replacement-created"`
- Type85: `Promise<"applied" | "already">`
- Type86: `Promise<{ job: QueueJob; destination?: number }>`
- Type87: `Promise< | { status: "ready"; job: QueueJob; outcome: Record<string, unknown> |
  undefined; overlaps: Memory[]; } | { status: "skipped"; job: QueueJob } >`
- Type88: `Record<string, unknown> | undefined`
- Type89: `Promise<Entity | undefined>`
- Type90: `Promise<{ entities: Entity[]; truncated: boolean }>`
- Type91: `Promise<{ relationships: EntityRelationship[]; truncated: boolean }>`
- Type92: `Promise<{ job: QueueJob; inputs: CaptureBatchInput[] }>`
- Type93: `Promise< | { status: "ready"; job: QueueJob; decision: CaptureDecision } | { status:
  "skipped"; job: QueueJob } >`
- Type94: `Promise<{ job: QueueJob; plan: CaptureMergePlan }>`
- Type95: `Promise<{ job: QueueJob; candidates: CaptureCandidate[]; progress?: boolean }>`
- Type96: `{ candidate: CaptureCandidate; decision?: CaptureDecision }`
- Type97: `CaptureMergePlan | undefined`
- Type98: `Promise<QueueJob | undefined>`
- Type99: `CaptureUncertainWrite | undefined`
- Type100: `Promise<{ job: QueueJob; stopped: boolean }>`
- Type101: `CaptureLinkReview | undefined`
- Type102: `Promise<{ job: QueueJob; inputs: Array<{ candidateId: string; review: CaptureLinkReview
  }> }>`
- Type103: `{ candidate: CaptureCandidate; outcome: Record<string, unknown>; review:
  CaptureLinkReview; operation: string; error: unknown; }`
- Type104: `Promise<{ job: QueueJob; needsCorrection: boolean }>`
- Type105: `Promise<"progress" | void>`
- Type106: `Promise<"advance" | "progress" | "deferred">`
- Type107: `CaptureSnapshot | CaptureCheckpointOptions`
- Type108: `{ sessionId?: string; branchId?: string; jobId?: string; limit?: number; }`
- Type109: `{ sessionId?: string; branchId?: string; }`
- Type110: `{ sessionId?: string; branchId?: string } | string`
- Type111: `Promise<NonNullable<PendingConflict["replacement"]>>`
- Type112: `CaptureAdvanceInput | CaptureSnapshot`
- Type113: `Pick<WorkContext, "sessionId" | "branchId">`
- Type114: `(phase: CaptureActivityPhase | undefined) => void`
- Type115: `{ id: number; name: string }[]`
- Type116: `"supersede" | "skip" | "defer"`
- Type117: `CaptureDecision | undefined`
- Type118: `string | undefined`
- Type119: `(id: string, raw: unknown, reason?: string) => void`
- Type120: `(reason: string) => void`
- Type121: `number[] | undefined`
- Type122: `string[] | undefined`
- Type123: `"reason" | "oldClaim" | "newClaim"`
- Type124: `KnowledgeWritePlan | undefined`
- Type125: `(item: T, index: number) => Promise<R>`
- Type126: `{ userSettings: string; projectSettings: string; }`
- Type127: `"classification" | "recall" | "capture"`
- Type128: `"default" | "project" | "invalid"`
- Type129: `"debug" | "info" | "warning" | "error"`
- Type130: `value is Record<string, unknown>`
- Type131: `ModelSelection | undefined`
- Type132: `{ scope: Scope; scopeSource: ScopeSource }`
- Type133: `Partial< Pick< PersistedUserSettings, | "base_url" | "token_env" | "timeout_ms" |
  "enabled" | "planning_panel" | "capture_mode" | "debug" | "verbosity" | "logging" |
  "log_directory" | "recall_model_timeout_ms" | "recall_concurrency" | "context_limit_tokens" |
  "model" > >`
- Type134: `{ baseUrl: string; tokenEnv?: string }`
- Type135: `"auto" | "observe" | "off"`
- Type136: `"complete" | "legacy-partial" | "summarized"`
- Type137: `number | null`
- Type138: `Omit<CodeArtifact, "code">`
- Type139: `Omit<Document, "content">`
- Type140: `"Organization" | "Individual" | "Team" | "Device" | "System" | "Other"`
- Type141: `"user" | "assistant" | "toolResult"`
- Type142: `Record<string, Record<string, ForgetfulFieldBound>>`
- Type143: `Promise<{ id: number; title: string }[]>`
- Type144: `Promise<"ready" | "progress">`
- Type145: `"classification" | "recall-review" | "capture" | "overlap"`
- Type146: `(view: CompactedConversation) => Promise<void>`
- Type147: `() => unknown`
- Type148: `{ jobId?: string; sessionId?: string; branchId?: string; candidateId?: string; }`
- Type149: `"global" | "project"`
- Type150: `"draft" | "active" | "completed" | "archived"`
- Type151: `"unknown" | "enabled" | "disabled"`
- Type152: `"P0" | "P1" | "P2" | "P3"`
- Type153: `"todo" | "doing" | "waiting" | "done" | "cancelled"`
- Type154: `Array<{ key: string; stage: string; reason?: string; count?: number }>`
- Type155: `{ detail: string; retryPending: boolean; key: string }`
- Type156: `| { kind: "completed"; value: T } | { kind: "aborted" } | { kind: "timed-out" } | {
  kind: "failed"; error: unknown }`
- Type157: `"completed"`
- Type158: `"aborted"`
- Type159: `"timed-out"`
- Type160: `"failed"`
- Type161: `{ sessionId: string; branchId: string; entryIds: string[]; finalEntryId?: string;
  snapshotId?: string; }`
- Type162: `void | Promise<void>`
- Type163: `{ action: "supersede" | "skip" | "defer"; reason?: string; evidenceEntryIds?: string[];
  additionalEvidence?: string; additionalEntries?: EvidenceEntry[]; conversation?: readonly
  unknown[]; }`
- Type164: `Map<string, number>`
- Type165: `(options: { baseUrl: string; token?: string; timeoutMs: number; }) => ForgetfulClient`
- Type166: `( client: ForgetfulClient, model: PiMemoryModel, config: ForgetfulConfig, ) =>
  RecallServicePort`
- Type167: `( config: ForgetfulConfig, client: ForgetfulClient | undefined, model: PiMemoryModel |
  undefined, ) => CaptureServicePort | undefined`
- Type168: `( ctx: ExtensionContext, branchId: string, ) => Promise<ExtensionWorkContext> |
  ExtensionWorkContext`
- Type169: `Partial< Pick< LoadConfigOptions, | "userSettingsPath" | "projectSettingsPath" |
  "userPromptDir" | "projectPromptDir" > >`
- Type170: `Partial<Record<PolicyName, string>>`
- Type171: `keyof typeof DEFAULT_MEMORY_POLICIES | "capture" | "overlap"`
- Type172: `"automatic" | "queued"`
- Type173: `"pending" | "retrieval" | "terminal"`
- Type174: `RecallRequest & { sessionContext?: EvidenceEntry[] }`
- Type175: `Map<string, CaptureFeedbackState>`
- Type176: `{ throughTriggerId: number; branches: CaptureBranch[] }`
- Type177: `Map<string, PendingQueuedRecall[]>`
- Type178: `Map<string, AutomaticRecall>`
- Type179: `Map<string, RecallJob>`
- Type180: `readonly (AbortSignal | undefined)[]`
- Type181: `Promise<string | undefined>`
- Type182: `Promise<SetupAuthentication | undefined>`
- Type183: `"context" | "failure" | "no-context"`
- Type184: `{ id: string; prompt: string } | undefined`
- Type185: `Array<{ role: string; content?: unknown }>`
- Type186: `Promise<Model<any> | undefined>`
- Type187: `Model<any> | undefined`
- Type188: `"info" | "warning" | "error"`
- Type189: `"warning" | "error"`
- Type190: `CaptureCheckpointResult | undefined`
- Type191: `AutomaticCaptureJobOutcome | undefined`
- Type192: `Promise<AutomaticCaptureJobOutcome | undefined>`
- Type193: `{ failure?: NonNullable<AutomaticCaptureJobOutcome["failure"]>; recovered: boolean; }`
- Type194: `ReturnType<typeof collectCaptureFeedback>`
- Type195: `{ message?: string; terminalJobIds: string[] }`
- Type196: `(value: unknown) => Memory`
- Type197: `( path: string, method: string, body: unknown, signal: AbortSignal | undefined,
  statuses: number[], ) => Promise<unknown>`
- Type198: `Partial<DocumentInput | CodeArtifactInput>`
- Type199: `DocumentSummary | CodeArtifactSummary`
- Type200: `string | URL`
- Type201: `AbortSignal | undefined`
- Type202: `T | undefined`
- Type203: `NonNullable<KnowledgeExpansionResult["failures"]>`
- Type204: `{ operation: string; message: string }[]`
- Type205: `KnowledgeReadServiceOptions | MemoryReader`
- Type206: `Promise<Map<number, Entity>>`
- Type207: `Map<number, Entity>`
- Type208: `({ id: number; title: string }[] | undefined)[]`
- Type209: `( id: number, signal?: AbortSignal, ) => Promise<Memory>`
- Type210: `Promise<T | undefined>`
- Type211: `Record<string, unknown> & { operation: string }`
- Type212: `{ id: number; name: string }`
- Type213: `Array<ToolText | ToolImage>`
- Type214: `"image"`
- Type215: `"text"`
- Type216: `Array<[string, number]>`
- Type217: `Document | CodeArtifact`
- Type218: `"content" | "code"`
- Type219: `{ items: T[]; offset: number; limit: number; total: number; truncated: boolean }`
- Type220: `{ items: unknown[]; offset: number; limit: number; total: number; truncated: boolean;
  next_offset: number }`
- Type221: `{ content: Array<ToolText | ToolImage>; kind: string }`
- Type222: `{ source_repo?: string; source_files?: string[]; encoding_version?: string; }`
- Type223: `(() => Promise<void>) | undefined`
- Type224: `( state: KnowledgeWriteState, ) => Promise<void>`
- Type225: `{ title: string; content: string }`
- Type226: `{ kind: string; key: string; occurrence: number; input: unknown; error: string }`
- Type227: `{ kind: string; key: string; occurrence: number; input: unknown; create: () =>
  Promise<T>; }`
- Type228: `KnowledgeWriteGuard | undefined`
- Type229: `{ document_ids?: number[]; code_artifact_ids?: number[]; }`
- Type230: `{ kind: string; key: string; input: unknown; execute: () => Promise<unknown> }`
- Type231: `T & { occurrence: number }`
- Type232: `Pick< KnowledgeClient, | "getEntity" | "createEntity" | "getDocument" | "createDocument"
  | "getCodeArtifact" | "createCodeArtifact" | "createRelationship" | "linkEntityMemory" |
  "linkMemories" | "updateMemory" >`
- Type233: `{ key: string }[]`
- Type234: `"off" | "info" | "debug"`
- Type235: `{ directory: string; sessionId: string; level: FileLogLevel; onError?: (error: unknown)
  => void; maxFileBytes?: number; maxFiles?: number; maxEventBytes?: number; }`
- Type236: `{ lines: string[]; trace: boolean }`
- Type237: `CompactedMemoryHistory & { summaryMessage: Message }`
- Type238: `CompactedMemoryHistory | undefined`
- Type239: `(history: CompactedMemoryHistory) => Promise<void>`
- Type240: `Promise<number | "progress">`
- Type241: `( context: Context, options: SimpleStreamOptions, ) => Promise<AssistantMessage>`
- Type242: `ToolResultMessage["content"]`
- Type243: `Promise<{ summary: string; count: number }>`
- Type244: `( headers: ProviderHeaders, ) => ProviderHeaders | Promise<ProviderHeaders>`
- Type245: `ModelRegistryPort & { getAvailable?: () => Model<any>[]; }`
- Type246: `readonly { model: Model<any> }[]`
- Type247: `"task" | "compaction"`
- Type248: `() => Promise<number>`
- Type249: `ProviderHeaders | undefined`
- Type250: `MemoryModelHeaderTransform | undefined`
- Type251: `ModelSubmissionTool | ModelReadTool`
- Type252: `PiMemoryModel | undefined`
- Type253: `Project | undefined`
- Type254: `Promise<ProjectInput | undefined>`
- Type255: `Promise<Project | undefined>`
- Type256: `DurableQueueStoreOptions | string`
- Type257: `( state: QueueState, ) => | Promise<{ value: T; changed?: boolean }> | { value: T;
  changed?: boolean }`
- Type258: `WatermarkAdvance | CaptureSnapshot`
- Type259: `WorkContext & { projects?: Project[] }`
- Type260: `Promise<{ job: QueueJob; historyError?: string }>`
- Type261: `Promise<{ history?: NonNullable<SnapshotPayload["historySummary"]>; historyError?:
  string; }>`
- Type262: `Array<{ sessionId: string; branchId: string }>`
- Type263: `{ sessionId: string; branchId: string }`
- Type264: `(outcomes: Array<{ jobId: string; error: string }>) => void`
- Type265: `{ sessionId: string; branchId: string } | undefined`
- Type266: `QueueCheckpoint | string`
- Type267: `Promise<PendingConflict | undefined>`
- Type268: `"pending" | "handed_off" | "resolved" | "rejected"`
- Type269: `{ // Missing version identifies legacy implicit preservation plans; never execute as
  explicit. planVersion?: 1; requestKey?: string; requestPayload?: string; request?: {
  evidenceEntryIds: string[]; selectedAdditionalEntries: EvidenceEntry[]; reason?: string;
  additionalEvidence?: string; }; // The model's update selection and this plan's actual target are
  distinct from older targets. replacementMemoryId?: number; memoryId?: number; priorMemoryId?:
  number; updateComplete?: boolean; executionError?: string; // Service creation output, separate
  from model-selected manual link operations. autoLinkedMemoryIds?: number[]; completedEntityIds?:
  number[]; completedMemoryIds?: number[]; creationError?: string; input: MemoryInput; candidate:
  unknown; entityIds: number[]; memoryIds: number[]; linksComplete?: boolean; creationAttempted?:
  boolean; knowledgeState?: unknown; }`
- Type270: `Omit<CaptureSnapshot, "entries" | "conversation" | "sourceConversation">`
- Type271: `| "pending" | "running" | "paused" | "complete" | "failed"`
- Type272: `1 | 2`
- Type273: `Record<string, QueueWatermark>`
- Type274: `Pick<CaptureSnapshot, "entries" | "conversation" | "sourceConversation" |
  "historySummary"> & { /** Full source ordering for completed caches; kept outside the bounded
  queue index. */ historyEntryIds?: string[]; }`
- Type275: `"retire"`
- Type276: `{ throughEntryId: string; entryIds: string[]; } | undefined`
- Type277: `{ throughEntryId: string; entryIds: string[] }`
- Type278: `{ throughEntryId?: string; entryIds?: string[] }`
- Type279: `(stage: string, error: unknown) => string`
- Type280: `NonNullable<ModelRequest["diagnosticContext"]>`
- Type281: `(projectId: number, reason: string) => Promise<boolean>`
- Type282: `(plan: RecallPlan) => void`
- Type283: `() => number`
- Type284: `{ stage: string; debugTrace: string; plannerRejections: string[]; reviewRejections:
  string[]; failedReviewDebug: string | undefined; }`
- Type285: `Promise<KnowledgeExpansionResult | undefined>`
- Type286: `KnowledgeExpansionResult | undefined`
- Type287: `Project[] | undefined`
- Type288: `error is Error & { responseBody: string }`
- Type289: `Memory | undefined`
- Type290: `{ text: string; ids: number[]; knowledgeText: string }`
- Type291: `Record<keyof typeof SOURCE_FIELDS, number[]>`
- Type292: `"Review" | "Planner"`
- Type293: `{ summary: string; reason: string; sources: ReturnType<typeof reviewSources>; }`
- Type294: `(debug: string) => void`
- Type295: `"CLI" | "MCP"`
- Type296: `Promise<SetupHelp | "manual" | undefined>`
- Type297: `(toolName: string, text: string) => boolean`
- Type298: `| { status: "ready"; snapshot: CaptureSnapshotWithStatus } | { status: "skipped";
  reason: string; finalEntryId?: string }`
- Type299: `"ready"`
- Type300: `"skipped"`
- Type301: `MessageRecord | undefined`
- Type302: `EvidenceEntry | undefined`
- Type303: `SnapshotOptions["includeToolEvidence"]`
- Type304: `| ((toolName: string, text: string) => boolean) | undefined`
- Type305: `{ entry: SessionEntry; message: MessageRecord } | undefined`
- Type306: `CaptureHistorySummary | undefined`
- Type307: `Pick< Static<typeof SOURCE_INSPECTION_PARAMETERS>, "offset" | "limit" > & ({ path:
  string; url?: never } | { url: string; path?: never })`
- Type308: `{ status: "ok"; identifier: string; content: string; observedAt: string; /** SHA-256 of
  the complete observed source bytes, before sanitizing or paging. */ contentHash: string;
  sanitized: boolean; page: { offset: number; totalCharacters: number; nextOffset?: number };
  source_repo?: string; source_files?: string[]; source_url?: string; encoding_version?: string; /**
  Describes the observed file bytes, not the repository/index as a whole. */ fileState?: "committed"
  | "modified" | "uncommitted" | "unknown"; provenanceError?: SourceInspectionError; httpStatus?:
  number; } | { status: "error"; observedAt: string; error: SourceInspectionError; source_url?:
  string; httpStatus?: number; httpStatusText?: string; body?: string; }`
- Type309: `"ok"`
- Type310: `{ offset: number; totalCharacters: number; nextOffset?: number }`
- Type311: `"committed" | "modified" | "uncommitted" | "unknown"`
- Type312: `"error"`
- Type313: `{ path: string; dev: number; ino: number }`
- Type314: `SourceInspectionRequest & { url: string }`
- Type315: `Promise<{ bytes: Buffer; status: number; statusText: string; location?: string; }>`

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
- Signature22: `-policyFor(snapshot: CaptureSnapshot, purpose: "capture" | "overlap" |
  "overlapBatch", limits: ForgetfulFieldLimits) string`
- Signature23: `-addConflict(job: QueueJob, candidate: CaptureCandidate, destinationProjectId:
  number, decision: CaptureDecision, reason: string, oldMemory: Memory, replacementId: number)
  Promise<PendingConflict>`
- Signature24: `-checkpointOutcome(job: QueueJob, candidateId: string, outcome: unknown)
  Promise<QueueJob>`
- Signature25: `-destinationProjects(candidate: CaptureCandidate, context: WorkContext)
  Promise<number[]>`
- Signature26: `-validateDecision(decision: CaptureDecision, _candidate: CaptureCandidate,
  _overlaps: Memory[], _batch: unknown, _neighborhood: CaptureNeighborhood) void`
- Signature27: `-createMemory(job: QueueJob, candidate: CaptureCandidate, destination: number,
  projectIds: unknown, replacement: unknown) Promise<MemoryCreateResult>`
- Signature28: `-writeKnowledge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  memoryId: number, baseOutcome: Record<string, unknown>, finalStage: "created" | "skipped" |
  "replacement-created", existingMemory: Memory) Promise<QueueJob>`
- Signature29: `-supersessionAlreadyApplied(job: QueueJob, oldMemoryId: number, replacementId:
  number | undefined, destination: number) Promise<boolean>`
- Signature30: `-applySupersession(job: QueueJob, oldMemory: Memory, replacementId: number |
  undefined, reason: string, destination: number) Promise<"applied" | "already">`
- Signature31: `-finishSupersession(job: QueueJob, candidate: CaptureCandidate, destination: number,
  oldMemory: Memory, replacementId: number, reason: string, decision: CaptureDecision)
  Promise<QueueJob>`
- Signature32: `-processReplacementCheckpoint(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature33: `-processKnowledgeCheckpoint(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature34: `-loadOverlaps(job: QueueJob, candidate: CaptureCandidate, outcome: Record<string,
  unknown> | undefined, destination: number) Promise< | { status: "ready"; job: QueueJob; outcome:
  Record<string, unknown> | undefined; overlaps: Memory[]; } | { status: "skipped"; job: QueueJob }
  >`
- Signature35: `-neighborhoodEntities(job: QueueJob, candidate: CaptureCandidate, destination:
  number) Promise<{ entities: Entity[]; truncated: boolean }>`
- Signature36: `-existingNeighborhood(job: QueueJob, candidate: CaptureCandidate, destination:
  number) Promise<CaptureNeighborhood>`
- Signature37: `-decideOverlap(job: QueueJob, candidate: CaptureCandidate, outcome: Record<string,
  unknown> | undefined, overlaps: Memory[], destination: number) Promise< | { status: "ready"; job:
  QueueJob; decision: CaptureDecision } | { status: "skipped"; job: QueueJob } >`
- Signature38: `-recordEscalation(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision, reason: string, oldMemory: Memory, outcomeReason: string)
  Promise<QueueJob>`
- Signature39: `-supersedeCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature40: `-readMaintenanceTargets(job: QueueJob, ids: number[], destination: number)
  Promise<Memory[]>`
- Signature41: `-preflightRetirement(job: QueueJob, candidateId: string, destination: number, ids:
  number[]) Promise<void>`
- Signature42: `-composeMerge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<{ job: QueueJob; plan: CaptureMergePlan }>`
- Signature43: `-verifyRequestedMerge(job: QueueJob, outcome: Record<string, unknown> | undefined,
  replacementId: number, destination: number) Promise<void>`
- Signature44: `-finishMerge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision, plan: CaptureMergePlan, replacementId: number) Promise<QueueJob>`
- Signature45: `-mergeCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<QueueJob>`
- Signature46: `-retireCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<QueueJob>`
- Signature47: `-equivalentMemory(job: QueueJob, candidateId: string, destination: number)
  Promise<Memory>`
- Signature48: `-skipCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature49: `-applyDecision(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature50: `-processCandidate(job: QueueJob, candidate: CaptureCandidate, outcome: unknown)
  Promise<QueueJob>`
- Signature51: `-saveCorrectableFailure(job: QueueJob, candidate: CaptureCandidate, error: unknown)
  Promise<QueueJob | undefined>`
- Signature52: `-recordCandidateFailure(currentJob: QueueJob, candidate: CaptureCandidate, error:
  unknown, result: CaptureCheckpointResult) Promise<void>`
- Signature53: `-pauseCandidate(job: QueueJob, error: CapturePause, result: CaptureCheckpointResult)
  Promise<void>`
- Signature54: `-correctCandidateFailures(job: QueueJob, candidates: CaptureCandidate[], result:
  CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature55: `-processCandidates(job: QueueJob, candidates: CaptureCandidate[], result:
  CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature56: `-processOrderedCandidates(job: QueueJob, candidates: CaptureCandidate[], ordered:
  CaptureCandidate[], result: CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature57: `-refreshLinkReview(current: QueueJob, candidates: CaptureCandidate[], outcome:
  Record<string, unknown>, mode: CaptureMode, prior: CaptureLinkReview | undefined)
  Promise<CaptureLinkReview>`
- Signature58: `-migrateLegacyLinkReview(job: QueueJob, candidateId: string, outcome: Record<string,
  unknown>) Promise<QueueJob>`
- Signature59: `-planLinkReviews(job: QueueJob, candidates: CaptureCandidate[], inputs: Array<{
  candidateId: string; review: CaptureLinkReview }>) Promise<QueueJob>`
- Signature60: `-previousSupersessionCompleted(job: QueueJob, outcome: Record<string, unknown>,
  review: CaptureLinkReview) Promise<boolean>`
- Signature61: `-finishReviewedSupersession(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature62: `-runBranchWorker(branch: CaptureBranch, budget: number, result:
  CaptureCheckpointResult) Promise<void>`
- Signature63: `-recordBranchFailure(job: QueueJob, result: CaptureCheckpointResult, error: unknown,
  started: number) Promise<void>`
- Signature64: `-checkpointBranch(branch: CaptureBranch, budget: number)
  Promise<CaptureCheckpointResult>`
- Signature65: `-appendCheckpointResult(total: CaptureCheckpointResult, result:
  CaptureCheckpointResult) void`
- Signature66: `pendingConflicts(optionsOrSession: { sessionId?: string; branchId?: string } |
  string, branchId: string) Promise<CapturePendingConflict[]>`
- Signature67: `-rejectConflict(conflict: PendingConflict, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature68: `-selectResolutionEvidence(conflict: PendingConflict, input: ResolveConflictInput,
  additionalIds: string[]) string[]`
- Signature69: `-validateResolutionEvidence(conflict: PendingConflict, input: ResolveConflictInput)
  ConflictResolutionEvidence`
- Signature70: `-markConflictResolved(conflictId: string, resolution: unknown)
  Promise<CaptureResolveResult>`
- Signature71: `-planConflictReplacement(conflict: PendingConflict, candidate: CaptureCandidate,
  evidence: ConflictResolutionEvidence, context: WorkContext, current: Memory, requestPayload:
  string, conversation: readonly unknown[]) Promise<NonNullable<PendingConflict["replacement"]>>`
- Signature72: `-updateResolutionReplacement(conflict: PendingConflict, replacementId: number)
  Promise<void>`
- Signature73: `-linkResolutionEntity(conflict: PendingConflict, replacementId: number, id: number)
  Promise<void>`
- Signature74: `-applyConflictResolution(conflict: PendingConflict, evidence:
  ConflictResolutionEvidence, target: ConflictResolutionTarget, requestPayload: string,
  conversation: readonly unknown[]) Promise<CaptureResolveResult>`
- Signature75: `-resolveConflictOwned(conflictId: string, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature76: `resolveConflict(conflictId: string, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature77: `sharedSourceEvidence(candidates: CaptureCandidate[], snapshot: CaptureSnapshot)
  EvidenceEntry[]`
- Signature78: `eligibleCandidate(value: unknown, snapshot: CaptureSnapshot, index: number)
  CandidateValidation<CaptureCandidate>`
- Signature79: `parseCandidates(value: unknown, snapshot: CaptureSnapshot, onCandidate: (id: string,
  raw: unknown, reason?: string) => void) CandidateExtraction`
- Signature80: `captureCandidateSubmission(snapshot: CaptureSnapshot, recordRejection: (reason:
  string) => void) ModelSubmissionTool`
- Signature81: `memoryInput(candidate: CaptureCandidate, projectIds: number[], context: WorkContext)
  MemoryInput`
- Signature82: `captureKnowledgePlan(candidate: CaptureCandidate, destination: number, memoryId:
  number, context: WorkContext, existingMemory: Memory, operationId: unknown, entityMemoryKeys:
  string[]) KnowledgeWritePlan | undefined`
- Signature83: `readPromptDirectory(path: string, trusted: boolean, warnings: string[])
  Promise<PromptOverlays>`
- Signature84: `mergePrompts(globalPrompts: PromptOverlays, projectPrompts: PromptOverlays)
  PromptOverlays`
- Signature85: `resolveScope(projectData: JsonReadResult, projectPath: string, trusted: boolean,
  warnings: string[]) { scope: Scope; scopeSource: ScopeSource }`
- Signature86: `+obsolete(id: number, reason: string, replacementId: number, signal: AbortSignal)
  Promise<void>`
- Signature87: `+supersede(id: number, replacementId: number, reason: string, signal: AbortSignal)
  Promise<void>`
- Signature88: `+updateEntity(id: number, input: Partial<EntityInput>, signal: AbortSignal)
  Promise<Entity>`
- Signature89: `+createRelationship(input: EntityRelationshipInput, signal: AbortSignal)
  Promise<EntityRelationship>`
- Signature90: `+updateDocument(id: number, input: Partial<DocumentInput>, signal: AbortSignal)
  Promise<Document>`
- Signature91: `+listCodeArtifacts(projectId: number, signal: AbortSignal)
  Promise<CodeArtifactSummary[]>`
- Signature92: `+updateCodeArtifact(id: number, input: Partial<CodeArtifactInput>, signal:
  AbortSignal) Promise<CodeArtifact>`
- Signature93: `+updateMemory(id: number, input: Partial<MemoryInput>, signal: AbortSignal)
  Promise<Memory>`
- Signature94: `boundedWait(promise: Promise<T>, signals: readonly (AbortSignal | undefined)[],
  timeoutMs: number) Promise<BoundedWaitOutcome<T>>`
- Signature95: `automaticRecallTerminalText(result: RecallResult, kind: "automatic" | "queued",
  resultInHistory: unknown) string`
- Signature96: `recordRecallActivity(runtime: Runtime, result: RecallResult, ctx: ExtensionContext,
  elapsedMs: number) void`
- Signature97: `conflictBelongsToActiveBranch(conflict: Record<string, unknown>, runtime: Runtime,
  ctx: ExtensionContext) boolean`
- Signature98: `discoverWorkContext(pi: ExtensionAPI, ctx: ExtensionContext, branchId: string)
  Promise<ExtensionWorkContext>`
- Signature99: `log(ctx: ExtensionContext, config: ForgetfulConfig, message: string, level:
  Verbosity, fileMessage: unknown) void`
- Signature100: `logFailure(ctx: ExtensionContext, config: ForgetfulConfig, message: string, error:
  unknown, level: "warning" | "error") void`
- Signature101: `readCaptureOutcome(capture: CaptureServicePort, runtime: Runtime, jobId: string,
  checkpointResult: CaptureCheckpointResult) Promise<AutomaticCaptureJobOutcome | undefined>`
- Signature102: `updateDocument(documentId: number, input: Partial<DocumentInput>, signal:
  AbortSignal) unknown`
- Signature103: `updateCodeArtifact(artifactId: number, input: Partial<CodeArtifactInput>, signal:
  AbortSignal) unknown`
- Signature104: `supersede(id: number, replacementId: number, reason: string, signal: AbortSignal)
  Promise<void>`
- Signature105: `obsolete(id: number, reason: string, replacementId: number, signal: AbortSignal)
  Promise<void>`
- Signature106: `#request(pathOrUrl: string | URL, method: string, body: unknown, callerSignal:
  AbortSignal | undefined, expectedStatuses: number[]) Promise<unknown>`
- Signature107: `-throwResponseError(response: Response, method: string, url: URL, signal:
  AbortSignal, maxBytes: number) Promise<never>`
- Signature108: `parseSearchPayload(payload: unknown, fallbackQuery: string, requireMetadata:
  unknown) MemorySearchResult`
- Signature109: `-findRelationships(entities: Entity[], request: ExpansionContext)
  Promise<RelationshipExpansion[]>`
- Signature110: `-collectRelationships(entities: Entity[], request: ExpansionContext)
  Promise<EntityRelationship[]>`
- Signature111: `-resolveRelationshipEndpoints(entities: Entity[], relationships:
  EntityRelationship[], request: ExpansionContext) Promise<Map<number, Entity>>`
- Signature112: `-formatRelationships(entities: Entity[], relationships: EntityRelationship[],
  endpoints: Map<number, Entity>, request: KnowledgeExpansionRequest) RelationshipExpansion[]`
- Signature113: `-findEntityMemories(entities: Entity[], request: ExpansionContext)
  Promise<LinkedMemoryExpansion[]>`
- Signature114: `-collectEntityMemories(entities: Entity[], linked: ({ id: number; title: string }[]
  | undefined)[], request: ExpansionContext) Promise<LinkedMemoryExpansion[]>`
- Signature115: `-formatExpansion(entities: Entity[], relationships: RelationshipExpansion[],
  linkedMemories: LinkedMemoryExpansion[], attachments: Attachments) KnowledgeExpansionResult`
- Signature116: `resolveWriteProject(client: ForgetfulClient, context: KnowledgeToolContext,
  requested: number | undefined, signal: AbortSignal) Promise<ResolvedWriteProject>`
- Signature117: `assertReadMemory(client: ForgetfulClient, id: number, context:
  KnowledgeToolContext, signal: AbortSignal) Promise<Memory>`
- Signature118: `assertReadEntity(knowledge: KnowledgeClient, id: number, context:
  KnowledgeToolContext, signal: AbortSignal) Promise<Entity>`
- Signature119: `executeKnowledgeRead(client: ForgetfulClient, rawRequest: KnowledgeReadRequest,
  context: KnowledgeToolContext, signal: AbortSignal) Promise<KnowledgeToolResult>`
- Signature120: `updateProvenance(existing: Provenance, request: Record<string, unknown>, context:
  KnowledgeToolContext, destinationProjectId: number) Provenance`
- Signature121: `memoryInProject(client: ForgetfulClient, memoryId: number, projectId: number,
  signal: AbortSignal, editable: unknown) Promise<Memory>`
- Signature122: `entityInProject(knowledge: KnowledgeClient, entityId: number, projectId: number,
  signal: AbortSignal, editable: unknown) Promise<Entity>`
- Signature123: `hydrateEntities(knowledge: KnowledgeClient, candidates: Entity[], signal:
  AbortSignal) Promise<Entity[]>`
- Signature124: `validateAttachments(knowledge: KnowledgeClient, projectId: number, request:
  Record<string, unknown>, signal: AbortSignal) Promise<void>`
- Signature125: `createMemory(client: ForgetfulClient, request: Record<string, unknown>, context:
  KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite: (() =>
  Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature126: `createEntity(knowledge: KnowledgeClient, request: Record<string, unknown>, context:
  KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite: (() =>
  Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature127: `createDocument(knowledge: KnowledgeClient, request: Record<string, unknown>,
  context: KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite:
  (() => Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature128: `createCodeArtifact(knowledge: KnowledgeClient, request: Record<string, unknown>,
  context: KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite:
  (() => Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature129: `executeKnowledgeWrite(client: ForgetfulClient, rawRequest: KnowledgeWriteRequest,
  context: KnowledgeToolContext, signal: AbortSignal, beforeWrite: () => Promise<void>,
  checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature130: `constructor(client: WriteClient, readMemory: KnowledgeMemoryReader, assertCanWrite:
  () => void) unknown`
- Signature131: `-recordCreateFailure(attempt: string, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, error: unknown) Promise<void>`
- Signature132: `-createOnce(operation: { kind: string; key: string; occurrence: number; input:
  unknown; create: () => Promise<T>; }, plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, beforeWrite: KnowledgeWriteGuard | undefined) Promise<T>`
- Signature133: `-writeEntity(resource: ResourceSlot<KnowledgeEntityPlan>, plan: KnowledgeWritePlan,
  state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined,
  beforeWrite: KnowledgeWriteGuard | undefined) Promise<Entity>`
- Signature134: `-writeEntities(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature135: `-writeDocument(resource: ResourceSlot<KnowledgeDocumentPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<Document>`
- Signature136: `-writeDocuments(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature137: `-writeCodeArtifact(resource: ResourceSlot<KnowledgeCodeArtifactPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<CodeArtifact>`
- Signature138: `-writeCodeArtifacts(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature139: `-requestedAttachmentIds(plan: KnowledgeWritePlan, state: KnowledgeWriteState)
  KnowledgeAttachmentIds`
- Signature140: `-writeConnection(operation: { kind: string; key: string; input: unknown; execute:
  () => Promise<unknown> }, plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, beforeWrite: KnowledgeWriteGuard | undefined) Promise<void>`
- Signature141: `-writeAttachments(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature142: `-writeRelationship(resource: ResourceSlot<KnowledgeRelationshipPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<EntityRelationship>`
- Signature143: `-writeRelationships(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature144: `-writeEntityMemoryLink(resource: KnowledgeEntityMemoryLinkPlan, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<void>`
- Signature145: `-writeEntityMemoryLinks(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature146: `-writeLinkedMemory(linkedMemoryId: number, plan: KnowledgeWritePlan, state:
  KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite:
  KnowledgeWriteGuard | undefined) Promise<void>`
- Signature147: `-writeLinkedMemories(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature148: `execute(plan: KnowledgeWritePlan, previous: Partial<KnowledgeWriteState>,
  checkpoint: KnowledgeWriteCheckpoint, signal: AbortSignal, beforeWrite: KnowledgeWriteGuard)
  Promise<KnowledgeWriteState>`
- Signature149: `stateWithNumber(values: KnowledgeWriteReceipt[], key: string, id: number,
  occurrence: number) void`
- Signature150: `constructor(model: Model<any>, task: Message, settings: CompactionSettings,
  contextLimitTokens: unknown, initialHistory: CompactedMemoryHistory & { summaryMessage: Message })
  unknown`
- Signature151: `prepare(context: Context, signal: AbortSignal, sessionId: string | undefined,
  complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) => Promise<void>)
  Promise<number>`
- Signature152: `prepareCapture(context: Context, signal: AbortSignal, sessionId: string |
  undefined, complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) =>
  Promise<void>) Promise<"ready" | "progress">`
- Signature153: `-prepareContext(context: Context, signal: AbortSignal, sessionId: string |
  undefined, complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) =>
  Promise<void>, maxChunks: unknown) Promise<number | "progress">`
- Signature154: `-applySummary(context: Context, summary: string, lastRecord: Message, previousSize:
  number) number`
- Signature155: `assertFits(context: Context, model: Model<any>, output: number, contextWindow:
  number) void`
- Signature156: `outputCeiling(model: Model<any>, settings: typeof DEFAULT_COMPACTION_SETTINGS,
  requestedMaxTokens: unknown) number`
- Signature157: `resolvedOutputAllowance(context: Context, model: Model<any>, contextWindow: number,
  settings: typeof DEFAULT_COMPACTION_SETTINGS, requestedMaxTokens: unknown) number`
- Signature158: `summarizeMemoryHistory(messages: Message[], options: MemoryHistorySummaryOptions,
  previousSummary: string) Promise<{ summary: string; count: number }>`
- Signature159: `+complete(model: Model<any>, context: Context, options: ModelsSimpleStreamOptions)
  Promise<AssistantMessage>`
- Signature160: `constructor(registry: ModelRegistryPort, selection: ModelSelection, options:
  PiMemoryModelOptions) unknown`
- Signature161: `-completeAttempt(model: Model<any>, context: Context, options:
  ModelsSimpleStreamOptions, request: ModelRequest, deadline: RequestDeadline, attempt: number,
  kind: "task" | "compaction") Promise<AssistantMessage>`
- Signature162: `-executeRead(read: ModelReadTool, call: ToolCall, request: ModelRequest, deadline:
  RequestDeadline) Promise<ToolResultMessage>`
- Signature163: `-completeWithSubmission(model: Model<any>, context: Context, options:
  ModelsSimpleStreamOptions, request: ModelRequest, deadline: RequestDeadline, prepare: () =>
  Promise<number>) Promise<unknown>`
- Signature164: `ensureCompletionFinished(response: AssistantMessage, request: ModelRequest,
  timedOut: boolean, allowToolUse: boolean) void`
- Signature165: `requestOptions(model: Model<any>, sessionId: string | undefined, transformHeaders:
  MemoryModelHeaderTransform | undefined, signal: AbortSignal) ModelsSimpleStreamOptions`
- Signature166: `appendCallCountCorrection(context: Context, response: AssistantMessage, calls:
  ToolCall[], submissionName: string, base: string, readNames: string[]) void`
- Signature167: `throwRequestFailure(error: unknown, request: ModelRequest, timedOut: boolean,
  timeoutMs: number) never`
- Signature168: `resolveMemoryModel(registry: ModelRegistryPort, selection: ModelSelection |
  undefined, options: PiMemoryModelOptions) PiMemoryModel | undefined`
- Signature169: `promptExistingProject(client: ForgetfulClient, ctx: ExtensionContext, repoName:
  string) Promise<Project | undefined>`
- Signature170: `initialiseProject(client: ForgetfulClient, ctx: ExtensionContext, repoName: string,
  ensureCurrent: () => Promise<void>) Promise<Project | undefined>`
- Signature171: `initialiseProjectForAgent(client: ForgetfulClient, ctx: ExtensionContext, repoName:
  string, input: AgentProjectInitInput, ensureCurrent: () => Promise<void>) Promise<Project>`
- Signature172: `resolveBranchId(sessionId: string, activeEntryIds: readonly string[],
  fallbackBranchId: string) Promise<string>`
- Signature173: `cancel(jobId: string, interruptedModelCall: unknown, uncertainWrite: string)
  Promise<void>`
- Signature174: `-compactJobSnapshot(job: StoredQueueJob, conversation: CompactedConversation)
  Promise<void>`
- Signature175: `pendingConflicts(identity: QueueIdentity, sessionId: string, branchId: string)
  Promise<PendingConflict[]>`
- Signature176: `listPendingConflicts(identity: QueueIdentity, sessionId: string, branchId: string)
  Promise<PendingConflict[]>`
- Signature177: `updateConflict(conflictId: string, patch: Partial<PendingConflict>)
  Promise<PendingConflict>`
- Signature178: `constructor(client: ForgetfulClient, model: MemoryModelClient, options:
  RecallServiceOptions) unknown`
- Signature179: `-recallReadTool(request: RecallRequest, resolution: ScopeResolution, candidates:
  RecallResult) ModelReadTool`
- Signature180: `-finishFailure(request: RecallRequest, deadline: DeadlineSignal, error: unknown,
  trace: { stage: string; debugTrace: string; plannerRejections: string[]; reviewRejections:
  string[]; failedReviewDebug: string | undefined; }) RecallResult`
- Signature181: `-finishReview(output: unknown, candidates: RecallResult, recallPolicy: string,
  debugTrace: string, searchFailed: boolean, reviewRejections: string[]) RecallResult`
- Signature182: `-optionalKnowledge(memories: Memory[], entityNames: string[], scope: Scope,
  projectId: number | undefined, signal: AbortSignal) Promise<KnowledgeExpansionResult | undefined>`
- Signature183: `-resultWithKnowledge(result: RecallResult, expansion: KnowledgeExpansionResult |
  undefined, knowledgeText: string) RecallResult`
- Signature184: `-authorizeProjectSelection(request: RecallRequest, deadline: DeadlineSignal, plan:
  RecallPlan) Promise<string | undefined>`
- Signature185: `-requestsDifferentProject(request: RecallRequest, plan: RecallPlan, scope: Scope)
  boolean`
- Signature186: `-searchMemories(request: RecallRequest, plan: RecallPlan, scope: Scope, resolution:
  ScopeResolution, deadline: DeadlineSignal) Promise<SearchOutcome>`
- Signature187: `-searchRequest(query: string, plan: RecallPlan, context: WorkContext, scope: Scope,
  resolution: ScopeResolution) SearchRequest`
- Signature188: `-resolveScope(context: WorkContext, scope: Scope, selectedId: number | undefined,
  supplied: Project[] | undefined, signal: AbortSignal) Promise<ScopeResolution>`
- Signature189: `formatRecall(memories: Memory[], entities: string[], recallPolicy: string,
  expansion: KnowledgeExpansionResult) { text: string; ids: number[]; knowledgeText: string }`
- Signature190: `reviewValidationDebug(value: unknown, candidates: RecallResult, mismatchDirection:
  string | undefined) string`
- Signature191: `recallReviewSubmission(candidates: RecallResult, rejections: string[], setDebug:
  (debug: string) => void) ModelSubmissionTool`
- Signature192: `deltaStartIndex(branch: SessionEntry[], afterEntryId: string | null | undefined,
  baselineEntryId: string | null | undefined) number | undefined`
- Signature193: `compactCaptureSnapshot(snapshot: CaptureSnapshot, view: CompactedConversation)
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
