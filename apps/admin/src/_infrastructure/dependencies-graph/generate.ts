import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { SpelunkerModule } from 'nestjs-spelunker';
import * as path from 'path';
import 'reflect-metadata';
import { Config } from '../config/config.schema';

export async function generateMermaidFile(
  app: INestApplication,
): Promise<void> {
  const configService = await app.resolve(ConfigService);
  const fileName = 'module-graph.md';
  const tree = SpelunkerModule.explore(app);
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);
  const excludedModule: Array<string> = ['sdk', 'orm', 'bull', 'confighost'];

  const filteredEdges = edges.filter(({ from, to }) => {
    const fromModuleName = from.module.name.toLowerCase();
    const toModuleName = to.module.name.toLowerCase();
    const isExcluded = (name: string) =>
      excludedModule.some((excluded) => name.includes(excluded));
    return !isExcluded(fromModuleName) && !isExcluded(toModuleName);
  });

  const moduleNameBuilder = (moduleName: string) =>
    moduleName.replace('Module', '');

  const mermaidEdges = filteredEdges.map(({ from, to }) => {
    return `  ${moduleNameBuilder(from.module.name)}-->${moduleNameBuilder(to.module.name)}`;
  });

  const mermaidContent = `graph LR\n${mermaidEdges.join('\n')}\n`;

  try {
    await fs.writeFile(path.resolve(__dirname, fileName), mermaidContent);
    await updateReadme(fileName, configService);
  } catch (err) {
    console.error('Error writing to file: ' + err.message);
  }
}

async function updateReadme(
  fileName: string,
  configService: ConfigService<Config>,
): Promise<void> {
  const readmeFilePath = path.resolve('README.md');

  try {
    const config = configService.getOrThrow<Config['service']>('service');
    const mermaidContent = await fs.readFile(
      path.resolve(__dirname, fileName),
      'utf-8',
    );

    let readmeContent = await fs.readFile(readmeFilePath, 'utf-8');

    const moduleGraphStart = readmeContent.indexOf(
      `## Module Graph ${config.name}`,
    );
    const mermaidStart = readmeContent.indexOf('```mermaid', moduleGraphStart);
    const mermaidEnd = readmeContent.indexOf('```', mermaidStart + 9) + 3;

    if (moduleGraphStart !== -1 && mermaidStart !== -1 && mermaidEnd !== -1) {
      readmeContent =
        readmeContent.slice(0, mermaidStart) +
        '```mermaid\n' +
        mermaidContent +
        '```' +
        readmeContent.slice(mermaidEnd);
    } else {
      readmeContent += `\n## Module Graph ${config.name}\n\nThis section provides a visual representation of the module dependencies within the NestJS application. The graph is generated using Mermaid syntax and helps to understand how different modules in the application are interconnected.\n\n\`\`\`mermaid\n${mermaidContent}\`\`\`\n`;
    }

    await fs.writeFile(readmeFilePath, readmeContent);
    console.info('README.md updated successfully');
  } catch (err) {
    console.error('Error updating README.md: ' + err.message);
  }
}
