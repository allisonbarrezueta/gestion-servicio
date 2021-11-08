import { Model } from "@tailflow/laravel-orion/lib/model";
import { CategoryType } from "./../types";

export default class Category extends Model<CategoryType> {
    public $resource(): string {
        return "categories";
    }
}
