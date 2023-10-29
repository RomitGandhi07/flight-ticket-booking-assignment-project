
import mysql, { Connection, FieldPacket, ResultSetHeader } from 'mysql2/promise';
import { Tables } from '../enums/tables.enum';

export let databaseManager: DatabaseManager;

export class DatabaseManager {
    private _connection: Connection | null;
    private dbName: string;

    constructor(dbName: string) {
        this.dbName = dbName;
        this._connection = null;
    }

    async connectDatabse() {
        this._connection = await mysql.createConnection({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: this.dbName,
            password: process.env.DB_PASS,
            port: +`${process.env.DB_PORT}`,
        });
    }

    get connection() {
        if(!this._connection) {
            throw new Error("Cannot access database before connecting");
        }
        return this._connection;
    }

    async connect() {
        try {
            // Create database if it doesn't exist then connect
            // await this.createDatabaseIfNotExists();

            await this.connectDatabse();

            // Add UUID extension
            // await this.addExtensionIfNotExists();
            console.info('Connected to MySQL');
        } catch (error) {
            console.error('Error connecting to MySQL:', error);
        }
    }

    async disconnect() {
        try {
            await this.connection.end();
            console.info('Disconnected from PostgreSQL');
        } catch (error) {
            console.error('Error disconnecting from PostgreSQL:', error);
        }
    }

    // This function will create a new database if is not exists.
    // async createDatabaseIfNotExists(): Promise<void> {
    //     const client = new Client({
    //         user: process.env.DB_USER,
    //         host: process.env.DB_HOST,
    //         database: 'postgres', // Connect to the default 'postgres' database
    //         password: process.env.DB_PASS,
    //         port: +`${process.env.DB_PORT}`,
    //     });

    //     try {
    //         await client.connect();
    //         const res = await client.query(
    //             `SELECT 1 FROM pg_database WHERE datname = $1`,
    //             [this.databaseName]
    //         );

    //         if (!res.rows.length) {
    //             await client.query(`CREATE DATABASE ${this.databaseName}`);
    //             console.info(`Database created successfully.`);
    //         } else {
    //             console.info(`Database already exists.`);
    //         }
    //     } catch (error) {
    //         console.error('Error creating database:', error);
    //     } finally {
    //         client.end();
    //     }
    // }

    // Ensure that the extension "uuid-ossp" is installed in your database.
    // async addExtensionIfNotExists() {
    //     try {
    //         await this.pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    //     } catch (err) {
    //         console.error('Error creating EXTENSION:', err);
    //         throw err; // Re-throw the error to propagate it to the calling function.
    //     }
    // }

    async createTable(tableName: string, sqlQuery: string) {
        try {
            await this.connection.query(sqlQuery);
        } catch (err) {
            console.error('Error creating table:', tableName, err);
            throw err; // Re-throw the error to propagate it to the calling function.
        }
    }

    async queryTable({query, values = []}: { query: string, values?: Array<any>}) {
        try {
            const result = await this.connection.query(query, values);
            return result.length ? result[0] : [];
        } catch (err) {
            console.error('Error performing query:', query, values, err);
            throw err; // Re-throw the error to propagate it to the calling function.
        }
    }

    async singleRecordQueryTable({query, values = []}: { query: string, values?: Array<any>}) {
        try {
            const result = await this.connection.query(query, values);
            const data: any = result.length ? result[0] : [];
            if(data.length) {
                return data[0];
            }
            return null;
        } catch (err) {
            console.error('Error performing query:', query, values, err);
            throw err; // Re-throw the error to propagate it to the calling function.
        }
    }

