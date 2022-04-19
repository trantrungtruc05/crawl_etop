import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "etopfun_item_dota_page",
})
export class EtopItemDotaPage extends Model {

    @Column({
        autoIncrement: true,
        primaryKey: true,
        type: DataType.BIGINT
      })
    id!: number;

    @Column({ type: DataType.DATE, allowNull: true, field: "create_at"})
    createAt: Date;

    @Column({ type: DataType.STRING, allowNull: true})
    name: string;

    @Column({type: DataType.DOUBLE, allowNull: true, field: "original_price"})
    originalPrice: number;

    @Column({ type: DataType.BIGINT, allowNull: true, field: "price_by_vnd"})
    priceByVnd: number;

    @Column({ type: DataType.STRING, allowNull: true})
    category: string;
    
    @Column({ type: DataType.INTEGER, allowNull: true, field: "id_item"})
    idItem: number;

    @Column({ type: DataType.INTEGER, allowNull: true})
    quantity: number;


}