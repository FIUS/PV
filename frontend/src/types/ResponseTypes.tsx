export type Member = {
    id: number,
    name: string
}

export type Lecture = {
    id: number,
    name: string,
    folder: string,
    link: string,
    validUntil: string,
    aliases: Array<IDName>
    persons: Array<IDName>
}

export type IDName = {
    id: number,
    name: string
}

export type SyncResult = {
    created: number,
    renewed: number,
    withoutFolder: number
}

export type SyncStatus = {
    running: boolean,
    runId: number,
    result: SyncResult | null,
    error: string | null,
    finishedAt: string | null
}

export type Share = {
    secret: "",
    links: Array<{
        name: string, link: string
    }>
}