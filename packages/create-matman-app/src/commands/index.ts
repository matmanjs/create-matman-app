import { Info } from './info';
import { ArgsParsered } from '../types';

export interface CommandConstructor {
  new (context: ArgsParsered, packageJson: any): Command;
}

/**
 * Command 需要实现的接口
 */
export interface Command {
  exec: () => void;
}

/**
 * 需要注册的命令的列表
 */
const commandsConstructor: Record<string, CommandConstructor> = {
  info: Info,
};

/**
 * 执行命令
 */
export async function execCommands(context: ArgsParsered, packageJson: any) {
  const command = context._[0];

  const Method = commandsConstructor[command];

  if (Method) {
    await new Method(context, packageJson).exec();
  } else {
    throw new Error('命令不存在');
  }
}
