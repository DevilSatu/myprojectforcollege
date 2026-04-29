/**
 * Утилита для извлечения типа данных из массива.
 * Если T — массив элементов U, возвращает U, иначе never.
 */
export type ExtractArrayType<T> = T extends (infer U)[] ? U : never;

// Примеры для самопроверки (можно оставить в комментариях):
// type Test = ExtractArrayType<string[]>; // string
// type Test2 = ExtractArrayType<number>;   // never