export interface Filter {
  column: string
  operation: string
  value: string
}

export const operationList = {'eq': '=', 'lt': '>', 'st': '<', 'lte': '>=', 'ste': '<=', 'like': 'like', 'ilike': 'ilike'}

export function cvo(params:string) {
  let arr = params.split(',');
  let filterObj: Array<Filter> = []

  for (let i = 0; i < arr.length; i++) {
    const el: string = arr[i];
    const column = el.split(':')[0].split('-')[0];
    const value = el.split(':')[1];
    const operation = el.split(':')[0].split('-')[1];
    if(column && value && operation) {
      filterObj.push({ column, operation, value });
    }
  }

  return filterObj;
}

export function sortToObj(params:string) {
  let arr = params.split(',');
  let sortObj: Array<{ column: string, order: string }> = []

  for (let i = 0; i < arr.length; i++) {
    const el: string = arr[i];
    const column = el.split(':')[0].split('-')[0];
    const order = el.split(':')[1];
    if(column && order) {
      sortObj.push({ column, order });
    }
  }

  return sortObj;
}


export function validateColOp(filterObj: Array<Filter>, column: Array<string>) {
  for (let i = 0; i < filterObj.length; i++) {
    const el: Filter = filterObj[i];
    if(!(el.operation in operationList)) { 
      throw { httpCode: 400, message: "Invalid operation." } 
    };
    if(column.findIndex((val) => val == el.column) == -1) { 
      throw { httpCode: 400, code: '9T39FA99', message: `Invalid column "${el.column}".`, }
    };
  }

  return true;
}

export function validateColByQueryString(colQuery: string, colTable: Array<string>) {
  let filterObj = colQuery.split(',');
  for (let i = 0; i < filterObj.length; i++) {
    if(colTable.findIndex((val) => val == filterObj[i]) == -1) { 
      throw { httpCode: 400, code: 'DE8BDP8Q', message: `Invalid column "${filterObj[i]}".` } 
    };
  }

  return true;
}

export function validateColByArray(colQuery: Array<string>, colTable: Array<string>) {
  for (let i = 0; i < colQuery.length; i++) {
    if(colTable.findIndex((val) => val == colQuery[i]) == -1) { 
      throw { httpCode: 400, code: 'YGX17YCX', message: `Invalid column "${colQuery[i]}".` } 
    };
  }

  return true;
}