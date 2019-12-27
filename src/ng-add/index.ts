import { Rule, Tree } from '@angular-devkit/schematics';
import chalk from "chalk";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngJojo(_options: any): Rule {
  return (tree: Tree) => {
    console.log(`${chalk.black(`
    ██████╗  ██████╗ ██████╗ 
    ██╔══██╗██╔════╝██╔═══██╗
    ██████╔╝██║     ██║   ██║
    ██╔═══╝ ██║     ██║▄▄ ██║
    ██║     ╚██████╗╚██████╔╝
    ╚═╝      ╚═════╝ ╚══▀▀═╝   
    `)}`)
    // 转载自网络，如有侵权请及时联系
    console.log(`${chalk.cyan(`
   　　　　　　　　┏┓　　　┏┓
  　　　　┏┛┻━━━┛┻┓
  　　　　┃　　　　　　　┃ 　
  　　　　┃　　　━　　　┃
  　　　　┃　＞　　　＜　┃
  　　　　┃　　　　　　　┃
  　　　　┃...　⌒　...　┃                           
  　　　　┃　　　　　　　┃
  　　　　┗━┓　　　┏━┛
  　　　　　　┃　　　┃　　　　　　　　　　　
  　　　　　　┃　　　┃   神兽保佑,代码无bug
  　　　　　　┃　　　┃　　　　　　　　　　　    
  　　　　　　┃　　　┃  　　　　　　
  　　　　　　┃　　　┃
  　　　　　　┃　　　┃　　　　　　　　　　　
  　　　　　　┃　　　┗━━━┓
  　　　　　　┃　　　　　　　┣┓
  　　　　　　┃　　　　　　　┏┛
  　　　　　　┗┓┓┏━┳┓┏┛
  　　　　　　　┃┫┫　┃┫┫
  　　　　　　　┗┻┛　┗┻┛ 
    `)}`)
    console.log(`   ${chalk.blue(`**************************************************`)}`);
    console.log(chalk.cyan(`
             ██╗ ██████╗      ██╗ ██████╗ 
             ██║██╔═══██╗     ██║██╔═══██╗
             ██║██║   ██║     ██║██║   ██║
        ██   ██║██║   ██║██   ██║██║   ██║
        ╚█████╔╝╚██████╔╝╚█████╔╝╚██████╔╝
         ╚════╝  ╚═════╝  ╚════╝  ╚═════╝ 
    `))
    console.log(`${chalk.gray(`你已经成功安装了Smart-utils,忽略下面那行Nothing to be done.`)}`)
    console.log(`${chalk.gray(`☟☟☟☟☟☟☟☟☟☟☟☟☟☟☟☟☟☟`)}`)
    return tree;
  };
}