import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateOrderProducts1597660036456 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'orders_products',
                columns: [
                    {name: 'id', type: 'uuid', isPrimary:true, generationStrategy: 'uuid', default:'uuid_generate_v4()'},
                    {name: 'product_id', type: 'uuid', isNullable:false},
                    {name: 'order_id', type: 'uuid', isNullable:false},
                    {name: 'price', type: 'decimal(5,2)', isNullable:false},
                    {name: 'quantity', type: 'integer', isNullable:false},                    
                    {name: 'created_at', type: 'timestamp', default:'now()'},
                    {name: 'updated_at', type: 'timestamp', default:'now()'}
                ]
            })
        );
        await queryRunner.createForeignKey(
            'orders_products', 
            new TableForeignKey({
                name:'fk_product',
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'products',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        );

        await queryRunner.createForeignKey(
            'orders_products', 
            new TableForeignKey({
                name:'fk_order',
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'orders',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('orders_products','fk_order');
        await queryRunner.dropForeignKey('orders_products','fk_product');        
        await queryRunner.dropTable('orders_products');
    }

}
