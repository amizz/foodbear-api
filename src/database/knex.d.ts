import { Knex as KnexOriginal } from 'knex';

declare module 'knex' {
  namespace Knex {
    interface QueryBuilder {
      dynamicSelect<TRecord, TResult>(colQuery: string, tableCol: string[]): KnexOriginal.QueryBuilder<TRecord, TResult>;
      dynamicWhere<TRecord, TResult>(filterQuery: string, tableCol: string[]): KnexOriginal.QueryBuilder<TRecord, TResult>;
      dynamicSort<TRecord, TResult>(sortQuery: string, tableCol: string[]): KnexOriginal.QueryBuilder<TRecord, TResult>;
      dynamicJoin<TRecord, TResult>(joinQuery: string, allowTable?: string[]): KnexOriginal.QueryBuilder<TRecord, TResult>;
    }
  }
}