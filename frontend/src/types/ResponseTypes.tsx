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

export type Share = {
    secret: "",
    links: Array<{
        name: string, link: string
    }>
}