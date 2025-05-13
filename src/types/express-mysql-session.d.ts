declare module 'express-mysql-session' {
  import type { Store } from 'express-session';
  import type { ConnectionOptions } from 'mysql2';

  interface MySQLStoreOptions extends ConnectionOptions {
    createDatabaseTable?: boolean;
    schema?: {
      tableName?: string;
      columnNames?: {
        session_id: string;
        expires: string;
        data: string;
      };
    };
  }

  function MySQLStore(session: any): {
    new(options?: MySQLStoreOptions): Store;
  };

  export = MySQLStore;
} 