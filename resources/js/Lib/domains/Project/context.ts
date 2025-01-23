import { AdminProjectTableStrategy } from './strategies/adminProjectTableStrategy';
import { BaseDataDisplayStrategy } from '$lib/core/strategies/dataDisplayStrategy';
import { Context } from '$lib/core/contexts/context';
import { DefaultProjectTableStrategy } from './strategies/defaultProjectTableStrategy';
import { EmployerProjectDataDisplayStrategy } from './strategies/employerProjectTableStrategy';
import { FreelancerProjectDataDisplayStrategy } from './strategies/freelancerProjectTableStrategy';
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
        return new FreelancerProjectDataDisplayStrategy();
      case 'employer':
        return new EmployerProjectDataDisplayStrategy();
      default:
        return new DefaultProjectTableStrategy();
    }
  }
} 