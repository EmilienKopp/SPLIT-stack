import { BaseDataDisplayStrategy } from '$lib/base/strategies/dataDisplayStrategy';
import { Context } from '$lib/base/contexts/context';
import { Project } from '$models';

export class ProjectContext implements Context<Project> {
  strategy: BaseDataDisplayStrategy<Project>;

  constructor(role: string) {
    this.strategy = this.getStrategyForRole(role);
  }

  getStrategyForRole(role: string): BaseDataDisplayStrategy<Project> {
    switch (role) {
      case 'admin':
        return new AdminProjectTableStrategy();
      case 'freelancer':
        return new FreelancerProjectTableStrategy();
      case 'employer':
        return new EmployerProjectTableStrategy();
      default:
        return new DefaultProjectDataDisplayStrategy();
    }
  }
} 