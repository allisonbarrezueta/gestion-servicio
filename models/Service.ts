import { Model } from "@tailflow/laravel-orion/lib/model";
import { BelongsTo } from "@tailflow/laravel-orion/lib/drivers/default/relations/belongsTo";
import { ServiceType } from "./../types";
import Category from "./Category";

export default class Service extends Model<ServiceType, {}, { category: Category }> {
    public $resource(): string {
        return "services";
    }

    public category(): BelongsTo<Category> {
        return new BelongsTo(Category, this);
    }
}
