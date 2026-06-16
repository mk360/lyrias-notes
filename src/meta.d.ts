interface ImportMeta {
    glob<T>(path: string, { eager: boolean }): Record<string, T>;
}