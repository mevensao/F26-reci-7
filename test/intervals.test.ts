import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { mergeIntervals, type Interval } from '../src/intervals';

// Recitation Part 2 (groups) and problem set Task 2.
// Read the spec in src/intervals/mergeIntervals.ts, then check your progress
// with `npm run mutants:intervals`.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The output is sorted.
// (invariant, algebraic, metamorphic, differential, or conditional)

// A first attempt at a generator. It has a problem: run the tests and read
// the counterexample.
// Construct valid intervals: start <= end.
const interval: fc.Arbitrary<Interval> = fc
  .tuple(fc.integer(), fc.integer())
  .map(([a, b]) => (a <= b ? [a, b] : [b, a]));
const intervalList = fc.array(interval);

describe('mergeIntervals', () => {
  // Pattern: invariant. Every input interval lies inside some output interval.
  it('every input interval lies inside some output interval', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);
        const uncovered = xs.filter(([s, e]) => !out.some(([a, b]) => a <= s && e <= b));
        expect(uncovered).toEqual([]);
      }),
    );
  });

  // Add your properties here. Aim for at least one of each pattern:
  // invariant, algebraic, metamorphic, differential, conditional.
  //Pattern: invariant. Output intervals are sorted and do not overlap.
  it('returns sorted and non-overlapping intervals', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);

        for (let i = 1; i < out.length; i++) {
          expect(out[i - 1][1]).toBeLessThan(out[i][0]);
        }
      })
    );
  });

  // Pattern: algebraic. Merging twice gives the same result as merging once.
  it('merging twice does not change the result', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const once = mergeIntervals(xs);
        const twice = mergeIntervals(once);

        expect(twice).toEqual(once);
      })
    );
  });

  // Pattern: metamorphic. Reversing the input does not change the output.
  it('reversing the input preserves the result', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const reversed = [...xs].reverse();

        expect(mergeIntervals(reversed))
          .toEqual(mergeIntervals(xs));
      })
    );
  });

  // Pattern: differential. Merging preserves coverage at interval boundaries.
  const covers = (xs: Interval[], p: number) =>
    xs.some(([a, b]) => a <= p && p <= b);
  it('preserves point coverage', () => {
    fc.assert(
      fc.property(intervalList, fc.integer(), (xs, p) => {
        const out = mergeIntervals(xs);

        expect(covers(out, p)).toBe(covers(xs, p));
      })
    );
  });


  // Pattern: conditional. Already-disjoint sorted intervals remain unchanged.
  const disjointIntervals = fc
  .array(fc.integer({ min: 1, max: 10 }))
  .map(lengths => {
    let start = 0;
    const result: Interval[] = [];

    for (const length of lengths) {
      result.push([start, start + length]);
      start += length + 2;
    }

    return result;
  });
  it('does not change already-disjoint intervals', () => {
    fc.assert(
      fc.property(disjointIntervals, xs => {
        expect(mergeIntervals(xs)).toEqual(xs);
      })
    );
  });
});
