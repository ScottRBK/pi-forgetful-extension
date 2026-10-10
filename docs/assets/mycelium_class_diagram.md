# Mermaid class diagrams

Declared types and signatures; unknown types are `unknown`. Receivers are omitted.
Fields are associations, not lifetime ownership. Calls are static heuristic estimates.
Members and connections within each view are uncapped.
Parallel arrows are summarized.
Cross-diagram relationships are retained in the complete relationship list.

Included: 230 boxes. Calls without in-scope endpoints: 0.

## Test filtering

Mode: exclude.
Saved detector version: 2.
Test paths: `scripts/forgetful-test-server.py`, `test`.
Keep paths: none.
Calls removed by test filtering: 489. Type relationships removed: 164.

- `scripts/forgetful-test-server.py`: 4 source occurrences (test-path).
- `test/async-recall-pi-integration.test.ts`: 16 source occurrences (test-path).
- `test/background-startup-pi.test.ts`: 3 source occurrences (test-path).
- `test/background-ui-pi.test.ts`: 13 source occurrences (test-path).
- `test/capture-batches.test.ts`: 8 source occurrences (test-path).
- `test/capture-cancellation.test.ts`: 7 source occurrences (test-path).
- `test/capture-cleanup-pi.test.ts`: 6 source occurrences (test-path).
- `test/capture-context-pi.test.ts`: 2 source occurrences (test-path).
- `test/capture-context.test.ts`: 2 source occurrences (test-path).
- `test/capture-drain-pi.test.ts`: 6 source occurrences (test-path).
- `test/capture-execution.test.ts`: 4 source occurrences (test-path).
- `test/capture-gate-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture-history-model.test.ts`: 4 source occurrences (test-path).
- `test/capture-history-restart-pi.test.ts`: 7 source occurrences (test-path).
- `test/capture-history.test.ts`: 4 source occurrences (test-path).
- `test/capture-links.test.ts`: 4 source occurrences (test-path).
- `test/capture-pause.test.ts`: 2 source occurrences (test-path).
- `test/capture-resolution-context.test.ts`: 2 source occurrences (test-path).
- `test/capture-resolution-execution.test.ts`: 3 source occurrences (test-path).
- `test/capture-shutdown-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture-source-conflict-pi.test.ts`: 4 source occurrences (test-path).
- `test/capture-structured-arguments.test.ts`: 18 source occurrences (test-path).
- `test/capture-trust-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture.test.ts`: 40 source occurrences (test-path).
- `test/config.test.ts`: 2 source occurrences (test-path).
- `test/extension.test.ts`: 60 source occurrences (test-path).
- `test/fixtures/background-ui-provider.ts`: 2 source occurrences (test-path).
- `test/fixtures/live-context-provider.ts`: 9 source occurrences (test-path).
- `test/fixtures/memory-quality.ts`: 13 source occurrences (test-path).
- `test/foreground-drain-pi.test.ts`: 2 source occurrences (test-path).
- `test/forgetful-integration.test.ts`: 3 source occurrences (test-path).
- `test/full-conversation-pi.test.ts`: 2 source occurrences (test-path).
- `test/http-validation.test.ts`: 2 source occurrences (test-path).
- `test/knowledge-capture.test.ts`: 21 source occurrences (test-path).
- `test/knowledge-execution.test.ts`: 4 source occurrences (test-path).
- `test/knowledge-exploration-errors.test.ts`: 5 source occurrences (test-path).
- `test/knowledge-pi-integration.test.ts`: 5 source occurrences (test-path).
- `test/knowledge-tool-execution.test.ts`: 3 source occurrences (test-path).
- `test/knowledge-tools.test.ts`: 12 source occurrences (test-path).
- `test/live-capture-submission.test.ts`: 18 source occurrences (test-path).
- `test/live-connected-memory-quality.test.ts`: 2 source occurrences (test-path).
- `test/live-context-quality.test.ts`: 16 source occurrences (test-path).
- `test/live-memory-quality.test.ts`: 9 source occurrences (test-path).
- `test/live-recall-submission.test.ts`: 17 source occurrences (test-path).
- `test/logging.test.ts`: 3 source occurrences (test-path).
- `test/model-budget.test.ts`: 5 source occurrences (test-path).
- `test/model-context.test.ts`: 21 source occurrences (test-path).
- `test/model-read-tools.test.ts`: 8 source occurrences (test-path).
- `test/model.test.ts`: 8 source occurrences (test-path).
- `test/pi-integration.test.ts`: 10 source occurrences (test-path).
- `test/pi-tool-session.ts`: 6 source occurrences (test-path).
- `test/provider-context.ts`: 4 source occurrences (test-path).
- `test/queue.test.ts`: 5 source occurrences (test-path).
- `test/real-forgetful.ts`: 2 source occurrences (test-path).
- `test/recall-concurrency-pi.test.ts`: 4 source occurrences (test-path).
- `test/recall-concurrency.test.ts`: 6 source occurrences (test-path).
- `test/recall-persistence-native-pi.test.ts`: 21 source occurrences (test-path).
- `test/recall-persistence-pi.test.ts`: 21 source occurrences (test-path).
- `test/recall-plan.test.ts`: 3 source occurrences (test-path).
- `test/recall.test.ts`: 35 source occurrences (test-path).
- `test/snapshot.test.ts`: 3 source occurrences (test-path).
- `test/source-inspection.test.ts`: 3 source occurrences (test-path).

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
    class c0005["CaptureLinkReview"] {
        <<interface>>
        status: Type2
        memory: Memory
        memories: Memory[]
        automaticIds: number[]
        unreviewed: Type3
        decisions: LinkDecision[]
        verifiedIds: number[]
        reason: string
        previous: PreviousConnections
        resources: Type4
        preservation: PreservationDecision
        preservationVerified: boolean
        executionResults: ConnectionResult[]
        previousResults: ConnectionResult[]
        failures: Type5
    }
    class c0006["ConnectionResult"] {
        <<interface>>
        operation: Type6
        targetId: number
        status: Type7
        error: string
    }
    class c0007["LinkDecision"] {
        <<interface>>
        memoryId: number
        action: Type8
        reason: string
    }
    class c0008["PreservationDecision"] {
        <<interface>>
        status: Type9
        documentIds: number[]
        codeArtifactIds: number[]
        entityIds: number[]
        reason: string
    }
    class c0009["PreviousConnections"] {
        <<interface>>
        memory: Memory
        documents: Document[]
        codeArtifacts: CodeArtifact[]
        entities: Entity[]
        entityIds: number[]
        complete: boolean
    }
    class c0010["src/capture-links.ts"] {
        <<module>>
        wantsEdge(decision: LinkDecision) boolean
        exclusiveMemory(memory: Memory, destination: number) boolean
        readSelectedMemory(client: ForgetfulClient, id: number, unreviewed: Type11) Type10
        prepareLinkReview(Signature1)
        validateLinkDecisions(Signature2)
        validatePreservation(preservation: Type15, review: CaptureLinkReview) void
        validateLinkReviews(value: unknown, inputs: Type17) Type16
        operationError(error: unknown) string
        authorizedMemory(Signature3)
        executeConnection(Signature4)
        applyLinkReview(Signature5)
        finishLinkExecution(initial: CaptureLinkReview, save: Type20) Promise~CaptureLinkReview~
        readAttachmentRecords(Signature6)
        preparePreviousConnections(Signature7)
        preserveConnections(Signature8)
    }
    class c0011["CandidateDestination"] {
        <<interface>>
        projectId: number
        projectName: string
        rationale: string
    }
    class c0012["CandidateExtraction"] {
        <<interface>>
        candidates: CaptureCandidate[]
        skipped: Type23
    }
    class c0013["CandidateFields"] {
        <<interface>>
        title: string
        content: string
        context: string
        sourceEntryIds: string[]
        kind: Type24
    }
    class c0014["CandidateLists"] {
        <<interface>>
        keywords: string[]
        tags: string[]
        sourceFiles: string[]
    }
    class c0015["CandidateValidation"] {
        <<type_alias>>
        alias: Type25
        valid: true
        value: T
        reason: string
        valid: false
    }
    class c0016["CaptureAction"] {
        <<type_alias>>
        alias: Type26
    }
    class c0017["CaptureActivityPhase"] {
        <<type_alias>>
        alias: Type27
    }
    class c0018["CaptureAdvanceInput"] {
        <<interface>>
        sessionId: string
        branchId: string
        entryIds: string[]
        finalEntryId: string
        snapshotId: string
    }
    class c0019["CaptureBatchInput"] {
        <<interface>>
        candidate: CaptureCandidate
        destinationProjectId: number
        overlaps: Memory[]
        evidenceEntries: EvidenceEntry[]
        neighborhood: CaptureNeighborhood
    }
    class c0020["CaptureBranch"] {
        <<interface>>
        sessionId: string
        branchId: string
    }
    class c0021["CaptureCandidate"] {
        <<interface>>
        id: string
        title: string
        content: string
        context: string
        keywords: string[]
        tags: string[]
        importance: number
        sourceEntryIds: string[]
        evidenceType: Type28
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
    class c0022["CaptureCheckpointOptions"] {
        <<interface>>
        sessionId: string
        branchId: string
        excludeBranches: CaptureBranch[]
    }
    class c0023["CaptureCheckpointResult"] {
        <<interface>>
        processed: number
        processedJobIds: string[]
        discardedJobs: Type29
        paused: boolean
        errors: string[]
        deferredBranches: CaptureBranch[]
        continuation: Type30
    }
    class c0024["CaptureCodeArtifactResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0025["CaptureDecision"] {
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
    class c0026["CaptureDiagnosticCandidate"] {
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
        conflictId: string
        linkReview: Type31
    }
    class c0027["CaptureDiagnosticConflict"] {
        <<interface>>
        id: string
        status: Type32
        candidateId: string
        destinationProjectId: number
        sourceEntryIds: string[]
        oldMemoryIds: number[]
        reason: string
        replacementId: number
    }
    class c0028["CaptureDiagnosticJob"] {
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
    class c0029["CaptureDiagnostics"] {
        <<interface>>
        jobs: CaptureDiagnosticJob[]
        conflicts: CaptureDiagnosticConflict[]
    }
    class c0030["CaptureDocumentResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0031["CaptureEnqueueResult"] {
        <<interface>>
        queued: boolean
        jobId: string
        reason: string
    }
    class c0032["CaptureEntityResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0033["CaptureNeighborhood"] {
        <<interface>>
        entities: Entity[]
        documents: Document[]
        codeArtifacts: CodeArtifact[]
        relationships: EntityRelationship[]
        truncated: boolean
    }
    class c0034["CaptureOperation"] {
        <<interface>>
        jobId: string
        conflictId: string
        uncertainWrite: CaptureUncertainWrite
        supersession: SupersessionReceipt
    }
    class c0035["CapturePause"] {
        <<class>>
        constructor(reason: string) unknown
    }
    class c0036["CapturePendingConflict"] {
        <<interface>>
        verifiedOrigin: Type33
    }
    class c0037["CaptureRelationshipResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0038["CaptureResolveResult"] {
        <<interface>>
        status: Type34
        conflict: PendingConflict
    }
    class c0039["CaptureResourceReuse"] {
        <<interface>>
        entities: Type35
        documents: Type35
        codeArtifacts: Type35
        relationships: Type35
    }
    class c0040["CaptureService"] {
        <<class>>
        -queue: DurableQueueStore
        -client: ForgetfulClient
        -readSavedMemory: Type36
        -model: MemoryModelClient
        -identity: QueueIdentity
        -sessionId: string
        -branchId: string
        -policy: string
        -isEnabled: Type37
        -getMode: Type38
        -canWriteNow: Type39
        -canReadNow: Type39
        -maxCandidates: number
        -maxModelCalls: number
        -maxJobsPerCheckpoint: number
        -now: Type40
        -knowledgeWriter: KnowledgeWriter
        -logger: DiagnosticLogger
        -stopped: unknown
        -cancellation: unknown
        -interruptedModelJobs: unknown
        -operations: unknown
        -onActivity: Type41
        -activities: unknown
        -activityPhase: CaptureActivityPhase
        constructor(options: CaptureServiceOptions) unknown
        -readSignal(signal: AbortSignal) AbortSignal
        -activity(phase: CaptureActivityPhase, operation: Type42) Promise~T~
        -publishActivity() void
        -read(operation: Type43, signal: AbortSignal, phase: Type44) Promise~T~
        -mutate(operation: Type43, signal: AbortSignal) Promise~T~
        -cancellableClient(client: ForgetfulClient) ForgetfulClient
        -cancellableKnowledge(client: KnowledgeClient) KnowledgeClient
        -correlation(job: QueueJob, candidateId: string) unknown
        -emit(level: Type45, event: string, data: Type46) void
        -enabled(mode: CaptureMode) Promise~boolean~
        -ensureModelCallAllowed(job: QueueJob) Promise~void~
        -assertWriteAllowedNow() void
        -ensureWriteAllowed(jobMode: CaptureMode) Promise~void~
        -policyFor(snapshot: CaptureSnapshot, purpose: Type47) string
        enqueue(snapshot: CaptureSnapshot) Promise~CaptureEnqueueResult~
        -enqueueSnapshot(snapshot: CaptureSnapshot) Promise~CaptureEnqueueResult~
        -resolveDestination(candidate: CaptureCandidate, context: WorkContext) Type48
        -addConflict(Signature9)
        -checkpointOutcome(Signature10)
        -destinationProjects(Signature11)
        -validateDecisionResources(Signature12)
        -validateDecision(Signature13)
        -createMemory(Signature14)
        -writeKnowledge(Signature15)
        -applySupersession(Signature16)
        -recordSupersession(receipt: SupersessionReceipt) Promise~void~
        -finishSupersession(Signature17)
        -processReplacementCheckpoint(Signature18)
        -processKnowledgeCheckpoint(Signature19)
        -prepareDestination(job: QueueJob, candidate: CaptureCandidate) Type52
        -loadOverlaps(Signature20)
        -neighborhoodEntity(job: QueueJob, id: number, destination: number) Type55
        -neighborhoodEntities(Signature21)
        -neighborhoodRelationships(job: QueueJob, entities: Entity[]) Type57
        -existingNeighborhood(Signature22)
        -validateEquivalentCandidate(Signature23)
        -decideOverlapBatch(job: QueueJob, candidates: CaptureCandidate[]) Promise~QueueJob~
        -decideOverlap(Signature24)
        -recordEscalation(Signature25)
        -supersedeCandidate(Signature26)
        -equivalentMemory(Signature27)
        -applyDecision(Signature28)
        -processCandidate(Signature29)
        -sourceInspectionTool(job: QueueJob) ModelReadTool
        -loadCandidates(job: QueueJob) Type59
        -reviewExecutionFailure(job: QueueJob, candidate: CaptureCandidate) Promise~QueueJob~
        -recordCandidateFailure(Signature30)
        -processCandidates(Signature31)
        -refreshLinkReview(Signature32)
        -prepareLinkReviews(job: QueueJob, candidates: CaptureCandidate[]) Type62
        -planLinkReviews(Signature33)
        -executeLinkReview(job: QueueJob, candidate: CaptureCandidate) Promise~QueueJob~
        -reviewLinks(job: QueueJob, candidates: CaptureCandidate[]) Promise~QueueJob~
        -processJob(job: QueueJob, result: CaptureCheckpointResult) Type63
        -runBranchWorker(Signature34)
        -processBranchJob(job: QueueJob, result: CaptureCheckpointResult) Type64
        -recordBranchFailure(Signature35)
        -checkpointBranch(Signature36)
        -checkpointBranches(options: Type65) Promise~CaptureBranch[]~
        -appendCheckpointResult(Signature37)
        checkpoint(options: Type65) Promise~CaptureCheckpointResult~
        processPending(options: CaptureCheckpointOptions) Promise~CaptureCheckpointResult~
        diagnostics(options: Type66) Promise~CaptureDiagnostics~
        pendingConflicts(options: Type67) Promise~CapturePendingConflict[]~
        pendingConflicts(sessionId: string, branchId: string) Promise~CapturePendingConflict[]~
        pendingConflicts(Signature38)
        -verifyConflictOrigin(conflict: PendingConflict) Promise~CapturePendingConflict~
        -ownedConflict(conflictId: string) Promise~PendingConflict~
        -rejectConflict(Signature39)
        -selectResolutionEvidence(Signature40)
        -validateResolutionEvidence(Signature41)
        -resolutionTarget(conflict: PendingConflict) ConflictResolutionTarget
        -markConflictResolved(Signature42)
        -revisionResources(current: Memory, destination: number, previous: Memory) unknown
        -validateRevisionText(item: Type69) void
        -planConflictReplacement(Signature43)
        -validateConflictMemory(Signature44)
        -authorizeResolutionMemory(id: number, destination: number) Promise~void~
        -authorizeResolutionAttachments(conflict: PendingConflict) Promise~void~
        -updateResolutionReplacement(Signature45)
        -createResolutionReplacement(conflict: PendingConflict) Promise~number~
        -linkResolutionEntity(Signature46)
        -executeResolutionLinks(conflict: PendingConflict, replacementId: number) Promise~void~
        -applyConflictResolution(Signature47)
        -failConflictResolution(conflictId: string, error: unknown) Promise~never~
        -resolveConflictOwned(Signature48)
        resolveConflict(Signature49)
        resolve(conflictId: string, input: ResolveConflictInput) Promise~CaptureResolveResult~
        advance(input: Type71) Promise~void~
        advanceWatermark(input: Type71) Promise~void~
        watermark(context: Type72) unknown
        stop(_sessionId: string, _branchId: string) void
    }
    class c0041["CaptureServiceOptions"] {
        <<interface>>
        logger: DiagnosticLogger
        onActivity: Type73
        queue: DurableQueueStore
        client: ForgetfulClient
        model: MemoryModelClient
        instanceId: string
        endpoint: string
        accountId: string
        sessionId: string
        branchId: string
        policy: string
        isEnabled: Type37
        getMode: Type38
        canWriteNow: Type39
        canReadNow: Type39
        maxCandidates: number
        maxModelCalls: number
        maxJobsPerCheckpoint: number
        now: Type40
    }
    class c0042["CaptureUncertainWrite"] {
        <<class>>
    }
    class c0043["ConflictResolutionEvidence"] {
        <<interface>>
        evidenceEntryIds: string[]
        selectedAdditionalEntries: EvidenceEntry[]
        reason: string
        additionalEvidence: string
    }
    class c0044["ConflictResolutionTarget"] {
        <<interface>>
        oldMemory: Memory
        candidate: CaptureCandidate
        fakeJob: QueueJob
    }
    class c0045["InvalidCaptureOutput"] {
        <<class>>
        constructor(reason: string) unknown
    }
    class c0046["ResolveConflictInput"] {
        <<interface>>
        action: Type74
        reason: string
        evidenceEntryIds: string[]
        additionalEvidence: string
        additionalEntries: EvidenceEntry[]
        conversation: readonly unknown[]
    }
    class c0047["RichResources"] {
        <<type_alias>>
        alias: Type75
    }
    class c0048["src/capture.ts"] {
        <<module>>
        conflictResolutionEvidence(evidence: ConflictResolutionEvidence) unknown
        blockedSave(diagnostic: string) Error
        clone(value: T) T
        record(value: unknown) Type54
        stringValue(value: unknown, max: number) Type76
        strings(value: unknown, max: unknown, itemMax: number) string[]
        numberValue(value: unknown) Type77
        projectId(value: unknown) Type77
        snapshotForPersistence(snapshot: CaptureSnapshot) CaptureSnapshot
        captureConversation(snapshot: CaptureSnapshot) readonly unknown[]
        captureWorkMetadata(snapshot: CaptureSnapshot) unknown
        sourceEvidence(candidate: CaptureCandidate, snapshot: CaptureSnapshot) EvidenceEntry[]
        evidenceType(value: unknown) Type24
        invalidCandidate(reason: string) CandidateValidation~T~
        validCandidate(value: T) CandidateValidation~T~
        candidateEvidenceIneligibilityReason(source: EvidenceEntry[], kind: Type24) Type76
        candidateEvidenceIsEligible(source: EvidenceEntry[], kind: Type24) boolean
        candidateFields(Signature50)
        candidateLists(item: Type46) CandidateValidation~CandidateLists~
        candidateDestination(item: Type46) Type78
        resourceInput(item: Type46) Type46
        resourceStrings(Signature51)
        resourceString(value: unknown, label: string, max: number) CandidateValidation~string~
        resourceEvidence(Signature52)
        resourceKey(item: Type46, fallback: string) CandidateValidation~string~
        entityClassification(input: Type46) Type79
        entityResource(Signature53)
        documentResource(Signature54)
        codeArtifactResource(Signature55)
        relationshipResource(Signature56)
        parseResourceList(Signature57)
        richResources(Signature58)
        buildCandidate(Signature59)
        eligibleCandidate(Signature60)
        parseCandidates(Signature61)
        boundedSubmissionRejections(value: readonly string[]) string[]
        appendSubmissionRejection(rejections: string[], reason: string) void
        captureCandidateSubmission(Signature62)
        decisionMemoryId(response: Type46) Type77
        decisionTargetMemoryId(response: Type46) Type77
        decisionMemoryIds(response: Type46) Type12
        decisionEvidenceIds(response: Type46) Type88
        decisionText(response: Type46, field: Type89) Type76
        decisionPartial(response: Type46) boolean
        applyEnrichmentDecision(response: Type46, decision: CaptureDecision) void
        applyEquivalentCandidate(response: Type46, decision: CaptureDecision) void
        parseDecision(value: unknown) CaptureDecision
        decisionConflictIds(decision: CaptureDecision) number[]
        firstConflictId(decision: CaptureDecision) Type77
        currentProjectId(context: WorkContext) Type77
        memoryInput(Signature63)
        captureKnowledgePlan(Signature64)
        overlapCandidate(candidate: CaptureCandidate) Type46
        scrubError(error: unknown) string
        isFinalOutcome(outcome: unknown) boolean
        trustedAdditionalEntries(value: unknown) EvidenceEntry[]
    }
    class c0049["src/concurrency.ts"] {
        <<module>>
        mapConcurrent(items: readonly T[], concurrency: number, operation: Type91) Promise~R[]~
    }
    class c0050["ForgetfulConfig"] {
        <<interface>>
        enabled: boolean
        captureMode: CaptureMode
        verbosity: Verbosity
        logging: FileLogLevel
        scope: Scope
        scopeSource: ScopeSource
        instance: ForgetfulInstanceConfig
        recallModelTimeoutMs: number
        recallConcurrency: number
        contextLimitTokens: number
        model: ModelSelection
        prompts: PromptOverlays
        warnings: string[]
        paths: Type92
    }
    class c0051["ForgetfulInstanceConfig"] {
        <<interface>>
        baseUrl: string
        token: string
        tokenEnv: string
        timeoutMs: number
    }
    class c0052["JsonReadResult"] {
        <<interface>>
        value: unknown
        exists: boolean
        malformed: boolean
    }
    class c0053["LoadConfigOptions"] {
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
    class c0054["ModelSelection"] {
        <<interface>>
        provider: string
        id: string
    }
    class c0055["PersistedProjectSettings"] {
        <<interface>>
        scope: unknown
    }
    class c0056["PersistedUserSettings"] {
        <<interface>>
        base_url: unknown
        token: unknown
        token_env: unknown
        timeout_ms: unknown
        enabled: unknown
        capture: unknown
        capture_mode: unknown
        debug: unknown
        verbosity: unknown
        logging: unknown
        recall_model_timeout_ms: unknown
        recall_concurrency: unknown
        context_limit_tokens: unknown
        model: unknown
    }
    class c0057["PromptName"] {
        <<type_alias>>
        alias: Type93
    }
    class c0058["PromptOverlays"] {
        <<interface>>
        classification: string
        recall: string
        capture: string
    }
    class c0059["ScopeSource"] {
        <<type_alias>>
        alias: Type94
    }
    class c0060["Verbosity"] {
        <<type_alias>>
        alias: Type95
    }
    class c0061["src/config.ts"] {
        <<module>>
        isRecallConcurrency(value: unknown) value is number
        resolveRecallConcurrency(value: unknown, warnings: string[]) number
        resolveContextLimit(value: unknown, warnings: string[]) number
        isFileLogLevel(value: unknown) value is FileLogLevel
        isVerbosity(value: unknown) value is Verbosity
        resolveVerbosity(user: PersistedUserSettings, warnings: string[]) Verbosity
        isRecord(value: unknown) Type96
        parseModel(value: unknown) Type97
        asBoolean(value: unknown, fallback: boolean) boolean
        asPositiveInteger(value: unknown, fallback: number) number
        asString(value: unknown) Type76
        readJson(path: string) Promise~JsonReadResult~
        readPromptDirectory(Signature65)
        mergePrompts(Signature66)
        resolveCaptureMode(value: unknown, warnings: string[]) CaptureMode
        resolveScope(Signature67)
        defaultAgentDir() string
        userSettingsPath(agentDir: unknown) string
        projectSettingsPath(cwd: string) string
        loadForgetfulConfig(options: LoadConfigOptions) Promise~ForgetfulConfig~
        writeJson(path: string, value: unknown) Promise~void~
        writeProjectScope(cwd: string, scope: Scope) Promise~void~
        updateUserSettings(path: string, update: Type99) Promise~void~
        updateForgetfulConnection(path: string, connection: Type100) Promise~void~
        modelToString(model: Type97) Type76
    }
    class c0062["CaptureHistorySummary"] {
        <<interface>>
        throughEntryId: string
        text: string
    }
    class c0063["CaptureMode"] {
        <<type_alias>>
        alias: Type101
    }
    class c0064["CaptureSnapshot"] {
        <<interface>>
        id: string
        context: WorkContext
        instanceId: string
        entries: EvidenceEntry[]
        conversation: readonly unknown[]
        conversationCoverage: Type102
        sourceConversation: readonly unknown[]
        historySummary: CaptureHistorySummary
        processedThroughEntryId: Type103
        leafEntryId: string
        finalEntryId: string
        mode: CaptureMode
        scope: Scope
        policy: string
        modelVersion: string
        createdAt: string
    }
    class c0065["CodeArtifact"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0066["CodeArtifactInput"] {
        <<interface>>
        title: string
        description: string
        code: string
        language: string
        tags: string[]
        project_id: Type104
    }
    class c0067["CodeArtifactSummary"] {
        <<type_alias>>
        alias: Type105
    }
    class c0068["CompactedConversation"] {
        <<interface>>
        summary: string
        summarizedThroughEntryId: string
        retainedConversation: readonly unknown[]
    }
    class c0069["Document"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0070["DocumentInput"] {
        <<interface>>
        title: string
        description: string
        content: string
        document_type: string
        tags: string[]
        project_id: Type104
    }
    class c0071["DocumentSummary"] {
        <<type_alias>>
        alias: Type106
    }
    class c0072["Entity"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0073["EntityInput"] {
        <<interface>>
        name: string
        entity_type: EntityType
        custom_type: string
        notes: string
        tags: string[]
        aka: string[]
        project_ids: number[]
    }
    class c0074["EntityRelationship"] {
        <<interface>>
        id: number
    }
    class c0075["EntityRelationshipInput"] {
        <<interface>>
        source_entity_id: number
        target_entity_id: number
        relationship_type: string
    }
    class c0076["EntityType"] {
        <<type_alias>>
        alias: Type107
    }
    class c0077["EvidenceEntry"] {
        <<interface>>
        id: string
        role: Type108
        text: string
        toolName: string
        toolCallId: string
        isError: boolean
        details: unknown
    }
    class c0078["FileSummary"] {
        <<interface>>
        id: number
        filename: string
        description: string
        mime_type: string
        size_bytes: number
        tags: string[]
        project_id: Type104
    }
    class c0079["ForgetfulClient"] {
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
        +supersede(Signature68)
    }
    class c0080["KnowledgeClient"] {
        <<interface>>
        +searchEntities(query: string, limit: number, signal: AbortSignal) Promise~Entity[]~
        +getEntity(id: number, signal: AbortSignal) Promise~Entity~
        +createEntity(input: EntityInput, signal: AbortSignal) Promise~Entity~
        +updateEntity(Signature69)
        +getEntityMemories(id: number, signal: AbortSignal) Type109
        +linkEntityMemory(entityId: number, memoryId: number, signal: AbortSignal) Promise~void~
        +getRelationships(id: number, signal: AbortSignal) Promise~EntityRelationship[]~
        +createRelationship(Signature70)
        +listDocuments(projectId: number, signal: AbortSignal) Promise~DocumentSummary[]~
        +getDocument(id: number, signal: AbortSignal) Promise~Document~
        +createDocument(input: DocumentInput, signal: AbortSignal) Promise~Document~
        +updateDocument(Signature71)
        +listCodeArtifacts(Signature72)
        +getCodeArtifact(id: number, signal: AbortSignal) Promise~CodeArtifact~
        +createCodeArtifact(input: CodeArtifactInput, signal: AbortSignal) Promise~CodeArtifact~
        +updateCodeArtifact(Signature73)
        +listFiles(projectId: number, signal: AbortSignal) Promise~FileSummary[]~
        +getFile(id: number, signal: AbortSignal) Promise~StoredFile~
        +updateMemory(Signature74)
        +linkMemories(id: number, relatedIds: number[], signal: AbortSignal) Promise~void~
        +unlinkMemories(id: number, targetId: number, signal: AbortSignal) Promise~void~
    }
    class c0081["LinkedMemory"] {
        <<interface>>
        memory: Memory
        link_source_id: number
    }
    class c0082["Memory"] {
        <<interface>>
        id: number
        is_obsolete: boolean
        superseded_by: Type104
        linked_memory_ids: number[]
        access_count: number
        last_accessed_at: Type103
        updated_at: string
    }
    class c0083["MemoryCreateResult"] {
        <<interface>>
        id: number
        autoLinkedMemoryIds: number[]
    }
    class c0084["MemoryInput"] {
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
    class c0085["MemoryModelClient"] {
        <<interface>>
        +prepareCapture(request: ModelRequest) Type110
        +complete(request: ModelRequest) Promise~unknown~
    }
    class c0086["MemorySearchResult"] {
        <<interface>>
        query: string
        primary_memories: Memory[]
        linked_memories: LinkedMemory[]
        total_count: number
        token_count: number
        truncated: boolean
    }
    class c0087["ModelReadTool"] {
        <<interface>>
        name: string
        description: string
        parameters: unknown
        +execute(input: unknown, signal: AbortSignal) Promise~unknown~
    }
    class c0088["ModelRequest"] {
        <<interface>>
        purpose: Type111
        policy: string
        input: unknown
        conversation: readonly unknown[]
        onConversationCompacted: Type112
        signal: AbortSignal
        submission: ModelSubmissionTool
        readTools: ModelReadTool[]
        readConcurrency: number
        readBatchContext: Type113
        diagnosticContext: Type114
    }
    class c0089["ModelSubmissionError"] {
        <<class>>
        constructor(message: string, rejectionReasons: string[]) unknown
        rejectionReasons: string[]
    }
    class c0090["ModelSubmissionTool"] {
        <<interface>>
        name: string
        description: string
        parameters: unknown
        +validate(input: unknown) unknown
        +onRejection(reason: string, input: unknown) void
    }
    class c0091["Project"] {
        <<interface>>
        id: number
        name: string
        repo_name: Type103
        description: string
    }
    class c0092["ProjectInput"] {
        <<interface>>
        name: string
        description: string
        repo_name: string
    }
    class c0093["Provenance"] {
        <<interface>>
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
    }
    class c0094["Scope"] {
        <<type_alias>>
        alias: Type115
    }
    class c0095["SearchRequest"] {
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
    class c0096["StoredFile"] {
        <<interface>>
        data: string
    }
    class c0097["WorkContext"] {
        <<interface>>
        cwd: string
        repoName: string
        project: Project
        projectDiscoveryPending: boolean
        sessionId: string
        branchId: string
    }
    class c0098["src/encode.ts"] {
        <<module>>
        bundledSkillPaths() string[]
        buildEncodePrompt(context: Type116, direction: string) Promise~string~
    }
    class c0099["AutomaticCaptureJobOutcome"] {
        <<interface>>
        ready: boolean
        terminal: boolean
        noCandidates: boolean
        candidateStages: Type117
        failure: Type118
    }
    class c0100["AutomaticRecall"] {
        <<type_alias>>
        alias: RecallJob
    }
    class c0101["BoundedWaitOutcome"] {
        <<type_alias>>
        alias: Type119
        kind: Type120
        value: T
        kind: Type121
        kind: Type122
        error: unknown
        kind: Type123
    }
    class c0102["CaptureFeedbackItem"] {
        <<interface>>
        jobId: string
        state: CaptureFeedbackState
        outcome: AutomaticCaptureJobOutcome
    }
    class c0103["CaptureFeedbackState"] {
        <<interface>>
        reportedCandidateKeys: Set~string~
        lastFailureKey: string
        lastUnavailable: boolean
        retried: boolean
    }
    class c0104["CaptureServicePort"] {
        <<interface>>
        +enqueue(snapshot: CaptureSnapshot) Promise~unknown~
        +checkpoint(options: CaptureCheckpointOptions) Promise~CaptureCheckpointResult~
        +advanceWatermark(update: Type124) Promise~unknown~
        +stop(sessionId: string, branchId: string) Type125
        +pendingConflicts(options: Type67) Promise~unknown[]~
        +diagnostics(options: Type66) Promise~unknown~
        +resolveConflict(conflictId: string, resolution: Type126) Promise~unknown~
    }
    class c0105["DiagnosticCandidate"] {
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
    class c0106["DiagnosticParts"] {
        <<interface>>
        candidates: number
        stages: Type127
        outcomes: string[]
    }
    class c0107["ExtensionWorkContext"] {
        <<interface>>
        projects: Project[]
    }
    class c0108["ForgetfulExtensionDependencies"] {
        <<interface>>
        client: ForgetfulClient
        createClient: Type128
        recall: RecallServicePort
        capture: CaptureServicePort
        createRecall: Type129
        createCapture: Type130
        resolveWorkContext: Type131
    }
    class c0109["ForgetfulExtensionOptions"] {
        <<interface>>
        agentDir: string
        config: Type132
        dependencies: ForgetfulExtensionDependencies
        policies: Type133
    }
    class c0110["PendingQueuedRecall"] {
        <<type_alias>>
        alias: RecallJob
    }
    class c0111["PolicyName"] {
        <<type_alias>>
        alias: Type134
    }
    class c0112["PreparedRuntime"] {
        <<interface>>
        logger: FileLogger
        config: ForgetfulConfig
        client: ForgetfulClient
        model: PiMemoryModel
        recall: RecallServicePort
        context: ExtensionWorkContext
        sessionId: string
        currentLeaf: Type103
        branchId: string
        queueDirectory: string
    }
    class c0113["RecallActivity"] {
        <<interface>>
        memoryCount: number
        scope: Scope
        reason: string
    }
    class c0114["RecallContextMessage"] {
        <<interface>>
        role: string
        content: unknown
        customType: unknown
        details: unknown
    }
    class c0115["RecallJob"] {
        <<interface>>
        key: string
        jobId: string
        kind: Type135
        runtime: Runtime
        branchId: string
        generation: number
        prompt: string
        controller: AbortController
        promise: Promise~RecallResult~
        userEntryId: string
        phase: Type136
        result: RecallResult
        boundarySeen: boolean
        terminalConsumed: boolean
        resultSent: boolean
    }
    class c0116["RecallServicePort"] {
        <<interface>>
        +recall(request: Type137) Promise~RecallResult~
        +deeper(request: DeeperRecallRequest) Promise~RecallResult~
    }
    class c0117["RecallToolDetails"] {
        <<interface>>
        memoryIds: number[]
        scope: Scope
        unavailable: boolean
    }
    class c0118["Runtime"] {
        <<interface>>
        logger: FileLogger
        activity: ForgetfulActivity
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
        baselineEntryId: Type103
        lastCaptureEntryId: string
        pendingCaptureJobs: Type138
        recoveryResult: CaptureCheckpointResult
        captureFeedbackFlush: Promise~void~
        captureCheckpointTail: Promise~void~
        captureTriggerId: number
        captureDeferrals: Type139
        capturePass: Promise~CaptureCheckpointResult~
        settledCaptureTail: Promise~void~
        activeResolutions: Set~Promise~unknown~~
        lifecycleController: AbortController
        initialization: Promise~void~
        ready: boolean
        discoveryError: unknown
        lastRecall: RecallActivity
        skipNextCapture: boolean
        notifiedConflictIds: Set~string~
    }
    class c0119["SetupAuthentication"] {
        <<interface>>
        tokenEnv: string
        token: string
    }
    class c0120["State"] {
        <<interface>>
        runtime: Runtime
        pendingQueuedRecall: Type140
        automaticRecalls: Type141
        recallJobs: Type142
        skipNextCapture: boolean
        shownWarnings: Set~string~
        generation: number
        loading: Promise~Runtime~
    }
    class c0121["src/extension.ts"] {
        <<module>>
        boundedWait(Signature75)
        setupEndpointSuggestion(value: string) string
        promptSetupEndpoint(ctx: ExtensionContext, config: ForgetfulConfig) Type144
        promptSetupAuthentication(ctx: ExtensionContext) Type145
        makeInstanceId(config: ForgetfulConfig) string
        policyText(config: ForgetfulConfig, policies: Type133, name: PolicyName) string
        sessionKey(ctx: ExtensionContext, branchId: string) string
        boundedErrorDiagnostic(error: unknown) string
        textMessage(text: string) UserMessage
        snapshotWorkContext(context: ExtensionWorkContext) ExtensionWorkContext
        messageContentText(content: unknown) string
        usefulRecallText(result: RecallResult) string
        savedRecallResultText(result: RecallResult, kind: Type135) string
        automaticRecallTerminalText(Signature76)
        automaticRecallResultStatus(result: RecallResult) Type146
        recallActivitySummary(activity: RecallActivity) string
        recordRecallActivity(Signature77)
        recallContextEntries(ctx: ExtensionContext) EvidenceEntry[]
        latestBranchUserEntry(ctx: ExtensionContext) Type147
        latestContextUserPrompt(messages: Type148) Type76
        resolutionEvidence(Signature78)
        conflictBelongsToActiveBranch(Signature79)
        defaultWorkContext(ctx: ExtensionContext, branchId: string) ExtensionWorkContext
        canonicalRepository(remote: string) Type76
        qualifiedRepository(host: string, path: string) Type76
        discoverWorkContext(Signature80)
        parseSelection(value: string) Type97
        pickMemoryModel(ctx: ExtensionContext, currentModel: Type150) Type149
        notify(ctx: ExtensionContext, message: string, type: Type151) void
        log(Signature81)
        logFailure(Signature82)
        findResolutionConflict(Signature83)
        resolutionStatus(value: unknown) string
        diagnosticSourceIds(value: unknown) string
        claimText(value: unknown) string
        diagnosticCandidateDetail(value: unknown, stages: Type127) Type76
        collectDiagnosticParts(jobs: unknown[]) DiagnosticParts
        diagnosticSummary(value: unknown) string
        captureJobId(value: unknown) Type76
        captureWasQueued(value: unknown) boolean
        captureProcessedJobIds(value: Type154) string[]
        captureFeedbackReason(value: unknown) Type76
        automaticCaptureJobOutcome(value: unknown, jobId: string) Type155
        readCaptureOutcome(Signature84)
        recordCaptureRetry(#123; state#44; outcome #125;: CaptureFeedbackItem) Type157
        collectCaptureFeedback(items: CaptureFeedbackItem[]) unknown
        captureCount(count: number, singular: string, plural: string) string
        skippedReasonBreakdown(reasons: Type127) string
        captureFeedbackParts(summary: Type158) string[]
        automaticCaptureFeedback(items: CaptureFeedbackItem[], unavailable: number) Type159
        createForgetfulExtension(options: ForgetfulExtensionOptions) ExtensionFactory
    }
    class c0122["src/foreground-tools.ts"] {
        <<module>>
        registerForegroundTool(pi: ExtensionAPI, definition: ToolDefinition~T~) void
    }
    class c0123["ApiKnowledgeClient"] {
        <<class>>
        constructor(request: KnowledgeRequest, parseMemory: Type160) unknown
        -request: KnowledgeRequest
        -parseMemory: Type160
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
        updateDocument(Signature85)
        listCodeArtifacts(projectId: number, signal: AbortSignal) Promise~CodeArtifactSummary[]~
        getCodeArtifact(artifactId: number, signal: AbortSignal) Promise~CodeArtifact~
        createCodeArtifact(input: CodeArtifactInput, signal: AbortSignal) Promise~CodeArtifact~
        updateCodeArtifact(Signature86)
        updateMemory(memoryId: number, input: Partial~MemoryInput~, signal: AbortSignal) unknown
        linkMemories(memoryId: number, relatedIds: number[], signal: AbortSignal) Promise~void~
        unlinkMemories(memoryId: number, targetId: number, signal: AbortSignal) Promise~void~
        listFiles(projectId: number, signal: AbortSignal) Promise~FileSummary[]~
        getFile(fileId: number, signal: AbortSignal) Promise~StoredFile~
    }
    class c0124["KnowledgeRequest"] {
        <<type_alias>>
        alias: Type161
    }
    class c0125["src/http-knowledge.ts"] {
        <<module>>
        object(value: unknown) Type46
        text(value: unknown, max: number, empty: unknown, field: unknown) string
        id(value: unknown) number
        ids(value: unknown) number[]
        strings(value: unknown, max: unknown) string[]
        records(value: unknown, key: string) unknown[]
        provenance(value: Type46) Provenance
        entityBody(input: Partial~EntityInput~, partial: unknown) Type46
        entity(value: unknown) Entity
        relationshipBody(input: EntityRelationshipInput) Type46
        relationship(value: unknown) EntityRelationship
        memoryMetadata(value: Type46) Type46
        resourceBody(input: Type162, code: boolean, partial: unknown) Type46
        document(value: unknown) Document
        artifact(value: unknown) CodeArtifact
        summary(value: unknown, code: boolean) Type163
        projectPath(path: string, projectId: number) string
        fileSummary(value: unknown) FileSummary
    }
    class c0126["ApiForgetfulClient"] {
        <<class>>
        knowledge: unknown
        -baseUrl: URL
        -token: string
        -timeoutMs: number
        -maxResponseBytes: number
        -maxFileResponseBytes: number
        -fetchImpl: typeof fetch
        constructor(options: ApiForgetfulClientOptions) unknown
        search(request: SearchRequest, signal: AbortSignal) Promise~Memory[]~
        queryMemory(request: SearchRequest, signal: AbortSignal) Promise~MemorySearchResult~
        listProjects(repoName: string, signal: AbortSignal) Promise~Project[]~
        createProject(input: ProjectInput, signal: AbortSignal) Promise~Project~
        linkProject(id: number, repoName: string, signal: AbortSignal) Promise~Project~
        create(input: MemoryInput, signal: AbortSignal) Promise~MemoryCreateResult~
        get(id: number, signal: AbortSignal) Promise~Memory~
        getMemoryEntityIds(id: number, signal: AbortSignal) Promise~number[]~
        supersede(Signature87)
        -createBody(input: MemoryInput) Type46
        -validId(id: number) number
        -endpoint(path: string) string
        -responseByteLimit(method: string, url: URL) number
        -request(Signature88)
        -throwResponseError(Signature89)
        -readResponse(response: Response, signal: AbortSignal, maxBytes: number) Promise~string~
    }
    class c0127["ApiForgetfulClientOptions"] {
        <<interface>>
        baseUrl: string
        token: string
        timeoutMs: number
        maxResponseBytes: number
        fetchImpl: typeof fetch
    }
    class c0128["ForgetfulAbortError"] {
        <<class>>
        constructor(message: unknown) unknown
    }
    class c0129["ForgetfulHttpError"] {
        <<class>>
        status: number
        responseBody: string
        constructor(message: string, status: number, responseBody: string) unknown
    }
    class c0130["ForgetfulSchemaError"] {
        <<class>>
        constructor(message: string) unknown
    }
    class c0131["ForgetfulTimeoutError"] {
        <<class>>
        constructor(message: unknown) unknown
    }
    class c0132["src/http.ts"] {
        <<module>>
        isObject(value: unknown) Type96
        directEntityId(edge: unknown, memoryId: number) Type77
        requiredString(value: unknown, field: string) string
        projectText(value: string, field: string, max: number) string
        optionalString(value: unknown, field: string) Type76
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
        validatedSearchOptions(request: SearchRequest) Type166
        addSearchProjectFilter(body: Type46, request: SearchRequest) void
        searchBody(request: SearchRequest) Type46
        uniqueMemories(memories: Memory[]) Memory[]
        parseLinkedMemories(value: unknown) LinkedMemory[]
        parseSearchPayload(Signature90)
        flattenSearchResult(result: MemorySearchResult) Memory[]
    }
    class c0133["Attachments"] {
        <<interface>>
        documents: Document[]
        artifacts: CodeArtifact[]
        files: FileSummary[]
        fileIds: number[]
    }
    class c0134["KnowledgeExpansionRequest"] {
        <<interface>>
        memories: Memory[]
        entityNames: string[]
        scope: Scope
        projectId: number
        signal: AbortSignal
    }
    class c0135["KnowledgeExpansionResult"] {
        <<interface>>
        text: string
        memoryIds: number[]
        entityIds: number[]
        relationshipIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
    }
    class c0136["KnowledgeReadService"] {
        <<class>>
        -readMemory: MemoryReader
        constructor(client: KnowledgeClient, options: Type167) unknown
        -client: KnowledgeClient
        expand(request: KnowledgeExpansionRequest) Promise~KnowledgeExpansionResult~
        -findEntities(request: KnowledgeExpansionRequest) Promise~Entity[]~
        -findRelationships(Signature91)
        -collectRelationships(Signature92)
        -resolveRelationshipEndpoints(Signature93)
        -formatRelationships(Signature94)
        -findEntityMemories(Signature95)
        -collectEntityMemories(Signature96)
        -isAllowedEntityMemory(id: number, request: KnowledgeExpansionRequest) Promise~boolean~
        -findAttachments(request: KnowledgeExpansionRequest) Promise~Attachments~
        -formatExpansion(Signature97)
        -appendEntityLines(lines: string[], entities: Entity[]) void
        -appendRelationshipLines(lines: string[], relationships: RelationshipExpansion[]) void
        -appendLinkedMemoryLines(lines: string[], linkedMemories: LinkedMemoryExpansion[]) void
        -appendDocumentLines(lines: string[], documents: Document[]) void
        -appendArtifactLines(lines: string[], artifacts: CodeArtifact[]) void
        -appendFileLines(lines: string[], files: FileSummary[], fileIds: number[]) void
        -emptyExpansion() KnowledgeExpansionResult
    }
    class c0137["KnowledgeReadServiceOptions"] {
        <<interface>>
        readMemory: MemoryReader
    }
    class c0138["LinkedMemoryExpansion"] {
        <<type_alias>>
        entity: Entity
        id: number
        title: string
    }
    class c0139["MemoryReader"] {
        <<type_alias>>
        alias: Type171
    }
    class c0140["RelationshipExpansion"] {
        <<type_alias>>
        relationship: EntityRelationship
        source: Entity
        target: Entity
    }
    class c0141["src/knowledge-read.ts"] {
        <<module>>
        validId(value: unknown) value is number
        validEntity(value: unknown) value is Entity
        validRelationship(value: unknown) value is EntityRelationship
        validMemory(value: unknown) value is Memory
        inEntityScope(entity: Entity, scope: Scope, projectId: number) boolean
        inProjectScope(resourceProjectId: Type172, scope: Scope, projectId: number) boolean
        clean(value: string) string
        safeCall(operation: Type42, signal: AbortSignal) Type173
    }
    class c0142["KnowledgeReadContext"] {
        <<interface>>
        client: ForgetfulClient
        knowledge: KnowledgeClient
        request: KnowledgeReadRequest
        context: KnowledgeToolContext
        projectId: number
        signal: AbortSignal
    }
    class c0143["KnowledgeReadRequest"] {
        <<type_alias>>
        alias: Type174
        operation: string
    }
    class c0144["KnowledgeToolContext"] {
        <<interface>>
        cwd: string
        repoName: string
        commit: string
        project: Type175
        scope: Scope
    }
    class c0145["KnowledgeToolResult"] {
        <<interface>>
        content: Type176
        details: Type46
        file: StoredFile
    }
    class c0146["KnowledgeWriteContext"] {
        <<interface>>
        client: ForgetfulClient
        knowledge: KnowledgeClient
        request: KnowledgeWriteRequest
        context: KnowledgeToolContext
        projectId: number
        signal: AbortSignal
        beforeWrite: Type13
        checkWriteState: Type21
    }
    class c0147["KnowledgeWriteRequest"] {
        <<type_alias>>
        alias: Type174
        operation: string
    }
    class c0148["ResolvedWriteProject"] {
        <<interface>>
        id: number
        repoName: string
    }
    class c0149["ToolImage"] {
        <<type_alias>>
        data: string
        mimeType: string
        type: Type177
    }
    class c0150["ToolText"] {
        <<type_alias>>
        text: string
        type: Type178
    }
    class c0151["src/knowledge-tools.ts"] {
        <<module>>
        leftoverSearchField(description: string) unknown
        isEntityType(value: unknown) value is EntityType
        record(value: unknown, label: string) Type46
        requiredText(value: unknown, field: string, max: number) string
        optionalText(value: unknown, field: string, max: number) Type76
        requiredId(value: unknown, field: string) number
        optionalId(value: unknown, field: string) Type77
        boundedId(value: unknown, field: string, maximum: number) Type77
        boundedNonNegativeInteger(value: unknown, field: string, maximum: number) Type77
        requiredIds(value: unknown, field: string) number[]
        optionalIds(value: unknown, field: string) Type12
        requiredStrings(value: unknown, field: string, maxItems: unknown) string[]
        optionalStrings(value: unknown, field: string, maxItems: unknown) Type88
        optionalImportance(value: unknown) Type77
        commit(value: unknown) Type76
        checkOperation(value: unknown, choices: Set~string~) string
        containsSensitiveData(value: unknown) boolean
        rejectSensitiveInput(value: unknown) void
        need(input: Type46, fields: Type179) void
        validateReadSearch(input: Type46, op: string) void
        validateReadIdentity(input: Type46, op: string) void
        validateReadPagination(input: Type46, op: string) void
        validateKnowledgeReadRequest(value: unknown) KnowledgeReadRequest
        validateEntityFields(input: Type46) void
        validateKnowledgeWriteRequest(value: unknown) KnowledgeWriteRequest
        rich(client: ForgetfulClient) KnowledgeClient
        currentProject(context: KnowledgeToolContext, requested: number) number
        resolveWriteProject(Signature98)
        inMemoryProject(memory: Memory, projectId: number) boolean
        inEntityProject(entity: Entity, projectId: number) boolean
        json(value: unknown) string
        page(value: Type180, field: Type181, offset: number, limit: number) unknown
        listPage(values: T[], offset: number, limit: number) Type182
        boundedListPage(values: T[], offset: number, limit: number) Type183
        fileContent(file: StoredFile, offset: number, limit: number) Type184
        readResult(value: unknown, details: Type46) KnowledgeToolResult
        assertReadMemory(Signature99)
        assertReadEntity(Signature100)
        requireReadKnowledge(read: KnowledgeReadContext) KnowledgeClient
        requestedReadProject(read: KnowledgeReadContext) Type77
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
        executeKnowledgeRead(Signature101)
        provenance(context: KnowledgeToolContext, request: Type46) Type185
        effectiveCommit(context: KnowledgeToolContext, request: Type46) Type76
        updateProvenance(Signature102)
        beforeMutation(beforeWrite: Type186, signal: AbortSignal) Promise~void~
        memoryInProject(Signature103)
        entityInProject(Signature104)
        hydrateEntities(Signature105)
        validateAttachments(Signature106)
        compactString(value: unknown) unknown
        compactObjectEntry(key: string, value: unknown, depth: number) unknown
        compactWriteValue(value: unknown, depth: unknown) unknown
        writeResult(value: unknown, operation: string) KnowledgeToolResult
        createMemory(Signature107)
        createEntity(Signature108)
        createDocument(Signature109)
        createCodeArtifact(Signature110)
        replacementMemory(write: KnowledgeWriteContext) Promise~Memory~
        updateMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        supersedeMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        linkMemories(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateEntity(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        linkEntityMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        createRelationship(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateDocument(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateCodeArtifact(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        executeKnowledgeWrite(Signature111)
    }
    class c0152["KnowledgeAttachmentIds"] {
        <<interface>>
        documentIds: number[]
        codeArtifactIds: number[]
    }
    class c0153["KnowledgeCodeArtifactPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: CodeArtifactInput
    }
    class c0154["KnowledgeDocumentPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: DocumentInput
    }
    class c0155["KnowledgeEntityMemoryLinkPlan"] {
        <<interface>>
        entityKey: string
    }
    class c0156["KnowledgeEntityPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: EntityInput
    }
    class c0157["KnowledgeMemoryReader"] {
        <<type_alias>>
        alias: Type171
    }
    class c0158["KnowledgeRelationshipPlan"] {
        <<interface>>
        key: string
        existingId: number
        sourceEntityKey: string
        targetEntityKey: string
        input: EntityRelationshipInput
    }
    class c0159["KnowledgeWriteCheckpoint"] {
        <<type_alias>>
        alias: Type187
    }
    class c0160["KnowledgeWriteGuard"] {
        <<type_alias>>
        alias: Type13
    }
    class c0161["KnowledgeWritePlan"] {
        <<interface>>
        operationId: string
        projectId: number
        memoryId: number
        expectedClaim: Type188
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
    class c0162["KnowledgeWriteReceipt"] {
        <<interface>>
        key: string
        id: number
    }
    class c0163["KnowledgeWriteSave"] {
        <<type_alias>>
        alias: Type13
    }
    class c0164["KnowledgeWriteState"] {
        <<interface>>
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
    class c0165["KnowledgeWriter"] {
        <<class>>
        constructor(Signature112)
        -client: WriteClient
        -readMemory: KnowledgeMemoryReader
        -assertCanWrite: Type21
        -currentMemory(plan: KnowledgeWritePlan, signal: AbortSignal) Promise~Memory~
        -entityInProject(id: number, projectId: number, signal: AbortSignal) Promise~Entity~
        -documentInProject(id: number, projectId: number, signal: AbortSignal) Promise~Document~
        -codeArtifactInProject(Signature113)
        -validateAttachments(Signature114)
        -validatePlan(plan: KnowledgeWritePlan) void
        -validateResourceKeys(resources: Type189) void
        -createOnce(Signature115)
        -writeEntity(Signature116)
        -writeEntities(Signature117)
        -writeDocument(Signature118)
        -writeDocuments(Signature119)
        -writeCodeArtifact(Signature120)
        -writeCodeArtifacts(Signature121)
        -requestedAttachmentIds(Signature122)
        -attachmentIds(memory: Memory, requested: KnowledgeAttachmentIds) KnowledgeAttachmentIds
        -attachmentsDiffer(memory: Memory, ids: KnowledgeAttachmentIds) boolean
        -ensureMemoryCanReceiveAttachments(memory: Memory) void
        -attachmentPatch(ids: KnowledgeAttachmentIds) Type192
        -writeAttachments(Signature123)
        -writeRelationship(Signature124)
        -writeRelationships(Signature125)
        -writeEntityMemoryLink(Signature126)
        -writeEntityMemoryLinks(Signature127)
        -writeLinkedMemory(Signature128)
        -writeLinkedMemories(Signature129)
        execute(Signature130)
    }
    class c0166["WriteClient"] {
        <<type_alias>>
        alias: Type193
    }
    class c0167["src/knowledge-write.ts"] {
        <<module>>
        copyState(value: KnowledgeWriteState) KnowledgeWriteState
        positiveId(value: unknown) value is number
        stateWithNumber(values: KnowledgeWriteReceipt[], key: string, id: number) void
        stateId(values: KnowledgeWriteReceipt[], key: string) Type77
        selectedIds(values: KnowledgeWriteReceipt[], resources: Type189) number[]
        uniqueIds(values: number[], label: string) number[]
        sameIds(left: Type12, right: number[]) boolean
        receipts(value: unknown) KnowledgeWriteReceipt[]
        normalizedState(previous: Partial~KnowledgeWriteState~) KnowledgeWriteState
        hasValue(values: string[], value: string) boolean
        instructionId(plan: KnowledgeWritePlan) string
    }
    class c0168["DiagnosticLogger"] {
        <<interface>>
        +emit(level: Type45, event: string, data: Type46) void
        +flush() Promise~void~
    }
    class c0169["FileLogLevel"] {
        <<type_alias>>
        alias: Type194
    }
    class c0170["FileLogger"] {
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
        constructor(options: Type195) unknown
        -options: Type195
        setLevel(level: FileLogLevel) void
        emit(level: Type45, event: string, data: Type46) void
        -enqueue(level: Type45, event: string, data: Type46) void
        -rotate() Promise~void~
        -warn(error: unknown) void
        close() Promise~void~
        flush() Promise~void~
    }
    class c0171["src/logging.ts"] {
        <<module>>
        processExited(pid: number) boolean
        listLogFiles(directory: string) unknown
        pruneDirectory(directory: string, current: Type39) Promise~void~
        limit(value: Type77, fallback: number) number
        excludeCredentials(value: unknown) unknown
    }
    class c0172["src/memory-context.ts"] {
        <<module>>
        storedMemoryContext(context: string) string
        replacementMemoryContext(context: string) string
        replacementMemoryInput(input: MemoryInput) MemoryInput
    }
    class c0173["CompactedMemoryHistory"] {
        <<interface>>
        summary: string
        retainedMessages: Message[]
    }
    class c0174["ContextWindowError"] {
        <<class>>
    }
    class c0175["MemoryHistorySummaryOptions"] {
        <<interface>>
        model: Model~any~
        compactionSettings: CompactionSettings
        contextLimitTokens: number
        signal: AbortSignal
        sessionId: string
        complete: SummaryCompletion
    }
    class c0176["MemoryTaskContext"] {
        <<class>>
        -settings: typeof DEFAULT_COMPACTION_SETTINGS
        -contextWindow: number
        -originalHistory: Set~Message~
        -compactedHistory: CompactedMemoryHistory
        -summaryMessage: Message
        constructor(Signature131)
        -model: Model~any~
        -task: Message
        getCompactedHistory() Type197
        prepare(Signature132)
        prepareCapture(Signature133)
        -prepareContext(Signature134)
        -applySummary(Signature135)
        -outputAllowance(context: Context) number
    }
    class c0177["SummaryCompletion"] {
        <<type_alias>>
        alias: Type200
    }
    class c0178["src/model-context.ts"] {
        <<module>>
        objectRecord(value: unknown) Type96
        modelEvidence(record: unknown) unknown
        evidenceMessage(record: unknown, label: string, timestamp: number) UserMessage
        textTokens(text: string) number
        contextTokens(context: Context) number
        assertFits(Signature136)
        validatePositiveSafeInteger(value: unknown, label: string) number
        entriesFor(messages: Message[]) SessionMessageEntry[]
        recentCutIndex(messages: Message[], keepRecentTokens: number) number
        assertImageSupport(context: Context, model: Model~any~) void
        summaryEvidence(message: Message, index: number) UserMessage
        privateContextWindow(model: Model~any~, contextLimitTokens: unknown) number
        compactionSettings(settings: CompactionSettings) typeof DEFAULT_COMPACTION_SETTINGS
        outputCeiling(Signature137)
        resolvedOutputAllowance(Signature138)
        smallerSummaryBatch(messages: Message[], count: number) number
        summarizeMemoryHistory(Signature139)
    }
    class c0179["MemoryModelHeaderTransform"] {
        <<type_alias>>
        alias: Type202
    }
    class c0180["ModelPickerContext"] {
        <<interface>>
        modelRegistry: Type203
        scopedModels: Type204
    }
    class c0181["ModelRegistryPort"] {
        <<interface>>
        +find(provider: string, modelId: string) Type150
        +complete(Signature140)
    }
    class c0182["PiMemoryModel"] {
        <<class>>
        version: string
        -classificationTimeoutMs: number
        -sessionId: string
        -transformHeaders: MemoryModelHeaderTransform
        -logger: DiagnosticLogger
        -compactionSettings: CompactionSettings
        -contextLimitTokens: number
        constructor(Signature141)
        -registry: ModelRegistryPort
        -selection: ModelSelection
        complete(request: ModelRequest) Promise~unknown~
        prepareCapture(request: ModelRequest) Type110
        -emit(level: Type45, event: string, request: ModelRequest, data: Type46) void
        -completeRequest(request: ModelRequest, preparationOnly: unknown) Promise~unknown~
        -completeAttempt(Signature142)
        -executeRead(Signature143)
        -validateSubmission(submission: ModelSubmissionTool, tool: Tool, call: ToolCall) unknown
        -completeWithSubmission(Signature144)
    }
    class c0183["PiMemoryModelOptions"] {
        <<interface>>
        logger: DiagnosticLogger
        classificationTimeoutMs: number
        timeoutMs: number
        sessionId: string
        transformHeaders: MemoryModelHeaderTransform
        compactionSettings: CompactionSettings
        contextLimitTokens: number
    }
    class c0184["RequestDeadline"] {
        <<interface>>
        controller: AbortController
        callerAbort: Promise~never~
        timeout: Promise~never~
        timedOut: boolean
        providerCalls: number
        compactionCalls: number
        +cleanup() void
    }
    class c0185["src/model.ts"] {
        <<module>>
        serializeInput(input: unknown) string
        ensureCompletionFinished(Signature145)
        modelLabel(model: ModelSelection) string
        isOpenCodeModel(model: Model~any~) boolean
        openCodeSessionHeaders(model: Model~any~, sessionId: Type76) Type207
        requestTimeout(request: ModelRequest, classificationTimeoutMs: number) number
        requestOptions(Signature146)
        textBlock(text: string) TextContent
        submissionTool(submission: Type209) Tool
        toolCalls(message: AssistantMessage) ToolCall[]
        rejectionText(error: unknown) string
        sanitizedAssistantForHistory(message: AssistantMessage) AssistantMessage
        errorToolResult(call: ToolCall, error: string) ToolResultMessage
        appendCallCountCorrection(Signature147)
        requestDeadline(request: ModelRequest, timeoutMs: number) RequestDeadline
        throwRequestFailure(error: unknown, request: ModelRequest) never
        resolveMemoryModel(Signature148)
        modelSelectionFromModel(model: Model~any~) ModelSelection
        availableMemoryModels(ctx: ModelPickerContext) Model~any~[]
    }
    class c0186["src/privacy.ts"] {
        <<module>>
        sanitizeText(text: string) string
        hasSensitiveData(text: string) boolean
        isMemoryOperation(toolName: string) boolean
        sanitizeValue(value: unknown) unknown
    }
    class c0187["AgentProjectInitInput"] {
        <<interface>>
        name: string
        description: string
        projectId: number
    }
    class c0188["ProjectInitError"] {
        <<class>>
    }
    class c0189["src/project-init.ts"] {
        <<module>>
        existingMapping(projects: Project[], repoName: string) Type211
        validateAgentProjectDetails(repoName: string, input: AgentProjectInitInput) ProjectInput
        promptNewProject(ctx: ExtensionContext, repoName: string) Type212
        promptExistingProject(Signature149)
        initialiseProject(Signature150)
        initialiseProjectForAgent(Signature151)
    }
    class c0190["DurableQueueStore"] {
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
        -now: Type40
        -snapshotPrefix: string
        constructor(options: Type214) unknown
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
        -withFileLock(path: string, operation: Type42) Promise~T~
        -withMutationFileLock(operation: Type42) Promise~T~
        -mutate(operation: Type215) Promise~T~
        -pruneFailedJobs(state: QueueState) boolean
        -prune(state: QueueState) void
        -updateWatermark(state: QueueState, update: WatermarkAdvance) QueueWatermark
        enqueue(snapshot: CaptureSnapshot) Promise~QueueEnqueueResult~
        enqueueSnapshot(snapshot: CaptureSnapshot) Promise~QueueEnqueueResult~
        advanceWatermark(update: Type216) Promise~QueueWatermark~
        getWatermark(sessionId: string, branchId: string) Promise~QueueWatermark~
        resolveBranchId(Signature152)
        currentWatermark(context: Type72) Promise~QueueWatermark~
        completeProjectDiscovery(context: Type217) Promise~void~
        listPending(identity: QueueIdentity) Promise~QueueJob[]~
        listJobs(identity: QueueIdentity) Promise~QueueJob[]~
        listJobMetadata(identity: QueueIdentity) Promise~QueueJobMetadata[]~
        getJob(jobId: string) Type218
        hasClaimableWork(identity: QueueIdentity, excludeBranches: Type219) Promise~boolean~
        claimNext(identity: QueueIdentity, branch: Type220, onDiscarded: Type221) Type218
        -matchesBranch(job: QueueJob, branch: Type222) boolean
        -runningJobCanBeRecovered(job: QueueJob, currentTime: number) boolean
        -claimJob(job: QueueJob) void
        releaseProgress(jobId: string) Promise~void~
        cancel(Signature153)
        checkpoint(jobId: string, patch: QueueCheckpoint) Promise~QueueJob~
        checkpoint(jobId: string, candidateId: string, outcome: unknown) Promise~QueueJob~
        checkpoint(jobId: string, patchOrCandidate: Type223, outcome: unknown) Promise~QueueJob~
        -compactJobSnapshot(Signature154)
        -recordCompletedCapture(state: QueueState, job: StoredQueueJob) Promise~void~
        -applyCheckpointPatch(job: StoredQueueJob, patch: QueueCheckpoint) void
        complete(jobId: string) Promise~QueueJob~
        addConflict(conflict: PendingConflict) Promise~PendingConflict~
        getConflict(conflictId: string) Type224
        pendingConflicts(Signature155)
        listPendingConflicts(Signature156)
        updateConflict(Signature157)
        withWorkerLock(identity: QueueIdentity, branch: Type220, operation: Type42) Type173
        close() Promise~void~
    }
    class c0191["DurableQueueStoreOptions"] {
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
        now: Type40
    }
    class c0192["FileLock"] {
        <<interface>>
        token: string
        +release() Promise~void~
    }
    class c0193["PendingConflict"] {
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
        status: Type225
        replacementId: number
        uncertainWrite: string
        supersession: SupersessionReceipt
        replacement: Type226
        resolution: unknown
        createdAt: string
        updatedAt: string
    }
    class c0194["QueueBusyError"] {
        <<class>>
        constructor(path: string) unknown
    }
    class c0195["QueueCheckpoint"] {
        <<interface>>
        status: QueueJobStatus
        callCount: number
        extractedCandidates: unknown[]
        candidateOutcomes: Type46
        submissionRejections: string[]
        lastError: string
        startedAt: string
        supersession: SupersessionReceipt
        inspectionEntries: EvidenceEntry[]
        compactedConversation: CompactedConversation
    }
    class c0196["QueueEnqueueResult"] {
        <<interface>>
        queued: boolean
        jobId: string
        reason: string
        historyError: string
    }
    class c0197["QueueIdentity"] {
        <<interface>>
        instanceId: string
        endpoint: string
        accountId: string
    }
    class c0198["QueueJob"] {
        <<interface>>
        id: string
        dedupeKey: string
        binding: QueueIdentity
        snapshot: CaptureSnapshot
        status: QueueJobStatus
        attempts: number
        callCount: number
        extractedCandidates: unknown[]
        candidateOutcomes: Type46
        submissionRejections: string[]
        lastError: string
        uncertainWrite: string
        supersession: SupersessionReceipt
        createdAt: string
        updatedAt: string
        startedAt: string
        ownerPid: number
    }
    class c0199["QueueJobMetadata"] {
        <<interface>>
        snapshot: Type227
    }
    class c0200["QueueJobStatus"] {
        <<type_alias>>
        alias: Type228
    }
    class c0201["QueueState"] {
        <<interface>>
        version: Type229
        jobs: StoredQueueJob[]
        conflicts: PendingConflict[]
        watermarks: Type230
    }
    class c0202["QueueWatermark"] {
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
        updatedAt: string
    }
    class c0203["SnapshotPayload"] {
        <<type_alias>>
        alias: Type231
    }
    class c0204["StoredQueueJob"] {
        <<interface>>
        snapshotDigest: string
        inspectionDigest: string
    }
    class c0205["SupersessionReceipt"] {
        <<interface>>
        oldMemoryId: number
        replacementId: number
        status: Type7
    }
    class c0206["WatermarkAdvance"] {
        <<interface>>
        sessionId: string
        branchId: string
        entryIds: string[]
        finalEntryId: string
        snapshotId: string
        dedupeKey: string
    }
    class c0207["src/queue.ts"] {
        <<module>>
        jsonSnapshot(value: T) T
        nowIso(now: Type40) string
        contextKey(sessionId: string, branchId: string) string
        dedupeKey(snapshot: CaptureSnapshot) string
        jobIdFor(key: string) string
        scrubDiagnostic(value: string) string
        sanitizeOutcomeMap(value: Type46) Type46
        outcomeRecord(value: unknown) Type46
        interruptedWrite(job: QueueJob) boolean
        releaseCompletedArtifacts(job: StoredQueueJob) void
        normaliseState(value: unknown) QueueState
        validateInspectionEntry(input: EvidenceEntry, reserved: Set~string~) void
        isProcessAlive(pid: unknown) boolean
        identityMatches(job: QueueJob, identity: QueueIdentity) boolean
        conflictIdentityMatches(conflict: PendingConflict, identity: QueueIdentity) boolean
        shouldRetain(timestamp: string, now: number, retentionMs: number) boolean
        diagnosticError(error: unknown) string
        recordId(value: unknown) Type76
        orderedSourceEntryIds(snapshot: CaptureSnapshot) Type88
        summaryCursor(snapshot: CaptureSnapshot) Type232
        cursorComparison(candidate: Type233, current: Type234) Type77
        clearHistoryCache(watermark: QueueWatermark) void
    }
    class c0208["DeadlineSignal"] {
        <<interface>>
        signal: AbortSignal
        finish: Type21
        pause: Type21
        resume: Type21
        expired: Type39
        diagnostic: Type235
    }
    class c0209["DeeperRecallRequest"] {
        <<interface>>
        query: string
        context: WorkContext
        scope: Scope
        signal: AbortSignal
        deadlineMs: number
        projects: Project[]
    }
    class c0210["RecallPlan"] {
        <<interface>>
        search: boolean
        queries: string[]
        queryIntent: string
        entities: string[]
        repositorySpecific: boolean
        projectId: number
    }
    class c0211["RecallRequest"] {
        <<interface>>
        diagnosticContext: Type236
        prompt: string
        context: WorkContext
        scope: Scope
        classificationPolicy: string
        recallPolicy: string
        signal: AbortSignal
        deadlineMs: number
        authorizeProject: Type237
        projects: Project[]
        sessionContext: EvidenceEntry[]
        onPlan: Type238
    }
    class c0212["RecallResult"] {
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
    class c0213["RecallService"] {
        <<class>>
        -defaultDeadlineMs: number
        -failureThreshold: number
        -cooldownMs: number
        -now: Type239
        -knowledge: KnowledgeReadService
        -concurrency: number
        -failures: unknown
        -openedAt: Type77
        constructor(Signature158)
        -client: ForgetfulClient
        -model: MemoryModelClient
        recall(request: RecallRequest) Promise~RecallResult~
        -recallReadTool(Signature159)
        -finishFailure(Signature160)
        -finishReview(Signature161)
        deeper(request: DeeperRecallRequest) Promise~RecallResult~
        -memoryInScope(memory: Memory, scope: Scope, projectId: number) boolean
        -optionalKnowledge(Signature162)
        -resultWithKnowledge(Signature163)
        -plannerInput(request: RecallRequest) unknown
        -authorizeProjectSelection(Signature164)
        -requestsDifferentProject(Signature165)
        -searchMemories(Signature166)
        -searchFailure(error: unknown) unknown
        -searchRequest(Signature167)
        -queryContext(plan: RecallPlan) string
        -resolveScope(Signature168)
        -contextProjectResolution(context: WorkContext) ScopeResolution
        -matchResolution(matches: Project[]) ScopeResolution
        -ensureLive(deadline: DeadlineSignal) void
        -empty(scope: Scope, reason: string) RecallResult
        -circuitOpen() boolean
        -recordFailure() void
        -recordSuccess() void
    }
    class c0214["RecallServiceOptions"] {
        <<interface>>
        concurrency: number
        deadlineMs: number
        circuitFailureThreshold: number
        circuitCooldownMs: number
        now: Type239
    }
    class c0215["ReviewValidationError"] {
        <<class>>
        constructor(message: string, debug: string) unknown
        debug: string
    }
    class c0216["ScopeResolution"] {
        <<interface>>
        projectId: number
        project: Project
        reason: string
    }
    class c0217["SearchOutcome"] {
        <<interface>>
        memories: Memory[]
        failed: boolean
        diagnostic: string
        failure: unknown
    }
    class c0218["src/recall.ts"] {
        <<module>>
        isForgetfulResponseError(error: unknown) Type244
        isObject(value: unknown) Type96
        plannerString(value: unknown, field: string, required: unknown) string
        positiveInteger(value: unknown, field: string) number
        abortError() Error
        isAbort(error: unknown) boolean
        failureReason(deadline: DeadlineSignal, callerSignal: AbortSignal) string
        exceptionDiagnostic(stage: string, error: unknown) string
        trim(value: string, max: number) string
        repositoryIdentity(context: WorkContext) Type76
        repoAwareQuery(query: string, context: WorkContext, repositorySpecific: boolean) string
        availableProjects(context: WorkContext, supplied: Project[]) Project[]
        createDeadlineSignal(callerSignal: Type165, deadlineMs: number) DeadlineSignal
        raceAbort(promise: Promise~T~, signal: AbortSignal) Promise~T~
        parseQueries(value: unknown, search: boolean) string[]
        parseEntities(value: unknown) string[]
        parsePlan(value: unknown) RecallPlan
        validateMemory(value: unknown) Type245
        formatRecall(Signature169)
        reviewSources(result: Partial~RecallResult~) Type247
        sourceLabels(sources: ReturnType~typeof reviewSources~) string[]
        boundDebugText(value: string, max: number, marker: string) string
        reviewerOutputText(value: unknown) string
        reviewMismatchDirection(value: unknown) Type76
        reviewValidationDebug(Signature170)
        submissionAttemptTrace(rejections: string[], exhausted: unknown, label: Type248) string
        parseReview(value: unknown, candidates: RecallResult) Type249
        recallReviewSubmission(Signature171)
        sanitizePolicy(value: string) string
    }
    class c0219["src/repository.ts"] {
        <<module>>
        repositoryName(value: string) string
    }
    class c0220["CaptureSnapshotWithStatus"] {
        <<interface>>
        finalStopReason: string
    }
    class c0221["MessageRecord"] {
        <<interface>>
        role: unknown
        content: unknown
        toolName: unknown
        isError: unknown
        stopReason: unknown
        toolCallId: unknown
        details: unknown
    }
    class c0222["SnapshotOptions"] {
        <<interface>>
        session: SnapshotSessionReader
        context: WorkContext
        instanceId: string
        mode: CaptureMode
        scope: Scope
        policy: string
        modelVersion: string
        afterEntryId: Type103
        baselineEntryId: Type103
        branchId: string
        createdAt: string
        leafEntryId: string
        excludedEvidenceEntryIds: readonly string[]
        includeToolEvidence: Type251
    }
    class c0223["SnapshotResult"] {
        <<type_alias>>
        alias: Type252
        snapshot: CaptureSnapshotWithStatus
        status: Type253
        finalEntryId: string
        reason: string
        status: Type254
    }
    class c0224["SnapshotSessionReader"] {
        <<interface>>
        +getSessionId() string
        +getLeafId() Type103
        +getBranch(fromId: string) SessionEntry[]
    }
    class c0225["src/snapshot.ts"] {
        <<module>>
        isRecord(value: unknown) Type96
        asMessage(entry: SessionEntry) Type255
        contentText(content: unknown) string
        safeText(text: string) string
        sanitizeConversation(value: unknown) unknown
        sanitizeCaptureConversation(conversation: readonly unknown[]) unknown[]
        sanitizeCaptureSnapshot(snapshot: CaptureSnapshot) CaptureSnapshot
        conversationForEntry(entry: SessionEntry) unknown
        rootId(branch: SessionEntry[], fallback: string) string
        snapshotId(sessionId: string, branchId: string, finalEntryId: string) string
        deltaStartIndex(Signature172)
        toolEvidence(id: string, message: MessageRecord, includeToolEvidence: Type258) Type257
        evidenceForEntry(entry: SessionEntry, includeToolEvidence: Type259) Type257
        lastAssistantEntry(entries: SessionEntry[]) Type260
        collectEvidence(entries: SessionEntry[], includeToolEvidence: Type258) EvidenceEntry[]
        captureSummaryRecord(history: CaptureHistorySummary) unknown
        compactCaptureSnapshot(Signature173)
        reuseCaptureHistory(snapshot: CaptureSnapshot, history: Type261) CaptureSnapshot
        buildCaptureSnapshot(options: SnapshotOptions) SnapshotResult
    }
    class c0226["SourceInspectionError"] {
        <<interface>>
        name: string
        message: string
        code: string
    }
    class c0227["SourceInspectionRequest"] {
        <<type_alias>>
        alias: Type262
        path: string
        path: never
        url: never
        url: string
    }
    class c0228["SourceInspectionResult"] {
        <<type_alias>>
        alias: Type263
        status: Type264
        identifier: string
        content: string
        observedAt: string
        contentHash: string
        sanitized: boolean
        page: Type265
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
        fileState: Type266
        provenanceError: SourceInspectionError
        httpStatus: number
        status: Type267
        observedAt: string
        error: SourceInspectionError
        source_url: string
        httpStatus: number
        httpStatusText: string
        body: string
    }
    class c0229["SourceInspector"] {
        <<class>>
        -root: Type268
        constructor(options: SourceInspectorOptions) unknown
        -options: SourceInspectorOptions
        inspect(input: unknown, signal: AbortSignal) Promise~SourceInspectionResult~
        -inspectUrl(request: Type269, signal: AbortSignal) Promise~SourceInspectionResult~
        -getUrl(url: URL, allowLoopback: boolean, signal: AbortSignal) Type270
        -check(signal: AbortSignal) void
        -readFile(cwd: string, path: string, signal: AbortSignal) Promise~Buffer~
        -provenance(cwd: string, path: string, bytes: Buffer, signal: AbortSignal) unknown
        -git(cwd: string, args: string[], signal: AbortSignal) Promise~string~
    }
    class c0230["SourceInspectorOptions"] {
        <<interface>>
        cwd: string
        repoName: string
        canRead: Type39
    }
    class c0231["src/source-inspection.ts"] {
        <<module>>
        loopback(host: string) boolean
        validateUrl(url: URL) string
        validateAddress(address: string, allowLoopback: boolean) void
        errorDetails(error: unknown) SourceInspectionError
        sourceContent(bytes: Buffer, request: SourceInspectionRequest) unknown
        requireInside(cwd: string, path: string) void
    }
    c0000 ..> c0121 : defaultExtension() calls createForgetfulExtension()
    c0003 ..> c0004 : setLabel() calls refresh()
    c0003 ..> c0040 : dispose() calls stop()
    c0004 --> c0003 : field loader
    c0004 ..> c0003 : 4 relationships (see list)
    c0004 ..> c0004 : 3 relationships (see list)
    c0004 ..> c0040 : refresh() calls now()
    c0005 --> c0006 : 2 relationships (see list)
    c0005 --> c0007 : field decisions
    c0005 --> c0008 : field preservation
    c0005 --> c0009 : field previous
    c0005 --> c0065 : field resources
    c0005 --> c0069 : field resources
    c0005 --> c0082 : 2 relationships (see list)
    c0009 --> c0065 : field codeArtifacts
    c0009 --> c0069 : field documents
    c0009 --> c0072 : field entities
    c0009 --> c0082 : field memory
    c0010 ..> c0004 : 2 relationships (see list)
    c0010 ..> c0005 : 9 relationships (see list)
    c0010 ..> c0006 : type in executeConnection
    c0010 ..> c0007 : 3 relationships (see list)
    c0010 ..> c0008 : 2 relationships (see list)
    c0010 ..> c0009 : type in preparePreviousConnections
    c0010 ..> c0010 : 13 relationships (see list)
    c0010 ..> c0065 : type in readAttachmentRecords
    c0010 ..> c0069 : type in readAttachmentRecords
    c0010 ..> c0079 : 7 relationships (see list)
    c0010 ..> c0082 : 6 relationships (see list)
    c0010 ..> c0123 : 11 relationships (see list)
    c0010 ..> c0126 : 6 relationships (see list)
    c0010 ..> c0165 : executeConnection() calls execute()
    c0010 ..> c0186 : 5 relationships (see list)
    c0010 ..> c0218 : 2 relationships (see list)
    c0012 --> c0021 : field candidates
    c0013 --> c0021 : field kind
    c0019 --> c0021 : field candidate
    c0019 --> c0033 : field neighborhood
    c0019 --> c0077 : field evidenceEntries
    c0019 --> c0082 : field overlaps
    c0021 --> c0024 : field codeArtifacts
    c0021 --> c0030 : field documents
    c0021 --> c0032 : field entities
    c0021 --> c0037 : field relationships
    c0022 --> c0020 : field excludeBranches
    c0023 --> c0020 : field deferredBranches
    c0024 --|> c0153 : inherits
    c0025 --> c0016 : field action
    c0025 --> c0039 : field reuse
    c0026 --> c0005 : field linkReview
    c0026 --> c0016 : field action
    c0027 --> c0193 : field status
    c0028 --> c0026 : field candidates
    c0028 --> c0200 : field status
    c0029 --> c0027 : field conflicts
    c0029 --> c0028 : field jobs
    c0030 --|> c0154 : inherits
    c0032 --|> c0156 : inherits
    c0033 --> c0065 : field codeArtifacts
    c0033 --> c0069 : field documents
    c0033 --> c0072 : field entities
    c0033 --> c0074 : field relationships
    c0034 --> c0042 : field uncertainWrite
    c0034 --> c0205 : field supersession
    c0036 --|> c0193 : inherits
    c0037 --|> c0158 : inherits
    c0038 --> c0193 : field conflict
    c0040 ..> c0004 : activity() calls set()
    c0040 ..> c0005 : 3 relationships (see list)
    c0040 ..> c0010 : 5 relationships (see list)
    c0040 --> c0017 : field activityPhase
    c0040 ..> c0017 : type in activity
    c0040 ..> c0018 : 2 relationships (see list)
    c0040 ..> c0019 : type in validateEquivalentCandidate
    c0040 ..> c0020 : 3 relationships (see list)
    c0040 ..> c0021 : 32 relationships (see list)
    c0040 ..> c0022 : 3 relationships (see list)
    c0040 ..> c0023 : 10 relationships (see list)
    c0040 ..> c0025 : 9 relationships (see list)
    c0040 ..> c0029 : type in diagnostics
    c0040 ..> c0031 : 2 relationships (see list)
    c0040 ..> c0033 : 3 relationships (see list)
    c0040 ..> c0035 : 12 relationships (see list)
    c0040 ..> c0036 : 2 relationships (see list)
    c0040 ..> c0038 : 6 relationships (see list)
    c0040 ..> c0040 : 171 relationships (see list)
    c0040 --> c0041 : field onActivity
    c0040 ..> c0041 : type in constructor
    c0040 ..> c0042 : 3 relationships (see list)
    c0040 ..> c0043 : 3 relationships (see list)
    c0040 ..> c0044 : 2 relationships (see list)
    c0040 ..> c0045 : 7 relationships (see list)
    c0040 ..> c0046 : 6 relationships (see list)
    c0040 ..> c0048 : 87 relationships (see list)
    c0040 --> c0063 : field getMode
    c0040 ..> c0063 : 3 relationships (see list)
    c0040 ..> c0064 : 7 relationships (see list)
    c0040 ..> c0072 : 3 relationships (see list)
    c0040 ..> c0074 : type in neighborhoodRelationships
    c0040 --> c0079 : field client
    c0040 ..> c0079 : type in cancellableClient
    c0040 ..> c0080 : type in cancellableKnowledge
    c0040 --> c0082 : field readSavedMemory
    c0040 ..> c0082 : 14 relationships (see list)
    c0040 ..> c0083 : type in createMemory
    c0040 --> c0085 : field model
    c0040 ..> c0087 : type in sourceInspectionTool
    c0040 ..> c0097 : 4 relationships (see list)
    c0040 ..> c0123 : 38 relationships (see list)
    c0040 ..> c0125 : planConflictReplacement() calls ids()
    c0040 ..> c0126 : 30 relationships (see list)
    c0040 --> c0165 : field knowledgeWriter
    c0040 ..> c0165 : 2 relationships (see list)
    c0040 --> c0168 : field logger
    c0040 ..> c0170 : 13 relationships (see list)
    c0040 ..> c0172 : 4 relationships (see list)
    c0040 ..> c0176 : loadCandidates() calls prepareCapture()
    c0040 ..> c0186 : 15 relationships (see list)
    c0040 --> c0190 : field queue
    c0040 ..> c0190 : 62 relationships (see list)
    c0040 ..> c0193 : 15 relationships (see list)
    c0040 --> c0197 : field identity
    c0040 ..> c0198 : 37 relationships (see list)
    c0040 ..> c0205 : type in recordSupersession
    c0040 ..> c0218 : validateRevisionText() calls trim()
    c0040 ..> c0225 : planConflictReplacement() calls sanitizeCaptureConversation()
    c0040 ..> c0229 : 2 relationships (see list)
    c0041 --> c0017 : field onActivity
    c0041 --> c0063 : field getMode
    c0041 --> c0079 : field client
    c0041 --> c0085 : field model
    c0041 --> c0168 : field logger
    c0041 --> c0190 : field queue
    c0042 --|> c0035 : inherits
    c0043 --> c0077 : field selectedAdditionalEntries
    c0044 --> c0021 : field candidate
    c0044 --> c0082 : field oldMemory
    c0044 --> c0198 : field fakeJob
    c0046 --> c0077 : field additionalEntries
    c0048 ..> c0011 : 2 relationships (see list)
    c0048 ..> c0012 : type in parseCandidates
    c0048 ..> c0013 : 2 relationships (see list)
    c0048 ..> c0014 : 2 relationships (see list)
    c0048 ..> c0015 : 17 relationships (see list)
    c0048 ..> c0021 : 15 relationships (see list)
    c0048 ..> c0024 : type in codeArtifactResource
    c0048 ..> c0025 : 5 relationships (see list)
    c0048 ..> c0030 : type in documentResource
    c0048 ..> c0032 : type in entityResource
    c0048 ..> c0037 : type in relationshipResource
    c0048 ..> c0043 : type in conflictResolutionEvidence
    c0048 ..> c0045 : 10 relationships (see list)
    c0048 ..> c0047 : 2 relationships (see list)
    c0048 ..> c0048 : 94 relationships (see list)
    c0048 ..> c0064 : 14 relationships (see list)
    c0048 ..> c0073 : type in entityClassification
    c0048 ..> c0077 : 4 relationships (see list)
    c0048 ..> c0082 : type in captureKnowledgePlan
    c0048 ..> c0084 : type in memoryInput
    c0048 ..> c0090 : type in captureCandidateSubmission
    c0048 ..> c0097 : 3 relationships (see list)
    c0048 ..> c0126 : sourceEvidence() calls get()
    c0048 ..> c0161 : type in captureKnowledgePlan
    c0048 ..> c0172 : 2 relationships (see list)
    c0048 ..> c0186 : 16 relationships (see list)
    c0048 ..> c0218 : 7 relationships (see list)
    c0048 ..> c0225 : snapshotForPersistence() calls sanitizeCaptureSnapshot()
    c0050 --> c0051 : field instance
    c0050 --> c0054 : field model
    c0050 --> c0058 : field prompts
    c0050 --> c0059 : field scopeSource
    c0050 --> c0060 : field verbosity
    c0050 --> c0063 : field captureMode
    c0050 --> c0094 : field scope
    c0050 --> c0169 : field logging
    c0061 ..> c0050 : type in loadForgetfulConfig
    c0061 ..> c0052 : 2 relationships (see list)
    c0061 ..> c0053 : type in loadForgetfulConfig
    c0061 ..> c0054 : 2 relationships (see list)
    c0061 ..> c0056 : 2 relationships (see list)
    c0061 ..> c0058 : 2 relationships (see list)
    c0061 ..> c0059 : type in resolveScope
    c0061 ..> c0060 : 2 relationships (see list)
    c0061 ..> c0061 : 29 relationships (see list)
    c0061 ..> c0063 : type in resolveCaptureMode
    c0061 ..> c0094 : 2 relationships (see list)
    c0061 ..> c0151 : 2 relationships (see list)
    c0061 ..> c0169 : type in isFileLogLevel
    c0061 ..> c0170 : writeJson() calls close()
    c0061 ..> c0218 : 3 relationships (see list)
    c0064 --> c0062 : field historySummary
    c0064 --> c0063 : field mode
    c0064 --> c0077 : field entries
    c0064 --> c0094 : field scope
    c0064 --> c0097 : field context
    c0065 --|> c0066 : inherits
    c0066 --|> c0093 : inherits
    c0069 --|> c0070 : inherits
    c0070 --|> c0093 : inherits
    c0072 --|> c0073 : inherits
    c0073 --> c0076 : field entity_type
    c0073 --|> c0093 : inherits
    c0074 --|> c0075 : inherits
    c0075 --|> c0093 : inherits
    c0079 --> c0080 : field knowledge
    c0079 ..> c0082 : 2 relationships (see list)
    c0079 ..> c0083 : type in create
    c0079 ..> c0084 : type in create
    c0079 ..> c0086 : type in queryMemory
    c0079 ..> c0091 : 3 relationships (see list)
    c0079 ..> c0092 : type in createProject
    c0079 ..> c0095 : 2 relationships (see list)
    c0080 ..> c0065 : 3 relationships (see list)
    c0080 ..> c0066 : 2 relationships (see list)
    c0080 ..> c0067 : type in listCodeArtifacts
    c0080 ..> c0069 : 3 relationships (see list)
    c0080 ..> c0070 : 2 relationships (see list)
    c0080 ..> c0071 : type in listDocuments
    c0080 ..> c0072 : 4 relationships (see list)
    c0080 ..> c0073 : 2 relationships (see list)
    c0080 ..> c0074 : 2 relationships (see list)
    c0080 ..> c0075 : type in createRelationship
    c0080 ..> c0078 : type in listFiles
    c0080 ..> c0082 : type in updateMemory
    c0080 ..> c0084 : type in updateMemory
    c0080 ..> c0096 : type in getFile
    c0081 --> c0082 : field memory
    c0082 --|> c0084 : inherits
    c0085 ..> c0088 : 2 relationships (see list)
    c0086 --> c0081 : field linked_memories
    c0086 --> c0082 : field primary_memories
    c0088 --> c0068 : field onConversationCompacted
    c0088 --> c0087 : field readTools
    c0088 --> c0090 : field submission
    c0096 --|> c0078 : inherits
    c0097 --> c0091 : field project
    c0098 ..> c0098 : buildEncodePrompt() calls bundledSkillPaths()
    c0098 ..> c0151 : buildEncodePrompt() calls readFile()
    c0098 ..> c0218 : buildEncodePrompt() calls trim()
    c0102 --> c0099 : field outcome
    c0102 --> c0103 : field state
    c0104 ..> c0022 : type in checkpoint
    c0104 ..> c0023 : type in checkpoint
    c0104 ..> c0064 : type in enqueue
    c0104 ..> c0077 : type in resolveConflict
    c0107 --> c0091 : field projects
    c0107 --|> c0097 : inherits
    c0108 --> c0050 : 2 relationships (see list)
    c0108 --> c0079 : 4 relationships (see list)
    c0108 --> c0104 : 2 relationships (see list)
    c0108 --> c0107 : field resolveWorkContext
    c0108 --> c0116 : 2 relationships (see list)
    c0108 --> c0182 : 2 relationships (see list)
    c0109 --> c0053 : field config
    c0109 --> c0108 : field dependencies
    c0109 --> c0111 : field policies
    c0112 --> c0050 : field config
    c0112 --> c0079 : field client
    c0112 --> c0107 : field context
    c0112 --> c0116 : field recall
    c0112 --> c0170 : field logger
    c0112 --> c0182 : field model
    c0113 --> c0094 : field scope
    c0115 --> c0118 : field runtime
    c0115 --> c0212 : 2 relationships (see list)
    c0116 ..> c0077 : type in recall
    c0116 ..> c0209 : type in deeper
    c0116 ..> c0211 : type in recall
    c0116 ..> c0212 : 2 relationships (see list)
    c0117 --> c0094 : field scope
    c0118 --> c0004 : field activity
    c0118 --> c0020 : field captureDeferrals
    c0118 --> c0023 : 2 relationships (see list)
    c0118 --> c0050 : field config
    c0118 --> c0079 : field client
    c0118 --> c0103 : field pendingCaptureJobs
    c0118 --> c0104 : field capture
    c0118 --> c0107 : field context
    c0118 --> c0113 : field lastRecall
    c0118 --> c0116 : field recall
    c0118 --> c0170 : field logger
    c0118 --> c0182 : field model
    c0118 --> c0190 : field queue
    c0120 --> c0100 : field automaticRecalls
    c0120 --> c0110 : field pendingQueuedRecall
    c0120 --> c0115 : field recallJobs
    c0120 --> c0118 : 2 relationships (see list)
    c0121 ..> c0004 : 3 relationships (see list)
    c0121 ..> c0023 : 2 relationships (see list)
    c0121 ..> c0040 : 6 relationships (see list)
    c0121 ..> c0050 : 5 relationships (see list)
    c0121 ..> c0054 : type in parseSelection
    c0121 ..> c0060 : type in log
    c0121 ..> c0077 : 2 relationships (see list)
    c0121 ..> c0098 : createForgetfulExtension() calls bundledSkillPaths()
    c0121 ..> c0099 : 3 relationships (see list)
    c0121 ..> c0101 : type in boundedWait
    c0121 ..> c0102 : 3 relationships (see list)
    c0121 ..> c0104 : type in readCaptureOutcome
    c0121 ..> c0106 : type in collectDiagnosticParts
    c0121 ..> c0107 : 3 relationships (see list)
    c0121 ..> c0109 : type in createForgetfulExtension
    c0121 ..> c0111 : type in policyText
    c0121 ..> c0113 : type in recallActivitySummary
    c0121 ..> c0118 : 4 relationships (see list)
    c0121 ..> c0119 : type in promptSetupAuthentication
    c0121 ..> c0121 : 34 relationships (see list)
    c0121 ..> c0122 : createForgetfulExtension() calls registerForegroundTool()
    c0121 ..> c0126 : 5 relationships (see list)
    c0121 ..> c0185 : 3 relationships (see list)
    c0121 ..> c0186 : 15 relationships (see list)
    c0121 ..> c0212 : 5 relationships (see list)
    c0121 ..> c0218 : 9 relationships (see list)
    c0121 ..> c0219 : qualifiedRepository() calls repositoryName()
    c0123 ..> c0065 : 2 relationships (see list)
    c0123 ..> c0066 : 2 relationships (see list)
    c0123 ..> c0067 : type in listCodeArtifacts
    c0123 ..> c0069 : 2 relationships (see list)
    c0123 ..> c0070 : 2 relationships (see list)
    c0123 ..> c0071 : type in listDocuments
    c0123 ..> c0072 : 3 relationships (see list)
    c0123 ..> c0073 : 2 relationships (see list)
    c0123 ..> c0074 : type in getRelationships
    c0123 ..> c0075 : type in createRelationship
    c0123 ..> c0078 : type in listFiles
    c0123 ..|> c0080 : implements
    c0123 --> c0082 : field parseMemory
    c0123 ..> c0082 : type in constructor
    c0123 ..> c0084 : type in updateMemory
    c0123 ..> c0096 : type in getFile
    c0123 --> c0124 : field request
    c0123 ..> c0124 : type in constructor
    c0123 ..> c0125 : 56 relationships (see list)
    c0123 ..> c0126 : 21 relationships (see list)
    c0123 ..> c0130 : 5 relationships (see list)
    c0123 ..> c0132 : 2 relationships (see list)
    c0123 ..> c0218 : searchEntities() calls trim()
    c0125 ..> c0065 : type in artifact
    c0125 ..> c0066 : type in resourceBody
    c0125 ..> c0067 : type in summary
    c0125 ..> c0069 : type in document
    c0125 ..> c0070 : type in resourceBody
    c0125 ..> c0071 : type in summary
    c0125 ..> c0072 : type in entity
    c0125 ..> c0073 : type in entityBody
    c0125 ..> c0074 : type in relationship
    c0125 ..> c0075 : type in relationshipBody
    c0125 ..> c0078 : type in fileSummary
    c0125 ..> c0093 : type in provenance
    c0125 ..> c0125 : 41 relationships (see list)
    c0125 ..> c0130 : 8 relationships (see list)
    c0125 ..> c0218 : text() calls trim()
    c0126 ..> c0004 : 2 relationships (see list)
    c0126 ..> c0040 : readResponse() calls read()
    c0126 ..|> c0079 : implements
    c0126 ..> c0082 : 2 relationships (see list)
    c0126 ..> c0083 : type in create
    c0126 ..> c0084 : 2 relationships (see list)
    c0126 ..> c0086 : type in queryMemory
    c0126 ..> c0091 : 3 relationships (see list)
    c0126 ..> c0092 : type in createProject
    c0126 ..> c0095 : 2 relationships (see list)
    c0126 ..> c0125 : createBody() calls memoryMetadata()
    c0126 ..> c0126 : 22 relationships (see list)
    c0126 ..> c0127 : type in constructor
    c0126 ..> c0129 : throwResponseError() constructs ForgetfulHttpError
    c0126 ..> c0130 : 5 relationships (see list)
    c0126 ..> c0131 : request() constructs ForgetfulTimeoutError
    c0126 ..> c0132 : 21 relationships (see list)
    c0126 ..> c0190 : readResponse() calls cancel()
    c0126 ..> c0218 : supersede() calls trim()
    c0126 ..> c0219 : 2 relationships (see list)
    c0132 ..> c0004 : uniqueMemories() calls set()
    c0132 ..> c0081 : type in parseLinkedMemories
    c0132 ..> c0082 : 3 relationships (see list)
    c0132 ..> c0086 : 2 relationships (see list)
    c0132 ..> c0091 : type in parseProject
    c0132 ..> c0095 : 3 relationships (see list)
    c0132 ..> c0125 : parseMemory() calls memoryMetadata()
    c0132 ..> c0128 : 2 relationships (see list)
    c0132 ..> c0130 : 12 relationships (see list)
    c0132 ..> c0132 : 24 relationships (see list)
    c0132 ..> c0218 : projectText() calls trim()
    c0133 --> c0065 : field artifacts
    c0133 --> c0069 : field documents
    c0133 --> c0078 : field files
    c0134 --> c0082 : field memories
    c0134 --> c0094 : field scope
    c0136 ..> c0004 : 3 relationships (see list)
    c0136 ..> c0065 : type in appendArtifactLines
    c0136 ..> c0069 : type in appendDocumentLines
    c0136 ..> c0072 : 9 relationships (see list)
    c0136 ..> c0074 : 3 relationships (see list)
    c0136 ..> c0078 : type in appendFileLines
    c0136 --> c0080 : field client
    c0136 ..> c0080 : type in constructor
    c0136 ..> c0123 : 8 relationships (see list)
    c0136 ..> c0126 : formatRelationships() calls get()
    c0136 ..> c0133 : 2 relationships (see list)
    c0136 ..> c0134 : 8 relationships (see list)
    c0136 ..> c0135 : 3 relationships (see list)
    c0136 ..> c0136 : 17 relationships (see list)
    c0136 ..> c0137 : type in constructor
    c0136 ..> c0138 : 4 relationships (see list)
    c0136 --> c0139 : field readMemory
    c0136 ..> c0139 : type in constructor
    c0136 ..> c0140 : 4 relationships (see list)
    c0136 ..> c0141 : 21 relationships (see list)
    c0136 ..> c0218 : findEntities() calls trim()
    c0137 --> c0139 : field readMemory
    c0138 --> c0072 : field entity
    c0140 --> c0072 : 2 relationships (see list)
    c0140 --> c0074 : field relationship
    c0141 ..> c0072 : 2 relationships (see list)
    c0141 ..> c0074 : type in validRelationship
    c0141 ..> c0082 : type in validMemory
    c0141 ..> c0094 : 2 relationships (see list)
    c0141 ..> c0141 : 5 relationships (see list)
    c0141 ..> c0186 : clean() calls sanitizeText()
    c0141 ..> c0218 : validRelationship() calls trim()
    c0142 --> c0079 : field client
    c0142 --> c0080 : field knowledge
    c0142 --> c0143 : field request
    c0142 --> c0144 : field context
    c0144 --> c0094 : field scope
    c0145 --> c0096 : field file
    c0145 --> c0149 : field content
    c0145 --> c0150 : field content
    c0146 --> c0079 : field client
    c0146 --> c0080 : field knowledge
    c0146 --> c0144 : field context
    c0146 --> c0147 : field request
    c0151 ..> c0065 : type in page
    c0151 ..> c0069 : type in page
    c0151 ..> c0072 : 4 relationships (see list)
    c0151 ..> c0076 : type in isEntityType
    c0151 ..> c0079 : 7 relationships (see list)
    c0151 ..> c0080 : 9 relationships (see list)
    c0151 ..> c0082 : 4 relationships (see list)
    c0151 ..> c0093 : type in updateProvenance
    c0151 ..> c0096 : type in fileContent
    c0151 ..> c0123 : 28 relationships (see list)
    c0151 ..> c0126 : 10 relationships (see list)
    c0151 ..> c0142 : 15 relationships (see list)
    c0151 ..> c0143 : 2 relationships (see list)
    c0151 ..> c0144 : 13 relationships (see list)
    c0151 ..> c0145 : 29 relationships (see list)
    c0151 ..> c0146 : 9 relationships (see list)
    c0151 ..> c0147 : 2 relationships (see list)
    c0151 ..> c0148 : type in resolveWriteProject
    c0151 ..> c0149 : type in fileContent
    c0151 ..> c0150 : type in fileContent
    c0151 ..> c0151 : 184 relationships (see list)
    c0151 ..> c0172 : replacementMemory() calls replacementMemoryContext()
    c0151 ..> c0186 : containsSensitiveData() calls hasSensitiveData()
    c0151 ..> c0218 : 2 relationships (see list)
    c0153 --> c0066 : field input
    c0154 --> c0070 : field input
    c0156 --> c0073 : field input
    c0158 --> c0075 : field input
    c0161 --> c0153 : field codeArtifacts
    c0161 --> c0154 : field documents
    c0161 --> c0155 : field entityMemoryLinks
    c0161 --> c0156 : field entities
    c0161 --> c0158 : field relationships
    c0164 --> c0162 : 4 relationships (see list)
    c0165 ..> c0065 : 2 relationships (see list)
    c0165 ..> c0069 : 2 relationships (see list)
    c0165 ..> c0072 : 2 relationships (see list)
    c0165 ..> c0074 : type in writeRelationship
    c0165 ..> c0082 : 4 relationships (see list)
    c0165 ..> c0123 : 11 relationships (see list)
    c0165 ..> c0126 : createOnce() calls create()
    c0165 ..> c0136 : 2 relationships (see list)
    c0165 ..> c0152 : 4 relationships (see list)
    c0165 ..> c0153 : type in writeCodeArtifact
    c0165 ..> c0154 : type in writeDocument
    c0165 ..> c0155 : type in writeEntityMemoryLink
    c0165 ..> c0156 : type in writeEntity
    c0165 --> c0157 : field readMemory
    c0165 ..> c0157 : type in constructor
    c0165 ..> c0158 : type in writeRelationship
    c0165 ..> c0159 : type in execute
    c0165 ..> c0160 : 15 relationships (see list)
    c0165 ..> c0161 : 18 relationships (see list)
    c0165 ..> c0163 : 14 relationships (see list)
    c0165 ..> c0164 : 16 relationships (see list)
    c0165 ..> c0165 : 40 relationships (see list)
    c0165 --> c0166 : field client
    c0165 ..> c0166 : type in constructor
    c0165 ..> c0167 : 31 relationships (see list)
    c0165 ..> c0218 : validatePlan() calls trim()
    c0167 ..> c0161 : type in instructionId
    c0167 ..> c0162 : 4 relationships (see list)
    c0167 ..> c0164 : 2 relationships (see list)
    c0167 ..> c0167 : 6 relationships (see list)
    c0170 ..> c0040 : flush() calls resolve()
    c0170 ..|> c0168 : implements
    c0170 --> c0169 : 2 relationships (see list)
    c0170 ..> c0169 : 2 relationships (see list)
    c0170 ..> c0170 : 6 relationships (see list)
    c0170 ..> c0171 : 3 relationships (see list)
    c0170 ..> c0186 : enqueue() calls sanitizeValue()
    c0171 ..> c0171 : 2 relationships (see list)
    c0172 ..> c0084 : type in replacementMemoryInput
    c0172 ..> c0172 : 2 relationships (see list)
    c0172 ..> c0186 : storedMemoryContext() calls sanitizeText()
    c0172 ..> c0218 : replacementMemoryContext() calls trim()
    c0175 --> c0177 : field complete
    c0176 ..> c0040 : applySummary() calls now()
    c0176 --> c0173 : field compactedHistory
    c0176 ..> c0173 : 5 relationships (see list)
    c0176 ..> c0176 : 6 relationships (see list)
    c0176 ..> c0177 : 3 relationships (see list)
    c0176 ..> c0178 : 9 relationships (see list)
    c0176 ..> c0218 : applySummary() calls trim()
    c0178 ..> c0040 : summarizeMemoryHistory() calls now()
    c0178 ..> c0174 : 2 relationships (see list)
    c0178 ..> c0175 : type in summarizeMemoryHistory
    c0178 ..> c0178 : 17 relationships (see list)
    c0178 ..> c0182 : summarizeMemoryHistory() calls complete()
    c0178 ..> c0186 : 2 relationships (see list)
    c0180 --> c0181 : field modelRegistry
    c0182 ..> c0040 : 6 relationships (see list)
    c0182 ..> c0049 : completeWithSubmission() calls mapConcurrent()
    c0182 --> c0054 : field selection
    c0182 ..> c0054 : type in constructor
    c0182 ..> c0061 : completeRequest() calls isRecallConcurrency()
    c0182 ..|> c0085 : implements
    c0182 ..> c0087 : type in executeRead
    c0182 ..> c0088 : 7 relationships (see list)
    c0182 ..> c0089 : completeWithSubmission() constructs ModelSubmissionError
    c0182 ..> c0090 : type in validateSubmission
    c0182 ..> c0165 : executeRead() calls execute()
    c0182 --> c0168 : field logger
    c0182 ..> c0170 : 5 relationships (see list)
    c0182 ..> c0176 : 3 relationships (see list)
    c0182 ..> c0178 : completeRequest() calls evidenceMessage()
    c0182 --> c0179 : field transformHeaders
    c0182 --> c0181 : field registry
    c0182 ..> c0181 : type in constructor
    c0182 ..> c0182 : 7 relationships (see list)
    c0182 ..> c0183 : type in constructor
    c0182 ..> c0184 : 3 relationships (see list)
    c0182 ..> c0185 : 24 relationships (see list)
    c0182 ..> c0186 : 2 relationships (see list)
    c0183 --> c0168 : field logger
    c0183 --> c0179 : field transformHeaders
    c0185 ..> c0040 : 2 relationships (see list)
    c0185 ..> c0054 : 3 relationships (see list)
    c0185 ..> c0087 : type in submissionTool
    c0185 ..> c0088 : 4 relationships (see list)
    c0185 ..> c0090 : type in submissionTool
    c0185 ..> c0179 : type in requestOptions
    c0185 ..> c0180 : type in availableMemoryModels
    c0185 ..> c0181 : type in resolveMemoryModel
    c0185 ..> c0182 : 3 relationships (see list)
    c0185 ..> c0183 : type in resolveMemoryModel
    c0185 ..> c0184 : type in requestDeadline
    c0185 ..> c0185 : 7 relationships (see list)
    c0185 ..> c0186 : 8 relationships (see list)
    c0186 ..> c0186 : 2 relationships (see list)
    c0189 ..> c0079 : 3 relationships (see list)
    c0189 ..> c0091 : 4 relationships (see list)
    c0189 ..> c0092 : 2 relationships (see list)
    c0189 ..> c0121 : promptExistingProject() calls notify()
    c0189 ..> c0126 : 7 relationships (see list)
    c0189 ..> c0186 : 2 relationships (see list)
    c0189 ..> c0187 : 2 relationships (see list)
    c0189 ..> c0188 : 6 relationships (see list)
    c0189 ..> c0189 : 5 relationships (see list)
    c0189 ..> c0218 : 3 relationships (see list)
    c0190 ..> c0004 : mutate() calls set()
    c0190 ..> c0064 : 3 relationships (see list)
    c0190 ..> c0068 : type in compactJobSnapshot
    c0190 ..> c0077 : type in appendInspections
    c0190 ..> c0091 : type in completeProjectDiscovery
    c0190 ..> c0097 : 2 relationships (see list)
    c0190 ..> c0126 : 2 relationships (see list)
    c0190 ..> c0151 : 4 relationships (see list)
    c0190 ..> c0186 : 4 relationships (see list)
    c0190 ..> c0190 : 87 relationships (see list)
    c0190 ..> c0191 : type in constructor
    c0190 ..> c0192 : 2 relationships (see list)
    c0190 ..> c0193 : 5 relationships (see list)
    c0190 ..> c0194 : 3 relationships (see list)
    c0190 ..> c0195 : 2 relationships (see list)
    c0190 ..> c0196 : 2 relationships (see list)
    c0190 ..> c0197 : 9 relationships (see list)
    c0190 ..> c0198 : 10 relationships (see list)
    c0190 ..> c0199 : type in listJobMetadata
    c0190 ..> c0201 : 9 relationships (see list)
    c0190 ..> c0202 : 4 relationships (see list)
    c0190 ..> c0203 : 2 relationships (see list)
    c0190 ..> c0204 : 6 relationships (see list)
    c0190 ..> c0206 : 2 relationships (see list)
    c0190 ..> c0207 : 56 relationships (see list)
    c0190 ..> c0225 : 4 relationships (see list)
    c0193 --> c0077 : field replacement
    c0193 --> c0084 : field replacement
    c0193 --> c0097 : field context
    c0193 --> c0197 : field binding
    c0193 --> c0205 : field supersession
    c0195 --> c0068 : field compactedConversation
    c0195 --> c0077 : field inspectionEntries
    c0195 --> c0200 : field status
    c0195 --> c0205 : field supersession
    c0198 --> c0064 : field snapshot
    c0198 --> c0197 : field binding
    c0198 --> c0200 : field status
    c0198 --> c0205 : field supersession
    c0199 --> c0064 : field snapshot
    c0201 --> c0193 : field conflicts
    c0201 --> c0202 : field watermarks
    c0201 --> c0204 : field jobs
    c0204 --|> c0198 : inherits
    c0207 ..> c0064 : 3 relationships (see list)
    c0207 ..> c0077 : type in validateInspectionEntry
    c0207 ..> c0126 : releaseCompletedArtifacts() calls get()
    c0207 ..> c0186 : 2 relationships (see list)
    c0207 ..> c0190 : nowIso() calls now()
    c0207 ..> c0193 : type in conflictIdentityMatches
    c0207 ..> c0197 : 2 relationships (see list)
    c0207 ..> c0198 : 2 relationships (see list)
    c0207 ..> c0201 : type in normaliseState
    c0207 ..> c0202 : type in clearHistoryCache
    c0207 ..> c0204 : type in releaseCompletedArtifacts
    c0207 ..> c0207 : 5 relationships (see list)
    c0209 --> c0091 : field projects
    c0209 --> c0094 : field scope
    c0209 --> c0097 : field context
    c0211 --> c0077 : field sessionContext
    c0211 --> c0088 : field diagnosticContext
    c0211 --> c0091 : field projects
    c0211 --> c0094 : field scope
    c0211 --> c0097 : field context
    c0211 --> c0210 : field onPlan
    c0212 --> c0094 : field scope
    c0213 ..> c0049 : searchMemories() calls mapConcurrent()
    c0213 ..> c0061 : 3 relationships (see list)
    c0213 --> c0079 : field client
    c0213 ..> c0079 : type in constructor
    c0213 ..> c0082 : 2 relationships (see list)
    c0213 --> c0085 : field model
    c0213 ..> c0085 : type in constructor
    c0213 ..> c0087 : type in recallReadTool
    c0213 ..> c0091 : 2 relationships (see list)
    c0213 ..> c0094 : 7 relationships (see list)
    c0213 ..> c0095 : type in searchRequest
    c0213 ..> c0097 : 3 relationships (see list)
    c0213 ..> c0126 : 3 relationships (see list)
    c0213 ..> c0135 : 2 relationships (see list)
    c0213 --> c0136 : field knowledge
    c0213 ..> c0136 : 2 relationships (see list)
    c0213 ..> c0151 : recallReadTool() calls executeKnowledgeRead()
    c0213 ..> c0182 : recall() calls complete()
    c0213 ..> c0186 : 7 relationships (see list)
    c0213 ..> c0208 : 4 relationships (see list)
    c0213 ..> c0209 : type in deeper
    c0213 ..> c0210 : 5 relationships (see list)
    c0213 ..> c0211 : 7 relationships (see list)
    c0213 ..> c0212 : 7 relationships (see list)
    c0213 ..> c0213 : 34 relationships (see list)
    c0213 ..> c0214 : type in constructor
    c0213 ..> c0215 : finishReview() constructs ReviewValidationError
    c0213 ..> c0216 : 6 relationships (see list)
    c0213 ..> c0217 : type in searchMemories
    c0213 ..> c0218 : 35 relationships (see list)
    c0216 --> c0091 : field project
    c0217 --> c0082 : field memories
    c0218 ..> c0004 : availableProjects() calls set()
    c0218 ..> c0082 : 2 relationships (see list)
    c0218 ..> c0090 : type in recallReviewSubmission
    c0218 ..> c0091 : type in availableProjects
    c0218 ..> c0097 : 3 relationships (see list)
    c0218 ..> c0135 : type in formatRecall
    c0218 ..> c0186 : 11 relationships (see list)
    c0218 ..> c0208 : 2 relationships (see list)
    c0218 ..> c0210 : type in parsePlan
    c0218 ..> c0212 : 4 relationships (see list)
    c0218 ..> c0213 : createDeadlineSignal() calls now()
    c0218 ..> c0218 : 26 relationships (see list)
    c0219 ..> c0218 : repositoryName() calls trim()
    c0220 --|> c0064 : inherits
    c0222 --> c0063 : field mode
    c0222 --> c0094 : field scope
    c0222 --> c0097 : field context
    c0222 --> c0224 : field session
    c0223 --> c0220 : field snapshot
    c0225 ..> c0062 : 2 relationships (see list)
    c0225 ..> c0064 : 3 relationships (see list)
    c0225 ..> c0068 : type in compactCaptureSnapshot
    c0225 ..> c0077 : 3 relationships (see list)
    c0225 ..> c0186 : 9 relationships (see list)
    c0225 ..> c0218 : 2 relationships (see list)
    c0225 ..> c0221 : 3 relationships (see list)
    c0225 ..> c0222 : 3 relationships (see list)
    c0225 ..> c0223 : type in buildCaptureSnapshot
    c0225 ..> c0225 : 25 relationships (see list)
    c0228 --> c0226 : 2 relationships (see list)
    c0229 ..> c0004 : readFile() calls close()
    c0229 ..> c0040 : 3 relationships (see list)
    c0229 ..> c0126 : getUrl() calls get()
    c0229 ..> c0151 : readFile() calls readFile()
    c0229 ..> c0165 : git() calls execute()
    c0229 ..> c0186 : 3 relationships (see list)
    c0229 ..> c0218 : provenance() calls trim()
    c0229 ..> c0227 : type in inspectUrl
    c0229 ..> c0228 : 2 relationships (see list)
    c0229 ..> c0229 : 10 relationships (see list)
    c0229 --> c0230 : field options
    c0229 ..> c0230 : type in constructor
    c0229 ..> c0231 : 11 relationships (see list)
    c0231 ..> c0186 : 4 relationships (see list)
    c0231 ..> c0226 : type in errorDetails
    c0231 ..> c0227 : type in sourceContent
    c0231 ..> c0229 : validateAddress() calls check()
    c0231 ..> c0231 : validateAddress() calls loopback()
```

## Source index

- c0000: `index.ts` — `index.ts`:1
- c0003: `ActivityLoader` — `src/activity.ts`:6
- c0004: `ForgetfulActivity` — `src/activity.ts`:35
- c0005: `CaptureLinkReview` — `src/capture-links.ts`:37
- c0006: `ConnectionResult` — `src/capture-links.ts`:55
- c0007: `LinkDecision` — `src/capture-links.ts`:9
- c0008: `PreservationDecision` — `src/capture-links.ts`:19
- c0009: `PreviousConnections` — `src/capture-links.ts`:27
- c0010: `src/capture-links.ts` — `src/capture-links.ts`:1
- c0011: `CandidateDestination` — `src/capture.ts`:906
- c0012: `CandidateExtraction` — `src/capture.ts`:1374
- c0013: `CandidateFields` — `src/capture.ts`:773
- c0014: `CandidateLists` — `src/capture.ts`:781
- c0015: `CandidateValidation` — `src/capture.ts`:787
- c0016: `CaptureAction` — `src/capture.ts`:70
- c0017: `CaptureActivityPhase` — `src/capture.ts`:151
- c0018: `CaptureAdvanceInput` — `src/capture.ts`:295
- c0019: `CaptureBatchInput` — `src/capture.ts`:126
- c0020: `CaptureBranch` — `src/capture.ts`:177
- c0021: `CaptureCandidate` — `src/capture.ts`:72
- c0022: `CaptureCheckpointOptions` — `src/capture.ts`:182
- c0023: `CaptureCheckpointResult` — `src/capture.ts`:188
- c0024: `CaptureCodeArtifactResource` — `src/capture.ts`:103
- c0025: `CaptureDecision` — `src/capture.ts`:134
- c0026: `CaptureDiagnosticCandidate` — `src/capture.ts`:201
- c0027: `CaptureDiagnosticConflict` — `src/capture.ts`:228
- c0028: `CaptureDiagnosticJob` — `src/capture.ts`:216
- c0029: `CaptureDiagnostics` — `src/capture.ts`:239
- c0030: `CaptureDocumentResource` — `src/capture.ts`:99
- c0031: `CaptureEnqueueResult` — `src/capture.ts`:244
- c0032: `CaptureEntityResource` — `src/capture.ts`:95
- c0033: `CaptureNeighborhood` — `src/capture.ts`:118
- c0034: `CaptureOperation` — `src/capture.ts`:327
- c0035: `CapturePause` — `src/capture.ts`:303
- c0036: `CapturePendingConflict` — `src/capture.ts`:290
- c0037: `CaptureRelationshipResource` — `src/capture.ts`:107
- c0038: `CaptureResolveResult` — `src/capture.ts`:284
- c0039: `CaptureResourceReuse` — `src/capture.ts`:111
- c0040: `CaptureService` — `src/capture.ts`:1766
- c0041: `CaptureServiceOptions` — `src/capture.ts`:153
- c0042: `CaptureUncertainWrite` — `src/capture.ts`:317
- c0043: `ConflictResolutionEvidence` — `src/capture.ts`:250
- c0044: `ConflictResolutionTarget` — `src/capture.ts`:267
- c0045: `InvalidCaptureOutput` — `src/capture.ts`:310
- c0046: `ResolveConflictInput` — `src/capture.ts`:273
- c0047: `RichResources` — `src/capture.ts`:1214
- c0048: `src/capture.ts` — `src/capture.ts`:1
- c0049: `src/concurrency.ts` — `src/concurrency.ts`:1
- c0050: `ForgetfulConfig` — `src/config.ts`:77
- c0051: `ForgetfulInstanceConfig` — `src/config.ts`:64
- c0052: `JsonReadResult` — `src/config.ts`:129
- c0053: `LoadConfigOptions` — `src/config.ts`:97
- c0054: `ModelSelection` — `src/config.ts`:59
- c0055: `PersistedProjectSettings` — `src/config.ts`:125
- c0056: `PersistedUserSettings` — `src/config.ts`:108
- c0057: `PromptName` — `src/config.ts`:39
- c0058: `PromptOverlays` — `src/config.ts`:71
- c0059: `ScopeSource` — `src/config.ts`:38
- c0060: `Verbosity` — `src/config.ts`:44
- c0061: `src/config.ts` — `src/config.ts`:1
- c0062: `CaptureHistorySummary` — `src/contracts.ts`:292
- c0063: `CaptureMode` — `src/contracts.ts`:2
- c0064: `CaptureSnapshot` — `src/contracts.ts`:303
- c0065: `CodeArtifact` — `src/contracts.ts`:93
- c0066: `CodeArtifactInput` — `src/contracts.ts`:84
- c0067: `CodeArtifactSummary` — `src/contracts.ts`:98
- c0068: `CompactedConversation` — `src/contracts.ts`:297
- c0069: `Document` — `src/contracts.ts`:77
- c0070: `DocumentInput` — `src/contracts.ts`:68
- c0071: `DocumentSummary` — `src/contracts.ts`:82
- c0072: `Entity` — `src/contracts.ts`:53
- c0073: `EntityInput` — `src/contracts.ts`:43
- c0074: `EntityRelationship` — `src/contracts.ts`:64
- c0075: `EntityRelationshipInput` — `src/contracts.ts`:58
- c0076: `EntityType` — `src/contracts.ts`:41
- c0077: `EvidenceEntry` — `src/contracts.ts`:282
- c0078: `FileSummary` — `src/contracts.ts`:100
- c0079: `ForgetfulClient` — `src/contracts.ts`:187
- c0080: `KnowledgeClient` — `src/contracts.ts`:115
- c0081: `LinkedMemory` — `src/contracts.ts`:155
- c0082: `Memory` — `src/contracts.ts`:145
- c0083: `MemoryCreateResult` — `src/contracts.ts`:181
- c0084: `MemoryInput` — `src/contracts.ts`:17
- c0085: `MemoryModelClient` — `src/contracts.ts`:266
- c0086: `MemorySearchResult` — `src/contracts.ts`:161
- c0087: `ModelReadTool` — `src/contracts.ts`:239
- c0088: `ModelRequest` — `src/contracts.ts`:210
- c0089: `ModelSubmissionError` — `src/contracts.ts`:255
- c0090: `ModelSubmissionTool` — `src/contracts.ts`:246
- c0091: `Project` — `src/contracts.ts`:4
- c0092: `ProjectInput` — `src/contracts.ts`:11
- c0093: `Provenance` — `src/contracts.ts`:34
- c0094: `Scope` — `src/contracts.ts`:1
- c0095: `SearchRequest` — `src/contracts.ts`:170
- c0096: `StoredFile` — `src/contracts.ts`:110
- c0097: `WorkContext` — `src/contracts.ts`:272
- c0098: `src/encode.ts` — `src/encode.ts`:1
- c0099: `AutomaticCaptureJobOutcome` — `src/extension.ts`:1131
- c0100: `AutomaticRecall` — `src/extension.ts`:443
- c0101: `BoundedWaitOutcome` — `src/extension.ts`:145
- c0102: `CaptureFeedbackItem` — `src/extension.ts`:1238
- c0103: `CaptureFeedbackState` — `src/extension.ts`:1110
- c0104: `CaptureServicePort` — `src/extension.ts`:296
- c0105: `DiagnosticCandidate` — `src/extension.ts`:967
- c0106: `DiagnosticParts` — `src/extension.ts`:980
- c0107: `ExtensionWorkContext` — `src/extension.ts`:330
- c0108: `ForgetfulExtensionDependencies` — `src/extension.ts`:334
- c0109: `ForgetfulExtensionOptions` — `src/extension.ts`:359
- c0110: `PendingQueuedRecall` — `src/extension.ts`:399
- c0111: `PolicyName` — `src/extension.ts`:281
- c0112: `PreparedRuntime` — `src/extension.ts`:456
- c0113: `RecallActivity` — `src/extension.ts`:401
- c0114: `RecallContextMessage` — `src/extension.ts`:374
- c0115: `RecallJob` — `src/extension.ts`:381
- c0116: `RecallServicePort` — `src/extension.ts`:289
- c0117: `RecallToolDetails` — `src/extension.ts`:283
- c0118: `Runtime` — `src/extension.ts`:407
- c0119: `SetupAuthentication` — `src/extension.ts`:231
- c0120: `State` — `src/extension.ts`:445
- c0121: `src/extension.ts` — `src/extension.ts`:1
- c0122: `src/foreground-tools.ts` — `src/foreground-tools.ts`:1
- c0123: `ApiKnowledgeClient` — `src/http-knowledge.ts`:192
- c0124: `KnowledgeRequest` — `src/http-knowledge.ts`:9
- c0125: `src/http-knowledge.ts` — `src/http-knowledge.ts`:1
- c0126: `ApiForgetfulClient` — `src/http.ts`:441
- c0127: `ApiForgetfulClientOptions` — `src/http.ts`:25
- c0128: `ForgetfulAbortError` — `src/http.ts`:59
- c0129: `ForgetfulHttpError` — `src/http.ts`:33
- c0130: `ForgetfulSchemaError` — `src/http.ts`:45
- c0131: `ForgetfulTimeoutError` — `src/http.ts`:52
- c0132: `src/http.ts` — `src/http.ts`:1
- c0133: `Attachments` — `src/knowledge-read.ts`:45
- c0134: `KnowledgeExpansionRequest` — `src/knowledge-read.ts`:19
- c0135: `KnowledgeExpansionResult` — `src/knowledge-read.ts`:27
- c0136: `KnowledgeReadService` — `src/knowledge-read.ts`:143
- c0137: `KnowledgeReadServiceOptions` — `src/knowledge-read.ts`:57
- c0138: `LinkedMemoryExpansion` — `src/knowledge-read.ts`:43
- c0139: `MemoryReader` — `src/knowledge-read.ts`:52
- c0140: `RelationshipExpansion` — `src/knowledge-read.ts`:37
- c0141: `src/knowledge-read.ts` — `src/knowledge-read.ts`:1
- c0142: `KnowledgeReadContext` — `src/knowledge-tools.ts`:676
- c0143: `KnowledgeReadRequest` — `src/knowledge-tools.ts`:185
- c0144: `KnowledgeToolContext` — `src/knowledge-tools.ts`:23
- c0145: `KnowledgeToolResult` — `src/knowledge-tools.ts`:33
- c0146: `KnowledgeWriteContext` — `src/knowledge-tools.ts`:1318
- c0147: `KnowledgeWriteRequest` — `src/knowledge-tools.ts`:186
- c0148: `ResolvedWriteProject` — `src/knowledge-tools.ts`:491
- c0149: `ToolImage` — `src/knowledge-tools.ts`:32
- c0150: `ToolText` — `src/knowledge-tools.ts`:31
- c0151: `src/knowledge-tools.ts` — `src/knowledge-tools.ts`:1
- c0152: `KnowledgeAttachmentIds` — `src/knowledge-write.ts`:110
- c0153: `KnowledgeCodeArtifactPlan` — `src/knowledge-write.ts`:43
- c0154: `KnowledgeDocumentPlan` — `src/knowledge-write.ts`:37
- c0155: `KnowledgeEntityMemoryLinkPlan` — `src/knowledge-write.ts`:57
- c0156: `KnowledgeEntityPlan` — `src/knowledge-write.ts`:31
- c0157: `KnowledgeMemoryReader` — `src/knowledge-write.ts`:103
- c0158: `KnowledgeRelationshipPlan` — `src/knowledge-write.ts`:49
- c0159: `KnowledgeWriteCheckpoint` — `src/knowledge-write.ts`:97
- c0160: `KnowledgeWriteGuard` — `src/knowledge-write.ts`:101
- c0161: `KnowledgeWritePlan` — `src/knowledge-write.ts`:61
- c0162: `KnowledgeWriteReceipt` — `src/knowledge-write.ts`:78
- c0163: `KnowledgeWriteSave` — `src/knowledge-write.ts`:108
- c0164: `KnowledgeWriteState` — `src/knowledge-write.ts`:83
- c0165: `KnowledgeWriter` — `src/knowledge-write.ts`:238
- c0166: `WriteClient` — `src/knowledge-write.ts`:16
- c0167: `src/knowledge-write.ts` — `src/knowledge-write.ts`:1
- c0168: `DiagnosticLogger` — `src/logging.ts`:83
- c0169: `FileLogLevel` — `src/logging.ts`:81
- c0170: `FileLogger` — `src/logging.ts`:97
- c0171: `src/logging.ts` — `src/logging.ts`:1
- c0172: `src/memory-context.ts` — `src/memory-context.ts`:1
- c0173: `CompactedMemoryHistory` — `src/model-context.ts`:224
- c0174: `ContextWindowError` — `src/model-context.ts`:28
- c0175: `MemoryHistorySummaryOptions` — `src/model-context.ts`:360
- c0176: `MemoryTaskContext` — `src/model-context.ts`:231
- c0177: `SummaryCompletion` — `src/model-context.ts`:23
- c0178: `src/model-context.ts` — `src/model-context.ts`:1
- c0179: `MemoryModelHeaderTransform` — `src/model.ts`:42
- c0180: `ModelPickerContext` — `src/model.ts`:46
- c0181: `ModelRegistryPort` — `src/model.ts`:33
- c0182: `PiMemoryModel` — `src/model.ts`:304
- c0183: `PiMemoryModelOptions` — `src/model.ts`:56
- c0184: `RequestDeadline` — `src/model.ts`:237
- c0185: `src/model.ts` — `src/model.ts`:1
- c0186: `src/privacy.ts` — `src/privacy.ts`:1
- c0187: `AgentProjectInitInput` — `src/project-init.ts`:8
- c0188: `ProjectInitError` — `src/project-init.ts`:6
- c0189: `src/project-init.ts` — `src/project-init.ts`:1
- c0190: `DurableQueueStore` — `src/queue.ts`:475
- c0191: `DurableQueueStoreOptions` — `src/queue.ts`:180
- c0192: `FileLock` — `src/queue.ts`:209
- c0193: `PendingConflict` — `src/queue.ts`:92
- c0194: `QueueBusyError` — `src/queue.ts`:214
- c0195: `QueueCheckpoint` — `src/queue.ts`:166
- c0196: `QueueEnqueueResult` — `src/queue.ts`:150
- c0197: `QueueIdentity` — `src/queue.ts`:36
- c0198: `QueueJob` — `src/queue.ts`:61
- c0199: `QueueJobMetadata` — `src/queue.ts`:88
- c0200: `QueueJobStatus` — `src/queue.ts`:29
- c0201: `QueueState` — `src/queue.ts`:202
- c0202: `QueueWatermark` — `src/queue.ts`:42
- c0203: `SnapshotPayload` — `src/queue.ts`:199
- c0204: `StoredQueueJob` — `src/queue.ts`:194
- c0205: `SupersessionReceipt` — `src/queue.ts`:82
- c0206: `WatermarkAdvance` — `src/queue.ts`:157
- c0207: `src/queue.ts` — `src/queue.ts`:1
- c0208: `DeadlineSignal` — `src/recall.ts`:203
- c0209: `DeeperRecallRequest` — `src/recall.ts`:150
- c0210: `RecallPlan` — `src/recall.ts`:185
- c0211: `RecallRequest` — `src/recall.ts`:133
- c0212: `RecallResult` — `src/recall.ts`:159
- c0213: `RecallService` — `src/recall.ts`:670
- c0214: `RecallServiceOptions` — `src/recall.ts`:195
- c0215: `ReviewValidationError` — `src/recall.ts`:608
- c0216: `ScopeResolution` — `src/recall.ts`:212
- c0217: `SearchOutcome` — `src/recall.ts`:218
- c0218: `src/recall.ts` — `src/recall.ts`:1
- c0219: `src/repository.ts` — `src/repository.ts`:1
- c0220: `CaptureSnapshotWithStatus` — `src/snapshot.ts`:39
- c0221: `MessageRecord` — `src/snapshot.ts`:47
- c0222: `SnapshotOptions` — `src/snapshot.ts`:20
- c0223: `SnapshotResult` — `src/snapshot.ts`:43
- c0224: `SnapshotSessionReader` — `src/snapshot.ts`:14
- c0225: `src/snapshot.ts` — `src/snapshot.ts`:1
- c0226: `SourceInspectionError` — `src/source-inspection.ts`:37
- c0227: `SourceInspectionRequest` — `src/source-inspection.ts`:33
- c0228: `SourceInspectionResult` — `src/source-inspection.ts`:43
- c0229: `SourceInspector` — `src/source-inspection.ts`:149
- c0230: `SourceInspectorOptions` — `src/source-inspection.ts`:15
- c0231: `src/source-inspection.ts` — `src/source-inspection.ts`:1

## Relationships

- c0000 ..> c0121: `defaultExtension() calls createForgetfulExtension()`
- c0003 ..> c0004: `setLabel() calls refresh()`
- c0003 ..> c0040: `dispose() calls stop()`
- c0004 --> c0003: `field loader`
- c0004 ..> c0003: `close() calls dispose()`
- c0004 ..> c0003: `refresh() calls dispose()`
- c0004 ..> c0003: `refresh() calls setLabel()`
- c0004 ..> c0003: `refresh() constructs ActivityLoader`
- c0004 ..> c0004: `constructor() calls refresh()`
- c0004 ..> c0004: `notice() calls refresh()`
- c0004 ..> c0004: `set() calls refresh()`
- c0004 ..> c0040: `refresh() calls now()`
- c0005 --> c0006: `field executionResults`
- c0005 --> c0006: `field previousResults`
- c0005 --> c0007: `field decisions`
- c0005 --> c0008: `field preservation`
- c0005 --> c0009: `field previous`
- c0005 --> c0065: `field resources`
- c0005 --> c0069: `field resources`
- c0005 --> c0082: `field memories`
- c0005 --> c0082: `field memory`
- c0009 --> c0065: `field codeArtifacts`
- c0009 --> c0069: `field documents`
- c0009 --> c0072: `field entities`
- c0009 --> c0082: `field memory`
- c0010 ..> c0004: `validateLinkDecisions() calls set()`
- c0010 ..> c0004: `validateLinkReviews() calls set()`
- c0010 ..> c0005: `type in applyLinkReview`
- c0010 ..> c0005: `type in executeConnection`
- c0010 ..> c0005: `type in finishLinkExecution`
- c0010 ..> c0005: `type in prepareLinkReview`
- c0010 ..> c0005: `type in preserveConnections`
- c0010 ..> c0005: `type in readSelectedMemory`
- c0010 ..> c0005: `type in validateLinkDecisions`
- c0010 ..> c0005: `type in validateLinkReviews`
- c0010 ..> c0005: `type in validatePreservation`
- c0010 ..> c0006: `type in executeConnection`
- c0010 ..> c0007: `type in validateLinkDecisions`
- c0010 ..> c0007: `type in validateLinkReviews`
- c0010 ..> c0007: `type in wantsEdge`
- c0010 ..> c0008: `type in validateLinkReviews`
- c0010 ..> c0008: `type in validatePreservation`
- c0010 ..> c0009: `type in preparePreviousConnections`
- c0010 ..> c0010: `applyLinkReview() calls authorizedMemory()`
- c0010 ..> c0010: `applyLinkReview() calls executeConnection()`
- c0010 ..> c0010: `applyLinkReview() calls finishLinkExecution()`
- c0010 ..> c0010: `authorizedMemory() calls exclusiveMemory()`
- c0010 ..> c0010: `executeConnection() calls operationError()`
- c0010 ..> c0010: `prepareLinkReview() calls exclusiveMemory()`
- c0010 ..> c0010: `prepareLinkReview() calls readAttachmentRecords()`
- c0010 ..> c0010: `prepareLinkReview() calls readSelectedMemory()`
- c0010 ..> c0010: `preserveConnections() calls authorizedMemory()`
- c0010 ..> c0010: `preserveConnections() calls executeConnection()`
- c0010 ..> c0010: `validateLinkDecisions() calls wantsEdge()`
- c0010 ..> c0010: `validateLinkReviews() calls validateLinkDecisions()`
- c0010 ..> c0010: `validateLinkReviews() calls validatePreservation()`
- c0010 ..> c0065: `type in readAttachmentRecords`
- c0010 ..> c0069: `type in readAttachmentRecords`
- c0010 ..> c0079: `type in applyLinkReview`
- c0010 ..> c0079: `type in authorizedMemory`
- c0010 ..> c0079: `type in prepareLinkReview`
- c0010 ..> c0079: `type in preparePreviousConnections`
- c0010 ..> c0079: `type in preserveConnections`
- c0010 ..> c0079: `type in readAttachmentRecords`
- c0010 ..> c0079: `type in readSelectedMemory`
- c0010 ..> c0082: `type in authorizedMemory`
- c0010 ..> c0082: `type in exclusiveMemory`
- c0010 ..> c0082: `type in prepareLinkReview`
- c0010 ..> c0082: `type in preparePreviousConnections`
- c0010 ..> c0082: `type in readAttachmentRecords`
- c0010 ..> c0082: `type in readSelectedMemory`
- c0010 ..> c0123: `applyLinkReview() calls linkMemories()`
- c0010 ..> c0123: `preparePreviousConnections() calls getCodeArtifact()`
- c0010 ..> c0123: `preparePreviousConnections() calls getDocument()`
- c0010 ..> c0123: `preparePreviousConnections() calls getEntity()`
- c0010 ..> c0123: `preserveConnections() calls getCodeArtifact()`
- c0010 ..> c0123: `preserveConnections() calls getDocument()`
- c0010 ..> c0123: `preserveConnections() calls getEntity()`
- c0010 ..> c0123: `preserveConnections() calls linkEntityMemory()`
- c0010 ..> c0123: `preserveConnections() calls updateMemory()`
- c0010 ..> c0123: `readAttachmentRecords() calls getCodeArtifact()`
- c0010 ..> c0123: `readAttachmentRecords() calls getDocument()`
- c0010 ..> c0126: `authorizedMemory() calls get()`
- c0010 ..> c0126: `prepareLinkReview() calls get()`
- c0010 ..> c0126: `preparePreviousConnections() calls get()`
- c0010 ..> c0126: `preparePreviousConnections() calls getMemoryEntityIds()`
- c0010 ..> c0126: `readSelectedMemory() calls get()`
- c0010 ..> c0126: `validateLinkDecisions() calls get()`
- c0010 ..> c0165: `executeConnection() calls execute()`
- c0010 ..> c0186: `prepareLinkReview() calls hasSensitiveData()`
- c0010 ..> c0186: `preparePreviousConnections() calls hasSensitiveData()`
- c0010 ..> c0186: `readAttachmentRecords() calls hasSensitiveData()`
- c0010 ..> c0186: `validateLinkDecisions() calls hasSensitiveData()`
- c0010 ..> c0186: `validatePreservation() calls hasSensitiveData()`
- c0010 ..> c0218: `validateLinkDecisions() calls trim()`
- c0010 ..> c0218: `validatePreservation() calls trim()`
- c0012 --> c0021: `field candidates`
- c0013 --> c0021: `field kind`
- c0019 --> c0021: `field candidate`
- c0019 --> c0033: `field neighborhood`
- c0019 --> c0077: `field evidenceEntries`
- c0019 --> c0082: `field overlaps`
- c0021 --> c0024: `field codeArtifacts`
- c0021 --> c0030: `field documents`
- c0021 --> c0032: `field entities`
- c0021 --> c0037: `field relationships`
- c0022 --> c0020: `field excludeBranches`
- c0023 --> c0020: `field deferredBranches`
- c0024 --|> c0153: `inherits`
- c0025 --> c0016: `field action`
- c0025 --> c0039: `field reuse`
- c0026 --> c0005: `field linkReview`
- c0026 --> c0016: `field action`
- c0027 --> c0193: `field status`
- c0028 --> c0026: `field candidates`
- c0028 --> c0200: `field status`
- c0029 --> c0027: `field conflicts`
- c0029 --> c0028: `field jobs`
- c0030 --|> c0154: `inherits`
- c0032 --|> c0156: `inherits`
- c0033 --> c0065: `field codeArtifacts`
- c0033 --> c0069: `field documents`
- c0033 --> c0072: `field entities`
- c0033 --> c0074: `field relationships`
- c0034 --> c0042: `field uncertainWrite`
- c0034 --> c0205: `field supersession`
- c0036 --|> c0193: `inherits`
- c0037 --|> c0158: `inherits`
- c0038 --> c0193: `field conflict`
- c0040 ..> c0004: `activity() calls set()`
- c0040 ..> c0005: `type in planLinkReviews`
- c0040 ..> c0005: `type in prepareLinkReviews`
- c0040 ..> c0005: `type in refreshLinkReview`
- c0040 ..> c0010: `executeLinkReview() calls applyLinkReview()`
- c0040 ..> c0010: `executeLinkReview() calls preserveConnections()`
- c0040 ..> c0010: `planLinkReviews() calls validateLinkReviews()`
- c0040 ..> c0010: `refreshLinkReview() calls prepareLinkReview()`
- c0040 ..> c0010: `refreshLinkReview() calls preparePreviousConnections()`
- c0040 --> c0017: `field activityPhase`
- c0040 ..> c0017: `type in activity`
- c0040 ..> c0018: `type in advance`
- c0040 ..> c0018: `type in advanceWatermark`
- c0040 ..> c0019: `type in validateEquivalentCandidate`
- c0040 ..> c0020: `type in checkpointBranch`
- c0040 ..> c0020: `type in checkpointBranches`
- c0040 ..> c0020: `type in runBranchWorker`
- c0040 ..> c0021: `type in addConflict`
- c0040 ..> c0021: `type in applyDecision`
- c0040 ..> c0021: `type in createMemory`
- c0040 ..> c0021: `type in decideOverlap`
- c0040 ..> c0021: `type in decideOverlapBatch`
- c0040 ..> c0021: `type in destinationProjects`
- c0040 ..> c0021: `type in executeLinkReview`
- c0040 ..> c0021: `type in existingNeighborhood`
- c0040 ..> c0021: `type in finishSupersession`
- c0040 ..> c0021: `type in loadCandidates`
- c0040 ..> c0021: `type in loadOverlaps`
- c0040 ..> c0021: `type in neighborhoodEntities`
- c0040 ..> c0021: `type in planConflictReplacement`
- c0040 ..> c0021: `type in planLinkReviews`
- c0040 ..> c0021: `type in prepareDestination`
- c0040 ..> c0021: `type in prepareLinkReviews`
- c0040 ..> c0021: `type in processCandidate`
- c0040 ..> c0021: `type in processCandidates`
- c0040 ..> c0021: `type in processKnowledgeCheckpoint`
- c0040 ..> c0021: `type in processReplacementCheckpoint`
- c0040 ..> c0021: `type in recordCandidateFailure`
- c0040 ..> c0021: `type in recordEscalation`
- c0040 ..> c0021: `type in refreshLinkReview`
- c0040 ..> c0021: `type in resolveDestination`
- c0040 ..> c0021: `type in reviewExecutionFailure`
- c0040 ..> c0021: `type in reviewLinks`
- c0040 ..> c0021: `type in supersedeCandidate`
- c0040 ..> c0021: `type in validateDecision`
- c0040 ..> c0021: `type in validateDecisionResources`
- c0040 ..> c0021: `type in validateEquivalentCandidate`
- c0040 ..> c0021: `type in validateRevisionText`
- c0040 ..> c0021: `type in writeKnowledge`
- c0040 ..> c0022: `type in checkpoint`
- c0040 ..> c0022: `type in checkpointBranches`
- c0040 ..> c0022: `type in processPending`
- c0040 ..> c0023: `type in appendCheckpointResult`
- c0040 ..> c0023: `type in checkpoint`
- c0040 ..> c0023: `type in checkpointBranch`
- c0040 ..> c0023: `type in processBranchJob`
- c0040 ..> c0023: `type in processCandidates`
- c0040 ..> c0023: `type in processJob`
- c0040 ..> c0023: `type in processPending`
- c0040 ..> c0023: `type in recordBranchFailure`
- c0040 ..> c0023: `type in recordCandidateFailure`
- c0040 ..> c0023: `type in runBranchWorker`
- c0040 ..> c0025: `type in addConflict`
- c0040 ..> c0025: `type in applyDecision`
- c0040 ..> c0025: `type in decideOverlap`
- c0040 ..> c0025: `type in finishSupersession`
- c0040 ..> c0025: `type in recordEscalation`
- c0040 ..> c0025: `type in supersedeCandidate`
- c0040 ..> c0025: `type in validateDecision`
- c0040 ..> c0025: `type in validateDecisionResources`
- c0040 ..> c0025: `type in validateEquivalentCandidate`
- c0040 ..> c0029: `type in diagnostics`
- c0040 ..> c0031: `type in enqueue`
- c0040 ..> c0031: `type in enqueueSnapshot`
- c0040 ..> c0033: `type in existingNeighborhood`
- c0040 ..> c0033: `type in validateDecision`
- c0040 ..> c0033: `type in validateDecisionResources`
- c0040 ..> c0035: `assertWriteAllowedNow() constructs CapturePause`
- c0040 ..> c0035: `decideOverlap() constructs CapturePause`
- c0040 ..> c0035: `ensureModelCallAllowed() constructs CapturePause`
- c0040 ..> c0035: `ensureWriteAllowed() constructs CapturePause`
- c0040 ..> c0035: `loadOverlaps() constructs CapturePause`
- c0040 ..> c0035: `neighborhoodEntities() constructs CapturePause`
- c0040 ..> c0035: `neighborhoodEntity() constructs CapturePause`
- c0040 ..> c0035: `neighborhoodRelationships() constructs CapturePause`
- c0040 ..> c0035: `processCandidate() constructs CapturePause`
- c0040 ..> c0035: `processJob() constructs CapturePause`
- c0040 ..> c0035: `sourceInspectionTool() constructs CapturePause`
- c0040 ..> c0035: `stop() constructs CapturePause`
- c0040 ..> c0036: `type in pendingConflicts`
- c0040 ..> c0036: `type in verifyConflictOrigin`
- c0040 ..> c0038: `type in applyConflictResolution`
- c0040 ..> c0038: `type in markConflictResolved`
- c0040 ..> c0038: `type in rejectConflict`
- c0040 ..> c0038: `type in resolve`
- c0040 ..> c0038: `type in resolveConflict`
- c0040 ..> c0038: `type in resolveConflictOwned`
- c0040 ..> c0040: `activity() calls publishActivity()`
- c0040 ..> c0040: `advanceWatermark() calls advance()`
- c0040 ..> c0040: `applyConflictResolution() calls applySupersession()`
- c0040 ..> c0040: `applyConflictResolution() calls createResolutionReplacement()`
- c0040 ..> c0040: `applyConflictResolution() calls ensureWriteAllowed()`
- c0040 ..> c0040: `applyConflictResolution() calls executeResolutionLinks()`
- c0040 ..> c0040: `applyConflictResolution() calls failConflictResolution()`
- c0040 ..> c0040: `applyConflictResolution() calls markConflictResolved()`
- c0040 ..> c0040: `applyConflictResolution() calls planConflictReplacement()`
- c0040 ..> c0040: `applyConflictResolution() calls updateResolutionReplacement()`
- c0040 ..> c0040: `applyConflictResolution() calls validateConflictMemory()`
- c0040 ..> c0040: `applyDecision() calls checkpointOutcome()`
- c0040 ..> c0040: `applyDecision() calls createMemory()`
- c0040 ..> c0040: `applyDecision() calls equivalentMemory()`
- c0040 ..> c0040: `applyDecision() calls recordEscalation()`
- c0040 ..> c0040: `applyDecision() calls supersedeCandidate()`
- c0040 ..> c0040: `applyDecision() calls writeKnowledge()`
- c0040 ..> c0040: `applySupersession() calls assertWriteAllowedNow()`
- c0040 ..> c0040: `applySupersession() calls ensureWriteAllowed()`
- c0040 ..> c0040: `applySupersession() calls readSavedMemory()`
- c0040 ..> c0040: `applySupersession() calls recordSupersession()`
- c0040 ..> c0040: `assertWriteAllowedNow() calls canWriteNow()`
- c0040 ..> c0040: `cancellableClient() calls read()`
- c0040 ..> c0040: `cancellableKnowledge() calls read()`
- c0040 ..> c0040: `checkpoint() calls appendCheckpointResult()`
- c0040 ..> c0040: `checkpoint() calls checkpointBranch()`
- c0040 ..> c0040: `checkpoint() calls checkpointBranches()`
- c0040 ..> c0040: `checkpoint() calls enabled()`
- c0040 ..> c0040: `checkpointBranch() calls runBranchWorker()`
- c0040 ..> c0040: `checkpointOutcome() calls correlation()`
- c0040 ..> c0040: `constructor() calls activity()`
- c0040 ..> c0040: `constructor() calls assertWriteAllowedNow()`
- c0040 ..> c0040: `constructor() calls cancellableClient()`
- c0040 ..> c0040: `constructor() calls read()`
- c0040 ..> c0040: `createMemory() calls assertWriteAllowedNow()`
- c0040 ..> c0040: `createMemory() calls checkpointOutcome()`
- c0040 ..> c0040: `createMemory() calls correlation()`
- c0040 ..> c0040: `createMemory() calls ensureWriteAllowed()`
- c0040 ..> c0040: `createResolutionReplacement() calls assertWriteAllowedNow()`
- c0040 ..> c0040: `createResolutionReplacement() calls authorizeResolutionAttachments()`
- c0040 ..> c0040: `createResolutionReplacement() calls ensureWriteAllowed()`
- c0040 ..> c0040: `createResolutionReplacement() calls validateConflictMemory()`
- c0040 ..> c0040: `decideOverlap() calls checkpointOutcome()`
- c0040 ..> c0040: `decideOverlap() calls correlation()`
- c0040 ..> c0040: `decideOverlap() calls enabled()`
- c0040 ..> c0040: `decideOverlap() calls ensureModelCallAllowed()`
- c0040 ..> c0040: `decideOverlap() calls existingNeighborhood()`
- c0040 ..> c0040: `decideOverlap() calls policyFor()`
- c0040 ..> c0040: `decideOverlap() calls validateDecision()`
- c0040 ..> c0040: `decideOverlapBatch() calls correlation()`
- c0040 ..> c0040: `decideOverlapBatch() calls ensureModelCallAllowed()`
- c0040 ..> c0040: `decideOverlapBatch() calls existingNeighborhood()`
- c0040 ..> c0040: `decideOverlapBatch() calls loadOverlaps()`
- c0040 ..> c0040: `decideOverlapBatch() calls policyFor()`
- c0040 ..> c0040: `decideOverlapBatch() calls prepareDestination()`
- c0040 ..> c0040: `destinationProjects() calls resolveDestination()`
- c0040 ..> c0040: `enabled() calls getMode()`
- c0040 ..> c0040: `enabled() calls isEnabled()`
- c0040 ..> c0040: `enqueueSnapshot() calls getMode()`
- c0040 ..> c0040: `enqueueSnapshot() calls isEnabled()`
- c0040 ..> c0040: `ensureModelCallAllowed() calls enabled()`
- c0040 ..> c0040: `ensureWriteAllowed() calls assertWriteAllowedNow()`
- c0040 ..> c0040: `ensureWriteAllowed() calls enabled()`
- c0040 ..> c0040: `ensureWriteAllowed() calls getMode()`
- c0040 ..> c0040: `equivalentMemory() calls ensureWriteAllowed()`
- c0040 ..> c0040: `executeLinkReview() calls assertWriteAllowedNow()`
- c0040 ..> c0040: `executeLinkReview() calls checkpointOutcome()`
- c0040 ..> c0040: `executeLinkReview() calls ensureWriteAllowed()`
- c0040 ..> c0040: `executeLinkReview() calls finishSupersession()`
- c0040 ..> c0040: `executeResolutionLinks() calls assertWriteAllowedNow()`
- c0040 ..> c0040: `executeResolutionLinks() calls authorizeResolutionMemory()`
- c0040 ..> c0040: `executeResolutionLinks() calls ensureWriteAllowed()`
- c0040 ..> c0040: `executeResolutionLinks() calls linkResolutionEntity()`
- c0040 ..> c0040: `existingNeighborhood() calls neighborhoodEntities()`
- c0040 ..> c0040: `existingNeighborhood() calls neighborhoodRelationships()`
- c0040 ..> c0040: `finishSupersession() calls applySupersession()`
- c0040 ..> c0040: `finishSupersession() calls checkpointOutcome()`
- c0040 ..> c0040: `linkResolutionEntity() calls assertWriteAllowedNow()`
- c0040 ..> c0040: `linkResolutionEntity() calls authorizeResolutionMemory()`
- c0040 ..> c0040: `linkResolutionEntity() calls ensureWriteAllowed()`
- c0040 ..> c0040: `loadCandidates() calls correlation()`
- c0040 ..> c0040: `loadCandidates() calls ensureModelCallAllowed()`
- c0040 ..> c0040: `loadCandidates() calls policyFor()`
- c0040 ..> c0040: `loadCandidates() calls sourceInspectionTool()`
- c0040 ..> c0040: `loadOverlaps() calls checkpointOutcome()`
- c0040 ..> c0040: `loadOverlaps() calls enabled()`
- c0040 ..> c0040: `mutate() calls activity()`
- c0040 ..> c0040: `mutate() calls assertWriteAllowedNow()`
- c0040 ..> c0040: `neighborhoodEntities() calls enabled()`
- c0040 ..> c0040: `neighborhoodEntities() calls neighborhoodEntity()`
- c0040 ..> c0040: `neighborhoodEntity() calls enabled()`
- c0040 ..> c0040: `neighborhoodRelationships() calls enabled()`
- c0040 ..> c0040: `ownedConflict() calls verifyConflictOrigin()`
- c0040 ..> c0040: `pendingConflicts() calls verifyConflictOrigin()`
- c0040 ..> c0040: `planConflictReplacement() calls ensureWriteAllowed()`
- c0040 ..> c0040: `planConflictReplacement() calls readSavedMemory()`
- c0040 ..> c0040: `planConflictReplacement() calls revisionResources()`
- c0040 ..> c0040: `planLinkReviews() calls correlation()`
- c0040 ..> c0040: `planLinkReviews() calls ensureModelCallAllowed()`
- c0040 ..> c0040: `planLinkReviews() calls ensureWriteAllowed()`
- c0040 ..> c0040: `prepareDestination() calls checkpointOutcome()`
- c0040 ..> c0040: `prepareDestination() calls destinationProjects()`
- c0040 ..> c0040: `prepareLinkReviews() calls checkpointOutcome()`
- c0040 ..> c0040: `prepareLinkReviews() calls ensureWriteAllowed()`
- c0040 ..> c0040: `prepareLinkReviews() calls refreshLinkReview()`
- c0040 ..> c0040: `processBranchJob() calls correlation()`
- c0040 ..> c0040: `processBranchJob() calls processJob()`
- c0040 ..> c0040: `processBranchJob() calls recordBranchFailure()`
- c0040 ..> c0040: `processCandidate() calls applyDecision()`
- c0040 ..> c0040: `processCandidate() calls checkpointOutcome()`
- c0040 ..> c0040: `processCandidate() calls decideOverlap()`
- c0040 ..> c0040: `processCandidate() calls enabled()`
- c0040 ..> c0040: `processCandidate() calls getMode()`
- c0040 ..> c0040: `processCandidate() calls loadOverlaps()`
- c0040 ..> c0040: `processCandidate() calls prepareDestination()`
- c0040 ..> c0040: `processCandidate() calls processKnowledgeCheckpoint()`
- c0040 ..> c0040: `processCandidate() calls processReplacementCheckpoint()`
- c0040 ..> c0040: `processCandidates() calls processCandidate()`
- c0040 ..> c0040: `processCandidates() calls recordCandidateFailure()`
- c0040 ..> c0040: `processCandidates() calls reviewExecutionFailure()`
- c0040 ..> c0040: `processJob() calls decideOverlapBatch()`
- c0040 ..> c0040: `processJob() calls enabled()`
- c0040 ..> c0040: `processJob() calls getMode()`
- c0040 ..> c0040: `processJob() calls loadCandidates()`
- c0040 ..> c0040: `processJob() calls processCandidates()`
- c0040 ..> c0040: `processJob() calls reviewLinks()`
- c0040 ..> c0040: `processKnowledgeCheckpoint() calls finishSupersession()`
- c0040 ..> c0040: `processKnowledgeCheckpoint() calls writeKnowledge()`
- c0040 ..> c0040: `processReplacementCheckpoint() calls finishSupersession()`
- c0040 ..> c0040: `processReplacementCheckpoint() calls writeKnowledge()`
- c0040 ..> c0040: `publishActivity() calls onActivity()`
- c0040 ..> c0040: `read() calls activity()`
- c0040 ..> c0040: `read() calls readSignal()`
- c0040 ..> c0040: `recordBranchFailure() calls correlation()`
- c0040 ..> c0040: `recordCandidateFailure() calls checkpointOutcome()`
- c0040 ..> c0040: `recordCandidateFailure() calls correlation()`
- c0040 ..> c0040: `recordEscalation() calls checkpointOutcome()`
- c0040 ..> c0040: `refreshLinkReview() calls ensureWriteAllowed()`
- c0040 ..> c0040: `resolve() calls resolveConflict()`
- c0040 ..> c0040: `resolveConflict() calls resolveConflictOwned()`
- c0040 ..> c0040: `resolveConflictOwned() calls applyConflictResolution()`
- c0040 ..> c0040: `resolveConflictOwned() calls enabled()`
- c0040 ..> c0040: `resolveConflictOwned() calls ownedConflict()`
- c0040 ..> c0040: `resolveConflictOwned() calls rejectConflict()`
- c0040 ..> c0040: `resolveConflictOwned() calls resolutionTarget()`
- c0040 ..> c0040: `resolveConflictOwned() calls validateResolutionEvidence()`
- c0040 ..> c0040: `reviewExecutionFailure() calls checkpointOutcome()`
- c0040 ..> c0040: `reviewExecutionFailure() calls correlation()`
- c0040 ..> c0040: `reviewExecutionFailure() calls ensureModelCallAllowed()`
- c0040 ..> c0040: `reviewLinks() calls executeLinkReview()`
- c0040 ..> c0040: `reviewLinks() calls planLinkReviews()`
- c0040 ..> c0040: `reviewLinks() calls prepareLinkReviews()`
- c0040 ..> c0040: `revisionResources() calls read()`
- c0040 ..> c0040: `runBranchWorker() calls enabled()`
- c0040 ..> c0040: `runBranchWorker() calls processBranchJob()`
- c0040 ..> c0040: `sourceInspectionTool() calls canReadNow()`
- c0040 ..> c0040: `sourceInspectionTool() calls enabled()`
- c0040 ..> c0040: `supersedeCandidate() calls checkpointOutcome()`
- c0040 ..> c0040: `supersedeCandidate() calls createMemory()`
- c0040 ..> c0040: `supersedeCandidate() calls ensureWriteAllowed()`
- c0040 ..> c0040: `supersedeCandidate() calls finishSupersession()`
- c0040 ..> c0040: `supersedeCandidate() calls writeKnowledge()`
- c0040 ..> c0040: `updateResolutionReplacement() calls assertWriteAllowedNow()`
- c0040 ..> c0040: `updateResolutionReplacement() calls authorizeResolutionAttachments()`
- c0040 ..> c0040: `updateResolutionReplacement() calls authorizeResolutionMemory()`
- c0040 ..> c0040: `updateResolutionReplacement() calls ensureWriteAllowed()`
- c0040 ..> c0040: `updateResolutionReplacement() calls validateConflictMemory()`
- c0040 ..> c0040: `validateDecision() calls validateDecisionResources()`
- c0040 ..> c0040: `validateResolutionEvidence() calls selectResolutionEvidence()`
- c0040 ..> c0040: `writeKnowledge() calls checkpointOutcome()`
- c0040 ..> c0040: `writeKnowledge() calls ensureWriteAllowed()`
- c0040 --> c0041: `field onActivity`
- c0040 ..> c0041: `type in constructor`
- c0040 ..> c0042: `applySupersession() constructs CaptureUncertainWrite`
- c0040 ..> c0042: `mutate() constructs CaptureUncertainWrite`
- c0040 ..> c0042: `processJob() constructs CaptureUncertainWrite`
- c0040 ..> c0043: `type in applyConflictResolution`
- c0040 ..> c0043: `type in planConflictReplacement`
- c0040 ..> c0043: `type in validateResolutionEvidence`
- c0040 ..> c0044: `type in applyConflictResolution`
- c0040 ..> c0044: `type in resolutionTarget`
- c0040 ..> c0045: `destinationProjects() constructs InvalidCaptureOutput`
- c0040 ..> c0045: `processKnowledgeCheckpoint() constructs InvalidCaptureOutput`
- c0040 ..> c0045: `processReplacementCheckpoint() constructs InvalidCaptureOutput`
- c0040 ..> c0045: `supersedeCandidate() constructs InvalidCaptureOutput`
- c0040 ..> c0045: `validateDecision() constructs InvalidCaptureOutput`
- c0040 ..> c0045: `validateDecisionResources() constructs InvalidCaptureOutput`
- c0040 ..> c0045: `validateRevisionText() constructs InvalidCaptureOutput`
- c0040 ..> c0046: `type in rejectConflict`
- c0040 ..> c0046: `type in resolve`
- c0040 ..> c0046: `type in resolveConflict`
- c0040 ..> c0046: `type in resolveConflictOwned`
- c0040 ..> c0046: `type in selectResolutionEvidence`
- c0040 ..> c0046: `type in validateResolutionEvidence`
- c0040 ..> c0048: `addConflict() calls clone()`
- c0040 ..> c0048: `addConflict() calls sourceEvidence()`
- c0040 ..> c0048: `applyConflictResolution() calls blockedSave()`
- c0040 ..> c0048: `applyConflictResolution() calls conflictResolutionEvidence()`
- c0040 ..> c0048: `applyDecision() calls firstConflictId()`
- c0040 ..> c0048: `checkpointBranch() calls scrubError()`
- c0040 ..> c0048: `checkpointOutcome() calls clone()`
- c0040 ..> c0048: `checkpointOutcome() calls record()`
- c0040 ..> c0048: `createMemory() calls memoryInput()`
- c0040 ..> c0048: `createMemory() calls projectId()`
- c0040 ..> c0048: `createMemory() calls record()`
- c0040 ..> c0048: `createResolutionReplacement() calls projectId()`
- c0040 ..> c0048: `decideOverlap() calls appendSubmissionRejection()`
- c0040 ..> c0048: `decideOverlap() calls boundedSubmissionRejections()`
- c0040 ..> c0048: `decideOverlap() calls captureConversation()`
- c0040 ..> c0048: `decideOverlap() calls captureWorkMetadata()`
- c0040 ..> c0048: `decideOverlap() calls decisionConflictIds()`
- c0040 ..> c0048: `decideOverlap() calls overlapCandidate()`
- c0040 ..> c0048: `decideOverlap() calls parseDecision()`
- c0040 ..> c0048: `decideOverlap() calls sourceEvidence()`
- c0040 ..> c0048: `decideOverlapBatch() calls appendSubmissionRejection()`
- c0040 ..> c0048: `decideOverlapBatch() calls boundedSubmissionRejections()`
- c0040 ..> c0048: `decideOverlapBatch() calls captureConversation()`
- c0040 ..> c0048: `decideOverlapBatch() calls captureWorkMetadata()`
- c0040 ..> c0048: `decideOverlapBatch() calls isFinalOutcome()`
- c0040 ..> c0048: `decideOverlapBatch() calls overlapCandidate()`
- c0040 ..> c0048: `decideOverlapBatch() calls record()`
- c0040 ..> c0048: `decideOverlapBatch() calls scrubError()`
- c0040 ..> c0048: `decideOverlapBatch() calls sourceEvidence()`
- c0040 ..> c0048: `diagnostics() calls boundedSubmissionRejections()`
- c0040 ..> c0048: `diagnostics() calls projectId()`
- c0040 ..> c0048: `diagnostics() calls record()`
- c0040 ..> c0048: `diagnostics() calls scrubError()`
- c0040 ..> c0048: `diagnostics() calls stringValue()`
- c0040 ..> c0048: `diagnostics() calls strings()`
- c0040 ..> c0048: `enqueue() calls scrubError()`
- c0040 ..> c0048: `enqueueSnapshot() calls snapshotForPersistence()`
- c0040 ..> c0048: `equivalentMemory() calls projectId()`
- c0040 ..> c0048: `equivalentMemory() calls record()`
- c0040 ..> c0048: `executeLinkReview() calls record()`
- c0040 ..> c0048: `finishSupersession() calls record()`
- c0040 ..> c0048: `loadCandidates() calls appendSubmissionRejection()`
- c0040 ..> c0048: `loadCandidates() calls boundedSubmissionRejections()`
- c0040 ..> c0048: `loadCandidates() calls captureCandidateSubmission()`
- c0040 ..> c0048: `loadCandidates() calls captureConversation()`
- c0040 ..> c0048: `loadCandidates() calls captureWorkMetadata()`
- c0040 ..> c0048: `loadCandidates() calls parseCandidates()`
- c0040 ..> c0048: `loadCandidates() calls record()`
- c0040 ..> c0048: `loadCandidates() calls strings()`
- c0040 ..> c0048: `loadOverlaps() calls record()`
- c0040 ..> c0048: `planConflictReplacement() calls captureConversation()`
- c0040 ..> c0048: `planLinkReviews() calls appendSubmissionRejection()`
- c0040 ..> c0048: `planLinkReviews() calls boundedSubmissionRejections()`
- c0040 ..> c0048: `planLinkReviews() calls captureConversation()`
- c0040 ..> c0048: `planLinkReviews() calls captureWorkMetadata()`
- c0040 ..> c0048: `planLinkReviews() calls record()`
- c0040 ..> c0048: `planLinkReviews() calls sourceEvidence()`
- c0040 ..> c0048: `prepareLinkReviews() calls record()`
- c0040 ..> c0048: `processCandidate() calls isFinalOutcome()`
- c0040 ..> c0048: `processCandidate() calls record()`
- c0040 ..> c0048: `processCandidates() calls isFinalOutcome()`
- c0040 ..> c0048: `processJob() calls isFinalOutcome()`
- c0040 ..> c0048: `processKnowledgeCheckpoint() calls projectId()`
- c0040 ..> c0048: `processKnowledgeCheckpoint() calls record()`
- c0040 ..> c0048: `processKnowledgeCheckpoint() calls stringValue()`
- c0040 ..> c0048: `processReplacementCheckpoint() calls projectId()`
- c0040 ..> c0048: `processReplacementCheckpoint() calls record()`
- c0040 ..> c0048: `processReplacementCheckpoint() calls stringValue()`
- c0040 ..> c0048: `recordBranchFailure() calls scrubError()`
- c0040 ..> c0048: `recordCandidateFailure() calls record()`
- c0040 ..> c0048: `recordCandidateFailure() calls scrubError()`
- c0040 ..> c0048: `refreshLinkReview() calls projectId()`
- c0040 ..> c0048: `refreshLinkReview() calls record()`
- c0040 ..> c0048: `resolutionTarget() calls record()`
- c0040 ..> c0048: `resolveDestination() calls currentProjectId()`
- c0040 ..> c0048: `resolveDestination() calls projectId()`
- c0040 ..> c0048: `reviewExecutionFailure() calls captureConversation()`
- c0040 ..> c0048: `reviewExecutionFailure() calls captureWorkMetadata()`
- c0040 ..> c0048: `reviewExecutionFailure() calls record()`
- c0040 ..> c0048: `supersedeCandidate() calls firstConflictId()`
- c0040 ..> c0048: `validateDecision() calls decisionConflictIds()`
- c0040 ..> c0048: `validateEquivalentCandidate() calls record()`
- c0040 ..> c0048: `validateResolutionEvidence() calls stringValue()`
- c0040 ..> c0048: `validateResolutionEvidence() calls trustedAdditionalEntries()`
- c0040 ..> c0048: `verifyConflictOrigin() calls record()`
- c0040 ..> c0048: `writeKnowledge() calls captureKnowledgePlan()`
- c0040 ..> c0048: `writeKnowledge() calls record()`
- c0040 --> c0063: `field getMode`
- c0040 ..> c0063: `type in enabled`
- c0040 ..> c0063: `type in ensureWriteAllowed`
- c0040 ..> c0063: `type in refreshLinkReview`
- c0040 ..> c0064: `type in advance`
- c0040 ..> c0064: `type in advanceWatermark`
- c0040 ..> c0064: `type in checkpoint`
- c0040 ..> c0064: `type in checkpointBranches`
- c0040 ..> c0064: `type in enqueue`
- c0040 ..> c0064: `type in enqueueSnapshot`
- c0040 ..> c0064: `type in policyFor`
- c0040 ..> c0072: `type in neighborhoodEntities`
- c0040 ..> c0072: `type in neighborhoodEntity`
- c0040 ..> c0072: `type in neighborhoodRelationships`
- c0040 ..> c0074: `type in neighborhoodRelationships`
- c0040 --> c0079: `field client`
- c0040 ..> c0079: `type in cancellableClient`
- c0040 ..> c0080: `type in cancellableKnowledge`
- c0040 --> c0082: `field readSavedMemory`
- c0040 ..> c0082: `type in addConflict`
- c0040 ..> c0082: `type in applyDecision`
- c0040 ..> c0082: `type in applySupersession`
- c0040 ..> c0082: `type in decideOverlap`
- c0040 ..> c0082: `type in equivalentMemory`
- c0040 ..> c0082: `type in finishSupersession`
- c0040 ..> c0082: `type in loadOverlaps`
- c0040 ..> c0082: `type in planConflictReplacement`
- c0040 ..> c0082: `type in recordEscalation`
- c0040 ..> c0082: `type in revisionResources`
- c0040 ..> c0082: `type in supersedeCandidate`
- c0040 ..> c0082: `type in validateConflictMemory`
- c0040 ..> c0082: `type in validateDecision`
- c0040 ..> c0082: `type in writeKnowledge`
- c0040 ..> c0083: `type in createMemory`
- c0040 --> c0085: `field model`
- c0040 ..> c0087: `type in sourceInspectionTool`
- c0040 ..> c0097: `type in destinationProjects`
- c0040 ..> c0097: `type in planConflictReplacement`
- c0040 ..> c0097: `type in resolveDestination`
- c0040 ..> c0097: `type in watermark`
- c0040 ..> c0123: `authorizeResolutionAttachments() calls getCodeArtifact()`
- c0040 ..> c0123: `authorizeResolutionAttachments() calls getDocument()`
- c0040 ..> c0123: `authorizeResolutionAttachments() calls getFile()`
- c0040 ..> c0123: `cancellableKnowledge() calls createCodeArtifact()`
- c0040 ..> c0123: `cancellableKnowledge() calls createDocument()`
- c0040 ..> c0123: `cancellableKnowledge() calls createEntity()`
- c0040 ..> c0123: `cancellableKnowledge() calls createRelationship()`
- c0040 ..> c0123: `cancellableKnowledge() calls getCodeArtifact()`
- c0040 ..> c0123: `cancellableKnowledge() calls getDocument()`
- c0040 ..> c0123: `cancellableKnowledge() calls getEntity()`
- c0040 ..> c0123: `cancellableKnowledge() calls getEntityMemories()`
- c0040 ..> c0123: `cancellableKnowledge() calls getFile()`
- c0040 ..> c0123: `cancellableKnowledge() calls getRelationships()`
- c0040 ..> c0123: `cancellableKnowledge() calls linkEntityMemory()`
- c0040 ..> c0123: `cancellableKnowledge() calls linkMemories()`
- c0040 ..> c0123: `cancellableKnowledge() calls listCodeArtifacts()`
- c0040 ..> c0123: `cancellableKnowledge() calls listDocuments()`
- c0040 ..> c0123: `cancellableKnowledge() calls listFiles()`
- c0040 ..> c0123: `cancellableKnowledge() calls searchEntities()`
- c0040 ..> c0123: `cancellableKnowledge() calls updateCodeArtifact()`
- c0040 ..> c0123: `cancellableKnowledge() calls updateDocument()`
- c0040 ..> c0123: `cancellableKnowledge() calls updateEntity()`
- c0040 ..> c0123: `cancellableKnowledge() calls updateMemory()`
- c0040 ..> c0123: `executeResolutionLinks() calls linkMemories()`
- c0040 ..> c0123: `existingNeighborhood() calls getCodeArtifact()`
- c0040 ..> c0123: `existingNeighborhood() calls getDocument()`
- c0040 ..> c0123: `existingNeighborhood() calls listCodeArtifacts()`
- c0040 ..> c0123: `existingNeighborhood() calls listDocuments()`
- c0040 ..> c0123: `linkResolutionEntity() calls getEntity()`
- c0040 ..> c0123: `linkResolutionEntity() calls linkEntityMemory()`
- c0040 ..> c0123: `neighborhoodEntities() calls searchEntities()`
- c0040 ..> c0123: `neighborhoodEntity() calls getEntity()`
- c0040 ..> c0123: `neighborhoodRelationships() calls getRelationships()`
- c0040 ..> c0123: `revisionResources() calls getCodeArtifact()`
- c0040 ..> c0123: `revisionResources() calls getDocument()`
- c0040 ..> c0123: `revisionResources() calls getEntity()`
- c0040 ..> c0123: `revisionResources() calls getFile()`
- c0040 ..> c0123: `updateResolutionReplacement() calls updateMemory()`
- c0040 ..> c0125: `planConflictReplacement() calls ids()`
- c0040 ..> c0126: `applyConflictResolution() calls get()`
- c0040 ..> c0126: `applySupersession() calls get()`
- c0040 ..> c0126: `applySupersession() calls supersede()`
- c0040 ..> c0126: `authorizeResolutionMemory() calls get()`
- c0040 ..> c0126: `cancellableClient() calls create()`
- c0040 ..> c0126: `cancellableClient() calls createProject()`
- c0040 ..> c0126: `cancellableClient() calls get()`
- c0040 ..> c0126: `cancellableClient() calls linkProject()`
- c0040 ..> c0126: `cancellableClient() calls listProjects()`
- c0040 ..> c0126: `cancellableClient() calls search()`
- c0040 ..> c0126: `cancellableClient() calls supersede()`
- c0040 ..> c0126: `constructor() calls get()`
- c0040 ..> c0126: `createMemory() calls create()`
- c0040 ..> c0126: `createResolutionReplacement() calls create()`
- c0040 ..> c0126: `createResolutionReplacement() calls get()`
- c0040 ..> c0126: `decideOverlapBatch() calls get()`
- c0040 ..> c0126: `diagnostics() calls get()`
- c0040 ..> c0126: `equivalentMemory() calls get()`
- c0040 ..> c0126: `executeLinkReview() calls get()`
- c0040 ..> c0126: `executeResolutionLinks() calls get()`
- c0040 ..> c0126: `linkResolutionEntity() calls getMemoryEntityIds()`
- c0040 ..> c0126: `loadOverlaps() calls search()`
- c0040 ..> c0126: `planLinkReviews() calls get()`
- c0040 ..> c0126: `read() calls get()`
- c0040 ..> c0126: `resolveDestination() calls listProjects()`
- c0040 ..> c0126: `revisionResources() calls get()`
- c0040 ..> c0126: `revisionResources() calls getMemoryEntityIds()`
- c0040 ..> c0126: `supersedeCandidate() calls get()`
- c0040 ..> c0126: `updateResolutionReplacement() calls get()`
- c0040 ..> c0126: `verifyConflictOrigin() calls get()`
- c0040 --> c0165: `field knowledgeWriter`
- c0040 ..> c0165: `constructor() constructs KnowledgeWriter`
- c0040 ..> c0165: `writeKnowledge() calls execute()`
- c0040 --> c0168: `field logger`
- c0040 ..> c0170: `checkpointBranch() calls emit()`
- c0040 ..> c0170: `checkpointOutcome() calls emit()`
- c0040 ..> c0170: `createMemory() calls emit()`
- c0040 ..> c0170: `decideOverlap() calls emit()`
- c0040 ..> c0170: `emit() calls emit()`
- c0040 ..> c0170: `enqueue() calls emit()`
- c0040 ..> c0170: `enqueueSnapshot() calls emit()`
- c0040 ..> c0170: `enqueueSnapshot() calls enqueue()`
- c0040 ..> c0170: `loadCandidates() calls emit()`
- c0040 ..> c0170: `processBranchJob() calls emit()`
- c0040 ..> c0170: `recordBranchFailure() calls emit()`
- c0040 ..> c0170: `recordCandidateFailure() calls emit()`
- c0040 ..> c0170: `runBranchWorker() calls emit()`
- c0040 ..> c0172: `createResolutionReplacement() calls replacementMemoryInput()`
- c0040 ..> c0172: `planConflictReplacement() calls replacementMemoryContext()`
- c0040 ..> c0172: `supersedeCandidate() calls replacementMemoryContext()`
- c0040 ..> c0172: `updateResolutionReplacement() calls replacementMemoryInput()`
- c0040 ..> c0176: `loadCandidates() calls prepareCapture()`
- c0040 ..> c0186: `addConflict() calls sanitizeText()`
- c0040 ..> c0186: `addConflict() calls sanitizeValue()`
- c0040 ..> c0186: `applyDecision() calls sanitizeValue()`
- c0040 ..> c0186: `decideOverlap() calls sanitizeValue()`
- c0040 ..> c0186: `diagnostics() calls sanitizeText()`
- c0040 ..> c0186: `emit() calls sanitizeValue()`
- c0040 ..> c0186: `existingNeighborhood() calls hasSensitiveData()`
- c0040 ..> c0186: `loadCandidates() calls sanitizeText()`
- c0040 ..> c0186: `loadOverlaps() calls hasSensitiveData()`
- c0040 ..> c0186: `loadOverlaps() calls sanitizeValue()`
- c0040 ..> c0186: `neighborhoodEntity() calls hasSensitiveData()`
- c0040 ..> c0186: `neighborhoodRelationships() calls hasSensitiveData()`
- c0040 ..> c0186: `rejectConflict() calls sanitizeText()`
- c0040 ..> c0186: `supersedeCandidate() calls sanitizeValue()`
- c0040 ..> c0186: `writeKnowledge() calls sanitizeValue()`
- c0040 --> c0190: `field queue`
- c0040 ..> c0190: `addConflict() calls addConflict()`
- c0040 ..> c0190: `addConflict() calls now()`
- c0040 ..> c0190: `advance() calls advanceWatermark()`
- c0040 ..> c0190: `applyConflictResolution() calls updateConflict()`
- c0040 ..> c0190: `cancellableClient() calls mutate()`
- c0040 ..> c0190: `cancellableKnowledge() calls mutate()`
- c0040 ..> c0190: `checkpoint() calls hasClaimableWork()`
- c0040 ..> c0190: `checkpointBranch() calls withWorkerLock()`
- c0040 ..> c0190: `checkpointBranches() calls listJobMetadata()`
- c0040 ..> c0190: `checkpointOutcome() calls checkpoint()`
- c0040 ..> c0190: `checkpointOutcome() calls getJob()`
- c0040 ..> c0190: `constructor() calls complete()`
- c0040 ..> c0190: `createResolutionReplacement() calls updateConflict()`
- c0040 ..> c0190: `decideOverlap() calls checkpoint()`
- c0040 ..> c0190: `decideOverlap() calls complete()`
- c0040 ..> c0190: `decideOverlapBatch() calls checkpoint()`
- c0040 ..> c0190: `decideOverlapBatch() calls complete()`
- c0040 ..> c0190: `diagnostics() calls listJobMetadata()`
- c0040 ..> c0190: `diagnostics() calls pendingConflicts()`
- c0040 ..> c0190: `enqueue() calls enqueueSnapshot()`
- c0040 ..> c0190: `enqueueSnapshot() calls advanceWatermark()`
- c0040 ..> c0190: `executeLinkReview() calls getJob()`
- c0040 ..> c0190: `executeResolutionLinks() calls updateConflict()`
- c0040 ..> c0190: `failConflictResolution() calls getConflict()`
- c0040 ..> c0190: `failConflictResolution() calls updateConflict()`
- c0040 ..> c0190: `loadCandidates() calls checkpoint()`
- c0040 ..> c0190: `loadCandidates() calls complete()`
- c0040 ..> c0190: `loadCandidates() calls getJob()`
- c0040 ..> c0190: `markConflictResolved() calls updateConflict()`
- c0040 ..> c0190: `ownedConflict() calls getConflict()`
- c0040 ..> c0190: `pendingConflicts() calls pendingConflicts()`
- c0040 ..> c0190: `planConflictReplacement() calls complete()`
- c0040 ..> c0190: `planConflictReplacement() calls getJob()`
- c0040 ..> c0190: `planLinkReviews() calls checkpoint()`
- c0040 ..> c0190: `planLinkReviews() calls complete()`
- c0040 ..> c0190: `processBranchJob() calls getJob()`
- c0040 ..> c0190: `processBranchJob() calls now()`
- c0040 ..> c0190: `processJob() calls checkpoint()`
- c0040 ..> c0190: `processJob() calls complete()`
- c0040 ..> c0190: `processJob() calls getJob()`
- c0040 ..> c0190: `processJob() calls releaseProgress()`
- c0040 ..> c0190: `processPending() calls checkpoint()`
- c0040 ..> c0190: `recordBranchFailure() calls cancel()`
- c0040 ..> c0190: `recordBranchFailure() calls checkpoint()`
- c0040 ..> c0190: `recordBranchFailure() calls getJob()`
- c0040 ..> c0190: `recordBranchFailure() calls now()`
- c0040 ..> c0190: `recordCandidateFailure() calls cancel()`
- c0040 ..> c0190: `recordCandidateFailure() calls checkpoint()`
- c0040 ..> c0190: `recordCandidateFailure() calls getJob()`
- c0040 ..> c0190: `recordEscalation() calls addConflict()`
- c0040 ..> c0190: `recordSupersession() calls checkpoint()`
- c0040 ..> c0190: `recordSupersession() calls updateConflict()`
- c0040 ..> c0190: `rejectConflict() calls updateConflict()`
- c0040 ..> c0190: `resolveConflict() calls getConflict()`
- c0040 ..> c0190: `resolveConflict() calls withWorkerLock()`
- c0040 ..> c0190: `reviewExecutionFailure() calls checkpoint()`
- c0040 ..> c0190: `reviewExecutionFailure() calls complete()`
- c0040 ..> c0190: `runBranchWorker() calls claimNext()`
- c0040 ..> c0190: `sourceInspectionTool() calls checkpoint()`
- c0040 ..> c0190: `updateResolutionReplacement() calls updateConflict()`
- c0040 ..> c0190: `verifyConflictOrigin() calls getJob()`
- c0040 ..> c0190: `watermark() calls getWatermark()`
- c0040 ..> c0193: `type in addConflict`
- c0040 ..> c0193: `type in applyConflictResolution`
- c0040 ..> c0193: `type in authorizeResolutionAttachments`
- c0040 ..> c0193: `type in createResolutionReplacement`
- c0040 ..> c0193: `type in executeResolutionLinks`
- c0040 ..> c0193: `type in linkResolutionEntity`
- c0040 ..> c0193: `type in ownedConflict`
- c0040 ..> c0193: `type in planConflictReplacement`
- c0040 ..> c0193: `type in rejectConflict`
- c0040 ..> c0193: `type in resolutionTarget`
- c0040 ..> c0193: `type in selectResolutionEvidence`
- c0040 ..> c0193: `type in updateResolutionReplacement`
- c0040 ..> c0193: `type in validateConflictMemory`
- c0040 ..> c0193: `type in validateResolutionEvidence`
- c0040 ..> c0193: `type in verifyConflictOrigin`
- c0040 --> c0197: `field identity`
- c0040 ..> c0198: `type in addConflict`
- c0040 ..> c0198: `type in applyDecision`
- c0040 ..> c0198: `type in applySupersession`
- c0040 ..> c0198: `type in checkpointOutcome`
- c0040 ..> c0198: `type in correlation`
- c0040 ..> c0198: `type in createMemory`
- c0040 ..> c0198: `type in decideOverlap`
- c0040 ..> c0198: `type in decideOverlapBatch`
- c0040 ..> c0198: `type in ensureModelCallAllowed`
- c0040 ..> c0198: `type in equivalentMemory`
- c0040 ..> c0198: `type in executeLinkReview`
- c0040 ..> c0198: `type in existingNeighborhood`
- c0040 ..> c0198: `type in finishSupersession`
- c0040 ..> c0198: `type in loadCandidates`
- c0040 ..> c0198: `type in loadOverlaps`
- c0040 ..> c0198: `type in neighborhoodEntities`
- c0040 ..> c0198: `type in neighborhoodEntity`
- c0040 ..> c0198: `type in neighborhoodRelationships`
- c0040 ..> c0198: `type in planLinkReviews`
- c0040 ..> c0198: `type in prepareDestination`
- c0040 ..> c0198: `type in prepareLinkReviews`
- c0040 ..> c0198: `type in processBranchJob`
- c0040 ..> c0198: `type in processCandidate`
- c0040 ..> c0198: `type in processCandidates`
- c0040 ..> c0198: `type in processJob`
- c0040 ..> c0198: `type in processKnowledgeCheckpoint`
- c0040 ..> c0198: `type in processReplacementCheckpoint`
- c0040 ..> c0198: `type in recordBranchFailure`
- c0040 ..> c0198: `type in recordCandidateFailure`
- c0040 ..> c0198: `type in recordEscalation`
- c0040 ..> c0198: `type in refreshLinkReview`
- c0040 ..> c0198: `type in reviewExecutionFailure`
- c0040 ..> c0198: `type in reviewLinks`
- c0040 ..> c0198: `type in sourceInspectionTool`
- c0040 ..> c0198: `type in supersedeCandidate`
- c0040 ..> c0198: `type in validateEquivalentCandidate`
- c0040 ..> c0198: `type in writeKnowledge`
- c0040 ..> c0205: `type in recordSupersession`
- c0040 ..> c0218: `validateRevisionText() calls trim()`
- c0040 ..> c0225: `planConflictReplacement() calls sanitizeCaptureConversation()`
- c0040 ..> c0229: `sourceInspectionTool() calls inspect()`
- c0040 ..> c0229: `sourceInspectionTool() constructs SourceInspector`
- c0041 --> c0017: `field onActivity`
- c0041 --> c0063: `field getMode`
- c0041 --> c0079: `field client`
- c0041 --> c0085: `field model`
- c0041 --> c0168: `field logger`
- c0041 --> c0190: `field queue`
- c0042 --|> c0035: `inherits`
- c0043 --> c0077: `field selectedAdditionalEntries`
- c0044 --> c0021: `field candidate`
- c0044 --> c0082: `field oldMemory`
- c0044 --> c0198: `field fakeJob`
- c0046 --> c0077: `field additionalEntries`
- c0048 ..> c0011: `type in buildCandidate`
- c0048 ..> c0011: `type in candidateDestination`
- c0048 ..> c0012: `type in parseCandidates`
- c0048 ..> c0013: `type in buildCandidate`
- c0048 ..> c0013: `type in candidateFields`
- c0048 ..> c0014: `type in buildCandidate`
- c0048 ..> c0014: `type in candidateLists`
- c0048 ..> c0015: `type in candidateDestination`
- c0048 ..> c0015: `type in candidateFields`
- c0048 ..> c0015: `type in candidateLists`
- c0048 ..> c0015: `type in codeArtifactResource`
- c0048 ..> c0015: `type in documentResource`
- c0048 ..> c0015: `type in eligibleCandidate`
- c0048 ..> c0015: `type in entityClassification`
- c0048 ..> c0015: `type in entityResource`
- c0048 ..> c0015: `type in invalidCandidate`
- c0048 ..> c0015: `type in parseResourceList`
- c0048 ..> c0015: `type in relationshipResource`
- c0048 ..> c0015: `type in resourceEvidence`
- c0048 ..> c0015: `type in resourceKey`
- c0048 ..> c0015: `type in resourceString`
- c0048 ..> c0015: `type in resourceStrings`
- c0048 ..> c0015: `type in richResources`
- c0048 ..> c0015: `type in validCandidate`
- c0048 ..> c0021: `type in buildCandidate`
- c0048 ..> c0021: `type in candidateEvidenceIneligibilityReason`
- c0048 ..> c0021: `type in candidateEvidenceIsEligible`
- c0048 ..> c0021: `type in captureKnowledgePlan`
- c0048 ..> c0021: `type in codeArtifactResource`
- c0048 ..> c0021: `type in documentResource`
- c0048 ..> c0021: `type in eligibleCandidate`
- c0048 ..> c0021: `type in entityResource`
- c0048 ..> c0021: `type in evidenceType`
- c0048 ..> c0021: `type in memoryInput`
- c0048 ..> c0021: `type in overlapCandidate`
- c0048 ..> c0021: `type in relationshipResource`
- c0048 ..> c0021: `type in resourceEvidence`
- c0048 ..> c0021: `type in richResources`
- c0048 ..> c0021: `type in sourceEvidence`
- c0048 ..> c0024: `type in codeArtifactResource`
- c0048 ..> c0025: `type in applyEnrichmentDecision`
- c0048 ..> c0025: `type in applyEquivalentCandidate`
- c0048 ..> c0025: `type in decisionConflictIds`
- c0048 ..> c0025: `type in firstConflictId`
- c0048 ..> c0025: `type in parseDecision`
- c0048 ..> c0030: `type in documentResource`
- c0048 ..> c0032: `type in entityResource`
- c0048 ..> c0037: `type in relationshipResource`
- c0048 ..> c0043: `type in conflictResolutionEvidence`
- c0048 ..> c0045: `applyEnrichmentDecision() constructs InvalidCaptureOutput`
- c0048 ..> c0045: `applyEquivalentCandidate() constructs InvalidCaptureOutput`
- c0048 ..> c0045: `decisionEvidenceIds() constructs InvalidCaptureOutput`
- c0048 ..> c0045: `decisionMemoryId() constructs InvalidCaptureOutput`
- c0048 ..> c0045: `decisionMemoryIds() constructs InvalidCaptureOutput`
- c0048 ..> c0045: `decisionPartial() constructs InvalidCaptureOutput`
- c0048 ..> c0045: `decisionTargetMemoryId() constructs InvalidCaptureOutput`
- c0048 ..> c0045: `decisionText() constructs InvalidCaptureOutput`
- c0048 ..> c0045: `parseCandidates() constructs InvalidCaptureOutput`
- c0048 ..> c0045: `parseDecision() constructs InvalidCaptureOutput`
- c0048 ..> c0047: `type in buildCandidate`
- c0048 ..> c0047: `type in richResources`
- c0048 ..> c0048: `appendSubmissionRejection() calls boundedSubmissionRejections()`
- c0048 ..> c0048: `buildCandidate() calls numberValue()`
- c0048 ..> c0048: `buildCandidate() calls stringValue()`
- c0048 ..> c0048: `candidateDestination() calls invalidCandidate()`
- c0048 ..> c0048: `candidateDestination() calls projectId()`
- c0048 ..> c0048: `candidateDestination() calls stringValue()`
- c0048 ..> c0048: `candidateDestination() calls validCandidate()`
- c0048 ..> c0048: `candidateEvidenceIsEligible() calls candidateEvidenceIneligibilityReason()`
- c0048 ..> c0048: `candidateFields() calls candidateEvidenceIneligibilityReason()`
- c0048 ..> c0048: `candidateFields() calls evidenceType()`
- c0048 ..> c0048: `candidateFields() calls invalidCandidate()`
- c0048 ..> c0048: `candidateFields() calls resourceStrings()`
- c0048 ..> c0048: `candidateFields() calls sourceEvidence()`
- c0048 ..> c0048: `candidateFields() calls stringValue()`
- c0048 ..> c0048: `candidateFields() calls validCandidate()`
- c0048 ..> c0048: `candidateLists() calls resourceStrings()`
- c0048 ..> c0048: `candidateLists() calls validCandidate()`
- c0048 ..> c0048: `captureConversation() calls record()`
- c0048 ..> c0048: `codeArtifactResource() calls resourceEvidence()`
- c0048 ..> c0048: `codeArtifactResource() calls resourceInput()`
- c0048 ..> c0048: `codeArtifactResource() calls resourceKey()`
- c0048 ..> c0048: `codeArtifactResource() calls resourceString()`
- c0048 ..> c0048: `codeArtifactResource() calls resourceStrings()`
- c0048 ..> c0048: `codeArtifactResource() calls validCandidate()`
- c0048 ..> c0048: `currentProjectId() calls projectId()`
- c0048 ..> c0048: `decisionMemoryId() calls projectId()`
- c0048 ..> c0048: `decisionMemoryIds() calls projectId()`
- c0048 ..> c0048: `decisionTargetMemoryId() calls projectId()`
- c0048 ..> c0048: `decisionText() calls stringValue()`
- c0048 ..> c0048: `documentResource() calls resourceEvidence()`
- c0048 ..> c0048: `documentResource() calls resourceInput()`
- c0048 ..> c0048: `documentResource() calls resourceKey()`
- c0048 ..> c0048: `documentResource() calls resourceString()`
- c0048 ..> c0048: `documentResource() calls resourceStrings()`
- c0048 ..> c0048: `documentResource() calls validCandidate()`
- c0048 ..> c0048: `eligibleCandidate() calls buildCandidate()`
- c0048 ..> c0048: `eligibleCandidate() calls candidateDestination()`
- c0048 ..> c0048: `eligibleCandidate() calls candidateFields()`
- c0048 ..> c0048: `eligibleCandidate() calls candidateLists()`
- c0048 ..> c0048: `eligibleCandidate() calls invalidCandidate()`
- c0048 ..> c0048: `eligibleCandidate() calls record()`
- c0048 ..> c0048: `eligibleCandidate() calls richResources()`
- c0048 ..> c0048: `eligibleCandidate() calls stringValue()`
- c0048 ..> c0048: `eligibleCandidate() calls validCandidate()`
- c0048 ..> c0048: `entityClassification() calls invalidCandidate()`
- c0048 ..> c0048: `entityClassification() calls resourceString()`
- c0048 ..> c0048: `entityClassification() calls validCandidate()`
- c0048 ..> c0048: `entityResource() calls entityClassification()`
- c0048 ..> c0048: `entityResource() calls resourceEvidence()`
- c0048 ..> c0048: `entityResource() calls resourceInput()`
- c0048 ..> c0048: `entityResource() calls resourceKey()`
- c0048 ..> c0048: `entityResource() calls resourceString()`
- c0048 ..> c0048: `entityResource() calls resourceStrings()`
- c0048 ..> c0048: `entityResource() calls validCandidate()`
- c0048 ..> c0048: `isFinalOutcome() calls record()`
- c0048 ..> c0048: `parseCandidates() calls eligibleCandidate()`
- c0048 ..> c0048: `parseCandidates() calls record()`
- c0048 ..> c0048: `parseCandidates() calls stringValue()`
- c0048 ..> c0048: `parseDecision() calls applyEnrichmentDecision()`
- c0048 ..> c0048: `parseDecision() calls applyEquivalentCandidate()`
- c0048 ..> c0048: `parseDecision() calls decisionEvidenceIds()`
- c0048 ..> c0048: `parseDecision() calls decisionMemoryId()`
- c0048 ..> c0048: `parseDecision() calls decisionMemoryIds()`
- c0048 ..> c0048: `parseDecision() calls decisionPartial()`
- c0048 ..> c0048: `parseDecision() calls decisionTargetMemoryId()`
- c0048 ..> c0048: `parseDecision() calls decisionText()`
- c0048 ..> c0048: `parseDecision() calls record()`
- c0048 ..> c0048: `parseResourceList() calls invalidCandidate()`
- c0048 ..> c0048: `parseResourceList() calls record()`
- c0048 ..> c0048: `parseResourceList() calls validCandidate()`
- c0048 ..> c0048: `relationshipResource() calls resourceEvidence()`
- c0048 ..> c0048: `relationshipResource() calls resourceInput()`
- c0048 ..> c0048: `relationshipResource() calls resourceKey()`
- c0048 ..> c0048: `relationshipResource() calls resourceString()`
- c0048 ..> c0048: `relationshipResource() calls validCandidate()`
- c0048 ..> c0048: `resourceEvidence() calls candidateEvidenceIsEligible()`
- c0048 ..> c0048: `resourceEvidence() calls invalidCandidate()`
- c0048 ..> c0048: `resourceEvidence() calls resourceStrings()`
- c0048 ..> c0048: `resourceEvidence() calls sourceEvidence()`
- c0048 ..> c0048: `resourceEvidence() calls validCandidate()`
- c0048 ..> c0048: `resourceInput() calls record()`
- c0048 ..> c0048: `resourceKey() calls resourceString()`
- c0048 ..> c0048: `resourceKey() calls validCandidate()`
- c0048 ..> c0048: `resourceString() calls invalidCandidate()`
- c0048 ..> c0048: `resourceString() calls stringValue()`
- c0048 ..> c0048: `resourceString() calls validCandidate()`
- c0048 ..> c0048: `resourceStrings() calls invalidCandidate()`
- c0048 ..> c0048: `resourceStrings() calls validCandidate()`
- c0048 ..> c0048: `richResources() calls invalidCandidate()`
- c0048 ..> c0048: `richResources() calls parseResourceList()`
- c0048 ..> c0048: `richResources() calls validCandidate()`
- c0048 ..> c0048: `snapshotForPersistence() calls clone()`
- c0048 ..> c0048: `trustedAdditionalEntries() calls record()`
- c0048 ..> c0048: `trustedAdditionalEntries() calls stringValue()`
- c0048 ..> c0064: `type in candidateFields`
- c0048 ..> c0064: `type in captureCandidateSubmission`
- c0048 ..> c0064: `type in captureConversation`
- c0048 ..> c0064: `type in captureWorkMetadata`
- c0048 ..> c0064: `type in codeArtifactResource`
- c0048 ..> c0064: `type in documentResource`
- c0048 ..> c0064: `type in eligibleCandidate`
- c0048 ..> c0064: `type in entityResource`
- c0048 ..> c0064: `type in parseCandidates`
- c0048 ..> c0064: `type in relationshipResource`
- c0048 ..> c0064: `type in resourceEvidence`
- c0048 ..> c0064: `type in richResources`
- c0048 ..> c0064: `type in snapshotForPersistence`
- c0048 ..> c0064: `type in sourceEvidence`
- c0048 ..> c0073: `type in entityClassification`
- c0048 ..> c0077: `type in candidateEvidenceIneligibilityReason`
- c0048 ..> c0077: `type in candidateEvidenceIsEligible`
- c0048 ..> c0077: `type in sourceEvidence`
- c0048 ..> c0077: `type in trustedAdditionalEntries`
- c0048 ..> c0082: `type in captureKnowledgePlan`
- c0048 ..> c0084: `type in memoryInput`
- c0048 ..> c0090: `type in captureCandidateSubmission`
- c0048 ..> c0097: `type in captureKnowledgePlan`
- c0048 ..> c0097: `type in currentProjectId`
- c0048 ..> c0097: `type in memoryInput`
- c0048 ..> c0126: `sourceEvidence() calls get()`
- c0048 ..> c0161: `type in captureKnowledgePlan`
- c0048 ..> c0172: `candidateFields() calls storedMemoryContext()`
- c0048 ..> c0172: `memoryInput() calls storedMemoryContext()`
- c0048 ..> c0186: `boundedSubmissionRejections() calls sanitizeText()`
- c0048 ..> c0186: `buildCandidate() calls hasSensitiveData()`
- c0048 ..> c0186: `buildCandidate() calls sanitizeText()`
- c0048 ..> c0186: `candidateDestination() calls sanitizeText()`
- c0048 ..> c0186: `candidateEvidenceIneligibilityReason() calls isMemoryOperation()`
- c0048 ..> c0186: `candidateFields() calls hasSensitiveData()`
- c0048 ..> c0186: `captureWorkMetadata() calls isMemoryOperation()`
- c0048 ..> c0186: `decisionText() calls sanitizeText()`
- c0048 ..> c0186: `eligibleCandidate() calls hasSensitiveData()`
- c0048 ..> c0186: `resourceString() calls sanitizeText()`
- c0048 ..> c0186: `resourceStrings() calls sanitizeText()`
- c0048 ..> c0186: `scrubError() calls sanitizeText()`
- c0048 ..> c0186: `strings() calls sanitizeText()`
- c0048 ..> c0186: `trustedAdditionalEntries() calls hasSensitiveData()`
- c0048 ..> c0186: `trustedAdditionalEntries() calls isMemoryOperation()`
- c0048 ..> c0186: `trustedAdditionalEntries() calls sanitizeText()`
- c0048 ..> c0218: `applyEnrichmentDecision() calls trim()`
- c0048 ..> c0218: `applyEquivalentCandidate() calls trim()`
- c0048 ..> c0218: `decisionEvidenceIds() calls trim()`
- c0048 ..> c0218: `parseDecision() calls trim()`
- c0048 ..> c0218: `resourceStrings() calls trim()`
- c0048 ..> c0218: `stringValue() calls trim()`
- c0048 ..> c0218: `strings() calls trim()`
- c0048 ..> c0225: `snapshotForPersistence() calls sanitizeCaptureSnapshot()`
- c0050 --> c0051: `field instance`
- c0050 --> c0054: `field model`
- c0050 --> c0058: `field prompts`
- c0050 --> c0059: `field scopeSource`
- c0050 --> c0060: `field verbosity`
- c0050 --> c0063: `field captureMode`
- c0050 --> c0094: `field scope`
- c0050 --> c0169: `field logging`
- c0061 ..> c0050: `type in loadForgetfulConfig`
- c0061 ..> c0052: `type in readJson`
- c0061 ..> c0052: `type in resolveScope`
- c0061 ..> c0053: `type in loadForgetfulConfig`
- c0061 ..> c0054: `type in modelToString`
- c0061 ..> c0054: `type in parseModel`
- c0061 ..> c0056: `type in resolveVerbosity`
- c0061 ..> c0056: `type in updateUserSettings`
- c0061 ..> c0058: `type in mergePrompts`
- c0061 ..> c0058: `type in readPromptDirectory`
- c0061 ..> c0059: `type in resolveScope`
- c0061 ..> c0060: `type in isVerbosity`
- c0061 ..> c0060: `type in resolveVerbosity`
- c0061 ..> c0061: `loadForgetfulConfig() calls asBoolean()`
- c0061 ..> c0061: `loadForgetfulConfig() calls asPositiveInteger()`
- c0061 ..> c0061: `loadForgetfulConfig() calls asString()`
- c0061 ..> c0061: `loadForgetfulConfig() calls isFileLogLevel()`
- c0061 ..> c0061: `loadForgetfulConfig() calls isRecord()`
- c0061 ..> c0061: `loadForgetfulConfig() calls mergePrompts()`
- c0061 ..> c0061: `loadForgetfulConfig() calls parseModel()`
- c0061 ..> c0061: `loadForgetfulConfig() calls projectSettingsPath()`
- c0061 ..> c0061: `loadForgetfulConfig() calls readJson()`
- c0061 ..> c0061: `loadForgetfulConfig() calls readPromptDirectory()`
- c0061 ..> c0061: `loadForgetfulConfig() calls resolveCaptureMode()`
- c0061 ..> c0061: `loadForgetfulConfig() calls resolveContextLimit()`
- c0061 ..> c0061: `loadForgetfulConfig() calls resolveRecallConcurrency()`
- c0061 ..> c0061: `loadForgetfulConfig() calls resolveScope()`
- c0061 ..> c0061: `loadForgetfulConfig() calls resolveVerbosity()`
- c0061 ..> c0061: `loadForgetfulConfig() calls userSettingsPath()`
- c0061 ..> c0061: `parseModel() calls isRecord()`
- c0061 ..> c0061: `resolveRecallConcurrency() calls isRecallConcurrency()`
- c0061 ..> c0061: `resolveScope() calls isRecord()`
- c0061 ..> c0061: `resolveVerbosity() calls isVerbosity()`
- c0061 ..> c0061: `updateForgetfulConnection() calls isRecord()`
- c0061 ..> c0061: `updateForgetfulConnection() calls readJson()`
- c0061 ..> c0061: `updateForgetfulConnection() calls writeJson()`
- c0061 ..> c0061: `updateUserSettings() calls isRecord()`
- c0061 ..> c0061: `updateUserSettings() calls readJson()`
- c0061 ..> c0061: `updateUserSettings() calls writeJson()`
- c0061 ..> c0061: `userSettingsPath() calls defaultAgentDir()`
- c0061 ..> c0061: `writeProjectScope() calls projectSettingsPath()`
- c0061 ..> c0061: `writeProjectScope() calls writeJson()`
- c0061 ..> c0063: `type in resolveCaptureMode`
- c0061 ..> c0094: `type in resolveScope`
- c0061 ..> c0094: `type in writeProjectScope`
- c0061 ..> c0151: `readJson() calls readFile()`
- c0061 ..> c0151: `readPromptDirectory() calls readFile()`
- c0061 ..> c0169: `type in isFileLogLevel`
- c0061 ..> c0170: `writeJson() calls close()`
- c0061 ..> c0218: `asString() calls trim()`
- c0061 ..> c0218: `parseModel() calls trim()`
- c0061 ..> c0218: `readPromptDirectory() calls trim()`
- c0064 --> c0062: `field historySummary`
- c0064 --> c0063: `field mode`
- c0064 --> c0077: `field entries`
- c0064 --> c0094: `field scope`
- c0064 --> c0097: `field context`
- c0065 --|> c0066: `inherits`
- c0066 --|> c0093: `inherits`
- c0069 --|> c0070: `inherits`
- c0070 --|> c0093: `inherits`
- c0072 --|> c0073: `inherits`
- c0073 --> c0076: `field entity_type`
- c0073 --|> c0093: `inherits`
- c0074 --|> c0075: `inherits`
- c0075 --|> c0093: `inherits`
- c0079 --> c0080: `field knowledge`
- c0079 ..> c0082: `type in get`
- c0079 ..> c0082: `type in search`
- c0079 ..> c0083: `type in create`
- c0079 ..> c0084: `type in create`
- c0079 ..> c0086: `type in queryMemory`
- c0079 ..> c0091: `type in createProject`
- c0079 ..> c0091: `type in linkProject`
- c0079 ..> c0091: `type in listProjects`
- c0079 ..> c0092: `type in createProject`
- c0079 ..> c0095: `type in queryMemory`
- c0079 ..> c0095: `type in search`
- c0080 ..> c0065: `type in createCodeArtifact`
- c0080 ..> c0065: `type in getCodeArtifact`
- c0080 ..> c0065: `type in updateCodeArtifact`
- c0080 ..> c0066: `type in createCodeArtifact`
- c0080 ..> c0066: `type in updateCodeArtifact`
- c0080 ..> c0067: `type in listCodeArtifacts`
- c0080 ..> c0069: `type in createDocument`
- c0080 ..> c0069: `type in getDocument`
- c0080 ..> c0069: `type in updateDocument`
- c0080 ..> c0070: `type in createDocument`
- c0080 ..> c0070: `type in updateDocument`
- c0080 ..> c0071: `type in listDocuments`
- c0080 ..> c0072: `type in createEntity`
- c0080 ..> c0072: `type in getEntity`
- c0080 ..> c0072: `type in searchEntities`
- c0080 ..> c0072: `type in updateEntity`
- c0080 ..> c0073: `type in createEntity`
- c0080 ..> c0073: `type in updateEntity`
- c0080 ..> c0074: `type in createRelationship`
- c0080 ..> c0074: `type in getRelationships`
- c0080 ..> c0075: `type in createRelationship`
- c0080 ..> c0078: `type in listFiles`
- c0080 ..> c0082: `type in updateMemory`
- c0080 ..> c0084: `type in updateMemory`
- c0080 ..> c0096: `type in getFile`
- c0081 --> c0082: `field memory`
- c0082 --|> c0084: `inherits`
- c0085 ..> c0088: `type in complete`
- c0085 ..> c0088: `type in prepareCapture`
- c0086 --> c0081: `field linked_memories`
- c0086 --> c0082: `field primary_memories`
- c0088 --> c0068: `field onConversationCompacted`
- c0088 --> c0087: `field readTools`
- c0088 --> c0090: `field submission`
- c0096 --|> c0078: `inherits`
- c0097 --> c0091: `field project`
- c0098 ..> c0098: `buildEncodePrompt() calls bundledSkillPaths()`
- c0098 ..> c0151: `buildEncodePrompt() calls readFile()`
- c0098 ..> c0218: `buildEncodePrompt() calls trim()`
- c0102 --> c0099: `field outcome`
- c0102 --> c0103: `field state`
- c0104 ..> c0022: `type in checkpoint`
- c0104 ..> c0023: `type in checkpoint`
- c0104 ..> c0064: `type in enqueue`
- c0104 ..> c0077: `type in resolveConflict`
- c0107 --> c0091: `field projects`
- c0107 --|> c0097: `inherits`
- c0108 --> c0050: `field createCapture`
- c0108 --> c0050: `field createRecall`
- c0108 --> c0079: `field client`
- c0108 --> c0079: `field createCapture`
- c0108 --> c0079: `field createClient`
- c0108 --> c0079: `field createRecall`
- c0108 --> c0104: `field capture`
- c0108 --> c0104: `field createCapture`
- c0108 --> c0107: `field resolveWorkContext`
- c0108 --> c0116: `field createRecall`
- c0108 --> c0116: `field recall`
- c0108 --> c0182: `field createCapture`
- c0108 --> c0182: `field createRecall`
- c0109 --> c0053: `field config`
- c0109 --> c0108: `field dependencies`
- c0109 --> c0111: `field policies`
- c0112 --> c0050: `field config`
- c0112 --> c0079: `field client`
- c0112 --> c0107: `field context`
- c0112 --> c0116: `field recall`
- c0112 --> c0170: `field logger`
- c0112 --> c0182: `field model`
- c0113 --> c0094: `field scope`
- c0115 --> c0118: `field runtime`
- c0115 --> c0212: `field promise`
- c0115 --> c0212: `field result`
- c0116 ..> c0077: `type in recall`
- c0116 ..> c0209: `type in deeper`
- c0116 ..> c0211: `type in recall`
- c0116 ..> c0212: `type in deeper`
- c0116 ..> c0212: `type in recall`
- c0117 --> c0094: `field scope`
- c0118 --> c0004: `field activity`
- c0118 --> c0020: `field captureDeferrals`
- c0118 --> c0023: `field capturePass`
- c0118 --> c0023: `field recoveryResult`
- c0118 --> c0050: `field config`
- c0118 --> c0079: `field client`
- c0118 --> c0103: `field pendingCaptureJobs`
- c0118 --> c0104: `field capture`
- c0118 --> c0107: `field context`
- c0118 --> c0113: `field lastRecall`
- c0118 --> c0116: `field recall`
- c0118 --> c0170: `field logger`
- c0118 --> c0182: `field model`
- c0118 --> c0190: `field queue`
- c0120 --> c0100: `field automaticRecalls`
- c0120 --> c0110: `field pendingQueuedRecall`
- c0120 --> c0115: `field recallJobs`
- c0120 --> c0118: `field loading`
- c0120 --> c0118: `field runtime`
- c0121 ..> c0004: `collectCaptureFeedback() calls set()`
- c0121 ..> c0004: `diagnosticCandidateDetail() calls set()`
- c0121 ..> c0004: `pickMemoryModel() calls refresh()`
- c0121 ..> c0023: `type in captureProcessedJobIds`
- c0121 ..> c0023: `type in readCaptureOutcome`
- c0121 ..> c0040: `findResolutionConflict() calls pendingConflicts()`
- c0121 ..> c0040: `log() calls emit()`
- c0121 ..> c0040: `logFailure() calls emit()`
- c0121 ..> c0040: `readCaptureOutcome() calls diagnostics()`
- c0121 ..> c0040: `recordRecallActivity() calls emit()`
- c0121 ..> c0040: `textMessage() calls now()`
- c0121 ..> c0050: `type in log`
- c0121 ..> c0050: `type in logFailure`
- c0121 ..> c0050: `type in makeInstanceId`
- c0121 ..> c0050: `type in policyText`
- c0121 ..> c0050: `type in promptSetupEndpoint`
- c0121 ..> c0054: `type in parseSelection`
- c0121 ..> c0060: `type in log`
- c0121 ..> c0077: `type in recallContextEntries`
- c0121 ..> c0077: `type in resolutionEvidence`
- c0121 ..> c0098: `createForgetfulExtension() calls bundledSkillPaths()`
- c0121 ..> c0099: `type in automaticCaptureJobOutcome`
- c0121 ..> c0099: `type in readCaptureOutcome`
- c0121 ..> c0099: `type in recordCaptureRetry`
- c0121 ..> c0101: `type in boundedWait`
- c0121 ..> c0102: `type in automaticCaptureFeedback`
- c0121 ..> c0102: `type in collectCaptureFeedback`
- c0121 ..> c0102: `type in recordCaptureRetry`
- c0121 ..> c0104: `type in readCaptureOutcome`
- c0121 ..> c0106: `type in collectDiagnosticParts`
- c0121 ..> c0107: `type in defaultWorkContext`
- c0121 ..> c0107: `type in discoverWorkContext`
- c0121 ..> c0107: `type in snapshotWorkContext`
- c0121 ..> c0109: `type in createForgetfulExtension`
- c0121 ..> c0111: `type in policyText`
- c0121 ..> c0113: `type in recallActivitySummary`
- c0121 ..> c0118: `type in conflictBelongsToActiveBranch`
- c0121 ..> c0118: `type in findResolutionConflict`
- c0121 ..> c0118: `type in readCaptureOutcome`
- c0121 ..> c0118: `type in recordRecallActivity`
- c0121 ..> c0119: `type in promptSetupAuthentication`
- c0121 ..> c0121: `automaticCaptureFeedback() calls captureCount()`
- c0121 ..> c0121: `automaticCaptureFeedback() calls captureFeedbackParts()`
- c0121 ..> c0121: `automaticCaptureFeedback() calls collectCaptureFeedback()`
- c0121 ..> c0121: `automaticCaptureJobOutcome() calls boundedErrorDiagnostic()`
- c0121 ..> c0121: `automaticCaptureJobOutcome() calls captureFeedbackReason()`
- c0121 ..> c0121: `automaticRecallTerminalText() calls usefulRecallText()`
- c0121 ..> c0121: `canonicalRepository() calls qualifiedRepository()`
- c0121 ..> c0121: `captureFeedbackParts() calls captureCount()`
- c0121 ..> c0121: `captureFeedbackParts() calls skippedReasonBreakdown()`
- c0121 ..> c0121: `collectCaptureFeedback() calls recordCaptureRetry()`
- c0121 ..> c0121: `collectDiagnosticParts() calls diagnosticCandidateDetail()`
- c0121 ..> c0121: `createForgetfulExtension() calls logFailure()`
- c0121 ..> c0121: `createForgetfulExtension() calls notify()`
- c0121 ..> c0121: `createForgetfulExtension() calls sessionKey()`
- c0121 ..> c0121: `diagnosticCandidateDetail() calls diagnosticSourceIds()`
- c0121 ..> c0121: `diagnosticSummary() calls collectDiagnosticParts()`
- c0121 ..> c0121: `discoverWorkContext() calls canonicalRepository()`
- c0121 ..> c0121: `discoverWorkContext() calls defaultWorkContext()`
- c0121 ..> c0121: `findResolutionConflict() calls conflictBelongsToActiveBranch()`
- c0121 ..> c0121: `latestBranchUserEntry() calls messageContentText()`
- c0121 ..> c0121: `latestContextUserPrompt() calls messageContentText()`
- c0121 ..> c0121: `log() calls notify()`
- c0121 ..> c0121: `logFailure() calls boundedErrorDiagnostic()`
- c0121 ..> c0121: `logFailure() calls log()`
- c0121 ..> c0121: `pickMemoryModel() calls parseSelection()`
- c0121 ..> c0121: `promptSetupAuthentication() calls notify()`
- c0121 ..> c0121: `promptSetupEndpoint() calls notify()`
- c0121 ..> c0121: `promptSetupEndpoint() calls setupEndpointSuggestion()`
- c0121 ..> c0121: `readCaptureOutcome() calls automaticCaptureJobOutcome()`
- c0121 ..> c0121: `recallContextEntries() calls messageContentText()`
- c0121 ..> c0121: `recordRecallActivity() calls log()`
- c0121 ..> c0121: `recordRecallActivity() calls recallActivitySummary()`
- c0121 ..> c0121: `resolutionEvidence() calls messageContentText()`
- c0121 ..> c0121: `savedRecallResultText() calls usefulRecallText()`
- c0121 ..> c0122: `createForgetfulExtension() calls registerForegroundTool()`
- c0121 ..> c0126: `collectCaptureFeedback() calls get()`
- c0121 ..> c0126: `diagnosticCandidateDetail() calls get()`
- c0121 ..> c0126: `log() calls get()`
- c0121 ..> c0126: `logFailure() calls get()`
- c0121 ..> c0126: `resolutionEvidence() calls get()`
- c0121 ..> c0185: `pickMemoryModel() calls availableMemoryModels()`
- c0121 ..> c0185: `pickMemoryModel() calls modelLabel()`
- c0121 ..> c0185: `pickMemoryModel() calls modelSelectionFromModel()`
- c0121 ..> c0186: `automaticCaptureJobOutcome() calls sanitizeText()`
- c0121 ..> c0186: `automaticRecallTerminalText() calls sanitizeText()`
- c0121 ..> c0186: `boundedErrorDiagnostic() calls sanitizeText()`
- c0121 ..> c0186: `captureFeedbackReason() calls sanitizeText()`
- c0121 ..> c0186: `captureJobId() calls sanitizeText()`
- c0121 ..> c0186: `captureProcessedJobIds() calls sanitizeText()`
- c0121 ..> c0186: `diagnosticCandidateDetail() calls sanitizeText()`
- c0121 ..> c0186: `diagnosticSourceIds() calls sanitizeText()`
- c0121 ..> c0186: `log() calls sanitizeText()`
- c0121 ..> c0186: `recallActivitySummary() calls sanitizeText()`
- c0121 ..> c0186: `recallContextEntries() calls sanitizeText()`
- c0121 ..> c0186: `recordRecallActivity() calls sanitizeText()`
- c0121 ..> c0186: `resolutionEvidence() calls isMemoryOperation()`
- c0121 ..> c0186: `resolutionEvidence() calls sanitizeText()`
- c0121 ..> c0186: `usefulRecallText() calls sanitizeText()`
- c0121 ..> c0212: `type in automaticRecallResultStatus`
- c0121 ..> c0212: `type in automaticRecallTerminalText`
- c0121 ..> c0212: `type in recordRecallActivity`
- c0121 ..> c0212: `type in savedRecallResultText`
- c0121 ..> c0212: `type in usefulRecallText`
- c0121 ..> c0218: `canonicalRepository() calls trim()`
- c0121 ..> c0218: `captureFeedbackReason() calls trim()`
- c0121 ..> c0218: `createForgetfulExtension() calls trim()`
- c0121 ..> c0218: `promptSetupAuthentication() calls trim()`
- c0121 ..> c0218: `promptSetupEndpoint() calls trim()`
- c0121 ..> c0218: `recallContextEntries() calls trim()`
- c0121 ..> c0218: `resolutionEvidence() calls trim()`
- c0121 ..> c0218: `setupEndpointSuggestion() calls trim()`
- c0121 ..> c0218: `usefulRecallText() calls trim()`
- c0121 ..> c0219: `qualifiedRepository() calls repositoryName()`
- c0123 ..> c0065: `type in createCodeArtifact`
- c0123 ..> c0065: `type in getCodeArtifact`
- c0123 ..> c0066: `type in createCodeArtifact`
- c0123 ..> c0066: `type in updateCodeArtifact`
- c0123 ..> c0067: `type in listCodeArtifacts`
- c0123 ..> c0069: `type in createDocument`
- c0123 ..> c0069: `type in getDocument`
- c0123 ..> c0070: `type in createDocument`
- c0123 ..> c0070: `type in updateDocument`
- c0123 ..> c0071: `type in listDocuments`
- c0123 ..> c0072: `type in createEntity`
- c0123 ..> c0072: `type in getEntity`
- c0123 ..> c0072: `type in searchEntities`
- c0123 ..> c0073: `type in createEntity`
- c0123 ..> c0073: `type in updateEntity`
- c0123 ..> c0074: `type in getRelationships`
- c0123 ..> c0075: `type in createRelationship`
- c0123 ..> c0078: `type in listFiles`
- c0123 ..|> c0080: `implements`
- c0123 --> c0082: `field parseMemory`
- c0123 ..> c0082: `type in constructor`
- c0123 ..> c0084: `type in updateMemory`
- c0123 ..> c0096: `type in getFile`
- c0123 --> c0124: `field request`
- c0123 ..> c0124: `type in constructor`
- c0123 ..> c0125: `createCodeArtifact() calls artifact()`
- c0123 ..> c0125: `createCodeArtifact() calls resourceBody()`
- c0123 ..> c0125: `createDocument() calls document()`
- c0123 ..> c0125: `createDocument() calls resourceBody()`
- c0123 ..> c0125: `createEntity() calls entity()`
- c0123 ..> c0125: `createEntity() calls entityBody()`
- c0123 ..> c0125: `createRelationship() calls id()`
- c0123 ..> c0125: `createRelationship() calls relationship()`
- c0123 ..> c0125: `createRelationship() calls relationshipBody()`
- c0123 ..> c0125: `getCodeArtifact() calls artifact()`
- c0123 ..> c0125: `getCodeArtifact() calls id()`
- c0123 ..> c0125: `getDocument() calls document()`
- c0123 ..> c0125: `getDocument() calls id()`
- c0123 ..> c0125: `getEntity() calls entity()`
- c0123 ..> c0125: `getEntity() calls id()`
- c0123 ..> c0125: `getEntityMemories() calls id()`
- c0123 ..> c0125: `getEntityMemories() calls object()`
- c0123 ..> c0125: `getEntityMemories() calls records()`
- c0123 ..> c0125: `getEntityMemories() calls text()`
- c0123 ..> c0125: `getFile() calls fileSummary()`
- c0123 ..> c0125: `getFile() calls id()`
- c0123 ..> c0125: `getFile() calls object()`
- c0123 ..> c0125: `getFile() calls text()`
- c0123 ..> c0125: `getRelationships() calls id()`
- c0123 ..> c0125: `getRelationships() calls records()`
- c0123 ..> c0125: `linkEntityMemory() calls id()`
- c0123 ..> c0125: `linkEntityMemory() calls object()`
- c0123 ..> c0125: `linkMemories() calls id()`
- c0123 ..> c0125: `linkMemories() calls ids()`
- c0123 ..> c0125: `linkMemories() calls object()`
- c0123 ..> c0125: `listCodeArtifacts() calls projectPath()`
- c0123 ..> c0125: `listCodeArtifacts() calls records()`
- c0123 ..> c0125: `listCodeArtifacts() calls summary()`
- c0123 ..> c0125: `listDocuments() calls projectPath()`
- c0123 ..> c0125: `listDocuments() calls records()`
- c0123 ..> c0125: `listDocuments() calls summary()`
- c0123 ..> c0125: `listFiles() calls projectPath()`
- c0123 ..> c0125: `listFiles() calls records()`
- c0123 ..> c0125: `searchEntities() calls records()`
- c0123 ..> c0125: `unlinkMemories() calls id()`
- c0123 ..> c0125: `unlinkMemories() calls object()`
- c0123 ..> c0125: `updateCodeArtifact() calls artifact()`
- c0123 ..> c0125: `updateCodeArtifact() calls id()`
- c0123 ..> c0125: `updateCodeArtifact() calls resourceBody()`
- c0123 ..> c0125: `updateDocument() calls document()`
- c0123 ..> c0125: `updateDocument() calls id()`
- c0123 ..> c0125: `updateDocument() calls resourceBody()`
- c0123 ..> c0125: `updateEntity() calls entity()`
- c0123 ..> c0125: `updateEntity() calls entityBody()`
- c0123 ..> c0125: `updateEntity() calls id()`
- c0123 ..> c0125: `updateMemory() calls id()`
- c0123 ..> c0125: `updateMemory() calls ids()`
- c0123 ..> c0125: `updateMemory() calls memoryMetadata()`
- c0123 ..> c0125: `updateMemory() calls object()`
- c0123 ..> c0125: `updateMemory() calls strings()`
- c0123 ..> c0125: `updateMemory() calls text()`
- c0123 ..> c0126: `createCodeArtifact() calls request()`
- c0123 ..> c0126: `createDocument() calls request()`
- c0123 ..> c0126: `createEntity() calls request()`
- c0123 ..> c0126: `createRelationship() calls request()`
- c0123 ..> c0126: `getCodeArtifact() calls request()`
- c0123 ..> c0126: `getDocument() calls request()`
- c0123 ..> c0126: `getEntity() calls request()`
- c0123 ..> c0126: `getEntityMemories() calls request()`
- c0123 ..> c0126: `getFile() calls request()`
- c0123 ..> c0126: `getRelationships() calls request()`
- c0123 ..> c0126: `linkEntityMemory() calls request()`
- c0123 ..> c0126: `linkMemories() calls request()`
- c0123 ..> c0126: `listCodeArtifacts() calls request()`
- c0123 ..> c0126: `listDocuments() calls request()`
- c0123 ..> c0126: `listFiles() calls request()`
- c0123 ..> c0126: `searchEntities() calls request()`
- c0123 ..> c0126: `unlinkMemories() calls request()`
- c0123 ..> c0126: `updateCodeArtifact() calls request()`
- c0123 ..> c0126: `updateDocument() calls request()`
- c0123 ..> c0126: `updateEntity() calls request()`
- c0123 ..> c0126: `updateMemory() calls request()`
- c0123 ..> c0130: `getFile() constructs ForgetfulSchemaError`
- c0123 ..> c0130: `linkEntityMemory() constructs ForgetfulSchemaError`
- c0123 ..> c0130: `linkMemories() constructs ForgetfulSchemaError`
- c0123 ..> c0130: `searchEntities() constructs ForgetfulSchemaError`
- c0123 ..> c0130: `unlinkMemories() constructs ForgetfulSchemaError`
- c0123 ..> c0132: `linkMemories() calls parseMemory()`
- c0123 ..> c0132: `updateMemory() calls parseMemory()`
- c0123 ..> c0218: `searchEntities() calls trim()`
- c0125 ..> c0065: `type in artifact`
- c0125 ..> c0066: `type in resourceBody`
- c0125 ..> c0067: `type in summary`
- c0125 ..> c0069: `type in document`
- c0125 ..> c0070: `type in resourceBody`
- c0125 ..> c0071: `type in summary`
- c0125 ..> c0072: `type in entity`
- c0125 ..> c0073: `type in entityBody`
- c0125 ..> c0074: `type in relationship`
- c0125 ..> c0075: `type in relationshipBody`
- c0125 ..> c0078: `type in fileSummary`
- c0125 ..> c0093: `type in provenance`
- c0125 ..> c0125: `artifact() calls id()`
- c0125 ..> c0125: `artifact() calls object()`
- c0125 ..> c0125: `artifact() calls resourceBody()`
- c0125 ..> c0125: `document() calls id()`
- c0125 ..> c0125: `document() calls object()`
- c0125 ..> c0125: `document() calls resourceBody()`
- c0125 ..> c0125: `entity() calls entityBody()`
- c0125 ..> c0125: `entity() calls id()`
- c0125 ..> c0125: `entity() calls object()`
- c0125 ..> c0125: `entityBody() calls ids()`
- c0125 ..> c0125: `entityBody() calls object()`
- c0125 ..> c0125: `entityBody() calls provenance()`
- c0125 ..> c0125: `entityBody() calls strings()`
- c0125 ..> c0125: `entityBody() calls text()`
- c0125 ..> c0125: `fileSummary() calls id()`
- c0125 ..> c0125: `fileSummary() calls object()`
- c0125 ..> c0125: `fileSummary() calls strings()`
- c0125 ..> c0125: `fileSummary() calls text()`
- c0125 ..> c0125: `memoryMetadata() calls ids()`
- c0125 ..> c0125: `memoryMetadata() calls provenance()`
- c0125 ..> c0125: `projectPath() calls id()`
- c0125 ..> c0125: `provenance() calls strings()`
- c0125 ..> c0125: `provenance() calls text()`
- c0125 ..> c0125: `records() calls object()`
- c0125 ..> c0125: `relationship() calls id()`
- c0125 ..> c0125: `relationship() calls object()`
- c0125 ..> c0125: `relationship() calls relationshipBody()`
- c0125 ..> c0125: `relationshipBody() calls id()`
- c0125 ..> c0125: `relationshipBody() calls object()`
- c0125 ..> c0125: `relationshipBody() calls provenance()`
- c0125 ..> c0125: `relationshipBody() calls text()`
- c0125 ..> c0125: `resourceBody() calls id()`
- c0125 ..> c0125: `resourceBody() calls object()`
- c0125 ..> c0125: `resourceBody() calls provenance()`
- c0125 ..> c0125: `resourceBody() calls strings()`
- c0125 ..> c0125: `resourceBody() calls text()`
- c0125 ..> c0125: `summary() calls id()`
- c0125 ..> c0125: `summary() calls object()`
- c0125 ..> c0125: `summary() calls provenance()`
- c0125 ..> c0125: `summary() calls strings()`
- c0125 ..> c0125: `summary() calls text()`
- c0125 ..> c0130: `entityBody() constructs ForgetfulSchemaError`
- c0125 ..> c0130: `fileSummary() constructs ForgetfulSchemaError`
- c0125 ..> c0130: `id() constructs ForgetfulSchemaError`
- c0125 ..> c0130: `ids() constructs ForgetfulSchemaError`
- c0125 ..> c0130: `object() constructs ForgetfulSchemaError`
- c0125 ..> c0130: `records() constructs ForgetfulSchemaError`
- c0125 ..> c0130: `strings() constructs ForgetfulSchemaError`
- c0125 ..> c0130: `text() constructs ForgetfulSchemaError`
- c0125 ..> c0218: `text() calls trim()`
- c0126 ..> c0004: `listProjects() calls set()`
- c0126 ..> c0004: `readResponse() calls set()`
- c0126 ..> c0040: `readResponse() calls read()`
- c0126 ..|> c0079: `implements`
- c0126 ..> c0082: `type in get`
- c0126 ..> c0082: `type in search`
- c0126 ..> c0083: `type in create`
- c0126 ..> c0084: `type in create`
- c0126 ..> c0084: `type in createBody`
- c0126 ..> c0086: `type in queryMemory`
- c0126 ..> c0091: `type in createProject`
- c0126 ..> c0091: `type in linkProject`
- c0126 ..> c0091: `type in listProjects`
- c0126 ..> c0092: `type in createProject`
- c0126 ..> c0095: `type in queryMemory`
- c0126 ..> c0095: `type in search`
- c0126 ..> c0125: `createBody() calls memoryMetadata()`
- c0126 ..> c0126: `create() calls createBody()`
- c0126 ..> c0126: `create() calls request()`
- c0126 ..> c0126: `createProject() calls request()`
- c0126 ..> c0126: `get() calls request()`
- c0126 ..> c0126: `get() calls validId()`
- c0126 ..> c0126: `getMemoryEntityIds() calls request()`
- c0126 ..> c0126: `getMemoryEntityIds() calls validId()`
- c0126 ..> c0126: `linkProject() calls request()`
- c0126 ..> c0126: `linkProject() calls validId()`
- c0126 ..> c0126: `listProjects() calls endpoint()`
- c0126 ..> c0126: `listProjects() calls request()`
- c0126 ..> c0126: `queryMemory() calls request()`
- c0126 ..> c0126: `readResponse() calls get()`
- c0126 ..> c0126: `request() calls endpoint()`
- c0126 ..> c0126: `request() calls fetchImpl()`
- c0126 ..> c0126: `request() calls readResponse()`
- c0126 ..> c0126: `request() calls responseByteLimit()`
- c0126 ..> c0126: `request() calls throwResponseError()`
- c0126 ..> c0126: `search() calls request()`
- c0126 ..> c0126: `supersede() calls request()`
- c0126 ..> c0126: `supersede() calls validId()`
- c0126 ..> c0126: `throwResponseError() calls readResponse()`
- c0126 ..> c0127: `type in constructor`
- c0126 ..> c0129: `throwResponseError() constructs ForgetfulHttpError`
- c0126 ..> c0130: `create() constructs ForgetfulSchemaError`
- c0126 ..> c0130: `getMemoryEntityIds() constructs ForgetfulSchemaError`
- c0126 ..> c0130: `listProjects() constructs ForgetfulSchemaError`
- c0126 ..> c0130: `readResponse() constructs ForgetfulSchemaError`
- c0126 ..> c0130: `supersede() constructs ForgetfulSchemaError`
- c0126 ..> c0131: `request() constructs ForgetfulTimeoutError`
- c0126 ..> c0132: `constructor() calls localHost()`
- c0126 ..> c0132: `constructor() calls trimTrailingSlashes()`
- c0126 ..> c0132: `create() calls integerArray()`
- c0126 ..> c0132: `create() calls isObject()`
- c0126 ..> c0132: `create() calls requiredInteger()`
- c0126 ..> c0132: `createProject() calls parseProject()`
- c0126 ..> c0132: `createProject() calls projectText()`
- c0126 ..> c0132: `get() calls parseMemory()`
- c0126 ..> c0132: `getMemoryEntityIds() calls directEntityId()`
- c0126 ..> c0132: `getMemoryEntityIds() calls isObject()`
- c0126 ..> c0132: `linkProject() calls parseProject()`
- c0126 ..> c0132: `listProjects() calls isObject()`
- c0126 ..> c0132: `listProjects() calls parseProject()`
- c0126 ..> c0132: `queryMemory() calls parseSearchPayload()`
- c0126 ..> c0132: `queryMemory() calls searchBody()`
- c0126 ..> c0132: `request() calls makeAbortError()`
- c0126 ..> c0132: `request() calls parseJson()`
- c0126 ..> c0132: `search() calls flattenSearchResult()`
- c0126 ..> c0132: `search() calls parseSearchPayload()`
- c0126 ..> c0132: `search() calls searchBody()`
- c0126 ..> c0132: `supersede() calls isObject()`
- c0126 ..> c0190: `readResponse() calls cancel()`
- c0126 ..> c0218: `supersede() calls trim()`
- c0126 ..> c0219: `createProject() calls repositoryName()`
- c0126 ..> c0219: `linkProject() calls repositoryName()`
- c0132 ..> c0004: `uniqueMemories() calls set()`
- c0132 ..> c0081: `type in parseLinkedMemories`
- c0132 ..> c0082: `type in flattenSearchResult`
- c0132 ..> c0082: `type in parseMemory`
- c0132 ..> c0082: `type in uniqueMemories`
- c0132 ..> c0086: `type in flattenSearchResult`
- c0132 ..> c0086: `type in parseSearchPayload`
- c0132 ..> c0091: `type in parseProject`
- c0132 ..> c0095: `type in addSearchProjectFilter`
- c0132 ..> c0095: `type in searchBody`
- c0132 ..> c0095: `type in validatedSearchOptions`
- c0132 ..> c0125: `parseMemory() calls memoryMetadata()`
- c0132 ..> c0128: `makeAbortError() constructs ForgetfulAbortError`
- c0132 ..> c0128: `type in makeAbortError`
- c0132 ..> c0130: `directEntityId() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `integerArray() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `nonNegativeInteger() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `optionalString() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `parseJson() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `parseLinkedMemories() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `parseMemory() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `parseProject() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `parseSearchPayload() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `requiredInteger() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `requiredString() constructs ForgetfulSchemaError`
- c0132 ..> c0130: `stringArray() constructs ForgetfulSchemaError`
- c0132 ..> c0132: `directEntityId() calls isObject()`
- c0132 ..> c0132: `directEntityId() calls requiredInteger()`
- c0132 ..> c0132: `flattenSearchResult() calls uniqueMemories()`
- c0132 ..> c0132: `parseLinkedMemories() calls isObject()`
- c0132 ..> c0132: `parseLinkedMemories() calls parseMemory()`
- c0132 ..> c0132: `parseLinkedMemories() calls requiredInteger()`
- c0132 ..> c0132: `parseMemory() calls integerArray()`
- c0132 ..> c0132: `parseMemory() calls isObject()`
- c0132 ..> c0132: `parseMemory() calls nonNegativeInteger()`
- c0132 ..> c0132: `parseMemory() calls optionalString()`
- c0132 ..> c0132: `parseMemory() calls requiredInteger()`
- c0132 ..> c0132: `parseMemory() calls requiredString()`
- c0132 ..> c0132: `parseMemory() calls stringArray()`
- c0132 ..> c0132: `parseProject() calls isObject()`
- c0132 ..> c0132: `parseProject() calls optionalString()`
- c0132 ..> c0132: `parseProject() calls requiredInteger()`
- c0132 ..> c0132: `parseProject() calls requiredString()`
- c0132 ..> c0132: `parseSearchPayload() calls isObject()`
- c0132 ..> c0132: `parseSearchPayload() calls nonNegativeInteger()`
- c0132 ..> c0132: `parseSearchPayload() calls parseLinkedMemories()`
- c0132 ..> c0132: `parseSearchPayload() calls parseMemory()`
- c0132 ..> c0132: `parseSearchPayload() calls requiredString()`
- c0132 ..> c0132: `searchBody() calls addSearchProjectFilter()`
- c0132 ..> c0132: `searchBody() calls validatedSearchOptions()`
- c0132 ..> c0218: `projectText() calls trim()`
- c0133 --> c0065: `field artifacts`
- c0133 --> c0069: `field documents`
- c0133 --> c0078: `field files`
- c0134 --> c0082: `field memories`
- c0134 --> c0094: `field scope`
- c0136 ..> c0004: `collectRelationships() calls set()`
- c0136 ..> c0004: `findEntities() calls set()`
- c0136 ..> c0004: `resolveRelationshipEndpoints() calls set()`
- c0136 ..> c0065: `type in appendArtifactLines`
- c0136 ..> c0069: `type in appendDocumentLines`
- c0136 ..> c0072: `type in appendEntityLines`
- c0136 ..> c0072: `type in collectEntityMemories`
- c0136 ..> c0072: `type in collectRelationships`
- c0136 ..> c0072: `type in findEntities`
- c0136 ..> c0072: `type in findEntityMemories`
- c0136 ..> c0072: `type in findRelationships`
- c0136 ..> c0072: `type in formatExpansion`
- c0136 ..> c0072: `type in formatRelationships`
- c0136 ..> c0072: `type in resolveRelationshipEndpoints`
- c0136 ..> c0074: `type in collectRelationships`
- c0136 ..> c0074: `type in formatRelationships`
- c0136 ..> c0074: `type in resolveRelationshipEndpoints`
- c0136 ..> c0078: `type in appendFileLines`
- c0136 --> c0080: `field client`
- c0136 ..> c0080: `type in constructor`
- c0136 ..> c0123: `collectRelationships() calls getRelationships()`
- c0136 ..> c0123: `findAttachments() calls getCodeArtifact()`
- c0136 ..> c0123: `findAttachments() calls getDocument()`
- c0136 ..> c0123: `findAttachments() calls listFiles()`
- c0136 ..> c0123: `findEntities() calls getEntity()`
- c0136 ..> c0123: `findEntities() calls searchEntities()`
- c0136 ..> c0123: `findEntityMemories() calls getEntityMemories()`
- c0136 ..> c0123: `resolveRelationshipEndpoints() calls getEntity()`
- c0136 ..> c0126: `formatRelationships() calls get()`
- c0136 ..> c0133: `type in findAttachments`
- c0136 ..> c0133: `type in formatExpansion`
- c0136 ..> c0134: `type in collectEntityMemories`
- c0136 ..> c0134: `type in expand`
- c0136 ..> c0134: `type in findAttachments`
- c0136 ..> c0134: `type in findEntities`
- c0136 ..> c0134: `type in findEntityMemories`
- c0136 ..> c0134: `type in findRelationships`
- c0136 ..> c0134: `type in formatRelationships`
- c0136 ..> c0134: `type in isAllowedEntityMemory`
- c0136 ..> c0135: `type in emptyExpansion`
- c0136 ..> c0135: `type in expand`
- c0136 ..> c0135: `type in formatExpansion`
- c0136 ..> c0136: `collectEntityMemories() calls isAllowedEntityMemory()`
- c0136 ..> c0136: `expand() calls emptyExpansion()`
- c0136 ..> c0136: `expand() calls findAttachments()`
- c0136 ..> c0136: `expand() calls findEntities()`
- c0136 ..> c0136: `expand() calls findEntityMemories()`
- c0136 ..> c0136: `expand() calls findRelationships()`
- c0136 ..> c0136: `expand() calls formatExpansion()`
- c0136 ..> c0136: `findEntityMemories() calls collectEntityMemories()`
- c0136 ..> c0136: `findRelationships() calls collectRelationships()`
- c0136 ..> c0136: `findRelationships() calls formatRelationships()`
- c0136 ..> c0136: `findRelationships() calls resolveRelationshipEndpoints()`
- c0136 ..> c0136: `formatExpansion() calls appendArtifactLines()`
- c0136 ..> c0136: `formatExpansion() calls appendDocumentLines()`
- c0136 ..> c0136: `formatExpansion() calls appendEntityLines()`
- c0136 ..> c0136: `formatExpansion() calls appendFileLines()`
- c0136 ..> c0136: `formatExpansion() calls appendLinkedMemoryLines()`
- c0136 ..> c0136: `formatExpansion() calls appendRelationshipLines()`
- c0136 ..> c0137: `type in constructor`
- c0136 ..> c0138: `type in appendLinkedMemoryLines`
- c0136 ..> c0138: `type in collectEntityMemories`
- c0136 ..> c0138: `type in findEntityMemories`
- c0136 ..> c0138: `type in formatExpansion`
- c0136 --> c0139: `field readMemory`
- c0136 ..> c0139: `type in constructor`
- c0136 ..> c0140: `type in appendRelationshipLines`
- c0136 ..> c0140: `type in findRelationships`
- c0136 ..> c0140: `type in formatExpansion`
- c0136 ..> c0140: `type in formatRelationships`
- c0136 ..> c0141: `appendArtifactLines() calls clean()`
- c0136 ..> c0141: `appendDocumentLines() calls clean()`
- c0136 ..> c0141: `appendEntityLines() calls clean()`
- c0136 ..> c0141: `appendFileLines() calls clean()`
- c0136 ..> c0141: `appendLinkedMemoryLines() calls clean()`
- c0136 ..> c0141: `appendRelationshipLines() calls clean()`
- c0136 ..> c0141: `collectEntityMemories() calls validId()`
- c0136 ..> c0141: `collectRelationships() calls safeCall()`
- c0136 ..> c0141: `collectRelationships() calls validRelationship()`
- c0136 ..> c0141: `findAttachments() calls inProjectScope()`
- c0136 ..> c0141: `findAttachments() calls safeCall()`
- c0136 ..> c0141: `findAttachments() calls validId()`
- c0136 ..> c0141: `findEntities() calls inEntityScope()`
- c0136 ..> c0141: `findEntities() calls safeCall()`
- c0136 ..> c0141: `findEntities() calls validEntity()`
- c0136 ..> c0141: `findEntityMemories() calls safeCall()`
- c0136 ..> c0141: `formatRelationships() calls inEntityScope()`
- c0136 ..> c0141: `isAllowedEntityMemory() calls safeCall()`
- c0136 ..> c0141: `isAllowedEntityMemory() calls validMemory()`
- c0136 ..> c0141: `resolveRelationshipEndpoints() calls safeCall()`
- c0136 ..> c0141: `resolveRelationshipEndpoints() calls validEntity()`
- c0136 ..> c0218: `findEntities() calls trim()`
- c0137 --> c0139: `field readMemory`
- c0138 --> c0072: `field entity`
- c0140 --> c0072: `field source`
- c0140 --> c0072: `field target`
- c0140 --> c0074: `field relationship`
- c0141 ..> c0072: `type in inEntityScope`
- c0141 ..> c0072: `type in validEntity`
- c0141 ..> c0074: `type in validRelationship`
- c0141 ..> c0082: `type in validMemory`
- c0141 ..> c0094: `type in inEntityScope`
- c0141 ..> c0094: `type in inProjectScope`
- c0141 ..> c0141: `inEntityScope() calls validId()`
- c0141 ..> c0141: `inProjectScope() calls validId()`
- c0141 ..> c0141: `validEntity() calls validId()`
- c0141 ..> c0141: `validMemory() calls validId()`
- c0141 ..> c0141: `validRelationship() calls validId()`
- c0141 ..> c0186: `clean() calls sanitizeText()`
- c0141 ..> c0218: `validRelationship() calls trim()`
- c0142 --> c0079: `field client`
- c0142 --> c0080: `field knowledge`
- c0142 --> c0143: `field request`
- c0142 --> c0144: `field context`
- c0144 --> c0094: `field scope`
- c0145 --> c0096: `field file`
- c0145 --> c0149: `field content`
- c0145 --> c0150: `field content`
- c0146 --> c0079: `field client`
- c0146 --> c0080: `field knowledge`
- c0146 --> c0144: `field context`
- c0146 --> c0147: `field request`
- c0151 ..> c0065: `type in page`
- c0151 ..> c0069: `type in page`
- c0151 ..> c0072: `type in assertReadEntity`
- c0151 ..> c0072: `type in entityInProject`
- c0151 ..> c0072: `type in hydrateEntities`
- c0151 ..> c0072: `type in inEntityProject`
- c0151 ..> c0076: `type in isEntityType`
- c0151 ..> c0079: `type in assertReadMemory`
- c0151 ..> c0079: `type in createMemory`
- c0151 ..> c0079: `type in executeKnowledgeRead`
- c0151 ..> c0079: `type in executeKnowledgeWrite`
- c0151 ..> c0079: `type in memoryInProject`
- c0151 ..> c0079: `type in resolveWriteProject`
- c0151 ..> c0079: `type in rich`
- c0151 ..> c0080: `type in assertReadEntity`
- c0151 ..> c0080: `type in createCodeArtifact`
- c0151 ..> c0080: `type in createDocument`
- c0151 ..> c0080: `type in createEntity`
- c0151 ..> c0080: `type in entityInProject`
- c0151 ..> c0080: `type in hydrateEntities`
- c0151 ..> c0080: `type in requireReadKnowledge`
- c0151 ..> c0080: `type in rich`
- c0151 ..> c0080: `type in validateAttachments`
- c0151 ..> c0082: `type in assertReadMemory`
- c0151 ..> c0082: `type in inMemoryProject`
- c0151 ..> c0082: `type in memoryInProject`
- c0151 ..> c0082: `type in replacementMemory`
- c0151 ..> c0093: `type in updateProvenance`
- c0151 ..> c0096: `type in fileContent`
- c0151 ..> c0123: `assertReadEntity() calls getEntity()`
- c0151 ..> c0123: `createCodeArtifact() calls createCodeArtifact()`
- c0151 ..> c0123: `createDocument() calls createDocument()`
- c0151 ..> c0123: `createEntity() calls createEntity()`
- c0151 ..> c0123: `createRelationship() calls createRelationship()`
- c0151 ..> c0123: `entityInProject() calls getEntity()`
- c0151 ..> c0123: `hydrateEntities() calls getEntity()`
- c0151 ..> c0123: `linkEntityMemory() calls linkEntityMemory()`
- c0151 ..> c0123: `linkMemories() calls linkMemories()`
- c0151 ..> c0123: `readCodeArtifact() calls getCodeArtifact()`
- c0151 ..> c0123: `readCodeArtifacts() calls listCodeArtifacts()`
- c0151 ..> c0123: `readDocument() calls getDocument()`
- c0151 ..> c0123: `readDocuments() calls listDocuments()`
- c0151 ..> c0123: `readEntities() calls searchEntities()`
- c0151 ..> c0123: `readEntityMemories() calls getEntityMemories()`
- c0151 ..> c0123: `readFile() calls getFile()`
- c0151 ..> c0123: `readFiles() calls listFiles()`
- c0151 ..> c0123: `readRelationships() calls getEntity()`
- c0151 ..> c0123: `readRelationships() calls getRelationships()`
- c0151 ..> c0123: `updateCodeArtifact() calls getCodeArtifact()`
- c0151 ..> c0123: `updateCodeArtifact() calls updateCodeArtifact()`
- c0151 ..> c0123: `updateDocument() calls getDocument()`
- c0151 ..> c0123: `updateDocument() calls updateDocument()`
- c0151 ..> c0123: `updateEntity() calls updateEntity()`
- c0151 ..> c0123: `updateMemory() calls updateMemory()`
- c0151 ..> c0123: `validateAttachments() calls getCodeArtifact()`
- c0151 ..> c0123: `validateAttachments() calls getDocument()`
- c0151 ..> c0123: `validateAttachments() calls getFile()`
- c0151 ..> c0126: `assertReadMemory() calls get()`
- c0151 ..> c0126: `createMemory() calls create()`
- c0151 ..> c0126: `memoryInProject() calls get()`
- c0151 ..> c0126: `readEntityMemories() calls get()`
- c0151 ..> c0126: `readMemories() calls queryMemory()`
- c0151 ..> c0126: `readProjects() calls listProjects()`
- c0151 ..> c0126: `replacementMemory() calls create()`
- c0151 ..> c0126: `replacementMemory() calls get()`
- c0151 ..> c0126: `resolveWriteProject() calls listProjects()`
- c0151 ..> c0126: `supersedeMemory() calls supersede()`
- c0151 ..> c0142: `type in readCodeArtifact`
- c0151 ..> c0142: `type in readCodeArtifacts`
- c0151 ..> c0142: `type in readDocument`
- c0151 ..> c0142: `type in readDocuments`
- c0151 ..> c0142: `type in readEntities`
- c0151 ..> c0142: `type in readEntity`
- c0151 ..> c0142: `type in readEntityMemories`
- c0151 ..> c0142: `type in readFile`
- c0151 ..> c0142: `type in readFiles`
- c0151 ..> c0142: `type in readMemories`
- c0151 ..> c0142: `type in readMemory`
- c0151 ..> c0142: `type in readProjects`
- c0151 ..> c0142: `type in readRelationships`
- c0151 ..> c0142: `type in requestedReadProject`
- c0151 ..> c0142: `type in requireReadKnowledge`
- c0151 ..> c0143: `type in executeKnowledgeRead`
- c0151 ..> c0143: `type in validateKnowledgeReadRequest`
- c0151 ..> c0144: `type in assertReadEntity`
- c0151 ..> c0144: `type in assertReadMemory`
- c0151 ..> c0144: `type in createCodeArtifact`
- c0151 ..> c0144: `type in createDocument`
- c0151 ..> c0144: `type in createEntity`
- c0151 ..> c0144: `type in createMemory`
- c0151 ..> c0144: `type in currentProject`
- c0151 ..> c0144: `type in effectiveCommit`
- c0151 ..> c0144: `type in executeKnowledgeRead`
- c0151 ..> c0144: `type in executeKnowledgeWrite`
- c0151 ..> c0144: `type in provenance`
- c0151 ..> c0144: `type in resolveWriteProject`
- c0151 ..> c0144: `type in updateProvenance`
- c0151 ..> c0145: `type in createCodeArtifact`
- c0151 ..> c0145: `type in createDocument`
- c0151 ..> c0145: `type in createEntity`
- c0151 ..> c0145: `type in createMemory`
- c0151 ..> c0145: `type in createRelationship`
- c0151 ..> c0145: `type in executeKnowledgeRead`
- c0151 ..> c0145: `type in executeKnowledgeWrite`
- c0151 ..> c0145: `type in linkEntityMemory`
- c0151 ..> c0145: `type in linkMemories`
- c0151 ..> c0145: `type in readCodeArtifact`
- c0151 ..> c0145: `type in readCodeArtifacts`
- c0151 ..> c0145: `type in readDocument`
- c0151 ..> c0145: `type in readDocuments`
- c0151 ..> c0145: `type in readEntities`
- c0151 ..> c0145: `type in readEntity`
- c0151 ..> c0145: `type in readEntityMemories`
- c0151 ..> c0145: `type in readFile`
- c0151 ..> c0145: `type in readFiles`
- c0151 ..> c0145: `type in readMemories`
- c0151 ..> c0145: `type in readMemory`
- c0151 ..> c0145: `type in readProjects`
- c0151 ..> c0145: `type in readRelationships`
- c0151 ..> c0145: `type in readResult`
- c0151 ..> c0145: `type in supersedeMemory`
- c0151 ..> c0145: `type in updateCodeArtifact`
- c0151 ..> c0145: `type in updateDocument`
- c0151 ..> c0145: `type in updateEntity`
- c0151 ..> c0145: `type in updateMemory`
- c0151 ..> c0145: `type in writeResult`
- c0151 ..> c0146: `type in createRelationship`
- c0151 ..> c0146: `type in linkEntityMemory`
- c0151 ..> c0146: `type in linkMemories`
- c0151 ..> c0146: `type in replacementMemory`
- c0151 ..> c0146: `type in supersedeMemory`
- c0151 ..> c0146: `type in updateCodeArtifact`
- c0151 ..> c0146: `type in updateDocument`
- c0151 ..> c0146: `type in updateEntity`
- c0151 ..> c0146: `type in updateMemory`
- c0151 ..> c0147: `type in executeKnowledgeWrite`
- c0151 ..> c0147: `type in validateKnowledgeWriteRequest`
- c0151 ..> c0148: `type in resolveWriteProject`
- c0151 ..> c0149: `type in fileContent`
- c0151 ..> c0150: `type in fileContent`
- c0151 ..> c0151: `assertReadEntity() calls currentProject()`
- c0151 ..> c0151: `assertReadEntity() calls inEntityProject()`
- c0151 ..> c0151: `assertReadMemory() calls currentProject()`
- c0151 ..> c0151: `assertReadMemory() calls inMemoryProject()`
- c0151 ..> c0151: `boundedId() calls optionalId()`
- c0151 ..> c0151: `boundedListPage() calls compactWriteValue()`
- c0151 ..> c0151: `boundedListPage() calls json()`
- c0151 ..> c0151: `boundedListPage() calls listPage()`
- c0151 ..> c0151: `commit() calls optionalText()`
- c0151 ..> c0151: `compactObjectEntry() calls compactWriteValue()`
- c0151 ..> c0151: `compactWriteValue() calls compactObjectEntry()`
- c0151 ..> c0151: `compactWriteValue() calls compactString()`
- c0151 ..> c0151: `createCodeArtifact() calls beforeMutation()`
- c0151 ..> c0151: `createCodeArtifact() calls provenance()`
- c0151 ..> c0151: `createCodeArtifact() calls writeResult()`
- c0151 ..> c0151: `createDocument() calls beforeMutation()`
- c0151 ..> c0151: `createDocument() calls provenance()`
- c0151 ..> c0151: `createDocument() calls writeResult()`
- c0151 ..> c0151: `createEntity() calls beforeMutation()`
- c0151 ..> c0151: `createEntity() calls provenance()`
- c0151 ..> c0151: `createEntity() calls writeResult()`
- c0151 ..> c0151: `createMemory() calls beforeMutation()`
- c0151 ..> c0151: `createMemory() calls provenance()`
- c0151 ..> c0151: `createMemory() calls rich()`
- c0151 ..> c0151: `createMemory() calls validateAttachments()`
- c0151 ..> c0151: `createMemory() calls writeResult()`
- c0151 ..> c0151: `createRelationship() calls beforeMutation()`
- c0151 ..> c0151: `createRelationship() calls entityInProject()`
- c0151 ..> c0151: `createRelationship() calls provenance()`
- c0151 ..> c0151: `createRelationship() calls writeResult()`
- c0151 ..> c0151: `executeKnowledgeRead() calls currentProject()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readCodeArtifact()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readCodeArtifacts()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readDocument()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readDocuments()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readEntities()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readEntity()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readEntityMemories()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readFile()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readFiles()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readMemories()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readMemory()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readProjects()`
- c0151 ..> c0151: `executeKnowledgeRead() calls readRelationships()`
- c0151 ..> c0151: `executeKnowledgeRead() calls validateKnowledgeReadRequest()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls createCodeArtifact()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls createDocument()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls createEntity()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls createMemory()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls createRelationship()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls effectiveCommit()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls linkEntityMemory()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls linkMemories()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls rejectSensitiveInput()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls resolveWriteProject()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls rich()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls supersedeMemory()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls updateCodeArtifact()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls updateDocument()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls updateEntity()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls updateMemory()`
- c0151 ..> c0151: `executeKnowledgeWrite() calls validateKnowledgeWriteRequest()`
- c0151 ..> c0151: `fileContent() calls json()`
- c0151 ..> c0151: `linkEntityMemory() calls beforeMutation()`
- c0151 ..> c0151: `linkEntityMemory() calls entityInProject()`
- c0151 ..> c0151: `linkEntityMemory() calls memoryInProject()`
- c0151 ..> c0151: `linkEntityMemory() calls writeResult()`
- c0151 ..> c0151: `linkMemories() calls beforeMutation()`
- c0151 ..> c0151: `linkMemories() calls memoryInProject()`
- c0151 ..> c0151: `linkMemories() calls writeResult()`
- c0151 ..> c0151: `need() calls requiredText()`
- c0151 ..> c0151: `optionalId() calls requiredId()`
- c0151 ..> c0151: `optionalIds() calls requiredIds()`
- c0151 ..> c0151: `optionalStrings() calls requiredStrings()`
- c0151 ..> c0151: `optionalText() calls requiredText()`
- c0151 ..> c0151: `provenance() calls effectiveCommit()`
- c0151 ..> c0151: `readCodeArtifact() calls page()`
- c0151 ..> c0151: `readCodeArtifact() calls readResult()`
- c0151 ..> c0151: `readCodeArtifact() calls requireReadKnowledge()`
- c0151 ..> c0151: `readCodeArtifacts() calls boundedListPage()`
- c0151 ..> c0151: `readCodeArtifacts() calls readResult()`
- c0151 ..> c0151: `readCodeArtifacts() calls requestedReadProject()`
- c0151 ..> c0151: `readCodeArtifacts() calls requireReadKnowledge()`
- c0151 ..> c0151: `readDocument() calls page()`
- c0151 ..> c0151: `readDocument() calls readResult()`
- c0151 ..> c0151: `readDocument() calls requireReadKnowledge()`
- c0151 ..> c0151: `readDocuments() calls boundedListPage()`
- c0151 ..> c0151: `readDocuments() calls readResult()`
- c0151 ..> c0151: `readDocuments() calls requestedReadProject()`
- c0151 ..> c0151: `readDocuments() calls requireReadKnowledge()`
- c0151 ..> c0151: `readEntities() calls boundedListPage()`
- c0151 ..> c0151: `readEntities() calls hydrateEntities()`
- c0151 ..> c0151: `readEntities() calls inEntityProject()`
- c0151 ..> c0151: `readEntities() calls readResult()`
- c0151 ..> c0151: `readEntities() calls requestedReadProject()`
- c0151 ..> c0151: `readEntities() calls requireReadKnowledge()`
- c0151 ..> c0151: `readEntity() calls assertReadEntity()`
- c0151 ..> c0151: `readEntity() calls readResult()`
- c0151 ..> c0151: `readEntity() calls requireReadKnowledge()`
- c0151 ..> c0151: `readEntityMemories() calls assertReadEntity()`
- c0151 ..> c0151: `readEntityMemories() calls compactWriteValue()`
- c0151 ..> c0151: `readEntityMemories() calls inMemoryProject()`
- c0151 ..> c0151: `readEntityMemories() calls listPage()`
- c0151 ..> c0151: `readEntityMemories() calls readResult()`
- c0151 ..> c0151: `readEntityMemories() calls requireReadKnowledge()`
- c0151 ..> c0151: `readFile() calls fileContent()`
- c0151 ..> c0151: `readFile() calls requireReadKnowledge()`
- c0151 ..> c0151: `readFiles() calls boundedListPage()`
- c0151 ..> c0151: `readFiles() calls readResult()`
- c0151 ..> c0151: `readFiles() calls requestedReadProject()`
- c0151 ..> c0151: `readFiles() calls requireReadKnowledge()`
- c0151 ..> c0151: `readMemories() calls inMemoryProject()`
- c0151 ..> c0151: `readMemories() calls readResult()`
- c0151 ..> c0151: `readMemories() calls requestedReadProject()`
- c0151 ..> c0151: `readMemory() calls assertReadMemory()`
- c0151 ..> c0151: `readMemory() calls readResult()`
- c0151 ..> c0151: `readProjects() calls boundedListPage()`
- c0151 ..> c0151: `readProjects() calls readResult()`
- c0151 ..> c0151: `readRelationships() calls assertReadEntity()`
- c0151 ..> c0151: `readRelationships() calls inEntityProject()`
- c0151 ..> c0151: `readRelationships() calls listPage()`
- c0151 ..> c0151: `readRelationships() calls readResult()`
- c0151 ..> c0151: `readRelationships() calls requireReadKnowledge()`
- c0151 ..> c0151: `readResult() calls json()`
- c0151 ..> c0151: `rejectSensitiveInput() calls containsSensitiveData()`
- c0151 ..> c0151: `replacementMemory() calls beforeMutation()`
- c0151 ..> c0151: `replacementMemory() calls memoryInProject()`
- c0151 ..> c0151: `replacementMemory() calls provenance()`
- c0151 ..> c0151: `replacementMemory() calls validateAttachments()`
- c0151 ..> c0151: `requestedReadProject() calls currentProject()`
- c0151 ..> c0151: `requiredIds() calls requiredId()`
- c0151 ..> c0151: `requiredStrings() calls requiredText()`
- c0151 ..> c0151: `resolveWriteProject() calls currentProject()`
- c0151 ..> c0151: `supersedeMemory() calls beforeMutation()`
- c0151 ..> c0151: `supersedeMemory() calls memoryInProject()`
- c0151 ..> c0151: `supersedeMemory() calls replacementMemory()`
- c0151 ..> c0151: `supersedeMemory() calls writeResult()`
- c0151 ..> c0151: `updateCodeArtifact() calls beforeMutation()`
- c0151 ..> c0151: `updateCodeArtifact() calls updateProvenance()`
- c0151 ..> c0151: `updateCodeArtifact() calls writeResult()`
- c0151 ..> c0151: `updateDocument() calls beforeMutation()`
- c0151 ..> c0151: `updateDocument() calls updateProvenance()`
- c0151 ..> c0151: `updateDocument() calls writeResult()`
- c0151 ..> c0151: `updateEntity() calls beforeMutation()`
- c0151 ..> c0151: `updateEntity() calls entityInProject()`
- c0151 ..> c0151: `updateEntity() calls updateProvenance()`
- c0151 ..> c0151: `updateEntity() calls writeResult()`
- c0151 ..> c0151: `updateMemory() calls beforeMutation()`
- c0151 ..> c0151: `updateMemory() calls memoryInProject()`
- c0151 ..> c0151: `updateMemory() calls updateProvenance()`
- c0151 ..> c0151: `updateMemory() calls validateAttachments()`
- c0151 ..> c0151: `updateMemory() calls writeResult()`
- c0151 ..> c0151: `updateProvenance() calls effectiveCommit()`
- c0151 ..> c0151: `validateEntityFields() calls isEntityType()`
- c0151 ..> c0151: `validateEntityFields() calls optionalText()`
- c0151 ..> c0151: `validateKnowledgeReadRequest() calls checkOperation()`
- c0151 ..> c0151: `validateKnowledgeReadRequest() calls record()`
- c0151 ..> c0151: `validateKnowledgeReadRequest() calls validateReadIdentity()`
- c0151 ..> c0151: `validateKnowledgeReadRequest() calls validateReadPagination()`
- c0151 ..> c0151: `validateKnowledgeReadRequest() calls validateReadSearch()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls checkOperation()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls commit()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls need()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls optionalId()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls optionalIds()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls optionalImportance()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls optionalStrings()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls optionalText()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls record()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls requiredId()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls requiredIds()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls requiredStrings()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls requiredText()`
- c0151 ..> c0151: `validateKnowledgeWriteRequest() calls validateEntityFields()`
- c0151 ..> c0151: `validateReadIdentity() calls optionalId()`
- c0151 ..> c0151: `validateReadIdentity() calls optionalText()`
- c0151 ..> c0151: `validateReadIdentity() calls requiredId()`
- c0151 ..> c0151: `validateReadPagination() calls boundedId()`
- c0151 ..> c0151: `validateReadSearch() calls boundedId()`
- c0151 ..> c0151: `validateReadSearch() calls boundedNonNegativeInteger()`
- c0151 ..> c0151: `validateReadSearch() calls optionalId()`
- c0151 ..> c0151: `validateReadSearch() calls requiredText()`
- c0151 ..> c0151: `writeResult() calls compactWriteValue()`
- c0151 ..> c0151: `writeResult() calls json()`
- c0151 ..> c0172: `replacementMemory() calls replacementMemoryContext()`
- c0151 ..> c0186: `containsSensitiveData() calls hasSensitiveData()`
- c0151 ..> c0218: `requiredText() calls trim()`
- c0151 ..> c0218: `resolveWriteProject() calls trim()`
- c0153 --> c0066: `field input`
- c0154 --> c0070: `field input`
- c0156 --> c0073: `field input`
- c0158 --> c0075: `field input`
- c0161 --> c0153: `field codeArtifacts`
- c0161 --> c0154: `field documents`
- c0161 --> c0155: `field entityMemoryLinks`
- c0161 --> c0156: `field entities`
- c0161 --> c0158: `field relationships`
- c0164 --> c0162: `field codeArtifacts`
- c0164 --> c0162: `field documents`
- c0164 --> c0162: `field entities`
- c0164 --> c0162: `field relationships`
- c0165 ..> c0065: `type in codeArtifactInProject`
- c0165 ..> c0065: `type in writeCodeArtifact`
- c0165 ..> c0069: `type in documentInProject`
- c0165 ..> c0069: `type in writeDocument`
- c0165 ..> c0072: `type in entityInProject`
- c0165 ..> c0072: `type in writeEntity`
- c0165 ..> c0074: `type in writeRelationship`
- c0165 ..> c0082: `type in attachmentIds`
- c0165 ..> c0082: `type in attachmentsDiffer`
- c0165 ..> c0082: `type in currentMemory`
- c0165 ..> c0082: `type in ensureMemoryCanReceiveAttachments`
- c0165 ..> c0123: `codeArtifactInProject() calls getCodeArtifact()`
- c0165 ..> c0123: `documentInProject() calls getDocument()`
- c0165 ..> c0123: `entityInProject() calls getEntity()`
- c0165 ..> c0123: `writeAttachments() calls updateMemory()`
- c0165 ..> c0123: `writeCodeArtifact() calls createCodeArtifact()`
- c0165 ..> c0123: `writeDocument() calls createDocument()`
- c0165 ..> c0123: `writeEntity() calls createEntity()`
- c0165 ..> c0123: `writeEntityMemoryLink() calls linkEntityMemory()`
- c0165 ..> c0123: `writeLinkedMemory() calls linkMemories()`
- c0165 ..> c0123: `writeRelationship() calls createRelationship()`
- c0165 ..> c0123: `writeRelationship() calls getRelationships()`
- c0165 ..> c0126: `createOnce() calls create()`
- c0165 ..> c0136: `currentMemory() calls readMemory()`
- c0165 ..> c0136: `writeLinkedMemory() calls readMemory()`
- c0165 ..> c0152: `type in attachmentIds`
- c0165 ..> c0152: `type in attachmentPatch`
- c0165 ..> c0152: `type in attachmentsDiffer`
- c0165 ..> c0152: `type in requestedAttachmentIds`
- c0165 ..> c0153: `type in writeCodeArtifact`
- c0165 ..> c0154: `type in writeDocument`
- c0165 ..> c0155: `type in writeEntityMemoryLink`
- c0165 ..> c0156: `type in writeEntity`
- c0165 --> c0157: `field readMemory`
- c0165 ..> c0157: `type in constructor`
- c0165 ..> c0158: `type in writeRelationship`
- c0165 ..> c0159: `type in execute`
- c0165 ..> c0160: `type in createOnce`
- c0165 ..> c0160: `type in execute`
- c0165 ..> c0160: `type in writeAttachments`
- c0165 ..> c0160: `type in writeCodeArtifact`
- c0165 ..> c0160: `type in writeCodeArtifacts`
- c0165 ..> c0160: `type in writeDocument`
- c0165 ..> c0160: `type in writeDocuments`
- c0165 ..> c0160: `type in writeEntities`
- c0165 ..> c0160: `type in writeEntity`
- c0165 ..> c0160: `type in writeEntityMemoryLink`
- c0165 ..> c0160: `type in writeEntityMemoryLinks`
- c0165 ..> c0160: `type in writeLinkedMemories`
- c0165 ..> c0160: `type in writeLinkedMemory`
- c0165 ..> c0160: `type in writeRelationship`
- c0165 ..> c0160: `type in writeRelationships`
- c0165 ..> c0161: `type in createOnce`
- c0165 ..> c0161: `type in currentMemory`
- c0165 ..> c0161: `type in execute`
- c0165 ..> c0161: `type in requestedAttachmentIds`
- c0165 ..> c0161: `type in validatePlan`
- c0165 ..> c0161: `type in writeAttachments`
- c0165 ..> c0161: `type in writeCodeArtifact`
- c0165 ..> c0161: `type in writeCodeArtifacts`
- c0165 ..> c0161: `type in writeDocument`
- c0165 ..> c0161: `type in writeDocuments`
- c0165 ..> c0161: `type in writeEntities`
- c0165 ..> c0161: `type in writeEntity`
- c0165 ..> c0161: `type in writeEntityMemoryLink`
- c0165 ..> c0161: `type in writeEntityMemoryLinks`
- c0165 ..> c0161: `type in writeLinkedMemories`
- c0165 ..> c0161: `type in writeLinkedMemory`
- c0165 ..> c0161: `type in writeRelationship`
- c0165 ..> c0161: `type in writeRelationships`
- c0165 ..> c0163: `type in createOnce`
- c0165 ..> c0163: `type in writeAttachments`
- c0165 ..> c0163: `type in writeCodeArtifact`
- c0165 ..> c0163: `type in writeCodeArtifacts`
- c0165 ..> c0163: `type in writeDocument`
- c0165 ..> c0163: `type in writeDocuments`
- c0165 ..> c0163: `type in writeEntities`
- c0165 ..> c0163: `type in writeEntity`
- c0165 ..> c0163: `type in writeEntityMemoryLink`
- c0165 ..> c0163: `type in writeEntityMemoryLinks`
- c0165 ..> c0163: `type in writeLinkedMemories`
- c0165 ..> c0163: `type in writeLinkedMemory`
- c0165 ..> c0163: `type in writeRelationship`
- c0165 ..> c0163: `type in writeRelationships`
- c0165 ..> c0164: `type in createOnce`
- c0165 ..> c0164: `type in execute`
- c0165 ..> c0164: `type in requestedAttachmentIds`
- c0165 ..> c0164: `type in writeAttachments`
- c0165 ..> c0164: `type in writeCodeArtifact`
- c0165 ..> c0164: `type in writeCodeArtifacts`
- c0165 ..> c0164: `type in writeDocument`
- c0165 ..> c0164: `type in writeDocuments`
- c0165 ..> c0164: `type in writeEntities`
- c0165 ..> c0164: `type in writeEntity`
- c0165 ..> c0164: `type in writeEntityMemoryLink`
- c0165 ..> c0164: `type in writeEntityMemoryLinks`
- c0165 ..> c0164: `type in writeLinkedMemories`
- c0165 ..> c0164: `type in writeLinkedMemory`
- c0165 ..> c0164: `type in writeRelationship`
- c0165 ..> c0164: `type in writeRelationships`
- c0165 ..> c0165: `createOnce() calls currentMemory()`
- c0165 ..> c0165: `execute() calls currentMemory()`
- c0165 ..> c0165: `execute() calls validatePlan()`
- c0165 ..> c0165: `execute() calls writeAttachments()`
- c0165 ..> c0165: `execute() calls writeCodeArtifacts()`
- c0165 ..> c0165: `execute() calls writeDocuments()`
- c0165 ..> c0165: `execute() calls writeEntities()`
- c0165 ..> c0165: `execute() calls writeEntityMemoryLinks()`
- c0165 ..> c0165: `execute() calls writeLinkedMemories()`
- c0165 ..> c0165: `execute() calls writeRelationships()`
- c0165 ..> c0165: `validateAttachments() calls codeArtifactInProject()`
- c0165 ..> c0165: `validateAttachments() calls documentInProject()`
- c0165 ..> c0165: `validatePlan() calls validateResourceKeys()`
- c0165 ..> c0165: `writeAttachments() calls attachmentIds()`
- c0165 ..> c0165: `writeAttachments() calls attachmentPatch()`
- c0165 ..> c0165: `writeAttachments() calls attachmentsDiffer()`
- c0165 ..> c0165: `writeAttachments() calls currentMemory()`
- c0165 ..> c0165: `writeAttachments() calls ensureMemoryCanReceiveAttachments()`
- c0165 ..> c0165: `writeAttachments() calls requestedAttachmentIds()`
- c0165 ..> c0165: `writeAttachments() calls validateAttachments()`
- c0165 ..> c0165: `writeCodeArtifact() calls codeArtifactInProject()`
- c0165 ..> c0165: `writeCodeArtifact() calls createOnce()`
- c0165 ..> c0165: `writeCodeArtifact() calls currentMemory()`
- c0165 ..> c0165: `writeCodeArtifacts() calls writeCodeArtifact()`
- c0165 ..> c0165: `writeDocument() calls createOnce()`
- c0165 ..> c0165: `writeDocument() calls currentMemory()`
- c0165 ..> c0165: `writeDocument() calls documentInProject()`
- c0165 ..> c0165: `writeDocuments() calls writeDocument()`
- c0165 ..> c0165: `writeEntities() calls writeEntity()`
- c0165 ..> c0165: `writeEntity() calls createOnce()`
- c0165 ..> c0165: `writeEntity() calls currentMemory()`
- c0165 ..> c0165: `writeEntity() calls entityInProject()`
- c0165 ..> c0165: `writeEntityMemoryLink() calls currentMemory()`
- c0165 ..> c0165: `writeEntityMemoryLink() calls entityInProject()`
- c0165 ..> c0165: `writeEntityMemoryLinks() calls writeEntityMemoryLink()`
- c0165 ..> c0165: `writeLinkedMemories() calls writeLinkedMemory()`
- c0165 ..> c0165: `writeLinkedMemory() calls currentMemory()`
- c0165 ..> c0165: `writeRelationship() calls createOnce()`
- c0165 ..> c0165: `writeRelationship() calls currentMemory()`
- c0165 ..> c0165: `writeRelationships() calls writeRelationship()`
- c0165 --> c0166: `field client`
- c0165 ..> c0166: `type in constructor`
- c0165 ..> c0167: `attachmentIds() calls uniqueIds()`
- c0165 ..> c0167: `attachmentsDiffer() calls sameIds()`
- c0165 ..> c0167: `createOnce() calls positiveId()`
- c0165 ..> c0167: `execute() calls copyState()`
- c0165 ..> c0167: `execute() calls instructionId()`
- c0165 ..> c0167: `execute() calls normalizedState()`
- c0165 ..> c0167: `requestedAttachmentIds() calls selectedIds()`
- c0165 ..> c0167: `requestedAttachmentIds() calls uniqueIds()`
- c0165 ..> c0167: `validatePlan() calls positiveId()`
- c0165 ..> c0167: `writeCodeArtifact() calls positiveId()`
- c0165 ..> c0167: `writeCodeArtifacts() calls positiveId()`
- c0165 ..> c0167: `writeCodeArtifacts() calls stateId()`
- c0165 ..> c0167: `writeCodeArtifacts() calls stateWithNumber()`
- c0165 ..> c0167: `writeDocument() calls positiveId()`
- c0165 ..> c0167: `writeDocuments() calls positiveId()`
- c0165 ..> c0167: `writeDocuments() calls stateId()`
- c0165 ..> c0167: `writeDocuments() calls stateWithNumber()`
- c0165 ..> c0167: `writeEntities() calls positiveId()`
- c0165 ..> c0167: `writeEntities() calls stateId()`
- c0165 ..> c0167: `writeEntities() calls stateWithNumber()`
- c0165 ..> c0167: `writeEntity() calls positiveId()`
- c0165 ..> c0167: `writeEntityMemoryLink() calls hasValue()`
- c0165 ..> c0167: `writeEntityMemoryLink() calls positiveId()`
- c0165 ..> c0167: `writeEntityMemoryLink() calls stateId()`
- c0165 ..> c0167: `writeLinkedMemory() calls hasValue()`
- c0165 ..> c0167: `writeLinkedMemory() calls positiveId()`
- c0165 ..> c0167: `writeRelationship() calls positiveId()`
- c0165 ..> c0167: `writeRelationship() calls stateId()`
- c0165 ..> c0167: `writeRelationships() calls positiveId()`
- c0165 ..> c0167: `writeRelationships() calls stateId()`
- c0165 ..> c0167: `writeRelationships() calls stateWithNumber()`
- c0165 ..> c0218: `validatePlan() calls trim()`
- c0167 ..> c0161: `type in instructionId`
- c0167 ..> c0162: `type in receipts`
- c0167 ..> c0162: `type in selectedIds`
- c0167 ..> c0162: `type in stateId`
- c0167 ..> c0162: `type in stateWithNumber`
- c0167 ..> c0164: `type in copyState`
- c0167 ..> c0164: `type in normalizedState`
- c0167 ..> c0167: `normalizedState() calls receipts()`
- c0167 ..> c0167: `receipts() calls positiveId()`
- c0167 ..> c0167: `selectedIds() calls positiveId()`
- c0167 ..> c0167: `selectedIds() calls stateId()`
- c0167 ..> c0167: `stateWithNumber() calls positiveId()`
- c0167 ..> c0167: `uniqueIds() calls positiveId()`
- c0170 ..> c0040: `flush() calls resolve()`
- c0170 ..|> c0168: `implements`
- c0170 --> c0169: `field level`
- c0170 --> c0169: `field options`
- c0170 ..> c0169: `type in constructor`
- c0170 ..> c0169: `type in setLevel`
- c0170 ..> c0170: `close() calls flush()`
- c0170 ..> c0170: `emit() calls enqueue()`
- c0170 ..> c0170: `emit() calls warn()`
- c0170 ..> c0170: `enqueue() calls rotate()`
- c0170 ..> c0170: `enqueue() calls warn()`
- c0170 ..> c0170: `flush() calls warn()`
- c0170 ..> c0171: `constructor() calls limit()`
- c0170 ..> c0171: `enqueue() calls excludeCredentials()`
- c0170 ..> c0171: `enqueue() calls pruneDirectory()`
- c0170 ..> c0186: `enqueue() calls sanitizeValue()`
- c0171 ..> c0171: `pruneDirectory() calls listLogFiles()`
- c0171 ..> c0171: `pruneDirectory() calls processExited()`
- c0172 ..> c0084: `type in replacementMemoryInput`
- c0172 ..> c0172: `replacementMemoryContext() calls storedMemoryContext()`
- c0172 ..> c0172: `replacementMemoryInput() calls replacementMemoryContext()`
- c0172 ..> c0186: `storedMemoryContext() calls sanitizeText()`
- c0172 ..> c0218: `replacementMemoryContext() calls trim()`
- c0175 --> c0177: `field complete`
- c0176 ..> c0040: `applySummary() calls now()`
- c0176 --> c0173: `field compactedHistory`
- c0176 ..> c0173: `type in constructor`
- c0176 ..> c0173: `type in getCompactedHistory`
- c0176 ..> c0173: `type in prepare`
- c0176 ..> c0173: `type in prepareCapture`
- c0176 ..> c0173: `type in prepareContext`
- c0176 ..> c0176: `prepare() calls prepareContext()`
- c0176 ..> c0176: `prepareCapture() calls outputAllowance()`
- c0176 ..> c0176: `prepareCapture() calls prepareContext()`
- c0176 ..> c0176: `prepareContext() calls applySummary()`
- c0176 ..> c0176: `prepareContext() calls getCompactedHistory()`
- c0176 ..> c0176: `prepareContext() calls outputAllowance()`
- c0176 ..> c0177: `type in prepare`
- c0176 ..> c0177: `type in prepareCapture`
- c0176 ..> c0177: `type in prepareContext`
- c0176 ..> c0178: `applySummary() calls contextTokens()`
- c0176 ..> c0178: `constructor() calls compactionSettings()`
- c0176 ..> c0178: `constructor() calls privateContextWindow()`
- c0176 ..> c0178: `outputAllowance() calls resolvedOutputAllowance()`
- c0176 ..> c0178: `prepareContext() calls assertImageSupport()`
- c0176 ..> c0178: `prepareContext() calls contextTokens()`
- c0176 ..> c0178: `prepareContext() calls outputCeiling()`
- c0176 ..> c0178: `prepareContext() calls recentCutIndex()`
- c0176 ..> c0178: `prepareContext() calls summarizeMemoryHistory()`
- c0176 ..> c0218: `applySummary() calls trim()`
- c0178 ..> c0040: `summarizeMemoryHistory() calls now()`
- c0178 ..> c0174: `assertFits() constructs ContextWindowError`
- c0178 ..> c0174: `smallerSummaryBatch() constructs ContextWindowError`
- c0178 ..> c0175: `type in summarizeMemoryHistory`
- c0178 ..> c0178: `assertFits() calls contextTokens()`
- c0178 ..> c0178: `contextTokens() calls textTokens()`
- c0178 ..> c0178: `evidenceMessage() calls modelEvidence()`
- c0178 ..> c0178: `modelEvidence() calls objectRecord()`
- c0178 ..> c0178: `outputCeiling() calls validatePositiveSafeInteger()`
- c0178 ..> c0178: `privateContextWindow() calls validatePositiveSafeInteger()`
- c0178 ..> c0178: `recentCutIndex() calls entriesFor()`
- c0178 ..> c0178: `resolvedOutputAllowance() calls assertFits()`
- c0178 ..> c0178: `resolvedOutputAllowance() calls contextTokens()`
- c0178 ..> c0178: `resolvedOutputAllowance() calls outputCeiling()`
- c0178 ..> c0178: `summarizeMemoryHistory() calls assertImageSupport()`
- c0178 ..> c0178: `summarizeMemoryHistory() calls compactionSettings()`
- c0178 ..> c0178: `summarizeMemoryHistory() calls privateContextWindow()`
- c0178 ..> c0178: `summarizeMemoryHistory() calls resolvedOutputAllowance()`
- c0178 ..> c0178: `summarizeMemoryHistory() calls smallerSummaryBatch()`
- c0178 ..> c0178: `summarizeMemoryHistory() calls summaryEvidence()`
- c0178 ..> c0178: `summaryEvidence() calls evidenceMessage()`
- c0178 ..> c0182: `summarizeMemoryHistory() calls complete()`
- c0178 ..> c0186: `evidenceMessage() calls sanitizeValue()`
- c0178 ..> c0186: `summarizeMemoryHistory() calls sanitizeText()`
- c0180 --> c0181: `field modelRegistry`
- c0182 ..> c0040: `complete() calls now()`
- c0182 ..> c0040: `completeAttempt() calls now()`
- c0182 ..> c0040: `completeRequest() calls now()`
- c0182 ..> c0040: `completeWithSubmission() calls now()`
- c0182 ..> c0040: `executeRead() calls now()`
- c0182 ..> c0040: `prepareCapture() calls now()`
- c0182 ..> c0049: `completeWithSubmission() calls mapConcurrent()`
- c0182 --> c0054: `field selection`
- c0182 ..> c0054: `type in constructor`
- c0182 ..> c0061: `completeRequest() calls isRecallConcurrency()`
- c0182 ..|> c0085: `implements`
- c0182 ..> c0087: `type in executeRead`
- c0182 ..> c0088: `type in complete`
- c0182 ..> c0088: `type in completeAttempt`
- c0182 ..> c0088: `type in completeRequest`
- c0182 ..> c0088: `type in completeWithSubmission`
- c0182 ..> c0088: `type in emit`
- c0182 ..> c0088: `type in executeRead`
- c0182 ..> c0088: `type in prepareCapture`
- c0182 ..> c0089: `completeWithSubmission() constructs ModelSubmissionError`
- c0182 ..> c0090: `type in validateSubmission`
- c0182 ..> c0165: `executeRead() calls execute()`
- c0182 --> c0168: `field logger`
- c0182 ..> c0170: `complete() calls emit()`
- c0182 ..> c0170: `completeAttempt() calls emit()`
- c0182 ..> c0170: `completeRequest() calls emit()`
- c0182 ..> c0170: `emit() calls emit()`
- c0182 ..> c0170: `prepareCapture() calls emit()`
- c0182 ..> c0176: `completeRequest() calls prepareCapture()`
- c0182 ..> c0176: `completeRequest() constructs MemoryTaskContext`
- c0182 ..> c0176: `completeWithSubmission() calls prepare()`
- c0182 ..> c0178: `completeRequest() calls evidenceMessage()`
- c0182 --> c0179: `field transformHeaders`
- c0182 --> c0181: `field registry`
- c0182 ..> c0181: `type in constructor`
- c0182 ..> c0182: `complete() calls completeRequest()`
- c0182 ..> c0182: `completeAttempt() calls complete()`
- c0182 ..> c0182: `completeRequest() calls completeWithSubmission()`
- c0182 ..> c0182: `completeWithSubmission() calls completeAttempt()`
- c0182 ..> c0182: `completeWithSubmission() calls executeRead()`
- c0182 ..> c0182: `completeWithSubmission() calls validateSubmission()`
- c0182 ..> c0182: `prepareCapture() calls completeRequest()`
- c0182 ..> c0183: `type in constructor`
- c0182 ..> c0184: `type in completeAttempt`
- c0182 ..> c0184: `type in completeWithSubmission`
- c0182 ..> c0184: `type in executeRead`
- c0182 ..> c0185: `complete() calls rejectionText()`
- c0182 ..> c0185: `completeAttempt() calls rejectionText()`
- c0182 ..> c0185: `completeRequest() calls modelLabel()`
- c0182 ..> c0185: `completeRequest() calls requestDeadline()`
- c0182 ..> c0185: `completeRequest() calls requestOptions()`
- c0182 ..> c0185: `completeRequest() calls requestTimeout()`
- c0182 ..> c0185: `completeRequest() calls serializeInput()`
- c0182 ..> c0185: `completeRequest() calls submissionTool()`
- c0182 ..> c0185: `completeRequest() calls throwRequestFailure()`
- c0182 ..> c0185: `completeWithSubmission() calls appendCallCountCorrection()`
- c0182 ..> c0185: `completeWithSubmission() calls ensureCompletionFinished()`
- c0182 ..> c0185: `completeWithSubmission() calls errorToolResult()`
- c0182 ..> c0185: `completeWithSubmission() calls rejectionText()`
- c0182 ..> c0185: `completeWithSubmission() calls sanitizedAssistantForHistory()`
- c0182 ..> c0185: `completeWithSubmission() calls serializeInput()`
- c0182 ..> c0185: `completeWithSubmission() calls submissionTool()`
- c0182 ..> c0185: `completeWithSubmission() calls toolCalls()`
- c0182 ..> c0185: `constructor() calls modelLabel()`
- c0182 ..> c0185: `executeRead() calls errorToolResult()`
- c0182 ..> c0185: `executeRead() calls rejectionText()`
- c0182 ..> c0185: `executeRead() calls serializeInput()`
- c0182 ..> c0185: `executeRead() calls submissionTool()`
- c0182 ..> c0185: `executeRead() calls textBlock()`
- c0182 ..> c0185: `prepareCapture() calls rejectionText()`
- c0182 ..> c0186: `completeRequest() calls sanitizeText()`
- c0182 ..> c0186: `emit() calls sanitizeValue()`
- c0183 --> c0168: `field logger`
- c0183 --> c0179: `field transformHeaders`
- c0185 ..> c0040: `appendCallCountCorrection() calls now()`
- c0185 ..> c0040: `errorToolResult() calls now()`
- c0185 ..> c0054: `type in modelLabel`
- c0185 ..> c0054: `type in modelSelectionFromModel`
- c0185 ..> c0054: `type in resolveMemoryModel`
- c0185 ..> c0087: `type in submissionTool`
- c0185 ..> c0088: `type in ensureCompletionFinished`
- c0185 ..> c0088: `type in requestDeadline`
- c0185 ..> c0088: `type in requestTimeout`
- c0185 ..> c0088: `type in throwRequestFailure`
- c0185 ..> c0090: `type in submissionTool`
- c0185 ..> c0179: `type in requestOptions`
- c0185 ..> c0180: `type in availableMemoryModels`
- c0185 ..> c0181: `type in resolveMemoryModel`
- c0185 ..> c0182: `requestOptions() calls transformHeaders()`
- c0185 ..> c0182: `resolveMemoryModel() constructs PiMemoryModel`
- c0185 ..> c0182: `type in resolveMemoryModel`
- c0185 ..> c0183: `type in resolveMemoryModel`
- c0185 ..> c0184: `type in requestDeadline`
- c0185 ..> c0185: `appendCallCountCorrection() calls errorToolResult()`
- c0185 ..> c0185: `appendCallCountCorrection() calls rejectionText()`
- c0185 ..> c0185: `appendCallCountCorrection() calls sanitizedAssistantForHistory()`
- c0185 ..> c0185: `errorToolResult() calls textBlock()`
- c0185 ..> c0185: `openCodeSessionHeaders() calls isOpenCodeModel()`
- c0185 ..> c0185: `requestOptions() calls openCodeSessionHeaders()`
- c0185 ..> c0185: `sanitizedAssistantForHistory() calls textBlock()`
- c0185 ..> c0186: `appendCallCountCorrection() calls sanitizeText()`
- c0185 ..> c0186: `ensureCompletionFinished() calls sanitizeText()`
- c0185 ..> c0186: `rejectionText() calls sanitizeText()`
- c0185 ..> c0186: `sanitizedAssistantForHistory() calls sanitizeText()`
- c0185 ..> c0186: `sanitizedAssistantForHistory() calls sanitizeValue()`
- c0185 ..> c0186: `serializeInput() calls sanitizeText()`
- c0185 ..> c0186: `serializeInput() calls sanitizeValue()`
- c0185 ..> c0186: `throwRequestFailure() calls sanitizeText()`
- c0186 ..> c0186: `hasSensitiveData() calls sanitizeText()`
- c0186 ..> c0186: `sanitizeValue() calls sanitizeText()`
- c0189 ..> c0079: `type in initialiseProject`
- c0189 ..> c0079: `type in initialiseProjectForAgent`
- c0189 ..> c0079: `type in promptExistingProject`
- c0189 ..> c0091: `type in existingMapping`
- c0189 ..> c0091: `type in initialiseProject`
- c0189 ..> c0091: `type in initialiseProjectForAgent`
- c0189 ..> c0091: `type in promptExistingProject`
- c0189 ..> c0092: `type in promptNewProject`
- c0189 ..> c0092: `type in validateAgentProjectDetails`
- c0189 ..> c0121: `promptExistingProject() calls notify()`
- c0189 ..> c0126: `initialiseProject() calls createProject()`
- c0189 ..> c0126: `initialiseProject() calls linkProject()`
- c0189 ..> c0126: `initialiseProject() calls listProjects()`
- c0189 ..> c0126: `initialiseProjectForAgent() calls createProject()`
- c0189 ..> c0126: `initialiseProjectForAgent() calls linkProject()`
- c0189 ..> c0126: `initialiseProjectForAgent() calls listProjects()`
- c0189 ..> c0126: `promptExistingProject() calls listProjects()`
- c0189 ..> c0186: `promptExistingProject() calls sanitizeText()`
- c0189 ..> c0186: `promptNewProject() calls sanitizeText()`
- c0189 ..> c0187: `type in initialiseProjectForAgent`
- c0189 ..> c0187: `type in validateAgentProjectDetails`
- c0189 ..> c0188: `existingMapping() constructs ProjectInitError`
- c0189 ..> c0188: `initialiseProject() constructs ProjectInitError`
- c0189 ..> c0188: `initialiseProjectForAgent() constructs ProjectInitError`
- c0189 ..> c0188: `promptExistingProject() constructs ProjectInitError`
- c0189 ..> c0188: `promptNewProject() constructs ProjectInitError`
- c0189 ..> c0188: `validateAgentProjectDetails() constructs ProjectInitError`
- c0189 ..> c0189: `initialiseProject() calls existingMapping()`
- c0189 ..> c0189: `initialiseProject() calls promptExistingProject()`
- c0189 ..> c0189: `initialiseProject() calls promptNewProject()`
- c0189 ..> c0189: `initialiseProjectForAgent() calls existingMapping()`
- c0189 ..> c0189: `initialiseProjectForAgent() calls validateAgentProjectDetails()`
- c0189 ..> c0218: `promptExistingProject() calls trim()`
- c0189 ..> c0218: `promptNewProject() calls trim()`
- c0189 ..> c0218: `validateAgentProjectDetails() calls trim()`
- c0190 ..> c0004: `mutate() calls set()`
- c0190 ..> c0064: `type in advanceWatermark`
- c0190 ..> c0064: `type in enqueue`
- c0190 ..> c0064: `type in enqueueSnapshot`
- c0190 ..> c0068: `type in compactJobSnapshot`
- c0190 ..> c0077: `type in appendInspections`
- c0190 ..> c0091: `type in completeProjectDiscovery`
- c0190 ..> c0097: `type in completeProjectDiscovery`
- c0190 ..> c0097: `type in currentWatermark`
- c0190 ..> c0126: `mutate() calls get()`
- c0190 ..> c0126: `resolveBranchId() calls get()`
- c0190 ..> c0151: `readSnapshot() calls readFile()`
- c0190 ..> c0151: `readState() calls readFile()`
- c0190 ..> c0151: `releaseFileLock() calls readFile()`
- c0190 ..> c0151: `removeAbandonedLock() calls readFile()`
- c0190 ..> c0186: `addConflict() calls sanitizeValue()`
- c0190 ..> c0186: `appendInspections() calls sanitizeValue()`
- c0190 ..> c0186: `applyCheckpointPatch() calls sanitizeValue()`
- c0190 ..> c0186: `updateConflict() calls sanitizeValue()`
- c0190 ..> c0190: `acquireFileLock() calls createFileLock()`
- c0190 ..> c0190: `acquireFileLock() calls ensureDirectory()`
- c0190 ..> c0190: `acquireFileLock() calls recoverExistingLock()`
- c0190 ..> c0190: `addConflict() calls mutate()`
- c0190 ..> c0190: `addConflict() calls prune()`
- c0190 ..> c0190: `advanceWatermark() calls mutate()`
- c0190 ..> c0190: `advanceWatermark() calls prune()`
- c0190 ..> c0190: `advanceWatermark() calls updateWatermark()`
- c0190 ..> c0190: `appendInspections() calls readSnapshot()`
- c0190 ..> c0190: `appendInspections() calls storeSnapshot()`
- c0190 ..> c0190: `cancel() calls mutate()`
- c0190 ..> c0190: `checkpoint() calls appendInspections()`
- c0190 ..> c0190: `checkpoint() calls applyCheckpointPatch()`
- c0190 ..> c0190: `checkpoint() calls compactJobSnapshot()`
- c0190 ..> c0190: `checkpoint() calls hydrateJob()`
- c0190 ..> c0190: `checkpoint() calls mutate()`
- c0190 ..> c0190: `checkpoint() calls pruneFailedJobs()`
- c0190 ..> c0190: `checkpoint() calls recordCompletedCapture()`
- c0190 ..> c0190: `checkpoint() calls releaseTerminalSnapshot()`
- c0190 ..> c0190: `claimNext() calls claimJob()`
- c0190 ..> c0190: `claimNext() calls defaultIdentity()`
- c0190 ..> c0190: `claimNext() calls hydrateJob()`
- c0190 ..> c0190: `claimNext() calls matchesBranch()`
- c0190 ..> c0190: `claimNext() calls now()`
- c0190 ..> c0190: `claimNext() calls runningJobCanBeRecovered()`
- c0190 ..> c0190: `collectSnapshots() calls now()`
- c0190 ..> c0190: `collectSnapshots() calls snapshotPath()`
- c0190 ..> c0190: `collectSnapshots() calls syncDirectory()`
- c0190 ..> c0190: `compactJobSnapshot() calls hydrateJob()`
- c0190 ..> c0190: `compactJobSnapshot() calls storeSnapshot()`
- c0190 ..> c0190: `complete() calls checkpoint()`
- c0190 ..> c0190: `completeProjectDiscovery() calls defaultIdentity()`
- c0190 ..> c0190: `completeProjectDiscovery() calls mutate()`
- c0190 ..> c0190: `createFileLock() calls close()`
- c0190 ..> c0190: `createFileLock() calls releaseFileLock()`
- c0190 ..> c0190: `currentWatermark() calls getWatermark()`
- c0190 ..> c0190: `enqueue() calls mutate()`
- c0190 ..> c0190: `enqueue() calls prune()`
- c0190 ..> c0190: `enqueue() calls readSnapshot()`
- c0190 ..> c0190: `enqueue() calls updateWatermark()`
- c0190 ..> c0190: `enqueueSnapshot() calls enqueue()`
- c0190 ..> c0190: `getConflict() calls readState()`
- c0190 ..> c0190: `getJob() calls hydrateJob()`
- c0190 ..> c0190: `getJob() calls mutate()`
- c0190 ..> c0190: `getWatermark() calls readState()`
- c0190 ..> c0190: `hasClaimableWork() calls matchesBranch()`
- c0190 ..> c0190: `hasClaimableWork() calls mutate()`
- c0190 ..> c0190: `hasClaimableWork() calls now()`
- c0190 ..> c0190: `hasClaimableWork() calls runningJobCanBeRecovered()`
- c0190 ..> c0190: `hydrateJob() calls readSnapshot()`
- c0190 ..> c0190: `listJobMetadata() calls mutate()`
- c0190 ..> c0190: `listJobs() calls hydrateJob()`
- c0190 ..> c0190: `listJobs() calls mutate()`
- c0190 ..> c0190: `listPending() calls defaultIdentity()`
- c0190 ..> c0190: `listPending() calls hydrateJob()`
- c0190 ..> c0190: `listPending() calls mutate()`
- c0190 ..> c0190: `listPendingConflicts() calls pendingConflicts()`
- c0190 ..> c0190: `mutate() calls pruneFailedJobs()`
- c0190 ..> c0190: `mutate() calls readState()`
- c0190 ..> c0190: `mutate() calls withMutationFileLock()`
- c0190 ..> c0190: `mutate() calls writeState()`
- c0190 ..> c0190: `pendingConflicts() calls readState()`
- c0190 ..> c0190: `prune() calls now()`
- c0190 ..> c0190: `readSnapshot() calls close()`
- c0190 ..> c0190: `readSnapshot() calls snapshotPath()`
- c0190 ..> c0190: `recordCompletedCapture() calls hydrateJob()`
- c0190 ..> c0190: `recordCompletedCapture() calls storeSnapshot()`
- c0190 ..> c0190: `recoverExistingLock() calls removeAbandonedLock()`
- c0190 ..> c0190: `releaseProgress() calls mutate()`
- c0190 ..> c0190: `removeAbandonedLock() calls now()`
- c0190 ..> c0190: `resolveBranchId() calls readState()`
- c0190 ..> c0190: `storeSnapshot() calls close()`
- c0190 ..> c0190: `storeSnapshot() calls readSnapshot()`
- c0190 ..> c0190: `storeSnapshot() calls snapshotPath()`
- c0190 ..> c0190: `storeSnapshot() calls syncDirectory()`
- c0190 ..> c0190: `syncDirectory() calls close()`
- c0190 ..> c0190: `updateConflict() calls mutate()`
- c0190 ..> c0190: `withFileLock() calls acquireFileLock()`
- c0190 ..> c0190: `withMutationFileLock() calls withFileLock()`
- c0190 ..> c0190: `withWorkerLock() calls acquireFileLock()`
- c0190 ..> c0190: `writeState() calls close()`
- c0190 ..> c0190: `writeState() calls collectSnapshots()`
- c0190 ..> c0190: `writeState() calls ensureDirectory()`
- c0190 ..> c0190: `writeState() calls pruneFailedJobs()`
- c0190 ..> c0190: `writeState() calls releaseTerminalSnapshot()`
- c0190 ..> c0190: `writeState() calls storeSnapshot()`
- c0190 ..> c0190: `writeState() calls syncDirectory()`
- c0190 ..> c0191: `type in constructor`
- c0190 ..> c0192: `type in acquireFileLock`
- c0190 ..> c0192: `type in createFileLock`
- c0190 ..> c0193: `type in addConflict`
- c0190 ..> c0193: `type in getConflict`
- c0190 ..> c0193: `type in listPendingConflicts`
- c0190 ..> c0193: `type in pendingConflicts`
- c0190 ..> c0193: `type in updateConflict`
- c0190 ..> c0194: `acquireFileLock() constructs QueueBusyError`
- c0190 ..> c0194: `removeAbandonedLock() constructs QueueBusyError`
- c0190 ..> c0194: `withMutationFileLock() constructs QueueBusyError`
- c0190 ..> c0195: `type in applyCheckpointPatch`
- c0190 ..> c0195: `type in checkpoint`
- c0190 ..> c0196: `type in enqueue`
- c0190 ..> c0196: `type in enqueueSnapshot`
- c0190 ..> c0197: `type in claimNext`
- c0190 ..> c0197: `type in defaultIdentity`
- c0190 ..> c0197: `type in hasClaimableWork`
- c0190 ..> c0197: `type in listJobMetadata`
- c0190 ..> c0197: `type in listJobs`
- c0190 ..> c0197: `type in listPending`
- c0190 ..> c0197: `type in listPendingConflicts`
- c0190 ..> c0197: `type in pendingConflicts`
- c0190 ..> c0197: `type in withWorkerLock`
- c0190 ..> c0198: `type in checkpoint`
- c0190 ..> c0198: `type in claimJob`
- c0190 ..> c0198: `type in claimNext`
- c0190 ..> c0198: `type in complete`
- c0190 ..> c0198: `type in getJob`
- c0190 ..> c0198: `type in hydrateJob`
- c0190 ..> c0198: `type in listJobs`
- c0190 ..> c0198: `type in listPending`
- c0190 ..> c0198: `type in matchesBranch`
- c0190 ..> c0198: `type in runningJobCanBeRecovered`
- c0190 ..> c0199: `type in listJobMetadata`
- c0190 ..> c0201: `type in collectSnapshots`
- c0190 ..> c0201: `type in mutate`
- c0190 ..> c0201: `type in prune`
- c0190 ..> c0201: `type in pruneFailedJobs`
- c0190 ..> c0201: `type in readState`
- c0190 ..> c0201: `type in recordCompletedCapture`
- c0190 ..> c0201: `type in releaseTerminalSnapshot`
- c0190 ..> c0201: `type in updateWatermark`
- c0190 ..> c0201: `type in writeState`
- c0190 ..> c0202: `type in advanceWatermark`
- c0190 ..> c0202: `type in currentWatermark`
- c0190 ..> c0202: `type in getWatermark`
- c0190 ..> c0202: `type in updateWatermark`
- c0190 ..> c0203: `type in readSnapshot`
- c0190 ..> c0203: `type in storeSnapshot`
- c0190 ..> c0204: `type in appendInspections`
- c0190 ..> c0204: `type in applyCheckpointPatch`
- c0190 ..> c0204: `type in compactJobSnapshot`
- c0190 ..> c0204: `type in hydrateJob`
- c0190 ..> c0204: `type in recordCompletedCapture`
- c0190 ..> c0204: `type in releaseTerminalSnapshot`
- c0190 ..> c0206: `type in advanceWatermark`
- c0190 ..> c0206: `type in updateWatermark`
- c0190 ..> c0207: `addConflict() calls jsonSnapshot()`
- c0190 ..> c0207: `addConflict() calls nowIso()`
- c0190 ..> c0207: `addConflict() calls scrubDiagnostic()`
- c0190 ..> c0207: `advanceWatermark() calls dedupeKey()`
- c0190 ..> c0207: `advanceWatermark() calls jsonSnapshot()`
- c0190 ..> c0207: `appendInspections() calls jsonSnapshot()`
- c0190 ..> c0207: `appendInspections() calls validateInspectionEntry()`
- c0190 ..> c0207: `applyCheckpointPatch() calls jsonSnapshot()`
- c0190 ..> c0207: `applyCheckpointPatch() calls nowIso()`
- c0190 ..> c0207: `applyCheckpointPatch() calls sanitizeOutcomeMap()`
- c0190 ..> c0207: `applyCheckpointPatch() calls scrubDiagnostic()`
- c0190 ..> c0207: `cancel() calls nowIso()`
- c0190 ..> c0207: `cancel() calls scrubDiagnostic()`
- c0190 ..> c0207: `checkpoint() calls releaseCompletedArtifacts()`
- c0190 ..> c0207: `claimJob() calls nowIso()`
- c0190 ..> c0207: `claimNext() calls identityMatches()`
- c0190 ..> c0207: `claimNext() calls interruptedWrite()`
- c0190 ..> c0207: `completeProjectDiscovery() calls identityMatches()`
- c0190 ..> c0207: `createFileLock() calls nowIso()`
- c0190 ..> c0207: `enqueue() calls clearHistoryCache()`
- c0190 ..> c0207: `enqueue() calls contextKey()`
- c0190 ..> c0207: `enqueue() calls dedupeKey()`
- c0190 ..> c0207: `enqueue() calls diagnosticError()`
- c0190 ..> c0207: `enqueue() calls jobIdFor()`
- c0190 ..> c0207: `enqueue() calls jsonSnapshot()`
- c0190 ..> c0207: `enqueue() calls nowIso()`
- c0190 ..> c0207: `getConflict() calls jsonSnapshot()`
- c0190 ..> c0207: `getWatermark() calls contextKey()`
- c0190 ..> c0207: `getWatermark() calls jsonSnapshot()`
- c0190 ..> c0207: `getWatermark() calls nowIso()`
- c0190 ..> c0207: `hasClaimableWork() calls identityMatches()`
- c0190 ..> c0207: `hasClaimableWork() calls interruptedWrite()`
- c0190 ..> c0207: `hydrateJob() calls jsonSnapshot()`
- c0190 ..> c0207: `listJobMetadata() calls identityMatches()`
- c0190 ..> c0207: `listJobs() calls identityMatches()`
- c0190 ..> c0207: `listPending() calls identityMatches()`
- c0190 ..> c0207: `pendingConflicts() calls conflictIdentityMatches()`
- c0190 ..> c0207: `pendingConflicts() calls jsonSnapshot()`
- c0190 ..> c0207: `prune() calls clearHistoryCache()`
- c0190 ..> c0207: `prune() calls contextKey()`
- c0190 ..> c0207: `prune() calls shouldRetain()`
- c0190 ..> c0207: `readState() calls normaliseState()`
- c0190 ..> c0207: `recordCompletedCapture() calls contextKey()`
- c0190 ..> c0207: `recordCompletedCapture() calls cursorComparison()`
- c0190 ..> c0207: `recordCompletedCapture() calls nowIso()`
- c0190 ..> c0207: `recordCompletedCapture() calls orderedSourceEntryIds()`
- c0190 ..> c0207: `recordCompletedCapture() calls summaryCursor()`
- c0190 ..> c0207: `releaseProgress() calls nowIso()`
- c0190 ..> c0207: `removeAbandonedLock() calls isProcessAlive()`
- c0190 ..> c0207: `resolveBranchId() calls contextKey()`
- c0190 ..> c0207: `runningJobCanBeRecovered() calls isProcessAlive()`
- c0190 ..> c0207: `updateConflict() calls jsonSnapshot()`
- c0190 ..> c0207: `updateConflict() calls nowIso()`
- c0190 ..> c0207: `updateWatermark() calls contextKey()`
- c0190 ..> c0207: `updateWatermark() calls nowIso()`
- c0190 ..> c0207: `writeState() calls releaseCompletedArtifacts()`
- c0190 ..> c0225: `compactJobSnapshot() calls compactCaptureSnapshot()`
- c0190 ..> c0225: `enqueue() calls reuseCaptureHistory()`
- c0190 ..> c0225: `enqueue() calls sanitizeCaptureSnapshot()`
- c0190 ..> c0225: `writeState() calls sanitizeCaptureSnapshot()`
- c0193 --> c0077: `field replacement`
- c0193 --> c0084: `field replacement`
- c0193 --> c0097: `field context`
- c0193 --> c0197: `field binding`
- c0193 --> c0205: `field supersession`
- c0195 --> c0068: `field compactedConversation`
- c0195 --> c0077: `field inspectionEntries`
- c0195 --> c0200: `field status`
- c0195 --> c0205: `field supersession`
- c0198 --> c0064: `field snapshot`
- c0198 --> c0197: `field binding`
- c0198 --> c0200: `field status`
- c0198 --> c0205: `field supersession`
- c0199 --> c0064: `field snapshot`
- c0201 --> c0193: `field conflicts`
- c0201 --> c0202: `field watermarks`
- c0201 --> c0204: `field jobs`
- c0204 --|> c0198: `inherits`
- c0207 ..> c0064: `type in dedupeKey`
- c0207 ..> c0064: `type in orderedSourceEntryIds`
- c0207 ..> c0064: `type in summaryCursor`
- c0207 ..> c0077: `type in validateInspectionEntry`
- c0207 ..> c0126: `releaseCompletedArtifacts() calls get()`
- c0207 ..> c0186: `sanitizeOutcomeMap() calls sanitizeValue()`
- c0207 ..> c0186: `scrubDiagnostic() calls sanitizeText()`
- c0207 ..> c0190: `nowIso() calls now()`
- c0207 ..> c0193: `type in conflictIdentityMatches`
- c0207 ..> c0197: `type in conflictIdentityMatches`
- c0207 ..> c0197: `type in identityMatches`
- c0207 ..> c0198: `type in identityMatches`
- c0207 ..> c0198: `type in interruptedWrite`
- c0207 ..> c0201: `type in normaliseState`
- c0207 ..> c0202: `type in clearHistoryCache`
- c0207 ..> c0204: `type in releaseCompletedArtifacts`
- c0207 ..> c0207: `conflictIdentityMatches() calls identityMatches()`
- c0207 ..> c0207: `interruptedWrite() calls outcomeRecord()`
- c0207 ..> c0207: `releaseCompletedArtifacts() calls outcomeRecord()`
- c0207 ..> c0207: `releaseCompletedArtifacts() calls scrubDiagnostic()`
- c0207 ..> c0207: `summaryCursor() calls orderedSourceEntryIds()`
- c0209 --> c0091: `field projects`
- c0209 --> c0094: `field scope`
- c0209 --> c0097: `field context`
- c0211 --> c0077: `field sessionContext`
- c0211 --> c0088: `field diagnosticContext`
- c0211 --> c0091: `field projects`
- c0211 --> c0094: `field scope`
- c0211 --> c0097: `field context`
- c0211 --> c0210: `field onPlan`
- c0212 --> c0094: `field scope`
- c0213 ..> c0049: `searchMemories() calls mapConcurrent()`
- c0213 ..> c0061: `constructor() calls isRecallConcurrency()`
- c0213 ..> c0061: `deeper() calls resolveScope()`
- c0213 ..> c0061: `recall() calls resolveScope()`
- c0213 --> c0079: `field client`
- c0213 ..> c0079: `type in constructor`
- c0213 ..> c0082: `type in memoryInScope`
- c0213 ..> c0082: `type in optionalKnowledge`
- c0213 --> c0085: `field model`
- c0213 ..> c0085: `type in constructor`
- c0213 ..> c0087: `type in recallReadTool`
- c0213 ..> c0091: `type in matchResolution`
- c0213 ..> c0091: `type in resolveScope`
- c0213 ..> c0094: `type in empty`
- c0213 ..> c0094: `type in memoryInScope`
- c0213 ..> c0094: `type in optionalKnowledge`
- c0213 ..> c0094: `type in requestsDifferentProject`
- c0213 ..> c0094: `type in resolveScope`
- c0213 ..> c0094: `type in searchMemories`
- c0213 ..> c0094: `type in searchRequest`
- c0213 ..> c0095: `type in searchRequest`
- c0213 ..> c0097: `type in contextProjectResolution`
- c0213 ..> c0097: `type in resolveScope`
- c0213 ..> c0097: `type in searchRequest`
- c0213 ..> c0126: `deeper() calls search()`
- c0213 ..> c0126: `resolveScope() calls listProjects()`
- c0213 ..> c0126: `searchMemories() calls search()`
- c0213 ..> c0135: `type in optionalKnowledge`
- c0213 ..> c0135: `type in resultWithKnowledge`
- c0213 --> c0136: `field knowledge`
- c0213 ..> c0136: `constructor() constructs KnowledgeReadService`
- c0213 ..> c0136: `optionalKnowledge() calls expand()`
- c0213 ..> c0151: `recallReadTool() calls executeKnowledgeRead()`
- c0213 ..> c0182: `recall() calls complete()`
- c0213 ..> c0186: `deeper() calls sanitizeText()`
- c0213 ..> c0186: `finishReview() calls sanitizeText()`
- c0213 ..> c0186: `plannerInput() calls sanitizeText()`
- c0213 ..> c0186: `queryContext() calls sanitizeText()`
- c0213 ..> c0186: `recall() calls sanitizeText()`
- c0213 ..> c0186: `recall() calls sanitizeValue()`
- c0213 ..> c0186: `searchFailure() calls sanitizeValue()`
- c0213 ..> c0208: `type in authorizeProjectSelection`
- c0213 ..> c0208: `type in ensureLive`
- c0213 ..> c0208: `type in finishFailure`
- c0213 ..> c0208: `type in searchMemories`
- c0213 ..> c0209: `type in deeper`
- c0213 ..> c0210: `type in authorizeProjectSelection`
- c0213 ..> c0210: `type in queryContext`
- c0213 ..> c0210: `type in requestsDifferentProject`
- c0213 ..> c0210: `type in searchMemories`
- c0213 ..> c0210: `type in searchRequest`
- c0213 ..> c0211: `type in authorizeProjectSelection`
- c0213 ..> c0211: `type in finishFailure`
- c0213 ..> c0211: `type in plannerInput`
- c0213 ..> c0211: `type in recall`
- c0213 ..> c0211: `type in recallReadTool`
- c0213 ..> c0211: `type in requestsDifferentProject`
- c0213 ..> c0211: `type in searchMemories`
- c0213 ..> c0212: `type in deeper`
- c0213 ..> c0212: `type in empty`
- c0213 ..> c0212: `type in finishFailure`
- c0213 ..> c0212: `type in finishReview`
- c0213 ..> c0212: `type in recall`
- c0213 ..> c0212: `type in recallReadTool`
- c0213 ..> c0212: `type in resultWithKnowledge`
- c0213 ..> c0213: `authorizeProjectSelection() calls requestsDifferentProject()`
- c0213 ..> c0213: `circuitOpen() calls now()`
- c0213 ..> c0213: `deeper() calls circuitOpen()`
- c0213 ..> c0213: `deeper() calls empty()`
- c0213 ..> c0213: `deeper() calls memoryInScope()`
- c0213 ..> c0213: `deeper() calls optionalKnowledge()`
- c0213 ..> c0213: `deeper() calls recordFailure()`
- c0213 ..> c0213: `deeper() calls recordSuccess()`
- c0213 ..> c0213: `deeper() calls resultWithKnowledge()`
- c0213 ..> c0213: `finishFailure() calls empty()`
- c0213 ..> c0213: `finishFailure() calls recordFailure()`
- c0213 ..> c0213: `finishReview() calls recordFailure()`
- c0213 ..> c0213: `finishReview() calls recordSuccess()`
- c0213 ..> c0213: `recall() calls authorizeProjectSelection()`
- c0213 ..> c0213: `recall() calls circuitOpen()`
- c0213 ..> c0213: `recall() calls empty()`
- c0213 ..> c0213: `recall() calls ensureLive()`
- c0213 ..> c0213: `recall() calls finishFailure()`
- c0213 ..> c0213: `recall() calls finishReview()`
- c0213 ..> c0213: `recall() calls memoryInScope()`
- c0213 ..> c0213: `recall() calls optionalKnowledge()`
- c0213 ..> c0213: `recall() calls plannerInput()`
- c0213 ..> c0213: `recall() calls recallReadTool()`
- c0213 ..> c0213: `recall() calls recordSuccess()`
- c0213 ..> c0213: `recall() calls resultWithKnowledge()`
- c0213 ..> c0213: `recall() calls searchMemories()`
- c0213 ..> c0213: `recall() calls searchRequest()`
- c0213 ..> c0213: `recordFailure() calls now()`
- c0213 ..> c0213: `resolveScope() calls contextProjectResolution()`
- c0213 ..> c0213: `resolveScope() calls matchResolution()`
- c0213 ..> c0213: `searchMemories() calls ensureLive()`
- c0213 ..> c0213: `searchMemories() calls searchFailure()`
- c0213 ..> c0213: `searchMemories() calls searchRequest()`
- c0213 ..> c0213: `searchRequest() calls queryContext()`
- c0213 ..> c0214: `type in constructor`
- c0213 ..> c0215: `finishReview() constructs ReviewValidationError`
- c0213 ..> c0216: `type in contextProjectResolution`
- c0213 ..> c0216: `type in matchResolution`
- c0213 ..> c0216: `type in recallReadTool`
- c0213 ..> c0216: `type in resolveScope`
- c0213 ..> c0216: `type in searchMemories`
- c0213 ..> c0216: `type in searchRequest`
- c0213 ..> c0217: `type in searchMemories`
- c0213 ..> c0218: `authorizeProjectSelection() calls raceAbort()`
- c0213 ..> c0218: `deeper() calls createDeadlineSignal()`
- c0213 ..> c0218: `deeper() calls failureReason()`
- c0213 ..> c0218: `deeper() calls formatRecall()`
- c0213 ..> c0218: `deeper() calls isForgetfulResponseError()`
- c0213 ..> c0218: `deeper() calls raceAbort()`
- c0213 ..> c0218: `deeper() calls trim()`
- c0213 ..> c0218: `ensureLive() calls abortError()`
- c0213 ..> c0218: `finishFailure() calls failureReason()`
- c0213 ..> c0218: `finishFailure() calls submissionAttemptTrace()`
- c0213 ..> c0218: `finishReview() calls parseReview()`
- c0213 ..> c0218: `finishReview() calls reviewMismatchDirection()`
- c0213 ..> c0218: `finishReview() calls reviewSources()`
- c0213 ..> c0218: `finishReview() calls reviewValidationDebug()`
- c0213 ..> c0218: `finishReview() calls sourceLabels()`
- c0213 ..> c0218: `finishReview() calls submissionAttemptTrace()`
- c0213 ..> c0218: `optionalKnowledge() calls raceAbort()`
- c0213 ..> c0218: `plannerInput() calls availableProjects()`
- c0213 ..> c0218: `recall() calls boundDebugText()`
- c0213 ..> c0218: `recall() calls createDeadlineSignal()`
- c0213 ..> c0218: `recall() calls formatRecall()`
- c0213 ..> c0218: `recall() calls parsePlan()`
- c0213 ..> c0218: `recall() calls raceAbort()`
- c0213 ..> c0218: `recall() calls recallReviewSubmission()`
- c0213 ..> c0218: `recall() calls reviewSources()`
- c0213 ..> c0218: `recall() calls sanitizePolicy()`
- c0213 ..> c0218: `recall() calls submissionAttemptTrace()`
- c0213 ..> c0218: `recall() calls trim()`
- c0213 ..> c0218: `recallReadTool() calls abortError()`
- c0213 ..> c0218: `recallReadTool() calls reviewSources()`
- c0213 ..> c0218: `resolveScope() calls availableProjects()`
- c0213 ..> c0218: `searchMemories() calls exceptionDiagnostic()`
- c0213 ..> c0218: `searchMemories() calls isAbort()`
- c0213 ..> c0218: `searchMemories() calls raceAbort()`
- c0213 ..> c0218: `searchRequest() calls repoAwareQuery()`
- c0216 --> c0091: `field project`
- c0217 --> c0082: `field memories`
- c0218 ..> c0004: `availableProjects() calls set()`
- c0218 ..> c0082: `type in formatRecall`
- c0218 ..> c0082: `type in validateMemory`
- c0218 ..> c0090: `type in recallReviewSubmission`
- c0218 ..> c0091: `type in availableProjects`
- c0218 ..> c0097: `type in availableProjects`
- c0218 ..> c0097: `type in repoAwareQuery`
- c0218 ..> c0097: `type in repositoryIdentity`
- c0218 ..> c0135: `type in formatRecall`
- c0218 ..> c0186: `exceptionDiagnostic() calls sanitizeText()`
- c0218 ..> c0186: `formatRecall() calls sanitizeText()`
- c0218 ..> c0186: `parseReview() calls sanitizeText()`
- c0218 ..> c0186: `plannerString() calls sanitizeText()`
- c0218 ..> c0186: `repoAwareQuery() calls sanitizeText()`
- c0218 ..> c0186: `repositoryIdentity() calls sanitizeText()`
- c0218 ..> c0186: `reviewMismatchDirection() calls sanitizeText()`
- c0218 ..> c0186: `reviewerOutputText() calls sanitizeText()`
- c0218 ..> c0186: `reviewerOutputText() calls sanitizeValue()`
- c0218 ..> c0186: `sanitizePolicy() calls sanitizeText()`
- c0218 ..> c0186: `submissionAttemptTrace() calls sanitizeText()`
- c0218 ..> c0208: `type in createDeadlineSignal`
- c0218 ..> c0208: `type in failureReason`
- c0218 ..> c0210: `type in parsePlan`
- c0218 ..> c0212: `type in parseReview`
- c0218 ..> c0212: `type in recallReviewSubmission`
- c0218 ..> c0212: `type in reviewSources`
- c0218 ..> c0212: `type in reviewValidationDebug`
- c0218 ..> c0213: `createDeadlineSignal() calls now()`
- c0218 ..> c0218: `createDeadlineSignal() calls exceptionDiagnostic()`
- c0218 ..> c0218: `formatRecall() calls trim()`
- c0218 ..> c0218: `parseEntities() calls plannerString()`
- c0218 ..> c0218: `parsePlan() calls isObject()`
- c0218 ..> c0218: `parsePlan() calls parseEntities()`
- c0218 ..> c0218: `parsePlan() calls parseQueries()`
- c0218 ..> c0218: `parsePlan() calls plannerString()`
- c0218 ..> c0218: `parsePlan() calls positiveInteger()`
- c0218 ..> c0218: `parseQueries() calls plannerString()`
- c0218 ..> c0218: `parseReview() calls isObject()`
- c0218 ..> c0218: `parseReview() calls reviewSources()`
- c0218 ..> c0218: `parseReview() calls sourceLabels()`
- c0218 ..> c0218: `parseReview() calls trim()`
- c0218 ..> c0218: `plannerString() calls trim()`
- c0218 ..> c0218: `raceAbort() calls abortError()`
- c0218 ..> c0218: `repoAwareQuery() calls repositoryIdentity()`
- c0218 ..> c0218: `repoAwareQuery() calls trim()`
- c0218 ..> c0218: `repositoryIdentity() calls trim()`
- c0218 ..> c0218: `reviewMismatchDirection() calls isObject()`
- c0218 ..> c0218: `reviewMismatchDirection() calls trim()`
- c0218 ..> c0218: `reviewValidationDebug() calls boundDebugText()`
- c0218 ..> c0218: `reviewValidationDebug() calls reviewSources()`
- c0218 ..> c0218: `reviewValidationDebug() calls reviewerOutputText()`
- c0218 ..> c0218: `reviewValidationDebug() calls sourceLabels()`
- c0218 ..> c0218: `submissionAttemptTrace() calls trim()`
- c0218 ..> c0218: `validateMemory() calls isObject()`
- c0219 ..> c0218: `repositoryName() calls trim()`
- c0220 --|> c0064: `inherits`
- c0222 --> c0063: `field mode`
- c0222 --> c0094: `field scope`
- c0222 --> c0097: `field context`
- c0222 --> c0224: `field session`
- c0223 --> c0220: `field snapshot`
- c0225 ..> c0062: `type in captureSummaryRecord`
- c0225 ..> c0062: `type in reuseCaptureHistory`
- c0225 ..> c0064: `type in compactCaptureSnapshot`
- c0225 ..> c0064: `type in reuseCaptureHistory`
- c0225 ..> c0064: `type in sanitizeCaptureSnapshot`
- c0225 ..> c0068: `type in compactCaptureSnapshot`
- c0225 ..> c0077: `type in collectEvidence`
- c0225 ..> c0077: `type in evidenceForEntry`
- c0225 ..> c0077: `type in toolEvidence`
- c0225 ..> c0186: `captureSummaryRecord() calls sanitizeText()`
- c0225 ..> c0186: `compactCaptureSnapshot() calls sanitizeText()`
- c0225 ..> c0186: `conversationForEntry() calls isMemoryOperation()`
- c0225 ..> c0186: `safeText() calls sanitizeText()`
- c0225 ..> c0186: `sanitizeCaptureSnapshot() calls sanitizeValue()`
- c0225 ..> c0186: `sanitizeConversation() calls sanitizeText()`
- c0225 ..> c0186: `sanitizeConversation() calls sanitizeValue()`
- c0225 ..> c0186: `toolEvidence() calls isMemoryOperation()`
- c0225 ..> c0186: `toolEvidence() calls sanitizeValue()`
- c0225 ..> c0218: `compactCaptureSnapshot() calls trim()`
- c0225 ..> c0218: `safeText() calls trim()`
- c0225 ..> c0221: `type in asMessage`
- c0225 ..> c0221: `type in lastAssistantEntry`
- c0225 ..> c0221: `type in toolEvidence`
- c0225 ..> c0222: `type in buildCaptureSnapshot`
- c0225 ..> c0222: `type in collectEvidence`
- c0225 ..> c0222: `type in toolEvidence`
- c0225 ..> c0223: `type in buildCaptureSnapshot`
- c0225 ..> c0225: `asMessage() calls isRecord()`
- c0225 ..> c0225: `buildCaptureSnapshot() calls collectEvidence()`
- c0225 ..> c0225: `buildCaptureSnapshot() calls deltaStartIndex()`
- c0225 ..> c0225: `buildCaptureSnapshot() calls lastAssistantEntry()`
- c0225 ..> c0225: `buildCaptureSnapshot() calls rootId()`
- c0225 ..> c0225: `buildCaptureSnapshot() calls snapshotId()`
- c0225 ..> c0225: `collectEvidence() calls evidenceForEntry()`
- c0225 ..> c0225: `compactCaptureSnapshot() calls captureSummaryRecord()`
- c0225 ..> c0225: `compactCaptureSnapshot() calls isRecord()`
- c0225 ..> c0225: `contentText() calls isRecord()`
- c0225 ..> c0225: `conversationForEntry() calls asMessage()`
- c0225 ..> c0225: `conversationForEntry() calls isRecord()`
- c0225 ..> c0225: `conversationForEntry() calls sanitizeConversation()`
- c0225 ..> c0225: `evidenceForEntry() calls asMessage()`
- c0225 ..> c0225: `evidenceForEntry() calls contentText()`
- c0225 ..> c0225: `evidenceForEntry() calls isRecord()`
- c0225 ..> c0225: `evidenceForEntry() calls safeText()`
- c0225 ..> c0225: `evidenceForEntry() calls toolEvidence()`
- c0225 ..> c0225: `lastAssistantEntry() calls asMessage()`
- c0225 ..> c0225: `reuseCaptureHistory() calls captureSummaryRecord()`
- c0225 ..> c0225: `reuseCaptureHistory() calls isRecord()`
- c0225 ..> c0225: `sanitizeCaptureSnapshot() calls sanitizeCaptureConversation()`
- c0225 ..> c0225: `sanitizeConversation() calls isRecord()`
- c0225 ..> c0225: `toolEvidence() calls contentText()`
- c0225 ..> c0225: `toolEvidence() calls safeText()`
- c0228 --> c0226: `field error`
- c0228 --> c0226: `field provenanceError`
- c0229 ..> c0004: `readFile() calls close()`
- c0229 ..> c0040: `getUrl() calls resolve()`
- c0229 ..> c0040: `git() calls resolve()`
- c0229 ..> c0040: `inspect() calls resolve()`
- c0229 ..> c0126: `getUrl() calls get()`
- c0229 ..> c0151: `readFile() calls readFile()`
- c0229 ..> c0165: `git() calls execute()`
- c0229 ..> c0186: `inspect() calls sanitizeValue()`
- c0229 ..> c0186: `inspectUrl() calls sanitizeText()`
- c0229 ..> c0186: `inspectUrl() calls sanitizeValue()`
- c0229 ..> c0218: `provenance() calls trim()`
- c0229 ..> c0227: `type in inspectUrl`
- c0229 ..> c0228: `type in inspect`
- c0229 ..> c0228: `type in inspectUrl`
- c0229 ..> c0229: `getUrl() calls check()`
- c0229 ..> c0229: `git() calls check()`
- c0229 ..> c0229: `inspect() calls check()`
- c0229 ..> c0229: `inspect() calls inspectUrl()`
- c0229 ..> c0229: `inspect() calls provenance()`
- c0229 ..> c0229: `inspect() calls readFile()`
- c0229 ..> c0229: `inspectUrl() calls check()`
- c0229 ..> c0229: `inspectUrl() calls getUrl()`
- c0229 ..> c0229: `provenance() calls git()`
- c0229 ..> c0229: `readFile() calls check()`
- c0229 --> c0230: `field options`
- c0229 ..> c0230: `type in constructor`
- c0229 ..> c0231: `getUrl() calls validateAddress()`
- c0229 ..> c0231: `getUrl() calls validateUrl()`
- c0229 ..> c0231: `git() calls requireInside()`
- c0229 ..> c0231: `inspect() calls errorDetails()`
- c0229 ..> c0231: `inspect() calls requireInside()`
- c0229 ..> c0231: `inspect() calls sourceContent()`
- c0229 ..> c0231: `inspectUrl() calls loopback()`
- c0229 ..> c0231: `inspectUrl() calls sourceContent()`
- c0229 ..> c0231: `inspectUrl() calls validateUrl()`
- c0229 ..> c0231: `provenance() calls errorDetails()`
- c0229 ..> c0231: `readFile() calls requireInside()`
- c0231 ..> c0186: `errorDetails() calls sanitizeText()`
- c0231 ..> c0186: `sourceContent() calls sanitizeText()`
- c0231 ..> c0186: `validateUrl() calls sanitizeText()`
- c0231 ..> c0186: `validateUrl() calls sanitizeValue()`
- c0231 ..> c0226: `type in errorDetails`
- c0231 ..> c0227: `type in sourceContent`
- c0231 ..> c0229: `validateAddress() calls check()`
- c0231 ..> c0231: `validateAddress() calls loopback()`

## Type key

- Type1: `(text: string) => string`
- Type2: `"pending" | "planned" | "complete" | "partial" | "unsupported"`
- Type3: `Array<{ memoryId: number; reason: string }>`
- Type4: `{ documents: Document[]; codeArtifacts: CodeArtifact[] }`
- Type5: `Array<{ operation: string; error: string }>`
- Type6: `"link" | "unlink" | "attachments" | "entity"`
- Type7: `"started" | "completed" | "failed"`
- Type8: `"keep" | "reject" | "add" | "ignore" | "unresolved"`
- Type9: `"complete" | "unresolved"`
- Type10: `Promise<Memory | undefined>`
- Type11: `NonNullable<CaptureLinkReview["unreviewed"]>`
- Type12: `number[] | undefined`
- Type13: `() => Promise<void>`
- Type14: `Map<string, boolean>`
- Type15: `PreservationDecision | undefined`
- Type16: `Map<string, { decisions: LinkDecision[]; preservation?: PreservationDecision }>`
- Type17: `Array<{ candidateId: string; review: CaptureLinkReview }>`
- Type18: `ConnectionResult["operation"]`
- Type19: `() => Promise<unknown>`
- Type20: `(review: CaptureLinkReview) => Promise<void>`
- Type21: `() => void`
- Type22: `Promise<{ documents: Document[]; codeArtifacts: CodeArtifact[] }>`
- Type23: `Array<{ id: string; reason: string }>`
- Type24: `CaptureCandidate["evidenceType"]`
- Type25: `| { valid: true; value: T } | { valid: false; reason: string }`
- Type26: `"create" | "skip" | "supersede" | "escalate"`
- Type27: `"reviewing" | "saving" | "checking"`
- Type28: `"userDecision" | "verifiedToolChange" | "observation"`
- Type29: `Array<{ jobId: string; error: string }>`
- Type30: `"ready" | "busy"`
- Type31: `{ status: CaptureLinkReview["status"]; unreviewedCount: number; reason?: string }`
- Type32: `PendingConflict["status"]`
- Type33: `{ entryId: string; inspectionEntryIds: string[] } | null`
- Type34: `"resolved" | "deferred" | "rejected"`
- Type35: `Array<{ key: string; id: number }>`
- Type36: `(id: number) => Promise<Memory>`
- Type37: `() => boolean | Promise<boolean>`
- Type38: `() => CaptureMode | Promise<CaptureMode>`
- Type39: `() => boolean`
- Type40: `() => Date`
- Type41: `CaptureServiceOptions["onActivity"]`
- Type42: `() => Promise<T>`
- Type43: `(signal: AbortSignal) => Promise<T>`
- Type44: `"reviewing" | "checking"`
- Type45: `"info" | "debug"`
- Type46: `Record<string, unknown>`
- Type47: `"capture" | "overlap" | "overlapBatch"`
- Type48: `Promise<number | undefined>`
- Type49: `CaptureNeighborhood | undefined`
- Type50: `"created" | "skipped" | "replacement-created"`
- Type51: `Promise<"applied" | "already">`
- Type52: `Promise<{ job: QueueJob; destination?: number }>`
- Type53: `Promise< | { status: "ready"; job: QueueJob; outcome: Record<string, unknown> |
  undefined; overlaps: Memory[]; } | { status: "skipped"; job: QueueJob } >`
- Type54: `Record<string, unknown> | undefined`
- Type55: `Promise<Entity | undefined>`
- Type56: `Promise<{ entities: Entity[]; truncated: boolean }>`
- Type57: `Promise<{ relationships: EntityRelationship[]; truncated: boolean }>`
- Type58: `Promise< | { status: "ready"; job: QueueJob; decision: CaptureDecision } | { status:
  "skipped"; job: QueueJob } >`
- Type59: `Promise<{ job: QueueJob; candidates: CaptureCandidate[]; progress?: boolean }>`
- Type60: `Promise<{ job: QueueJob; stopped: boolean }>`
- Type61: `CaptureLinkReview | undefined`
- Type62: `Promise<{ job: QueueJob; inputs: Array<{ candidateId: string; review: CaptureLinkReview
  }> }>`
- Type63: `Promise<"progress" | void>`
- Type64: `Promise<"advance" | "progress" | "deferred">`
- Type65: `CaptureSnapshot | CaptureCheckpointOptions`
- Type66: `{ sessionId?: string; branchId?: string; jobId?: string; limit?: number; }`
- Type67: `{ sessionId?: string; branchId?: string; }`
- Type68: `{ sessionId?: string; branchId?: string } | string`
- Type69: `CaptureCandidate & { sourceFiles: string[] }`
- Type70: `Promise<NonNullable<PendingConflict["replacement"]>>`
- Type71: `CaptureAdvanceInput | CaptureSnapshot`
- Type72: `Pick<WorkContext, "sessionId" | "branchId">`
- Type73: `(phase: CaptureActivityPhase | undefined) => void`
- Type74: `"supersede" | "skip" | "defer"`
- Type75: `Pick< CaptureCandidate, "entities" | "documents" | "codeArtifacts" | "relationships" >`
- Type76: `string | undefined`
- Type77: `number | undefined`
- Type78: `CandidateValidation<CandidateDestination>`
- Type79: `CandidateValidation<Pick<EntityInput, "entity_type" | "custom_type">>`
- Type80: `CandidateValidation<CaptureEntityResource>`
- Type81: `CandidateValidation<CaptureDocumentResource>`
- Type82: `CandidateValidation<CaptureCodeArtifactResource>`
- Type83: `CandidateValidation<CaptureRelationshipResource>`
- Type84: `(item: Record<string, unknown>, index: number) => CandidateValidation<unknown>`
- Type85: `CaptureCandidate | undefined`
- Type86: `(id: string, raw: unknown, reason?: string) => void`
- Type87: `(reason: string) => void`
- Type88: `string[] | undefined`
- Type89: `"reason" | "oldClaim" | "newClaim"`
- Type90: `KnowledgeWritePlan | undefined`
- Type91: `(item: T, index: number) => Promise<R>`
- Type92: `{ userSettings: string; projectSettings: string; }`
- Type93: `"classification" | "recall" | "capture"`
- Type94: `"default" | "project" | "invalid"`
- Type95: `"debug" | "info" | "warning" | "error"`
- Type96: `value is Record<string, unknown>`
- Type97: `ModelSelection | undefined`
- Type98: `{ scope: Scope; scopeSource: ScopeSource }`
- Type99: `Partial< Pick< PersistedUserSettings, | "base_url" | "token_env" | "timeout_ms" |
  "enabled" | "capture_mode" | "debug" | "verbosity" | "logging" | "recall_model_timeout_ms" |
  "recall_concurrency" | "context_limit_tokens" | "model" > >`
- Type100: `{ baseUrl: string; tokenEnv?: string }`
- Type101: `"auto" | "observe" | "off"`
- Type102: `"complete" | "legacy-partial" | "summarized"`
- Type103: `string | null`
- Type104: `number | null`
- Type105: `Omit<CodeArtifact, "code">`
- Type106: `Omit<Document, "content">`
- Type107: `"Organization" | "Individual" | "Team" | "Device" | "System" | "Other"`
- Type108: `"user" | "assistant" | "toolResult"`
- Type109: `Promise<{ id: number; title: string }[]>`
- Type110: `Promise<"ready" | "progress">`
- Type111: `"classification" | "recall-review" | "capture" | "overlap"`
- Type112: `(view: CompactedConversation) => Promise<void>`
- Type113: `() => unknown`
- Type114: `{ jobId?: string; sessionId?: string; branchId?: string; candidateId?: string; }`
- Type115: `"global" | "project"`
- Type116: `{ cwd: string; repoName?: string; project?: { id: number; name: string } }`
- Type117: `Array<{ key: string; stage: string; reason?: string }>`
- Type118: `{ detail: string; retryPending: boolean; key: string }`
- Type119: `| { kind: "completed"; value: T } | { kind: "aborted" } | { kind: "timed-out" } | {
  kind: "failed"; error: unknown }`
- Type120: `"completed"`
- Type121: `"aborted"`
- Type122: `"timed-out"`
- Type123: `"failed"`
- Type124: `{ sessionId: string; branchId: string; entryIds: string[]; finalEntryId?: string;
  snapshotId?: string; }`
- Type125: `void | Promise<void>`
- Type126: `{ action: "supersede" | "skip" | "defer"; reason?: string; evidenceEntryIds?: string[];
  additionalEvidence?: string; additionalEntries?: EvidenceEntry[]; conversation?: readonly
  unknown[]; }`
- Type127: `Map<string, number>`
- Type128: `(options: { baseUrl: string; token?: string; timeoutMs: number; }) => ForgetfulClient`
- Type129: `( client: ForgetfulClient, model: PiMemoryModel, config: ForgetfulConfig, ) =>
  RecallServicePort`
- Type130: `( config: ForgetfulConfig, client: ForgetfulClient | undefined, model: PiMemoryModel |
  undefined, ) => CaptureServicePort | undefined`
- Type131: `( ctx: ExtensionContext, branchId: string, ) => Promise<ExtensionWorkContext> |
  ExtensionWorkContext`
- Type132: `Partial< Pick< LoadConfigOptions, | "userSettingsPath" | "projectSettingsPath" |
  "userPromptDir" | "projectPromptDir" > >`
- Type133: `Partial<Record<PolicyName, string>>`
- Type134: `keyof typeof DEFAULT_MEMORY_POLICIES | "capture" | "overlap"`
- Type135: `"automatic" | "queued"`
- Type136: `"pending" | "retrieval" | "terminal"`
- Type137: `RecallRequest & { sessionContext?: EvidenceEntry[] }`
- Type138: `Map<string, CaptureFeedbackState>`
- Type139: `{ throughTriggerId: number; branches: CaptureBranch[] }`
- Type140: `Map<string, PendingQueuedRecall[]>`
- Type141: `Map<string, AutomaticRecall>`
- Type142: `Map<string, RecallJob>`
- Type143: `readonly (AbortSignal | undefined)[]`
- Type144: `Promise<string | undefined>`
- Type145: `Promise<SetupAuthentication | undefined>`
- Type146: `"context" | "failure" | "no-context"`
- Type147: `{ id: string; prompt: string } | undefined`
- Type148: `Array<{ role: string; content?: unknown }>`
- Type149: `Promise<Model<any> | undefined>`
- Type150: `Model<any> | undefined`
- Type151: `"info" | "warning" | "error"`
- Type152: `"warning" | "error"`
- Type153: `Promise<Record<string, unknown> | undefined>`
- Type154: `CaptureCheckpointResult | undefined`
- Type155: `AutomaticCaptureJobOutcome | undefined`
- Type156: `Promise<AutomaticCaptureJobOutcome | undefined>`
- Type157: `{ failure?: NonNullable<AutomaticCaptureJobOutcome["failure"]>; recovered: boolean; }`
- Type158: `ReturnType<typeof collectCaptureFeedback>`
- Type159: `{ message?: string; terminalJobIds: string[] }`
- Type160: `(value: unknown) => Memory`
- Type161: `( path: string, method: string, body: Record<string, unknown> | undefined, signal:
  AbortSignal | undefined, statuses: number[], ) => Promise<unknown>`
- Type162: `Partial<DocumentInput | CodeArtifactInput>`
- Type163: `DocumentSummary | CodeArtifactSummary`
- Type164: `string | URL`
- Type165: `AbortSignal | undefined`
- Type166: `{ k: number; maxLinks: number; }`
- Type167: `KnowledgeReadServiceOptions | MemoryReader`
- Type168: `Promise<Map<number, Entity>>`
- Type169: `Map<number, Entity>`
- Type170: `({ id: number; title: string }[] | undefined)[]`
- Type171: `( id: number, signal?: AbortSignal, ) => Promise<Memory>`
- Type172: `number | null | undefined`
- Type173: `Promise<T | undefined>`
- Type174: `Record<string, unknown> & { operation: string }`
- Type175: `{ id: number; name: string }`
- Type176: `Array<ToolText | ToolImage>`
- Type177: `"image"`
- Type178: `"text"`
- Type179: `Array<[string, number]>`
- Type180: `Document | CodeArtifact`
- Type181: `"content" | "code"`
- Type182: `{ items: T[]; offset: number; limit: number; total: number; truncated: boolean }`
- Type183: `{ items: unknown[]; offset: number; limit: number; total: number; truncated: boolean;
  next_offset: number }`
- Type184: `{ content: Array<ToolText | ToolImage>; kind: string }`
- Type185: `{ source_repo?: string; source_files?: string[]; encoding_version?: string; }`
- Type186: `(() => Promise<void>) | undefined`
- Type187: `( state: KnowledgeWriteState, ) => Promise<void>`
- Type188: `{ title: string; content: string }`
- Type189: `{ key: string }[]`
- Type190: `{ kind: string; key: string; create: () => Promise<T>; authorize?: () => Promise<void>;
  }`
- Type191: `KnowledgeWriteGuard | undefined`
- Type192: `{ document_ids?: number[]; code_artifact_ids?: number[]; }`
- Type193: `Pick< KnowledgeClient, | "getEntity" | "createEntity" | "getDocument" | "createDocument"
  | "getCodeArtifact" | "createCodeArtifact" | "getRelationships" | "createRelationship" |
  "linkEntityMemory" | "linkMemories" | "updateMemory" >`
- Type194: `"off" | "info" | "debug"`
- Type195: `{ directory: string; sessionId: string; level: FileLogLevel; onError?: (error: unknown)
  => void; maxFileBytes?: number; maxFiles?: number; maxEventBytes?: number; }`
- Type196: `CompactedMemoryHistory & { summaryMessage: Message }`
- Type197: `CompactedMemoryHistory | undefined`
- Type198: `(history: CompactedMemoryHistory) => Promise<void>`
- Type199: `Promise<number | "progress">`
- Type200: `( context: Context, options: SimpleStreamOptions, ) => Promise<AssistantMessage>`
- Type201: `Promise<{ summary: string; count: number }>`
- Type202: `( headers: ProviderHeaders, ) => ProviderHeaders | Promise<ProviderHeaders>`
- Type203: `ModelRegistryPort & { getAvailable?: () => Model<any>[]; }`
- Type204: `readonly { model: Model<any> }[]`
- Type205: `"task" | "compaction"`
- Type206: `() => Promise<number>`
- Type207: `ProviderHeaders | undefined`
- Type208: `MemoryModelHeaderTransform | undefined`
- Type209: `ModelSubmissionTool | ModelReadTool`
- Type210: `PiMemoryModel | undefined`
- Type211: `Project | undefined`
- Type212: `Promise<ProjectInput | undefined>`
- Type213: `Promise<Project | undefined>`
- Type214: `DurableQueueStoreOptions | string`
- Type215: `( state: QueueState, ) => | Promise<{ value: T; changed?: boolean }> | { value: T;
  changed?: boolean }`
- Type216: `WatermarkAdvance | CaptureSnapshot`
- Type217: `WorkContext & { projects?: Project[] }`
- Type218: `Promise<QueueJob | undefined>`
- Type219: `Array<{ sessionId: string; branchId: string }>`
- Type220: `{ sessionId: string; branchId: string }`
- Type221: `(outcomes: Array<{ jobId: string; error: string }>) => void`
- Type222: `{ sessionId: string; branchId: string } | undefined`
- Type223: `QueueCheckpoint | string`
- Type224: `Promise<PendingConflict | undefined>`
- Type225: `"pending" | "resolved" | "rejected"`
- Type226: `{ // Missing version identifies legacy implicit preservation plans; never execute as
  explicit. planVersion?: 1; requestKey?: string; requestPayload?: string; request?: {
  evidenceEntryIds: string[]; selectedAdditionalEntries: EvidenceEntry[]; reason?: string;
  additionalEvidence?: string; }; // The model's update selection and this plan's actual target are
  distinct from older targets. replacementMemoryId?: number; memoryId?: number; priorMemoryId?:
  number; updateComplete?: boolean; executionError?: string; // Service creation output, separate
  from model-selected manual link operations. autoLinkedMemoryIds?: number[]; completedEntityIds?:
  number[]; completedMemoryIds?: number[]; creationError?: string; input: MemoryInput; candidate:
  unknown; entityIds: number[]; memoryIds: number[]; linksComplete?: boolean; creationAttempted?:
  boolean; knowledgeState?: unknown; }`
- Type227: `Omit<CaptureSnapshot, "entries" | "conversation" | "sourceConversation">`
- Type228: `| "pending" | "running" | "paused" | "complete" | "failed"`
- Type229: `1 | 2`
- Type230: `Record<string, QueueWatermark>`
- Type231: `Pick<CaptureSnapshot, "entries" | "conversation" | "sourceConversation" |
  "historySummary">`
- Type232: `{ throughEntryId: string; entryIds: string[]; } | undefined`
- Type233: `{ throughEntryId: string; entryIds: string[] }`
- Type234: `{ throughEntryId?: string; entryIds?: string[] }`
- Type235: `(stage: string, error: unknown) => string`
- Type236: `NonNullable<ModelRequest["diagnosticContext"]>`
- Type237: `(projectId: number, reason: string) => Promise<boolean>`
- Type238: `(plan: RecallPlan) => void`
- Type239: `() => number`
- Type240: `{ stage: string; debugTrace: string; plannerRejections: string[]; reviewRejections:
  string[]; failedReviewDebug: string | undefined; }`
- Type241: `Promise<KnowledgeExpansionResult | undefined>`
- Type242: `KnowledgeExpansionResult | undefined`
- Type243: `Project[] | undefined`
- Type244: `error is Error & { responseBody: string }`
- Type245: `Memory | undefined`
- Type246: `{ text: string; ids: number[]; knowledgeText: string }`
- Type247: `Record<keyof typeof SOURCE_FIELDS, number[]>`
- Type248: `"Review" | "Planner"`
- Type249: `{ summary: string; reason: string; sources: ReturnType<typeof reviewSources>; }`
- Type250: `(debug: string) => void`
- Type251: `(toolName: string, text: string) => boolean`
- Type252: `| { status: "ready"; snapshot: CaptureSnapshotWithStatus } | { status: "skipped";
  reason: string; finalEntryId?: string }`
- Type253: `"ready"`
- Type254: `"skipped"`
- Type255: `MessageRecord | undefined`
- Type256: `string | null | undefined`
- Type257: `EvidenceEntry | undefined`
- Type258: `SnapshotOptions["includeToolEvidence"]`
- Type259: `| ((toolName: string, text: string) => boolean) | undefined`
- Type260: `{ entry: SessionEntry; message: MessageRecord } | undefined`
- Type261: `CaptureHistorySummary | undefined`
- Type262: `Pick< Static<typeof SOURCE_INSPECTION_PARAMETERS>, "offset" | "limit" > & ({ path:
  string; url?: never } | { url: string; path?: never })`
- Type263: `{ status: "ok"; identifier: string; content: string; observedAt: string; /** SHA-256 of
  the complete observed source bytes, before sanitizing or paging. */ contentHash: string;
  sanitized: boolean; page: { offset: number; totalCharacters: number; nextOffset?: number };
  source_repo?: string; source_files?: string[]; source_url?: string; encoding_version?: string; /**
  Describes the observed file bytes, not the repository/index as a whole. */ fileState?: "committed"
  | "modified" | "uncommitted" | "unknown"; provenanceError?: SourceInspectionError; httpStatus?:
  number; } | { status: "error"; observedAt: string; error: SourceInspectionError; source_url?:
  string; httpStatus?: number; httpStatusText?: string; body?: string; }`
- Type264: `"ok"`
- Type265: `{ offset: number; totalCharacters: number; nextOffset?: number }`
- Type266: `"committed" | "modified" | "uncommitted" | "unknown"`
- Type267: `"error"`
- Type268: `{ path: string; dev: number; ino: number }`
- Type269: `SourceInspectionRequest & { url: string }`
- Type270: `Promise<{ bytes: Buffer; status: number; statusText: string; location?: string; }>`

## Signature key

- Signature1: `prepareLinkReview(client: ForgetfulClient, memoryId: number, destination: number,
  overlaps: Memory[], automaticIds: number[] | undefined, beforeRead: () => Promise<void>,
  includeAttachments: unknown) Promise<CaptureLinkReview>`
- Signature2: `validateLinkDecisions(decisions: LinkDecision[], review: CaptureLinkReview, edges:
  Map<string, boolean>) void`
- Signature3: `authorizedMemory(client: ForgetfulClient, id: number, destination: number)
  Promise<Memory>`
- Signature4: `executeConnection(review: CaptureLinkReview, operation:
  ConnectionResult["operation"], targetId: number, execute: () => Promise<unknown>, save: (review:
  CaptureLinkReview) => Promise<void>) Promise<void>`
- Signature5: `applyLinkReview(client: ForgetfulClient, destination: number, initial:
  CaptureLinkReview, save: (review: CaptureLinkReview) => Promise<void>, beforeWrite: () =>
  Promise<void>, assertCanWrite: () => void) Promise<CaptureLinkReview>`
- Signature6: `readAttachmentRecords(client: ForgetfulClient, memory: Memory, destination: number,
  beforeRead: () => Promise<void>) Promise<{ documents: Document[]; codeArtifacts: CodeArtifact[]
  }>`
- Signature7: `preparePreviousConnections(client: ForgetfulClient, expected: Memory, replacementId:
  number, destination: number, beforeRead: () => Promise<void>) Promise<PreviousConnections>`
- Signature8: `preserveConnections(client: ForgetfulClient, initial: CaptureLinkReview, beforeWrite:
  () => Promise<void>, save: (review: CaptureLinkReview) => Promise<void>, assertCanWrite: () =>
  void) Promise<CaptureLinkReview>`
- Signature9: `-addConflict(job: QueueJob, candidate: CaptureCandidate, destinationProjectId:
  number, decision: CaptureDecision, reason: string, oldMemory: Memory, replacementId: number)
  Promise<PendingConflict>`
- Signature10: `-checkpointOutcome(job: QueueJob, candidateId: string, outcome: unknown)
  Promise<QueueJob>`
- Signature11: `-destinationProjects(candidate: CaptureCandidate, context: WorkContext)
  Promise<number[]>`
- Signature12: `-validateDecisionResources(decision: CaptureDecision, candidate: CaptureCandidate,
  batch: boolean, neighborhood: CaptureNeighborhood | undefined) void`
- Signature13: `-validateDecision(decision: CaptureDecision, candidate: CaptureCandidate, overlaps:
  Memory[], batch: unknown, neighborhood: CaptureNeighborhood) void`
- Signature14: `-createMemory(job: QueueJob, candidate: CaptureCandidate, destination: number,
  projectIds: unknown) Promise<MemoryCreateResult>`
- Signature15: `-writeKnowledge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  memoryId: number, baseOutcome: Record<string, unknown>, finalStage: "created" | "skipped" |
  "replacement-created", existingMemory: Memory) Promise<QueueJob>`
- Signature16: `-applySupersession(job: QueueJob, oldMemory: Memory, replacementId: number, reason:
  string) Promise<"applied" | "already">`
- Signature17: `-finishSupersession(job: QueueJob, candidate: CaptureCandidate, destination: number,
  oldMemory: Memory, replacementId: number, reason: string, decision: CaptureDecision)
  Promise<QueueJob>`
- Signature18: `-processReplacementCheckpoint(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature19: `-processKnowledgeCheckpoint(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature20: `-loadOverlaps(job: QueueJob, candidate: CaptureCandidate, outcome: Record<string,
  unknown> | undefined, destination: number) Promise< | { status: "ready"; job: QueueJob; outcome:
  Record<string, unknown> | undefined; overlaps: Memory[]; } | { status: "skipped"; job: QueueJob }
  >`
- Signature21: `-neighborhoodEntities(job: QueueJob, candidate: CaptureCandidate, destination:
  number) Promise<{ entities: Entity[]; truncated: boolean }>`
- Signature22: `-existingNeighborhood(job: QueueJob, candidate: CaptureCandidate, destination:
  number) Promise<CaptureNeighborhood>`
- Signature23: `-validateEquivalentCandidate(decision: CaptureDecision, input: CaptureBatchInput,
  candidates: CaptureCandidate[], current: QueueJob, inputs: CaptureBatchInput[]) void`
- Signature24: `-decideOverlap(job: QueueJob, candidate: CaptureCandidate, outcome: Record<string,
  unknown> | undefined, overlaps: Memory[], destination: number) Promise< | { status: "ready"; job:
  QueueJob; decision: CaptureDecision } | { status: "skipped"; job: QueueJob } >`
- Signature25: `-recordEscalation(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision, reason: string, oldMemory: Memory, outcomeReason: string)
  Promise<QueueJob>`
- Signature26: `-supersedeCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature27: `-equivalentMemory(job: QueueJob, candidateId: string, destination: number)
  Promise<Memory>`
- Signature28: `-applyDecision(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature29: `-processCandidate(job: QueueJob, candidate: CaptureCandidate, outcome: unknown)
  Promise<QueueJob>`
- Signature30: `-recordCandidateFailure(currentJob: QueueJob, candidate: CaptureCandidate, error:
  unknown, result: CaptureCheckpointResult) Promise<void>`
- Signature31: `-processCandidates(job: QueueJob, candidates: CaptureCandidate[], result:
  CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature32: `-refreshLinkReview(current: QueueJob, candidates: CaptureCandidate[], outcome:
  Record<string, unknown>, mode: CaptureMode, prior: CaptureLinkReview | undefined)
  Promise<CaptureLinkReview>`
- Signature33: `-planLinkReviews(job: QueueJob, candidates: CaptureCandidate[], inputs: Array<{
  candidateId: string; review: CaptureLinkReview }>) Promise<QueueJob>`
- Signature34: `-runBranchWorker(branch: CaptureBranch, budget: number, result:
  CaptureCheckpointResult) Promise<void>`
- Signature35: `-recordBranchFailure(job: QueueJob, result: CaptureCheckpointResult, error: unknown,
  started: number) Promise<void>`
- Signature36: `-checkpointBranch(branch: CaptureBranch, budget: number)
  Promise<CaptureCheckpointResult>`
- Signature37: `-appendCheckpointResult(total: CaptureCheckpointResult, result:
  CaptureCheckpointResult) void`
- Signature38: `pendingConflicts(optionsOrSession: { sessionId?: string; branchId?: string } |
  string, branchId: string) Promise<CapturePendingConflict[]>`
- Signature39: `-rejectConflict(conflict: PendingConflict, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature40: `-selectResolutionEvidence(conflict: PendingConflict, input: ResolveConflictInput,
  additionalIds: string[]) string[]`
- Signature41: `-validateResolutionEvidence(conflict: PendingConflict, input: ResolveConflictInput)
  ConflictResolutionEvidence`
- Signature42: `-markConflictResolved(conflictId: string, resolution: unknown)
  Promise<CaptureResolveResult>`
- Signature43: `-planConflictReplacement(conflict: PendingConflict, candidate: CaptureCandidate,
  evidence: ConflictResolutionEvidence, context: WorkContext, current: Memory, requestPayload:
  string, conversation: readonly unknown[]) Promise<NonNullable<PendingConflict["replacement"]>>`
- Signature44: `-validateConflictMemory(conflict: PendingConflict, current: Memory, _oldMemory:
  Memory) void`
- Signature45: `-updateResolutionReplacement(conflict: PendingConflict, replacementId: number)
  Promise<void>`
- Signature46: `-linkResolutionEntity(conflict: PendingConflict, replacementId: number, id: number)
  Promise<void>`
- Signature47: `-applyConflictResolution(conflict: PendingConflict, evidence:
  ConflictResolutionEvidence, target: ConflictResolutionTarget, requestPayload: string,
  conversation: readonly unknown[]) Promise<CaptureResolveResult>`
- Signature48: `-resolveConflictOwned(conflictId: string, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature49: `resolveConflict(conflictId: string, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature50: `candidateFields(item: Record<string, unknown>, snapshot: CaptureSnapshot)
  CandidateValidation<CandidateFields>`
- Signature51: `resourceStrings(value: unknown, label: string, maxItems: number, sanitize: unknown)
  CandidateValidation<string[]>`
- Signature52: `resourceEvidence(item: Record<string, unknown>, sourceIds: string[], snapshot:
  CaptureSnapshot, kind: CaptureCandidate["evidenceType"]) CandidateValidation<string[]>`
- Signature53: `entityResource(item: Record<string, unknown>, index: number, sourceIds: string[],
  snapshot: CaptureSnapshot, kind: CaptureCandidate["evidenceType"])
  CandidateValidation<CaptureEntityResource>`
- Signature54: `documentResource(item: Record<string, unknown>, index: number, sourceIds: string[],
  snapshot: CaptureSnapshot, kind: CaptureCandidate["evidenceType"])
  CandidateValidation<CaptureDocumentResource>`
- Signature55: `codeArtifactResource(item: Record<string, unknown>, index: number, sourceIds:
  string[], snapshot: CaptureSnapshot, kind: CaptureCandidate["evidenceType"])
  CandidateValidation<CaptureCodeArtifactResource>`
- Signature56: `relationshipResource(item: Record<string, unknown>, index: number, sourceIds:
  string[], snapshot: CaptureSnapshot, kind: CaptureCandidate["evidenceType"])
  CandidateValidation<CaptureRelationshipResource>`
- Signature57: `parseResourceList(raw: unknown, label: string, maxItems: number, parse: (item:
  Record<string, unknown>, index: number) => CandidateValidation<unknown>)
  CandidateValidation<unknown[]>`
- Signature58: `richResources(item: Record<string, unknown>, sourceIds: string[], snapshot:
  CaptureSnapshot, kind: CaptureCandidate["evidenceType"]) CandidateValidation<RichResources>`
- Signature59: `buildCandidate(item: Record<string, unknown>, index: number, fields:
  CandidateFields, lists: CandidateLists, destination: CandidateDestination, resources:
  RichResources) CaptureCandidate | undefined`
- Signature60: `eligibleCandidate(value: unknown, snapshot: CaptureSnapshot, index: number)
  CandidateValidation<CaptureCandidate>`
- Signature61: `parseCandidates(value: unknown, snapshot: CaptureSnapshot, maxCandidates: number,
  onCandidate: (id: string, raw: unknown, reason?: string) => void) CandidateExtraction`
- Signature62: `captureCandidateSubmission(snapshot: CaptureSnapshot, maxCandidates: number,
  recordRejection: (reason: string) => void) ModelSubmissionTool`
- Signature63: `memoryInput(candidate: CaptureCandidate, projectIds: number[], context: WorkContext)
  MemoryInput`
- Signature64: `captureKnowledgePlan(candidate: CaptureCandidate, destination: number, memoryId:
  number, context: WorkContext, existingMemory: Memory, operationId: unknown, entityMemoryKeys:
  string[]) KnowledgeWritePlan | undefined`
- Signature65: `readPromptDirectory(path: string, trusted: boolean, warnings: string[])
  Promise<PromptOverlays>`
- Signature66: `mergePrompts(globalPrompts: PromptOverlays, projectPrompts: PromptOverlays)
  PromptOverlays`
- Signature67: `resolveScope(projectData: JsonReadResult, projectPath: string, trusted: boolean,
  warnings: string[]) { scope: Scope; scopeSource: ScopeSource }`
- Signature68: `+supersede(id: number, replacementId: number, reason: string, signal: AbortSignal)
  Promise<void>`
- Signature69: `+updateEntity(id: number, input: Partial<EntityInput>, signal: AbortSignal)
  Promise<Entity>`
- Signature70: `+createRelationship(input: EntityRelationshipInput, signal: AbortSignal)
  Promise<EntityRelationship>`
- Signature71: `+updateDocument(id: number, input: Partial<DocumentInput>, signal: AbortSignal)
  Promise<Document>`
- Signature72: `+listCodeArtifacts(projectId: number, signal: AbortSignal)
  Promise<CodeArtifactSummary[]>`
- Signature73: `+updateCodeArtifact(id: number, input: Partial<CodeArtifactInput>, signal:
  AbortSignal) Promise<CodeArtifact>`
- Signature74: `+updateMemory(id: number, input: Partial<MemoryInput>, signal: AbortSignal)
  Promise<Memory>`
- Signature75: `boundedWait(promise: Promise<T>, signals: readonly (AbortSignal | undefined)[],
  timeoutMs: number) Promise<BoundedWaitOutcome<T>>`
- Signature76: `automaticRecallTerminalText(result: RecallResult, kind: "automatic" | "queued",
  resultInHistory: unknown) string`
- Signature77: `recordRecallActivity(runtime: Runtime, result: RecallResult, ctx: ExtensionContext,
  elapsedMs: number) void`
- Signature78: `resolutionEvidence(ctx: ExtensionContext, preferredIds: readonly string[])
  EvidenceEntry[]`
- Signature79: `conflictBelongsToActiveBranch(conflict: Record<string, unknown>, runtime: Runtime,
  ctx: ExtensionContext) boolean`
- Signature80: `discoverWorkContext(pi: ExtensionAPI, ctx: ExtensionContext, branchId: string)
  Promise<ExtensionWorkContext>`
- Signature81: `log(ctx: ExtensionContext, config: ForgetfulConfig, message: string, level:
  Verbosity, fileMessage: unknown) void`
- Signature82: `logFailure(ctx: ExtensionContext, config: ForgetfulConfig, message: string, error:
  unknown, level: "warning" | "error") void`
- Signature83: `findResolutionConflict(runtime: Runtime, ctx: ExtensionContext, conflictId: string)
  Promise<Record<string, unknown> | undefined>`
- Signature84: `readCaptureOutcome(capture: CaptureServicePort, runtime: Runtime, jobId: string,
  checkpointResult: CaptureCheckpointResult) Promise<AutomaticCaptureJobOutcome | undefined>`
- Signature85: `updateDocument(documentId: number, input: Partial<DocumentInput>, signal:
  AbortSignal) unknown`
- Signature86: `updateCodeArtifact(artifactId: number, input: Partial<CodeArtifactInput>, signal:
  AbortSignal) unknown`
- Signature87: `supersede(id: number, replacementId: number, reason: string, signal: AbortSignal)
  Promise<void>`
- Signature88: `-request(pathOrUrl: string | URL, method: string, body: Record<string, unknown> |
  undefined, callerSignal: AbortSignal | undefined, expectedStatuses: number[]) Promise<unknown>`
- Signature89: `-throwResponseError(response: Response, method: string, url: URL, signal:
  AbortSignal, maxBytes: number) Promise<never>`
- Signature90: `parseSearchPayload(payload: unknown, fallbackQuery: string, requireMetadata:
  unknown) MemorySearchResult`
- Signature91: `-findRelationships(entities: Entity[], request: KnowledgeExpansionRequest)
  Promise<RelationshipExpansion[]>`
- Signature92: `-collectRelationships(entities: Entity[], signal: AbortSignal)
  Promise<EntityRelationship[]>`
- Signature93: `-resolveRelationshipEndpoints(entities: Entity[], relationships:
  EntityRelationship[], signal: AbortSignal) Promise<Map<number, Entity>>`
- Signature94: `-formatRelationships(entities: Entity[], relationships: EntityRelationship[],
  endpoints: Map<number, Entity>, request: KnowledgeExpansionRequest) RelationshipExpansion[]`
- Signature95: `-findEntityMemories(entities: Entity[], request: KnowledgeExpansionRequest)
  Promise<LinkedMemoryExpansion[]>`
- Signature96: `-collectEntityMemories(entities: Entity[], linked: ({ id: number; title: string }[]
  | undefined)[], request: KnowledgeExpansionRequest) Promise<LinkedMemoryExpansion[]>`
- Signature97: `-formatExpansion(entities: Entity[], relationships: RelationshipExpansion[],
  linkedMemories: LinkedMemoryExpansion[], attachments: Attachments) KnowledgeExpansionResult`
- Signature98: `resolveWriteProject(client: ForgetfulClient, context: KnowledgeToolContext,
  requested: number | undefined, signal: AbortSignal) Promise<ResolvedWriteProject>`
- Signature99: `assertReadMemory(client: ForgetfulClient, id: number, context: KnowledgeToolContext,
  signal: AbortSignal) Promise<Memory>`
- Signature100: `assertReadEntity(knowledge: KnowledgeClient, id: number, context:
  KnowledgeToolContext, signal: AbortSignal) Promise<Entity>`
- Signature101: `executeKnowledgeRead(client: ForgetfulClient, rawRequest: KnowledgeReadRequest,
  context: KnowledgeToolContext, signal: AbortSignal) Promise<KnowledgeToolResult>`
- Signature102: `updateProvenance(existing: Provenance, request: Record<string, unknown>, context:
  KnowledgeToolContext, destinationProjectId: number) Provenance`
- Signature103: `memoryInProject(client: ForgetfulClient, memoryId: number, projectId: number,
  signal: AbortSignal, editable: unknown) Promise<Memory>`
- Signature104: `entityInProject(knowledge: KnowledgeClient, entityId: number, projectId: number,
  signal: AbortSignal, editable: unknown) Promise<Entity>`
- Signature105: `hydrateEntities(knowledge: KnowledgeClient, candidates: Entity[], signal:
  AbortSignal) Promise<Entity[]>`
- Signature106: `validateAttachments(knowledge: KnowledgeClient, projectId: number, request:
  Record<string, unknown>, signal: AbortSignal) Promise<void>`
- Signature107: `createMemory(client: ForgetfulClient, request: Record<string, unknown>, context:
  KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite: (() =>
  Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature108: `createEntity(knowledge: KnowledgeClient, request: Record<string, unknown>, context:
  KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite: (() =>
  Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature109: `createDocument(knowledge: KnowledgeClient, request: Record<string, unknown>,
  context: KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite:
  (() => Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature110: `createCodeArtifact(knowledge: KnowledgeClient, request: Record<string, unknown>,
  context: KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite:
  (() => Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature111: `executeKnowledgeWrite(client: ForgetfulClient, rawRequest: KnowledgeWriteRequest,
  context: KnowledgeToolContext, signal: AbortSignal, beforeWrite: () => Promise<void>,
  checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature112: `constructor(client: WriteClient, readMemory: KnowledgeMemoryReader, assertCanWrite:
  () => void) unknown`
- Signature113: `-codeArtifactInProject(id: number, projectId: number, signal: AbortSignal)
  Promise<CodeArtifact>`
- Signature114: `-validateAttachments(documentIds: number[], codeArtifactIds: number[], projectId:
  number, signal: AbortSignal) Promise<void>`
- Signature115: `-createOnce(operation: { kind: string; key: string; create: () => Promise<T>;
  authorize?: () => Promise<void>; }, plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<T>`
- Signature116: `-writeEntity(resource: KnowledgeEntityPlan, plan: KnowledgeWritePlan, state:
  KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite:
  KnowledgeWriteGuard | undefined) Promise<Entity>`
- Signature117: `-writeEntities(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature118: `-writeDocument(resource: KnowledgeDocumentPlan, plan: KnowledgeWritePlan, state:
  KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite:
  KnowledgeWriteGuard | undefined) Promise<Document>`
- Signature119: `-writeDocuments(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature120: `-writeCodeArtifact(resource: KnowledgeCodeArtifactPlan, plan: KnowledgeWritePlan,
  state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined,
  beforeWrite: KnowledgeWriteGuard | undefined) Promise<CodeArtifact>`
- Signature121: `-writeCodeArtifacts(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature122: `-requestedAttachmentIds(plan: KnowledgeWritePlan, state: KnowledgeWriteState)
  KnowledgeAttachmentIds`
- Signature123: `-writeAttachments(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature124: `-writeRelationship(resource: KnowledgeRelationshipPlan, plan: KnowledgeWritePlan,
  state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined,
  beforeWrite: KnowledgeWriteGuard | undefined) Promise<EntityRelationship>`
- Signature125: `-writeRelationships(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature126: `-writeEntityMemoryLink(resource: KnowledgeEntityMemoryLinkPlan, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<void>`
- Signature127: `-writeEntityMemoryLinks(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature128: `-writeLinkedMemory(linkedMemoryId: number, plan: KnowledgeWritePlan, state:
  KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite:
  KnowledgeWriteGuard | undefined) Promise<void>`
- Signature129: `-writeLinkedMemories(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature130: `execute(plan: KnowledgeWritePlan, previous: Partial<KnowledgeWriteState>,
  checkpoint: KnowledgeWriteCheckpoint, signal: AbortSignal, beforeWrite: KnowledgeWriteGuard)
  Promise<KnowledgeWriteState>`
- Signature131: `constructor(model: Model<any>, task: Message, settings: CompactionSettings,
  contextLimitTokens: unknown, initialHistory: CompactedMemoryHistory & { summaryMessage: Message })
  unknown`
- Signature132: `prepare(context: Context, signal: AbortSignal, sessionId: string | undefined,
  complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) => Promise<void>)
  Promise<number>`
- Signature133: `prepareCapture(context: Context, signal: AbortSignal, sessionId: string |
  undefined, complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) =>
  Promise<void>) Promise<"ready" | "progress">`
- Signature134: `-prepareContext(context: Context, signal: AbortSignal, sessionId: string |
  undefined, complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) =>
  Promise<void>, maxChunks: unknown) Promise<number | "progress">`
- Signature135: `-applySummary(context: Context, summary: string, lastRecord: Message, previousSize:
  number) number`
- Signature136: `assertFits(context: Context, model: Model<any>, output: number, contextWindow:
  number) void`
- Signature137: `outputCeiling(model: Model<any>, settings: typeof DEFAULT_COMPACTION_SETTINGS,
  requestedMaxTokens: unknown) number`
- Signature138: `resolvedOutputAllowance(context: Context, model: Model<any>, contextWindow: number,
  settings: typeof DEFAULT_COMPACTION_SETTINGS, requestedMaxTokens: unknown) number`
- Signature139: `summarizeMemoryHistory(messages: Message[], options: MemoryHistorySummaryOptions,
  previousSummary: string) Promise<{ summary: string; count: number }>`
- Signature140: `+complete(model: Model<any>, context: Context, options: ModelsSimpleStreamOptions)
  Promise<AssistantMessage>`
- Signature141: `constructor(registry: ModelRegistryPort, selection: ModelSelection, options:
  PiMemoryModelOptions) unknown`
- Signature142: `-completeAttempt(model: Model<any>, context: Context, options:
  ModelsSimpleStreamOptions, request: ModelRequest, deadline: RequestDeadline, attempt: number,
  kind: "task" | "compaction") Promise<AssistantMessage>`
- Signature143: `-executeRead(read: ModelReadTool, call: ToolCall, request: ModelRequest, deadline:
  RequestDeadline) Promise<ToolResultMessage>`
- Signature144: `-completeWithSubmission(model: Model<any>, context: Context, options:
  ModelsSimpleStreamOptions, request: ModelRequest, deadline: RequestDeadline, prepare: () =>
  Promise<number>) Promise<unknown>`
- Signature145: `ensureCompletionFinished(response: AssistantMessage, request: ModelRequest,
  timedOut: boolean, allowToolUse: boolean) void`
- Signature146: `requestOptions(model: Model<any>, sessionId: string | undefined, transformHeaders:
  MemoryModelHeaderTransform | undefined, signal: AbortSignal) ModelsSimpleStreamOptions`
- Signature147: `appendCallCountCorrection(context: Context, response: AssistantMessage, calls:
  ToolCall[], submissionName: string, base: string) void`
- Signature148: `resolveMemoryModel(registry: ModelRegistryPort, selection: ModelSelection |
  undefined, options: PiMemoryModelOptions) PiMemoryModel | undefined`
- Signature149: `promptExistingProject(client: ForgetfulClient, ctx: ExtensionContext, repoName:
  string) Promise<Project | undefined>`
- Signature150: `initialiseProject(client: ForgetfulClient, ctx: ExtensionContext, repoName: string,
  ensureCurrent: () => Promise<void>) Promise<Project | undefined>`
- Signature151: `initialiseProjectForAgent(client: ForgetfulClient, ctx: ExtensionContext, repoName:
  string, input: AgentProjectInitInput, ensureCurrent: () => Promise<void>) Promise<Project>`
- Signature152: `resolveBranchId(sessionId: string, activeEntryIds: readonly string[],
  fallbackBranchId: string) Promise<string>`
- Signature153: `cancel(jobId: string, interruptedModelCall: unknown, uncertainWrite: string)
  Promise<void>`
- Signature154: `-compactJobSnapshot(job: StoredQueueJob, conversation: CompactedConversation)
  Promise<void>`
- Signature155: `pendingConflicts(identity: QueueIdentity, sessionId: string, branchId: string)
  Promise<PendingConflict[]>`
- Signature156: `listPendingConflicts(identity: QueueIdentity, sessionId: string, branchId: string)
  Promise<PendingConflict[]>`
- Signature157: `updateConflict(conflictId: string, patch: Partial<PendingConflict>)
  Promise<PendingConflict>`
- Signature158: `constructor(client: ForgetfulClient, model: MemoryModelClient, options:
  RecallServiceOptions) unknown`
- Signature159: `-recallReadTool(request: RecallRequest, resolution: ScopeResolution, candidates:
  RecallResult) ModelReadTool`
- Signature160: `-finishFailure(request: RecallRequest, deadline: DeadlineSignal, error: unknown,
  trace: { stage: string; debugTrace: string; plannerRejections: string[]; reviewRejections:
  string[]; failedReviewDebug: string | undefined; }) RecallResult`
- Signature161: `-finishReview(output: unknown, candidates: RecallResult, recallPolicy: string,
  debugTrace: string, searchFailed: boolean, reviewRejections: string[]) RecallResult`
- Signature162: `-optionalKnowledge(memories: Memory[], entityNames: string[], scope: Scope,
  projectId: number | undefined, signal: AbortSignal) Promise<KnowledgeExpansionResult | undefined>`
- Signature163: `-resultWithKnowledge(result: RecallResult, expansion: KnowledgeExpansionResult |
  undefined, knowledgeText: string) RecallResult`
- Signature164: `-authorizeProjectSelection(request: RecallRequest, deadline: DeadlineSignal, plan:
  RecallPlan) Promise<string | undefined>`
- Signature165: `-requestsDifferentProject(request: RecallRequest, plan: RecallPlan, scope: Scope)
  boolean`
- Signature166: `-searchMemories(request: RecallRequest, plan: RecallPlan, scope: Scope, resolution:
  ScopeResolution, deadline: DeadlineSignal) Promise<SearchOutcome>`
- Signature167: `-searchRequest(query: string, plan: RecallPlan, context: WorkContext, scope: Scope,
  resolution: ScopeResolution) SearchRequest`
- Signature168: `-resolveScope(context: WorkContext, scope: Scope, selectedId: number | undefined,
  supplied: Project[] | undefined, signal: AbortSignal) Promise<ScopeResolution>`
- Signature169: `formatRecall(memories: Memory[], entities: string[], recallPolicy: string,
  expansion: KnowledgeExpansionResult) { text: string; ids: number[]; knowledgeText: string }`
- Signature170: `reviewValidationDebug(value: unknown, candidates: RecallResult, mismatchDirection:
  string | undefined) string`
- Signature171: `recallReviewSubmission(candidates: RecallResult, rejections: string[], setDebug:
  (debug: string) => void) ModelSubmissionTool`
- Signature172: `deltaStartIndex(branch: SessionEntry[], afterEntryId: string | null | undefined,
  baselineEntryId: string | null | undefined) number | undefined`
- Signature173: `compactCaptureSnapshot(snapshot: CaptureSnapshot, view: CompactedConversation)
  CaptureSnapshot`

## Extraction warnings

- `Unresolved or out-of-scope base: ActivityLoader -> Loader`
- `Unresolved or out-of-scope base: CapturePause -> Error`
- `Unresolved or out-of-scope base: ContextWindowError -> Error`
- `Unresolved or out-of-scope base: ForgetfulAbortError -> Error`
- `Unresolved or out-of-scope base: ForgetfulHttpError -> Error`
- `Unresolved or out-of-scope base: ForgetfulSchemaError -> Error`
- `Unresolved or out-of-scope base: ForgetfulTimeoutError -> Error`
- `Unresolved or out-of-scope base: InvalidCaptureOutput -> Error`
- `Unresolved or out-of-scope base: ModelSubmissionError -> Error`
- `Unresolved or out-of-scope base: ProjectInitError -> Error`
- `Unresolved or out-of-scope base: QueueBusyError -> Error`
- `Unresolved or out-of-scope base: QueueJobMetadata -> Omit<QueueJob, "snapshot">`
- `Unresolved or out-of-scope base: ReviewValidationError -> Error`