    async insertRecordIntoTable({tableName, data, returnRecords = true}: {
        tableName: string, data: Record<string, any>, returnRecords?: boolean
    }) {
        try {
            const columns = Object.keys(data).join(', ');
            const values = Object.values(data).map((value) => value);

            const sqlQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${values
            .map((_, i) => '?')
            .join(', ')})${returnRecords ? "": ""};`;

            const result: [ResultSetHeader, FieldPacket[]] = await this.connection.query(sqlQuery, values);


            if(!result[0] || !result[0].affectedRows) {
                throw new Error("Something went wrong while inserting...");
            }
            // // If any row has been inserted then continue
            // if(result.rowCount) {
            //     // If we need to return id then return it otherwise return the rowCount means how many rows inserted
            //     if(returnRecords && result.rows.length) {
            //         return result.rows[0];
            //     }
            //     else {
            //         return result.rowCount;`
            //     }
            // }

            // throw new InternalServerError();
            return result;
        } catch (err) {
            console.error('Error inserting record into table:', tableName, err);
            throw err; // Re-throw the error to propagate it to the calling function.
        }
    }

    async insertMultipleRecordIntoTable(
        {tableName, data, returnRecords = true}: { tableName: string, data: Record<string, any>[], returnRecords?: boolean }
    ) {
        try {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Input records should be a non-empty array.');
            }

            const columns = Object.keys(data[0]).join(', ');

            const values = data.map((record) => Object.values(record));

            const placeholders = values
                .map(
                    (_, i) =>
                        '(' +
                        values[i]
                            .map((_, j) => '$' + (i * Object.keys(data[0]).length + j + 1))
                            .join(', ') +
                        ')'
                )
                .join(', ');

            const insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES ${placeholders}${returnRecords ? " RETURNING *": ""}`;

            const flatValues = values.flat(); // Flatten the array of arrays

            const result = await this.connection.query(insertQuery, flatValues);

            // If any row has been inserted then continue
            // if(result.rowCount) {
            //     // If we need to return id then return it otherwise return the rowCount means how many rows inserted
            //     if(returnRecords && result.rows.length) {
            //         return result.rows;
            //     }
            //     else {
            //         return result.rowCount;
            //     }
            // }

            // throw new InternalServerError();
            return result;
        } catch (err) {
            console.error(
                'Error inserting multiple records into table:',
                tableName,
                err
            );
            throw err; // Re-throw the error to propagate it to the calling function.
        }
    }

    async updateRecordFromTable({tableName, record, whereCondition = null, returnRecords = true}: {
        tableName: Tables,
        record: Record<string, any>,
        whereCondition?: {
            condition: string,
            values: Array<any>
        } | null,
        returnRecords?: boolean
    }) {
        try {
            // Check whether record object if of specific type or not
            if (!record || typeof record !== 'object' || Array.isArray(record)) {
                throw new Error('Input record should be a non-null object.');
            }

            const columns = Object.keys(record);
            const values = Object.values(record).map((value) => value);

            let updateQuery = `UPDATE ${tableName} SET `;
            for (let i = 0; i < columns.length; i++) {
                updateQuery += `${columns[i]} = ?`;
                if (i !== columns.length - 1) {
                    updateQuery += ', ';
                }
            }

            if (whereCondition) {
                updateQuery += ` WHERE ${whereCondition.condition}`;
            }
            // if(returnRecords) {
            //     updateQuery += `RETURNING *`;
            // }

            const result: [ResultSetHeader, FieldPacket[]] = await this.connection.query(updateQuery, [...values, ...(whereCondition?.values ?? [])]);

            if(!result[0] || !result[0].affectedRows) {
                throw new Error("Something went wrong while updating...");
            }
            // If any row has been inserted then continue
            // if(result.rowCount) {
            //     // If we need to return id then return it otherwise return the rowCount means how many rows updated
            //     if(returnRecords && result.rows.length) {
            //         return result.rows;
            //     }
            //     else {
            //         return result.rowCount;
            //     }
            // }

            // throw new InternalServerError();
            return result;
        } catch (err) {
            console.error('Error updating record in table:', tableName, err);
            throw err; // Re-throw the error to propagate it to the calling function.
        }
    }

    async deleteRecordFromTable({tableName, whereCondition, returnRecords = true}: {tableName: Tables, whereCondition: {
        condition: string,
        values: Array<any>
    }, returnRecords?: boolean}) {
        try {
            const deleteQuery = `DELETE FROM ${tableName} WHERE ${whereCondition.condition}${returnRecords ? "": ""}`;
            const result: [ResultSetHeader, FieldPacket[]]  = await this.connection.query(deleteQuery, whereCondition.values);

            if(!result[0] || !result[0].affectedRows) {
                throw new Error("Something went wrong while deleting...");
            }
            // // If any row has been inserted then continue
            // if(result.rowCount) {
            //     // If we need to return id then return it otherwise return the rowCount means how many rows updated
            //     if(returnRecords && result.rows.length) {
            //         return result.rows;
            //     }
            //     else {
            //         return result.rowCount;
            //     }
            // }

            // throw new InternalServerError();
            return result;
        } catch (err) {
            console.error('Error deleting record from table:', tableName, err);
            throw err; // Re-throw the error to propagate it to the calling function.
        }
    }
}

export const connectDatabase = async (dbName: string) => {
    // Create object of Database Manager and connect to DB then save it into databaseManager for using that connection in the package whenever needed and returning the object for the usage in the service
    const databaseManagerObj =  new DatabaseManager(dbName);
    await databaseManagerObj.connect();
    databaseManager = databaseManagerObj;
    return databaseManagerObj;
}
