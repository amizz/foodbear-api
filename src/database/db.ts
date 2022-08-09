import knex, { Knex } from 'knex';
import { cvo, operationList, sortToObj, validateColByArray, validateColByQueryString, validateColOp } from '../utils/filter-db';
import * as knexfile from './knexfile';

knex.QueryBuilder.extend('dynamicSelect', function (colQuery: string, tableCol: string[]) {
    this.select(colQuery ? (validateColByQueryString(colQuery, tableCol) ? colQuery.split(',') : tableCol) : tableCol)

    return this;
});

knex.QueryBuilder.extend('dynamicWhere', function (filterQuery: string, tableCol: string[]) {
    if (filterQuery) {
        const filterProcess = cvo(filterQuery);
        if (validateColOp(filterProcess, tableCol)) {
            for (let i = 0; i < filterProcess.length; i++) {
                const el = filterProcess[i];
                this.where(el.column, operationList[el.operation], el.value);
            }
        }
    }

    return this;
});

knex.QueryBuilder.extend('dynamicSort', function (sortQuery: string, tableCol: string[]) {
    if (sortQuery) {
        const sortObj = sortToObj(sortQuery);
        const sortCol: Array < string > = sortObj.map(x => x.column);

        if (validateColByArray(sortCol, tableCol)) {
            for (let i = 0; i < sortObj.length; i++) {
                const el = sortObj[i];
                this.orderBy(el.column, el.order);
            }
        }
    }
    return this;
});

knex.QueryBuilder.extend('dynamicJoin', function (joinQuery: string, allowTable: string[] = []) {
    if(joinQuery) {
        let joinSplit = joinQuery.split(',');

        for (let i = 0; i < joinSplit.length; i++) {
            const el: string = joinSplit[i];
            let table = el.split('-')[0].split(':')[0];
            let fromTable = el.split('-')[1].split(':')[0];
            let refTableKey = el.split('-')[0].split(':')[1];
            let refFromKey = el.split('-')[1].split(':')[1];
            
            if(allowTable.findIndex((val) => val === table) === -1 && allowTable.length != 0) {
                throw { httpStatus: 400, code: 'YFCAA2PE', message: `Table not allowed to join. Only table (${allowTable}) allowed.` }
            }

            this.select([
                    this.client.raw(`coalesce(:table:.json_data, '[]'::json) as :table:`, {
                        table
                    })
                ])
                .joinRaw(`left join (
                    select 
                    :table:.:refTableKey:,
                    json_agg(:table:.*) as json_data
                    from :table:
                    group by :table:.:refTableKey:
                ) :table: on :table:.:refTableKey: = :fromTable:.:refFromKey:`, {
                    table,
                    fromTable,
                    refTableKey,
                    refFromKey
                });
        }
    }

    return this;
});

export default knex(knexfile[process.env.NODE_ENV || 'development']);