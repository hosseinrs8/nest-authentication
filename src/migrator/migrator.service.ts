import { Injectable, OnModuleInit } from '@nestjs/common';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';

@Injectable()
export class MigratorService implements OnModuleInit {
  isReady = false;

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.init();
    this.isReady = true;
  }

  @UseRequestContext()
  async init() {
    try {
      const generator = this.orm.getSchemaGenerator();
      await generator.generate();
      await generator.updateSchema();
    } catch (e) {
      throw e;
    }
    return true;
  }

  @UseRequestContext()
  async create() {
    try {
      const migrator = this.orm.getMigrator();
      await migrator.createMigration();
    } catch (e) {
      throw e;
    }
    return true;
  }

  @UseRequestContext()
  async createInitial() {
    try {
      const migrator = this.orm.getMigrator();
      await migrator.createInitialMigration();
    } catch (e) {
      throw e;
    }
    return true;
  }

  @UseRequestContext()
  async up() {
    try {
      const migrator = this.orm.getMigrator();
      await migrator.up();
    } catch (e) {
      throw e;
    }
    return true;
  }

  @UseRequestContext()
  async down() {
    try {
      const migrator = this.orm.getMigrator();
      await migrator.down();
    } catch (e) {
      throw e;
    }
    return true;
  }
}
