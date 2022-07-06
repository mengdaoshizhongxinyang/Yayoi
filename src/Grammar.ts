import { toLower } from "lodash";
import { Expression } from "./query/Expression";
export abstract class Grammar {


    protected tablePrefix = ""

    wrapArray(values: string[]) {
        return values.map(wrap => {
            this.wrap(wrap)
        })
    }

    wrap(value: string | Expression, prefixAlias: boolean = false) {
        if (this.isExpression(value)) {
            return this.getValue(value)
        }
        if (toLower(value).indexOf(' as ') > -1) {
            return this.wrapAliasedValue(value, prefixAlias)
        }
        return this.wrapSegments(value.split('.'))
    }
    

    wrapTable(table: Expression | string) {
        if (!this.isExpression(table)) {
            return this.wrap(this.tablePrefix + table)
        }

        return this.getValue(table);
    }

    protected wrapAliasedValue(value: string, prefixAlias: boolean): string {
        const segments = value.split(/\s+as\s+/i)

        if (prefixAlias) {
            segments[1] = this.tablePrefix[1]
        }

        return this.wrap(segments[0]) + ' as '
    }

    protected wrapSegments(segments: string[]): string {
        return segments.map((segment, key) => {
            return (key == 0 && segments.length > 1) ? this.wrapTable(segment) : this.wrap(segment)
        }).join('.')
    }
    wrapValue(value: string) {
        if (value !== "*") {
            return `"${value.replace('"', '""')}"`
        }
        return value
    }

    getValue(expression: Expression) {
        return expression.toString()
    }

    isExpression(value: any): value is Expression {
        return value instanceof Expression;
    }

    columnize(columns: string[]) {
        return columns.map(column => {
            return this.wrap(column)
        }).join(', ')
    }

    parameterize(values: any) {
        return this.isExpression(values) ? this.getValue(values) : '?'
    }

    getDateFormat() {
        return 'YYYY-MM-DD HH:mm:ss'
    }

    getTablePrefix() {
        return this.tablePrefix
    }

    setTablePrefix(prefix: string) {
        this.tablePrefix = prefix
        return this
    }
}
