import { ArgsParsered } from '../types';

/**
 * Command 需要实现的接口
 */
export interface Command {
  new (context: ArgsParsered): Command;
  exec: () => void;
}

/**
 * 需要注册的命令的列表
 */
const commandsConstructor: Record<string, Command> = {};

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
 * 注册插件
 * @param context vscode 上下文
 */
export async function execCommands(context: ArgsParsered) {
  const command = context._[0];

  const Method = commandsConstructor[command];

  if (Method) {
    new Method(context).exec();
  } else {
    throw new Error('命令不存在');
  }
}
