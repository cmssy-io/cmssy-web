export async function mapWithLimit<T, R>(
  input: T[],
  limit: number,
  run: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(input.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(limit, input.length) },
    async () => {
      while (cursor < input.length) {
        const index = cursor;
        cursor += 1;
        const item = input[index];
        if (item === undefined) continue;
        results[index] = await run(item);
      }
    },
  );
  await Promise.all(workers);
  return results;
}
