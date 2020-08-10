import { Command, collectCommands } from '../index';
import { ArgsParsered } from '../../types';

@collectCommands('init')
export class Init implements Command {
  private context: ArgsParsered;

  constructor(context: ArgsParsered) {
    this.context = context;
  }

  exec() {
    console.log(this.context);
  }
}
