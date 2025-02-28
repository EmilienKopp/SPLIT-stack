import { BaseDataDisplayStrategy } from '$lib/core/strategies/dataDisplayStrategy';
import { Context } from '$lib/core/contexts/context';
import { FreelancerMatchingGameDataDisplayStrategy } from './strategies/freelancerMatchingGameTableStrategy';
import { MatchingGame } from '$models';

export class MatchingGameContext implements Context<MatchingGame> {
  strategy: BaseDataDisplayStrategy<MatchingGame>;

  constructor(role: string) {
    this.strategy = this.getStrategyForRole(role);
  }

  getStrategyForRole(role: string): BaseDataDisplayStrategy<MatchingGame> {
    switch (role) {
      case 'freelancer':
        default:
        return new FreelancerMatchingGameDataDisplayStrategy();
    }
  }
} 