declare module 'express-cassandra' {
  namespace models {
    interface Document {
      saveAsync(options?: DataManagementOptions): Promise<void>;
      deleteAsync(options?: DataManagementOptions): Promise<void>;
    }

    function loadSchema<T extends Document>(
      name: string,
      schema: SchemaDefinition
    ): Model<T>;

    interface SchemaDefinition {
      fields: FieldsDefinition<any>;
      key: string[];
      indexes?: string[];
    }

    interface FieldsDefinition<T> {
      [path: string]: string | FieldDefinition<any>;
    }

    interface FieldDefinition<T> {
      type?: string;
      default?: any;
      virtual?: VirtualDefinition<T>;
      rule?: Rule<T>;
      typeDef?: string;
    }

    interface VirtualDefinition<T> {
      get?(): T;
      set?(value: T): void;
    }

    interface Validator<T> {
      message?: any;
      validator?(value: T): boolean;
    }

    interface Rule<T> extends Validator<T> {
      validators?: Validator<T>[];
      ignore_default?: boolean;
      required?: boolean;
    }

    namespace datatypes {
      type Uuid = Object;
      class LocalDate {
        public day: number;
        public month: number;
        public year: number;
        /**
         * Creates a new instance of LocalDate using the year, month and day
         * provided in the form: yyyy-mm-dd or days since epoch
         * (i.e. -1 for Dec 31, 1969).
         */
        public static fromString(value: string): LocalDate;
      }
    }

    function uuid(): datatypes.Uuid;

    function setDirectory(directory: string): typeof models;

    function createClient(options: ModelsOptions): typeof models;

    function bindAsync(options: ModelsOptions): Promise<void>;

    interface ModelsOptions {
      clientOptions: ClientOptions;
      ormOptions: OrmOptions;
    }

    interface ClientOptions {
      contactPoints: string[];
      protocolOptions: { port: number };
      keyspace: string;
      queryOptions: { consistency: number };
    }

    namespace consistencies {
      const one: number;
      const quorum: number;
    }

    interface OrmOptions {
      defaultReplicationStrategy: ReplicationStrategy;
      migration: string;
      udts?: { [path: string]: FieldsDefinition<any> };
      udfs?: { [path: string]: Udf };
      udas?: { [path: string]: Uda };
    }

    interface ReplicationStrategy {
      class: string;
      replication_factor: number;
    }

    interface Udf {
      language: string;
      code: string;
      returnType: string;
      inputs: FieldsDefinition<any>;
    }

    interface Uda {
      input_types: string[];
      sfunc: string;
      stype: string;
      finalfunc: string;
      initcond: string;
    }

    interface Model<T extends Document> {
      new(object?: any): T;
      syncDBAsync(): Promise<boolean>;
      findAsync(criteria: object, options?: QueryOptions): Promise<T[]>;
      findOneAsync(criteria: object, options?: QueryOptions): Promise<T>;
      updateAsync(
        criteria: object,
        update: object,
        options?: DataManagementOptions
      ): Promise<void>;
      deleteAsync(
        criteria: object,
        options?: DataManagementOptions
      ): Promise<void>;
      truncateAsync(): Promise<void>;
    }

    interface QueryOptions {
      raw?: boolean;
      select?: string[];
      distinct?: boolean;
      allow_filtering?: boolean;
    }

    interface DataManagementOptions {
      if_not_exist?: boolean;
      ttl?: number;
      if_exists?: boolean;
      conditions?: object;
    }

    let instance: {
      [dataSet: string]: Model<Document>;
    };
  }

  export = models;
}
