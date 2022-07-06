import { isNull } from "lodash";
import { ObjectHelp } from "../help/object";
import { merge } from "lodash";
import qs  from "qs";
export class ConfigurationUrlParser {
  protected static driverAliases = {
    'mssql': 'sqlsrv',
    'mysql2': 'mysql',
    'postgres': 'pgsql',
    'postgresql': 'pgsql',
    'sqlite3': 'sqlite',
    'redis': 'tcp',
    'rediss': 'tls'
  }
  constructor() { }
  public parseConfiguration(config: Record<string, any> | string) {
    if (typeof config == 'string') {
      config = { url: config }
    }
    let url = ObjectHelp.pull(config, 'url');

    if (!url) {
      return config;
    }

    let rawComponents = this.parseUrl(url);
    let decodedComponents = this.parseStringsToNativeTypes(
      Object.fromEntries(Object.entries(rawComponents).map(([key, value]) => {
        return [key, encodeURI(value)]
      }))
    );

    return merge(
      config,
      this.getPrimaryOptions(decodedComponents),
      this.getQueryOptions(rawComponents)
    );
  }

  protected getPrimaryOptions(url: Record<string,any>) {
    return Object.fromEntries([
      ['driver', this.getDriver(url)],
      ['database', this.getDataBase(url)],
      ['host',url['host']||null],
      ['username',url['user']||null],
      ['password',url['pass']||null]
    ].filter(([key, value]) => {
      return !isNull(value)
    }))
  }

  protected getDriver(url: Record<string, any>) {
    const alias = url['scheme'] || null;

    if (!alias) {
      return;
    }

    return ConfigurationUrlParser.driverAliases[alias as keyof typeof ConfigurationUrlParser.driverAliases] || alias;
  }

  protected getDataBase(url:Record<string,any>) {
    const path:(string|null)=url['path']||null
    return path && path!=='/'?path.substring(1):null
  }

  protected parseStringsToNativeTypes(value: string | object[] | object) {
    if (value instanceof Array) {
      return value.map(val => {
        this.parseStringsToNativeTypes(val)
      })
    }

    if (typeof value != 'string') {
      return value
    }
    try {
      let parsedValue = JSON.parse(value)
      return parsedValue
    } catch (e) {
      return value
    }

  }

  protected parseUrl(url: string) {
    url = url.replace(/#^(sqlite3?):\/\/\/#/, '$1://null/')

    let parsedUrl: null | URL
    try {
      parsedUrl = new URL(url)
    } catch (e) {
      parsedUrl = null
    }
    if (isNull(parsedUrl)) {
      throw new Error('The database configuration URL is malformed.')
    }

    return parsedUrl


  }

  protected getQueryOptions(url:Record<string,any>)
    {
        const queryString = url['query'] || null;

        if (!queryString) {
            return {};
        }

        let query = qs.parse(queryString);

        return this.parseStringsToNativeTypes(query);
    }
}