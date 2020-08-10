import { ArgsParsered } from '../types';

interface CommandConstructor {
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
const commandsConstructor: Record<string, CommandConstructor> = {};

/**
 * 收集命令
 * 作为类装饰器使用
 */
export function collectCommands(name: string): ClassDecorator {
  return (target: any): void => {
    commandsConstructor[name] = target;
  };
}

/**
 * 执行命令
 */
export async function execCommands(context: ArgsParsered, packageJson: any) {
  const command = context._[0];

  const Method = commandsConstructor[command];

  if (Method) {
    new Method(context, packageJson).exec();
  } else {
    throw new Error('命令不存在');
  }
}

export * from './info';
export * from './init';
