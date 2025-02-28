import { DataAction, IDataStrategy } from '$types/common/dataDisplay';
import { date, time } from '$lib/utils/formatting';

import { BaseDataDisplayStrategy } from '$lib/core/strategies/dataDisplayStrategy';
import type { MatchingGame } from '$models';
import { router } from '@inertiajs/svelte';
import { transform } from 'typescript';

export class FreelancerMatchingGameDataDisplayStrategy
  extends BaseDataDisplayStrategy<MatchingGame>
  implements IDataStrategy<MatchingGame>
{
  protected defaultHeaders() {
    return [
      { label: 'Name', key: 'name' },
      {
        label: 'Best Time',
        key: 'time',
        transformer: (row: MatchingGame) => {
          if (!row.results?.some((r) => r.time)) return undefined;
          const times = row.results.map((result) => result.time);
          return Math.max(...times);
        },
      },
      { label: 'Created At', key: 'created_at', formatter: date },
      { label: 'Updated At', key: 'updated_at', formatter: date },
    ];
  }

  protected defaultActions(): DataAction<MatchingGame>[] {
    return [
      {
        label: 'Play',
        href: (row: MatchingGame) => route('game.play', row.id),
      },
      {
        label: 'Delete',
        callback: (row: MatchingGame) =>
          router.delete(route('game.destroy', row.id)),
      },
    ];
  }
}
