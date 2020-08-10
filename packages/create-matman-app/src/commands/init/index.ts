import { execSync } from 'child_process';
import { InitUtil } from './utils';
import { Command, collectCommands } from '../index';
import { ArgsParsered } from '../../types';

@collectCommands('new')
export class Init implements Command {
  private context: ArgsParsered;

  constructor(context: ArgsParsered) {
    this.context = context;
  }

  exec() {
    InitUtil.checkForLatestVersion().catch(() => {
      try {
        return execSync('npm view create-matman-app version').toString().trim();
      } catch (e) {
        return null;
      }
    });
  }
}
